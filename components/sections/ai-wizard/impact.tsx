"use client";

import { Bot, UserRound } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { fa, impact, type AiConfig } from "./config";

/**
 * What changes for the business, told with people and hours rather than a bare chart:
 * how many people's worth of work the AI takes on, the 24-hour day it covers, and the money.
 */
export const ImpactBoard = ({ config }: { config: AiConfig }) => {
  const reduce = useReducedMotion();
  const result = impact(config);
  const people = Math.min(Math.max(config.staff, 1), 12);
  const taken = Math.min(result.fte, people);
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, bounce: 0.15, duration: 0.6 };

  return (
    <div className="mx-auto flex w-full max-w-[680px] flex-col gap-3" dir="rtl">
      {/* people */}
      <div className="rounded-[24px] bg-[#111419] p-5 ring-1 ring-white/8">
        <span className="text-[12px] text-[#8a93a0]">کاری که هوش مصنوعی از دوش تیم برمی‌دارد</span>
        <strong className="mt-1 block text-[24px] font-black text-white">
          {result.fte >= 1 ? `معادل ${fa(result.fte)} نیروی تمام‌وقت` : `${fa(result.hoursSaved)} ساعت در ماه`}
        </strong>
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: people }, (_, index) => {
            const fill = Math.max(0, Math.min(1, taken - index));
            return (
              <span key={index} className="relative flex size-11 items-center justify-center overflow-hidden rounded-2xl bg-white/6 text-[#8a93a0]">
                <UserRound className="size-5" aria-hidden="true" />
                <motion.span className="absolute inset-y-0 right-0 flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#4da3ff,#7c6cff)] text-white" initial={false} animate={{ width: `${fill * 100}%` }} transition={spring}>
                  <Bot className="size-5 shrink-0" aria-hidden="true" />
                </motion.span>
              </span>
            );
          })}
        </div>
        <span className="mt-3 block text-[12px] text-[#a7b0bc]">
          از {fa(config.staff)} نفر تیم شما؛ آن‌ها برای کارهایی آزاد می‌شوند که واقعاً به آدم نیاز دارد.
        </span>
      </div>

      {/* 24 hours */}
      <div className="rounded-[24px] bg-[#111419] p-5 ring-1 ring-white/8">
        <span className="text-[12px] text-[#8a93a0]">یک شبانه‌روز کسب‌وکار شما</span>
        {[
          { label: "تیم شما", from: 9, to: 17, color: "#5d6573" },
          { label: "هوش مصنوعی", from: 0, to: 24, color: "#4da3ff" },
        ].map((row) => (
          <div key={row.label} className="mt-3">
            <div className="mb-1.5 flex justify-between text-[12px] text-[#c9d0d9]">
              <span>{row.label}</span>
              <span className="text-[#8a93a0]">{row.to - row.from === 24 ? "۲۴ ساعت، ۷ روز" : `${fa(row.from)} تا ${fa(row.to)}`}</span>
            </div>
            <div className="flex h-3 gap-[2px]" dir="ltr">
              {Array.from({ length: 24 }, (_, hour) => (
                <motion.span
                  key={hour}
                  className="flex-1 rounded-[3px]"
                  initial={false}
                  animate={{ backgroundColor: hour >= row.from && hour < row.to ? row.color : "rgba(255,255,255,0.06)" }}
                  transition={{ delay: reduce ? 0 : hour * 0.015 }}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="mt-2 flex justify-between text-[10px] text-[#5d6573]" dir="ltr">
          <span>۰۰</span>
          <span>۰۶</span>
          <span>۱۲</span>
          <span>۱۸</span>
          <span>۲۴</span>
        </div>
      </div>

      {/* numbers */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: result.responseAfter, label: `پاسخ؛ الان ${result.responseBefore}` },
          { value: `${fa(result.monthlySaving)} میلیون`, label: "تومان کمتر هزینه در ماه" },
          { value: `${fa(result.paybackMonths)} ماه`, label: "تا بازگشت سرمایه" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-[#111419] p-3.5 text-center ring-1 ring-white/8">
            <strong className="block text-[16px] font-black text-white">{item.value}</strong>
            <span className="mt-1 block text-[10.5px] leading-4 text-[#8a93a0]">{item.label}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-[11px] text-[#5d6573]">تخمین بر اساس جواب‌های شماست؛ در جلسه با داده واقعی دقیق می‌شود.</p>
    </div>
  );
};
