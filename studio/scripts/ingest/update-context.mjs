import { readFileSync } from "node:fs";

const token = process.env.SANITY_API_READ_TOKEN || "skDiML82y8KB2AQgIoH3NBQCJWJEJIaHQ4uIOK8MkTiEu1MlaJIEbNvAJ9zmt72Njdhel2GofRPpaOgPECbzqmKRXa96utMCY9zR0x2t2BPj7qJlLrEeLvYbfTcUkLm8MJ989PkWFJGDgVoIYKeiPJ4Z1t5pkYPBenXaNcNEZOAg81VPwxNR";
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
    groqFilter: "!(_id in path(\"drafts.**\")) && _type in [\"course\", \"lesson\", \"category\", \"instructor\", \"video\"]",
    instructions: `### Pure Delta Schema & Relationship Notes
- Videos link to lessons by URL / videoId: \`*[_type == "lesson" && (videoUrl == ^.url || videoUrl match ("*" + ^.videoId + "*"))][0]\`. There is no direct _ref between them.
- Courses contain embedded modules with references to lessons (\`modules[].lessons[]._ref\`). Lessons do not store a parent course reference.
- Match Portable Text notes using plain text projection: \`pt::text(notes) match "*term*"\`.

### GROQ Query Patterns & Semantics
- In GROQ, array matching like \`match ["a", "b"]\` evaluates as an AND condition.
- For keyword search across multiple terms, always write explicit OR disjunction clauses:
  \`(title match "*term1*" || title match "*term2*") || (pt::text(notes) match "*term1*" || pt::text(notes) match "*term2*")\`

### Two-Stage Timestamp Resolution
- Stage 1 (Chapters First): Search the table of contents first (\`chapters[].label\`) for clean moment titles and exact startSeconds.
- Stage 2 (Transcript Chunks Fallback): If no chapter matches, fall back to matching transcript chunks (\`chunks[].text\`).

### Safety & Projection Rules
- NEVER query raw \`{ chunks }\` or \`{ chapters, chunks }\` wholesale; transcripts are large and will overflow the context window.
- Always project filtered slices:
  \`"matchedChapters": chapters[label match "*keyword*"], "matchedChunks": chunks[text match "*keyword*"][0...2]\`
- Return strictly grounded results: only real \`lessonIds\` and \`videoMoments\` found in Sanity.`
  };

  await sanityMutate([{ createOrReplace: agentContextDoc }]);
  console.log("Updated context document.");
}

main().catch(console.error);


