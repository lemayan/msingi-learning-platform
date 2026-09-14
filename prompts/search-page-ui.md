# Implementation Prompt: Msingi Search Page (`design/vertex-search.png`)

## Goal

Build the intelligent search page for Msingi at `/search` reproducing `design/vertex-search.png` down to the exact layout, spacing, typography, colors, badges, and states, fully wired with live Sanity content via the server-side search engine (`app/lib/search/search-engine.ts` and `POST /api/search`).

## Skills Referenced

- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)
- `create-agent-with-sanity-context` (`.agents/skills/create-agent-with-sanity-context/SKILL.md`)
- `dial-your-context` (`.agents/skills/dial-your-context/SKILL.md`)
- `shape-your-agent` (`.agents/skills/shape-your-agent/SKILL.md`)
- `AGENTS.md` (§1, §3, §5, §6, §7, §8, §11, §12, §13)

## Code & Design Inspected

| Artifact / File | Finding |
|---|---|
| `design/vertex-search.png` | Complete visual source of truth: Navbar, "SEARCH RESULTS" tag, serif heading `Results for “<query>”`, count subtitle `Found X results across Y courses`, rounded search bar with `⌘ K`, `{totalCount} results` count and `Most Relevant ⌵` sort dropdown, Video Result cards (16:9 thumbnail, duration badge, course logo + name, `VIDEO` badge, title, description, `Lesson X.Y · Module Title`, `Watch from MM:SS >`), Lesson Result cards (key points preview box with checkmark, course logo + name, `LESSON` badge, title, description, `Module X`, `View lesson ↗ >`), and bottom callout card ("Can't find what you're looking for?"). |
| `app/lib/search/search-engine.ts` | Server-only search engine running two-stage grounded search over Sanity content (chapters first, transcript chunks fallback, lesson topics), returning structured JSON with `videoResults`, `lessonResults`, and unified ranked `results`. |
| `app/lib/search/types.ts` | Zod schemas and TypeScript types for `VideoResult`, `LessonResult`, `SearchResultCard`, and `SearchResponse`. |
| `app/api/search/route.ts` | API route accepting `GET` and `POST` search queries and returning `SearchResponse`. |
| `app/courses/[slug]/lessons/[lessonSlug]/page.tsx` | Lesson page accepting `?start=<seconds>` query parameter to seek provider video embed to the exact second. |
| `app/components/navbar.tsx` | Existing responsive top navigation with brand logo, links ("Courses", "My Learning"), Bell icon, and Clerk user authentication. |
| `app/components/icons.tsx` | Reusable SVG icons (`SearchIcon`, `PlayCircleIcon`, `DocumentIcon`, `ClockIcon`, `CheckCircleIcon`, etc.). |
| `app/page.tsx` | Homepage hero containing search bar with `⌘ K` that currently does not navigate to search results. |

## Decisions & Assumptions

1. **Design Fidelity**:
   - Replicate `design/vertex-search.png` with pixel-level precision on desktop (canvas background `#FAF8F5`, serif Playfair titles, crisp orange accents `#F97316`, neutral text shades, card borders `#E2E8F0`, rounded corners).
   - Adapt responsively down to mobile (stacking thumbnail and preview panels vertically on small screens, preserving clean readability).
2. **Server & Client Architecture (AGENTS.md §5 & §11)**:
   - `app/search/page.tsx` is a Server Component reading `searchParams` (`q`, `sort`). If `q` is provided, it performs server-side search directly via `executeSearch`, preventing layout shift and delivering fast SSR results.
   - Client Component `SearchResultsView` manages interactive state: typing, search submission, sort switching, keyboard shortcut `⌘ K` / `Ctrl+K` to focus the search bar, and PostHog analytics tracking.
3. **Course Badges & Logos**:
   - Provide visual course logos matching the design (Next.js black `N`, React cyan atom, Node.js green hexagon, JavaScript yellow `JS`), falling back to course cover images or initials for any other courses.
4. **Deep Linking & Playback**:
   - Video result action "Watch from MM:SS >" links directly to `/courses/${courseSlug}/lessons/${lessonSlug}?start=${timestampSeconds}`.
   - Lesson result action "View lesson >" links directly to `/courses/${courseSlug}/lessons/${lessonSlug}`.
5. **PostHog Analytics**:
   - Track `search_performed` event with `{ query, totalCount, courseCount, sort }`.
   - Track `search_result_clicked` event with `{ kind, courseTitle, lessonTitle, timestampSeconds, href }`.
6. **Homepage Search Integration**:
   - Wire the search input on `app/page.tsx` to submit and navigate to `/search?q=<query>`.

## Files Expected to Touch

| File | Purpose |
|---|---|
| `app/search/page.tsx` | **NEW** — Server Component route for `/search`, handles `searchParams`, SSR data fetching, metadata. |
| `app/search/search-results-view.tsx` | **NEW** — Interactive Client Component orchestrating search input, sort filter, PostHog events, and card list. |
| `app/search/video-result-card.tsx` | **NEW** — Video result card component matching `vertex-search.png`. |
| `app/search/lesson-result-card.tsx` | **NEW** — Lesson result card component with key points preview panel matching `vertex-search.png`. |
| `app/search/course-badge.tsx` | **NEW** — Course logo & badge component supporting Next.js, React, Node.js, JS, etc. |
| `app/search/search-bar.tsx` | **NEW** — Interactive search input with `⌘ K` shortcut and submit handlers. |
| `app/page.tsx` | Connect homepage search input to navigate to `/search?q=...`. |

## Requirements

1. Match `design/vertex-search.png` exactly for desktop and provide clean mobile responsiveness.
2. Search header displaying `Results for “<query>”` and `Found X results across Y courses`.
3. Working search input with `⌘ K` shortcut.
4. Working sort dropdown ("Most Relevant", "Duration", "Newest").
5. Video result cards with thumbnail, duration badge, play button overlay, course identity, `VIDEO` badge, title, description, module/lesson label, and `Watch from MM:SS >` link.
6. Lesson result cards with key points sidebar, checkmark, course identity, `LESSON` badge, title, description, module label, and `View lesson ↗ >` link.
7. Empty state callout ("Can't find what you're looking for?") with "Browse all courses →" link to `/courses`.
8. PostHog instrumentation for `search_performed` and `search_result_clicked`.
9. Server-only Sanity queries and tokens; zero client token exposure.

## Security Considerations

- Private tokens and Sanity keys remain strictly on the server.
- All user query strings are sanitized to prevent injection into GROQ queries.
- Client only receives sanitized search result data.

## Acceptance Criteria

- Navigating to `/search?q=data+fetching` displays the results page matching `design/vertex-search.png`.
- Shows real results from Sanity with both Video and Lesson cards.
- Clicking "Watch from MM:SS >" on a video card opens `/courses/[courseSlug]/lessons/[lessonSlug]?start=[seconds]`.
- Clicking "View lesson >" on a lesson card opens `/courses/[courseSlug]/lessons/[lessonSlug]`.
- Changing sort order re-orders results accordingly.
- Submitting a new search from the search bar updates the results and URL.
- Homepage search navigates to `/search?q=...`.
- `npx tsc --noEmit` and `npm run lint` pass without errors.
- `npm run build` compiles cleanly.

## Checks to Run

1. `npx tsc --noEmit` — Type check.
2. `npm run lint` — Lint check.
3. `npm run build` — Production build check.

## Exact Manual Test Steps

1. Open `http://localhost:3000/search?q=data+fetching`.
2. Verify visual match with `design/vertex-search.png`:
   - Header with `Results for “data fetching”` and counts `Found X results across Y courses`.
   - Search bar populated with `data fetching` and `⌘ K` badge.
   - Result count and sort dropdown ("Most Relevant").
   - Video cards with duration badges and "Watch from MM:SS >".
   - Lesson cards with key points panel and "View lesson >".
   - Bottom callout card "Can't find what you're looking for?".
3. Click "Watch from MM:SS >" on a video result card: verify it opens the lesson page at that exact timestamp.
4. Click "View lesson >" on a lesson result card: verify it opens the lesson page.
5. Change sort dropdown to "Duration" and "Newest", verify cards re-order.
6. Enter "react" into the search bar and press Enter: verify results update to React lessons.
7. Search for a nonexistent term (e.g. "qwertyxyz"): verify empty state displays and links to `/courses`.
8. Go to homepage `http://localhost:3000`, type "server components" in the hero search bar and press Enter: verify it navigates to `/search?q=server+components`.
