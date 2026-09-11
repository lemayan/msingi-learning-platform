/**
 * Formats a duration in seconds to a human-readable string.
 *
 * Examples:
 *   formatDuration(2700)  → "45m"
 *   formatDuration(4320)  → "1h 12m"
 *   formatDuration(66240) → "18h 24m"
 *   formatDuration(0)     → "0m"
 */
export function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0m'

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.round((totalSeconds % 3600) / 60)

  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}
