"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const names: Record<(typeof routing.locales)[number], { short: string; full: string }> = {
  fa: { short: "فا", full: "فارسی" },
  en: { short: "EN", full: "English" },
  ar: { short: "ع", full: "العربية" },
  de: { short: "DE", full: "Deutsch" },
};

/** A small, quiet language switch for the dark header. */
export const LanguageSwitch = () => {
  const locale = useLocale() as (typeof routing.locales)[number];
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => !ref.current?.contains(event.target as Node) && setOpen(false);
    const escape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`زبان: ${names[locale]?.full ?? locale}`}
        onClick={() => setOpen((value) => !value)}
        className="flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[12px] font-bold text-[#9aa3b8] transition-colors hover:text-[#f2ecdf] focus-visible:outline-2 focus-visible:outline-[#e8b95e]"
      >
        {names[locale]?.short ?? locale}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute end-0 top-[calc(100%+6px)] z-40 min-w-36 rounded-2xl bg-[#121a2e] p-1.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] ring-1 ring-[#f2ecdf]/10"
          >
            {routing.locales.map((code) => (
              <button
                key={code}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  if (code !== locale) router.replace(pathname, { locale: code });
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-start text-[13px] transition-colors ${code === locale ? "text-[#e9c27a]" : "text-[#dcd6c9] hover:bg-[#f2ecdf]/[0.06]"}`}
              >
                {names[code].full}
                {code === locale && <Check className="size-3.5" aria-hidden="true" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
