# Implementation Prompt: Comprehensive PostHog Tracking (Next.js Best Practices)

## Goal

Implement comprehensive, production-grade PostHog product analytics across all features built since the basic setup, following PostHog's Next.js best practices for event naming and properties:
1. `search_performed` with query (client & server-side)
2. `search_results_opened` with result type (`video` | `lesson`)
3. `video_played` when video playback begins
4. `video_watch_depth` at depth milestones (25%, 50%, 75%, 100%)
5. `resume_used` when a learner resumes via timestamp deep-link or Continue Learning affordance
6. `lesson_completed` when a lesson is marked completed or finished
7. Additional high-value product events: `course_viewed`, `course_catalog_viewed`, `lesson_tab_switched`
8. Strict privacy compliance: remove all PII (no email, no full name) beyond the Clerk user ID. Capture server-side where the action is server-side.

## Skills Referenced

- `AGENTS.md` (§5, §7, §11, §12 — PostHog product analytics, client/server separation, public vs server key handling)
- `clerk-nextjs-patterns` (`.agents/skills/clerk-nextjs-patterns/SKILL.md`) — Server-side auth retrieval via `@clerk/nextjs/server` (`auth()`) for server event attribution without PII.

## Code Inspected

| File | Finding |
|---|---|
| `app/components/posthog-user-identity.tsx` | Currently captures `email` and `name` in `posthog.identify()`. Must be stripped to track NO personally identifiable content beyond the Clerk user ID (`user.id`). |
| `app/api/search/route.ts` | Server-side Route Handler for search. Currently executes search without server-side analytics. Can capture `search_performed` server-side with latency, result count, and optional Clerk user ID. |
| `app/search/search-results-view.tsx` | Client search view; needs `search_performed` and `search_sort_changed`. |
| `app/search/video-result-card.tsx` | Video result card; needs `search_results_opened` with `result_type: "video"`. |
| `app/search/lesson-result-card.tsx` | Lesson result card; needs `search_results_opened` with `result_type: "lesson"`. |
| `app/courses/[slug]/lessons/[lessonSlug]/lesson-view.tsx` | Lesson view with YouTube iframe (`enablejsapi=1`). Needs: `video_played`, `video_watch_depth` (25%, 50%, 75%, 100%), `resume_used` (when `start` seconds > 0), `lesson_completed` (interactive toggle + navigation), and `lesson_tab_switched`. |
| `app/courses/[slug]/course-actions.tsx` | "Continue Learning" button; captures `course_learning_clicked`. Needs `resume_used`. |
| `app/courses/[slug]/progress-bar.tsx` | Sticky progress bar; captures `course_started`. Needs `resume_used`. |
| `app/courses/[slug]/page.tsx` & `app/courses/page.tsx` | Course detail and catalog pages; needs `course_viewed` and `course_catalog_viewed`. |

## Decisions & Assumptions

1. **Strict Privacy / Zero PII Beyond Clerk User ID**:
   - In `PostHogUserIdentity`, call `posthog.identify(user.id)` with NO email, name, or metadata.
   - All client and server event payloads carry only content IDs/slugs and non-PII behavioral properties.
2. **Server-Side Event Capture (`app/lib/analytics-server.ts`)**:
   - Implement `captureServerEvent(eventName, properties, userId?)` using `server-only` and PostHog's capture API (`https://us.i.posthog.com/capture/`).
   - In `app/api/search/route.ts`, record `search_performed` on the server with execution duration, match count, video count, lesson count, and `user_id` if authenticated via Clerk `await auth()`.
3. **Client-Side Event Helper (`app/lib/analytics-client.ts`)**:
   - Provide strongly typed client capture functions:
     - `trackSearchPerformed({ query, results_count, courses_count, sort })`
     - `trackSearchResultOpened({ result_type, lesson_id, lesson_slug, lesson_title, course_id, course_slug, course_title, timestamp_seconds, href })`
     - `trackVideoPlayed({ lesson_id, lesson_slug, lesson_title, course_slug, video_url, duration, start_seconds, provider })`
     - `trackVideoWatchDepth({ lesson_id, lesson_slug, duration, seconds_watched, watch_depth_percent })`
     - `trackResumeUsed({ course_slug, lesson_slug, resume_seconds, source })`
     - `trackLessonCompleted({ lesson_id, lesson_slug, lesson_title, course_id, course_slug, duration, completion_source })`
     - `trackCourseViewed({ course_id, course_slug, course_title, level })`
     - `trackCourseCatalogViewed({ total_courses })`
     - `trackLessonTabSwitched({ lesson_slug, tab })`
4. **Video Play & Watch Depth Tracking**:
   - Listen to YouTube iframe messages via `window.addEventListener('message', ...)`:
     - On state `1` (playing): fire `video_played` (first play only).
     - As time advances or on playback intervals: calculate percentage of lesson duration and fire `video_watch_depth` at 25%, 50%, 75%, and 100% milestones (each milestone fired at most once per lesson session).
     - On state `0` (ended / 100%): fire `video_watch_depth` at 100% and `lesson_completed`.
5. **Resume Used**:
   - When a lesson mounts with `initialStartSeconds > 0` (e.g. from a search moment or URL), fire `resume_used`.
   - When "Continue Learning" is clicked on the course page, fire `resume_used`.
6. **Lesson Completed**:
   - Add a "Mark as complete" / "Completed" toggle button in the lesson header allowing manual completion.
   - When clicked, or when "Next Lesson" / "Finish Course" is clicked, fire `lesson_completed`.

## Files Expected to Touch

| File | Purpose |
|---|---|
| `app/lib/analytics-server.ts` | **NEW** — Server-side PostHog capture using Clerk `auth()` and PostHog HTTP API. |
| `app/lib/analytics-client.ts` | **NEW** — Client-side PostHog capture helpers with Next.js best practices and snake_case properties. |
| `app/components/posthog-user-identity.tsx` | Remove email and name, keeping only `user.id`. |
| `app/api/search/route.ts` | Capture server-side `search_performed` event. |
| `app/search/search-results-view.tsx` | Wire client `trackSearchPerformed` and sort tracking. |
| `app/search/video-result-card.tsx` | Wire `trackSearchResultOpened` with `result_type: "video"`. |
| `app/search/lesson-result-card.tsx` | Wire `trackSearchResultOpened` with `result_type: "lesson"`. |
| `app/courses/[slug]/lessons/[lessonSlug]/lesson-view.tsx` | Wire `video_played`, `video_watch_depth`, `resume_used`, `lesson_completed`, and `lesson_tab_switched`. Add completion toggle button. |
| `app/courses/[slug]/course-actions.tsx` | Wire `resume_used` on Continue Learning action. |
| `app/courses/[slug]/progress-bar.tsx` | Wire `resume_used` on sticky progress CTA. |
| `app/courses/[slug]/course-view-tracker.tsx` | **NEW** — Client tracker firing `course_viewed` on course detail page. |
| `app/courses/catalog-view-tracker.tsx` | **NEW** — Client tracker firing `course_catalog_viewed` on catalog page. |

## Requirements

1. Event naming follows PostHog's Next.js standard: `[object]_[action]` (e.g. `search_performed`, `search_results_opened`, `video_played`, `video_watch_depth`, `resume_used`, `lesson_completed`).
2. Properties follow snake_case convention.
3. Absolutely no PII beyond the Clerk user ID (`user.id`).
4. Server-side capture on server actions/routes (`/api/search`).
5. Client-side capture on all key user interaction moments.

## Security Considerations

- Tokens remain in environment variables.
- Server-side capture uses server-only module boundaries.
- No personal data (names, emails, phones, IPs) is sent.

## Acceptance Criteria

- All specified events (`search_performed`, `search_results_opened`, `video_played`, `video_watch_depth`, `resume_used`, `lesson_completed`, `course_viewed`, `course_catalog_viewed`) are properly dispatched.
- `posthog.identify()` contains only `user.id` without `email` or `name`.
- `npx tsc --noEmit`, `npm run lint`, and `npm run build` pass with zero errors.

## Checks to Run

1. `npx tsc --noEmit` — Type check.
2. `npm run lint` — ESLint validation.
3. `npm run build` — Production build verification.

## Exact Manual Test Steps

1. Sign in with Clerk: verify in network/console that `posthog.identify` sends only `user.id` with no `email` or `name`.
2. Search for `"data fetching"`: verify `search_performed` is recorded with query and counts.
3. Click a Video result: verify `search_results_opened` is recorded with `result_type: "video"` and timestamp.
4. On the lesson page: verify `resume_used` fires when arriving with `?start=...`.
5. Play the video: verify `video_played` fires.
6. Watch video past 25% and 50%: verify `video_watch_depth` fires with `watch_depth_percent`.
7. Click "Mark as complete" or "Next Lesson": verify `lesson_completed` fires.
8. Visit `/courses` and `/courses/nextjs-app-router-in-depth`: verify `course_catalog_viewed` and `course_viewed` fire.
9. Click "Continue Learning" on the course page: verify `resume_used` fires.
