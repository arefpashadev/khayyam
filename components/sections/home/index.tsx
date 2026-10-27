"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";
import { Link } from "@/i18n/navigation";

import { FaceCaption, StudioCube, type Face } from "./studio-cube";

const C = { ivory: "#f2ecdf", gold: "#d9a648" };

const primary =
  "inline-flex h-12 items-center justify-center rounded-full bg-[#d9a648] px-7 text-[14px] font-extrabold text-[#1c1406] transition-colors hover:bg-[#e8b95e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8b95e]";
const quiet =
  "inline-flex h-12 items-center justify-center rounded-full px-6 text-[14px] font-bold text-[#f2ecdf] ring-1 ring-[#f2ecdf]/25 transition-colors hover:bg-[#f2ecdf]/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8b95e]";

/* ------------------------------------------------------------------ */
/* Line drawings for the three studios, in the cube's language          */
/* ------------------------------------------------------------------ */

const stroke = { fill: "none", stroke: C.ivory, strokeOpacity: 0.75, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const SiteDrawing = () => (
  <svg viewBox="0 0 360 240" className="h-auto w-full" aria-hidden="true">
    <rect x="10" y="14" width="340" height="212" rx="14" {...stroke} />
    <line x1="10" y1="44" x2="350" y2="44" {...stroke} strokeOpacity={0.35} />
    {[30, 44, 58].map((x) => (
      <circle key={x} cx={x} cy="29" r="4" {...stroke} strokeOpacity={0.5} />
    ))}
    <line x1="210" y1="84" x2="320" y2="84" {...stroke} strokeWidth={6} />
    <line x1="230" y1="104" x2="320" y2="104" {...stroke} strokeWidth={6} />
    <line x1="250" y1="128" x2="320" y2="128" {...stroke} strokeOpacity={0.4} />
    <line x1="235" y1="140" x2="320" y2="140" {...stroke} strokeOpacity={0.4} />
    <rect x="262" y="160" width="58" height="22" rx="11" fill={C.gold} />
    <rect x="40" y="70" width="140" height="120" rx="10" {...stroke} strokeOpacity={0.5} />
    <path d="M40 160 L88 118 L120 146 L144 126 L180 160" {...stroke} strokeOpacity={0.5} />
    <circle cx="140" cy="96" r="10" {...stroke} stroke={C.gold} strokeOpacity={1} />
  </svg>
);

const AppDrawing = () => (
  <svg viewBox="0 0 360 240" className="h-auto w-full" aria-hidden="true">
    <rect x="126" y="6" width="108" height="228" rx="22" {...stroke} />
    <rect x="160" y="14" width="40" height="9" rx="4.5" {...stroke} strokeOpacity={0.5} />
    {[50, 92, 134].map((y, index) => (
      <g key={y}>
        <rect x="140" y={y} width="80" height="32" rx="8" {...stroke} strokeOpacity={index === 0 ? 0.9 : 0.4} />
        <circle cx="206" cy={y + 16} r="7" {...stroke} stroke={index === 0 ? C.gold : C.ivory} strokeOpacity={index === 0 ? 1 : 0.4} />
      </g>
    ))}
    <line x1="140" y1="200" x2="220" y2="200" {...stroke} strokeOpacity={0.35} />
    {[150, 180, 210].map((x, index) => (
      index === 2 ? <circle key={x} cx={x} cy="216" r="4" fill={C.gold} /> : <circle key={x} cx={x} cy="216" r="4" {...stroke} strokeOpacity={0.5} />
    ))}
    <rect x="34" y="70" width="72" height="72" rx="17" {...stroke} strokeOpacity={0.5} />
    <rect x="254" y="70" width="72" height="72" rx="17" fill={C.gold} fillOpacity={0.9} />
  </svg>
);

const AiDrawing = () => (
  <svg viewBox="0 0 360 240" className="h-auto w-full" aria-hidden="true">
    {[
      { y: 22, x: 40 },
      { y: 92, x: 80 },
      { y: 162, x: 120 },
    ].map((card, index) => (
      <g key={card.y}>
        <rect x={card.x} y={card.y} width="200" height="56" rx="14" {...stroke} strokeOpacity={index === 1 ? 0.9 : 0.45} />
        <line x1={card.x + 200} y1={card.y + 12} x2={card.x + 200} y2={card.y + 44} stroke={C.gold} strokeWidth="3" strokeLinecap="round" />
        <rect x={card.x + 150} y={card.y + 14} width="28" height="28" rx="8" {...stroke} strokeOpacity={0.6} />
        <line x1={card.x + 54} y1={card.y + 22} x2={card.x + 136} y2={card.y + 22} {...stroke} strokeWidth={5} strokeOpacity={index === 1 ? 0.9 : 0.5} />
        <line x1={card.x + 80} y1={card.y + 38} x2={card.x + 136} y2={card.y + 38} {...stroke} strokeOpacity={0.35} />
      </g>
    ))}
  </svg>
);

const studios: { key: Face; title: string; lead: string; gets: string[]; href: string; cta: string; quick?: string; drawing: ReactNode }[] = [
  {
    key: "site",
    title: "وب‌سایت",
    lead: "رنگ، گوشه‌ها، نوشته و چیدمان را خودتان انتخاب می‌کنید و همان لحظه روی لپ‌تاپ و گوشی می‌بینید.",
    gets: ["ده چیدمان متفاوت برای صفحه اول", "فروشگاه، رزرو، پنل داخلی یا پلتفرم جامعه", "نسخه وب‌اپ که روی گوشی نصب می‌شود"],
    href: "/createsite",
    cta: "طراحی سایتم را شروع کنم",
    quick: "/createsite?mode=quick",
    drawing: <SiteDrawing />,
  },
  {
    key: "app",
    title: "اپلیکیشن",
    lead: "آیفون، اندروید یا هر دو. اپ داخل گوشی پیش‌نمایش واقعاً کار می‌کند؛ بزنید و ببینید.",
    gets: ["ناوبری، صفحه‌ها و آیکون به انتخاب شما", "ورود با چهره، حالت تیره، باشگاه مشتریان و…", "دستیار هوشمند درون اپ"],
    href: "/createapp",
    cta: "طراحی اپلیکیشنم را شروع کنم",
    quick: "/createapp?mode=quick",
    drawing: <AppDrawing />,
  },
  {
    key: "ai",
    title: "هوش مصنوعی",
    lead: "با خیام حرف می‌زنید و او تیمی هوش مصنوعی برایتان می‌چیند که کارهای تکراری را شبانه‌روز انجام می‌دهد.",
    gets: ["پاسخ‌گویی به مشتری در سایت و پیام‌رسان‌ها", "خواندن فاکتور و سند، گزارش آماده هر صبح", "پروژه‌های اختصاصی برای کارخانه، پزشکی و مالی"],
    href: "/createai",
    cta: "گفتگو با خیام را شروع کنم",
    drawing: <AiDrawing />,
  },
];

const steps = [
  { title: "شما طراحی می‌کنید", text: "در استودیو ظاهر و امکانات را انتخاب می‌کنید و نتیجه را همان لحظه می‌بینید." },
  { title: "ما در فیگما کاملش می‌کنیم", text: "طرح دقیق همه صفحه‌ها را برای تأیید می‌فرستیم. این بخش جزو پروژه است و جدا حساب نمی‌شود." },
  { title: "می‌سازیم و تحویل می‌دهیم", text: "کد تمیز، راه‌اندازی و پشتیبانی؛ تا روزی که محصولتان به کار بیفتد." },
];

/* ------------------------------------------------------------------ */

const SiteHeader = () => (
  <header className="absolute inset-x-0 top-0 z-30">
    <div className="mx-auto flex max-w-[1240px] items-center gap-6 px-5 py-5 lg:px-10">
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
      <a href="#studios" className="ms-auto inline-flex h-10 items-center rounded-full px-5 text-[13px] font-bold text-[#f2ecdf] ring-1 ring-[#f2ecdf]/25 transition-colors hover:bg-[#f2ecdf]/[0.06]">
        شروع پروژه
      </a>
    </div>
  </header>
);

export const HomePage = () => {
  const reduce = useReducedMotion();
  const [face, setFace] = useState<Face>("ai");
  const rise = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const } });

  return (
    <div dir="rtl" className="relative bg-[#0c1222] text-[#f2ecdf]">
      <SiteHeader />

      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[100svh] max-w-[1240px] items-center gap-10 px-5 pb-16 pt-28 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:pt-24">
          <div className="flex flex-col items-start">
            <motion.h1 {...rise(0.1)} className="text-[44px] font-extrabold leading-[1.2] tracking-[-0.01em] sm:text-[60px] lg:text-[76px]">
              ساختن،
              <br />
              با دقت خیام.
            </motion.h1>
            <motion.p {...rise(0.25)} className="mt-6 max-w-[42ch] text-[16px] leading-8 text-[#b9bfcc] lg:text-[18px] lg:leading-9">
              سایت، اپلیکیشن و هوش مصنوعی برای کسب‌وکارها. شما طرحش را همین‌جا می‌چینید؛ ما در فیگما کاملش می‌کنیم و می‌سازیم.
            </motion.p>
            <motion.div {...rise(0.4)} className="mt-9 flex flex-wrap gap-3">
              <a href="#studios" className={primary}>
                پروژه‌ام را شروع کنم
              </a>
              <Link href="/createsite?mode=quick" className={quiet}>
                سه سوال، سه طرح آماده
              </Link>
            </motion.div>
          </div>

          <div className="mx-auto flex w-full max-w-[460px] flex-col items-center gap-6">
            <StudioCube onChange={setFace} />
            <FaceCaption face={face} />
          </div>
        </div>
        <p className="mx-auto max-w-[1240px] border-t border-[#f2ecdf]/10 px-5 py-5 text-[13px] text-[#8790a6] lg:px-10">
          خیام طول سال را <span className="text-[#e9c27a]">۳۶۵٫۲۴۲۱۹</span> روز حساب کرد. ما هم کارمان را با همین دقت اندازه می‌گیریم.
        </p>
      </section>

      {/* studios */}
      <section id="studios" className="scroll-mt-6 bg-[#0e1527]">
        <div className="mx-auto max-w-[1240px] px-5 py-20 lg:px-10 lg:py-28">
          <h2 className="max-w-[22ch] text-[30px] font-extrabold leading-[1.4] lg:text-[44px]">از کجا شروع کنیم؟</h2>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-8 text-[#b9bfcc]">هر کدام یک استودیوی کامل است. طراحی رایگان است؛ وقتی پسندیدید سفارش می‌دهید.</p>

          <div className="mt-14 flex flex-col">
            {studios.map((studio) => (
              <article key={studio.key} id={studio.key} className="grid items-center gap-10 border-t border-[#f2ecdf]/10 py-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:py-16">
                <div>
                  <h3 className="text-[30px] font-extrabold lg:text-[40px]">{studio.title}</h3>
                  <p className="mt-4 max-w-[46ch] text-[15px] leading-8 text-[#b9bfcc] lg:text-[16px]">{studio.lead}</p>
                  <ul className="mt-6 flex flex-col gap-2.5">
                    {studio.gets.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-[14px] text-[#dcd6c9]">
                        <span className="size-1.5 shrink-0 rotate-45 bg-[#d9a648]" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link href={studio.href} className={primary}>
                      {studio.cta}
                    </Link>
                    {studio.quick && (
                      <Link href={studio.quick} className="text-[14px] font-bold text-[#e9c27a] underline decoration-[#d9a648]/40 underline-offset-[6px] hover:text-[#f5d79c]">
                        مسیر سریع با سه سوال
                      </Link>
                    )}
                  </div>
                </div>
                <div className="rounded-[28px] bg-[#121a2e] p-8 ring-1 ring-[#f2ecdf]/[0.07] lg:p-12">{studio.drawing}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* process */}
      <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-10 lg:py-28">
        <h2 className="text-[30px] font-extrabold leading-[1.4] lg:text-[44px]">از طرح تا تحویل</h2>
        <ol className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-12">
          {steps.map((step, index) => (
            <li key={step.title} className="relative border-t border-[#f2ecdf]/15 pt-8">
              <span className="absolute -top-[7px] right-0 size-3.5 rotate-45 bg-[#0c1222] ring-2 ring-[#d9a648]" aria-hidden="true" />
              <span className="text-[13px] font-bold text-[#e9c27a]">گام {["اول", "دوم", "سوم"][index]}</span>
              <h3 className="mt-2 text-[21px] font-extrabold">{step.title}</h3>
              <p className="mt-3 max-w-[38ch] text-[14.5px] leading-8 text-[#b9bfcc]">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* closing */}
      <section className="border-t border-[#f2ecdf]/10">
        <div className="mx-auto flex max-w-[900px] flex-col items-center px-5 py-24 text-center lg:py-32">
          <KhayyamMark size={44} />
          <blockquote className="mt-8 text-[26px] font-light leading-[1.9] text-[#f2ecdf] lg:text-[38px]">
            این قافله عمر عجب می‌گذرد
            <br />
            دریاب دمی که با طرب می‌گذرد
          </blockquote>
          <span className="mt-4 text-[13px] text-[#8790a6]">عمر خیام</span>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link href="/createsite" className={primary}>
              طراحی سایت
            </Link>
            <Link href="/createapp" className={quiet}>
              طراحی اپلیکیشن
            </Link>
            <Link href="/createai" className={quiet}>
              هوش مصنوعی
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
