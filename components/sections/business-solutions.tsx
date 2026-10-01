import {
  Blocks,
  Bot,
  Monitor,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import { Link } from "@/i18n/navigation";

type BusinessSolution = {
  description: string;
  href: "/ai" | "/createapp" | "/createsite";
  icon: LucideIcon;
  summary: string;
  title: string;
};

const businessSolutions: BusinessSolution[] = [
  {
    title: "ساخت و طراحی سایت",
    summary:
      "برای کسب‌وکارهایی که می‌خواهند در اینترنت دیده شوند، مشتری جذب کنند و خدمات یا محصولاتشان را حرفه‌ای ارائه دهند.",
    description:
      "اگر فروشگاه، شرکت، مجموعه خدماتی، برند شخصی، استارتاپ، آموزشگاه، کلینیک، رستوران یا هر کسب‌وکار دیگری دارید که مشتریان شما قبل از خرید درباره‌تان جست‌وجو می‌کنند، داشتن یک سایت حرفه‌ای می‌تواند مهم‌ترین پایگاه آنلاین شما باشد. طراحی سایت حرفه‌ای کمک می‌کند اطلاعات کامل، خدمات، نمونه‌کارها، راه‌های ارتباطی و محصولاتتان را منظم و قابل اعتماد ارائه دهید.",
    href: "/createsite",
    icon: Monitor,
  },
  {
    title: "ساخت و طراحی اپلیکیشن",
    summary:
      "برای کسب‌وکارهایی که کاربرانشان نیاز دارند به‌صورت مداوم و سریع با خدمات آن‌ها در ارتباط باشند.",
    description:
      "اگر مشتریان شما مرتب سفارش ثبت می‌کنند، محتوا می‌بینند، پرداخت انجام می‌دهند، رزرو می‌کنند یا به امکانات خاصی نیاز دارند که باید همیشه در دسترسشان باشد، اپلیکیشن می‌تواند تجربه بسیار بهتری ایجاد کند. این راهکار برای فروشگاه‌ها، پلتفرم‌های خدماتی، مجموعه‌های آموزشی، باشگاه‌ها و سیستم‌های رزرو انتخابی مناسب و قابل توسعه است.",
    href: "/createapp",
    icon: Smartphone,
  },
  {
    title: "اتوماسیون کسب‌وکار",
    summary:
      "برای مجموعه‌هایی که کارهای تکراری زیادی دارند و می‌خواهند سریع‌تر، دقیق‌تر و با نیروی انسانی کمتر کار کنند.",
    description:
      "اگر بخشی از زمان تیم شما صرف ثبت اطلاعات، ارسال پیام، تهیه گزارش، پیگیری مشتری، صدور فاکتور، انتقال داده بین نرم‌افزارها یا انجام فرایندهای تکراری می‌شود، احتمالاً اتوماسیون می‌تواند زمان و هزینه زیادی ذخیره کند. این راهکار برای فروشگاه‌ها، شرکت‌ها، تیم‌های فروش، مجموعه‌های خدماتی و کسب‌وکارهای در حال رشد مناسب است.",
    href: "/ai",
    icon: Blocks,
  },
  {
    title: "راهکارهای هوش مصنوعی",
    summary:
      "برای کسب‌وکارهایی که می‌خواهند از داده‌ها، محتوا و فرایندهایشان هوشمندتر استفاده کنند.",
    description:
      "هوش مصنوعی فقط یک چت‌بات نیست. می‌توان از آن برای پاسخ‌گویی به مشتریان، تحلیل اطلاعات، تولید و دسته‌بندی محتوا، پیشنهاد محصول، جست‌وجوی هوشمند، پردازش اسناد، ساخت دستیار اختصاصی و خودکارسازی تصمیم‌های کاربردی استفاده کرد. این خدمات برای فروشگاه‌های آنلاین، شرکت‌های خدماتی، تیم‌های پشتیبانی، پلتفرم‌های محتوایی و مجموعه‌های داده‌محور مناسب است.",
    href: "/ai",
    icon: Bot,
  },
];

export const BusinessSolutions = () => {
  return (
    <section
      id="packages"
      aria-labelledby="business-solutions-title"
      className="bg-[#e1f8ff] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:pb-36 lg:pt-[86px]"
    >
      <div className="mx-auto w-full max-w-[1160px]">
        <header className="mx-auto max-w-[760px] text-center">
          <h2
            id="business-solutions-title"
            className="text-[30px] font-extrabold leading-[1.5] tracking-[-0.025em] text-[#171717] sm:text-[38px] lg:text-[40px]"
          >
            راهکار مناسب کسب‌وکار شما کدام است؟
          </h2>
          <p className="mt-6 text-sm leading-7 text-[#43515a] sm:text-base sm:leading-8">
            ما وب‌سایت، اپلیکیشن، سیستم‌های اتوماسیون و راهکارهای هوش مصنوعی
            طراحی می‌کنیم تا فروش، مدیریت و ارتباط با مشتریان شما ساده‌تر و
            حرفه‌ای‌تر شود.
          </p>
        </header>

        <div className="mt-14 space-y-8 sm:mt-16">
          {businessSolutions.map((solution) => {
            const Icon = solution.icon;

            return (
              <article
                key={solution.title}
                className="rounded-md border border-[#c9dce3] bg-white px-6 py-7 text-right shadow-[0_3px_12px_rgba(34,97,132,0.035)] sm:px-10 sm:py-9"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    aria-hidden="true"
                    className="size-6 shrink-0 fill-[#0799ef] text-[#0799ef]"
                    strokeWidth={2}
                  />
                  <h3 className="text-[25px] font-bold leading-[1.45] text-[#101010] sm:text-[30px]">
                    {solution.title}
                  </h3>
                </div>

                <p className="mt-5 text-[15px] font-bold leading-8 text-[#0799ef] sm:text-base">
                  {solution.summary}
                </p>
                <p className="mt-4 text-sm leading-8 text-[#171717] sm:text-[15px] sm:leading-9">
                  {solution.description}
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href={solution.href}
                    className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#0799ef] px-9 text-base font-bold text-white outline-none transition-colors hover:bg-[#007fcf] focus-visible:ring-4 focus-visible:ring-[#0799ef]/30"
                  >
                    شروع طراحی
                  </Link>
                  <Link
                    href={solution.href}
                    className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#0799ef] bg-white px-7 text-base text-[#333] outline-none transition-colors hover:bg-[#eef9ff] focus-visible:ring-4 focus-visible:ring-[#0799ef]/20"
                  >
                    مشاهده جزئیات
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
