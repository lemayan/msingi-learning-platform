import { z } from 'zod'

/**
 * Request payload schema for POST /api/search
 */
export const SearchRequestSchema = z.object({
  query: z.string().trim().min(1, 'Search query cannot be empty'),
  sort: z.enum(['relevance', 'duration', 'newest']).optional().default('relevance'),
  format: z.enum(['envelope', 'array']).optional().default('envelope'),
})

export type SearchRequest = z.infer<typeof SearchRequestSchema>

/**
 * Unified Search Result Card schema matching tutorial card specifications.
 */
export const SearchResultCardSchema = z.object({
  lessonId: z.string(),
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  label: z.string(),
  moduleTitle: z.string(),
  courseTitle: z.string(),
  courseSlug: z.string(),
  coursesSlug: z.string().optional(),
  href: z.string(),
  durationSeconds: z.number(),
  freePreview: z.boolean(),
  keyPoints: z.array(z.string()),
  thumbnailRef: z.string().nullable(),
  thumbnailUrl: z.string().nullable(),
  reason: z.string(),
  rank: z.number(),
  kind: z.enum(['lesson', 'video']),
  timestampSeconds: z.number().optional(),
  clipDurationSeconds: z.number().optional(),
})

export type SearchResultCard = z.infer<typeof SearchResultCardSchema>

/**
 * Schema for video results (moments inside a lesson video)
 */
export const VideoResultSchema = z.object({
  id: z.string(),
  lessonTitle: z.string(),
  lessonSlug: z.string(),
  courseTitle: z.string(),
  courseSlug: z.string(),
  href: z.string(),
  courseCoverUrl: z.string().nullable(),
  moduleTitle: z.string(),
  moduleIndex: z.number(),
  lessonIndex: z.number(),
  moduleLessonLabel: z.string(),
  thumbnailUrl: z.string().nullable(),
  timestampSeconds: z.number(),
  timestampFormatted: z.string(),
  clipDurationSeconds: z.number(),
  clipDurationFormatted: z.string(),
  description: z.string(),
  isChapterMatch: z.boolean(),
  score: z.number(),
})

export type VideoResult = z.infer<typeof VideoResultSchema>

/**
 * Schema for lesson results (lesson matched on topic)
 */
export const LessonResultSchema = z.object({
  id: z.string(),
  lessonTitle: z.string(),
  lessonSlug: z.string(),
  courseTitle: z.string(),
  courseSlug: z.string(),
  href: z.string(),
  courseCoverUrl: z.string().nullable(),
  moduleTitle: z.string(),
  moduleIndex: z.number(),
  lessonIndex: z.number(),
  moduleLessonLabel: z.string(),
  keyPoints: z.array(z.string()),
  description: z.string(),
  duration: z.number(),
  score: z.number(),
})

export type LessonResult = z.infer<typeof LessonResultSchema>

/**
 * Schema for full search response
 */
export const SearchResponseSchema = z.object({
  query: z.string(),
  totalCount: z.number(),
  courseCount: z.number(),
  videoResults: z.array(VideoResultSchema),
  lessonResults: z.array(LessonResultSchema),
  results: z.array(SearchResultCardSchema).optional(),
})

export type SearchResponse = z.infer<typeof SearchResponseSchema>

/**
 * Structured output schema for OpenAI model responses.
 * Strictly avoids .optional() constraints to satisfy OpenAI Structured Outputs
 * strict mode requirements (all properties required, nullable permitted).
 */
export const ModelVideoMomentSchema = z.object({
  lessonId: z.string().describe('The Sanity _id of the lesson matching this video moment'),
  timestampSeconds: z.number().describe('The start timestamp in seconds from chapters or transcript chunks'),
  chapterLabel: z.string().nullable().describe('The chapter title or transcript snippet for this moment'),
  matchSource: z.enum(['chapter', 'transcript', 'unknown']).describe('The authoritative source of the timestamp match'),
  clipDurationSeconds: z.number().nullable().describe('Estimated duration of this video clip in seconds'),
})

export const ModelSearchOutputSchema = z.object({
  lessonIds: z.array(z.string()).describe('List of Sanity lesson _ids matching the query on topic'),
  videoMoments: z.array(ModelVideoMomentSchema).describe('List of grounded video moments with timestamps'),
})

export type ModelSearchOutput = z.infer<typeof ModelSearchOutputSchema>
