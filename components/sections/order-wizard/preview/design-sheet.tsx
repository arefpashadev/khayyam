"use client";

import { Check, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, type CSSProperties } from "react";

import { ARCHETYPE_COUNT, faNumber, getArchetype, mix, type Archetype } from "../config";
import { useWizard } from "../store";
import { useIsSmallScreen } from "../use-small-screen";

const designs = Array.from({ length: ARCHETYPE_COUNT }, (_, index) => index);

/** A tiny drawing of one design, painted with the user's current colours (CSS variables). */
const Thumb = ({ archetype, color, dark }: { archetype: Archetype; color: string; dark: boolean }) => {
  const shade = (amount: number) => mix(color, dark ? "#0f151c" : "#ffffff", amount);
  const line = "rounded-full bg-(--pv-text)";
  const pattern: CSSProperties | undefined = archetype.pattern
    ? { backgroundImage: "radial-gradient(var(--pv-border) 0.8px, transparent 0.8px)", backgroundSize: "6px 6px" }
    : undefined;

  const logo = <span className="size-2 rounded-[2px] bg-(--pv-primary)" />;
  const links = (
    <span className="flex gap-1">
      <span className={`${line} h-[2px] w-2 opacity-40`} />
      <span className={`${line} h-[2px] w-2 opacity-40`} />
    </span>
  );
  const cta = <span className="h-2 w-4 rounded-(--pv-r-ctrl) bg-(--pv-primary)" />;

  const nav =
    archetype.nav === "centered" ? (
      <div className="grid grid-cols-3 items-center px-2 py-1.5">{links}<span className="flex justify-center">{logo}</span><span className="flex justify-end">{cta}</span></div>
    ) : archetype.nav === "floating" ? (
      <div className="px-1.5 pt-1.5"><div className="flex items-center justify-between rounded-[3px] bg-(--pv-surface) px-1.5 py-1 ring-1 ring-(--pv-border)">{logo}{links}{cta}</div></div>
    ) : (
      <div className="flex items-center justify-between border-b border-(--pv-border) px-2 py-1.5">{logo}{links}{cta}</div>
    );

  const artBox = "relative h-full flex-1 overflow-hidden rounded-[3px]";
  const art = {
    orbs: (
      <div className={`${artBox} bg-(--pv-soft)`}>
        <span className="absolute -bottom-2 -left-2 size-7 rounded-full bg-(--pv-primary)" />
        <span className="absolute -right-1 -top-1 size-4 rounded-full" style={{ backgroundColor: shade(0.45) }} />
      </div>
    ),
    mosaic: (
      <div className={`${artBox} grid grid-cols-3 grid-rows-3 gap-[2px]`}>
        <span className="col-span-2 row-span-2 rounded-[2px] bg-(--pv-primary)" />
        {[0.55, 0.3, 0.75, 0.45, 0.2].map((amount) => (
          <span key={amount} className="rounded-[2px]" style={{ backgroundColor: shade(amount) }} />
        ))}
      </div>
    ),
    rings: (
      <div className={`${artBox} flex items-center justify-center bg-(--pv-soft)`}>
        <span className="absolute size-9 rounded-full border border-(--pv-primary) opacity-30" />
        <span className="absolute size-6 rounded-full border border-(--pv-primary) opacity-50" />
        <span className="size-3 rounded-full bg-(--pv-primary)" />
      </div>
    ),
    stack: (
      <div className={`${artBox} flex items-center justify-center bg-(--pv-surface)`}>
        <span className="absolute h-6 w-5 -rotate-12 rounded-[2px]" style={{ backgroundColor: shade(0.5) }} />
        <span className="relative h-6 w-5 rounded-[2px] bg-(--pv-bg) shadow"><span className="m-1 block size-1.5 rounded-[1px] bg-(--pv-primary)" /></span>
      </div>
    ),
    bars: (
      <div className={`${artBox} flex items-end gap-[2px] bg-(--pv-soft) px-1.5 pt-2`}>
        {[0.45, 0.7, 0.55, 0.95, 0.75].map((height, index) => (
          <span key={index} className="flex-1 rounded-t-[1px]" style={{ height: `${height * 100}%`, backgroundColor: index === 3 ? "var(--pv-primary)" : shade(0.4) }} />
        ))}
      </div>
    ),
    frame: (
      <div className={`${artBox} p-1.5`}>
        <span className="absolute inset-1.5 translate-x-[2px] translate-y-[2px] rounded-[2px] border border-(--pv-primary)" />
        <span className="relative block size-full rounded-[2px]" style={{ backgroundColor: shade(0.3) }} />
      </div>
    ),
  }[archetype.art];

  const card =
    archetype.cards === "numbered" ? (
      <span className="flex-1 border-t border-(--pv-primary) pt-0.5"><span className="block h-[3px] w-2 rounded-full bg-(--pv-primary)" /></span>
    ) : (
      <span className={`h-4 flex-1 rounded-[2px] ${archetype.cards === "filled" ? "bg-(--pv-soft)" : "ring-1 ring-(--pv-border)"}`} />
    );

  return (
    <div className="pv-root flex aspect-[4/3] flex-col overflow-hidden rounded-lg bg-(--pv-bg)">
      {nav}
      <div className="flex min-h-0 flex-1 items-center gap-2 px-2 py-1.5" style={pattern}>
        <div className="flex flex-1 flex-col gap-1">
          <span className={`${line} h-[3px] w-full opacity-80`} />
          <span className={`${line} h-[3px] w-2/3 opacity-80`} />
          <span className="mt-0.5 h-2 w-5 rounded-(--pv-r-ctrl) bg-(--pv-primary)" />
        </div>
        {art}
      </div>
      <div className="flex gap-1 bg-(--pv-surface) px-2 py-1.5">{card}{card}{card}</div>
    </div>
  );
};

export const DesignSheet = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const variant = useWizard((state) => state.config.variant);
  const color = useWizard((state) => state.config.color);
  const theme = useWizard((state) => state.config.theme);
  const setVariant = useWizard((state) => state.setVariant);
  const isSmall = useIsSmallScreen();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Phones: sheet from the bottom, preview stays visible above it.
  // Desktop: drawer over the control panel, so the laptop and phone stay fully in view.
  const hidden = isSmall ? { y: "100%" } : { x: "100%" };
  const shown = isSmall ? { y: 0 } : { x: 0 };

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
            className="fixed z-[120] flex flex-col bg-white text-[#14202b] shadow-[0_-12px_40px_-12px_rgba(20,32,43,0.35)] max-lg:inset-x-0 max-lg:bottom-0 max-lg:h-[58dvh] max-lg:rounded-t-[22px] lg:inset-y-0 lg:right-0 lg:w-[360px] xl:w-[380px]"
          >
            <div className="flex shrink-0 items-center gap-2 px-4 pb-2 pt-4 lg:px-6 lg:pt-6">
              <div>
                <strong className="block text-[16px] font-extrabold">طرح‌ها</strong>
                <span className="text-[11px] text-[#8a959b]">{faNumber(ARCHETYPE_COUNT)} طرح با رنگ‌ها و انتخاب‌های شما</span>
              </div>
              <button type="button" onClick={onClose} aria-label="بستن" className="ms-auto flex size-9 items-center justify-center rounded-full bg-[#f5f7f8] text-[#4d5b65] transition-colors hover:bg-[#edf1f3]">
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <p className="mx-4 mb-3 flex gap-2 rounded-xl bg-[#f5f7f8] px-3 py-2 text-[11px] leading-[1.9] lg:py-2.5 lg:text-[11.5px] lg:leading-6 text-[#5b6872] lg:mx-6">
              <MessageCircle className="mt-1 size-3.5 shrink-0 text-[#078ef0]" aria-hidden="true" />
              این‌ها همه کارهایی نیست که می‌توانیم انجام دهیم. نزدیک‌ترین طرح را انتخاب کنید و بعد از ثبت درخواست، شماره طرح و تغییراتی را که می‌خواهید برایمان بفرستید تا برایتان اعمال کنیم.
            </p>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:px-6">
              <div className="grid grid-cols-2 gap-2">
                {designs.map((design) => {
                  const selected = design === variant;
                  return (
                    <button
                      key={design}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setVariant(design)}
                      className={`relative rounded-xl p-1.5 text-right transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#078ef0] ${selected ? "bg-[#e6f2fc]" : "bg-[#f5f7f8] hover:bg-[#edf1f3]"}`}
                    >
                      <Thumb archetype={getArchetype(design)} color={color} dark={theme === "dark"} />
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
