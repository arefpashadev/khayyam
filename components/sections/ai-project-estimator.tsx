"use client";

import {
  ArrowLeft,
  Box,
  Calculator,
  ChartNoAxesColumnIncreasing,
  CircleHelp,
  Clock3,
  CreditCard,
  Headphones,
  Info,
  RotateCcw,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";

const services = [
  { value: "mobile", label: "اپلیکیشن موبایل", price: 180 },
  { value: "web", label: "وب‌اپلیکیشن اختصاصی", price: 145 },
  { value: "assistant", label: "دستیار هوش مصنوعی", price: 210 },
  { value: "automation", label: "اتوماسیون فرایند", price: 125 },
];

const complexities = [
  { value: "simple", label: "ساده", multiplier: 0.8 },
  { value: "medium", label: "متوسط", multiplier: 1 },
  { value: "complex", label: "پیچیده", multiplier: 1.45 },
];

const deliveries = [
  { value: "normal", label: "عادی", multiplier: 1, time: "۱ تا ۴ هفته" },
  { value: "fast", label: "سریع", multiplier: 1.18, time: "۱ تا ۳ هفته" },
  { value: "urgent", label: "فوری", multiplier: 1.35, time: "۵ تا ۱۰ روز" },
];

const payments = [
  { value: "installment", label: "پرداخت اقساطی" },
  { value: "full", label: "پرداخت کامل" },
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat("fa-IR").format(Math.round(value));

export const AiProjectEstimator = () => {
  const [service, setService] = useState("mobile");
  const [complexity, setComplexity] = useState("medium");
  const [delivery, setDelivery] = useState("normal");
  const [payment, setPayment] = useState("installment");

  const selectedService = services.find((item) => item.value === service)!;
  const selectedComplexity = complexities.find(
    (item) => item.value === complexity,
  )!;
  const selectedDelivery = deliveries.find((item) => item.value === delivery)!;

  const estimate = useMemo(
    () =>
      selectedService.price *
      selectedComplexity.multiplier *
      selectedDelivery.multiplier,
    [selectedComplexity, selectedDelivery, selectedService],
  );

  const resetEstimate = () => {
    setService("mobile");
    setComplexity("medium");
    setDelivery("normal");
    setPayment("installment");
  };

  return (
    <section
      aria-labelledby="project-estimator-title"
      className="bg-[#50acf0] px-5 py-24 sm:px-8 sm:py-28 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="text-right text-[#12181d]" dir="rtl">
          <h2
            id="project-estimator-title"
            className="text-[29px] font-black leading-[1.45] tracking-[-0.025em] sm:text-[36px]"
          >
            ایده‌ات رو بده، حساب‌وکتابش با خیام
          </h2>
          <p className="mt-5 text-sm font-medium leading-7 text-white sm:text-base">
            فقط چندتا انتخاب ساده؛ چند ثانیه بعد یه تخمین از هزینه و زمان پروژه‌ات داری.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-[0.8fr_1.1fr] lg:items-stretch lg:gap-16">
          <aside
            className="order-2 overflow-hidden rounded-xl bg-white p-2 shadow-[0_14px_35px_rgba(0,86,157,0.12)] lg:order-1"
            dir="rtl"
            aria-live="polite"
          >
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg bg-[#0798f2] px-6 py-10 text-center text-white lg:min-h-[380px]">
              <Calculator aria-hidden="true" className="size-11 opacity-90" strokeWidth={1.5} />
              <span className="mt-5 text-sm text-white/80">برآورد اولیه هزینه پروژه</span>
              <strong className="mt-3 text-4xl font-black sm:text-5xl">
                {formatPrice(estimate)}
              </strong>
              <span className="mt-2 text-sm font-bold">میلیون تومان</span>
              <span className="mt-7 rounded-full bg-white/15 px-5 py-2 text-xs">
                {selectedService.label}
              </span>
            </div>

            <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[#9bd2f8] px-2 py-5 text-center">
              <div className="px-2">
                <Clock3 className="mx-auto size-5 text-[#078ef0]" aria-hidden="true" />
                <span className="mt-2 block text-xs text-[#5f6970]">زمان تحویل</span>
                <strong className="mt-2 block text-sm text-[#2d3337]">{selectedDelivery.time}</strong>
              </div>
              <div className="px-2">
                <ChartNoAxesColumnIncreasing className="mx-auto size-5 text-[#078ef0]" aria-hidden="true" />
                <span className="mt-2 block text-xs text-[#5f6970]">سطح پیچیدگی</span>
                <strong className="mt-2 block text-sm text-[#2d3337]">{selectedComplexity.label}</strong>
              </div>
              <div className="px-2">
                <Calculator className="mx-auto size-5 text-[#078ef0]" aria-hidden="true" />
                <span className="mt-2 block text-xs text-[#5f6970]">زمان شروع پروژه</span>
                <strong className="mt-2 block text-sm text-[#2d3337]">۱ تا ۲ روز</strong>
              </div>
            </div>

            <p className="flex items-center justify-center gap-2 rounded-lg border border-[#8ec9ff] bg-[#f6fbff] px-3 py-3 text-center text-[11px] leading-5 text-[#59656d]">
              <Info className="size-4 shrink-0 text-[#078ef0]" aria-hidden="true" />
              این برآورد تقریبی است و پس از بررسی جزئیات، دقیق‌تر نهایی خواهد شد.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-3">
              <button type="button" className="flex items-center justify-center gap-2 rounded-lg border border-[#9bcfff] bg-[#f7fbff] px-2 py-2.5 text-[11px] text-[#4f5a61]" onClick={resetEstimate}>
                <RotateCcw className="size-4 text-[#078ef0]" aria-hidden="true" /> محاسبه مجدد
              </button>
              <span className="flex items-center justify-center gap-2 rounded-lg border border-[#9bcfff] bg-[#f7fbff] px-2 py-2.5 text-[11px] text-[#4f5a61]">
                <CircleHelp className="size-4 text-[#078ef0]" aria-hidden="true" /> عوامل مؤثر
              </span>
              <span className="flex items-center justify-center gap-2 rounded-lg border border-[#9bcfff] bg-[#f7fbff] px-2 py-2.5 text-[11px] text-[#4f5a61]">
                <Clock3 className="size-4 text-[#078ef0]" aria-hidden="true" /> سابقه تخمین‌ها
              </span>
            </div>
          </aside>

          <div className="order-1 rounded-xl bg-white p-5 shadow-[0_14px_35px_rgba(0,86,157,0.12)] sm:p-7 lg:order-2" dir="rtl">
            <EstimatorSelect label="نوع سرویس" icon={<Box />} value={service} onChange={setService} />
            <EstimatorOptions label="سطح پیچیدگی" icon={<ChartNoAxesColumnIncreasing />} options={complexities} value={complexity} onChange={setComplexity} />
            <EstimatorOptions label="زمان تحویل" icon={<Clock3 />} options={deliveries} value={delivery} onChange={setDelivery} />
            <EstimatorOptions label="روش پرداخت" icon={<CreditCard />} options={payments} value={payment} onChange={setPayment} />

            <div className="mt-7 flex items-center gap-3 rounded-lg border border-[#24a863] bg-[#f4fcf8] px-4 py-4 text-[#18884f]">
              <ShieldCheck className="size-6 shrink-0" aria-hidden="true" />
              <div>
                <strong className="text-sm">بدون کارمزد</strong>
                <p className="mt-1 text-[11px] leading-5">منصفانه و شفاف؛ همین مبلغ، بدون هزینه پنهان.</p>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <a href="#contact" className="flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#078ef0] px-5 text-sm font-extrabold text-white transition hover:bg-[#007ed8]">
                <Send className="size-5" aria-hidden="true" /> شروع پروژه
              </a>
              <a href="#contact" className="flex min-h-12 items-center justify-center gap-3 rounded-lg border-2 border-[#078ef0] px-5 text-sm font-extrabold text-[#252b2f] transition hover:bg-[#eef8ff]">
                <Headphones className="size-5 text-[#078ef0]" aria-hidden="true" /> دریافت مشاوره
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

type Option = { value: string; label: string };

const EstimatorOptions = ({ label, icon, options, value, onChange }: { label: string; icon: React.ReactElement; options: Option[]; value: string; onChange: (value: string) => void }) => (
  <fieldset className="mt-7 first:mt-0">
    <legend className="mb-2 flex w-full items-center gap-3 text-sm font-extrabold text-[#343b40]">
      <span className="flex size-11 items-center justify-center rounded-lg bg-[#f4f7ff] text-[#087fff] [&_svg]:size-5">{icon}</span>
      {label}
    </legend>
    <div className="grid overflow-hidden rounded-lg border border-[#94baff]" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((option) => (
        <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => onChange(option.value)} className={`min-h-11 border-l border-[#b9cefa] px-2 text-xs transition last:border-l-0 ${value === option.value ? "bg-[#0798f2] font-bold text-white" : "bg-white text-[#535d64] hover:bg-[#f2f8ff]"}`}>
          {option.label}
        </button>
      ))}
    </div>
  </fieldset>
);

const EstimatorSelect = ({ label, icon, value, onChange }: { label: string; icon: React.ReactElement; value: string; onChange: (value: string) => void }) => (
  <label className="block">
    <span className="mb-2 flex items-center gap-3 text-sm font-extrabold text-[#343b40]">
      <span className="flex size-11 items-center justify-center rounded-lg bg-[#f4f7ff] text-[#087fff] [&_svg]:size-5">{icon}</span>
      {label}
    </span>
    <span className="relative block">
      <select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 w-full appearance-none rounded-lg border border-[#94baff] bg-white px-4 text-sm text-[#535d64] outline-none transition focus:border-[#078ef0] focus:ring-4 focus:ring-[#078ef0]/10">
        {services.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
      </select>
      <ArrowLeft className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 -rotate-90 text-[#30383e]" aria-hidden="true" />
    </span>
  </label>
);
