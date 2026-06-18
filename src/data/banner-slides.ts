/**
 * 메인 배너 슬라이드 — 관리자가 URL을 등록해 운영
 *
 * 등록 방법: 아래 배열에 항목 추가
 *
 * type:
 * - instagram: 릴스/피드 URL (embed 재생, durationSec 후 다음 슬라이드)
 * - video: mp4/webm 직링크 (재생 종료 시 즉시 다음 슬라이드, durationSec는 최대 대기)
 * - image: 이미지 URL (durationSec 후 다음 슬라이드)
 */
export type BannerSlideType = "instagram" | "video" | "image";

export interface BannerSlide {
  id: string;
  type: BannerSlideType;
  /** instagram 릴스/게시물 URL, 영상 직링크, 또는 /public 이미지 경로 */
  url: string;
  title?: string;
  /** 자동 넘김 시간(초). instagram/image 필수 권장, video는 최대 대기 시간 */
  durationSec?: number;
  /** 클릭 시 이동할 링크 (미설정 시 url 사용) */
  link?: string;
}

export const bannerSlides: BannerSlide[] = [
  // 예시 — 실제 릴스 URL로 교체 후 주석 해제
  // {
  //   id: "reel-1",
  //   type: "instagram",
  //   url: "https://www.instagram.com/reel/XXXXXXXXX/",
  //   title: "서강대점 릴스",
  //   durationSec: 30,
  //   link: "https://www.instagram.com/gymlight_seogang/",
  // },
];

export function getActiveBannerSlides(): BannerSlide[] {
  return bannerSlides.filter((s) => s.url.trim().length > 0);
}

export function instagramEmbedUrl(postUrl: string): string | null {
  try {
    const parsed = new URL(postUrl);
    if (!parsed.hostname.replace("www.", "").includes("instagram.com")) {
      return null;
    }
    const path = parsed.pathname.replace(/\/$/, "");
    if (/^\/(reel|p|tv)\/[\w-]+/.test(path)) {
      return `https://www.instagram.com${path}/embed`;
    }
  } catch {
    return null;
  }
  return null;
}
