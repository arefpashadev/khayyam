import { Copyright, Send } from "lucide-react";

const aboutLinks = [
  { label: "درباره ما", href: "#about" },
  { label: "وبلاگ", href: "#blog" },
  { label: "فرصت‌های همکاری", href: "#careers" },
];

const supportLinks = [
  { label: "تماس با ما", href: "#contact" },
  { label: "مشاوره", href: "#contact" },
  { label: "سؤالات متداول", href: "#faq" },
];

const Footer = () => {
  return (
    <footer className="px-4 pb-5 sm:px-6 sm:pb-7">
      <div
        className="mx-auto w-full max-w-[1240px] overflow-hidden rounded-2xl bg-[#030303] px-6 py-10 text-white shadow-[0_16px_40px_rgba(1,22,42,0.14)] sm:px-10 lg:px-14 lg:pb-6 lg:pt-12"

      >
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.45fr_0.75fr_0.75fr_1.35fr] lg:gap-12">
          <div className="text-right">
            <a
              href="#"
              aria-label="صفحه اصلی خیام"
              className="inline-block text-[48px] font-black leading-none tracking-[-0.06em] text-white outline-none focus-visible:ring-2 focus-visible:ring-[#0798f2]"
            >
              خیام
            </a>
            <p className="mt-7 max-w-[390px] text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
              در خیام، ایده‌ها را به محصولات دیجیتال هوشمند، سریع و حرفه‌ای
              تبدیل می‌کنیم؛ از طراحی و توسعه سایت و اپلیکیشن تا راهکارهای هوش
              مصنوعی و پشتیبانی.
            </p>
            <p className="mt-10 flex items-center gap-2 text-xs text-white/60 lg:mt-12">
              <Copyright className="size-5 text-[#bfeaff]" aria-hidden="true" />
              خیام؛ تمامی حقوق محفوظ است.
            </p>
          </div>

          <FooterLinks title="درباره" links={aboutLinks} />
          <FooterLinks title="پشتیبانی" links={supportLinks} />

          <div>
            <h2 className="text-lg font-extrabold sm:text-xl">
              دریافت به‌روزرسانی
            </h2>
            <label className="mt-8 flex min-h-14 items-center rounded-full border border-white/10 bg-[#1a1a1a] p-1.5 focus-within:border-[#0798f2] focus-within:ring-4 focus-within:ring-[#0798f2]/15">
              <span className="sr-only">ایمیل برای عضویت در خبرنامه</span>
              <input
                type="email"
                inputMode="email"
                placeholder="ایمیل خود را وارد کنید"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/45"
              />
              <button
                type="button"
                className="min-h-11 shrink-0 rounded-full bg-white px-7 text-sm font-extrabold text-[#171b1f] transition hover:bg-[#dff7ff] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0798f2]/40"
              >
                عضویت
              </button>
            </label>

            <div className="mt-10 flex items-center gap-3" aria-label="شبکه‌های اجتماعی">
              <a
                href="#instagram"
                aria-label="اینستاگرام خیام"
                className="flex size-11 items-center justify-center rounded-full bg-[#1b1b1b] text-white transition hover:-translate-y-1 hover:bg-[#0798f2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0798f2]/40"
              >
                <InstagramIcon />
              </a>
              <a
                href="#telegram"
                aria-label="تلگرام خیام"
                className="flex size-11 items-center justify-center rounded-full bg-[#1b1b1b] text-white transition hover:-translate-y-1 hover:bg-[#0798f2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0798f2]/40"
              >
                <Send className="size-5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-5 text-[11px] text-white/50 sm:flex-row sm:items-center sm:justify-between lg:mt-4 lg:border-0 lg:pt-0">
          <div className="flex items-center gap-5">
            <a href="#privacy" className="transition hover:text-white">
              حریم خصوصی
            </a>
            <span className="h-5 w-px bg-[#bfeaff]/70" aria-hidden="true" />
            <a href="#terms" className="transition hover:text-white">
              قوانین و شرایط
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLinks = ({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) => (
  <nav aria-label={title}>
    <h2 className="text-lg font-extrabold sm:text-xl">{title}</h2>
    <ul className="mt-7 space-y-5 text-sm text-white/60 sm:text-base">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className="inline-flex items-center transition hover:translate-x-[-3px] hover:text-white focus-visible:outline-none focus-visible:text-[#65c6ff]"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-5"
    aria-hidden="true"
  >
    <rect width="18" height="18" x="3" y="3" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.4" cy="6.6" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export default Footer;
