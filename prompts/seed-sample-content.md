# Goal
Seed Sanity with the provided `seed.ndjson` and `videos.ndjson` files without modifying them, and verify document counts.

# Skills Read
- AGENTS.md (core project rules)
- sanity-migration (for dataset imports)
- sanity-best-practices (for sanity commands)

# Code Inspected
- `studio/package.json`
- `studio/.env.local`
- `studio/sanity.cli.ts`

# Decisions & Assumptions
- Will run the import commands via the `sanity` CLI from the `studio` workspace.
- The `studio/.env.local` provides `SANITY_STUDIO_PROJECT_ID` ("xyto8u3e") and `SANITY_STUDIO_DATASET` ("production"), which `sanity.cli.ts` picks up.
- Will run `npx sanity dataset import scripts/seeds/seed.ndjson production` and `npx sanity dataset import scripts/seeds/videos.ndjson production`.
- The dataset used for the import is `production`.
- The document counts will be verified using GROQ queries to confirm the data exists.

# Files to Touch
- No source files will be touched.

# Requirements
- Use the provided `.ndjson` files to seed the dataset.
- Do not modify the seed files.
- Verify the document counts afterwards.

# Security Considerations
- Read/write operations should only use configured project ID and dataset.

# Acceptance Criteria
- Both `.ndjson` files are imported into the `production` dataset successfully.
- Document counts are checked and recorded to confirm the seed completed.
- Seed files remain untouched.

# Checks to Run
- `sanity dataset import` command runs successfully.
- Command to verify imported document counts returns expected document types and counts.

# Manual Test Steps
1. Navigate to the `studio` folder.
2. Run `npx sanity documents count` to check current documents.
3. Compare the document counts before and after to ensure data exists.
