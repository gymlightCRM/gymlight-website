import Image from "next/image";
import Link from "next/link";
import CenterCardGrid from "@/components/CenterCardGrid";
import EventBoard from "@/components/EventBoard";
import ReelPopup from "@/components/ReelPopup";
import SeoulMap from "@/components/SeoulMap";

export default function HomePage() {
  return (
    <>
      <ReelPopup />

      <section className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(57,255,20,0.08),transparent_60%)]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="animate-fade-up flex flex-col items-center text-center">
            <Image
              src="/logo.png"
              alt="짐라이트 로고"
              width={80}
              height={80}
              className="mb-6 h-20 w-20 object-contain"
              priority
            />
            <p className="text-sm font-medium tracking-[0.3em] text-white/50 uppercase">
              Base in Seoul
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
              <span className="text-white">YOUR LIGHT,</span>
              <br />
              <span className="text-[#39FF14]">YOUR GYM.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
              서울 6개 지점, 하나의 기준.
              <br />
              전문성과 책임을 바탕으로 차별화된 트레이닝 가치를 제공합니다.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/centers"
                className="rounded-full bg-[#39FF14] px-8 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
              >
                지점 찾기
              </Link>
              <Link
                href="/careers"
                className="rounded-full border border-white/20 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-white/5"
              >
                트레이너 채용
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              FIND <span className="text-[#39FF14]">GYMLIGHT</span>
            </h2>
            <p className="mt-2 text-sm text-white/50">
              서울 지도에서 지점을 선택하세요
            </p>
          </div>
          <SeoulMap className="mx-auto w-full max-w-3xl" />
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">6개 지점</h2>
              <p className="mt-1 text-sm text-white/50">전 지점 월 2회 무료 PT</p>
            </div>
            <Link
              href="/centers"
              className="text-sm text-[#39FF14] hover:underline"
            >
              전체 보기 →
            </Link>
          </div>
          <CenterCardGrid />
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold">이벤트</h2>
            <Link
              href="/events"
              className="text-sm text-[#39FF14] hover:underline"
            >
              전체 보기 →
            </Link>
          </div>
          <EventBoard limit={3} />
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#39FF14]/5 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-[#39FF14] uppercase">
            We&apos;re Hiring
          </p>
          <h2 className="mt-3 text-3xl font-black text-white">
            짐라이트에서 함께할
            <br />
            트레이너를 모집합니다
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            건강한 트레이너 문화와 지속 가능한 피트니스 환경을 함께
            만들어갈 인재를 기다립니다.
          </p>
          <Link
            href="/careers"
            className="mt-8 inline-block rounded-full bg-[#39FF14] px-8 py-3 text-sm font-bold text-black"
          >
            채용 공고 보기
          </Link>
        </div>
      </section>
    </>
  );
}
