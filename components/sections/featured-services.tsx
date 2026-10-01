import Image from "next/image";

import { Link } from "@/i18n/navigation";

const featuredServices = [
  {
    title: "سایت فروشگاهی",
    description:
      "فروشگاه اینترنتی حرفه‌ای با طراحی مدرن، تجربه کاربری آسان، مدیریت محصولات و اتصال به درگاه پرداخت برای افزایش فروش کسب‌وکار شما.",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "تیم یک کسب‌وکار خانگی در حال آماده‌سازی محصولات",
    href: "/createsite" as const,
  },
  {
    title: "اتوماسیون",
    description:
      "با خودکارسازی کارهای تکراری، مدیریت بهتر اطلاعات و اتصال ابزارهای مختلف، زمان خود را ذخیره کنید و بهره‌وری مجموعه را افزایش دهید.",
    image:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "تجربه فناوری هوشمند و واقعیت مجازی",
    href: "/ai" as const,
  },
  {
    title: "ربات تلگرامی",
    description:
      "پیاده‌سازی راهکارهای هوش مصنوعی برای تحلیل داده‌ها، بهبود تصمیم‌گیری، پاسخ‌گویی سریع‌تر و ایجاد تجربه‌ای هوشمند برای مشتریان.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "ربات هوشمند برای پاسخ‌گویی خودکار به مشتریان",
    href: "/ai" as const,
  },
];

export const FeaturedServices = () => {
  return (
    <section
      id="featured-services"
      aria-labelledby="featured-services-title"
      className="bg-[#075fc4] bg-[linear-gradient(135deg,#061a50_0%,#075fc4_48%,#0aa7ff_100%)] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:pb-36 lg:pt-[118px]"
    >
      <div className="mx-auto w-full max-w-[1160px]">
        <header className="text-right text-white">
          <h2
            id="featured-services-title"
            className="text-[34px] font-extrabold leading-[1.4] tracking-[-0.025em] sm:text-[42px] lg:text-[40px]"
          >
            ویژه خدمات خیام
          </h2>
          <p className="mt-8 max-w-[740px] text-sm leading-8 text-white/90 sm:text-base sm:leading-9 lg:mr-0 lg:ml-auto">
            با طراحی وب‌سایت، اپلیکیشن، سیستم‌های هوشمند و اتوماسیون کسب‌وکار به
            شما کمک می‌کنیم سریع‌تر رشد کنید، فرایندها را ساده کنید و تجربه
            بهتری برای مشتریان خود بسازید.
          </p>
        </header>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-2">
          {featuredServices.map((service) => (
            <article
              key={service.title}
              className="overflow-hidden rounded-xl border border-white/55 bg-white shadow-[0_15px_35px_rgba(0,24,85,0.16)]"
            >
              <div className="relative aspect-[1.36/1] overflow-hidden bg-[#dcebf1]">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                  sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc(50vw - 42px), 380px"
                />
              </div>

              <div className="flex min-h-[292px] flex-col px-6 py-8 text-right sm:px-8">
                <h3 className="text-[29px] font-bold leading-[1.4] text-[#090909] sm:text-[31px]">
                  {service.title}
                </h3>
                <p className="mt-5 text-[15px] font-bold leading-8 text-[#191919] sm:text-base sm:leading-9">
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  className="mt-auto w-fit pt-3 text-[17px] font-bold text-[#0799ef] outline-none transition-colors hover:text-[#006fc4] focus-visible:underline"
                >
                  دیدن جزئیات بیشتر..
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
