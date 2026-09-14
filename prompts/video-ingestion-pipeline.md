# Offline Video Ingestion Pipeline

## Goal
Implement the real offline video ingestion pipeline to replace the mock seed script. This pipeline will pull transcripts for supported providers (starting with YouTube), chunk them, generate chapter markers, and save them into `videoDoc` documents in Sanity.

## Skills Read
- `AGENTS.md` - §8 & §9: Video pipeline offline tooling, table of contents and transcript chunks, keyed by ID derived from URL.

## Code Inspected
- `studio/scripts/seeds/ingest-video-intelligence.mjs` - Current mock implementation.
- `app/lib/video-embed.ts` - Providers supported (YouTube, Vimeo, Bunny).
- `package.json` - Checking for transcript dependencies.

## Decisions & Assumptions
1. **Providers**: Based on existing seeds (`videos.json`), all current videos are from YouTube. We will implement YouTube ingestion using `youtube-transcript`. For Vimeo and Bunny, we'll leave placeholder structures that throw "Not Implemented Yet" until their respective API keys/libraries are provided.
2. **Chunking**: `youtube-transcript` returns fine-grained text (often word-by-word or short phrases). We will group these into logical chunks (e.g., 15-30 second windows) for `chunks`.
3. **Chapters**: Since YouTube chapters aren't always easily accessible without the Data API, we will use Gemini (`@ai-sdk/google`) to generate structured chapter markers based on the transcript, or extract them if available.
4. **Script Location**: Create a new script `studio/scripts/ingest-videos.mjs` (or update the existing one) that fetches all lessons with YouTube URLs from Sanity, checks if a `videoDoc` exists, and if not (or if missing chapters/chunks), runs the ingestion and mutates Sanity.

## Files Expected to Touch
- `package.json` (add `youtube-transcript`)
- `studio/scripts/ingest-videos.mjs` (New script for real ingestion)

## Requirements
1. The script must take YouTube URLs, extract the video ID, and fetch captions using `youtube-transcript`.
2. Turn captions into `chunks` array (`{ startSeconds, text }`).
3. Generate `chapters` array (`{ startSeconds, label }`) using Gemini or basic heuristic.
4. Upload/Patch the corresponding `videoDoc` in Sanity.
5. Skip videos that already have populated chunks and chapters to save time.

## Security Considerations
- The script uses the `SANITY_API_READ_TOKEN` (with write permissions if it's an editor token) and `GOOGLE_GENERATIVE_AI_API_KEY` locally.
- Run entirely offline (not in the Next.js request path).

## Acceptance Criteria
- Running `node studio/scripts/ingest-videos.mjs` successfully processes at least one real YouTube video, creating chunks and chapters in Sanity.
- The chunks are reasonably sized, not single words.
- The chapters cover the video timeline.

## Checks to Run
- `node studio/scripts/ingest-videos.mjs` and verify Sanity `videoDoc` output.

