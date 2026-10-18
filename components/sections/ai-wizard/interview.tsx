"use client";

import { ArrowLeft, Check, Clock3, Moon, Pencil, TrendingDown, UserRoundCheck, Users } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

import { PlanChoice } from "../order-wizard/payment-ui";
import { amountDue, formatToman, startPayment } from "../order-wizard/payments";
import { useStickToBottom } from "../order-wizard/use-stick-bottom";
import { aiEstimate, autonomyLevels, fa, goals, impact, pains, personas, shareChoices, staffChoices, tools, type AiConfig, type GoalKey } from "./config";
import { useAi } from "./store";

type Question = {
  key: string;
  ask: (config: AiConfig) => ReactNode;
  /** the customer's answer, shown as their bubble */
  said: (config: AiConfig) => string;
  input: () => ReactNode;
};

const chip = "rounded-2xl text-right transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#4da3ff]";
const chipOff = "bg-[#151920] text-[#c9d0d9] ring-1 ring-white/6 hover:bg-[#1b2029]";
const chipOn = "bg-[#4da3ff]/16 text-white ring-1 ring-[#4da3ff]/60";

const Confirm = ({ count, onClick }: { count: number; onClick: () => void }) => (
  <button type="button" disabled={count === 0} onClick={onClick} className="mt-1 flex h-11 w-fit items-center gap-2 rounded-2xl bg-white px-5 text-[13px] font-extrabold text-[#0b0d12] transition-colors hover:bg-[#d9ecff] disabled:opacity-30">
    ادامه {count > 0 && <span className="opacity-60">({fa(count)})</span>}
    <ArrowLeft className="size-4" aria-hidden="true" />
  </button>
);

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

const PainPick = () => {
  const picked = useAi((state) => state.config.pains);
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
              <span className={`flex size-5 shrink-0 items-center justify-center rounded-md ${on ? "bg-[#4da3ff] text-white" : "ring-1 ring-white/20"}`}>{on && <Check className="size-3" strokeWidth={3} aria-hidden="true" />}</span>
              {pain.label}
            </button>
          );
        })}
      </div>
      <Confirm
        count={picked.length}
        onClick={() => {
          // pre-pick the teammates that fix these pains; the customer can still change them
          const suggested = [...new Set(pains.filter((pain) => picked.includes(pain.value)).flatMap((pain) => pain.suggests))] as GoalKey[];
          answer({ goals: suggested });
        }}
      />
    </div>
  );
};

const TeamPick = () => {
  const config = useAi((state) => state.config);
  const toggle = useAi((state) => state.toggle);
  const answer = useAi((state) => state.answer);
  const suggested = new Set(pains.filter((pain) => config.pains.includes(pain.value)).flatMap((pain) => pain.suggests));

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        {goals.map((goal) => {
          const on = config.goals.includes(goal.value);
          return (
            <button key={goal.value} type="button" aria-pressed={on} onClick={() => toggle("goals", goal.value)} className={`${chip} relative flex flex-col gap-2 p-3 ${on ? chipOn : chipOff}`}>
              <span className={`flex size-9 items-center justify-center rounded-xl ${on ? "bg-[linear-gradient(135deg,#4da3ff,#7c6cff)] text-white" : "bg-white/6"}`}>
                <goal.icon className="size-[18px]" aria-hidden="true" />
              </span>
              <strong className="text-[12.5px] leading-5 text-white">{goal.label}</strong>
              <span className="text-[11px] leading-[1.6] opacity-60">{goal.description}</span>
              {suggested.has(goal.value) && <span className="absolute left-2.5 top-2.5 rounded-full bg-[#f0b44a]/15 px-2 py-0.5 text-[10px] font-bold text-[#f2cf8a]">پیشنهاد</span>}
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

/* ------------------------------------------------------------------ */
/* Final: the AI team, what changes, and how to start                  */
/* ------------------------------------------------------------------ */

const TeamCard = () => {
  const config = useAi((state) => state.config);
  const update = useAi((state) => state.update);
  const submit = useAi((state) => state.submit);
  const cost = aiEstimate(config);
  const result = impact(config);
  const due = amountDue(config.plan, cost.min);
  const team = goals.filter((goal) => config.goals.includes(goal.value));
  const fixes = pains.filter((pain) => config.pains.includes(pain.value));
  const field = "h-11 w-full rounded-2xl bg-[#171b22] px-4 text-[13px] text-white outline-none placeholder:text-[#5d6573] focus:ring-2 focus:ring-[#4da3ff]/50";

  return (
    <div className="flex flex-col gap-4">
      {/* the team */}
      <div className="overflow-hidden rounded-[24px] bg-[#111419] ring-1 ring-white/8">
        <div className="relative px-5 pb-4 pt-5" style={{ background: "radial-gradient(90% 120% at 100% 0%, rgba(124,108,255,0.25), transparent 60%)" }}>
          <span className="text-[11.5px] font-bold text-[#c4bbff]">تیم هوش مصنوعی {config.company.trim() || "شما"}</span>
          <strong className="mt-1 block text-[22px] font-black leading-[1.5] text-white">
            {result.fte >= 1 ? `کار ${fa(result.fte)} نفر را تمام‌وقت انجام می‌دهد` : `ماهی ${fa(result.hoursSaved)} ساعت کار را برمی‌دارد`}
          </strong>
          <span className="text-[12.5px] text-[#a7b0bc]">بی‌وقفه، ۲۴ ساعت و ۷ روز هفته، بدون نیاز به استخدام تازه</span>
        </div>
        <div className="flex flex-wrap gap-2 px-5 pb-5">
          {team.map((member, index) => (
            <motion.span key={member.value} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.08 }} className="flex items-center gap-2 rounded-full bg-white/6 py-1.5 pe-3 ps-1.5 text-[12px] font-bold text-white">
              <span className="flex size-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#4da3ff,#7c6cff)]">
                <member.icon className="size-3.5" aria-hidden="true" />
              </span>
              {member.label}
            </motion.span>
          ))}
        </div>
      </div>

      {/* what changes */}
      <div className="grid gap-2 sm:grid-cols-2">
        {[
          { icon: Clock3, value: result.responseAfter, text: `پاسخ به مشتری؛ الان ${result.responseBefore}` },
          { icon: Moon, value: "ساعت ۳ بامداد", text: "هم مثل ساعت ۱۰ صبح جواب می‌دهد" },
          { icon: TrendingDown, value: `${fa(result.monthlySaving)} میلیون`, text: "تومان کمتر هزینه نیرو در ماه" },
          { icon: Users, value: `${fa(result.paybackMonths)} ماه`, text: "تا برگشت کامل هزینه راه‌اندازی" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-3 rounded-2xl bg-[#151920] p-3.5 ring-1 ring-white/6">
            <item.icon className="size-5 shrink-0 text-[#4da3ff]" aria-hidden="true" />
            <span>
              <strong className="block text-[15px] text-white">{item.value}</strong>
              <span className="text-[11.5px] text-[#8a93a0]">{item.text}</span>
            </span>
          </div>
        ))}
      </div>

      {fixes.length > 0 && (
        <ul className="flex flex-col gap-1.5 rounded-2xl bg-[#2fd08a]/8 p-4 ring-1 ring-[#2fd08a]/20">
          {fixes.map((pain) => (
            <li key={pain.value} className="flex items-center gap-2 text-[13px] text-[#c8f5df]">
              <Check className="size-4 shrink-0 text-[#2fd08a]" strokeWidth={3} aria-hidden="true" />
              {pain.fix}
            </li>
          ))}
        </ul>
      )}

      {/* start */}
      <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(77,163,255,0.14),rgba(124,108,255,0.1))] p-4 ring-1 ring-[#4da3ff]/25">
        <span className="text-[11.5px] font-bold text-[#9ccbff]">برآورد اولیه راه‌اندازی</span>
        <strong className="mt-1 block text-[20px] font-black text-white">
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
    key: "pains",
    ask: () => "سلام، من خیام هستم 👋 بیایید با هم یک تیم هوش مصنوعی برای کسب‌وکارتان بچینیم. اول بگویید الان چه چیزی بیشتر اذیتتان می‌کند؟",
    said: (config) => pains.filter((pain) => config.pains.includes(pain.value)).map((pain) => pain.label).join("، "),
    input: () => <PainPick />,
  },
  {
    key: "team",
    ask: () => "متوجه شدم. این‌ها هم‌تیمی‌هایی هستند که می‌توانید استخدام کنید؛ آن‌هایی که با دردسرهایتان جور است را علامت زده‌ام. هر کدام را خواستید اضافه یا کم کنید.",
    said: (config) => goals.filter((goal) => config.goals.includes(goal.value)).map((goal) => goal.label).join("، "),
    input: () => <TeamPick />,
  },
  {
    key: "tools",
    ask: () => "این هم‌تیمی‌ها کجا کار کنند؟ ابزارهایی را که الان دارید انتخاب کنید؛ به همین‌ها وصلشان می‌کنیم و لازم نیست چیزی را عوض کنید.",
    said: (config) => tools.filter((tool) => config.tools.includes(tool.value)).map((tool) => tool.label).join("، "),
    input: () => <ToolPick />,
  },
  {
    key: "staff",
    ask: () => "الان چند نفر این کارها را انجام می‌دهند؟",
    said: (config) => `${fa(config.staff)} نفر`,
    input: () => <Answer>{(answer) => <Choices options={staffChoices.map((staff) => ({ value: staff, label: staff === 25 ? "۲۵ نفر یا بیشتر" : `${fa(staff)} نفر` }))} onPick={(staff) => answer({ staff })} />}</Answer>,
  },
  {
    key: "share",
    ask: (config) => `این ${fa(config.staff)} نفر چه بخشی از روزشان صرف همین کارها می‌شود؟`,
    said: (config) => shareChoices.find((choice) => choice.value === config.share)?.label ?? "",
    input: () => <Answer>{(answer) => <Choices options={shareChoices} onPick={(share) => answer({ share, hoursPerWeek: Math.round(useAi.getState().config.staff * 44 * share) })} />}</Answer>,
  },
  {
    key: "autonomy",
    ask: () => "تصمیم آخر با چه کسی باشد؟",
    said: (config) => autonomyLevels.find((level) => level.value === config.autonomy)?.label ?? "",
    input: () => (
      <Answer>
        {(answer) => (
          <Choices
            options={[
              { value: "suggest" as const, label: "هوش مصنوعی پیشنهاد بدهد، ما تأیید کنیم" },
              { value: "assisted" as const, label: "کارهای روزمره خودکار، موارد حساس با ما" },
              { value: "auto" as const, label: "همه‌چیز خودکار؛ ما فقط گزارش ببینیم" },
            ]}
            onPick={(autonomy) => answer({ autonomy })}
          />
        )}
      </Answer>
    ),
  },
  {
    key: "hosting",
    ask: () => "اطلاعات شرکت کجا بماند؟",
    said: (config) => (config.hosting === "onprem" ? "روی سرور خودمان" : "ابری امن"),
    input: () => (
      <Answer>
        {(answer) => (
          <Choices
            options={[
              { value: "cloud" as const, label: "ابری امن", hint: "راه‌اندازی سریع‌تر و کم‌هزینه‌تر" },
              { value: "onprem" as const, label: "روی سرور خودمان", hint: "هیچ داده‌ای از سازمان بیرون نمی‌رود" },
            ]}
            onPick={(hosting) => answer({ hosting })}
          />
        )}
      </Answer>
    ),
  },
  {
    key: "persona",
    ask: () => "و آخرین سوال: اگر این هم‌تیمی جدید یک آدم بود، با مشتری‌ها چطور حرف می‌زد؟",
    said: (config) => personas.find((persona) => persona.value === config.persona)?.label ?? "",
    input: () => (
      <Answer>
        {(answer) => (
          <Choices
            options={[
              { value: "friendly" as const, label: "صمیمی", hint: "«سلام! 😊 الان برایتان پیدا می‌کنم»" },
              { value: "formal" as const, label: "رسمی", hint: "«سلام. درخواست شما ثبت شد.»" },
              { value: "expert" as const, label: "متخصص و دقیق", hint: "«سفارش ۱۰۴۲، تحویل ۱۷:۳۰»" },
            ]}
            onPick={(persona) => answer({ persona })}
          />
        )}
      </Answer>
    ),
  },
  {
    key: "final",
    ask: () => (
      <>
        تیمتان آماده است ✨ طراحی کامل و نقشه اجرا جزو پروژه است و هر بخشش را با شما دقیق‌تر می‌کنیم.
      </>
    ),
    said: () => "",
    input: () => <TeamCard />,
  },
];

export const interviewLength = questions.length;

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
    const stop = window.setTimeout(() => setTypingFor(null), reduce ? 0 : 700);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(stop);
    };
  }, [stage, reduce]);

  // New messages always come into view without the customer scrolling.
  useStickToBottom(listRef);

  const rise = reduce ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  return (
    <div ref={listRef} data-guide="interview" className="size-full overflow-y-auto overscroll-contain px-4 py-6 lg:px-8 [scrollbar-width:thin]">
      <div className="mx-auto flex max-w-[640px] flex-col gap-4 pb-24 lg:pb-6">
        {questions.slice(0, stage).map((question, index) => (
          <div key={question.key} className="flex flex-col gap-3">
            <Bot>{question.ask(config)}</Bot>
            <motion.button {...rise} type="button" onClick={() => rewind(index)} className="group flex max-w-[85%] items-center gap-2 self-end rounded-[20px] rounded-tl-md bg-[#4da3ff] px-4 py-3 text-right text-[13.5px] leading-7 text-white" title="تغییر پاسخ">
              <span>{question.said(config)}</span>
              <Pencil className="size-3.5 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            </motion.button>
          </div>
        ))}

        <AnimatePresence mode="wait">
          {typingFor === stage ? (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2.5 text-[12px] text-[#8a93a0]">
              <span className="flex size-8 items-center justify-center rounded-full bg-[#111419] ring-1 ring-white/10">
                <KhayyamMark size={20} state="thinking" />
              </span>
              در حال فکر کردن…
            </motion.div>
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
                    <UserRoundCheck className="size-4 text-[#2fd08a]" aria-hidden="true" /> درخواست شما ثبت شد.
                  </span>
                  کارشناس ما با همین نقشه با شما تماس می‌گیرد تا جزئیات را دقیق کنیم. همه این مقادیر طبق نیاز شما قابل تغییر است.
                </Bot>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {stage > 0 && !submitted && <p className="text-center text-[11px] text-[#5d6573]">برای تغییر هر پاسخ، روی حباب آبی‌اش بزنید.</p>}
      </div>
    </div>
  );
};
