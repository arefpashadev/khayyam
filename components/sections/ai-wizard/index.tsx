"use client";

import { ArrowRight, CircleHelp, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";
import { Link } from "@/i18n/navigation";

import { aiChatGuide, aiCustomGuide, Guide, useGuide } from "../order-wizard/guide";
import { PaymentOverlay } from "../order-wizard/payment-ui";
import { useIsSmallScreen } from "../order-wizard/use-small-screen";
import { fa } from "./config";
import { CustomAi } from "./custom";
import { Dossier, DossierStrip } from "./dossier";
import { Interview, interviewLength } from "./interview";
import { Proposal } from "./proposal";
import { useAi } from "./store";
import { Talk } from "./talk";

/**
 * The AI studio. One way in: Khayyam talks with the customer while their AI team's
 * dossier fills in beside the chat. Specialised needs (factories, medical, …) branch
 * from inside the conversation to the custom-AI request.
 */
export const AiWizard = () => {
  const mode = useAi((state) => state.mode);

  useEffect(() => {
    useAi.getState().reset();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div dir="rtl" className="fixed inset-0 z-[100] overflow-hidden bg-[#0b0d12] font-sans text-[#eef1f5] [color-scheme:dark]">
      <PaymentOverlay />
      {mode === "chat" ? <ChatLayout /> : <CustomLayout />}
    </div>
  );
};

const TopBar = ({ title, guide, back, children }: { title: string; guide: string; back?: () => void; children?: ReactNode }) => {
  const openGuide = useGuide((state) => state.open);
  const icon = "flex size-9 items-center justify-center rounded-xl text-[#8a93a0] transition-colors hover:bg-white/6 hover:text-white";
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/6 px-3 lg:px-5">
      {back && (
        <button type="button" onClick={back} aria-label="برگشت به گفتگو" className={icon}>
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      )}
      <KhayyamMark size={30} title="خیام" />
      <strong className="truncate text-[13.5px]">{title}</strong>
      <div className="ms-auto flex items-center gap-2">{children}</div>
      <button type="button" onClick={() => openGuide(guide)} aria-label="راهنما" className={icon}>
        <CircleHelp className="size-[18px]" aria-hidden="true" />
      </button>
      <Link href="/" aria-label="خروج" className={icon}>
        <X className="size-[18px]" aria-hidden="true" />
      </Link>
    </header>
  );
};

const Progress = () => {
  const stage = useAi((state) => state.stage);
  const submitted = useAi((state) => state.submitted);
  const done = submitted ? interviewLength - 1 : Math.min(stage, interviewLength - 1);
  const share = done / (interviewLength - 1);
  return (
    <span data-guide="progress" className="hidden items-center gap-2 text-[11.5px] text-[#8a93a0] sm:flex">
      {fa(Math.round(share * 100))}٪ کامل
      <span className="h-1 w-24 overflow-hidden rounded-full bg-white/8">
        <span className="block h-full rounded-full bg-[#f0b44a] transition-all duration-500" style={{ width: `${share * 100}%` }} />
      </span>
    </span>
  );
};

const ChatLayout = () => {
  const isSmall = useIsSmallScreen();
  const [dossierOpen, setDossierOpen] = useState(false);
  const proposal = useAi((state) => state.proposal);
  const config = useAi((state) => state.config);
  const stage = useAi((state) => state.stage);

  return (
    <div className="relative flex size-full flex-col">
      <Guide id="ai-chat" steps={aiChatGuide} />
      <TopBar title="هوش مصنوعی برای کسب‌وکار شما" guide="ai-chat">
        <Progress />
      </TopBar>

      <AnimatePresence mode="wait" initial={false}>
        {proposal ? (
          <motion.div key="proposal" className="relative min-h-0 flex-1" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <Proposal />
          </motion.div>
        ) : (
          <motion.div key="chat" className="flex min-h-0 flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <section className={`relative flex min-h-0 flex-col ${isSmall ? "w-full" : "w-[min(580px,48%)] border-l border-white/6"}`}>
              {isSmall && <DossierStrip config={config} onOpen={() => setDossierOpen(true)} />}
              <div className="relative min-h-0 flex-1">
                <Interview />
              </div>
              {/* phones: the question's main button lands here, in a bar of its own */}
              {isSmall && <div id="ai-actions" className="shrink-0 border-t border-white/6 bg-[#0b0d12] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 empty:hidden" />}
            </section>
            {!isSmall && (
              <main data-guide="dossier" className="relative min-w-0 flex-1 overflow-y-auto overscroll-contain bg-[#0e1117] px-10 py-10 [scrollbar-width:thin]">
                <Dossier config={config} stage={stage} />
              </main>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!proposal && <Talk compact={isSmall} />}

      <AnimatePresence>
        {isSmall && dossierOpen && (
          <motion.div className="fixed inset-0 z-[150] flex flex-col bg-[#0e1117]" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
            <div className="flex h-12 shrink-0 items-center justify-between px-4">
              <strong className="text-[14px]">پرونده تیم</strong>
              <button type="button" onClick={() => setDossierOpen(false)} aria-label="بستن" className="flex size-9 items-center justify-center rounded-full bg-white/8">
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-10 pt-2">
              <Dossier config={config} stage={stage} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CustomLayout = () => {
  const setMode = useAi((state) => state.setMode);
  return (
    <div className="flex size-full flex-col">
      <TopBar title="هوش مصنوعی اختصاصی" guide="ai-custom" back={() => setMode("chat")} />
      <div className="relative min-h-0 flex-1 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(240,180,74,0.08),transparent_70%)]">
        <CustomAi />
      </div>
      <Guide id="ai-custom" steps={aiCustomGuide} />
    </div>
  );
};
