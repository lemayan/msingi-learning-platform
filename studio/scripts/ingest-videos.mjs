import { YoutubeTranscript } from "youtube-transcript";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const token = process.env.SANITY_API_READ_TOKEN || "skDiML82y8KB2AQgIoH3NBQCJWJEJIaHQ4uIOK8MkTiEu1MlaJIEbNvAJ9zmt72Njdhel2GofRPpaOgPECbzqmKRXa96utMCY9zR0x2t2BPj7qJlLrEeLvYbfTcUkLm8MJ989PkWFJGDgVoIYKeiPJ4Z1t5pkYPBenXaNcNEZOAg81VPwxNR";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xyto8u3e";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Use API key from env for Gemini
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.error("Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable");
  process.exit(1);
}

async function sanityFetch(query) {
  const url = `https://${projectId}.api.sanity.io/v2026-09-09/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.description || JSON.stringify(json.error));
  return json.result;
}

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
  const json = await res.json();
  if (json.error) throw new Error(json.error.description || JSON.stringify(json.error));
  return json;
}

function extractYouTubeId(url) {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  return ytMatch ? ytMatch[1] : null;
}

async function processYouTubeVideo(videoId, title) {
  try {
    const rawTranscript = await YoutubeTranscript.fetchTranscript(videoId);
    if (!rawTranscript || rawTranscript.length === 0) {
      console.warn(`No transcript found for video ${videoId}`);
      return null;
    }

    // Chunking: Group transcript items into ~20 second chunks
    const chunks = [];
    let currentChunkText = "";
    let chunkStart = 0;
    
    for (let i = 0; i < rawTranscript.length; i++) {
      const item = rawTranscript[i];
      if (currentChunkText === "") {
        chunkStart = Math.floor(item.offset / 1000);
      }
      
      currentChunkText += " " + item.text;
      
      const currentTime = item.offset / 1000;
      if (currentTime - chunkStart >= 20 || i === rawTranscript.length - 1) {
        chunks.push({
          _key: `chunk-${chunks.length}`,
          startSeconds: chunkStart,
          text: currentChunkText.trim().replace(/\s+/g, " "),
        });
        currentChunkText = "";
      }
    }

    // Generating Chapters with Gemini
    const transcriptText = chunks.map(c => `[${c.startSeconds}s] ${c.text}`).join("\n");
    
    console.log(`Generating chapters for ${videoId} using Gemini...`);
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: z.object({
        chapters: z.array(z.object({
          startSeconds: z.number().int(),
          label: z.string().max(100)
        }))
      }),
      prompt: `You are an AI that generates table of contents (chapters) for educational videos. 
Based on the transcript below, generate up to 10 chapters. Each chapter must have a startSeconds (integer) and a short label summarizing the topic.
The first chapter should always start at 0s. The title of the lesson is: ${title}.

Transcript:
${transcriptText}
`
    });

    const chapters = object.chapters.map((chap, i) => ({
      _key: `chap-${i}`,
      startSeconds: chap.startSeconds,
      label: chap.label
    }));

    return { chunks, chapters };
  } catch (error) {
    console.error(`Error processing YouTube video ${videoId}:`, error.message);
    return null;
  }
}

async function main() {
  console.log("Fetching lessons from Sanity...");
  const lessons = await sanityFetch(`*[_type == "lesson" && defined(videoUrl)]{ _id, title, videoUrl }`);
  console.log(`Found ${lessons.length} lessons with video URLs.`);

  const patches = [];
  
  for (const lesson of lessons) {
    const videoId = extractYouTubeId(lesson.videoUrl);
    if (!videoId) {
      console.log(`Skipping non-YouTube video or invalid URL: ${lesson.videoUrl}`);
      continue;
    }

    // Fetch existing videoDoc if any to check if already populated
    const existingVideoDocs = await sanityFetch(`*[_type == "videoDoc" && videoId == "${videoId}"]{ _id, chapters, chunks }`);
    const videoDoc = existingVideoDocs[0];
    
    // If it has real chunks (not just mocked ones from seed, wait - seed mocked ones have 10-15 chunks maybe.
    // Let's always process if we haven't run the real ingestion (real ingestion will have many chunks)
    if (videoDoc && videoDoc.chunks && videoDoc.chunks.length > 30) {
      console.log(`Skipping ${videoId}, looks like it already has dense real chunks.`);
      continue;
    }

    console.log(`Processing video: ${videoId} (${lesson.title})`);
    const result = await processYouTubeVideo(videoId, lesson.title);
    
    if (result) {
      let docId;
      if (videoDoc) {
        docId = videoDoc._id;
      } else {
        docId = `videoDoc-${videoId}`;
        patches.push({
          createIfNotExists: {
            _id: docId,
            _type: "videoDoc",
            videoId: videoId,
            url: lesson.videoUrl
          }
        });
      }

      patches.push({
        patch: {
          id: docId,
          set: {
            chapters: result.chapters,
            chunks: result.chunks
          }
        }
      });
      
      // Submit immediately so we don't lose progress on large batches, but limit to small bursts
      console.log(`Saving to Sanity for video ${videoId}...`);
      await sanityMutate(patches);
      patches.length = 0; // clear patches
    }
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log("? Offline ingestion pipeline complete.");
}

main().catch(console.error);

