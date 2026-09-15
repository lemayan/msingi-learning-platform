# Implementation Prompt: Protect Course Access with Clerk Auth & Replace Course Placeholders with Topic-Relevant Artwork

## Goal

1. **Gate Course Access Behind Authentication**: Restrict access to course exploration and learning content (`/courses`, `/courses/[slug]`, and all lesson pages) so that only signed-in or signed-up users can access them. When an unauthenticated user attempts to explore courses (e.g. clicks "Explore Courses", "View all courses", or selects a course card from the homepage), automatically redirect them to Clerk authentication (`/sign-in` with sign-up access) while preserving their intended return destination (`redirect_url`).
2. **Replace Irrelevant Course Placeholder Images**: Replace the random picsum seed photos in Sanity (e.g., the generic laptop photo currently displayed for "Building AI Apps with LLMs" and the irrelevant photo for "DevOps with Docker and Kubernetes") with curated, high-quality, topic-specific visuals that genuinely reflect each course's domain (LLMs & neural networks, Docker containers & Kubernetes orchestration, Next.js App Router, React performance profiling, TypeScript systems, RAG & vector embeddings, Python data & pandas, distributed system design, PostgreSQL databases, and practical web security).

---

## Skills Referenced

- `AGENTS.md` (§2 loop rules, §5 app structure & boundaries, §7 decisions already made, §8 content data model, §12 gotchas, §13 checks)
- `clerk-nextjs-patterns` (`.agents/skills/clerk-nextjs-patterns/SKILL.md`) — public-first vs protected-first middleware strategies using `createRouteMatcher` and `await auth.protect()` in Next.js 16 (`proxy.ts`)
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`) — schema modeling, GROQ queries, server-only Sanity client usage, asset upload APIs, and dataset patching

---

## Code Inspected

| File | Finding |
|---|---|
| `proxy.ts` | Currently runs bare `clerkMiddleware()` with no protected route matcher; all courses and lessons are publicly accessible without authentication. |
| `app/page.tsx` | Homepage includes "Explore Courses" button (line 34), "View all courses" link (line 61), and top course cards (line 68). Unauthenticated users can currently click these and immediately view all catalog content. |
| `app/components/course-card.tsx` | Renders `course.coverImage?.asset` via Sanity `urlFor()`, or falls back to a single initial character in a dark box. |
| `app/courses/[slug]/page.tsx` | Course detail hero displays `coverImageUrl` (260x260 aspect square). |
| `studio/scripts/seeds/seed.ndjson` | Seeded all 10 courses with `https://picsum.photos/seed/vertex-${slug}/1600/900`, causing Sanity asset ingestion of arbitrary photos (e.g. laptop for LLMs). |
| `studio/scripts/seeds/build-ndjson.mjs` | Defines `coverImageUrl = (slug) => 'https://picsum.photos/seed/vertex-${slug}/1600/900'`. |
| `.env.local` | Configures Clerk public keys, secret key, sign-in/sign-up URLs (`/sign-in`, `/sign-up`), and Sanity token with verified write permissions. |

---

## Decisions & Assumptions

1. **Public Landing Page vs Protected Course Content**:
   - The homepage (`/`) remains public so visitors can see the hero proposition, value copy, and search bar teaser.
   - All course exploration and learning routes are protected:
     - `/courses(.*)` (includes the catalog `/courses`, course detail `/courses/[slug]`, and lesson pages `/courses/[slug]/lessons/[lessonSlug]`)
     - `/lessons(.*)` (legacy/standalone lesson route)
     - `/my-learning(.*)` (learner progress dashboard)
     - `/api/progress(.*)` (progress tracking mutations)
   - When an unauthenticated visitor navigates to `/courses` (e.g. by clicking "Explore Courses" or "View all courses" on the homepage) or directly visits a course page, Clerk middleware intercepts the request with `await auth.protect()` and redirects to `/sign-in?redirect_url=...`.
   - On the `/sign-in` page, users can sign in or click "Sign up" to create an account. Once authenticated, Clerk seamlessly returns them to `/courses` (or their selected course).

2. **Topic-Relevant Course Images for All 10 Courses**:
   - Create crisp, high-resolution SVG/PNG graphical artwork specifically designed for each of the 10 course topics:
     1. `building-ai-apps-with-llms`: AI neural network nodes, transformer attention mechanisms, LLM prompt tokens, glowing purple/indigo AI brain matrix.
     2. `devops-with-docker-and-kubernetes`: Docker container ship/whales, Kubernetes steering wheel/helm, clustered infrastructure nodes, cyan/blue cloud architecture.
     3. `nextjs-app-router-in-depth`: Next.js geometric 'N', server/client tree split, modern React full-stack routing layout, black & white sleek modern aesthetic.
     4. `react-performance-engineering`: React atom logo with high-speed performance tachometer/gauge, flame graph rendering, vibrant cyan/orange optimization metrics.
     5. `typescript-for-application-developers`: TypeScript 'TS' badge, structural type safety brackets `{ T }`, strict compile-time checking glyphs, deep blue theme.
     6. `retrieval-augmented-generation-from-scratch`: Vector embedding space, similarity search clusters, hybrid search retrieval pipelines, rich emerald/teal data nodes.
     7. `python-for-data-work`: Python snakes interwoven with pandas tabular dataframes, statistical histograms, and visual charts, gold & blue tones.
     8. `system-design-foundations`: Distributed system architecture diagram, load balancer, distributed caches, partitioned database nodes, slate/indigo enterprise theme.
     9. `postgresql-for-developers`: PostgreSQL elephant emblem motif, relational SQL tables, B-tree indexes, ACID storage blocks, deep sapphire blue theme.
     10. `practical-web-security`: Robust cybersecurity shield, cryptographic lock, firewall defense barrier, HTTPS green/amber security fortress.
   - A node script will upload these artwork assets to Sanity via the Sanity client asset upload API (`client.assets.upload('image', buffer, ...)`), then patch each `course.<slug>` document in the Sanity dataset with the new asset `_ref` and updated alt text.
   - Update `seed.ndjson` and `build-ndjson.mjs` so any future database seed or reset maintains these topic-specific assets.

3. **Graceful Fallback UI**:
   - In `CourseCard` (`app/components/course-card.tsx`), enhance the fallback when an image is loading or absent so that instead of an empty initial letter, it renders a topic-themed badge with the appropriate domain icon and styled background.

---

## Files Expected to Touch

| File | Action | Purpose |
|---|---|---|
| `proxy.ts` | **MODIFY** | Add `createRouteMatcher` and `await auth.protect()` for `/courses(.*)`, `/lessons(.*)`, `/my-learning(.*)`, `/api/progress(.*)`. |
| `scripts/generate-and-upload-course-covers.mjs` | **NEW** | Script to generate curated, domain-specific course cover artwork and upload them directly to Sanity image assets, patching all 10 courses. |
| `studio/scripts/seeds/build-ndjson.mjs` | **MODIFY** | Update course cover image URLs from generic picsum seeds to domain-specific references. |
| `studio/scripts/seeds/seed.ndjson` | **MODIFY** | Update course cover image asset references to topic-relevant URLs. |
| `app/components/course-card.tsx` | **MODIFY** | Enhance card image rendering and fallback presentation. |

---

## Requirements & Security Considerations

- **Server-Side Protection**: Route gating MUST happen in Next.js middleware (`proxy.ts`), never in client-side component effects. Unauthenticated users cannot bypass protection.
- **Credential Security**: Sanity write tokens and Clerk secret keys remain strictly server-side and are never exposed to client bundles or browser responses.
- **Asset Legitimacy**: All new course images must be high-resolution, professionally styled, lightweight, and directly indicative of the course curriculum.

---

## Acceptance Criteria

1. Unauthenticated users visiting `/` can view the homepage.
2. Clicking "Explore Courses" or "View all courses" directs the user to `/sign-in` (with Clerk sign-up option), preserving `redirect_url=/courses`.
3. Clicking a specific course card on the homepage directs the user to `/sign-in` with `redirect_url=/courses/[slug]`.
4. Directly entering `/courses`, `/courses/[slug]`, `/lessons/[slug]`, or `/my-learning` in the browser URL bar when signed out redirects to `/sign-in`.
5. After signing in or signing up, the user is redirected immediately to the course or page they intended to visit.
6. The course card and course detail page for "Building AI Apps with LLMs" displays a cover image representing LLMs / neural networks / AI (not a laptop).
7. The course card and course detail page for "DevOps with Docker and Kubernetes" displays a cover image representing containers / Kubernetes / cloud infrastructure.
8. All 10 courses in the catalog have relevant, topic-specific cover images.

---

## Checks to Run

1. `npm run lint` — ESLint validation in web.
2. `npx tsc --noEmit` — TypeScript compilation check in web.
3. `npm run build` — Next.js production build verification.
4. Execute course image upload script and verify live Sanity dataset update with queries.

---

## Manual Test Steps

1. **Verify Unauthenticated Redirection**:
   - Open a new Incognito / InPrivate browser window.
   - Open `http://localhost:3000/`.
   - Click "Explore Courses" button -> verify browser redirects to `/sign-in?redirect_url=...%2Fcourses`.
   - Return to `/` and click "View all courses" -> verify redirect to `/sign-in`.
   - Click "Building AI Apps with LLMs" card -> verify redirect to `/sign-in?redirect_url=...%2Fcourses%2Fbuilding-ai-apps-with-llms`.
   - Navigate directly to `http://localhost:3000/my-learning` -> verify redirect to `/sign-in`.

2. **Verify Authenticated Flow**:
   - Sign in using an existing Clerk account or create a new test account via Sign Up.
   - Verify immediate redirect back to the catalog or requested course page.
   - Confirm courses and lesson videos load and play as expected.

3. **Verify Course Visuals**:
   - Visit `/courses` (while signed in).
   - Inspect all 10 course cards:
     - Verify "Building AI Apps with LLMs" displays a clear AI / LLM graphic.
     - Verify "DevOps with Docker and Kubernetes" displays Docker/Kubernetes container orchestration graphic.
     - Verify Next.js, React Performance, TypeScript, RAG, Python, System Design, PostgreSQL, and Web Security have domain-accurate covers.
   - Click each course detail page to verify the large 260x260 hero cover image displays the high-resolution artwork properly.
