const token = 'skDiML82y8KB2AQgIoH3NBQCJWJEJIaHQ4uIOK8MkTiEu1MlaJIEbNvAJ9zmt72Njdhel2GofRPpaOgPECbzqmKRXa96utMCY9zR0x2t2BPj7qJlLrEeLvYbfTcUkLm8MJ989PkWFJGDgVoIYKeiPJ4Z1t5pkYPBenXaNcNEZOAg81VPwxNR';
const projectId = 'xyto8u3e';
const dataset = 'production';

async function sanityFetch(query) {
  const url = `https://${projectId}.api.sanity.io/v2026-09-09/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  return json.result;
}

function formatSeconds(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

async function search(query) {
  const words = query.trim().split(/\s+/).filter(Boolean);
  const pattern = words.map((w) => `*${w.toLowerCase()}*`).join(' ');

  // 1. Lessons
  const lessonGroq = `
    *[_type == "lesson" && (
      title match "${pattern}" ||
      pt::text(notes) match "${pattern}" ||
      keyPoints match "${pattern}"
    )] {
      _id,
      title,
      "slug": slug.current,
      duration,
      keyPoints,
      thumbnail { asset->{ _id, url } },
      videoUrl,
      notes,
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

  // 2. Video Moments
  const videoGroq = `
    *[_type == "videoDoc" && (
      chapters[].label match "${pattern}" ||
      chunks[].text match "${pattern}"
    )] {
      _id,
      videoId,
      url,
      chapters,
      chunks,
      "lesson": *[_type == "lesson" && videoUrl == ^.url][0] {
        _id,
        title,
        "slug": slug.current,
        duration,
        thumbnail { asset->{ _id, url } },
        keyPoints,
        "course": *[_type == "course" && references(^._id)][0] {
          _id,
          title,
          "slug": slug.current,
          modules[] {
            _key,
            title,
            lessons[]-> { _id, "slug": slug.current, title }
          }
        }
      }
    }
  `;

  const [lessons, videoDocs] = await Promise.all([
    sanityFetch(lessonGroq),
    sanityFetch(videoGroq),
  ]);

  console.log(`Matched lessons: ${lessons.length}, Matched videoDocs: ${videoDocs.length}`);

  if (videoDocs.length > 0) {
    console.log('Sample matched videoDoc:', {
      videoId: videoDocs[0].videoId,
      lessonTitle: videoDocs[0].lesson?.title,
      courseTitle: videoDocs[0].lesson?.course?.title,
      chaptersSample: videoDocs[0].chapters?.slice(0, 2),
    });
  }
}

search('data fetching').catch(console.error);
