"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { centers, type Center } from "@/data/centers";
import {
  BRANCH_MAP_COORDS,
  SEOUL_DISTRICT_RINGS,
  SEOUL_VIEWBOX,
} from "@/data/seoul-boundary";
import CenterModal from "./CenterModal";

const NEON = "#39FF14";

function ringsToPath(rings: { x: number; y: number }[][]): string {
  return rings
    .map((ring) => {
      if (ring.length === 0) return "";
      const [first, ...rest] = ring;
      return (
        `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}` +
        rest.map((p) => ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join("") +
        " Z"
      );
    })
    .join(" ");
}

interface SeoulMapProps {
  onSelect?: (center: Center) => void;
  selectedId?: string | null;
  className?: string;
}

export default function SeoulMap({
  onSelect,
  selectedId: controlledSelectedId,
  className = "",
}: SeoulMapProps) {
  const uid = useId().replace(/:/g, "");
  const [internalSelected, setInternalSelected] = useState<Center | null>(null);
  const selectedId = controlledSelectedId ?? internalSelected?.id ?? null;

  const seoulClipPath = useMemo(
    () => ringsToPath(SEOUL_DISTRICT_RINGS.flat()),
    [],
  );

  const handleSelect = useCallback(
    (center: Center) => {
      setInternalSelected(center);
      onSelect?.(center);
    },
    [onSelect],
  );

  const closeModal = () => setInternalSelected(null);

  const dotPatternId = `seoul-dots-${uid}`;
  const seoulClipId = `seoul-clip-${uid}`;

  return (
    <>
      <div className={`relative ${className}`}>
        <svg
          viewBox={`0 0 ${SEOUL_VIEWBOX.width} ${SEOUL_VIEWBOX.height}`}
          className="mx-auto h-auto w-full max-w-lg"
          role="img"
          aria-label="서울 지도 — 짐라이트 6개 지점"
        >
          <defs>
            <pattern
              id={dotPatternId}
              width="7"
              height="7"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="3.5" cy="3.5" r="1.15" fill="white" opacity="0.55" />
            </pattern>

            <clipPath id={seoulClipId}>
              <path d={seoulClipPath} />
            </clipPath>

            <filter id={`glow-${uid}`}>
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 도트 매트릭스 — 서울 25개 구 윤곽 클립 */}
          <rect
            x="0"
            y="0"
            width={SEOUL_VIEWBOX.width}
            height={SEOUL_VIEWBOX.height}
            fill={`url(#${dotPatternId})`}
            clipPath={`url(#${seoulClipId})`}
          />

          {/* 한강 (포스터 스타일 그린 밴드) */}
          <path
            d="M 28 248 C 120 268, 200 242, 392 258 C 360 278, 240 272, 28 288 Z"
            fill={NEON}
            opacity="0.07"
            clipPath={`url(#${seoulClipId})`}
          />
          <path
            d="M 28 248 C 120 268, 200 242, 392 258"
            fill="none"
            stroke={NEON}
            strokeWidth="0.6"
            opacity="0.12"
            clipPath={`url(#${seoulClipId})`}
          />

          {/* 구 경계 실루엣 (은은한 외곽선) */}
          <path
            d={seoulClipPath}
            fill="none"
            stroke="white"
            strokeWidth="0.6"
            opacity="0.12"
          />

          {/* 지점 마커 */}
          {centers.map((center) => {
            const pos = BRANCH_MAP_COORDS[center.id];
            if (!pos) return null;
            const isActive = selectedId === center.id;
            const label = center.number.replace("점", "");
            const size = isActive ? 11 : 9;

            return (
              <g
                key={center.id}
                className="cursor-pointer"
                onClick={() => handleSelect(center)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleSelect(center);
                }}
                role="button"
                tabIndex={0}
                aria-label={`${center.number} ${center.name}`}
              >
                {isActive && (
                  <rect
                    x={pos.x - 14}
                    y={pos.y - 14}
                    width="28"
                    height="28"
                    fill={NEON}
                    opacity="0.15"
                    className="animate-pulse"
                  />
                )}
                <text
                  x={pos.x}
                  y={pos.y - size - 4}
                  textAnchor="middle"
                  className="fill-white/70 text-[9px] font-medium"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {label}
                </text>
                <rect
                  x={pos.x - size / 2}
                  y={pos.y - size / 2}
                  width={size}
                  height={size}
                  fill={isActive ? center.colors.primary : NEON}
                  filter={isActive ? `url(#glow-${uid})` : undefined}
                  className="transition-all duration-200"
                />
              </g>
            );
          })}
        </svg>

        <p className="mt-4 text-center text-xs tracking-[0.2em] text-white/40 uppercase">
          Base in Seoul · 6 Locations
        </p>
      </div>

      {internalSelected && (
        <CenterModal center={internalSelected} onClose={closeModal} />
      )}
    </>
  );
}

export function CenterChipList({
  onSelect,
}: {
  onSelect: (center: Center) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {centers.map((center) => (
        <button
          key={center.id}
          type="button"
          onClick={() => onSelect(center)}
          className="shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors"
          style={{
            borderColor: center.colors.primary,
            color: center.colors.primary,
          }}
        >
          {center.number} {center.name}
        </button>
      ))}
    </div>
  );
}
