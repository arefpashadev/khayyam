"use client";

import { ArrowLeft, ArrowRight, Check, PencilLine, RotateCcw, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { Link } from "@/i18n/navigation";

import { appFeatures, appLayouts, colors, faNumber, getDefaultConfig, industries, radii, siteLayouts, siteSections, steps, themes, typeStyles, type OrderKind } from "./config";
import { PreviewStage } from "./preview";
import { stepPanels } from "./steps";
import { useWizard } from "./store";

export const OrderWizard = ({ kind }: { kind: OrderKind }) => {
  // Seed the store for this kind before the first paint so the right preview shows immediately.
  useState(() => {
    useWizard.setState({ kind, step: 0, direction: 1, submitted: false, config: getDefaultConfig(kind), focus: { target: "top", tick: 0 } });
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
      {/* controls — side panel on desktop (right, RTL), bottom sheet on mobile */}
      <aside className="order-2 flex max-h-[54dvh] w-full shrink-0 flex-col rounded-t-[22px] bg-white shadow-[0_-10px_30px_-18px_rgba(20,32,43,0.35)] lg:order-1 lg:h-full lg:max-h-none lg:w-[360px] lg:rounded-none lg:border-l lg:border-black/6 lg:shadow-none xl:w-[380px]">
        <PanelHeader kind={kind} />
        {submitted ? <SubmittedPanel kind={kind} /> : <StepPanel kind={kind} />}
      </aside>

      <main className="relative order-1 min-h-0 flex-1 lg:order-2">
        <PreviewStage />
      </main>
    </div>
  );
};

const PanelHeader = ({ kind }: { kind: OrderKind }) => {
  const step = useWizard((state) => state.step);
  const submitted = useWizard((state) => state.submitted);
  const goTo = useWizard((state) => state.goTo);
  const progress = submitted ? 100 : ((step + 1) / steps.length) * 100;

  return (
    <div className="shrink-0 px-5 pt-3 lg:px-6 lg:pt-5">
      <div className="flex items-center gap-2">
        <Link href="/" aria-label="خروج" className="-ms-1.5 flex size-8 items-center justify-center rounded-full text-[#5b6872] transition hover:bg-[#f1f4f6] focus-visible:outline-2 focus-visible:outline-[#078ef0]">
          <X className="size-[18px]" aria-hidden="true" />
        </Link>
        <strong className="text-[13px]">{kind === "app" ? "ساخت اپلیکیشن" : "ساخت سایت"}</strong>
        <span className="ms-auto text-[12px] font-bold tabular-nums text-[#8a959b]">
          {faNumber(step + 1)} از {faNumber(steps.length)}
        </span>
      </div>

      {/* one thin progress line; invisible hit areas let you jump to any step */}
      <div className="relative mt-2.5 h-[3px] rounded-full bg-[#e8edf0]">
        <motion.div className="absolute inset-y-0 right-0 rounded-full bg-[#078ef0]" initial={false} animate={{ width: `${progress}%` }} transition={{ type: "spring", bounce: 0, duration: 0.5 }} />
        <ol className="absolute inset-x-0 -top-2 flex h-[19px]">
          {steps.map((item, index) => (
            <li key={item.key} className="flex-1">
              <button type="button" onClick={() => goTo(index)} aria-label={item.title} aria-current={index === step ? "step" : undefined} className="block size-full outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#078ef0]" />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

const StepPanel = ({ kind }: { kind: OrderKind }) => {
  const step = useWizard((state) => state.step);
  const direction = useWizard((state) => state.direction);
  const next = useWizard((state) => state.next);
  const prev = useWizard((state) => state.prev);
  const reduce = useReducedMotion();
  const current = steps[step];
  const Panel = stepPanels[current.key];
  const isLast = step === steps.length - 1;
  const offset = reduce ? 0 : 24; // RTL: forward slides in from the left

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4 pt-4 lg:px-6 lg:pt-7">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div key={current.key} initial={{ opacity: 0, x: -direction * offset }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction * offset }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
            <h1 className="text-[17px] font-extrabold leading-[1.65] lg:text-[19px]">{current.question(kind)}</h1>
            <p className="mt-1 hidden text-[12px] leading-6 text-[#8a959b] lg:block">{current.hint}</p>
            <div className="mt-3 lg:mt-5">
              <Panel />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="flex shrink-0 items-center gap-2 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:px-6 lg:pb-6">
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
    { label: "چیدمان", value: [...siteLayouts, ...appLayouts].find((item) => item.value === config.layout)?.label },
    { label: kind === "app" ? "امکانات" : "بخش‌ها", value: sectionLabels.join("، ") || "هیچ" },
    { label: "نمونه‌ها", value: references.length ? `${faNumber(references.length)} لینک` : "ندارد" },
  ];

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4 pt-4 lg:px-6 lg:pt-7">
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
      <footer className="flex shrink-0 items-center gap-2 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:px-6 lg:pb-6">
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
