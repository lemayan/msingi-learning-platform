import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { schema } from './schemaTypes'
import { structure } from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID!
const dataset = process.env.SANITY_STUDIO_DATASET!
const apiVersion = process.env.SANITY_STUDIO_API_VERSION ?? '2026-09-09'

export default defineConfig({
  name: 'msingi',
  title: 'Msingi Studio',

  projectId,
  dataset,

  schema,

  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
