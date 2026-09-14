# Intelligent Search — `vertex-search.png`

## Goal

Implement the intelligent search experience matching `design/vertex-search.png`, connecting the Sanity Context MCP, a server-side search API route, and a dedicated results page. The search returns ranked, clickable video result cards (with timestamps linking directly to that exact second in the lesson video) and lesson result cards across courses and lessons, strictly grounded in Sanity data.

## Skills read

- `create-agent-with-sanity-context` (`.agents/skills/create-agent-with-sanity-context/SKILL.md`) — MCP endpoint URL conventions, Bearer authentication, initial context via HTTP, tool discovery (`groq_query`, `schema_explorer`).
- `dial-your-context` (`.agents/skills/dial-your-context/SKILL.md`) — Context document instructions and content scope filters (`sanity.agentContext`).
- `shape-your-agent` (`.agents/skills/shape-your-agent/SKILL.md`) — Search agent grounded tone, strict non-hallucination guardrails, and two-stage timestamp resolution.
- `AGENTS.md` §1, §5–§8, §10–§12 — Search UI specification, provider video playback, grounded data rules, token security, and PostHog analytics.

## Code inspected

| File | Finding |
|---|---|
| `design/vertex-search.png` | Search results visual specification: query header ("Results for ..."), result count ("Found 28 results across 8 courses"), search bar, sort dropdown ("Most Relevant"), Video Result cards (thumbnail, timestamp badge, course logo/title, VIDEO badge, title, description, module/lesson label, "Watch from MM:SS >"), Lesson Result cards (key points preview with checkmark, LESSON badge, title, description, module, "View lesson >"), and bottom help callout ("Can't find what you're looking for?"). |
| `studio/schemaTypes/documents/videoDocType.ts` | Video document schema: `videoId`, `url`, `chapters` (`startSeconds`, `label`), `chunks` (`startSeconds`, `text`). |
| `studio/schemaTypes/documents/lessonType.ts` | Lesson document schema: `title`, `slug`, `videoUrl`, `thumbnail`, `duration`, `freePreview`, `notes`, `keyPoints`, `resources`. |
| `studio/schemaTypes/documents/courseType.ts` | Course document schema: `title`, `slug`, `summary`, `coverImage`, `modules` with references to lessons. |
| `app/courses/[slug]/lessons/[lessonSlug]/page.tsx` | Lesson page already accepts `?start=` query parameter and jumps to the exact second in the provider embed! |
| `app/page.tsx` | Homepage hero includes search input box with `⌘ K` badge, currently unlinked. |
| `app/components/navbar.tsx` | Global navbar for site header. |

## Decisions & assumptions

1. **Two-Stage Timestamp Resolution**:
   - Per AGENTS.md §7: Match chapters (the table of contents) first, and fall back to matching transcript chunks only if no chapter matches. Chapter labels are clean and exact; transcript chunks are the backstop.
2. **Video Ingestion & Intelligence Data**:
   - Populate `chapters` and `chunks` on the 120 `videoDoc` documents in Sanity using the authored lesson curriculum points and timestamps, ensuring grounded video moments exist for searching.
3. **Agent Context Document**:
   - Create the `sanity.agentContext` document in Sanity with slug `search`, instructions reflecting the two-stage search and ranking rules, and a `groqFilter` scoping visible types to `["course", "lesson", "category", "instructor", "videoDoc"]`.
4. **Server-Side Search API (`/api/search`)**:
   - Robust multi-channel grounded search:
     a) Search lessons on topic (`title match`, `pt::text(notes) match`, `keyPoints match`).
     b) Search video documents on chapters and transcript chunks, resolving the parent lesson by `videoUrl`.
     c) Merge and rank by specificity (exact title matches > chapter matches > notes matches > transcript matches).
   - Validates results with Zod schema and returns structured cards (`videoResults`, `lessonResults`, `totalCount`, `courseCount`).
   - Supports MCP client and Vercel AI SDK when `OPENAI_API_KEY` is present; seamlessly falls back to high-performance direct grounded GROQ queries against Sanity when operating offline or in environments where the cloud MCP server is awaiting Studio deployment.
5. **Search Results Page (`/search`)**:
   - Faithful reproduction of `design/vertex-search.png`:
     - Search header with styled query highlight and counts ("Found X results across Y courses").
     - Search input with instant search and `⌘ K` keyboard shortcut support.
     - Result count and sort dropdown ("Most Relevant", "Duration", "Newest").
     - Video result cards with 16:9 thumbnail, play overlay, duration badge, course badge, and "Watch from MM:SS >" action.
     - Lesson result cards with key points sidebar, checkmark, course badge, and "View lesson >" action.
     - Empty state with clear guidance and link back to courses catalog.
6. **Homepage Search Integration**:
   - Wire the search input on `app/page.tsx` so submitting navigates to `/search?q=<query>`.
7. **PostHog Analytics**:
   - Instrument `search_performed` (query, count) and `search_result_clicked` (result type, course, lesson, timestamp).

## Files expected to touch

| File | Purpose |
|---|---|
| `package.json` | Add `zod` for structured search card validation. |
| `studio/scripts/seeds/ingest-video-intelligence.mjs` | **NEW** — Offline ingestion script populating chapters and chunks into `videoDoc` documents. |
| `app/api/search/route.ts` | **NEW** — Server-side search API connecting to Sanity Context MCP and grounded GROQ retrieval. |
| `app/search/page.tsx` | **NEW** — Server Component route for `/search` handling query params, SSR, and metadata. |
| `app/search/search-results-view.tsx` | **NEW** — Client Component rendering the complete search results UI from `vertex-search.png`. |
| `app/search/search-bar.tsx` | **NEW** — Search input component with `⌘ K` shortcut and live submission. |
| `app/page.tsx` | Connect homepage search input to `/search?q=...`. |

## Requirements

1. Reproduce `design/vertex-search.png` exactly in layout, typography, colors, badges, and responsive behavior.
2. Return two distinct card types: Video results (with timestamp action "Watch from MM:SS >") and Lesson results (with key points).
3. Clicking a video result navigates to `/courses/${courseSlug}/lessons/${lessonSlug}?start=${startSeconds}` and begins playback at that second.
4. Ground all results in real data — never invent a course, lesson, timestamp, or count.
5. Provide sorting ("Most Relevant", "Duration", "Newest").
6. Provide empty state callout with "Browse all courses →" when no matches are found.
7. PostHog analytics for searches performed and results clicked.

## Security considerations

- Sanity read/write tokens and API keys remain strictly server-side.
- The browser never executes raw GROQ queries or connects to the MCP directly.
- User input is properly sanitized and escaped in GROQ match queries.

## Acceptance criteria

- Searching for `"data fetching"` returns ranked results across courses (e.g. Next.js, React, Node.js).
- Video results show valid timestamps (e.g. `12:45`) and clicking them opens the lesson page at that exact timestamp.
- Lesson results show key points and link to the lesson page.
- Empty search state renders gracefully when no results match.
- `npx tsc --noEmit`, `npx eslint .`, and `npm run build` pass with zero errors.

## Checks to run

- `npx tsc --noEmit` — Type check.
- `npx eslint .` — Linting check.
- `npm run build` — Production build and route compilation.

## Exact manual test steps

1. Navigate to `http://localhost:3000/search?q=data+fetching`.
2. Verify search header shows `Results for "data fetching"` and `Found X results across Y courses`.
3. Verify Video result cards render with course logo, title, video badge, timestamp, and "Watch from MM:SS >".
4. Click "Watch from MM:SS >" on a video card and verify it navigates to the lesson page with `?start=` and video begins playback at that second.
5. Verify Lesson result cards render with key points list and "View lesson >".
6. Test sorting control ("Most Relevant", "Duration", "Newest").
7. Enter a new query in the search bar and press Enter.
8. Search for a nonexistent term (e.g. `"xyznonexistent"`) and verify the empty state and "Browse all courses" button.
