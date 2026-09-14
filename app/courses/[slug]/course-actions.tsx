"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { ArrowRightIcon, BookmarkIcon } from "@/app/components/icons";
import { trackCourseResumed } from "@/app/lib/analytics-client";

interface CourseActionsProps {
  courseId: string;
  courseSlug: string;
  courseLevel: string | null;
  firstLessonSlug?: string | null;
}

export function CourseActions({
  courseId,
  courseSlug,
  courseLevel,
  firstLessonSlug,
}: CourseActionsProps) {
  const properties = {
    course_id: courseId,
    course_slug: courseSlug,
    course_level: courseLevel,
  };

  const targetHref = firstLessonSlug
    ? `/courses/${courseSlug}/lessons/${firstLessonSlug}`
    : `/courses/${courseSlug}#course-content`;

  const handleContinueLearning = () => {
    trackCourseResumed({
      course_slug: courseSlug,
      location: "header",
      target_lesson_slug: firstLessonSlug || undefined,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={targetHref}
        onClick={handleContinueLearning}
        className="inline-flex items-center gap-2 bg-primary-500 hover:bg-[#EA580C] text-white text-sm font-medium px-6 py-3 rounded-full transition-colors"
      >
        Continue Learning
        <ArrowRightIcon className="w-4 h-4" />
      </Link>
      <button
        type="button"
        onClick={() => posthog.capture("course_bookmark_clicked", properties)}
        className="inline-flex items-center gap-2 border border-neutral-200 text-neutral-700 text-sm font-medium px-5 py-3 rounded-full hover:bg-neutral-50 transition-colors"
      >
        <BookmarkIcon />
        Bookmark
      </button>
    </div>
  );
}
