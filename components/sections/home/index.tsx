"use client";

import { ArrowLeft, Bell, Check, Search, ShoppingBag, Sparkles } from "lucide-react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";
import { Link } from "@/i18n/navigation";

import { defaultAiConfig, fa, impact, shareChoices } from "../ai-wizard/config";

import { startingPrices, testimonials } from "./content";
import { LanguageSwitch } from "./language-switch";
import { FaceCaption, StudioCube, type Face } from "./studio-cube";

const ease = [0.22, 1, 0.36, 1] as const;

const primary =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#d9a648] px-7 text-[14px] font-extrabold text-[#1c1406] transition-colors hover:bg-[#e8b95e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8b95e]";
const quiet =
  "inline-flex h-12 items-center justify-center rounded-full px-6 text-[14px] font-bold text-[#f2ecdf] ring-1 ring-[#f2ecdf]/25 transition-colors hover:bg-[#f2ecdf]/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8b95e]";
const card = "relative overflow-hidden rounded-[30px] bg-[#121a2e] ring-1 ring-[#f2ecdf]/[0.07]";

/* ------------------------------------------------------------------ */
/* Small motion helpers                                                 */
/* ------------------------------------------------------------------ */

/** Fades content up once, when it scrolls into view. */
const Reveal = ({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) => {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay, ease }}>
      {children}
    </motion.div>
  );
};

/** A number that glides to its value: once when seen, and again whenever the value changes. */
const Count = ({ to, decimals = 0, duration = 1.2 }: { to: number; decimals?: number; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const from = useRef(0);
  const [value, setValue] = useState(0);
  const format = (number: number) => new Intl.NumberFormat("fa-IR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(number);

  useEffect(() => {
    if (!seen || reduce) return;
    const controls = animate(from.current, to, { duration, ease, onUpdate: (latest) => setValue(latest) });
    from.current = to;
    return () => controls.stop();
  }, [seen, to, reduce, duration]);

  return <span ref={ref}>{format(reduce ? to : value)}</span>;
};

/** Steps through a list on a timer while on screen; used by the little live scenes. */
const useTicker = (length: number, every: number) => {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "-40px" });
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!visible || reduce) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % length), every);
    return () => window.clearInterval(timer);
  }, [visible, reduce, length, every]);
  return { ref, index };
};

/* ------------------------------------------------------------------ */
/* Header                                                               */
/* ------------------------------------------------------------------ */

const SiteHeader = () => (
  <header className="absolute inset-x-0 top-0 z-30">
    <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-5 py-5 lg:gap-6 lg:px-10">
      <Link href="/" className="flex items-center gap-2.5" aria-label="خیام، صفحه اصلی">
        <KhayyamMark size={34} />
        <span className="text-[19px] font-extrabold text-[#f2ecdf]">خیام</span>
      </Link>
      <nav aria-label="منوی اصلی" className="ms-6 hidden items-center gap-7 text-[14px] text-[#b9bfcc] lg:flex">
        <Link href="/createsite" className="transition-colors hover:text-[#f2ecdf]">وب‌سایت</Link>
        <Link href="/createapp" className="transition-colors hover:text-[#f2ecdf]">اپلیکیشن</Link>
        <Link href="/createai" className="transition-colors hover:text-[#f2ecdf]">هوش مصنوعی</Link>
        <Link href="/blog" className="transition-colors hover:text-[#f2ecdf]">وبلاگ</Link>
      </nav>
      <div className="ms-auto">
        <LanguageSwitch />
      </div>
      <a href="#start" className="hidden h-9 items-center rounded-full bg-[#f2ecdf] px-5 text-[13px] font-extrabold text-[#0c1222] transition-colors hover:bg-white sm:inline-flex">
        شروع پروژه
      </a>
    </div>
  </header>
);

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */

/** Under the hero title: short lines about Khayyam, each tied to what we promise; one at a time. */
const khayyamLines: ReactNode[] = [
  <>خیام طول سال را <b className="font-extrabold text-[#e9c27a]">۳۶۵٫۲۴۲۱۹</b> روز حساب کرد؛ ما قیمت و زمان پروژه شما را با همین دقت می‌گوییم.</>,
  <>خیام تقویمی ساخت که نزدیک هزار سال است درست کار می‌کند؛ ما محصولی می‌سازیم که سال‌ها بماند.</>,
  <>خیام معادله‌های درجه سه را با هندسه حل کرد؛ ما مسئله کسب‌وکار شما را با نرم‌افزار.</>,
  <>خیام در چهار مصراع یک دنیا حرف زد؛ ما حرف کسب‌وکار شما را در یک صفحه.</>,
  <>خیام می‌گفت «دریاب دمی»؛ ما هم وقت شما را هدر نمی‌دهیم: تحویل از <b className="font-extrabold text-[#e9c27a]">{fa(startingPrices.site.weeks)} هفته</b>.</>,
];

const KhayyamLines = () => {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % khayyamLines.length), 4800);
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative min-h-[96px] lg:min-h-[108px]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease }}
            className="text-[16px] leading-8 text-[#d3d6de] lg:text-[19px] lg:leading-9"
          >
            {khayyamLines[index]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="flex gap-1.5" role="tablist" aria-label="جمله‌ها">
        {khayyamLines.map((_, dot) => (
          <button
            key={dot}
            type="button"
            role="tab"
            aria-selected={dot === index}
            aria-label={`جمله ${fa(dot + 1)}`}
            onClick={() => setIndex(dot)}
            className={`h-1 rounded-full transition-all duration-500 ${dot === index ? "w-7 bg-[#d9a648]" : "w-3 bg-[#f2ecdf]/15 hover:bg-[#f2ecdf]/30"}`}
          />
        ))}
      </div>
    </div>
  );
};

const Hero = () => {
  const reduce = useReducedMotion();
  const [face, setFace] = useState<Face | null>(null);
  const rise = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease } });

  return (
    <section className="relative overflow-hidden">
      <span className="pointer-events-none absolute -left-40 top-24 size-[520px] rounded-full bg-[#d9a648] opacity-[0.07] blur-[120px]" aria-hidden="true" />
      <div className="mx-auto grid min-h-[100svh] max-w-[1240px] items-center gap-10 px-5 pb-16 pt-28 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:pt-24">
        <div className="flex flex-col items-start">
          <motion.span {...rise(0)} className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#f2ecdf]/[0.06] px-3.5 py-1.5 text-[12.5px] font-bold text-[#e9c27a] ring-1 ring-[#d9a648]/25">
            <span className="size-1.5 rotate-45 bg-[#d9a648]" aria-hidden="true" />
            طراحی رایگان؛ اول ببینید، بعد سفارش دهید
          </motion.span>
          <motion.h1 {...rise(0.1)} className="text-[44px] font-extrabold leading-[1.2] tracking-[-0.01em] sm:text-[60px] lg:text-[76px]">
            ساختن،
            <br />
            <span className="bg-[linear-gradient(100deg,#f5d79c,#d9a648_60%,#b8862f)] bg-clip-text text-transparent">با دقت خیام.</span>
          </motion.h1>
          <motion.div {...rise(0.25)} className="mt-6 w-full max-w-[44ch]">
            <KhayyamLines />
          </motion.div>
          <motion.div {...rise(0.4)} className="mt-9 flex flex-wrap gap-3">
            <a href="#start" className={primary}>
              پروژه‌ام را شروع کنم <ArrowLeft className="size-4" aria-hidden="true" />
            </a>
            <a href="#ai" className={quiet}>
              هوش مصنوعی چقدر صرفه‌جویی می‌کند؟
            </a>
          </motion.div>
        </div>

        <div className="mx-auto flex w-full max-w-[460px] flex-col items-center gap-6">
          <StudioCube onChange={setFace} />
          <FaceCaption face={face} />
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 365.24219 — the brand statement                                      */
/* ------------------------------------------------------------------ */

const Precision = () => (
  <section aria-label="دقت خیام" className="border-y border-[#f2ecdf]/10 bg-[#0e1527]">
    <figure className="mx-auto flex max-w-[1240px] flex-col items-center px-5 py-24 text-center lg:py-32">
      <KhayyamMark size={52} />
      <blockquote className="mt-8 flex flex-col gap-2 text-[clamp(26px,3.6vw,48px)] font-extrabold leading-[1.55] text-[#f2ecdf] [text-wrap:balance]">
        <span>«خیام طول سال را <span className="whitespace-nowrap text-[#e9c27a]">۳۶۵٫۲۴۲۱۹</span> روز حساب کرد.</span>
        <span>ما هم کارمان را با همین دقت اندازه می‌گیریم.»</span>
      </blockquote>
      <figcaption className="mt-8 text-[14px] text-[#9aa3b8]">قیمت دقیق، تاریخ تحویل مشخص، قبل از شروع.</figcaption>
    </figure>
  </section>
);

/* ------------------------------------------------------------------ */
/* AI: what it saves                                                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* The AI showcase: input → how it thinks → what it does                */
/* ------------------------------------------------------------------ */

type Case = {
  key: string;
  tab: string;
  role: string;
  input: ReactNode;
  thoughts: string[];
  actions: { text: string; tag: string }[];
  outcome: ReactNode;
};

const InvoiceThumb = () => (
  <div className="relative mx-auto h-[150px] w-[120px] rotate-[-4deg] overflow-hidden rounded-[10px] bg-[#e9e2d2] p-3 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)]">
    <span className="block h-2 w-3/5 rounded-full bg-[#1c1406]/50" />
    <span className="mt-2 block h-1.5 w-2/5 rounded-full bg-[#1c1406]/25" />
    {[0, 1, 2, 3].map((row) => (
      <span key={row} className="mt-3 flex justify-between">
        <span className="h-1.5 w-1/2 rounded-full bg-[#1c1406]/20" />
        <span className="h-1.5 w-1/5 rounded-full bg-[#1c1406]/30" />
      </span>
    ))}
    <span className="mt-4 block h-2.5 w-1/2 rounded-full bg-[#1c1406]/45" />
    <motion.span
      className="absolute inset-x-0 h-8 bg-[linear-gradient(180deg,transparent,rgba(217,166,72,0.55),transparent)]"
      animate={{ top: ["-15%", "100%"] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
      aria-hidden="true"
    />
  </div>
);

const SalesThumb = () => (
  <div className="flex h-[110px] items-end gap-1.5 rounded-[16px] bg-[#0c1222] p-3 ring-1 ring-[#f2ecdf]/[0.07]">
    {[30, 34, 28, 38, 44, 80, 50, 32, 36, 30, 40, 46, 84, 52].map((value, index) => (
      <span key={index} className={`flex-1 rounded-t-[4px] ${value > 70 ? "bg-[#d9a648]" : "bg-[#f2ecdf]/15"}`} style={{ height: `${value}%` }} />
    ))}
  </div>
);

const cases: Case[] = [
  {
    key: "message",
    tab: "پیام مشتری",
    role: "پاسخ‌گوی هوشمند",
    input: (
      <p className="rounded-[18px] rounded-bl-md bg-[#f2ecdf]/[0.07] px-4 py-3 text-[13.5px] leading-7 text-[#dcd6c9]">
        اون مشکیه که هفته پیش تو پیج دیدم، ۴۲ دارین؟ تا پنجشنبه می‌رسه دستم؟
      </p>
    ),
    thoughts: ["می‌خواهد بخرد: کفش چرم مشکی، سایز ۴۲", "«هفته پیش تو پیج» یعنی پست ۱۸ مهر، کد ۲۱۷", "انبار: دو جفت ۴۲ موجود است", "ارسال به تهران: چهارشنبه می‌رسد"],
    actions: [
      { text: "جواب داد", tag: "اینستاگرام" },
      { text: "لینک پرداخت ساخت", tag: "درگاه" },
      { text: "مشتری را ثبت کرد", tag: "CRM" },
    ],
    outcome: <>«بله، دو جفت ۴۲ داریم. اگر تا ساعت ۱۸ ثبت کنید چهارشنبه می‌رسد. لینک پرداخت را بفرستم؟»</>,
  },
  {
    key: "invoice",
    tab: "عکس فاکتور",
    role: "کارمند اداری خودکار",
    input: <InvoiceThumb />,
    thoughts: ["سند: فاکتور خرید از «پخش البرز»", "اقلام را با سفارش خرید شماره ۲۱۲ مقایسه کرد", "یک قلم دو بار حساب شده؛ مبلغ درست ۴۵٬۲۰۰٬۰۰۰ ریال است", "سررسید: ۳۰ روز دیگر"],
    actions: [
      { text: "در حسابداری ثبت کرد", tag: "حسابداری" },
      { text: "مغایرت را به تأمین‌کننده خبر داد", tag: "ایمیل" },
      { text: "یادآور پرداخت گذاشت", tag: "تقویم" },
    ],
    outcome: <>یک فاکتور، بدون تایپ حتی یک عدد؛ و خطایی که از چشم آدم می‌افتاد، پیدا شد.</>,
  },
  {
    key: "data",
    tab: "داده فروش",
    role: "تحلیل‌گر فروش",
    input: <SalesThumb />,
    thoughts: ["پنجشنبه‌ها فروش قهوه نزدیک دو برابر است", "موجودی فعلی فقط برای چهار روز بس است", "تأمین‌کننده سه روزه تحویل می‌دهد", "یعنی اگر امروز سفارش ندهید، پنجشنبه خالی می‌مانید"],
    actions: [
      { text: "پیش‌نویس سفارش خرید ساخت", tag: "انبار" },
      { text: "به مدیر خبر داد", tag: "تلگرام" },
    ],
    outcome: <>«امروز ۳۰ کیلو قهوه سفارش دهید؛ پیش‌نویسش آماده است، فقط تأیید کنید.»</>,
  },
];

const AiShowcase = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "-80px" });
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const item = cases[active];
  const total = item.thoughts.length + item.actions.length + 1;
  const shownStep = reduce ? total : step;

  useEffect(() => {
    if (!visible || reduce || paused) return;
    const timer = window.setTimeout(
      () => {
        if (step < total) setStep(step + 1);
        else {
          setActive((active + 1) % cases.length);
          setStep(0);
        }
      },
      step === 0 ? 700 : step < total ? 850 : 3600,
    );
    return () => window.clearTimeout(timer);
  }, [visible, reduce, paused, step, total, active]);

  const choose = (index: number) => {
    setActive(index);
    setStep(0);
    setPaused(false);
  };

  return (
    <div ref={ref} className={`${card} p-5 lg:p-8`} onMouseEnter={() => setPaused(step >= total)} onMouseLeave={() => setPaused(false)}>
      <span className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[70%] -translate-x-1/2 rounded-full bg-[#d9a648] opacity-[0.08] blur-[100px]" aria-hidden="true" />

      <div className="relative grid grid-cols-3 gap-2 sm:flex" role="tablist" aria-label="نمونه‌ها">
        {cases.map((entry, index) => (
          <button
            key={entry.key}
            type="button"
            role="tab"
            aria-selected={index === active}
            onClick={() => choose(index)}
            className={`relative h-10 overflow-hidden whitespace-nowrap rounded-full px-3 text-[12.5px] font-bold sm:px-4 sm:text-[13px] transition-colors ${index === active ? "bg-[#f2ecdf] text-[#0c1222]" : "bg-[#f2ecdf]/[0.06] text-[#dcd6c9] hover:bg-[#f2ecdf]/10"}`}
          >
            {entry.tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={item.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease }}
          className="relative mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.2fr_1fr] lg:gap-6"
        >
          {/* input */}
          <div className="flex flex-col gap-3">
            <span className="text-[11.5px] font-bold text-[#7f889c]">چیزی که می‌رسد</span>
            <div className="flex min-h-[150px] flex-col justify-center">{item.input}</div>
          </div>

          {/* thinking */}
          <div className="flex flex-col gap-3 rounded-[22px] bg-[#0c1222] p-4 ring-1 ring-[#f2ecdf]/[0.07] lg:p-5">
            <span className="flex items-center gap-2 text-[11.5px] font-bold text-[#e9c27a]">
              <KhayyamMark size={18} state={shownStep > 0 && shownStep <= item.thoughts.length ? "thinking" : "still"} />
              {item.role} فکر می‌کند
            </span>
            <ol className="flex flex-col gap-2.5">
              {item.thoughts.map((thought, index) => (
                <motion.li
                  key={thought}
                  initial={false}
                  animate={shownStep > index ? { opacity: 1, x: 0 } : { opacity: 0.12, x: 8 }}
                  transition={{ duration: 0.35, ease }}
                  className="flex gap-2.5 text-[13px] leading-6 text-[#e4e1d8]"
                >
                  <span className="mt-[7px] size-1.5 shrink-0 rotate-45 bg-[#d9a648]" aria-hidden="true" />
                  {thought}
                </motion.li>
              ))}
            </ol>
          </div>

          {/* actions */}
          <div className="flex flex-col gap-3">
            <span className="text-[11.5px] font-bold text-[#7f889c]">کاری که می‌کند</span>
            <ul className="flex flex-col gap-2">
              {item.actions.map((action, index) => {
                const done = shownStep > item.thoughts.length + index;
                return (
                  <motion.li
                    key={action.text}
                    initial={false}
                    animate={done ? { opacity: 1, y: 0 } : { opacity: 0.12, y: 6 }}
                    transition={{ duration: 0.35, ease }}
                    className="flex items-center gap-2.5 rounded-[14px] bg-[#f2ecdf]/[0.05] px-3 py-2.5 text-[13px] text-[#f2ecdf]"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#2fd08a]/15 text-[#7fd6a8]">
                      <Check className="size-3" strokeWidth={3.2} aria-hidden="true" />
                    </span>
                    <span className="flex-1">{action.text}</span>
                    <span className="rounded-full bg-[#f2ecdf]/[0.07] px-2 py-0.5 text-[10.5px] text-[#9aa3b8]">{action.tag}</span>
                  </motion.li>
                );
              })}
            </ul>
            <motion.p
              initial={false}
              animate={shownStep >= total ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease }}
              className="flex gap-2 rounded-[16px] bg-[#d9a648]/[0.12] px-3.5 py-3 text-[13px] leading-6 text-[#f5e6c6] ring-1 ring-[#d9a648]/25"
            >
              <Sparkles className="mt-1 size-3.5 shrink-0 text-[#e9c27a]" aria-hidden="true" />
              <span>{item.outcome}</span>
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const SavingsCalculator = () => {
  const [staff, setStaff] = useState(3);
  const [share, setShare] = useState(0.5);
  const result = impact({ ...defaultAiConfig, staff, share });

  return (
    <div className={`${card} grid gap-8 p-6 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:p-10`}>
      <span className="pointer-events-none absolute -top-24 left-0 size-72 rounded-full bg-[#d9a648] opacity-[0.12] blur-[90px]" aria-hidden="true" />
      <div className="relative">
        <span className="text-[13px] font-bold text-[#e9c27a]">حساب کنید</span>
        <h3 className="mt-2 text-[22px] font-extrabold leading-[1.5] lg:text-[28px]">این هوش برای شما چقدر می‌ارزد؟</h3>

        <label className="mt-7 block">
          <span className="flex items-center justify-between gap-3 text-[13.5px] text-[#dcd6c9]">
            چند نفر به پیام‌ها، سفارش‌ها و کارهای اداری می‌رسند؟
            <strong className="shrink-0 text-[16px] text-[#f2ecdf]">{fa(staff)} نفر</strong>
          </span>
          <input
            type="range"
            min={1}
            max={20}
            value={staff}
            onChange={(event) => setStaff(Number(event.target.value))}
            className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full accent-[#d9a648]"
            style={{ background: `linear-gradient(to left, #d9a648 ${((staff - 1) / 19) * 100}%, rgba(242,236,223,0.1) 0)` }}
          />
        </label>

        <div className="mt-6">
          <span className="text-[13.5px] text-[#dcd6c9]">چقدر از وقتشان صرف کار تکراری می‌شود؟</span>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {shareChoices.map((choice) => (
              <button
                key={choice.value}
                type="button"
                onClick={() => setShare(choice.value)}
                aria-pressed={share === choice.value}
                className={`h-10 rounded-full text-[12.5px] font-bold transition-colors ${share === choice.value ? "bg-[#d9a648] text-[#1c1406]" : "bg-[#f2ecdf]/[0.06] text-[#dcd6c9] hover:bg-[#f2ecdf]/10"}`}
              >
                {choice.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex flex-col justify-center">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[22px] bg-[#0c1222] p-5 ring-1 ring-[#f2ecdf]/[0.07]">
            <span className="block text-[clamp(34px,5vw,52px)] font-black leading-none text-[#f2ecdf]">
              <Count to={result.hoursSaved} duration={0.6} />
            </span>
            <span className="mt-2 block text-[12.5px] text-[#9aa3b8]">ساعت در ماه آزاد می‌شود</span>
          </div>
          <div className="rounded-[22px] bg-[#d9a648]/[0.1] p-5 ring-1 ring-[#d9a648]/30">
            <span className="block text-[clamp(34px,5vw,52px)] font-black leading-none text-[#e9c27a]">
              <Count to={Math.round(result.monthlySaving)} duration={0.6} />
            </span>
            <span className="mt-2 block text-[12.5px] text-[#dcd6c9]">میلیون تومان در ماه کمتر هزینه</span>
          </div>
        </div>
        <p className="mt-4 text-[12px] leading-6 text-[#7f889c]">برآورد با همان فرمول استودیوی هوش مصنوعی خیام؛ عدد دقیق کسب‌وکارتان را آنجا می‌گیرید.</p>
        <Link href="/createai" className={`${primary} mt-6 self-start`}>
          تیم هوش مصنوعی من را بساز <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

const AiSection = () => (
  <section id="ai" aria-labelledby="ai-title" className="scroll-mt-6">
    <div className="mx-auto max-w-[1240px] px-5 py-24 lg:px-10 lg:py-32">
      <Reveal>
        <span className="text-[13px] font-bold text-[#e9c27a]">هوش مصنوعی</span>
        <h2 id="ai-title" className="mt-3 max-w-[22ch] text-[32px] font-extrabold leading-[1.4] lg:text-[50px]">
          می‌فهمد، می‌خواند، فکر می‌کند.
        </h2>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-8 text-[#b9bfcc]">نه یک ربات با جواب‌های آماده؛ هم‌تیمی‌ای که کسب‌وکار شما را یاد می‌گیرد و کار را از اول تا آخر انجام می‌دهد.</p>
      </Reveal>
      <Reveal className="mt-12">
        <AiShowcase />
      </Reveal>
      <Reveal className="mt-4">
        <SavingsCalculator />
      </Reveal>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Sites & apps: what they do for a business                            */
/* ------------------------------------------------------------------ */

const orders = [
  { time: "۰۲:۱۴", text: "سفارش تازه · ۲ قلم", amount: "۱٫۸ میلیون" },
  { time: "۰۲:۴۱", text: "رزرو نوبت · فردا ۱۰ صبح", amount: "پرداخت شد" },
  { time: "۰۳:۰۵", text: "سفارش تازه · ۱ قلم", amount: "۶۴۰ هزار" },
  { time: "۰۴:۲۷", text: "درخواست مشاوره", amount: "فرم کامل" },
];

const NightSales = () => {
  const { ref, index } = useTicker(orders.length, 2200);
  const list = [0, 1, 2].map((offset) => orders[(index + offset) % orders.length]);
  return (
    <div ref={ref} className="flex h-[176px] flex-col gap-2 overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        {list.map((order) => (
          <motion.div
            key={order.time}
            layout
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45, ease }}
            className="flex items-center gap-3 rounded-[16px] bg-[#0c1222] px-3.5 py-3 ring-1 ring-[#f2ecdf]/[0.07]"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#d9a648]/15 text-[#e9c27a]">
              <ShoppingBag className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-[#dcd6c9]">{order.text}</span>
            <span className="text-[11.5px] tabular-nums text-[#7f889c]">{order.time}</span>
            <span className="text-[12px] font-bold text-[#e9c27a]">{order.amount}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const queries = ["قنادی نزدیک من", "رزرو کلینیک دندانپزشکی", "خرید آنلاین قهوه"];

const SearchRise = () => {
  const { ref, index } = useTicker(queries.length, 3200);
  return (
    <div ref={ref} className="flex h-[176px] flex-col gap-2">
      <div className="flex h-11 items-center gap-2 rounded-full bg-[#0c1222] px-4 ring-1 ring-[#f2ecdf]/[0.09]">
        <Search className="size-4 text-[#7f889c]" aria-hidden="true" />
        <AnimatePresence mode="wait">
          <motion.span key={queries[index]} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-[13px] text-[#dcd6c9]">
            {queries[index]}
          </motion.span>
        </AnimatePresence>
      </div>
      <motion.div key={`you-${index}`} initial={{ y: 50, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3, ease }} className="rounded-[16px] bg-[#d9a648]/[0.1] px-4 py-3 ring-1 ring-[#d9a648]/35">
        <span className="block text-[13.5px] font-bold text-[#f5d79c]">سایت شما · اولین نتیجه</span>
        <span className="text-[12px] text-[#9aa3b8]">سریع، درست برای گوشی و آماده برای گوگل</span>
      </motion.div>
      {[0, 1].map((row) => (
        <div key={row} className="rounded-[16px] bg-[#0c1222] px-4 py-3 opacity-50 ring-1 ring-[#f2ecdf]/[0.05]">
          <span className="block h-2.5 w-2/5 rounded-full bg-[#f2ecdf]/15" />
          <span className="mt-2 block h-2 w-3/4 rounded-full bg-[#f2ecdf]/10" />
        </div>
      ))}
    </div>
  );
};

const ComeBack = () => {
  const { ref, index } = useTicker(2, 2600);
  return (
    <div ref={ref} className="relative mx-auto h-[176px] w-[180px] overflow-hidden rounded-t-[30px] bg-[#0c1222] ring-[6px] ring-[#1a2238]">
      <span className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-[#1a2238]" aria-hidden="true" />
      <span className="absolute inset-x-0 top-8 text-center text-[30px] font-black text-[#f2ecdf]/80">۹:۴۱</span>
      <AnimatePresence>
        {index === 1 && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            className="absolute inset-x-2.5 top-[84px] rounded-[16px] bg-[#f2ecdf]/[0.12] p-2.5 backdrop-blur"
          >
            <span className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#e9c27a]">
              <Bell className="size-3" aria-hidden="true" /> اپ شما
            </span>
            <span className="mt-1 block text-[11.5px] leading-5 text-[#f2ecdf]">قهوه همیشگی‌تان رو دوباره سفارش بدیم؟ ☕</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const products: { title: string; text: string; scene: ReactNode; price: { from: number; weeks: number }; href: string; cta: string }[] = [
  { title: "سایتی که شب هم می‌فروشد", text: "فروشگاه، رزرو یا فرم سفارش؛ مشتری هر ساعتی بخرد، سفارشش ثبت شده و پولش پرداخت شده است.", scene: <NightSales />, price: startingPrices.site, href: "/createsite", cta: "طراحی سایت" },
  { title: "در گوگل دیده می‌شوید", text: "سرعت بالا، نمایش درست روی گوشی و ساختار آماده برای گوگل؛ از روز اول، نه بعداً.", scene: <SearchRise />, price: startingPrices.site, href: "/createsite?mode=quick", cta: "سه سوال، سه طرح آماده" },
  { title: "اپی که مشتری را برمی‌گرداند", text: "اعلان به‌موقع، خرید با یک لمس و باشگاه مشتریان؛ مشتری یک‌بار نمی‌آید، می‌ماند.", scene: <ComeBack />, price: startingPrices.app, href: "/createapp", cta: "طراحی اپلیکیشن" },
];

const Products = () => (
  <section id="start" aria-labelledby="products-title" className="scroll-mt-6 bg-[#0e1527]">
    <div className="mx-auto max-w-[1240px] px-5 py-24 lg:px-10 lg:py-32">
      <Reveal>
        <span className="text-[13px] font-bold text-[#e9c27a]">سایت و اپلیکیشن</span>
        <h2 id="products-title" className="mt-3 max-w-[22ch] text-[32px] font-extrabold leading-[1.4] lg:text-[50px]">
          قشنگ بودن کافی نیست؛ باید کار کند.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {products.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.1} className="h-full">
            <article className={`${card} flex h-full flex-col p-6 lg:p-7`}>
              {item.scene}
              <h3 className="mt-7 text-[20px] font-extrabold leading-[1.5]">{item.title}</h3>
              <p className="mt-2 flex-1 text-[13.5px] leading-7 text-[#9aa3b8]">{item.text}</p>
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#f2ecdf]/[0.08] pt-5">
                <span className="text-[12px] text-[#9aa3b8]">
                  از <strong className="text-[17px] text-[#f2ecdf]">{fa(item.price.from)}</strong> میلیون · {fa(item.price.weeks)} هفته
                </span>
                <Link href={item.href} className="flex items-center gap-1 text-[13px] font-bold text-[#e9c27a] transition-colors hover:text-[#f5d79c]">
                  {item.cta} <ArrowLeft className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* How it works, clients, closing                                       */
/* ------------------------------------------------------------------ */

const Steps = () => (
  <section className="mx-auto max-w-[1240px] px-5 py-24 lg:px-10 lg:py-28">
    <Reveal>
      <h2 className="text-[28px] font-extrabold leading-[1.4] lg:text-[40px]">سه گام تا محصولی که کار می‌کند</h2>
    </Reveal>
    <ol className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-12">
      {[
        { title: "خودتان در استودیو می‌چینید", text: "ظاهر و امکانات را انتخاب می‌کنید و قیمت و زمان را همان لحظه می‌بینید. رایگان." },
        { title: "ما در فیگما کاملش می‌کنیم", text: "طرح دقیق همه صفحه‌ها را برای تأییدتان می‌فرستیم؛ جزو پروژه است." },
        { title: "می‌سازیم و تحویل می‌دهیم", text: "سر تاریخی که گفتیم؛ با راه‌اندازی و پشتیبانی بعد از تحویل." },
      ].map((step, index) => (
        <motion.li
          key={step.title}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: index * 0.12, ease }}
          className="relative border-t border-[#f2ecdf]/15 pt-8"
        >
            <span className="absolute -top-[7px] right-0 size-3.5 rotate-45 bg-[#0c1222] ring-2 ring-[#d9a648]" aria-hidden="true" />
            <span className="text-[40px] font-black leading-none text-[#d9a648]/40">{fa(index + 1)}</span>
            <h3 className="mt-3 text-[20px] font-extrabold">{step.title}</h3>
            <p className="mt-2 max-w-[38ch] text-[14px] leading-7 text-[#9aa3b8]">{step.text}</p>
        </motion.li>
      ))}
    </ol>
  </section>
);

/** Shown only once real client words are added to content.ts; nothing invented appears here. */
const Clients = () => {
  const real = testimonials.filter((item) => !item.placeholder);
  if (real.length === 0) return null;
  return (
    <section className="mx-auto max-w-[1240px] px-5 pb-24 lg:px-10">
      <h2 className="text-[28px] font-extrabold leading-[1.4] lg:text-[40px]">مشتریان ما می‌گویند</h2>
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {real.map((item) => (
          <figure key={item.name} className={`${card} flex flex-col p-7`}>
            {item.result && <p className="text-[22px] font-extrabold leading-[1.5] text-[#e9c27a]">{item.result}</p>}
            <blockquote className="mt-4 flex-1 text-[15px] leading-8 text-[#dcd6c9]">«{item.quote}»</blockquote>
            <figcaption className="mt-6 border-t border-[#f2ecdf]/10 pt-4 text-[13px]">
              <strong className="block text-[#f2ecdf]">{item.name}</strong>
              <span className="text-[#9aa3b8]">{item.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

const Closing = () => (
  <section className="relative overflow-hidden border-t border-[#f2ecdf]/10">
    <span className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[70%] -translate-x-1/2 rounded-full bg-[#d9a648] opacity-[0.08] blur-[100px]" aria-hidden="true" />
    <div className="relative mx-auto flex max-w-[900px] flex-col items-center px-5 py-24 text-center lg:py-32">
      <Reveal className="flex flex-col items-center">
        <KhayyamMark size={44} />
        <blockquote className="mt-8 text-[24px] font-light leading-[1.9] text-[#f2ecdf] lg:text-[34px]">
          این قافله عمر عجب می‌گذرد
          <br />
          دریاب دمی که با طرب می‌گذرد
        </blockquote>
        <p className="mt-6 text-[15px] text-[#b9bfcc]">طرحتان را امروز ببینید؛ رایگان است.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/createsite" className={primary}>طراحی سایت</Link>
          <Link href="/createapp" className={quiet}>طراحی اپلیکیشن</Link>
          <Link href="/createai" className={quiet}>هوش مصنوعی</Link>
        </div>
      </Reveal>
    </div>
  </section>
);

export const HomePage = () => (
  <div dir="rtl" className="relative bg-[#0c1222] text-[#f2ecdf]">
    <SiteHeader />
    <Hero />
    <Precision />
    <AiSection />
    <Products />
    <Steps />
    <Clients />
    <Closing />
  </div>
);
