import 'server-only'
import { projectId, dataset } from '@/sanity/env'
import { serverClient } from '@/sanity/lib/serverClient'

let cachedInitialContext: string | null = null

/**
 * Fetches and caches initial context from the Sanity Context MCP.
 * Appends /initial-context to the document MCP URL.
 */
export async function getInitialContext(): Promise<string | null> {
  if (cachedInitialContext) {
    return cachedInitialContext
  }

  const token = process.env.SANITY_API_READ_TOKEN
  if (!token) {
    return null
  }

  try {
    const url = `https://api.sanity.io/v2026-03-03/context/mcp/${projectId}/${dataset}/search/initial-context`
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 3600 },
    })

    if (res.ok) {
      const data = await res.text()
      cachedInitialContext = data
      return data
    }
  } catch (err) {
    console.warn('[Sanity Context MCP] Failed to fetch initial context:', err)
  }

  return null
}

/**
 * Executes a GROQ query via the Sanity Context MCP `groq_query` tool.
 * Applies the Context document's content scope filter automatically.
 * Gracefully falls back to direct serverClient fetch if MCP is unavailable.
 */
export async function executeGroqViaMcp<T>(query: string): Promise<T> {
  const token = process.env.SANITY_API_READ_TOKEN
  const endpoint = `https://api.sanity.io/v2026-03-03/context/mcp/${projectId}/${dataset}/search`

  if (token) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'groq_query',
            arguments: { query },
          },
        }),
      })

      if (res.ok) {
        const json = await res.json()
        const textContent = json.result?.content?.[0]?.text
        if (textContent) {
          const parsed = JSON.parse(textContent)
          if (Array.isArray(parsed.result)) {
            return parsed.result as T
          }
        }
      } else {
        console.warn(`[Sanity Context MCP] HTTP ${res.status}: falling back to direct query`)
      }
    } catch (err) {
      console.warn('[Sanity Context MCP] Call failed, falling back to direct serverClient:', err)
    }
  }

  // Grounded fallback using serverClient
  return serverClient.fetch<T>(query)
}
