'use client'

import posthog from 'posthog-js'
import {
  EVENTS,
  SearchPerformedProps,
  SearchFailedProps,
  SearchResultOpenedProps,
  VideoPlayedProps,
  VideoProgressProps,
  LessonCompletedProps,
  LessonResumedProps,
  LessonNavigatedProps,
  CatalogViewedProps,
  CourseViewedProps,
  CourseResumedProps,
} from '@/lib/analytics/events'

/**
 * Returns current PostHog distinct ID and session ID from the browser client.
 * Used to join server-side events to the learner's browser session.
 */
export function getPostHogSessionIds(): { distinctId?: string; sessionId?: string } {
  if (typeof window === 'undefined') return {}
  try {
    const distinctId = posthog.get_distinct_id()
    const sessionId = posthog.get_session_id()
    return {
      distinctId: distinctId || undefined,
      sessionId: sessionId || undefined,
    }
  } catch {
    return {}
  }
}

/**
 * Dispatches a client-side analytics event to PostHog.
 */
function captureEvent(event: string, properties: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  try {
    posthog.capture(event, properties)
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[analytics-client] Failed to capture "${event}":`, err)
    }
  }
}

export function trackSearchPerformed(props: SearchPerformedProps) {
  captureEvent(EVENTS.SEARCH_PERFORMED, {
    query: props.query,
    zero_results: props.zero_results,
    lesson_result_count: props.lesson_result_count,
    video_result_count: props.video_result_count ?? 0,
    duration_ms: props.duration_ms,
    signed_in: props.signed_in,
    total_results: props.total_results,
    courses_count: props.courses_count,
    sort: props.sort,
  })
}

export function trackSearchFailed(props: SearchFailedProps) {
  captureEvent(EVENTS.SEARCH_FAILED, {
    query: props.query,
    reason: props.reason,
    duration_ms: props.duration_ms,
    signed_in: props.signed_in,
  })
}

export function trackSearchResultOpened(props: SearchResultOpenedProps) {
  captureEvent(EVENTS.SEARCH_RESULT_OPENED, {
    result_kind: props.result_kind,
    rank: props.rank,
    position: props.position,
    query: props.query,
    lesson_id: props.lesson_id,
    lesson_slug: props.lesson_slug,
    lesson_title: props.lesson_title,
    course_id: props.course_id,
    course_slug: props.course_slug,
    course_title: props.course_title,
    timestamp_seconds: props.timestamp_seconds,
    href: props.href,
  })
}

export function trackVideoPlayed(props: VideoPlayedProps) {
  captureEvent(EVENTS.VIDEO_PLAYED, {
    provider: props.provider,
    course_slug: props.course_slug,
    duration_seconds: props.duration_seconds,
    source: props.source,
    lesson_slug: props.lesson_slug,
    lesson_id: props.lesson_id,
    lesson_title: props.lesson_title,
    start_seconds: props.start_seconds,
  })
}

export function trackVideoProgress(props: VideoProgressProps) {
  captureEvent(EVENTS.VIDEO_PROGRESS, {
    lesson_slug: props.lesson_slug,
    course_slug: props.course_slug,
    percent: props.percent,
    elapsed_seconds: props.elapsed_seconds,
    duration_seconds: props.duration_seconds,
  })
}

export function trackLessonCompleted(props: LessonCompletedProps) {
  captureEvent(EVENTS.LESSON_COMPLETED, {
    lesson_slug: props.lesson_slug,
    course_slug: props.course_slug,
    lesson_id: props.lesson_id,
    lesson_title: props.lesson_title,
    source: props.source ?? 'manual_toggle',
  })
}

export function trackLessonResumed(props: LessonResumedProps) {
  captureEvent(EVENTS.LESSON_RESUMED, {
    lesson_slug: props.lesson_slug,
    course_slug: props.course_slug,
    start_seconds: props.start_seconds,
    source: props.source,
  })
}

export function trackLessonNavigated(props: LessonNavigatedProps) {
  captureEvent(EVENTS.LESSON_NAVIGATED, {
    from_lesson_slug: props.from_lesson_slug,
    to_lesson_slug: props.to_lesson_slug,
    direction: props.direction,
    course_slug: props.course_slug,
  })
}

export function trackCatalogViewed(props?: CatalogViewedProps) {
  captureEvent(EVENTS.CATALOG_VIEWED, {
    total_courses: props?.total_courses,
  })
}

export function trackCourseViewed(props: CourseViewedProps) {
  captureEvent(EVENTS.COURSE_VIEWED, {
    course_slug: props.course_slug,
    course_title: props.course_title,
    course_id: props.course_id,
    level: props.level,
  })
}

export function trackCourseResumed(props: CourseResumedProps) {
  captureEvent(EVENTS.COURSE_RESUMED, {
    course_slug: props.course_slug,
    location: props.location,
    target_lesson_slug: props.target_lesson_slug,
  })
}

export function trackLessonTabSwitched(props: { lesson_slug: string; tab: string }) {
  captureEvent('lesson_tab_switched', {
    lesson_slug: props.lesson_slug,
    tab: props.tab,
  })
}

