import { CalendarDays, Clock3, UserRound } from "lucide-react";
import Image from "next/image";

export const BlogArticleDetail = () => {
  return (
    <article className=" px-5 pb-24 pt-16 sm:px-8 sm:pb-28 sm:pt-20 lg:pb-36 lg:pt-24" dir="rtl">
      <header className="mx-auto w-full max-w-[1100px] text-center">
        <p className="text-sm font-bold text-[#078ef0]">هوش مصنوعی و اتوماسیون</p>
        <h1 className="mx-auto mt-5 max-w-[900px] text-[32px] font-black leading-[1.45] tracking-[-0.03em] text-[#171c20] sm:text-[43px] lg:text-[50px]">
          خیام چه مشکلاتی را با هوش مصنوعی حل می‌کند؟
        </h1>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-[#7b898f] sm:text-sm">
          <span className="inline-flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#c8edf8] text-[#047fc7]">
              <UserRound className="size-4" aria-hidden="true" />
            </span>
            عارف مرادی
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden="true" />
            ۴ خرداد ۱۴۰۵
          </span>
          <span className="size-1.5 rounded-full bg-[#8a969b]" aria-hidden="true" />
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-4" aria-hidden="true" />
            مطالعه در ۶ دقیقه
          </span>
        </div>
      </header>

      <div className="relative mx-auto mt-8 aspect-[1.95/1] w-full max-w-[1100px] overflow-hidden rounded-2xl bg-[#cdeef9] shadow-[0_14px_38px_rgba(27,81,104,0.1)] sm:mt-10">
        <Image
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=90"
          alt="اعضای یک تیم در حال گفت‌وگو و همکاری با لپ‌تاپ"
          fill
          priority
          sizes="(max-width: 1160px) calc(100vw - 40px), 1100px"
          className="object-cover"
        />
      </div>

      <div className="mx-auto mt-16 w-full max-w-[1080px] sm:mt-20 lg:mt-24">
        <ArticleSection />
        <ArticleSection className="mt-16 sm:mt-20" />

        <div className="relative mt-12 aspect-[1.9/1] overflow-hidden rounded-xl bg-[#cdeef9] sm:mt-16">
          <Image
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1800&q=90"
            alt="توسعه‌دهنده در حال کار با لپ‌تاپ"
            fill
            sizes="(max-width: 1120px) calc(100vw - 40px), 1080px"
            className="object-cover"
          />
        </div>

        <blockquote className="mt-14 border-r-4 border-[#0798f2] py-2 pr-6 text-lg font-bold leading-9 text-[#078ef0] sm:mt-20 sm:text-xl sm:leading-10">
          هوش مصنوعی زمانی ارزش واقعی ایجاد می‌کند که مسئله مشخصی را حل کند؛ نه
          زمانی که فقط به‌عنوان یک قابلیت تازه به محصول اضافه شود.
        </blockquote>

        <ArticleSection className="mt-16 sm:mt-20" />

        <aside className="relative mt-20 overflow-hidden rounded-2xl bg-[#0b0c0e] px-6 py-14 text-center text-white shadow-[0_18px_44px_rgba(1,22,42,0.15)] sm:px-10 sm:py-20">
          <div aria-hidden="true" className="absolute -left-20 -top-20 size-72 rotate-12 bg-[conic-gradient(from_45deg,#533d70,#20223b,#75415b,#533d70)] opacity-70 blur-sm" />
          <div aria-hidden="true" className="absolute -bottom-24 -right-16 size-72 -rotate-12 bg-[conic-gradient(from_45deg,#6c321f,#261b1c,#8b4630,#6c321f)] opacity-65 blur-sm" />
          <div className="relative z-10">
            <h2 className="text-[27px] font-black leading-[1.5] sm:text-[34px]">
              برای رشد دیجیتال کسب‌وکار خود آماده‌اید؟
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/75 sm:text-base">
              تیم خیام آماده است تا مسیر دیجیتال شما را سریع‌تر و هوشمندتر کند.
            </p>
            <a
              href="#contact"
              className="mt-10 inline-flex min-h-14 min-w-[230px] items-center justify-center rounded-xl bg-[#2ca8f5] px-8 text-lg font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#0798f2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
            >
              شروع مشاوره
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
};

const ArticleSection = ({ className = "" }: { className?: string }) => (
  <section className={className}>
    <h2 className="text-[28px] font-black leading-[1.5] tracking-[-0.02em] text-[#1f272b] sm:text-[34px]">
      تیتر اول
    </h2>
    <h3 className="mt-7 text-lg font-extrabold leading-9 text-[#263036] sm:text-xl">
      کارهای تکراری، پاسخ‌گویی سخت، اطلاعات پراکنده یا فرایندهای زمان‌بر؛ خیام
      بررسی می‌کند کجا هوش مصنوعی واقعاً می‌تواند کار شما را ساده‌تر کند.
    </h3>
    <p className="mt-5 text-base leading-9 text-[#53646c] sm:text-lg sm:leading-10">
      کارهای تکراری، پاسخ‌گویی سخت، اطلاعات پراکنده یا فرایندهای زمان‌بر؛ خیام
      بررسی می‌کند کجا هوش مصنوعی واقعاً می‌تواند کار شما را ساده‌تر، سریع‌تر و
      کم‌هزینه‌تر کند. راهکار مناسب با شناخت دقیق نیازها شکل می‌گیرد و قدم‌به‌قدم
      برای استفاده واقعی در کسب‌وکار آماده می‌شود. این متن نمونه است و می‌توانید
      ادامه محتوای اصلی مقاله را بعداً در همین ساختار قرار دهید.
    </p>
  </section>
);
