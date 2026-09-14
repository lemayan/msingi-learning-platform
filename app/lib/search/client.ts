'use client'

import { getPostHogSessionIds } from '@/app/lib/analytics-client'
import { SearchRequest, SearchResponse } from './types'

/**
 * Client-side helper to call /api/search with PostHog distinct and session IDs attached.
 * This joins the server-side search_performed event to the browser session.
 */
export async function fetchSearch(request: SearchRequest): Promise<SearchResponse> {
  const { distinctId, sessionId } = getPostHogSessionIds()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (distinctId) {
    headers['x-posthog-distinct-id'] = distinctId
  }
  if (sessionId) {
    headers['x-posthog-session-id'] = sessionId
  }

  const res = await fetch('/api/search', {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(`Search request failed with status ${res.status}`)
  }

  return res.json()
}
