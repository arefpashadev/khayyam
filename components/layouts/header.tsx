"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { HamburgerMenuOverlay } from "@/components/ui/hamburger-menu-overlay";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  LanguagesIcon,
  type LanguagesIconHandle,
} from "@/public/icons/languages";

const navItems = [
  { href: "#services", label: "خدمات", hasMenu: true },
  { href: "#packages", label: "پکیج ها", hasMenu: true },
  { href: "#portfolio", label: "نمونه کارها", hasMenu: true },
  { href: "#blog", label: "وبلاگ", hasMenu: false },
  { href: "#about", label: "درباره ما", hasMenu: false },
];

const languageLabels: Record<(typeof routing.locales)[number], string> = {
  en: "English",
  fa: "فارسی",
  ar: "العربية",
  de: "Deutsch",
};

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const languageIconRef = useRef<LanguagesIconHandle>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLanguageMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLanguageMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isLanguageMenuOpen]);

  if (/\/(createapp|createsite)\/?$/.test(pathname)) {
    return null;
  }

  const playLanguageAnimation = () => {
    languageIconRef.current?.stopAnimation();
    requestAnimationFrame(() => languageIconRef.current?.startAnimation());
  };

  const handleLanguageSelect = (nextLocale: (typeof routing.locales)[number]) => {
    setIsLanguageMenuOpen(false);
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header className="relative z-50 mx-auto flex w-full items-center justify-between gap-3 border-b border-black/6 bg-white/70 px-4 py-2.5 backdrop-blur-md sm:px-6 md:px-8 lg:px-10">
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          href="#login"
          className="min-w-16 sm:min-w-24"
          size="sm"
          variant="primary"
        >
          ورود
        </Button>

        <div ref={languageMenuRef} className="relative">
          <Button
            aria-expanded={isLanguageMenuOpen}
            aria-haspopup="menu"
            aria-label="تغییر زبان"
            className="group min-w-9 px-0 hover:border-[#0397ee]/40 hover:text-[#0397ee] sm:min-w-24 sm:px-4"
            onClick={() => {
              setIsLanguageMenuOpen((open) => !open);
              playLanguageAnimation();
            }}
            onMouseEnter={() => languageIconRef.current?.startAnimation()}
            onMouseLeave={() => languageIconRef.current?.stopAnimation()}
            size="sm"
            variant="outline"
          >
            <span className="hidden sm:inline">
              {languageLabels[locale as keyof typeof languageLabels]}
            </span>
            <LanguagesIcon
              ref={languageIconRef}
              aria-hidden="true"
              className="size-5 transition-transform duration-300 group-hover:scale-110"
              size={20}
            />
          </Button>

          <AnimatePresence>
            {isLanguageMenuOpen && (
              <motion.div
                role="menu"
                aria-label="انتخاب زبان"
                initial={{ opacity: 0, scale: 0.96, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -6 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute start-0 top-[calc(100%+0.5rem)] z-50 min-w-40 origin-top-right overflow-hidden rounded-xl border border-black/10 bg-white p-1.5 shadow-xl shadow-black/10"
              >
                {routing.locales.map((code) => {
                  const isActive = code === locale;

                  return (
                    <button
                      key={code}
                      type="button"
                      role="menuitem"
                      aria-current={isActive}
                      onClick={() => handleLanguageSelect(code)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-start text-sm transition-colors ${
                        isActive
                          ? "bg-[#0397ee]/10 font-semibold text-[#0397ee]"
                          : "text-[#111827] hover:bg-[#0397ee]/10 hover:text-[#0397ee]"
                      }`}
                    >
                      <span>{languageLabels[code]}</span>
                      {isActive && (
                        <Check aria-hidden="true" className="size-4" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <nav
        aria-label="منوی اصلی"
        className="hidden items-center gap-6 text-sm font-medium text-[#111827] lg:flex xl:gap-8"
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-1 whitespace-nowrap transition-colors hover:text-[#0397ee]"
          >
            <span>{item.label}</span>
            {item.hasMenu && (
              <Image
                src="/icons/chevron-down.svg"
                alt=""
                width={14}
                height={14}
              />
            )}
          </a>
        ))}
      </nav>

      <HamburgerMenuOverlay
        items={navItems}
        ariaLabel="منوی اصلی"
        buttonSize="sm"
        className="lg:hidden"
        animationDuration={1.1}
        staggerDelay={0.07}
      />
    </header>
  );
};

export default Header;
