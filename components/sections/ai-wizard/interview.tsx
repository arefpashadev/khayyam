"use client";

import { tx } from "@/lib/tx";
import { ArrowLeft, BrainCircuit, Check, Pencil, Sparkles, UserRoundCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

import { useStickToBottom } from "../order-wizard/use-stick-bottom";
import { fa, goals, pains, personas, tools, type AiConfig, type GoalKey } from "./config";
import { useAi } from "./store";

type Question = {
  key: string;
  ask: (config: AiConfig) => ReactNode;
  /** the customer's answer, shown as their bubble */
  said: (config: AiConfig) => string;
  input: () => ReactNode;
};

const chip = "rounded-2xl text-start transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#d9a648]";
const chipOff = "bg-[#16203a] text-[#c9d0d9] ring-1 ring-white/6 hover:bg-[#1b2640]";
const chipOn = "bg-[#d9a648]/16 text-white ring-1 ring-[#d9a648]/60";

/**
 * The main action of a question. On phones it moves into the bottom action bar
 * (next to «نقشه زنده») so both buttons share one row, size and style.
 */
const Confirm = ({ count, onClick, label = tx("ادامه") }: { count?: number; onClick: () => void; label?: string }) => {
  const [bar, setBar] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const timeout = window.setTimeout(() => setBar(document.getElementById("ai-actions")), 0);
    return () => window.clearTimeout(timeout);
  }, []);
  const button = (
    <button
      type="button"
      disabled={count === 0}
      onClick={onClick}
      className={`flex h-12 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#f5d79c,#d9a648)] px-5 text-[13.5px] font-extrabold text-[#1c1406] transition hover:brightness-105 disabled:opacity-30 ${bar ? "w-full" : "mt-1 w-fit"}`}
    >
      {label} {count !== undefined && count > 0 && <span className="opacity-50">({fa(count)})</span>}
      <ArrowLeft className="size-4 ltr:-scale-x-100" aria-hidden="true" />
    </button>
  );
  return bar ? createPortal(button, bar) : button;
};

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

/** Teammates that fix the chosen pains, most-needed first, at most three. */
const suggestFor = (picked: string[]): GoalKey[] => {
  const score = new Map<GoalKey, number>();
  pains.filter((pain) => picked.includes(pain.value)).forEach((pain) => pain.suggests.forEach((goal, rank) => score.set(goal, (score.get(goal) ?? 0) + 3 - rank)));
  return [...score.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([goal]) => goal);
};

/** Why a teammate was suggested: the first pain it answers. */
const reasonFor = (goal: GoalKey, picked: string[]) => pains.find((pain) => picked.includes(pain.value) && pain.suggests.includes(goal))?.label;

const PainPick = () => {
  const picked = useAi((state) => state.config.pains);
  const setMode = useAi((state) => state.setMode);
  const update = useAi((state) => state.update);
  const answer = useAi((state) => state.answer);
  const toggle = (value: (typeof pains)[number]["value"]) => update({ pains: picked.includes(value) ? picked.filter((item) => item !== value) : [...picked, value] });

  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-2 sm:grid-cols-2">
        {pains.map((pain) => {
          const on = picked.includes(pain.value);
          return (
            <button key={pain.value} type="button" aria-pressed={on} onClick={() => toggle(pain.value)} className={`${chip} flex items-center gap-2.5 px-3.5 py-3 text-[13px] font-bold ${on ? chipOn : chipOff}`}>
              <span className={`flex size-5 shrink-0 items-center justify-center rounded-md ${on ? "bg-[#d9a648] text-[#1c1406]" : "ring-1 ring-white/20"}`}>{on && <Check className="size-3" strokeWidth={3} aria-hidden="true" />}</span>
              {pain.label}
            </button>
          );
        })}
      </div>
      <button type="button" onClick={() => setMode("custom")} className={`${chip} ${chipOff} flex items-center gap-2.5 border border-dashed border-white/15 px-3.5 py-3 text-[13px] font-bold ring-0`}>
        <BrainCircuit className="size-4 shrink-0 text-[#f3d9a4]" aria-hidden="true" />{tx("نیاز ما خاص است؛ مثلاً خط تولید، پزشکی یا مالی")}</button>
      <Confirm
        count={picked.length}
        onClick={() => {
          // pre-pick the teammates that fix these pains; the customer can still change them
          // keep teammates already added from a written message
          answer({ goals: [...new Set([...useAi.getState().config.goals, ...suggestFor(picked)])] });
        }}
      />
    </div>
  );
};

const TeamPick = () => {
  const config = useAi((state) => state.config);
  const toggle = useAi((state) => state.toggle);
  const answer = useAi((state) => state.answer);
  const suggested = new Set(suggestFor(config.pains));

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        {goals.map((goal) => {
          const on = config.goals.includes(goal.value);
          return (
            <button key={goal.value} type="button" aria-pressed={on} onClick={() => toggle("goals", goal.value)} className={`${chip} relative flex flex-col gap-2 p-3 ${on ? chipOn : chipOff}`}>
              <span className={`flex size-9 items-center justify-center rounded-xl ${on ? "bg-[linear-gradient(135deg,#f5d79c,#d9a648)] text-[#1c1406]" : "bg-white/6"}`}>
                <goal.icon className="size-[18px]" aria-hidden="true" />
              </span>
              <strong className="text-[12.5px] leading-5 text-white">{goal.label}</strong>
              <span className="text-[11px] leading-[1.6] opacity-60">{goal.description}</span>
              {suggested.has(goal.value) && (
                <span className="mt-auto flex items-start gap-1 border-t border-white/8 pt-2 text-[10.5px] leading-[1.6] text-[#e9c27a]">
                  <Sparkles className="mt-0.5 size-3 shrink-0" aria-hidden="true" />{tx("برای «{0}»", [reasonFor(goal.value, config.pains)])}</span>
              )}
            </button>
          );
        })}
      </div>
      <Confirm count={config.goals.length} onClick={() => answer({})} />
    </div>
  );
};

const ToolPick = () => {
  const picked = useAi((state) => state.config.tools);
  const toggle = useAi((state) => state.toggle);
  const answer = useAi((state) => state.answer);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => {
          const on = picked.includes(tool.value);
          return (
            <button key={tool.value} type="button" aria-pressed={on} onClick={() => toggle("tools", tool.value)} className={`${chip} flex h-10 items-center gap-2 rounded-full px-3.5 text-[12.5px] font-bold ${on ? chipOn : chipOff}`}>
              <tool.icon className="size-4" style={{ color: tool.color }} aria-hidden="true" />
              {tool.label}
            </button>
          );
        })}
      </div>
      <Confirm count={picked.length} onClick={() => answer({})} />
    </div>
  );
};

const Choices = <T extends string | number>({ options, onPick }: { options: { value: T; label: string; hint?: string }[]; onPick: (value: T) => void }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((option) => (
      <button key={String(option.value)} type="button" onClick={() => onPick(option.value)} className={`${chip} ${chipOff} px-4 py-2.5`}>
        <span className="block text-[13px] font-bold">{option.label}</span>
        {option.hint && <span className="mt-0.5 block text-[11px] opacity-60">{option.hint}</span>}
      </button>
    ))}
  </div>
);

/** Passes the store's `answer` to inline pickers. */
const Answer = ({ children }: { children: (answer: (patch: Partial<AiConfig>) => void) => ReactNode }) => <>{children(useAi.getState().answer)}</>;

/** Last step: a short summary and the door to the full proposal screen. */
const ShowProposal = () => {
  const config = useAi((state) => state.config);
  const setProposal = useAi((state) => state.setProposal);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-white/6 px-3 py-1.5 text-[12px] font-bold text-white">{tx("{0} هم‌تیمی هوش مصنوعی", [fa(config.goals.length)])}</span>
        <span className="rounded-full bg-white/6 px-3 py-1.5 text-[12px] font-bold text-white">{tx("۲۴ ساعته")}</span>
      </div>
      <Confirm label={tx("دیدن پیشنهاد کامل")} onClick={() => setProposal(true)} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Script                                                              */
/* ------------------------------------------------------------------ */

const questions: Question[] = [
  {
    key: "pains",
    ask: () => tx("سلام، من خیام هستم 👋 بیایید با هم یک تیم هوش مصنوعی برای کسب‌وکارتان بچینیم. اول بگویید الان چه چیزی بیشتر اذیتتان می‌کند؟"),
    said: (config) => pains.filter((pain) => config.pains.includes(pain.value)).map((pain) => pain.label).join(tx("، ")),
    input: () => <PainPick />,
  },
  {
    key: "team",
    ask: () => tx("متوجه شدم. بر اساس همین‌ها، مهم‌ترین هم‌تیمی‌هایی که لازم دارید را انتخاب کرده‌ام و نوشته‌ام هر کدام برای کدام مشکل است. هر کدام را خواستید اضافه یا کم کنید."),
    said: (config) => goals.filter((goal) => config.goals.includes(goal.value)).map((goal) => goal.label).join(tx("، ")),
    input: () => <TeamPick />,
  },
  {
    key: "tools",
    ask: () => tx("این هم‌تیمی‌ها کجا کار کنند؟ ابزارهایی را که الان دارید انتخاب کنید؛ به همین‌ها وصلشان می‌کنیم و لازم نیست چیزی را عوض کنید."),
    said: (config) => tools.filter((tool) => config.tools.includes(tool.value)).map((tool) => tool.label).join(tx("، ")),
    input: () => <ToolPick />,
  },
  {
    key: "persona",
    ask: () => tx("و آخرین سوال: اگر این هم‌تیمی جدید یک آدم بود، با مشتری‌ها چطور حرف می‌زد؟"),
    said: (config) => personas.find((persona) => persona.value === config.persona)?.label ?? "",
    input: () => (
      <Answer>
        {(answer) => (
          <Choices
            options={[
              { value: "friendly" as const, label: tx("صمیمی"), hint: tx("«سلام! 😊 الان برایتان پیدا می‌کنم»") },
              { value: "formal" as const, label: tx("رسمی"), hint: tx("«سلام. درخواست شما ثبت شد.»") },
              { value: "expert" as const, label: tx("متخصص و دقیق"), hint: tx("«سفارش ۱۰۴۲، تحویل ۱۷:۳۰»") },
            ]}
            onPick={(persona) => answer({ persona })}
          />
        )}
      </Answer>
    ),
  },
  {
    key: "final",
    ask: () => tx("پیشنهادم آماده است ✨ تیم، اثرش بر کار شما و راه شروع را در یک صفحه برایتان چیده‌ام."),
    said: () => "",
    input: () => <ShowProposal />,
  },
];

export const interviewLength = questions.length;

/* ------------------------------------------------------------------ */
/* Conversation                                                        */
/* ------------------------------------------------------------------ */

const Bot = ({ children }: { children: ReactNode }) => (
  <div className="flex items-start gap-2.5">
    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#121a2e] ring-1 ring-white/10">
      <KhayyamMark size={20} />
    </span>
    <div className="max-w-[88%] rounded-[20px] rounded-ss-md bg-[#16203a] px-4 py-3 text-[13.5px] leading-7 text-[#e1e6ec] ring-1 ring-white/6">{children}</div>
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
    const stop = window.setTimeout(() => setTypingFor(null), reduce ? 0 : 700);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(stop);
    };
  }, [stage, reduce]);

  // Reaching the end opens the proposal screen by itself, once.
  const setProposal = useAi((state) => state.setProposal);
  const isFinal = stage === questions.length - 1;
  const proposalShown = useAi((state) => state.proposalShown);
  useEffect(() => {
    if (!isFinal || submitted || proposalShown) return;
    const timeout = window.setTimeout(() => setProposal(true), reduce ? 300 : 1600);
    return () => window.clearTimeout(timeout);
  }, [isFinal, submitted, proposalShown, reduce, setProposal]);

  // New messages always come into view without the customer scrolling.
  useStickToBottom(listRef);

  const rise = reduce ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  return (
    <div ref={listRef} data-guide="interview" className="size-full overflow-y-auto overscroll-contain px-4 py-6 lg:px-8 [scrollbar-width:thin]">
      <div className="mx-auto flex max-w-[640px] flex-col gap-4 pb-6">
        {questions.slice(0, stage).map((question, index) => (
          <div key={question.key} className="flex flex-col gap-3">
            <Bot>{question.ask(config)}</Bot>
            <motion.button {...rise} type="button" onClick={() => rewind(index)} className="group flex max-w-[85%] items-center gap-2 self-end rounded-[20px] rounded-se-md bg-[#1d2842] px-4 py-3 text-start text-[13.5px] leading-7 text-white ring-1 ring-white/[0.06]" title={tx("تغییر پاسخ")}>
              <span>{question.said(config)}</span>
              <Pencil className="size-3.5 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            </motion.button>
          </div>
        ))}

        <AnimatePresence mode="wait">
          {typingFor === stage ? (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2.5 text-[12px] text-[#9aa3b8]">
              <span className="flex size-8 items-center justify-center rounded-full bg-[#121a2e] ring-1 ring-white/10">
                <KhayyamMark size={20} state="thinking" />
              </span>{tx("در حال فکر کردن…")}</motion.div>
          ) : (
            <motion.div key={current.key} {...rise} data-chat-anchor className="flex flex-col gap-3">
              <Bot>{current.ask(config)}</Bot>
              {!submitted && (
                <div data-guide="answers" className="ms-10">
                  {current.input()}
                </div>
              )}
              {submitted && (
                <Bot>
                  <span className="flex items-center gap-2">
                    <UserRoundCheck className="size-4 text-[#2fd08a]" aria-hidden="true" />{" "}{tx("درخواست شما ثبت شد.")}</span>{tx("کارشناس ما با همین نقشه با شما تماس می‌گیرد تا جزئیات را دقیق کنیم. همه این مقادیر طبق نیاز شما قابل تغییر است.")}</Bot>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {stage > 0 && !submitted && <p className="text-center text-[11px] text-[#6f788d]">{tx("برای تغییر هر پاسخ، رویش بزنید.")}</p>}
      </div>
    </div>
  );
};
