import { naverDirectionsUrl, type Center } from "@/data/centers";

export type NavProvider = "naver" | "kakao" | "tmap" | "google";

export interface NavigationTarget {
  name: string;
  address: string;
  lat: number;
  lng: number;
  naverPlaceId?: string;
}

export function centerToNavigationTarget(center: Center): NavigationTarget {
  return {
    name: `짐라이트 ${center.name}`,
    address: center.address,
    lat: center.coordinates.lat,
    lng: center.coordinates.lng,
    naverPlaceId: center.naverPlaceId,
  };
}

export function getNavigationUrl(
  provider: NavProvider,
  target: NavigationTarget,
): string {
  const { name, lat, lng, naverPlaceId } = target;
  const encodedName = encodeURIComponent(name);

  switch (provider) {
    case "naver":
      return naverPlaceId
        ? naverDirectionsUrl(naverPlaceId)
        : `https://map.naver.com/v5/directions/-/${lat},${lng},${encodedName},PLACE,-/${lat},${lng}?c=15.0,0,0,0,dh`;
    case "kakao":
      return `https://map.kakao.com/link/to/${encodedName},${lat},${lng}`;
    case "tmap":
      return getTmapAppUrl(target);
    case "google":
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  }
}

function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/** T map 앱 URL — 웹(tmap.co.kr/route)은 404이므로 앱 스킴 사용 */
export function getTmapAppUrl(target: NavigationTarget): string {
  const { name, lat, lng } = target;
  const encodedName = encodeURIComponent(name);

  if (isIOSDevice()) {
    return `tmap://route?rGoName=${encodedName}&rGoX=${lng}&rGoY=${lat}`;
  }

  return `tmap://route?referrer=com.skt.Tmap&goalx=${lng}&goaly=${lat}&goalname=${encodedName}`;
}

/** 선택한 앱/웹 지도로 길찾기 열기 */
export function openNavigation(provider: NavProvider, target: NavigationTarget) {
  if (provider === "tmap") {
    window.location.href = getTmapAppUrl(target);
    return;
  }

  const webUrl = getNavigationUrl(provider, target);
  window.open(webUrl, "_blank", "noopener,noreferrer");
}

export const NAV_PROVIDERS: {
  id: NavProvider;
  label: string;
  className: string;
}[] = [
  {
    id: "naver",
    label: "네이버 지도",
    className: "bg-[#03C75A] text-white",
  },
  {
    id: "kakao",
    label: "카카오맵",
    className: "bg-[#FEE500] text-black",
  },
  {
    id: "tmap",
    label: "T map",
    className: "bg-[#E6007E] text-white",
  },
  {
    id: "google",
    label: "Google 지도",
    className: "bg-[#4285F4] text-white",
  },
];
