"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { useWizard } from "../store";

export type Device = "desktop" | "mobile";

const sizes: Record<Device, { width: number; height?: number }> = {
  desktop: { width: 1280 },
  mobile: { width: 390, height: 820 },
};

/**
 * Renders children at a real device width and scales the whole thing down to
 * fit the available box, so the mock lays out like an actual page.
 * The inner viewport scrolls to whatever part of the preview the last choice changed.
 */
export const DeviceFrame = ({ device, address, children }: { device: Device; address: string; children: ReactNode }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });
  const focus = useWizard((state) => state.focus);

  useLayoutEffect(() => {
    const element = boxRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setBox({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
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

  const size = sizes[device];
  const chrome = device === "desktop" ? 44 : 0;
  const scale = box.width
    ? device === "desktop"
      ? Math.min(box.width / size.width, 1)
      : Math.min(box.width / size.width, box.height / (size.height ?? 1), 1)
    : 0;
  const frameHeight = device === "desktop" ? (scale ? box.height / scale : 0) : (size.height ?? 0);

  return (
    <div ref={boxRef} className="relative size-full">
      {scale > 0 && (
        <div
          className="absolute left-1/2 top-0"
          style={{ width: size.width * scale, height: frameHeight * scale, transform: "translateX(-50%)" }}
        >
          <div
            className={`absolute left-0 top-0 flex origin-top-left flex-col overflow-hidden bg-white shadow-[0_30px_80px_-30px_rgba(20,32,43,0.45)] ${
              device === "desktop" ? "rounded-[14px] ring-1 ring-black/8" : "rounded-[54px] ring-[10px] ring-[#14202b]"
            }`}
            style={{ width: size.width, height: frameHeight, transform: `scale(${scale})` }}
          >
            {device === "desktop" && (
              <div className="flex shrink-0 items-center gap-2 border-b border-black/6 bg-[#f3f5f6] px-5" style={{ height: chrome }} dir="ltr">
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
                <span className="mx-auto flex h-7 w-[420px] items-center justify-center rounded-lg bg-white text-[13px] text-[#7a868d] ring-1 ring-black/5">
                  {address}
                </span>
              </div>
            )}
            <div ref={scrollerRef} className="pv-scroller relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
