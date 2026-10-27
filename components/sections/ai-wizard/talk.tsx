"use client";

import { ArrowUp, BrainCircuit, Check, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

import { useStickToBottom } from "../order-wizard/use-stick-bottom";
import { askKhayyam } from "./brain";
import { useAi } from "./store";

const examples = [
  "روزی ۲۰۰ پیام در اینستاگرام می‌گیریم و ۳ نفر فقط جواب می‌دهند",
  "فاکتورها را دستی در حسابداری ثبت می‌کنیم",
  "گزارش فروش هر هفته با اکسل دیر آماده می‌شود",
];

/**
 * Talk to Khayyam in your own words. A small launcher (with an occasional wiggle) opens
 * a separate conversation; Khayyam reads what you write and offers what to add to the team.
 * The questions on the main screen stay untouched.
 */
export const Talk = ({ compact }: { compact: boolean }) => {
  const reduce = useReducedMotion();
  const notes = useAi((state) => state.notes);
  const thinking = useAi((state) => state.thinking);
  const addNote = useAi((state) => state.addNote);
  const setThinking = useAi((state) => state.setThinking);
  const update = useAi((state) => state.update);
  const markApplied = useAi((state) => state.markApplied);
  const setMode = useAi((state) => state.setMode);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [nudge, setNudge] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useStickToBottom(listRef, open);

  // Now and then the closed launcher wiggles a little, so it gets noticed.
  useEffect(() => {
    if (open || reduce) return;
    const interval = window.setInterval(() => setNudge((value) => value + 1), 8000);
    return () => window.clearInterval(interval);
  }, [open, reduce]);

  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 250);
    return () => window.clearTimeout(timeout);
  }, [open]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || thinking) return;
    setDraft("");
    addNote({ role: "user", text: message });
    setThinking(true);
    const reply = await askKhayyam(message, useAi.getState().config);
    setThinking(false);
    addNote({ role: "khayyam", text: reply.text, reply });
  };

  const chip = "flex h-9 w-fit items-center gap-2 rounded-full bg-[#f0b44a]/12 px-3.5 text-[12.5px] font-bold text-[#f3d9a4] transition-colors hover:bg-[#f0b44a]/20";

  return (
    <>
      {!open && (
        <motion.button
          key={nudge}
          type="button"
          data-guide="talk"
          onClick={() => setOpen(true)}
          animate={reduce || nudge === 0 ? undefined : { rotate: [0, -9, 7, -4, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          aria-label="گفتگو با خیام"
          className={`absolute z-20 flex items-center gap-2 rounded-full bg-[#151920] text-[13px] font-bold text-white shadow-[0_14px_40px_-14px_rgba(240,180,74,0.55)] ring-1 ring-white/10 transition hover:ring-[#f0b44a]/40 ${compact ? "bottom-[88px] left-4 size-14 justify-center" : "bottom-6 left-6 h-12 pe-4 ps-1.5"}`}
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-[#0b0d12]">
            <KhayyamMark size={26} state={nudge % 2 === 1 ? "thinking" : "idle"} />
          </span>
          {!compact && "بنویسید، خیام می‌فهمد"}
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <>
            {compact && <motion.div className="fixed inset-0 z-[140] bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />}
            <motion.section
              role="dialog"
              aria-label="گفتگو با خیام"
              initial={reduce ? false : compact ? { y: "100%" } : { opacity: 0, y: 16, scale: 0.98 }}
              animate={compact ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : compact ? { y: "100%" } : { opacity: 0, y: 16 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className={`z-[150] flex flex-col overflow-hidden bg-[#111419] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/10 ${compact ? "fixed inset-x-0 bottom-0 top-[12dvh] rounded-t-[28px]" : "absolute bottom-6 left-6 h-[min(560px,calc(100%-48px))] w-[380px] rounded-[26px]"}`}
              dir="rtl"
            >
              <header className="flex shrink-0 items-center gap-3 border-b border-white/6 px-4 py-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#0b0d12] ring-1 ring-white/10">
                  <KhayyamMark size={24} />
                </span>
                <div className="leading-tight">
                  <strong className="block text-[14px] text-white">گفتگو با خیام</strong>
                  <span className="text-[11.5px] text-[#8a93a0]">کارتان را تعریف کنید، پیشنهاد می‌دهد</span>
                </div>
                <button type="button" onClick={() => setOpen(false)} aria-label="بستن" className="ms-auto flex size-9 items-center justify-center rounded-full text-[#8a93a0] transition-colors hover:bg-white/6 hover:text-white">
                  <X className="size-4" aria-hidden="true" />
                </button>
              </header>

              <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-width:thin]">
                <div className="flex flex-col gap-3">
                  <p className="max-w-[90%] rounded-[20px] rounded-tr-md bg-[#1a1f28] px-4 py-3 text-[13.5px] leading-7 text-[#e1e6ec]">
                    هر چه درباره کارتان می‌دانید بنویسید؛ از کجا پیام می‌گیرید، چه کاری وقت تیم را می‌گیرد، چند نفرید. من می‌خوانم و می‌گویم چه کسانی به تیمتان اضافه شوند.
                  </p>
                  {notes.length === 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[11.5px] text-[#5d6573]">مثلاً:</span>
                      {examples.map((example) => (
                        <button key={example} type="button" onClick={() => void send(example)} className="rounded-2xl bg-[#151920] px-4 py-3 text-right text-[12.5px] leading-6 text-[#c9d0d9] ring-1 ring-white/[0.07] transition-colors hover:bg-[#1b2029]">
                          {example}
                        </button>
                      ))}
                    </div>
                  )}
                  {notes.map((note) =>
                    note.role === "user" ? (
                      <p key={note.id} className="max-w-[88%] self-end rounded-[20px] rounded-tl-md bg-[#1d2431] px-4 py-3 text-[13.5px] leading-7 text-white">
                        {note.text}
                      </p>
                    ) : (
                      <div key={note.id} className="flex flex-col gap-2">
                        <p className="max-w-[90%] rounded-[20px] rounded-tr-md bg-[#1a1f28] px-4 py-3 text-[13.5px] leading-7 text-[#e1e6ec]">{note.text}</p>
                        {note.reply?.patch && (
                          <button
                            type="button"
                            disabled={note.applied}
                            onClick={() => {
                              update(note.reply?.patch ?? {});
                              markApplied(note.id);
                            }}
                            className={`${chip} disabled:bg-[#2fd08a]/12 disabled:text-[#9fe8c6]`}
                          >
                            {note.applied ? <Check className="size-4" strokeWidth={3} aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
                            {note.applied ? "به پرونده اضافه شد" : note.reply.actionLabel}
                          </button>
                        )}
                        {note.reply?.custom && (
                          <button
                            type="button"
                            onClick={() => {
                              setOpen(false);
                              setMode("custom");
                            }}
                            className={chip}
                          >
                            <BrainCircuit className="size-4" aria-hidden="true" /> رفتن به هوش مصنوعی اختصاصی
                          </button>
                        )}
                      </div>
                    ),
                  )}
                  {thinking && (
                    <span className="flex items-center gap-2 text-[12px] text-[#8a93a0]">
                      <KhayyamMark size={20} state="thinking" /> در حال خواندن…
                    </span>
                  )}
                </div>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void send(draft);
                }}
                className="shrink-0 border-t border-white/6 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
              >
                <div className="flex h-12 items-center gap-2 rounded-2xl bg-[#171b22] pe-1.5 ps-4 focus-within:ring-2 focus-within:ring-[#f0b44a]/40">
                  <label htmlFor="khayyam-input" className="sr-only">
                    پیام به خیام
                  </label>
                  <input ref={inputRef} id="khayyam-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="پیامتان…" className="h-full min-w-0 flex-1 bg-transparent text-[13.5px] text-white outline-none placeholder:text-[#5d6573]" />
                  <button type="submit" disabled={!draft.trim() || thinking} aria-label="ارسال" className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f0b44a] text-[#1a1306] transition disabled:opacity-25">
                    <ArrowUp className="size-4" strokeWidth={2.5} aria-hidden="true" />
                  </button>
                </div>
              </form>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
