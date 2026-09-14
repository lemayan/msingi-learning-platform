# Google Gemini Search Agent Integration

## Goal

Integrate the Google Generative AI provider (`@ai-sdk/google`) into `app/lib/search/search-engine.ts` to power the active Sanity Context MCP tool-calling loop for `POST /api/search` using the user's verified Google Gemini API key.

## Skills read

- `create-agent-with-sanity-context` (`.agents/skills/create-agent-with-sanity-context/SKILL.md`) — Tool calling loop over Sanity Context MCP tools, prompt construction, initial context caching.
- `AGENTS.md` §5–§7 — Server-side search API connecting to MCP, structural grounding, server-only secret keys.

## Code inspected

| File | Finding |
|---|---|
| `.env.local` | Needs `GOOGLE_GENERATIVE_AI_API_KEY="<your-api-key>"`. Verified working with Gemini API. |
| `package.json` | Has `ai`, `@ai-sdk/openai`. Needs `@ai-sdk/google`. |
| `app/lib/search/search-engine.ts` | Currently uses OpenAI provider with fallback. Needs `@ai-sdk/google` provider integration when Google key is present. |
| `sanity/lib/queries.ts` | Already has `LESSONS_BY_IDS_QUERY` for structural grounding hydration. |

## Decisions & assumptions

1. **Provider Priority**:
   - If `GOOGLE_GENERATIVE_AI_API_KEY` is present, use `@ai-sdk/google` (`google('gemini-2.5-flash')` or `google('gemini-2.0-flash')`).
   - If Google key is not present or throws an error, fallback to OpenAI provider (if valid key), and finally to deterministic structural GROQ resolution.
2. **Tool-Calling Loop**:
   - Use `groq_query` tool (calling Sanity Context MCP endpoint) and `submit_search_results` tool (with `ModelSearchOutputSchema`).
   - Limit steps with `stopWhen: isStepCount(6)`.
   - Inject cached `/initial-context` into system prompt.
3. **Structural Grounding**:
   - Model returns only `lessonIds: string[]` and `videoMoments: Array<{ lessonId, timestampSeconds, chapterLabel, clipDurationSeconds }>`.
   - All display data is hydrated from Sanity via `LESSONS_BY_IDS_QUERY`.
   - `Lesson 5.1 in <Module>` is derived from array order.
4. **No UI**:
   - Results page UI remains omitted per prior agreement.

## Files expected to touch

| File | Purpose |
|---|---|
| `package.json` | Add `@ai-sdk/google`. |
| `.env.local` | Add `GOOGLE_GENERATIVE_AI_API_KEY`. |
| `app/lib/search/search-engine.ts` | Wire `@ai-sdk/google` into the tool calling loop. |

## Requirements

1. Add Google API key to `.env.local`.
2. Install `@ai-sdk/google`.
3. Wire Gemini model (`gemini-2.5-flash` / `gemini-2.0-flash`) with MCP `groq_query` tool, caching `/initial-context`.
4. Hydrate results via `LESSONS_BY_IDS_QUERY` and derive dynamic `Lesson 5.1` labels.
5. All checks (`npx tsc --noEmit`, `npm run lint`, `npm run build`) pass with 0 errors.

## Security considerations

- `GOOGLE_GENERATIVE_AI_API_KEY` stays strictly on the server (`server-only`).
- Never exposed to the browser client.

## Acceptance criteria

- `POST /api/search` executes with the Google Gemini provider and returns grounded results.
- Returns `totalCount`, `courseCount`, `videoResults`, and `lessonResults`.
- `npx tsc --noEmit` and `npm run lint` pass with zero errors.

## Checks to run

- `npx tsc --noEmit` — Type check.
- `npm run lint` — Lint check.
- `npm run build` — Production build.
- Live test `POST /api/search` with `{"query": "data fetching"}` and verify Gemini-powered output.

## Exact manual test steps

1. Send POST request to `http://localhost:3000/api/search` with `{"query": "data fetching"}`.
2. Confirm the response contains grounded results with `totalCount > 0`, video timestamps, and dynamic module labels.
3. Verify latency is quick (typically under 5 seconds).
