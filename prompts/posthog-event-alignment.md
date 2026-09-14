# Implementation Prompt: PostHog Analytics Alignment with Reference Specification

## Goal

Align the PostHog analytics implementation in msingi to match the exact specifications, naming conventions, and architecture outlined in the reference specification:
1. **Shared event catalogue**: Create `lib/analytics/events.ts` so all event names and payload types are spelled once.
2. **Search API (`/api/search`)**:
   - Enrich `search_performed` with `zero_results`, `lesson_result_count`, `duration_ms`, and `signed_in`.
   - Add `search_failed` with coarse failure reason only.
   - Ensure events are flushed before route teardown (`await posthog.flush()`).
   - Accept the browser's PostHog distinct ID and session ID so server search events join the learner's session instead of collapsing onto a shared anonymous person (Clerk `user_id` wins when signed in).
3. **Search Result Cards**:
   - Emit `search_result_opened` (singular) on card click with `result_kind` (`video` | `lesson`), `rank`, `position`, and `query`.
4. **Watch Depth & Lesson Completion Hook (`hooks/use-watch-depth.ts`)**:
   - Elapsed-time hook measuring active video playback time.
   - Exclude hidden tab duration (`document.visibilityState === 'hidden'`).
   - Emit `video_progress` at 25, 50, 75, and 95 (latched once per mount).
   - Emit `lesson_completed` at 95% threshold (latched once per mount).
5. **Enriched `video_played`**:
   - Properties: `provider`, `course_slug`, `duration_seconds`, `source: 'deep_link' | 'poster_click'`.
6. **Navigation & Resume Events**:
   - `lesson_resumed` on deep link arrival (`start_seconds > 0`).
   - `lesson_navigated` on footer next/previous buttons.
   - `catalog_viewed` on catalog page visit.
   - `course_viewed` on course detail page visit.
7. **Course Resumed & Button Location**:
   - Rename `course_started` -> `course_resumed`.
   - Wire the sticky progress bar's "Continue Learning" button.
   - Use `location: 'header' | 'sticky_bar'` to distinguish between the two CTAs.

## Skills Referenced

- `AGENTS.md` (§5, §7, §12, §13 — PostHog analytics, client-server boundaries, verification checks)
- `clerk-nextjs-patterns` (`.agents/skills/clerk-nextjs-patterns/SKILL.md`) — Server-side auth verification via `@clerk/nextjs/server` (`auth()`)

## Code Inspected

| File | Current Implementation | Target Alignment |
|---|---|---|
| `app/lib/analytics-client.ts` / `app/lib/analytics-server.ts` | String literals scattered across two helper files | Centralized `lib/analytics/events.ts` catalogue |
| `app/api/search/route.ts` | `execution_time_ms`, `results_count`; no `search_failed`; no session joining | `search_performed` with `zero_results`, `lesson_result_count`, `duration_ms`, `signed_in`; `search_failed`; `await posthog.flush()`; session/distinct ID headers from client |
| `app/search/video-result-card.tsx` & `lesson-result-card.tsx` | Plural `search_results_opened` with `result_type` | Singular `search_result_opened` with `result_kind`, `rank`, `position`, `query` |
| `app/courses/[slug]/lessons/[lessonSlug]/lesson-view.tsx` | Inline YouTube iframe postMessage listener at 25/50/75/100% | Dedicated `use-watch-depth.ts` tracking active elapsed time (excluding hidden tab), `video_progress` at 25/50/75/95, and `lesson_completed` at 95% |
| `app/courses/[slug]/course-actions.tsx` & `progress-bar.tsx` | `resume_used` with generic source | `course_resumed` with `location: 'header' | 'sticky_bar'` |
| Navigation | `course_catalog_viewed` | `catalog_viewed`, `lesson_navigated` (footer next/prev), `lesson_resumed` (deep link) |

## Decisions & Assumptions

1. **Event Catalogue (`lib/analytics/events.ts`)**:
   - Export constants and type definitions for all events (`SEARCH_PERFORMED`, `SEARCH_FAILED`, `SEARCH_RESULT_OPENED`, `VIDEO_PLAYED`, `VIDEO_PROGRESS`, `LESSON_COMPLETED`, `LESSON_RESUMED`, `LESSON_NAVIGATED`, `CATALOG_VIEWED`, `COURSE_VIEWED`, `COURSE_RESUMED`).
2. **PostHog Server Flush**:
   - Ensure the server-side PostHog dispatcher supports explicit `await posthog.flush()` to prevent silent event drop before route teardown.
3. **Distinct ID & Session ID Joining**:
   - When the client calls `/api/search` via POST or GET, forward PostHog's `posthog.get_distinct_id()` and `posthog.get_session_id()` in custom headers (`x-posthog-distinct-id`, `x-posthog-session-id`).
   - Server uses Clerk user ID if authenticated; if anonymous, falls back to the client's PostHog distinct ID and attaches the session ID.
4. **Hook Architecture (`hooks/use-watch-depth.ts`)**:
   - Accepts video state (playing/paused), total duration, lesson slug, and course slug.
   - Monitors `document.visibilityState`; ignores elapsed time when document is hidden.
   - Latches 25, 50, 75, 95 progress and 95 completion so each fires only once per mount.
5. **No PII Policy Maintained**:
   - PostHog identity continues to transmit solely `user.id` without email or name.

## Files Expected to Touch

| File | Action | Purpose |
|---|---|---|
| `lib/analytics/events.ts` | **NEW** | Shared event name and property catalogue |
| `hooks/use-watch-depth.ts` | **NEW** | Elapsed-time watch depth hook with tab visibility handling |
| `app/lib/analytics-server.ts` | **MODIFY** | Implement `posthog.flush()`, accept client distinct/session IDs, export server capture |
| `app/lib/analytics-client.ts` | **MODIFY** | Use event catalogue constants, export typed client tracking helpers |
| `app/api/search/route.ts` | **MODIFY** | Update `search_performed` payload, add `search_failed`, join session IDs, await flush |
| `app/search/search-results-view.tsx` | **MODIFY** | Pass query, rank, and position to result cards |
| `app/search/video-result-card.tsx` | **MODIFY** | Fire `search_result_opened` with `result_kind`, `rank`, `position`, `query` |
| `app/search/lesson-result-card.tsx` | **MODIFY** | Fire `search_result_opened` with `result_kind`, `rank`, `position`, `query` |
| `app/courses/[slug]/lessons/[lessonSlug]/lesson-view.tsx` | **MODIFY** | Use `useWatchDepth`, track `video_played` (source: deep_link/poster_click), `lesson_resumed`, `lesson_navigated` |
| `app/courses/[slug]/course-actions.tsx` | **MODIFY** | Fire `course_resumed` with `location: 'header'` |
| `app/courses/[slug]/progress-bar.tsx` | **MODIFY** | Fire `course_resumed` with `location: 'sticky_bar'` |
| `app/courses/[slug]/course-view-tracker.tsx` | **MODIFY** | Fire `course_viewed` from event catalogue |
| `app/courses/catalog-view-tracker.tsx` | **MODIFY** | Fire `catalog_viewed` from event catalogue |

## Requirements

1. Shared event names defined exactly once in `lib/analytics/events.ts`.
2. Exact property names: `zero_results`, `lesson_result_count`, `duration_ms`, `signed_in`, `result_kind`, `rank`, `position`, `query`, `video_progress`, `location`.
3. Server route `/api/search` flushes PostHog events and links browser distinct ID & session ID.
4. Time on a hidden tab does not accumulate towards watch depth.
5. Watch depth and lesson completion latch once per mount.

## Security Considerations

- No PII is sent to PostHog.
- Server keys remain server-side.
- Client headers are safely parsed.

## Acceptance Criteria

- All 8 items from the reference specification are fulfilled.
- `npx tsc --noEmit`, `npm run lint`, and `npm run build` pass cleanly.

## Checks to Run

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`

## Exact Manual Test Steps

1. Open `/search?q=docker` -> Verify `/api/search` receives PostHog headers, logs `search_performed` with `zero_results: false`, `duration_ms`, `signed_in`, and awaits flush.
2. Click first video card -> Verify `search_result_opened` fires with `result_kind: 'video'`, `rank: 1`, `position: 1`, `query: 'docker'`.
3. Arrive at lesson with `?start=45` -> Verify `lesson_resumed` fires, and `video_played` fires with `source: 'deep_link'`.
4. Arrive at lesson without `?start` -> Verify `video_played` fires with `source: 'poster_click'` upon play.
5. Switch browser tabs while video is playing -> Verify elapsed watch time pauses while tab is hidden.
6. Return to tab and let video play past 25%, 50%, 75%, 95% -> Verify `video_progress` fires at each milestone once per mount, and `lesson_completed` fires at 95%.
7. Click Next/Previous lesson footer buttons -> Verify `lesson_navigated` fires.
8. Visit `/courses` -> Verify `catalog_viewed` fires.
9. Visit a course detail page and click "Continue Learning" in header -> Verify `course_resumed` fires with `location: 'header'`.
10. Scroll down to trigger sticky bar and click "Continue Learning" -> Verify `course_resumed` fires with `location: 'sticky_bar'`.
