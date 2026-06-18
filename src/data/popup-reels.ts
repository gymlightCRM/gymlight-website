/**
 * 홈 접속 팝업 — 관리자가 등록한 릴스/피드 URL
 *
 * 등록 방법: 아래 popupReels 배열에 항목 추가
 *
 * type:
 * - instagram: 릴스/피드 URL (embed, durationSec 후 다음)
 * - video: mp4/webm (재생 종료 시 다음, durationSec는 최대 대기)
 * - image: 이미지 (durationSec 후 다음)
 */
export type PopupReelType = "instagram" | "video" | "image";

export interface PopupReel {
  id: string;
  type: PopupReelType;
  url: string;
  title?: string;
  /** 직접 mp4 URL (있으면 embed 대신 자동재생) */
  videoUrl?: string;
  /** 표시할 인스타 계정 (예: gymlight.kr) */
  handle?: string;
  durationSec?: number;
  link?: string;
}

export const popupReels: PopupReel[] = [
  {
    id: "reel-1",
    type: "instagram",
    url: "https://www.instagram.com/reel/DZuIN-8B3QB/",
    videoUrl: "/reels/reel-1.mp4",
    durationSec: 30,
    link: "https://www.instagram.com/gymlight.kr/",
  },
  {
    id: "reel-2",
    type: "instagram",
    url: "https://www.instagram.com/reel/DYjVGovOs2T/",
    videoUrl: "/reels/reel-2.mp4",
    durationSec: 30,
    link: "https://www.instagram.com/gymlight.kr/",
  },
  {
    id: "reel-3",
    type: "instagram",
    url: "https://www.instagram.com/reel/DZrfghFtYHR/",
    videoUrl: "/reels/reel-3.mp4",
    durationSec: 30,
    link: "https://www.instagram.com/gymlight.kr/",
  },
  {
    id: "reel-4",
    type: "instagram",
    url: "https://www.instagram.com/reel/DY2Jk-bBKXu/",
    videoUrl: "/reels/reel-4.mp4",
    durationSec: 30,
    link: "https://www.instagram.com/gymlight.kr/",
  },
];

export function getActivePopupReels(): PopupReel[] {
  return popupReels.filter((r) => r.url.trim().length > 0);
}

export function instagramEmbedUrl(
  postUrl: string,
  options?: { autoplay?: boolean },
): string | null {
  try {
    const parsed = new URL(postUrl);
    if (!parsed.hostname.replace("www.", "").includes("instagram.com")) {
      return null;
    }
    const path = parsed.pathname.replace(/\/$/, "");
    if (/^\/(reel|p|tv)\/[\w-]+/.test(path)) {
      const params = new URLSearchParams();
      if (options?.autoplay !== false) {
        params.set("autoplay", "1");
        params.set("playsinline", "1");
      }
      const query = params.toString();
      return `https://www.instagram.com${path}/embed/${query ? `?${query}` : ""}`;
    }
  } catch {
    return null;
  }
  return null;
}

export const POPUP_STORAGE_KEY = "gymlight-reel-popup-dismissed-until";
