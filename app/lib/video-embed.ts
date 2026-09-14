/**
 * Converts video URLs (YouTube, Vimeo, Bunny) into embeddable iframe URLs
 * with support for timestamp seek/start parameters.
 *
 * Per AGENTS.md §7: Videos are YouTube, Vimeo, or Bunny embeds shown with
 * the provider's own player. Never send the learner out to the provider.
 */

export interface EmbedInfo {
  provider: "youtube" | "vimeo" | "bunny" | "generic";
  embedUrl: string;
}

export function getVideoEmbedInfo(
  rawUrl: string | null | undefined,
  startSeconds?: number
): EmbedInfo | null {
  if (!rawUrl) return null;

  const cleanUrl = rawUrl.trim();
  const start = startSeconds && startSeconds > 0 ? Math.floor(startSeconds) : 0;

  // 1. YouTube
  // Matches:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://youtube.com/shorts/VIDEO_ID
  const ytMatch = cleanUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  if (ytMatch) {
    const videoId = ytMatch[1];
    let embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0`;
    if (start > 0) {
      embedUrl += `&start=${start}`;
    }
    return { provider: "youtube", embedUrl };
  }

  // 2. Vimeo
  // Matches:
  // - https://vimeo.com/123456789
  // - https://player.vimeo.com/video/123456789
  const vimeoMatch = cleanUrl.match(
    /(?:vimeo\.com\/(?:video\/)?)([0-9]+)/i
  );
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    let embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    if (start > 0) {
      embedUrl += `#t=${start}s`;
    }
    return { provider: "vimeo", embedUrl };
  }

  // 3. Bunny Stream
  // Matches:
  // - https://iframe.mediadelivery.net/embed/LIB_ID/VIDEO_ID
  // - https://iframe.mediadelivery.net/play/LIB_ID/VIDEO_ID
  const bunnyMatch = cleanUrl.match(
    /iframe\.mediadelivery\.net\/(?:embed|play)\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/i
  );
  if (bunnyMatch) {
    const libraryId = bunnyMatch[1];
    const videoId = bunnyMatch[2];
    let embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=true`;
    if (start > 0) {
      embedUrl += `&t=${start}`;
    }
    return { provider: "bunny", embedUrl };
  }

  // 4. Generic fallback (if already an embed URL)
  let fallbackUrl = cleanUrl;
  if (start > 0) {
    const separator = fallbackUrl.includes("?") ? "&" : "?";
    fallbackUrl += `${separator}start=${start}`;
  }

  return { provider: "generic", embedUrl: fallbackUrl };
}
