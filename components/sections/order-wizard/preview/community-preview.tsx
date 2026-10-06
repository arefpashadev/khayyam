import { Award, CalendarDays, Heart, Image as ImageIcon, MessageCircle, Search, Share2, UserRound, Users } from "lucide-react";
import type { CSSProperties } from "react";

import { ActionLayer } from "./action-layer";

import { industries, isDark, mix, type WizardConfig } from "../config";

const heading = (size: number): CSSProperties => ({
  fontSize: `calc(${size}px * var(--pv-hs))`,
  fontWeight: "var(--pv-hw)" as CSSProperties["fontWeight"],
  letterSpacing: "var(--pv-ht)",
  lineHeight: 1.35,
});

const card = "pv-act rounded-(--pv-r-card) border border-(--pv-border) bg-(--pv-bg)";

/** A community platform: members, posts, groups and events around the brand. */
export const CommunityPreview = ({ config, compact }: { config: WizardConfig; compact: boolean }) => {
  const content = industries[config.industry];
  const name = config.brandName.trim() || `جامعه ${content.label}`;
  const has = (module: string) => config.sections.includes(module);
  const shade = (amount: number) => mix(config.color, isDark(config.theme) ? "#0f151c" : "#ffffff", amount);
  const avatar = (amount: number, size = "size-10") => (
    <span className={`flex ${size} shrink-0 items-center justify-center rounded-full`} style={{ backgroundColor: shade(amount) }}>
      <UserRound className="size-1/2 text-white/90" aria-hidden="true" />
    </span>
  );

  const posts = [
    { author: "سارا محمدی", time: "۱۲ دقیقه پیش", text: `تجربه‌ام از «${content.features[0].label}» را نوشتم؛ خوشحال می‌شوم نظر شما را هم بدانم.`, image: true, likes: "۲۴۸", comments: "۳۶" },
    { author: "علی رضایی", time: "۱ ساعت پیش", text: "کسی برای دورهمی پنجشنبه برنامه دارد؟ جای خوبی پیدا کردم.", image: false, likes: "۹۲", comments: "۱۸" },
  ];

  const sideGroups = (
    <div data-pv="groups" className={`pv-section ${card} p-5`}>
      <strong className="text-[14px]">گروه‌های فعال</strong>
      {[["تازه‌واردها", "۱٬۲۰۰"], ["تجربه‌ها", "۸۶۰"], ["پرسش و پاسخ", "۲٬۴۰۰"]].map(([group, members], index) => (
        <div key={group} className="mt-4 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-(--pv-r-ctrl)" style={{ backgroundColor: shade(0.3 + index * 0.2) }}><Users className="size-4 text-white" aria-hidden="true" /></span>
          <div className="flex-1 text-[13px]"><strong className="block">{group}</strong><span className="text-[11px] text-(--pv-muted)">{members} عضو</span></div>
          <span className="rounded-(--pv-r-ctrl) bg-(--pv-soft) px-3 py-1 text-[11px] font-bold text-(--pv-primary)">عضویت</span>
        </div>
      ))}
    </div>
  );

  const sideEvents = (
    <div data-pv="events" className={`pv-section ${card} p-5`}>
      <strong className="text-[14px]">رویداد بعدی</strong>
      <div className="mt-4 flex gap-3">
        <span className="flex size-14 shrink-0 flex-col items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary) text-(--pv-on-primary)">
          <strong className="text-[18px] leading-none">۱۸</strong>
          <span className="text-[10px]">مهر</span>
        </span>
        <div className="text-[13px]">
          <strong className="block">دورهمی ماهانه اعضا</strong>
          <span className="mt-1 flex items-center gap-1 text-[11px] text-(--pv-muted)"><CalendarDays className="size-3" aria-hidden="true" /> پنجشنبه ساعت ۱۸</span>
        </div>
      </div>
    </div>
  );

  return (
    <ActionLayer><div dir="rtl" data-motion={config.motion} className="pv-root min-h-full flex-1 bg-(--pv-surface) font-sans text-(--pv-text)">
      <header className={`flex items-center gap-4 border-b border-(--pv-border) bg-(--pv-bg) ${compact ? "px-4 py-3" : "px-10 py-4"}`}>
        <span className="flex size-9 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary) text-(--pv-on-primary)"><Users className="size-5" aria-hidden="true" /></span>
        <strong className="text-[15px]">{name}</strong>
        {!compact && (
          <div className="mx-6 flex h-10 flex-1 items-center gap-2 rounded-(--pv-r-ctrl) bg-(--pv-surface) px-3 text-[12px] text-(--pv-muted)">
            <Search className="size-4" aria-hidden="true" /> جستجوی اعضا، پست‌ها و گروه‌ها
          </div>
        )}
        <div className="ms-auto flex items-center gap-2">
          {has("messages") && <span className="flex size-10 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-surface)"><MessageCircle className="size-4" aria-hidden="true" /></span>}
          {avatar(0.3, "size-10")}
        </div>
      </header>

      <div key={config.motion} className={`pv-rise grid gap-6 ${compact ? "p-4" : "grid-cols-[1fr_320px] px-10 py-8"}`}>
        <div className="flex min-w-0 flex-col gap-5">
          {/* cover + composer */}
          <div data-pv="hero" className={`pv-section ${card} overflow-hidden`}>
            <div className="relative h-28" style={{ background: "linear-gradient(120deg, var(--pv-primary), var(--pv-accent))" }}>
              <span className="absolute -bottom-6 right-5 flex size-14 items-center justify-center rounded-(--pv-r-card) bg-(--pv-bg) shadow-lg"><content.icon className="size-7 text-(--pv-primary)" aria-hidden="true" /></span>
            </div>
            <div className="px-5 pb-5 pt-9">
              <h1 style={heading(compact ? 18 : 24)}>به {name} خوش آمدید</h1>
              <p className="mt-1 text-[12px] text-(--pv-muted)">۴٬۸۰۰ عضو · ۱۲۰ پست امروز</p>
              <div className="mt-4 flex items-center gap-3 rounded-(--pv-r-ctrl) bg-(--pv-surface) p-3">
                {avatar(0.3, "size-9")}
                <span className="flex-1 text-[13px] text-(--pv-muted)">چه چیزی می‌خواهید به اشتراک بگذارید؟</span>
                <ImageIcon className="size-4 text-(--pv-muted)" aria-hidden="true" />
                <span className="rounded-(--pv-r-ctrl) bg-(--pv-primary) px-3 py-1.5 text-[12px] font-bold text-(--pv-on-primary)">انتشار</span>
              </div>
            </div>
          </div>

          {has("feed") &&
            posts.map((post, index) => (
              <article key={post.author} data-pv={index === 0 ? "feed" : undefined} className={`pv-section ${card} p-5`}>
                <div className="flex items-center gap-3">
                  {avatar(0.2 + index * 0.3)}
                  <div className="text-[13px]">
                    <strong className="flex items-center gap-1.5">
                      {post.author}
                      {has("badges") && index === 0 && <Award className="size-3.5 text-(--pv-accent)" aria-hidden="true" />}
                    </strong>
                    <span className="text-[11px] text-(--pv-muted)">{post.time}</span>
                  </div>
                </div>
                <p className="mt-3 text-[14px] leading-7">{post.text}</p>
                {post.image && <div className="mt-3 aspect-[16/7] rounded-(--pv-r-card)" style={{ backgroundColor: shade(0.4) }} />}
                <div className="mt-4 flex items-center gap-5 text-[12px] text-(--pv-muted)">
                  <span className="flex items-center gap-1.5 font-bold text-(--pv-primary)"><Heart className="size-4 fill-current" aria-hidden="true" />{post.likes}</span>
                  <span className="flex items-center gap-1.5"><MessageCircle className="size-4" aria-hidden="true" />{post.comments}</span>
                  <span className="flex items-center gap-1.5"><Share2 className="size-4" aria-hidden="true" />اشتراک</span>
                </div>
              </article>
            ))}
        </div>

        {!compact && (
          <div className="flex flex-col gap-5">
            {has("groups") && sideGroups}
            {has("events") && sideEvents}
            {has("profiles") && (
              <div data-pv="profiles" className={`pv-section ${card} p-5`}>
                <strong className="text-[14px]">اعضای فعال این هفته</strong>
                <div className="mt-4 flex -space-x-3 space-x-reverse">{[0.15, 0.3, 0.45, 0.6, 0.75].map((amount) => <span key={amount} className="rounded-full ring-2 ring-(--pv-bg)">{avatar(amount)}</span>)}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div></ActionLayer>
  );
};
