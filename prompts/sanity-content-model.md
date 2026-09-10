# Sanity Content Model + Studio + Server Data Layer

## Goal

Replace the default blog schema with the msingi learning-platform content model and update the
server-side data access layer (client, live helper, queries, image helper). This is the data
foundation that every other feature (catalog, course detail, lesson, instructor, search) will build
on top of.

## Skills used

- sanity-best-practices -- references/schema.md, references/groq.md, references/nextjs.md
- AGENTS.md sections 5, 6, 7, 8, 12

## Code inspected

| File | Relevant finding |
|------|-----------------|
| sanity.config.ts | Embedded Studio at /studio (using NextStudio). Kept as-is. |
| sanity/schemaTypes/index.ts | Registers default blog types -- all to be replaced. |
| sanity/lib/client.ts | Creates a CDN-backed createClient -- no read token. Needs server-only token variant. |
| sanity/lib/live.ts | defineLive without a server token -- needs serverToken. |
| sanity/lib/image.ts | Already has imageUrlBuilder helper. Keep as-is. |
| sanity/structure.ts | Blog structure -- will be replaced. |
| .env.local | Missing SANITY_API_READ_TOKEN. |
| app/layout.tsx | No SanityLive. Needs it added. |

## Decisions and assumptions

1. Embedded Studio stays -- migration to standalone is out of scope.
2. Read token -- the server read client uses SANITY_API_READ_TOKEN (server-only).
3. defineLive serverToken set to SANITY_API_READ_TOKEN; browserToken intentionally omitted.
4. Module is embedded object -- lessons are separate documents referenced inside module arrays.
5. videoDoc included in schema index for the ingestion pipeline (future task).
6. learnerProgress included as document type for admin visibility.
7. Icons imported from subpath (e.g. @sanity/icons/BookOpen) per schema.md rule.
8. No new npm packages needed -- all required packages already in package.json.

## Files to touch

### Schema -- delete (replaced)
- sanity/schemaTypes/postType.ts
- sanity/schemaTypes/authorType.ts
- sanity/schemaTypes/categoryType.ts
- sanity/schemaTypes/blockContentType.ts

### Schema -- new
- sanity/schemaTypes/documents/courseType.ts
- sanity/schemaTypes/documents/lessonType.ts
- sanity/schemaTypes/documents/instructorType.ts
- sanity/schemaTypes/documents/categoryType.ts
- sanity/schemaTypes/documents/videoDocType.ts
- sanity/schemaTypes/documents/learnerProgressType.ts
- sanity/schemaTypes/objects/moduleType.ts
- sanity/schemaTypes/objects/keyPointType.ts
- sanity/schemaTypes/objects/resourceType.ts
- sanity/schemaTypes/objects/learningOutcomeType.ts
- sanity/schemaTypes/objects/portableTextType.ts
- sanity/schemaTypes/index.ts (updated)

### Studio
- sanity/structure.ts (replaced)

### Data layer
- sanity/lib/client.ts (add serverClient)
- sanity/lib/live.ts (add serverToken)
- sanity/lib/queries.ts [NEW]
- sanity/lib/fetch.ts [NEW]

### Root
- app/layout.tsx (add SanityLive)
- .env.local (add SANITY_API_READ_TOKEN placeholder)
- .env.example [NEW]
