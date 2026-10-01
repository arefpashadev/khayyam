"use client";

import { BatteryFull, Signal, Wifi } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { useWizard } from "../store";

/** Real CSS-pixel sizes; the stage scales the whole composition down to fit. */
export const LAPTOP = { width: 1560, height: 872 };
export const PHONE = { width: 414, height: 844 };

/** A real-size scrollable screen that glides to whatever the last choice changed. */
const Screen = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const focus = useWizard((state) => state.focus);

  useEffect(() => {
    const scroller = ref.current;
    if (!scroller) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = focus.target === "top" ? null : scroller.querySelector<HTMLElement>(`[data-pv="${focus.target}"]`);
    // The hero sits right under the nav, so show the page from the top for it.
    const top = !target || focus.target === "hero" ? 0 : Math.max(0, target.offsetTop - 24);
    scroller.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });

    if (!target) return;
    target.dataset.flash = "true";
    const timeout = window.setTimeout(() => delete target.dataset.flash, 1100);
    return () => {
      window.clearTimeout(timeout);
      delete target.dataset.flash;
    };
  }, [focus]);

  return (
    <div ref={ref} className={`pv-scroller relative overflow-y-auto overscroll-contain ${className}`}>
      {children}
    </div>
  );
};

export const Laptop = ({ address, children }: { address: string; children: ReactNode }) => (
  <div className="relative" style={LAPTOP}>
    {/* lid */}
    <div className="absolute left-1/2 top-0 w-[1316px] -translate-x-1/2 rounded-b-[8px] rounded-t-[30px] bg-[#1a2129] p-[18px] pb-[22px] shadow-[0_40px_80px_-40px_rgba(15,23,32,0.6)]">
      <span className="absolute left-1/2 top-[6px] size-[6px] -translate-x-1/2 rounded-full bg-[#3a454f]" />
      <div className="flex h-[800px] flex-col overflow-hidden rounded-[6px] bg-white">
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-black/6 bg-[#f3f5f6] px-4" dir="ltr">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <span className="mx-auto flex h-7 w-[440px] items-center justify-center rounded-lg bg-white text-[13px] text-[#7a868d] ring-1 ring-black/5"><bdi>{address}</bdi>.ir</span>
        </div>
        <Screen className="min-h-0 flex-1">{children}</Screen>
      </div>
    </div>
    {/* base */}
    <div className="absolute bottom-0 left-0 h-8 w-full rounded-b-[30px] rounded-t-[3px] bg-[linear-gradient(180deg,#e3e7ea_0%,#c3cace_55%,#9ea7ad_100%)] shadow-[0_30px_50px_-20px_rgba(15,23,32,0.55)]">
      <div className="mx-auto h-[9px] w-[230px] rounded-b-[12px] bg-[#a9b1b7]" />
    </div>
  </div>
);

export const Phone = ({ children }: { children: ReactNode }) => (
  <div className="relative rounded-[60px] bg-[#1a2129] p-3 shadow-[0_40px_70px_-30px_rgba(15,23,32,0.65)] ring-1 ring-white/10" style={PHONE}>
    <div className="pv-root relative flex h-full flex-col overflow-hidden rounded-[48px] bg-(--pv-bg) text-(--pv-text)">
      <div className="relative flex h-[52px] shrink-0 items-center justify-between px-9 pt-1 text-[15px] font-bold" dir="ltr">
        <span>9:41</span>
        <span className="absolute left-1/2 top-[11px] h-[30px] w-[112px] -translate-x-1/2 rounded-full bg-[#0b0f13]" />
        <span className="flex items-center gap-1.5">
          <Signal className="size-4" aria-hidden="true" />
          <Wifi className="size-4" aria-hidden="true" />
          <BatteryFull className="size-5" aria-hidden="true" />
        </span>
      </div>
      <Screen className="min-h-0 flex-1">{children}</Screen>
      <span className="pointer-events-none absolute bottom-2 left-1/2 h-[5px] w-32 -translate-x-1/2 rounded-full bg-(--pv-text) opacity-30" />
    </div>
  </div>
);

/** Scales a fixed-size composition to fit (contain) the available box, centred. */
export const FitScene = ({ width, height, children }: { width: number; height: number; children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setBox({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const scale = box.width ? Math.min(box.width / width, box.height / height, 1) : 0;

  return (
    <div ref={ref} className="relative size-full">
      {scale > 0 && (
        <div className="absolute left-1/2 top-1/2" style={{ width: width * scale, height: height * scale, transform: "translate(-50%, -50%)" }}>
          <div className="absolute left-0 top-0 origin-top-left" style={{ width, height, transform: `scale(${scale})` }}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
