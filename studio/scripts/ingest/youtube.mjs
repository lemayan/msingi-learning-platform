/**
 * YouTube provider adapter for offline video intelligence ingestion.
 * 
 * Note: The watch page's caption baseUrl answers 200 with an empty body, so the obvious
 * path silently yields zero cues. This adapter uses the InnerTube iOS player endpoint
 * which reliably resolves video metadata, chapters, and caption tracks.
 */

const INNERTUBE_PLAYER_URL = 'https://www.youtube.com/youtubei/v1/player?prettyPrint=false';
const IOS_CLIENT_VERSION = '20.03.2';
const IOS_USER_AGENT = `com.google.ios.youtube/${IOS_CLIENT_VERSION} (iPhone14,3; U; CPU iOS 17_5_1 like Mac OS X)`;

export async function fetchYoutubeVideoData(videoId) {
  const body = {
    context: {
      client: {
        clientName: 'IOS',
        clientVersion: IOS_CLIENT_VERSION,
        deviceMake: 'Apple',
        deviceModel: 'iPhone14,3',
        osName: 'iOS',
        osVersion: '17.5.1.21F90',
        hl: 'en',
        gl: 'US',
        utcOffsetMinutes: 0
      }
    },
    videoId
  };

  const res = await fetch(INNERTUBE_PLAYER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': IOS_USER_AGENT,
      'X-YouTube-Client-Name': '5',
      'X-YouTube-Client-Version': IOS_CLIENT_VERSION
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(1500)
  });

  if (!res.ok) {
    throw new Error(`InnerTube iOS API failed with HTTP ${res.status}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(`InnerTube API error: ${data.error.message || JSON.stringify(data.error)}`);
  }

  // 1. Extract chapter markers from player overlay
  const chapters = [];
  try {
    const markersMap =
      data?.playerOverlay?.playerOverlayRenderer?.decoratedPlayerBarRenderer?.decoratedPlayerBarRenderer?.playerBar
        ?.multiMarkersPlayerBarRenderer?.markersMap;

    if (Array.isArray(markersMap)) {
      const chapterMarkers = markersMap.find((m) => m.key === 'MARKER_TYPE_CHAPTERS');
      if (chapterMarkers?.value?.chapters) {
        for (const c of chapterMarkers.value.chapters) {
          const startMs = c.chapterRenderer?.timeRangeStartMillis || 0;
          const title = c.chapterRenderer?.title?.simpleText || c.chapterRenderer?.title?.runs?.[0]?.text || '';
          if (title) {
            chapters.push({
              startSeconds: Math.floor(startMs / 1000),
              label: title
            });
          }
        }
      }
    }
  } catch {
    // Non-fatal: fallback will supply chapter labels if none authored on YouTube
  }

  // 2. Extract caption cues
  const captionTracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  let cues = [];

  if (Array.isArray(captionTracks) && captionTracks.length > 0) {
    const englishTrack = captionTracks.find((t) => t.languageCode === 'en') || captionTracks[0];
    const transcriptUrl = englishTrack.baseUrl;

    try {
      const transcriptRes = await fetch(transcriptUrl, {
        headers: { 'User-Agent': IOS_USER_AGENT }
      });

      if (transcriptRes.ok) {
        const transcriptText = await transcriptRes.text();
        if (transcriptText && !transcriptText.includes('class="g-recaptcha"') && !transcriptText.includes("<title>Sorry...</title>")) {
          // Parse srv3 / XML cues
          const pRegex = /<p\s+t="(\d+)"\s+d="(\d+)"[^>]*>([\s\S]*?)<\/p>/g;
          let match;
          while ((match = pRegex.exec(transcriptText)) !== null) {
            const startMs = parseInt(match[1], 10);
            const durMs = parseInt(match[2], 10);
            let text = match[3].replace(/<[^>]+>/g, '').trim();
            text = text
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'");
            if (text) {
              cues.push({ offset: startMs, duration: durMs, text });
            }
          }

          if (cues.length === 0) {
            const textRegex = /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;
            let tm;
            while ((tm = textRegex.exec(transcriptText)) !== null) {
              let text = tm[3].trim();
              text = text
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'");
              if (text) {
                cues.push({
                  offset: parseFloat(tm[1]) * 1000,
                  duration: parseFloat(tm[2]) * 1000,
                  text
                });
              }
            }
          }
        }
      }
    } catch {
      // Captions will fallback to rich curriculum transcript cues
    }
  }

  return { chapters, cues };
}
