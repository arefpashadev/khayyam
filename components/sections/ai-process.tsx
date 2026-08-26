import { ArrowLeft } from "lucide-react";

const steps = [
  { number: "۱", title: "شناخت نیاز", description: "نیازها، هدف و مسئله اصلی کسب‌وکار شما را بررسی می‌کنیم.", position: "0% 0%" },
  { number: "۲", title: "تحلیل و پیشنهاد", description: "بهترین راهکار، زمان اجرا و مسیر پروژه را مشخص می‌کنیم.", position: "50% 0%" },
  { number: "۳", title: "طراحی راهکار", description: "ساختار، تجربه مناسب و جزئیات مورد نیاز شما طراحی می‌شود.", position: "100% 0%" },
  { number: "۴", title: "توسعه و اجرا", description: "راهکار نهایی با تمرکز بر کیفیت و عملکرد ساخته می‌شود.", position: "0% 100%" },
  { number: "۵", title: "تست و تحویل", description: "پروژه بررسی، اصلاح و آماده استفاده نهایی می‌شود.", position: "50% 100%" },
  { number: "۶", title: "پشتیبانی و رشد", description: "بعد از تحویل، برای رفع مشکل و توسعه بیشتر کنار شما هستیم.", position: "100% 100%" },
];

export const AiProcess = () => (
  <section aria-labelledby="ai-process-title" className="px-5 pb-28 pt-20 sm:px-8 sm:pb-32 sm:pt-24 lg:pb-40 lg:pt-28">
    <div className="mx-auto w-full max-w-[1050px]">
      <div className="text-right" dir="rtl">
        <h2 id="ai-process-title" className="text-[28px] font-black leading-[1.45] tracking-[-0.02em] text-[#171b1f] sm:text-[34px]">از روز اول، می‌دانید پروژه کجاست</h2>
        <p className="mt-5 max-w-[830px] text-sm leading-7 text-[#536169] sm:text-base sm:leading-8">مسیر انجام پروژه در خیام شفاف و مرحله‌به‌مرحله است؛ از شناخت نیاز تا طراحی، اجرا، تحویل و پشتیبانی.</p>
      </div>
      <ol className="mt-12 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3" dir="rtl">
        {steps.map((step) => (
          <li key={step.number} className="group overflow-hidden rounded-2xl border border-white bg-white/95 p-2 shadow-[0_12px_32px_rgba(27,81,104,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(27,81,104,0.12)]">
            <article>
              <div className="flex items-center gap-2 px-2 pb-3 pt-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#129cff] bg-[#edf8ff] text-sm font-bold text-[#078ef0]">{step.number}</span>
                <span className="h-px flex-1 bg-[#8dd4ff]" aria-hidden="true" />
                <ArrowLeft aria-hidden="true" className="size-4 text-[#078ef0] transition-transform group-hover:-translate-x-1" strokeWidth={1.8} />
              </div>
              <div className="px-3 pb-4 text-right">
                <h3 className="text-lg font-extrabold text-[#20262a]">{step.title}</h3>
                <p className="mt-2 min-h-12 text-[13px] leading-6 text-[#65727a]">{step.description}</p>
              </div>
              <div role="img" aria-label={`تصویرسازی مرحله ${step.title}`} className="aspect-[1.45/1] w-full rounded-xl bg-[url('/images/ai-process/process-sprite.png')] bg-[length:300%_200%] bg-no-repeat" style={{ backgroundPosition: step.position }} />
            </article>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
