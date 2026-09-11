"use client";

import { ArrowRightIcon } from "@/app/components/icons";
import posthog from "posthog-js";

/**
 * Presentational-only sticky progress bar.
 * Displays a static 35% completion. No backend wired (AGENTS.md §7).
 */
export function ProgressBar({ courseSlug }: { courseSlug: string }) {
  const progress = 0;

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
                className="h-full bg-primary-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: CTA */}
        <button
          onClick={() =>
            posthog.capture("course_started", {
              course_slug: courseSlug,
              source: "sticky_progress_bar",
              progress_percent: progress,
            })
          }
          className="flex-shrink-0 inline-flex items-center gap-2 bg-primary-500 hover:bg-[#EA580C] text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
        >
          Start Course
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
