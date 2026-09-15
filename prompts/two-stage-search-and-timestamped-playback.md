# Two-Stage Timestamp Search, On-Site Playback & Context Tuning

## Goal

Upgrade msingi's search and playback experience:
1. Implement two-stage timestamp resolution (Stage 1: chapters first, Stage 2: transcript chunks fallback) with specificity-based ranking and projection safety.
2. Enable seamless on-site timestamped playback where search result cards deep link directly to `/courses/[slug]/lessons/[lessonSlug]?start=[seconds]` and the embedded player automatically seeks to that exact second.
3. Tune the Sanity Context document (`sanity.agentContext` slug: `search`) with pure delta instructions and an optimized content scope filter using `dial-your-context`.
4. Shape the search system prompt using `shape-your-agent` to establish role, grounded tone, boundaries, and two-stage search rules.

## Skills read

- `dial-your-context` (`.agents/skills/dial-your-context/SKILL.md`) — Crafting pure delta instructions and `groqFilter` content scoping for Sanity Context MCP without duplicating schema.
- `shape-your-agent` (`.agents/skills/shape-your-agent/SKILL.md`) — Role definition, tone, boundaries, uncertainty handling, and separation principle between system prompt, MCP instructions, and mechanics.
- `AGENTS.md` §1, §5–§14 — Architecture boundaries, two-stage resolution specification (chapters first, transcript fallback), provider video embed constraints (YouTube, Vimeo, Bunny), token security, PostHog analytics, and verification checks.

## Code inspected

| File | Finding |
|---|---|
| `app/lib/search/search-engine.ts` | Search engine logic: builds system prompt, runs LLM tool loop with `groq_query` and `submit_search_results`, and provides `fallbackGroundedResolution`. Currently returns whole chunk arrays during video queries which risks context overflow; needs projection optimization for matched chapters/chunks, and explicit `isChapterMatch` resolution. |
| `app/lib/search/types.ts` | Schema definitions for `VideoResult`, `ModelVideoMomentSchema`, `SearchResultCard`. `ModelVideoMomentSchema` can carry `isChapterMatch: z.boolean().nullable()` to explicitly pass two-stage resolution status. |
| `app/lib/video-embed.ts` | Embed URL generator for YouTube, Vimeo, and Bunny. Supports `&start=${start}` for YouTube, `#t=${start}s` for Vimeo, and `&t=${start}` for Bunny. Needs robust query param parsing (`start` or `t`, numeric/string format). |
| `app/courses/[slug]/lessons/[lessonSlug]/page.tsx` | Lesson server route: resolves `searchParams.start` and passes `initialStartSeconds` to `LessonView`. |
| `app/courses/[slug]/lessons/[lessonSlug]/lesson-view.tsx` | Main lesson client view: generates `embedInfo` from `initialStartSeconds` and renders `<iframe>`. Missing `key` attribute on iframe to ensure immediate remount/seek when deep linked, and would benefit from visual timestamp seek indicator. |
| `app/search/video-result-card.tsx` | Video result card: renders thumbnail, badge, and "Watch from MM:SS >" action, linking to `result.href` (`/courses/${courseSlug}/lessons/${lessonSlug}?start=${startSeconds}`). |
| `studio/scripts/ingest/update-context.mjs` | Script that updates `agentContext.search` document in Sanity dataset via Sanity mutation API. |
| `studio/schemaTypes/documents/videoType.ts` | Schema for `video` document: `videoId`, `url`, `chapters` (`startSeconds`, `label`), and `chunks` (`startSeconds`, `text`). |

## Decisions & assumptions

1. **Two-Stage Timestamp Resolution**:
   - Stage 1 (Chapters): Match `chapters[].label`. If matched, return the chapter's `startSeconds`, label, and flag `isChapterMatch: true`. Chapter matches are given higher relevance ranking score (+50).
   - Stage 2 (Transcript Chunks Fallback): If no chapter matches, query `chunks[].text`. Return the first matching chunk's `startSeconds`, snippet as label, and flag `isChapterMatch: false`. Given moderate relevance ranking score (+25).
   - Safe Projections: In both GROQ queries and MCP instructions, project ONLY matched chapters and top matching chunks (`"matchedChapters": chapters[label match ...], "matchedChunks": chunks[text match ...][0...2]`). Never return raw whole `chunks` arrays.
2. **Deep Linking & On-Site Playback**:
   - Search cards already link to `/courses/${course.slug}/lessons/${lesson.slug}?start=${timestampSeconds}`.
   - In `app/courses/[slug]/lessons/[lessonSlug]/page.tsx`, parse `searchParams.start` or `searchParams.t` flexibly, handling raw seconds or formatted timestamps.
   - In `app/courses/[slug]/lessons/[lessonSlug]/lesson-view.tsx`, bind `key={embedInfo?.embedUrl || lesson._id}` to the `iframe` to force fresh player mount and instantaneous seek to the designated second.
   - Add a clean, unobtrusive visual seek indicator ("Resumed playback at MM:SS") when entering via timestamp deep link.
3. **Tuning the Context Document (`agentContext.search`)**:
   - Scope filter (`groqFilter`): `!(_id in path("drafts.**")) && _type in ["course", "lesson", "category", "instructor", "video"]`.
   - Pure delta instructions (`instructions`):
     - Connect second-order relationship: `lesson.videoUrl == video.url` (no direct `_ref`).
     - Explain module nesting: `course.modules[].lessons[]._ref` (lessons do not reference parent course).
     - GROQ array match is AND; explicit `||` disjunctions are needed for token OR queries.
     - Two-stage timestamp procedure: match `chapters` first; fall back to `chunks` only if empty.
     - Enforce projection safety: never project `{ chunks }` raw.
4. **Shaping the System Prompt (`search-engine.ts`)**:
   - Follow `shape-your-agent` structure:
     - Role: msingi intelligent search agent.
     - Voice: concise, grounded, authoritative.
     - Boundaries: strict non-hallucination, read-only search, no third-party mentions, structured output only.
     - Grounding & mechanics: token OR matching, two-stage resolution, calling `submit_search_results`.

## Files expected to touch

| File | Purpose |
|---|---|
| `app/lib/search/types.ts` | Add `isChapterMatch` to `ModelVideoMomentSchema`. |
| `app/lib/search/search-engine.ts` | Refactor system prompt with `shape-your-agent`, implement safe projections and two-stage timestamp resolution in GROQ fallback and LLM guidance. |
| `app/courses/[slug]/lessons/[lessonSlug]/page.tsx` | Robust timestamp parsing from query params. |
| `app/courses/[slug]/lessons/[lessonSlug]/lesson-view.tsx` | Add `key` to iframe for instant seek and add timestamp indicator banner. |
| `studio/scripts/ingest/update-context.mjs` | Update context document with pure delta instructions and optimized `groqFilter`. |

## Requirements

1. Search results must implement two-stage timestamp resolution: chapters first, transcript chunks fallback.
2. Clicking any video result card must deep link to `/courses/[slug]/lessons/[lessonSlug]?start=[seconds]`.
3. The embedded player must mount with the provider start parameter and seek to that second on site without opening external links.
4. The Sanity Context document must be updated in Sanity with a draft-excluding scope filter and pure delta instructions per `dial-your-context`.
5. The search engine system prompt must follow `shape-your-agent`.
6. TypeScript type checking (`npx tsc --noEmit`) and ESLint (`npm run lint`) must pass with 0 errors.

## Security considerations

- Sanity read/write tokens remain strictly on the server (`SANITY_API_READ_TOKEN`).
- Browser never executes raw GROQ queries or communicates with MCP directly.
- User search queries are sanitized and tokenized before GROQ interpolation.

## Acceptance criteria

- Searching for a chapter-specific phrase (e.g. "routing") resolves Stage 1 chapter timestamp with `isChapterMatch: true`.
- Searching for a transcript-only phrase resolves Stage 2 chunk timestamp with `isChapterMatch: false`.
- Video cards show "Watch from MM:SS >" and clicking deep links to `/courses/.../lessons/...?start=...`.
- Lesson page player starts at the exact second requested in query param.
- `sanity.agentContext` document in Sanity contains updated `groqFilter` and `instructions`.
- All automated checks (`npx tsc --noEmit`, `npm run lint`, `npm run build`) pass.

## Checks to run

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- Node script to verify `sanity.agentContext` document in Sanity

## Exact manual test steps

1. Run the update script to sync `sanity.agentContext` in Sanity.
2. Perform a search at `http://localhost:3000/search?q=routing`.
3. Verify video result card displays timestamp (e.g. `00:35`) and "Watch from 00:35 >".
4. Click the card and verify the browser navigates to `/courses/nextjs-app-router-in-depth/lessons/file-system-routing?start=35`.
5. Verify the lesson player is embedded on-site, has iframe `src` containing `start=35`, and displays the sought timestamp.
6. Verify searching a transcript chunk term resolves the timestamp correctly via Stage 2.
