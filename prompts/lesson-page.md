# Lesson Page — `vertex-lesson.png`

## Goal

Build the lesson page at `/courses/[slug]/lessons/[lessonSlug]`, reproducing the design in `design/vertex-lesson.png` pixel-faithfully, wired to the seeded Sanity content through the server-only data layer, with provider video playback (YouTube / Vimeo / Bunny embed with start timestamp support), sidebar module/lesson navigation, rich text notes (Portable Text), key points, pro tips, resources, previous/next lesson navigation, and PostHog analytics. Read-only — the page displays stored data and does not write directly.

## Skills read

- `sanity-best-practices` (`references/groq.md`, `references/schema.md`, `references/nextjs.md`) — GROQ projections, type-safe queries, image URLs, server-side data fetching.
- `portable-text-serialization` (`rules/react.md`) — Portable Text component mapping for React and Next.js App Router.
- Next.js App Router (`node_modules/next/dist/docs/`) — server/client boundaries, dynamic segments, searchParams.
- `AGENTS.md` §1–§8, §11–§14 — Architecture, playback rules, provider embed constraints, security boundaries, PostHog events.

## Code inspected

| File | Finding |
|---|---|
| `sanity/lib/queries.ts` | `LESSON_QUERY` has field mismatches (`poster` instead of `thumbnail`, `isFreePreview` instead of `freePreview`, `keyPoints[] { _key, text }` instead of `keyPoints` string array). Needs updating and richer module/course derivation. |
| `studio/schemaTypes/documents/lessonType.ts` | Lesson document schema: `title`, `slug`, `videoUrl`, `thumbnail`, `duration`, `freePreview`, `studentCount`, `notes` (portableText), `keyPoints` (string[]), `proTip`, `resources` (array of `resource`). |
| `studio/schemaTypes/documents/courseType.ts` | Course document schema: `title`, `slug`, `level`, `studentCount`, `coverImage`, `modules` array. |
| `studio/schemaTypes/objects/moduleType.ts` | Module object: `title`, `summary`, `lessons` (references to lessons). |
| `studio/schemaTypes/objects/resourceType.ts` | Resource object: `type` ('article' \| 'video' \| 'repo' \| 'tool' \| 'docs' \| 'link'), `title`, `description`, `url`. |
| `studio/scripts/seeds/seed.ndjson` & `content.mjs` | Real seed data with YouTube URLs, markdown-free portable text notes, key points, pro tips, and resources. |
| `app/courses/[slug]/course-content.tsx` | Already links lessons to `/courses/${courseSlug}/lessons/${lesson.slug}`. |
| `app/courses/[slug]/page.tsx` | Existing course detail page with breadcrumb and styling patterns. |
| `app/components/navbar.tsx` | Existing global navigation bar with Clerk auth and PostHog integration. |
| `app/components/icons.tsx` | Existing SVG icons. Missing `CheckCircleIcon`, `LightbulbIcon`, `GithubIcon`, `ExternalLinkIcon`, `ArrowLeftIcon`. |

## Decisions & assumptions

1. **Routing**:
   - Primary route: `/courses/[slug]/lessons/[lessonSlug]` matching the existing links in `app/courses/[slug]/course-content.tsx`.
   - Compatibility route: `/lessons/[lessonSlug]` which resolves the parent course and redirects (or renders) seamlessly.
2. **Video Playback**:
   - Per AGENTS.md §7: Video playback uses provider embeds (`<iframe>`), never a custom player and never external navigation.
   - Embed URL builder extracts video ID and provider from `lesson.videoUrl` (supporting YouTube, Vimeo, and Bunny).
   - Supports `?start=SECONDS` or `?t=SECONDS` query parameter on the page URL, passing the start offset into the provider's embed parameters (`start` for YouTube, `#t=X` for Vimeo, `t` for Bunny).
   - Video frame maintains 16:9 aspect ratio (`aspect-video`) with dark background, rounded corners (`rounded-2xl`), and full player controls.
3. **Query Corrections in `sanity/lib/queries.ts`**:
   - Fix `poster` → `thumbnail { asset->{ _id, url }, hotspot, crop }`.
   - Fix `isFreePreview` → `freePreview`.
   - Fix `keyPoints[] { _key, text }` → `keyPoints`.
   - In course reverse-lookup: fetch course metadata (`title`, `slug`, `level`, `studentCount`, `coverImage`) and all modules with their resolved lessons (`_id`, `title`, `slug`, `duration`, `freePreview`) so the sidebar can render the complete course curriculum.
   - Update `LESSON_SLUGS_QUERY` to supply `(slug, lessonSlug)` combinations for `generateStaticParams`.
4. **Sidebar Navigation**:
   - Left sidebar (sticky on desktop, responsive accordion/collapsible on mobile):
     - "← Back to course" link to `/courses/${course.slug}`.
     - Course card with course icon/cover, course title, and overall progress indicator ("35% complete").
     - Module list with module index, title, total duration, and completed status icons.
     - Active module automatically expanded:
       - Displays all lessons in the module.
       - Currently playing lesson highlighted with orange indicator dot, "Now playing" sub-badge, and play icon.
       - Completed lessons display checkmarks; upcoming lessons display duration.
       - Clicking any lesson navigates to `/courses/${course.slug}/lessons/${lesson.slug}`.
5. **Lesson Content & Portable Text**:
   - Custom Portable Text renderer (`PortableText`) mapping headings (`h2`, `h3`), paragraphs, bulleted lists, and link annotations cleanly matching the design typography (`var(--font-playfair)` for headings, `var(--font-inter)` for body).
   - "In this lesson you will:" section renders `lesson.keyPoints` as a list with orange `CheckCircleIcon`s.
   - "Pro Tip" box styled with warm light-amber background, lightbulb icon, bold "Pro Tip" label, and tip text.
   - "Resources" section displays resource cards in a responsive grid, each with the corresponding icon (`repo` → GitHub icon, `docs`/`article` → Document icon, `link`/`tool` → Link icon), title, description, and external link arrow.
6. **Previous / Next Lesson Navigation**:
   - Flatten modules' lessons in curriculum order to derive previous lesson and next lesson.
   - Bottom navigation bar:
     - Left: "← Previous Lesson" button + previous lesson title and duration.
     - Right: "Next Lesson →" coral/orange action button + next lesson title and duration.
     - If at the first lesson, previous button is disabled/hidden.
     - If at the last lesson, next button navigates back to course or marks completion.
7. **Tabs**:
   - "Lesson Content" (active) and "Notes" (presentational per AGENTS.md §7).
8. **Analytics**:
   - PostHog captures `lesson_viewed` on load with course and lesson IDs/slugs and duration.
   - Captures `lesson_navigation` when using previous/next or sidebar lesson links.

## Files expected to touch

| File | Purpose |
|---|---|
| `sanity/lib/queries.ts` | Fix GROQ schema mismatches in `LESSON_QUERY` and update `LESSON_SLUGS_QUERY`. |
| `app/components/icons.tsx` | Add `CheckCircleIcon`, `LightbulbIcon`, `GithubIcon`, `ExternalLinkIcon`, `ArrowLeftIcon`. |
| `app/lib/video-embed.ts` | **NEW** — Helper to convert YouTube, Vimeo, and Bunny URLs into embed iframe URLs with start time. |
| `app/courses/[slug]/lessons/[lessonSlug]/page.tsx` | **NEW** — Main lesson page (Server Component) with metadata, SSG static params, and data fetching. |
| `app/courses/[slug]/lessons/[lessonSlug]/lesson-view.tsx` | **NEW** — Interactive lesson client component for video player, tabs, sidebar accordion, and PostHog tracking. |
| `app/courses/[slug]/lessons/[lessonSlug]/portable-text.tsx` | **NEW** — Portable Text components tailored to lesson notes styling. |
| `app/lessons/[lessonSlug]/page.tsx` | **NEW** — Redirect / fallback route resolving `/lessons/[lessonSlug]` to `/courses/[slug]/lessons/[lessonSlug]`. |

## Requirements

1. Match `design/vertex-lesson.png` in visual hierarchy, layout, typography, colors, and spacing.
2. Embed the actual video from `lesson.videoUrl` using provider iframe embed (YouTube/Vimeo/Bunny), honoring `?start=` or `?t=` parameter.
3. Left sidebar with course progress, module list, active module expanded, and active lesson highlighted with "Now playing".
4. Tab bar with "Lesson Content" and "Notes".
5. Overview section with formatted Portable Text notes.
6. "In this lesson you will:" section with key points and orange checkmark icons.
7. "Pro Tip" card with amber tint and lightbulb icon.
8. "Resources" cards with icons and external links.
9. Bottom previous / next lesson navigation bar.
10. Responsive down to mobile (375px).
11. Instrument PostHog analytics for lesson engagement.

## Security considerations

- Private dataset tokens stay strictly on the server (`serverClient.ts` / `fetchSanity`).
- No Sanity write tokens or private keys exposed to client components.
- Video embed iframes use standard sandbox permissions (`allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"`).
- External resource links use `rel="noopener noreferrer"`.

## Acceptance criteria

- Navigating to `/courses/nextjs-app-router-in-depth/lessons/nextjs-app-router-in-depth-fetching-in-server-components` renders the lesson page matching `vertex-lesson.png`.
- The video embed loads and plays the lesson video without opening an external provider site.
- Providing `?start=30` starts playback at 30 seconds.
- Sidebar reflects the entire course curriculum, highlighting the current module and lesson.
- Clicking another lesson in the sidebar or using previous/next buttons navigates to that lesson.
- Notes, key points, pro tip, and resources render populated data from Sanity.
- `npx tsc --noEmit`, `npx eslint .`, and `npx next build` pass with zero errors.

## Checks to run

- `npx tsc --noEmit` — Type check.
- `npx eslint .` — Linting check.
- `npx next build` — Verify static generation and route compilation.

## Exact manual test steps

1. Run `npm run dev` and navigate to `http://localhost:3000/courses/nextjs-app-router-in-depth`.
2. Click any lesson in the course content list (e.g. "Fetching data in server components").
3. Verify that `/courses/nextjs-app-router-in-depth/lessons/nextjs-app-router-in-depth-fetching-in-server-components` loads.
4. Verify the breadcrumb: "All Courses > Next.js App Router in Depth > Data Fetching and Caching > Fetching data in server components".
5. Verify the lesson header: "LESSON 3.1", bookmark icon, title, duration, level, student count.
6. Verify the video player embeds the YouTube video and plays directly on the page.
7. Append `?start=60` to the URL and verify the video starts at 1 minute.
8. Verify the sidebar shows "← Back to course", the course title, progress bar, all modules, and highlights the active lesson as "Now playing".
9. Verify the Overview notes, "In this lesson you will" key points, Pro Tip card, and Resources cards.
10. Click "Next Lesson →" and verify navigation to the next lesson ("Caching and revalidation").
11. Resize viewport to 375px and verify responsive layout.
