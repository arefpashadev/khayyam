"use client";

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

export const Guide = ({ id, steps, autoStart = true }: { id: string; steps: GuideStep[]; autoStart?: boolean }) => {
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
    const timeout = window.setTimeout(() => open(id), 900);
    return () => window.clearTimeout(timeout);
  }, [id, autoStart, open]);

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

  // Card placement: phones use the bottom (or top) edge; wide screens sit beside the target.
  let style: React.CSSProperties;
  if (!hole) style = { width: cardWidth, left: (width - cardWidth) / 2, top: (height - cardHeight) / 2 };
  else if (width < 640) style = hole.top + (hole.bottom - hole.top) / 2 > height / 2 ? { left: 16, right: 16, top: 16 } : { left: 16, right: 16, bottom: 16 };
  else {
    const centreX = (hole.left + hole.right) / 2;
    const centreY = (hole.top + hole.bottom) / 2;
    const gap = 14;
    if (height - hole.bottom > cardHeight + gap + 8) style = { width: cardWidth, left: clamp(centreX - cardWidth / 2, 16, width - cardWidth - 16), top: hole.bottom + gap };
    else if (hole.top > cardHeight + gap + 8) style = { width: cardWidth, left: clamp(centreX - cardWidth / 2, 16, width - cardWidth - 16), top: hole.top - gap - cardHeight };
    else if (hole.left > cardWidth + gap + 8) style = { width: cardWidth, left: hole.left - gap - cardWidth, top: clamp(centreY - cardHeight / 2, 16, height - cardHeight - 16) };
    else if (width - hole.right > cardWidth + gap + 8) style = { width: cardWidth, left: hole.right + gap, top: clamp(centreY - cardHeight / 2, 16, height - cardHeight - 16) };
    else style = { width: cardWidth, left: (width - cardWidth) / 2, bottom: 24 };
  }
  const move = reduce ? { duration: 0 } : { type: "spring" as const, bounce: 0, duration: 0.45 };

  return (
    <div className="fixed inset-0 z-[400] text-[#eef1f5]" dir="rtl" role="dialog" aria-modal="true" aria-label="راهنما">
      {hole ? (
        <motion.div
          className="pointer-events-none absolute rounded-[16px] ring-[1.5px] ring-white/85"
          style={{ boxShadow: "0 0 0 9999px rgba(5, 7, 12, 0.62)" }}
          initial={false}
          animate={{ left: hole.left, top: hole.top, width: hole.right - hole.left, height: hole.bottom - hole.top }}
          transition={move}
        />
      ) : (
        <motion.div className="absolute inset-0 bg-[rgba(5,7,12,0.62)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      )}
      {/* clicking the dim area moves on, like most product tours */}
      <button type="button" aria-hidden="true" tabIndex={-1} className="absolute inset-0 cursor-default" onClick={() => (isLast ? finish() : go(step + 1))} />

      <AnimatePresence mode="wait">
        <motion.div
          ref={cardRef}
          key={step}
          className="absolute rounded-[20px] bg-[#151920] p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
          style={style}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="flex items-center gap-2">
            {!current.target && <KhayyamMark size={26} />}
            <strong className="flex-1 text-[14.5px] font-extrabold">{current.title}</strong>
            <span className="text-[11px] text-[#5d6573]">
              {faNumber(step + 1)} از {faNumber(items.length)}
            </span>
            <button type="button" onClick={finish} aria-label="بستن راهنما" className="-me-1 flex size-7 items-center justify-center rounded-lg text-[#8a93a0] transition-colors hover:bg-white/6 hover:text-white">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-2 text-[13px] leading-7 text-[#a7b0bc]">{current.text}</p>
          <div className="mt-3 flex items-center gap-2">
            {step > 0 && (
              <button type="button" onClick={() => go(step - 1)} aria-label="قبلی" className="flex size-9 items-center justify-center rounded-xl text-[#c9d0d9] transition-colors hover:bg-white/6">
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            )}
            <button type="button" autoFocus onClick={() => (isLast ? finish() : go(step + 1))} className="ms-auto flex h-9 items-center gap-1.5 rounded-xl bg-white px-4 text-[12.5px] font-extrabold text-[#0b0d12] transition-colors hover:bg-[#d9ecff]">
              {isLast ? "متوجه شدم" : "بعدی"}
              {!isLast && <ArrowLeft className="size-3.5" aria-hidden="true" />}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Guides for every page                                               */
/* ------------------------------------------------------------------ */

export const siteGuide: GuideStep[] = [
  { title: "سایتتان را قدم‌به‌قدم بسازید", text: "از رنگ و گوشه‌ها شروع می‌کنید و به چیدمان کامل می‌رسید. هر انتخاب همان لحظه در پیش‌نمایش دیده می‌شود." },
  { target: "steps", title: "مراحل", text: "ترتیب اجباری نیست؛ هر وقت خواستید به هر مرحله برگردید و تغییرش دهید." },
  { target: "panel", title: "انتخاب‌های این مرحله", text: "گزینه‌ها را بزنید. دکمه مرحله بعد پایین همین پنل است." },
  { target: "stage", title: "پیش‌نمایش زنده", text: "روی منو، دکمه‌ها و محصولات بزنید؛ مثل سایت واقعی کار می‌کنند." },
  { target: "devices", title: "لپ‌تاپ یا موبایل", text: "نمایش را بین دستگاه‌ها عوض کنید." },
  { target: "assistant", title: "دستیار خیام", text: "هر جا سوال داشتید یا پیشنهاد خواستید، اینجا را بزنید." },
  { target: "submit", title: "ثبت سفارش", text: "هر وقت آماده بودید ثبت کنید؛ همه‌چیز بعداً هم قابل تغییر است." },
];

export const appGuide: GuideStep[] = [
  { title: "اپلیکیشنتان را قدم‌به‌قدم بسازید", text: "پلتفرم، رنگ، صفحه‌ها و قابلیت‌ها را انتخاب کنید؛ نتیجه همان لحظه روی گوشی اجرا می‌شود." },
  { target: "steps", title: "مراحل", text: "هر وقت خواستید به هر مرحله برگردید." },
  { target: "panel", title: "انتخاب‌های این مرحله", text: "گزینه‌ها را بزنید. قابلیت‌هایی که روشن می‌کنید روی گوشی اجرا می‌شوند." },
  { target: "stage", title: "گوشی واقعاً کار می‌کند", text: "روی کارت‌ها، سبد، منو و تنظیمات بزنید؛ مثل اپ واقعی جواب می‌دهد." },
  { target: "devices", title: "صفحه‌ها و دستگاه", text: "از اینجا هر صفحه اپ را باز کنید یا بین آیفون و اندروید جابه‌جا شوید." },
  { target: "assistant", title: "دستیار خیام", text: "هر جا سوال داشتید یا پیشنهاد خواستید، اینجا را بزنید." },
  { target: "submit", title: "ثبت سفارش", text: "هر وقت آماده بودید ثبت کنید؛ همه‌چیز بعداً هم قابل تغییر است." },
];

export const quickGuide: GuideStep[] = [
  { target: "quick-cards", title: "سه طرح آماده", text: "هر کارت یک طرح کامل است؛ روی موبایل ورقشان بزنید." },
  { target: "quick-devices", title: "لپ‌تاپ یا موبایل", text: "هر سه طرح را روی دستگاه دلخواه ببینید." },
  { target: "quick-customize", title: "شخصی‌سازی", text: "همان طرح در استودیو باز می‌شود تا جزئیاتش را خودتان عوض کنید." },
  { target: "quick-pick", title: "انتخاب", text: "«همین را می‌خواهم» شما را به ثبت سفارش می‌برد." },
];

export const aiChatGuide: GuideStep[] = [
  { target: "interview", title: "گفتگو با خیام", text: "به سوال‌ها با زدن روی گزینه‌ها جواب دهید. هر جواب را بعداً با زدن رویش عوض کنید." },
  { target: "talk", title: "با خیام حرف بزنید", text: "اگر راحت‌ترید، کارتان را با زبان خودتان بنویسید؛ خیام می‌خواند و پیشنهاد می‌دهد چه کسانی به تیم اضافه شوند." },
  { target: "dossier", title: "پرونده تیم", text: "اعضای تیم، کارهایشان و اثرشان بر کسب‌وکارتان با هر جواب اینجا کامل می‌شود." },
];

export const aiCustomGuide: GuideStep[] = [
  { target: "custom-domains", title: "حوزه کار", text: "یک یا چند حوزه را انتخاب کنید؛ هر کدام نمونه کاربرد دارد." },
  { target: "custom-problem", title: "مسئله شما", text: "با زبان خودتان بنویسید؛ لازم نیست فنی باشد." },
  { target: "custom-process", title: "مسیر همکاری", text: "این پروژه‌ها با گفتگو و بررسی داده شروع می‌شوند تا نتیجه واقعاً به کار بیاید." },
  { target: "custom-consult", title: "رزرو مشاوره", text: "با یک مبلغ کم جلسه رزرو کنید؛ این مبلغ از قرارداد کم می‌شود." },
];
