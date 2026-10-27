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
  { icon: TrendingUp, text: "فروش ۹۰ روز گذشته را خواندم؛ انار، آجیل و شیرینی پرفروش‌اند." },
  { icon: ImageIcon, text: "۸ تصویر برای پست و استوری ساختم." },
  { icon: Video, text: "۳ ویدیوی کوتاه برای ریلز ساختم." },
  { icon: FileText, text: "۱۲ فاکتور این هفته را خواندم و در حسابداری ثبت کردم." },
  { icon: Send, text: "کمپین را زمان‌بندی کردم و به پیام‌های مشتری‌ها جواب می‌دهم." },
];

// step index at which each output appears
const SHOW = { images: 2, videos: 3, invoice: 4, results: 6 } as const;
const LAST = 7;

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

const Panel = ({ show, title, count, children }: { show: boolean; title: string; count?: string; children: ReactNode }) => (
  <motion.section
    initial={false}
    animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 14, filter: "blur(6px)" }}
    transition={{ duration: 0.55, ease }}
    className="rounded-[20px] bg-[#0c1222] p-3.5 ring-1 ring-[#f2ecdf]/[0.07]"
  >
    <header className="mb-2.5 flex items-center justify-between text-[11.5px]">
      <span className="font-bold text-[#dcd6c9]">{title}</span>
      {count && <span className="text-[#7f889c]">{count}</span>}
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
            animate={at >= SHOW.results ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.45, ease }}
            className="mt-1 flex gap-2.5 rounded-[20px] rounded-br-md bg-[#d9a648]/[0.13] px-4 py-3 text-[13.5px] leading-7 text-[#f5e6c6] ring-1 ring-[#d9a648]/25"
          >
            <Sparkles className="mt-1.5 size-4 shrink-0 text-[#e9c27a]" aria-hidden="true" />
            همه آماده است. کاری که حدود ۴۰ ساعت از وقت تیم را می‌گرفت، ۱۲ دقیقه طول کشید. نتیجه هفته اول را کنارش می‌بینید.
          </motion.p>
        </div>

        {/* canvas */}
        <div className="grid content-start gap-3 bg-[#0f1628] p-5 lg:p-6">
          <Panel show={at >= SHOW.images} title="تصویرها" count="۸ عدد">
            <div className="grid grid-cols-4 gap-2 lg:grid-cols-8 lg:gap-1.5">
              {tiles.map((tile, index) => (
                <motion.span
                  key={tile}
                  initial={false}
                  animate={at >= SHOW.images ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.4, delay: at >= SHOW.images ? index * 0.06 : 0, ease }}
                  className={`relative aspect-square overflow-hidden rounded-[12px] bg-gradient-to-br ${tile}`}
                >
                  <span className="absolute -bottom-3 -left-3 size-10 rounded-full bg-white/15" aria-hidden="true" />
                  <span className="absolute right-2 top-2 h-1.5 w-1/2 rounded-full bg-white/40" aria-hidden="true" />
                  {index % 3 === 0 && <span className="absolute inset-x-2 bottom-2 h-1.5 rounded-full bg-white/30" aria-hidden="true" />}
                </motion.span>
              ))}
            </div>
          </Panel>

          <div className="grid grid-cols-[1.25fr_1fr] gap-3">
            <Panel show={at >= SHOW.videos} title="ویدیوها" count="۳ ریلز">
              <div className="grid grid-cols-3 gap-2">
                {["۰:۱۵", "۰:۲۲", "۰:۰۹"].map((time, index) => (
                  <span key={time} className={`relative flex aspect-[9/14] items-center justify-center overflow-hidden rounded-[12px] bg-gradient-to-b ${tiles[index * 2 + 1]}`}>
                    <span className="flex size-7 items-center justify-center rounded-full bg-black/35 backdrop-blur">
                      <Play className="size-3 fill-white text-white" aria-hidden="true" />
                    </span>
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-black/40 px-1 text-[9.5px] text-white">{time}</span>
                  </span>
                ))}
              </div>
            </Panel>

            <Panel show={at >= SHOW.invoice} title="فاکتورها" count="۱۲ ثبت شد">
              <div className="relative mx-auto h-[118px] w-[86px] rotate-[-4deg] overflow-hidden rounded-[8px] bg-[#e9e2d2] p-2.5 shadow-[0_14px_30px_-14px_rgba(0,0,0,0.9)]">
                <span className="block h-1.5 w-3/5 rounded-full bg-[#1c1406]/50" />
                {[0, 1, 2, 3].map((row) => (
                  <span key={row} className="mt-2.5 flex justify-between">
                    <span className="h-1 w-1/2 rounded-full bg-[#1c1406]/20" />
                    <span className="h-1 w-1/5 rounded-full bg-[#1c1406]/30" />
                  </span>
                ))}
                <span className="mt-3 block h-2 w-1/2 rounded-full bg-[#1c1406]/45" />
                {!reduce && at >= SHOW.invoice && (
                  <motion.span
                    className="absolute inset-x-0 h-6 bg-[linear-gradient(180deg,transparent,rgba(217,166,72,0.6),transparent)]"
                    animate={{ top: ["-15%", "100%"] }}
                    transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    aria-hidden="true"
                  />
                )}
                <span className="absolute bottom-1.5 left-1.5 flex size-5 items-center justify-center rounded-full bg-[#2fd08a] text-[#0c1222]">
                  <Check className="size-3" strokeWidth={3.4} aria-hidden="true" />
                </span>
              </div>
            </Panel>
          </div>

          <Panel show={at >= SHOW.results} title="نتیجه هفته اول کمپین">
            <dl className="grid grid-cols-3 gap-2 text-center">
              {[
                { value: "۱۸٬۴۰۰", label: "بازدید" },
                { value: "۳۴۰", label: "لید و پیام" },
                { value: "۶۲", label: "فروش" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col-reverse rounded-[14px] bg-[#f2ecdf]/[0.04] px-2 py-3">
                  <dt className="mt-1.5 text-[11.5px] text-[#9aa3b8]">{item.label}</dt>
                  <dd className="text-[22px] font-black leading-none text-[#e9c27a] lg:text-[26px]">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  );
};
