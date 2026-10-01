import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
} from "lucide-react";
import Image from "next/image";

import { Link } from "@/i18n/navigation";

const articles = [
  {
    title: "چطور با سایت حرفه‌ای فروش بیشتری داشته باشیم؟",
    description:
      "از تجربه کاربری تا سرعت و اعتمادسازی؛ مهم‌ترین بخش‌هایی که یک سایت را به ابزار واقعی فروش تبدیل می‌کنند.",
    date: "۴ خرداد ۱۴۰۵",
    readingTime: "۶ دقیقه مطالعه",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "اپلیکیشن موبایل چه کمکی به رشد کسب‌وکار می‌کند؟",
    description:
      "بررسی می‌کنیم چه زمانی ساخت اپلیکیشن تصمیم درستی است و چطور می‌تواند ارتباط با مشتری را بهتر کند.",
    date: "۱۱ خرداد ۱۴۰۵",
    readingTime: "۵ دقیقه مطالعه",
    image:
      "https://images.unsplash.com/photo-1530435460869-d13625c69bbf?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "هوش مصنوعی را از کجای کسب‌وکار شروع کنیم؟",
    description:
      "یک مسیر ساده برای پیدا کردن فرایندهای مناسب، کاهش هزینه‌ها و شروع کم‌ریسک استفاده از هوش مصنوعی.",
    date: "۱۸ خرداد ۱۴۰۵",
    readingTime: "۸ دقیقه مطالعه",
    image:
      "https://images.unsplash.com/photo-1781914476939-91a41b914899?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "راهنمای انتخاب تیم طراحی و توسعه محصول",
    description:
      "قبل از شروع همکاری، چه سؤال‌هایی بپرسیم و چطور کیفیت، زمان‌بندی و هزینه واقعی پروژه را ارزیابی کنیم؟",
    date: "۲۵ خرداد ۱۴۰۵",
    readingTime: "۷ دقیقه مطالعه",
    image:
      "https://images.unsplash.com/photo-1744555270794-6d378b9e7cd3?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "از ایده تا محصول؛ مراحل ساخت یک وب‌اپلیکیشن",
    description:
      "نگاهی کاربردی به مسیر تحلیل، طراحی، توسعه، آزمایش و عرضه یک محصول دیجیتال موفق.",
    date: "۱ تیر ۱۴۰۵",
    readingTime: "۹ دقیقه مطالعه",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "چطور هزینه توسعه نرم‌افزار را مدیریت کنیم؟",
    description:
      "با اولویت‌بندی قابلیت‌ها و انتخاب مسیر درست، بودجه پروژه را کنترل کنید بدون اینکه کیفیت قربانی شود.",
    date: "۸ تیر ۱۴۰۵",
    readingTime: "۶ دقیقه مطالعه",
    image:
      "https://images.unsplash.com/photo-1770899621442-24237af4c8b4?auto=format&fit=crop&w=1000&q=85",
  },
];

export const AiRelatedBlogs = ({
  showHeader = true,
  showPagination = false,
  limit,
  title = "وبلاگ‌های مرتبط",
  description =
    "مطالب مرتبط و کاربردی که به شما کمک می‌کند دانش خود را درباره طراحی سایت، برنامه‌نویسی و فناوری‌های نوین افزایش دهید.",
}: {
  showHeader?: boolean;
  showPagination?: boolean;
  limit?: number;
  title?: string;
  description?: string;
}) => {
  return (
    <section
      id="blog"
      aria-labelledby={showHeader ? "ai-related-blogs-title" : undefined}
      aria-label={showHeader ? undefined : "مقالات وبلاگ"}
      className={`px-5 sm:px-8 ${
        showHeader
          ? "py-24 sm:py-28 lg:py-36"
          : "pb-24 pt-5 sm:pb-28 lg:pb-36"
      }`}
    >
      <div className="mx-auto w-full max-w-[1100px]">
        {showHeader && (
          <header className="text-right">
            <h2
              id="ai-related-blogs-title"
              className="text-[30px] font-black leading-[1.4] tracking-[-0.025em] text-[#171b1f] sm:text-[38px]"
            >
              {title}
            </h2>
            <p className="mt-5 max-w-[760px] text-sm leading-7 text-[#536169] sm:text-base sm:leading-8">
              {description}
            </p>
          </header>
        )}

        <div className={`${showHeader ? "mt-12 sm:mt-16" : ""} grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16`}>
          {articles.slice(0, limit).map((article, index) => (
            <article key={article.title} className="group min-w-0">
              <Link
                href={`/blog/${index + 1}`}
                className="block rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-[#0798f2]/25"
                aria-label={`مطالعه مقاله ${article.title}`}
              >
                <div className="relative aspect-[1.52/1] overflow-hidden rounded-xl  shadow-[0_10px_28px_rgba(27,81,104,0.08)]">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 46vw, 340px"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#59666e] sm:text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5 text-[#078ef0]" aria-hidden="true" />
                    {article.date}
                  </span>
                  <span className="size-1.5 rounded-full bg-[#58646a]" aria-hidden="true" />
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-3.5 text-[#078ef0]" aria-hidden="true" />
                    {article.readingTime}
                  </span>
                </div>

                <h3 className="mt-5 flex items-start justify-between gap-4 text-base font-extrabold leading-7 text-[#242a2e] transition-colors group-hover:text-[#078ef0]">
                  <span>{article.title}</span>
                  <ArrowLeft className="mt-1 size-4 shrink-0 text-[#078ef0] opacity-0 transition group-hover:-translate-x-1 group-hover:opacity-100" aria-hidden="true" />
                </h3>
                <p className="mt-3 line-clamp-2 text-xs leading-6 text-[#66737a] sm:text-[13px]">
                  {article.description}
                </p>
              </Link>
            </article>
          ))}
        </div>

        {showPagination && (
          <nav
            aria-label="صفحه‌بندی مقالات"
            className="mt-20 flex items-center justify-center gap-3 sm:mt-28"
          >
            <PaginationButton label="صفحه قبل">
              <ChevronLeft className="size-4" aria-hidden="true" />
            </PaginationButton>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                type="button"
                key={page}
                aria-current={page === 1 ? "page" : undefined}
                className={`flex size-11 items-center justify-center rounded-lg border text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0798f2]/20 ${
                  page === 1
                    ? "border-[#8ed9f6] bg-[#c9edf8] text-[#182126]"
                    : "border-[#8ed9f6] bg-white/20 text-[#2c393f] hover:border-[#0798f2] hover:bg-white/60"
                }`}
              >
                {new Intl.NumberFormat("fa-IR").format(page)}
              </button>
            ))}
            <PaginationButton label="صفحه بعد">
              <ChevronRight className="size-4" aria-hidden="true" />
            </PaginationButton>
          </nav>
        )}
      </div>
    </section>
  );
};

const PaginationButton = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    aria-label={label}
    className="flex size-11 items-center justify-center rounded-lg border border-[#8ed9f6] bg-white/20 text-[#2c393f] transition hover:border-[#0798f2] hover:bg-white/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0798f2]/20"
  >
    {children}
  </button>
);
