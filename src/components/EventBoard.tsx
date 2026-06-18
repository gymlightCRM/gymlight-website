"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { centers } from "@/data/centers";
import { getSortedEvents, type EventPost } from "@/data/events";

function centerLabel(id: string): string {
  if (id === "all") return "전 지점";
  const c = centers.find((x) => x.id === id);
  return c ? c.name : id;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}.${m}.${d}`;
}

interface EventBoardProps {
  limit?: number;
  showFilter?: boolean;
}

export default function EventBoard({ limit, showFilter = false }: EventBoardProps) {
  const allEvents = getSortedEvents();
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<EventPost | null>(null);

  const filtered =
    filter === "all"
      ? allEvents
      : allEvents.filter(
          (e) => e.centers.includes("all") || e.centers.includes(filter),
        );

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  useEffect(() => {
    if (!selected) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [selected]);

  if (allEvents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/15 px-6 py-16 text-center">
        <p className="text-white/40">진행 중인 이벤트를 준비 중입니다.</p>
        <p className="mt-2 text-xs text-white/25">
          이벤트 이미지는 곧 게시됩니다.
        </p>
      </div>
    );
  }

  return (
    <>
      {showFilter && (
        <div className="mb-6 flex flex-wrap gap-2">
          <FilterChip
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="전체"
          />
          {centers.map((c) => (
            <FilterChip
              key={c.id}
              active={filter === c.id}
              onClick={() => setFilter(c.id)}
              label={c.name}
              color={c.colors.primary}
            />
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => setSelected(event)}
            className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] text-left transition-colors hover:border-white/20"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/5">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {event.isPinned && (
                <span className="absolute top-3 left-3 rounded-full bg-[#39FF14] px-2 py-0.5 text-xs font-bold text-black">
                  PIN
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs text-white/40">{formatDate(event.publishedAt)}</p>
              <h3 className="mt-1 font-bold text-white group-hover:text-[#39FF14]">
                {event.title}
              </h3>
              <div className="mt-2 flex flex-wrap gap-1">
                {event.centers.map((id) => (
                  <span
                    key={id}
                    className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/45"
                  >
                    {centerLabel(id)}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a0a]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 text-white/70 hover:text-white"
              aria-label="닫기"
            >
              ✕
            </button>
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={selected.image}
                alt={selected.title}
                fill
                className="object-contain"
                sizes="512px"
                priority
              />
            </div>
            <div className="border-t border-white/10 p-5">
              <p className="text-xs text-white/40">
                {formatDate(selected.publishedAt)}
              </p>
              <h2 className="mt-1 text-xl font-bold">{selected.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.centers.map((id) => (
                  <span
                    key={id}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50"
                  >
                    {centerLabel(id)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-[#39FF14] bg-[#39FF14]/15 text-[#39FF14]"
          : "border-white/15 text-white/50 hover:border-white/30"
      }`}
      style={active && color ? { borderColor: color, color } : undefined}
    >
      {label}
    </button>
  );
}
