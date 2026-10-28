"use client";

import { tx, studioDir, sx } from "@/lib/tx";
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
  AppWindow,
  Navigation,
  PanelsTopLeft,
  Send,
  Smartphone,
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
  appFeatureList,
  backdrops,
  estimate,
  faNumber,
  getDefaultConfig,
  industries,
  motionLevels,
  radii,
  siteExtras,
  projectTypes,
  sectionOptions,
  getSteps,
  themes,
  typeStyles,
  type OrderKind,
  type StepKey,
} from "./config";
import { artLabels, industryArts, siteLayouts } from "./designs";
import { AppStage } from "./app/app-stage";
import { FeaturesStep, IconStep, NavigationStep, PlatformStep, ScreensStep } from "./app/app-steps";
import { PathChooser } from "./chooser";
import { PreviewStage } from "./preview";
import { QuickWizard } from "./quick";
import { DraggableSheet } from "./sheet";
import { stepPanels } from "./steps";
import { useWizard } from "./store";
import { amountDue, formatToman, startPayment } from "./payments";
import { PaymentOverlay } from "./payment-ui";
import { appGuide, Guide, siteGuide, useGuide } from "./guide";
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
  outcome: Send,
  platform: Smartphone,
  navigation: Navigation,
  screens: PanelsTopLeft,
  icon: AppWindow,
  features: Sparkles,
};

const shortTitles: Record<StepKey, string> = {
  palette: tx("پالت"),
  radius: tx("گوشه‌ها"),
  type: tx("نوشته"),
  backdrop: tx("پس‌زمینه"),
  business: tx("کسب‌وکار"),
  design: tx("چیدمان"),
  sections: tx("بخش‌ها"),
  extras: tx("امکانات"),
  references: tx("الهام"),
  outcome: tx("سفارش"),
  platform: tx("پلتفرم"),
  navigation: tx("ناوبری"),
  screens: tx("صفحه‌ها"),
  icon: tx("آیکون"),
  features: tx("قابلیت‌ها"),
};

const panels = { ...stepPanels, platform: PlatformStep, navigation: NavigationStep, screens: ScreensStep, icon: IconStep, features: FeaturesStep };

export const OrderWizard = ({ kind }: { kind: OrderKind }) => {
  // Seed the store for this kind before the first paint so the right screen shows immediately.
  useState(() => {
    useWizard.setState({ kind, step: 0, direction: 1, submitted: false, config: getDefaultConfig(kind), focus: { target: "top", tick: 0 }, tour: null, mode: "choose" });
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

  // ?mode=quick or ?mode=studio opens a path directly (handy for links and for testing).
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("mode");
    if (requested === "quick" || requested === "studio") useWizard.getState().setMode(requested);
  }, []);

  const isSmall = useIsSmallScreen();
  const mode = useWizard((state) => state.mode);

  return (
    <div dir={studioDir()} className="fixed inset-0 z-[100] overflow-hidden bg-[#0c1222] font-sans text-[#f2ecdf] [color-scheme:dark]">
      <PaymentOverlay />
      {mode === "choose" ? (
        <PathChooser kind={kind} />
      ) : mode === "quick" ? (
        <QuickWizard kind={kind} />
      ) : (
        <>
          {isSmall ? <MobileEditor kind={kind} /> : <StudioEditor kind={kind} />}
          <Guide id={`studio-${kind}`} steps={kind === "app" ? appGuide : siteGuide} />
        </>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Desktop: header, preview canvas, rail + panel on the right          */
/* ------------------------------------------------------------------ */

const StudioEditor = ({ kind }: { kind: OrderKind }) => {
  const submitted = useWizard((state) => state.submitted);
  const goTo = useWizard((state) => state.goTo);
  const openGuide = useGuide((state) => state.open);
  const brandName = useWizard((state) => state.config.brandName);
  const iconButton = "flex size-9 items-center justify-center rounded-xl text-[#9aa3b8] transition-colors hover:bg-white/6 hover:text-white";

  return (
    <div className="flex size-full flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/6 px-4">
        <KhayyamMark size={36} title={tx("خیام")} />
        <div className="leading-tight">
          <strong className="block text-[13px]">{brandName.trim() || tx("پروژه جدید")}</strong>
          <span className="text-[11px] text-[#9aa3b8]">{kind === "app" ? tx("استودیو اپلیکیشن") : tx("استودیو وب‌سایت")}{" "}{tx("· خیام")}</span>
        </div>
        <div className="ms-auto flex items-center gap-1">
          <button type="button" onClick={() => openGuide(`studio-${kind}`)} aria-label={tx("راهنما")} className={iconButton}>
            <CircleHelp className="size-[18px]" aria-hidden="true" />
          </button>
          <Link href="/" aria-label={tx("خروج")} className={iconButton}>
            <X className="size-[18px]" aria-hidden="true" />
          </Link>
          <button
            type="button"
            data-tour="submit"
            onClick={() => goTo(getSteps(kind).length - 1)}
            className="ms-2 flex h-9 items-center gap-2 rounded-xl bg-white px-4 text-[12.5px] font-extrabold text-[#0c1222] transition-colors hover:bg-[#f5e6c6]"
          >
            <Check className="size-4" aria-hidden="true" />{" "}{tx("ثبت درخواست")}</button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <StepRail />
        <aside data-tour="panel" className="flex w-[380px] shrink-0 flex-col border-e border-white/6 bg-[#121a2e] xl:w-[400px]">
          {submitted ? <SubmittedPanel kind={kind} /> : <StepPanel kind={kind} />}
        </aside>
        <main className="relative min-w-0 flex-1">
          {kind === "app" ? <AppStage studio /> : <PreviewStage studio />}
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
  const steps = getSteps(useWizard((state) => state.kind));

  return (
    <nav data-tour="steps" aria-label={tx("مراحل")} className="flex w-[76px] shrink-0 flex-col items-center gap-1 overflow-y-auto border-e border-white/6 py-3">
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
            className={`relative flex w-[64px] flex-col items-center gap-1 rounded-2xl py-2.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#d9a648] ${current ? "bg-[#d9a648]/14 text-[#e9c27a]" : done ? "text-[#c9d0d9] hover:bg-white/5" : "text-[#6f788d] hover:bg-white/5 hover:text-[#c9d0d9]"}`}
          >
            <Icon className="size-[19px]" aria-hidden="true" />
            <span className="text-[10.5px] font-bold">{shortTitles[item.key]}</span>
            {done && (
              <span className="absolute end-2 top-2 flex size-3.5 items-center justify-center rounded-full bg-[#2fd08a] text-[#0c1222]">
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
        {kind === "app" ? <AppStage /> : <PreviewStage />}
      </main>
      <DraggableSheet data-tour="panel" className="rounded-t-[24px] bg-[#121a2e] shadow-[0_-16px_40px_-12px_rgba(0,0,0,0.6)]">
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
  const steps = getSteps(useWizard((state) => state.kind));
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
            className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[11.5px] font-bold transition-colors ${current ? "bg-white text-[#0c1222]" : done ? "bg-[#1d2842] text-[#c9d0d9]" : "bg-[#172036] text-[#6f788d]"}`}
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
  const config = useWizard((state) => state.config);
  const reduce = useReducedMotion();
  const isSmall = useIsSmallScreen();
  const steps = getSteps(kind);
  const current = steps[step];
  const Panel = panels[current.key];
  const isLast = step === steps.length - 1;
  // RTL: forward slides in from the left. Phones switch instantly — less movement.
  const still = reduce || isSmall;
  const offset = still ? 0 : 20;

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-3 lg:px-6 lg:pt-6 [scrollbar-color:#2a3550_transparent] [scrollbar-width:thin]">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div key={current.key} initial={{ opacity: 0, x: sx(-direction * offset) }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: sx(direction * offset) }} transition={{ duration: still ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}>
            <span className="mb-1 hidden text-[11.5px] font-bold text-[#d9a648] lg:block">{tx("مرحله {0} از {1}", [faNumber(step + 1), faNumber(steps.length)])}</span>
            <h1 data-guide="panel-question" className="text-[16px] font-extrabold leading-[1.65] text-white lg:text-[20px]">{current.question(kind)}</h1>
            <p className="mt-1 hidden text-[12px] leading-6 text-[#9aa3b8] lg:block">{current.hint}</p>
            <div className="mt-3 lg:mt-6">
              {Panel && <Panel />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="flex shrink-0 items-center gap-2 border-t border-white/6 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:px-6 lg:py-4">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0}
          aria-label={tx("قبلی")}
          className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#172036] text-[#c9d0d9] transition hover:bg-[#1d2842] focus-visible:outline-2 focus-visible:outline-[#d9a648] disabled:opacity-30"
        >
          <ArrowRight className="size-[18px] ltr:-scale-x-100" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isLast) return next();
            // last step: pay (deposit or consultation fee), then the request is registered
            const due = amountDue(config.plan, estimate(kind, config).min);
            void startPayment(due).then((ok) => ok && next());
          }}
          data-tour={isSmall ? "submit" : undefined}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#f5d79c,#d9a648)] text-[13px] font-extrabold text-[#1c1406] shadow-[0_10px_30px_-12px_rgba(217,166,72,0.8)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9a648] active:scale-[0.98]"
        >
          {isLast ? tx("پرداخت {0} و ثبت", [formatToman(amountDue(config.plan, estimate(kind, config).min))]) : tx("بعدی: {0}", [steps[step + 1].title])}
          {isLast ? <Check className="size-4" aria-hidden="true" /> : <ArrowLeft className="size-4 ltr:-scale-x-100" aria-hidden="true" />}
        </button>
      </footer>
    </>
  );
};

const SubmittedPanel = ({ kind }: { kind: OrderKind }) => {
  const config = useWizard((state) => state.config);
  const goTo = useWizard((state) => state.goTo);
  const restart = useWizard((state) => state.restart);
  const sectionLabels = sectionOptions(kind, config.projectType).filter((item) => config.sections.includes(item.value)).map((item) => item.label);
  const references = config.references.filter((item) => item.trim());
  const cost = estimate(kind, config);

  const summary = [
    { label: tx("مسیر"), value: config.plan === "consult" ? tx("اول مشاوره") : tx("شروع پروژه (با طراحی فیگما)") },
    { label: tx("پرداخت‌شده"), value: formatToman(amountDue(config.plan, cost.min)) },
    { label: tx("برآورد"), value: tx("{0} تا {1} میلیون تومان · {2} هفته", [faNumber(cost.min), faNumber(cost.max), faNumber(Math.max(1, cost.weeks))]) },
    { label: tx("نوع پروژه"), value: projectTypes.find((item) => item.value === config.projectType)?.label },
    ...(kind === "site"
      ? [{ label: tx("وب‌اپ"), value: config.webApp ? tx("دارد (قابل نصب روی گوشی)") : tx("ندارد") }]
      : [{ label: tx("قابلیت‌ها"), value: appFeatureList.filter((item) => config.features.includes(item.value)).map((item) => item.label).join(tx("، ")) || "—" }]),
    { label: tx("برند"), value: config.brandName.trim() || tx("بدون نام") },
    { label: tx("حوزه"), value: industries[config.industry].label },
    { label: tx("رنگ‌ها"), value: <span className="inline-flex gap-1" dir="ltr">{[config.color, config.accent].map((color) => <span key={color} className="size-4 rounded-full ring-1 ring-white/20" style={{ backgroundColor: color }} />)}</span> },
    { label: tx("فضا"), value: themes.find((item) => item.value === config.theme)?.label },
    { label: tx("گوشه‌ها"), value: radii.find((item) => item.value === config.radius)?.label },
    { label: tx("نوشته‌ها"), value: typeStyles.find((item) => item.value === config.type)?.label },
    { label: tx("پس‌زمینه"), value: tx("{0}، حرکت {1}", [backdrops.find((item) => item.value === config.backdrop)?.label, motionLevels.find((item) => item.value === config.motion)?.label]) },
    { label: tx("چیدمان"), value: kind === "app" ? tx("طرح {0}", [faNumber(config.variant + 1)]) : `${siteLayouts[config.variant]?.label} · ${artLabels[industryArts[config.industry][config.art]]}` },
    { label: kind === "app" ? tx("امکانات") : tx("بخش‌ها"), value: sectionLabels.join(tx("، ")) || tx("هیچ") },
    { label: tx("امکانات فنی"), value: (kind === "app" ? appExtras : siteExtras).filter((item) => config.extras.includes(item.value)).map((item) => item.label).join(tx("، ")) || tx("هیچ") },
    { label: tx("نمونه‌ها"), value: references.length ? tx("{0} لینک", [faNumber(references.length)]) : tx("ندارد") },
  ];

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-4 lg:px-6 lg:pt-7">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#2fd08a] text-[#0c1222]">
            <Check className="size-5" strokeWidth={3} aria-hidden="true" />
          </span>
          <h1 className="text-[18px] font-extrabold text-white lg:text-[20px]">{tx("درخواست شما ثبت شد")}</h1>
        </div>
        <p className="mt-2 text-[12px] leading-6 text-[#9aa3b8]">{tx("طرح اولیه بر اساس همین انتخاب‌ها آماده می‌شود و مشاور پروژه برای جزئیات با شما تماس می‌گیرد.")}</p>
        <dl className="mt-4 divide-y divide-white/6 rounded-2xl bg-[#172036]">
          {summary.map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4 px-4 py-2.5 text-[12px]">
              <dt className="shrink-0 text-[#9aa3b8]">{row.label}</dt>
              <dd className="text-end font-bold leading-5 text-[#f2ecdf]">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 flex gap-2 rounded-2xl bg-[#3a2c10]/60 px-3.5 py-3 text-[11.5px] leading-6 text-[#f2cf8a]">
          <Info className="mt-1 size-3.5 shrink-0" aria-hidden="true" />{tx("این مقادیر طبق خواسته شما قابل تغییر است؛ هر تغییری بخواهید برای مشاور بفرستید.")}</p>
      </div>
      <footer className="flex shrink-0 items-center gap-2 border-t border-white/6 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:px-6 lg:py-4">
        <button type="button" onClick={restart} aria-label={tx("از اول")} className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#172036] text-[#c9d0d9] transition hover:bg-[#1d2842]">
          <RotateCcw className="size-[18px]" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => goTo(0)} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-white text-[13px] font-extrabold text-[#0c1222] transition hover:bg-[#f5e6c6]">
          <PencilLine className="size-4" aria-hidden="true" />{" "}{tx("ویرایش انتخاب‌ها")}</button>
      </footer>
    </>
  );
};
