import { cn } from "@/lib/utils";

const solutions = [
  { title: "اتوماسیون کارهای تکراری", description: "فرایندهای زمان‌بر را خودکار می‌کنیم تا تیم شما روی کارهای مهم‌تر تمرکز کند." },
  { title: "دستیار هوشمند پاسخ‌گو", description: "پاسخ‌گویی سریع و دقیق به مشتریان، بدون محدودیت ساعت و افزایش حجم درخواست‌ها." },
  { title: "تحلیل هوشمند داده‌ها", description: "داده‌های پراکنده را به گزارش‌های روشن و قابل استفاده برای تصمیم‌گیری تبدیل می‌کنیم." },
  { title: "مدیریت و تولید محتوا", description: "از ایده‌پردازی تا تولید و دسته‌بندی محتوا، مسیر انتشار را سریع‌تر و منسجم‌تر می‌کنیم." },
  { title: "پیش‌بینی و تصمیم‌سازی", description: "با شناسایی الگوها، فرصت‌ها و ریسک‌های پیش رو را زودتر و دقیق‌تر مشخص می‌کنیم." },
  { title: "راهکار اختصاصی کسب‌وکار", description: "راهکاری متناسب با فرایند، داده و هدف واقعی کسب‌وکار شما طراحی و پیاده‌سازی می‌کنیم." },
];

export const AiSolutions = () => (
  <section aria-labelledby="ai-solutions-title" className="relative min-h-[720px] overflow-hidden bg-[#e1f8ff] px-5 pb-24 pt-24 sm:px-8 sm:pt-28 lg:min-h-[790px] lg:pb-32 lg:pt-36">
    <div className="mx-auto flex max-w-[920px] flex-col items-stretch text-right">
      <h2 id="ai-solutions-title" className="w-full text-right text-[27px] font-black leading-[1.5] tracking-[-0.02em] text-[#181c20] sm:text-[34px] lg:text-[38px]" style={{ direction: "rtl", textAlign: "right" }}>
        خیام چه مشکلاتی را با هوش مصنوعی حل می‌کند؟
      </h2>
      <div className="mt-5 w-full sm:mt-6">
        <p className="ml-auto w-full max-w-[760px] text-right text-sm leading-7 text-[#4c5a62] sm:text-base sm:leading-8" style={{ direction: "rtl", textAlign: "right" }}>
          کارهای تکراری، پاسخ‌گویی سخت، اطلاعات پراکنده یا فرایندهای زمان‌بر؛ خیام بررسی می‌کند کجا هوش مصنوعی واقعاً می‌تواند کار شما را ساده‌تر، سریع‌تر و کم‌هزینه‌تر کند.
        </p>
      </div>
      <div className="mt-12 grid w-full grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {solutions.map((solution, index) => {
          const isFeatured = index === 0;
          return (
            <article key={solution.title} className={cn("relative min-h-[150px] overflow-hidden rounded-2xl border p-6 text-right shadow-[0_12px_30px_rgba(29,76,96,0.08)] sm:min-h-[160px]", isFeatured ? "z-10 -translate-y-1 rotate-[2.5deg] border-[#0b2740] bg-[#07162b] text-white shadow-[0_18px_36px_rgba(1,22,42,0.22)]" : "border-white/80 bg-white text-[#171b1f]")}>
              <span className={cn("block w-full text-right text-base font-bold", isFeatured && "text-[#0799ef]")}>{solution.title}</span>
              <span className={cn("mt-4 block w-full text-right text-sm leading-6", isFeatured ? "text-white/75" : "text-[#647078]")}>{solution.description}</span>
              <span aria-hidden="true" className={cn("absolute bottom-2 left-3 text-[10px] tracking-[2px]", isFeatured ? "text-white/35" : "text-[#8a979d]")}>•••</span>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);
