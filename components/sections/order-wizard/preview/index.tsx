"use client";

import { CircleHelp, Laptop as LaptopIcon, LayoutTemplate, MonitorSmartphone, Smartphone, X } from "lucide-react";
import { motion } from "motion/react";
import { useState, type ReactNode } from "react";

import { Link } from "@/i18n/navigation";

import { buildPreviewVars, faNumber, mix } from "../config";
import { useWizard } from "../store";
import { useIsSmallScreen } from "../use-small-screen";
import { AppPreview } from "./app-preview";
import { DesignSheet } from "./design-sheet";
import { FitScene, Laptop, LAPTOP, Phone, PHONE } from "./devices";
import { SitePreview } from "./site-preview";

/**
 * Laptop and phone side by side, bottoms aligned. On phones the laptop is drawn smaller
 * so the phone next to it stays readable.
 */
const Composition = ({ laptop, phone, small }: { laptop: ReactNode; phone: ReactNode; small: boolean }) => {
  const scale = small ? 0.45 : 1;
  const gap = small ? 28 : 64;
  const laptopWidth = LAPTOP.width * scale;
  const laptopHeight = LAPTOP.height * scale;
  const width = laptopWidth + gap + PHONE.width;
  const height = Math.max(laptopHeight, PHONE.height);

  return (
    <FitScene width={width} height={height}>
      <div className="relative" dir="ltr" style={{ width, height }}>
        <div className="absolute bottom-0 left-0" style={{ width: laptopWidth, height: laptopHeight }}>
          {/* explicit size so the scaled laptop anchors to the top-left corner */}
          <div className="absolute left-0 top-0 origin-top-left" style={{ width: LAPTOP.width, height: LAPTOP.height, transform: `scale(${scale})` }}>
            {laptop}
          </div>
        </div>
        <div className="absolute bottom-0 right-0">{phone}</div>
      </div>
    </FitScene>
  );
};

type DeskView = "both" | "laptop" | "phone";

const deskViews: { value: DeskView; label: string; icon: typeof LaptopIcon }[] = [
  { value: "both", label: "هر دو", icon: MonitorSmartphone },
  { value: "laptop", label: "لپ‌تاپ", icon: LaptopIcon },
  { value: "phone", label: "موبایل", icon: Smartphone },
];

const pill = "flex h-9 items-center gap-2 rounded-full bg-white/85 px-3.5 text-[12px] font-bold text-[#4d5b65] shadow-[0_1px_2px_rgba(20,32,43,0.08)] backdrop-blur";

export const PreviewStage = () => {
  const kind = useWizard((state) => state.kind);
  const config = useWizard((state) => state.config);
  const setTour = useWizard((state) => state.setTour);
  const isSmall = useIsSmallScreen();
  const [designsOpen, setDesignsOpen] = useState(false);
  const [deskView, setDeskView] = useState<DeskView>("both");
  const address = config.brandName.trim().replace(/\s+/g, "-") || "your-brand";
  const view: DeskView = kind === "app" ? "phone" : isSmall ? "both" : deskView;

  const phone = <Phone>{kind === "app" ? <AppPreview config={config} /> : <SitePreview config={config} compact />}</Phone>;
  const laptop = (
    <Laptop address={address}>
      <SitePreview config={config} compact={false} />
    </Laptop>
  );

  // The stage picks up a whisper of the brand colour so it feels like the client's space.
  const tint = mix(config.color, "#eef2f4", 0.86);

  return (
    <div className="relative size-full" style={{ ...buildPreviewVars(config), background: `radial-gradient(110% 85% at 50% 42%, #fbfcfc 0%, ${tint} 72%, ${mix(config.color, "#dfe5e8", 0.9)} 100%)` }}>
      {/* soft dot grid, desktop only */}
      <div className="pointer-events-none absolute inset-0 hidden opacity-60 lg:block" style={{ backgroundImage: "radial-gradient(rgba(20,32,43,0.07) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="absolute inset-x-3 top-4 z-10 flex items-center gap-2 lg:inset-x-6 lg:top-5">
        <Link href="/" aria-label="خروج" className={`${pill} size-9 justify-center px-0 hover:text-[#14202b] lg:hidden`}>
          <X className="size-4" aria-hidden="true" />
        </Link>
        <span className={pill}>
          <span className="relative flex size-1.5">
            <span className="absolute hidden size-full rounded-full bg-[#22c27a] opacity-60 lg:motion-safe:inline-flex lg:motion-safe:animate-ping" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[#22c27a]" />
          </span>
          پیش‌نمایش زنده
        </span>
        <button type="button" onClick={() => setTour(0)} aria-label="راهنما" className={`${pill} size-9 justify-center px-0 hover:text-[#14202b] lg:hidden`}>
          <CircleHelp className="size-4" aria-hidden="true" />
        </button>

        {kind === "site" && !isSmall && (
          <div role="radiogroup" aria-label="نمایش" className="absolute left-1/2 flex -translate-x-1/2 gap-0.5 rounded-full bg-white/85 p-1 shadow-[0_1px_2px_rgba(20,32,43,0.08)] backdrop-blur">
            {deskViews.map((option) => {
              const selected = deskView === option.value;
              return (
                <button key={option.value} type="button" role="radio" aria-checked={selected} onClick={() => setDeskView(option.value)} className="relative flex h-7 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#078ef0]">
                  {selected && <motion.span layoutId="pv-desk-view" className="absolute inset-0 rounded-full bg-[#14202b]" transition={{ type: "spring", bounce: 0.15, duration: 0.35 }} />}
                  <option.icon className={`relative size-3.5 ${selected ? "text-white" : "text-[#7a868d]"}`} aria-hidden="true" />
                  <span className={`relative ${selected ? "text-white" : "text-[#5b6872]"}`}>{option.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {kind === "site" && (
          <button
            type="button"
            data-tour="designs"
            onClick={() => setDesignsOpen(true)}
            aria-haspopup="dialog"
            className="ms-auto flex h-9 items-center gap-2 rounded-full bg-[#14202b] px-4 text-[12px] font-bold text-white shadow-sm transition hover:bg-[#078ef0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078ef0] active:scale-95"
          >
            <LayoutTemplate className="size-4" aria-hidden="true" /> طرح‌ها
            <span className="rounded-full bg-white/15 px-1.5 py-px text-[11px]">{faNumber(config.variant + 1)}</span>
          </button>
        )}
      </div>
      <DesignSheet open={designsOpen} onClose={() => setDesignsOpen(false)} />

      <div className="absolute inset-0 px-3 pb-3 pt-16 lg:px-10 lg:pb-8 lg:pt-20">
        {view === "phone" ? (
          <FitScene width={PHONE.width} height={PHONE.height}>{phone}</FitScene>
        ) : view === "laptop" ? (
          <FitScene width={LAPTOP.width} height={LAPTOP.height}>{laptop}</FitScene>
        ) : (
          <Composition small={isSmall} phone={phone} laptop={laptop} />
        )}
      </div>
    </div>
  );
};
