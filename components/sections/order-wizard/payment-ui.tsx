"use client";

import { Check, CreditCard, PhoneCall, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

import { amountDue, CONSULT_FEE, formatToman, usePayment, type Plan } from "./payments";

/** Two ways forward: start the project with a deposit, or pay a small deductible fee for a consultation. */
export const PlanChoice = ({ plan, estimateMin, onChange }: { plan: Plan; estimateMin: number; onChange: (plan: Plan) => void }) => {
  const options = [
    { value: "start" as const, icon: CreditCard, title: "شروع پروژه", text: "طراحی فیگما رایگان و جزو پروژه است؛ اول طرح را می‌بینید و تأیید می‌کنید، بعد می‌سازیم.", amount: amountDue("start", estimateMin), suffix: "پیش‌پرداخت" },
    { value: "consult" as const, icon: PhoneCall, title: "اول مشاوره", text: "کارشناس با شما تماس می‌گیرد و جلسه مشاوره می‌گذاریم. این مبلغ بعداً از قرارداد کم می‌شود.", amount: CONSULT_FEE, suffix: "قابل کسر از قرارداد" },
  ];

  return (
    <div className="flex flex-col gap-2.5">
      {options.map((option) => {
        const selected = plan === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={`relative flex items-start gap-3 rounded-2xl p-4 text-right transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#4da3ff] ${selected ? "bg-[#4da3ff]/14 text-[#9ccbff]" : "bg-[#171b22] text-[#c9d0d9] hover:bg-[#1d222b]"}`}
          >
            <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${selected ? "bg-[#4da3ff] text-white" : "bg-white/6"}`}>
              <option.icon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-[14px] text-white">{option.title}</strong>
              <span className="mt-1 block text-[12px] leading-6 opacity-75">{option.text}</span>
              <span className="mt-2 flex items-baseline gap-1.5">
                <strong className="text-[15px] text-white">{formatToman(option.amount)}</strong>
                <span className="text-[11px] opacity-60">{option.suffix}</span>
              </span>
            </span>
            {selected && (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#4da3ff] text-white">
                <Check className="size-3" strokeWidth={3} aria-hidden="true" />
              </span>
            )}
          </button>
        );
      })}
      <p className="flex items-center gap-2 px-1 text-[11px] text-[#8a93a0]">
        <ShieldCheck className="size-3.5 shrink-0 text-[#2fd08a]" aria-hidden="true" />
        پرداخت از درگاه امن بانکی؛ طراحی فیگما هیچ‌وقت جدا حساب نمی‌شود.
      </p>
    </div>
  );
};

/** Full-screen overlay while the customer is sent to the gateway and back. */
export const PaymentOverlay = () => {
  const status = usePayment((state) => state.status);
  const amount = usePayment((state) => state.amount);

  return (
    <AnimatePresence>
      {status !== "idle" && (
        <motion.div className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-5 bg-[#05070c]/90 text-center backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status" aria-live="polite" dir="rtl">
          {status === "redirecting" ? (
            <>
              <KhayyamMark size={72} state="thinking" />
              <strong className="text-[18px] text-white">در حال انتقال به درگاه امن…</strong>
              <span className="text-[13px] text-[#a7b0bc]">مبلغ: {formatToman(amount)}</span>
            </>
          ) : (
            <>
              <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="flex size-16 items-center justify-center rounded-full bg-[#2fd08a] text-[#0b0d12]">
                <Check className="size-8" strokeWidth={3} aria-hidden="true" />
              </motion.span>
              <strong className="text-[18px] text-white">پرداخت انجام شد</strong>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
