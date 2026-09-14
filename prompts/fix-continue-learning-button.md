# Implementation Prompt: Fix Continue Learning Button Navigation

## Goal

Make the "Continue Learning" buttons on the course detail page (both in the hero section and in the sticky bottom progress bar) functional by navigating the learner to the course's active or first lesson (`/courses/[slug]/lessons/[lessonSlug]`), while preserving `trackCourseResumed` analytics with `location: 'header'` and `location: 'sticky_bar'`.

## Skills Referenced

- `AGENTS.md` (§2, §5, §7, §13 — Loop rules, course page data flow, analytics preservation, verification checks)

## Code Inspected

| File | Finding |
|---|---|
| `app/courses/[slug]/course-actions.tsx` | "Continue Learning" is an inert `<button>` that executes `handleContinueLearning` (tracking) but contains no navigation logic (`href` or `router.push`). |
| `app/courses/[slug]/progress-bar.tsx` | "Continue Learning" in the sticky bar is also an inert `<button>` with no navigation logic. |
| `app/courses/[slug]/page.tsx` | Server Component fetches course detail and modules with lessons, but does not pass the first/resume lesson slug to `CourseActions` or `ProgressBar`. |
| `app/courses/[slug]/course-content.tsx` | Lessons navigate to `/courses/${courseSlug}/lessons/${lesson.slug}`. |

## Decisions & Assumptions

1. **Target Destination**:
   - In `app/courses/[slug]/page.tsx`, derive the first available lesson slug:
     `const firstLessonSlug = course.modules?.flatMap((m) => m.lessons ?? []).find((l) => Boolean(l?.slug))?.slug ?? null;`
   - If a lesson exists, target URL is `/courses/${course.slug}/lessons/${firstLessonSlug}`.
   - If no lessons exist in the course, target URL gracefully falls back to `#course-content` or `/courses/${course.slug}`.
2. **Component Semantics**:
   - Convert the inert `<button>` elements in `CourseActions` and `ProgressBar` to Next.js `<Link>` components styled identically with the existing Tailwind classes.
   - Using `<Link>` provides accessible navigation, supports middle-click / new tab, and prefetching.
3. **Analytics Integrity**:
   - When clicked, `<Link onClick={handleContinueLearning}>` continues to dispatch `trackCourseResumed` from `lib/analytics/events.ts`:
     - Hero button: `location: 'header'`
     - Sticky progress bar: `location: 'sticky_bar'`
     - Included property: `target_lesson_slug: firstLessonSlug`

## Files Expected to Touch

| File | Action | Purpose |
|---|---|---|
| `app/courses/[slug]/page.tsx` | **MODIFY** | Derive `firstLessonSlug` and pass to `CourseActions` and `ProgressBar`. |
| `app/courses/[slug]/course-actions.tsx` | **MODIFY** | Accept `firstLessonSlug` and render `<Link href={targetHref}>` instead of dead `<button>`. |
| `app/courses/[slug]/progress-bar.tsx` | **MODIFY** | Accept `firstLessonSlug` and render `<Link href={targetHref}>` instead of dead `<button>`. |

## Requirements

1. Clicking "Continue Learning" in the course hero navigates directly to the first lesson of the course (`/courses/[slug]/lessons/[lessonSlug]`).
2. Clicking "Continue Learning" in the bottom sticky progress bar navigates directly to the first lesson of the course.
3. Visual styles (buttons, colors, icons, hover states) remain identical to the reference design.
4. `trackCourseResumed` event fires with proper `location` (`header` vs `sticky_bar`).

## Security Considerations

- URLs are constructed using validated slugs from the server client.
- No client-side injection or unvalidated user input.

## Acceptance Criteria

- Clicking both buttons navigates to `/courses/[slug]/lessons/[lessonSlug]`.
- PostHog `course_resumed` event fires with `location: 'header'` and `location: 'sticky_bar'`.
- `npx tsc --noEmit`, `npm run lint`, and `npm run build` pass with zero errors.

## Checks to Run

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`

## Exact Manual Test Steps

1. Navigate to `/courses/devops-with-docker-and-kubernetes`.
2. Click the orange "Continue Learning →" button in the hero.
3. Verify the browser navigates to the first lesson: `/courses/devops-with-docker-and-kubernetes/lessons/what-is-devops-and-why-now`.
4. Return to `/courses/devops-with-docker-and-kubernetes` and scroll down to reveal the sticky progress bar.
5. Click "Continue Learning →" on the sticky bar.
6. Verify the browser navigates to the first lesson and fires `course_resumed` with `location: 'sticky_bar'`.
