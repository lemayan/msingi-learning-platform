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

export type VideoProvider = "youtube" | "vimeo" | "bunny";

export interface VideoEmbed {
  provider: VideoProvider;
  url: string;
}

interface EmbedOptions {
  autoplay?: boolean;
  startSeconds?: number;
}

export function buildVideoEmbed(
  videoUrl: string | null | undefined,
  options: EmbedOptions = {},
): VideoEmbed | null {
  if (!videoUrl) return null;

  let parsed: URL;
  try {
    parsed = new URL(videoUrl);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");
  const start =
    options.startSeconds && options.startSeconds > 0
      ? Math.floor(options.startSeconds)
      : 0;
  const autoplay = options.autoplay ?? false;

  if (
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtu.be" ||
    host === "youtube-nocookie.com"
  ) {
    const segments = parsed.pathname.split("/").filter(Boolean);
    let id = "";
    if (host === "youtu.be") id = segments[0] ?? "";
    else if (segments[0] === "embed" || segments[0] === "shorts")
      id = segments[1] ?? "";
    else id = parsed.searchParams.get("v") ?? "";
    if (!id) return null;

    const params = new URLSearchParams({ rel: "0", modestbranding: "1" });
    if (start) params.set("start", String(start));
    if (autoplay) params.set("autoplay", "1");
    return {
      provider: "youtube",
      url: `https://www.youtube.com/embed/${id}?${params.toString()}`,
    };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const segments = parsed.pathname.split("/").filter(Boolean);
    const id = host === "player.vimeo.com" ? segments[1] : segments[0];
    if (!id || !/^\d+$/.test(id)) return null;

    const params = new URLSearchParams();
    if (autoplay) params.set("autoplay", "1");
    const query = params.toString();
    const hash = start ? `#t=${start}s` : "";
    return {
      provider: "vimeo",
      url: `https://player.vimeo.com/video/${id}${query ? `?${query}` : ""}${hash}`,
    };
  }

  if (
    host === "iframe.mediadelivery.net" ||
    host.endsWith("mediadelivery.net")
  ) {
    if (autoplay) parsed.searchParams.set("autoplay", "true");
    if (start) parsed.searchParams.set("t", String(start));
    return { provider: "bunny", url: parsed.toString() };
  }

  return null;
}
