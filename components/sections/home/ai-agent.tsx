"use client";

import { ArrowUp, Check, Play, TriangleAlert } from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * "Your agent" at work, like a real command bar: a request is typed, the answer
 * arrives underneath, then the bar clears and the next request is typed. No tabs;
 * it just keeps working through different jobs.
 */

type Job = "marketing" | "accounts" | "support" | "report";
const jobs: Job[] = ["marketing", "accounts", "support", "report"];

type Phase = "typing" | "thinking" | "answer" | "erasing";

const Rise = ({ i, children, className }: { i: number; children: ReactNode; className?: string }) => (
  <motion.div initial={{ opacity: 0, y: 14, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.5, delay: 0.1 + i * 0.12, ease }} className={className}>
    {children}
  </motion.div>
);

const Media = ({ tone, video, label, tall }: { tone: string; video?: boolean; label: string; tall?: boolean }) => (
  <figure className="flex flex-col gap-2">
    <span className={`relative flex items-center justify-center overflow-hidden rounded-[16px] bg-gradient-to-br ${tone} ${tall ? "aspect-[9/14]" : "aspect-square"}`}>
      <span className="absolute -bottom-4 -start-4 size-14 rounded-full bg-white/15" aria-hidden="true" />
      <span className="absolute end-3 top-3 h-1.5 w-1/2 rounded-full bg-white/40" aria-hidden="true" />
      <span className="absolute bottom-4 end-3 h-1.5 w-1/3 rounded-full bg-white/25" aria-hidden="true" />
      {video && (
        <span className="flex size-9 items-center justify-center rounded-full bg-black/35 backdrop-blur">
          <Play className="size-3.5 fill-white text-white" aria-hidden="true" />
        </span>
      )}
    </span>
    <figcaption className="text-center text-[12px] text-[#b9bfcc]">{label}</figcaption>
  </figure>
);

const Answer = ({ job }: { job: Job }) => {
  const t = useTranslations(`Agent.${job}`);

  if (job === "marketing") {
    return (
      <div className="grid items-end gap-5 lg:grid-cols-[1fr_auto]">
        <div className="grid grid-cols-3 items-end gap-3">
          <Rise i={0}><Media tone="from-[#7a1f2b] to-[#c2410c]" label={t("r1")} /></Rise>
          <Rise i={1}><Media tone="from-[#831843] to-[#e11d48]" label={t("r2")} video tall /></Rise>
          <Rise i={2}><Media tone="from-[#b45309] to-[#f59e0b]" label={t("r3")} tall /></Rise>
        </div>
        <Rise i={3} className="flex items-center gap-2 rounded-full bg-[#2fd08a]/10 px-4 py-2 text-[12.5px] font-bold text-[#7fd6a8] ring-1 ring-[#2fd08a]/20 lg:mb-8">
          <Check className="size-4" strokeWidth={3} aria-hidden="true" /> {t("r4")}: {t("r4t")}
        </Rise>
      </div>
    );
  }

  if (job === "accounts") {
    const rows = ["a1", "a2", "a3", "a4"] as const;
    return (
      <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-start">
        <Rise i={0} className="flex justify-center">
          <span className="relative block h-[150px] w-[112px] rotate-[-4deg] overflow-hidden rounded-[10px] bg-[#e9e2d2] p-3 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)]">
            <span className="block h-2 w-3/5 rounded-full bg-[#1c1406]/50" />
            {[0, 1, 2, 3, 4].map((row) => (
              <span key={row} className="mt-3 flex justify-between">
                <span className="h-1.5 w-1/2 rounded-full bg-[#1c1406]/20" />
                <span className="h-1.5 w-1/5 rounded-full bg-[#1c1406]/30" />
              </span>
            ))}
            <motion.span
              className="absolute inset-x-0 h-7 bg-[linear-gradient(180deg,transparent,rgba(217,166,72,0.6),transparent)]"
              animate={{ top: ["-15%", "100%"] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              aria-hidden="true"
            />
          </span>
        </Rise>
        <div className="flex flex-col gap-2">
          {rows.map((row, index) => {
            const flagged = row === "a3";
            return (
              <Rise key={row} i={index + 1} className={`flex items-center gap-3 rounded-[14px] px-3.5 py-2.5 text-[13px] ring-1 ${flagged ? "bg-[#e5484d]/10 ring-[#e5484d]/30" : "bg-[#0c1222] ring-[#f2ecdf]/[0.07]"}`}>
                <span className="min-w-0 flex-1 truncate text-[#ece7dc]">{t(row)}</span>
                <span className="tabular-nums text-[#9aa3b8]">{t(`${row}v`)}</span>
                {flagged ? (
                  <span className="flex items-center gap-1 text-[11.5px] font-bold text-[#ff8a8e]">
                    <TriangleAlert className="size-3.5" aria-hidden="true" /> {t("flag")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11.5px] font-bold text-[#7fd6a8]">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> {t("ok")}
                  </span>
                )}
              </Rise>
            );
          })}
          <Rise i={5} className="mt-1 text-[12.5px] leading-6 text-[#b9bfcc]">
            {t("note")}
          </Rise>
        </div>
      </div>
    );
  }

  if (job === "support") {
    const threads = ["s1", "s2", "s3"] as const;
    return (
      <div className="grid gap-3 lg:grid-cols-3">
        {threads.map((thread, index) => (
          <Rise key={thread} i={index} className={`${index === 2 ? "hidden lg:flex" : "flex"} flex-col gap-2 rounded-[18px] bg-[#0c1222] p-3.5 ring-1 ring-[#f2ecdf]/[0.07]`}>
            <span className="text-[11px] font-bold text-[#7f889c]">{t(`${thread}c`)}</span>
            <span className="max-w-[92%] self-end rounded-[14px] bg-[#f2ecdf]/[0.08] px-3 py-2 text-[12.5px] leading-6 text-[#dcd6c9]">{t(`${thread}q`)}</span>
            <span className="max-w-[92%] self-start rounded-[14px] bg-[#d9a648]/[0.15] px-3 py-2 text-[12.5px] leading-6 text-[#f5e6c6]">{t(`${thread}a`)}</span>
            <span className="mt-auto flex items-center gap-1.5 pt-1 text-[11.5px] font-bold text-[#7fd6a8]">
              <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> {t(`${thread}d`)}
            </span>
          </Rise>
        ))}
      </div>
    );
  }

  const bars = [42, 38, 47, 40, 55, 92, 60];
  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-end">
      <Rise i={0} className="rounded-[18px] bg-[#0c1222] p-4 ring-1 ring-[#f2ecdf]/[0.07]">
        <span className="text-[11.5px] font-bold text-[#7f889c]">{t("chart")}</span>
        <div className="mt-3 flex h-[120px] items-end gap-2">
          {bars.map((value, index) => (
            <motion.span
              key={index}
              className={`flex-1 rounded-t-[6px] ${value > 80 ? "bg-[#d9a648]" : "bg-[#f2ecdf]/15"}`}
              initial={{ height: 4 }}
              animate={{ height: `${value}%` }}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.06, ease }}
            />
          ))}
        </div>
      </Rise>
      <div className="flex flex-col gap-2.5">
        <Rise i={1} className="rounded-[16px] bg-[#d9a648]/[0.13] px-4 py-3 text-[13px] leading-7 text-[#f5e6c6] ring-1 ring-[#d9a648]/25">
          {t("insight")}
        </Rise>
        <Rise i={2} className="flex items-center gap-2 text-[12.5px] font-bold text-[#7fd6a8]">
          <Check className="size-4" strokeWidth={3} aria-hidden="true" /> {t("done")}
        </Rise>
      </div>
    </div>
  );
};

export const AgentDemo = () => {
  const t = useTranslations("Agent");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "-120px" });
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const job = jobs[index];
  const request = t(`${job}.ask`);
  const shown = reduce ? request.length : typed;
  const showAnswer = reduce || phase === "answer";

  useEffect(() => {
    if (!visible || reduce) return;
    let timer: number;
    if (phase === "typing") {
      timer = window.setTimeout(() => (typed < request.length ? setTyped(typed + 1) : setPhase("thinking")), typed < request.length ? 34 : 400);
    } else if (phase === "thinking") {
      timer = window.setTimeout(() => setPhase("answer"), 900);
    } else if (phase === "answer") {
      timer = window.setTimeout(() => setPhase("erasing"), 6500);
    } else {
      timer = window.setTimeout(() => {
        if (typed > 0) setTyped(Math.max(0, typed - 4));
        else {
          setIndex((value) => (value + 1) % jobs.length);
          setPhase("typing");
        }
      }, 14);
    }
    return () => window.clearTimeout(timer);
  }, [visible, reduce, phase, typed, request.length]);

  return (
    <div ref={ref} className="relative mx-auto max-w-[920px]">
      {/* the command bar */}
      <div className="relative">
        <span className="pointer-events-none absolute -inset-6 rounded-full bg-[#d9a648] opacity-[0.08] blur-[60px]" aria-hidden="true" />
        <div className="relative flex min-h-[64px] items-center gap-3 rounded-[28px] bg-[#121a2e] py-3 pe-2.5 ps-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] ring-1 ring-[#d9a648]/30 lg:min-h-[72px] lg:ps-5">
          <KhayyamMark size={26} state={phase === "thinking" ? "thinking" : "still"} />
          <p className="min-w-0 flex-1 text-[14.5px] leading-7 text-[#f2ecdf] lg:text-[16px]" aria-live="polite">
            {shown === 0 && phase === "typing" ? <span className="text-[#6f788d]">{t("placeholder")}</span> : request.slice(0, shown)}
            {(phase === "typing" || phase === "erasing") && <span className="ms-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-pulse bg-[#e9c27a]" aria-hidden="true" />}
          </p>
          <span className={`flex size-11 shrink-0 items-center justify-center rounded-full transition-colors ${phase === "thinking" || phase === "answer" ? "bg-[#d9a648] text-[#1c1406]" : "bg-[#f2ecdf]/[0.08] text-[#9aa3b8]"}`} aria-hidden="true">
            <ArrowUp className="size-[18px]" strokeWidth={2.6} />
          </span>
        </div>
      </div>

      {/* the answer */}
      <div className="relative mt-6 min-h-[300px] lg:min-h-[250px]">
        <AnimatePresence mode="wait">
          {phase === "thinking" && (
            <motion.p key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 px-2 text-[13px] text-[#9aa3b8]">
              <KhayyamMark size={18} state="thinking" /> {t("working")}
            </motion.p>
          )}
          {showAnswer && (
            <motion.div key={job} initial={{ opacity: 1 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }} className="rounded-[28px] bg-[#121a2e] p-5 ring-1 ring-[#f2ecdf]/[0.07] lg:p-6">
              <p className="mb-5 flex items-center gap-2.5 text-[14px] font-bold text-[#ece7dc]">
                <span className="flex size-7 items-center justify-center rounded-full bg-[#0c1222] ring-1 ring-[#d9a648]/30">
                  <KhayyamMark size={15} />
                </span>
                {t(`${job}.reply`)}
              </p>
              <Answer job={job} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-4 text-center text-[11.5px] text-[#6f788d]">{t("sample")}</p>
    </div>
  );
};
