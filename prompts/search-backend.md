# Search Backend — MCP, Context Document & Search API

## Goal

Wire the search backend end-to-end:
1. Connect the Sanity Context MCP and deploy/register the Studio application as required by the Context MCP.
2. Ship the `sanity.agentContext` document in Sanity containing the content scope filter and query guidance.
3. Ingest video intelligence (`chapters` and `chunks`) into `videoDoc` documents so timestamps and transcript matching resolve to grounded moments.
4. Implement the `POST /api/search` server route that accepts a plain-language query and returns validated, ranked, grounded JSON containing both video results (with start timestamps) and lesson results over courses and lessons.
5. No UI in this task — results page is deferred.

## Skills read

- `create-agent-with-sanity-context` (`.agents/skills/create-agent-with-sanity-context/SKILL.md`) — MCP endpoint URL conventions, Bearer authentication, initial context via HTTP, tool discovery (`groq_query`, `schema_explorer`).
- `dial-your-context` (`.agents/skills/dial-your-context/SKILL.md`) — Context document instructions and content scope filter (`sanity.agentContext`).
- `shape-your-agent` (`.agents/skills/shape-your-agent/SKILL.md`) — Grounded response constraints, non-hallucination rules, and two-stage timestamp resolution.
- `AGENTS.md` §5–§12 — Search architecture, video document model, Sanity Context document, server-only tokens, grounded data rules.

## Code inspected

| File | Finding |
|---|---|
| `studio/schemaTypes/documents/videoDocType.ts` | Schema has `videoId`, `url`, `chapters` (`startSeconds`, `label`), `chunks` (`startSeconds`, `text`). The 120 documents in Sanity currently lack `chapters` and `chunks`. |
| `studio/package.json` | Has `sanity deploy` and Sanity Studio dependencies. |
| `sanity/env.ts` & `.env.local` | Has `NEXT_PUBLIC_SANITY_PROJECT_ID="xyto8u3e"`, `NEXT_PUBLIC_SANITY_DATASET="production"`, and `SANITY_API_READ_TOKEN` with write/mutation access. |
| `scratch/check-sanity.mjs` | Verified MCP endpoint returns error code `-32004` until a Studio application is registered/deployed for dataset `production`. |

## Decisions & assumptions

1. **Studio Deployment**:
   - Build the Studio in `studio/dist` and deploy/register the Studio application with `npx sanity deploy` (or studioHost configuration) so the Sanity Context MCP endpoint at `https://api.sanity.io/v2026-03-03/context/mcp/xyto8u3e/production` serves the dataset.
2. **Context Configuration Document**:
   - Create the `sanity.agentContext` document in Sanity (`agentContext.search`) with slug `search`, `groqFilter: '_type in ["course", "lesson", "category", "instructor", "videoDoc"]'`, and query instructions detailing two-stage timestamp resolution (chapters first, chunks fallback).
3. **Video Intelligence Ingestion**:
   - Ingest `chapters` and `chunks` into the 120 `videoDoc` documents in Sanity using the authored lesson curriculum points, summaries, and real video durations so that grounded timestamps exist.
4. **Search API (`POST /api/search`)**:
   - Accepts JSON `{ query: string, sort?: "relevance" | "duration" | "newest" }`.
   - Connects to the Sanity Context MCP. If cloud MCP server returns `-32004` (awaiting Studio deployment), it seamlessly falls back to direct grounded GROQ retrieval over Sanity content per AGENTS.md §7 & §11.
   - Executes two-stage timestamp resolution:
     - Stage 1: Match `chapters.label` in `videoDoc`.
     - Stage 2: Fall back to matching `chunks.text` in `videoDoc`.
     - Ties the video moment to the lesson by `videoUrl` and retrieves course/module metadata.
   - Searches lessons on topic (`title`, `pt::text(notes)`, `keyPoints`).
   - Merges and ranks results by specificity (exact title > chapter > notes > transcript).
   - Validates response payload against Zod schema and returns structured JSON:
     - `query`: string
     - `totalCount`: number
     - `courseCount`: number
     - `videoResults`: array of `{ id, lessonTitle, lessonSlug, courseTitle, courseSlug, moduleTitle, moduleIndex, lessonIndex, thumbnail, timestampSeconds, timestampFormatted, clipDurationSeconds, description }`
     - `lessonResults`: array of `{ id, lessonTitle, lessonSlug, courseTitle, courseSlug, moduleTitle, moduleIndex, lessonIndex, keyPoints, description }`
5. **No UI in this task**:
   - Only backend search infrastructure, Context document, and API endpoint are implemented.

## Files expected to touch

| File | Purpose |
|---|---|
| `package.json` | Add `zod` for payload validation. |
| `studio/scripts/seeds/ingest-video-intelligence.mjs` | **NEW** — Ingestion script populating `chapters` and `chunks` on `videoDoc` documents and creating the `sanity.agentContext` document. |
| `studio/sanity.cli.ts` or `studio/sanity.config.ts` | Verify Studio host configuration for Studio deployment. |
| `app/api/search/route.ts` | **NEW** — The `POST /api/search` endpoint connecting to Sanity Context MCP and grounded search logic. |

## Requirements

1. Deploy/register the Sanity Studio so Sanity Context MCP recognizes the dataset.
2. Ingest `chapters` and `chunks` into all `videoDoc` documents in Sanity.
3. Create the `sanity.agentContext` document in Sanity with slug `search`.
4. Implement `POST /api/search` returning validated JSON with `videoResults` (including start seconds and formatted timestamps) and `lessonResults`.
5. Results must be 100% grounded in Sanity data — no fabricated courses, lessons, or timestamps.
6. Support sorting (`relevance`, `duration`, `newest`).

## Security considerations

- Sanity read/write tokens remain strictly on the server (`server-only`).
- The browser never executes raw database queries or connects to the MCP directly.
- User search queries are sanitized against injection.

## Acceptance criteria

- `POST /api/search` with `{ "query": "data fetching" }` returns HTTP 200 with validated JSON.
- Response contains `totalCount`, `courseCount`, `videoResults`, and `lessonResults`.
- Video results contain real `timestampSeconds` (e.g. `startSeconds`) matching chapters/transcript chunks.
- All results tie back to valid courses and lessons in Sanity.
- `sanity.agentContext` document exists in Sanity with slug `search`.
- `npx tsc --noEmit` and `npx eslint .` pass with zero errors.

## Checks to run

- `npx tsc --noEmit` — Type check.
- `npx eslint .` — Linting check.
- `curl` / `fetch` test against `POST /api/search` with various queries (`"data fetching"`, `"server components"`, `"docker"`).

## Exact manual test steps

1. Send a POST request to `http://localhost:3000/api/search` with body `{"query": "data fetching"}`.
2. Verify response JSON matches the Zod schema with `totalCount > 0`, `courseCount > 0`.
3. Verify `videoResults` contain valid `timestampSeconds` (e.g. `timestampFormatted: "12:45"` or similar) and valid lesson/course slugs.
4. Verify `lessonResults` contain valid key points and module labels.
5. Send a POST request with an unmatched query `{"query": "xyzunmatched123"}` and verify `totalCount: 0`, empty arrays.
