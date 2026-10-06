"use client";

import { Clock, Coins, Timer, TrendingUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { fa, impact, type AiConfig } from "./config";

/** What the automation is worth: hours and money saved, response time, payback. */
export const ImpactBoard = ({ config }: { config: AiConfig }) => {
  const reduce = useReducedMotion();
  const result = impact(config);
  const cards = [
    { icon: Clock, label: "ساعت آزاد در ماه", value: fa(result.hoursSaved), unit: "ساعت", tone: "#4da3ff" },
    { icon: Coins, label: "صرفه‌جویی ماهانه", value: fa(result.monthlySaving), unit: "میلیون تومان", tone: "#2fd08a" },
    { icon: Timer, label: "زمان پاسخ", value: result.responseAfter, unit: `قبلاً ${result.responseBefore}`, tone: "#f0b44a" },
    { icon: TrendingUp, label: "بازگشت سرمایه", value: fa(result.paybackMonths), unit: "ماه", tone: "#a78bfa" },
  ];
  const max = Math.max(result.hoursBefore, 1);

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4" dir="rtl">
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[22px] bg-[#111419] p-4 ring-1 ring-white/8">
            <span className="flex items-center gap-2 text-[12px] text-[#8a93a0]">
              <card.icon className="size-4" style={{ color: card.tone }} aria-hidden="true" />
              {card.label}
            </span>
            <strong className="mt-2 block text-[26px] font-black leading-tight text-white">{card.value}</strong>
            <span className="text-[11.5px] text-[#8a93a0]">{card.unit}</span>
          </div>
        ))}
      </div>

      <div className="rounded-[22px] bg-[#111419] p-5 ring-1 ring-white/8">
        <strong className="text-[13px] text-white">زمان صرف‌شده در ماه</strong>
        {[
          { label: "الان", value: result.hoursBefore, color: "#5d6573" },
          { label: "با هوش مصنوعی", value: result.hoursAfter, color: "#2fd08a" },
        ].map((row) => (
          <div key={row.label} className="mt-4">
            <div className="mb-1.5 flex justify-between text-[12px] text-[#a7b0bc]">
              <span>{row.label}</span>
              <span>{fa(row.value)} ساعت</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/6">
              <motion.div className="h-full rounded-full" style={{ backgroundColor: row.color }} initial={false} animate={{ width: `${(row.value / max) * 100}%` }} transition={reduce ? { duration: 0 } : { type: "spring", bounce: 0.1, duration: 0.7 }} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-[11.5px] text-[#5d6573]">تخمین بر اساس عددهای شماست؛ با داده واقعی در نقشه راه دقیق‌تر می‌شود.</p>
    </div>
  );
};
