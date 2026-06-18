"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { centers, type Center } from "@/data/centers";
import {
  BRANCH_LABEL_OFFSET,
  BRANCH_MAP_COORDS,
  MAP_DISPLAY_VIEWBOX,
  SEOUL_DISTRICT_RINGS,
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
  const dotGlowId = `seoul-dots-glow-${uid}`;
  const seoulClipId = `seoul-clip-${uid}`;
  const riverGradId = `river-grad-${uid}`;
  const frameGradId = `frame-grad-${uid}`;

  const vb = MAP_DISPLAY_VIEWBOX;

  return (
    <>
      <div className={`relative ${className}`}>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-4 sm:p-6">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(57,255,20,0.12), transparent 70%)",
            }}
          />
          <div className="pointer-events-none absolute top-3 left-3 h-5 w-5 border-t border-l border-[#39FF14]/40" />
          <div className="pointer-events-none absolute top-3 right-3 h-5 w-5 border-t border-r border-[#39FF14]/40" />
          <div className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b border-l border-[#39FF14]/40" />
          <div className="pointer-events-none absolute right-3 bottom-3 h-5 w-5 border-r border-b border-[#39FF14]/40" />

          <svg
            viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`}
            className="relative mx-auto h-auto w-full"
            role="img"
            aria-label="서울 지도 — 짐라이트 6개 지점"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <pattern
                id={dotPatternId}
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="3" cy="3" r="0.85" fill="white" opacity="0.35" />
              </pattern>

              <pattern
                id={dotGlowId}
                width="18"
                height="18"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="9" cy="9" r="1.2" fill={NEON} opacity="0.08" />
              </pattern>

              <clipPath id={seoulClipId}>
                <path d={seoulClipPath} />
              </clipPath>

              <linearGradient id={riverGradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={NEON} stopOpacity="0" />
                <stop offset="35%" stopColor={NEON} stopOpacity="0.14" />
                <stop offset="65%" stopColor={NEON} stopOpacity="0.14" />
                <stop offset="100%" stopColor={NEON} stopOpacity="0" />
              </linearGradient>

              <linearGradient id={frameGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={NEON} stopOpacity="0.35" />
                <stop offset="50%" stopColor="white" stopOpacity="0.08" />
                <stop offset="100%" stopColor={NEON} stopOpacity="0.2" />
              </linearGradient>

              <filter id={`glow-${uid}`}>
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id={`soft-glow-${uid}`}>
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect
              x={vb.x}
              y={vb.y}
              width={vb.width}
              height={vb.height}
              fill={`url(#${dotGlowId})`}
              opacity="0.6"
            />

            <rect
              x={vb.x}
              y={vb.y}
              width={vb.width}
              height={vb.height}
              fill={`url(#${dotPatternId})`}
              clipPath={`url(#${seoulClipId})`}
            />

            <path
              d="M 28 248 C 120 268, 200 242, 392 258 C 360 278, 240 272, 28 288 Z"
              fill={`url(#${riverGradId})`}
              clipPath={`url(#${seoulClipId})`}
            />
            <path
              d="M 28 248 C 120 268, 200 242, 392 258"
              fill="none"
              stroke={NEON}
              strokeWidth="0.8"
              opacity="0.22"
              clipPath={`url(#${seoulClipId})`}
              filter={`url(#soft-glow-${uid})`}
            />

            <path
              d={seoulClipPath}
              fill="none"
              stroke={`url(#${frameGradId})`}
              strokeWidth="1.2"
              opacity="0.55"
            />
            <path
              d={seoulClipPath}
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              opacity="0.1"
            />

            {centers.map((center) => {
              const pos = BRANCH_MAP_COORDS[center.id];
              if (!pos) return null;
              const isActive = selectedId === center.id;
              const label = center.number.replace("점", "");
              const size = isActive ? 10 : 8;
              const labelCfg = BRANCH_LABEL_OFFSET[center.id] ?? {
                dx: 0,
                dy: -12,
                anchor: "middle" as const,
              };
              const labelX = pos.x + labelCfg.dx;
              const labelY = pos.y + labelCfg.dy;

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
                    <>
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="16"
                        fill={center.colors.primary}
                        opacity="0.12"
                        className="animate-pulse"
                      />
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="22"
                        fill="none"
                        stroke={NEON}
                        strokeWidth="0.6"
                        opacity="0.35"
                      />
                    </>
                  )}

                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={labelCfg.anchor}
                    className="text-[8.5px] font-semibold tracking-wide"
                    fill={isActive ? center.colors.primary : "rgba(255,255,255,0.75)"}
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    {label}
                  </text>

                  <rect
                    x={pos.x - size / 2 - 1}
                    y={pos.y - size / 2 - 1}
                    width={size + 2}
                    height={size + 2}
                    fill="black"
                    opacity="0.35"
                    rx="1"
                  />
                  <rect
                    x={pos.x - size / 2}
                    y={pos.y - size / 2}
                    width={size}
                    height={size}
                    fill={isActive ? center.colors.primary : NEON}
                    filter={isActive ? `url(#glow-${uid})` : undefined}
                    className="transition-all duration-200"
                    rx="0.5"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <p className="mt-5 text-center text-xs tracking-[0.25em] text-white/40 uppercase">
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
