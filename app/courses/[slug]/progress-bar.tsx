"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/app/components/icons";
import { trackCourseResumed } from "@/app/lib/analytics-client";

interface ProgressBarProps {
  courseSlug: string;
  firstLessonSlug?: string | null;
  totalLessons?: number;
}

const STORAGE_KEY_PREFIX = "msingi_progress_";

/**
 * Bottom sticky progress bar.
 * Always starts at 0% for a beginner and tracks real learner progress dynamically.
 */
export function ProgressBar({
  courseSlug,
  firstLessonSlug,
  totalLessons = 0,
}: ProgressBarProps) {
  const [progress, setProgress] = useState(() => {
    if (typeof window === "undefined" || !courseSlug || totalLessons <= 0) return 0;
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${courseSlug}`);
      if (stored) {
        const completedIds: string[] = JSON.parse(stored);
        if (Array.isArray(completedIds) && totalLessons > 0) {
          const pct = Math.round((completedIds.length / totalLessons) * 100);
          return Math.min(100, Math.max(0, pct));
        }
      }
    } catch {
      // ignore
    }
    return 0;
  });

  useEffect(() => {
    if (!courseSlug) return;

    // Fetch latest from /api/progress for authenticated users
    let isCancelled = false;
    fetch("/api/progress")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { progress?: Record<string, { completed: boolean }> } | null) => {
        if (isCancelled || !data?.progress || totalLessons <= 0) return;

        // Count completed lessons matching local course progress
        try {
          const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${courseSlug}`);
          const localIds = stored ? (JSON.parse(stored) as string[]) : [];
          const combined = new Set(localIds);

          for (const [id, record] of Object.entries(data.progress)) {
            if (record.completed) {
              combined.add(id);
            }
          }

          // Count completed that belong to this course
          const completedCount = combined.size;
          const pct = Math.round((completedCount / totalLessons) * 100);
          setProgress(Math.min(100, Math.max(0, pct)));
        } catch {
          // ignore
        }
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [courseSlug, totalLessons]);

  const targetHref = firstLessonSlug
    ? `/courses/${courseSlug}/lessons/${firstLessonSlug}`
    : `/courses/${courseSlug}#course-content`;

  const handleContinueLearning = () => {
    trackCourseResumed({
      course_slug: courseSlug,
      location: "sticky_bar",
      target_lesson_slug: firstLessonSlug || undefined,
    });
  };

  return (
    <div className="sticky bottom-0 z-40 bg-white border-t border-neutral-200 px-6 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="max-w-[900px] mx-auto flex items-center justify-between gap-6">
        {/* Left: progress info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-neutral-500 mb-1">Your Progress</p>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-neutral-900 whitespace-nowrap">
              {progress}% complete
            </span>
            <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden max-w-[240px]">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: CTA */}
        <Link
          href={targetHref}
          onClick={handleContinueLearning}
          className="flex-shrink-0 inline-flex items-center gap-2 bg-primary-500 hover:bg-[#EA580C] text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
        >
          Continue Learning
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
