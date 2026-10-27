"use client";

import { ArrowUp, Check, Play, RotateCcw } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The landing's AI moment: a chat with Khayyam's agent. One plain request, and the
 * agent answers with its work attached to the messages: campaign content, an invoice
 * it filed, and the channels it now answers. A sample conversation, labelled as such.
 */

// the conversation unfolds one beat at a time
const LAST = 4;

const Appear = ({ when, children, className }: { when: boolean; children: ReactNode; className?: string }) => (
  <motion.div
    initial={false}
    animate={when ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 12, filter: "blur(4px)" }}
    transition={{ duration: 0.5, ease }}
    className={className}
  >
    {children}
  </motion.div>
);

const AgentSays = ({ when, text, children }: { when: boolean; text: string; children?: ReactNode }) => (
  <Appear when={when} className="flex items-start gap-2.5">
    <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0c1222] ring-1 ring-[#d9a648]/30">
      <KhayyamMark size={16} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-[13.5px] leading-7 text-[#ece7dc]">{text}</p>
      {children && <div className="mt-2.5">{children}</div>}
    </div>
  </Appear>
);

const formats = [
  { key: "post", tone: "from-[#7a1f2b] to-[#c2410c]", shape: "aspect-square", video: false },
  { key: "story", tone: "from-[#b45309] to-[#f59e0b]", shape: "aspect-[9/16]", video: false },
  { key: "reels", tone: "from-[#831843] to-[#e11d48]", shape: "aspect-[9/16]", video: true },
  { key: "tiktok", tone: "from-[#3b0d18] to-[#9f1239]", shape: "aspect-[9/16]", video: true },
] as const;

export const AgentDemo = () => {
  const t = useTranslations("Agent");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "-120px" });
  const [beat, setBeat] = useState(0);
  const at = reduce ? LAST : beat;

  useEffect(() => {
    if (!visible || reduce || beat >= LAST) return;
    const timer = window.setTimeout(() => setBeat(beat + 1), beat === 0 ? 900 : 1700);
    return () => window.clearTimeout(timer);
  }, [visible, reduce, beat]);

  const working = at > 0 && at < LAST;

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[30px] bg-[#121a2e] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] ring-1 ring-[#f2ecdf]/[0.08]">
      <span className="pointer-events-none absolute -top-32 inset-x-[10%] h-64 rounded-full bg-[#d9a648] opacity-[0.09] blur-[100px]" aria-hidden="true" />

      {/* top bar */}
      <div className="relative flex items-center gap-2.5 border-b border-[#f2ecdf]/[0.07] px-5 py-3.5">
        <KhayyamMark size={24} state={working ? "thinking" : "still"} />
        <strong className="text-[13.5px]">{t("name")}</strong>
        <span className="flex items-center gap-1.5 text-[11.5px] text-[#7fd6a8]">
          <span className={`size-1.5 rounded-full bg-[#2fd08a] ${working ? "animate-pulse" : ""}`} />
          {working ? t("working") : t("online")}
        </span>
        <span className="ms-auto rounded-full bg-[#f2ecdf]/[0.06] px-2.5 py-0.5 text-[10.5px] text-[#9aa3b8]">{t("sample")}</span>
        {at >= LAST && !reduce && (
          <button type="button" onClick={() => setBeat(0)} aria-label={t("replay")} className="flex size-8 items-center justify-center rounded-full text-[#9aa3b8] transition-colors hover:bg-[#f2ecdf]/[0.07] hover:text-[#f2ecdf]">
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* conversation */}
      <div className="relative flex flex-col gap-5 px-5 pb-4 pt-5">
        <p className="max-w-[88%] self-end rounded-[20px] rounded-ee-md bg-[#f2ecdf] px-4 py-2.5 text-[13.5px] font-medium leading-7 text-[#0c1222]">{t("ask")}</p>

        <AgentSays when={at >= 1} text={t("content")}>
          <div className="grid grid-cols-4 items-end gap-2">
            {formats.map((item, index) => (
              <motion.figure
                key={item.key}
                initial={false}
                animate={at >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.45, delay: at >= 1 ? 0.15 + index * 0.1 : 0, ease }}
                className="flex flex-col gap-1.5"
              >
                <span className={`relative flex items-center justify-center overflow-hidden rounded-[12px] bg-gradient-to-br ${item.tone} ${item.shape}`}>
                  <span className="absolute -bottom-3 -start-3 size-9 rounded-full bg-white/15" aria-hidden="true" />
                  <span className="absolute end-2 top-2 h-1 w-1/2 rounded-full bg-white/40" aria-hidden="true" />
                  {item.video && (
                    <span className="flex size-6 items-center justify-center rounded-full bg-black/35 backdrop-blur">
                      <Play className="size-2.5 fill-white text-white" aria-hidden="true" />
                    </span>
                  )}
                </span>
                <figcaption className="truncate text-center text-[10.5px] text-[#9aa3b8]">{t(item.key)}</figcaption>
              </motion.figure>
            ))}
          </div>
        </AgentSays>

        <AgentSays when={at >= 2} text={t("invoices")}>
          <div className="flex items-center gap-3 rounded-[16px] bg-[#0c1222] p-2.5 ring-1 ring-[#f2ecdf]/[0.07]">
            <div className="relative h-[52px] w-[40px] shrink-0 overflow-hidden rounded-[6px] bg-[#e9e2d2] p-1.5">
              <span className="block h-1 w-3/5 rounded-full bg-[#1c1406]/50" />
              {[0, 1, 2].map((row) => (
                <span key={row} className="mt-1.5 block h-[3px] w-full rounded-full bg-[#1c1406]/20" />
              ))}
              {!reduce && at >= 2 && (
                <motion.span
                  className="absolute inset-x-0 h-4 bg-[linear-gradient(180deg,transparent,rgba(217,166,72,0.65),transparent)]"
                  animate={{ top: ["-20%", "100%"] }}
                  transition={{ duration: 1.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                  aria-hidden="true"
                />
              )}
            </div>
            <span className="min-w-0 flex-1 leading-tight">
              <strong className="block truncate text-[12.5px] text-[#f2ecdf]">{t("vendor")}</strong>
              <span className="text-[11px] text-[#7f889c]">{t("accounting")}</span>
            </span>
            <span className="flex items-center gap-1 rounded-full bg-[#2fd08a]/12 px-2.5 py-1 text-[11px] font-bold text-[#7fd6a8]">
              <Check className="size-3" strokeWidth={3} aria-hidden="true" /> {t("filed")}
            </span>
          </div>
        </AgentSays>

        <AgentSays when={at >= 3} text={t("replies")}>
          <div className="flex flex-wrap gap-1.5">
            {(["dm", "whatsapp", "website"] as const).map((channel) => (
              <span key={channel} className="rounded-full bg-[#f2ecdf]/[0.06] px-2.5 py-1 text-[11px] text-[#dcd6c9] ring-1 ring-[#f2ecdf]/[0.06]">
                {t(channel)}
              </span>
            ))}
          </div>
        </AgentSays>
      </div>

      {/* composer (decorative) */}
      <div className="relative mx-4 mb-4 flex h-12 items-center gap-2 rounded-full bg-[#0c1222] pe-1.5 ps-4 ring-1 ring-[#f2ecdf]/[0.08]" aria-hidden="true">
        <span className="flex-1 truncate text-[13px] text-[#6f788d]">{t("placeholder")}</span>
        <span className="flex size-9 items-center justify-center rounded-full bg-[#d9a648] text-[#1c1406]">
          <ArrowUp className="size-4" strokeWidth={2.6} />
        </span>
      </div>
    </div>
  );
};
