import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";

const categories = [
  "همه",
  "طراحی سایت",
  "هوش مصنوعی",
  "اپلیکیشن",
  "اتوماسیون",
  "کسب‌وکار",
];

export const BlogExplorer = () => {
  return (
    <section
      id="blog-posts"
      aria-labelledby="blog-page-title"
      className="px-5 py-20 sm:px-8 sm:py-24 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1100px]">
        <header className="text-right">
          <h2
            id="blog-page-title"
            className="text-[32px] font-black leading-[1.4] tracking-[-0.025em] text-[#171b1f] sm:text-[40px]"
          >
            وبلاگ خیام
          </h2>
          <p className="mt-5 max-w-[990px] text-sm leading-7 text-[#536169] sm:text-base sm:leading-8">
            در وبلاگ خیام، مقالات کاربردی درباره طراحی سایت، هوش مصنوعی، توسعه
            اپلیکیشن، اتوماسیون، برندینگ و رشد دیجیتال منتشر می‌کنیم.
          </p>
        </header>

        <div className="mt-14 sm:mt-16">
          <label className="mx-auto flex min-h-12 max-w-[720px] items-center gap-3 rounded-full border border-[#8ed9f6] bg-white/35 px-5 shadow-[0_7px_20px_rgba(27,81,104,0.04)] transition focus-within:border-[#0798f2] focus-within:bg-white/60 focus-within:ring-4 focus-within:ring-[#0798f2]/10">
            <Search className="size-5 shrink-0 text-[#3c4a51]" aria-hidden="true" />
            <span className="sr-only">جست‌وجو در وبلاگ</span>
            <input
              type="search"
              placeholder="وبلاگ دلخواه خود را جست‌وجو کنید..."
              className="min-w-0 flex-1 bg-transparent text-sm text-[#263036] outline-none placeholder:text-[#849098]"
            />
          </label>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:flex-nowrap">
            {categories.map((category, index) => (
              <button
                type="button"
                key={category}
                aria-pressed={index === 0}
                className={`min-h-11 min-w-[122px] rounded-lg border px-6 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0798f2]/20 ${
                  index === 0
                    ? "border-[#0798f2] bg-[#0798f2] text-white shadow-[0_8px_22px_rgba(7,152,242,0.2)]"
                    : "border-[#8ed9f6] bg-white/25 text-[#37434a] hover:border-[#0798f2] hover:bg-white/60"
                }`}
              >
                {category}
              </button>
            ))}

            <button
              type="button"
              aria-label="فیلتر پیشرفته"
              className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-[#8ed9f6] bg-white/25 text-[#405058] transition hover:border-[#0798f2] hover:bg-white/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0798f2]/20"
            >
              <SlidersHorizontal className="size-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              className="flex min-h-11 min-w-[130px] items-center justify-between gap-3 rounded-lg border border-[#8ed9f6] bg-white/25 px-5 text-sm font-bold text-[#37434a] transition hover:border-[#0798f2] hover:bg-white/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0798f2]/20"
            >
              جدیدترین
              <ChevronDown className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
