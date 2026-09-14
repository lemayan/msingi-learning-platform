'use client'

import React from 'react'
import Link from 'next/link'
import { CourseBadge } from './course-badge'
import { LessonResult } from '@/app/lib/search/types'
import { trackSearchResultOpened } from '@/app/lib/analytics-client'

interface LessonResultCardProps {
  result: LessonResult
  rank: number
  position: number
  query: string
}

export function LessonResultCard({ result, rank, position, query }: LessonResultCardProps) {
  const handleClick = () => {
    trackSearchResultOpened({
      result_kind: 'lesson',
      rank,
      position,
      query,
      lesson_id: result.id,
      lesson_slug: result.lessonSlug,
      lesson_title: result.lessonTitle,
      course_slug: result.courseSlug,
      course_title: result.courseTitle,
      href: result.href,
    })
  }

  // Display top 3 key points or fallback topics
  const displayPoints =
    result.keyPoints && result.keyPoints.length > 0
      ? result.keyPoints.slice(0, 3)
      : [
          'Core concepts & syntax',
          'Practical implementation',
          'Production best practices',
        ]

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5 items-stretch">
      {/* ── Left: Key points preview box ─────────────────────────────────── */}
      <div className="w-full md:w-[224px] rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] p-4 flex-shrink-0 flex flex-col justify-between">
        <div>
          {/* Top icon */}
          <div className="mb-3">
            <svg
              className="w-4 h-4 text-[#64748B]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>

          {/* Bullet list */}
          <ul className="space-y-2 text-xs text-[#334155] leading-snug">
            {displayPoints.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-[#94A3B8] select-none">•</span>
                <span className="line-clamp-2">{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Circular checkmark badge in bottom-right */}
        <div className="self-end mt-3">
          <div className="w-5 h-5 rounded-full bg-[#475569] text-white flex items-center justify-center shadow-xs">
            <svg
              className="w-3 h-3 stroke-white stroke-[2.5]"
              viewBox="0 0 24 24"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Right: Card Details ──────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          {/* Header row: Course logo + LESSON badge */}
          <div className="flex items-center justify-between gap-2">
            <CourseBadge
              courseTitle={result.courseTitle}
              courseCoverUrl={result.courseCoverUrl}
            />
            <span className="text-[#6366F1] text-[11px] font-bold tracking-wider uppercase">
              LESSON
            </span>
          </div>

          {/* Lesson Title */}
          <h3 className="text-base md:text-lg font-bold text-[#0F172A] mt-2 mb-1 hover:text-[#F97316] transition-colors">
            <Link href={result.href} onClick={handleClick}>
              {result.lessonTitle}
            </Link>
          </h3>

          {/* Description */}
          <p className="text-xs md:text-sm text-[#64748B] leading-relaxed line-clamp-2 mb-3">
            {result.description}
          </p>
        </div>

        {/* Bottom row: Module label & View lesson CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1F5F9]">
          <span className="text-xs font-medium text-[#64748B]">
            Module {result.moduleIndex}
          </span>

          <Link
            href={result.href}
            onClick={handleClick}
            className="text-xs md:text-sm font-semibold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1.5 transition-colors group flex-shrink-0"
          >
            <span>View lesson</span>
            {/* External link icon */}
            <svg
              className="w-3.5 h-3.5 text-[#F97316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span className="text-xs">›</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
