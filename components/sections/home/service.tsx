"use client";

import {
  BadgeCheck,
  BookOpen,
  Bot,
  Briefcase,
  ChevronDown,
  CreditCard,
  Factory,
  FileSearch,
  Fingerprint,
  Gauge,
  Gift,
  Globe,
  HeartPulse,
  LayoutDashboard,
  LineChart,
  Megaphone,
  MessageCircle,
  Search,
  ServerCog,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  Truck,
  Utensils,
  WifiOff,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { dirOf } from "@/lib/locale";

import { BlogPicks } from "../blog";

import { AgentDemo } from "./ai-agent";
import { StudioDemo } from "./demos";
import { AiScene, AppScene, SiteScene } from "./scenes";
import { ease, Forward, primary, quiet, Reveal, SiteHeader, Steps } from "./shared";

export type ServiceKind = "site" | "app" | "ai";

const config: Record<ServiceKind, { studio: string; quick: string; features: LucideIcon[]; examples: LucideIcon[]; headerCta: "startSite" | "startApp" | "startAi" }> = {
  site: {
    studio: "/createsite",
    quick: "/createsite?mode=quick",
    features: [Gauge, Smartphone, Search, CreditCard, LayoutDashboard, Sparkles],
    examples: [ShoppingBag, Utensils, HeartPulse, BookOpen, Briefcase, Megaphone],
    headerCta: "startSite",
  },
  app: {
    studio: "/createapp",
    quick: "/createapp?mode=quick",
    features: [Smartphone, MessageCircle, Fingerprint, CreditCard, Gift, WifiOff],
    examples: [Store, BadgeCheck, BookOpen, HeartPulse, Gift, Workflow],
    headerCta: "startApp",
  },
  ai: {
    studio: "/createai",
    quick: "#demo",
    features: [Bot, Workflow, FileSearch, Megaphone, LineChart, ServerCog],
    examples: [ShoppingBag, HeartPulse, Truck, BookOpen, Briefcase, Factory],
    headerCta: "startAi",
  },
};

/* ------------------------------------------------------------------ */
/* Hero visual with floating highlights                                 */
/* ------------------------------------------------------------------ */

const Chip = ({ children, className, delay }: { children: ReactNode; className: string; delay: number }) => {
  const reduce = useReducedMotion();
  return (
    <motion.span
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={reduce ? undefined : { opacity: 1, y: [0, -6, 0] }}
      transition={{ opacity: { duration: 0.5, delay }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay } }}
      className={`absolute z-10 flex items-center gap-2 whitespace-nowrap rounded-full bg-[#0c1222]/90 px-3.5 py-2 text-[12.5px] font-bold text-[#f2ecdf] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)] ring-1 ring-[#d9a648]/30 backdrop-blur ${className}`}
    >
      <span className="size-1.5 rounded-full bg-[#d9a648]" aria-hidden="true" />
      {children}
    </motion.span>
  );
};

const HeroVisual = ({ kind }: { kind: ServiceKind }) => {
  const t = useTranslations(`Service.${kind}`);
  const stage =
    kind === "site" ? (
      <div className="overflow-hidden rounded-[24px] bg-[#121a2e] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] ring-1 ring-[#f2ecdf]/[0.08]">
        <div className="flex items-center gap-1.5 border-b border-[#f2ecdf]/[0.07] px-4 py-3" dir="ltr">
          <span className="size-2.5 rounded-full bg-[#f2ecdf]/15" />
          <span className="size-2.5 rounded-full bg-[#f2ecdf]/15" />
          <span className="size-2.5 rounded-full bg-[#f2ecdf]/15" />
          <span className="mx-auto flex h-6 w-1/2 items-center justify-center gap-1.5 rounded-full bg-[#0c1222] text-[10.5px] text-[#7f889c]">
            <Globe className="size-3" aria-hidden="true" /> your-brand.com
          </span>
        </div>
        <div className="p-5">
          <SiteScene tall />
        </div>
      </div>
    ) : kind === "app" ? (
      <div className="flex justify-center py-6">
        <AppScene tall />
      </div>
    ) : (
      <div className="rounded-[24px] bg-[#121a2e] p-5 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] ring-1 ring-[#f2ecdf]/[0.08]">
        <AiScene tall />
      </div>
    );

  return (
    <div className="relative mx-auto w-full max-w-[460px] px-2 py-6">
      <span className="pointer-events-none absolute inset-6 rounded-full bg-[#d9a648] opacity-[0.12] blur-[80px]" aria-hidden="true" />
      <div className="relative">{stage}</div>
      <Chip className="-start-1 top-0 lg:-start-8" delay={0.5}>{t("chip1")}</Chip>
      <Chip className="-end-1 top-1/2 hidden lg:-end-10 lg:flex" delay={0.8}>{t("chip2")}</Chip>
      <Chip className="bottom-0 start-6 lg:-start-4" delay={1.1}>{t("chip3")}</Chip>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* FAQ                                                                  */
/* ------------------------------------------------------------------ */

const KEYS = ["1", "2", "3", "4", "5", "6"] as const;

const Faq = ({ kind }: { kind: ServiceKind }) => {
  const t = useTranslations(`Service.${kind}`);
  const s = useTranslations("Service");
  const [open, setOpen] = useState<string | null>("1");
  return (
    <section className="mx-auto max-w-[920px] px-5 py-20 lg:px-10 lg:py-28">
      <Reveal>
        <h2 className="text-[28px] font-extrabold leading-[1.4] lg:text-[40px]">{s("faq")}</h2>
      </Reveal>
      <div className="mt-10 flex flex-col">
        {(["1", "2", "3", "4"] as const).map((key) => {
          const active = open === key;
          return (
            <div key={key} className="border-b border-[#f2ecdf]/10">
              <button type="button" onClick={() => setOpen(active ? null : key)} aria-expanded={active} className="flex w-full items-center justify-between gap-4 py-5 text-start">
                <span className="text-[16px] font-extrabold leading-7 lg:text-[17px]">{t(`q${key}`)}</span>
                <ChevronDown className={`size-5 shrink-0 text-[#e9c27a] transition-transform ${active ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {active && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
                    <p className="max-w-[64ch] pb-6 text-[14.5px] leading-8 text-[#9aa3b8]">{t(`a${key}`)}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

/** A landing page for one studio: what it is, what you get, who it's for, questions, how it goes. */
export const ServiceLanding = ({ kind }: { kind: ServiceKind }) => {
  const t = useTranslations(`Service.${kind}`);
  const s = useTranslations("Service");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const item = config[kind];
  const rise = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease } });
  const secondary = item.quick.startsWith("#");

  return (
    <div dir={dirOf(locale)} className="relative overflow-x-clip bg-[#0c1222] text-[#f2ecdf]">
      <SiteHeader cta={{ href: item.studio, label: item.headerCta }} />

      {/* hero */}
      <section className="relative">
        <span className="pointer-events-none absolute -end-40 top-20 size-[560px] rounded-full bg-[#d9a648] opacity-[0.07] blur-[130px]" aria-hidden="true" />
        <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 pb-20 pt-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:pb-28 lg:pt-32">
          <div className="flex flex-col items-start">
            <motion.span {...rise(0)} className="text-[13px] font-bold text-[#e9c27a]">
              {t("eyebrow")}
            </motion.span>
            <motion.h1 {...rise(0.08)} className="mt-3 text-[40px] font-extrabold leading-[1.22] tracking-[-0.01em] sm:text-[56px] lg:text-[70px]">
              {t.rich("titleRich", { g: (chunks) => <span className="bg-[linear-gradient(100deg,#f5d79c,#d9a648_60%,#b8862f)] bg-clip-text text-transparent">{chunks}</span> })}
            </motion.h1>
            <motion.p {...rise(0.2)} className="mt-5 max-w-[46ch] text-[16px] leading-8 text-[#c3c8d3] lg:text-[18px] lg:leading-9">
              {t("sub")}
            </motion.p>
            <motion.div {...rise(0.32)} className="mt-8 flex flex-wrap gap-3">
              <Link href={item.studio} className={primary}>
                {t("cta")} <Forward />
              </Link>
              {secondary ? (
                <a href={item.quick} className={quiet}>
                  {t("quick")}
                </a>
              ) : (
                <Link href={item.quick} className={quiet}>
                  {t("quick")}
                </Link>
              )}
            </motion.div>
          </div>
          <motion.div {...rise(0.2)}>
            <HeroVisual kind={kind} />
          </motion.div>
        </div>
      </section>

      {/* the AI page shows the agent at work */}
      {kind === "ai" && (
        <section id="demo" className="scroll-mt-6 border-t border-[#f2ecdf]/[0.07]">
          <div className="mx-auto max-w-[1240px] px-5 py-20 lg:px-10 lg:py-28">
            <Reveal className="mx-auto mb-12 max-w-[680px] text-center">
              <h2 className="text-[28px] font-extrabold leading-[1.4] lg:text-[40px]">{t("demoTitle")}</h2>
            </Reveal>
            <AgentDemo />
          </div>
        </section>
      )}

      {/* what you get */}
      <section className="border-t border-[#f2ecdf]/[0.07] bg-[#0e1527]">
        <div className="mx-auto max-w-[1240px] px-5 py-20 lg:px-10 lg:py-28">
          <Reveal>
            <h2 className="text-[28px] font-extrabold leading-[1.4] lg:text-[40px]">{s("features")}</h2>
          </Reveal>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {KEYS.map((key, index) => {
              const Icon = item.features[index];
              return (
                <motion.li
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease }}
                  className={`group relative overflow-hidden rounded-[26px] p-6 ring-1 transition-colors lg:p-7 ${index === 0 ? "bg-[linear-gradient(140deg,rgba(217,166,72,0.18),rgba(217,166,72,0.04))] ring-[#d9a648]/30" : "bg-[#121a2e] ring-[#f2ecdf]/[0.07] hover:ring-[#d9a648]/25"}`}
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[#d9a648]/15 text-[#e9c27a] ring-1 ring-[#d9a648]/25 transition-transform group-hover:scale-105">
                    <Icon className="size-[22px]" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-[18px] font-extrabold leading-8">{t(`f${key}`)}</h3>
                  <p className="mt-1.5 text-[14px] leading-7 text-[#9aa3b8]">{t(`f${key}t`)}</p>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>

      <StudioDemo kind={kind} />

      <div className="border-t border-[#f2ecdf]/[0.07] bg-[#0e1527]">
        <Steps />
      </div>

      <Faq kind={kind} />
      {locale === "fa" && <BlogPicks kind={kind} />}
    </div>
  );
};
