const token = process.env.SANITY_API_READ_TOKEN;
if (!token) throw new Error('Missing SANITY_API_READ_TOKEN environment variable');
const projectId = 'xyto8u3e';
const dataset = 'production';

async function sanityFetch(query, params = {}) {
  const url = `https://${projectId}.api.sanity.io/v2026-09-09/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  return json.result;
}

async function testSearch(term) {
  // 1. Match lessons on topic (title, notes plain text, key points)
  // Per AGENTS.md §11: wildcard keywords, match pt::text(notes)
  const words = term.trim().split(/\s+/).filter(Boolean);
  const matchPattern = words.map(w => `*${w}*`).join(' ');

  console.log('Search pattern:', matchPattern);

  // Query lessons matching title or notes or keyPoints
  const lessonQuery = `
    *[_type == "lesson" && (
      title match "${matchPattern}" ||
      pt::text(notes) match "${matchPattern}" ||
      keyPoints match "${matchPattern}"
    )] {
      _id,
      title,
      "slug": slug.current,
      duration,
      freePreview,
      studentCount,
      thumbnail { asset->{ _id, url } },
      keyPoints,
      videoUrl,
      "course": *[_type == "course" && references(^._id)][0] {
        _id,
        title,
        "slug": slug.current,
        coverImage { asset->{ _id, url } },
        modules[] {
          _key,
          title,
          lessons[]-> { _id, "slug": slug.current, title }
        }
      }
    }
  `;

  const lessonMatches = await sanityFetch(lessonQuery);
  console.log('Lesson matches count:', lessonMatches?.length);
  if (lessonMatches?.[0]) {
    console.log('First lesson match:', {
      title: lessonMatches[0].title,
      courseTitle: lessonMatches[0].course?.title,
      modulesCount: lessonMatches[0].course?.modules?.length
    });
  }

  // 2. Query video moments (chapters first, then transcript chunks)
  // Each videoDoc has chapters: [{ startSeconds, label }], chunks: [{ startSeconds, text }]
  const videoQuery = `
    *[_type == "videoDoc" && (
      chapters[].label match "${matchPattern}" ||
      chunks[].text match "${matchPattern}"
    )] {
      _id,
      videoId,
      url,
      "matchedChapters": chapters[label match "${matchPattern}"] {
        startSeconds,
        label
      },
      "matchedChunks": chunks[text match "${matchPattern}"][0...3] {
        startSeconds,
        text
      }
    }
  `;

  const videoMatches = await sanityFetch(videoQuery);
  console.log('VideoDoc matches count:', videoMatches?.length);
  if (videoMatches?.[0]) {
    console.log('First videoDoc match:', {
      videoId: videoMatches[0].videoId,
      url: videoMatches[0].url,
      matchedChapters: videoMatches[0].matchedChapters,
      matchedChunksCount: videoMatches[0].matchedChunks?.length,
      firstChunk: videoMatches[0].matchedChunks?.[0]
    });
  }
}

testSearch('data fetching').catch(console.error);
