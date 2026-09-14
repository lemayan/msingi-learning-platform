import 'server-only'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

/**
 * Server-only client for Sanity mutations (e.g. learnerProgress).
 *
 * Security:
 * - Carries SANITY_API_WRITE_TOKEN (or SANITY_API_READ_TOKEN with write permission).
 * - Enforced server-only: will fail build if bundled into client.
 * - useCdn is FALSE for immediate consistency on write and mutation operations.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
  perspective: 'published',
})
