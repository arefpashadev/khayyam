"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Layers3,
  Palette,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type OrderKind = "site" | "app";

const steps = [
  { number: 1, title: "حس محصول", description: "حس برندت را انتخاب کن" },
  { number: 2, title: "اطلاعات پروژه", description: "نیازها را انتخاب کن" },
  { number: 3, title: "تعادل بصری", description: "میزان جزئیات را مشخص کن" },
  { number: 4, title: "لحن طراحی", description: "رنگ و سبک را انتخاب کن" },
];

const visualOptions = {
  site: [
    { title: "گرم و صمیمی", description: "مناسب برندهای خانوادگی و فروشگاهی", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85" },
    { title: "لوکس و حرفه‌ای", description: "مناسب برندهای پریمیوم و شرکتی", image: "https://images.unsplash.com/photo-1530435460869-d13625c69bbf?auto=format&fit=crop&w=900&q=85" },
    { title: "ساده و کاربردی", description: "مناسب خدمات و محصولات دیجیتال", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85" },
  ],
  app: [
    { title: "ساده و سریع", description: "رابطی روشن برای انجام سریع کارها", image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=900&q=85" },
    { title: "مدرن و پویا", description: "مناسب اپلیکیشن‌های محصول‌محور", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=85" },
    { title: "حرفه‌ای و داده‌محور", description: "مناسب پنل‌ها و ابزارهای سازمانی", image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=900&q=85" },
  ],
};

export const OrderWizard = ({ kind }: { kind: OrderKind }) => {
  const [step, setStep] = useState(1);
  const [visual, setVisual] = useState(0);
  const [complexity, setComplexity] = useState("balanced");
  const [palette, setPalette] = useState("blue");
  const isApp = kind === "app";

  return (
    <main className="min-h-svh bg-white text-[#20262a]">
      <section className="px-5 pb-6 pt-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1220px] flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-right">
            <h1 className="text-[32px] font-black leading-[1.35] tracking-[-0.03em] sm:text-[42px]">
              ثبت سفارش <span className="text-[#078ef0]">{isApp ? "اپلیکیشن" : "سایت"}</span>
            </h1>
            <p className="mt-3 text-sm leading-7 text-[#536169] sm:text-base">
              لطفاً با سلیقه خودتان بخش‌ها و طراحی مناسب {isApp ? "اپ" : "سایت"} را انتخاب کنید.
            </p>
          </div>
          <div className="flex items-center gap-4 sm:flex-row-reverse">
            <button type="button" aria-label="بازگشت" onClick={() => history.back()} className="flex size-10 items-center justify-center rounded-full transition hover:bg-white/60">
              <ArrowLeft className="size-6" aria-hidden="true" />
            </button>
            <span className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-white text-[#078ef0] ring-2 ring-white">
              <UserRound className="size-6" aria-hidden="true" />
            </span>
            <div>
              <strong className="block text-sm">عارف مرادی پاشا</strong>
              <span className="mt-1 block text-[11px] text-[#748188]">مشاور پروژه شما</span>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="مراحل ثبت سفارش" className="border-b-8 border-[#dff7ff] bg-[#fbfbfc] px-5 py-6 sm:px-8">
        <ol className="mx-auto grid w-full max-w-[1040px] grid-cols-4">
          {steps.map((item, index) => {
            const active = item.number === step;
            const complete = item.number < step;
            return (
              <li key={item.number} className="relative text-center">
                {index < steps.length - 1 && <span className={`absolute right-1/2 top-5 h-px w-full ${complete ? "bg-[#078ef0]" : "bg-[#b8e5fb]"}`} aria-hidden="true" />}
                <button type="button" onClick={() => setStep(item.number)} className="relative z-10 inline-flex flex-col items-center outline-none">
                  <span className={`flex size-10 items-center justify-center rounded-full text-lg font-black transition ${active ? "bg-[#078ef0] text-white" : complete ? "bg-[#ccefff] text-[#078ef0]" : "bg-[#f1eff5] text-[#252b2f]"}`}>
                    {complete ? <Check className="size-5" aria-hidden="true" /> : new Intl.NumberFormat("fa-IR").format(item.number)}
                  </span>
                  <strong className="mt-2 hidden text-xs sm:block sm:text-sm">{item.title}</strong>
                  <span className="mt-1 hidden text-[10px] text-[#89949a] md:block">{item.description}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <section className="px-5 py-10 sm:px-8 lg:px-12 lg:py-12">
        <div className="mx-auto w-full max-w-[1220px]">
          <WizardStepHeading step={step} kind={kind} />

          {step === 1 && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visualOptions[kind].map((option, index) => (
                <button type="button" key={option.title} onClick={() => setVisual(index)} className={`group overflow-hidden rounded-2xl border bg-white p-2 text-right transition hover:-translate-y-1 hover:shadow-lg ${visual === index ? "border-[#078ef0] ring-3 ring-[#078ef0]/12" : "border-[#dce4e8]"}`}>
                  <div className="relative aspect-[1.48/1] overflow-hidden rounded-xl bg-[#e8f4f7]">
                    <Image src={option.image} alt="" fill sizes="(max-width: 639px) calc(100vw - 40px), 32vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="flex items-start gap-3 px-4 py-5">
                    <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${visual === index ? "border-[#078ef0] bg-[#078ef0] text-white" : "border-[#b9dff4]"}`}>
                      {visual === index && <Check className="size-3" aria-hidden="true" />}
                    </span>
                    <span>
                      <strong className="block text-lg">{option.title}</strong>
                      <span className="mt-2 block text-xs leading-6 text-[#69767d]">{option.description}</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 2 && <ProjectInfo kind={kind} />}
          {step === 3 && <ComplexityOptions value={complexity} onChange={setComplexity} />}
          {step === 4 && <PaletteOptions value={palette} onChange={setPalette} />}

          <div className="mt-14 flex items-center justify-between border-t border-[#edf0f2] pt-7 lg:mt-20">
            <button type="button" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))} className="inline-flex min-h-12 min-w-[150px] items-center justify-center gap-3 rounded-xl border border-[#d6dde1] px-6 font-bold transition hover:bg-[#f7fafb] disabled:opacity-40">
              <ArrowRight className="size-5" aria-hidden="true" /> قبلی
            </button>
            <button type="button" onClick={() => setStep((current) => Math.min(4, current + 1))} className="inline-flex min-h-12 min-w-[170px] items-center justify-center gap-3 rounded-xl bg-[#2ba6f3] px-7 font-extrabold text-white transition hover:bg-[#078ef0]">
              {step === 4 ? "ثبت انتخاب‌ها" : "بعدی"}
              {step < 4 && <ArrowLeft className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

const WizardStepHeading = ({ step, kind }: { step: number; kind: OrderKind }) => {
  const copy = [
    { title: `دوست دارید ${kind === "app" ? "اپلیکیشن" : "سایت"} چه حسی به مخاطب بدهد؟`, description: "سبکی را انتخاب کنید که به هویت برند و تجربه دلخواه شما نزدیک‌تر است." },
    { title: "کمی درباره پروژه به ما بگویید", description: "این اطلاعات کمک می‌کند پیشنهاد دقیق‌تری برای شما آماده کنیم." },
    { title: "چه میزان جزئیات و امکاناتی نیاز دارید؟", description: "تعادل مناسب میان سرعت، امکانات و بودجه را انتخاب کنید." },
    { title: "کدام لحن رنگی به برند شما نزدیک‌تر است؟", description: "این انتخاب نقطه شروع طراحی است و بعداً قابل اصلاح خواهد بود." },
  ][step - 1];
  return <header className="text-right"><h2 className="text-[24px] font-black leading-[1.5] sm:text-[30px]">{new Intl.NumberFormat("fa-IR").format(step)}. {copy.title}</h2><p className="mt-4 text-sm leading-7 text-[#65747b] sm:text-base">{copy.description}</p></header>;
};

const ProjectInfo = ({ kind }: { kind: OrderKind }) => (
  <div className="mt-10 grid gap-5 sm:grid-cols-2">
    <WizardField label="نام برند یا پروژه" placeholder="مثلاً خیام" />
    <WizardField label="حوزه فعالیت" placeholder="مثلاً فروشگاه آنلاین" />
    <WizardField label="مخاطب اصلی" placeholder="مشتریان شما چه کسانی هستند؟" />
    <WizardField label={kind === "app" ? "پلتفرم موردنظر" : "نوع سایت"} placeholder={kind === "app" ? "اندروید، iOS یا هر دو" : "فروشگاهی، شرکتی یا خدماتی"} />
  </div>
);

const WizardField = ({ label, placeholder }: { label: string; placeholder: string }) => <label className="block"><span className="mb-2 block text-sm font-bold">{label}</span><input placeholder={placeholder} className="min-h-13 w-full rounded-xl border border-[#d9e2e6] bg-[#fbfdfe] px-4 text-sm outline-none transition focus:border-[#078ef0] focus:ring-4 focus:ring-[#078ef0]/10" /></label>;

const ComplexityOptions = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const options = [{ value: "simple", title: "اقتصادی و ساده", text: "امکانات ضروری و تحویل سریع" }, { value: "balanced", title: "متعادل", text: "تعادل مناسب امکانات و بودجه" }, { value: "advanced", title: "پیشرفته", text: "جزئیات بیشتر و قابلیت‌های اختصاصی" }];
  return <div className="mt-10 grid gap-5 sm:grid-cols-3">{options.map((option) => <ChoiceCard key={option.value} active={value === option.value} onClick={() => onChange(option.value)} icon={<Layers3 />} title={option.title} text={option.text} />)}</div>;
};

const PaletteOptions = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const options = [{ value: "blue", title: "اعتماد و فناوری", colors: ["#078ef0", "#9bdcff", "#07162b"] }, { value: "warm", title: "گرم و صمیمی", colors: ["#f08b4b", "#ffd5a5", "#7a3426"] }, { value: "nature", title: "طبیعی و آرام", colors: ["#20aa77", "#bcebd8", "#174f42"] }];
  return <div className="mt-10 grid gap-5 sm:grid-cols-3">{options.map((option) => <button type="button" key={option.value} onClick={() => onChange(option.value)} className={`rounded-2xl border bg-white p-6 text-right transition hover:-translate-y-1 hover:shadow-lg ${value === option.value ? "border-[#078ef0] ring-3 ring-[#078ef0]/12" : "border-[#dce4e8]"}`}><Palette className="size-6 text-[#078ef0]" aria-hidden="true" /><div className="mt-6 flex gap-2">{option.colors.map((color) => <span key={color} className="h-14 flex-1 rounded-lg" style={{ backgroundColor: color }} />)}</div><strong className="mt-5 block text-lg">{option.title}</strong></button>)}</div>;
};

const ChoiceCard = ({ active, onClick, icon, title, text }: { active: boolean; onClick: () => void; icon: React.ReactElement; title: string; text: string }) => <button type="button" onClick={onClick} className={`rounded-2xl border bg-white p-7 text-right transition hover:-translate-y-1 hover:shadow-lg ${active ? "border-[#078ef0] ring-3 ring-[#078ef0]/12" : "border-[#dce4e8]"}`}><span className="flex size-12 items-center justify-center rounded-xl bg-[#eef8ff] text-[#078ef0] [&_svg]:size-6">{icon}</span><strong className="mt-6 block text-lg">{title}</strong><span className="mt-3 block text-sm leading-7 text-[#68757c]">{text}</span></button>;
