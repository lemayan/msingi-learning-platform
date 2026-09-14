import React from 'react'
import { Metadata } from 'next'
import { Navbar } from '@/app/components/navbar'
import { SearchResultsView } from './search-results-view'
import { executeSearch } from '@/app/lib/search/search-engine'
import { SearchResponse } from '@/app/lib/search/types'

export const dynamic = 'force-dynamic'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    query?: string
    sort?: 'relevance' | 'duration' | 'newest'
  }>
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams
  const q = params.q || params.query || ''
  if (!q) {
    return {
      title: 'Intelligent Search — Msingi',
      description: 'Search learning content and video moments in plain English.',
    }
  }
  return {
    title: `Results for “${q}” — Msingi Search`,
    description: `Find exact lessons and video moments for “${q}” across all courses.`,
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = (params.q || params.query || '').trim()
  const sort =
    params.sort === 'duration' || params.sort === 'newest'
      ? params.sort
      : 'relevance'

  let response: SearchResponse

  if (query) {
    try {
      response = await executeSearch({ query, sort, format: 'envelope' })
    } catch (err) {
      console.error('[SearchPage] executeSearch error:', err)
      response = {
        query,
        totalCount: 0,
        courseCount: 0,
        videoResults: [],
        lessonResults: [],
        results: [],
      }
    }
  } else {
    response = {
      query: '',
      totalCount: 0,
      courseCount: 0,
      videoResults: [],
      lessonResults: [],
      results: [],
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 w-full">
        <SearchResultsView
          initialResponse={response}
          initialQuery={query}
          initialSort={sort}
        />
      </main>
    </div>
  )
}
