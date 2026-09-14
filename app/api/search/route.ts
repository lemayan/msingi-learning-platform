import { NextRequest, NextResponse } from 'next/server'
import { SearchRequestSchema } from '@/app/lib/search/types'
import { executeSearch } from '@/app/lib/search/search-engine'

export const dynamic = 'force-dynamic'

/**
 * POST /api/search
 *
 * Accepts:
 * {
 *   "query": string,
 *   "sort"?: "relevance" | "duration" | "newest"
 * }
 *
 * Returns validated JSON with grounded videoResults and lessonResults.
 */
export async function POST(request: NextRequest) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const parsed = SearchRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: parsed.error.issues,
        },
        { status: 400 }
      )
    }

    const formatParam = request.nextUrl.searchParams.get('format')
    const format = formatParam === 'array' ? 'array' : parsed.data.format

    const result = await executeSearch(parsed.data)
    if (format === 'array') {
      return NextResponse.json(result.results ?? [], { status: 200 })
    }
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error('[POST /api/search] Unhandled error:', err)
    return NextResponse.json(
      { error: 'Internal server error while executing search' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/search?q=...&sort=...&format=...
 *
 * Query-param based alternative for simple browser inspection and GET clients.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const query = searchParams.get('q') || searchParams.get('query') || ''
    const sort = searchParams.get('sort') || 'relevance'
    const format = searchParams.get('format') || 'envelope'

    const parsed = SearchRequestSchema.safeParse({ query, sort, format })
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: parsed.error.issues,
        },
        { status: 400 }
      )
    }

    const result = await executeSearch(parsed.data)
    if (parsed.data.format === 'array') {
      return NextResponse.json(result.results ?? [], { status: 200 })
    }
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error('[GET /api/search] Unhandled error:', err)
    return NextResponse.json(
      { error: 'Internal server error while executing search' },
      { status: 500 }
    )
  }
}
