import 'server-only'
import { type QueryParams } from 'next-sanity'
import { serverClient } from './serverClient'

/**
 * Typed fetch helper for server-side Sanity data fetching.
 *
 * Wraps `serverClient` so all page fetches:
 * - Are server-only (enforced by the 'server-only' import above)
 * - Use the private dataset read token
 * - Optionally carry Next.js cache tags for tag-based revalidation
 */
export async function fetchSanity<const Q extends string>(
  query: Q,
  params: QueryParams = {},
  options: { tags?: string[]; stega?: boolean } = {},
) {
  // Extract Next.js cache options if provided
  const next = options.tags ? { tags: options.tags } : undefined
  
  const data = await serverClient.fetch(query, params, {
    next,
    // Pass other options like stega if needed, though serverClient handles basic fetching
  })
  
  return { data }
}
