import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

/**
 * Public CDN client — no token.
 * Used by Studio config (`sanity.config.ts`) and the `defineLive` setup.
 * For server-side page data fetching, use `serverClient` from `./serverClient`.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})
