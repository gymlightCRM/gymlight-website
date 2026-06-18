/**
 * 이벤트 게시판 데이터
 *
 * 새 이벤트 등록 방법:
 * 1. 이미지 파일을 public/events/ 폴더에 저장 (예: summer-2026.jpg)
 * 2. 아래 배열에 항목 추가
 */
export interface EventPost {
  id: string;
  title: string;
  publishedAt: string;
  image: string;
  centers: string[];
  isPinned?: boolean;
}

export const eventPosts: EventPost[] = [
  // 예시 — 실제 이미지 추가 후 주석 해제
  // {
  //   id: "june-2026",
  //   title: "6월 전 지점 이벤트",
  //   publishedAt: "2026-06-01",
  //   image: "/events/june-2026.jpg",
  //   centers: ["all"],
  //   isPinned: true,
  // },
];

export function getSortedEvents(): EventPost[] {
  return [...eventPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.publishedAt.localeCompare(a.publishedAt);
  });
}
