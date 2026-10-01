import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import Image from "next/image";

import { Link } from "@/i18n/navigation";

const posts = [
  {
    title: "چطور با سایت میلیونی لباس بفروشیم؟",
    excerpt:
      "فروش آنلاین لباس فقط به داشتن یک سایت محدود نمی‌شود. تجربه خرید ساده، تصاویر حرفه‌ای، سرعت مناسب و اعتمادسازی درست، فروشگاه اینترنتی شما را به یک کانال واقعی و ماندگار فروش تبدیل می‌کند.",
    date: "۴ خرداد ۱۴۰۵",
    readingTime: "مطالعه در ۶ دقیقه",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=88",
    imageAlt: "فروشگاه لباس با رگال‌های پوشاک",
  },
  {
    title: "چطور محتوایی بسازیم که مخاطب دوستش داشته باشد؟",
    excerpt:
      "محتوای موفق از شناخت دقیق مخاطب شروع می‌شود. با انتخاب موضوع درست، روایت ساده و انتشار منظم می‌توانید ارتباطی انسانی‌تر بسازید و مخاطبان وفادارتری برای برند خود داشته باشید.",
    date: "۱۱ خرداد ۱۴۰۵",
    readingTime: "مطالعه در ۵ دقیقه",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=88",
    imageAlt: "سگ طلایی در فضای باز",
  },
];

export const BlogPostList = () => {
  return (
    <section
      aria-label="تازه‌ترین مقالات وبلاگ"
      className="px-5 pb-24 sm:px-8 sm:pb-28 lg:pb-36"
    >
      <div className="mx-auto w-full max-w-[1100px] space-y-14 sm:space-y-20">
        {posts.map((post, index) => (
          <article
            key={post.title}
            className="group grid items-center gap-7 md:grid-cols-[0.9fr_1.1fr] md:gap-10 lg:gap-16"
          >
            <Link
              href={`/blog/${index + 1}`}
              className="relative block aspect-[1.5/1] overflow-hidden rounded-xl bg-[#cdeef9] shadow-[0_12px_30px_rgba(27,81,104,0.08)] outline-none focus-visible:ring-4 focus-visible:ring-[#0798f2]/25"
              aria-label={`مشاهده مقاله ${post.title}`}
            >
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                sizes="(max-width: 767px) calc(100vw - 40px), 45vw"
                className="object-cover transition duration-500 group-hover:scale-[1.035]"
              />
            </Link>

            <div className="text-right">
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#7a888f] sm:text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5 text-[#0798f2]" aria-hidden="true" />
                  {post.date}
                </span>
                <span className="size-1.5 rounded-full bg-[#7b888e]" aria-hidden="true" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-3.5 text-[#0798f2]" aria-hidden="true" />
                  {post.readingTime}
                </span>
              </div>

              <h2 className="mt-6 text-[24px] font-black leading-[1.5] tracking-[-0.02em] text-[#30383d] sm:text-[29px]">
                {post.title}
              </h2>
              <p className="mt-5 text-sm leading-8 text-[#65747b] sm:text-base sm:leading-9">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${index + 1}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#0798f2] outline-none transition hover:gap-3 hover:text-[#0076c8] focus-visible:underline"
              >
                ادامه موضوع
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
