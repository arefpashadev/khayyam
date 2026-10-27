import { ArrowLeft, Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { KhayyamMark } from "@/components/brand/khayyam-mark";
import { LanguageSwitch } from "@/components/sections/home/language-switch";
import { Link } from "@/i18n/navigation";
import { dirOf, intlTag } from "@/lib/locale";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.4" cy="6.6" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[17px]" aria-hidden="true">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.55h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.95c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.62V21h-3.85V9.75Z" />
  </svg>
);

/**
 * The site footer, in the landing's colours: a last invitation with the three ways in,
 * then the brand, the links, and the language switch. The verse stays in Persian;
 * other languages show a translation under it.
 */
const Footer = () => {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");
  const products = useTranslations("Products");
  const closing = useTranslations("Closing");
  const locale = useLocale();
  const year = new Intl.DateTimeFormat(intlTag(locale), { year: "numeric" }).format(new Date());
  const link = "text-[14px] text-[#9aa3b8] transition-colors hover:text-[#f2ecdf]";

  const columns = [
    {
      title: t("studios"),
      links: [
        { label: nav("site"), href: "/createsite" },
        { label: nav("app"), href: "/createapp" },
        { label: nav("ai"), href: "/createai" },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: nav("blog"), href: "/blog" },
        { label: t("aboutUs"), href: "/#about" },
        { label: t("careers"), href: "/#careers" },
        { label: t("contact"), href: "/#contact" },
      ],
    },
  ];

  return (
    <footer dir={dirOf(locale)} className="relative overflow-hidden border-t border-[#f2ecdf]/[0.08] bg-[#0c1222] text-[#f2ecdf]">
      <span className="pointer-events-none absolute -top-40 inset-x-[15%] h-72 rounded-full bg-[#d9a648] opacity-[0.07] blur-[110px]" aria-hidden="true" />

      {/* last invitation */}
      <div className="relative mx-auto max-w-[1240px] px-5 pb-16 pt-20 lg:px-10 lg:pt-28">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p lang="fa" dir="rtl" className="text-[15px] leading-8 text-[#9aa3b8] lg:text-[17px]">
              این قافله عمر عجب می‌گذرد، دریاب دمی که با طرب می‌گذرد
            </p>
            {locale !== "fa" && <p className="mt-1 max-w-[56ch] text-[13px] italic leading-7 text-[#7f889c]">{closing("translation")}</p>}
            <h2 className="mt-6 max-w-[18ch] text-[34px] font-extrabold leading-[1.35] lg:text-[54px]">{t("cta")}</h2>
          </div>
          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
            {([
              { label: products("site.cta"), href: "/createsite", strong: true },
              { label: products("app.cta"), href: "/createapp" },
              { label: products("ai.cta"), href: "/createai" },
            ] as const).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group inline-flex h-12 items-center justify-between gap-3 rounded-full px-6 text-[14px] font-extrabold transition-colors sm:justify-center ${
                  "strong" in item ? "bg-[#d9a648] text-[#1c1406] hover:bg-[#e8b95e]" : "text-[#f2ecdf] ring-1 ring-[#f2ecdf]/20 hover:bg-[#f2ecdf]/[0.06]"
                }`}
              >
                {item.label}
                <ArrowLeft className="size-4 transition-transform ltr:rotate-180 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* brand and links */}
      <div className="relative mx-auto max-w-[1240px] px-5 lg:px-10">
        <div className="grid gap-10 border-t border-[#f2ecdf]/[0.08] py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label={nav("home")}>
              <KhayyamMark size={34} />
              <span className="text-[20px] font-extrabold">{nav("brand")}</span>
            </Link>
            <p className="mt-4 max-w-[36ch] text-[14px] leading-7 text-[#9aa3b8]">{t("about")}</p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-[13px] font-bold text-[#e9c27a]">{column.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="text-[13px] font-bold text-[#e9c27a]">{t("follow")}</h3>
            <div className="mt-4 flex gap-2">
              {[
                { label: "Instagram", href: "#instagram", icon: <InstagramIcon /> },
                { label: "Telegram", href: "#telegram", icon: <Send className="size-[17px]" aria-hidden="true" /> },
                { label: "LinkedIn", href: "#linkedin", icon: <LinkedinIcon /> },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="flex size-10 items-center justify-center rounded-full bg-[#f2ecdf]/[0.06] text-[#dcd6c9] ring-1 ring-[#f2ecdf]/[0.08] transition-colors hover:bg-[#d9a648] hover:text-[#1c1406]"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-4 border-t border-[#f2ecdf]/[0.08] py-6 text-[12.5px] text-[#7f889c] sm:flex-row sm:items-center sm:justify-between">
          <span>{t("rights", { year })}</span>
          <div className="flex items-center gap-5">
            <Link href="/#privacy" className="transition-colors hover:text-[#f2ecdf]">
              {t("privacy")}
            </Link>
            <Link href="/#terms" className="transition-colors hover:text-[#f2ecdf]">
              {t("terms")}
            </Link>
            <LanguageSwitch />
          </div>
        </div>
      </div>

      {/* wordmark */}
      <div aria-hidden="true" className="pointer-events-none relative -mb-[0.28em] select-none overflow-hidden text-center text-[clamp(90px,22vw,320px)] font-black leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(242,236,223,0.09)]">
        {t("wordmark")}
      </div>
    </footer>
  );
};

export default Footer;
