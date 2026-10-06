"use client";

import { Check, MessagesSquare, Paperclip } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

import { CONSULT_FEE, formatToman, startPayment } from "../order-wizard/payments";
import { customData, customDomains, customProcess, fa } from "./config";
import { useAi } from "./store";

const field = "w-full rounded-2xl bg-[#151920] px-4 text-[13px] text-white outline-none ring-1 ring-white/6 transition placeholder:text-[#5d6573] focus:ring-2 focus:ring-[#4da3ff]/50";
const label = "mb-2.5 block text-[12.5px] font-bold text-[#a7b0bc]";

/**
 * Bespoke AI (a production line, medical imaging, something bigger): these need a real
 * conversation and a look at the data before anyone can promise a useful result,
 * so this page gathers context and books an expert call instead of quoting a price.
 */
export const CustomAi = () => {
  const custom = useAi((state) => state.custom);
  const updateCustom = useAi((state) => state.updateCustom);
  const toggleCustom = useAi((state) => state.toggleCustom);
  const submitted = useAi((state) => state.submitted);
  const submit = useAi((state) => state.submit);
  const reduce = useReducedMotion();
  const rise = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay } });

  if (submitted) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-5 px-6 text-center">
        <KhayyamMark size={80} state="intro" />
        <h1 className="text-[24px] font-extrabold text-white">درخواست شما رسید</h1>
        <p className="max-w-[46ch] text-[14px] leading-7 text-[#a7b0bc]">کارشناس هوش مصنوعی ما با شما تماس می‌گیرد تا مسئله و داده‌ها را دقیق‌تر بشناسیم. مبلغ مشاوره از قرارداد نهایی کم می‌شود.</p>
      </div>
    );
  }

  return (
    <div className="size-full overflow-y-auto overscroll-contain [scrollbar-width:thin]">
      <div className="mx-auto flex w-full max-w-[920px] flex-col gap-10 px-5 pb-16 pt-8 lg:pt-12">
        <motion.header {...rise(0)} className="text-center">
          <span className="rounded-full bg-[#7c6cff]/15 px-3 py-1 text-[12px] font-bold text-[#c4bbff]">هوش مصنوعی اختصاصی</span>
          <h1 className="mt-4 text-[26px] font-extrabold leading-[1.5] text-white lg:text-[38px]">مسئله خاص شما، راه‌حل اختصاصی</h1>
          <p className="mx-auto mt-3 max-w-[56ch] text-[14px] leading-7 text-[#a7b0bc]">
            خط تولید کارخانه، تشخیص پزشکی یا هر ایده بزرگ‌تری؛ این پروژه‌ها با گفتگو و بررسی داده‌های شما شکل می‌گیرند تا به خروجی برسیم که واقعاً قابل استفاده باشد و برای سازمان شما سود بسازد. اطلاعات بیشتری بدهید؛ با شما تماس می‌گیریم.
          </p>
        </motion.header>

        <section>
          <span className={label}>در چه حوزه‌ای؟</span>
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {customDomains.map((domain, index) => {
              const on = custom.domains.includes(domain.value);
              return (
                <motion.button
                  {...rise(index * 0.04)}
                  key={domain.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleCustom("domains", domain.value)}
                  className={`relative flex flex-col gap-2.5 rounded-[22px] p-4 text-right transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#4da3ff] ${on ? "bg-[#7c6cff]/16 ring-1 ring-[#7c6cff]/50" : "bg-[#111419] ring-1 ring-white/6 hover:bg-[#151920]"}`}
                >
                  <span className={`flex size-10 items-center justify-center rounded-xl ${on ? "bg-[#7c6cff] text-white" : "bg-white/6 text-[#c9d0d9]"}`}>
                    <domain.icon className="size-5" aria-hidden="true" />
                  </span>
                  <strong className="text-[13.5px] text-white">{domain.label}</strong>
                  <span className="text-[11.5px] leading-5 text-[#8a93a0]">{domain.example}</span>
                  {on && (
                    <span className="absolute left-3 top-3 flex size-5 items-center justify-center rounded-full bg-[#7c6cff] text-white">
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <label className="block lg:col-span-2">
            <span className={label}>مسئله یا هدفتان را با زبان خودتان بنویسید</span>
            <textarea value={custom.problem} onChange={(event) => updateCustom({ problem: event.target.value })} rows={4} placeholder="مثلاً: روزانه حدود ۲۰۰ قطعه معیوب از خط رد می‌شود؛ می‌خواهیم قبل از بسته‌بندی با دوربین تشخیص داده شوند." className={`${field} resize-none py-3 leading-7`} />
          </label>
          <div>
            <span className={label}>چه داده‌ای دارید؟</span>
            <div className="flex flex-wrap gap-2">
              {customData.map((item) => {
                const on = custom.data.includes(item.value);
                return (
                  <button key={item.value} type="button" aria-pressed={on} onClick={() => toggleCustom("data", item.value)} className={`h-10 rounded-full px-4 text-[12.5px] font-bold transition-colors ${on ? "bg-[#7c6cff] text-white" : "bg-[#151920] text-[#c9d0d9] ring-1 ring-white/6 hover:bg-[#1b2029]"}`}>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={label}>اندازه سازمان</span>
              <select value={custom.scale} onChange={(event) => updateCustom({ scale: event.target.value })} className={`${field} h-11`}>
                <option value="">انتخاب کنید</option>
                <option>کمتر از ۵۰ نفر</option>
                <option>۵۰ تا ۵۰۰ نفر</option>
                <option>بیش از ۵۰۰ نفر</option>
              </select>
            </label>
            <label className="block">
              <span className={label}>زمان‌بندی</span>
              <select value={custom.timeline} onChange={(event) => updateCustom({ timeline: event.target.value })} className={`${field} h-11`}>
                <option value="">انتخاب کنید</option>
                <option>هرچه زودتر</option>
                <option>در ۳ ماه آینده</option>
                <option>فعلاً بررسی می‌کنیم</option>
              </select>
            </label>
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-[#151920] px-4 py-3.5 text-[13px] text-[#c9d0d9] border border-dashed border-white/15 transition hover:bg-[#1b2029] lg:col-span-2">
            <Paperclip className="size-4 text-[#4da3ff]" aria-hidden="true" />
            <span className="flex-1">{custom.fileName || "فایل، نمونه داده یا توضیح تکمیلی (اختیاری)"}</span>
            <input type="file" className="sr-only" onChange={(event) => updateCustom({ fileName: event.target.files?.[0]?.name ?? "" })} />
          </label>
        </section>

        <section>
          <span className={label}>مسیر همکاری</span>
          <ol className="grid gap-3 lg:grid-cols-4">
            {customProcess.map((step, index) => (
              <motion.li {...rise(index * 0.06)} key={step.title} className="relative rounded-[22px] bg-[#111419] p-4 ring-1 ring-white/6">
                <span className="flex size-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#4da3ff,#7c6cff)] text-[13px] font-black text-white">{fa(index + 1)}</span>
                <strong className="mt-3 block text-[13.5px] text-white">{step.title}</strong>
                <span className="mt-1 block text-[12px] leading-6 text-[#8a93a0]">{step.text}</span>
              </motion.li>
            ))}
          </ol>
        </section>

        <section className="rounded-[26px] bg-[linear-gradient(140deg,rgba(124,108,255,0.16),rgba(77,163,255,0.08))] p-5 ring-1 ring-[#7c6cff]/30 lg:p-7">
          <div className="flex items-start gap-3">
            <MessagesSquare className="mt-1 size-5 shrink-0 text-[#c4bbff]" aria-hidden="true" />
            <p className="text-[13px] leading-7 text-[#d6d2ff]">
              برای این پروژه‌ها قیمت ثابت نمی‌دهیم؛ اول باید مسئله و داده‌ها را بشناسیم. با پرداخت {formatToman(CONSULT_FEE)} جلسه مشاوره تخصصی رزرو می‌شود و این مبلغ از قرارداد نهایی کم می‌شود.
            </p>
          </div>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
            <input value={custom.company} onChange={(event) => updateCustom({ company: event.target.value })} placeholder="نام سازمان" aria-label="نام سازمان" className={`${field} h-12`} />
            <input value={custom.name} onChange={(event) => updateCustom({ name: event.target.value })} placeholder="نام شما" aria-label="نام شما" autoComplete="name" className={`${field} h-12`} />
            <input value={custom.phone} onChange={(event) => updateCustom({ phone: event.target.value })} placeholder="شماره تماس" aria-label="شماره تماس" inputMode="tel" autoComplete="tel" dir="ltr" className={`${field} h-12 text-left`} />
          </div>
          <button
            type="button"
            onClick={() => void startPayment(CONSULT_FEE).then((ok) => ok && submit())}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-[14px] font-extrabold text-[#0b0d12] transition-colors hover:bg-[#e6e2ff]"
          >
            <Check className="size-4" aria-hidden="true" /> پرداخت {formatToman(CONSULT_FEE)} و رزرو مشاوره
          </button>
        </section>
      </div>
    </div>
  );
};
