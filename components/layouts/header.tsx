"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { HamburgerMenuOverlay } from "@/components/ui/hamburger-menu-overlay";
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

const Header = () => {
  const pathname = usePathname();
  const languageIconRef = useRef<LanguagesIconHandle>(null);

  if (/\/(createapp|createsite)\/?$/.test(pathname)) {
    return null;
  }

  const playLanguageAnimation = () => {
    languageIconRef.current?.stopAnimation();
    requestAnimationFrame(() => languageIconRef.current?.startAnimation());
  };

  return (
    <header className="relative mx-auto flex  w-full flex-row-reverse items-center justify-between gap-3 px-4 py-2 sm:px-6  md:px-9  lg:px-12">
      <div className="flex flex-row-reverse items-center gap-2 sm:gap-4">
        <Button
          href="#login"
          className="min-w-20 sm:min-w-[124px]"
          variant="primary"
        >
          ورود
        </Button>

        <Button
          aria-label="تغییر زبان"
          className="group min-w-11 flex-row-reverse px-0 sm:min-w-[124px] sm:px-5"
          onClick={playLanguageAnimation}
          onMouseEnter={() => languageIconRef.current?.startAnimation()}
          onMouseLeave={() => languageIconRef.current?.stopAnimation()}
          variant="outline"
        >
          <span className="hidden sm:inline">زبان</span>
          <LanguagesIcon
            ref={languageIconRef}
            aria-hidden="true"
            className="size-6 transition-transform duration-300 group-hover:scale-110"
            size={24}
          />
        </Button>
      </div>

      <nav
        aria-label="منوی اصلی"
        className="hidden flex-row-reverse items-center gap-7 text-base text-[#111827] lg:flex xl:gap-10"
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex flex-row-reverse items-center gap-1 whitespace-nowrap transition-colors hover:text-[#0397ee]"
          >
            <span>{item.label}</span>
            {item.hasMenu && (
              <Image
                src="/icons/chevron-down.svg"
                alt=""
                width={16}
                height={16}
              />
            )}
          </a>
        ))}
      </nav>

      <HamburgerMenuOverlay
        items={navItems}
        ariaLabel="منوی اصلی"
        className="lg:hidden"
        animationDuration={1.1}
        staggerDelay={0.07}
      />
    </header>
  );
};

export default Header;
