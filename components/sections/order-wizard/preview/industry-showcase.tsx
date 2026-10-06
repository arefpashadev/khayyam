"use client";

import { Clock, Plus, Star, TrendingUp, UserRound } from "lucide-react";
import type { CSSProperties } from "react";

import { faNumber, isDark, mix, type WizardConfig } from "../config";
import { useSiteDemo } from "./site-demo";

const heading = (size: number): CSSProperties => ({
  fontSize: `calc(${size}px * var(--pv-hs))`,
  fontWeight: "var(--pv-hw)" as CSSProperties["fontWeight"],
  letterSpacing: "var(--pv-ht)",
  lineHeight: 1.35,
});

const tile = "pv-act overflow-hidden rounded-(--pv-r-card) border border-(--pv-border) bg-(--pv-bg)";
const chipActive = "pv-act rounded-(--pv-r-ctrl) bg-(--pv-primary) px-4 py-2 text-[12px] font-bold text-(--pv-on-primary)";
const chipIdle = "pv-act rounded-(--pv-r-ctrl) bg-(--pv-surface) px-4 py-2 text-[12px] font-bold text-(--pv-muted)";

const Title = ({ title, action, compact }: { title: string; action: string; compact: boolean }) => (
  <div className="mb-6 flex items-end justify-between">
    <h2 style={heading(compact ? 22 : 32)}>{title}</h2>
    <span className="text-[13px] font-bold text-(--pv-primary)">{action}</span>
  </div>
);

/** The section that makes each field look like itself: products, menu, courses, doctors, cases, work. */
export const IndustryShowcase = ({ config, compact }: { config: WizardConfig; compact: boolean }) => {
  const category = useSiteDemo((state) => state.category);
  const setDemo = useSiteDemo((state) => state.set);
  const addToCart = useSiteDemo((state) => state.addToCart);
  const shade = (amount: number) => mix(config.color, isDark(config.theme) ? "#0f151c" : "#ffffff", amount);
  const cols = compact ? "grid-cols-2" : "grid-cols-4";
  const pad = compact ? "px-5 py-10" : "px-20 py-16";

  const body = {
    shop: (
      <>
        <Title title="پرفروش‌ترین‌ها" action="همه محصولات" compact={compact} />
        <div className="mb-5 flex gap-2 overflow-hidden">
          {["همه", "پوشاک", "کیف و کفش", "اکسسوری", "تخفیف‌دار"].map((item, index) => (
            <button key={item} type="button" data-live onClick={() => setDemo({ category: index })} className={`shrink-0 transition-colors ${category === index ? chipActive : chipIdle}`}>{item}</button>
          ))}
        </div>
        <div className={`grid gap-4 ${cols}`}>
          {[["کیف دستی چرم", 890, 1150], ["کتانی سفید", 1240, 0], ["ساعت کلاسیک", 2390, 2800], ["شال پاییزه", 320, 0]].filter((_, index) => category === 0 || category === 4 ? true : index % 4 === (category % 4) || index === category).map(([name, price, old], index) => (
            <div key={name as string} className={tile}>
              <div className="relative aspect-square" style={{ backgroundColor: shade(0.2 + index * 0.14) }}>
                {old ? <span className="absolute right-3 top-3 rounded-(--pv-r-ctrl) bg-(--pv-primary) px-2 py-0.5 text-[11px] font-bold text-(--pv-on-primary)">تخفیف</span> : null}
              </div>
              <div className="flex items-end justify-between gap-2 p-4">
                <div>
                  <strong className="block text-[14px]">{name as string}</strong>
                  <span className="mt-1.5 flex items-center gap-2 text-[13px]">
                    <strong className="text-(--pv-primary)">{faNumber(price as number)}</strong>
                    {old ? <span className="text-[11px] text-(--pv-muted) line-through">{faNumber(old as number)}</span> : null}
                  </span>
                </div>
                <button type="button" data-live aria-label="افزودن به سبد" onClick={(event) => { event.stopPropagation(); addToCart(); }} className="flex size-9 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-soft) text-(--pv-primary) transition-transform active:scale-75">
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
    restaurant: (
      <>
        <Title title="منوی ما" action="منوی کامل" compact={compact} />
        <div className="mb-6 flex gap-2">
          {["غذای اصلی", "پیش‌غذا", "دسر", "نوشیدنی"].map((item, index) => (
            <span key={item} className={index === 0 ? chipActive : chipIdle}>{item}</span>
          ))}
        </div>
        <div className={`grid gap-x-12 gap-y-1 ${compact ? "" : "grid-cols-2"}`}>
          {[["کباب برگ", "با برنج ایرانی و گوجه کبابی", 420], ["جوجه‌کباب زعفرانی", "مرینیت ۲۴ ساعته", 360], ["خورش فسنجان", "گردوی تازه و مرغ", 340], ["ماهی قزل‌آلا", "سبزی‌پلو و لیمو", 390], ["زرشک‌پلو با مرغ", "زرشک و زعفران", 310], ["باقالی‌پلو با ماهیچه", "ماهیچه گوسفندی", 520]]
            .slice(0, compact ? 4 : 6)
            .map(([dish, note, price]) => (
              <div key={dish as string} className="flex items-center gap-4 border-b border-dashed border-(--pv-border) py-4">
                <span className="size-14 shrink-0 rounded-full" style={{ backgroundColor: shade(0.35) }} />
                <div className="flex-1">
                  <strong className="block text-[14px]">{dish as string}</strong>
                  <span className="text-[12px] text-(--pv-muted)">{note as string}</span>
                </div>
                <strong className="text-[15px] text-(--pv-primary)">{faNumber(price as number)}</strong>
              </div>
            ))}
        </div>
      </>
    ),
    education: (
      <>
        <Title title="دوره‌های محبوب" action="همه دوره‌ها" compact={compact} />
        <div className={`grid gap-4 ${compact ? "" : "grid-cols-3"}`}>
          {[["طراحی رابط کاربری از صفر", "مقدماتی", 24, "۱٬۸۰۰"], ["پایتون برای تحلیل داده", "متوسط", 36, "۲٬۴۰۰"], ["مکالمه انگلیسی کاربردی", "همه سطوح", 48, "۱٬۲۰۰"]]
            .slice(0, compact ? 2 : 3)
            .map(([course, level, lessons, price], index) => (
              <div key={course as string} className={tile}>
                <div className="relative aspect-[16/9]" style={{ backgroundColor: shade(0.25 + index * 0.18) }}>
                  <span className="absolute right-3 top-3 rounded-(--pv-r-ctrl) bg-(--pv-bg) px-2.5 py-1 text-[11px] font-bold">{level as string}</span>
                </div>
                <div className="p-5">
                  <strong className="block text-[15px]">{course as string}</strong>
                  <div className="mt-3 flex items-center gap-4 text-[12px] text-(--pv-muted)">
                    <span className="flex items-center gap-1"><Clock className="size-3.5" aria-hidden="true" />{faNumber(lessons as number)} جلسه</span>
                    <span className="flex items-center gap-1"><Star className="size-3.5 fill-(--pv-primary) text-(--pv-primary)" aria-hidden="true" />۴٫۸</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-(--pv-border) pt-4">
                    <strong className="text-[14px] text-(--pv-primary)">{price as string} <span className="text-[11px] font-normal text-(--pv-muted)">هزار تومان</span></strong>
                    <span className="rounded-(--pv-r-ctrl) bg-(--pv-soft) px-3 py-1.5 text-[12px] font-bold text-(--pv-primary)">ثبت‌نام</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </>
    ),
    health: (
      <>
        <Title title="پزشکان ما" action="همه پزشکان" compact={compact} />
        <div className={`grid gap-4 ${cols}`}>
          {[["دکتر سارا کریمی", "قلب و عروق"], ["دکتر علی احمدی", "پوست و مو"], ["دکتر مریم رضایی", "کودکان"], ["دکتر حسین نوری", "چشم‌پزشکی"]].map(([doctor, field], index) => (
            <div key={doctor} className={`${tile} p-5 text-center`}>
              <span className="mx-auto flex size-20 items-end justify-center overflow-hidden rounded-full" style={{ backgroundColor: shade(0.2 + index * 0.15) }}>
                <UserRound className="mb-[-12%] size-[85%] text-white/80" strokeWidth={1.2} aria-hidden="true" />
              </span>
              <strong className="mt-3 block text-[14px]">{doctor}</strong>
              <span className="text-[12px] text-(--pv-muted)">متخصص {field}</span>
              <span className="mt-4 flex h-10 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary) text-[12px] font-bold text-(--pv-on-primary)">دریافت نوبت</span>
            </div>
          ))}
        </div>
      </>
    ),
    company: (
      <>
        <Title title="پروژه‌های اخیر" action="همه پروژه‌ها" compact={compact} />
        <div className={`grid gap-4 ${compact ? "" : "grid-cols-3"}`}>
          {[["گروه صنعتی آریا", "سامانه فروش یکپارچه", "+۴۲٪ فروش"], ["بانک نوین", "بازطراحی تجربه مشتری", "+۳۰٪ رضایت"], ["پارس لجستیک", "داشبورد مدیریت ناوگان", "−۱۸٪ هزینه"]]
            .slice(0, compact ? 2 : 3)
            .map(([client, project, result], index) => (
              <div key={client} className={`${tile} p-6`}>
                <span className="flex size-12 items-center justify-center rounded-(--pv-r-ctrl) text-[15px] font-black" style={{ backgroundColor: shade(0.75 - index * 0.1), color: "var(--pv-primary)" }}>{client.charAt(0)}</span>
                <span className="mt-5 block text-[12px] text-(--pv-muted)">{client}</span>
                <strong className="mt-1 block text-[16px]">{project}</strong>
                <span className="mt-5 flex items-center gap-1.5 text-[14px] font-bold text-(--pv-primary)"><TrendingUp className="size-4" aria-hidden="true" />{result}</span>
              </div>
            ))}
        </div>
      </>
    ),
    personal: (
      <>
        <Title title="کارهای منتخب" action="همه کارها" compact={compact} />
        <div className={`grid gap-4 ${compact ? "" : "grid-cols-3"}`}>
          {[["اپلیکیشن بانکی", "طراحی محصول"], ["هویت بصری کافه", "برندینگ"], ["فروشگاه آنلاین", "طراحی وب"]].slice(0, compact ? 2 : 3).map(([project, tag], index) => (
            <div key={project}>
              <div className="aspect-[4/3] rounded-(--pv-r-card)" style={{ backgroundColor: index === 0 ? "var(--pv-primary)" : shade(0.3 + index * 0.2) }} />
              <div className="mt-3 flex items-center justify-between">
                <strong className="text-[15px]">{project}</strong>
                <span className="rounded-(--pv-r-ctrl) bg-(--pv-surface) px-2.5 py-1 text-[11px] text-(--pv-muted)">{tag}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  }[config.industry];

  return (
    <section data-pv="showcase" className={`pv-section ${pad}`}>
      {body}
    </section>
  );
};
