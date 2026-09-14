'use client'

import React, { useRef, useEffect } from 'react'

interface SearchBarProps {
  query: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  isLoading?: boolean
}

export function SearchBar({ query, onChange, onSubmit, isLoading = false }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut: Cmd+K / Ctrl+K to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSubmit(query.trim())
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full relative shadow-sm rounded-2xl border border-[#E2E8F0] bg-white transition-all focus-within:ring-2 focus-within:ring-[#F97316]/20 focus-within:border-[#F97316]"
    >
      {/* Left Search Icon */}
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#64748B]">
        {isLoading ? (
          <svg
            className="animate-spin w-5 h-5 text-[#F97316]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}
      </div>

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="data fetching"
        aria-label="Search lessons and videos"
        className="w-full h-14 pl-12 pr-16 rounded-2xl bg-white text-[#0F172A] placeholder:text-[#94A3B8] text-base focus:outline-none"
      />

      {/* Right Shortcut Badge */}
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <div className="flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#64748B] select-none">
          ⌘ K
        </div>
      </div>
    </form>
  )
}
