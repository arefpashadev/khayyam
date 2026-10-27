"use client";

import { ArrowLeft, Bell, Check, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";
import { Link } from "@/i18n/navigation";
import { dirOf, formatNumber } from "@/lib/locale";

import { AgentDemo } from "./ai-agent";
import { testimonials } from "./content";
import { LanguageSwitch } from "./language-switch";
import { FaceCaption, StudioCube, type Face } from "./studio-cube";

const ease = [0.22, 1, 0.36, 1] as const;

const primary =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#d9a648] px-7 text-[14px] font-extrabold text-[#1c1406] transition-colors hover:bg-[#e8b95e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8b95e]";
const quiet =
  "inline-flex h-12 items-center justify-center rounded-full px-6 text-[14px] font-bold text-[#f2ecdf] ring-1 ring-[#f2ecdf]/25 transition-colors hover:bg-[#f2ecdf]/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8b95e]";
const card = "relative overflow-hidden rounded-[30px] bg-[#121a2e] ring-1 ring-[#f2ecdf]/[0.07]";

/** "Forward" arrow: points left in RTL, right in LTR. */
const Forward = ({ className = "size-4" }: { className?: string }) => <ArrowLeft className={`${className} ltr:rotate-180`} aria-hidden="true" />;

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

const SiteHeader = () => {
  const t = useTranslations("Nav");
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-5 py-5 lg:gap-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5" aria-label={t("home")}>
          <KhayyamMark size={34} />
          <span className="text-[19px] font-extrabold text-[#f2ecdf]">{t("brand")}</span>
        </Link>
        <nav aria-label={t("main")} className="ms-6 hidden items-center gap-7 text-[14px] text-[#b9bfcc] lg:flex">
          <Link href="/createsite" className="transition-colors hover:text-[#f2ecdf]">{t("site")}</Link>
          <Link href="/createapp" className="transition-colors hover:text-[#f2ecdf]">{t("app")}</Link>
          <Link href="/createai" className="transition-colors hover:text-[#f2ecdf]">{t("ai")}</Link>
          <Link href="/blog" className="transition-colors hover:text-[#f2ecdf]">{t("blog")}</Link>
        </nav>
        <div className="ms-auto">
          <LanguageSwitch />
        </div>
        <a href="#start" className="hidden h-9 items-center rounded-full bg-[#f2ecdf] px-5 text-[13px] font-extrabold text-[#0c1222] transition-colors hover:bg-white sm:inline-flex">
          {t("start")}
        </a>
      </div>
    </header>
  );
};

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */

const LINES = ["line1", "line2", "line3", "line4"] as const;

/** Under the hero title: a few lines about the studio, one at a time. */
const HeroLines = () => {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % LINES.length), 4800);
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
            {t.rich(LINES[index], { b: (chunks) => <b className="font-extrabold text-[#e9c27a]">{chunks}</b> })}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="flex gap-1.5" role="tablist" aria-label={t("lines")}>
        {LINES.map((key, dot) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={dot === index}
            aria-label={t("line", { n: formatNumber(locale, dot + 1) })}
            onClick={() => setIndex(dot)}
            className={`h-1 rounded-full transition-all duration-500 ${dot === index ? "w-7 bg-[#d9a648]" : "w-3 bg-[#f2ecdf]/15 hover:bg-[#f2ecdf]/30"}`}
          />
        ))}
      </div>
    </div>
  );
};

const Hero = () => {
  const t = useTranslations("Hero");
  const reduce = useReducedMotion();
  const [face, setFace] = useState<Face | null>(null);
  const rise = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease } });

  return (
    <section className="relative overflow-hidden">
      <span className="pointer-events-none absolute -end-40 top-24 size-[520px] rounded-full bg-[#d9a648] opacity-[0.07] blur-[120px]" aria-hidden="true" />
      <div className="mx-auto grid min-h-[100svh] max-w-[1240px] items-center gap-10 px-5 pb-16 pt-28 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:pt-24">
        <div className="flex flex-col items-start">
          <motion.span {...rise(0)} className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#f2ecdf]/[0.06] px-3.5 py-1.5 text-[12.5px] font-bold text-[#e9c27a] ring-1 ring-[#d9a648]/25">
            <span className="size-1.5 rotate-45 bg-[#d9a648]" aria-hidden="true" />
            {t("badge")}
          </motion.span>
          <motion.h1 {...rise(0.1)} className="text-[44px] font-extrabold leading-[1.2] tracking-[-0.01em] sm:text-[60px] lg:text-[76px]">
            {t("title1")}
            <br />
            <span className="bg-[linear-gradient(100deg,#f5d79c,#d9a648_60%,#b8862f)] bg-clip-text text-transparent">{t("title2")}</span>
          </motion.h1>
          <motion.div {...rise(0.25)} className="mt-6 w-full max-w-[44ch]">
            <HeroLines />
          </motion.div>
          <motion.div {...rise(0.4)} className="mt-9 flex flex-wrap gap-3">
            <a href="#start" className={primary}>
              {t("cta")} <Forward />
            </a>
            <a href="#ai" className={quiet}>
              {t("ctaAi")}
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
/* AI: a chat with the agent                                            */
/* ------------------------------------------------------------------ */

const AiSection = () => {
  const t = useTranslations("Ai");
  return (
    <section id="ai" aria-labelledby="ai-title" className="scroll-mt-6 border-t border-[#f2ecdf]/[0.07]">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-24 lg:grid-cols-[1fr_1.05fr] lg:gap-20 lg:px-10 lg:py-32">
        <Reveal>
          <span className="text-[13px] font-bold text-[#e9c27a]">{t("eyebrow")}</span>
          <h2 id="ai-title" className="mt-3 max-w-[16ch] text-[32px] font-extrabold leading-[1.4] lg:text-[50px]">
            {t.rich("title", { g: (chunks) => <span className="text-[#e9c27a]">{chunks}</span> })}
          </h2>
          <p className="mt-4 max-w-[46ch] text-[15px] leading-8 text-[#b9bfcc]">{t("sub")}</p>
          <ul className="mt-8 flex flex-col gap-3">
            {(["can1", "can2", "can3", "can4"] as const).map((key) => (
              <li key={key} className="flex items-center gap-3 text-[14.5px] text-[#e4e1d8]">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#d9a648]/15 text-[#e9c27a]">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                {t(key)}
              </li>
            ))}
          </ul>
          <Link href="/createai" className={`${primary} mt-10`}>
            {t("cta")} <Forward />
          </Link>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto w-full max-w-[520px]">
          <AgentDemo />
        </Reveal>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Site, app, AI: what each does for a business                         */
/* ------------------------------------------------------------------ */

const ORDERS = ["o1", "o2", "o3", "o4"] as const;

const NightSales = () => {
  const t = useTranslations("Products");
  const { ref, index } = useTicker(ORDERS.length, 2200);
  const list = [0, 1, 2].map((offset) => ORDERS[(index + offset) % ORDERS.length]);
  return (
    <div ref={ref} className="flex h-[176px] flex-col gap-2 overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        {list.map((order) => (
          <motion.div
            key={order}
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
            <span className="min-w-0 flex-1 truncate text-[13px] text-[#dcd6c9]">{t(order)}</span>
            <span className="text-[11.5px] tabular-nums text-[#7f889c]">{t(`${order}t`)}</span>
            <span className="text-[12px] font-bold text-[#e9c27a]">{t(`${order}a`)}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const AiReply = () => {
  const t = useTranslations("Products");
  const { ref, index } = useTicker(5, 1400);
  return (
    <div ref={ref} className="flex h-[176px] flex-col gap-2 overflow-hidden">
      <p className="max-w-[92%] self-end rounded-[16px] rounded-ee-md bg-[#f2ecdf]/[0.07] px-3 py-2 text-[12.5px] leading-6 text-[#dcd6c9]">{t("ask")}</p>
      <div className="flex min-h-[26px] flex-wrap gap-1.5">
        {(["c1", "c2", "c3"] as const).map((chip, chipIndex) => (
          <motion.span
            key={chip}
            initial={false}
            animate={index >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index >= 1 ? chipIndex * 0.1 : 0, ease }}
            className="rounded-full bg-[#d9a648]/[0.12] px-2.5 py-0.5 text-[11px] font-bold text-[#f5d79c] ring-1 ring-[#d9a648]/30"
          >
            {t(chip)}
          </motion.span>
        ))}
      </div>
      <motion.p
        initial={false}
        animate={index >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.4, ease }}
        className="max-w-[92%] self-start rounded-[16px] rounded-es-md bg-[#d9a648]/[0.14] px-3 py-2 text-[12.5px] leading-6 text-[#f5e6c6]"
      >
        {t("reply")}
      </motion.p>
      <motion.span initial={false} animate={{ opacity: index >= 3 ? 1 : 0 }} className="mt-auto flex items-center gap-1.5 text-[11.5px] font-bold text-[#7fd6a8]">
        <span className="size-1.5 rounded-full bg-[#2fd08a]" /> {t("booked")}
      </motion.span>
    </div>
  );
};

const ComeBack = () => {
  const t = useTranslations("Products");
  const { ref, index } = useTicker(2, 2600);
  return (
    <div ref={ref} className="relative mx-auto h-[176px] w-[180px] overflow-hidden rounded-t-[30px] bg-[#0c1222] ring-[6px] ring-[#1a2238]">
      <span className="absolute inset-x-0 top-2 mx-auto h-1.5 w-12 rounded-full bg-[#1a2238]" aria-hidden="true" />
      <span className="absolute inset-x-0 top-8 text-center text-[30px] font-black text-[#f2ecdf]/80">{t("clock")}</span>
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
              <Bell className="size-3" aria-hidden="true" /> {t("yourApp")}
            </span>
            <span className="mt-1 block text-[11.5px] leading-5 text-[#f2ecdf]">{t("push")}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const products: { key: "site" | "app" | "ai"; scene: ReactNode; href: string }[] = [
  { key: "site", scene: <NightSales />, href: "/createsite" },
  { key: "app", scene: <ComeBack />, href: "/createapp" },
  { key: "ai", scene: <AiReply />, href: "/createai" },
];

const SLIDE_MS = 6500;

/**
 * Phones: one card at a time in a sideways carousel that moves on by itself once the
 * card's little scene has played; a swipe takes over. Desktop: the three side by side.
 */
const Products = () => {
  const t = useTranslations("Products");
  const reduce = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const visible = useInView(scroller, { margin: "-80px" });
  const [active, setActive] = useState(0);
  const touched = useRef(0);

  const go = (index: number) => {
    const box = scroller.current;
    const child = box?.children[index] as HTMLElement | undefined;
    if (!box || !child) return;
    const outer = box.getBoundingClientRect();
    const inner = child.getBoundingClientRect();
    box.scrollBy({ left: inner.left - outer.left - (outer.width - inner.width) / 2, behavior: reduce ? "auto" : "smooth" });
  };

  useEffect(() => {
    if (!visible || reduce) return;
    const timer = window.setInterval(() => {
      if (window.matchMedia("(min-width: 1024px)").matches) return;
      if (Date.now() - touched.current < SLIDE_MS) return;
      go((active + 1) % products.length);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  });

  const onScroll = () => {
    const box = scroller.current;
    if (!box) return;
    const center = box.getBoundingClientRect().left + box.clientWidth / 2;
    let best = 0;
    let distance = Infinity;
    Array.from(box.children).forEach((child, index) => {
      const rect = child.getBoundingClientRect();
      const gap = Math.abs(rect.left + rect.width / 2 - center);
      if (gap < distance) {
        distance = gap;
        best = index;
      }
    });
    if (best !== active) setActive(best);
  };

  return (
    <section id="start" aria-labelledby="products-title" className="scroll-mt-6 bg-[#0e1527]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 lg:px-10 lg:py-32">
        <Reveal>
          <h2 id="products-title" className="max-w-[22ch] text-[32px] font-extrabold leading-[1.4] lg:text-[50px]">
            {t("title")}
          </h2>
        </Reveal>
        <div
          ref={scroller}
          onScroll={onScroll}
          onTouchStart={() => (touched.current = Date.now())}
          onPointerDown={() => (touched.current = Date.now())}
          className="-mx-5 mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((item) => (
            <article key={item.key} className={`${card} group flex w-[86%] shrink-0 snap-center flex-col p-3 sm:w-[60%] lg:w-auto`}>
              <div className="relative overflow-hidden rounded-[24px] bg-[radial-gradient(120%_90%_at_50%_0%,rgba(217,166,72,0.14),transparent_60%),#0f1628] p-5 ring-1 ring-[#f2ecdf]/[0.06]">{item.scene}</div>
              <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                <h3 className="text-[20px] font-extrabold leading-[1.5]">{t(`${item.key}.title`)}</h3>
                <p className="mt-2 flex-1 text-[13.5px] leading-7 text-[#9aa3b8]">{t(`${item.key}.text`)}</p>
                <Link href={item.href} className="mt-5 flex w-fit items-center gap-1.5 text-[13.5px] font-bold text-[#e9c27a] transition-colors hover:text-[#f5d79c]">
                  {t(`${item.key}.cta`)} <Forward className="size-3.5 transition-transform rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-5 flex justify-center gap-2 lg:hidden">
          {products.map((item, index) => (
            <button
              key={item.key}
              type="button"
              aria-label={t(`${item.key}.title`)}
              aria-current={index === active ? "true" : undefined}
              onClick={() => {
                touched.current = Date.now();
                go(index);
              }}
              className={`relative h-1.5 overflow-hidden rounded-full bg-[#f2ecdf]/15 transition-all duration-300 ${index === active ? "w-10" : "w-4"}`}
            >
              {index === active && (
                <motion.span
                  key={`fill-${active}`}
                  className="absolute inset-y-0 start-0 bg-[#d9a648]"
                  initial={{ width: reduce ? "100%" : "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* How it works, clients                                                */
/* ------------------------------------------------------------------ */

const Steps = () => {
  const t = useTranslations("Steps");
  const locale = useLocale();
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 lg:px-10 lg:py-28">
      <Reveal>
        <h2 className="text-[28px] font-extrabold leading-[1.4] lg:text-[40px]">{t("title")}</h2>
      </Reveal>
      <ol className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-12">
        {(["s1", "s2", "s3"] as const).map((key, index) => (
          <motion.li
            key={key}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: index * 0.12, ease }}
            className="relative border-t border-[#f2ecdf]/15 pt-8"
          >
            <span className="absolute -top-[7px] start-0 size-3.5 rotate-45 bg-[#0c1222] ring-2 ring-[#d9a648]" aria-hidden="true" />
            <span className="text-[40px] font-black leading-none text-[#d9a648]/40">{formatNumber(locale, index + 1)}</span>
            <h3 className="mt-3 text-[20px] font-extrabold">{t(key)}</h3>
            <p className="mt-2 max-w-[38ch] text-[14px] leading-7 text-[#9aa3b8]">{t(`${key}t`)}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
};

/** Shown only once real client words are added to content.ts; nothing invented appears here. */
const Clients = () => {
  const t = useTranslations("Clients");
  const real = testimonials.filter((item) => !item.placeholder);
  if (real.length === 0) return null;
  return (
    <section className="mx-auto max-w-[1240px] px-5 pb-24 lg:px-10">
      <h2 className="text-[28px] font-extrabold leading-[1.4] lg:text-[40px]">{t("title")}</h2>
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {real.map((item) => (
          <figure key={item.name} className={`${card} flex flex-col p-7`}>
            {item.result && <p className="text-[22px] font-extrabold leading-[1.5] text-[#e9c27a]">{item.result}</p>}
            <blockquote className="mt-4 flex-1 text-[15px] leading-8 text-[#dcd6c9]">“{item.quote}”</blockquote>
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

export const HomePage = () => {
  const locale = useLocale();
  return (
    <div dir={dirOf(locale)} className="relative bg-[#0c1222] text-[#f2ecdf]">
      <SiteHeader />
      <Hero />
      <AiSection />
      <Products />
      <Steps />
      <Clients />
    </div>
  );
};
