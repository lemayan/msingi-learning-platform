/**
 * Turns a stored lesson video URL into a provider embed URL that plays on the
 * site. Supports YouTube, Vimeo, and Bunny (the providers in AGENTS.md §9).
 *
 * The embed can start at a given second, so a search result can deep-link to
 * the exact moment a topic is taught.
 *
 * Returns null when the URL is empty or from an unsupported provider, so the
 * caller can fall back to the poster image.
 */
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

  // YouTube
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

  // Vimeo
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

  // Bunny
  if (host === "iframe.mediadelivery.net" || host.endsWith("mediadelivery.net")) {
    if (autoplay) parsed.searchParams.set("autoplay", "true");
    if (start) parsed.searchParams.set("t", String(start));
    return { provider: "bunny", url: parsed.toString() };
  }

  return null;
}
