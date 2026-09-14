'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CourseBadge } from './course-badge'
import { VideoResult } from '@/app/lib/search/types'
import { trackSearchResultOpened } from '@/app/lib/analytics-client'

interface VideoResultCardProps {
  result: VideoResult
  rank: number
  position: number
  query: string
}

export function VideoResultCard({ result, rank, position, query }: VideoResultCardProps) {
  const handleClick = () => {
    trackSearchResultOpened({
      result_kind: 'video',
      rank,
      position,
      query,
      lesson_id: result.id,
      lesson_slug: result.lessonSlug,
      lesson_title: result.lessonTitle,
      course_slug: result.courseSlug,
      course_title: result.courseTitle,
      timestamp_seconds: result.timestampSeconds,
      href: result.href,
    })
  }

  const durationBadge = result.timestampFormatted || '00:00'

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5 items-stretch">
      {/* ── Left: Video Thumbnail ────────────────────────────────────────── */}
      <Link
        href={result.href}
        onClick={handleClick}
        className="relative w-full md:w-[224px] aspect-[16/9] rounded-xl overflow-hidden bg-[#0B0F19] flex-shrink-0 flex items-center justify-center group cursor-pointer border border-[#1E293B]"
      >
        {result.thumbnailUrl ? (
          <Image
            src={result.thumbnailUrl}
            alt={result.lessonTitle}
            fill
            sizes="(max-width: 768px) 100vw, 224px"
            className="object-cover transition-transform duration-300 group-hover:scale-105 opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-4 text-center">
            <span className="text-white/40 text-xs font-mono select-none">
              {result.courseTitle}
            </span>
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-white/25 backdrop-blur-xs border border-white/50 flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-lg">
            <svg
              className="w-4 h-4 ml-0.5 fill-white"
              viewBox="0 0 24 24"
            >
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </div>
        </div>

        {/* Timestamp / duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-white text-[11px] font-mono font-medium px-2 py-0.5 rounded-md shadow-sm">
          {durationBadge}
        </div>
      </Link>

      {/* ── Right: Card Details ──────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          {/* Header row: Course logo + VIDEO badge */}
          <div className="flex items-center justify-between gap-2">
            <CourseBadge
              courseTitle={result.courseTitle}
              courseCoverUrl={result.courseCoverUrl}
            />
            <span className="text-[#F97316] text-[11px] font-bold tracking-wider uppercase">
              VIDEO
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

        {/* Bottom row: Lesson/Module metadata & CTA action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1F5F9]">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] truncate">
            {/* Document icon */}
            <svg
              className="w-3.5 h-3.5 text-[#64748B] flex-shrink-0"
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
            <span className="font-medium text-[#334155]">
              Lesson {result.moduleIndex}.{result.lessonIndex}
            </span>
            <span className="text-[#CBD5E1]">·</span>
            {/* Folder icon */}
            <svg
              className="w-3.5 h-3.5 text-[#64748B] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span className="truncate max-w-[200px] text-[#64748B]">
              {result.moduleTitle}
            </span>
          </div>

          {/* Action CTA */}
          <Link
            href={result.href}
            onClick={handleClick}
            className="text-xs md:text-sm font-semibold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1.5 transition-colors group flex-shrink-0"
          >
            {/* Play circle icon */}
            <svg
              className="w-4 h-4 text-[#F97316] group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
            </svg>
            <span>Watch from {durationBadge}</span>
            <span className="text-xs">›</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
