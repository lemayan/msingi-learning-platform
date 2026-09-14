# Msingi Intelligent Search Engine & Structural Grounding

## Goal

Fully implement and verify the intelligent search engine for msingi:
1. Confirm the Studio is deployed to `msingi-learning.sanity.studio` with pinned `appId: 'y077ia431vhdnioux1v55n14'`, ensuring Sanity Context MCP serves dataset `production`.
2. Confirm `sanity.agentContext` is imported with the production slug `search`, containing the content filter `_type in ["course", "lesson", "category", "instructor", "videoDoc"]` and query instructions detailing the GROQ `match ["a","b"]` AND condition behavior alongside explicit OR disjunction syntax to expand results from 2 to 11 across 4 courses.
3. Confirm `@sanity/context` plugin remains skipped to avoid the peer dependency mismatch (`sanity@^6` vs Studio's `^5`) per AGENTS.md §12.
4. Implement `LESSONS_BY_IDS_QUERY` in `sanity/lib/queries.ts` to power structural grounding.
5. Build `POST /api/search` using an active MCP tool loop over the OpenAI provider (`ai` + `@ai-sdk/openai`), caching `/initial-context` inside the system prompt, setting `MAX_STEPS = 6` and `reasoningEffort: 'low'` to cut latency down from ~72s to ~35s.
6. Enforce structural grounding: the model strictly returns only lesson `_id` strings and timestamps, while all displayed fields are read back directly from Sanity via `LESSONS_BY_IDS_QUERY` with the `Lesson 5.1 in <Module>` label dynamically derived from array order.
7. Format OpenAI structured output schema strictly without `.optional()` constraints (substituting with explicit `.nullable()` flags).
8. Provide graceful fallback to deterministic structural GROQ retrieval when OpenAI quota is exhausted (`insufficient_quota`).
9. Keep front-end UI completely omitted while preserving the typed video-result schema contract ready for ingestion.

## Skills read

- `create-agent-with-sanity-context` (`.agents/skills/create-agent-with-sanity-context/SKILL.md`) — Tool calling loop with MCP tools, system prompt construction, caching `/initial-context`.
- `dial-your-context` (`.agents/skills/dial-your-context/SKILL.md`) — Context document instructions and content scope filter.
- `shape-your-agent` (`.agents/skills/shape-your-agent/SKILL.md`) — Grounding rules, non-hallucination guardrails, two-stage timestamp resolution.
- `AGENTS.md` §5–§12 — Search architecture, structural grounding, server-only tokens, Studio plugin avoidance.

## Code inspected

| File | Finding |
|---|---|
| `studio/sanity.cli.ts` | Studio is configured with `studioHost: 'msingi-learning'` and `appId: 'y077ia431vhdnioux1v55n14'`. Verified deployed to `https://msingi-learning.sanity.studio/`. |
| `studio/package.json` | Uses `sanity: ^5.31.2`. `@sanity/context` correctly not installed. |
| `sanity/lib/queries.ts` | Missing `LESSONS_BY_IDS_QUERY`. Needs export for hydration. |
| `.env.local` | Has `OPEN_API_KEY` with exhausted quota (`credit_balance_exhausted`). Tool loop must handle quota error gracefully with deterministic structural fallback. |
| `app/lib/search/types.ts` | Has search schemas. Needs OpenAI structured output schema using `.nullable()` (no `.optional()`). |
| `app/api/search/route.ts` | Current route uses direct GROQ; needs OpenAI tool loop with `MAX_STEPS = 6`, `reasoningEffort: 'low'`, system prompt with cached `/initial-context`, and structural grounding via `LESSONS_BY_IDS_QUERY`. |

## Decisions & assumptions

1. **Studio & MCP Verification**:
   - `msingi-learning.sanity.studio` is deployed and pinned with `appId: 'y077ia431vhdnioux1v55n14'`, satisfying the Context MCP deployment prerequisite.
2. **Context Document Instructions**:
   - Document `agentContext.search` in Sanity holds content filter `_type in ["course", "lesson", "category", "instructor", "videoDoc"]`.
   - Update instructions to explicitly specify that in GROQ `match ["a", "b"]` is an AND condition, and guide the agent to use explicit OR disjunctions `(title match "*a*" || title match "*b*")` to expand results from 2 to 11 across 4 courses.
3. **OpenAI Tool Loop (`ai` + `@ai-sdk/openai`)**:
   - Install `ai` and `@ai-sdk/openai`.
   - Configure OpenAI provider using `process.env.OPENAI_API_KEY || process.env.OPEN_API_KEY`.
   - Expose MCP `groq_query` tool to the model.
   - Cache `/initial-context` in memory and inject it into the system prompt.
   - Set `maxSteps: 6` and `reasoningEffort: 'low'` (e.g. `o3-mini` with low reasoning effort, falling back to `gpt-4o-mini`).
   - Catch quota/network errors and fall back to deterministic structural GROQ execution.
4. **Structural Grounding**:
   - The model's structured output returns only:
     ```typescript
     {
       lessonIds: string[],
       videoMoments: Array<{
         lessonId: string,
         timestampSeconds: number,
         chapterLabel: string | null,
         clipDurationSeconds: number | null
       }>
     }
     ```
   - Server queries Sanity via `LESSONS_BY_IDS_QUERY` for the matching IDs.
   - Derives `Lesson 5.1 in <Module>` dynamically from course module order.
   - Hydrates all authoritatively stored fields (thumbnails, course titles, key points, descriptions).
5. **OpenAI Structured Outputs Schema**:
   - Substitute any `.optional()` with `.nullable()` so OpenAI JSON schema validation does not reject the schema.
6. **No UI**:
   - Front-end `/search` page remains completely omitted.

## Files expected to touch

| File | Purpose |
|---|---|
| `package.json` | Add `ai` and `@ai-sdk/openai`. |
| `sanity/lib/queries.ts` | Export `LESSONS_BY_IDS_QUERY`. |
| `studio/scripts/seeds/ingest-video-intelligence.mjs` | Update Context doc instructions with GROQ disjunction rule and re-seed. |
| `app/lib/search/types.ts` | Add `ModelSearchOutputSchema` with `.nullable()` (no `.optional()`). |
| `app/lib/search/search-engine.ts` | Refactor to execute OpenAI MCP tool loop, inject cached `/initial-context`, apply `LESSONS_BY_IDS_QUERY` structural grounding, and derive 5.1 labels from array order. |
| `app/api/search/route.ts` | Call refactored search engine and return validated `SearchResponse`. |

## Requirements

1. Studio deployed to `msingi-learning.sanity.studio` with pinned `appId`.
2. `sanity.agentContext` updated with slug `search`, content filter, and GROQ disjunction instructions.
3. `@sanity/context` plugin skipped.
4. Export `LESSONS_BY_IDS_QUERY` in `sanity/lib/queries.ts`.
5. OpenAI MCP tool loop with `maxSteps: 6` and `reasoningEffort: 'low'`, caching `/initial-context` in system prompt.
6. Model returns only lesson `_id`s; display fields hydrated from Sanity via `LESSONS_BY_IDS_QUERY`.
7. OpenAI structured output schema strictly uses `.nullable()` with zero `.optional()`.
8. Fallback to structural GROQ retrieval if OpenAI quota is exhausted.
9. Results page UI completely omitted.
10. `npx tsc --noEmit` and `npm run lint` pass with zero errors.

## Security considerations

- Sanity read/write tokens and OpenAI API keys stay strictly server-side (`server-only`).
- User search queries are sanitized before inclusion in prompts and GROQ expressions.

## Acceptance criteria

- `POST /api/search` with `{"query": "data fetching"}` returns HTTP 200 with validated JSON.
- Response contains grounded `videoResults` and `lessonResults` derived from `LESSONS_BY_IDS_QUERY`.
- Module and lesson labels follow `Lesson <M>.<L> in <Module>` derived from array order.
- Two-stage timestamp resolution produces real timestamps.
- System handles queries with OR disjunction expanding results across courses.
- `npx tsc --noEmit`, `npm run lint`, and `npm run build` pass with zero errors.

## Checks to run

- `npx tsc --noEmit` — Type check.
- `npm run lint` — Lint check.
- `npm run build` — Production build.
- `curl.exe` tests against `POST /api/search` with various queries.

## Exact manual test steps

1. Send POST request to `http://localhost:3000/api/search` with `{"query": "data fetching"}`.
2. Verify response JSON contains `totalCount > 0`, `videoResults`, and `lessonResults`.
3. Verify `moduleLessonLabel` matches `Lesson X.Y in <Module>` derived from array order.
4. Verify `videoResults` contain valid `timestampSeconds` and `timestampFormatted`.
5. Test disjunction query `{"query": "data caching"}` and verify expanded multi-course results.
6. Test empty query `{"query": ""}` and verify HTTP 400.
