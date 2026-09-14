const token = 'skDiML82y8KB2AQgIoH3NBQCJWJEJIaHQ4uIOK8MkTiEu1MlaJIEbNvAJ9zmt72Njdhel2GofRPpaOgPECbzqmKRXa96utMCY9zR0x2t2BPj7qJlLrEeLvYbfTcUkLm8MJ989PkWFJGDgVoIYKeiPJ4Z1t5pkYPBenXaNcNEZOAg81VPwxNR';
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
