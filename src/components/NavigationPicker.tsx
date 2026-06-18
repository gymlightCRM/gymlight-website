"use client";

import { useEffect } from "react";
import type { Center } from "@/data/centers";
import {
  centerToNavigationTarget,
  NAV_PROVIDERS,
  openNavigation,
  type NavProvider,
} from "@/lib/navigation-links";

interface NavigationPickerProps {
  center: Center;
  onClose: () => void;
}

export default function NavigationPicker({
  center,
  onClose,
}: NavigationPickerProps) {
  const target = centerToNavigationTarget(center);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSelect = (provider: NavProvider) => {
    openNavigation(provider, target);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="길찾기 앱 선택"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs font-medium tracking-wider text-white/40 uppercase">
              길찾기
            </p>
            <p className="mt-0.5 text-sm font-semibold text-white">
              짐라이트 {center.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 p-4">
          {NAV_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => handleSelect(provider.id)}
              className={`rounded-xl py-4 text-sm font-semibold transition-opacity hover:opacity-90 ${provider.className}`}
            >
              {provider.label}
            </button>
          ))}
        </div>

        <p className="border-t border-white/10 px-4 py-3 text-center text-[11px] text-white/35">
          앱이 설치되어 있으면 해당 앱으로 연결됩니다
        </p>
      </div>
    </div>
  );
}
