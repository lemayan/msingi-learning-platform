"use client";

import { useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { ChevronDownIcon, ChevronRightIcon } from "@/app/components/icons";
import { formatDuration } from "@/app/lib/format-duration";

interface SidebarLesson {
  _id: string;
  title: string;
  slug: string;
  duration: number | null;
}

interface SidebarModule {
  _key: string;
  title: string;
  lessons: SidebarLesson[];
}

interface LessonSidebarProps {
  courseSlug: string;
  courseTitle: string;
  modules: SidebarModule[];
  currentLessonSlug: string;
}

export function LessonSidebar({
  courseSlug,
  courseTitle,
  modules,
  currentLessonSlug,
}: LessonSidebarProps) {
  const currentModuleKey = modules.find((m) =>
    m.lessons.some((l) => l.slug === currentLessonSlug),
  )?._key;

  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(currentModuleKey ? [currentModuleKey] : []),
  );

  const toggleModule = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="flex flex-col">
      {/* Back to course */}
      <Link
        href={`/courses/${courseSlug}`}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-[#EA580C]"
      >
        <ChevronRightIcon className="h-3 w-3 rotate-180" />
        Back to course
      </Link>

      {/* Course card */}
      <div className="mb-4 flex items-center gap-3 border-b border-neutral-200 pb-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-lg font-light text-white">
          {courseTitle.charAt(0)}
        </div>
        <h2 className="text-sm font-semibold leading-snug text-neutral-900">
          {courseTitle}
        </h2>
      </div>

      {/* Module list */}
      <div className="flex flex-col">
        {modules.map((module, moduleIndex) => {
          const isExpanded = expanded.has(module._key);
          const moduleDuration = module.lessons.reduce(
            (sum, l) => sum + (l.duration ?? 0),
            0,
          );

          return (
            <div key={module._key} className="border-b border-neutral-100">
              <button
                type="button"
                onClick={() => toggleModule(module._key)}
                className="flex w-full items-center gap-3 py-3 text-left"
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-neutral-200 text-xs font-semibold text-neutral-900">
                  {moduleIndex + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-neutral-900">
                    {module.title}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {formatDuration(moduleDuration)}
                  </p>
                </div>
                <ChevronDownIcon
                  className={`text-neutral-400 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isExpanded && module.lessons.length > 0 && (
                <ul className="flex flex-col gap-1 pb-3 pl-10">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const isCurrent = lesson.slug === currentLessonSlug;
                    const label = `${moduleIndex + 1}.${lessonIndex + 1}`;

                    if (isCurrent) {
                      return (
                        <li
                          key={lesson._id}
                          className="flex items-center gap-2 rounded-md bg-primary-100 px-3 py-2"
                        >
                          <span className="flex h-2 w-2 flex-shrink-0 rounded-full bg-primary-500" />
                          <span className="flex-1 text-sm font-medium text-neutral-900">
                            {label} {lesson.title}
                          </span>
                          <span className="text-xs font-medium text-primary-500">
                            Now playing
                          </span>
                        </li>
                      );
                    }

                    return (
                      <li key={lesson._id}>
                        <Link
                          href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                          onClick={() =>
                            posthog.capture("course_lesson_selected", {
                              course_slug: courseSlug,
                              lesson_id: lesson._id,
                              lesson_slug: lesson.slug,
                              source: "lesson_sidebar",
                            })
                          }
                          className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-neutral-50"
                        >
                          <span className="flex h-2 w-2 flex-shrink-0 rounded-full border border-neutral-300" />
                          <span className="flex-1 text-sm text-neutral-700">
                            {label} {lesson.title}
                          </span>
                          <span className="text-xs text-neutral-400 tabular-nums">
                            {formatDuration(lesson.duration ?? 0)}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
