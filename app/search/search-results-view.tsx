'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { SearchResponse, VideoResult, LessonResult } from '@/app/lib/search/types'
import { trackSearchPerformed, getPostHogSessionIds } from '@/app/lib/analytics-client'
import { SearchBar } from './search-bar'
import { VideoResultCard } from './video-result-card'
import { LessonResultCard } from './lesson-result-card'

interface SearchResultsViewProps {
  initialResponse: SearchResponse
  initialQuery: string
  initialSort: 'relevance' | 'duration' | 'newest'
}

export function SearchResultsView({
  initialResponse,
  initialQuery,
  initialSort,
}: SearchResultsViewProps) {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const [isPending, startTransition] = useTransition()

  const [queryInput, setQueryInput] = useState(initialQuery)
  const [sort, setSort] = useState<'relevance' | 'duration' | 'newest'>(initialSort)

  // Track search performed via PostHog
  useEffect(() => {
    if (initialQuery) {
      trackSearchPerformed({
        query: initialQuery,
        zero_results: initialResponse.totalCount === 0,
        lesson_result_count: initialResponse.lessonResults.length,
        video_result_count: initialResponse.videoResults.length,
        duration_ms: 0,
        signed_in: Boolean(isSignedIn),
        total_results: initialResponse.totalCount,
        courses_count: initialResponse.courseCount,
        sort,
      })

      // Send browser distinct ID and session ID to /api/search to join server search event to session
      const { distinctId, sessionId } = getPostHogSessionIds()
      fetch(`/api/search?q=${encodeURIComponent(initialQuery)}&sort=${sort}`, {
        headers: {
          ...(distinctId ? { 'x-posthog-distinct-id': distinctId } : {}),
          ...(sessionId ? { 'x-posthog-session-id': sessionId } : {}),
        },
      }).catch(() => {})
    }
  }, [
    initialQuery,
    initialResponse.totalCount,
    initialResponse.courseCount,
    initialResponse.lessonResults.length,
    initialResponse.videoResults.length,
    sort,
    isSignedIn,
  ])

  // Map results for quick lookup to maintain ranked order
  const videoMap = new Map<string, VideoResult>()
  initialResponse.videoResults.forEach((v) => videoMap.set(v.id, v))

  const lessonMap = new Map<string, LessonResult>()
  initialResponse.lessonResults.forEach((l) => lessonMap.set(l.id, l))

  type DisplayCard =
    | { kind: 'video'; item: VideoResult; sortVal: number }
    | { kind: 'lesson'; item: LessonResult; sortVal: number }

  // Sorted items based on current sort state
  const getSortedCards = (): DisplayCard[] => {
    // If unified ranked results exist
    if (initialResponse.results && initialResponse.results.length > 0) {
      const cards: DisplayCard[] = []
      for (const card of initialResponse.results) {
        if (card.kind === 'video') {
          const video =
            videoMap.get(card.lessonId) ||
            videoMap.get(`${card.lessonId}-${card.timestampSeconds}`) ||
            initialResponse.videoResults.find((v) => v.lessonSlug === card.lessonSlug)
          if (video) {
            cards.push({ kind: 'video', item: video, sortVal: card.durationSeconds })
          }
        } else if (card.kind === 'lesson') {
          const lesson =
            lessonMap.get(card.lessonId) ||
            initialResponse.lessonResults.find((l) => l.lessonSlug === card.lessonSlug)
          if (lesson) {
            cards.push({ kind: 'lesson', item: lesson, sortVal: card.durationSeconds })
          }
        }
      }

      if (sort === 'duration') {
        cards.sort((a, b) => a.sortVal - b.sortVal)
      } else if (sort === 'newest') {
        cards.sort((a, b) => b.item.score - a.item.score)
      }

      return cards
    }

    // Fallback if results array is not present
    const cards: DisplayCard[] = [
      ...initialResponse.videoResults.map((v) => ({
        kind: 'video' as const,
        item: v,
        sortVal: v.clipDurationSeconds,
      })),
      ...initialResponse.lessonResults.map((l) => ({
        kind: 'lesson' as const,
        item: l,
        sortVal: l.duration,
      })),
    ]

    if (sort === 'duration') {
      cards.sort((a, b) => a.sortVal - b.sortVal)
    } else {
      cards.sort((a, b) => b.item.score - a.item.score)
    }

    return cards
  }

  const sortedCards = getSortedCards()

  const handleSearchSubmit = (newQuery: string) => {
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(newQuery)}&sort=${sort}`)
    })
  }

  const handleSortChange = (newSort: 'relevance' | 'duration' | 'newest') => {
    setSort(newSort)
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(initialQuery)}&sort=${newSort}`)
    })
  }

  return (
    <div className="w-full max-w-[860px] mx-auto px-4 sm:px-6 py-10 md:py-14">
      {/* ── 1. Centered Header Section ─────────────────────────────────── */}
      <div className="flex flex-col items-center text-center mb-8">
        {/* Pill Tag */}
        <div className="inline-flex items-center rounded-full border border-[#F97316]/20 bg-[#FFEDD5]/60 px-3 py-1 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#F97316]">
            SEARCH RESULTS
          </span>
        </div>

        {/* Serif Heading */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-2.5"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Results for{' '}
          <span className="text-[#F97316]">
            “{initialQuery || 'everything'}”
          </span>
        </h1>

        {/* Count Subtitle */}
        <p className="text-sm md:text-base text-[#64748B]">
          Found {initialResponse.totalCount} result
          {initialResponse.totalCount === 1 ? '' : 's'} across{' '}
          {initialResponse.courseCount} course
          {initialResponse.courseCount === 1 ? '' : 's'}
        </p>
      </div>

      {/* ── 2. Search Input Bar ────────────────────────────────────────── */}
      <div className="mb-8">
        <SearchBar
          query={queryInput}
          onChange={setQueryInput}
          onSubmit={handleSearchSubmit}
          isLoading={isPending}
        />
      </div>

      {/* ── 3. Results Bar: Count & Sort Control ──────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-[#0F172A]">
          {initialResponse.totalCount} results
        </span>

        <div className="relative inline-flex items-center">
          <select
            value={sort}
            onChange={(e) =>
              handleSortChange(e.target.value as 'relevance' | 'duration' | 'newest')
            }
            aria-label="Sort search results"
            className="appearance-none bg-white border border-[#E2E8F0] rounded-lg pl-3 pr-8 py-1.5 text-xs sm:text-sm font-medium text-[#0F172A] shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316]"
          >
            <option value="relevance">Most Relevant</option>
            <option value="duration">Duration</option>
            <option value="newest">Newest</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[#64748B]">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── 4. Results List ────────────────────────────────────────────── */}
      {sortedCards.length > 0 ? (
        <div className="flex flex-col gap-4">
          {sortedCards.map(({ kind, item }, idx) => {
            if (kind === 'video') {
              return (
                <VideoResultCard
                  key={`video-${item.id}-${idx}`}
                  result={item}
                  rank={idx + 1}
                  position={idx + 1}
                  query={initialQuery}
                />
              )
            }

            if (kind === 'lesson') {
              return (
                <LessonResultCard
                  key={`lesson-${item.id}-${idx}`}
                  result={item}
                  rank={idx + 1}
                  position={idx + 1}
                  query={initialQuery}
                />
              )
            }

            return null
          })}
        </div>
      ) : (
        /* ── Empty State ─────────────────────────────────────────────────── */
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center my-6 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#F1F5F9] text-[#64748B] mx-auto flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6"
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
          </div>
          <h3 className="text-lg font-bold text-[#0F172A] mb-1">
            No results found for “{initialQuery}”
          </h3>
          <p className="text-sm text-[#64748B] max-w-[420px] mx-auto mb-6">
            We couldn&apos;t find any lessons or video moments matching your query.
            Try searching for broader keywords like &ldquo;data&rdquo;, &ldquo;react&rdquo;, or &ldquo;components&rdquo;.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-xl bg-[#F97316] hover:bg-[#EA580C] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors"
          >
            Explore all courses
          </Link>
        </div>
      )}

      {/* ── 5. Bottom Help Callout Banner ──────────────────────────────── */}
      <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl p-5 md:p-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4 text-left w-full sm:w-auto">
          <div className="w-11 h-11 rounded-full bg-[#FFEDD5] flex items-center justify-center flex-shrink-0 text-[#F97316]">
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
          </div>
          <div>
            <h4 className="text-sm md:text-base font-bold text-[#0F172A]">
              Can&apos;t find what you&apos;re looking for?
            </h4>
            <p className="text-xs md:text-sm text-[#64748B]">
              Try different keywords or browse our full course catalog.
            </p>
          </div>
        </div>

        <Link
          href="/courses"
          className="bg-white hover:bg-neutral-50 text-[#0F172A] border border-[#E2E8F0] font-medium text-xs md:text-sm px-5 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-colors flex-shrink-0 whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          <span>Browse all courses</span>
          <span className="text-[#F97316]">→</span>
        </Link>
      </div>
    </div>
  )
}
