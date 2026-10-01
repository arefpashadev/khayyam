import { BatteryFull, Bell, Home, Search, Signal, User, Wifi } from "lucide-react";

import type { Palette, StylePreset } from "./tokens";

type AppPreviewProps = {
  palette: Palette;
  preset: StylePreset;
  itemCount: number;
  brandName: string;
};

const densityGap: Record<StylePreset["density"], string> = {
  airy: "gap-4 p-5",
  balanced: "gap-3.5 p-4",
  compact: "gap-3 p-3.5",
};

export const AppPreview = ({ palette, preset, itemCount, brandName }: AppPreviewProps) => {
  const rows = Array.from({ length: Math.min(itemCount, 4) });

  return (
    <div
      style={
        {
          "--pv-primary": palette.primary,
          "--pv-soft": palette.primarySoft,
          "--pv-deep": palette.deep,
        } as React.CSSProperties
      }
      className="mx-auto w-full max-w-[300px]"
    >
      {/* phone bezel */}
      <div className={`relative overflow-hidden border-[6px] border-[#1c2024] bg-white transition-all duration-500 ${preset.frameRadius} ${preset.shadow}`}>
        {/* notch */}
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center">
          <div className="h-5 w-24 rounded-b-xl bg-[#1c2024]" />
        </div>

        {/* status bar */}
        <div className="flex items-center justify-between px-5 pb-1 pt-2 text-[10px] font-bold text-[#20262a]">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <Signal className="size-3" aria-hidden="true" />
            <Wifi className="size-3" aria-hidden="true" />
            <BatteryFull className="size-3.5" aria-hidden="true" />
          </div>
        </div>

        {/* app header */}
        <div
          className="flex items-center justify-between px-5 py-3 transition-colors duration-500"
          style={{ backgroundColor: "var(--pv-soft)" }}
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-white/70">
            <User className="size-3.5" style={{ color: "var(--pv-primary)" }} aria-hidden="true" />
          </span>
          <strong className="text-sm font-black text-[#20262a]">{brandName}</strong>
          <span className="relative flex size-7 items-center justify-center rounded-full bg-white/70">
            <Bell className="size-3.5" style={{ color: "var(--pv-primary)" }} aria-hidden="true" />
          </span>
        </div>

        {/* content */}
        <div className={`min-h-[300px] transition-all duration-500 ${densityGap[preset.density]}`}>
          {/* search / hero card */}
          <div className="flex items-center gap-2 border border-[#edf0f2] bg-[#fbfdfe] px-3 py-2.5 transition-all duration-500" style={{ borderRadius: preset.cardRadius.includes("full") ? "999px" : undefined }}>
            <Search className="size-3.5 text-[#9aa5aa]" aria-hidden="true" />
            <span className="h-2 w-1/2 rounded-full bg-[#e2e7e9]" />
          </div>

          <div
            className={`mt-3 flex aspect-[2/1] w-full flex-col justify-end p-3 text-white transition-colors duration-500 ${preset.cardRadius}`}
            style={{ backgroundColor: "var(--pv-primary)" }}
          >
            <div className="h-2.5 w-2/3 rounded-full bg-white/70" />
            <div className="mt-1.5 h-2 w-1/3 rounded-full bg-white/50" />
          </div>

          {/* list */}
          <div className="mt-3 space-y-2.5">
            {rows.map((_, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 border border-[#edf0f2] bg-white p-2.5 transition-all duration-500 ${preset.cardRadius}`}
              >
                <span
                  className="flex size-9 shrink-0 items-center justify-center text-[11px] font-black text-white transition-colors duration-500"
                  style={{ backgroundColor: "var(--pv-soft)", color: "var(--pv-deep)", borderRadius: "999px" }}
                >
                  {index + 1}
                </span>
                <div className="flex-1 space-y-1.5">
                  <div className="h-2 w-[75%] rounded-full bg-[#dde3e6]" />
                  <div className="h-1.5 w-[45%] rounded-full bg-[#eef1f2]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* bottom tab bar */}
        <div className="flex items-center justify-around border-t border-[#edf0f2] bg-white py-2.5">
          <Home className="size-4" style={{ color: "var(--pv-primary)" }} aria-hidden="true" />
          <Search className="size-4 text-[#c2cacd]" aria-hidden="true" />
          <Bell className="size-4 text-[#c2cacd]" aria-hidden="true" />
          <User className="size-4 text-[#c2cacd]" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};
