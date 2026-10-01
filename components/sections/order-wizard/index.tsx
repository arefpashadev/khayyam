"use client";

import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  Check,
  CircleHelp,
  Info,
  LayoutTemplate,
  Link2,
  Palette,
  PencilLine,
  RotateCcw,
  Settings2,
  Shapes,
  Sparkles,
  Type,
  X,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { Link } from "@/i18n/navigation";

import {
  appExtras,
  appFeatures,
  colors,
  faNumber,
  firstEditorStep,
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
import { GalleryShell } from "./gallery";
import { PreviewStage } from "./preview";
import { stepPanels } from "./steps";
import { useWizard } from "./store";
import { Tour } from "./tour";
import { useIsSmallScreen } from "./use-small-screen";

const editorSteps = steps.slice(firstEditorStep);
const designStep = steps.findIndex((step) => step.key === "design");

const stepIcons: Partial<Record<StepKey, LucideIcon>> = {
  brand: Type,
  mood: Sparkles,
  color: Palette,
  shape: Shapes,
  sections: Blocks,
  extras: Settings2,
  references: Link2,
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

  const step = useWizard((state) => state.step);
  const isSmall = useIsSmallScreen();
  const inGallery = steps[step].phase === "gallery";

  return (
    <div dir="rtl" className="fixed inset-0 z-[100] overflow-hidden bg-[#e6ebee] font-sans text-[#14202b]">
      {inGallery ? <GalleryShell kind={kind} /> : isSmall ? <MobileEditor kind={kind} /> : <StudioEditor kind={kind} />}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Mobile editor: preview on top, bottom sheet with the current step   */
/* ------------------------------------------------------------------ */

const MobileEditor = ({ kind }: { kind: OrderKind }) => {
  const submitted = useWizard((state) => state.submitted);
  const step = useWizard((state) => state.step);
  const progress = submitted ? 100 : ((step - firstEditorStep + 1) / editorSteps.length) * 100;

  return (
    <div className="flex size-full flex-col">
      <div className="absolute inset-x-0 top-0 z-30 h-[3px] bg-black/5" aria-hidden="true">
        <div className="absolute inset-y-0 right-0 bg-[#078ef0] transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>
      <main className="relative min-h-0 flex-1">
        <PreviewStage />
      </main>
      <aside data-tour="panel" className="flex max-h-[50dvh] w-full shrink-0 flex-col rounded-t-[22px] bg-white shadow-[0_-10px_30px_-18px_rgba(20,32,43,0.35)]">
        {submitted ? <SubmittedPanel kind={kind} /> : <StepPanel kind={kind} />}
      </aside>
      <Tour kind={kind} name="editor" />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Desktop studio: tabs on top, full canvas, floating panel            */
/* ------------------------------------------------------------------ */

const StudioEditor = ({ kind }: { kind: OrderKind }) => {
  const step = useWizard((state) => state.step);
  const submitted = useWizard((state) => state.submitted);
  const config = useWizard((state) => state.config);
  const goTo = useWizard((state) => state.goTo);
  const submit = useWizard((state) => state.submit);
  const setTour = useWizard((state) => state.setTour);
  const iconButton = "flex size-10 items-center justify-center rounded-xl text-[#5b6872] transition-colors hover:bg-[#f1f4f6] hover:text-[#14202b]";

  return (
    <div className="flex size-full flex-col">
      <header className="relative z-20 flex h-16 shrink-0 items-center gap-3 border-b border-black/5 bg-white px-5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-[#14202b] text-[17px] font-black text-white">خ</span>
        <button
          type="button"
          data-tour="change-design"
          onClick={() => goTo(designStep)}
          className="flex h-10 items-center gap-2 rounded-xl bg-[#f3f5f7] px-3 text-[12px] font-bold text-[#33414b] transition-colors hover:bg-[#e9eef1]"
        >
          <LayoutTemplate className="size-4 text-[#078ef0]" aria-hidden="true" />
          {industries[config.industry].label} · طرح {faNumber(config.variant + 1)}
          <span className="text-[#8a959b]">تغییر</span>
        </button>

        <nav data-tour="tabs" aria-label="بخش‌ها" className="absolute left-1/2 flex -translate-x-1/2 gap-0.5 rounded-2xl bg-[#f3f5f7] p-1">
          {editorSteps.map((item, offset) => {
            const index = firstEditorStep + offset;
            const Icon = stepIcons[item.key] ?? Sparkles;
            const current = index === step && !submitted;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => goTo(index)}
                aria-current={current ? "page" : undefined}
                className="relative flex h-9 items-center gap-1.5 rounded-xl px-3 text-[12.5px] font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#078ef0] xl:px-3.5"
              >
                {current && <motion.span layoutId="studio-tab" className="absolute inset-0 rounded-xl bg-white shadow-[0_1px_3px_rgba(20,32,43,0.1)]" transition={{ type: "spring", bounce: 0.15, duration: 0.35 }} />}
                <Icon className={`relative size-4 ${current ? "text-[#078ef0]" : "text-[#8a959b]"}`} aria-hidden="true" />
                <span className={`relative ${current ? "text-[#14202b]" : "text-[#5b6872]"}`}>{item.title}</span>
              </button>
            );
          })}
        </nav>

        <div className="ms-auto flex items-center gap-1">
          <button type="button" onClick={() => setTour({ name: "editor", step: 0 })} aria-label="راهنما" className={iconButton}>
            <CircleHelp className="size-[19px]" aria-hidden="true" />
          </button>
          <Link href="/" aria-label="خروج" className={iconButton}>
            <X className="size-[19px]" aria-hidden="true" />
          </Link>
          <button
            type="button"
            data-tour="submit"
            onClick={submit}
            className="ms-2 flex h-10 items-center gap-2 rounded-xl bg-[#078ef0] px-5 text-[13px] font-extrabold text-white transition-colors hover:bg-[#0679d0]"
          >
            <Check className="size-4" aria-hidden="true" /> ثبت درخواست
          </button>
        </div>
      </header>

      <main className="relative min-h-0 flex-1">
        <PreviewStage studio />
        <aside
          data-tour="panel"
          className="absolute bottom-5 right-5 top-5 flex w-[400px] flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_24px_60px_-24px_rgba(20,32,43,0.35),0_0_0_1px_rgba(20,32,43,0.04)]"
        >
          {submitted ? <SubmittedPanel kind={kind} /> : <StepPanel kind={kind} />}
        </aside>
      </main>
      <Tour kind={kind} name="editor" />
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
  const goTo = useWizard((state) => state.goTo);
  const reduce = useReducedMotion();
  const isSmall = useIsSmallScreen();
  const current = steps[step];
  const Panel = stepPanels[current.key];
  const isLast = step === steps.length - 1;
  const isFirst = step === firstEditorStep;
  // RTL: forward slides in from the left. Phones switch instantly — less movement.
  const still = reduce || isSmall;
  const offset = still ? 0 : 24;

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-4 lg:px-7 lg:pt-7">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div key={current.key} initial={{ opacity: 0, x: -direction * offset }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction * offset }} transition={{ duration: still ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}>
            <span className="mb-1.5 hidden text-[12px] font-bold text-[#078ef0] lg:block">
              {current.title}
              <span className="ms-2 font-normal text-[#a3aeb4]">
                {faNumber(step - firstEditorStep + 1)} از {faNumber(editorSteps.length)}
              </span>
            </span>
            <h1 className="text-[16px] font-extrabold leading-[1.65] lg:text-[20px]">{current.question(kind)}</h1>
            <p className="mt-1 hidden text-[12px] leading-6 text-[#8a959b] lg:block">{current.hint}</p>
            <div className="mt-3 lg:mt-6">{Panel && <Panel />}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="flex shrink-0 items-center gap-2 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:px-7 lg:pb-6">
        <button
          type="button"
          onClick={() => goTo(isFirst ? designStep : step - 1)}
          aria-label={isFirst ? "برگشت به طرح‌ها" : "قبلی"}
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f1f4f6] text-[#4d5b65] transition hover:bg-[#e6ebee] focus-visible:outline-2 focus-visible:outline-[#078ef0]"
        >
          <ArrowRight className="size-[18px]" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={next}
          data-tour={isSmall ? "submit" : undefined}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#14202b] text-[13px] font-extrabold text-white transition hover:bg-[#078ef0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078ef0] active:scale-[0.98]"
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
    { label: "رنگ", value: colors.find((item) => item.value === config.color)?.label ?? config.color },
    { label: "حالت", value: themes.find((item) => item.value === config.theme)?.label },
    { label: "گوشه‌ها", value: radii.find((item) => item.value === config.radius)?.label },
    { label: "نوشته‌ها", value: typeStyles.find((item) => item.value === config.type)?.label },
    { label: "طرح", value: `طرح ${faNumber(config.variant + 1)}` },
    { label: "حرکت", value: motionLevels.find((item) => item.value === config.motion)?.label },
    { label: "امکانات فنی", value: (kind === "app" ? appExtras : siteExtras).filter((item) => config.extras.includes(item.value)).map((item) => item.label).join("، ") || "هیچ" },
    { label: kind === "app" ? "امکانات" : "بخش‌ها", value: sectionLabels.join("، ") || "هیچ" },
    { label: "نمونه‌ها", value: references.length ? `${faNumber(references.length)} لینک` : "ندارد" },
  ];

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-4 lg:px-6 lg:pt-8">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#22c27a] text-white">
            <Check className="size-5" strokeWidth={3} aria-hidden="true" />
          </span>
          <h1 className="text-[17px] font-extrabold lg:text-[19px]">درخواست شما ثبت شد</h1>
        </div>
        <p className="mt-2 text-[12px] leading-6 text-[#8a959b]">طرح اولیه بر اساس همین انتخاب‌ها آماده می‌شود و مشاور پروژه برای جزئیات با شما تماس می‌گیرد.</p>
        <dl className="mt-4 divide-y divide-black/5 rounded-xl bg-[#f6f8f9]">
          {summary.map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4 px-3.5 py-2.5 text-[12px]">
              <dt className="shrink-0 text-[#8a959b]">{row.label}</dt>
              <dd className="text-left font-bold leading-5">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 flex gap-2 rounded-xl bg-[#fff7e8] px-3 py-2.5 text-[11.5px] leading-6 text-[#7a5a1c]">
          <Info className="mt-1 size-3.5 shrink-0" aria-hidden="true" />
          این مقادیر طبق خواسته شما قابل تغییر است؛ هر تغییری بخواهید برای مشاور بفرستید.
        </p>
      </div>
      <footer className="flex shrink-0 items-center gap-2 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:px-6 lg:pb-6">
        <button type="button" onClick={restart} aria-label="از اول" className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f1f4f6] text-[#4d5b65] transition hover:bg-[#e6ebee]">
          <RotateCcw className="size-[18px]" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => goTo(firstEditorStep)} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#14202b] text-[13px] font-extrabold text-white transition hover:bg-[#078ef0]">
          <PencilLine className="size-4" aria-hidden="true" /> ویرایش انتخاب‌ها
        </button>
      </footer>
    </>
  );
};
