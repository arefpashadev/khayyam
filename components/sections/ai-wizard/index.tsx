"use client";

import { ArrowLeft, ArrowRight, BarChart3, BrainCircuit, Map, MessageSquareText, Sparkles, Waypoints, X, Zap, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";
import { Link } from "@/i18n/navigation";

import { PaymentOverlay } from "../order-wizard/payment-ui";
import { useIsSmallScreen } from "../order-wizard/use-small-screen";
import { ChatSim } from "./chat-sim";
import { fa, type AiView } from "./config";
import { CustomAi } from "./custom";
import { FlowCanvas } from "./flow-canvas";
import { ImpactBoard } from "./impact";
import { Interview, interviewLength } from "./interview";
import { useAi } from "./store";

const views: { value: AiView; label: string; icon: LucideIcon }[] = [
  { value: "flow", label: "نقشه", icon: Waypoints },
  { value: "chat", label: "گفتگوی نمونه", icon: MessageSquareText },
  { value: "impact", label: "صرفه‌جویی", icon: BarChart3 },
];

/**
 * AI & automation, built differently from the site/app studios: Khayyam interviews the
 * customer in a chat while a blueprint of their automation draws itself alongside.
 * Bespoke projects (factories, medical, …) get their own request page.
 */
export const AiWizard = () => {
  const mode = useAi((state) => state.mode);

  useEffect(() => {
    useAi.getState().reset();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div dir="rtl" className="fixed inset-0 z-[100] overflow-hidden bg-[#0b0d12] font-sans text-[#eef1f5] [color-scheme:dark]">
      <PaymentOverlay />
      {mode === "landing" ? <Landing /> : mode === "chat" ? <ChatLayout /> : <CustomLayout />}
    </div>
  );
};

/* ------------------------------------------------------------------ */

const Landing = () => {
  const setMode = useAi((state) => state.setMode);
  const reduce = useReducedMotion();
  const rise = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const } });
  const paths = [
    {
      mode: "chat" as const,
      icon: Zap,
      badge: "حدود ۲ دقیقه",
      title: "اتوماسیون و دستیار هوشمند",
      text: "پاسخ‌گویی به مشتری، گزارش خودکار، خواندن اسناد، گردش کار و… خیام چند سوال می‌پرسد و همزمان نقشه، دستیار نمونه و صرفه‌جویی شما را می‌سازد.",
      tone: "from-[#4da3ff] to-[#7c6cff]",
    },
    {
      mode: "custom" as const,
      icon: BrainCircuit,
      badge: "با مشاوره تخصصی",
      title: "هوش مصنوعی اختصاصی",
      text: "خط تولید کارخانه، تشخیص پزشکی، تحلیل مالی یا ایده‌ای بزرگ‌تر. مسئله‌تان را بگویید؛ با بررسی داده‌ها راه‌حلی می‌سازیم که واقعاً سود بسازد.",
      tone: "from-[#7c6cff] to-[#c06cff]",
    },
  ];

  return (
    <div className="relative flex size-full flex-col overflow-y-auto bg-[radial-gradient(70%_55%_at_50%_0%,rgba(124,108,255,0.22),transparent_70%),radial-gradient(45%_40%_at_15%_95%,rgba(47,208,138,0.1),transparent_70%),#0b0d12]">
      <Link href="/" aria-label="خروج" className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-xl text-[#8a93a0] transition-colors hover:bg-white/6 hover:text-white">
        <X className="size-5" aria-hidden="true" />
      </Link>
      <div className="mx-auto flex w-full max-w-[960px] flex-1 flex-col items-center justify-center px-5 py-14 text-center">
        <KhayyamMark size={76} state="intro" />
        <motion.h1 {...rise(0.4)} className="mt-6 text-[28px] font-extrabold leading-[1.45] text-white lg:text-[46px]">
          هوش مصنوعی، به اندازه کسب‌وکار شما
        </motion.h1>
        <motion.p {...rise(0.5)} className="mt-3 max-w-[50ch] text-[14px] leading-7 text-[#a7b0bc] lg:text-[16px]">
          کارهای تکراری را خودکار کنید، یا برای مسئله خاص سازمانتان هوش مصنوعی اختصاصی بسازید.
        </motion.p>
        <div className="mt-10 grid w-full gap-4 text-right lg:grid-cols-2">
          {paths.map((path, index) => (
            <motion.button
              key={path.mode}
              type="button"
              {...rise(0.6 + index * 0.1)}
              onClick={() => setMode(path.mode)}
              className="group relative overflow-hidden rounded-[30px] bg-[#111419] p-7 text-right ring-1 ring-white/8 outline-none transition hover:ring-white/20 focus-visible:ring-2 focus-visible:ring-[#4da3ff]"
            >
              <span className={`absolute -left-16 -top-16 size-56 rounded-full bg-gradient-to-br ${path.tone} opacity-20 blur-3xl transition-opacity group-hover:opacity-35`} />
              <div className="relative flex items-center gap-3">
                <span className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${path.tone} text-white`}>
                  <path.icon className="size-6" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-white/6 px-2.5 py-1 text-[11px] font-bold text-[#c9d0d9]">{path.badge}</span>
              </div>
              <strong className="relative mt-5 block text-[21px] text-white">{path.title}</strong>
              <span className="relative mt-2 block text-[13.5px] leading-7 text-[#a7b0bc]">{path.text}</span>
              <span className="relative mt-6 flex items-center gap-2 text-[13px] font-extrabold text-white">
                شروع <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */

const TopBar = ({ title, children }: { title: string; children?: React.ReactNode }) => {
  const setMode = useAi((state) => state.setMode);
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/6 px-3 lg:px-5">
      <button type="button" onClick={() => setMode("landing")} aria-label="برگشت" className="flex size-9 items-center justify-center rounded-xl text-[#c9d0d9] transition-colors hover:bg-white/6">
        <ArrowRight className="size-5" aria-hidden="true" />
      </button>
      <KhayyamMark size={30} title="خیام" />
      <strong className="truncate text-[13.5px]">{title}</strong>
      <div className="ms-auto flex items-center gap-2">{children}</div>
      <Link href="/" aria-label="خروج" className="flex size-9 items-center justify-center rounded-xl text-[#8a93a0] transition-colors hover:bg-white/6 hover:text-white">
        <X className="size-[18px]" aria-hidden="true" />
      </Link>
    </header>
  );
};

/** The living blueprint next to the conversation. */
const Blueprint = ({ compact }: { compact: boolean }) => {
  const view = useAi((state) => state.view);
  const setView = useAi((state) => state.setView);
  const config = useAi((state) => state.config);
  const reduce = useReducedMotion();

  return (
    <div className="relative size-full overflow-hidden bg-[#0b0d12]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute left-[15%] top-[10%] h-[50%] w-[45%] rounded-full bg-[#4da3ff] opacity-[0.16] blur-[120px]" />
        <span className="absolute bottom-0 right-[10%] h-[45%] w-[40%] rounded-full bg-[#7c6cff] opacity-[0.16] blur-[120px]" />
        <span className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>
      <div role="tablist" aria-label="نقشه" className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 gap-0.5 rounded-full bg-white/8 p-1 ring-1 ring-white/8 backdrop-blur">
        {views.map((option) => {
          const selected = view === option.value;
          return (
            <button key={option.value} type="button" role="tab" aria-selected={selected} onClick={() => setView(option.value)} className="relative flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[12px] font-bold">
              {selected && <motion.span layoutId={`bp-${compact}`} className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", bounce: 0.15, duration: 0.35 }} />}
              <option.icon className={`relative size-4 ${selected ? "text-[#0b0d12]" : "text-[#8a93a0]"}`} aria-hidden="true" />
              <span className={`relative ${selected ? "text-[#0b0d12]" : "text-[#c9d0d9]"}`}>{option.label}</span>
            </button>
          );
        })}
      </div>
      <div className={`absolute ${compact ? "inset-x-3 bottom-4 top-16" : "inset-x-8 bottom-10 top-20"}`}>
        <AnimatePresence mode="wait">
          <motion.div key={view} className="size-full" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: 0.25 }}>
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
    </div>
  );
};

const Progress = () => {
  const stage = useAi((state) => state.stage);
  const submitted = useAi((state) => state.submitted);
  const done = submitted ? interviewLength : Math.min(stage, interviewLength - 1);
  return (
    <span className="hidden items-center gap-2 text-[11.5px] text-[#8a93a0] sm:flex">
      نقشه {fa(Math.round((done / (interviewLength - 1)) * 100))}٪
      <span className="h-1.5 w-24 overflow-hidden rounded-full bg-white/8">
        <span className="block h-full rounded-full bg-[linear-gradient(90deg,#4da3ff,#7c6cff)] transition-all duration-500" style={{ width: `${(done / (interviewLength - 1)) * 100}%` }} />
      </span>
    </span>
  );
};

const ChatLayout = () => {
  const isSmall = useIsSmallScreen();
  const [blueprintOpen, setBlueprintOpen] = useState(false);
  const stage = useAi((state) => state.stage);

  return (
    <div className="flex size-full flex-col">
      <TopBar title="اتوماسیون و دستیار هوشمند">
        <Progress />
      </TopBar>
      <div className="flex min-h-0 flex-1">
        <section className={`relative flex min-h-0 flex-col ${isSmall ? "w-full" : "w-[min(560px,46%)] border-l border-white/6"} bg-[radial-gradient(80%_50%_at_50%_0%,rgba(77,163,255,0.08),transparent_70%)]`}>
          <Interview />
        </section>
        {!isSmall && (
          <main className="relative min-w-0 flex-1">
            <Blueprint compact={false} />
          </main>
        )}
      </div>

      {isSmall && (
        <>
          <motion.button
            key={stage}
            type="button"
            onClick={() => setBlueprintOpen(true)}
            initial={{ scale: 0.9 }}
            animate={{ scale: [1, 1.08, 1] }}
            className="absolute bottom-5 left-4 z-20 flex h-12 items-center gap-2 rounded-full bg-white px-4 text-[13px] font-extrabold text-[#0b0d12] shadow-[0_12px_40px_-10px_rgba(77,163,255,0.8)]"
          >
            <Map className="size-4" aria-hidden="true" /> نقشه زنده
            <Sparkles className="size-3.5 text-[#7c6cff]" aria-hidden="true" />
          </motion.button>
          <AnimatePresence>
            {blueprintOpen && (
              <motion.div className="fixed inset-0 z-[150] flex flex-col bg-[#0b0d12]" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
                <div className="flex h-12 shrink-0 items-center justify-between px-4">
                  <strong className="text-[14px]">نقشه زنده</strong>
                  <button type="button" onClick={() => setBlueprintOpen(false)} aria-label="بستن" className="flex size-9 items-center justify-center rounded-full bg-white/8">
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="relative min-h-0 flex-1">
                  <Blueprint compact />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

const CustomLayout = () => (
  <div className="flex size-full flex-col">
    <TopBar title="هوش مصنوعی اختصاصی" />
    <div className="relative min-h-0 flex-1 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(124,108,255,0.14),transparent_70%)]">
      <CustomAi />
    </div>
  </div>
);
