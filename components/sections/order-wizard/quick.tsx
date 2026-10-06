"use client";

import { ArrowLeft, ArrowRight, Check, Laptop, Palette, Pipette, Smartphone, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";
import { Link } from "@/i18n/navigation";

import { colors, estimate, faNumber, industries, projectTypes, suggestAccents, type IndustryKey, type OrderKind } from "./config";
import { DevicePreview } from "./preview/device-preview";
import { buildProposals } from "./proposals";
import { amountDue, formatToman, startPayment } from "./payments";
import { OutcomeStep } from "./steps";
import { useWizard } from "./store";

type QuickStep = "type" | "business" | "color" | "making" | "results" | "order" | "done";
const questionSteps: QuickStep[] = ["type", "business", "color"];

const tile = "rounded-2xl text-right transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#4da3ff]";
const idle = "bg-[#151920] text-[#c9d0d9] hover:bg-[#1b2029]";
const active = "bg-[#4da3ff]/14 text-[#9ccbff] ring-1 ring-[#4da3ff]/40";

const Question = ({ eyebrow, title, hint, children }: { eyebrow: string; title: string; hint: string; children: ReactNode }) => (
  <div className="mx-auto w-full max-w-[640px]">
    <span className="text-[12px] font-bold text-[#4da3ff]">{eyebrow}</span>
    <h1 className="mt-2 text-[24px] font-extrabold leading-[1.5] text-white lg:text-[34px]">{title}</h1>
    <p className="mt-2 text-[13px] leading-7 text-[#8a93a0] lg:text-[14px]">{hint}</p>
    <div className="mt-7">{children}</div>
  </div>
);

const making = ["چیدمان مناسب حوزه شما را انتخاب می‌کنم…", "رنگ‌ها را هماهنگ می‌کنم…", "متن‌ها و بخش‌ها را می‌چینم…"];

export const QuickWizard = ({ kind }: { kind: OrderKind }) => {
  const config = useWizard((state) => state.config);
  const update = useWizard((state) => state.update);
  const setIndustry = useWizard((state) => state.setIndustry);
  const setProjectType = useWizard((state) => state.setProjectType);
  const load = useWizard((state) => state.load);
  const setMode = useWizard((state) => state.setMode);
  const reduce = useReducedMotion();
  const [step, setStep] = useState<QuickStep>("type");
  const [chosen, setChosen] = useState<string | null>(null);
  // Phones start on the phone view; a laptop would be tiny there.
  const [device, setDevice] = useState<"laptop" | "phone">(() => (kind === "app" || (typeof window !== "undefined" && window.innerWidth < 1024) ? "phone" : "laptop"));
  const [makingLine, setMakingLine] = useState(0);
  const types = projectTypes.filter((type) => kind !== "app" || type.forApp);
  const questionIndex = questionSteps.indexOf(step);

  // Proposals are rebuilt only when the answers change.
  const proposals = useMemo(
    () => buildProposals(kind, config),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kind, config.projectType, config.industry, config.brandName, config.color],
  );

  // The "making" moment: a short, honest pause with the Khayyam mark, then the results.
  useEffect(() => {
    if (step !== "making") return;
    const lines = window.setInterval(() => setMakingLine((line) => Math.min(line + 1, making.length - 1)), 900);
    const done = window.setTimeout(() => setStep("results"), reduce ? 300 : 2800);
    return () => {
      window.clearInterval(lines);
      window.clearTimeout(done);
    };
  }, [step, reduce]);

  const back = () => {
    if (step === "type") setMode("choose");
    else if (step === "business") setStep("type");
    else if (step === "color") setStep("business");
    else if (step === "results") setStep("color");
    else if (step === "order") setStep("results");
  };

  const choose = (key: string, toStudio: boolean) => {
    const proposal = proposals.find((item) => item.key === key);
    if (!proposal) return;
    load(proposal.config);
    setChosen(key);
    if (toStudio) setMode("studio");
    else setStep("order");
  };

  const fade = reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div className="flex size-full flex-col bg-[radial-gradient(90%_60%_at_50%_0%,rgba(77,163,255,0.14),transparent_70%),#0b0d12]">
      <header className="flex h-16 shrink-0 items-center gap-3 px-4 lg:px-8">
        {step !== "making" && step !== "done" && (
          <button type="button" onClick={back} aria-label="برگشت" className="flex size-10 items-center justify-center rounded-xl text-[#c9d0d9] transition-colors hover:bg-white/6">
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        )}
        <KhayyamMark size={30} title="خیام" />
        <strong className="text-[14px] text-white">مسیر سریع</strong>
        {questionIndex >= 0 && (
          <span className="ms-3 flex gap-1.5" aria-label={`سوال ${faNumber(questionIndex + 1)} از ۳`}>
            {questionSteps.map((item, index) => (
              <span key={item} className={`h-1.5 rounded-full transition-all ${index === questionIndex ? "w-6 bg-[#4da3ff]" : index < questionIndex ? "w-1.5 bg-[#4da3ff]/60" : "w-1.5 bg-white/12"}`} />
            ))}
          </span>
        )}
        <Link href="/" aria-label="خروج" className="ms-auto flex size-10 items-center justify-center rounded-xl text-[#8a93a0] transition-colors hover:bg-white/6 hover:text-white">
          <X className="size-5" aria-hidden="true" />
        </Link>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-4 lg:px-8 lg:pt-10">
        <AnimatePresence mode="wait">
          {step === "type" && (
            <motion.div key="type" {...fade}>
              <Question eyebrow="سوال ۱ از ۳" title={`چه ${kind === "app" ? "اپلیکیشنی" : "چیزی"} می‌خواهید بسازید؟`} hint="یکی را انتخاب کنید؛ بعداً هم قابل تغییر است.">
                <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
                  {types.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        setProjectType(type.value);
                        setStep("business");
                      }}
                      className={`${tile} flex flex-col gap-3 p-4 lg:p-5 ${config.projectType === type.value ? active : idle}`}
                    >
                      <span className="flex size-11 items-center justify-center rounded-xl bg-white/6"><type.icon className="size-5" aria-hidden="true" /></span>
                      <span>
                        <strong className="block text-[14px] text-white">{type.label}</strong>
                        <span className="mt-1 block text-[11.5px] leading-5 opacity-70">{type.description}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </Question>
            </motion.div>
          )}

          {step === "business" && (
            <motion.div key="business" {...fade}>
              <Question eyebrow="سوال ۲ از ۳" title="برای چه کسب‌وکاری؟" hint="متن‌ها، تصویرها و بخش‌ها از روی همین ساخته می‌شوند.">
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(industries) as IndustryKey[]).map((key) => {
                    const item = industries[key];
                    return (
                      <button key={key} type="button" onClick={() => setIndustry(key)} className={`${tile} flex h-[84px] flex-col items-center justify-center gap-2 text-center ${config.industry === key ? active : idle}`}>
                        <item.icon className="size-5" aria-hidden="true" />
                        <span className="text-[12px] font-bold leading-4">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
                <label className="mt-6 block">
                  <span className="mb-2.5 block text-[12px] font-bold text-[#8a93a0]">نام برند (اختیاری)</span>
                  <input
                    value={config.brandName}
                    onChange={(event) => update({ brandName: event.target.value })}
                    placeholder="مثلاً کافه خیام"
                    maxLength={28}
                    className="h-13 w-full rounded-2xl bg-[#151920] px-4 text-[15px] font-bold text-white outline-none placeholder:font-normal placeholder:text-[#5d6573] focus:ring-2 focus:ring-[#4da3ff]/50"
                  />
                </label>
                <button type="button" onClick={() => setStep("color")} className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-white text-[14px] font-extrabold text-[#0b0d12] transition-colors hover:bg-[#d9ecff]">
                  ادامه <ArrowLeft className="size-4" aria-hidden="true" />
                </button>
              </Question>
            </motion.div>
          )}

          {step === "color" && (
            <motion.div key="color" {...fade}>
              <Question eyebrow="سوال ۳ از ۳" title="یک رنگ که حس برندتان را دارد" hint="بقیه پالت را خودمان هماهنگ می‌کنیم. اگر رنگ سازمانی دارید با قطره‌چکان همان را بزنید.">
                <div className="grid grid-cols-5 gap-3 lg:grid-cols-9">
                  {colors.map((color) => {
                    const selected = config.color === color.value;
                    return (
                      <button
                        key={color.value}
                        type="button"
                        aria-pressed={selected}
                        aria-label={color.label}
                        onClick={() => update({ color: color.value, accent: suggestAccents(color.value)[0].value })}
                        className={`flex aspect-square items-center justify-center rounded-2xl transition-transform active:scale-95 ${selected ? "scale-105 shadow-[0_0_0_3px_#0b0d12,0_0_0_5px_#fff]" : "hover:scale-105"}`}
                        style={{ backgroundColor: color.value }}
                      >
                        {selected && <Check className="size-5 text-white mix-blend-difference" strokeWidth={3} aria-hidden="true" />}
                      </button>
                    );
                  })}
                  <label className="relative flex aspect-square cursor-pointer items-center justify-center rounded-2xl bg-[conic-gradient(from_0deg,#ff5f6d,#ffc371,#47e891,#3fb4ff,#a66cff,#ff5f6d)]" title="رنگ دلخواه">
                    <span className="flex size-[60%] items-center justify-center rounded-xl bg-[#0b0d12]"><Pipette className="size-4 text-white" aria-hidden="true" /></span>
                    <input type="color" value={config.color} onChange={(event) => update({ color: event.target.value, accent: suggestAccents(event.target.value)[0].value })} aria-label="رنگ دلخواه" className="absolute inset-0 cursor-pointer opacity-0" />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMakingLine(0);
                    setStep("making");
                  }}
                  className="mt-8 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#4da3ff,#7c6cff)] text-[14px] font-extrabold text-white shadow-[0_14px_40px_-14px_rgba(77,163,255,0.9)] transition hover:brightness-110"
                >
                  طرح‌هایم را بساز <ArrowLeft className="size-4" aria-hidden="true" />
                </button>
              </Question>
            </motion.div>
          )}

          {step === "making" && (
            <motion.div key="making" {...fade} className="flex min-h-[60vh] flex-col items-center justify-center text-center" role="status" aria-live="polite">
              <KhayyamMark size={96} state="thinking" />
              <strong className="mt-8 text-[20px] text-white">در حال طراحی برای {config.brandName.trim() || industries[config.industry].label}</strong>
              <AnimatePresence mode="wait">
                <motion.p key={makingLine} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-3 text-[13px] text-[#8a93a0]">
                  {making[makingLine]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          )}

          {step === "results" && (
            <motion.div key="results" {...fade} className="mx-auto w-full max-w-[1400px]">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="text-[12px] font-bold text-[#4da3ff]">آماده شد</span>
                  <h1 className="mt-1 text-[24px] font-extrabold text-white lg:text-[32px]">سه طرح برای {config.brandName.trim() || industries[config.industry].label}</h1>
                  <p className="mt-1 text-[13px] text-[#8a93a0]">یکی را انتخاب کنید یا در استودیو تک‌تک جزئیاتش را عوض کنید.</p>
                </div>
                {kind === "site" && (
                  <div role="radiogroup" aria-label="دستگاه" className="flex gap-0.5 rounded-full bg-white/8 p-1 ring-1 ring-white/8">
                    {(
                      [
                        { value: "laptop", label: "لپ‌تاپ", icon: Laptop },
                        { value: "phone", label: "موبایل", icon: Smartphone },
                      ] as const
                    ).map((option) => (
                      <button key={option.value} type="button" role="radio" aria-checked={device === option.value} onClick={() => setDevice(option.value)} className={`flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-bold transition-colors ${device === option.value ? "bg-white text-[#0b0d12]" : "text-[#c9d0d9]"}`}>
                        <option.icon className="size-4" aria-hidden="true" /> {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
                {proposals.map((proposal, index) => (
                  <article key={proposal.key} className="flex w-[84%] shrink-0 snap-center flex-col overflow-hidden rounded-[26px] bg-[#111419] ring-1 ring-white/8 lg:w-auto">
                    <div className="relative h-[360px] lg:h-[300px] xl:h-[340px]" style={{ background: `radial-gradient(80% 70% at 50% 40%, ${proposal.config.color}33, transparent 70%)` }}>
                      <div className="absolute inset-4">
                        <DevicePreview kind={kind} config={proposal.config} device={device} />
                      </div>
                      <span className="absolute right-4 top-4 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">طرح {faNumber(index + 1)}</span>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <div className="flex items-center gap-2">
                        <strong className="text-[17px] text-white">{proposal.title}</strong>
                        <span className="ms-auto flex -space-x-1.5 space-x-reverse">
                          {[proposal.config.color, proposal.config.accent].map((swatch) => (
                            <span key={swatch} className="size-5 rounded-full ring-2 ring-[#111419]" style={{ backgroundColor: swatch }} />
                          ))}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {proposal.traits.map((trait) => (
                          <span key={trait} className="rounded-full bg-white/6 px-2.5 py-1 text-[11px] font-bold text-[#a7b0bc]">{trait}</span>
                        ))}
                      </div>
                      <div className="mt-auto flex gap-2 pt-2">
                        <button type="button" onClick={() => choose(proposal.key, false)} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-white text-[13px] font-extrabold text-[#0b0d12] transition-colors hover:bg-[#d9ecff]">
                          <Check className="size-4" aria-hidden="true" /> همین را می‌خواهم
                        </button>
                        <button type="button" onClick={() => choose(proposal.key, true)} aria-label="شخصی‌سازی در استودیو" title="شخصی‌سازی در استودیو" className="flex size-11 items-center justify-center rounded-2xl bg-white/8 text-white transition-colors hover:bg-white/14">
                          <Palette className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <p className="mt-4 text-center text-[12px] text-[#5d6573]">با دکمه پالت، همان طرح در استودیو باز می‌شود تا هر جزئیاتش را خودتان تنظیم کنید.</p>
            </motion.div>
          )}

          {step === "order" && (
            <motion.div key="order" {...fade} className="mx-auto w-full max-w-[560px]">
              <span className="text-[12px] font-bold text-[#4da3ff]">{proposals.find((item) => item.key === chosen)?.title}</span>
              <h1 className="mt-1 text-[24px] font-extrabold text-white lg:text-[30px]">چه چیزی برایتان آماده کنیم؟</h1>
              <p className="mb-6 mt-1 text-[13px] text-[#8a93a0]">همه این مقادیر طبق خواسته شما قابل تغییر است.</p>
              <OutcomeStep />
              <button
                type="button"
                onClick={() => void startPayment(amountDue(config.plan, estimate(kind, config).min)).then((ok) => ok && setStep("done"))}
                className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#4da3ff,#7c6cff)] text-[14px] font-extrabold text-white transition hover:brightness-110"
              >
                <Check className="size-4" aria-hidden="true" /> پرداخت {formatToman(amountDue(config.plan, estimate(kind, config).min))} و ثبت
              </button>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div key="done" {...fade} className="mx-auto flex min-h-[60vh] max-w-[480px] flex-col items-center justify-center text-center">
              <KhayyamMark size={80} state="intro" />
              <h1 className="mt-6 text-[24px] font-extrabold text-white">درخواست شما ثبت شد</h1>
              <p className="mt-2 text-[14px] leading-7 text-[#a7b0bc]">
                {config.plan === "consult" ? "کارشناس ما برای جلسه مشاوره با شما تماس می‌گیرد." : "طراحی فیگما شروع شد؛ طرح را برای تأیید برایتان می‌فرستیم و بعد ساخت را آغاز می‌کنیم."}
              </p>
              <button type="button" onClick={() => setMode("studio")} className="mt-8 flex h-11 items-center gap-2 rounded-2xl bg-white/8 px-5 text-[13px] font-bold text-white transition-colors hover:bg-white/14">
                <Palette className="size-4" aria-hidden="true" /> جزئیات بیشتر در استودیو
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
