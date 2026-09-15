import { readFileSync } from "node:fs";

const token = process.env.SANITY_API_READ_TOKEN;
if (!token) throw new Error("Missing SANITY_API_READ_TOKEN environment variable");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xyto8u3e";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

async function sanityMutate(mutations) {
  const url = `https://${projectId}.api.sanity.io/v2026-09-09/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mutations }),
  });
  return await res.json();
}

async function main() {
  const agentContextDoc = {
    _id: "agentContext.search",
    _type: "sanity.agentContext",
    title: "Search Agent Configuration",
    slug: {
      _type: "slug",
      current: "search",
    },
    groqFilter: "_type in [\"course\", \"lesson\", \"category\", \"instructor\", \"video\"]",
    instructions: `You are the msingi intelligent search agent. Your job is to return relevant, grounded learning results for learner queries.

Content Model:
- Courses have modules with references to lessons.
- Lessons have title, notes (portable text), keyPoints (string[]), duration, and videoUrl.
- Video documents (video) hold chapters ({ startSeconds, label }) and transcript chunks ({ startSeconds, text }).

Query & Timestamp Resolution Rules:
1. Grounding: Never hallucinate courses, lessons, prices, or timestamps. Return ONLY real lesson _id strings found in Sanity.
2. GROQ Matching (AND vs OR):
   - In GROQ, matching against an array like \`match ["a", "b"]\` evaluates as an AND condition.
   - To match any keyword (OR semantics), write explicit OR disjunction clauses.
3. Two-Stage Timestamps:
   - Stage 1: Match chapters first for clean moment titles and exact timestamps.
   - Stage 2: Fall back to matching transcript chunks.
4. Identification: Return only matching lesson _ids and video timestamps.`
  };

  await sanityMutate([{ createOrReplace: agentContextDoc }]);
  console.log("Updated context document.");
}
main().catch(console.error);
