# Implementation Prompt: Add Navigable Hrefs to Search API Results

## Goal
Add navigable, deep-linking `href` properties to all search API result items returned by `POST /api/search` and `GET /api/search`. Each lesson result will link to its full lesson page (`/courses/${courseSlug}/lessons/${lessonSlug}`), and each video result will link directly to the exact matched timestamp on that lesson page (`/courses/${courseSlug}/lessons/${lessonSlug}?start=${timestampSeconds}`).

## Skills Referenced
- `sanity-best-practices`
- `create-agent-with-sanity-context`
- `dial-your-context`
- `AGENTS.md` (§1, §5, §7, §11)

## Code Inspected
- `app/courses/[slug]/lessons/[lessonSlug]/page.tsx`: Inspects how lesson routes consume `params` (`slug`, `lessonSlug`) and query parameters (`searchParams.start`, `searchParams.t`).
- `app/courses/[slug]/course-content.tsx`: Verifies internal app URL convention: `/courses/${courseSlug}/lessons/${lesson.slug}`.
- `app/lib/search/types.ts`: Current Zod schemas (`VideoResultSchema`, `LessonResultSchema`, `SearchResponseSchema`) lacking `href`.
- `app/lib/search/search-engine.ts`: Hydration logic currently constructing `videoResults` and `lessonResults` without `href`.
- `app/api/search/route.ts`: Route handler for POST and GET requests.

## Decisions & Assumptions
1. **URL Structure**:
   - For a lesson result: `/courses/${courseSlug}/lessons/${lessonSlug}`
   - For a video result: `/courses/${courseSlug}/lessons/${lessonSlug}?start=${timestampSeconds}`
2. **Backward & Forward Compatibility**:
   - Add `href: z.string()` to `VideoResultSchema` and `LessonResultSchema`.
   - Add a unified `results` array property to `SearchResponseSchema` containing all ranked cards sorted by score/rank, each with `href`, `kind`, `rank`, and metadata matching the tutorial specification.
   - If requested with `?format=array` or if the client requests the raw list, return the array of cards directly.
3. **Grounding**:
   - `courseSlug` and `lessonSlug` are grounded directly from the Sanity dataset via `LESSONS_BY_IDS_QUERY`.
   - `timestampSeconds` comes from the grounded chapter/chunk resolution.

## Files Expected to Touch
- `app/lib/search/types.ts`
- `app/lib/search/search-engine.ts`
- `app/api/search/route.ts`

## Requirements
- `videoResults` items must include `href` formatted as `/courses/${courseSlug}/lessons/${lessonSlug}?start=${timestampSeconds}`.
- `lessonResults` items must include `href` formatted as `/courses/${courseSlug}/lessons/${lessonSlug}`.
- Unified ranked results must include `href` on every card.
- The route must compile cleanly with strict TypeScript and ESLint.

## Security Considerations
- URLs are constructed purely from sanitized slugs and numeric timestamps validated by Zod schemas.
- No client-side tokens or private keys are exposed.

## Acceptance Criteria
- Running `curl.exe` or `Invoke-RestMethod` against `POST /api/search` returns `href` for every video and lesson result.
- Navigating to the `href` in a browser loads the correct course lesson page at the exact timestamp.
- TypeScript (`tsc --noEmit`) passes with 0 errors.
- ESLint (`npm run lint`) passes with 0 errors.

## Checks to Run
1. `npx tsc --noEmit`
2. `npm run lint`
3. `curl.exe` API call verifying `href` in response payload.

## Exact Manual Test Steps
1. In PowerShell, execute:
   ```powershell
   curl.exe --% -sX POST http://localhost:3000/api/search -H "Content-Type: application/json" -d "{\"query\":\"how do I fetch data and cache it\"}" | python -m json.tool
   ```
2. Verify that every item in `videoResults` and `lessonResults` contains an `href` attribute (e.g. `"/courses/react-performance-engineering/lessons/react-performance-engineering-suspense-for-data?start=210"`).
3. Open `http://localhost:3000/courses/react-performance-engineering/lessons/react-performance-engineering-suspense-for-data?start=210` in a browser and verify the lesson and video player mount at that timestamp.
