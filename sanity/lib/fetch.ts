import 'server-only'
import { type QueryParams } from 'next-sanity'
import { sanityFetch } from './live'

/**
 * Typed fetch helper for server-side Sanity data fetching.
 *
 * Wraps `sanityFetch` from the Live Content API so all page fetches:
 * - Are server-only (enforced by the 'server-only' import above)
 * - Optionally carry Next.js cache tags for tag-based revalidation
 * - Use the Live Content API for automatic real-time updates
 *
 * Usage:
 * ```ts
 * import { fetchSanity } from '@/sanity/lib/fetch'
 * import { COURSES_QUERY } from '@/sanity/lib/queries'
 *
 * const { data: courses } = await fetchSanity(COURSES_QUERY)
 * const { data: course }  = await fetchSanity(COURSE_QUERY, { slug: 'intro-to-react' })
 * ```
 *
 * With cache tags (for webhook-triggered revalidation):
 * ```ts
 * const { data } = await fetchSanity(COURSE_QUERY, { slug }, { tags: ['course', `course:${slug}`] })
 * ```
 */
export async function fetchSanity<const Q extends string>(
  query: Q,
  params: QueryParams = {},
  options: { tags?: string[]; stega?: boolean } = {},
) {
  return sanityFetch({ query, params, ...options })
}
