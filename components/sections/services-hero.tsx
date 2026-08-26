import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";

const ServiceArrow = ({
  className,
  label,
}: {
  className: string;
  label: string;
}) => (
  <span
    aria-label={label}
    className={`flex size-11 items-center justify-center rounded-full border transition-transform duration-300 group-hover:-translate-x-1 ${className}`}
  >
    <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={1.7} />
  </span>
);

export const ServicesHero = () => {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="bg-[#e1f8ff] px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-12 lg:pb-[110px] lg:pt-[70px]"
    >
      <div
        dir="ltr"
        className="mx-auto grid w-full max-w-[1160px] gap-5 lg:grid-cols-[1.67fr_1fr] lg:gap-8"
      >
        <div className="flex flex-col gap-6 lg:col-start-2 lg:row-start-1 lg:gap-0">
          <header
            dir="rtl"
            className="flex flex-col justify-center px-1 pb-6 text-right sm:px-4 lg:min-h-[385px] lg:justify-start lg:px-4 lg:pb-5 lg:pt-10"
          >
            <h1
              id="services-title"
              className="text-[34px] font-extrabold leading-[1.45] tracking-[-0.025em] text-[#171717] sm:text-[42px] lg:text-[40px]"
            >
              زیرساخت دیجیتال برای
              <br />
              رشد کسب‌وکارها
            </h1>
            <p className="mt-7 max-w-[430px] text-[15px] leading-8 text-[#34424a] sm:text-base sm:leading-9 lg:mt-6 lg:text-[15px] lg:leading-8">
              ما وب‌سایت، اپلیکیشن، سیستم‌های اتوماسیون و راهکارهای هوش مصنوعی
              طراحی می‌کنیم تا فروش، مدیریت و ارتباط با مشتریان شما ساده‌تر و
              حرفه‌ای‌تر شود.
            </p>
          </header>

          <Link
            href="/createsite"
            dir="rtl"
            aria-label="مشاهده خدمات طراحی و توسعه وب‌سایت"
            className="group relative isolate min-h-[390px] overflow-hidden rounded-[28px] bg-white p-7 text-right outline-none focus-visible:ring-4 focus-visible:ring-[#1bb7c3]/35 sm:min-h-[420px] sm:p-10 lg:min-h-[422px]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[#80cbd0] [clip-path:ellipse(96%_74%_at_0%_100%)]"
            />
            <div className="relative z-10">
              <h2 className="text-[27px] font-bold leading-[1.5] text-[#101010] sm:text-[30px] lg:text-[28px]">
                طراحی و توسعه وب‌سایت
              </h2>
              <p className="mt-3 text-sm font-bold leading-7 text-[#4b9ea5] sm:text-[15px] sm:leading-8">
                وب‌سایت‌های سریع، امن و کاربرمحور با طراحی اختصاصی و تجربه‌ای
                ماندگار
              </p>
            </div>

            <Image
              src="/svg/website.svg"
              alt="تصویر سه‌بعدی طراحی و توسعه وب‌سایت"
              width={202}
              height={303}
              className="absolute bottom-3 left-2 z-10 h-auto w-[45%] max-w-[202px] object-contain sm:left-5"
              sizes="(max-width: 1023px) 45vw, 202px"
            />

            <span className="absolute bottom-[27%] right-8 z-20 sm:right-10">
              <ServiceArrow
                label="رفتن به سفارش طراحی وب‌سایت"
                className="border-transparent bg-[#39bdc7] text-white"
              />
            </span>
          </Link>
        </div>

        <div className="flex flex-col gap-5 lg:col-start-1 lg:row-start-1 lg:gap-9 lg:pt-[99px]">
          <Link
            href="/createapp"
            dir="rtl"
            aria-label="مشاهده خدمات توسعه اپلیکیشن موبایل"
            className="group relative min-h-[350px] overflow-hidden rounded-[28px] bg-[#3b2478] p-7 text-right text-white outline-none focus-visible:ring-4 focus-visible:ring-[#7c58d5]/40 sm:min-h-[390px] sm:p-10 lg:min-h-0 lg:aspect-[2.11/1]"
          >
            <div className="relative z-20 ml-auto max-w-[58%] sm:max-w-[62%]">
              <h2 className="text-[29px] font-bold leading-[1.45] sm:text-[34px] lg:text-[32px]">
                توسعه اپلیکیشن موبایل
              </h2>
              <p className="mt-4 text-sm font-bold leading-7 text-white/60 sm:text-base sm:leading-8 lg:text-[15px]">
                اپلیکیشن‌های سریع، امن و کاربرمحور با طراحی اختصاصی و تجربه‌ای
                ماندگار
              </p>
            </div>

            <Image
              src="/svg/app.svg"
              alt="تصویر سه‌بعدی توسعه اپلیکیشن موبایل"
              width={322}
              height={273}
              className="absolute -bottom-1 -left-3 z-10 h-auto w-[60%] max-w-[322px] object-contain sm:left-1 lg:w-[43%]"
              sizes="(max-width: 639px) 60vw, (max-width: 1023px) 322px, 30vw"
            />

            <span className="absolute bottom-[22%] right-7 z-20 sm:right-10 lg:right-10">
              <ServiceArrow
                label="رفتن به سفارش اپلیکیشن موبایل"
                className="border-white/60 text-white/75"
              />
            </span>
          </Link>

          <div className="grid gap-5 sm:grid-cols-2">
            <Link
              href="/ai"
              dir="rtl"
              aria-label="مشاهده خدمات اتوماسیون کسب‌وکار"
              className="group relative min-h-[350px] overflow-hidden rounded-[26px] bg-[#111a26] p-7 text-right text-white outline-none focus-visible:ring-4 focus-visible:ring-[#fa7a3f]/35 sm:aspect-square sm:min-h-0 lg:p-7"
            >
              <h2 className="relative z-20 text-[29px] font-light leading-[1.35] sm:text-[30px] lg:text-[29px]">
                اتوماسیون
                <br />
                کسب‌وکار
              </h2>
              <p className="relative z-20 mt-5 max-w-[70%] text-sm leading-7 text-white/75 sm:max-w-full lg:max-w-[82%]">
                فرایندهای تکراری را خودکار کنید و با راهکارهای هوشمند، کارایی را
                افزایش دهید.
              </p>

              <Image
                src="/svg/automation.svg"
                alt="تصویر سه‌بعدی اتوماسیون کسب‌وکار"
                width={181}
                height={255}
                className="absolute -bottom-2 -left-1 z-10 h-auto w-[48%] max-w-[181px] object-contain"
                sizes="(max-width: 639px) 48vw, (max-width: 1023px) 181px, 15vw"
              />

              <span className="absolute bottom-12 right-6 z-20">
                <ServiceArrow
                  label="مشاهده راهکارهای اتوماسیون"
                  className="border-[#ff8a52] text-[#ff8a52]"
                />
              </span>
            </Link>

            <Link
              href="/ai"
              dir="rtl"
              aria-label="مشاهده راهکارهای هوش مصنوعی"
              className="group relative min-h-[350px] overflow-hidden rounded-[26px] bg-[#07818d] p-7 text-right text-white outline-none focus-visible:ring-4 focus-visible:ring-[#55d6df]/35 sm:aspect-square sm:min-h-0 lg:p-7"
            >
              <h2 className="relative z-20 text-[29px] font-bold leading-[1.5] sm:text-[30px] lg:text-[29px]">
                راهکارهای
                <br />
                هوش مصنوعی
              </h2>
              <p className="relative z-20 mt-3 max-w-[77%] text-sm font-bold leading-7 text-white/55 sm:max-w-full lg:max-w-[85%]">
                هوش مصنوعی را متناسب با نیاز واقعی کسب‌وکار شما طراحی و پیاده
                می‌کنیم.
              </p>

              <Image
                src="/svg/ai.svg"
                alt="تصویر سه‌بعدی راهکارهای هوش مصنوعی"
                width={202}
                height={214}
                className="absolute -bottom-2 -left-1 z-10 h-auto w-[58%] max-w-[202px] object-contain"
                sizes="(max-width: 639px) 58vw, (max-width: 1023px) 202px, 17vw"
              />

              <span className="absolute bottom-12 right-6 z-20">
                <ServiceArrow
                  label="مشاهده راهکارهای هوش مصنوعی"
                  className="border-white/50 text-white/65"
                />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
