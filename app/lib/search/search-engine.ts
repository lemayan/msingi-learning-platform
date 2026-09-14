import 'server-only'
import { generateText, tool, isStepCount } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'
import { executeGroqViaMcp, getInitialContext } from './mcp-client'
import { LESSONS_BY_IDS_QUERY } from '@/sanity/lib/queries'
import { serverClient } from '@/sanity/lib/serverClient'
import {
  SearchRequest,
  SearchResponse,
  SearchResponseSchema,
  VideoResult,
  LessonResult,
  SearchResultCard,
  ModelSearchOutputSchema,
  ModelSearchOutput,
} from './types'

const MAX_STEPS = 6

export function formatSeconds(secs: number): string {
  const totalSeconds = Math.max(0, Math.floor(secs))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export function formatClipDuration(secs: number): string {
  const total = Math.max(0, Math.floor(secs))
  const m = Math.floor(total / 60)
  const s = total % 60
  if (m > 0 && s > 0) return `${m}m ${s}s`
  if (m > 0) return `${m}m`
  return `${s}s`
}

interface RawHydratedLesson {
  _id: string
  title: string
  slug: string
  duration?: number
  freePreview?: boolean
  studentCount?: number
  keyPoints?: string[]
  thumbnail?: {
    asset?: {
      _id: string
      url: string
    }
  }
  videoUrl?: string
  _createdAt?: string
  course?: {
    _id: string
    title: string
    slug: string
    coverImage?: {
      asset?: {
        _id: string
        url: string
      }
    }
    modules?: Array<{
      _key: string
      title: string
      lessons?: Array<{
        _id: string
        slug?: string
        title?: string
        duration?: number
      }>
    }>
  }
}

function deriveModuleAndLessonIndex(
  course: RawHydratedLesson['course'] | undefined,
  lessonId: string,
  lessonSlug: string
): { moduleIndex: number; lessonIndex: number; moduleTitle: string } {
  let moduleIndex = 1
  let lessonIndex = 1
  let moduleTitle = 'General'

  if (course?.modules && course.modules.length > 0) {
    for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
      const mod = course.modules[mIdx]
      if (mod.lessons && mod.lessons.length > 0) {
        const lIdx = mod.lessons.findIndex(
          (l) => l._id === lessonId || l.slug === lessonSlug
        )
        if (lIdx !== -1) {
          moduleIndex = mIdx + 1
          lessonIndex = lIdx + 1
          moduleTitle = mod.title || `Module ${moduleIndex}`
          break
        }
      }
    }
  }

  return { moduleIndex, lessonIndex, moduleTitle }
}

/**
 * Builds the system prompt injecting cached /initial-context and domain search rules.
 */
function buildSearchSystemPrompt(initialContext: string | null): string {
  return `You are the msingi intelligent search agent. Your job is to return relevant, grounded learning results for learner queries.

# Initial Context & Schema Reference
${initialContext || 'Schema types: course, module, lesson, videoDoc, category, instructor.'}

# Query & Search Rules:
1. Grounding: Return ONLY real documents found in Sanity. Never hallucinate IDs, titles, or timestamps.
2. GROQ Matching (AND vs OR condition):
   - In GROQ, matching against an array like \`field match ["a", "b"]\` evaluates as an AND condition (both words must be present).
   - To match any keyword (OR semantics), write explicit OR disjunction clauses:
     \`(title match "*a*" || title match "*b*")\` or \`(pt::text(notes) match "*a*" || pt::text(notes) match "*b*")\` or \`(chapters[].label match "*a*" || chapters[].label match "*b*")\`.
     This expands query results across relevant courses (e.g. from 2 to 11 across 4 courses).
3. Two-Stage Timestamps:
   - Stage 1: Match chapters (the table of contents) first in videoDoc for clean moment titles and exact startSeconds.
   - Stage 2: Fall back to matching transcript chunks only if no chapter matches.
4. Structural Grounding:
   - You must strictly return ONLY lesson _id strings and video moments. Do not attempt to fabricate full card data.
   - The application server will hydrate all authoritative card fields directly from Sanity via LESSONS_BY_IDS_QUERY.
5. Final Action:
   - After querying via groq_query, you MUST call the submit_search_results tool with the final list of lessonIds and videoMoments.`
}

/**
 * Deterministic fallback to find matching lesson IDs and video moments using GROQ disjunction.
 * Used when OpenAI API quota is unavailable or as direct resolver.
 */
async function fallbackGroundedResolution(words: string[], fullPhrase: string): Promise<ModelSearchOutput> {
  const lessonOrClauses = words.map(w =>
    `title match "*${w}*" || pt::text(notes) match "*${w}*" || keyPoints match "*${w}*"`
  ).join(' || ')

  const videoOrClauses = words.map(w =>
    `chapters[].label match "*${w}*" || chunks[].text match "*${w}*"`
  ).join(' || ')

  const [matchedLessons, matchedVideos] = await Promise.all([
    executeGroqViaMcp<Array<{ _id: string }>>(
      `*[_type == "lesson" && (${lessonOrClauses})][0...20] { _id }`
    ),
    executeGroqViaMcp<Array<{
      _id: string
      url: string
      chapters?: Array<{ startSeconds: number; label: string }>
      chunks?: Array<{ startSeconds: number; text: string }>
      lesson?: { _id: string; title: string; duration?: number }
    }>>(
      `*[_type == "videoDoc" && (${videoOrClauses})][0...20] {
        _id,
        url,
        chapters,
        chunks,
        "lesson": *[_type == "lesson" && videoUrl == ^.url][0] { _id, title, duration }
      }`
    ),
  ])

  const lessonIds = (Array.isArray(matchedLessons) ? matchedLessons : []).map(l => l._id)
  const videoMoments: ModelSearchOutput['videoMoments'] = []

  if (Array.isArray(matchedVideos)) {
    for (const doc of matchedVideos) {
      if (!doc.lesson?._id) continue
      const lesson = doc.lesson

      // Two-stage timestamp resolution: chapters first, chunks fallback
      let matchedChapter: { startSeconds: number; label: string } | null = null
      if (doc.chapters && doc.chapters.length > 0) {
        for (const ch of doc.chapters) {
          const lbl = (ch.label || '').toLowerCase()
          if (lbl.includes(fullPhrase) || words.some(w => lbl.includes(w))) {
            matchedChapter = ch
            break
          }
        }
      }

      let matchedChunk: { startSeconds: number; text: string } | null = null
      if (!matchedChapter && doc.chunks && doc.chunks.length > 0) {
        for (const ck of doc.chunks) {
          const txt = (ck.text || '').toLowerCase()
          if (txt.includes(fullPhrase) || words.some(w => txt.includes(w))) {
            matchedChunk = ck
            break
          }
        }
      }

      const timestampSeconds = matchedChapter
        ? matchedChapter.startSeconds
        : (matchedChunk?.startSeconds || doc.chapters?.[0]?.startSeconds || 0)

      const chapterLabel = matchedChapter
        ? matchedChapter.label
        : (matchedChunk?.text ? matchedChunk.text.slice(0, 100) : lesson.title)

      let clipDurationSeconds: number | null = 120
      if (matchedChapter && doc.chapters) {
        const idx = doc.chapters.findIndex(c => c.startSeconds === matchedChapter!.startSeconds)
        if (idx !== -1 && idx + 1 < doc.chapters.length) {
          clipDurationSeconds = doc.chapters[idx + 1].startSeconds - matchedChapter.startSeconds
        } else if (lesson.duration) {
          clipDurationSeconds = Math.max(30, lesson.duration * 60 - timestampSeconds)
        }
      }

      videoMoments.push({
        lessonId: lesson._id,
        timestampSeconds,
        chapterLabel,
        clipDurationSeconds,
      })
    }
  }

  return {
    lessonIds,
    videoMoments,
  }
}

/**
 * Main search entrypoint.
 * 1. Runs an active MCP tool-calling loop with OpenAI provider (maxSteps: 6, reasoningEffort: low).
 * 2. Injects cached /initial-context into the system prompt.
 * 3. Enforces structural grounding: model returns only lesson _ids and video moments.
 * 4. Hydrates all displayed fields directly from Sanity via LESSONS_BY_IDS_QUERY.
 * 5. Derives Lesson 5.1 in <Module> from course modules array order.
 * 6. Returns Zod-validated SearchResponse payload.
 */
export async function executeSearch(req: SearchRequest): Promise<SearchResponse> {
  const { query, sort = 'relevance' } = req

  const sanitized = query.replace(/[^\w\s-]/g, ' ').trim()
  const rawWords = sanitized.split(/\s+/).filter((w) => w.length > 0)

  if (rawWords.length === 0) {
    return {
      query,
      totalCount: 0,
      courseCount: 0,
      videoResults: [],
      lessonResults: [],
      results: [],
    }
  }

  const lowerWords = rawWords.map((w) => w.toLowerCase())
  const fullPhrase = lowerWords.join(' ')

  let modelOutput: ModelSearchOutput | null = null

  // 1. Attempt LLM tool-calling loop over Sanity Context MCP (Google Gemini priority, OpenAI secondary)
  const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
  const openaiApiKey = process.env.OPENAI_API_KEY || process.env.OPEN_API_KEY

  if (googleApiKey || openaiApiKey) {
    try {
      const model: Parameters<typeof generateText>[0]['model'] = googleApiKey
        ? createGoogleGenerativeAI({ apiKey: googleApiKey })('gemini-3.7-flash')
        : createOpenAI({ apiKey: openaiApiKey || '' })('o3-mini')

      const providerOptions: Parameters<typeof generateText>[0]['providerOptions'] = googleApiKey
        ? undefined
        : { openai: { reasoningEffort: 'low' } }

      const initialContext = await getInitialContext()
      const systemPrompt = buildSearchSystemPrompt(initialContext)

      let capturedResults: ModelSearchOutput | null = null

      await generateText({
        model,
        providerOptions,
        system: systemPrompt,
        prompt: `Learner query: "${query}". Search the Sanity dataset using groq_query with OR disjunctions, then call submit_search_results.`,
        stopWhen: isStepCount(MAX_STEPS),
        maxRetries: 0,
        tools: {
          groq_query: tool({
            description: 'Execute a GROQ query against the Sanity dataset to search courses, lessons, and videoDocs.',
            inputSchema: z.object({
              query: z.string().describe('The GROQ query to execute'),
            }),
            execute: async ({ query: groqQuery }: { query: string }) => {
              return await executeGroqViaMcp(groqQuery)
            },
          }),
          submit_search_results: tool({
            description: 'Submit the final grounded search results consisting strictly of matching lesson _ids and video moment timestamps.',
            inputSchema: ModelSearchOutputSchema,
            execute: async (args: ModelSearchOutput) => {
              capturedResults = args
              return { success: true }
            },
          }),
        },
      })

      if (capturedResults) {
        modelOutput = capturedResults
      }
    } catch (err) {
      console.warn('[Search Engine] LLM tool loop encountered an error, using structural fallback:', err)
    }
  }

  // 2. Fallback to deterministic structural GROQ resolution if model was unavailable or quota exceeded
  let finalOutput: ModelSearchOutput
  const resolved = modelOutput as ModelSearchOutput | null
  if (resolved && (resolved.lessonIds.length > 0 || resolved.videoMoments.length > 0)) {
    finalOutput = resolved
  } else {
    finalOutput = await fallbackGroundedResolution(lowerWords, fullPhrase)
  }

  // 3. Structural Grounding: Fetch authoritative data for returned lesson IDs via LESSONS_BY_IDS_QUERY
  const allIds = Array.from(new Set([
    ...finalOutput.lessonIds,
    ...finalOutput.videoMoments.map((vm) => vm.lessonId),
  ]))

  if (allIds.length === 0) {
    return {
      query,
      totalCount: 0,
      courseCount: 0,
      videoResults: [],
      lessonResults: [],
      results: [],
    }
  }

  const rawLessons = await serverClient.fetch<RawHydratedLesson[]>(
    LESSONS_BY_IDS_QUERY,
    { ids: allIds }
  )

  const lessonMap = new Map<string, RawHydratedLesson>()
  for (const l of rawLessons) {
    lessonMap.set(l._id, l)
  }

  // 4. Construct grounded Video Results
  const videoResults: VideoResult[] = []
  const seenVideoIds = new Set<string>()

  for (const moment of finalOutput.videoMoments) {
    const lesson = lessonMap.get(moment.lessonId)
    if (!lesson || !lesson.course) continue

    const course = lesson.course
    const { moduleIndex, lessonIndex, moduleTitle } = deriveModuleAndLessonIndex(
      course,
      lesson._id,
      lesson.slug
    )

    const moduleLessonLabel = `Lesson ${moduleIndex}.${lessonIndex} in ${moduleTitle}`
    const resultId = `${lesson._id}-${moment.timestampSeconds}`

    if (seenVideoIds.has(resultId)) continue
    seenVideoIds.add(resultId)

    const clipDuration = moment.clipDurationSeconds || 120
    const description = moment.chapterLabel || lesson.title

    let score = 50
    const lowerTitle = lesson.title.toLowerCase()
    if (lowerTitle.includes(fullPhrase)) score += 50
    else if (lowerWords.some((w) => lowerTitle.includes(w))) score += 25
    if (description.toLowerCase().includes(fullPhrase)) score += 25

    const href = `/courses/${course.slug}/lessons/${lesson.slug}?start=${moment.timestampSeconds}`

    videoResults.push({
      id: resultId,
      lessonTitle: lesson.title,
      lessonSlug: lesson.slug,
      courseTitle: course.title,
      courseSlug: course.slug,
      href,
      courseCoverUrl: course.coverImage?.asset?.url || null,
      moduleTitle,
      moduleIndex,
      lessonIndex,
      moduleLessonLabel,
      thumbnailUrl: lesson.thumbnail?.asset?.url || course.coverImage?.asset?.url || null,
      timestampSeconds: moment.timestampSeconds,
      timestampFormatted: formatSeconds(moment.timestampSeconds),
      clipDurationSeconds: clipDuration,
      clipDurationFormatted: formatClipDuration(clipDuration),
      description,
      isChapterMatch: Boolean(moment.chapterLabel),
      score,
    })
  }

  // 5. Construct grounded Lesson Results
  const lessonResults: LessonResult[] = []
  const seenLessonIds = new Set<string>()

  for (const id of finalOutput.lessonIds) {
    const lesson = lessonMap.get(id)
    if (!lesson || !lesson.course) continue
    if (seenLessonIds.has(id)) continue
    seenLessonIds.add(id)

    const course = lesson.course
    const { moduleIndex, lessonIndex, moduleTitle } = deriveModuleAndLessonIndex(
      course,
      lesson._id,
      lesson.slug
    )

    const moduleLessonLabel = `Lesson ${moduleIndex}.${lessonIndex} in ${moduleTitle}`

    let score = 50
    const lowerTitle = lesson.title.toLowerCase()
    if (lowerTitle.includes(fullPhrase)) score += 60
    else if (lowerWords.every((w) => lowerTitle.includes(w))) score += 40
    else if (lowerWords.some((w) => lowerTitle.includes(w))) score += 20

    const href = `/courses/${course.slug}/lessons/${lesson.slug}`

    lessonResults.push({
      id: lesson._id,
      lessonTitle: lesson.title,
      lessonSlug: lesson.slug,
      courseTitle: course.title,
      courseSlug: course.slug,
      href,
      courseCoverUrl: course.coverImage?.asset?.url || null,
      moduleTitle,
      moduleIndex,
      lessonIndex,
      moduleLessonLabel,
      keyPoints: lesson.keyPoints || [],
      description: lesson.keyPoints?.[0] || lesson.title,
      duration: lesson.duration || 0,
      score,
    })
  }

  // 6. Sorting
  if (sort === 'duration') {
    videoResults.sort((a, b) => a.clipDurationSeconds - b.clipDurationSeconds)
    lessonResults.sort((a, b) => a.duration - b.duration)
  } else if (sort === 'newest') {
    videoResults.sort((a, b) => b.score - a.score)
    lessonResults.sort((a, b) => b.score - a.score)
  } else {
    // Default: relevance
    videoResults.sort((a, b) => b.score - a.score)
    lessonResults.sort((a, b) => b.score - a.score)
  }

  // 7. Deduplicated course counts & aggregation
  const uniqueCourseSlugs = new Set([
    ...videoResults.map((v) => v.courseSlug),
    ...lessonResults.map((l) => l.courseSlug),
  ])

  // 8. Construct unified ranked cards list
  const unifiedCards: Array<SearchResultCard & { score: number }> = []

  for (const vr of videoResults) {
    const rawLessonId = vr.id.split('-')[0]
    const lesson = lessonMap.get(rawLessonId)
    unifiedCards.push({
      lessonId: lesson?._id || rawLessonId,
      lessonSlug: vr.lessonSlug,
      lessonTitle: vr.lessonTitle,
      label: `${vr.moduleIndex}.${vr.lessonIndex}`,
      moduleTitle: vr.moduleTitle,
      courseTitle: vr.courseTitle,
      courseSlug: vr.courseSlug,
      coursesSlug: vr.courseSlug,
      href: vr.href,
      durationSeconds: vr.clipDurationSeconds,
      freePreview: Boolean(lesson?.freePreview),
      keyPoints: lesson?.keyPoints || [],
      thumbnailRef: lesson?.thumbnail?.asset?._id || null,
      thumbnailUrl: vr.thumbnailUrl,
      reason: vr.description,
      rank: 0,
      kind: 'video',
      timestampSeconds: vr.timestampSeconds,
      clipDurationSeconds: vr.clipDurationSeconds,
      score: vr.score,
    })
  }

  for (const lr of lessonResults) {
    const lesson = lessonMap.get(lr.id)
    unifiedCards.push({
      lessonId: lr.id,
      lessonSlug: lr.lessonSlug,
      lessonTitle: lr.lessonTitle,
      label: `${lr.moduleIndex}.${lr.lessonIndex}`,
      moduleTitle: lr.moduleTitle,
      courseTitle: lr.courseTitle,
      courseSlug: lr.courseSlug,
      coursesSlug: lr.courseSlug,
      href: lr.href,
      durationSeconds: lr.duration,
      freePreview: Boolean(lesson?.freePreview),
      keyPoints: lr.keyPoints,
      thumbnailRef: lesson?.thumbnail?.asset?._id || null,
      thumbnailUrl: lr.courseCoverUrl,
      reason: lr.description,
      rank: 0,
      kind: 'lesson',
      score: lr.score,
    })
  }

  unifiedCards.sort((a, b) => b.score - a.score)
  const results: SearchResultCard[] = unifiedCards.map((card, idx) => ({
    ...card,
    rank: idx + 1,
  }))

  const response: SearchResponse = {
    query,
    totalCount: videoResults.length + lessonResults.length,
    courseCount: uniqueCourseSlugs.size,
    videoResults,
    lessonResults,
    results,
  }

  return SearchResponseSchema.parse(response)
}
