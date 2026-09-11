import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchSanity } from "@/sanity/lib/fetch";
import { COURSE_QUERY, COURSE_SLUGS_QUERY } from "@/sanity/lib/queries";
import { serverClient } from "@/sanity/lib/serverClient";
import { urlFor } from "@/sanity/lib/image";
import { Navbar } from "@/app/components/navbar";
import {
  BarChartIcon,
  ClockIcon,
  DocumentIcon,
  UsersIcon,
  ChevronRightIcon,
  OutcomeIcon,
} from "@/app/components/icons";
import { formatDuration } from "@/app/lib/format-duration";
import { CourseContent } from "./course-content";
import { ProgressBar } from "./progress-bar";
import { CourseActions } from "./course-actions";

// ---------------------------------------------------------------------------
// Types — manual shapes until TypeGen is wired
// ---------------------------------------------------------------------------

interface SanityImageRef {
  asset?: { _id: string; url: string } | null;
  hotspot?: unknown;
  crop?: unknown;
}

interface LearningOutcome {
  _key: string;
  icon: string | null;
  title: string | null;
  description: string | null;
}

interface LessonSummary {
  _id: string;
  title: string;
  slug: string;
  duration: number | null;
  freePreview: boolean | null;
  studentCount: number | null;
  thumbnail: SanityImageRef | null;
}

interface Module {
  _key: string;
  title: string;
  summary: string | null;
  lessons: LessonSummary[];
}

interface CourseDetail {
  _id: string;
  title: string;
  slug: string;
  summary: string | null;
  coverImage: SanityImageRef | null;
  level: string | null;
  price: number | null;
  popular: boolean | null;
  studentCount: number | null;
  learningOutcomes: LearningOutcome[] | null;
  instructor: {
    _id: string;
    name: string;
    slug: string;
    photo: SanityImageRef | null;
    expertise: string[] | null;
  } | null;
  category: {
    _id: string;
    title: string;
    slug: string;
  } | null;
  modules: Module[] | null;
}

// ---------------------------------------------------------------------------
// Static params — uses serverClient directly to avoid draftMode() in build
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const courses = await serverClient.fetch<{ slug: string }[]>(COURSE_SLUGS_QUERY);
  return (courses ?? []).map((c) => ({ slug: c.slug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchSanity(COURSE_QUERY, { slug });
  const course = data as CourseDetail | null;
  if (!course) return { title: "Course not found — Msingi" };
  return {
    title: `${course.title} — Msingi`,
    description: course.summary ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatStudentCount(count: number | null): string {
  if (!count) return "0";
  if (count >= 1000) {
    const k = count / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return count.toLocaleString();
}

function capitalizeLevel(level: string | null): string {
  if (!level) return "—";
  return level.charAt(0).toUpperCase() + level.slice(1);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchSanity(COURSE_QUERY, { slug });
  const course = data as CourseDetail | null;

  if (!course) notFound();

  // Derive totals from the module/lesson data
  const totalDuration =
    course.modules?.reduce(
      (sum, m) =>
        sum +
        (m.lessons?.reduce((ls, l) => ls + (l.duration ?? 0), 0) ?? 0),
      0
    ) ?? 0;
  const moduleCount = course.modules?.length ?? 0;

  // Cover image URL
  const coverImageUrl = course.coverImage?.asset
    ? urlFor(course.coverImage).width(600).height(600).fit("crop").url()
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <div className="max-w-[900px] mx-auto w-full px-6 pt-6 pb-2">
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <Link
              href="/courses"
              className="hover:text-primary-500 transition-colors"
            >
              All Courses
            </Link>
            <ChevronRightIcon className="w-3 h-3" />
            <span className="text-neutral-700 font-medium truncate">
              {course.title}
            </span>
          </nav>
        </div>

        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="max-w-[900px] mx-auto w-full px-6 py-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Cover image */}
            <div className="flex-shrink-0 w-full md:w-[260px] aspect-square rounded-2xl overflow-hidden bg-neutral-900 flex items-center justify-center">
              {coverImageUrl ? (
                <Image
                  src={coverImageUrl}
                  alt={course.title ?? "Course cover"}
                  width={260}
                  height={260}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <span className="text-white text-6xl font-light">
                  {course.title?.charAt(0) ?? "?"}
                </span>
              )}
            </div>

            {/* Course info */}
            <div className="flex-1 min-w-0">
              {/* Popular badge */}
              {course.popular && (
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-500 bg-primary-100 px-3 py-1 rounded mb-3">
                  Popular
                </span>
              )}

              <h1
                className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-3"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                }}
              >
                {course.title}
              </h1>

              {course.summary && (
                <p className="text-base text-neutral-500 leading-relaxed mb-5 max-w-[480px]">
                  {course.summary}
                </p>
              )}

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-neutral-500 mb-6">
                <div className="flex items-center gap-1.5">
                  <BarChartIcon />
                  {capitalizeLevel(course.level)}
                </div>
                <div className="flex items-center gap-1.5">
                  <ClockIcon />
                  {formatDuration(totalDuration)}
                </div>
                <div className="flex items-center gap-1.5">
                  <DocumentIcon />
                  {moduleCount} modules
                </div>
                <div className="flex items-center gap-1.5">
                  <UsersIcon />
                  {formatStudentCount(course.studentCount)} students
                </div>
              </div>

              {/* Action buttons */}
              <CourseActions
                courseId={course._id}
                courseSlug={course.slug}
                courseLevel={course.level}
              />
            </div>
          </div>
        </section>

        {/* ── What you'll learn ──────────────────────────────────────── */}
        {course.learningOutcomes && course.learningOutcomes.length > 0 && (
          <section className="max-w-[900px] mx-auto w-full px-6 py-10">
            <h2
              className="text-2xl font-bold text-neutral-900 mb-6"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
              }}
            >
              What you&apos;ll learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.learningOutcomes.map((outcome) => (
                <div
                  key={outcome._key}
                  className="flex gap-4 p-5 border border-neutral-200 rounded-xl bg-white"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                    <OutcomeIcon
                      name={outcome.icon ?? ""}
                      className="text-primary-500"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                      {outcome.title}
                    </h3>
                    {outcome.description && (
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        {outcome.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Course Content (client component) ──────────────────────── */}
        {course.modules && course.modules.length > 0 && (
          <CourseContent
            courseSlug={course.slug}
            modules={course.modules.map((m) => ({
              _key: m._key,
              title: m.title,
              summary: m.summary ?? null,
              lessons: (m.lessons ?? []).map((l) => ({
                _id: l._id,
                title: l.title,
                slug: l.slug,
                duration: l.duration ?? null,
                freePreview: l.freePreview ?? null,
                studentCount: l.studentCount ?? null,
              })),
            }))}
            totalDuration={totalDuration}
          />
        )}
      </main>

      {/* ── Bottom progress bar (presentational) ───────────────────── */}
      <ProgressBar courseSlug={course.slug} />
    </div>
  );
}
