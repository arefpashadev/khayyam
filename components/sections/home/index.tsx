"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { dirOf } from "@/lib/locale";

import { BlogPicks } from "../blog";

import { AgentDemo } from "./ai-agent";
import { testimonials } from "./content";
import { AiScene, AppScene, SiteScene } from "./scenes";
import { card, ease, Forward, primary, quiet, Reveal, SiteHeader, Steps } from "./shared";
import { FaceCaption, StudioCube, type Face } from "./studio-cube";

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */

const LINES = ["line1", "line2", "line3", "line4"] as const;

/** Under the hero title: a few lines about the studio, one at a time. */
const HeroLines = () => {
  const t = useTranslations("Hero");
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % LINES.length), 4800);
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
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
      <div className="mx-auto grid max-w-[1240px] items-center gap-8 px-5 pb-16 pt-24 lg:min-h-[640px] lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:pb-20 lg:pt-28">
        <div className="flex flex-col items-start">
          <motion.h1 {...rise(0.05)} className="text-[44px] font-extrabold leading-[1.2] tracking-[-0.01em] sm:text-[60px] lg:text-[76px]">
            {t("title1")}
            <br />
            <span className="bg-[linear-gradient(100deg,#f5d79c,#d9a648_60%,#b8862f)] bg-clip-text text-transparent">{t("title2")}</span>
          </motion.h1>
          <motion.div {...rise(0.2)} className="mt-6 w-full max-w-[44ch]">
            <HeroLines />
          </motion.div>
          <motion.div {...rise(0.35)} className="mt-6 flex flex-wrap gap-3">
            <a href="#start" className={primary}>
              {t("cta")} <Forward />
            </a>
            <a href="#ai" className={quiet}>
              {t("ctaAi")}
            </a>
          </motion.div>
        </div>

        <div className="mx-auto flex w-full max-w-[440px] flex-col items-center gap-5">
          <StudioCube onChange={setFace} />
          <FaceCaption face={face} />
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* AI: your agent                                                       */
/* ------------------------------------------------------------------ */

const AiSection = () => {
  const t = useTranslations("Ai");
  return (
    <section id="ai" aria-labelledby="ai-title" className="scroll-mt-6 border-t border-[#f2ecdf]/[0.07]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 lg:px-10 lg:py-32">
        <Reveal className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <span className="text-[13px] font-bold text-[#e9c27a]">{t("eyebrow")}</span>
          <h2 id="ai-title" className="mt-3 text-[32px] font-extrabold leading-[1.4] lg:text-[50px]">
            {t.rich("title", { g: (chunks) => <span className="text-[#e9c27a]">{chunks}</span> })}
          </h2>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-8 text-[#b9bfcc]">{t("sub")}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-12">
          <AgentDemo />
        </Reveal>
        <div className="mt-10 flex justify-center">
          <Link href="/ai" className={primary}>
            {t("cta")} <Forward />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Site, app, AI: what each does for a business                         */
/* ------------------------------------------------------------------ */

const products: { key: "site" | "app" | "ai"; scene: ReactNode; href: string }[] = [
  { key: "site", scene: <SiteScene />, href: "/website" },
  { key: "app", scene: <AppScene />, href: "/apps" },
  { key: "ai", scene: <AiScene />, href: "/ai" },
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
          className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 py-3 [scrollbar-width:none] lg:mx-0 lg:mt-12 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 lg:py-0 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((item) => (
            <article key={item.key} className={`${card} group flex w-[84%] shrink-0 snap-center flex-col bg-[radial-gradient(120%_70%_at_50%_0%,rgba(217,166,72,0.11),transparent_60%),#121a2e] p-5 sm:w-[58%] lg:w-auto lg:p-6`}>
              {item.scene}
              <div className="flex flex-1 flex-col pt-6">
                <h3 className="text-[20px] font-extrabold leading-[1.5]">{t(`${item.key}.title`)}</h3>
                <p className="mt-2 flex-1 text-[13.5px] leading-7 text-[#9aa3b8]">{t(`${item.key}.text`)}</p>
                <Link href={item.href} className="mt-5 flex w-fit items-center gap-1.5 text-[13.5px] font-bold text-[#e9c27a] transition-colors hover:text-[#f5d79c]">
                  {t(`${item.key}.cta`)} <Forward className="size-3.5 transition-transform rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-2 lg:hidden">
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
    <div dir={dirOf(locale)} className="relative overflow-x-clip bg-[#0c1222] text-[#f2ecdf]">
      <SiteHeader />
      <Hero />
      <AiSection />
      <Products />
      <Steps />
      <Clients />
      {locale === "fa" && <BlogPicks />}
    </div>
  );
};
