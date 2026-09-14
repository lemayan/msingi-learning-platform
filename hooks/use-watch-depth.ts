'use client'

import { useEffect, useRef, useState } from 'react'
import { trackVideoProgress, trackLessonCompleted } from '@/app/lib/analytics-client'

interface UseWatchDepthOptions {
  isPlaying: boolean
  durationSeconds: number
  lessonSlug: string
  courseSlug: string
  lessonId?: string
  lessonTitle?: string
  onComplete?: () => void
}

/**
 * useWatchDepth Hook
 * Measures active video playback elapsed time.
 * - Ignores elapsed time when the tab is hidden (document.visibilityState === 'hidden').
 * - Fires `video_progress` at 25%, 50%, 75%, and 95% milestones (latched once per mount).
 * - Fires `lesson_completed` at 95% milestone (latched once per mount).
 */
export function useWatchDepth({
  isPlaying,
  durationSeconds,
  lessonSlug,
  courseSlug,
  lessonId,
  lessonTitle,
  onComplete,
}: UseWatchDepthOptions) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const firedMilestones = useRef<Set<number>>(new Set())
  const hasCompletedAt95 = useRef<boolean>(false)

  useEffect(() => {
    if (!isPlaying || durationSeconds <= 0) return

    let lastTick = performance.now()

    const interval = setInterval(() => {
      const now = performance.now()
      const deltaSeconds = (now - lastTick) / 1000
      lastTick = now

      // Time on a hidden tab doesn't count
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return
      }

      setElapsedSeconds((prev) => {
        const next = prev + deltaSeconds
        const percent = Math.min(100, Math.floor((next / durationSeconds) * 100))

        // Check milestones: 25, 50, 75, 95
        const milestones = [25, 50, 75, 95] as const
        for (const m of milestones) {
          if (percent >= m && !firedMilestones.current.has(m)) {
            firedMilestones.current.add(m)
            trackVideoProgress({
              lesson_slug: lessonSlug,
              course_slug: courseSlug,
              percent: m,
              elapsed_seconds: Math.round(next),
              duration_seconds: durationSeconds,
            })

            // At 95%, trigger lesson completion (latched once per mount)
            if (m === 95 && !hasCompletedAt95.current) {
              hasCompletedAt95.current = true
              trackLessonCompleted({
                lesson_slug: lessonSlug,
                course_slug: courseSlug,
                lesson_id: lessonId,
                lesson_title: lessonTitle,
                source: 'watch_threshold',
              })
              onComplete?.()
            }
          }
        }

        return next
      })
    }, 250)

    return () => {
      clearInterval(interval)
    }
  }, [isPlaying, durationSeconds, lessonSlug, courseSlug, lessonId, lessonTitle, onComplete])

  return {
    elapsedSeconds: Math.round(elapsedSeconds),
    percentWatched: durationSeconds > 0 ? Math.min(100, Math.floor((elapsedSeconds / durationSeconds) * 100)) : 0,
  }
}
