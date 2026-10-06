"use client";

import { ArrowLeft, ArrowRight, BarChart3, Check, Info, MessageSquareText, RotateCcw, Settings2, Target, Waypoints, Wrench, X, Gauge, Send, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";
import { Link } from "@/i18n/navigation";

import { PaymentOverlay } from "../order-wizard/payment-ui";
import { amountDue, formatToman, startPayment } from "../order-wizard/payments";
import { DraggableSheet } from "../order-wizard/sheet";
import { useIsSmallScreen } from "../order-wizard/use-small-screen";
import { ChatSim } from "./chat-sim";
import { aiEstimate, aiSteps, autonomyLevels, deliverables, fa, goals, impact, tools, type AiStepKey, type AiView } from "./config";
import { FlowCanvas } from "./flow-canvas";
import { ImpactBoard } from "./impact";
import { aiPanels } from "./steps";
import { useAi } from "./store";

const stepIcons: Record<AiStepKey, LucideIcon> = { goals: Target, tools: Wrench, volume: Gauge, brain: Settings2, outcome: Send };
const views: { value: AiView; label: string; short: string; icon: LucideIcon }[] = [
  { value: "flow", label: "نقشه کار", short: "نقشه", icon: Waypoints },
  { value: "chat", label: "گفتگوی نمونه", short: "گفتگو", icon: MessageSquareText },
  { value: "impact", label: "صرفه‌جویی", short: "صرفه‌جویی", icon: BarChart3 },
];

/** Builder for AI and automation projects: questions on one side, a living plan on the other. */
export const AiWizard = () => {
  useState0();
  const started = useAi((state) => state.started);
  const isSmall = useIsSmallScreen();

  // This screen behaves like an app: lock the page behind it.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div dir="rtl" className="fixed inset-0 z-[100] overflow-hidden bg-[#0b0d12] font-sans text-[#eef1f5] [color-scheme:dark]">
      <PaymentOverlay />
      {!started ? <Intro /> : isSmall ? <MobileStudio /> : <DesktopStudio />}
    </div>
  );
};

/** Fresh state on every visit. */
const useState0 = () => {
  useEffect(() => {
    useAi.getState().reset();
  }, []);
};

/* ------------------------------------------------------------------ */

const Intro = () => {
  const start = useAi((state) => state.start);
  const reduce = useReducedMotion();
  const rise = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const } });
  const points = [
    { icon: Waypoints, title: "نقشه زنده کار", text: "می‌بینید هر پیام و سند از کجا می‌آید و هوش مصنوعی با آن چه می‌کند." },
    { icon: MessageSquareText, title: "گفتگوی آزمایشی", text: "دستیار را با لحن دلخواهتان همین‌جا امتحان کنید." },
    { icon: BarChart3, title: "صرفه‌جویی واقعی", text: "ساعت و هزینه‌ای که آزاد می‌شود و زمان بازگشت سرمایه." },
  ];

  return (
    <div className="relative flex size-full flex-col overflow-y-auto bg-[radial-gradient(70%_55%_at_50%_10%,rgba(124,108,255,0.2),transparent_70%),radial-gradient(50%_40%_at_20%_90%,rgba(47,208,138,0.1),transparent_70%),#0b0d12]">
      <Link href="/" aria-label="خروج" className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-xl text-[#8a93a0] transition-colors hover:bg-white/6 hover:text-white">
        <X className="size-5" aria-hidden="true" />
      </Link>
      <div className="mx-auto flex w-full max-w-[880px] flex-1 flex-col items-center justify-center px-5 py-14 text-center">
        <KhayyamMark size={76} state="intro" />
        <motion.span {...rise(0.4)} className="mt-6 rounded-full bg-white/6 px-3 py-1 text-[12px] font-bold text-[#9ccbff] ring-1 ring-white/10">
          استودیو هوش مصنوعی و اتوماسیون
        </motion.span>
        <motion.h1 {...rise(0.5)} className="mt-4 text-[28px] font-extrabold leading-[1.45] text-white lg:text-[44px]">
          کارهای تکراری را به هوش مصنوعی بسپارید
        </motion.h1>
        <motion.p {...rise(0.6)} className="mt-3 max-w-[48ch] text-[14px] leading-7 text-[#a7b0bc] lg:text-[16px]">
          به چند سوال جواب دهید؛ نقشه اتوماسیون، دستیار نمونه و برآورد صرفه‌جویی کسب‌وکار خودتان را همین حالا ببینید.
        </motion.p>
        <div className="mt-10 grid w-full gap-3 text-right sm:grid-cols-3">
          {points.map((point, index) => (
            <motion.div key={point.title} {...rise(0.7 + index * 0.08)} className="rounded-[22px] bg-[#111419] p-5 ring-1 ring-white/8">
              <point.icon className="size-5 text-[#4da3ff]" aria-hidden="true" />
              <strong className="mt-3 block text-[15px] text-white">{point.title}</strong>
              <span className="mt-1.5 block text-[12.5px] leading-6 text-[#a7b0bc]">{point.text}</span>
            </motion.div>
          ))}
        </div>
        <motion.button
          {...rise(0.95)}
          type="button"
          onClick={start}
          className="mt-10 flex h-13 items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#4da3ff,#7c6cff)] px-8 text-[15px] font-extrabold text-white shadow-[0_14px_40px_-14px_rgba(77,163,255,0.9)] transition hover:brightness-110"
        >
          شروع کنیم <span className="text-[12px] font-bold opacity-80">· حدود ۲ دقیقه</span>
          <ArrowLeft className="size-4" aria-hidden="true" />
        </motion.button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */

const Canvas = ({ compact }: { compact: boolean }) => {
  const view = useAi((state) => state.view);
  const setView = useAi((state) => state.setView);
  const config = useAi((state) => state.config);
  const reduce = useReducedMotion();

  return (
    <div className="relative size-full overflow-hidden bg-[#0b0d12]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute left-[20%] top-[15%] h-[50%] w-[40%] rounded-full bg-[#4da3ff] opacity-20 blur-[120px]" />
        <span className="absolute bottom-0 right-[15%] h-[45%] w-[35%] rounded-full bg-[#7c6cff] opacity-20 blur-[120px]" />
        <span className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
      </div>

      <div role="tablist" aria-label="نمایش" className={`absolute z-10 flex gap-0.5 rounded-full bg-white/8 p-1 ring-1 ring-white/8 backdrop-blur ${compact ? "left-3 top-3" : "left-1/2 top-5 -translate-x-1/2"}`}>
        {views.map((option) => {
          const selected = view === option.value;
          return (
            <button key={option.value} type="button" role="tab" aria-selected={selected} onClick={() => setView(option.value)} className="relative flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#4da3ff]">
              {selected && <motion.span layoutId={`ai-view-${compact}`} className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", bounce: 0.15, duration: 0.35 }} />}
              <option.icon className={`relative size-4 ${selected ? "text-[#0b0d12]" : "text-[#8a93a0]"}`} aria-hidden="true" />
              <span className={`relative whitespace-nowrap ${selected ? "text-[#0b0d12]" : "text-[#c9d0d9]"}`}>{compact ? option.short : option.label}</span>
            </button>
          );
        })}
      </div>

      <div className={`absolute ${compact ? "inset-x-3 bottom-3 top-14" : "inset-x-10 bottom-14 top-20"}`}>
        <AnimatePresence mode="wait">
          <motion.div key={view} className="size-full" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            {view === "flow" && <FlowCanvas config={config} vertical={compact} />}
            {view === "chat" && <ChatSim config={config} />}
            {view === "impact" && (
              <div className="flex size-full items-center overflow-y-auto">
                <ImpactBoard config={config} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {!compact && (
        <p className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white/6 px-4 py-2 text-[11.5px] text-[#a7b0bc] ring-1 ring-white/8">
          <Info className="size-3.5 text-[#ffd88a]" aria-hidden="true" />
          این یک نقطه شروع است؛ هر مسیر، اتصال و رفتاری را طبق نیاز شما می‌سازیم.
        </p>
      )}
    </div>
  );
};

const StepBody = () => {
  const step = useAi((state) => state.step);
  const reduce = useReducedMotion();
  const isSmall = useIsSmallScreen();
  const current = aiSteps[step];
  const Panel = aiPanels[current.key];

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-3 lg:px-6 lg:pt-6 [scrollbar-width:thin]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={current.key} initial={reduce || isSmall ? false : { opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={reduce || isSmall ? undefined : { opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
          <span className="mb-1 hidden text-[11.5px] font-bold text-[#4da3ff] lg:block">
            مرحله {fa(step + 1)} از {fa(aiSteps.length)}
          </span>
          <h1 className="text-[16px] font-extrabold leading-[1.65] text-white lg:text-[20px]">{current.question}</h1>
          <p className="mt-1 hidden text-[12px] leading-6 text-[#8a93a0] lg:block">{current.hint}</p>
          <div className="mt-3 lg:mt-6">
            <Panel />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Footer = () => {
  const step = useAi((state) => state.step);
  const next = useAi((state) => state.next);
  const prev = useAi((state) => state.prev);
  const config = useAi((state) => state.config);
  const isLast = step === aiSteps.length - 1;
  const due = amountDue(config.plan, aiEstimate(config).min);

  return (
    <footer className="flex shrink-0 items-center gap-2 border-t border-white/6 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:px-6 lg:py-4">
      <button type="button" onClick={prev} disabled={step === 0} aria-label="قبلی" className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#171b22] text-[#c9d0d9] transition hover:bg-[#1d222b] disabled:opacity-30">
        <ArrowRight className="size-[18px]" aria-hidden="true" />
      </button>
      <button type="button" onClick={() => (isLast ? void startPayment(due).then((ok) => ok && next()) : next())} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#4da3ff,#7c6cff)] text-[13px] font-extrabold text-white shadow-[0_10px_30px_-12px_rgba(77,163,255,0.8)] transition hover:brightness-110 active:scale-[0.98]">
        {isLast ? `پرداخت ${formatToman(due)} و ثبت` : `بعدی: ${aiSteps[step + 1].title}`}
        {isLast ? <Check className="size-4" aria-hidden="true" /> : <ArrowLeft className="size-4" aria-hidden="true" />}
      </button>
    </footer>
  );
};

const Submitted = () => {
  const config = useAi((state) => state.config);
  const goTo = useAi((state) => state.goTo);
  const reset = useAi((state) => state.reset);
  const cost = aiEstimate(config);
  const result = impact(config);
  const rows: [string, ReactNode][] = [
    ["شروع با", deliverables.find((item) => item.value === config.deliverable)?.label],
    ["مسیر", config.plan === "consult" ? "اول مشاوره" : "شروع پروژه"],
    ["پرداخت‌شده", formatToman(amountDue(config.plan, cost.min))],
    ["برآورد", `${fa(cost.min)} تا ${fa(cost.max)} میلیون تومان · ${fa(cost.weeks)} هفته`],
    ["اهداف", goals.filter((goal) => config.goals.includes(goal.value)).map((goal) => goal.label).join("، ") || "—"],
    ["ابزارها", tools.filter((tool) => config.tools.includes(tool.value)).map((tool) => tool.label).join("، ") || "—"],
    ["اختیار هوش مصنوعی", autonomyLevels.find((level) => level.value === config.autonomy)?.label],
    ["داده‌ها", config.hosting === "onprem" ? "روی سرور خودتان" : "ابری امن"],
    ["صرفه‌جویی تخمینی", `${fa(result.hoursSaved)} ساعت و ${fa(result.monthlySaving)} میلیون تومان در ماه`],
  ];

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3 pt-4 lg:px-6 lg:pt-7">
        <div className="flex items-center gap-3">
          <KhayyamMark size={40} state="intro" />
          <h1 className="text-[18px] font-extrabold text-white lg:text-[20px]">درخواست شما ثبت شد</h1>
        </div>
        <p className="mt-2 text-[12px] leading-6 text-[#8a93a0]">کارشناس هوش مصنوعی ما با همین نقشه با شما تماس می‌گیرد تا فرایندها را دقیق‌تر بررسی کنیم.</p>
        <dl className="mt-4 divide-y divide-white/6 rounded-2xl bg-[#171b22]">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4 px-4 py-2.5 text-[12px]">
              <dt className="shrink-0 text-[#8a93a0]">{label}</dt>
              <dd className="text-left font-bold leading-5 text-[#eef1f5]">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 flex gap-2 rounded-2xl bg-[#3a2c10]/60 px-3.5 py-3 text-[11.5px] leading-6 text-[#f2cf8a]">
          <Info className="mt-1 size-3.5 shrink-0" aria-hidden="true" />
          همه این مقادیر طبق نیاز شما قابل تغییر است؛ هر مسیر یا اتصال تازه‌ای بخواهید اضافه می‌کنیم.
        </p>
      </div>
      <footer className="flex shrink-0 items-center gap-2 border-t border-white/6 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:px-6 lg:py-4">
        <button type="button" onClick={reset} aria-label="از اول" className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#171b22] text-[#c9d0d9] transition hover:bg-[#1d222b]">
          <RotateCcw className="size-[18px]" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => goTo(0)} className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-white text-[13px] font-extrabold text-[#0b0d12] transition hover:bg-[#d9ecff]">
          ویرایش انتخاب‌ها
        </button>
      </footer>
    </>
  );
};

/* ------------------------------------------------------------------ */

const DesktopStudio = () => {
  const step = useAi((state) => state.step);
  const submitted = useAi((state) => state.submitted);
  const goTo = useAi((state) => state.goTo);
  const company = useAi((state) => state.config.company);

  return (
    <div className="flex size-full flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/6 px-4">
        <KhayyamMark size={34} title="خیام" />
        <div className="leading-tight">
          <strong className="block text-[13px]">{company.trim() || "پروژه هوش مصنوعی"}</strong>
          <span className="text-[11px] text-[#8a93a0]">استودیو هوش مصنوعی و اتوماسیون · خیام</span>
        </div>
        <div className="ms-auto flex items-center gap-1">
          <Link href="/" aria-label="خروج" className="flex size-9 items-center justify-center rounded-xl text-[#8a93a0] transition-colors hover:bg-white/6 hover:text-white">
            <X className="size-[18px]" aria-hidden="true" />
          </Link>
          <button type="button" onClick={() => goTo(aiSteps.length - 1)} className="ms-2 flex h-9 items-center gap-2 rounded-xl bg-white px-4 text-[12.5px] font-extrabold text-[#0b0d12] transition-colors hover:bg-[#d9ecff]">
            <Check className="size-4" aria-hidden="true" /> ثبت درخواست
          </button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        <nav aria-label="مراحل" className="flex w-[76px] shrink-0 flex-col items-center gap-1 border-l border-white/6 py-3">
          {aiSteps.map((item, index) => {
            const Icon = stepIcons[item.key];
            const current = index === step && !submitted;
            const done = index < step || submitted;
            return (
              <button key={item.key} type="button" onClick={() => goTo(index)} aria-current={current ? "step" : undefined} className={`relative flex w-[64px] flex-col items-center gap-1 rounded-2xl py-2.5 transition-colors ${current ? "bg-[#4da3ff]/14 text-[#9ccbff]" : done ? "text-[#c9d0d9] hover:bg-white/5" : "text-[#5d6573] hover:bg-white/5 hover:text-[#c9d0d9]"}`}>
                <Icon className="size-[19px]" aria-hidden="true" />
                <span className="text-[10.5px] font-bold">{item.title}</span>
                {done && (
                  <span className="absolute left-2 top-2 flex size-3.5 items-center justify-center rounded-full bg-[#2fd08a] text-[#0b0d12]">
                    <Check className="size-2" strokeWidth={4} aria-hidden="true" />
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <aside className="flex w-[400px] shrink-0 flex-col border-l border-white/6 bg-[#111419]">
          {submitted ? (
            <Submitted />
          ) : (
            <>
              <StepBody />
              <Footer />
            </>
          )}
        </aside>
        <main className="relative min-w-0 flex-1">
          <Canvas compact={false} />
        </main>
      </div>
    </div>
  );
};

const MobileStudio = () => {
  const step = useAi((state) => state.step);
  const submitted = useAi((state) => state.submitted);
  const goTo = useAi((state) => state.goTo);

  return (
    <div className="flex size-full flex-col">
      <main className="relative min-h-0 flex-1">
        <Link href="/" aria-label="خروج" className="absolute right-3 top-3 z-20 flex size-8 items-center justify-center rounded-full bg-white/8 text-[#c9d0d9] ring-1 ring-white/8">
          <X className="size-4" aria-hidden="true" />
        </Link>
        <Canvas compact />
      </main>
      <DraggableSheet className="rounded-t-[24px] bg-[#111419] shadow-[0_-16px_40px_-12px_rgba(0,0,0,0.6)]">
        <div className="flex shrink-0 gap-1.5 overflow-x-auto px-4 pb-1 pt-1 [scrollbar-width:none]">
          {aiSteps.map((item, index) => (
            <button key={item.key} type="button" onClick={() => goTo(index)} aria-current={index === step && !submitted ? "step" : undefined} className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[11.5px] font-bold ${index === step && !submitted ? "bg-white text-[#0b0d12]" : index < step || submitted ? "bg-[#1d222b] text-[#c9d0d9]" : "bg-[#171b22] text-[#5d6573]"}`}>
              {index < step || submitted ? <Check className="size-3 text-[#2fd08a]" strokeWidth={3} aria-hidden="true" /> : <span className="text-[10px] opacity-70">{fa(index + 1)}</span>}
              {item.title}
            </button>
          ))}
        </div>
        {submitted ? (
          <Submitted />
        ) : (
          <>
            <StepBody />
            <Footer />
          </>
        )}
      </DraggableSheet>
    </div>
  );
};
