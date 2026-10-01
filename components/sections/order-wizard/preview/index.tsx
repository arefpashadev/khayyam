"use client";

import { Shuffle, X } from "lucide-react";
import type { ReactNode } from "react";

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

export const PreviewStage = () => {
  const kind = useWizard((state) => state.kind);
  const config = useWizard((state) => state.config);
  const isSmall = useIsSmallScreen();
  const shuffle = useWizard((state) => state.shuffle);
  const address = config.brandName.trim().replace(/\s+/g, "-") || "your-brand";

  const phone = <Phone>{kind === "app" ? <AppPreview config={config} /> : <SitePreview config={config} compact />}</Phone>;

  return (
    <div className="relative size-full bg-[radial-gradient(120%_90%_at_50%_45%,#f8fafb_0%,#e6ebee_62%,#dce3e7_100%)]" style={buildPreviewVars(config)}>
      <div className="absolute right-3 top-4 z-10 flex items-center gap-2 lg:right-5 lg:top-5">
        <Link href="/" aria-label="خروج" className="flex size-8 items-center justify-center rounded-full bg-white/85 text-[#4d5b65] shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:text-[#14202b] focus-visible:outline-2 focus-visible:outline-[#078ef0]">
          <X className="size-4" aria-hidden="true" />
        </Link>
        <span className="flex h-8 items-center gap-2 rounded-full bg-white/85 px-3 text-[11px] font-bold text-[#4d5b65] shadow-sm ring-1 ring-black/5 backdrop-blur">
          <span className="relative flex size-1.5">
            <span className="absolute hidden size-full rounded-full bg-[#22c27a] opacity-60 lg:motion-safe:inline-flex lg:motion-safe:animate-ping" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[#22c27a]" />
          </span>
          پیش‌نمایش زنده
        </span>
      </div>

      {kind === "site" && (
        <button
          type="button"
          onClick={shuffle}
          className="absolute left-3 top-4 z-10 flex h-8 items-center gap-1.5 rounded-full bg-[#14202b] px-3.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#078ef0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078ef0] active:scale-95 lg:left-5 lg:top-5"
        >
          <Shuffle className="size-3.5" aria-hidden="true" /> طرح دیگر
        </button>
      )}

      <div className="absolute inset-0 px-3 pb-3 pt-14 lg:px-6 lg:pb-6 lg:pt-14">
        {kind === "app" ? (
          <FitScene width={PHONE.width} height={PHONE.height}>{phone}</FitScene>
        ) : (
          <Composition
            small={isSmall}
            phone={phone}
            laptop={
              <Laptop address={address}>
                <SitePreview config={config} compact={false} />
              </Laptop>
            }
          />
        )}
      </div>
    </div>
  );
};
