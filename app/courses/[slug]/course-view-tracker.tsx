'use client'

import { useEffect } from 'react'
import { trackCourseViewed } from '@/app/lib/analytics-client'

interface CourseViewTrackerProps {
  courseId: string
  courseSlug: string
  courseTitle: string
  level: string | null
}

export function CourseViewTracker({
  courseId,
  courseSlug,
  courseTitle,
  level,
}: CourseViewTrackerProps) {
  useEffect(() => {
    trackCourseViewed({
      course_id: courseId,
      course_slug: courseSlug,
      course_title: courseTitle,
      level,
    })
  }, [courseId, courseSlug, courseTitle, level])

  return null
}
