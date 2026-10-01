"use client";

import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  Building2,
  Check,
  CircleHelp,
  LayoutTemplate,
  Link2,
  Palette,
  PencilLine,
  RotateCcw,
  Settings2,
  Shapes,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { Link } from "@/i18n/navigation";

import { appFeatures, appLayouts, colors, faNumber, getDefaultConfig, industries, radii, siteLayouts, siteSections, steps, themes, typeStyles, type OrderKind } from "./config";
import { PreviewStage } from "./preview";
import { stepPanels } from "./steps";
import { useWizard } from "./store";
import { Tour } from "./tour";
import { useIsSmallScreen } from "./use-small-screen";

export const OrderWizard = ({ kind }: { kind: OrderKind }) => {
  // Seed the store for this kind before the first paint so the right preview shows immediately.
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

  const submitted = useWizard((state) => state.submitted);

  return (
    <div dir="rtl" className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#e6ebee] font-sans text-[#14202b] lg:flex-row">
      <ProgressLine />
      {/* controls — rail + panel on desktop (right, RTL), bottom sheet on mobile */}
      <aside
        data-tour="panel"
        className="order-2 flex max-h-[50dvh] w-full shrink-0 rounded-t-[22px] bg-white shadow-[0_-10px_30px_-18px_rgba(20,32,43,0.35)] lg:order-1 lg:h-full lg:max-h-none lg:w-[440px] lg:rounded-none lg:shadow-[-1px_0_0_rgba(20,32,43,0.06)]"
      >
        <StepRail kind={kind} />
        <div className="flex min-w-0 flex-1 flex-col">{submitted ? <SubmittedPanel kind={kind} /> : <StepPanel kind={kind} />}</div>
      </aside>

      <main data-tour="stage" className="relative order-1 min-h-0 flex-1 lg:order-2">
        <PreviewStage />
      </main>
      <Tour kind={kind} />
    </div>
  );
};

/** One hairline across the very top of the screen; invisible hit areas jump to a step. */
const ProgressLine = () => {
  const step = useWizard((state) => state.step);
  const submitted = useWizard((state) => state.submitted);
  const goTo = useWizard((state) => state.goTo);
  const progress = submitted ? 100 : ((step + 1) / steps.length) * 100;

  return (
    <nav aria-label="مراحل" className="absolute inset-x-0 top-0 z-30 h-[3px] bg-black/5 lg:hidden">
      <div className="absolute inset-y-0 right-0 bg-[#078ef0] transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
      <ol className="absolute inset-x-0 top-0 flex h-3">
        {steps.map((item, index) => (
          <li key={item.key} className="flex-1">
            <button type="button" onClick={() => goTo(index)} aria-label={item.title} aria-current={index === step ? "step" : undefined} className="block size-full outline-none focus-visible:bg-[#078ef0]/30" />
          </li>
        ))}
      </ol>
    </nav>
  );
};

const stepIcons: Record<(typeof steps)[number]["key"], LucideIcon> = {
  brand: Building2,
  mood: Sparkles,
  color: Palette,
  shape: Shapes,
  layout: LayoutTemplate,
  sections: Blocks,
  extras: Settings2,
  references: Link2,
};

/** Desktop navigation: every step as an icon with its name on hover, plus help and exit. */
const StepRail = ({ kind }: { kind: OrderKind }) => {
  const step = useWizard((state) => state.step);
  const submitted = useWizard((state) => state.submitted);
  const goTo = useWizard((state) => state.goTo);
  const setTour = useWizard((state) => state.setTour);
  const rail = "group relative flex size-11 items-center justify-center rounded-2xl transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#078ef0]";
  const tip = "pointer-events-none absolute right-full z-10 mr-3 whitespace-nowrap rounded-lg bg-[#14202b] px-2.5 py-1.5 text-[12px] font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100";

  return (
    <nav aria-label="مراحل" className="hidden w-[72px] shrink-0 flex-col items-center gap-1 border-l border-black/6 bg-[#fafbfc] py-5 lg:flex">
      <span className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-[#14202b] text-[18px] font-black text-white" aria-label={kind === "app" ? "ساخت اپلیکیشن" : "ساخت سایت"}>
        خ
      </span>
      <ol className="flex flex-col gap-1">
        {steps.map((item, index) => {
          const Icon = stepIcons[item.key];
          const done = index < step || submitted;
          const current = index === step && !submitted;
          return (
            <li key={item.key}>
              <button type="button" onClick={() => goTo(index)} aria-current={current ? "step" : undefined} aria-label={item.title} className={`${rail} ${current ? "bg-[#e6f2fc] text-[#078ef0]" : done ? "text-[#14202b] hover:bg-[#eef2f4]" : "text-[#a8b2b8] hover:bg-[#eef2f4] hover:text-[#5b6872]"}`}>
                <Icon className="size-[19px]" aria-hidden="true" />
                {done && (
                  <span className="absolute bottom-1.5 left-1.5 flex size-3.5 items-center justify-center rounded-full bg-[#22c27a] text-white ring-2 ring-[#fafbfc]">
                    <Check className="size-2" strokeWidth={4} aria-hidden="true" />
                  </span>
                )}
                <span className={tip}>{item.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-auto flex flex-col gap-1">
        <button type="button" onClick={() => setTour(0)} aria-label="راهنما" className={`${rail} text-[#8a959b] hover:bg-[#eef2f4] hover:text-[#14202b]`}>
          <CircleHelp className="size-[19px]" aria-hidden="true" />
          <span className={tip}>راهنما</span>
        </button>
        <Link href="/" aria-label="خروج" className={`${rail} text-[#8a959b] hover:bg-[#eef2f4] hover:text-[#14202b]`}>
          <X className="size-[19px]" aria-hidden="true" />
          <span className={tip}>خروج</span>
        </Link>
      </div>
    </nav>
  );
};

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
  const offset = still ? 0 : 24;

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-4 lg:px-6 lg:pt-8">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div key={current.key} initial={{ opacity: 0, x: -direction * offset }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction * offset }} transition={{ duration: still ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}>
            <span className="mb-1.5 hidden text-[12px] font-bold text-[#078ef0] lg:block">
              {current.title}
              <span className="ms-2 font-normal text-[#a3aeb4]">مرحله {faNumber(step + 1)} از {faNumber(steps.length)}</span>
            </span>
            <h1 className="text-[16px] font-extrabold leading-[1.65] lg:text-[21px]">{current.question(kind)}</h1>
            <p className="mt-1 hidden text-[12px] leading-6 text-[#8a959b] lg:block">{current.hint}</p>
            <div className="mt-3 lg:mt-5">
              <Panel />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="flex shrink-0 items-center gap-2 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:px-6 lg:pb-6">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0}
          aria-label="قبلی"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f1f4f6] text-[#4d5b65] transition hover:bg-[#e6ebee] focus-visible:outline-2 focus-visible:outline-[#078ef0] disabled:pointer-events-none disabled:opacity-35"
        >
          <ArrowRight className="size-[18px]" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={next}
          data-tour="next"
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
    ...(kind === "site" ? [{ label: "طرح", value: `طرح ${faNumber(config.variant + 1)}` }] : []),
    { label: "چیدمان", value: [...siteLayouts, ...appLayouts].find((item) => item.value === config.layout)?.label },
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
      </div>
      <footer className="flex shrink-0 items-center gap-2 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:px-6 lg:pb-6">
        <button type="button" onClick={restart} aria-label="از اول" className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f1f4f6] text-[#4d5b65] transition hover:bg-[#e6ebee]">
          <RotateCcw className="size-[18px]" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => goTo(0)} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#14202b] text-[13px] font-extrabold text-white transition hover:bg-[#078ef0]">
          <PencilLine className="size-4" aria-hidden="true" /> ویرایش انتخاب‌ها
        </button>
      </footer>
    </>
  );
};
