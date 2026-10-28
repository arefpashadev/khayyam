"use client";

import { ArrowUp, CalendarClock, Check, FileCheck2, MessageCircle, Play, Search, Send, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * "Your agent": one plain request typed into a command bar, then the finished work
 * lands as tiles under it. It cycles through three jobs (marketing, accounting,
 * customer messages); the suggestions under the bar switch between them.
 */

type Job = "marketing" | "accounts" | "support";
const jobs: Job[] = ["marketing", "accounts", "support"];

const Tile = ({ show, delay, children, label }: { show: boolean; delay: number; children: ReactNode; label: string }) => (
  <motion.figure
    initial={false}
    animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 14, filter: "blur(6px)" }}
    transition={{ duration: 0.5, delay: show ? delay : 0, ease }}
    className="flex flex-col gap-3 rounded-[22px] bg-[#0f1628] p-3 ring-1 ring-[#f2ecdf]/[0.07]"
  >
    <div className="relative h-[120px] overflow-hidden rounded-[16px] lg:h-[140px]">{children}</div>
    <figcaption className="flex items-center gap-1.5 px-1 pb-1 text-[12.5px] font-bold text-[#ece7dc]">
      <Check className="size-3.5 shrink-0 text-[#7fd6a8]" strokeWidth={3} aria-hidden="true" />
      {label}
    </figcaption>
  </motion.figure>
);

const Gradient = ({ tone, video }: { tone: string; video?: boolean }) => (
  <span className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${tone}`}>
    <span className="absolute -bottom-4 -start-4 size-14 rounded-full bg-white/15" aria-hidden="true" />
    <span className="absolute end-3 top-3 h-1.5 w-1/2 rounded-full bg-white/40" aria-hidden="true" />
    <span className="absolute bottom-4 end-3 h-1.5 w-1/3 rounded-full bg-white/25" aria-hidden="true" />
    {video && (
      <span className="flex size-9 items-center justify-center rounded-full bg-black/35 backdrop-blur">
        <Play className="size-3.5 fill-white text-white" aria-hidden="true" />
      </span>
    )}
  </span>
);

const Plain = ({ icon: Icon, children }: { icon: typeof Check; children: ReactNode }) => (
  <span className="absolute inset-0 flex flex-col justify-between bg-[#0c1222] p-3.5">
    <span className="flex size-9 items-center justify-center rounded-xl bg-[#d9a648]/15 text-[#e9c27a]">
      <Icon className="size-[18px]" aria-hidden="true" />
    </span>
    <span className="text-[12px] leading-5 text-[#b9bfcc]">{children}</span>
  </span>
);

const Invoice = ({ scan }: { scan: boolean }) => (
  <span className="absolute inset-0 flex items-center justify-center bg-[#0c1222]">
    <span className="relative h-[96px] w-[72px] rotate-[-4deg] overflow-hidden rounded-[8px] bg-[#e9e2d2] p-2.5 shadow-[0_14px_30px_-14px_rgba(0,0,0,0.9)]">
      <span className="block h-1.5 w-3/5 rounded-full bg-[#1c1406]/50" />
      {[0, 1, 2, 3].map((row) => (
        <span key={row} className="mt-2 flex justify-between">
          <span className="h-1 w-1/2 rounded-full bg-[#1c1406]/20" />
          <span className="h-1 w-1/5 rounded-full bg-[#1c1406]/30" />
        </span>
      ))}
      <span className="mt-2.5 block h-1.5 w-1/2 rounded-full bg-[#1c1406]/45" />
      {scan && (
        <motion.span
          className="absolute inset-x-0 h-5 bg-[linear-gradient(180deg,transparent,rgba(217,166,72,0.6),transparent)]"
          animate={{ top: ["-15%", "100%"] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          aria-hidden="true"
        />
      )}
    </span>
  </span>
);

const Chat = ({ t }: { t: (key: string) => string }) => (
  <span className="absolute inset-0 flex flex-col justify-center gap-1.5 bg-[#0c1222] p-3 text-[11.5px] leading-5">
    <span className="max-w-[90%] self-end rounded-[12px] bg-[#f2ecdf]/[0.08] px-2.5 py-1.5 text-[#dcd6c9]">{t("chatQ")}</span>
    <span className="max-w-[90%] self-start rounded-[12px] bg-[#d9a648]/[0.16] px-2.5 py-1.5 text-[#f5e6c6]">{t("chatA")}</span>
  </span>
);

export const AgentDemo = () => {
  const t = useTranslations("Agent");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "-120px" });
  const [job, setJob] = useState<Job>("marketing");
  const [typed, setTyped] = useState(0);
  const [held, setHeld] = useState(false);
  const request = t(`${job}.ask`);
  const shown = reduce ? request.length : typed;
  const done = shown >= request.length;

  // type the request, then hold the results for a while, then move to the next job
  useEffect(() => {
    if (!visible || reduce) return;
    if (!done) {
      const timer = window.setTimeout(() => setTyped((value) => value + 1), 32);
      return () => window.clearTimeout(timer);
    }
    if (held) return;
    const timer = window.setTimeout(() => {
      setJob((current) => jobs[(jobs.indexOf(current) + 1) % jobs.length]);
      setTyped(0);
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [visible, reduce, done, held, typed]);

  const choose = (next: Job) => {
    setJob(next);
    setTyped(0);
    setHeld(true);
  };

  const tiles: Record<Job, { label: string; visual: ReactNode }[]> = {
    marketing: [
      { label: t("marketing.r1"), visual: <Gradient tone="from-[#7a1f2b] to-[#c2410c]" /> },
      { label: t("marketing.r2"), visual: <Gradient tone="from-[#831843] to-[#e11d48]" video /> },
      { label: t("marketing.r3"), visual: <Gradient tone="from-[#b45309] to-[#f59e0b]" video /> },
      { label: t("marketing.r4"), visual: <Plain icon={CalendarClock}>{t("marketing.r4t")}</Plain> },
    ],
    accounts: [
      { label: t("accounts.r1"), visual: <Invoice scan={done} /> },
      { label: t("accounts.r2"), visual: <Plain icon={Search}>{t("accounts.r2t")}</Plain> },
      { label: t("accounts.r3"), visual: <Plain icon={FileCheck2}>{t("accounts.r3t")}</Plain> },
      { label: t("accounts.r4"), visual: <Plain icon={Send}>{t("accounts.r4t")}</Plain> },
    ],
    support: [
      { label: t("support.r1"), visual: <Chat t={(key) => t(`support.${key}`)} /> },
      { label: t("support.r2"), visual: <Plain icon={MessageCircle}>{t("support.r2t")}</Plain> },
      { label: t("support.r3"), visual: <Plain icon={FileCheck2}>{t("support.r3t")}</Plain> },
      { label: t("support.r4"), visual: <Plain icon={Sparkles}>{t("support.r4t")}</Plain> },
    ],
  };

  return (
    <div ref={ref} className="relative">
      {/* the command bar */}
      <div className="relative mx-auto max-w-[760px]">
        <span className="pointer-events-none absolute -inset-6 rounded-full bg-[#d9a648] opacity-[0.08] blur-[60px]" aria-hidden="true" />
        <div className="relative flex min-h-[64px] items-center gap-3 rounded-[28px] bg-[#121a2e] py-3 pe-2.5 ps-4 ring-1 ring-[#d9a648]/30 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] lg:min-h-[72px] lg:ps-5">
          <KhayyamMark size={26} state={done ? "still" : "thinking"} />
          <p className="min-w-0 flex-1 text-[14.5px] leading-7 text-[#f2ecdf] lg:text-[16px]" aria-live="polite">
            {request.slice(0, shown)}
            {!done && <span className="ms-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-pulse bg-[#e9c27a]" aria-hidden="true" />}
          </p>
          <span className={`flex size-11 shrink-0 items-center justify-center rounded-full transition-colors ${done ? "bg-[#d9a648] text-[#1c1406]" : "bg-[#f2ecdf]/[0.08] text-[#9aa3b8]"}`} aria-hidden="true">
            <ArrowUp className="size-[18px]" strokeWidth={2.6} />
          </span>
        </div>
        <div className="relative mt-4 flex flex-wrap justify-center gap-2">
          {jobs.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => choose(item)}
              aria-pressed={job === item}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition-colors ${job === item ? "bg-[#f2ecdf] text-[#0c1222]" : "bg-[#f2ecdf]/[0.06] text-[#b9bfcc] hover:bg-[#f2ecdf]/10"}`}
            >
              {t(`${item}.chip`)}
            </button>
          ))}
        </div>
      </div>

      {/* the finished work */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={job} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {tiles[job].map((tile, index) => (
            <Tile key={tile.label} show={done} delay={0.1 + index * 0.12} label={tile.label}>
              {tile.visual}
            </Tile>
          ))}
        </motion.div>
      </AnimatePresence>
      <p className="mt-5 text-center text-[11.5px] text-[#6f788d]">{t("sample")}</p>
    </div>
  );
};
