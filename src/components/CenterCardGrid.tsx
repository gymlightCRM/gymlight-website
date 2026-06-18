"use client";

import { useState } from "react";
import { centers, type Center } from "@/data/centers";
import CenterModal from "./CenterModal";

export default function CenterCardGrid() {
  const [selected, setSelected] = useState<Center | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {centers.map((center) => (
          <button
            key={center.id}
            type="button"
            onClick={() => setSelected(center)}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left transition-all hover:border-white/20 hover:bg-white/[0.06]"
          >
            <div
              className="mb-3 h-1 w-12 rounded-full"
              style={{ backgroundColor: center.colors.primary }}
            />
            <p
              className="text-xs font-bold tracking-wider uppercase"
              style={{ color: center.colors.primary }}
            >
              {center.number}
            </p>
            <h3 className="mt-1 text-lg font-bold text-white group-hover:text-[#39FF14]">
              {center.name}
            </h3>
            <p className="mt-2 text-sm text-white/50">{center.address}</p>
            <p className="mt-3 text-xs text-white/30">
              클릭하여 상세 정보 보기 →
            </p>
          </button>
        ))}
      </div>

      {selected && (
        <CenterModal center={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
