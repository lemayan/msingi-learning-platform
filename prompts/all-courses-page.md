# All Courses Page (Catalog)

## Goal
Build the All Courses catalog page at `/courses` that lists every published course, reusing the UI patterns from the homepage.

## Skills & Context
- Read `AGENTS.md` for architecture boundaries.
- Uses `next/image` for Sanity images.
- Reuses `COURSES_QUERY` from `sanity/lib/queries.ts`.
- Reuses `fetchSanity` from `sanity/lib/fetch.ts` to fetch from the private dataset securely.

## Implementation Details
1. **Route**: Create `app/courses/page.tsx` as an async Server Component.
2. **Data Fetching**: 
   - Call `await fetchSanity(COURSES_QUERY)` to get the full catalog of courses.
3. **UI Layout**:
   - Add the `Navbar`.
   - Add a simple page header (e.g., "All Courses" and a brief description).
   - Render a responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) of course cards identical in structure to the homepage cards.
   - Each card displays the cover image (or initial fallback), title, summary, level, duration, and module count, linking to `/courses/[slug]`.

## Security & Architecture
- Data access is server-only using the private read token (handled by `fetchSanity`).
- Page is read-only.

## Acceptance Criteria
- `/courses` loads without errors and displays all seeded courses.
- Cards link correctly to their respective course detail pages.
- Responsive design matches the homepage grid pattern.

## Checks to Run
- `npx tsc --noEmit`
- `npx eslint .`
- `npx next build` to ensure the route builds correctly.
