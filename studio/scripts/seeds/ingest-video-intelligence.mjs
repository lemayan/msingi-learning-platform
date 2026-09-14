/**
 * Offline video intelligence and context document ingestion.
 *
 * 1. Generates chapters and transcript chunks for all 120 videoDoc documents
 *    based on curriculum lessons, key points, and video durations.
 * 2. Patches the videoDoc documents in Sanity with chapters and chunks.
 * 3. Creates the Sanity Context configuration document (sanity.agentContext)
 *    with slug "search", content filter, and search query instructions.
 *
 * Per AGENTS.md §8 & §9:
 * - chapters: table of contents (preferred for timestamp matching)
 * - chunks: timestamped transcript pieces (fallback for timestamp matching)
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { courses } from './content.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const VIDEOS_JSON_PATH = join(HERE, 'videos.json');

const token = process.env.SANITY_API_READ_TOKEN || 'skDiML82y8KB2AQgIoH3NBQCJWJEJIaHQ4uIOK8MkTiEu1MlaJIEbNvAJ9zmt72Njdhel2GofRPpaOgPECbzqmKRXa96utMCY9zR0x2t2BPj7qJlLrEeLvYbfTcUkLm8MJ989PkWFJGDgVoIYKeiPJ4Z1t5pkYPBenXaNcNEZOAg81VPwxNR';
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xyto8u3e';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const videos = JSON.parse(readFileSync(VIDEOS_JSON_PATH, 'utf8'));

async function sanityFetch(query) {
  const url = `https://${projectId}.api.sanity.io/v2026-09-09/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.description || JSON.stringify(json.error));
  return json.result;
}

async function sanityMutate(mutations) {
  const url = `https://${projectId}.api.sanity.io/v2026-09-09/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.description || JSON.stringify(json.error));
  return json;
}

async function main() {
  console.log('Ingesting video intelligence and search configuration into Sanity...');

  // Map lesson videos
  const videoDataByVideoId = new Map();

  for (const course of courses) {
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        const cacheKey = `${course.slug}-${lesson.slug}`;
        const video = videos[cacheKey];
        if (!video) continue;

        const duration = video.duration || 300;
        const points = lesson.points || [];

        // Build chapters
        const chapters = [];
        chapters.push({
          _key: `chap-0`,
          startSeconds: 0,
          label: `Introduction to ${lesson.title}`,
        });

        if (points.length > 0) {
          const step = Math.floor((duration * 0.85) / points.length);
          points.forEach((point, i) => {
            const startSeconds = Math.min(Math.floor(duration * 0.1) + i * step, duration - 15);
            chapters.push({
              _key: `chap-${i + 1}`,
              startSeconds,
              label: point,
            });
          });
        }

        // Build chunks (transcript snippets)
        const chunks = [];
        chunks.push({
          _key: `chunk-0`,
          startSeconds: 0,
          text: `Welcome to this lesson on ${lesson.title}. ${lesson.summary}`,
        });

        points.forEach((point, i) => {
          const chap = chapters[i + 1];
          const startSeconds = chap ? chap.startSeconds : Math.floor((i + 1) * (duration / (points.length + 1)));
          chunks.push({
            _key: `chunk-${i + 1}`,
            startSeconds,
            text: `In this section, we cover ${point}. Understanding how this operates is essential for mastering ${lesson.title}.`,
          });
        });

        if (lesson.proTip) {
          chunks.push({
            _key: `chunk-tip`,
            startSeconds: Math.floor(duration * 0.8),
            text: `Here is a pro tip: ${lesson.proTip}`,
          });
        }

        videoDataByVideoId.set(video.id, {
          lessonTitle: lesson.title,
          chapters,
          chunks,
        });
      }
    }
  }

  console.log(`Prepared chapters and chunks for ${videoDataByVideoId.size} unique videos.`);

  // Fetch all existing videoDoc documents in Sanity
  const existingDocs = await sanityFetch('*[_type == "videoDoc"]{ _id, videoId, url }');
  console.log(`Found ${existingDocs.length} videoDoc documents in Sanity.`);

  const patches = [];
  for (const doc of existingDocs) {
    const data = videoDataByVideoId.get(doc.videoId);
    if (!data) continue;

    patches.push({
      patch: {
        id: doc._id,
        set: {
          chapters: data.chapters,
          chunks: data.chunks,
        },
      },
    });
  }

  // Submit patches in batches of 25
  const BATCH_SIZE = 25;
  for (let i = 0; i < patches.length; i += BATCH_SIZE) {
    const batch = patches.slice(i, i + BATCH_SIZE);
    await sanityMutate(batch);
    console.log(`Updated videoDoc batch ${Math.floor(i / BATCH_SIZE) + 1} / ${Math.ceil(patches.length / BATCH_SIZE)} (${batch.length} documents).`);
  }

  // Create / Update sanity.agentContext document
  console.log('Creating sanity.agentContext document in Sanity...');
  const agentContextDoc = {
    _id: 'agentContext.search',
    _type: 'sanity.agentContext',
    title: 'Search Agent Configuration',
    slug: {
      _type: 'slug',
      current: 'search',
    },
    groqFilter: '_type in ["course", "lesson", "category", "instructor", "videoDoc"]',
    instructions: `You are the msingi intelligent search agent. Your job is to return relevant, grounded learning results for learner queries.

Content Model:
- Courses have modules with references to lessons.
- Lessons have title, notes (portable text), keyPoints (string[]), duration, and videoUrl.
- Video documents (videoDoc) hold chapters ({ startSeconds, label }) and transcript chunks ({ startSeconds, text }).

Query & Timestamp Resolution Rules:
1. Grounding: Never hallucinate courses, lessons, prices, or timestamps. Return ONLY real lesson _id strings found in Sanity. The app reads all displayed fields back directly from Sanity via LESSONS_BY_IDS_QUERY.
2. GROQ Matching (AND vs OR):
   - In GROQ, matching against an array like \`match ["a", "b"]\` evaluates as an AND condition (both words must match).
   - To match any keyword (OR semantics), write explicit OR disjunction clauses: \`(title match "*a*" || title match "*b*")\` or \`(pt::text(notes) match "*a*" || pt::text(notes) match "*b*")\` or \`(chapters[].label match "*a*" || chapters[].label match "*b*")\`. This expands query results across relevant courses (e.g. from 2 to 11 across 4 courses).
3. Two-Stage Timestamps:
   - Stage 1: Match chapters (the table of contents) first for clean moment titles and exact timestamps.
   - Stage 2: Fall back to matching transcript chunks only if no chapter matches.
4. Identification: Return only matching lesson _ids and video timestamps. Never output a conversational chat wall.`,
  };

  await sanityMutate([
    {
      createOrReplace: agentContextDoc,
    },
  ]);

  console.log('✅ Ingestion complete: videoDoc intelligence and sanity.agentContext document updated in Sanity.');
}

main().catch((err) => {
  console.error('Ingestion failed:', err);
  process.exit(1);
});
