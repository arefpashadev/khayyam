"use client";

import { ArrowLeft, Check, Pencil } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

import { PlanChoice } from "../order-wizard/payment-ui";
import { amountDue, formatToman, startPayment } from "../order-wizard/payments";
import { aiEstimate, autonomyLevels, fa, goals, hourChoices, impact, personas, staffChoices, tools, type AiConfig } from "./config";
import { useAi } from "./store";

type Question = {
  key: string;
  ask: (config: AiConfig) => string;
  /** shown in the user's bubble once answered */
  said: (config: AiConfig) => string;
  input: () => ReactNode;
};

const chip = "h-10 rounded-full px-4 text-[12.5px] font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#4da3ff]";
const chipOff = "bg-[#171b22] text-[#c9d0d9] hover:bg-[#1d222b]";
const chipOn = "bg-[#4da3ff] text-white";

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

const MultiPick = ({ field, options }: { field: "goals" | "tools"; options: { value: string; label: string }[] }) => {
  const picked = useAi((state) => state.config[field]) as string[];
  const toggle = useAi((state) => state.toggle);
  const answer = useAi((state) => state.answer);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const on = picked.includes(option.value);
          return (
            <button key={option.value} type="button" aria-pressed={on} onClick={() => toggle(field, option.value)} className={`${chip} ${on ? chipOn : chipOff}`}>
              {on && <Check className="-ms-1 me-1 inline size-3.5" strokeWidth={3} aria-hidden="true" />}
              {option.label}
            </button>
          );
        })}
      </div>
      <button type="button" disabled={picked.length === 0} onClick={() => answer({})} className="flex h-11 w-fit items-center gap-2 rounded-2xl bg-white px-5 text-[13px] font-extrabold text-[#0b0d12] transition-colors hover:bg-[#d9ecff] disabled:opacity-30">
        تأیید {picked.length > 0 && `(${fa(picked.length)})`} <ArrowLeft className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
};

const SinglePick = <T extends string | number>({ options, onPick }: { options: { value: T; label: string; hint?: string }[]; onPick: (value: T) => void }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((option) => (
      <button key={String(option.value)} type="button" onClick={() => onPick(option.value)} className={`${chip} ${chipOff} ${option.hint ? "h-auto py-2.5 text-right" : ""}`}>
        <span className="block">{option.label}</span>
        {option.hint && <span className="block text-[11px] font-normal opacity-60">{option.hint}</span>}
      </button>
    ))}
  </div>
);

const Final = () => {
  const config = useAi((state) => state.config);
  const update = useAi((state) => state.update);
  const submit = useAi((state) => state.submit);
  const cost = aiEstimate(config);
  const result = impact(config);
  const due = amountDue(config.plan, cost.min);
  const field = "h-11 w-full rounded-2xl bg-[#171b22] px-4 text-[13px] text-white outline-none placeholder:text-[#5d6573] focus:ring-2 focus:ring-[#4da3ff]/50";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        {[
          [fa(result.hoursSaved), "ساعت آزاد در ماه"],
          [fa(result.monthlySaving), "میلیون صرفه‌جویی ماهانه"],
          [fa(result.paybackMonths), "ماه تا بازگشت سرمایه"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-2xl bg-[#171b22] p-3 text-center">
            <strong className="block text-[20px] font-black text-white">{value}</strong>
            <span className="text-[10.5px] leading-4 text-[#8a93a0]">{label}</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(77,163,255,0.16),rgba(124,108,255,0.12))] p-4 ring-1 ring-[#4da3ff]/25">
        <span className="text-[11.5px] font-bold text-[#9ccbff]">برآورد اولیه راه‌اندازی</span>
        <strong className="mt-1 block text-[22px] font-black text-white">
          {fa(cost.min)} تا {fa(cost.max)} <span className="text-[12px] font-normal text-[#a7b0bc]">میلیون تومان · {fa(cost.weeks)} هفته</span>
        </strong>
      </div>
      <PlanChoice plan={config.plan} estimateMin={cost.min} onChange={(plan) => update({ plan })} />
      <div className="grid gap-2 sm:grid-cols-2">
        <input value={config.company} onChange={(event) => update({ company: event.target.value })} placeholder="نام شرکت" aria-label="نام شرکت" className={field} />
        <input value={config.contactName} onChange={(event) => update({ contactName: event.target.value })} placeholder="نام شما" aria-label="نام شما" autoComplete="name" className={field} />
        <input value={config.contactPhone} onChange={(event) => update({ contactPhone: event.target.value })} placeholder="شماره تماس" aria-label="شماره تماس" inputMode="tel" autoComplete="tel" dir="ltr" className={`${field} text-left sm:col-span-2`} />
      </div>
      <button
        type="button"
        onClick={() => void startPayment(due).then((ok) => ok && submit())}
        className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#4da3ff,#7c6cff)] text-[14px] font-extrabold text-white shadow-[0_10px_30px_-12px_rgba(77,163,255,0.8)] transition hover:brightness-110"
      >
        <Check className="size-4" aria-hidden="true" /> پرداخت {formatToman(due)} و ثبت
      </button>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Script                                                              */
/* ------------------------------------------------------------------ */

const questions: Question[] = [
  {
    key: "goals",
    ask: () => "سلام! من خیام هستم 👋 چند سوال کوتاه می‌پرسم و همزمان نقشه هوش مصنوعی کسب‌وکارتان را می‌کشم. اول بگویید چه کارهایی را می‌خواهید هوشمند و خودکار کنید؟",
    said: (config) => goals.filter((goal) => config.goals.includes(goal.value)).map((goal) => goal.label).join("، "),
    input: () => <MultiPick field="goals" options={goals} />,
  },
  {
    key: "tools",
    ask: () => "عالی. این کارها الان از کجا شروع می‌شوند و نتیجه‌شان کجا ثبت می‌شود؟ به همین‌ها وصل می‌شویم؛ لازم نیست چیزی را عوض کنید.",
    said: (config) => tools.filter((tool) => config.tools.includes(tool.value)).map((tool) => tool.label).join("، "),
    input: () => <MultiPick field="tools" options={tools} />,
  },
  {
    key: "hours",
    ask: () => "این کارها هفته‌ای حدوداً چند ساعت وقت تیم را می‌گیرد؟",
    said: (config) => `حدود ${fa(config.hoursPerWeek)} ساعت در هفته`,
    input: () => <Answer>{(answer) => <SinglePick options={hourChoices.map((hours) => ({ value: hours, label: hours === 80 ? "۸۰+ ساعت" : `${fa(hours)} ساعت` }))} onPick={(hours) => answer({ hoursPerWeek: hours })} />}</Answer>,
  },
  {
    key: "staff",
    ask: () => "چند نفر درگیر این کارها هستند؟",
    said: (config) => `${fa(config.staff)} نفر`,
    input: () => <Answer>{(answer) => <SinglePick options={staffChoices.map((staff) => ({ value: staff, label: staff === 25 ? "۲۵+ نفر" : `${fa(staff)} نفر` }))} onPick={(staff) => answer({ staff })} />}</Answer>,
  },
  {
    key: "autonomy",
    ask: () => "هوش مصنوعی چقدر اختیار داشته باشد؟",
    said: (config) => autonomyLevels.find((level) => level.value === config.autonomy)?.label ?? "",
    input: () => <Answer>{(answer) => <SinglePick options={autonomyLevels.map((level) => ({ value: level.value, label: level.label, hint: level.description }))} onPick={(autonomy) => answer({ autonomy })} />}</Answer>,
  },
  {
    key: "hosting",
    ask: () => "داده‌ها کجا بماند؟",
    said: (config) => (config.hosting === "onprem" ? "روی سرور خودمان" : "ابری امن"),
    input: () => (
      <Answer>
        {(answer) => (
          <SinglePick
            options={[
              { value: "cloud" as const, label: "ابری امن", hint: "سریع‌تر و کم‌هزینه‌تر" },
              { value: "onprem" as const, label: "سرور خودمان", hint: "داده از سازمان بیرون نمی‌رود" },
            ]}
            onPick={(hosting) => answer({ hosting })}
          />
        )}
      </Answer>
    ),
  },
  {
    key: "persona",
    ask: () => "و آخر: دستیار با مشتری‌ها و همکارانتان با چه لحنی حرف بزند؟ (در تب «گفتگوی نمونه» امتحانش کنید)",
    said: (config) => personas.find((persona) => persona.value === config.persona)?.label ?? "",
    input: () => <Answer>{(answer) => <SinglePick options={personas} onPick={(persona) => answer({ persona })} />}</Answer>,
  },
  {
    key: "final",
    ask: (config) => `نقشه آماده است ✨ با ${fa(config.goals.length)} مسیر هوشمند، ماهانه حدود ${fa(impact(config).hoursSaved)} ساعت از وقت تیم آزاد می‌شود. طراحی و نقشه کامل جزو پروژه است؛ از کجا شروع کنیم؟`,
    said: () => "",
    input: () => <Final />,
  },
];

/** Passes the store's `answer` to inline pickers. */
const Answer = ({ children }: { children: (answer: (patch: Partial<AiConfig>) => void) => ReactNode }) => <>{children(useAi.getState().answer)}</>;

/* ------------------------------------------------------------------ */
/* Conversation                                                        */
/* ------------------------------------------------------------------ */

const Bot = ({ children }: { children: ReactNode }) => (
  <div className="flex items-start gap-2.5">
    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#111419] ring-1 ring-white/10">
      <KhayyamMark size={20} />
    </span>
    <div className="max-w-[88%] rounded-[20px] rounded-tr-md bg-[#151920] px-4 py-3 text-[13.5px] leading-7 text-[#e1e6ec] ring-1 ring-white/6">{children}</div>
  </div>
);

export const Interview = () => {
  const stage = useAi((state) => state.stage);
  const config = useAi((state) => state.config);
  const rewind = useAi((state) => state.rewind);
  const submitted = useAi((state) => state.submitted);
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const [typingFor, setTypingFor] = useState<number | null>(0);
  const current = questions[Math.min(stage, questions.length - 1)];

  // A short "thinking" beat before each new question, like a real conversation.
  useEffect(() => {
    const start = window.setTimeout(() => setTypingFor(stage), 0);
    const stop = window.setTimeout(() => setTypingFor(null), reduce ? 0 : 750);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(stop);
    };
  }, [stage, reduce]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [stage, typingFor, submitted, reduce]);

  const rise = reduce ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  return (
    <div ref={listRef} className="size-full overflow-y-auto overscroll-contain px-4 py-6 lg:px-8 [scrollbar-width:thin]">
      <div className="mx-auto flex max-w-[640px] flex-col gap-4">
        {questions.slice(0, stage).map((question, index) => (
          <div key={question.key} className="flex flex-col gap-3">
            <Bot>{question.ask(config)}</Bot>
            <motion.button {...rise} type="button" onClick={() => rewind(index)} className="group flex max-w-[85%] items-center gap-2 self-end rounded-[20px] rounded-tl-md bg-[#4da3ff] px-4 py-3 text-right text-[13.5px] leading-7 text-white" title="تغییر پاسخ">
              <span>{question.said(config)}</span>
              <Pencil className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-80" aria-hidden="true" />
            </motion.button>
          </div>
        ))}

        <AnimatePresence mode="wait">
          {typingFor === stage ? (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2.5 text-[12px] text-[#8a93a0]">
              <span className="flex size-8 items-center justify-center rounded-full bg-[#111419] ring-1 ring-white/10"><KhayyamMark size={20} state="thinking" /></span>
              در حال فکر کردن…
            </motion.div>
          ) : (
            <motion.div key={current.key} {...rise} className="flex flex-col gap-3">
              <Bot>{current.ask(config)}</Bot>
              {!submitted && <div className="ms-10">{current.input()}</div>}
              {submitted && (
                <Bot>
                  درخواست شما ثبت شد ✓ کارشناس ما با همین نقشه با شما تماس می‌گیرد تا جزئیات را دقیق کنیم. همه این مقادیر طبق نیاز شما قابل تغییر است.
                </Bot>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <p className="mt-2 text-center text-[11px] text-[#5d6573]">روی هر پاسخ آبی بزنید تا تغییرش دهید.</p>
      </div>
    </div>
  );
};

export const interviewLength = questions.length;
