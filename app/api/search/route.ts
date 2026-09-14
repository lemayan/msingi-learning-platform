import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { SearchRequestSchema } from '@/app/lib/search/types'
import { executeSearch } from '@/app/lib/search/search-engine'
import { captureServerEvent, getPostHogServer } from '@/app/lib/analytics-server'
import { EVENTS } from '@/lib/analytics/events'

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
  const startTime = performance.now()
  const clientDistinctId = request.headers.get('x-posthog-distinct-id') || undefined
  const clientSessionId = request.headers.get('x-posthog-session-id') || undefined

  let userId: string | undefined
  let signedIn = false
  try {
    const authObj = await auth()
    if (authObj.userId) {
      userId = authObj.userId
      signedIn = true
    }
  } catch {
    // unauthenticated
  }

  // Clerk user ID wins when signed in; otherwise browser distinct ID joins session
  const effectiveDistinctId = userId || clientDistinctId || 'server_anonymous'

  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      await captureServerEvent(EVENTS.SEARCH_FAILED, {
        distinctId: effectiveDistinctId,
        sessionId: clientSessionId,
        properties: {
          query: '',
          reason: 'validation_error',
          duration_ms: Math.round(performance.now() - startTime),
          signed_in: signedIn,
        },
      })
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const parsed = SearchRequestSchema.safeParse(body)
    if (!parsed.success) {
      await captureServerEvent(EVENTS.SEARCH_FAILED, {
        distinctId: effectiveDistinctId,
        sessionId: clientSessionId,
        properties: {
          query: typeof body === 'object' && body !== null && 'query' in body ? String((body as Record<string, unknown>).query) : '',
          reason: 'validation_error',
          duration_ms: Math.round(performance.now() - startTime),
          signed_in: signedIn,
        },
      })
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
    const durationMs = Math.round(performance.now() - startTime)

    // Capture server-side search_performed enriched with zero_results, lesson_result_count, duration_ms, signed_in
    await captureServerEvent(EVENTS.SEARCH_PERFORMED, {
      distinctId: effectiveDistinctId,
      sessionId: clientSessionId,
      properties: {
        query: parsed.data.query,
        zero_results: result.totalCount === 0,
        lesson_result_count: result.lessonResults.length,
        video_result_count: result.videoResults.length,
        duration_ms: durationMs,
        signed_in: signedIn,
        total_results: result.totalCount,
        courses_count: result.courseCount,
        sort: parsed.data.sort,
        source: 'server_api_post',
      },
    })

    // Ensure events are flushed before route teardown
    const posthog = getPostHogServer()
    if (posthog) {
      await posthog.flush()
    }

    if (format === 'array') {
      return NextResponse.json(result.results ?? [], { status: 200 })
    }
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error('[POST /api/search] Unhandled error:', err)
    await captureServerEvent(EVENTS.SEARCH_FAILED, {
      distinctId: effectiveDistinctId,
      sessionId: clientSessionId,
      properties: {
        query: '',
        reason: 'internal_error',
        duration_ms: Math.round(performance.now() - startTime),
        signed_in: signedIn,
      },
    })
    const posthog = getPostHogServer()
    if (posthog) {
      await posthog.flush()
    }

    return NextResponse.json(
      { error: 'Internal server error while executing search' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/search?q=...&sort=...&format=...
 */
export async function GET(request: NextRequest) {
  const startTime = performance.now()
  const clientDistinctId =
    request.headers.get('x-posthog-distinct-id') ||
    request.nextUrl.searchParams.get('ph_distinct_id') ||
    undefined
  const clientSessionId =
    request.headers.get('x-posthog-session-id') ||
    request.nextUrl.searchParams.get('ph_session_id') ||
    undefined

  let userId: string | undefined
  let signedIn = false
  try {
    const authObj = await auth()
    if (authObj.userId) {
      userId = authObj.userId
      signedIn = true
    }
  } catch {
    // unauthenticated
  }

  const effectiveDistinctId = userId || clientDistinctId || 'server_anonymous'

  try {
    const { searchParams } = request.nextUrl
    const query = searchParams.get('q') || searchParams.get('query') || ''
    const sort = searchParams.get('sort') || 'relevance'
    const format = searchParams.get('format') || 'envelope'

    const parsed = SearchRequestSchema.safeParse({ query, sort, format })
    if (!parsed.success) {
      await captureServerEvent(EVENTS.SEARCH_FAILED, {
        distinctId: effectiveDistinctId,
        sessionId: clientSessionId,
        properties: {
          query,
          reason: 'validation_error',
          duration_ms: Math.round(performance.now() - startTime),
          signed_in: signedIn,
        },
      })
      const posthog = getPostHogServer()
      if (posthog) {
        await posthog.flush()
      }

      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: parsed.error.issues,
        },
        { status: 400 }
      )
    }

    const result = await executeSearch(parsed.data)
    const durationMs = Math.round(performance.now() - startTime)

    await captureServerEvent(EVENTS.SEARCH_PERFORMED, {
      distinctId: effectiveDistinctId,
      sessionId: clientSessionId,
      properties: {
        query: parsed.data.query,
        zero_results: result.totalCount === 0,
        lesson_result_count: result.lessonResults.length,
        video_result_count: result.videoResults.length,
        duration_ms: durationMs,
        signed_in: signedIn,
        total_results: result.totalCount,
        courses_count: result.courseCount,
        sort: parsed.data.sort,
        source: 'server_api_get',
      },
    })

    const posthog = getPostHogServer()
    if (posthog) {
      await posthog.flush()
    }

    if (parsed.data.format === 'array') {
      return NextResponse.json(result.results ?? [], { status: 200 })
    }
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error('[GET /api/search] Unhandled error:', err)
    await captureServerEvent(EVENTS.SEARCH_FAILED, {
      distinctId: effectiveDistinctId,
      sessionId: clientSessionId,
      properties: {
        query: '',
        reason: 'internal_error',
        duration_ms: Math.round(performance.now() - startTime),
        signed_in: signedIn,
      },
    })
    const posthog = getPostHogServer()
    if (posthog) {
      await posthog.flush()
    }

    return NextResponse.json(
      { error: 'Internal server error while executing search' },
      { status: 500 }
    )
  }
}
