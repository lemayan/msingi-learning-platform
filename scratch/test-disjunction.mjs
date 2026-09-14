const token = 'skDiML82y8KB2AQgIoH3NBQCJWJEJIaHQ4uIOK8MkTiEu1MlaJIEbNvAJ9zmt72Njdhel2GofRPpaOgPECbzqmKRXa96utMCY9zR0x2t2BPj7qJlLrEeLvYbfTcUkLm8MJ989PkWFJGDgVoIYKeiPJ4Z1t5pkYPBenXaNcNEZOAg81VPwxNR';
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
