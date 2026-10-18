"use client";

import { ArrowLeft, ArrowRight, Check, Clock3, Moon, Repeat2, Wallet } from "lucide-react";
import { animate, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

import { PlanChoice } from "../order-wizard/payment-ui";
import { amountDue, formatToman, startPayment } from "../order-wizard/payments";
import { aiEstimate, fa, goals, impact, pains } from "./config";
import { useAi } from "./store";

/** Counts up to a number once, for the headline. */
const CountUp = ({ to }: { to: number }) => {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) return;
    const controls = animate(0, to, { duration: 1.1, ease: [0.22, 1, 0.36, 1], onUpdate: (latest) => setValue(Math.round(latest * 2) / 2) });
    return () => controls.stop();
  }, [to, reduce]);
  return <>{fa(value)}</>;
};

/**
 * The result of the interview, shown as its own screen instead of a long chat card:
 * the headline, the AI team, before/after, what's fixed, and how to start.
 */
export const Proposal = () => {
  const config = useAi((state) => state.config);
  const update = useAi((state) => state.update);
  const submit = useAi((state) => state.submit);
  const submitted = useAi((state) => state.submitted);
  const setProposal = useAi((state) => state.setProposal);
  const reduce = useReducedMotion();
  const startRef = useRef<HTMLElement>(null);
  const result = impact(config);
  const cost = aiEstimate(config);
  const due = amountDue(config.plan, cost.min);
  const team = goals.filter((goal) => config.goals.includes(goal.value));
  const fixes = pains.filter((pain) => config.pains.includes(pain.value));
  const rise = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const } });
  const field = "h-12 w-full rounded-2xl bg-[#151920] px-4 text-[13px] text-white outline-none ring-1 ring-white/6 placeholder:text-[#5d6573] focus:ring-2 focus:ring-[#4da3ff]/50";

  const rows = [
    { icon: Clock3, label: "پاسخ به مشتری", before: result.responseBefore, after: result.responseAfter },
    { icon: Moon, label: "ساعت کاری", before: "۹ تا ۱۷، روزهای کاری", after: "۲۴ ساعت، ۷ روز هفته" },
    { icon: Repeat2, label: "کار تکراری تیم", before: `${fa(result.hoursBefore)} ساعت در ماه`, after: `${fa(result.hoursBefore - result.hoursSaved)} ساعت در ماه` },
    { icon: Wallet, label: "هزینه نیرو برای این کارها", before: "همان که هست", after: `${fa(result.monthlySaving)} میلیون کمتر در ماه` },
  ];

  if (submitted) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-5 px-6 text-center">
        <KhayyamMark size={80} state="intro" />
        <h1 className="text-[24px] font-extrabold text-white">درخواست شما ثبت شد</h1>
        <p className="max-w-[44ch] text-[14px] leading-7 text-[#a7b0bc]">کارشناس ما با همین پیشنهاد با شما تماس می‌گیرد تا جزئیات را دقیق کنیم. همه این مقادیر طبق نیاز شما قابل تغییر است.</p>
      </div>
    );
  }

  return (
    <div className="size-full overflow-y-auto overscroll-contain [scrollbar-width:thin]">
      <div className="mx-auto flex w-full max-w-[920px] flex-col gap-10 px-5 pb-32 pt-6 lg:pb-16 lg:pt-10">
        <button type="button" onClick={() => setProposal(false)} className="flex w-fit items-center gap-1.5 text-[12.5px] font-bold text-[#8a93a0] transition-colors hover:text-white">
          <ArrowRight className="size-4" aria-hidden="true" /> برگشت به گفتگو
        </button>

        {/* headline */}
        <motion.header {...rise(0)} className="relative overflow-hidden rounded-[32px] bg-[#111419] px-6 py-10 text-center ring-1 ring-white/8 lg:py-14">
          <span className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full bg-[#7c6cff] opacity-25 blur-[90px]" aria-hidden="true" />
          <span className="relative text-[12.5px] font-bold text-[#c4bbff]">پیشنهاد خیام برای {config.company.trim() || "کسب‌وکار شما"}</span>
          {result.fte >= 1 ? (
            <h1 className="relative mt-3 text-[30px] font-black leading-[1.4] text-white lg:text-[46px]">
              کار <span className="bg-[linear-gradient(135deg,#4da3ff,#a78bfa)] bg-clip-text text-transparent"><CountUp to={result.fte} /> نفر</span> تمام‌وقت
            </h1>
          ) : (
            <h1 className="relative mt-3 text-[30px] font-black leading-[1.4] text-white lg:text-[46px]">
              <span className="bg-[linear-gradient(135deg,#4da3ff,#a78bfa)] bg-clip-text text-transparent"><CountUp to={result.hoursSaved} /> ساعت</span> در ماه
            </h1>
          )}
          <p className="relative mx-auto mt-2 max-w-[40ch] text-[14px] leading-7 text-[#a7b0bc] lg:text-[16px]">را تیم هوش مصنوعی شما انجام می‌دهد؛ شبانه‌روزی و بدون نیاز به استخدام تازه.</p>
          <button
            type="button"
            onClick={() => startRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })}
            className="relative mx-auto mt-6 flex h-12 items-center gap-2 rounded-2xl bg-white px-6 text-[14px] font-extrabold text-[#0b0d12] transition-colors hover:bg-[#d9ecff]"
          >
            شروع کنیم <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
        </motion.header>

        {/* the team */}
        <section>
          <motion.h2 {...rise(0.1)} className="mb-4 text-[18px] font-extrabold text-white">اعضای تیم</motion.h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <motion.article key={member.value} {...rise(0.15 + index * 0.06)} className="flex flex-col gap-3 rounded-[24px] bg-[#111419] p-5 ring-1 ring-white/8">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4da3ff,#7c6cff)] text-white">
                    <member.icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="leading-tight">
                    <strong className="block text-[14.5px] text-white">{member.label}</strong>
                    <span className="flex items-center gap-1.5 text-[11px] text-[#2fd08a]">
                      <span className="size-1.5 rounded-full bg-[#2fd08a]" /> آماده به کار · ۲۴/۷
                    </span>
                  </div>
                </div>
                <ul className="flex flex-col gap-1.5 text-[12.5px] text-[#a7b0bc]">
                  {member.actions.map((action) => (
                    <li key={action} className="flex items-center gap-2">
                      <Check className="size-3.5 shrink-0 text-[#4da3ff]" strokeWidth={3} aria-hidden="true" />
                      {action}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </section>

        {/* before / after */}
        <section>
          <motion.h2 {...rise(0.1)} className="mb-4 text-[18px] font-extrabold text-white">قبل و بعد</motion.h2>
          <div className="overflow-hidden rounded-[24px] bg-[#111419] ring-1 ring-white/8">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-white/6 px-5 py-3 text-[11.5px] font-bold text-[#8a93a0]">
              <span />
              <span>امروز</span>
              <span className="text-[#9ccbff]">با تیم هوش مصنوعی</span>
            </div>
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[1.1fr_1fr_1fr] items-center gap-2 border-b border-white/6 px-5 py-4 text-[13px] last:border-0">
                <span className="flex items-center gap-2 font-bold text-white">
                  <row.icon className="size-4 shrink-0 text-[#8a93a0]" aria-hidden="true" />
                  {row.label}
                </span>
                <span className="text-[#8a93a0]">{row.before}</span>
                <span className="font-bold text-[#c8f5df]">{row.after}</span>
              </div>
            ))}
          </div>
          {fixes.length > 0 && (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {fixes.map((pain) => (
                <li key={pain.value} className="flex items-center gap-2 rounded-2xl bg-[#2fd08a]/8 px-4 py-3 text-[13px] text-[#c8f5df] ring-1 ring-[#2fd08a]/20">
                  <Check className="size-4 shrink-0 text-[#2fd08a]" strokeWidth={3} aria-hidden="true" />
                  {pain.fix}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* start */}
        <section ref={startRef} className="scroll-mt-6 rounded-[28px] bg-[#111419] p-5 ring-1 ring-white/8 lg:p-7">
          <h2 className="text-[18px] font-extrabold text-white">شروع</h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(77,163,255,0.14),rgba(124,108,255,0.1))] p-4 ring-1 ring-[#4da3ff]/25">
                <span className="text-[11.5px] font-bold text-[#9ccbff]">برآورد راه‌اندازی، همراه طراحی و نقشه اجرا</span>
                <strong className="mt-1 block text-[22px] font-black text-white">
                  {fa(cost.min)} تا {fa(cost.max)} <span className="text-[12px] font-normal text-[#a7b0bc]">میلیون تومان · {fa(cost.weeks)} هفته</span>
                </strong>
                <span className="mt-1 block text-[12px] text-[#a7b0bc]">بازگشت سرمایه در حدود {fa(result.paybackMonths)} ماه</span>
              </div>
              <PlanChoice plan={config.plan} estimateMin={cost.min} onChange={(plan) => update({ plan })} />
            </div>
            <div className="flex flex-col gap-2.5">
              <input value={config.company} onChange={(event) => update({ company: event.target.value })} placeholder="نام شرکت" aria-label="نام شرکت" className={field} />
              <input value={config.contactName} onChange={(event) => update({ contactName: event.target.value })} placeholder="نام شما" aria-label="نام شما" autoComplete="name" className={field} />
              <input value={config.contactPhone} onChange={(event) => update({ contactPhone: event.target.value })} placeholder="شماره تماس" aria-label="شماره تماس" inputMode="tel" autoComplete="tel" dir="ltr" className={`${field} text-left`} />
              <button
                type="button"
                onClick={() => void startPayment(due).then((ok) => ok && submit())}
                className="mt-auto flex h-12 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#4da3ff,#7c6cff)] text-[14px] font-extrabold text-white shadow-[0_10px_30px_-12px_rgba(77,163,255,0.8)] transition hover:brightness-110"
              >
                <Check className="size-4" aria-hidden="true" /> پرداخت {formatToman(due)} و ثبت
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
