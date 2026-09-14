import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { Navbar } from "@/app/components/navbar";
import { ArrowRightIcon, PlayCircleIcon, CheckCircleIcon } from "@/app/components/icons";
import { serverClient } from "@/sanity/lib/serverClient";
import { LEARNER_COURSES_WITH_PROGRESS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "My Learning — Msingi",
};

interface SanityImageRef {
  asset?: { _id: string; url: string } | null;
  hotspot?: unknown;
  crop?: unknown;
}

interface CourseModule {
  lessons?: { _id: string }[] | null;
}

interface CourseRef {
  _id: string;
  title: string;
  slug: string;
  summary: string | null;
  coverImage: SanityImageRef | null;
  level: string | null;
  modules?: CourseModule[] | null;
}

interface LearnerProgressRecord {
  lessonId: string;
  lesson?: {
    _id: string;
    title: string;
    slug: string;
    course?: CourseRef | null;
  } | null;
}

/**
 * My Learning page.
 * Reads genuine learner progress from Sanity for authenticated learners (AGENTS.md §7).
 * Shows enrolled courses with dynamic progress, or a welcoming empty state for beginners.
 */
export default async function MyLearningPage() {
  const { userId } = await auth();

  let coursesWithProgress: {
    _id: string;
    title: string;
    slug: string;
    summary: string | null;
    coverImageUrl: string | null;
    progressPercent: number;
    completedCount: number;
    totalLessons: number;
  }[] = [];

  if (userId) {
    try {
      const records = await serverClient.fetch<LearnerProgressRecord[]>(
        LEARNER_COURSES_WITH_PROGRESS_QUERY,
        { userId }
      );

      const courseMap = new Map<
        string,
        {
          course: CourseRef;
          completedLessonIds: Set<string>;
        }
      >();

      for (const rec of records) {
        const c = rec.lesson?.course;
        if (!c || !c._id) continue;

        if (!courseMap.has(c._id)) {
          courseMap.set(c._id, {
            course: c,
            completedLessonIds: new Set(),
          });
        }

        const entry = courseMap.get(c._id)!;
        if (rec.lessonId) {
          entry.completedLessonIds.add(rec.lessonId);
        }
      }

      coursesWithProgress = Array.from(courseMap.values()).map(({ course, completedLessonIds }) => {
        const totalLessons =
          course.modules?.reduce(
            (sum, m) => sum + (m.lessons?.length ?? 0),
            0
          ) ?? 0;
        const completedCount = completedLessonIds.size;
        const progressPercent =
          totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

        const coverImageUrl = course.coverImage?.asset
          ? urlFor(course.coverImage).width(96).height(96).fit("crop").url()
          : null;

        return {
          _id: course._id,
          title: course.title,
          slug: course.slug,
          summary: course.summary,
          coverImageUrl,
          progressPercent,
          completedCount,
          totalLessons,
        };
      });
    } catch (err) {
      console.error("[MyLearningPage] Error fetching learner progress:", err);
    }
  }

  const hasCourses = coursesWithProgress.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />
      <main className="mx-auto w-full max-w-[900px] flex-1 px-6 py-12">
        <h1
          className="mb-2 text-3xl font-bold text-neutral-900 md:text-4xl"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          My Learning
        </h1>
        <p className="mb-10 text-sm text-neutral-500">
          {hasCourses
            ? "Pick up right where you left off across your active courses."
            : "Your courses and progress will appear here."}
        </p>

        {hasCourses ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {coursesWithProgress.map((c) => (
              <div
                key={c._id}
                className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-neutral-900 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden shadow-xs">
                      {c.coverImageUrl ? (
                        <Image
                          src={c.coverImageUrl}
                          alt={c.title}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl">{c.title.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-neutral-900 leading-snug truncate">
                        {c.title}
                      </h2>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                        {c.summary || "In progress"}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="my-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-neutral-900">
                        {c.progressPercent}% complete
                      </span>
                      <span className="text-neutral-500">
                        {c.completedCount} of {c.totalLessons} lessons
                      </span>
                    </div>
                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-300"
                        style={{ width: `${c.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  {c.progressPercent === 100 ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <CheckCircleIcon className="w-4 h-4" />
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600">
                      <PlayCircleIcon className="w-4 h-4 text-primary-500" />
                      In Progress
                    </span>
                  )}
                  <Link
                    href={`/courses/${c.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700 hover:text-primary-600 transition-colors"
                  >
                    <span>Resume Course</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-16 text-center">
            <h2 className="mb-2 text-lg font-semibold text-neutral-900">
              You have not started a course yet
            </h2>
            <p className="mb-8 max-w-md text-sm text-neutral-500">
              Explore the catalog and start a lesson to begin tracking your
              learning. All beginner progress starts at 0%.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#EA580C]"
            >
              Browse courses
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
