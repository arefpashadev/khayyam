"use client";

import { ArrowUp, UserCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

import type { AiConfig, GoalKey, Persona } from "./config";

type Line = { from: "user" | "bot"; text: string; handoff?: boolean };

/** Sample exchanges per goal; replies come in three tones. */
const scripts: Record<GoalKey, { ask: string; reply: Record<Persona, string>; handoff?: boolean }[]> = {
  support: [
    { ask: "سفارشم کی می‌رسد؟", reply: { friendly: "سلام! 😊 سفارش ۱۰۴۲ امروز ساعت ۱۴ تحویل پیک شد و تا عصر به دستتان می‌رسد.", formal: "سفارش شماره ۱۰۴۲ امروز ساعت ۱۴ ارسال شده و تا پایان روز تحویل می‌شود.", expert: "سفارش ۱۰۴۲: ارسال ۱۴:۰۲، پیک شماره ۷، زمان تخمینی تحویل ۱۷:۳۰ تا ۱۸:۰۰." } },
    { ask: "می‌خواهم مرجوع کنم", reply: { friendly: "حتماً! فرم مرجوعی را برایتان باز کردم و یک همکار هم پیگیری می‌کند 🙌", formal: "درخواست مرجوعی ثبت شد و برای بررسی به کارشناس ارجاع داده شد.", expert: "مرجوعی تا ۷ روز ممکن است؛ درخواست ۸۸۱ ثبت و به واحد پشتیبانی ارجاع شد." }, handoff: true },
  ],
  process: [{ ask: "فاکتور خرید ۴۵ میلیونی را ثبت کن", reply: { friendly: "ثبت شد ✓ چون بالای ۴۰ میلیون است، برای تأیید مدیر مالی هم فرستادم.", formal: "سند ثبت شد و طبق سیاست مالی برای تأیید مدیر ارسال گردید.", expert: "سند ۲۲۱۳ ثبت شد؛ مبلغ از سقف ۴۰ میلیون بیشتر است ← در صف تأیید مدیر مالی." }, handoff: true }],
  reports: [{ ask: "فروش این هفته چطور بود؟", reply: { friendly: "هفته خوبی بود! فروش ۱۸٪ بیشتر از هفته قبل شد؛ بیشترش از تلگرام 🎉", formal: "فروش هفته جاری نسبت به هفته گذشته ۱۸٪ افزایش داشته است.", expert: "فروش هفتگی: ۴۱۲ میلیون (+۱۸٪). سهم کانال‌ها: تلگرام ۴۴٪، سایت ۳۶٪، حضوری ۲۰٪." } }],
  documents: [{ ask: "این فاکتور را بخوان", reply: { friendly: "خواندمش! فروشنده: پارس‌کالا، مبلغ ۱۲٫۴ میلیون، سررسید ۱۵ آبان. واردش کنم؟", formal: "اطلاعات فاکتور استخراج شد: پارس‌کالا، ۱۲٫۴ میلیون تومان، سررسید ۱۵ آبان.", expert: "OCR: فروشنده پارس‌کالا، ۷ قلم، جمع ۱۲٬۴۰۰٬۰۰۰، مالیات ۹٪، سررسید ۱۴۰۵/۰۸/۱۵." } }],
  marketing: [{ ask: "یک پست برای حراج پاییزه بنویس", reply: { friendly: "🍂 حراج پاییزه شروع شد! تا ۳۰٪ تخفیف فقط تا جمعه. لینک در بیو 🛍️", formal: "حراج پاییزه با تخفیف تا ۳۰ درصد، تنها تا پایان هفته.", expert: "متن پیشنهادی + ۳ هشتگ پربازدید + بهترین زمان انتشار: پنجشنبه ساعت ۲۰." } }],
  forecast: [{ ask: "ماه بعد چقدر جنس بخرم؟", reply: { friendly: "بر اساس روند فروش، حدود ۱۲۰۰ واحد کافی است؛ کالای A را کمی بیشتر بخرید 📦", formal: "پیش‌بینی نیاز ماه آینده ۱۲۰۰ واحد است؛ کالای A با رشد بیشتری همراه است.", expert: "پیش‌بینی: ۱۱۸۰ تا ۱۲۴۰ واحد (اطمینان ۸۵٪). کالای A +۲۲٪ به‌دلیل فصل." } }],
  knowledge: [{ ask: "سیاست مرخصی شرکت چیست؟", reply: { friendly: "طبق آیین‌نامه، هر ماه ۲٫۵ روز مرخصی دارید و تا ۹ روز قابل ذخیره است 🙂", formal: "بر اساس آیین‌نامه منابع انسانی، ماهانه ۲٫۵ روز مرخصی تعلق می‌گیرد.", expert: "آیین‌نامه HR بند ۴-۲: ۲٫۵ روز/ماه، سقف ذخیره ۹ روز، منبع: دفترچه ۱۴۰۴." } }],
  voice: [{ ask: "📞 «سلام، برای فردا نوبت دارید؟»", reply: { friendly: "(صدا) سلام! بله، فردا ساعت ۱۰ و ۱۶ خالی است. کدام را رزرو کنم؟", formal: "(صدا) فردا ساعات ۱۰ و ۱۶ برای رزرو موجود است.", expert: "(صدا) تبدیل گفتار ✓ نوبت‌های فردا: ۱۰:۰۰ و ۱۶:۰۰؛ تماس ثبت و خلاصه شد." } }],
};

export const ChatSim = ({ config }: { config: AiConfig }) => {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState(false);
  const pool = (config.goals.length ? config.goals : (["support"] as GoalKey[])).flatMap((goal) => scripts[goal]);
  const name = config.company.trim() || "کسب‌وکار شما";

  // Start over when the tone changes so the customer can compare.
  useEffect(() => {
    const timeout = window.setTimeout(() => setLines([]), 0);
    return () => window.clearTimeout(timeout);
  }, [config.persona]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [lines.length, typing, reduce]);

  const ask = (index: number) => {
    if (typing) return;
    const item = pool[index];
    setLines((current) => [...current, { from: "user", text: item.ask }]);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setLines((current) => [...current, { from: "bot", text: item.reply[config.persona], handoff: item.handoff && config.autonomy !== "auto" }]);
    }, reduce ? 200 : 1100);
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[420px] flex-col overflow-hidden rounded-[28px] bg-[#111419] ring-1 ring-white/10" dir="rtl">
      <div className="flex items-center gap-3 border-b border-white/6 px-4 py-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-[#0b0d12] ring-1 ring-white/10">
          <KhayyamMark size={26} />
        </span>
        <div className="leading-tight">
          <strong className="block text-[13px] text-white">دستیار {name}</strong>
          <span className="flex items-center gap-1 text-[11px] text-[#2fd08a]"><span className="size-1.5 rounded-full bg-[#2fd08a]" />آنلاین · {config.languages.map((code) => ({ fa: "فارسی", en: "EN", ar: "عربی" })[code as "fa"]).join("، ")}</span>
        </div>
      </div>

      <div ref={listRef} className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-4 py-4 [scrollbar-width:thin]">
        <p className="max-w-[85%] rounded-[18px] rounded-br-md bg-[#1a1f28] px-3.5 py-2.5 text-[13px] leading-7 text-[#e1e6ec]">
          {{ friendly: "سلام! 👋 چطور می‌توانم کمکتان کنم؟", formal: "سلام. در خدمت شما هستم.", expert: "سلام. سوالتان را دقیق بپرسید تا با جزئیات جواب بدهم." }[config.persona]}
        </p>
        <AnimatePresence initial={false}>
          {lines.map((line, index) => (
            <motion.div key={index} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${line.from === "user" ? "items-end" : "items-start"}`}>
              <p className={`max-w-[85%] rounded-[18px] px-3.5 py-2.5 text-[13px] leading-7 ${line.from === "user" ? "rounded-bl-md bg-[#4da3ff] text-white" : "rounded-br-md bg-[#1a1f28] text-[#e1e6ec]"}`}>{line.text}</p>
              {line.handoff && (
                <span className="mt-1.5 flex items-center gap-1.5 rounded-full bg-[#f0b44a]/12 px-2.5 py-1 text-[11px] font-bold text-[#f2cf8a]">
                  <UserCheck className="size-3.5" aria-hidden="true" /> برای تأیید انسانی ارجاع شد
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <span className="flex items-center gap-2 py-1 text-[12px] text-[#8a93a0]">
            <KhayyamMark size={20} state="thinking" /> در حال فکر کردن…
          </span>
        )}
      </div>

      <div className="border-t border-white/6 p-3">
        <div className="mb-2 flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
          {pool.map((item, index) => (
            <button key={item.ask} type="button" onClick={() => ask(index)} className="h-8 shrink-0 rounded-full bg-[#171b22] px-3 text-[11.5px] font-bold text-[#c9d0d9] transition-colors hover:bg-[#1d222b]">
              {item.ask}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => ask(Math.floor(lines.length / 2) % pool.length)} className="flex h-11 w-full items-center gap-2 rounded-2xl bg-[#171b22] pe-1.5 ps-4 text-right text-[13px] text-[#5d6573]">
          <span className="flex-1">یک سوال نمونه بپرسید…</span>
          <span className="flex size-8 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#4da3ff,#7c6cff)] text-white"><ArrowUp className="size-4" aria-hidden="true" /></span>
        </button>
      </div>
    </div>
  );
};
