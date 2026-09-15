import { notFound } from "next/navigation";
import { Navbar } from "@/app/components/navbar";
import { fetchSanity } from "@/sanity/lib/fetch";
import { LESSON_QUERY, LESSON_SLUGS_QUERY } from "@/sanity/lib/queries";
import { serverClient } from "@/sanity/lib/serverClient";
import { LessonView, type LessonData } from "./lesson-view";

interface PageProps {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
  searchParams: Promise<{
    start?: string;
    t?: string;
  }>;
}

// ---------------------------------------------------------------------------
// Static params — uses serverClient directly to avoid draftMode() during build
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const data = await serverClient.fetch<
    { courseSlug: string; lessons: { slug: string }[] }[]
  >(LESSON_SLUGS_QUERY);

  if (!data) return [];

  const params: { slug: string; lessonSlug: string }[] = [];
  for (const course of data) {
    if (course.courseSlug && course.lessons) {
      for (const lesson of course.lessons) {
        if (lesson.slug) {
          params.push({
            slug: course.courseSlug,
            lessonSlug: lesson.slug,
          });
        }
      }
    }
  }

  return params;
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: PageProps) {
  const { slug, lessonSlug } = await params;
  const { data } = await fetchSanity(LESSON_QUERY, {
    slug: lessonSlug,
    courseSlug: slug,
  });
  const lesson = data as LessonData | null;

  if (!lesson) {
    return { title: "Lesson not found — Msingi" };
  }

  const courseTitle = lesson.course?.title ? ` | ${lesson.course.title}` : "";
  return {
    title: `${lesson.title}${courseTitle} — Msingi`,
    description: lesson.proTip ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function LessonPage({ params, searchParams }: PageProps) {
  const { slug, lessonSlug } = await params;
  const resolvedSearchParams = await searchParams;

  const { data } = await fetchSanity(LESSON_QUERY, {
    slug: lessonSlug,
    courseSlug: slug,
  });
  const lesson = data as LessonData | null;

  if (!lesson) {
    notFound();
  }

  // Parse start timestamp if present in query (?start=45, ?start=45s, ?t=45)
  const rawStart = resolvedSearchParams.start ?? resolvedSearchParams.t;
  const parsedStartSeconds = Number(String(rawStart ?? "").trim().replace(/s$/i, ""));
  const maxStartSeconds =
    lesson.duration && lesson.duration > 0 ? lesson.duration * 60 : Infinity;
  const initialStartSeconds =
    Number.isFinite(parsedStartSeconds) &&
    parsedStartSeconds >= 0 &&
    parsedStartSeconds <= maxStartSeconds
      ? Math.floor(parsedStartSeconds)
      : undefined;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <LessonView
        lesson={lesson}
        initialStartSeconds={initialStartSeconds}
      />
    </div>
  );
}
