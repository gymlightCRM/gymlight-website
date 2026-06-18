const REEL_PATH = /^\/(reel|p|tv)\/([\w-]+)/;

export function extractInstagramShortcode(postUrl: string): string | null {
  try {
    const parsed = new URL(postUrl);
    if (!parsed.hostname.replace("www.", "").includes("instagram.com")) {
      return null;
    }
    const match = parsed.pathname.replace(/\/$/, "").match(REEL_PATH);
    return match?.[2] ?? null;
  } catch {
    return null;
  }
}

/** HTML/JSON 문자열에서 Instagram CDN mp4 URL 추출 */
export function parseInstagramMp4FromHtml(html: string): string | null {
  const candidates: string[] = [];

  const patterns = [
    /"video_url":"([^"]+)"/g,
    /video_url\\":\\"([^\\]+)/g,
    /"playback_url":"([^"]+)"/g,
    /(https:\\\/\\\/[^"\\]+\.mp4[^"\\]*)/g,
    /(https:\/\/[^"\s]+\.mp4[^"\s]*)/g,
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const raw = match[1]?.replace(/\\u0026/g, "&").replace(/\\\//g, "/");
      if (raw?.includes("cdninstagram.com") && raw.includes(".mp4")) {
        candidates.push(raw.split("&bytestart=")[0].split("&byteend=")[0]);
      }
    }
  }

  if (candidates.length === 0) return null;

  const unique = [...new Set(candidates)];
  return unique.sort((a, b) => scoreMp4(b) - scoreMp4(a))[0] ?? null;
}

function scoreMp4(url: string): number {
  let score = url.length;
  if (url.includes("X3E5MC") || url.includes("q90")) score += 10_000;
  if (url.includes("1080")) score += 5_000;
  if (url.includes("/m367/")) score += 1_000;
  return score;
}

export async function fetchInstagramReelVideoUrl(
  postUrl: string,
): Promise<string | null> {
  const shortcode = extractInstagramShortcode(postUrl);
  if (!shortcode) return null;

  const targets = [
    `https://www.instagram.com/reel/${shortcode}/`,
    `https://www.instagram.com/p/${shortcode}/`,
    `https://www.instagram.com/reel/${shortcode}/embed/`,
  ];

  const userAgent =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

  for (const target of targets) {
    try {
      const res = await fetch(target, {
        headers: {
          "User-Agent": userAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) continue;
      const html = await res.text();
      const videoUrl = parseInstagramMp4FromHtml(html);
      if (videoUrl) return videoUrl;
    } catch {
      continue;
    }
  }

  return null;
}
