"use client";

import { ArrowUp, Check, X } from "lucide-react";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { create } from "zustand";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

import { steps } from "../config";
import { useWizard } from "../store";
import { askAssistant, quickQuestions, stepGuide, type AssistantAction } from "./brain";

type Message = { id: number; role: "assistant" | "user"; text: string; actions?: AssistantAction[]; applied?: number[] };

type AssistantState = {
  open: boolean;
  typing: boolean;
  messages: Message[];
  guided: string[];
  setOpen: (open: boolean) => void;
  push: (message: Omit<Message, "id">) => void;
  markApplied: (id: number, index: number) => void;
  setTyping: (typing: boolean) => void;
  markGuided: (step: string) => void;
};

let nextId = 1;

export const useAssistant = create<AssistantState>((set) => ({
  open: false,
  typing: false,
  messages: [],
  guided: [],
  setOpen: (open) => set({ open }),
  push: (message) => set((state) => ({ messages: [...state.messages, { ...message, id: nextId++ }] })),
  markApplied: (id, index) => set((state) => ({ messages: state.messages.map((message) => (message.id === id ? { ...message, applied: [...(message.applied ?? []), index] } : message)) })),
  setTyping: (typing) => set({ typing }),
  markGuided: (step) => set((state) => ({ guided: [...state.guided, step] })),
}));

const Typing = () => (
  <span className="flex items-center gap-2 py-1.5 text-[12px] text-[#8a93a0]" aria-label="در حال نوشتن">
    <KhayyamMark size={22} state="thinking" />
    در حال محاسبه…
  </span>
);

export const AssistantDock = ({ studio = false }: { studio?: boolean }) => {
  const { open, typing, messages, guided, setOpen, push, markApplied, setTyping, markGuided } = useAssistant();
  const kind = useWizard((state) => state.kind);
  const step = useWizard((state) => state.step);
  const update = useWizard((state) => state.update);
  const reduce = useReducedMotion();
  const dragControls = useDragControls();
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const stepKey = steps[step].key;

  // Greet once, then post a guide for every step the user reaches while the assistant is open.
  useEffect(() => {
    if (!open || guided.includes(stepKey)) return;
    const timeout = window.setTimeout(() => {
      const { messages: current } = useAssistant.getState();
      if (current.length === 0) push({ role: "assistant", text: "سلام! من دستیار خیام هستم. قدم‌به‌قدم کنارتان هستم، پیشنهاد می‌دهم و به سوال‌هایتان جواب می‌دهم." });
      push({ role: "assistant", ...stepGuide({ kind, step: stepKey, config: useWizard.getState().config }) });
      markGuided(stepKey);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [open, stepKey, guided, kind, push, markGuided]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages.length, typing, reduce]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || typing) return;
    setDraft("");
    push({ role: "user", text: message });
    setTyping(true);
    const reply = await askAssistant(message, { kind, step: stepKey, config: useWizard.getState().config });
    setTyping(false);
    push({ role: "assistant", ...reply });
  };

  const apply = (message: Message, action: AssistantAction, index: number) => {
    update(action.patch, action.target);
    markApplied(message.id, index);
  };

  const panelMotion = reduce ? {} : { initial: { opacity: 0, y: 16, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 16, scale: 0.98 } };

  return (
    <>
      {!open && (
        <button
          type="button"
          data-tour="assistant"
          onClick={() => setOpen(true)}
          className={`absolute z-20 flex items-center gap-2.5 rounded-full bg-[#111419]/90 text-[12.5px] font-bold text-white shadow-[0_12px_40px_-12px_rgba(77,163,255,0.7)] ring-1 ring-white/10 backdrop-blur transition hover:ring-white/25 ${studio ? "bottom-6 left-6 h-12 pe-5 ps-1.5" : "bottom-3 left-3 size-12 justify-center"}`}
          aria-label="دستیار هوشمند"
        >
          <KhayyamMark size={studio ? 36 : 38} />
          {studio && <span>دستیار هوشمند</span>}
        </button>
      )}

      <AnimatePresence>
        {open && (
          <>
            {!studio && <motion.div className="fixed inset-0 z-[140] bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />}
            <motion.section
              {...panelMotion}
              transition={{ type: "spring", bounce: 0.12, duration: 0.4 }}
              // phones: pull the header down to dismiss, like a native sheet
              drag={studio ? false : "y"}
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.7 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 110 || info.velocity.y > 600) setOpen(false);
              }}
              role="dialog"
              aria-label="دستیار هوشمند"
              dir="rtl"
              className={`z-[150] flex flex-col overflow-hidden bg-[#111419]/95 text-[#eef1f5] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10 backdrop-blur-xl ${
                studio ? "absolute bottom-6 left-6 h-[min(600px,calc(100%-110px))] w-[380px] rounded-[26px]" : "fixed inset-x-0 bottom-0 top-[10dvh] rounded-t-[26px]"
              }`}
            >
              {!studio && (
                <div className="flex h-6 shrink-0 cursor-grab touch-none items-center justify-center" onPointerDown={(event) => dragControls.start(event)} aria-hidden="true">
                  <span className="h-1 w-10 rounded-full bg-white/20" />
                </div>
              )}
              <header className={`flex shrink-0 items-center gap-3 border-b border-white/6 px-4 ${studio ? "py-3" : "touch-none pb-3"}`} onPointerDown={(event) => !studio && dragControls.start(event)}>
                <KhayyamMark size={38} />
                <div className="leading-tight">
                  <strong className="block text-[14px]">دستیار خیام</strong>
                  <span className="text-[11px] text-[#8a93a0]">راهنمای قدم‌به‌قدم · نسخه آزمایشی</span>
                </div>
                <button type="button" onClick={() => setOpen(false)} aria-label="بستن" className="ms-auto flex size-9 items-center justify-center rounded-full text-[#8a93a0] transition-colors hover:bg-white/6 hover:text-white">
                  <X className="size-4" aria-hidden="true" />
                </button>
              </header>

              <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-width:thin]">
                {messages.map((message) =>
                  message.role === "user" ? (
                    <div key={message.id} className="flex justify-end">
                      <p className="max-w-[85%] rounded-[18px] rounded-bl-md bg-[#4da3ff] px-3.5 py-2.5 text-[13px] leading-6 text-white">{message.text}</p>
                    </div>
                  ) : (
                    <div key={message.id} className="flex flex-col items-start gap-2">
                      <p className="max-w-[92%] rounded-[18px] rounded-br-md bg-[#1a1f28] px-3.5 py-2.5 text-[13px] leading-7 text-[#e1e6ec]">{message.text}</p>
                      {message.actions && message.actions.length > 0 && (
                        <div className="flex max-w-[92%] flex-wrap gap-1.5">
                          {message.actions.map((action, index) => {
                            const applied = message.applied?.includes(index);
                            return (
                              <button
                                key={action.label}
                                type="button"
                                onClick={() => apply(message, action, index)}
                                className={`flex h-9 items-center gap-2 rounded-full px-3 text-[12px] font-bold transition-colors ${applied ? "bg-[#2fd08a]/15 text-[#7ae6b4]" : "bg-[#4da3ff]/12 text-[#9ccbff] hover:bg-[#4da3ff]/22"}`}
                              >
                                {action.swatches && (
                                  <span className="flex -space-x-1.5 space-x-reverse">
                                    {action.swatches.map((swatch) => (
                                      <span key={swatch} className="size-3.5 rounded-full ring-2 ring-[#111419]" style={{ backgroundColor: swatch }} />
                                    ))}
                                  </span>
                                )}
                                {applied && <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />}
                                {action.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ),
                )}
                {typing && (
                  <div className="flex">
                    <span className="rounded-[18px] rounded-br-md bg-[#1a1f28] px-3">
                      <Typing />
                    </span>
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-white/6 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5">
                <div className="mb-2.5 flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
                  {quickQuestions(stepKey).map((question) => (
                    <button key={question} type="button" onClick={() => send(question)} className="h-8 shrink-0 rounded-full bg-[#171b22] px-3 text-[11.5px] font-bold text-[#c9d0d9] transition-colors hover:bg-[#1d222b]">
                      {question}
                    </button>
                  ))}
                </div>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void send(draft);
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-[#171b22] p-1.5 ps-4 focus-within:ring-2 focus-within:ring-[#4da3ff]/50"
                >
                  <label className="sr-only" htmlFor="assistant-input">پیام به دستیار</label>
                  <input id="assistant-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="سوالتان را بپرسید…" className="h-9 min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-[#5d6573]" />
                  <button type="submit" disabled={!draft.trim() || typing} aria-label="ارسال" className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#4da3ff,#7c6cff)] text-white transition disabled:opacity-30">
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </button>
                </form>
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
