"use client";

import { Check, FileText, Image as ImageIcon, Loader2, Play, RotateCcw, Send, Sparkles, TrendingUp, Video } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The landing's AI moment: one agent window. A manager gives one plain request; the agent
 * works through it out loud and its output (images, videos, filed invoices, results)
 * lands on the canvas beside the chat. An illustrative scenario, labelled as such.
 */

type Step = { icon: typeof Check; text: string };

const steps: Step[] = [
  { icon: TrendingUp, text: "فروش‌های اخیر را خواندم و پرفروش‌ها را پیدا کردم." },
  { icon: ImageIcon, text: "پست و استوری اینستاگرام ساختم." },
  { icon: Video, text: "ریلز اینستاگرام و ویدیوی تیک‌تاک ساختم." },
  { icon: FileText, text: "فاکتورهای این هفته را خواندم و در حسابداری ثبت کردم." },
  { icon: Send, text: "کمپین را زمان‌بندی کردم و به پیام مشتری‌ها جواب می‌دهم." },
];

// step index at which each output appears
const SHOW = { posts: 2, videos: 3, invoice: 4, replies: 5 } as const;
const LAST = 6;

const tiles = [
  "from-[#7a1f2b] to-[#c2410c]",
  "from-[#3b0d18] to-[#9f1239]",
  "from-[#b45309] to-[#f59e0b]",
  "from-[#4c1d24] to-[#be123c]",
  "from-[#78350f] to-[#d97706]",
  "from-[#831843] to-[#e11d48]",
  "from-[#451a03] to-[#a16207]",
  "from-[#5b0f1c] to-[#dc2626]",
];

const Panel = ({ show, title, children }: { show: boolean; title: string; children: ReactNode }) => (
  <motion.section
    initial={false}
    animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 14, filter: "blur(6px)" }}
    transition={{ duration: 0.55, ease }}
    className="rounded-[20px] bg-[#0c1222] p-3.5 ring-1 ring-[#f2ecdf]/[0.07]"
  >
    <header className="mb-2.5 flex items-center justify-between text-[11.5px]">
      <span className="font-bold text-[#dcd6c9]">{title}</span>
    </header>
    {children}
  </motion.section>
);

export const AgentDemo = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "-120px" });
  const [step, setStep] = useState(0);
  const at = reduce ? LAST : step;

  useEffect(() => {
    if (!visible || reduce || step >= LAST) return;
    const timer = window.setTimeout(() => setStep(step + 1), step === 0 ? 900 : 1300);
    return () => window.clearTimeout(timer);
  }, [visible, reduce, step]);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[32px] bg-[#121a2e] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] ring-1 ring-[#f2ecdf]/[0.08]">
      <span className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-[#d9a648] opacity-[0.09] blur-[110px]" aria-hidden="true" />

      {/* window bar */}
      <div className="relative flex items-center gap-3 border-b border-[#f2ecdf]/[0.07] px-5 py-3.5">
        <KhayyamMark size={24} state={at > 0 && at < LAST ? "thinking" : "still"} />
        <strong className="text-[13.5px]">ایجنت خیام</strong>
        <span className="flex items-center gap-1.5 text-[11.5px] text-[#7fd6a8]">
          <span className="size-1.5 rounded-full bg-[#2fd08a]" /> آنلاین
        </span>
        <span className="ms-auto text-[11px] text-[#7f889c]">یک سناریوی نمونه</span>
        {at >= LAST && !reduce && (
          <button type="button" onClick={() => setStep(0)} aria-label="دوباره ببینید" className="flex size-8 items-center justify-center rounded-full text-[#9aa3b8] transition-colors hover:bg-[#f2ecdf]/[0.07] hover:text-[#f2ecdf]">
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="relative grid lg:grid-cols-[0.95fr_1.05fr]">
        {/* chat */}
        <div className="flex flex-col gap-3 border-b border-[#f2ecdf]/[0.07] p-5 lg:border-b-0 lg:border-l lg:p-6">
          <p className="max-w-[92%] self-end rounded-[20px] rounded-bl-md bg-[#f2ecdf] px-4 py-3 text-[13.5px] font-medium leading-7 text-[#0c1222]">
            برای فروش ویژه یلدا یک کمپین اینستاگرام آماده کن. فاکتورهای این هفته را هم ثبت کن.
          </p>
          <ol className="mt-1 flex flex-col gap-2">
            {steps.map((item, index) => {
              const done = at > index + 1;
              const working = at === index + 1;
              return (
                <motion.li
                  key={item.text}
                  initial={false}
                  animate={at > index ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
                  transition={{ duration: 0.4, ease }}
                  className="flex items-start gap-3 rounded-[16px] px-3 py-2.5 text-[13px] leading-6 text-[#e4e1d8] odd:bg-[#f2ecdf]/[0.03]"
                >
                  <span className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${done ? "bg-[#2fd08a]/15 text-[#7fd6a8]" : "bg-[#d9a648]/15 text-[#e9c27a]"}`}>
                    {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : working ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : <item.icon className="size-3.5" aria-hidden="true" />}
                  </span>
                  {item.text}
                </motion.li>
              );
            })}
          </ol>
          <motion.p
            initial={false}
            animate={at >= LAST ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.45, ease }}
            className="mt-1 flex gap-2.5 rounded-[20px] rounded-br-md bg-[#d9a648]/[0.13] px-4 py-3 text-[13.5px] leading-7 text-[#f5e6c6] ring-1 ring-[#d9a648]/25"
          >
            <Sparkles className="mt-1.5 size-4 shrink-0 text-[#e9c27a]" aria-hidden="true" />
            همه آماده و منتشر شد. هر مشتری‌ای که پیام بدهد، جوابش را می‌دهم و سفارشش را ثبت می‌کنم.
          </motion.p>
        </div>

        {/* canvas */}
        <div className="grid content-start gap-3 bg-[#0f1628] p-5 lg:p-6">
          <Panel show={at >= SHOW.posts} title="محتوا">
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "پست اینستاگرام", tile: tiles[0], shape: "aspect-square", show: SHOW.posts },
                { label: "استوری", tile: tiles[2], shape: "aspect-[9/14]", show: SHOW.posts, },
                { label: "ریلز اینستاگرام", tile: tiles[5], shape: "aspect-[9/14]", show: SHOW.videos, video: true },
                { label: "ویدیو تیک‌تاک", tile: tiles[7], shape: "aspect-[9/14]", show: SHOW.videos, video: true },
              ].map((item) => (
                <motion.figure
                  key={item.label}
                  initial={false}
                  animate={at >= item.show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.45, ease }}
                  className="flex flex-col items-center gap-2"
                >
                  <span className={`relative flex w-full items-center justify-center self-end overflow-hidden rounded-[12px] bg-gradient-to-br ${item.tile} ${item.shape}`}>
                    <span className="absolute -bottom-3 -left-3 size-10 rounded-full bg-white/15" aria-hidden="true" />
                    <span className="absolute right-2 top-2 h-1.5 w-1/2 rounded-full bg-white/40" aria-hidden="true" />
                    {item.video && (
                      <span className="flex size-7 items-center justify-center rounded-full bg-black/35 backdrop-blur">
                        <Play className="size-3 fill-white text-white" aria-hidden="true" />
                      </span>
                    )}
                  </span>
                  <figcaption className="text-center text-[11px] leading-4 text-[#b9bfcc]">{item.label}</figcaption>
                </motion.figure>
              ))}
            </div>
          </Panel>

          <div className="grid grid-cols-2 gap-3">
            <Panel show={at >= SHOW.invoice} title="حسابداری">
              <div className="flex items-center gap-3">
                <div className="relative h-[92px] w-[68px] shrink-0 rotate-[-4deg] overflow-hidden rounded-[8px] bg-[#e9e2d2] p-2 shadow-[0_14px_30px_-14px_rgba(0,0,0,0.9)]">
                  <span className="block h-1.5 w-3/5 rounded-full bg-[#1c1406]/50" />
                  {[0, 1, 2].map((row) => (
                    <span key={row} className="mt-2 flex justify-between">
                      <span className="h-1 w-1/2 rounded-full bg-[#1c1406]/20" />
                      <span className="h-1 w-1/5 rounded-full bg-[#1c1406]/30" />
                    </span>
                  ))}
                  <span className="mt-2.5 block h-1.5 w-1/2 rounded-full bg-[#1c1406]/45" />
                  {!reduce && at >= SHOW.invoice && (
                    <motion.span
                      className="absolute inset-x-0 h-5 bg-[linear-gradient(180deg,transparent,rgba(217,166,72,0.6),transparent)]"
                      animate={{ top: ["-15%", "100%"] }}
                      transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#7fd6a8]">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> فاکتور ثبت شد
                </span>
              </div>
            </Panel>

            <Panel show={at >= SHOW.replies} title="پیام مشتری‌ها">
              <div className="flex flex-col gap-1.5 text-[11.5px] leading-5">
                <span className="self-end rounded-[12px] bg-[#f2ecdf]/[0.07] px-2.5 py-1.5 text-[#dcd6c9]">قیمت آجیل مخلوط چنده؟</span>
                <span className="self-start rounded-[12px] bg-[#d9a648]/[0.14] px-2.5 py-1.5 text-[#f5e6c6]">برایتان لینک سفارش فرستادم 🌙</span>
                <span className="mt-1 flex flex-wrap gap-1">
                  {["دایرکت", "واتساپ", "سایت"].map((channel) => (
                    <span key={channel} className="rounded-full bg-[#f2ecdf]/[0.06] px-2 py-0.5 text-[10.5px] text-[#9aa3b8]">{channel}</span>
                  ))}
                </span>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
};
