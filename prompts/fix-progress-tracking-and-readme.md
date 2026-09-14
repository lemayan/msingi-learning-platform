# Implementation Prompt: Fix Progress Tracking & Add Detailed Project README

## Goal

1. **Fix progress tracking**: Ensure course and lesson progress always starts at 0% for a beginner (fixing the hardcoded 35% complete UI bug in the lesson sidebar and course surfaces), track per-learner lesson completion and course progress dynamically throughout the course, and persist progress via a secure server route (`/api/progress`) adhering to `AGENTS.md`.
2. **Create comprehensive README**: Write a detailed, production-grade `README.md` for the msingi platform documenting architecture, features, content model, video pipeline, intelligent search with Sanity Context MCP, Clerk auth, PostHog telemetry, setup instructions, and deployment commands.
3. **Push & Create PR**: Push the branch to GitHub and create an authoritative Pull Request with detailed release notes.

---

## Skills Referenced

- `AGENTS.md` (§2 loop rules, §5 app structure & boundaries, §7 decisions already made, §8 data model, §12 gotchas, §13 checks)
- `clerk-nextjs-patterns` (`.agents/skills/clerk-nextjs-patterns/SKILL.md`) — server-side auth retrieval via `await auth()` from `@clerk/nextjs/server` for user keying
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`) — schema modeling, GROQ queries, server-only Sanity client usage, and document mutations

---

## Code Inspected

| File | Finding |
|---|---|
| `app/courses/[slug]/lessons/[lessonSlug]/lesson-view.tsx` | Lines 335 & 339 hardcode `style={{ width: "35%" }}` and `35% complete` in the sidebar. Module completion is faked with `mIdx < currentModuleIndex`. Lesson items in the sidebar lack completion status checkmarks. Toggle completion only mutates local boolean state. |
| `app/courses/[slug]/progress-bar.tsx` | Sticky progress bar hardcodes `const progress = 0;` and comment references static 35% from earlier specs. Needs real dynamic progress. |
| `app/courses/[slug]/course-content.tsx` | Course syllabus accordion does not currently show which lessons have been completed. |
| `app/my-learning/page.tsx` | Currently shows hardcoded empty state stating no backend is connected yet. |
| `studio/schemaTypes/documents/learnerProgressType.ts` | Complete schema already exists in Sanity with fields `userId`, `lesson` (reference), `completed` (boolean), `resumePosition` (number), and `updatedAt` (datetime). |
| `sanity/lib/serverClient.ts` | Server-only read client exists. Write client needed for secure mutations via write token. |
| `README.md` | Currently default Next.js template placeholder with no project-specific documentation. |

---

## Decisions & Assumptions

1. **Beginner Baseline (0%)**:
   - For a beginner (no lessons completed yet in the course, whether signed-in or guest), progress MUST start at **0%** (`0% complete`, bar width `0%`).
   - The hardcoded `35%` in `lesson-view.tsx` will be completely replaced by dynamic calculation.

2. **Progress Calculation**:
   - `totalLessons = course.modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0)`
   - `completedLessonsCount = completed lesson IDs matching lessons in this course`
   - `progressPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0`

3. **Module & Lesson Completion Semantics**:
   - In the lesson sidebar:
     - Each lesson item displays a completed checkmark icon if completed.
     - A module circle indicates completed checkmark if and only if all lessons within that module are completed.
     - The "Mark Complete" header button accurately displays "Completed" (green) or "Mark Complete" (neutral) and toggles state.
     - When a lesson video ends or watch threshold is achieved, the lesson is automatically marked completed.

4. **Persistence & Boundary Architecture (AGENTS.md §5, §7, §8, §12)**:
   - Client components NEVER hold write tokens and NEVER write directly to Sanity.
   - A dedicated server route `/api/progress` handles mutations:
     - `GET /api/progress`: Extracts Clerk `userId` via `await auth()`. Queries Sanity `*[_type == "learnerProgress" && userId == $userId]`. Returns `{ progress: { [lessonId]: { completed: boolean, resumePosition?: number } } }`.
     - `POST /api/progress`: Validates payload (`{ lessonId: string, completed?: boolean, resumePosition?: number }`). Extracts Clerk `userId`. If authenticated, upserts a deterministic document `learnerProgress.${userId}.${sanitizedLessonId}` in Sanity with `_type: 'learnerProgress'`.
     - If unauthenticated (anonymous beginner), returns `{ ok: true, anonymous: true }`, allowing client-side `localStorage` to cache progress seamlessly so guests can also track progress before creating an account.
   - Server-only write client in `sanity/lib/writeClient.ts` using `process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN` (the configured token has write access).

5. **Course Detail Page & My Learning Integration**:
   - `app/courses/[slug]/progress-bar.tsx` dynamically receives the calculated learner course progress and updates accordingly.
   - `app/my-learning/page.tsx` loads learner progress; if progress exists, displays the enrolled courses with their progress percentage; if beginner (no progress), displays the clean empty state.

6. **Comprehensive Project README**:
   - Produce a detailed, structured, modern markdown README highlighting:
     - Overview, Live Demo & Vision
     - Architecture diagram & Workspace split (`web` Next.js 16 App Router + standalone `studio/` Sanity Studio v5)
     - Core Features: Intelligent Search with Sanity Context MCP & Gemini/OpenAI, Second-Level Video Deep Linking, Course/Lesson Experience, Learner Progress Tracking, Clerk Auth, PostHog Telemetry, Ingestion Pipeline
     - Content Modeling & Schemas
     - Setup, Environment Variables (`.env.example`), and Local Development
     - Production Build & Studio Deployment workflows
     - Testing & Verification

---

## Files Expected to Touch

| File | Action | Purpose |
|---|---|---|
| `sanity/lib/writeClient.ts` | **NEW** | Server-only Sanity client for progress mutations with write token. |
| `sanity/lib/queries.ts` | **MODIFY** | Add `LEARNER_PROGRESS_QUERY` to fetch progress records for a user. |
| `app/api/progress/route.ts` | **NEW** | Secure Server Route for GET and POST of learner progress. |
| `hooks/use-course-progress.ts` | **NEW** | React hook managing local/remote learner progress, optimistic updates, and persistence. |
| `app/courses/[slug]/lessons/[lessonSlug]/lesson-view.tsx` | **MODIFY** | Fix 35% hardcode to dynamic 0% baseline, connect sidebar module/lesson completion indicators, integrate progress hook. |
| `app/courses/[slug]/progress-bar.tsx` | **MODIFY** | Accept dynamic course progress and display real progress. |
| `app/courses/[slug]/page.tsx` | **MODIFY** | Fetch/pass learner progress to course page actions and sticky bar. |
| `app/my-learning/page.tsx` | **MODIFY** | Display in-progress courses when learner has progress, or friendly empty state if 0%. |
| `README.md` | **MODIFY** | Overhaul with comprehensive, detailed project documentation. |

---

## Requirements

1. Progress for a beginner who opens a course/lesson must always show 0% (never 35%).
2. Marking a lesson complete updates the course completion percentage immediately.
3. Completed lessons show visual checkmarks in the lesson sidebar list.
4. Modules in the sidebar reflect completed status only when all their lessons are finished.
5. Progress is persisted across reloads and saved to Sanity when authenticated.
6. The course detail bottom sticky bar reflects genuine course progress.
7. The project README is comprehensive, clean, and accurately reflects the entire codebase.
8. Branch pushed to GitHub and PR created with full descriptive details.

---

## Security Considerations

- No Sanity tokens exposed to the client; all mutations occur server-side in `/api/progress`.
- Clerk `auth()` authenticates the learner on the server; users cannot mutate another user's progress records.
- Input validation on `/api/progress` using Zod.
- `server-only` guards on Sanity write client.

---

## Acceptance Criteria

- Lesson sidebar shows `0% complete` for a fresh course and fills proportionally as lessons are marked complete.
- Lesson checkmarks update immediately on toggle.
- `/api/progress` returns 200 and persists records to Sanity for signed-in users.
- `npm run lint`, `npx tsc --noEmit`, and `npm run build` succeed with zero errors.
- Detailed `README.md` committed and pushed.
- GitHub Pull Request created and linked.

---

## Manual Test Steps

1. Open `/courses/building-ai-apps-with-llms/lessons/what-you-will-build` as a fresh learner.
2. Verify sidebar displays `0% complete` with an empty progress bar (width `0%`).
3. Click "Mark Complete". Verify status changes to "Completed" (green), the progress bar increments, and a checkmark appears next to the lesson in the sidebar.
4. Navigate to the next lesson or reload the page: verify the completed lesson remains marked complete and the progress percentage is preserved.
5. Check sticky progress bar on `/courses/building-ai-apps-with-llms`: verify it reflects the updated progress.
6. Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` to confirm build integrity.
7. Verify GitHub PR is created and active.
