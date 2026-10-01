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

  const step = useWizard((state) => state.step);
  const submitted = useWizard((state) => state.submitted);
  const goTo = useWizard((state) => state.goTo);

  return (
    <div dir="rtl" className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#e9eef1] font-sans text-[#14202b]">
      {/* top bar */}
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-black/6 bg-white px-4 lg:h-16 lg:px-6">
        <Link href="/" aria-label="خروج" className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#4d5b65] transition hover:bg-[#f1f4f6] focus-visible:outline-2 focus-visible:outline-[#078ef0]">
          <X className="size-5" aria-hidden="true" />
        </Link>
        <strong className="hidden shrink-0 text-[15px] sm:block">{kind === "app" ? "ساخت اپلیکیشن" : "ساخت سایت"}</strong>

        <nav aria-label="مراحل" className="mx-auto flex w-full max-w-[560px] flex-col gap-1.5">
          <ol className="flex gap-1">
            {steps.map((item, index) => (
              <li key={item.key} className="flex-1">
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`${item.title}${index === step ? " (مرحله فعلی)" : ""}`}
                  aria-current={index === step ? "step" : undefined}
                  className="group block w-full py-1.5 outline-none"
                >
                  <span className={`block h-1.5 rounded-full transition-colors duration-300 group-focus-visible:ring-2 group-focus-visible:ring-[#078ef0] ${index < step || submitted ? "bg-[#14202b]" : index === step ? "bg-[#078ef0]" : "bg-[#dfe5e8] group-hover:bg-[#c7d0d5]"}`} />
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <span className="shrink-0 text-[12px] font-bold text-[#7a868d]">
          {faNumber(step + 1)} از {faNumber(steps.length)}
        </span>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* control panel — right on desktop (RTL), bottom sheet on mobile */}
        <aside className="order-2 flex max-h-[58dvh] w-full shrink-0 flex-col rounded-t-[28px] bg-white shadow-[0_-12px_40px_-20px_rgba(20,32,43,0.35)] lg:order-1 lg:max-h-none lg:w-[440px] lg:rounded-none lg:border-l lg:border-black/6 lg:shadow-none">
          <span className="mx-auto mt-2.5 block h-1 w-10 rounded-full bg-[#dfe5e8] lg:hidden" aria-hidden="true" />
          {submitted ? <SubmittedPanel kind={kind} /> : <StepPanel kind={kind} />}
        </aside>

        <main className="order-1 min-h-0 flex-1 p-3 pb-4 sm:p-5 lg:order-2 lg:p-8">
          <PreviewStage />
        </main>
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
  // RTL: moving forward slides content in from the left.
  const offset = reduce ? 0 : 28;

  return (
    <>
      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4 pt-2 lg:px-8 lg:pt-9">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={current.key}
            custom={direction}
            initial={{ opacity: 0, x: -direction * offset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * offset }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[12px] font-bold text-[#078ef0]">{current.title}</span>
            <h1 className="mt-1 text-[18px] font-extrabold leading-[1.6] lg:mt-1.5 lg:text-[24px]">{current.question(kind)}</h1>
            <p className="mt-1 text-[12px] leading-6 text-[#7a868d] lg:mt-1.5 lg:text-[13px]">{current.hint}</p>
            <div className="mt-4 lg:mt-7">
              <Panel />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="flex shrink-0 items-center gap-2 border-t border-black/6 bg-white px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:px-8 lg:py-5">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0}
          className="flex h-12 items-center gap-2 rounded-xl px-4 text-[14px] font-bold text-[#4d5b65] transition hover:bg-[#f1f4f6] focus-visible:outline-2 focus-visible:outline-[#078ef0] disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowRight className="size-4" aria-hidden="true" /> قبلی
        </button>
        <button
          type="button"
          onClick={next}
          className="ms-auto flex h-12 min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#14202b] px-6 text-[14px] font-extrabold text-white transition hover:bg-[#078ef0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078ef0] active:scale-[0.98]"
        >
          {isLast ? "ثبت درخواست" : "بعدی"}
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
  const layoutLabel = [...siteLayouts, ...appLayouts].find((item) => item.value === config.layout)?.label;
  const references = config.references.filter((item) => item.trim());

  const summary = [
    { label: "برند", value: config.brandName.trim() || "بدون نام" },
    { label: "حوزه", value: industries[config.industry].label },
    { label: "رنگ", value: colors.find((item) => item.value === config.color)?.label ?? config.color },
    { label: "حالت", value: themes.find((item) => item.value === config.theme)?.label },
    { label: "گوشه‌ها", value: radii.find((item) => item.value === config.radius)?.label },
    { label: "نوشته‌ها", value: typeStyles.find((item) => item.value === config.type)?.label },
    { label: "چیدمان", value: layoutLabel },
    { label: kind === "app" ? "امکانات" : "بخش‌ها", value: sectionLabels.join("، ") || "هیچ" },
    { label: "نمونه‌ها", value: references.length ? `${faNumber(references.length)} لینک` : "ندارد" },
  ];

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4 pt-5 lg:px-8 lg:pt-10">
        <span className="flex size-12 items-center justify-center rounded-full bg-[#22c27a] text-white">
          <Check className="size-6" strokeWidth={3} aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-[22px] font-extrabold leading-[1.6]">درخواست شما ثبت شد</h1>
        <p className="mt-1.5 text-[13px] leading-6 text-[#7a868d]">طرح اولیه بر اساس همین انتخاب‌ها آماده می‌شود و مشاور پروژه برای جزئیات با شما تماس می‌گیرد.</p>

        <dl className="mt-6 divide-y divide-black/6 rounded-2xl border border-[#e2e8eb]">
          {summary.map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4 px-4 py-3 text-[13px]">
              <dt className="shrink-0 text-[#7a868d]">{row.label}</dt>
              <dd className="text-left font-bold leading-6">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <footer className="flex shrink-0 items-center gap-2 border-t border-black/6 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:px-8 lg:py-5">
        <button type="button" onClick={restart} className="flex h-12 items-center gap-2 rounded-xl px-4 text-[14px] font-bold text-[#4d5b65] transition hover:bg-[#f1f4f6]">
          <RotateCcw className="size-4" aria-hidden="true" /> از اول
        </button>
        <button type="button" onClick={() => goTo(0)} className="ms-auto flex h-12 items-center gap-2 rounded-xl bg-[#14202b] px-6 text-[14px] font-extrabold text-white transition hover:bg-[#078ef0]">
          <PencilLine className="size-4" aria-hidden="true" /> ویرایش انتخاب‌ها
        </button>
      </footer>
    </>
  );
};
