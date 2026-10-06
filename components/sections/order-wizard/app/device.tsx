import { BatteryFull, ChevronLeft, ChevronRight, Lock, Share, Signal, Wifi } from "lucide-react";
import type { ReactNode } from "react";

export const APP_PHONE = { width: 400, height: 840 };

export type DeviceKind = "ios" | "android" | "pwa";

/**
 * A phone that looks like the platform the customer picked:
 * - iOS: Dynamic Island, rounded corners, home indicator
 * - Android: centred punch-hole camera, flatter corners, gesture bar
 * - Web app: an iPhone running Safari, with the address bar at the bottom
 */
export const AppDevice = ({ kind, address, children }: { kind: DeviceKind; address: string; children: ReactNode }) => {
  const android = kind === "android";
  const outer = android ? "rounded-[44px] p-[10px]" : "rounded-[60px] p-3";
  const inner = android ? "rounded-[34px]" : "rounded-[48px]";

  return (
    <div className={`relative bg-[#1a2129] shadow-[0_40px_70px_-30px_rgba(0,0,0,0.75)] ring-1 ring-white/12 ${outer}`} style={APP_PHONE}>
      {/* side buttons */}
      <span className="absolute -left-[3px] top-36 h-16 w-[3px] rounded-l bg-[#2a333d]" />
      <span className="absolute -right-[3px] top-28 h-24 w-[3px] rounded-r bg-[#2a333d]" />

      <div className={`pv-root relative flex h-full flex-col overflow-hidden bg-(--pv-bg) text-(--pv-text) ${inner}`}>
        {/* status bar */}
        <div className="relative z-20 flex h-[50px] shrink-0 items-center justify-between bg-(--pv-bg) px-8 pt-1 text-[14px] font-bold" dir="ltr">
          <span>{android ? "12:30" : "9:41"}</span>
          {android ? (
            <span className="absolute left-1/2 top-[14px] size-[14px] -translate-x-1/2 rounded-full bg-[#0b0f13]" />
          ) : (
            <span className="absolute left-1/2 top-[10px] h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-[#0b0f13]" />
          )}
          <span className="flex items-center gap-1.5">
            <Signal className="size-4" aria-hidden="true" />
            <Wifi className="size-4" aria-hidden="true" />
            <BatteryFull className="size-5" aria-hidden="true" />
          </span>
        </div>

        <div className="relative min-h-0 flex-1">{children}</div>

        {kind === "pwa" && (
          <div className="z-20 shrink-0 border-t border-black/8 bg-[#f6f6f8]/95 px-4 pb-6 pt-2 text-[#1c1c1e] backdrop-blur" dir="ltr">
            <div className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-white text-[13px] shadow-sm">
              <Lock className="size-3" aria-hidden="true" />
              {address}
            </div>
            <div className="mt-2 flex items-center justify-between px-3 text-[#007aff]">
              <ChevronLeft className="size-5" aria-hidden="true" />
              <ChevronRight className="size-5 opacity-30" aria-hidden="true" />
              <Share className="size-5" aria-hidden="true" />
              <span className="size-5 rounded-[5px] border-2 border-current" />
            </div>
          </div>
        )}

        {/* system navigation */}
        {kind !== "pwa" && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex h-6 items-end justify-center pb-2">
            <span className={`rounded-full bg-(--pv-text) opacity-35 ${android ? "h-1 w-24" : "h-[5px] w-32"}`} />
          </div>
        )}
      </div>
    </div>
  );
};
