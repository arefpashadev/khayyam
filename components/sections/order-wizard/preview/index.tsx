"use client";

import { Monitor, Smartphone } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

import { buildPreviewVars } from "../config";
import { useWizard } from "../store";
import { AppPreview } from "./app-preview";
import { DeviceFrame, type Device } from "./device-frame";
import { SitePreview } from "./site-preview";

const query = "(max-width: 1023px)";
const subscribe = (callback: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
/** Small screens start the site preview in mobile size; the toggle can still override it. */
const useIsSmallScreen = () => useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);

export const PreviewStage = () => {
  const kind = useWizard((state) => state.kind);
  const config = useWizard((state) => state.config);
  const isSmall = useIsSmallScreen();
  const [override, setSiteDevice] = useState<Device | null>(null);
  const siteDevice: Device = override ?? (isSmall ? "mobile" : "desktop");
  const device: Device = kind === "app" ? "mobile" : siteDevice;
  const slug = config.brandName.trim().replace(/\s+/g, "-") || "your-brand";

  return (
    <div className="flex size-full min-h-0 flex-col gap-3" style={buildPreviewVars(config)}>
      <div className="flex shrink-0 items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[12px] font-bold text-[#4d5b65]">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-[#22c27a] opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-[#22c27a]" />
          </span>
          پیش‌نمایش زنده
        </span>

        {kind === "site" && (
          <div role="radiogroup" aria-label="اندازه نمایش" className="flex rounded-full bg-white p-1 shadow-sm ring-1 ring-black/5">
            {(
              [
                { value: "desktop", label: "دسکتاپ", icon: Monitor },
                { value: "mobile", label: "موبایل", icon: Smartphone },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={siteDevice === option.value}
                aria-label={option.label}
                onClick={() => setSiteDevice(option.value)}
                className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078ef0] ${
                  siteDevice === option.value ? "bg-[#14202b] text-white" : "text-[#5b6872] hover:text-[#14202b]"
                }`}
              >
                <option.icon className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1">
        <DeviceFrame device={device} address={`${slug}.ir`}>
          {kind === "app" ? <AppPreview config={config} /> : <SitePreview config={config} compact={device === "mobile"} />}
        </DeviceFrame>
      </div>
    </div>
  );
};
