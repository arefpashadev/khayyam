"use client";

import {
  BadgeCheck,
  BookOpen,
  Bot,
  Briefcase,
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
import { motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { dirOf } from "@/lib/locale";

import { AgentDemo } from "./ai-agent";
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

const visual: Record<ServiceKind, ReactNode> = {
  site: (
    <div className="overflow-hidden rounded-[24px] bg-[#121a2e] ring-1 ring-[#f2ecdf]/[0.08] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
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
  ),
  app: (
    <div className="flex justify-center py-4">
      <AppScene tall />
    </div>
  ),
  ai: (
    <div className="rounded-[24px] bg-[#121a2e] p-5 ring-1 ring-[#f2ecdf]/[0.08] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
      <AiScene tall />
    </div>
  ),
};

const KEYS = ["1", "2", "3", "4", "5", "6"] as const;

/** A landing page for one studio: what it is, what you get, who it's for, how it goes. */
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
      <section className="relative overflow-hidden">
        <span className="pointer-events-none absolute -end-40 top-20 size-[520px] rounded-full bg-[#d9a648] opacity-[0.07] blur-[120px]" aria-hidden="true" />
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 pb-20 pt-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-32">
          <div className="flex flex-col items-start">
            <motion.span {...rise(0)} className="text-[13px] font-bold text-[#e9c27a]">
              {t("eyebrow")}
            </motion.span>
            <motion.h1 {...rise(0.08)} className="mt-3 text-[40px] font-extrabold leading-[1.25] tracking-[-0.01em] sm:text-[54px] lg:text-[66px]">
              {t("title")}
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
          <motion.div {...rise(0.2)} className="mx-auto w-full max-w-[460px]">
            {visual[kind]}
          </motion.div>
        </div>
      </section>

      {/* the AI page shows the agent at work */}
      {kind === "ai" && (
        <section id="demo" className="scroll-mt-6 border-t border-[#f2ecdf]/[0.07]">
          <div className="mx-auto max-w-[1240px] px-5 py-20 lg:px-10 lg:py-28">
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
          <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {KEYS.map((key, index) => {
              const Icon = item.features[index];
              return (
                <motion.li
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease }}
                  className="border-t border-[#f2ecdf]/10 pt-6"
                >
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-[#d9a648]/12 text-[#e9c27a] ring-1 ring-[#d9a648]/25">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-[18px] font-extrabold leading-8">{t(`f${key}`)}</h3>
                  <p className="mt-1.5 max-w-[34ch] text-[14px] leading-7 text-[#9aa3b8]">{t(`f${key}t`)}</p>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* who it's for */}
      <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-10 lg:py-28">
        <Reveal>
          <h2 className="text-[28px] font-extrabold leading-[1.4] lg:text-[40px]">{s("examples")}</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
          {KEYS.map((key, index) => {
            const Icon = item.examples[index];
            return (
              <Reveal key={key} delay={(index % 3) * 0.06}>
                <div className="flex h-full flex-col gap-4 rounded-[24px] bg-[#121a2e] p-5 ring-1 ring-[#f2ecdf]/[0.07] lg:flex-row lg:items-center lg:p-6">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#f2ecdf]/[0.06] text-[#e9c27a]">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="leading-tight">
                    <strong className="block text-[15.5px] font-extrabold">{t(`x${key}`)}</strong>
                    <span className="mt-1 block text-[12.5px] leading-6 text-[#9aa3b8]">{t(`x${key}t`)}</span>
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <div className="border-t border-[#f2ecdf]/[0.07]">
        <Steps />
      </div>

    </div>
  );
};
