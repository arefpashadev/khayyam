import { ChevronDown, Menu, MessageCircle, Moon, Quote, Search, ShoppingCart, Star, UserRound } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import { faNumber, industries, mix, type WizardConfig } from "../config";
import { getSiteDesign } from "../designs";
import { HeroArt } from "./hero-art";
import { IndustryShowcase } from "./industry-showcase";

const heading = (size: number): CSSProperties => ({
  fontSize: `calc(${size}px * var(--pv-hs))`,
  fontWeight: "var(--pv-hw)" as CSSProperties["fontWeight"],
  letterSpacing: "var(--pv-ht)",
  lineHeight: 1.35,
});

const card = "rounded-(--pv-r-card) border border-(--pv-border) bg-(--pv-surface)";
const primaryButton = "inline-flex items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary) font-bold text-(--pv-on-primary)";

const Section = ({ id, compact, children, className = "" }: { id: string; compact: boolean; children: ReactNode; className?: string }) => (
  <section data-pv={id} className={`pv-section ${compact ? "px-5 py-10" : "px-20 py-20"} ${className}`}>
    {children}
  </section>
);

const SectionTitle = ({ title, compact }: { title: string; compact: boolean }) => (
  <h2 className="mb-8 text-center" style={heading(compact ? 22 : 34)}>
    {title}
  </h2>
);

/**
 * Navigation + hero. Exported on its own so the design picker can render real
 * thumbnails of every design without drawing a separate mini version.
 */
export const SiteTop = ({ config, compact }: { config: WizardConfig; compact: boolean }) => {
  const content = industries[config.industry];
  const name = config.brandName.trim() || "برند شما";
  const BrandIcon = content.icon;
  const design = getSiteDesign(config.industry, config.variant);
  const pattern: CSSProperties | undefined = design.pattern
    ? { backgroundImage: "radial-gradient(var(--pv-border) 1.4px, transparent 1.4px)", backgroundSize: "22px 22px" }
    : undefined;
  const extra = (value: string) => config.extras.includes(value);
  const shade = (amount: number) => mix(config.color, config.theme === "dark" ? "#0f151c" : "#ffffff", amount);

  const logo = (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary) text-(--pv-on-primary)">
        <BrandIcon className="size-5" aria-hidden="true" />
      </span>
      <strong className="text-[17px]" style={{ fontWeight: "var(--pv-hw)" as CSSProperties["fontWeight"] }}>
        {name}
      </strong>
    </div>
  );
  const links = (
    <nav className="flex items-center gap-8 text-[14px] text-(--pv-muted)">
      <span className="font-bold text-(--pv-text)">خانه</span>
      {content.features.slice(0, 3).map((item) => (
        <span key={item.label}>{item.label}</span>
      ))}
    </nav>
  );
  const tools = (
    <div className="flex items-center gap-2">
      {extra("multilang") && <span className="flex h-9 items-center gap-1 rounded-(--pv-r-ctrl) bg-(--pv-surface) px-2.5 text-[11px] font-bold"><span>FA</span><span className="text-(--pv-muted)">EN</span></span>}
      {extra("darkmode") && <span className="flex size-9 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-surface)"><Moon className="size-4" aria-hidden="true" /></span>}
      {config.industry === "shop" ? (
        <>
          {!compact && (
            <span className="flex h-10 w-56 items-center gap-2 rounded-(--pv-r-ctrl) bg-(--pv-surface) px-3 text-[12px] text-(--pv-muted)">
              <Search className="size-4" aria-hidden="true" /> جستجوی محصول…
            </span>
          )}
          <span className="relative flex size-10 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary) text-(--pv-on-primary)">
            <ShoppingCart className="size-[18px]" aria-hidden="true" />
            <span className="absolute -left-1 -top-1 flex size-5 items-center justify-center rounded-full bg-(--pv-text) text-[10px] font-bold text-(--pv-bg)">۳</span>
          </span>
        </>
      ) : (
        !compact && <span className={`${primaryButton} h-10 px-5 text-[13px]`}>{content.cta}</span>
      )}
      {compact && <Menu className="ms-1 size-6" aria-hidden="true" />}
    </div>
  );

  const nav = compact ? (
    <header className="flex items-center justify-between border-b border-(--pv-border) px-5 py-4">{logo}{tools}</header>
  ) : design.nav === "centered" ? (
    <header className="grid grid-cols-3 items-center border-b border-(--pv-border) px-20 py-5">
      {links}
      <div className="flex justify-center">{logo}</div>
      <div className="flex justify-end">{tools}</div>
    </header>
  ) : design.nav === "floating" ? (
    <div className="px-20 pt-6">
      <header className="flex items-center justify-between rounded-(--pv-r-card) border border-(--pv-border) bg-(--pv-surface) px-6 py-3 shadow-sm">{logo}{links}{tools}</header>
    </div>
  ) : (
    <header className="flex items-center justify-between border-b border-(--pv-border) px-20 py-5">{logo}{links}{tools}</header>
  );

  const composition = design.composition;
  const centered = (composition === "centered" || composition === "editorial") && !compact;
  const proof =
    design.proof === "rating" ? (
      <div className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        <span className="flex -space-x-3 space-x-reverse">
          {[0.15, 0.35, 0.55, 0.75].map((amount) => (
            <span key={amount} className="flex size-9 items-center justify-center rounded-full ring-2 ring-(--pv-bg)" style={{ backgroundColor: shade(amount) }}>
              <UserRound className="size-4 text-white/90" aria-hidden="true" />
            </span>
          ))}
        </span>
        <span className="text-[13px]">
          <span className="flex items-center gap-0.5 text-(--pv-primary)">{[0, 1, 2, 3, 4].map((star) => <Star key={star} className="size-3.5 fill-current" aria-hidden="true" />)}</span>
          <span className="text-(--pv-muted)">۴٫۹ از ۲٬۴۰۰ نظر</span>
        </span>
      </div>
    ) : design.proof === "stats" ? (
      <div className={`flex gap-8 border-t border-(--pv-border) pt-5 ${centered ? "justify-center" : ""}`}>
        {content.stats.map(([value, label]) => (
          <div key={label}>
            <strong className="block" style={heading(compact ? 20 : 26)}>{value}</strong>
            <span className="text-[12px] text-(--pv-muted)">{label}</span>
          </div>
        ))}
      </div>
    ) : null;

  const heroText = (inverted = false) => (
    <div key={config.motion} className={`pv-rise flex flex-col gap-5 ${centered ? "items-center text-center" : "items-start text-right"}`}>
      <span className={`rounded-(--pv-r-ctrl) px-3 py-1.5 text-[12px] font-bold ${inverted ? "bg-white/15 text-white" : "bg-(--pv-soft) text-(--pv-primary)"}`}>{content.badge}</span>
      <h1 style={heading(compact ? 30 : 54)} className={inverted ? "text-white" : ""}>
        {config.tagline.trim() || content.headline}
      </h1>
      <p className={`max-w-[34ch] ${compact ? "text-[14px]" : "text-[17px]"} leading-8 ${inverted ? "text-white/80" : "text-(--pv-muted)"}`}>{content.sub}</p>
      <div className="flex flex-wrap items-center gap-3">
        <span className={`${primaryButton} ${compact ? "h-11 px-5 text-[13px]" : "h-13 px-7 text-[15px]"}`}>{content.cta}</span>
        <span className={`inline-flex items-center rounded-(--pv-r-ctrl) border px-5 font-bold ${compact ? "h-11 text-[13px]" : "h-13 text-[15px]"} ${inverted ? "border-white/40 text-white" : "border-(--pv-border) text-(--pv-text)"}`}>درباره ما</span>
      </div>
      {!inverted && proof && <div className="mt-2 w-full">{proof}</div>}
    </div>
  );

  return (
    <>
      {nav}
      <section data-pv="hero" className="pv-section" style={composition === "fullbleed" ? undefined : pattern}>
        {compact ? (
          <div className={composition === "fullbleed" ? "bg-(--pv-primary) px-5 py-12" : "flex flex-col gap-8 px-5 py-10"}>
            {heroText(composition === "fullbleed")}
            {composition !== "fullbleed" && <HeroArt art={design.art} config={config} tall />}
          </div>
        ) : composition === "fullbleed" ? (
          <div className="relative grid grid-cols-[1.1fr_1fr] items-center gap-12 overflow-hidden bg-(--pv-primary) px-20 py-20">
            <div className="absolute -left-24 -top-24 size-96 rounded-full bg-white/10" />
            <div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-black/10" />
            <div className="relative">{heroText(true)}</div>
            <div className="relative rounded-(--pv-r-card) bg-(--pv-bg) p-3 shadow-2xl">
              <HeroArt art={design.art} config={config} tall />
            </div>
          </div>
        ) : composition === "centered" ? (
          <div className="flex flex-col items-center gap-12 px-20 py-20">
            {heroText()}
            <div className="w-full max-w-[920px]">
              <HeroArt art={design.art} config={config} />
            </div>
          </div>
        ) : composition === "editorial" ? (
          <div className="px-20 pb-16 pt-14">
            <div className="grid grid-cols-[1.4fr_1fr] items-end gap-10 border-b border-(--pv-border) pb-10">
              <h1 className="pv-rise text-right" style={heading(68)}>{config.tagline.trim() || content.headline}</h1>
              <div className="flex flex-col items-start gap-4">
                <p className="text-[16px] leading-8 text-(--pv-muted)">{content.sub}</p>
                <span className={`${primaryButton} h-12 px-7 text-[14px]`}>{content.cta}</span>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-[1fr_2fr] items-center gap-10">
              <div>{proof ?? <span className="text-[13px] font-bold text-(--pv-primary)">{content.badge}</span>}</div>
              <HeroArt art={design.art} config={config} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 items-center gap-14 px-20 py-20">
            {composition === "mirror" ? (
              <>
                <HeroArt art={design.art} config={config} tall />
                {heroText()}
              </>
            ) : (
              <>
                {heroText()}
                <HeroArt art={design.art} config={config} tall />
              </>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export const SitePreview = ({ config, compact }: { config: WizardConfig; compact: boolean }) => {
  const content = industries[config.industry];
  const name = config.brandName.trim() || "برند شما";
  const has = (section: string) => config.sections.includes(section);
  const design = getSiteDesign(config.industry, config.variant);

  return (
    <div dir="rtl" data-motion={config.motion} className="pv-root min-h-full bg-(--pv-bg) font-sans text-(--pv-text)">
      <SiteTop config={config} compact={compact} />
      <IndustryShowcase config={config} compact={compact} />

      {has("features") && (
        <Section id="features" compact={compact} className="bg-(--pv-surface)">
          <SectionTitle title="چرا ما را انتخاب کنید" compact={compact} />
          <div className={`grid gap-4 ${compact ? "grid-cols-2" : "grid-cols-4"}`}>
            {content.features.map(({ label, icon: Icon }, index) =>
              design.cards === "numbered" ? (
                <div key={label} className="flex flex-col gap-3 border-t-2 border-(--pv-primary) pt-5">
                  <span className="text-(--pv-primary)" style={heading(compact ? 26 : 34)}>
                    {faNumber(index + 1).padStart(2, "۰")}
                  </span>
                  <strong className="text-[15px]">{label}</strong>
                  <span className="text-[12px] leading-6 text-(--pv-muted)">توضیح کوتاهی درباره این ویژگی و مزیتش برای مشتری.</span>
                </div>
              ) : (
                <div key={label} className={`flex flex-col gap-4 rounded-(--pv-r-card) p-5 ${design.cards === "filled" ? "bg-(--pv-soft)" : "border border-(--pv-border) bg-(--pv-bg)"}`}>
                  <span className={`flex size-11 items-center justify-center rounded-(--pv-r-ctrl) text-(--pv-primary) ${design.cards === "filled" ? "bg-(--pv-bg)" : "bg-(--pv-soft)"}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <strong className="text-[15px]">{label}</strong>
                  <span className="text-[12px] leading-6 text-(--pv-muted)">توضیح کوتاهی درباره این ویژگی و مزیتش برای مشتری.</span>
                </div>
              ),
            )}
          </div>
        </Section>
      )}

      {has("gallery") && (
        <Section id="gallery" compact={compact}>
          <SectionTitle title="نمونه‌کارها" compact={compact} />
          <div className={`grid gap-3 ${compact ? "grid-cols-2" : "grid-cols-3"}`}>
            {[0.2, 0.55, 0.35, 0.7, 0.1, 0.45].map((amount, index) => (
              <div
                key={index}
                className={`rounded-(--pv-r-card) ${index === 0 && !compact ? "row-span-2" : "aspect-[4/3]"}`}
                style={{ backgroundColor: mix(config.color, config.theme === "dark" ? "#0f151c" : "#ffffff", amount) }}
              />
            ))}
          </div>
        </Section>
      )}

      {has("testimonials") && (
        <Section id="testimonials" compact={compact} className="bg-(--pv-surface)">
          <SectionTitle title="مشتریان درباره ما" compact={compact} />
          <div className={`grid gap-4 ${compact ? "" : "grid-cols-3"}`}>
            {[
              { name: "سارا محمدی", text: "از سرعت و دقت کارشان واقعاً راضی بودم. همه‌چیز همان‌طور شد که قول داده بودند." },
              { name: "علی رضایی", text: "برخورد محترمانه و پیگیری عالی. حتماً دوباره سراغشان می‌روم." },
              { name: "نگار احمدی", text: "کیفیت بالا با قیمت منصفانه. به دوستانم هم معرفی کردم." },
            ].slice(0, compact ? 2 : 3).map((item) => (
              <figure key={item.name} className={`${card} bg-(--pv-bg) p-6`}>
                <Quote className="size-6 text-(--pv-primary)" aria-hidden="true" />
                <blockquote className="mt-4 text-[14px] leading-7">{item.text}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 text-[13px] font-bold">
                  <span className="size-9 rounded-full bg-(--pv-soft)" />
                  {item.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {has("pricing") && (
        <Section id="pricing" compact={compact}>
          <SectionTitle title="تعرفه‌ها" compact={compact} />
          <div className={`grid items-stretch gap-4 ${compact ? "" : "grid-cols-3"}`}>
            {[
              { title: "پایه", price: 490 },
              { title: "حرفه‌ای", price: 990, featured: true },
              { title: "ویژه", price: 1890 },
            ].map((plan) => (
              <div key={plan.title} className={`flex flex-col gap-4 rounded-(--pv-r-card) border p-6 ${plan.featured ? "border-(--pv-primary) bg-(--pv-primary) text-(--pv-on-primary)" : "border-(--pv-border) bg-(--pv-surface)"}`}>
                <strong className="text-[16px]">{plan.title}</strong>
                <span style={heading(compact ? 24 : 30)}>
                  {faNumber(plan.price)} <span className="text-[13px] font-normal opacity-70">هزار تومان</span>
                </span>
                {["امکان اول", "امکان دوم", "امکان سوم"].map((line) => (
                  <span key={line} className="text-[13px] opacity-80">{line}</span>
                ))}
                <span className={`mt-auto flex h-11 items-center justify-center rounded-(--pv-r-ctrl) text-[13px] font-bold ${plan.featured ? "bg-(--pv-bg) text-(--pv-text)" : "bg-(--pv-primary) text-(--pv-on-primary)"}`}>انتخاب</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {has("faq") && (
        <Section id="faq" compact={compact} className="bg-(--pv-surface)">
          <SectionTitle title="سوالات متداول" compact={compact} />
          <div className="mx-auto flex max-w-[760px] flex-col gap-3">
            {["زمان تحویل چقدر است؟", "امکان پرداخت قسطی دارید؟", "پشتیبانی بعد از خرید چطور است؟", "چطور با شما تماس بگیرم؟"].map((question, index) => (
              <div key={question} className={`${card} bg-(--pv-bg) px-5 py-4`}>
                <div className="flex items-center justify-between text-[14px] font-bold">
                  {question}
                  <ChevronDown className={`size-4 text-(--pv-muted) ${index === 0 ? "rotate-180" : ""}`} aria-hidden="true" />
                </div>
                {index === 0 && <p className="mt-3 text-[13px] leading-7 text-(--pv-muted)">بسته به نوع سفارش، معمولاً بین دو تا پنج روز کاری.</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {has("blog") && (
        <Section id="blog" compact={compact}>
          <SectionTitle title="تازه‌ترین مطالب" compact={compact} />
          <div className={`grid gap-4 ${compact ? "" : "grid-cols-3"}`}>
            {["راهنمای انتخاب درست", "پنج اشتباه رایج", "پشت صحنه کار ما"].slice(0, compact ? 2 : 3).map((title, index) => (
              <article key={title} className={`${card} overflow-hidden`}>
                <div className="aspect-[16/9]" style={{ backgroundColor: mix(config.color, config.theme === "dark" ? "#0f151c" : "#ffffff", 0.3 + index * 0.2) }} />
                <div className="p-5">
                  <strong className="text-[15px]">{title}</strong>
                  <p className="mt-2 text-[12px] text-(--pv-muted)">۵ دقیقه مطالعه</p>
                </div>
              </article>
            ))}
          </div>
        </Section>
      )}

      {has("contact") && (
        <Section id="contact" compact={compact} className="bg-(--pv-surface)">
          <div className={`grid items-start gap-8 ${compact ? "" : "grid-cols-2"}`}>
            <div className="flex flex-col gap-3">
              <h2 style={heading(compact ? 22 : 34)}>با ما در تماس باشید</h2>
              <p className="text-[14px] leading-7 text-(--pv-muted)">سوالی دارید؟ پیام بگذارید، در کمتر از یک روز جواب می‌دهیم.</p>
            </div>
            <div className="flex flex-col gap-3">
              {["نام و نام خانوادگی", "شماره تماس", "پیام شما"].map((field, index) => (
                <span key={field} className={`flex rounded-(--pv-r-ctrl) border border-(--pv-border) bg-(--pv-bg) px-4 text-[13px] text-(--pv-muted) ${index === 2 ? "h-24 rounded-(--pv-r-card) pt-3" : "h-12 items-center"}`}>
                  {field}
                </span>
              ))}
              <span className={`${primaryButton} h-12 text-[14px]`}>ارسال پیام</span>
            </div>
          </div>
        </Section>
      )}

      <footer className={`flex items-center justify-between border-t border-(--pv-border) text-[12px] text-(--pv-muted) ${compact ? "px-5 py-6" : "px-20 py-8"}`}>
        <span>© {name}</span>
        <span>ساخته‌شده با خیام</span>
      </footer>
      {config.extras.includes("chat") && (
        <div className="pointer-events-none sticky bottom-5 flex justify-end px-5">
          <span className="flex size-14 items-center justify-center rounded-full bg-(--pv-primary) text-(--pv-on-primary) shadow-xl">
            <MessageCircle className="size-6" aria-hidden="true" />
          </span>
        </div>
      )}
    </div>
  );
};
