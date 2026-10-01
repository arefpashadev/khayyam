import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import Image from "next/image";

import { Link } from "@/i18n/navigation";

const featuredPost = {
  title: "چطور با سایت حرفه‌ای فروش بیشتری داشته باشیم؟",
  excerpt:
    "داشتن سایت تازه شروع مسیر است. با طراحی تجربه کاربری درست، محتوای هدفمند و مسیر خرید ساده می‌توانید بازدیدکننده‌ها را به مشتری واقعی تبدیل کنید و فروش پایدارتری بسازید.",
  date: "۴ خرداد ۱۴۰۵",
  readingTime: "مطالعه در ۶ دقیقه",
  category: "طراحی سایت",
  image:
    "https://images.unsplash.com/photo-1530435460869-d13625c69bbf?auto=format&fit=crop&w=1400&q=88",
};

const secondaryPosts = [
  {
    title: "چطور یک هویت بصری ماندگار برای برند بسازیم؟",
    date: "۹ خرداد ۱۴۰۵",
    readingTime: "مطالعه در ۵ دقیقه",
    category: "طراحی سایت",
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1000&q=88",
  },
  {
    title: "قبل از طراحی سایت چه چیزهایی را آماده کنیم؟",
    date: "۱۴ خرداد ۱۴۰۵",
    readingTime: "مطالعه در ۶ دقیقه",
    category: "طراحی سایت",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=88",
  },
];

export const BlogSuggestedPosts = () => {
  return (
    <section
      aria-labelledby="suggested-posts-title"
      className="px-5 pb-28 pt-8 sm:px-8 sm:pb-32 lg:pb-40 lg:pt-12"
    >
      <div className="mx-auto w-full max-w-[1100px]">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-right">
            <h2
              id="suggested-posts-title"
              className="text-[30px] font-black leading-[1.4] tracking-[-0.025em] text-[#2a3237] sm:text-[38px]"
            >
              مقالات پیشنهادی
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#67757c] sm:text-base">
              مطالبی برای یادگیری، رشد و تصمیم‌گیری بهتر در مسیر دیجیتال
            </p>
          </div>
          <a
            href="#blog-posts"
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg border border-[#b8c8ce] bg-white/40 px-5 text-sm font-extrabold text-[#30393e] transition hover:border-[#0798f2] hover:bg-white/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0798f2]/20"
          >
            مشاهده همه مقالات
            <ArrowLeft className="size-4" aria-hidden="true" />
          </a>
        </header>

        <div className="mt-12 grid items-start gap-8 lg:mt-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
          <article className="group overflow-hidden rounded-xl bg-white shadow-[0_12px_32px_rgba(27,81,104,0.08)]">
            <Link
              href="/blog/1"
              className="block outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#0798f2]/30"
            >
              <div className="relative aspect-[1.5/1] overflow-hidden bg-[#cdeef9]">
                <Image
                  src={featuredPost.image}
                  alt="میز کار دیجیتال برای مقاله طراحی سایت"
                  fill
                  sizes="(max-width: 1023px) calc(100vw - 40px), 560px"
                  className="object-cover transition duration-500 group-hover:scale-[1.035]"
                />
                <span className="absolute bottom-5 right-5 rounded-full bg-[#0798f2] px-5 py-2 text-sm font-bold text-white shadow-lg">
                  {featuredPost.category}
                </span>
              </div>
              <div className="p-6 sm:p-8">
                <PostMeta date={featuredPost.date} readingTime={featuredPost.readingTime} />
                <h3 className="mt-6 text-[24px] font-black leading-[1.5] tracking-[-0.02em] text-[#30383d] transition-colors group-hover:text-[#078ef0] sm:text-[29px]">
                  {featuredPost.title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-[#65747b] sm:text-base">
                  {featuredPost.excerpt}
                </p>
              </div>
            </Link>
          </article>

          <div className="grid gap-10 lg:gap-11">
            {secondaryPosts.map((post, index) => (
              <article key={post.title} className="group">
                <Link
                  href={`/blog/${index + 2}`}
                  className="block rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-[#0798f2]/25"
                >
                  <PostMeta date={post.date} readingTime={post.readingTime} />
                  <div className="relative mt-4 aspect-[2.25/1] overflow-hidden rounded-xl bg-[#cdeef9] shadow-[0_10px_28px_rgba(27,81,104,0.08)]">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      sizes="(max-width: 1023px) calc(100vw - 40px), 460px"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#5c686e] shadow-md">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-black leading-8 text-[#30383d] transition-colors group-hover:text-[#078ef0] sm:text-2xl">
                    {post.title}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const PostMeta = ({ date, readingTime }: { date: string; readingTime: string }) => (
  <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#7a888f] sm:text-xs">
    <span className="inline-flex items-center gap-1.5">
      <CalendarDays className="size-3.5 text-[#0798f2]" aria-hidden="true" />
      {date}
    </span>
    <span className="size-1.5 rounded-full bg-[#7b888e]" aria-hidden="true" />
    <span className="inline-flex items-center gap-1.5">
      <Clock3 className="size-3.5 text-[#0798f2]" aria-hidden="true" />
      {readingTime}
    </span>
  </div>
);
