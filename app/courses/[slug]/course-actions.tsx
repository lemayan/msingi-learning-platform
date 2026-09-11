"use client";

import posthog from "posthog-js";
import { ArrowRightIcon, BookmarkIcon } from "@/app/components/icons";

interface CourseActionsProps {
  courseId: string;
  courseSlug: string;
  courseLevel: string | null;
}

export function CourseActions({
  courseId,
  courseSlug,
  courseLevel,
}: CourseActionsProps) {
  const properties = {
    course_id: courseId,
    course_slug: courseSlug,
    course_level: courseLevel,
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={() => posthog.capture("course_learning_clicked", properties)}
        className="inline-flex items-center gap-2 bg-primary-500 hover:bg-[#EA580C] text-white text-sm font-medium px-6 py-3 rounded-full transition-colors"
      >
        Continue Learning
        <ArrowRightIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => posthog.capture("course_bookmark_clicked", properties)}
        className="inline-flex items-center gap-2 border border-neutral-200 text-neutral-700 text-sm font-medium px-5 py-3 rounded-full hover:bg-neutral-50 transition-colors"
      >
        <BookmarkIcon />
        Bookmark
      </button>
    </div>
  );
}
