import Link from "next/link";
import { centers } from "@/data/centers";
import { officialInstagram } from "@/data/social";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-black tracking-[0.2em] text-[#39FF14]">
              GYMLIGHT
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/50">
              서울에서 시작된 짐라이트는 6개 지점을 운영하며, 건강한 트레이너
              문화와 지속 가능한 피트니스 환경을 만들어갑니다.
            </p>
            <a
              href={officialInstagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-[#39FF14] hover:underline"
            >
              Instagram @{officialInstagram.handle}
            </a>
          </div>

          <div className="flex flex-col gap-2 text-sm text-white/50">
            <p className="text-xs font-medium tracking-wider text-white/30 uppercase">
              Menu
            </p>
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

          <div>
            <p className="text-xs font-medium tracking-wider text-white/30 uppercase">
              Instagram
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {centers.map((c) =>
                c.instagram ? (
                  <li key={c.id}>
                    <a
                      href={c.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/50 hover:text-white"
                    >
                      <span style={{ color: c.colors.primary }}>
                        {c.name}
                      </span>
                      {" · "}
                      {c.instagram.replace(
                        "https://www.instagram.com/",
                        "@",
                      ).replace(/\/$/, "")}
                    </a>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/30">
          <p>© {new Date().getFullYear()} GYMLIGHT. All rights reserved.</p>
          <p className="mt-1">gymlight.co.kr</p>
        </div>
      </div>
    </footer>
  );
}
