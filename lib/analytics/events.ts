/**
 * Shared PostHog Event Catalogue for Msingi
 * All event names and payload schemas are defined here so names and keys are spelled once.
 */

export const EVENTS = {
  // Search
  SEARCH_PERFORMED: 'search_performed',
  SEARCH_FAILED: 'search_failed',
  SEARCH_RESULT_OPENED: 'search_result_opened',

  // Video & Lesson
  VIDEO_PLAYED: 'video_played',
  VIDEO_PROGRESS: 'video_progress',
  LESSON_COMPLETED: 'lesson_completed',
  LESSON_RESUMED: 'lesson_resumed',
  LESSON_NAVIGATED: 'lesson_navigated',

  // Navigation & Catalog
  CATALOG_VIEWED: 'catalog_viewed',
  COURSE_VIEWED: 'course_viewed',
  COURSE_RESUMED: 'course_resumed',
} as const

export type EventName = (typeof EVENTS)[keyof typeof EVENTS]

export interface SearchPerformedProps {
  query: string
  zero_results: boolean
  lesson_result_count: number
  video_result_count?: number
  duration_ms: number
  signed_in: boolean
  total_results?: number
  courses_count?: number
  sort?: string
}

export interface SearchFailedProps {
  query: string
  reason: 'timeout' | 'upstream_error' | 'validation_error' | 'internal_error'
  duration_ms: number
  signed_in: boolean
}

export interface SearchResultOpenedProps {
  result_kind: 'video' | 'lesson'
  rank: number
  position: number
  query: string
  lesson_id?: string
  lesson_slug?: string
  lesson_title?: string
  course_id?: string
  course_slug?: string
  course_title?: string
  timestamp_seconds?: number
  href?: string
}

export interface VideoPlayedProps {
  provider: 'youtube' | 'vimeo' | 'bunny' | string
  course_slug: string
  duration_seconds: number
  source: 'deep_link' | 'poster_click'
  lesson_slug?: string
  lesson_id?: string
  lesson_title?: string
  start_seconds?: number
}

export interface VideoProgressProps {
  lesson_slug: string
  course_slug: string
  percent: 25 | 50 | 75 | 95
  elapsed_seconds: number
  duration_seconds: number
}

export interface LessonCompletedProps {
  lesson_slug: string
  course_slug: string
  lesson_id?: string
  lesson_title?: string
  source?: 'watch_threshold' | 'manual_toggle' | 'navigation'
}

export interface LessonResumedProps {
  lesson_slug: string
  course_slug: string
  start_seconds: number
  source: 'deep_link'
}

export interface LessonNavigatedProps {
  from_lesson_slug: string
  to_lesson_slug: string
  direction: 'next' | 'prev'
  course_slug: string
}

export interface CatalogViewedProps {
  total_courses?: number
}

export interface CourseViewedProps {
  course_slug: string
  course_title?: string
  course_id?: string
  level?: string | null
}

export interface CourseResumedProps {
  course_slug: string
  location: 'header' | 'sticky_bar'
  target_lesson_slug?: string
}
