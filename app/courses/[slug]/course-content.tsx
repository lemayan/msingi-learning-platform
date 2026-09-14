"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { ChevronDownIcon, PlayCircleIcon, CheckCircleIcon } from "@/app/components/icons";
import { formatDuration } from "@/app/lib/format-duration";

interface Lesson {
  _id: string;
  title: string;
  slug: string;
  duration: number | null;
  freePreview: boolean | null;
  studentCount: number | null;
}

interface Module {
  _key: string;
  title: string;
  summary: string | null;
  lessons: Lesson[];
}

interface CourseContentProps {
  courseSlug: string;
  modules: Module[];
  totalDuration: number;
}

export function CourseContent({ courseSlug, modules, totalDuration }: CourseContentProps) {
  const [showAll, setShowAll] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined" || !courseSlug) return new Set();
    try {
      const stored = localStorage.getItem(`msingi_progress_${courseSlug}`);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch {}
    return new Set();
  });

  useEffect(() => {
    fetch("/api/progress")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.progress) {
          const s = new Set<string>();
          for (const [id, r] of Object.entries(data.progress)) {
            if ((r as { completed?: boolean }).completed) s.add(id);
          }
          setCompletedLessonIds((prev) => new Set([...prev, ...s]));
        }
      })
      .catch(() => {});
  }, [courseSlug]);

  const INITIAL_COUNT = 6;
  const visibleModules = showAll ? modules : modules.slice(0, INITIAL_COUNT);
  const hasMore = modules.length > INITIAL_COUNT;

  const toggleModule = (key: string, moduleIndex: number, lessonCount: number) => {
    const next = new Set(expandedModules);
    const willExpand = !next.has(key);

    if (willExpand) {
      next.add(key);
    } else {
      next.delete(key);
    }

    setExpandedModules(next);
    posthog.capture("course_module_toggled", {
      course_slug: courseSlug,
      module_key: key,
      module_index: moduleIndex,
      lesson_count: lessonCount,
      expanded: willExpand,
    });
  };

  const toggleModuleVisibility = () => {
    const willShowAll = !showAll;
    setShowAll(willShowAll);
    posthog.capture("course_modules_visibility_toggled", {
      course_slug: courseSlug,
      module_count: modules.length,
      showing_all: willShowAll,
    });
  };

  return (
    <section className="max-w-[900px] mx-auto w-full px-6 py-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-2xl font-bold text-neutral-900"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Course Content
        </h2>
        <span className="text-sm text-neutral-500">
          {modules.length} modules · {formatDuration(totalDuration)}
        </span>
      </div>

      {/* Module list */}
      <div className="border border-neutral-200 rounded-xl bg-white shadow-sm overflow-hidden">
        {visibleModules.map((module, index) => {
          const moduleDuration = module.lessons?.reduce(
            (sum, l) => sum + (l.duration ?? 0),
            0
          ) ?? 0;
          const isExpanded = expandedModules.has(module._key);

          return (
            <div
              key={module._key}
              className={`flex flex-col ${
                index < visibleModules.length - 1 ? "border-b border-neutral-100" : ""
              }`}
            >
              <button
                onClick={() =>
                  toggleModule(module._key, index, module.lessons?.length ?? 0)
                }
                className="flex items-center gap-4 px-5 py-4 w-full text-left hover:bg-neutral-50 transition-colors focus:outline-none focus:bg-neutral-50"
              >
                {/* Module number */}
                <div className="flex-shrink-0 w-10 h-10 rounded-lg border border-neutral-200 bg-white flex items-center justify-center text-sm font-semibold text-neutral-900">
                  {index + 1}
                </div>

                {/* Module info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-neutral-900 leading-snug">
                    {module.title}
                  </h3>
                  {module.summary && (
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">
                      {module.summary}
                    </p>
                  )}
                </div>

                {/* Duration + chevron */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-medium text-neutral-500">
                    {formatDuration(moduleDuration)}
                  </span>
                  <ChevronDownIcon
                    className={`text-neutral-400 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Lessons list (Expanded State) */}
              {isExpanded && module.lessons?.length > 0 && (
                <div className="bg-[#FAF8F5] border-t border-neutral-100 px-5 py-3 flex flex-col gap-1">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <Link
                      key={lesson._id}
                      href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                      onClick={() =>
                        posthog.capture("course_lesson_selected", {
                          course_slug: courseSlug,
                          module_key: module._key,
                          module_index: index,
                          lesson_id: lesson._id,
                          lesson_slug: lesson.slug,
                          lesson_index: lessonIndex,
                          is_free_preview: lesson.freePreview ?? false,
                        })
                      }
                      className="flex items-center gap-3 py-2 px-3 -mx-3 rounded-md hover:bg-white hover:shadow-sm transition-all"
                    >
                      {completedLessonIds.has(lesson._id) ? (
                        <CheckCircleIcon className="text-emerald-600 w-4 h-4 flex-shrink-0" />
                      ) : (
                        <PlayCircleIcon className="text-neutral-400 w-4 h-4 flex-shrink-0" />
                      )}
                      <span className={`text-sm font-medium flex-1 ${completedLessonIds.has(lesson._id) ? "text-neutral-900 font-semibold" : "text-neutral-700"}`}>
                        {index + 1}.{lessonIndex + 1} {lesson.title}
                      </span>
                      {lesson.freePreview && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold text-[#F97316] bg-[#FFEDD5] rounded-full">
                          Preview
                        </span>
                      )}
                      <span className="text-xs text-neutral-500 tabular-nums">
                        {formatDuration(lesson.duration ?? 0)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show all toggle */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={toggleModuleVisibility}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors shadow-sm"
          >
            {showAll ? "Show less" : `Show all ${modules.length} modules`}
            <ChevronDownIcon
              className={`transition-transform ${showAll ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      )}
    </section>
  );
}
