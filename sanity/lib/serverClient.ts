import 'server-only'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

/**
 * Server-only read client.
 *
 * Carries SANITY_API_READ_TOKEN so the private dataset is accessible.
 * The `server-only` import at the top of this file causes a build error
 * if this module is ever accidentally bundled into client code.
 *
 * Usage:
 *   import { serverClient } from '@/sanity/lib/serverClient'
 *   const data = await serverClient.fetch(QUERY, params)
 *
 * Prefer using the typed `fetchSanity` helper from `./fetch` — it wraps
 * this client with Next.js cache tags and type inference.
 */
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'published',
})
