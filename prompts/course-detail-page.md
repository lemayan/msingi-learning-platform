# Course Detail Page — `vertex-course.png`

## Goal

Build the course detail route at `/courses/[slug]`, reproducing the design in `design/vertex-course.png`, wired to seeded Sanity content through the existing server-only data layer. Read-only — the page renders stored content and nothing on it writes.

## Skills read

- Next.js App Router (`node_modules/next/dist/docs/`) — layouts-and-pages, fetching-data, dynamic segments
- AGENTS.md §5–§8, §12

## Code inspected

| File | Finding |
|---|---|
| `sanity/lib/queries.ts` | `COURSE_QUERY` exists but `isPopular`→`popular`, `isFreePreview`→`freePreview`, `poster`→`thumbnail` field mismatches |
| `sanity/lib/fetch.ts` | Wraps Live Content API — uses `draftMode()` internally, unusable in `generateStaticParams` |
| `sanity/lib/serverClient.ts` | Direct server client — safe for build-time fetch |
| `sanity/lib/image.ts` | `urlFor()` helper |
| `app/page.tsx` | Homepage with inline navbar and icon components |
| `app/layout.tsx` | Clerk + Sanity Live + fonts already configured |
| `studio/scripts/seeds/content.mjs` | Real seeded courses with learning outcomes, modules, lessons |
| `next.config.ts` | No image remote patterns configured |

## Decisions & assumptions

1. Fix the three GROQ field-name mismatches (they return `null` currently).
2. Extract Navbar and Icons from homepage into shared components.
3. Use `serverClient.fetch` in `generateStaticParams` to avoid `draftMode()` error.
4. Per-module duration is derived by summing `lessons[].duration` at render time.
5. Total course duration/module count derived the same way.
6. "Continue Learning" and "Bookmark" buttons are presentational only.
7. Bottom progress bar is presentational only (static 35%).
8. Learning outcome icons mapped from seeded string values (layers, workflow, gauge, rocket, etc.)
9. Manual TypeScript types for GROQ response shapes (no TypeGen in this project yet).

## Files touched

| File | Change |
|---|---|
| `sanity/lib/queries.ts` | Fixed `isPopular`→`popular`, `isFreePreview`→`freePreview`, `poster`→`thumbnail` |
| `app/components/icons.tsx` | **NEW** — shared SVG icon components + learning outcome icon map |
| `app/components/navbar.tsx` | **NEW** — shared Navbar extracted from homepage |
| `app/page.tsx` | Imports from shared components instead of inlining |
| `app/lib/format-duration.ts` | **NEW** — seconds → "1h 12m" formatter |
| `next.config.ts` | Added image remote patterns for cdn.sanity.io, i.ytimg.com, picsum.photos |
| `app/courses/[slug]/page.tsx` | **NEW** — course detail server component |
| `app/courses/[slug]/course-content.tsx` | **NEW** — client component for module list + show-all toggle |
| `app/courses/[slug]/progress-bar.tsx` | **NEW** — presentational sticky progress bar |

## Checks run

- `npx tsc --noEmit` — ✅ pass
- `npx eslint .` — ✅ 0 errors (3 warnings, none in new code)
- `npx next build` — ✅ pass, 10 course slugs pre-rendered via SSG

## Manual test steps

1. `npm run dev`
2. Navigate to `/courses/nextjs-app-router-in-depth`
3. Verify breadcrumb, hero with cover image, POPULAR badge, metadata row
4. Verify "What you'll learn" 2×2 grid with icons
5. Verify "Course Content" module list with durations
6. Click "Show all 4 modules" to expand
7. Verify sticky progress bar at bottom
8. Resize to 375px — verify responsive stacking
