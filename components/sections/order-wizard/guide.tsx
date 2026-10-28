"use client";

import { tx, studioDir } from "@/lib/tx";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { create } from "zustand";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

import { faNumber } from "./config";

/**
 * A quiet, reusable page guide. Each page passes its own steps; a step points at an
 * element marked `data-guide="name"` (or the older `data-tour="name"`). Steps whose
 * element isn't visible on this screen size are skipped, so one list serves phone and desktop.
 */
export type GuideStep = { target?: string; title: string; text: string };

type GuideState = { active: string | null; step: number; open: (id: string) => void; close: () => void; go: (step: number) => void };

export const useGuide = create<GuideState>((set) => ({
  active: null,
  step: 0,
  open: (id) => set({ active: id, step: 0 }),
  close: () => set({ active: null, step: 0 }),
  go: (step) => set({ step }),
}));

const seenKey = (id: string) => `khayyam:guide:${id}:v1`;
const markSeen = (id: string) => {
  try {
    localStorage.setItem(seenKey(id), "1");
  } catch {
    /* storage unavailable: the guide simply shows again next time */
  }
};

const find = (target: string) => {
  const nodes = document.querySelectorAll<HTMLElement>(`[data-guide="${target}"], [data-tour="${target}"]`);
  return Array.from(nodes).find((node) => {
    const rect = node.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
};

const CARD = 300;
const PAD = 8;

export const Guide = ({ id, steps, autoStart = true, delay = 900 }: { id: string; steps: GuideStep[]; autoStart?: boolean; delay?: number }) => {
  const active = useGuide((state) => state.active);
  const step = useGuide((state) => state.step);
  const open = useGuide((state) => state.open);
  const close = useGuide((state) => state.close);
  const go = useGuide((state) => state.go);
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [cardHeight, setCardHeight] = useState(180);
  const [items, setItems] = useState<GuideStep[]>(steps);
  const visible = active === id;
  const current = items[Math.min(step, items.length - 1)];

  // First visit: open once the page has settled.
  useEffect(() => {
    if (!autoStart) return;
    let seen = false;
    try {
      seen = localStorage.getItem(seenKey(id)) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;
    const timeout = window.setTimeout(() => open(id), delay);
    return () => window.clearTimeout(timeout);
  }, [id, autoStart, open, delay]);

  // Keep only steps whose target is on screen right now.
  useEffect(() => {
    if (!visible) return;
    const timeout = window.setTimeout(() => setItems(steps.filter((item) => !item.target || find(item.target))), 0);
    return () => window.clearTimeout(timeout);
  }, [visible, steps]);

  // Follow the highlighted element, scrolling it into view first if needed.
  useEffect(() => {
    if (!visible || !current?.target) {
      const timeout = window.setTimeout(() => setRect(null), 0);
      return () => window.clearTimeout(timeout);
    }
    const element = find(current.target);
    if (!element) return;
    const box = element.getBoundingClientRect();
    if (box.top < 0 || box.bottom > window.innerHeight) element.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    const measure = () => setRect(element.getBoundingClientRect());
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [visible, current?.target, reduce]);

  useLayoutEffect(() => {
    if (cardRef.current) setCardHeight(cardRef.current.offsetHeight);
  }, [step, visible, items.length]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        markSeen(id);
        close();
      }
      if (event.key === "ArrowLeft" && step < items.length - 1) go(step + 1);
      if (event.key === "ArrowRight" && step > 0) go(step - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, id, step, items.length, close, go]);

  if (!visible || !current) return null;

  const finish = () => {
    markSeen(id);
    close();
  };
  const isLast = step >= items.length - 1;
  const width = typeof window === "undefined" ? 1280 : window.innerWidth;
  const height = typeof window === "undefined" ? 800 : window.innerHeight;
  const cardWidth = Math.min(CARD, width - 32);
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
  const hole = rect
    ? { left: clamp(rect.left - PAD, 4, width - 8), top: clamp(rect.top - PAD, 4, height - 8), right: clamp(rect.right + PAD, 8, width - 4), bottom: clamp(rect.bottom + PAD, 8, height - 4) }
    : null;

  // Card placement: always right next to the target (below, else above, else beside),
  // with a small pointer aimed at it, so it's obvious what is being described.
  let style: React.CSSProperties;
  let pointer: { side: "top" | "bottom" | "left" | "right"; offset: number } | null = null;
  const gap = 14;
  const phone = width < 640;
  const atTop = phone && !!hole && (hole.top + hole.bottom) / 2 > height * 0.5;
  if (phone) style = atTop ? { left: 12, right: 12, top: 12 } : { left: 12, right: 12, bottom: 12 };
  else if (!hole) style = { width: cardWidth, left: (width - cardWidth) / 2, top: (height - cardHeight) / 2 };
  else {
    const centreX = (hole.left + hole.right) / 2;
    const centreY = (hole.top + hole.bottom) / 2;
    const left = clamp(centreX - cardWidth / 2, 16, width - cardWidth - 16);
    const along = (value: number, size: number) => clamp(value, 22, size - 22);
    if (height - hole.bottom > cardHeight + gap + 8) {
      style = { width: cardWidth, left, top: hole.bottom + gap };
      pointer = { side: "top", offset: along(centreX - left, cardWidth) };
    } else if (hole.top > cardHeight + gap + 8) {
      style = { width: cardWidth, left, top: hole.top - gap - cardHeight };
      pointer = { side: "bottom", offset: along(centreX - left, cardWidth) };
    } else if (hole.left > cardWidth + gap + 8) {
      const top = clamp(centreY - cardHeight / 2, 16, height - cardHeight - 16);
      style = { width: cardWidth, left: hole.left - gap - cardWidth, top };
      pointer = { side: "right", offset: along(centreY - top, cardHeight) };
    } else if (width - hole.right > cardWidth + gap + 8) {
      const top = clamp(centreY - cardHeight / 2, 16, height - cardHeight - 16);
      style = { width: cardWidth, left: hole.right + gap, top };
      pointer = { side: "left", offset: along(centreY - top, cardHeight) };
    } else {
      // the target fills the screen: sit inside it, near its bottom edge
      style = { width: cardWidth, left: (width - cardWidth) / 2, top: clamp(hole.bottom - cardHeight - 24, 16, height - cardHeight - 16) };
    }
  }
  const move = reduce ? { duration: 0 } : { type: "spring" as const, bounce: 0, duration: 0.45 };

  return (
    <div className="fixed inset-0 z-[400] text-[#f2ecdf]" dir={studioDir()} role="dialog" aria-modal="true" aria-label={tx("راهنما")}>
      {hole ? (
        <>
          {/* the dim is four plain panels around the target (no giant shadows, which some pages don't paint) */}
          {[
            { left: 0, top: 0, width: "100%", height: hole.top },
            { left: 0, top: hole.bottom, width: "100%", height: Math.max(0, height - hole.bottom) },
            { left: 0, top: hole.top, width: hole.left, height: hole.bottom - hole.top },
            { left: hole.right, top: hole.top, width: Math.max(0, width - hole.right), height: hole.bottom - hole.top },
          ].map((panel, index) => (
            <motion.div key={index} className="pointer-events-none absolute bg-[rgba(5,7,12,0.74)]" initial={false} animate={panel} transition={move} />
          ))}
          <motion.div
            className="pointer-events-none absolute rounded-[14px] border-2 border-[#f0b44a] shadow-[0_0_0_5px_rgba(240,180,74,0.16)]"
            initial={false}
            animate={{ left: hole.left, top: hole.top, width: hole.right - hole.left, height: hole.bottom - hole.top }}
            transition={move}
          />
        </>
      ) : (
        <motion.div className="absolute inset-0 bg-[rgba(5,7,12,0.74)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      )}
      {/* clicking the dim area moves on, like most product tours */}
      <button type="button" aria-hidden="true" tabIndex={-1} className="absolute inset-0 cursor-default" onClick={() => (isLast ? finish() : go(step + 1))} />

      <AnimatePresence mode="wait">
        {phone ? (
          <motion.div
            ref={cardRef}
            key={step}
            className="absolute overflow-hidden rounded-[26px] bg-[#16203a] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
            style={{ ...style, marginBottom: atTop ? undefined : "env(safe-area-inset-bottom)" }}
            initial={reduce ? false : { opacity: 0, y: atTop ? -14 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* progress: one segment per step */}
            <div className="flex gap-1 px-5 pt-4" aria-label={tx("{0} از {1}", [faNumber(step + 1), faNumber(items.length)])}>
              {items.map((item, index) => (
                <span key={item.title} className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${index <= step ? "bg-[#f0b44a]" : "bg-white/10"}`} />
              ))}
            </div>
            <div className="px-5 pb-5 pt-4">
              <div className="flex items-center gap-3">
                {!current.target && <KhayyamMark size={30} />}
                <strong className="flex-1 text-[17px] font-extrabold leading-7 text-white">{current.title}</strong>
                <button type="button" onClick={finish} className="text-[12.5px] font-bold text-[#9aa3b8]">{tx("رد کردن")}</button>
              </div>
              <p className="mt-2 text-[14px] leading-7 text-[#b4bcc8]">{current.text}</p>
              <div className="mt-4 flex items-center gap-2">
                {step > 0 && (
                  <button type="button" onClick={() => go(step - 1)} aria-label={tx("قبلی")} className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] text-[#c9d0d9]">
                    <ArrowRight className="size-[18px] ltr:-scale-x-100" aria-hidden="true" />
                  </button>
                )}
                <button type="button" autoFocus onClick={() => (isLast ? finish() : go(step + 1))} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#f0b44a] text-[14px] font-extrabold text-[#1a1306] active:scale-[0.98]">
                  {isLast ? tx("شروع کنیم") : tx("بعدی")}
                  {!isLast && <ArrowLeft className="size-4 ltr:-scale-x-100" aria-hidden="true" />}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
        <motion.div
          ref={cardRef}
          key={step}
          className="absolute rounded-[20px] bg-[#16203a] p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
          style={style}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {pointer && (
            <span
              aria-hidden="true"
              className="absolute size-3.5 rotate-45 bg-[#16203a] ring-1 ring-white/10"
              style={
                pointer.side === "top"
                  ? { top: -7, left: pointer.offset - 7, clipPath: "polygon(0 0, 100% 0, 0 100%)" }
                  : pointer.side === "bottom"
                    ? { bottom: -7, left: pointer.offset - 7, clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }
                    : pointer.side === "right"
                      ? { right: -7, top: pointer.offset - 7, clipPath: "polygon(0 0, 100% 0, 100% 100%)" }
                      : { left: -7, top: pointer.offset - 7, clipPath: "polygon(0 0, 0 100%, 100% 100%)" }
              }
            />
          )}
          <div className="flex items-center gap-2">
            {!current.target && <KhayyamMark size={26} />}
            <strong className="flex-1 text-[14.5px] font-extrabold">{current.title}</strong>
            <span className="text-[11px] text-[#6f788d]">{tx("{0} از {1}", [faNumber(step + 1), faNumber(items.length)])}</span>
            <button type="button" onClick={finish} aria-label={tx("بستن راهنما")} className="-me-1 flex size-7 items-center justify-center rounded-lg text-[#9aa3b8] transition-colors hover:bg-white/6 hover:text-white">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-2 text-[13px] leading-7 text-[#b9bfcc]">{current.text}</p>
          <div className="mt-3 flex items-center gap-2">
            {step > 0 && (
              <button type="button" onClick={() => go(step - 1)} aria-label={tx("قبلی")} className="flex size-9 items-center justify-center rounded-xl text-[#c9d0d9] transition-colors hover:bg-white/6">
                <ArrowRight className="size-4 ltr:-scale-x-100" aria-hidden="true" />
              </button>
            )}
            <button type="button" autoFocus onClick={() => (isLast ? finish() : go(step + 1))} className="ms-auto flex h-9 items-center gap-1.5 rounded-xl bg-white px-4 text-[12.5px] font-extrabold text-[#0c1222] transition-colors hover:bg-[#f5e6c6]">
              {isLast ? tx("متوجه شدم") : tx("بعدی")}
              {!isLast && <ArrowLeft className="size-3.5 ltr:-scale-x-100" aria-hidden="true" />}
            </button>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Guides for every page                                               */
/* ------------------------------------------------------------------ */

export const siteGuide: GuideStep[] = [
  { title: tx("سایتتان را قدم‌به‌قدم بسازید"), text: tx("از رنگ و گوشه‌ها شروع می‌کنید و به چیدمان کامل می‌رسید. هر انتخاب همان لحظه در پیش‌نمایش دیده می‌شود.") },
  { target: "steps", title: tx("مراحل"), text: tx("ترتیب اجباری نیست؛ هر وقت خواستید به هر مرحله برگردید و تغییرش دهید.") },
  { target: "panel-question", title: tx("سوال این مرحله"), text: tx("گزینه‌هایش همین زیر است؛ هر کدام را بزنید، پیش‌نمایش همان لحظه عوض می‌شود.") },
  { target: "stage", title: tx("پیش‌نمایش زنده"), text: tx("روی منو، دکمه‌ها و محصولات بزنید؛ مثل سایت واقعی کار می‌کنند.") },
  { target: "devices", title: tx("لپ‌تاپ یا موبایل"), text: tx("نمایش را بین دستگاه‌ها عوض کنید.") },
  { target: "assistant", title: tx("دستیار خیام"), text: tx("هر جا سوال داشتید یا پیشنهاد خواستید، اینجا را بزنید.") },
  { target: "submit", title: tx("ثبت سفارش"), text: tx("هر وقت آماده بودید ثبت کنید؛ همه‌چیز بعداً هم قابل تغییر است.") },
];

export const appGuide: GuideStep[] = [
  { title: tx("اپلیکیشنتان را قدم‌به‌قدم بسازید"), text: tx("پلتفرم، رنگ، صفحه‌ها و قابلیت‌ها را انتخاب کنید؛ نتیجه همان لحظه روی گوشی اجرا می‌شود.") },
  { target: "steps", title: tx("مراحل"), text: tx("هر وقت خواستید به هر مرحله برگردید.") },
  { target: "panel-question", title: tx("سوال این مرحله"), text: tx("گزینه‌هایش همین زیر است. قابلیت‌هایی که روشن می‌کنید روی گوشی اجرا می‌شوند.") },
  { target: "stage", title: tx("گوشی واقعاً کار می‌کند"), text: tx("روی کارت‌ها، سبد، منو و تنظیمات بزنید؛ مثل اپ واقعی جواب می‌دهد.") },
  { target: "devices", title: tx("صفحه‌ها و دستگاه"), text: tx("از اینجا هر صفحه اپ را باز کنید یا بین آیفون و اندروید جابه‌جا شوید.") },
  { target: "assistant", title: tx("دستیار خیام"), text: tx("هر جا سوال داشتید یا پیشنهاد خواستید، اینجا را بزنید.") },
  { target: "submit", title: tx("ثبت سفارش"), text: tx("هر وقت آماده بودید ثبت کنید؛ همه‌چیز بعداً هم قابل تغییر است.") },
];

export const quickGuide: GuideStep[] = [
  { target: "quick-cards", title: tx("سه طرح آماده"), text: tx("هر کارت یک طرح کامل است؛ روی موبایل ورقشان بزنید.") },
  { target: "quick-devices", title: tx("لپ‌تاپ یا موبایل"), text: tx("هر سه طرح را روی دستگاه دلخواه ببینید.") },
  { target: "quick-customize", title: tx("شخصی‌سازی"), text: tx("همان طرح در استودیو باز می‌شود تا جزئیاتش را خودتان عوض کنید.") },
  { target: "quick-pick", title: tx("انتخاب"), text: tx("«همین را می‌خواهم» شما را به ثبت سفارش می‌برد.") },
];

export const aiChatGuide: GuideStep[] = [
  { target: "answers", title: tx("جواب دادن"), text: tx("روی گزینه‌ها بزنید؛ لازم نیست چیزی تایپ کنید. هر جواب را بعداً با زدن رویش عوض کنید.") },
  { target: "talk", title: tx("با خیام حرف بزنید"), text: tx("اگر راحت‌ترید، کارتان را با زبان خودتان بنویسید؛ خیام می‌خواند و پیشنهاد می‌دهد چه کسانی به تیم اضافه شوند.") },
  { target: "dossier", title: tx("پرونده تیم"), text: tx("اعضای تیم، کارهایشان و اثرشان بر کسب‌وکارتان با هر جواب اینجا کامل می‌شود.") },
];

export const aiCustomGuide: GuideStep[] = [
  { target: "custom-domains", title: tx("حوزه کار"), text: tx("یک یا چند حوزه را انتخاب کنید؛ هر کدام نمونه کاربرد دارد.") },
  { target: "custom-problem", title: tx("مسئله شما"), text: tx("با زبان خودتان بنویسید؛ لازم نیست فنی باشد.") },
  { target: "custom-process", title: tx("مسیر همکاری"), text: tx("این پروژه‌ها با گفتگو و بررسی داده شروع می‌شوند تا نتیجه واقعاً به کار بیاید.") },
  { target: "custom-consult", title: tx("رزرو مشاوره"), text: tx("با یک مبلغ کم جلسه رزرو کنید؛ این مبلغ از قرارداد کم می‌شود.") },
];
