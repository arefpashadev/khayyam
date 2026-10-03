"use client";

import { ArrowLeft, ArrowRight, Bot, LayoutTemplate, ListChecks, MousePointerClick, Send, Smartphone, Sparkles, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

import { faNumber, type OrderKind } from "./config";
import { useWizard, type TourName } from "./store";

type TourStep = { target: string | null; icon: LucideIcon; title: string; text: (kind: OrderKind) => string };

const editorTour: TourStep[] = [
  {
    target: null,
    icon: Sparkles,
    title: "به استودیو خیام خوش آمدید",
    text: (kind) => `${kind === "app" ? "اپلیکیشن" : "سایت"} خودتان را از جزئیات تا کل می‌سازید: اول رنگ‌ها و گوشه‌ها و نوشته‌ها، بعد کسب‌وکار، و در آخر چیدمان کامل صفحه. هر انتخاب همان لحظه دیده می‌شود.`,
  },
  { target: "steps", icon: ListChecks, title: "همه مراحل یک‌جا", text: () => "هر وقت خواستید روی هر مرحله بزنید، تغییرش بدهید و برگردید. ترتیب اجباری نیست." },
  { target: "panel", icon: MousePointerClick, title: "انتخاب‌های هر مرحله", text: () => "گزینه‌ها را بزنید؛ رنگ دلخواه را هم با قطره‌چکان انتخاب کنید." },
  { target: "stage", icon: LayoutTemplate, title: "پیش‌نمایش زنده", text: (kind) => (kind === "app" ? "نتیجه همین‌جا روی گوشی دیده می‌شود." : "نتیجه همین‌جا روی لپ‌تاپ و گوشی دیده می‌شود و خودش به بخشی که عوض شده می‌رود.") },
  { target: "devices", icon: Smartphone, title: "لپ‌تاپ یا موبایل", text: () => "با این دکمه‌ها نمایش را بین لپ‌تاپ و موبایل عوض کنید." },
  { target: "assistant", icon: Bot, title: "دستیار هوشمند", text: () => "هر جا مطمئن نبودید از دستیار بپرسید؛ برای هر مرحله پیشنهاد آماده دارد و با یک لمس اعمالش می‌کند." },
  { target: "submit", icon: Send, title: "ثبت درخواست", text: () => "هر وقت آماده بودید ثبت کنید. همه این مقادیر بعداً هم طبق خواسته شما قابل تغییر است." },
];

const tours: Record<TourName, TourStep[]> = { intro: editorTour, editor: editorTour };

const storageKey = (name: TourName) => `khayyam:order-wizard-tour:${name}:v5`;

const CARD_WIDTH = 340;
const CARD_HEIGHT = 230;
const GAP = 18;
const PAD = 10;

const markTourSeen = (name: TourName) => {
  try {
    localStorage.setItem(storageKey(name), "1");
  } catch {
    /* storage can be unavailable (private mode); the tour just shows again */
  }
};

type Side = "below" | "above" | "left" | "right" | "center";

export const Tour = ({ kind, name }: { kind: OrderKind; name: TourName }) => {
  const tour = useWizard((state) => state.tour);
  const setTour = useWizard((state) => state.setTour);
  const step = tour?.name === name ? tour.step : null;
  const reduce = useReducedMotion();
  const [measured, setMeasured] = useState<{ target: string; rect: DOMRect } | null>(null);
  const items = tours[name].filter((item) => !item.target || typeof document === "undefined" || document.querySelector(`[data-tour="${item.target}"]`));
  const current = step === null ? null : items[Math.min(step, items.length - 1)];

  // First visit: open the tour after the screen has settled.
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(storageKey(name)) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;
    const timeout = window.setTimeout(() => setTour({ name, step: 0 }), 800);
    return () => window.clearTimeout(timeout);
  }, [name, setTour]);

  // Track the highlighted element's position.
  useEffect(() => {
    const target = current?.target;
    if (!target) return;
    const element = document.querySelector<HTMLElement>(`[data-tour="${target}"]`);
    if (!element) return;
    const measure = () => setMeasured({ target, rect: element.getBoundingClientRect() });
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [current?.target]);

  useEffect(() => {
    if (step === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        markTourSeen(name);
        setTour(null);
      }
      // RTL: left arrow = forward
      if (event.key === "ArrowLeft" && step < items.length - 1) setTour({ name, step: step + 1 });
      if (event.key === "ArrowRight" && step > 0) setTour({ name, step: step - 1 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [name, step, items.length, setTour]);

  if (step === null || !current) return null;

  const close = () => {
    markTourSeen(name);
    setTour(null);
  };
  const isLast = step >= items.length - 1;
  const rect = current.target && measured?.target === current.target ? measured.rect : null;
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  const width = Math.min(CARD_WIDTH, viewport.width - 32);
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

  // The spotlight is clipped to the screen so huge targets still read as a frame.
  const spot = rect
    ? {
        left: clamp(rect.left - PAD, 6, viewport.width - 12),
        top: clamp(rect.top - PAD, 6, viewport.height - 12),
        right: clamp(rect.right + PAD, 12, viewport.width - 6),
        bottom: clamp(rect.bottom + PAD, 12, viewport.height - 6),
      }
    : null;

  // Card goes on whichever side has room, with a pointer aimed at the spotlight.
  let side: Side = "center";
  let cardStyle: React.CSSProperties = { width, left: (viewport.width - width) / 2, top: Math.max(16, (viewport.height - CARD_HEIGHT - 120) / 2) };
  let pointer = 0;
  if (spot) {
    const centreX = (spot.left + spot.right) / 2;
    const centreY = (spot.top + spot.bottom) / 2;
    const left = clamp(centreX - width / 2, 16, viewport.width - width - 16);
    const top = clamp(centreY - CARD_HEIGHT / 2, 16, viewport.height - CARD_HEIGHT - 16);
    if (viewport.height - spot.bottom >= CARD_HEIGHT + GAP + 12) {
      side = "below";
      cardStyle = { width, left, top: spot.bottom + GAP };
      pointer = clamp(centreX - left, 28, width - 28);
    } else if (spot.top >= CARD_HEIGHT + GAP + 12) {
      side = "above";
      cardStyle = { width, left, bottom: viewport.height - spot.top + GAP };
      pointer = clamp(centreX - left, 28, width - 28);
    } else if (spot.left >= width + GAP + 12) {
      side = "left";
      cardStyle = { width, left: spot.left - width - GAP, top };
      pointer = clamp(centreY - top, 28, CARD_HEIGHT - 28);
    } else if (viewport.width - spot.right >= width + GAP + 12) {
      side = "right";
      cardStyle = { width, left: spot.right + GAP, top };
      pointer = clamp(centreY - top, 28, CARD_HEIGHT - 28);
    } else {
      // target fills the screen: float the card inside it, near the bottom
      cardStyle = { width, left: (viewport.width - width) / 2, bottom: 28 };
    }
  }

  const Icon = current.icon;
  const pointerStyle: React.CSSProperties | null =
    side === "below" ? { top: -6, left: pointer - 6 } : side === "above" ? { bottom: -6, left: pointer - 6 } : side === "left" ? { right: -6, top: pointer - 6 } : side === "right" ? { left: -6, top: pointer - 6 } : null;
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, bounce: 0.14, duration: 0.55 };

  return (
    <div className="fixed inset-0 z-[200] text-[#eef1f5]" dir="rtl" role="dialog" aria-modal="true" aria-label="راهنمای شروع">
      {spot ? (
        <>
          {/* dim everything except the spotlight */}
          <motion.div
            className="pointer-events-none absolute rounded-[22px]"
            style={{ boxShadow: "0 0 0 9999px rgba(5, 7, 12, 0.74)" }}
            initial={false}
            animate={{ left: spot.left, top: spot.top, width: spot.right - spot.left, height: spot.bottom - spot.top }}
            transition={spring}
          />
          {/* glowing frame that pulses so the highlighted area is unmistakable */}
          <motion.div
            className="pointer-events-none absolute rounded-[22px] border-2 border-[#4da3ff] shadow-[0_0_0_4px_rgba(77,163,255,0.18),0_0_40px_rgba(77,163,255,0.55)]"
            initial={false}
            animate={{ left: spot.left, top: spot.top, width: spot.right - spot.left, height: spot.bottom - spot.top }}
            transition={spring}
          >
            <span className="absolute inset-0 rounded-[22px] border-2 border-[#4da3ff] motion-safe:animate-ping" style={{ animationDuration: "2s" }} />
            <span className="absolute -top-3.5 right-3 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#4da3ff] px-3 py-1 text-[11.5px] font-extrabold text-white shadow-lg">
              <Icon className="size-3.5" aria-hidden="true" />
              {current.title}
            </span>
          </motion.div>
        </>
      ) : (
        <motion.div className="absolute inset-0 bg-[rgba(5,7,12,0.78)] backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="absolute rounded-[24px] bg-[#151920] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
          style={cardStyle}
          initial={reduce ? false : { opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          {pointerStyle && <span className="absolute size-3 bg-[#151920]" style={{ ...pointerStyle, transform: "rotate(45deg)" }} />}

          {!current.target ? (
            <div className="flex flex-col items-center px-6 pb-2 pt-7 text-center">
              <KhayyamMark size={88} />
              <strong className="mt-4 text-[18px] font-extrabold">{current.title}</strong>
              <p className="mt-2 text-[13.5px] leading-7 text-[#a7b0bc]">{current.text(kind)}</p>
            </div>
          ) : (
            <div className="px-5 pt-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4da3ff,#7c6cff)] text-[15px] font-black text-white">{faNumber(step)}</span>
                <strong className="text-[16px] font-extrabold leading-6">{current.title}</strong>
              </div>
              <p className="mt-3 text-[13.5px] leading-7 text-[#a7b0bc]">{current.text(kind)}</p>
            </div>
          )}

          <div className="px-5 pb-5 pt-4">
            <div className="mb-4 flex gap-1" aria-label={`مرحله ${faNumber(step + 1)} از ${faNumber(items.length)}`}>
              {items.map((item, index) => (
                <span key={item.title} className={`h-1 flex-1 rounded-full transition-colors ${index <= step ? "bg-[#4da3ff]" : "bg-white/10"}`} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {step > 0 ? (
                <button type="button" onClick={() => setTour({ name, step: step - 1 })} aria-label="قبلی" className="flex size-10 items-center justify-center rounded-xl bg-white/6 text-[#c9d0d9] transition-colors hover:bg-white/10">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              ) : (
                <button type="button" onClick={close} className="h-10 rounded-xl px-3 text-[12px] font-bold text-[#8a93a0] transition-colors hover:bg-white/6 hover:text-white">
                  رد کردن
                </button>
              )}
              <button
                type="button"
                autoFocus
                onClick={() => (isLast ? close() : setTour({ name, step: step + 1 }))}
                className="ms-auto flex h-10 items-center gap-2 rounded-xl bg-white px-5 text-[13px] font-extrabold text-[#0b0d12] transition-colors hover:bg-[#d9ecff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4da3ff]"
              >
                {!current.target ? "نشانم بده" : isLast ? "شروع کنیم" : "بعدی"}
                {!isLast && <ArrowLeft className="size-4" aria-hidden="true" />}
              </button>
            </div>
            {step > 0 && !isLast && (
              <button type="button" onClick={close} className="mt-2 w-full text-center text-[11.5px] text-[#5d6573] transition-colors hover:text-[#a7b0bc]">
                بستن راهنما
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
