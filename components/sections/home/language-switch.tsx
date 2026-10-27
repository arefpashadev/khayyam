"use client";

import { Check, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

/** Flags drawn as SVG so they look the same on every system (emoji flags don't on Windows). */
const Flag = ({ code, className = "h-3.5 w-5" }: { code: Locale; className?: string }) => {
  const box = { viewBox: "0 0 30 20", className: `${className} shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/20`, "aria-hidden": true as const, preserveAspectRatio: "none" };
  switch (code) {
    case "fa":
      return (
        <svg {...box}>
          <rect width="30" height="20" fill="#fff" />
          <rect width="30" height="6.67" fill="#239f40" />
          <rect y="13.33" width="30" height="6.67" fill="#da0000" />
          <circle cx="15" cy="10" r="2" fill="none" stroke="#da0000" strokeWidth="1.1" />
        </svg>
      );
    case "de":
      return (
        <svg {...box}>
          <rect width="30" height="6.67" fill="#000" />
          <rect y="6.67" width="30" height="6.67" fill="#dd0000" />
          <rect y="13.33" width="30" height="6.67" fill="#ffce00" />
        </svg>
      );
    case "ar":
      return (
        <svg {...box}>
          <rect width="30" height="6.67" fill="#00732f" />
          <rect y="6.67" width="30" height="6.67" fill="#fff" />
          <rect y="13.33" width="30" height="6.67" fill="#000" />
          <rect width="8" height="20" fill="#ff0000" />
        </svg>
      );
    default:
      return (
        <svg {...box}>
          <rect width="30" height="20" fill="#012169" />
          <path d="M0 0 30 20M30 0 0 20" stroke="#fff" strokeWidth="4" />
          <path d="M0 0 30 20M30 0 0 20" stroke="#c8102e" strokeWidth="1.4" />
          <path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6" />
          <path d="M15 0v20M0 10h30" stroke="#c8102e" strokeWidth="3.4" />
        </svg>
      );
  }
};

const names: Record<Locale, { short: string; full: string; sub: string }> = {
  fa: { short: "فا", full: "فارسی", sub: "Persian" },
  en: { short: "En", full: "English", sub: "انگلیسی" },
  ar: { short: "عر", full: "العربية", sub: "عربی" },
  de: { short: "De", full: "Deutsch", sub: "آلمانی" },
};

const noop = () => () => {};

const order: Locale[] = ["fa", "en", "ar", "de"];

/** The header's language switch: the country flag and «فا»; tapping opens a bottom sheet. */
export const LanguageSwitch = () => {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const choose = (code: Locale) => {
    setOpen(false);
    if (code !== locale) router.replace(pathname, { locale: code });
  };

  const current = names[locale] ?? names.fa;

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`زبان: ${current.full}`}
        onClick={() => setOpen(true)}
        className="flex h-9 items-center gap-2 rounded-full px-3 text-[13px] font-bold text-[#dcd6c9] ring-1 ring-[#f2ecdf]/12 transition-colors hover:bg-[#f2ecdf]/[0.06] hover:text-[#f2ecdf] focus-visible:outline-2 focus-visible:outline-[#e8b95e]"
      >
        <Flag code={locale} />
        {current.short}
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-[200]" dir="rtl">
                <motion.button
                  type="button"
                  aria-label="بستن"
                  onClick={() => setOpen(false)}
                  className="absolute inset-0 bg-[rgba(4,6,12,0.62)] backdrop-blur-[2px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="انتخاب زبان"
                  drag={reduce ? false : "y"}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.6 }}
                  onDragEnd={(_, info) => (info.offset.y > 90 || info.velocity.y > 500) && setOpen(false)}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", bounce: 0, duration: 0.42 }}
                  className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[460px] rounded-t-[30px] bg-[#121a2e] px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 text-[#f2ecdf] shadow-[0_-30px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-[#f2ecdf]/10"
                >
                  <span className="mx-auto block h-1.5 w-11 rounded-full bg-[#f2ecdf]/20" aria-hidden="true" />
                  <div className="mt-4 flex items-center justify-between px-2">
                    <div>
                      <strong className="block text-[18px] font-extrabold">زبان سایت</strong>
                      <span className="text-[12.5px] text-[#9aa3b8]">Language · اللغة · Sprache</span>
                    </div>
                    <button type="button" onClick={() => setOpen(false)} aria-label="بستن" className="flex size-9 items-center justify-center rounded-full bg-[#f2ecdf]/[0.07] text-[#b9bfcc] transition-colors hover:text-[#f2ecdf]">
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  <ul className="mt-4 flex flex-col gap-1.5">
                    {order.map((code, index) => {
                      const item = names[code];
                      const active = code === locale;
                      return (
                        <motion.li key={code} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + index * 0.04, duration: 0.3 }}>
                          <button
                            type="button"
                            onClick={() => choose(code)}
                            aria-current={active ? "true" : undefined}
                            className={`flex h-16 w-full items-center gap-4 rounded-[20px] px-4 text-start transition-colors ${active ? "bg-[#d9a648]/[0.12] ring-1 ring-[#d9a648]/45" : "hover:bg-[#f2ecdf]/[0.05]"}`}
                          >
                            <Flag code={code} className="h-6 w-9" />
                            <span className="flex-1 leading-tight">
                              <strong className="block text-[15.5px] font-bold"><bdi>{item.full}</bdi></strong>
                              <span className="text-[12px] text-[#9aa3b8]">{item.sub}</span>
                            </span>
                            {active && (
                              <span className="flex size-7 items-center justify-center rounded-full bg-[#d9a648] text-[#1c1406]">
                                <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                              </span>
                            )}
                          </button>
                        </motion.li>
                      );
                    })}
                  </ul>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};
