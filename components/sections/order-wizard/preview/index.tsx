"use client";

import { CircleHelp, Laptop as LaptopIcon, LayoutTemplate, MonitorSmartphone, Smartphone, X } from "lucide-react";
import { motion } from "motion/react";
import { useState, type ReactNode } from "react";

import { Link } from "@/i18n/navigation";

import { buildPreviewVars, faNumber, mix, steps } from "../config";
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

const pill = "flex h-9 items-center gap-2 rounded-full bg-white/85 px-3.5 text-[12px] font-bold text-[#4d5b65] shadow-[0_1px_2px_rgba(20,32,43,0.08)] backdrop-blur";
const designStep = steps.findIndex((step) => step.key === "design");

/**
 * The live preview canvas.
 * - mobile: its own small toolbar (exit, help, change design), laptop + phone side by side
 * - studio (desktop): chrome lives in the top bar; the floating panel sits over the right side,
 *   so the scene is laid out in the space left of it, with a view switch floating at the bottom.
 */
export const PreviewStage = ({ studio = false }: { studio?: boolean }) => {
  const kind = useWizard((state) => state.kind);
  const config = useWizard((state) => state.config);
  const setTour = useWizard((state) => state.setTour);
  const goTo = useWizard((state) => state.goTo);
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

  // The canvas picks up a whisper of the brand colour so it feels like the client's space.
  const tint = mix(config.color, "#eef2f4", 0.86);

  return (
    <div className="relative size-full" style={{ ...buildPreviewVars(config), background: `radial-gradient(110% 85% at 40% 45%, #fbfcfc 0%, ${tint} 70%, ${mix(config.color, "#dfe5e8", 0.9)} 100%)` }}>
      {studio && <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(rgba(20,32,43,0.07) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />}

      {!studio && (
        <div className="absolute inset-x-3 top-4 z-10 flex items-center gap-2">
          <Link href="/" aria-label="خروج" className={`${pill} size-9 justify-center px-0`}>
            <X className="size-4" aria-hidden="true" />
          </Link>
          <button type="button" onClick={() => setTour({ name: "editor", step: 0 })} aria-label="راهنما" className={`${pill} size-9 justify-center px-0`}>
            <CircleHelp className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            data-tour="change-design"
            onClick={() => goTo(designStep)}
            className="ms-auto flex h-9 items-center gap-2 rounded-full bg-[#14202b] px-4 text-[12px] font-bold text-white shadow-sm active:scale-95"
          >
            <LayoutTemplate className="size-4" aria-hidden="true" /> طرح {faNumber(config.variant + 1)}
            <span className="text-white/60">تغییر</span>
          </button>
        </div>
      )}

      {studio && kind === "site" && (
        <div role="radiogroup" aria-label="نمایش" className="absolute bottom-6 z-10 flex -translate-x-1/2 gap-0.5 rounded-full bg-white/90 p-1 shadow-[0_8px_24px_-12px_rgba(20,32,43,0.35)] backdrop-blur" style={{ left: "calc((100% - 420px) / 2)" }}>
          {deskViews.map((option) => {
            const selected = deskView === option.value;
            return (
              <button key={option.value} type="button" role="radio" aria-checked={selected} onClick={() => setDeskView(option.value)} className="relative flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#078ef0]">
                {selected && <motion.span layoutId="pv-desk-view" className="absolute inset-0 rounded-full bg-[#14202b]" transition={{ type: "spring", bounce: 0.15, duration: 0.35 }} />}
                <option.icon className={`relative size-4 ${selected ? "text-white" : "text-[#7a868d]"}`} aria-hidden="true" />
                <span className={`relative ${selected ? "text-white" : "text-[#5b6872]"}`}>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <div data-tour="stage" className={`absolute ${studio ? "bottom-20 left-10 right-[460px] top-8" : "inset-0 px-3 pb-3 pt-16"}`}>
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
