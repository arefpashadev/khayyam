"use client";

import { Bot, Laptop, LayoutTemplate, ListChecks, MousePointerClick, Send, Smartphone, Sparkles, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

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
  { target: "devices", icon: Smartphone, title: "لپ‌تاپ یا موبایل", text: () => "با این دکمه‌ها بین نمایش هر دو، فقط لپ‌تاپ یا فقط موبایل جابه‌جا شوید." },
  { target: "assistant", icon: Bot, title: "دستیار هوشمند", text: () => "هر جا مطمئن نبودید از دستیار بپرسید؛ برای هر مرحله پیشنهاد آماده دارد و با یک لمس اعمالش می‌کند." },
  { target: "submit", icon: Send, title: "ثبت درخواست", text: () => "هر وقت آماده بودید ثبت کنید. همه این مقادیر بعداً هم طبق خواسته شما قابل تغییر است." },
];

const tours: Record<TourName, TourStep[]> = { intro: editorTour, editor: editorTour };

const storageKey = (name: TourName) => `khayyam:order-wizard-tour:${name}:v4`;

const CARD_WIDTH = 320;
const CARD_HEIGHT = 200;
const GAP = 14;

const markTourSeen = (name: TourName) => {
  try {
    localStorage.setItem(storageKey(name), "1");
  } catch {
    /* storage can be unavailable (private mode); the tour just shows again */
  }
};

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
    const timeout = window.setTimeout(() => setTour({ name, step: 0 }), 700);
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

  const close = () => {
    markTourSeen(name);
    setTour(null);
  };

  useEffect(() => {
    if (step === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        markTourSeen(name);
        setTour(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [name, step, setTour]);

  if (step === null || !current) return null;

  const isLast = step >= items.length - 1;
  const rect = current.target && measured?.target === current.target ? measured.rect : null;
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  const width = Math.min(CARD_WIDTH, viewport.width - 32);
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

  // Put the card on whichever side of the highlight has room; centre it when there is no target.
  let cardStyle: React.CSSProperties = { width, left: (viewport.width - width) / 2, top: Math.max(16, (viewport.height - CARD_HEIGHT) / 2 - 40) };
  if (rect) {
    const centredLeft = clamp(rect.left + rect.width / 2 - width / 2, 16, viewport.width - width - 16);
    const centredTop = clamp(rect.top + rect.height / 2 - CARD_HEIGHT / 2, 16, viewport.height - CARD_HEIGHT - 16);
    if (viewport.height - rect.bottom >= CARD_HEIGHT + GAP + 16) cardStyle = { width, left: centredLeft, top: rect.bottom + GAP };
    else if (rect.top >= CARD_HEIGHT + GAP + 16) cardStyle = { width, left: centredLeft, bottom: viewport.height - rect.top + GAP };
    else if (rect.left >= width + GAP + 16) cardStyle = { width, left: rect.left - width - GAP, top: centredTop };
    else if (viewport.width - rect.right >= width + GAP + 16) cardStyle = { width, left: rect.right + GAP, top: centredTop };
    else cardStyle = { width, left: centredLeft, bottom: 24 };
  }

  const pad = 8;
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[200]" dir="rtl" role="dialog" aria-modal="true" aria-label="راهنمای شروع">
      {rect ? (
        <motion.div
          className="pointer-events-none absolute rounded-[20px] ring-2 ring-white/70"
          style={{ boxShadow: "0 0 0 9999px rgba(10, 18, 26, 0.58)" }}
          initial={false}
          animate={{ left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }}
          transition={reduce ? { duration: 0 } : { type: "spring", bounce: 0.12, duration: 0.5 }}
        />
      ) : (
        <motion.div className="absolute inset-0 bg-[rgba(10,18,26,0.58)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="absolute overflow-hidden rounded-[22px] bg-white text-[#14202b] shadow-[0_30px_80px_-20px_rgba(10,18,26,0.6)]"
          style={cardStyle}
          initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          {!current.target && (
            <div className="relative flex h-28 items-end justify-center gap-3 overflow-hidden bg-[linear-gradient(135deg,#e6f2fc,#f4f8fb)] pb-4">
              <span className="absolute -right-6 -top-8 size-28 rounded-full bg-[#078ef0]/10" />
              <span className="absolute -left-4 bottom-[-30px] size-20 rounded-full bg-[#078ef0]/15" />
              <span className="relative flex h-16 w-24 items-center justify-center rounded-xl bg-white shadow-lg"><Laptop className="size-8 text-[#078ef0]" strokeWidth={1.5} aria-hidden="true" /></span>
              <span className="relative flex h-20 w-12 items-center justify-center rounded-xl bg-[#14202b] shadow-lg"><Smartphone className="size-6 text-white" strokeWidth={1.5} aria-hidden="true" /></span>
            </div>
          )}
          <div className="p-5">
            <div className="flex items-center gap-2.5">
              {current.target && (
                <span className="flex size-8 items-center justify-center rounded-xl bg-[#e6f2fc] text-[#078ef0]">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
              )}
              <strong className="text-[16px] font-extrabold">{current.title}</strong>
              <span className="ms-auto flex gap-1" aria-label={`مرحله ${faNumber(step + 1)} از ${faNumber(items.length)}`}>
                {items.map((item, index) => (
                  <span key={item.title} className={`h-1.5 rounded-full transition-all ${index === step ? "w-4 bg-[#078ef0]" : "w-1.5 bg-[#dfe5e8]"}`} />
                ))}
              </span>
            </div>
            <p className="mt-2.5 text-[13px] leading-7 text-[#5b6872]">{current.text(kind)}</p>
            <div className="mt-4 flex items-center gap-2">
              <button type="button" onClick={close} className="h-10 rounded-xl px-3 text-[12px] font-bold text-[#8a959b] transition-colors hover:bg-[#f5f7f8] hover:text-[#4d5b65]">
                {isLast ? "بستن" : "رد کردن"}
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => (isLast ? close() : setTour({ name, step: step + 1 }))}
                className="ms-auto h-10 rounded-xl bg-[#14202b] px-5 text-[13px] font-extrabold text-white transition-colors hover:bg-[#078ef0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078ef0]"
              >
                {!current.target ? "نشانم بده" : isLast ? "شروع کنیم" : "بعدی"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
