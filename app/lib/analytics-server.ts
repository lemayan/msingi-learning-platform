import 'server-only'
import { PostHog } from 'posthog-node'

let posthogInstance: PostHog | null = null

/**
 * Returns the singleton PostHog server-side client instance.
 */
export function getPostHogServer(): PostHog | null {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

  if (!token) return null

  if (!posthogInstance) {
    posthogInstance = new PostHog(token, {
      host,
      flushAt: 1,
      flushInterval: 0,
    })
  }

  return posthogInstance
}

interface ServerCaptureOptions {
  distinctId?: string
  sessionId?: string
  properties?: Record<string, unknown>
}

/**
 * Captures a server-side analytics event to PostHog and ensures delivery via flush().
 * Per AGENTS.md §5 & §12: Server-side capture runs server-only with zero PII.
 */
export async function captureServerEvent(
  event: string,
  { distinctId, sessionId, properties = {} }: ServerCaptureOptions = {}
): Promise<void> {
  const client = getPostHogServer()
  if (!client) return

  const effectiveDistinctId = distinctId || 'server_anonymous'

  try {
    client.capture({
      distinctId: effectiveDistinctId,
      event,
      properties: {
        ...properties,
        ...(sessionId ? { $session_id: sessionId } : {}),
        $lib: 'msingi-server',
      },
    })
    // Flush queued events so they are not silently dropped when serverless container exits
    await client.flush()
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[analytics-server] Failed to capture "${event}":`, err)
    }
  }
}
