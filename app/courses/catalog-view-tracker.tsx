'use client'

import { useEffect } from 'react'
import { trackCatalogViewed } from '@/app/lib/analytics-client'

interface CatalogViewTrackerProps {
  totalCourses: number
}

export function CatalogViewTracker({ totalCourses }: CatalogViewTrackerProps) {
  useEffect(() => {
    trackCatalogViewed({
      total_courses: totalCourses,
    })
  }, [totalCourses])

  return null
}
