"use client";

import { ChevronDown, Download, Sparkles, Gift, Heart, House, LayoutGrid, Megaphone, Menu, MessageCircle, Moon, Phone, Quote, Search, ShoppingCart, Star, UserRound, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

import { faNumber, industries, isDark, mix, type WizardConfig } from "../config";
import { getSiteDesign } from "../designs";
import { ActionLayer } from "./action-layer";
import { jumpTo, useSiteDemo } from "./site-demo";
import { HeroArt } from "./hero-art";
import { IndustryShowcase } from "./industry-showcase";

const heading = (size: number): CSSProperties => ({
  fontSize: `calc(${size}px * var(--pv-hs))`,
  fontWeight: "var(--pv-hw)" as CSSProperties["fontWeight"],
  letterSpacing: "var(--pv-ht)",
  lineHeight: 1.35,
});

const card = "rounded-(--pv-r-card) border border-(--pv-border) bg-(--pv-surface)";
const primaryButton = "pv-act inline-flex items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary) font-bold text-(--pv-on-primary)";

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
/** Decorative layer behind the hero, chosen in the "backdrop" step. */
export const Backdrop = ({ kind, strong = false }: { kind: WizardConfig["backdrop"]; strong?: boolean }) => {
  const tint = (variable: string, amount: number) => `color-mix(in srgb, var(${variable}) ${amount}%, transparent)`;
  const fade = "radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 75%)";
  if (kind === "aurora" || strong) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="pv-drift absolute -right-[10%] -top-[30%] h-[80%] w-[55%] rounded-full blur-[90px]" style={{ background: tint("--pv-primary", strong ? 70 : 45) }} />
        <span className="pv-drift absolute -left-[5%] top-[10%] h-[70%] w-[45%] rounded-full blur-[100px]" style={{ background: tint("--pv-accent", strong ? 60 : 38), animationDelay: "-4s" }} />
        <span className="pv-drift absolute bottom-[-30%] left-[30%] h-[60%] w-[40%] rounded-full blur-[90px]" style={{ background: tint("--pv-primary", strong ? 40 : 22), animationDelay: "-8s" }} />
      </div>
    );
  }
  if (kind === "glow") {
    return <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ background: `radial-gradient(60% 55% at 50% 0%, ${tint("--pv-primary", 42)}, transparent 70%), radial-gradient(35% 35% at 85% 70%, ${tint("--pv-accent", 25)}, transparent 70%)` }} />;
  }
  if (kind === "grid") {
    return <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ backgroundImage: "linear-gradient(var(--pv-border) 1px, transparent 1px), linear-gradient(90deg, var(--pv-border) 1px, transparent 1px)", backgroundSize: "56px 56px", maskImage: fade, WebkitMaskImage: fade }} />;
  }
  if (kind === "dots") {
    return <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ backgroundImage: `radial-gradient(${tint("--pv-text", 22)} 1.3px, transparent 1.3px)`, backgroundSize: "20px 20px", maskImage: fade, WebkitMaskImage: fade }} />;
  }
  return null;
};

/**
 * Navigation + hero. Exported on its own so the design gallery can render real
 * thumbnails of every layout without drawing a separate mini version.
 */
export const SiteTop = ({ config, compact }: { config: WizardConfig; compact: boolean }) => {
  const content = industries[config.industry];
  const name = config.brandName.trim() || "برند شما";
  const BrandIcon = content.icon;
  const design = getSiteDesign(config.industry, config.variant, config.art);
  const extra = (value: string) => config.extras.includes(value);
  const cart = useSiteDemo((state) => state.cart);
  const setDemo = useSiteDemo((state) => state.set);
  const headline = config.tagline.trim() || content.headline;
  const layout = design.layout;

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
  const linkTargets = ["showcase", "features", "contact"];
  const links = (
    <nav className="flex items-center gap-8 text-[14px] text-(--pv-muted)">
      <button type="button" data-live onClick={(event) => jumpTo(event.currentTarget, "hero")} className="font-bold text-(--pv-text) transition-colors hover:text-(--pv-primary)">خانه</button>
      {content.features.slice(0, 3).map((item, index) => (
        <button key={item.label} type="button" data-live onClick={(event) => jumpTo(event.currentTarget, linkTargets[index]) || jumpTo(event.currentTarget, "showcase")} className="transition-colors hover:text-(--pv-text)">
          {item.label}
        </button>
      ))}
    </nav>
  );
  const tools = (
    <div className="flex items-center gap-2">
      {extra("multilang") && <span className="flex h-9 items-center gap-1 rounded-(--pv-r-ctrl) bg-(--pv-surface) px-2.5 text-[11px] font-bold"><span>FA</span><span className="text-(--pv-muted)">EN</span></span>}
      {extra("darkmode") && <span className="flex size-9 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-surface)"><Moon className="size-4" aria-hidden="true" /></span>}
      {extra("aiSearch") && !compact && (
        <span className="pv-act flex h-10 w-64 items-center gap-2 rounded-(--pv-r-ctrl) bg-(--pv-surface) px-3 text-[12px] text-(--pv-muted) ring-1 ring-(--pv-accent)/40" data-act="جستجوی هوشمند">
          <Sparkles className="size-4 text-(--pv-accent)" aria-hidden="true" />
          <span className="truncate">بپرسید: {config.industry === "shop" ? "کفش راحت زیر ۲ میلیون" : "بهترین گزینه برای من چیست؟"}</span>
        </span>
      )}
      {config.industry === "shop" ? (
        <>
          {!compact && !extra("aiSearch") && (
            <span className="flex h-10 w-56 items-center gap-2 rounded-(--pv-r-ctrl) bg-(--pv-surface) px-3 text-[12px] text-(--pv-muted)">
              <Search className="size-4" aria-hidden="true" /> جستجوی محصول…
            </span>
          )}
          <span className="relative flex size-10 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary) text-(--pv-on-primary)">
            <ShoppingCart className="size-[18px]" aria-hidden="true" />
            <motion.span key={cart} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="absolute -left-1 -top-1 flex size-5 items-center justify-center rounded-full bg-(--pv-accent) text-[10px] font-bold text-white">
              {faNumber(cart)}
            </motion.span>
          </span>
        </>
      ) : (
        !compact && <span className={`${primaryButton} h-10 px-5 text-[13px]`}>{content.cta}</span>
      )}
      {compact && (
        <button type="button" data-live aria-label="منو" onClick={() => setDemo({ menu: true })} className="ms-1 flex size-9 items-center justify-center rounded-(--pv-r-ctrl) transition-colors hover:bg-(--pv-surface)">
          <Menu className="size-6" aria-hidden="true" />
        </button>
      )}
    </div>
  );

  const nav = compact ? (
    <header className="relative z-10 flex items-center justify-between border-b border-(--pv-border) px-5 py-4">{logo}{tools}</header>
  ) : design.nav === "centered" ? (
    <header className="relative z-10 grid grid-cols-3 items-center border-b border-(--pv-border) px-20 py-5">
      {links}
      <div className="flex justify-center">{logo}</div>
      <div className="flex justify-end">{tools}</div>
    </header>
  ) : design.nav === "floating" ? (
    <div className="relative z-10 px-20 pt-6">
      <header className="flex items-center justify-between rounded-(--pv-r-card) border border-(--pv-border) bg-(--pv-surface)/80 px-6 py-3 shadow-sm backdrop-blur">{logo}{links}{tools}</header>
    </div>
  ) : (
    <header className="relative z-10 flex items-center justify-between border-b border-(--pv-border) px-20 py-5">{logo}{links}{tools}</header>
  );

  const art = (tall = true) => <HeroArt art={design.art} config={config} tall={tall} />;
  const artFill = () => <HeroArt art={design.art} config={config} tall={false} fill />;

  const rating = (
    <div className="flex items-center gap-3">
      <span className="flex -space-x-3 space-x-reverse">
        {[0.15, 0.35, 0.55, 0.75].map((amount) => (
          <span key={amount} className="flex size-9 items-center justify-center rounded-full ring-2 ring-(--pv-bg)" style={{ backgroundColor: mix(config.color, "#ffffff", amount) }}>
            <UserRound className="size-4 text-white/90" aria-hidden="true" />
          </span>
        ))}
      </span>
      <span className="text-[13px]">
        <span className="flex items-center gap-0.5 text-(--pv-primary)">{[0, 1, 2, 3, 4].map((star) => <Star key={star} className="size-3.5 fill-current" aria-hidden="true" />)}</span>
        <span className="text-(--pv-muted)">۴٫۹ از ۲٬۴۰۰ نظر</span>
      </span>
    </div>
  );

  const badge = (inverted = false) => (
    <span className={`inline-flex w-fit items-center gap-2 rounded-(--pv-r-ctrl) px-3 py-1.5 text-[12px] font-bold ${inverted ? "bg-white/15 text-white" : "bg-(--pv-soft) text-(--pv-primary)"}`}>
      <span className="size-1.5 rounded-full bg-(--pv-accent)" />
      {content.badge}
    </span>
  );

  const buttons = (inverted = false, center = false) => (
    <div className={`flex flex-wrap items-center gap-3 ${center ? "justify-center" : ""}`}>
      <span className={`${primaryButton} ${compact ? "h-11 px-5 text-[13px]" : "h-13 px-7 text-[15px]"} ${inverted ? "!bg-white !text-[#14202b]" : ""}`}>{content.cta}</span>
      <span className={`pv-act inline-flex items-center rounded-(--pv-r-ctrl) border px-5 font-bold ${compact ? "h-11 text-[13px]" : "h-13 text-[15px]"} ${inverted ? "border-white/40 text-white" : "border-(--pv-border) text-(--pv-text)"}`}>درباره ما</span>
    </div>
  );

  const text = ({ inverted = false, center = false, size = 54 }: { inverted?: boolean; center?: boolean; size?: number } = {}) => (
    <div key={config.motion} className={`pv-rise flex flex-col gap-5 ${center ? "items-center text-center" : "items-start text-right"}`}>
      {badge(inverted)}
      <h1 style={heading(compact ? 30 : size)} className={inverted ? "text-white" : ""}>
        {headline}
      </h1>
      <p className={`max-w-[38ch] ${compact ? "text-[14px]" : "text-[17px]"} leading-8 ${inverted ? "text-white/80" : "text-(--pv-muted)"}`}>{content.sub}</p>
      {buttons(inverted, center)}
    </div>
  );

  const marqueeRow = (
    <div className="relative overflow-hidden py-2" style={{ maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)" }}>
      <div className="pv-marquee flex w-max gap-3">
        {[...content.features, ...content.features, ...content.features].map((item, index) => (
          <span key={index} className="flex shrink-0 items-center gap-2 rounded-(--pv-r-ctrl) border border-(--pv-border) bg-(--pv-surface) px-4 py-2.5 text-[13px] font-bold">
            <item.icon className="size-4 text-(--pv-primary)" aria-hidden="true" /> {item.label}
          </span>
        ))}
      </div>
    </div>
  );

  const pad = compact ? "px-5 py-10" : "px-20 py-20";
  let hero;

  if (layout === "fullbleed") {
    hero = (
      <div className={`relative overflow-hidden bg-(--pv-primary) ${compact ? "px-5 py-12" : "grid grid-cols-[1.1fr_1fr] items-center gap-12 px-20 py-20"}`}>
        <span className="absolute -left-24 -top-24 size-96 rounded-full opacity-40 blur-3xl" style={{ background: "var(--pv-accent)" }} />
        <span className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-black/15" />
        <div className="relative">{text({ inverted: true })}</div>
        {!compact && (
          <div className="relative rounded-(--pv-r-card) bg-(--pv-bg) p-3 shadow-2xl">
            {art()}
          </div>
        )}
      </div>
    );
  } else if (layout === "glass") {
    hero = (
      <div className={`relative overflow-hidden ${compact ? "px-4 py-10" : "px-20 py-20"}`}>
        <Backdrop kind={config.backdrop} strong />
        <div className={`relative grid items-center gap-10 rounded-(--pv-r-card) border border-white/40 bg-(--pv-bg)/55 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] backdrop-blur-xl ${compact ? "p-5" : "grid-cols-[1.1fr_1fr] p-12"}`}>
          {text()}
          {!compact && art()}
        </div>
      </div>
    );
  } else if (layout === "media") {
    hero = (
      <div className={compact ? "px-4 py-6" : "px-20 py-10"}>
        <div className="relative overflow-hidden rounded-(--pv-r-card)">
          <div className={compact ? "aspect-[3/4]" : "aspect-[16/7.5]"}>
            <div className="size-full [&>*]:!rounded-none">
              {artFill()}
            </div>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.78),rgba(0,0,0,0.25)_60%,rgba(0,0,0,0.1))]" />
          <div className={`absolute bottom-0 right-0 ${compact ? "left-0 p-5" : "max-w-[620px] p-12"}`}>
            <div key={config.motion} className={`pv-rise flex flex-col gap-4 rounded-(--pv-r-card) bg-black/35 backdrop-blur-md ${compact ? "p-4" : "p-7"}`}>
              {badge(true)}
              <h1 style={heading(compact ? 28 : 52)} className="text-white">{headline}</h1>
              {buttons(true)}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (compact) {
    hero = (
      <div className="relative flex flex-col gap-8 px-5 py-10">
        <Backdrop kind={config.backdrop} />
        <div className="relative">{text()}</div>
        {layout === "marquee" ? <div className="relative">{marqueeRow}</div> : null}
        <div className="relative">{art()}</div>
      </div>
    );
  } else if (layout === "bento") {
    hero = (
      <div className={`relative grid grid-cols-[1fr_1.35fr] items-stretch gap-6 ${pad}`}>
        <Backdrop kind={config.backdrop} />
        <div className="relative flex flex-col justify-center gap-8">
          {text({ size: 50 })}
          {rating}
        </div>
        <div className="relative grid grid-cols-3 grid-rows-3 gap-3">
          <div className="col-span-2 row-span-2 overflow-hidden rounded-(--pv-r-card)">{artFill()}</div>
          <div className="flex flex-col justify-end rounded-(--pv-r-card) bg-(--pv-primary) p-4 text-(--pv-on-primary)">
            <strong className="text-[26px] leading-none">{content.stats[0][0]}</strong>
            <span className="mt-1 text-[12px] opacity-80">{content.stats[0][1]}</span>
          </div>
          <div className="flex flex-col justify-end rounded-(--pv-r-card) p-4" style={{ background: "color-mix(in srgb, var(--pv-accent) 18%, var(--pv-bg))" }}>
            <strong className="text-[26px] leading-none" style={{ color: "var(--pv-accent)" }}>{content.stats[1][0]}</strong>
            <span className="mt-1 text-[12px] text-(--pv-muted)">{content.stats[1][1]}</span>
          </div>
          {content.features.slice(0, 3).map((item, index) => (
            <div key={item.label} className={`flex flex-col justify-between rounded-(--pv-r-card) p-4 ${index === 1 ? "bg-(--pv-text) text-(--pv-bg)" : "bg-(--pv-surface)"}`}>
              <item.icon className="size-5" aria-hidden="true" />
              <strong className="text-[13px]">{item.label}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (layout === "editorial") {
    hero = (
      <div className="relative px-20 pb-16 pt-14">
        <Backdrop kind={config.backdrop} />
        <div className="relative grid grid-cols-[1.5fr_1fr] items-end gap-10 border-b border-(--pv-border) pb-10">
          <h1 key={config.motion} className="pv-rise text-right" style={heading(76)}>{headline}</h1>
          <div className="flex flex-col items-start gap-5">
            {badge()}
            <p className="text-[16px] leading-8 text-(--pv-muted)">{content.sub}</p>
            {buttons()}
          </div>
        </div>
        <div className="relative mt-10 grid grid-cols-[1fr_2.2fr] items-center gap-10">
          <div className="flex flex-col gap-6">
            {content.stats.map(([value, label]) => (
              <div key={label} className="border-t border-(--pv-border) pt-3">
                <strong style={heading(30)}>{value}</strong>
                <span className="block text-[12px] text-(--pv-muted)">{label}</span>
              </div>
            ))}
          </div>
          {art(false)}
        </div>
      </div>
    );
  } else if (layout === "stack3d") {
    hero = (
      <div className="relative overflow-hidden px-20 pt-20">
        <Backdrop kind={config.backdrop} />
        <div className="relative mx-auto max-w-[760px]">{text({ center: true, size: 58 })}</div>
        <div className="relative mx-auto mt-14 h-[380px] max-w-[980px]" style={{ perspective: "1400px" }}>
          <div className="absolute inset-x-[12%] top-10 opacity-50" style={{ transform: "rotateX(28deg) translateZ(-120px) translateY(-40px)" }}>
            <div className="rounded-(--pv-r-card) bg-(--pv-surface) p-3 shadow-xl"><div className="aspect-[16/7] rounded-(--pv-r-card)" style={{ background: "color-mix(in srgb, var(--pv-accent) 25%, var(--pv-bg))" }} /></div>
          </div>
          <div className="absolute inset-x-[6%] top-16" style={{ transform: "rotateX(28deg)" }}>
            <div className="rounded-(--pv-r-card) bg-(--pv-bg) p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)] ring-1 ring-(--pv-border)">{art(false)}</div>
          </div>
        </div>
      </div>
    );
  } else if (layout === "marquee") {
    hero = (
      <div className="relative flex flex-col gap-12 overflow-hidden pb-16 pt-20">
        <Backdrop kind={config.backdrop} />
        <div className="relative mx-auto max-w-[860px] px-20">{text({ center: true, size: 64 })}</div>
        <div className="relative">{marqueeRow}</div>
        <div className="relative mx-auto w-full max-w-[1000px] px-20">{art(false)}</div>
      </div>
    );
  } else if (layout === "centered") {
    hero = (
      <div className="relative flex flex-col items-center gap-12 px-20 py-20">
        <Backdrop kind={config.backdrop} />
        <div className="relative flex flex-col items-center gap-6">
          {text({ center: true })}
          {rating}
        </div>
        <div className="relative w-full max-w-[920px]">{art(false)}</div>
      </div>
    );
  } else {
    hero = (
      <div className={`relative grid grid-cols-2 items-center gap-14 ${pad}`}>
        <Backdrop kind={config.backdrop} />
        {layout === "mirror" ? (
          <>
            <div className="relative">{art()}</div>
            <div className="relative flex flex-col gap-8">{text()}{rating}</div>
          </>
        ) : (
          <>
            <div className="relative flex flex-col gap-8">{text()}{rating}</div>
            <div className="relative">{art()}</div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {nav}
      <section data-pv="hero" className="pv-section relative">
        {hero}
      </section>
    </div>
  );
};

/** Booking projects get a real reservation widget right under the hero. */
const BookingSection = ({ compact }: { compact: boolean }) => (
  <section data-pv="booking" className={`pv-section ${compact ? "px-5 py-8" : "px-20 py-14"}`}>
    <div className={`grid gap-6 rounded-(--pv-r-card) border border-(--pv-border) bg-(--pv-surface) ${compact ? "p-5" : "grid-cols-[1.2fr_1fr] p-8"}`}>
      <div>
        <h2 style={heading(compact ? 20 : 28)}>زمان مناسب را انتخاب کنید</h2>
        <div className="mt-5 grid grid-cols-7 gap-2 text-center text-[12px]">
          {Array.from({ length: 14 }, (_, index) => (
            <span key={index} className={`flex aspect-square items-center justify-center rounded-(--pv-r-ctrl) ${index === 4 ? "bg-(--pv-primary) font-bold text-(--pv-on-primary)" : [2, 8, 11].includes(index) ? "text-(--pv-muted) line-through" : "bg-(--pv-bg)"}`}>
              {(index + 8).toLocaleString("fa-IR")}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-bold text-(--pv-muted)">ساعت‌های خالی</span>
        <div className="grid grid-cols-3 gap-2">
          {["۹:۰۰", "۱۰:۳۰", "۱۲:۰۰", "۱۵:۰۰", "۱۶:۳۰", "۱۸:۰۰"].map((time, index) => (
            <span key={time} className={`flex h-11 items-center justify-center rounded-(--pv-r-ctrl) text-[13px] font-bold ${index === 2 ? "bg-(--pv-primary) text-(--pv-on-primary)" : "bg-(--pv-bg)"}`}>{time}</span>
          ))}
        </div>
        <span className={`${primaryButton} mt-3 h-12 text-[14px]`}>تأیید رزرو</span>
      </div>
    </div>
  </section>
);

/** Campaign landing pages: a countdown and a single strong call to action. */
const LandingStrip = ({ compact, cta }: { compact: boolean; cta: string }) => (
  <section data-pv="showcase" className={`pv-section ${compact ? "px-5 py-8" : "px-20 py-14"}`}>
    <div className={`flex items-center justify-between gap-6 rounded-(--pv-r-card) p-8 text-white ${compact ? "flex-col text-center" : ""}`} style={{ background: "linear-gradient(120deg, var(--pv-primary), var(--pv-accent))" }}>
      <div>
        <h2 style={heading(compact ? 22 : 32)}>فقط تا پایان این هفته</h2>
        <p className="mt-2 text-[14px] opacity-85">پیشنهاد ویژه برای ۱۰۰ نفر اول</p>
      </div>
      <div className="flex gap-2" dir="ltr">
        {[["۰۲", "روز"], ["۱۴", "ساعت"], ["۳۸", "دقیقه"]].map(([value, label]) => (
          <span key={label} className="flex w-16 flex-col items-center rounded-(--pv-r-ctrl) bg-white/15 py-2 backdrop-blur">
            <strong className="text-[22px] leading-none">{value}</strong>
            <span className="mt-1 text-[10px] opacity-80">{label}</span>
          </span>
        ))}
      </div>
      <span className="inline-flex h-12 items-center rounded-(--pv-r-ctrl) bg-white px-7 text-[14px] font-extrabold text-[#14202b]">{cta}</span>
    </div>
  </section>
);

export const SitePreview = ({ config, compact }: { config: WizardConfig; compact: boolean }) => {
  const content = industries[config.industry];
  const name = config.brandName.trim() || "برند شما";
  const has = (section: string) => config.sections.includes(section);
  const design = getSiteDesign(config.industry, config.variant, config.art);
  const faqOpen = useSiteDemo((state) => state.faq);
  const chosenPlan = useSiteDemo((state) => state.plan);
  const menu = useSiteDemo((state) => state.menu);
  const popupClosed = useSiteDemo((state) => state.popupClosed);
  const installClosed = useSiteDemo((state) => state.installClosed);
  const aiOpen = useSiteDemo((state) => state.aiOpen);
  const setDemo = useSiteDemo((state) => state.set);
  const extra = (value: string) => config.extras.includes(value);

  return (
    <ActionLayer>
    <div dir="rtl" data-motion={config.motion} className="pv-root relative min-h-full flex-1 bg-(--pv-bg) font-sans text-(--pv-text)">
      {/* web app: install prompt, like a real PWA on a phone */}
      {compact && config.webApp && !installClosed && (
        <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-(--pv-border) bg-(--pv-surface) px-4 py-2.5">
          <span className="flex size-9 items-center justify-center rounded-[10px] bg-(--pv-primary) text-(--pv-on-primary)"><Download className="size-4" aria-hidden="true" /></span>
          <span className="flex-1 text-[12px] leading-5"><strong className="block">{name} را نصب کنید</strong><span className="text-(--pv-muted)">مثل اپ، روی صفحه گوشی</span></span>
          <button type="button" data-live onClick={() => setDemo({ installClosed: true })} className="rounded-(--pv-r-ctrl) bg-(--pv-primary) px-3 py-1.5 text-[11px] font-bold text-(--pv-on-primary)">نصب</button>
        </div>
      )}
      {extra("announce") && (
        <div className="flex items-center justify-center gap-2 px-4 py-2 text-center text-[12px] font-bold text-white" style={{ background: "linear-gradient(90deg, var(--pv-primary), var(--pv-accent))" }}>
          <Megaphone className="size-3.5 shrink-0" aria-hidden="true" /> {content.badge} · ارسال رایگان برای خرید اول
        </div>
      )}
      <SiteTop config={config} compact={compact} />
      {config.projectType === "booking" && <BookingSection compact={compact} />}
      {config.projectType === "landing" ? (
        <LandingStrip compact={compact} cta={content.cta} />
      ) : (
        <IndustryShowcase config={config.projectType === "store" ? { ...config, industry: "shop" } : config} compact={compact} />
      )}
      {extra("aiRecommend") && (
        <section data-pv="aiRecommend" className={`pv-section ${compact ? "px-5 py-8" : "px-20 py-12"}`}>
          <div className="rounded-(--pv-r-card) p-5" style={{ background: "linear-gradient(130deg, color-mix(in srgb, var(--pv-accent) 14%, var(--pv-bg)), color-mix(in srgb, var(--pv-primary) 10%, var(--pv-bg)))" }}>
            <h2 className="flex items-center gap-2" style={heading(compact ? 18 : 24)}>
              <Sparkles className="size-5 text-(--pv-accent)" aria-hidden="true" /> پیشنهاد هوشمند برای شما
            </h2>
            <div className={`mt-4 grid gap-3 ${compact ? "" : "grid-cols-3"}`}>
              {content.features.slice(0, compact ? 2 : 3).map((item, index) => (
                <div key={item.label} className="pv-act flex items-center gap-3 rounded-(--pv-r-card) bg-(--pv-bg) p-3 ring-1 ring-(--pv-border)">
                  <span className="flex size-12 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-soft) text-(--pv-primary)"><item.icon className="size-5" aria-hidden="true" /></span>
                  <span className="flex-1">
                    <strong className="block text-[13px]">{item.label}</strong>
                    <span className="text-[11px] font-bold text-(--pv-accent)">{faNumber(96 - index * 4)}٪ تطابق با سلیقه شما</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
                style={{ backgroundColor: mix(config.color, isDark(config.theme) ? "#0f151c" : "#ffffff", amount) }}
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
            ].map((plan, planIndex) => (
              <button key={plan.title} type="button" data-live onClick={() => setDemo({ plan: planIndex })} className={`flex flex-col gap-4 rounded-(--pv-r-card) border p-6 text-right transition-all duration-300 ${chosenPlan === planIndex ? "scale-[1.03] border-(--pv-primary) bg-(--pv-primary) text-(--pv-on-primary) shadow-xl" : "border-(--pv-border) bg-(--pv-surface) hover:-translate-y-1"}`}>
                <strong className="text-[16px]">{plan.title}</strong>
                <span style={heading(compact ? 24 : 30)}>
                  {faNumber(plan.price)} <span className="text-[13px] font-normal opacity-70">هزار تومان</span>
                </span>
                {["امکان اول", "امکان دوم", "امکان سوم"].map((line) => (
                  <span key={line} className="text-[13px] opacity-80">{line}</span>
                ))}
                <span className={`mt-auto flex h-11 items-center justify-center rounded-(--pv-r-ctrl) text-[13px] font-bold ${chosenPlan === planIndex ? "bg-(--pv-bg) text-(--pv-text)" : "bg-(--pv-primary) text-(--pv-on-primary)"}`}>{chosenPlan === planIndex ? "انتخاب شد ✓" : "انتخاب"}</span>
              </button>
            ))}
          </div>
        </Section>
      )}

      {has("faq") && (
        <Section id="faq" compact={compact} className="bg-(--pv-surface)">
          <SectionTitle title="سوالات متداول" compact={compact} />
          <div className="mx-auto flex max-w-[760px] flex-col gap-3">
            {[
              ["زمان تحویل چقدر است؟", "بسته به نوع سفارش، معمولاً بین دو تا پنج روز کاری."],
              ["امکان پرداخت قسطی دارید؟", "بله؛ تا سه قسط بدون کارمزد."],
              ["پشتیبانی بعد از خرید چطور است؟", "تا یک سال پشتیبانی رایگان داریم."],
              ["چطور با شما تماس بگیرم؟", "از فرم تماس پایین صفحه یا تلفن همیشه در دسترس."],
            ].map(([question, answer], index) => (
              <button key={question} type="button" data-live onClick={() => setDemo({ faq: faqOpen === index ? -1 : index })} className={`${card} bg-(--pv-bg) px-5 py-4 text-right`}>
                <div className="flex items-center justify-between text-[14px] font-bold">
                  {question}
                  <ChevronDown className={`size-4 text-(--pv-muted) transition-transform duration-300 ${faqOpen === index ? "rotate-180" : ""}`} aria-hidden="true" />
                </div>
                <AnimatePresence initial={false}>
                  {faqOpen === index && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden text-[13px] leading-7 text-(--pv-muted)">
                      <span className="block pt-3">{answer}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
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
                <div className="aspect-[16/9]" style={{ backgroundColor: mix(config.color, isDark(config.theme) ? "#0f151c" : "#ffffff", 0.3 + index * 0.2) }} />
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
      {/* mobile menu */}
      <AnimatePresence>
        {compact && menu && (
          <motion.div className="absolute inset-0 z-50 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.nav className="sticky top-0 flex flex-col gap-1 rounded-b-(--pv-r-card) bg-(--pv-bg) p-5 shadow-2xl" initial={{ y: -40 }} animate={{ y: 0 }} exit={{ y: -40 }} transition={{ type: "spring", bounce: 0, duration: 0.3 }}>
              <div className="mb-3 flex items-center justify-between">
                <strong className="text-[16px]">{name}</strong>
                <button type="button" data-live aria-label="بستن" onClick={() => setDemo({ menu: false })}><X className="size-5" aria-hidden="true" /></button>
              </div>
              {[["خانه", "hero"], ...content.features.slice(0, 3).map((item, index) => [item.label, ["showcase", "features", "contact"][index]])].map(([label, target]) => (
                <button key={label} type="button" data-live onClick={(event) => {
                  setDemo({ menu: false });
                  if (!jumpTo(event.currentTarget, target)) jumpTo(event.currentTarget, "showcase");
                }} className="rounded-(--pv-r-ctrl) px-3 py-3 text-right text-[15px] font-bold transition-colors hover:bg-(--pv-surface)">
                  {label}
                </button>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* offer popup */}
      <AnimatePresence>
        {extra("popup") && !popupClosed && (
          <motion.div className="pointer-events-none sticky bottom-0 z-40 flex h-0 items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={`pointer-events-auto mb-24 w-[min(92%,380px)] rounded-(--pv-r-card) bg-(--pv-bg) p-5 text-center shadow-2xl ring-1 ring-(--pv-border) ${compact ? "" : "mb-28"}`} initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} transition={{ delay: 1, type: "spring", bounce: 0.3 }}>
              <button type="button" data-live aria-label="بستن" onClick={() => setDemo({ popupClosed: true })} className="absolute left-3 top-3"><X className="size-4 text-(--pv-muted)" aria-hidden="true" /></button>
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-(--pv-soft) text-(--pv-primary)"><Gift className="size-6" aria-hidden="true" /></span>
              <strong className="mt-3 block text-[16px]">۱۵٪ تخفیف خرید اول</strong>
              <span className="mt-1 block text-[12px] text-(--pv-muted)">با عضویت در خبرنامه</span>
              <button type="button" data-live onClick={() => setDemo({ popupClosed: true })} className={`${primaryButton} mt-4 h-10 w-full text-[13px]`}>دریافت کد</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* web app tab bar */}
      {compact && config.webApp && (
        <nav className="sticky bottom-0 z-30 flex items-center justify-around border-t border-(--pv-border) bg-(--pv-bg)/95 px-3 pb-5 pt-2.5 backdrop-blur">
          {[
            { icon: House, label: "خانه", target: "hero" },
            { icon: LayoutGrid, label: "محصولات", target: "showcase" },
            { icon: Heart, label: "علاقه‌مندی", target: "features" },
            { icon: UserRound, label: "حساب", target: "contact" },
          ].map((tab, index) => (
            <button key={tab.label} type="button" data-live onClick={(event) => jumpTo(event.currentTarget, tab.target) || jumpTo(event.currentTarget, "hero")} className={`flex flex-col items-center gap-1 text-[10px] ${index === 0 ? "font-bold text-(--pv-primary)" : "text-(--pv-muted)"}`}>
              <tab.icon className="size-5" aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </nav>
      )}

      {extra("floatcall") && (
        <div className={`pointer-events-none sticky z-30 flex justify-start px-5 ${compact && config.webApp ? "bottom-24" : "bottom-5"}`}>
          <span className="pv-act pointer-events-auto flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-xl" data-act="تماس و واتس‌اپ">
            <Phone className="size-6" aria-hidden="true" />
          </span>
        </div>
      )}

      {extra("aiChat") && (
        <div className={`pointer-events-none sticky z-40 flex flex-col items-end gap-3 px-5 ${compact && config.webApp ? "bottom-24" : "bottom-5"}`}>
          <AnimatePresence>
            {aiOpen && (
              <motion.div initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} className={`pointer-events-auto flex flex-col gap-2 rounded-(--pv-r-card) bg-(--pv-bg) p-4 shadow-2xl ring-1 ring-(--pv-border) ${compact ? "w-[86%]" : "w-[340px]"}`}>
                <strong className="flex items-center gap-2 text-[13px]"><Sparkles className="size-4 text-(--pv-accent)" aria-hidden="true" /> دستیار هوشمند {name}</strong>
                <p className="self-start rounded-(--pv-r-card) bg-(--pv-surface) px-3 py-2 text-[12px] leading-6">سلام! دنبال چه چیزی هستید؟</p>
                <p className="self-end rounded-(--pv-r-card) bg-(--pv-primary) px-3 py-2 text-[12px] leading-6 text-(--pv-on-primary)">{content.features[0].label} می‌خواهم</p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="self-start rounded-(--pv-r-card) bg-(--pv-surface) px-3 py-2 text-[12px] leading-6">
                  عالی! سه گزینه مناسب شما پیدا کردم؛ بهترینش «{content.features[1].label}» است ✨
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
          <button type="button" data-live onClick={() => setDemo({ aiOpen: !aiOpen })} className="pointer-events-auto flex h-14 items-center gap-2 rounded-full px-5 text-[13px] font-bold text-white shadow-xl" style={{ background: "linear-gradient(130deg, var(--pv-primary), var(--pv-accent))" }}>
            {aiOpen ? <X className="size-5" aria-hidden="true" /> : <Sparkles className="size-5" aria-hidden="true" />}
            {!compact && (aiOpen ? "بستن" : "از هوش مصنوعی بپرسید")}
          </button>
        </div>
      )}

      {config.extras.includes("chat") && (
        <div className="pointer-events-none sticky bottom-5 flex justify-end px-5">
          <span className="flex size-14 items-center justify-center rounded-full bg-(--pv-primary) text-(--pv-on-primary) shadow-xl">
            <MessageCircle className="size-6" aria-hidden="true" />
          </span>
        </div>
      )}
    </div>
    </ActionLayer>
  );
};
