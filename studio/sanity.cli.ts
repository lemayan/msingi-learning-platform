/**
 * Sanity CLI configuration for the standalone msingi Studio.
 *
 * Run from within studio/:
 *   npm run dev       → sanity dev (localhost:3333)
 *   npm run deploy    → publish Studio to sanity.studio
 *   npm run typegen   → generate TypeScript types from GROQ queries
 *
 * Or from the repo root:
 *   npm run studio:dev
 *   npm run studio:deploy
 *   npm run studio:typegen
 */
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
  studioHost: 'vertex-jsmastery',
  deployment: {
    appId: 'y077ia431vhdnioux1v55n14',
  },
  /**
   * TypeGen: generate types from `defineQuery()` calls in the web app.
   *
   * Point `generates` at the web app's sanity/lib/queries.ts so the generated
   * types land where Next.js pages can import them. Run `npm run typegen` to
   * regenerate after every query change.
   */
  typegen: {
    generates: '../sanity/types.generated.ts',
  },
})
