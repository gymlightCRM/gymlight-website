"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getActiveBannerSlides,
  instagramEmbedUrl,
  type BannerSlide,
} from "@/data/banner-slides";

const TRANSITION_MS = 500;

export default function MainBannerCarousel() {
  const slides = getActiveBannerSlides();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const current = slides[index];

  const goTo = useCallback(
    (nextIndex: number) => {
      if (slides.length <= 1 || animating) return;
      setAnimating(true);
      window.setTimeout(() => {
        setIndex((nextIndex + slides.length) % slides.length);
        setAnimating(false);
      }, TRANSITION_MS);
    },
    [slides.length, animating],
  );

  const goNext = useCallback(() => {
    goTo(index + 1);
  }, [goTo, index]);

  const goPrev = useCallback(() => {
    goTo(index - 1);
  }, [goTo, index]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    clearTimer();
    if (!current || slides.length <= 1 || paused) return;

    if (current.type === "video") {
      const maxMs = (current.durationSec ?? 120) * 1000;
      timerRef.current = setTimeout(goNext, maxMs);
      return clearTimer;
    }

    const sec =
      current.durationSec ??
      (current.type === "instagram" ? 30 : 8);
    timerRef.current = setTimeout(goNext, sec * 1000);
    return clearTimer;
  }, [index, current, goNext, paused, slides.length]);

  useEffect(() => {
    if (current?.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      void videoRef.current.play().catch(() => undefined);
    }
  }, [index, current?.type, current?.url]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section
      className="relative border-b border-white/10 bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="메인 배너"
    >
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
          <div
            className={`relative aspect-[9/16] w-full max-h-[min(72vh,720px)] sm:aspect-video sm:max-h-[min(56vh,520px)] transition-opacity duration-500 ${
              animating ? "opacity-0" : "opacity-100"
            }`}
          >
            <SlideContent
              slide={current}
              videoRef={videoRef}
              onVideoEnded={goNext}
            />
          </div>

          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white/80 backdrop-blur hover:bg-black/80 hover:text-white"
                aria-label="이전"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white/80 backdrop-blur hover:bg-black/80 hover:text-white"
                aria-label="다음"
              >
                ›
              </button>
            </>
          )}

          {current.title && (
            <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-4">
              <p className="text-sm font-semibold text-white">{current.title}</p>
            </div>
          )}
        </div>

        {slides.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-[#39FF14]"
                    : "w-1.5 bg-white/25 hover:bg-white/40"
                }`}
                aria-label={`${i + 1}번째 배너`}
              />
            ))}
          </div>
        )}

        {paused && slides.length > 1 && (
          <p className="mt-2 text-center text-xs text-white/30">일시정지 중</p>
        )}
      </div>
    </section>
  );
}

function SlideContent({
  slide,
  videoRef,
  onVideoEnded,
}: {
  slide: BannerSlide;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onVideoEnded: () => void;
}) {
  const href = slide.link ?? slide.url;

  if (slide.type === "instagram") {
    const embed = instagramEmbedUrl(slide.url);
    if (!embed) {
      return (
        <FallbackLink href={href} label="Instagram에서 보기" />
      );
    }
    return (
      <iframe
        src={embed}
        title={slide.title ?? "Instagram"}
        className="absolute inset-0 h-full w-full border-0"
        allow="autoplay; encrypted-media; picture-in-picture"
        loading="lazy"
      />
    );
  }

  if (slide.type === "video") {
    return (
      <video
        ref={videoRef}
        src={slide.url}
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
        src={slide.url}
        alt={slide.title ?? "배너"}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 1200px"
        priority
      />
    </Link>
  );
}

function FallbackLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-[#39FF14] px-6 py-3 text-sm font-bold text-black"
      >
        {label}
      </a>
    </div>
  );
}
