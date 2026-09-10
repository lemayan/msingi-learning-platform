import { defineLive } from 'next-sanity/live'
import { client } from './client'

/**
 * Live Content API setup.
 *
 * `serverToken` allows the server to receive live content events from the
 * private dataset. `browserToken` is intentionally omitted — the browser
 * never holds a Sanity token (AGENTS.md §12).
 *
 * Import `<SanityLive />` and render it in the root layout to activate.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  // browserToken: intentionally omitted
})
