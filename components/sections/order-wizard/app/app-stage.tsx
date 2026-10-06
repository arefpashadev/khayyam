"use client";

import { CircleHelp, Sparkles, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Link } from "@/i18n/navigation";

import { AssistantDock } from "../assistant";
import { appScreens, buildPreviewVars, getSteps } from "../config";
import { FitScene } from "../preview/devices";
import { useWizard } from "../store";
import { useIsSmallScreen } from "../use-small-screen";
import { AppDevice, APP_PHONE, type DeviceKind } from "./device";
import { InteractiveApp } from "./interactive-app";
import { useAppPreview } from "./state";

const pill = "flex h-9 items-center gap-2 rounded-full bg-white/8 px-3.5 text-[12px] font-bold text-[#c9d0d9] ring-1 ring-white/8 backdrop-blur";

/** Tells the customer this is a starting point, not a limit. */
export const CustomNote = ({ className = "" }: { className?: string }) => (
  <p className={`flex items-center gap-2 rounded-full bg-white/6 px-4 py-2 text-[11.5px] text-[#a7b0bc] ring-1 ring-white/8 backdrop-blur ${className}`}>
    <Sparkles className="size-3.5 shrink-0 text-[#ffd88a]" aria-hidden="true" />
    این فقط نقطه شروع است؛ هر صفحه، رفتار و امکانی را طبق خواسته شما می‌سازیم.
  </p>
);

export const AppStage = ({ studio = false }: { studio?: boolean }) => {
  const config = useWizard((state) => state.config);
  const step = useWizard((state) => state.step);
  const kind = useWizard((state) => state.kind);
  const setTour = useWizard((state) => state.setTour);
  const open = useAppPreview((state) => state.open);
  const isSmall = useIsSmallScreen();
  const [mobileDevice, setMobileDevice] = useState<"ios" | "android">("ios");
  const springboard = getSteps(kind)[step]?.key === "icon";
  const address = `${config.brandName.trim().replace(/\s+/g, "-") || "app"}.ir`;
  const enabled = appScreens.filter((screen) => config.screens.includes(screen.value));

  const phone = (device: DeviceKind, listen: boolean): ReactNode => (
    <AppDevice kind={device} address={address}>
      <InteractiveApp config={config} listen={listen} springboard={springboard} />
    </AppDevice>
  );

  // "Both" shows iPhone and Android together on wide screens; phones get a switch.
  const devices: DeviceKind[] =
    config.platform === "both" ? (isSmall ? [mobileDevice] : ["ios", "android"]) : config.platform === "android" ? ["android"] : config.platform === "pwa" ? ["pwa"] : ["ios"];
  const gap = 70;
  const sceneWidth = devices.length * APP_PHONE.width + (devices.length - 1) * gap;

  return (
    <div className="relative size-full overflow-hidden bg-[#0b0d12]" style={buildPreviewVars(config)}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute left-[15%] top-[10%] h-[55%] w-[40%] rounded-full opacity-35 blur-[120px] transition-colors duration-700" style={{ backgroundColor: config.color }} />
        <span className="absolute bottom-0 right-[12%] h-[50%] w-[38%] rounded-full opacity-25 blur-[120px] transition-colors duration-700" style={{ backgroundColor: config.accent }} />
        <span className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "26px 26px", maskImage: "radial-gradient(ellipse at center, #000 40%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at center, #000 40%, transparent 80%)" }} />
      </div>

      <div className={`absolute z-10 flex items-center gap-2 ${studio ? "right-5 top-5" : "right-3 top-4"}`}>
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
          <span className="size-1.5 rounded-full bg-[#2fd08a]" />
          {/* phones: the toolbar is tight, keep just the live dot plus a short word */}
          <span className={studio ? "" : "hidden"}>{springboard ? "روی آیکون بزنید" : "روی گوشی بزنید؛ کار می‌کند"}</span>
          {!studio && <span>زنده</span>}
        </span>
      </div>

      {config.platform === "both" && isSmall && (
        <div role="radiogroup" aria-label="دستگاه" data-tour="devices" className="absolute left-3 top-4 z-10 flex gap-0.5 rounded-full bg-white/8 p-1 ring-1 ring-white/8 backdrop-blur">
          {(["ios", "android"] as const).map((device) => (
            <button key={device} type="button" role="radio" aria-checked={mobileDevice === device} onClick={() => setMobileDevice(device)} className={`h-7 rounded-full px-3 text-[11.5px] font-bold transition-colors ${mobileDevice === device ? "bg-white text-[#0b0d12]" : "text-[#c9d0d9]"}`}>
              {device === "ios" ? "آیفون" : "اندروید"}
            </button>
          ))}
        </div>
      )}

      {/* screens rail: jump the phone to any screen */}
      {studio && !springboard && (
        <nav aria-label="صفحه‌های اپ" data-tour="devices" className="absolute left-5 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-1 rounded-2xl bg-white/6 p-1.5 ring-1 ring-white/8 backdrop-blur">
          {enabled.map((screen) => (
            <button key={screen.value} type="button" onClick={() => open(screen.value)} className="group flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-bold text-[#c9d0d9] transition-colors hover:bg-white/8 hover:text-white">
              <screen.icon className="size-4 opacity-70 group-hover:opacity-100" aria-hidden="true" />
              {screen.label}
            </button>
          ))}
        </nav>
      )}

      <div data-tour="stage" className={`absolute ${studio ? "inset-x-44 bottom-16 top-20" : "inset-0 px-3 pb-3 pt-16"}`}>
        <FitScene width={sceneWidth} height={APP_PHONE.height}>
          <div className="relative flex" dir="ltr" style={{ width: sceneWidth, height: APP_PHONE.height, gap }}>
            {devices.map((device, index) => (
              <div key={device} className="relative">
                {phone(device, index === 0)}
                {devices.length > 1 && <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[22px] font-bold text-white/50">{device === "ios" ? "iOS" : "Android"}</span>}
              </div>
            ))}
          </div>
        </FitScene>
      </div>

      {studio && <CustomNote className="absolute bottom-5 right-5 z-10 max-w-[min(420px,calc(100%-360px))]" />}
      <AssistantDock studio={studio} />
    </div>
  );
};
