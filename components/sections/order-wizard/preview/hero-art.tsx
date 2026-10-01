import {
  Award,
  BadgeCheck,
  CalendarDays,
  ChevronLeft,
  Clock,
  HeartPulse,
  Play,
  ShoppingBag,
  ShoppingCart,
  Star,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import { industries, mix, type WizardConfig } from "../config";
import type { HeroArtKey } from "../designs";

/* Shared bits ------------------------------------------------------- */

const panel = "rounded-(--pv-r-card) bg-(--pv-bg) shadow-[0_18px_40px_-18px_rgba(15,23,32,0.35)] ring-1 ring-(--pv-border)";
const chip = "flex items-center gap-2 rounded-(--pv-r-ctrl) bg-(--pv-bg) px-3 py-2 text-[12px] font-bold shadow-lg ring-1 ring-(--pv-border)";
const bar = (width: string, opacity = 0.8) => <span className="block h-2 rounded-full bg-(--pv-text)" style={{ width, opacity }} />;

const Float = ({ className = "", delay = 0, children }: { className?: string; delay?: number; children: ReactNode }) => (
  <div className={`pv-float absolute ${className}`} style={{ animationDelay: `${delay}s` }}>
    {children}
  </div>
);

const Avatar = ({ tone, size = "size-9" }: { tone: string; size?: string }) => (
  <span className={`flex ${size} shrink-0 items-center justify-center rounded-full ring-2 ring-(--pv-bg)`} style={{ backgroundColor: tone }}>
    <UserRound className="size-1/2 text-white/90" aria-hidden="true" />
  </span>
);

/* Art --------------------------------------------------------------- */

export const HeroArt = ({ art, config, tall }: { art: HeroArtKey; config: WizardConfig; tall?: boolean }) => {
  const content = industries[config.industry];
  const Icon = content.icon;
  const shade = (amount: number) => mix(config.color, config.theme === "dark" ? "#0f151c" : "#ffffff", amount);
  const name = config.brandName.trim() || "برند شما";
  const frame = `relative w-full overflow-hidden rounded-(--pv-r-card) ${tall ? "aspect-[4/3.4]" : "aspect-[16/7]"}`;

  const pieces: Record<HeroArtKey, ReactNode> = {
    /* ---------- company ---------- */
    dashboard: (
      <div className={`${frame} bg-(--pv-soft)`}>
        <div className={`absolute inset-x-[8%] top-[12%] bottom-[16%] ${panel} p-[5%]`}>
          <div className="flex items-center justify-between">
            <strong className="text-[13px]">رشد درآمد</strong>
            <span className="flex items-center gap-1 text-[12px] font-bold text-(--pv-primary)"><TrendingUp className="size-3.5" aria-hidden="true" />۲۴٪</span>
          </div>
          <div className="mt-[6%] flex h-[62%] items-end gap-[3%]">
            {[35, 50, 42, 66, 58, 80, 72, 95].map((height, index) => (
              <span key={index} className="flex-1 rounded-t-[4px]" style={{ height: `${height}%`, backgroundColor: index > 5 ? "var(--pv-primary)" : shade(0.55) }} />
            ))}
          </div>
        </div>
        <Float className="bottom-[8%] right-[4%]" delay={0.4}><span className={chip}><Users className="size-4 text-(--pv-primary)" aria-hidden="true" />۱۲۰ مشتری جدید</span></Float>
      </div>
    ),
    stats: (
      <div className={`${frame} grid grid-cols-2 gap-3`}>
        {content.stats.concat([["۲۴/۷", "پشتیبانی"]]).map(([value, label], index) => (
          <div key={label} className={`flex flex-col justify-end rounded-(--pv-r-card) p-[9%] ${index === 0 ? "bg-(--pv-primary) text-(--pv-on-primary)" : index === 3 ? "bg-(--pv-surface)" : "bg-(--pv-soft)"}`}>
            <span className="text-[34px] font-extrabold leading-none">{value}</span>
            <span className="mt-2 text-[13px] opacity-75">{label}</span>
          </div>
        ))}
      </div>
    ),
    logos: (
      <div className={`${frame} flex flex-col justify-center gap-4 bg-(--pv-surface) p-[8%]`}>
        <span className="text-[12px] font-bold text-(--pv-muted)">مورد اعتماد شرکت‌های بزرگ</span>
        <div className="grid grid-cols-3 gap-3">
          {["آریا", "پارس", "نوین", "سپهر", "آوا", "تیام"].map((brand, index) => (
            <span key={brand} className={`flex h-14 items-center justify-center gap-1.5 rounded-(--pv-r-ctrl) text-[14px] font-extrabold ${index === 1 ? "bg-(--pv-primary) text-(--pv-on-primary)" : "bg-(--pv-bg) text-(--pv-muted) ring-1 ring-(--pv-border)"}`}>
              <span className="size-2.5 rounded-full bg-current opacity-60" />{brand}
            </span>
          ))}
        </div>
      </div>
    ),
    team: (
      <div className={`${frame} bg-(--pv-soft)`}>
        <div className="absolute inset-0 grid grid-cols-3 gap-3 p-[8%]">
          {[0.2, 0.45, 0.65, 0.35, 0.55, 0.25].map((amount, index) => (
            <div key={index} className="flex flex-col items-center justify-end overflow-hidden rounded-(--pv-r-card)" style={{ backgroundColor: shade(amount) }}>
              <UserRound className="mb-[-8%] size-3/4 text-white/70" strokeWidth={1.2} aria-hidden="true" />
            </div>
          ))}
        </div>
        <Float className="bottom-[6%] left-[6%]"><span className={chip}><BadgeCheck className="size-4 text-(--pv-primary)" aria-hidden="true" />تیم ۳۰ نفره متخصص</span></Float>
      </div>
    ),

    /* ---------- shop ---------- */
    products: (
      <div className={`${frame} grid grid-cols-2 gap-3`}>
        {["کیف چرمی", "کفش راحتی", "ساعت مچی", "عینک آفتابی"].map((item, index) => (
          <div key={item} className="flex flex-col overflow-hidden rounded-(--pv-r-card) bg-(--pv-surface) ring-1 ring-(--pv-border)">
            <div className="relative flex-1" style={{ backgroundColor: shade(0.25 + index * 0.13) }}>
              {index === 0 && <span className="absolute right-2 top-2 rounded-(--pv-r-ctrl) bg-(--pv-primary) px-2 py-0.5 text-[11px] font-bold text-(--pv-on-primary)">۳۰٪-</span>}
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-[12px]">
              <strong>{item}</strong>
              <span className="font-bold text-(--pv-primary)">{["۸۹۰", "۱٬۲۰۰", "۲٬۴۰۰", "۶۵۰"][index]}</span>
            </div>
          </div>
        ))}
      </div>
    ),
    sale: (
      <div className={`${frame} flex items-center justify-center bg-(--pv-primary)`}>
        <span className="absolute -left-[10%] -top-[20%] size-[60%] rounded-full bg-white/10" />
        <span className="absolute -bottom-[25%] -right-[5%] size-[55%] rounded-full bg-black/10" />
        <div className="relative text-center text-(--pv-on-primary)">
          <span className="block text-[15px] font-bold opacity-80">حراج پاییزه</span>
          <span className="block text-[110px] font-black leading-none tracking-tight">۳۰٪</span>
          <span className="mt-3 inline-block rounded-(--pv-r-ctrl) bg-(--pv-bg) px-4 py-2 text-[13px] font-bold text-(--pv-text)">تا پایان هفته</span>
        </div>
      </div>
    ),
    showcase: (
      <div className={`${frame} bg-(--pv-soft)`}>
        <span className="absolute bottom-[12%] left-1/2 h-[14%] w-[62%] -translate-x-1/2 rounded-[50%]" style={{ backgroundColor: shade(0.5) }} />
        <div className="pv-float absolute bottom-[20%] left-1/2 flex size-[46%] -translate-x-1/2 items-center justify-center rounded-(--pv-r-card) bg-(--pv-primary) shadow-2xl">
          <ShoppingBag className="size-1/2 text-(--pv-on-primary)" strokeWidth={1.3} aria-hidden="true" />
        </div>
        <Float className="right-[7%] top-[10%]" delay={0.6}><span className={chip}><Star className="size-3.5 fill-(--pv-primary) text-(--pv-primary)" aria-hidden="true" />پرفروش‌ترین</span></Float>
        <Float className="left-[7%] top-[30%]" delay={1.2}><span className={chip}>۱٬۲۰۰ <span className="font-normal text-(--pv-muted)">هزار تومان</span></span></Float>
      </div>
    ),
    cart: (
      <div className={`${frame} bg-(--pv-surface)`}>
        <div className={`absolute right-[8%] top-[10%] w-[52%] ${panel} overflow-hidden`}>
          <div className="aspect-[4/3]" style={{ backgroundColor: shade(0.35) }} />
          <div className="space-y-2 p-4">{bar("80%")}{bar("45%", 0.4)}<span className="mt-2 flex h-9 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary) text-[12px] font-bold text-(--pv-on-primary)">افزودن به سبد</span></div>
        </div>
        <Float className="bottom-[10%] left-[8%]" delay={0.3}>
          <div className={`${panel} w-48 p-3`}>
            <div className="flex items-center gap-2 text-[12px] font-bold"><ShoppingCart className="size-4 text-(--pv-primary)" aria-hidden="true" />سبد خرید (۳)</div>
            <div className="mt-2 flex items-center justify-between text-[12px]"><span className="text-(--pv-muted)">جمع کل</span><strong>۳٬۸۴۰</strong></div>
          </div>
        </Float>
      </div>
    ),

    /* ---------- restaurant ---------- */
    menu: (
      <div className={`${frame} bg-(--pv-soft) p-[7%]`}>
        <div className={`h-full ${panel} p-[7%]`}>
          <div className="mb-3 flex items-center justify-between"><strong className="text-[15px]">منوی امروز</strong><span className="text-[11px] text-(--pv-muted)">پاییز ۱۴۰۵</span></div>
          {[["کباب برگ", "۴۲۰"], ["خورش فسنجان", "۳۴۰"], ["سالاد سزار", "۲۱۰"], ["چای و باقلوا", "۹۵"]].map(([dish, price]) => (
            <div key={dish} className="flex items-center gap-2 border-b border-dashed border-(--pv-border) py-2.5 text-[13px] last:border-0">
              <span className="size-2 rounded-full bg-(--pv-primary)" /><span className="flex-1">{dish}</span><strong>{price}</strong>
            </div>
          ))}
        </div>
      </div>
    ),
    plate: (
      <div className={`${frame} flex items-center justify-center bg-(--pv-surface)`}>
        <span className="absolute h-[78%] rounded-full" style={{ aspectRatio: 1, backgroundColor: shade(0.6) }} />
        <span className="absolute h-[62%] rounded-full bg-(--pv-bg) shadow-2xl" style={{ aspectRatio: 1 }} />
        <span className="absolute flex h-[40%] items-center justify-center rounded-full bg-(--pv-primary)" style={{ aspectRatio: 1 }}>
          <Icon className="size-1/2 text-(--pv-on-primary)" strokeWidth={1.4} aria-hidden="true" />
        </span>
        <Float className="right-[6%] top-[12%]" delay={0.5}><span className={chip}><Star className="size-3.5 fill-(--pv-primary) text-(--pv-primary)" aria-hidden="true" />پیشنهاد سرآشپز</span></Float>
      </div>
    ),
    reserve: (
      <div className={`${frame} bg-(--pv-primary) p-[8%]`}>
        <div className={`h-full ${panel} flex flex-col gap-3 p-[7%]`}>
          <strong className="text-[15px]">رزرو میز</strong>
          {[["تاریخ", "پنجشنبه ۱۰ مهر"], ["ساعت", "۲۰:۳۰"], ["تعداد نفرات", "۴ نفر"]].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-(--pv-r-ctrl) bg-(--pv-surface) px-3 py-2.5 text-[12px]"><span className="text-(--pv-muted)">{label}</span><strong>{value}</strong></div>
          ))}
          <span className="mt-auto flex h-10 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary) text-[13px] font-bold text-(--pv-on-primary)">تأیید رزرو</span>
        </div>
      </div>
    ),
    hours: (
      <div className={`${frame} bg-(--pv-soft)`}>
        <div className={`absolute inset-y-[12%] left-[8%] right-[30%] ${panel} p-[6%]`}>
          <div className="mb-3 flex items-center gap-2"><Clock className="size-4 text-(--pv-primary)" aria-hidden="true" /><strong className="text-[14px]">ساعت کاری</strong></div>
          {[["شنبه تا چهارشنبه", "۱۲ تا ۲۳"], ["پنجشنبه", "۱۲ تا ۲۴"], ["جمعه", "۱۸ تا ۲۴"]].map(([day, time]) => (
            <div key={day} className="flex justify-between py-2 text-[12px]"><span className="text-(--pv-muted)">{day}</span><strong>{time}</strong></div>
          ))}
        </div>
        <Float className="right-[6%] top-[20%]" delay={0.4}><span className="flex size-24 items-center justify-center rounded-full bg-(--pv-primary) text-center text-[13px] font-extrabold leading-5 text-(--pv-on-primary) shadow-xl">الان<br />باز است</span></Float>
      </div>
    ),

    /* ---------- education ---------- */
    courses: (
      <div className={`${frame} flex flex-col justify-center gap-3 bg-(--pv-soft) p-[7%]`}>
        {[["طراحی رابط کاربری", 72], ["برنامه‌نویسی پایتون", 45], ["زبان انگلیسی", 90]].map(([course, progress], index) => (
          <div key={course} className={`${panel} flex items-center gap-3 p-3`} style={{ marginInlineStart: `${index * 6}%` }}>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-(--pv-r-ctrl)" style={{ backgroundColor: index === 0 ? "var(--pv-primary)" : shade(0.4) }}><Play className="size-4 fill-white text-white" aria-hidden="true" /></span>
            <div className="flex-1">
              <strong className="text-[13px]">{course}</strong>
              <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-(--pv-surface)"><span className="block h-full rounded-full bg-(--pv-primary)" style={{ width: `${progress}%` }} /></span>
            </div>
          </div>
        ))}
      </div>
    ),
    progress: (
      <div className={`${frame} flex items-center justify-center bg-(--pv-surface)`}>
        <div className="relative h-[66%]" style={{ aspectRatio: 1 }}>
          <span className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(var(--pv-primary) 0 78%, ${shade(0.75)} 78% 100%)` }} />
          <span className="absolute inset-[12%] flex flex-col items-center justify-center rounded-full bg-(--pv-bg)">
            <span className="text-[44px] font-black leading-none text-(--pv-primary)">۷۸٪</span>
            <span className="mt-1 text-[12px] text-(--pv-muted)">پیشرفت دوره</span>
          </span>
        </div>
        <Float className="left-[6%] top-[14%]" delay={0.5}><span className={chip}><Award className="size-4 text-(--pv-primary)" aria-hidden="true" />۳ مدرک گرفته‌اید</span></Float>
      </div>
    ),
    schedule: (
      <div className={`${frame} bg-(--pv-soft) p-[7%]`}>
        <div className={`h-full ${panel} p-[5%]`}>
          <div className="mb-3 flex items-center gap-2 text-[13px] font-bold"><CalendarDays className="size-4 text-(--pv-primary)" aria-hidden="true" />برنامه هفتگی</div>
          <div className="grid h-[78%] grid-cols-5 gap-1.5">
            {Array.from({ length: 15 }, (_, index) => {
              const on = [1, 4, 7, 8, 12].includes(index);
              return <span key={index} className="rounded-[6px]" style={{ backgroundColor: on ? (index === 7 ? "var(--pv-primary)" : shade(0.5)) : "var(--pv-surface)" }} />;
            })}
          </div>
        </div>
      </div>
    ),
    certificate: (
      <div className={`${frame} flex items-center justify-center bg-(--pv-primary)`}>
        <div className="relative w-[74%] -rotate-3 rounded-(--pv-r-card) bg-(--pv-bg) p-[6%] text-center shadow-2xl">
          <span className="absolute inset-2 rounded-(--pv-r-card) border-2 border-dashed border-(--pv-border)" />
          <span className="text-[12px] text-(--pv-muted)">گواهی پایان دوره</span>
          <strong className="mt-2 block text-[18px]">{name}</strong>
          <span className="mx-auto mt-3 block w-2/3">{bar("100%", 0.25)}</span>
          <span className="absolute -bottom-5 left-[12%] flex size-14 items-center justify-center rounded-full bg-(--pv-primary) ring-4 ring-(--pv-bg)"><Award className="size-7 text-(--pv-on-primary)" aria-hidden="true" /></span>
        </div>
      </div>
    ),

    /* ---------- health ---------- */
    appointment: (
      <div className={`${frame} bg-(--pv-soft) p-[7%]`}>
        <div className={`h-full ${panel} flex flex-col p-[6%]`}>
          <div className="flex items-center gap-3"><Avatar tone={shade(0.15)} size="size-12" /><div><strong className="block text-[14px]">دکتر سارا کریمی</strong><span className="text-[12px] text-(--pv-muted)">متخصص قلب و عروق</span></div></div>
          <span className="mt-4 text-[12px] font-bold text-(--pv-muted)">نوبت‌های خالی امروز</span>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {["۹:۰۰", "۱۰:۳۰", "۱۲:۰۰", "۱۶:۰۰", "۱۷:۳۰", "۱۹:۰۰"].map((time, index) => (
              <span key={time} className={`flex h-9 items-center justify-center rounded-(--pv-r-ctrl) text-[12px] font-bold ${index === 1 ? "bg-(--pv-primary) text-(--pv-on-primary)" : "bg-(--pv-surface)"}`}>{time}</span>
            ))}
          </div>
        </div>
      </div>
    ),
    vitals: (
      <div className={`${frame} bg-(--pv-surface)`}>
        <div className={`absolute inset-x-[8%] top-[16%] ${panel} p-[5%]`}>
          <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[13px] font-bold"><HeartPulse className="size-4 text-(--pv-primary)" aria-hidden="true" />ضربان قلب</span><strong className="text-[20px]">۷۲</strong></div>
          <svg viewBox="0 0 300 70" className="mt-3 h-20 w-full" aria-hidden="true">
            <polyline points="0,40 60,40 80,40 95,12 110,62 125,30 140,40 200,40 215,20 228,55 240,40 300,40" fill="none" stroke="var(--pv-primary)" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>
        <Float className="bottom-[10%] right-[8%]" delay={0.5}><span className={chip}><BadgeCheck className="size-4 text-(--pv-primary)" aria-hidden="true" />وضعیت عالی</span></Float>
      </div>
    ),
    doctors: (
      <div className={`${frame} grid grid-cols-2 gap-3`}>
        {[["دکتر کریمی", "قلب"], ["دکتر احمدی", "پوست"], ["دکتر رضایی", "اطفال"], ["دکتر نوری", "چشم"]].map(([doctor, field], index) => (
          <div key={doctor} className={`flex flex-col items-center justify-center gap-2 rounded-(--pv-r-card) ${index === 0 ? "bg-(--pv-primary) text-(--pv-on-primary)" : "bg-(--pv-soft)"}`}>
            <Avatar tone={index === 0 ? "rgba(255,255,255,0.25)" : shade(0.3)} size="size-14" />
            <strong className="text-[13px]">{doctor}</strong>
            <span className="text-[11px] opacity-70">متخصص {field}</span>
          </div>
        ))}
      </div>
    ),
    calendar: (
      <div className={`${frame} bg-(--pv-soft) p-[7%]`}>
        <div className={`h-full ${panel} p-[5%]`}>
          <div className="mb-3 flex items-center justify-between text-[13px] font-bold">مهر ۱۴۰۵<ChevronLeft className="size-4 text-(--pv-muted)" aria-hidden="true" /></div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px]">
            {Array.from({ length: 28 }, (_, index) => (
              <span key={index} className={`flex aspect-square items-center justify-center rounded-full ${index === 9 ? "bg-(--pv-primary) font-bold text-(--pv-on-primary)" : [3, 16, 22].includes(index) ? "bg-(--pv-soft) font-bold text-(--pv-primary)" : ""}`}>
                {(index + 1).toLocaleString("fa-IR")}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),

    /* ---------- personal ---------- */
    portrait: (
      <div className={`${frame} flex items-center justify-center bg-(--pv-soft)`}>
        <span className="absolute h-[84%] rounded-full border-2 border-dashed border-(--pv-primary) opacity-40" style={{ aspectRatio: 1 }} />
        <span className="relative flex h-[66%] items-end justify-center overflow-hidden rounded-full bg-(--pv-primary)" style={{ aspectRatio: 1 }}>
          <UserRound className="mb-[-10%] size-[85%] text-(--pv-on-primary) opacity-80" strokeWidth={1.1} aria-hidden="true" />
        </span>
        <Float className="right-[8%] top-[14%]" delay={0.3}><span className={chip}>👋 سلام، من {name}م</span></Float>
        <Float className="bottom-[12%] left-[8%]" delay={0.9}><span className={chip}><Star className="size-3.5 fill-(--pv-primary) text-(--pv-primary)" aria-hidden="true" />۷ سال تجربه</span></Float>
      </div>
    ),
    monogram: (
      <div className={`${frame} flex items-center justify-center bg-(--pv-text)`}>
        <span className="text-[200px] font-black leading-none text-(--pv-primary)">{name.charAt(0)}</span>
        <span className="absolute bottom-[10%] right-[8%] text-[13px] font-bold text-(--pv-bg) opacity-70">طراح محصول · تهران</span>
      </div>
    ),
    projects: (
      <div className={`${frame} grid grid-cols-3 grid-rows-2 gap-3`}>
        {["اپ بانکی", "فروشگاه", "برندینگ", "داشبورد", "وب‌سایت"].map((project, index) => (
          <div key={project} className={`flex items-end rounded-(--pv-r-card) p-3 ${index === 0 ? "col-span-2" : ""}`} style={{ backgroundColor: index === 0 ? "var(--pv-primary)" : shade(0.25 + index * 0.12) }}>
            <span className={`rounded-(--pv-r-ctrl) px-2 py-1 text-[11px] font-bold ${index === 0 ? "bg-(--pv-bg) text-(--pv-text)" : "bg-white/70 text-[#16202a]"}`}>{project}</span>
          </div>
        ))}
      </div>
    ),
    timeline: (
      <div className={`${frame} flex flex-col justify-center bg-(--pv-soft) px-[10%]`}>
        {[["۱۴۰۵", "مدیر طراحی محصول"], ["۱۴۰۲", "طراح ارشد"], ["۱۴۰۰", "شروع کار مستقل"]].map(([year, role], index) => (
          <div key={year} className="relative flex items-center gap-4 pb-6 last:pb-0">
            {index < 2 && <span className="absolute right-[7px] top-4 h-full w-0.5 bg-(--pv-border)" />}
            <span className={`relative size-4 shrink-0 rounded-full ring-4 ring-(--pv-soft) ${index === 0 ? "bg-(--pv-primary)" : "bg-(--pv-muted)"}`} />
            <div className={`${panel} flex flex-1 items-center justify-between px-4 py-3`}><strong className="text-[13px]">{role}</strong><span className="text-[12px] text-(--pv-muted)">{year}</span></div>
          </div>
        ))}
      </div>
    ),

    /* ---------- generic ---------- */
    orbs: (
      <div className={`${frame} bg-(--pv-soft)`}>
        <div className="absolute -bottom-[18%] -left-[10%] size-[62%] rounded-full bg-(--pv-primary) opacity-90" />
        <div className="absolute -right-[6%] -top-[14%] size-[44%] rounded-full opacity-60" style={{ backgroundColor: mix(config.color, "#ffffff", 0.45) }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="pv-float flex size-[30%] max-h-40 max-w-40 items-center justify-center rounded-(--pv-r-card) bg-(--pv-bg) shadow-2xl">
            <Icon className="size-1/2 text-(--pv-primary)" strokeWidth={1.6} aria-hidden="true" />
          </span>
        </div>
        <Float className="bottom-[10%] right-[8%]" delay={0.6}><span className={chip}><Star className="size-3.5 fill-(--pv-primary) text-(--pv-primary)" aria-hidden="true" />۴٫۹ از ۵</span></Float>
      </div>
    ),
    mosaic: (
      <div className={`${frame} grid grid-cols-3 grid-rows-3 gap-2.5`}>
        <div className="col-span-2 row-span-2 flex items-center justify-center rounded-(--pv-r-card) bg-(--pv-primary)">
          <Icon className="size-1/3 text-(--pv-on-primary)" strokeWidth={1.4} aria-hidden="true" />
        </div>
        {[0.55, 0.3, 0.75, 0.45, 0.2].map((amount, index) => (
          <div key={index} className="rounded-(--pv-r-card)" style={{ backgroundColor: shade(amount) }} />
        ))}
      </div>
    ),
    rings: (
      <div className={`${frame} bg-(--pv-soft)`}>
        {[92, 70, 48].map((size) => (
          <span key={size} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-(--pv-primary)" style={{ width: `${size}%`, aspectRatio: "1", opacity: 0.18 + (92 - size) / 160 }} />
        ))}
        <span className="absolute left-1/2 top-1/2 flex size-[26%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-(--pv-primary)">
          <Icon className="size-1/2 text-(--pv-on-primary)" strokeWidth={1.6} aria-hidden="true" />
        </span>
        {content.features.slice(0, 2).map((item, index) => (
          <Float key={item.label} delay={index * 0.7} className={index === 0 ? "right-[6%] top-[14%]" : "bottom-[14%] left-[6%]"}>
            <span className={chip}><item.icon className="size-3.5 text-(--pv-primary)" aria-hidden="true" /> {item.label}</span>
          </Float>
        ))}
      </div>
    ),
    stack: (
      <div className={`${frame} flex items-center justify-center bg-(--pv-surface)`}>
        <div className="absolute h-[62%] w-[52%] -rotate-[9deg] rounded-(--pv-r-card)" style={{ backgroundColor: shade(0.55) }} />
        <div className="absolute h-[62%] w-[52%] rotate-[6deg] rounded-(--pv-r-card)" style={{ backgroundColor: shade(0.25) }} />
        <div className="relative flex h-[62%] w-[52%] flex-col justify-between rounded-(--pv-r-card) bg-(--pv-bg) p-[6%] shadow-2xl">
          <span className="flex size-[28%] items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary)"><Icon className="size-1/2 text-(--pv-on-primary)" aria-hidden="true" /></span>
          <div className="space-y-2">{bar("80%")}{bar("50%", 0.4)}</div>
        </div>
      </div>
    ),
    bars: (
      <div className={`${frame} flex items-end justify-center gap-[4%] bg-(--pv-soft) px-[10%] pt-[18%]`}>
        {[0.45, 0.7, 0.55, 0.95, 0.75].map((height, index) => (
          <div key={index} className="relative flex-1 rounded-t-(--pv-r-card)" style={{ height: `${height * 100}%`, backgroundColor: index === 3 ? "var(--pv-primary)" : shade(0.35 + index * 0.08) }}>
            {index === 3 && (
              <span className="pv-float absolute -top-[18%] left-1/2 flex aspect-square w-[150%] -translate-x-1/2 items-center justify-center rounded-full bg-(--pv-bg) shadow-xl">
                <Icon className="size-1/2 text-(--pv-primary)" aria-hidden="true" />
              </span>
            )}
          </div>
        ))}
      </div>
    ),
    frame: (
      <div className={`${frame} p-[7%]`}>
        <div className="absolute inset-[7%] translate-x-[4%] translate-y-[5%] rounded-(--pv-r-card) border-2 border-(--pv-primary)" />
        <div className="relative flex size-full items-center justify-center rounded-(--pv-r-card)" style={{ backgroundColor: shade(0.3) }}>
          <Icon className="size-1/4 text-(--pv-primary)" strokeWidth={1.3} aria-hidden="true" />
          <span className="absolute -bottom-3 right-[8%] rounded-(--pv-r-ctrl) bg-(--pv-primary) px-3 py-1.5 text-[12px] font-bold text-(--pv-on-primary) shadow-lg">{content.features[0].label}</span>
        </div>
      </div>
    ),
  };

  return <>{pieces[art]}</>;
};
