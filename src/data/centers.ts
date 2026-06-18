export interface CenterHours {
  weekday: string;
  saturday: string;
  sunday: string;
  closed?: string;
}

export interface Center {
  id: string;
  slug: string;
  number: string;
  name: string;
  district: string;
  address: string;
  phone: string;
  hours: CenterHours;
  parking: string;
  features: string[];
  colors: { primary: string; secondary: string };
  mapPosition: { x: number; y: number };
  naverPlaceId: string;
  instagram?: string;
}

export const centers: Center[] = [
  {
    id: "seogang",
    slug: "seogang",
    number: "1호점",
    name: "서강대점",
    district: "마포구",
    address: "서울특별시 마포구 서강로 105, 화일빌딩 4층",
    phone: "010-4434-5302",
    hours: {
      weekday: "06:00 – 24:00",
      saturday: "08:00 – 20:00",
      sunday: "10:00 – 17:00",
      closed: "매월 1·3째주 일요일 휴무",
    },
    parking: "지점별 주차 혜택 상이 (문의)",
    features: ["약 250평", "월 2회 무료 PT", "경의중앙선 서강대역 인근"],
    colors: { primary: "#FFD700", secondary: "#1A1A1A" },
    mapPosition: { x: 38, y: 58 },
    naverPlaceId: "1878989166",
    instagram: "https://www.instagram.com/gymlight_seogang/",
  },
  {
    id: "myongji",
    slug: "myongji",
    number: "2호점",
    name: "명지대점",
    district: "서대문구",
    address: "서울특별시 서대문구 명지대길 103, 7층",
    phone: "02-303-5301",
    hours: {
      weekday: "06:00 – 24:00",
      saturday: "08:00 – 20:00",
      sunday: "10:00 – 17:00",
    },
    parking: "시간 제한 없이 무료 주차",
    features: ["7층 전망", "월 2회 무료 PT", "기구 필라테스 병행"],
    colors: { primary: "#DC2626", secondary: "#6B7280" },
    mapPosition: { x: 28, y: 42 },
    naverPlaceId: "1869627026",
    instagram: "https://www.instagram.com/gymlight_myongji/",
  },
  {
    id: "yeonhui-1",
    slug: "yeonhui-1",
    number: "3-1호점",
    name: "연희1호점",
    district: "서대문구",
    address: "서울특별시 서대문구 연희맛로 28, 연희프라자 3층",
    phone: "02-3144-5303",
    hours: {
      weekday: "06:00 – 24:00",
      saturday: "08:00 – 20:00",
      sunday: "10:00 – 17:00",
      closed: "매월 2·4째주 일요일 휴무",
    },
    parking: "일반 30분 / PT 1시간 무료",
    features: ["약 200평", "지상 통유리", "월 2회 무료 PT"],
    colors: { primary: "#C0C0C0", secondary: "#6B7280" },
    mapPosition: { x: 32, y: 48 },
    naverPlaceId: "1379076721",
    instagram: "https://www.instagram.com/gymlight_yeonhui/",
  },
  {
    id: "yeonhui-2",
    slug: "yeonhui-2",
    number: "3-2호점",
    name: "연희2호점",
    district: "서대문구",
    address: "서울특별시 서대문구 연희로 103, 3층",
    phone: "02-3144-5303",
    hours: {
      weekday: "06:00 – 24:00",
      saturday: "08:00 – 20:00",
      sunday: "10:00 – 17:00",
      closed: "매월 2·4째주 일요일 휴무",
    },
    parking: "지점별 주차 혜택 상이 (문의)",
    features: ["연희1호점과 별도 건물", "프리미엄 웨이트 존", "월 2회 무료 PT"],
    colors: { primary: "#F97316", secondary: "#6B7280" },
    mapPosition: { x: 36, y: 52 },
    naverPlaceId: "2000525419",
    instagram: "https://www.instagram.com/gymlight_yeonhui/",
  },
  {
    id: "gusan",
    slug: "gusan",
    number: "4호점",
    name: "구산/연신내점",
    district: "은평구",
    address: "서울특별시 은평구 연서로21길 3, B1층",
    phone: "02-388-5304",
    hours: {
      weekday: "06:00 – 24:00",
      saturday: "06:00 – 24:00",
      sunday: "06:00 – 24:00",
    },
    parking: "건물 내 무료 주차",
    features: ["약 500평", "연중무휴", "짐레코 오피셜 센터"],
    colors: { primary: "#2563EB", secondary: "#FFFFFF" },
    mapPosition: { x: 22, y: 32 },
    naverPlaceId: "1957611585",
    instagram: "https://www.instagram.com/gymlight_gusan/",
  },
  {
    id: "gocheok",
    slug: "gocheok",
    number: "5호점",
    name: "고척점",
    district: "구로구",
    address: "서울특별시 구로구 중앙로1길 36, 2001아울렛 3동 4층",
    phone: "02-2625-5305",
    hours: {
      weekday: "06:00 – 24:00",
      saturday: "08:00 – 20:00",
      sunday: "10:00 – 17:00",
    },
    parking: "건물 내 주차 (문의)",
    features: ["약 680평", "해머스트렝스·짐80·짐레코 오피셜", "건식 사우나·카페"],
    colors: { primary: "#16A34A", secondary: "#6B7280" },
    mapPosition: { x: 18, y: 72 },
    naverPlaceId: "1843376814",
    instagram: "https://www.instagram.com/gymlight_gocheok/",
  },
];

export function getCenterBySlug(slug: string): Center | undefined {
  return centers.find((c) => c.slug === slug);
}

export function naverPlaceUrl(placeId: string): string {
  return `https://map.naver.com/p/entry/place/${placeId}`;
}

export function naverDirectionsUrl(placeId: string): string {
  return `https://map.naver.com/p/entry/place/${placeId}?placePath=/route`;
}
