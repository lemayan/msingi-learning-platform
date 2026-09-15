const token = process.env.SANITY_API_READ_TOKEN;
if (!token) throw new Error('Missing SANITY_API_READ_TOKEN environment variable');
const projectId = 'xyto8u3e';
const dataset = 'production';

async function checkToken() {
  const url = `https://${projectId}.api.sanity.io/v2026-09-09/data/mutate/${dataset}?dryRun=true`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mutations: [{
        patch: {
          id: '0XrviXgkrY',
          set: { test: true }
        }
      }]
    })
  });
  const json = await res.json();
  console.log('Mutate dryRun result:', json);
}

checkToken().catch(console.error);
