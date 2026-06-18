import type { Metadata } from "next";
import Image from "next/image";
import CareerApplicationForm from "@/components/CareerApplicationForm";
import { centers } from "@/data/centers";

export const metadata: Metadata = {
  title: "채용",
  description: "짐라이트 트레이너 · FC · 아르바이트 채용",
};

const positions = [
  {
    title: "트레이너",
    description:
      "1:1 PT 및 회원 관리. 생활체육지도자 자격증 보유자 우대. 전 지점 채용.",
  },
  {
    title: "FC (프론트)",
    description: "회원 응대, 시설 관리, 운영 보조. 서비스 마인드 중시.",
  },
  {
    title: "아르바이트",
    description: "데스크·청소·시설 보조 등. 시간대 협의 가능.",
  },
];

export default function CareersPage() {
  return (
    <div className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt=""
            width={64}
            height={64}
            className="mx-auto mb-6 h-16 w-16 object-contain"
            aria-hidden
          />
          <p className="text-sm font-bold tracking-[0.3em] text-white/50 uppercase">
            We&apos;re Hiring
          </p>
          <h1 className="mt-3 text-4xl font-black">
            <span className="text-[#39FF14]">GYMLIGHT</span>
          </h1>
          <p className="mt-4 text-lg text-white/70">
            짐라이트에서 함께할 인재를 모집합니다
          </p>
        </div>

        <div className="mt-12 rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-relaxed text-white/60">
          <p>
            서울에서 시작된 짐라이트는 현재{" "}
            <strong className="text-white">6개 지점</strong>을 운영하며,
            건강한 트레이너 문화와 지속 가능한 피트니스 환경을 만들어가는
            주식회사입니다.
          </p>
        </div>

        <h2 className="mt-12 text-xl font-bold">채용 포지션</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {positions.map((pos) => (
            <div
              key={pos.title}
              className="rounded-xl border border-white/10 p-4"
            >
              <h3 className="font-bold text-[#39FF14]">{pos.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/55">
                {pos.description}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-xl font-bold">채용 지점</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {centers.map((c) => (
            <li
              key={c.id}
              className="rounded-lg border border-white/10 px-4 py-3 text-sm"
            >
              <span style={{ color: c.colors.primary }}>{c.number}</span>{" "}
              {c.name}
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <h2 className="text-xl font-bold">지원서 작성</h2>
          <p className="mt-2 text-sm text-white/50">
            아래 양식을 작성하시면 담당자 메일로 접수됩니다.
          </p>
          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <CareerApplicationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
