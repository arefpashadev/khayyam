"use client";

import { Laptop as LaptopIcon, Smartphone } from "lucide-react";
import { motion } from "motion/react";
import { useState, useSyncExternalStore } from "react";

import { buildPreviewVars } from "../config";
import { useWizard } from "../store";
import { AppPreview } from "./app-preview";
import { FitScene, Laptop, LAPTOP, Phone, PHONE } from "./devices";
import { SitePreview } from "./site-preview";

const query = "(max-width: 1023px)";
const subscribe = (callback: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const useIsSmallScreen = () => useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);

/** Laptop with the phone leaning against its left edge. */
const SCENE = { width: 1720, height: 900, laptopLeft: 160 };

type SmallDevice = "phone" | "laptop";

export const PreviewStage = () => {
  const kind = useWizard((state) => state.kind);
  const config = useWizard((state) => state.config);
  const isSmall = useIsSmallScreen();
  const [smallDevice, setSmallDevice] = useState<SmallDevice>("phone");
  const address = config.brandName.trim().replace(/\s+/g, "-") || "your-brand";

  const laptop = (
    <Laptop address={address}>
      <SitePreview config={config} compact={false} />
    </Laptop>
  );
  const phone = <Phone>{kind === "app" ? <AppPreview config={config} /> : <SitePreview config={config} compact />}</Phone>;

  let scene;
  if (kind === "app") {
    scene = <FitScene width={PHONE.width} height={PHONE.height}>{phone}</FitScene>;
  } else if (!isSmall) {
    scene = (
      <FitScene width={SCENE.width} height={SCENE.height}>
        <div className="relative" style={{ width: SCENE.width, height: SCENE.height }}>
          <div className="absolute top-0" style={{ left: SCENE.laptopLeft }}>
            {laptop}
          </div>
          <div className="absolute bottom-0 left-0">{phone}</div>
        </div>
      </FitScene>
    );
  } else {
    scene =
      smallDevice === "phone" ? (
        <FitScene width={PHONE.width} height={PHONE.height}>{phone}</FitScene>
      ) : (
        <FitScene width={LAPTOP.width} height={LAPTOP.height}>{laptop}</FitScene>
      );
  }

  return (
    <div className="relative size-full bg-[radial-gradient(120%_90%_at_50%_45%,#f8fafb_0%,#e6ebee_62%,#dce3e7_100%)]" style={buildPreviewVars(config)}>
      <span className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-bold text-[#4d5b65] shadow-sm ring-1 ring-black/5 backdrop-blur lg:right-6 lg:top-5">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full rounded-full bg-[#22c27a] opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex size-1.5 rounded-full bg-[#22c27a]" />
        </span>
        پیش‌نمایش زنده
      </span>

      {kind === "site" && isSmall && (
        <div role="radiogroup" aria-label="دستگاه" className="absolute left-4 top-4 z-10 flex rounded-full bg-white/80 p-0.5 shadow-sm ring-1 ring-black/5 backdrop-blur">
          {(
            [
              { value: "phone", label: "موبایل", icon: Smartphone },
              { value: "laptop", label: "لپ‌تاپ", icon: LaptopIcon },
            ] as const
          ).map((option) => {
            const selected = smallDevice === option.value;
            return (
              <button key={option.value} type="button" role="radio" aria-checked={selected} aria-label={option.label} onClick={() => setSmallDevice(option.value)} className="relative flex size-8 items-center justify-center rounded-full">
                {selected && <motion.span layoutId="pv-device" className="absolute inset-0 rounded-full bg-[#14202b]" transition={{ type: "spring", bounce: 0.2, duration: 0.35 }} />}
                <option.icon className={`relative size-4 ${selected ? "text-white" : "text-[#5b6872]"}`} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      )}

      <div className="absolute inset-0 px-4 pb-4 pt-14 lg:px-6 lg:pb-6 lg:pt-14">{scene}</div>
    </div>
  );
};
