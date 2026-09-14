"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { CourseData } from "@/app/courses/[slug]/lessons/[lessonSlug]/lesson-view";

const STORAGE_KEY_PREFIX = "msingi_progress_";

interface ProgressRecord {
  completed: boolean;
  resumePosition?: number;
}

export function useCourseProgress(course: CourseData | null) {
  const courseSlug = course?.slug || "";

  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined" || !courseSlug) return new Set();
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${courseSlug}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return new Set(parsed);
        }
      }
    } catch {
      // LocalStorage access error ignored
    }
    return new Set();
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Flatten all lesson IDs for this course
  const allCourseLessonIds = useMemo(() => {
    if (!course?.modules) return [];
    const ids: string[] = [];
    for (const mod of course.modules) {
      if (mod.lessons) {
        for (const l of mod.lessons) {
          if (l._id) ids.push(l._id);
        }
      }
    }
    return ids;
  }, [course]);

  // Load progress from backend on mount
  useEffect(() => {
    if (!courseSlug) return;

    // Fetch server progress for authenticated user
    let isCancelled = false;
    fetch("/api/progress")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { progress?: Record<string, ProgressRecord> } | null) => {
        if (isCancelled || !data?.progress) return;

        const serverCompleted = new Set<string>();
        // Add existing local ones
        try {
          const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${courseSlug}`);
          if (stored) {
            const parsed: string[] = JSON.parse(stored);
            parsed.forEach((id) => serverCompleted.add(id));
          }
        } catch {
          // ignore
        }

        // Add server completed records matching course lessons
        for (const [id, record] of Object.entries(data.progress)) {
          if (record.completed && allCourseLessonIds.includes(id)) {
            serverCompleted.add(id);
          }
        }

        setCompletedLessonIds(serverCompleted);
        setIsLoaded(true);

        // Sync local cache
        try {
          localStorage.setItem(
            `${STORAGE_KEY_PREFIX}${courseSlug}`,
            JSON.stringify(Array.from(serverCompleted))
          );
        } catch {
          // ignore
        }
      })
      .catch(() => {
        if (!isCancelled) setIsLoaded(true);
      });

    return () => {
      isCancelled = true;
    };
  }, [courseSlug, allCourseLessonIds]);

  // Toggle completion of a lesson
  const toggleLessonCompletion = useCallback(
    async (lessonId: string): Promise<boolean> => {
      const isCurrentlyCompleted = completedLessonIds.has(lessonId);
      const nextCompleted = !isCurrentlyCompleted;

      // 1. Optimistic state update
      setCompletedLessonIds((prev) => {
        const next = new Set(prev);
        if (nextCompleted) {
          next.add(lessonId);
        } else {
          next.delete(lessonId);
        }

        // Update local storage
        try {
          if (courseSlug) {
            localStorage.setItem(
              `${STORAGE_KEY_PREFIX}${courseSlug}`,
              JSON.stringify(Array.from(next))
            );
          }
        } catch {
          // ignore
        }

        return next;
      });

      // 2. Persist to server route
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId,
            completed: nextCompleted,
          }),
        });
      } catch (err) {
        console.error("Failed to persist lesson progress to /api/progress:", err);
      }

      return nextCompleted;
    },
    [completedLessonIds, courseSlug]
  );

  // Explicitly mark a lesson as completed (e.g. video ended)
  const markLessonCompleted = useCallback(
    async (lessonId: string) => {
      if (completedLessonIds.has(lessonId)) return;
      await toggleLessonCompletion(lessonId);
    },
    [completedLessonIds, toggleLessonCompletion]
  );

  // Compute percentage (always 0% for beginner with 0 completed lessons)
  const totalLessons = allCourseLessonIds.length;
  const completedCount = allCourseLessonIds.filter((id) =>
    completedLessonIds.has(id)
  ).length;

  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Check if a module is completed (all its lessons are completed)
  const isModuleCompleted = useCallback(
    (lessons: { _id: string }[] | undefined): boolean => {
      if (!lessons || lessons.length === 0) return false;
      return lessons.every((l) => completedLessonIds.has(l._id));
    },
    [completedLessonIds]
  );

  const isLessonCompleted = useCallback(
    (lessonId: string): boolean => {
      return completedLessonIds.has(lessonId);
    },
    [completedLessonIds]
  );

  return {
    progressPercent,
    completedCount,
    totalLessons,
    isLessonCompleted,
    isModuleCompleted,
    toggleLessonCompletion,
    markLessonCompleted,
    isLoaded,
  };
}
