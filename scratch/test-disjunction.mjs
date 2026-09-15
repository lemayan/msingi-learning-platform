const token = process.env.SANITY_API_READ_TOKEN;
if (!token) throw new Error('Missing SANITY_API_READ_TOKEN environment variable');
const projectId = 'xyto8u3e';
const dataset = 'production';

async function test() {
  const q = `*[_type == "lesson" && (
    title match "*data*" || title match "*caching*" ||
    pt::text(notes) match "*data*" || pt::text(notes) match "*caching*" ||
    keyPoints match "*data*" || keyPoints match "*caching*"
  )] {
    _id,
    title,
    "courseTitle": *[_type == "course" && references(^._id)][0].title
  }`;

  const res = await fetch(`https://${projectId}.api.sanity.io/v2026-09-09/data/query/${dataset}?query=${encodeURIComponent(q)}`, {
    headers: { Authorization: 'Bearer ' + token }
  });
  const json = await res.json();
  const courses = new Set(json.result.map(l => l.courseTitle).filter(Boolean));
  console.log(`Disjunction matched ${json.result.length} lessons across ${courses.size} courses:`, Array.from(courses));
}

test();
