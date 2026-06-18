/** 공식 SNS */
export const officialInstagram = {
  url: "https://www.instagram.com/gymlight.kr",
  handle: "gymlight.kr",
} as const;

export function instagramUrl(handle: string): string {
  const id = handle.replace(/^@/, "");
  return `https://www.instagram.com/${id}/`;
}

/**
 * 추후 메인 배너 Instagram 피드 연동 시 참고
 *
 * 가능 여부: 가능 (단, 조건 있음)
 * - Instagram Graph API: 비즈니스/크리에이터 계정 + Meta 앱 + Facebook 페이지 연결 필요
 * - 지점 6개 + 공식 계정 = 계정별 토큰 또는 통합 관리 구조 설계 필요
 * - 대안: Curator.io, Elfsight 등 서드파티 위젯 (유료), 또는 수동 선별 게시물 embed
 *
 * Phase 2에서 API 연동 또는 CMS에서 픽한 릴스 URL 목록 방식 권장
 */
export type InstagramFeedSource = {
  centerId: string;
  handle: string;
};

export const instagramFeedSources: InstagramFeedSource[] = [
  { centerId: "official", handle: "gymlight.kr" },
  { centerId: "seogang", handle: "gymlight_seogang" },
  { centerId: "myongji", handle: "gymlight_myongji" },
  { centerId: "yeonhui-1", handle: "gymlight_yeonhui" },
  { centerId: "yeonhui-2", handle: "gymlight_yeonhui" },
  { centerId: "gusan", handle: "gymlight_gusan" },
  { centerId: "gocheok", handle: "gymlight_gocheok" },
];
