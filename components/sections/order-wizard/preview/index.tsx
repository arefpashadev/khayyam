"use client";

import { CircleHelp, Laptop as LaptopIcon, MonitorSmartphone, Smartphone, X } from "lucide-react";
import { motion } from "motion/react";
import { useState, type ReactNode } from "react";

import { Link } from "@/i18n/navigation";

import { buildPreviewVars } from "../config";
import { useWizard } from "../store";
import { useIsSmallScreen } from "../use-small-screen";
import { AppPreview } from "./app-preview";
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

export type DeskView = "both" | "laptop" | "phone";

export const deskViews: { value: DeskView; label: string; icon: typeof LaptopIcon }[] = [
  { value: "both", label: "هر دو", icon: MonitorSmartphone },
  { value: "laptop", label: "لپ‌تاپ", icon: LaptopIcon },
  { value: "phone", label: "موبایل", icon: Smartphone },
];

const pill = "flex h-9 items-center gap-2 rounded-full bg-white/8 px-3.5 text-[12px] font-bold text-[#c9d0d9] ring-1 ring-white/8 backdrop-blur";

/**
 * The live preview canvas: a dark stage lit by the brand's own two colours.
 * - mobile: small floating toolbar (exit, help) and laptop + phone side by side
 * - studio (desktop): view switch floating at the top; chrome lives in the header
 */
export const PreviewStage = ({ studio = false }: { studio?: boolean }) => {
  const kind = useWizard((state) => state.kind);
  const config = useWizard((state) => state.config);
  const setTour = useWizard((state) => state.setTour);
  const isSmall = useIsSmallScreen();
  const [deskView, setDeskView] = useState<DeskView>("both");
  const address = config.brandName.trim().replace(/\s+/g, "-") || "your-brand";
  const view: DeskView = kind === "app" ? "phone" : studio ? deskView : "both";

  const phone = <Phone>{kind === "app" ? <AppPreview config={config} /> : <SitePreview config={config} compact />}</Phone>;
  const laptop = (
    <Laptop address={address}>
      <SitePreview config={config} compact={false} />
    </Laptop>
  );

  return (
    <div className="relative size-full overflow-hidden bg-[#0b0d12]" style={buildPreviewVars(config)}>
      {/* stage lighting from the brand colours */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute left-[10%] top-[8%] h-[55%] w-[45%] rounded-full opacity-35 blur-[120px] transition-colors duration-700" style={{ backgroundColor: config.color }} />
        <span className="absolute bottom-[0%] right-[8%] h-[50%] w-[40%] rounded-full opacity-25 blur-[120px] transition-colors duration-700" style={{ backgroundColor: config.accent }} />
        <span className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "26px 26px", maskImage: "radial-gradient(ellipse at center, #000 40%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at center, #000 40%, transparent 80%)" }} />
      </div>

      <div className={`absolute z-10 flex items-center gap-2 ${studio ? "right-5 top-5" : "inset-x-3 top-4"}`}>
        {!studio && (
          <>
            <Link href="/" aria-label="خروج" className={`${pill} size-9 justify-center px-0`}>
              <X className="size-4" aria-hidden="true" />
            </Link>
            <button type="button" onClick={() => setTour({ name: "editor", step: 0 })} aria-label="راهنما" className={`${pill} size-9 justify-center px-0`}>
              <CircleHelp className="size-4" aria-hidden="true" />
            </button>
          </>
        )}
        <span className={pill}>
          <span className="relative flex size-1.5">
            <span className="absolute hidden size-full rounded-full bg-[#2fd08a] opacity-60 lg:motion-safe:inline-flex lg:motion-safe:animate-ping" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[#2fd08a]" />
          </span>
          پیش‌نمایش زنده
        </span>
      </div>

      {studio && kind === "site" && (
        <div role="radiogroup" aria-label="نمایش" className="absolute left-1/2 top-5 z-10 flex -translate-x-1/2 gap-0.5 rounded-full bg-white/8 p-1 ring-1 ring-white/8 backdrop-blur">
          {deskViews.map((option) => {
            const selected = deskView === option.value;
            return (
              <button key={option.value} type="button" role="radio" aria-checked={selected} onClick={() => setDeskView(option.value)} className="relative flex h-7 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#4da3ff]">
                {selected && <motion.span layoutId="pv-desk-view" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", bounce: 0.15, duration: 0.35 }} />}
                <option.icon className={`relative size-4 ${selected ? "text-[#0b0d12]" : "text-[#8a93a0]"}`} aria-hidden="true" />
                <span className={`relative ${selected ? "text-[#0b0d12]" : "text-[#c9d0d9]"}`}>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <div data-tour="stage" className={`absolute ${studio ? "inset-x-10 bottom-8 top-20" : "inset-0 px-3 pb-3 pt-16"}`}>
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
