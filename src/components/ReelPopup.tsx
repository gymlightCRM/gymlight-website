"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getActivePopupReels,
  instagramEmbedUrl,
  POPUP_STORAGE_KEY,
  type PopupReel,
} from "@/data/popup-reels";
import { officialInstagram } from "@/data/social";

const TRANSITION_MS = 450;

function isDismissedToday(): boolean {
  if (typeof window === "undefined") return true;
  const until = localStorage.getItem(POPUP_STORAGE_KEY);
  if (!until) return false;
  return Date.now() < Number(until);
}

function dismissForToday() {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  localStorage.setItem(POPUP_STORAGE_KEY, String(end.getTime()));
}

function reelProfile(reel: PopupReel) {
  const handle = reel.handle ?? officialInstagram.handle;
  const profileUrl =
    reel.link?.replace(/\/$/, "") ||
    officialInstagram.url.replace(/\/$/, "");
  return { handle, profileUrl };
}

export default function ReelPopup() {
  const reels = getActivePopupReels();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [hideToday, setHideToday] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const current = reels[index];

  const close = useCallback(() => {
    if (hideToday) dismissForToday();
    setOpen(false);
  }, [hideToday]);

  useEffect(() => {
    if (reels.length === 0) return;
    if (!isDismissedToday()) {
      const t = setTimeout(() => setOpen(true), 400);
      return () => clearTimeout(t);
    }
  }, [reels.length]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (reels.length <= 1 || animating) return;
      setAnimating(true);
      window.setTimeout(() => {
        setIndex((nextIndex + reels.length) % reels.length);
        setAnimating(false);
      }, TRANSITION_MS);
    },
    [reels.length, animating],
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    clearTimer();
    if (!open || !current || reels.length <= 1 || paused) return;

    if (current.type === "instagram") {
      return clearTimer;
    }

    if (current.type === "video") {
      timerRef.current = setTimeout(goNext, (current.durationSec ?? 120) * 1000);
      return clearTimer;
    }

    timerRef.current = setTimeout(goNext, (current.durationSec ?? 8) * 1000);
    return clearTimer;
  }, [open, index, current, goNext, paused, reels.length]);

  useEffect(() => {
    const isVideoLike =
      current?.type === "video" || current?.type === "instagram";
    if (!open || !isVideoLike || !videoRef.current) return;
    const el = videoRef.current;
    if (paused) {
      el.pause();
    } else {
      void el.play().catch(() => undefined);
    }
  }, [open, index, current?.type, current?.url, current?.videoUrl, paused]);

  if (reels.length === 0 || !open || !current) return null;

  const { handle, profileUrl } = reelProfile(current);
  const postUrl = current.url;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/88 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="짐라이트 Instagram Reels"
      onClick={close}
    >
      <div
        className="relative w-full max-w-[400px]"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button
          type="button"
          onClick={close}
          className="absolute -top-10 right-0 z-20 text-sm text-white/80 hover:text-white"
          aria-label="닫기"
        >
          닫기 ✕
        </button>

        <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-black/40">
          <InstagramPostHeader handle={handle} profileUrl={profileUrl} />

          <div
            className={`relative transition-opacity duration-300 ${
              animating ? "opacity-0" : "opacity-100"
            }`}
          >
            <ReelContent
              key={`${current.id}-${index}`}
              reel={current}
              videoRef={videoRef}
              onVideoEnded={goNext}
              active={!animating}
              paused={paused}
            />

            {reels.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-2 text-lg leading-none text-white backdrop-blur-sm transition hover:bg-black/75"
                  aria-label="이전 릴스"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-2 text-lg leading-none text-white backdrop-blur-sm transition hover:bg-black/75"
                  aria-label="다음 릴스"
                >
                  ›
                </button>
              </>
            )}
          </div>

          <InstagramPostFooter postUrl={postUrl} title={current.title} />
        </article>

        {reels.length > 1 && (
          <div className="mt-4 flex justify-center gap-1.5">
            {reels.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-[#39FF14]"
                    : "w-1.5 bg-white/35 hover:bg-white/55"
                }`}
                aria-label={`${i + 1}번째 릴스`}
              />
            ))}
          </div>
        )}

        <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 text-xs text-white/55">
          <input
            type="checkbox"
            checked={hideToday}
            onChange={(e) => setHideToday(e.target.checked)}
            className="accent-[#39FF14]"
          />
          오늘 하루 보지 않기
        </label>
      </div>
    </div>
  );
}

function InstagramPostHeader({
  handle,
  profileUrl,
}: {
  handle: string;
  profileUrl: string;
}) {
  return (
    <header className="flex items-center gap-3 border-b border-neutral-100 px-3.5 py-3">
      <div className="relative shrink-0 rounded-full bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976] p-[2px]">
        <div className="relative h-9 w-9 overflow-hidden rounded-full bg-black">
          <Image
            src="/logo.png"
            alt="짐라이트"
            fill
            className="object-contain p-1"
            sizes="36px"
          />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-neutral-900">
          짐라이트
        </p>
        <p className="truncate text-[11px] text-neutral-500">
          GYMLIGHT · @{handle.replace(/^@/, "")}
        </p>
      </div>

      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-lg bg-[#0095f6] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0086dd]"
      >
        프로필 보기
      </a>
    </header>
  );
}

function InstagramPostFooter({
  postUrl,
  title,
}: {
  postUrl: string;
  title?: string;
}) {
  return (
    <footer className="border-t border-neutral-100 px-3.5 py-3">
      <a
        href={postUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-2.5 block text-xs font-semibold text-[#0095f6] hover:underline"
      >
        Instagram에서 더 보기
      </a>

      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-4 text-neutral-900">
          <InstagramIconHeart />
          <InstagramIconComment />
          <InstagramIconShare />
        </div>
        <InstagramIconBookmark />
      </div>

      <p className="text-xs font-semibold text-neutral-900">GYMLIGHT</p>
      {title ? (
        <p className="mt-0.5 line-clamp-2 text-xs text-neutral-600">{title}</p>
      ) : (
        <p className="mt-0.5 text-xs text-neutral-500">
          짐라이트 공식 인스타그램에서 올라온 Reels입니다.
        </p>
      )}
    </footer>
  );
}

function ReelContent({
  reel,
  videoRef,
  onVideoEnded,
  active,
  paused,
}: {
  reel: PopupReel;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onVideoEnded: () => void;
  active: boolean;
  paused: boolean;
}) {
  const href = reel.link ?? reel.url;

  if (reel.type === "instagram") {
    return (
      <InstagramReelPlayer
        reel={reel}
        videoRef={videoRef}
        onVideoEnded={onVideoEnded}
        active={active}
        paused={paused}
        fallbackHref={href}
      />
    );
  }

  if (reel.type === "video") {
    return (
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={reel.url}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          muted
          autoPlay
          onEnded={onVideoEnded}
        />
      </div>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block aspect-[9/16] w-full overflow-hidden bg-neutral-100"
    >
      <Image
        src={reel.url}
        alt={reel.title ?? "프로모션"}
        fill
        className="object-cover"
        sizes="400px"
        priority
      />
    </Link>
  );
}

function InstagramReelPlayer({
  reel,
  videoRef,
  onVideoEnded,
  active,
  paused,
  fallbackHref,
}: {
  reel: PopupReel;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onVideoEnded: () => void;
  active: boolean;
  paused: boolean;
  fallbackHref: string;
}) {
  const [videoSrc, setVideoSrc] = useState<string | null>(reel.videoUrl ?? null);
  const [loading, setLoading] = useState(!reel.videoUrl);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (reel.videoUrl) {
      setVideoSrc(reel.videoUrl);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(
          `/api/instagram-reel?url=${encodeURIComponent(reel.url)}`,
        );
        if (!res.ok) throw new Error("resolve failed");
        const data = (await res.json()) as { videoUrl?: string };
        if (!cancelled && data.videoUrl) {
          setVideoSrc(data.videoUrl);
        }
      } catch {
        if (!cancelled) setVideoSrc(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reel.url, reel.videoUrl]);

  useEffect(() => {
    if (!active || !videoSrc || !videoRef.current) return;
    const el = videoRef.current;
    el.muted = muted;
    if (paused) {
      el.pause();
    } else {
      void el.play().catch(() => undefined);
    }
  }, [active, videoSrc, muted, paused, videoRef]);

  useEffect(() => {
    if (!videoSrc || !videoRef.current) return;
    videoRef.current.currentTime = 0;
  }, [videoSrc, reel.url, videoRef]);

  useEffect(() => {
    if (videoSrc || loading) return;
    const embed = instagramEmbedUrl(reel.url, { autoplay: true });
    if (!embed) return;
    const t = window.setTimeout(
      onVideoEnded,
      (reel.durationSec ?? 30) * 1000,
    );
    return () => window.clearTimeout(t);
  }, [videoSrc, loading, reel.url, reel.durationSec, onVideoEnded]);

  if (loading) {
    return (
      <div className="flex aspect-[9/16] items-center justify-center bg-neutral-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#39FF14]" />
      </div>
    );
  }

  if (videoSrc) {
    return (
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={videoSrc}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          muted={muted}
          autoPlay
          preload="auto"
          onEnded={onVideoEnded}
        />
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="absolute right-3 bottom-3 z-10 rounded-full bg-black/55 px-2.5 py-1.5 text-[11px] text-white backdrop-blur-sm"
          aria-label={muted ? "소리 켜기" : "소리 끄기"}
        >
          {muted ? "🔇" : "🔊"}
        </button>
      </div>
    );
  }

  const embed = instagramEmbedUrl(reel.url, { autoplay: true });
  if (!embed) {
    return (
      <div className="flex aspect-[9/16] items-center justify-center bg-neutral-100">
        <a
          href={fallbackHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-[#0095f6] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Instagram에서 보기
        </a>
      </div>
    );
  }

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden bg-neutral-950">
      <iframe
        src={embed}
        title={reel.title ?? "짐라이트 Instagram Reel"}
        className="absolute left-0 w-full border-0"
        style={{ height: "118%", top: "-9%" }}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        loading="eager"
      />
    </div>
  );
}

function InstagramIconHeart() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.763a4.21 4.21 0 0 1 3.679-1.938Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function InstagramIconComment() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIconShare() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 3 9.218 15.083M22 3l-7.19 19L9.218 15.083M22 3 2 9.917l7.218 5.166"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIconBookmark() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
