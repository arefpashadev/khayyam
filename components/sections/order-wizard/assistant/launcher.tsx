"use client";

import { motion, useReducedMotion } from "motion/react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";
import { studioDir, tx } from "@/lib/tx";

/**
 * The one launcher for Khayyam's assistant, shared by the site, app and AI studios:
 * the mark in a dark circle, the name beside it, a gold ring that pings now and then.
 */
export const AssistantLauncher = ({ nudge, onOpen, compact, className = "", guide }: { nudge: number; onOpen: () => void; compact?: boolean; className?: string; guide?: { name: string; value: string } }) => {
  const reduce = useReducedMotion();
  const label = tx("دستیار خیام");
  return (
    <motion.button
      key={nudge}
      type="button"
      {...(guide ? { [`data-${guide.name}`]: guide.value } : {})}
      onClick={onOpen}
      animate={reduce || nudge === 0 ? undefined : { rotate: [0, -9, 7, -4, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      aria-label={label}
      dir={studioDir()}
      className={`${className.includes("absolute") ? "" : "relative"} z-20 flex items-center gap-2.5 rounded-full bg-[#121a2e]/95 text-[13px] font-bold text-[#f2ecdf] shadow-[0_14px_40px_-14px_rgba(217,166,72,0.6)] ring-1 ring-[#d9a648]/30 backdrop-blur transition hover:ring-[#d9a648]/60 ${compact ? "size-14 justify-center" : "h-12 pe-5 ps-1.5"} ${className}`}
    >
      {!reduce && nudge > 0 && (
        <motion.span key={`ring-${nudge}`} className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[#d9a648]" initial={{ opacity: 0.8, scale: 1 }} animate={{ opacity: 0, scale: 1.5 }} transition={{ duration: 1.1 }} />
      )}
      <span className="flex size-10 items-center justify-center rounded-full bg-[#0c1222]">
        <KhayyamMark size={26} state={nudge % 2 === 1 ? "thinking" : "idle"} />
      </span>
      {!compact && label}
    </motion.button>
  );
};
