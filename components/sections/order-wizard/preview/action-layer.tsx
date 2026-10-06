"use client";

import { Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Makes the static preview feel alive: anything marked `.pv-act` reacts on hover/press,
 * and clicking it explains that in the real product it can do whatever the customer wants.
 */
export const ActionLayer = ({ children, className = "flex min-h-full flex-col" }: { children: ReactNode; className?: string }) => {
  const [toast, setToast] = useState<{ label: string; id: number } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div
      className={className}
      onClickCapture={(event) => {
        const target = (event.target as HTMLElement).closest<HTMLElement>(".pv-act");
        if (!target) return;
        const label = (target.dataset.act ?? target.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 28) || "این بخش";
        setToast({ label, id: Date.now() });
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setToast(null), 2800);
      }}
    >
      <div className="pointer-events-none sticky top-5 z-50 h-0" dir="rtl">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14 }}
              className="mx-auto flex w-fit max-w-[92%] items-center gap-2 rounded-full bg-(--pv-text) px-5 py-3 text-[13px] font-bold text-(--pv-bg) shadow-2xl"
            >
              <Sparkles className="size-4 shrink-0" aria-hidden="true" />
              «{toast.label}» در نسخه واقعی هر کاری بخواهید انجام می‌دهد.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {children}
    </div>
  );
};
