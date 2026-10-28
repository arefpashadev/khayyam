"use client";

import { ArrowLeft } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";
import { Link, usePathname } from "@/i18n/navigation";
import { formatNumber } from "@/lib/locale";

import { LanguageSwitch } from "./language-switch";

export const ease = [0.22, 1, 0.36, 1] as const;

export const primary =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#d9a648] px-7 text-[14px] font-extrabold text-[#1c1406] transition-colors hover:bg-[#e8b95e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8b95e]";
export const quiet =
  "inline-flex h-12 items-center justify-center rounded-full px-6 text-[14px] font-bold text-[#f2ecdf] ring-1 ring-[#f2ecdf]/25 transition-colors hover:bg-[#f2ecdf]/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8b95e]";
export const card = "relative overflow-hidden rounded-[30px] bg-[#121a2e] ring-1 ring-[#f2ecdf]/[0.07]";

/** "Forward" arrow: points left in RTL, right in LTR. */
export const Forward = ({ className = "size-4" }: { className?: string }) => <ArrowLeft className={`${className} ltr:rotate-180`} aria-hidden="true" />;

/** Fades content up once, when it scrolls into view. */
export const Reveal = ({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) => {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay, ease }}>
      {children}
    </motion.div>
  );
};

/** Steps through a list on a timer while on screen; used by the little live scenes. */
export const useTicker = (length: number, every: number) => {
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

/** The dark header used by the home page and the three service pages. */
export const SiteHeader = ({ cta = { href: "/#start", label: "start" } }: { cta?: { href: string; label: "start" | "startSite" | "startApp" | "startAi" } }) => {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const links = [
    { href: "/website", label: t("site") },
    { href: "/apps", label: t("app") },
    { href: "/ai", label: t("ai") },
    { href: "/blog", label: t("blog") },
  ];
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-5 py-5 lg:gap-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5" aria-label={t("home")}>
          <KhayyamMark size={34} />
          <span className="text-[19px] font-extrabold text-[#f2ecdf]">{t("brand")}</span>
        </Link>
        <nav aria-label={t("main")} className="ms-6 hidden items-center gap-7 text-[14px] text-[#b9bfcc] lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} className={`transition-colors hover:text-[#f2ecdf] ${pathname === link.href ? "text-[#e9c27a]" : ""}`}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ms-auto">
          <LanguageSwitch />
        </div>
        <Link href={cta.href} className="hidden h-9 items-center rounded-full bg-[#f2ecdf] px-5 text-[13px] font-extrabold text-[#0c1222] transition-colors hover:bg-white sm:inline-flex">
          {t(cta.label)}
        </Link>
      </div>
    </header>
  );
};

/** How working with Khayyam goes: three steps on one quiet band. */
export const Steps = () => {
  const t = useTranslations("Steps");
  const locale = useLocale();
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-10 lg:py-28">
      <Reveal className="max-w-[40ch]">
        <h2 className="text-[28px] font-extrabold leading-[1.4] lg:text-[40px]">{t("title")}</h2>
        <p className="mt-3 text-[15px] leading-8 text-[#9aa3b8]">{t("sub")}</p>
      </Reveal>
      <ol className="mt-12 grid border-y border-[#f2ecdf]/10 lg:grid-cols-3">
        {(["s1", "s2", "s3"] as const).map((key, index) => (
          <motion.li
            key={key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: index * 0.12, ease }}
            className={`py-8 lg:px-8 lg:py-10 ${index > 0 ? "border-t border-[#f2ecdf]/10 lg:border-s lg:border-t-0" : "lg:ps-0"}`}
          >
            <span className="block bg-[linear-gradient(180deg,#f5d79c,#b8862f)] bg-clip-text text-[44px] font-black leading-none text-transparent lg:text-[56px]">
              {formatNumber(locale, index + 1, { minimumIntegerDigits: 2, useGrouping: false })}
            </span>
            <h3 className="mt-5 text-[20px] font-extrabold leading-8">{t(key)}</h3>
            <p className="mt-2 max-w-[36ch] text-[14.5px] leading-7 text-[#9aa3b8]">{t(`${key}t`)}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
};
