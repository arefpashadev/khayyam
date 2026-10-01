import Image from "next/image";

export const BlogHero = () => {
  return (
    <section
      aria-labelledby="featured-blog-title"
      className="relative isolate min-h-[560px] overflow-hidden bg-[#055a66] text-white sm:min-h-[650px] lg:min-h-[720px]"
    >
      <Image
        src="/images/blog/blog-hero.png"
        alt="پرتره خلاقانه برای مقاله ویژه هوش مصنوعی"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[38%_center] sm:object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/15 to-black/5"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-l from-[#003b46]/45 via-transparent to-transparent"
      />

      <div className="mx-auto flex min-h-[560px] w-full max-w-[1180px] items-end px-5 pb-12 pt-24 sm:min-h-[650px] sm:px-8 sm:pb-16 lg:min-h-[720px] lg:px-10 lg:pb-14">
        <div className="w-full text-right">
          <h1
            id="featured-blog-title"
            className="max-w-[1050px] text-[35px] font-black leading-[1.35] tracking-[-0.035em] text-balance sm:text-[48px] lg:text-[60px]"
          >
            هوش مصنوعی متناسب با نیاز کسب‌وکار شما
          </h1>
          <p className="mt-6 max-w-[940px] text-sm leading-7 text-white/85 sm:text-lg sm:leading-9 lg:text-xl">
            از دستیارهای هوشمند و اتوماسیون تا تحلیل داده و راهکارهای اختصاصی؛
            کمک می‌کنیم هوش مصنوعی را واقعاً وارد کسب‌وکارتان کنید.
          </p>
          <a
            href="#blog-posts"
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0798f2] px-9 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(7,152,242,0.24)] transition hover:-translate-y-0.5 hover:bg-[#007ed8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/35"
          >
            مطالعه
          </a>
        </div>
      </div>
    </section>
  );
};
