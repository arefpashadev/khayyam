"use client";

import { AppWindow, BookOpen, BrainCircuit, Menu, Smartphone, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { Link, usePathname } from "@/i18n/navigation";
import { dirOf } from "@/lib/locale";

const noop = () => () => {};

/** Phones: the header's links in a bottom sheet, the same kind the language switch opens. */
export const MobileMenu = ({ cta }: { cta: { href: string; label: string } }) => {
  const t = useTranslations("Nav");
  const b = useTranslations("Blog");
  const locale = useLocale();
  const pathname = usePathname();
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

  const links = [
    { href: "/website", label: t("site"), Icon: AppWindow },
    { href: "/apps", label: t("app"), Icon: Smartphone },
    { href: "/ai", label: t("ai"), Icon: BrainCircuit },
    { href: "/blog", label: t("blog"), Icon: BookOpen },
  ];

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={b("menu")}
        onClick={() => setOpen(true)}
        className="flex size-9 items-center justify-center rounded-full text-[#dcd6c9] ring-1 ring-[#f2ecdf]/12 transition-colors hover:bg-[#f2ecdf]/[0.06] lg:hidden"
      >
        <Menu className="size-[18px]" aria-hidden="true" />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-[200] lg:hidden" dir={dirOf(locale)}>
                <motion.button type="button" aria-label={b("close")} onClick={() => setOpen(false)} className="absolute inset-0 bg-[rgba(4,6,12,0.62)] backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                <motion.nav
                  aria-label={t("main")}
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
                    <strong className="text-[18px] font-extrabold">{b("menu")}</strong>
                    <button type="button" onClick={() => setOpen(false)} aria-label={b("close")} className="flex size-9 items-center justify-center rounded-full bg-[#f2ecdf]/[0.07] text-[#b9bfcc]">
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  <ul className="mt-4 flex flex-col gap-1.5">
                    {links.map(({ href, label, Icon }, index) => {
                      const active = pathname === href || pathname.startsWith(`${href}/`);
                      return (
                        <motion.li key={href} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + index * 0.04, duration: 0.3 }}>
                          <Link
                            href={href}
                            onClick={() => setOpen(false)}
                            aria-current={active ? "page" : undefined}
                            className={`flex h-14 items-center gap-4 rounded-[18px] px-4 text-[15.5px] font-bold transition-colors ${active ? "bg-[#d9a648]/[0.12] text-[#e9c27a] ring-1 ring-[#d9a648]/45" : "hover:bg-[#f2ecdf]/[0.05]"}`}
                          >
                            <span className="flex size-9 items-center justify-center rounded-xl bg-[#f2ecdf]/[0.06] text-[#e9c27a]">
                              <Icon className="size-[18px]" aria-hidden="true" />
                            </span>
                            {label}
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                  <Link href={cta.href} onClick={() => setOpen(false)} className="mt-4 flex h-12 items-center justify-center rounded-full bg-[#d9a648] text-[14px] font-extrabold text-[#1c1406]">
                    {cta.label}
                  </Link>
                </motion.nav>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};
