import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <p className="text-lg font-black tracking-[0.2em] text-[#39FF14]">
              GYMLIGHT
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/50">
              서울에서 시작된 짐라이트는 6개 지점을 운영하며, 건강한 트레이너
              문화와 지속 가능한 피트니스 환경을 만들어갑니다.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-white/50">
            <Link href="/centers" className="hover:text-white">
              지점 안내
            </Link>
            <Link href="/events" className="hover:text-white">
              이벤트
            </Link>
            <Link href="/careers" className="hover:text-white">
              채용
            </Link>
            <a
              href="https://blog.naver.com/gym_light"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              네이버 블로그
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/30">
          <p>© {new Date().getFullYear()} GYMLIGHT. All rights reserved.</p>
          <p className="mt-1">gymlight.co.kr (도메인 연결 예정)</p>
        </div>
      </div>
    </footer>
  );
}
