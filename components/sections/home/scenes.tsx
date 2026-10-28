"use client";

import { Bell, BookOpen, CalendarCheck, Gift, ShoppingBag, Stethoscope, Utensils } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";

import { ease, useTicker } from "./shared";

/*
 * Small live scenes that show what a site, an app and an AI agent do for a business.
 * Each one cycles through different kinds of business, so the cards read as
 * "this works for anyone", not as one example.
 */

const siteEvents = [
  { key: "e1", icon: ShoppingBag },
  { key: "e2", icon: Utensils },
  { key: "e3", icon: BookOpen },
  { key: "e4", icon: Stethoscope },
  { key: "e5", icon: Gift },
  { key: "e6", icon: CalendarCheck },
] as const;

/** Website: orders and bookings from different businesses arriving at night. */
export const SiteScene = ({ tall = false }: { tall?: boolean }) => {
  const t = useTranslations("Scenes");
  const { ref, index } = useTicker(siteEvents.length, 2200);
  const rows = tall ? 4 : 3;
  const list = Array.from({ length: rows }, (_, offset) => siteEvents[(index + offset) % siteEvents.length]);
  return (
    <div ref={ref} className={`flex flex-col gap-2 overflow-hidden [mask-image:linear-gradient(180deg,#000_75%,transparent)] ${tall ? "h-[268px]" : "h-[196px]"}`}>
      <AnimatePresence initial={false} mode="popLayout">
        {list.map((event) => (
          <motion.div
            key={event.key}
            layout
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45, ease }}
            className="flex shrink-0 items-center gap-3 rounded-[16px] bg-[#0c1222] px-3.5 py-3 ring-1 ring-[#f2ecdf]/[0.07]"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#d9a648]/15 text-[#e9c27a]">
              <event.icon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[13px] text-[#ece7dc]">{t(`${event.key}`)}</span>
              <span className="text-[11px] text-[#7f889c]">{t(`${event.key}b`)}</span>
            </span>
            <span className="shrink-0 text-[11.5px] font-bold text-[#e9c27a]">{t(`${event.key}s`)}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const pushes = ["p1", "p2", "p3", "p4"] as const;

/** App: a phone receiving well-timed notifications from different kinds of apps. */
export const AppScene = ({ tall = false }: { tall?: boolean }) => {
  const t = useTranslations("Scenes");
  const { ref, index } = useTicker(pushes.length * 2, 1600);
  const shown = index % 2 === 1 ? pushes[Math.floor(index / 2)] : null;
  return (
    <div ref={ref} className={`relative mx-auto w-[190px] overflow-hidden rounded-t-[32px] bg-[#0c1222] ring-[6px] ring-[#1a2238] ${tall ? "h-[268px]" : "h-[196px]"}`}>
      <span className="absolute inset-x-0 top-2.5 mx-auto h-1.5 w-12 rounded-full bg-[#1a2238]" aria-hidden="true" />
      <span className="absolute inset-x-0 top-9 text-center text-[32px] font-black text-[#f2ecdf]/80">{t("clock")}</span>
      <span className="absolute inset-x-0 top-[84px] text-center text-[11px] text-[#7f889c]">{t("day")}</span>
      <AnimatePresence>
        {shown && (
          <motion.div
            key={shown}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            className="absolute inset-x-2.5 top-[110px] rounded-[16px] bg-[#f2ecdf]/[0.12] p-2.5 backdrop-blur"
          >
            <span className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#e9c27a]">
              <Bell className="size-3" aria-hidden="true" /> {t(`${shown}a`)}
            </span>
            <span className="mt-1 block text-[11.5px] leading-5 text-[#f2ecdf]">{t(shown)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const chats = ["c1", "c2", "c3"] as const;
const BEATS = 5;

/** AI: three short conversations (a booking, a product question, an order) handled to the end. */
export const AiScene = ({ tall = false }: { tall?: boolean }) => {
  const t = useTranslations("Scenes");
  const { ref, index } = useTicker(chats.length * BEATS, 1300);
  const chat = chats[Math.floor(index / BEATS)];
  const beat = index % BEATS;
  return (
    <div ref={ref} className={`flex flex-col gap-2 overflow-hidden ${tall ? "h-[268px]" : "h-[196px]"}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={chat} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex h-full flex-col gap-2">
          <p className="max-w-[92%] self-end rounded-[16px] rounded-ee-md bg-[#f2ecdf]/[0.07] px-3 py-2 text-[12.5px] leading-6 text-[#dcd6c9]">{t(`${chat}q`)}</p>
          <div className="flex min-h-[26px] flex-wrap gap-1.5">
            {(["1", "2", "3"] as const).map((n, chipIndex) => (
              <motion.span
                key={n}
                initial={false}
                animate={beat >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: beat >= 1 ? chipIndex * 0.1 : 0, ease }}
                className="rounded-full bg-[#d9a648]/[0.12] px-2.5 py-0.5 text-[11px] font-bold text-[#f5d79c] ring-1 ring-[#d9a648]/30"
              >
                {t(`${chat}k${n}`)}
              </motion.span>
            ))}
          </div>
          <motion.p
            initial={false}
            animate={beat >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease }}
            className="max-w-[92%] self-start rounded-[16px] rounded-es-md bg-[#d9a648]/[0.14] px-3 py-2 text-[12.5px] leading-6 text-[#f5e6c6]"
          >
            {t(`${chat}a`)}
          </motion.p>
          <motion.span initial={false} animate={{ opacity: beat >= 3 ? 1 : 0 }} className="mt-auto flex items-center gap-1.5 text-[11.5px] font-bold text-[#7fd6a8]">
            <span className="size-1.5 rounded-full bg-[#2fd08a]" /> {t(`${chat}d`)}
          </motion.span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
