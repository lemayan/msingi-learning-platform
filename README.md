# msingi — AI-Powered Learning Platform

<p align="center">
  <strong>A production-style learning platform with intelligent content search, precise second-level video timestamp linking, and dynamic learner progress tracking.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-blue?style=flat&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Sanity-Studio%20v5-red?style=flat&logo=sanity" alt="Sanity Studio v5" />
  <img src="https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=flat&logo=clerk" alt="Clerk" />
  <img src="https://img.shields.io/badge/PostHog-Analytics-yellow?style=flat&logo=posthog" alt="PostHog" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript" alt="TypeScript" />
</p>

---

## Overview

**msingi** is an AI-powered course platform that pairs rich structured content authoring with intelligent video search. Authors create and organize courses in a standalone Sanity Studio, while a Next.js App Router frontend serves high-performance learning surfaces to students.

What sets **msingi** apart is its search intelligence: learners ask questions in plain language and receive ranked, clickable result cards that jump straight to the exact second in a lesson's video where that topic is taught — with the video playing directly on the platform itself.

---

## Core Features

### 1. Intelligent Natural Language Search
- **Sanity Context MCP & LLM Reasoning**: Seamlessly queries course content, lesson notes, and timestamped video transcripts using GROQ queries generated dynamically by an LLM (Google Gemini / OpenAI).
- **Two Result Types**:
  - **Video Moments**: Deep links directly to the specific second (`?start=seconds`) of an embedded video clip with thumbnail, module context, and duration.
  - **Lesson Cards**: Direct access to comprehensive lessons matched on concepts, rich notes, and learning objectives.
- **Two-Stage Timestamp Resolution**: Matches curated chapter markers first, falling back to granular transcript chunks only when necessary for maximum precision.

### 2. Frictionless On-Site Video Playback
- Supported video providers: **YouTube**, **Vimeo**, and **Bunny.net**.
- Providers embed directly on the lesson page with exact timestamp seeking.
- Learners never get bounced out of the platform to third-party players.

### 3. Dynamic Learner Progress Tracking
- **0% Beginner Baseline**: New and guest learners always start at **0% complete** across all courses and lessons.
- **Course & Module Progress**: Dynamic progress percentage calculations:
  $$\text{Progress} = \left\lfloor \frac{\text{Completed Lessons}}{\text{Total Course Lessons}} \times 100 \right\rfloor$$
- **Real-Time Visual Indicators**:
  - Interactive sidebar progress bar and completion percentage.
  - Per-lesson checkmarks in both the lesson sidebar and course syllabus.
  - Automatic module completion badges when all lessons in a module are completed.
  - Sticky bottom progress bar on course detail pages.
- **Robust Persistence**: Keyed by Clerk `userId` through a server route (`/api/progress`) writing to Sanity `learnerProgress` documents, backed by client-side optimistic caching for instant UI updates.
- **My Learning Surface**: Dynamic dashboard displaying enrolled courses, current progress bars, and resume affordances, with clean beginner onboarding.

### 4. Authentication & Security Boundaries
- **Clerk Authentication**: Seamless sign-in and sign-up with Next.js App Router proxy middleware.
- **Private Dataset Isolation**: Client code never receives Sanity read/write tokens or LLM API keys.
- **Strict Server Route Architecture**: All progress writes and search queries run exclusively through server-side route handlers.

### 5. Product Analytics & Telemetry
- **PostHog Client & Server Telemetry**:
  - `catalog_viewed`, `course_selected`, `course_resumed`
  - `lesson_viewed`, `lesson_completed`, `lesson_resumed`
  - `video_played`, `video_progress` (25%, 50%, 75%, 90% watch depth tracking)
  - `search_performed`, `search_result_clicked`

### 6. Video Ingestion & Intelligence Pipeline
- Offline ingest scripts process YouTube and Vimeo caption tracks into short timestamped chunks (`{ startSeconds, text }`) and structured tables of contents (`{ startSeconds, label }`).
- Keeps heavy transcripts out of user-facing web request paths.

---

## Architecture & Project Structure

The project is architected as two standalone workspaces in one monorepo to ensure independent deployments, automatic Studio updates, and clean separation of concerns:

```
msingi/
├── app/                              # Next.js App Router web application
│   ├── api/                          # Server route handlers (search, progress)
│   │   ├── progress/route.ts         # Secure learner progress mutations (Sanity write)
│   │   └── search/route.ts           # MCP search agent integration
│   ├── components/                   # Shared UI components (Navbar, CourseCard, Icons)
│   ├── courses/                      # Catalog & course detail pages
│   │   ├── [slug]/                   # Dynamic course detail & syllabus
│   │   └── [slug]/lessons/[lessonSlug]/ # Full interactive lesson & video player view
│   ├── my-learning/                  # My Learning dashboard with learner progress
│   ├── search/                       # Dedicated search results interface
│   ├── design-system/                # Living design system reference
│   ├── layout.tsx                    # Root layout with ClerkProvider & PostHog
│   └── proxy.ts                      # Clerk authentication proxy middleware
├── hooks/                            # Custom React hooks
│   ├── use-course-progress.ts        # Client progress state & optimistic sync
│   └── use-watch-depth.ts            # Video watch depth analytics hook
├── lib/                              # Shared utility libraries & PostHog telemetry
├── prompts/                          # Implementation specifications & RFCs
├── sanity/                           # Sanity integration helpers (server-only)
│   ├── lib/
│   │   ├── client.ts                 # Read-only public Sanity client
│   │   ├── fetch.ts                  # Cached fetch helper
│   │   ├── queries.ts                # GROQ queries (Courses, Lessons, Progress)
│   │   ├── serverClient.ts           # Server-only read client (private dataset)
│   │   └── writeClient.ts            # Server-only write client for progress mutations
│   └── env.ts                        # Sanity environment validation
├── studio/                           # Standalone Sanity Studio workspace
│   ├── schemaTypes/
│   │   ├── documents/                # Course, Lesson, Video, Instructor, Category, LearnerProgress
│   │   └── objects/                  # Module, LearningOutcome, Resource
│   ├── sanity.config.ts              # Studio configuration & desk structure
│   └── structure.ts                  # Desk structure configuration
└── public/                           # Static assets
```

---

## Tech Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Core full-stack application framework |
| **UI & Styling** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/) | Responsive interface & styling |
| **CMS** | [Sanity Studio v5](https://www.sanity.io/) | Standalone headless CMS & structured content |
| **Content Querying** | [GROQ](https://www.sanity.io/docs/groq) & `next-sanity` | Server-side data fetching with private dataset |
| **Search & AI** | [Sanity Context MCP](https://www.sanity.io/docs/context-mcp), Google Gemini / OpenAI | Grounded natural language video & lesson search |
| **Authentication** | [Clerk](https://clerk.com/) | Authentication, user identity, session management |
| **Analytics** | [PostHog](https://posthog.com/) | Product analytics, telemetry, and engagement tracking |
| **Validation** | [Zod](https://zod.dev/) | Server-side payload & schema validation |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | End-to-end type safety |

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.x` or higher (tested with `v24.x`)
- **npm** or **pnpm**
- A **Sanity.io** account and project
- A **Clerk** application
- A **PostHog** project (optional for analytics)
- An **OpenAI** or **Google Generative AI** API key (for intelligent search)

### 1. Clone the Repository

```bash
git clone https://github.com/lemayan/msingi-learning-platform.git
cd msingi
```

### 2. Environment Variables Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in the required keys:

```env
# ─── Sanity ────────────────────────────────────────────────────────
NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2026-09-09"
SANITY_API_READ_TOKEN="sk..."             # Server-only read token for private dataset
SANITY_API_WRITE_TOKEN="sk..."            # Server-only write token for progress mutations

# ─── Clerk Authentication ──────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/"

# ─── PostHog Analytics ─────────────────────────────────────────────
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"

# ─── AI Search Engine ──────────────────────────────────────────────
GOOGLE_GENERATIVE_AI_API_KEY="AIzaSy..."   # Primary LLM provider
OPEN_API_KEY="sk-proj-..."                 # Alternative LLM provider
```

For the standalone Studio, also configure `studio/.env.local`:

```bash
cd studio
cp .env.local.example .env.local
```

```env
SANITY_STUDIO_PROJECT_ID="your_project_id"
SANITY_STUDIO_DATASET="production"
SANITY_STUDIO_API_VERSION="2026-09-09"
```

### 3. Install Dependencies

Install root web workspace dependencies:
```bash
npm install
```

Install standalone studio dependencies:
```bash
cd studio
npm install
cd ..
```

---

## Development Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js App Router web server at `http://localhost:3000` |
| `npm run build` | Build the production Next.js application |
| `npm run lint` | Run ESLint across all web components and routes |
| `npm run studio:dev` | Start Sanity Studio locally at `http://localhost:3333` |
| `npm run studio:build` | Build the standalone Sanity Studio bundle |
| `npm run studio:deploy` | Deploy Sanity Studio to your hosted Sanity domain |
| `npm run studio:typegen` | Generate TypeScript schema types for Sanity documents |

---

## Testing & Verification

Ensure everything is clean before pushing or deploying:

```bash
# 1. Type-checking
npx tsc --noEmit

# 2. Linting
npm run lint

# 3. Production Build
npm run build
```

---

## Security & Data Integrity Principles

- **No Tokens in the Browser**: The browser client receives neither Sanity API tokens nor LLM keys.
- **Server Routes for State**: User progress mutations occur exclusively through `/api/progress` verifying Clerk session tokens.
- **Grounded AI Answers**: The search engine only presents course and video timestamps derived from Sanity data. It never hallucinates timestamps, course titles, or lesson content.

---

## License

Licensed under the [MIT License](LICENSE).