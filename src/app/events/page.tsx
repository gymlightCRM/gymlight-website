import type { Metadata } from "next";
import Link from "next/link";
import EventBoard from "@/components/EventBoard";

export const metadata: Metadata = {
  title: "이벤트",
  description: "짐라이트 전 지점 이벤트 및 프로모션",
};

export default function EventsPage() {
  return (
    <div className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-black sm:text-4xl">
          이벤트 & <span className="text-[#39FF14]">프로모션</span>
        </h1>
        <p className="mt-3 text-white/50">
          진행 중인 이벤트를 확인하세요. 카드를 클릭하면 상세 이미지를 볼 수
          있습니다.
        </p>

        <div className="mt-10">
          <EventBoard showFilter />
        </div>

        <p className="mt-10 text-center text-sm text-white/40">
          이벤트 문의는{" "}
          <Link href="/centers" className="text-[#39FF14] hover:underline">
            가까운 지점
          </Link>
          으로 연락해 주세요.
        </p>
      </div>
    </div>
  );
}
