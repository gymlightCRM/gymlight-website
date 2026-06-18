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

    if (current.type === "video") {
      timerRef.current = setTimeout(goNext, (current.durationSec ?? 120) * 1000);
      return clearTimer;
    }

    const sec =
      current.durationSec ?? (current.type === "instagram" ? 30 : 8);
    timerRef.current = setTimeout(goNext, sec * 1000);
    return clearTimer;
  }, [open, index, current, goNext, paused, reels.length]);

  useEffect(() => {
    if (open && current?.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      void videoRef.current.play().catch(() => undefined);
    }
  }, [open, index, current?.type, current?.url]);

  if (reels.length === 0 || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="짐라이트 프로모션"
      onClick={close}
    >
      <div
        className="relative w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button
          type="button"
          onClick={close}
          className="absolute -top-10 right-0 z-20 text-sm text-white/70 hover:text-white"
          aria-label="닫기"
        >
          닫기 ✕
        </button>

        <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0a0a0a] shadow-2xl shadow-[#39FF14]/10">
          <div
            className={`relative aspect-[9/16] max-h-[min(75vh,640px)] w-full transition-opacity duration-300 ${
              animating ? "opacity-0" : "opacity-100"
            }`}
          >
            <ReelContent
              reel={current}
              videoRef={videoRef}
              onVideoEnded={goNext}
            />
          </div>

          {reels.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-black/70 p-2.5 text-lg text-white/90 backdrop-blur hover:bg-black"
                aria-label="이전"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-black/70 p-2.5 text-lg text-white/90 backdrop-blur hover:bg-black"
                aria-label="다음"
              >
                ›
              </button>
            </>
          )}

          {current.title && (
            <div className="absolute right-0 bottom-14 left-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-3">
              <p className="text-sm font-semibold text-white">{current.title}</p>
            </div>
          )}

          <div className="border-t border-white/10 px-4 py-3">
            {reels.length > 1 && (
              <div className="mb-3 flex justify-center gap-1.5">
                {reels.map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`h-1 rounded-full transition-all ${
                      i === index
                        ? "w-5 bg-[#39FF14]"
                        : "w-1 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`${i + 1}번째`}
                  />
                ))}
              </div>
            )}

            <label className="flex cursor-pointer items-center justify-center gap-2 text-xs text-white/50">
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
      </div>
    </div>
  );
}

function ReelContent({
  reel,
  videoRef,
  onVideoEnded,
}: {
  reel: PopupReel;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onVideoEnded: () => void;
}) {
  const href = reel.link ?? reel.url;

  if (reel.type === "instagram") {
    const embed = instagramEmbedUrl(reel.url);
    if (!embed) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#39FF14] px-6 py-3 text-sm font-bold text-black"
          >
            Instagram에서 보기
          </a>
        </div>
      );
    }
    return (
      <iframe
        src={embed}
        title={reel.title ?? "Instagram Reel"}
        className="absolute inset-0 h-full w-full border-0"
        allow="autoplay; encrypted-media; picture-in-picture"
      />
    );
  }

  if (reel.type === "video") {
    return (
      <video
        ref={videoRef}
        src={reel.url}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
        autoPlay
        onEnded={onVideoEnded}
      />
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute inset-0 block"
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
