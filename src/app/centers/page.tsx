import type { Metadata } from "next";
import CenterCardGrid from "@/components/CenterCardGrid";
import SeoulMap from "@/components/SeoulMap";

export const metadata: Metadata = {
  title: "지점 안내",
  description: "짐라이트 서울 6개 지점 — 서강대, 명지대, 연희, 구산/연신내, 고척",
};

export default function CentersPage() {
  return (
    <div className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-black sm:text-4xl">
            지점 <span className="text-[#39FF14]">안내</span>
          </h1>
          <p className="mt-3 text-white/50">
            지도에서 지점을 선택하거나, 카드에서 상세 정보를 확인하세요
          </p>
        </div>

        <SeoulMap className="mx-auto mb-16 w-full max-w-full sm:max-w-3xl" />
        <CenterCardGrid />
      </div>
    </div>
  );
}
