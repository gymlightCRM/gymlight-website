"use client";

import { useCallback, useState } from "react";
import { centers, type Center } from "@/data/centers";
import CenterModal from "./CenterModal";

function seoulSilhouettePath(): string {
  return [
    "M 48 88 L 52 72 L 58 58 L 68 42 L 82 28 L 98 18 L 118 12",
    "L 142 8 L 168 10 L 192 16 L 212 26 L 228 38 L 240 52",
    "L 248 68 L 252 82 L 254 98 L 252 112 L 246 128 L 238 142",
    "L 228 158 L 218 172 L 208 188 L 198 202 L 188 218 L 178 232",
    "L 168 248 L 158 262 L 148 278 L 138 292 L 128 306 L 118 318",
    "L 108 328 L 98 336 L 88 342 L 78 346 L 68 348 L 58 346",
    "L 50 340 L 44 330 L 40 318 L 38 304 L 36 288 L 34 272",
    "L 32 256 L 30 240 L 28 224 L 26 208 L 24 192 L 22 176",
    "L 20 160 L 18 144 L 16 128 L 14 112 L 12 96 L 14 82",
    "L 18 68 L 24 56 L 32 46 L 40 38 Z",
  ].join(" ");
}

function hanRiverPath(): string {
  return "M 20 155 Q 80 175 140 168 Q 200 160 250 175 Q 230 195 170 190 Q 110 185 50 200 Z";
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
  const [internalSelected, setInternalSelected] = useState<Center | null>(null);
  const selectedId = controlledSelectedId ?? internalSelected?.id ?? null;

  const handleSelect = useCallback(
    (center: Center) => {
      setInternalSelected(center);
      onSelect?.(center);
    },
    [onSelect],
  );

  const closeModal = () => setInternalSelected(null);

  return (
    <>
      <div className={`relative ${className}`}>
        <svg
          viewBox="0 0 260 360"
          className="mx-auto h-auto w-full max-w-md"
          role="img"
          aria-label="서울 지도 — 짐라이트 6개 지점"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="mapFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <path
            d={seoulSilhouettePath()}
            fill="url(#mapFill)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <path
            d={hanRiverPath()}
            fill="rgba(57,255,20,0.04)"
            stroke="rgba(57,255,20,0.12)"
            strokeWidth="0.5"
          />

          {centers.map((center) => {
            const x = (center.mapPosition.x / 100) * 260;
            const y = (center.mapPosition.y / 100) * 360;
            const isActive = selectedId === center.id;

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
                  <circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill={center.colors.primary}
                    opacity="0.25"
                    className="animate-pulse"
                  />
                )}
                <rect
                  x={x - 5}
                  y={y - 5}
                  width="10"
                  height="10"
                  fill={isActive ? center.colors.primary : "#39FF14"}
                  stroke={center.colors.secondary}
                  strokeWidth="1"
                  filter={isActive ? "url(#glow)" : undefined}
                  className="transition-all duration-200 hover:scale-125"
                  style={{ transformOrigin: `${x}px ${y}px` }}
                />
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  className="fill-white/60 text-[7px] font-medium"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {center.number.replace("점", "")}
                </text>
              </g>
            );
          })}
        </svg>

        <p className="mt-4 text-center text-xs tracking-widest text-white/40 uppercase">
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
