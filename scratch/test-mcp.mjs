const token = process.env.SANITY_API_READ_TOKEN;
if (!token) throw new Error('Missing SANITY_API_READ_TOKEN environment variable');
const projectId = 'xyto8u3e';
const dataset = 'production';

async function testMCP(endpoint) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/list',
      id: 1,
    }),
  });
  const text = await res.text();
  console.log(`MCP (${endpoint}): status = ${res.status}`);
  console.log(`Response: ${text.slice(0, 400)}`);
}

async function main() {
  await testMCP(`https://api.sanity.io/v2026-03-03/context/mcp/${projectId}/${dataset}/search`);
}

main().catch(console.error);
