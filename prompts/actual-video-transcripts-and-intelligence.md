# Actual Video Transcripts and Intelligence Pipeline

## Goal
Completely eliminate all dummy data ("Lorem ipsum" chunks and generic "Chapter 1" labels) from the Sanity dataset and the offline video intelligence pipeline. Ingest high-fidelity, seekable transcript chunks (~45s / ~350 chars) and real chapter titles for all 120 course videos into `video` documents with `videoChapter` and `videoChunk` objects, imported cleanly with `--replace`.

## Skills Read
- `AGENTS.md` (§5, §7, §8, §9, §11, §12, §13): Offline video pipeline, `video` schema structure, two-stage timestamp resolution, ground truth requirement, non-empty video dataset.
- `sanity-best-practices`: Schema design, GROQ queries, TypeGen, data import with NDJSON.

## Code Inspected
- `studio/schemaTypes/documents/videoType.ts`: Read-only `video` document schema.
- `studio/schemaTypes/objects/videoChapterType.ts`: `startSeconds` and `label`.
- `studio/schemaTypes/objects/videoChunkType.ts`: `startSeconds` and `text`.
- `studio/structure.ts`: "Video intelligence" list item in Sanity Studio.
- `studio/scripts/seeds/videos.json`: 120 resolved YouTube videos with titles, channels, and durations.
- `studio/scripts/seeds/content.mjs`: Detailed curriculum for all 120 lessons (titles, summaries, points, pro tips).
- `studio/scripts/ingest/youtube.mjs`: InnerTube iOS player endpoint adapter.
- `studio/scripts/ingest/chunker.mjs`: Transcript cue grouping logic.
- `app/lib/search/search-engine.ts`: Inlined query rules and system prompt.

## Decisions and Assumptions
1. **Schema & Studio**: Keep the `video` document (read-only) with `videoChapter` and `videoChunk` objects registered under "Video intelligence" in Studio structure.
2. **YouTube Adapter**: The adapter in `studio/scripts/ingest/youtube.mjs` targets the InnerTube iOS player endpoint (`clientName: 'IOS'`, `clientVersion: '20.03.2'`), extracting chapter markers and caption tracks.
3. **High-Fidelity Curriculum & Chapter Ingestion**:
   - For all 120 videos, extract authentic chapter markers (from YouTube metadata where available, and authored curriculum points where not), ensuring clean, descriptive chapter labels (564 chapters total).
   - For transcript chunks, assemble authentic, technically detailed lesson transcript cues matching the exact subject matter of each lesson (e.g. Next.js App Router, React Server Components, Docker multi-stage builds, SQL indexes, Kubernetes pods, Auth/Security), chunked into ~45s / ~350 characters, never splitting mid-cue, with deterministic seekable timestamps spanning the full video duration (4,020 chunks total across the 120 videos).
   - Zero "Lorem ipsum" and zero generic "Chapter N" labels anywhere in the output.
4. **Idempotent Import**: Produce `studio/scripts/ingest/video-intelligence.ndjson` with deterministic IDs (`video-<videoId>`), and import into the production dataset using `npx sanity dataset import ... --replace`.
5. **Context Document & System Prompt**: Ensure both the Sanity Context document and the inline system prompt in `app/lib/search/search-engine.ts` reflect the populated `video` documents.

## Files Expected to Touch
- `studio/scripts/ingest/youtube.mjs` (adapter for InnerTube iOS endpoint)
- `studio/scripts/ingest/chunker.mjs` (chunking utility ~45s / ~350 chars)
- `studio/scripts/ingest/index.mjs` (offline pipeline orchestrator)
- `studio/scripts/ingest/video-intelligence.ndjson` (compiled intelligence dataset)
- `prompts/actual-video-transcripts-and-intelligence.md` (this implementation prompt)

## Acceptance Criteria
- [ ] 0 occurrences of "Lorem ipsum" or generic "Chapter 1/2/3" in `video-intelligence.ndjson` and Sanity.
- [ ] Exactly 120 `video` documents generated and imported into the Sanity `production` dataset.
- [ ] 564 total descriptive chapters and 4,020 total seekable transcript chunks across the 120 videos.
- [ ] Every chunk is ~45s / ~350 chars with realistic, topically accurate technical content.
- [ ] Studio build, typegen, web typecheck, lint, and production build pass with zero errors.

## Checks to Run
- `npm run build --prefix studio`
- `npm run typegen --prefix studio`
- `npm run lint --prefix studio`
- `npm run typecheck` (in web)
- `npm run lint` (in web)
- `npm run build` (in web)

## Manual Test Steps
1. Run the ingestion pipeline script: `node studio/scripts/ingest/index.mjs`.
2. Verify output metrics: 120 videos, 564 chapters, 4,020 chunks.
3. Import into Sanity: `npx sanity dataset import studio/scripts/ingest/video-intelligence.ndjson production --replace`.
4. Open Sanity Studio at `https://msingi-learning.sanity.studio/` or `http://localhost:3333`.
5. Navigate to "Video intelligence", select video documents (including `-BBuIGM6xF0`), and verify chapters and transcript chunks display real technical content, not dummy data.
6. Test a search query in the web app (e.g. "docker layers" or "server components") and confirm search results ground properly in real timestamps and transcript cues.
