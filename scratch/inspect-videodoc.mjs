const token = process.env.SANITY_API_READ_TOKEN;
if (!token) throw new Error('Missing SANITY_API_READ_TOKEN environment variable');
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

async function main() {
  const res = await sanityFetch(`{
    "withChapters": count(*[_type == "videoDoc" && defined(chapters) && length(chapters) > 0]),
    "withChunks": count(*[_type == "videoDoc" && defined(chunks) && length(chunks) > 0])
  }`);
  console.log('VideoDoc status:', res);
}

main().catch(console.error);
