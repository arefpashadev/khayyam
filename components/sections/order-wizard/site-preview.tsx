import { ArrowLeft, Menu, Sparkles } from "lucide-react";

import type { Palette, StylePreset } from "./tokens";

type SitePreviewProps = {
  palette: Palette;
  preset: StylePreset;
  itemCount: number;
  brandName: string;
};

const densityGap: Record<StylePreset["density"], string> = {
  airy: "gap-5 p-7",
  balanced: "gap-4 p-6",
  compact: "gap-3 p-5",
};

export const SitePreview = ({ palette, preset, itemCount, brandName }: SitePreviewProps) => {
  const cards = Array.from({ length: Math.min(itemCount, 4) });

  return (
    <div
      style={
        {
          "--pv-primary": palette.primary,
          "--pv-soft": palette.primarySoft,
          "--pv-deep": palette.deep,
        } as React.CSSProperties
      }
      className={`overflow-hidden border border-[#e3e8eb] bg-white transition-all duration-500 ${preset.frameRadius} ${preset.shadow}`}
    >
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-[#edf0f2] bg-[#f6f7f8] px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="mx-auto flex h-6 w-2/3 max-w-[220px] items-center justify-center rounded-full bg-white text-[10px] text-[#8b969c] ring-1 ring-[#e7ebed]">
          {brandName.replace(/\s+/g, "").toLowerCase() || "yourbrand"}.ir
        </span>
      </div>

      {/* page content */}
      <div className={`transition-all duration-500 ${densityGap[preset.density]}`}>
        {/* nav */}
        <div className="flex items-center justify-between">
          <strong className="text-sm font-black text-[#20262a] transition-colors duration-500">{brandName}</strong>
          <div className="hidden items-center gap-4 text-[11px] text-[#8b969c] sm:flex">
            <span>خانه</span>
            <span>خدمات</span>
            <span>تماس</span>
          </div>
          <span
            className={`flex h-7 items-center gap-1 px-3 text-[10px] font-bold text-white transition-colors duration-500 ${preset.controlRadius}`}
            style={{ backgroundColor: "var(--pv-primary)" }}
          >
            شروع کنید
          </span>
          <Menu className="size-4 text-[#8b969c] sm:hidden" aria-hidden="true" />
        </div>

        {/* hero */}
        <div className="mt-2 grid items-center gap-5 sm:grid-cols-2">
          <div className="space-y-3">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold transition-colors duration-500"
              style={{ backgroundColor: "var(--pv-soft)", color: "var(--pv-primary)", borderRadius: "999px" }}
            >
              <Sparkles className="size-3" aria-hidden="true" /> معرفی برند شما
            </span>
            <div className="space-y-2">
              <div className="h-4 w-[92%] rounded-full bg-[#dde3e6]" />
              <div className="h-4 w-[70%] rounded-full bg-[#dde3e6]" />
            </div>
            <div className="h-2.5 w-[85%] rounded-full bg-[#eef1f2]" />
            <div className="flex items-center gap-2 pt-1">
              <span
                className={`flex h-8 items-center px-4 text-[11px] font-extrabold text-white transition-colors duration-500 ${preset.controlRadius}`}
                style={{ backgroundColor: "var(--pv-primary)" }}
              >
                مشاهده بیشتر <ArrowLeft className="ms-1 size-3.5" aria-hidden="true" />
              </span>
              <span className="text-[11px] font-bold text-[#69767d]">درباره ما</span>
            </div>
          </div>
          <div
            className={`aspect-[4/3] w-full transition-colors duration-500 ${preset.cardRadius}`}
            style={{ backgroundColor: "var(--pv-soft)" }}
          />
        </div>

        {/* feature cards */}
        <div className="mt-2 grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(cards.length, 3) || 1}, minmax(0,1fr))` }}>
          {cards.map((_, index) => (
            <div
              key={index}
              className={`border border-[#edf0f2] bg-white p-3 transition-all duration-500 ${preset.cardRadius}`}
            >
              <span
                className="flex size-6 items-center justify-center text-[10px] font-black text-white transition-colors duration-500"
                style={{ backgroundColor: "var(--pv-primary)", borderRadius: "999px" }}
              >
                {index + 1}
              </span>
              <div className="mt-2 h-2 w-[80%] rounded-full bg-[#dde3e6]" />
              <div className="mt-1.5 h-2 w-[55%] rounded-full bg-[#eef1f2]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
