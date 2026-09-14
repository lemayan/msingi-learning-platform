import { notFound } from "next/navigation";
import Link from "next/link";
import type { PortableTextBlock } from "@portabletext/react";
import { fetchSanity } from "@/sanity/lib/fetch";
import { LESSON_QUERY, LESSON_PARAMS_QUERY } from "@/sanity/lib/queries";
import { serverClient } from "@/sanity/lib/serverClient";
import { urlFor } from "@/sanity/lib/image";
import { Navbar } from "@/app/components/navbar";
import {
  ClockIcon,
  UsersIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from "@/app/components/icons";
import { formatDuration } from "@/app/lib/format-duration";
import { LessonVideo } from "./lesson-video";
import { LessonTabs } from "./lesson-tabs";
import { LessonSidebar } from "./lesson-sidebar";

// ---------------------------------------------------------------------------
// Types — manual shapes until TypeGen is wired (mirrors course page.tsx)
// ---------------------------------------------------------------------------

interface SanityImageRef {
  asset?: { _id: string; url: string } | null;
  hotspot?: unknown;
  crop?: unknown;
}

interface Resource {
  _key: string;
  type: string | null;
  title: string | null;
  description: string | null;
  url: string | null;
}

interface CourseLesson {
  _id: string;
  title: string;
  slug: string;
  duration: number | null;
  isFreePreview: boolean | null;
}

interface CourseModule {
  _key: string;
  title: string;
  lessons: CourseLesson[] | null;
}

interface LessonDetail {
  _id: string;
  title: string;
  slug: string;
  videoUrl: string | null;
  poster: SanityImageRef | null;
  duration: number | null;
  isFreePreview: boolean | null;
  studentCount: number | null;
  notes: PortableTextBlock[] | null;
  keyPoints: string[] | null;
  proTip: string | null;
  resources: Resource[] | null;
  course: {
    _id: string;
    title: string;
    slug: string;
    modules: CourseModule[] | null;
  } | null;
}

// ---------------------------------------------------------------------------
// Static params — course + lesson slug pairs for the nested route
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const courses = await serverClient.fetch<
    { courseSlug: string; lessonSlugs: (string | null)[] | null }[]
  >(LESSON_PARAMS_QUERY);

  return (courses ?? []).flatMap((course) =>
    (course.lessonSlugs ?? [])
      .filter((lessonSlug): lessonSlug is string => Boolean(lessonSlug))
      .map((lessonSlug) => ({ slug: course.courseSlug, lessonSlug })),
  );
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) {
  const { lessonSlug } = await params;
  const { data } = await fetchSanity(LESSON_QUERY, { slug: lessonSlug });
  const lesson = data as LessonDetail | null;
  if (!lesson) return { title: "Lesson not found — Msingi" };
  return { title: `${lesson.title} — Msingi` };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { slug: courseSlug, lessonSlug } = await params;
  const { t } = await searchParams;
  const { data } = await fetchSanity(LESSON_QUERY, { slug: lessonSlug });
  const lesson = data as LessonDetail | null;

  if (!lesson || !lesson.course) notFound();

  const course = lesson.course;
  const modules = (course.modules ?? []).map((m) => ({
    _key: m._key,
    title: m.title,
    lessons: (m.lessons ?? []).map((l) => ({
      _id: l._id,
      title: l.title,
      slug: l.slug,
      duration: l.duration ?? null,
    })),
  }));

  // Flatten lessons to derive the "X.Y" label and previous/next navigation.
  const flat = (course.modules ?? []).flatMap((m, moduleIndex) =>
    (m.lessons ?? []).map((l, lessonIndex) => ({
      ...l,
      label: `${moduleIndex + 1}.${lessonIndex + 1}`,
    })),
  );
  const position = flat.findIndex((l) => l.slug === lessonSlug);
  const currentLabel = position >= 0 ? flat[position].label : null;
  const previous = position > 0 ? flat[position - 1] : null;
  const next =
    position >= 0 && position < flat.length - 1 ? flat[position + 1] : null;

  const posterUrl = lesson.poster?.asset
    ? urlFor(lesson.poster).width(960).height(540).fit("crop").url()
    : null;

  const startSeconds = t ? Number.parseInt(t, 10) : 0;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-6 py-8 lg:flex-row">
        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside className="w-full flex-shrink-0 lg:w-[320px]">
          <LessonSidebar
            courseSlug={courseSlug}
            courseTitle={course.title}
            modules={modules}
            currentLessonSlug={lessonSlug}
          />
        </aside>

        {/* ── Main content ────────────────────────────────────────────── */}
        <main className="min-w-0 flex-1">
          {/* Breadcrumb */}
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            <Link href="/courses" className="hover:text-primary-500">
              All Courses
            </Link>
            <ChevronRightIcon className="h-3 w-3" />
            <Link
              href={`/courses/${courseSlug}`}
              className="hover:text-primary-500"
            >
              {course.title}
            </Link>
            <ChevronRightIcon className="h-3 w-3" />
            <span className="truncate font-medium text-neutral-700">
              {lesson.title}
            </span>
          </nav>

          {/* Lesson header */}
          {currentLabel && (
            <span className="mb-3 inline-block rounded bg-primary-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-500">
              Lesson {currentLabel}
            </span>
          )}
          <h1
            className="mb-4 text-3xl font-bold leading-tight text-neutral-900 md:text-4xl"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {lesson.title}
          </h1>

          {/* Meta row */}
          <div className="mb-6 flex flex-wrap items-center gap-5 text-xs font-medium text-neutral-500">
            <div className="flex items-center gap-1.5">
              <ClockIcon />
              {formatDuration(lesson.duration ?? 0)}
            </div>
            {lesson.isFreePreview && (
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-500">
                Free Preview
              </span>
            )}
            {lesson.studentCount ? (
              <div className="flex items-center gap-1.5">
                <UsersIcon />
                {lesson.studentCount.toLocaleString()} students
              </div>
            ) : null}
          </div>

          {/* Video */}
          <div className="mb-8">
            <LessonVideo
              videoUrl={lesson.videoUrl}
              posterUrl={posterUrl}
              title={lesson.title}
              startSeconds={startSeconds}
              courseSlug={courseSlug}
              lessonId={lesson._id}
              lessonSlug={lesson.slug}
              lessonLabel={currentLabel ?? lesson.title}
              isFreePreview={lesson.isFreePreview ?? false}
            />
          </div>

          {/* Content tabs */}
          <LessonTabs
            courseSlug={courseSlug}
            lessonSlug={lesson.slug}
            notes={lesson.notes}
            keyPoints={lesson.keyPoints}
            proTip={lesson.proTip}
            resources={lesson.resources}
          />

          {/* Previous / next navigation */}
          <div className="mt-10 flex items-center justify-between gap-4 border-t border-neutral-200 pt-6">
            {previous ? (
              <Link
                href={`/courses/${courseSlug}/lessons/${previous.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                <ArrowRightIcon className="h-4 w-4 rotate-180" />
                Previous Lesson
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/courses/${courseSlug}/lessons/${next.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#EA580C]"
              >
                Next Lesson
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
