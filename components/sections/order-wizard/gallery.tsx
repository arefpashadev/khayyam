"use client";

import { ArrowLeft, ArrowRight, Check, CircleHelp, MessageCircle, X } from "lucide-react";

import { Link } from "@/i18n/navigation";

import { faNumber, firstEditorStep, industries, steps, type IndustryKey, type OrderKind } from "./config";
import { DESIGN_COUNT } from "./designs";
import { DesignThumb } from "./preview/thumbnail";
import { useWizard } from "./store";
import { Tour } from "./tour";

const phases = ["حوزه کاری", "طرح", "شخصی‌سازی"];
const designStep = steps.findIndex((step) => step.key === "design");

const PhaseSteps = ({ current }: { current: number }) => (
  <ol data-tour="gallery-steps" className="flex items-center gap-1.5 rounded-full bg-white p-1 shadow-[0_1px_2px_rgba(20,32,43,0.06)]">
    {phases.map((phase, index) => (
      <li key={phase} className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold ${index === current ? "bg-[#14202b] text-white" : index < current ? "text-[#14202b]" : "text-[#a3aeb4]"}`}>
        <span className={`flex size-5 items-center justify-center rounded-full text-[10px] ${index === current ? "bg-white/15" : index < current ? "bg-[#22c27a] text-white" : "bg-[#eef1f3]"}`}>
          {index < current ? <Check className="size-3" strokeWidth={3} aria-hidden="true" /> : faNumber(index + 1)}
        </span>
        <span className={index === current ? "" : "hidden sm:inline"}>{phase}</span>
      </li>
    ))}
  </ol>
);

const IndustryGallery = ({ kind }: { kind: OrderKind }) => {
  const config = useWizard((state) => state.config);
  const setIndustry = useWizard((state) => state.setIndustry);
  const goTo = useWizard((state) => state.goTo);

  return (
    <div data-tour="industry-grid" className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
      {(Object.keys(industries) as IndustryKey[]).map((key) => {
        const item = industries[key];
        const selected = config.industry === key;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={selected}
            onClick={() => {
              setIndustry(key);
              goTo(designStep);
            }}
            className={`group overflow-hidden rounded-2xl p-1.5 text-right transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#078ef0] lg:p-2 ${selected ? "bg-[#e6f2fc]" : "bg-white hover:bg-[#eef3f6]"}`}
          >
            <div className="overflow-hidden rounded-xl ring-1 ring-black/5">
              <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                <DesignThumb kind={kind} config={{ ...config, industry: key, variant: 0, brandName: config.brandName || item.label }} />
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-1.5 pb-1 pt-2.5 lg:px-2 lg:pt-3">
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg lg:size-9 ${selected ? "bg-[#078ef0] text-white" : "bg-[#f1f4f6] text-[#4d5b65]"}`}>
                <item.icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-[13px] lg:text-[15px]">{item.label}</strong>
                <span className="text-[11px] text-[#8a959b]">{faNumber(DESIGN_COUNT)} طرح اختصاصی</span>
              </span>
              <ArrowLeft className="hidden size-4 text-[#a3aeb4] transition-transform group-hover:-translate-x-1 lg:block" aria-hidden="true" />
            </div>
          </button>
        );
      })}
    </div>
  );
};

const DesignGallery = ({ kind }: { kind: OrderKind }) => {
  const config = useWizard((state) => state.config);
  const setVariant = useWizard((state) => state.setVariant);

  return (
    <>
      <p className="mb-5 flex gap-2 rounded-xl bg-white px-3.5 py-2.5 text-[12px] leading-6 text-[#5b6872] lg:text-[13px]">
        <MessageCircle className="mt-1 size-4 shrink-0 text-[#078ef0]" aria-hidden="true" />
        این‌ها همه کارهایی نیست که می‌توانیم انجام دهیم. نزدیک‌ترین طرح را انتخاب کنید؛ رنگ، نوشته‌ها و بخش‌هایش را در قدم بعد تغییر می‌دهید و بعد از ثبت درخواست هم هر تغییری بخواهید اعمال می‌کنیم.
      </p>
      <div className={`grid gap-3 lg:gap-4 ${kind === "app" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"}`}>
        {Array.from({ length: DESIGN_COUNT }, (_, design) => {
          const selected = design === config.variant;
          return (
            <button
              key={design}
              type="button"
              aria-pressed={selected}
              aria-label={`طرح ${faNumber(design + 1)}`}
              onClick={() => setVariant(design)}
              className={`group overflow-hidden rounded-2xl p-1.5 text-right transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#078ef0] ${selected ? "bg-[#e6f2fc]" : "bg-white hover:bg-[#eef3f6]"}`}
            >
              <div className="overflow-hidden rounded-xl ring-1 ring-black/5">
                <DesignThumb kind={kind} config={{ ...config, variant: design }} />
              </div>
              <span className={`flex items-center justify-between px-1.5 pb-0.5 pt-2 text-[12px] font-bold ${selected ? "text-[#0a5a9c]" : "text-[#5b6872]"}`}>
                طرح {faNumber(design + 1)}
                {selected && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#078ef0] text-white">
                    <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};

/** Steps 1–2: full-screen galleries. The gallery itself is the preview, so no device frames here. */
export const GalleryShell = ({ kind }: { kind: OrderKind }) => {
  const step = useWizard((state) => state.step);
  const config = useWizard((state) => state.config);
  const goTo = useWizard((state) => state.goTo);
  const setTour = useWizard((state) => state.setTour);
  const current = steps[step];
  const isDesign = current.key === "design";

  return (
    <div className="flex size-full flex-col bg-[#f2f5f7]">
      <header className="flex h-14 shrink-0 items-center gap-3 px-4 lg:h-16 lg:px-8">
        <span className="hidden size-10 items-center justify-center rounded-xl bg-[#14202b] text-[17px] font-black text-white lg:flex">خ</span>
        <strong className="hidden text-[14px] lg:block">{kind === "app" ? "ساخت اپلیکیشن" : "ساخت سایت"}</strong>
        <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <PhaseSteps current={isDesign ? 1 : 0} />
        </div>
        <div className="ms-auto flex items-center gap-1">
          <button type="button" onClick={() => setTour({ name: "intro", step: 0 })} aria-label="راهنما" className="flex size-9 items-center justify-center rounded-full text-[#5b6872] transition-colors hover:bg-white">
            <CircleHelp className="size-[18px]" aria-hidden="true" />
          </button>
          <Link href="/" aria-label="خروج" className="flex size-9 items-center justify-center rounded-full text-[#5b6872] transition-colors hover:bg-white">
            <X className="size-[18px]" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-[1280px] px-4 pb-8 pt-3 lg:px-10 lg:pt-8">
          <h1 className="text-[20px] font-extrabold leading-[1.6] lg:text-[30px]">
            {isDesign ? `طرح‌های ${industries[config.industry].label}` : current.question(kind)}
          </h1>
          <p className="mb-5 mt-1 text-[12px] leading-6 text-[#7a868d] lg:mb-8 lg:text-[14px]">{current.hint}</p>
          {isDesign ? <DesignGallery kind={kind} /> : <IndustryGallery kind={kind} />}
        </div>
      </div>

      {isDesign && (
        <footer className="shrink-0 border-t border-black/5 bg-white/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1280px] items-center gap-2 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:px-10 lg:py-4">
            <button type="button" onClick={() => goTo(0)} className="flex h-11 items-center gap-2 rounded-xl bg-[#f1f4f6] px-4 text-[13px] font-bold text-[#4d5b65] transition-colors hover:bg-[#e6ebee]">
              <ArrowRight className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">تغییر حوزه</span>
            </button>
            <button
              type="button"
              onClick={() => goTo(firstEditorStep)}
              className="ms-auto flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#14202b] px-6 text-[13px] font-extrabold text-white transition-colors hover:bg-[#078ef0] sm:flex-none"
            >
              شخصی‌سازی طرح {faNumber(config.variant + 1)}
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>
          </div>
        </footer>
      )}
      <Tour kind={kind} name="intro" />
    </div>
  );
};
