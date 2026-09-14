import React from 'react'
import Image from 'next/image'

interface CourseBadgeProps {
  courseTitle: string
  courseCoverUrl?: string | null
  className?: string
}

export function CourseBadge({ courseTitle, courseCoverUrl, className = '' }: CourseBadgeProps) {
  const lower = courseTitle.toLowerCase()

  const renderIcon = () => {
    if (lower.includes('next')) {
      return (
        <div className="w-5 h-5 rounded bg-black flex items-center justify-center flex-shrink-0 text-white font-bold text-[11px] leading-none select-none">
          N
        </div>
      )
    }

    if (lower.includes('react')) {
      return (
        <div className="w-5 h-5 rounded bg-[#087ea4]/10 text-[#087ea4] flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
            <circle cx="0" cy="0" r="2.05" />
            <g stroke="currentColor" strokeWidth="1" fill="none">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
        </div>
      )
    }

    if (lower.includes('node')) {
      return (
        <div className="w-5 h-5 rounded bg-[#16a34a]/10 text-[#16a34a] flex items-center justify-center flex-shrink-0 font-bold text-[9px] border border-[#16a34a]/20">
          JS
        </div>
      )
    }

    if (lower.includes('javascript') || lower.includes('js')) {
      return (
        <div className="w-5 h-5 rounded bg-[#F7DF1E] text-[#1a1a1a] flex items-center justify-center flex-shrink-0 font-bold text-[9px]">
          JS
        </div>
      )
    }

    if (lower.includes('python')) {
      return (
        <div className="w-5 h-5 rounded bg-[#3776AB]/10 text-[#3776AB] flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
          Py
        </div>
      )
    }

    if (lower.includes('docker') || lower.includes('cloud')) {
      return (
        <div className="w-5 h-5 rounded bg-[#2496ED]/10 text-[#2496ED] flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
          ☁
        </div>
      )
    }

    if (courseCoverUrl) {
      return (
        <div className="w-5 h-5 rounded overflow-hidden relative flex-shrink-0 bg-neutral-100">
          <Image
            src={courseCoverUrl}
            alt={courseTitle}
            width={20}
            height={20}
            className="w-full h-full object-cover"
          />
        </div>
      )
    }

    return (
      <div className="w-5 h-5 rounded bg-[#F97316]/10 text-[#F97316] flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
        {courseTitle.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {renderIcon()}
      <span className="text-xs font-medium text-[#334155] truncate max-w-[280px]">
        {courseTitle}
      </span>
    </div>
  )
}
