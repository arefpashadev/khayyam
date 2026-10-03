"use client";

import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  Briefcase,
  Check,
  CircleHelp,
  Info,
  LayoutTemplate,
  Link2,
  Palette,
  PencilLine,
  RotateCcw,
  Settings2,
  Sparkles,
  Square,
  Type,
  X,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";
import { Link } from "@/i18n/navigation";

import {
  appExtras,
  appFeatures,
  backdrops,
  faNumber,
  getDefaultConfig,
  industries,
  motionLevels,
  radii,
  siteExtras,
  siteSections,
  steps,
  themes,
  typeStyles,
  type OrderKind,
  type StepKey,
} from "./config";
import { artLabels, industryArts, siteLayouts } from "./designs";
import { PreviewStage } from "./preview";
import { DraggableSheet } from "./sheet";
import { stepPanels } from "./steps";
import { useWizard } from "./store";
import { Tour } from "./tour";
import { useIsSmallScreen } from "./use-small-screen";

const stepIcons: Record<StepKey, LucideIcon> = {
  palette: Palette,
  radius: Square,
  type: Type,
  backdrop: Sparkles,
  business: Briefcase,
  design: LayoutTemplate,
  sections: Blocks,
  extras: Settings2,
  references: Link2,
};

const shortTitles: Record<StepKey, string> = {
  palette: "پالت",
  radius: "گوشه‌ها",
  type: "نوشته",
  backdrop: "پس‌زمینه",
  business: "کسب‌وکار",
  design: "چیدمان",
  sections: "بخش‌ها",
  extras: "امکانات",
  references: "الهام",
};

export const OrderWizard = ({ kind }: { kind: OrderKind }) => {
  // Seed the store for this kind before the first paint so the right screen shows immediately.
  useState(() => {
    useWizard.setState({ kind, step: 0, direction: 1, submitted: false, config: getDefaultConfig(kind), focus: { target: "top", tick: 0 }, tour: null });
    return true;
  });

  // This screen behaves like an app: lock the page behind it.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const isSmall = useIsSmallScreen();

  return (
    <div dir="rtl" className="fixed inset-0 z-[100] overflow-hidden bg-[#0b0d12] font-sans text-[#eef1f5] [color-scheme:dark]">
      {isSmall ? <MobileEditor kind={kind} /> : <StudioEditor kind={kind} />}
      <Tour kind={kind} name="editor" />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Desktop: header, preview canvas, rail + panel on the right          */
/* ------------------------------------------------------------------ */

const StudioEditor = ({ kind }: { kind: OrderKind }) => {
  const submitted = useWizard((state) => state.submitted);
  const submit = useWizard((state) => state.submit);
  const setTour = useWizard((state) => state.setTour);
  const brandName = useWizard((state) => state.config.brandName);
  const iconButton = "flex size-9 items-center justify-center rounded-xl text-[#8a93a0] transition-colors hover:bg-white/6 hover:text-white";

  return (
    <div className="flex size-full flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/6 px-4">
        <KhayyamMark size={36} title="خیام" />
        <div className="leading-tight">
          <strong className="block text-[13px]">{brandName.trim() || "پروژه جدید"}</strong>
          <span className="text-[11px] text-[#8a93a0]">{kind === "app" ? "اپلیکیشن" : "وب‌سایت"} · استودیو خیام</span>
        </div>
        <div className="ms-auto flex items-center gap-1">
          <button type="button" onClick={() => setTour({ name: "editor", step: 0 })} aria-label="راهنما" className={iconButton}>
            <CircleHelp className="size-[18px]" aria-hidden="true" />
          </button>
          <Link href="/" aria-label="خروج" className={iconButton}>
            <X className="size-[18px]" aria-hidden="true" />
          </Link>
          <button
            type="button"
            data-tour="submit"
            onClick={submit}
            className="ms-2 flex h-9 items-center gap-2 rounded-xl bg-white px-4 text-[12.5px] font-extrabold text-[#0b0d12] transition-colors hover:bg-[#d9ecff]"
          >
            <Check className="size-4" aria-hidden="true" /> ثبت درخواست
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <StepRail />
        <aside data-tour="panel" className="flex w-[380px] shrink-0 flex-col border-l border-white/6 bg-[#111419] xl:w-[400px]">
          {submitted ? <SubmittedPanel kind={kind} /> : <StepPanel kind={kind} />}
        </aside>
        <main className="relative min-w-0 flex-1">
          <PreviewStage studio />
        </main>
      </div>
    </div>
  );
};

/** Vertical step list with icon + short name; done steps get a check. Any step can be opened. */
const StepRail = () => {
  const step = useWizard((state) => state.step);
  const submitted = useWizard((state) => state.submitted);
  const goTo = useWizard((state) => state.goTo);

  return (
    <nav data-tour="steps" aria-label="مراحل" className="flex w-[76px] shrink-0 flex-col items-center gap-1 overflow-y-auto border-l border-white/6 py-3">
      {steps.map((item, index) => {
        const Icon = stepIcons[item.key];
        const current = index === step && !submitted;
        const done = index < step || submitted;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => goTo(index)}
            aria-current={current ? "step" : undefined}
            className={`relative flex w-[64px] flex-col items-center gap-1 rounded-2xl py-2.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#4da3ff] ${current ? "bg-[#4da3ff]/14 text-[#9ccbff]" : done ? "text-[#c9d0d9] hover:bg-white/5" : "text-[#5d6573] hover:bg-white/5 hover:text-[#c9d0d9]"}`}
          >
            <Icon className="size-[19px]" aria-hidden="true" />
            <span className="text-[10.5px] font-bold">{shortTitles[item.key]}</span>
            {done && (
              <span className="absolute left-2 top-2 flex size-3.5 items-center justify-center rounded-full bg-[#2fd08a] text-[#0b0d12]">
                <Check className="size-2" strokeWidth={4} aria-hidden="true" />
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

/* ------------------------------------------------------------------ */
/* Mobile: preview on top, dark sheet with step chips to jump around   */
/* ------------------------------------------------------------------ */

const MobileEditor = ({ kind }: { kind: OrderKind }) => {
  const submitted = useWizard((state) => state.submitted);

  return (
    <div className="flex size-full flex-col">
      <main className="relative min-h-0 flex-1">
        <PreviewStage />
      </main>
      <DraggableSheet data-tour="panel" className="rounded-t-[24px] bg-[#111419] shadow-[0_-16px_40px_-12px_rgba(0,0,0,0.6)]">
        <StepChips />
        {submitted ? <SubmittedPanel kind={kind} /> : <StepPanel kind={kind} />}
      </DraggableSheet>
    </div>
  );
};

/** One scrollable row of step chips so any step is one tap away on a phone. */
const StepChips = () => {
  const step = useWizard((state) => state.step);
  const submitted = useWizard((state) => state.submitted);
  const goTo = useWizard((state) => state.goTo);
  const rowRef = useRef<HTMLDivElement>(null);

  // Keep the current chip in view as the user moves through the steps.
  useEffect(() => {
    const chip = rowRef.current?.querySelector<HTMLElement>('[aria-current="step"]');
    chip?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [step]);

  return (
    <div ref={rowRef} data-tour="steps" className="flex shrink-0 gap-1.5 overflow-x-auto px-4 pb-1 pt-1 [scrollbar-width:none]">
      {steps.map((item, index) => {
        const current = index === step && !submitted;
        const done = index < step || submitted;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => goTo(index)}
            aria-current={current ? "step" : undefined}
            className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[11.5px] font-bold transition-colors ${current ? "bg-white text-[#0b0d12]" : done ? "bg-[#1d222b] text-[#c9d0d9]" : "bg-[#171b22] text-[#5d6573]"}`}
          >
            {done ? <Check className="size-3 text-[#2fd08a]" strokeWidth={3} aria-hidden="true" /> : <span className="text-[10px] opacity-70">{faNumber(index + 1)}</span>}
            {shortTitles[item.key]}
          </button>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Shared step panel                                                   */
/* ------------------------------------------------------------------ */

const StepPanel = ({ kind }: { kind: OrderKind }) => {
  const step = useWizard((state) => state.step);
  const direction = useWizard((state) => state.direction);
  const next = useWizard((state) => state.next);
  const prev = useWizard((state) => state.prev);
  const reduce = useReducedMotion();
  const isSmall = useIsSmallScreen();
  const current = steps[step];
  const Panel = stepPanels[current.key];
  const isLast = step === steps.length - 1;
  // RTL: forward slides in from the left. Phones switch instantly — less movement.
  const still = reduce || isSmall;
  const offset = still ? 0 : 20;

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-3 lg:px-6 lg:pt-6 [scrollbar-color:#2a303b_transparent] [scrollbar-width:thin]">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div key={current.key} initial={{ opacity: 0, x: -direction * offset }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction * offset }} transition={{ duration: still ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}>
            <span className="mb-1 hidden text-[11.5px] font-bold text-[#4da3ff] lg:block">
              مرحله {faNumber(step + 1)} از {faNumber(steps.length)}
            </span>
            <h1 className="text-[16px] font-extrabold leading-[1.65] text-white lg:text-[20px]">{current.question(kind)}</h1>
            <p className="mt-1 hidden text-[12px] leading-6 text-[#8a93a0] lg:block">{current.hint}</p>
            <div className="mt-3 lg:mt-6">
              <Panel />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="flex shrink-0 items-center gap-2 border-t border-white/6 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:px-6 lg:py-4">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0}
          aria-label="قبلی"
          className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#171b22] text-[#c9d0d9] transition hover:bg-[#1d222b] focus-visible:outline-2 focus-visible:outline-[#4da3ff] disabled:opacity-30"
        >
          <ArrowRight className="size-[18px]" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={next}
          data-tour={isSmall ? "submit" : undefined}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#4da3ff,#7c6cff)] text-[13px] font-extrabold text-white shadow-[0_10px_30px_-12px_rgba(77,163,255,0.8)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4da3ff] active:scale-[0.98]"
        >
          {isLast ? "ثبت درخواست" : `بعدی: ${steps[step + 1].title}`}
          {isLast ? <Check className="size-4" aria-hidden="true" /> : <ArrowLeft className="size-4" aria-hidden="true" />}
        </button>
      </footer>
    </>
  );
};

const SubmittedPanel = ({ kind }: { kind: OrderKind }) => {
  const config = useWizard((state) => state.config);
  const goTo = useWizard((state) => state.goTo);
  const restart = useWizard((state) => state.restart);
  const sectionLabels = (kind === "app" ? appFeatures : siteSections).filter((item) => config.sections.includes(item.value)).map((item) => item.label);
  const references = config.references.filter((item) => item.trim());

  const summary = [
    { label: "برند", value: config.brandName.trim() || "بدون نام" },
    { label: "حوزه", value: industries[config.industry].label },
    { label: "رنگ‌ها", value: <span className="inline-flex gap-1" dir="ltr">{[config.color, config.accent].map((color) => <span key={color} className="size-4 rounded-full ring-1 ring-white/20" style={{ backgroundColor: color }} />)}</span> },
    { label: "فضا", value: themes.find((item) => item.value === config.theme)?.label },
    { label: "گوشه‌ها", value: radii.find((item) => item.value === config.radius)?.label },
    { label: "نوشته‌ها", value: typeStyles.find((item) => item.value === config.type)?.label },
    { label: "پس‌زمینه", value: `${backdrops.find((item) => item.value === config.backdrop)?.label}، حرکت ${motionLevels.find((item) => item.value === config.motion)?.label}` },
    { label: "چیدمان", value: kind === "app" ? `طرح ${faNumber(config.variant + 1)}` : `${siteLayouts[config.variant]?.label} · ${artLabels[industryArts[config.industry][config.art]]}` },
    { label: kind === "app" ? "امکانات" : "بخش‌ها", value: sectionLabels.join("، ") || "هیچ" },
    { label: "امکانات فنی", value: (kind === "app" ? appExtras : siteExtras).filter((item) => config.extras.includes(item.value)).map((item) => item.label).join("، ") || "هیچ" },
    { label: "نمونه‌ها", value: references.length ? `${faNumber(references.length)} لینک` : "ندارد" },
  ];

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-4 lg:px-6 lg:pt-7">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#2fd08a] text-[#0b0d12]">
            <Check className="size-5" strokeWidth={3} aria-hidden="true" />
          </span>
          <h1 className="text-[18px] font-extrabold text-white lg:text-[20px]">درخواست شما ثبت شد</h1>
        </div>
        <p className="mt-2 text-[12px] leading-6 text-[#8a93a0]">طرح اولیه بر اساس همین انتخاب‌ها آماده می‌شود و مشاور پروژه برای جزئیات با شما تماس می‌گیرد.</p>
        <dl className="mt-4 divide-y divide-white/6 rounded-2xl bg-[#171b22]">
          {summary.map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4 px-4 py-2.5 text-[12px]">
              <dt className="shrink-0 text-[#8a93a0]">{row.label}</dt>
              <dd className="text-left font-bold leading-5 text-[#eef1f5]">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 flex gap-2 rounded-2xl bg-[#3a2c10]/60 px-3.5 py-3 text-[11.5px] leading-6 text-[#f2cf8a]">
          <Info className="mt-1 size-3.5 shrink-0" aria-hidden="true" />
          این مقادیر طبق خواسته شما قابل تغییر است؛ هر تغییری بخواهید برای مشاور بفرستید.
        </p>
      </div>
      <footer className="flex shrink-0 items-center gap-2 border-t border-white/6 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:px-6 lg:py-4">
        <button type="button" onClick={restart} aria-label="از اول" className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#171b22] text-[#c9d0d9] transition hover:bg-[#1d222b]">
          <RotateCcw className="size-[18px]" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => goTo(0)} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-white text-[13px] font-extrabold text-[#0b0d12] transition hover:bg-[#d9ecff]">
          <PencilLine className="size-4" aria-hidden="true" /> ویرایش انتخاب‌ها
        </button>
      </footer>
    </>
  );
};
