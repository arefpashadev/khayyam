import { Bell, Heart, House, Search, UserRound } from "lucide-react";
import type { CSSProperties } from "react";

import { appFeatures, industries, mix, type WizardConfig } from "../config";
import { getAppDesign, industryArts } from "../designs";
import { HeroArt } from "./hero-art";

const heading = (size: number): CSSProperties => ({
  fontSize: `calc(${size}px * var(--pv-hs))`,
  fontWeight: "var(--pv-hw)" as CSSProperties["fontWeight"],
  letterSpacing: "var(--pv-ht)",
  lineHeight: 1.4,
});

export const AppPreview = ({ config }: { config: WizardConfig }) => {
  const content = industries[config.industry];
  const design = getAppDesign(config.variant);
  const name = config.brandName.trim() || "برند شما";
  const headline = config.tagline.trim() || content.headline;
  const enabled = appFeatures.filter((feature) => config.sections.includes(feature.value));
  const tabs = [{ value: "home", label: "خانه", icon: House }, ...enabled.slice(0, 3), { value: "profile", label: "پروفایل", icon: UserRound }];
  const tile = (amount: number) => ({ backgroundColor: mix(config.color, config.theme === "dark" ? "#0f151c" : "#ffffff", amount) });

  const banner = {
    solid: (
      <div className="relative overflow-hidden rounded-(--pv-r-card) bg-(--pv-primary) p-5 text-(--pv-on-primary)">
        <div className="absolute -left-10 -top-10 size-36 rounded-full bg-white/15" />
        <span className="relative text-[11px] font-bold opacity-80">{content.badge}</span>
        <p className="relative mt-2 max-w-[18ch]" style={heading(20)}>{headline}</p>
        <span className="relative mt-4 inline-flex h-9 items-center rounded-(--pv-r-ctrl) bg-(--pv-bg) px-4 text-[12px] font-bold text-(--pv-text)">{content.cta}</span>
      </div>
    ),
    art: (
      <div className="overflow-hidden rounded-(--pv-r-card)">
        <HeroArt art={industryArts[config.industry][(config.variant + 1) % 6]} config={config} />
      </div>
    ),
    stats: (
      <div className="grid grid-cols-3 gap-2">
        {content.stats.map(([value, label], index) => (
          <div key={label} className={`rounded-(--pv-r-card) p-3 ${index === 0 ? "bg-(--pv-primary) text-(--pv-on-primary)" : "bg-(--pv-soft)"}`}>
            <strong className="block text-[16px]">{value}</strong>
            <span className="text-[10px] opacity-75">{label}</span>
          </div>
        ))}
      </div>
    ),
    search: (
      <div className="rounded-(--pv-r-card) bg-(--pv-soft) p-4">
        <p style={heading(18)}>{headline}</p>
        <div className="mt-3 flex h-11 items-center gap-2 rounded-(--pv-r-ctrl) bg-(--pv-bg) px-3 text-[12px] text-(--pv-muted)">
          <Search className="size-4" aria-hidden="true" /> جستجو در {name}
        </div>
      </div>
    ),
    greeting: (
      <div className="py-2">
        <span className="text-[12px] font-bold text-(--pv-primary)">{content.badge}</span>
        <p className="mt-1" style={heading(26)}>{headline}</p>
      </div>
    ),
  }[design.banner];

  return (
    <div dir="rtl" data-motion={config.motion} className="pv-root flex min-h-full flex-col bg-(--pv-bg) font-sans text-(--pv-text)">
      <div className="sticky top-0 z-10 bg-(--pv-bg)">
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <span className="block text-[12px] text-(--pv-muted)">سلام، خوش آمدید</span>
            <strong style={heading(20)}>{name}</strong>
          </div>
          <span className="flex size-11 items-center justify-center rounded-full bg-(--pv-soft) text-(--pv-primary)">
            <content.icon className="size-5" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div key={config.motion} className="pv-rise flex flex-1 flex-col gap-5 px-5 pb-6">
        {config.extras.includes("push") && (
          <div className="pv-float flex items-center gap-3 rounded-(--pv-r-card) bg-(--pv-surface) p-3 shadow-lg ring-1 ring-(--pv-border)">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary) text-(--pv-on-primary)">
              <Bell className="size-4" aria-hidden="true" />
            </span>
            <span className="text-[12px] leading-5">
              <strong className="block">{name}</strong>
              <span className="text-(--pv-muted)">{content.badge}</span>
            </span>
          </div>
        )}

        {design.layout === "feed" && (
          <div className="flex gap-3 overflow-hidden">
            {content.features.map((item, index) => (
              <div key={item.label} className="flex shrink-0 flex-col items-center gap-1.5">
                <span className="flex size-16 items-center justify-center rounded-full p-[3px]" style={{ background: index === 0 ? "var(--pv-primary)" : "var(--pv-border)" }}>
                  <span className="flex size-full items-center justify-center rounded-full border-2 border-(--pv-bg) bg-(--pv-soft) text-(--pv-primary)">
                    <item.icon className="size-6" aria-hidden="true" />
                  </span>
                </span>
                <span className="text-[10px]">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        <div data-pv="hero" className="pv-section">{banner}</div>

        {enabled.length > 0 && (
          <div data-pv="features" className="pv-section grid grid-cols-4 gap-3">
            {enabled.map((feature) => (
              <div key={feature.value} data-pv={feature.value} className="pv-section flex flex-col items-center gap-2 rounded-(--pv-r-card) py-1">
                <span className="flex size-13 items-center justify-center rounded-(--pv-r-card) bg-(--pv-soft) text-(--pv-primary)">
                  <feature.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-center text-[10px] leading-4">{feature.label}</span>
              </div>
            ))}
          </div>
        )}

        <strong style={heading(16)}>پیشنهاد امروز</strong>

        {design.layout === "cards" && (
          <div className="grid grid-cols-2 gap-3">
            {content.features.map((item, index) => (
              <div key={item.label} className="overflow-hidden rounded-(--pv-r-card) border border-(--pv-border) bg-(--pv-surface)">
                <div className="relative aspect-square" style={tile(0.25 + index * 0.15)}>
                  <Heart className="absolute left-2.5 top-2.5 size-4 text-white" aria-hidden="true" />
                </div>
                <div className="p-3">
                  <strong className="block text-[12px]">{item.label}</strong>
                  <span className="mt-1 block text-[11px] text-(--pv-primary)">مشاهده</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {design.layout === "list" && (
          <div className="flex flex-col gap-3">
            {content.features.map((item, index) => (
              <div key={item.label} className="flex items-center gap-3 rounded-(--pv-r-card) border border-(--pv-border) bg-(--pv-surface) p-3">
                <span className="size-14 shrink-0 rounded-(--pv-r-ctrl)" style={tile(0.25 + index * 0.15)} />
                <div className="flex-1">
                  <strong className="block text-[13px]">{item.label}</strong>
                  <span className="mt-1 block text-[11px] text-(--pv-muted)">توضیح کوتاه این گزینه</span>
                </div>
                <span className="rounded-(--pv-r-ctrl) bg-(--pv-soft) px-3 py-1.5 text-[11px] font-bold text-(--pv-primary)">باز کن</span>
              </div>
            ))}
          </div>
        )}

        {design.layout === "feed" &&
          content.features.slice(0, 2).map((item, index) => (
            <article key={item.label} className="overflow-hidden rounded-(--pv-r-card) border border-(--pv-border) bg-(--pv-surface)">
              <div className="flex items-center gap-2 p-3 text-[12px] font-bold">
                <span className="size-7 rounded-full bg-(--pv-soft)" /> {name}
              </div>
              <div className="aspect-[4/3]" style={tile(0.3 + index * 0.25)} />
              <div className="flex items-center justify-between p-3 text-[12px]">
                <strong>{item.label}</strong>
                <Heart className="size-4 text-(--pv-primary)" aria-hidden="true" />
              </div>
            </article>
          ))}
      </div>

      {design.tabBar === "floating" ? (
        <nav className="sticky bottom-0 mt-auto px-5 pb-7 pt-2">
          <div className="flex items-center justify-around rounded-full bg-(--pv-text) px-3 py-3 shadow-xl">
            {tabs.map((tab, index) => (
              <span key={tab.value} className={`flex size-10 items-center justify-center rounded-full ${index === 0 ? "bg-(--pv-primary) text-(--pv-on-primary)" : "text-(--pv-bg) opacity-60"}`}>
                <tab.icon className="size-5" aria-hidden="true" />
              </span>
            ))}
          </div>
        </nav>
      ) : (
        <nav className="sticky bottom-0 mt-auto flex items-center justify-around border-t border-(--pv-border) bg-(--pv-bg) px-3 pb-7 pt-3">
          {tabs.map((tab, index) => (
            <span key={tab.value} className={`flex flex-col items-center gap-1 text-[10px] ${index === 0 ? "font-bold text-(--pv-primary)" : "text-(--pv-muted)"}`}>
              <tab.icon className="size-5" aria-hidden="true" />
              {tab.label}
            </span>
          ))}
        </nav>
      )}
    </div>
  );
};
