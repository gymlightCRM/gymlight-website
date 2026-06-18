"use client";

import { useEffect } from "react";
import {
  naverDirectionsUrl,
  naverPlaceUrl,
  type Center,
} from "@/data/centers";

interface CenterModalProps {
  center: Center;
  onClose: () => void;
}

export default function CenterModal({ center, onClose }: CenterModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="center-modal-title"
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-6 py-5"
          style={{
            background: `linear-gradient(135deg, ${center.colors.primary}22, transparent)`,
            borderBottom: `2px solid ${center.colors.primary}`,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="text-xs font-bold tracking-wider uppercase"
                style={{ color: center.colors.primary }}
              >
                {center.number}
              </p>
              <h2
                id="center-modal-title"
                className="mt-1 text-2xl font-bold text-white"
              >
                짐라이트 {center.name}
              </h2>
              <p className="mt-1 text-sm text-white/50">{center.district}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          <InfoRow icon="📍" label="주소" value={center.address} />
          <InfoRow
            icon="📞"
            label="전화"
            value={center.phone}
            href={`tel:${center.phone.replace(/-/g, "")}`}
          />
          <InfoRow
            icon="🕐"
            label="운영시간"
            value={
              <>
                <span className="block">평일 {center.hours.weekday}</span>
                <span className="block">토요일 {center.hours.saturday}</span>
                <span className="block">일·공휴일 {center.hours.sunday}</span>
                {center.hours.closed && (
                  <span className="mt-1 block text-white/40">
                    {center.hours.closed}
                  </span>
                )}
              </>
            }
          />
          <InfoRow icon="🅿️" label="주차" value={center.parking} />

          <div>
            <p className="mb-2 text-xs font-medium tracking-wider text-white/40 uppercase">
              시설 특징
            </p>
            <div className="flex flex-wrap gap-2">
              {center.features.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-white/10 px-6 py-4">
          <a
            href={naverPlaceUrl(center.naverPlaceId)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg py-3 text-center text-sm font-semibold text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: center.colors.primary }}
          >
            네이버 플레이스
          </a>
          <a
            href={naverDirectionsUrl(center.naverPlaceId)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg border border-white/20 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white/5"
          >
            길찾기
          </a>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  href?: string;
}) {
  const content = href ? (
    <a href={href} className="text-[#39FF14] hover:underline">
      {value}
    </a>
  ) : (
    <span className="text-white/80">{value}</span>
  );

  return (
    <div className="flex gap-3">
      <span className="text-base" aria-hidden>
        {icon}
      </span>
      <div>
        <p className="text-xs font-medium tracking-wider text-white/40 uppercase">
          {label}
        </p>
        <div className="mt-0.5 text-sm leading-relaxed">{content}</div>
      </div>
    </div>
  );
}
