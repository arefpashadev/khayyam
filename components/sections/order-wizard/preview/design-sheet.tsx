"use client";

import { Check, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { faNumber, industries } from "../config";
import { getDesignCount } from "../designs";
import { useWizard } from "../store";
import { useIsSmallScreen } from "../use-small-screen";
import { SiteTop } from "./site-preview";

const PAGE = { width: 1280, height: 800 };

/**
 * The picker draws every design with the real preview components (nav + hero),
 * scaled down. `content-visibility` keeps off-screen thumbnails from rendering.
 */
export const DesignSheet = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const config = useWizard((state) => state.config);
  const setVariant = useWizard((state) => state.setVariant);
  const isSmall = useIsSmallScreen();
  const reduce = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const [thumbWidth, setThumbWidth] = useState(0);
  const count = getDesignCount(config.industry);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!open || !grid) return;
    const observer = new ResizeObserver(() => {
      const first = grid.querySelector<HTMLElement>("[data-thumb]");
      if (first) setThumbWidth(first.clientWidth);
    });
    observer.observe(grid);
    return () => observer.disconnect();
  }, [open]);

  const hidden = isSmall ? { y: "100%" } : { x: "100%" };
  const shown = isSmall ? { y: 0 } : { x: 0 };
  const scale = thumbWidth / PAGE.width;

  return (
    <AnimatePresence>
      {open && (
        <>
          {isSmall && <motion.div className="fixed inset-0 z-[110] bg-[#14202b]/15" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />}
          <motion.div
            role="dialog"
            aria-modal={isSmall}
            aria-label="انتخاب طرح"
            dir="rtl"
            initial={reduce ? false : hidden}
            animate={shown}
            exit={reduce ? undefined : hidden}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            className="fixed z-[120] flex flex-col bg-white text-[#14202b] shadow-[0_-12px_40px_-12px_rgba(20,32,43,0.35)] max-lg:inset-x-0 max-lg:bottom-0 max-lg:h-[60dvh] max-lg:rounded-t-[22px] lg:inset-y-0 lg:right-0 lg:w-[440px]"
          >
            <div className="flex shrink-0 items-center gap-2 px-4 pb-2 pt-4 lg:px-6 lg:pt-6">
              <div>
                <strong className="block text-[16px] font-extrabold">طرح‌های {industries[config.industry].label}</strong>
                <span className="text-[11px] text-[#8a959b]">{faNumber(count)} طرح با رنگ‌ها و انتخاب‌های شما</span>
              </div>
              <button type="button" onClick={onClose} aria-label="بستن" className="ms-auto flex size-9 items-center justify-center rounded-full bg-[#f5f7f8] text-[#4d5b65] transition-colors hover:bg-[#edf1f3]">
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <p className="mx-4 mb-3 flex gap-2 rounded-xl bg-[#f5f7f8] px-3 py-2 text-[11px] leading-[1.9] text-[#5b6872] lg:mx-6 lg:py-2.5 lg:text-[11.5px] lg:leading-6">
              <MessageCircle className="mt-1 size-3.5 shrink-0 text-[#078ef0]" aria-hidden="true" />
              این‌ها همه کارهایی نیست که می‌توانیم انجام دهیم. نزدیک‌ترین طرح را انتخاب کنید و بعد از ثبت درخواست، شماره طرح و تغییراتی را که می‌خواهید برایمان بفرستید تا برایتان اعمال کنیم.
            </p>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:px-6">
              <div ref={gridRef} className="grid grid-cols-2 gap-2">
                {Array.from({ length: count }, (_, design) => {
                  const selected = design === config.variant;
                  return (
                    <button
                      key={design}
                      type="button"
                      aria-pressed={selected}
                      aria-label={`طرح ${faNumber(design + 1)}`}
                      onClick={() => setVariant(design)}
                      className={`relative rounded-xl p-1.5 text-right transition-colors outline-none [contain-intrinsic-size:auto_160px] [content-visibility:auto] focus-visible:ring-2 focus-visible:ring-[#078ef0] ${selected ? "bg-[#e6f2fc]" : "bg-[#f5f7f8] hover:bg-[#edf1f3]"}`}
                    >
                      <div data-thumb aria-hidden="true" className="relative w-full overflow-hidden rounded-lg bg-(--pv-bg)" style={{ aspectRatio: `${PAGE.width} / ${PAGE.height}` }}>
                        {scale > 0 && (
                          <div dir="rtl" data-motion="none" className="pointer-events-none absolute left-0 top-0 origin-top-left bg-(--pv-bg) font-sans text-(--pv-text)" style={{ width: PAGE.width, height: PAGE.height, transform: `scale(${scale})` }}>
                            <SiteTop config={{ ...config, variant: design }} compact={false} />
                          </div>
                        )}
                      </div>
                      <span className={`mt-1.5 flex items-center justify-between px-1 pb-0.5 text-[11px] font-bold ${selected ? "text-[#0a5a9c]" : "text-[#5b6872]"}`}>
                        طرح {faNumber(design + 1)}
                        {selected && <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
