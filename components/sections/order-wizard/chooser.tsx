"use client";

import { tx } from "@/lib/tx";
import { ArrowLeft, Palette, X, Zap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";
import { Link } from "@/i18n/navigation";

import type { OrderKind } from "./config";
import { useWizard } from "./store";

/** Start screen: the quick path (recommended) or the full studio. */
export const PathChooser = ({ kind }: { kind: OrderKind }) => {
  const setMode = useWizard((state) => state.setMode);
  const reduce = useReducedMotion();
  const subject = kind === "app" ? tx("اپلیکیشن") : tx("سایت");
  const rise = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const } });

  const paths = [
    {
      mode: "quick" as const,
      icon: Zap,
      badge: tx("پیشنهادی"),
      title: tx("مسیر سریع"),
      text: tx("سه سوال ساده؛ سه طرح کامل و آماده تحویل می‌گیرید. حدود یک دقیقه."),
      points: [tx("بدون نیاز به دانش طراحی"), tx("سه نسخه متفاوت برای انتخاب")],
    },
    {
      mode: "studio" as const,
      icon: Palette,
      badge: tx("برای سلیقه‌های دقیق"),
      title: tx("استودیو طراحی"),
      text: tx("پالت، گوشه‌ها، نوشته، حرکت، چیدمان و ماژول‌ها را خودتان تنظیم کنید."),
      points: [tx("کنترل کامل روی هر جزئیات"), tx("دستیار هوشمند کنار شما")],
    },
  ];

  return (
    <div className="relative flex size-full flex-col overflow-y-auto bg-[radial-gradient(70%_55%_at_50%_10%,rgba(217,166,72,0.18),transparent_70%),radial-gradient(50%_40%_at_80%_90%,rgba(217,166,72,0.12),transparent_70%),#0c1222]">
      <Link href="/" aria-label={tx("خروج")} className="absolute end-4 top-4 flex size-10 items-center justify-center rounded-xl text-[#9aa3b8] transition-colors hover:bg-white/6 hover:text-white">
        <X className="size-5" aria-hidden="true" />
      </Link>

      <div className="mx-auto flex w-full max-w-[880px] flex-1 flex-col items-center justify-center px-5 py-14 text-center">
        <KhayyamMark size={76} state="intro" />
        <motion.h1 {...rise(0.4)} className="mt-6 text-[28px] font-extrabold leading-[1.45] text-white lg:text-[44px]">{tx("{0} خودتان را بسازید", [subject])}</motion.h1>
        <motion.p {...rise(0.5)} className="mt-3 max-w-[46ch] text-[14px] leading-7 text-[#b9bfcc] lg:text-[16px]">{tx("طرح را همین‌جا می‌بینید؛ بعد یا طرح فیگما برایتان می‌فرستیم یا کاملش را می‌سازیم.")}</motion.p>

        <div className="mt-10 grid w-full gap-3 text-start lg:grid-cols-2 lg:gap-4">
          {paths.map((path, index) => (
            <motion.button
              key={path.mode}
              type="button"
              {...rise(0.6 + index * 0.08)}
              onClick={() => setMode(path.mode)}
              className={`group flex flex-col gap-4 rounded-[26px] p-6 text-start outline-none ring-1 transition focus-visible:ring-2 focus-visible:ring-[#d9a648] lg:p-7 ${
                index === 0 ? "bg-[linear-gradient(160deg,rgba(217,166,72,0.18),rgba(217,166,72,0.1))] ring-[#d9a648]/35 hover:ring-[#d9a648]/70" : "bg-[#121a2e] ring-white/8 hover:ring-white/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex size-12 items-center justify-center rounded-2xl ${index === 0 ? "bg-[linear-gradient(135deg,#f5d79c,#d9a648)] text-[#1c1406]" : "bg-white/8 text-[#1c1406]"}`}>
                  <path.icon className="size-5" aria-hidden="true" />
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${index === 0 ? "bg-[#d9a648]/20 text-[#e9c27a]" : "bg-white/6 text-[#b9bfcc]"}`}>{path.badge}</span>
              </div>
              <div>
                <strong className="block text-[20px] text-white">{path.title}</strong>
                <span className="mt-2 block text-[13.5px] leading-7 text-[#b9bfcc]">{path.text}</span>
              </div>
              <ul className="flex flex-col gap-1.5 text-[12.5px] text-[#c9d0d9]">
                {path.points.map((point) => (
                  <li key={point} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#2fd08a]" /> {point}
                  </li>
                ))}
              </ul>
              <span className="mt-auto flex items-center gap-2 pt-2 text-[13px] font-extrabold text-white">{tx("شروع")}{" "}<ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1 ltr:-scale-x-100" aria-hidden="true" />
              </span>
            </motion.button>
          ))}
        </div>
        <p className="mt-6 text-[12px] text-[#6f788d]">{tx("در هر دو مسیر، همه‌چیز بعداً هم طبق خواسته شما قابل تغییر است.")}</p>
      </div>
    </div>
  );
};
