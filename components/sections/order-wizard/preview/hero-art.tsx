import {
  ArrowUpLeft,
  Award,
  Bike,
  Check,
  ChefHat,
  Dumbbell,
  Gift,
  Mail,
  MapPin,
  Phone,
  Pill,
  Quote,
  Shirt,
  Smartphone,
  Sofa,
  Sparkles,
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

import { industries, isDark, mix, type WizardConfig } from "../config";
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
  const shade = (amount: number) => mix(config.color, isDark(config.theme) ? "#0f151c" : "#ffffff", amount);
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

    /* ---------- company (more) ---------- */
    services: (
      <div className={`${frame} flex flex-col justify-center gap-3 bg-(--pv-soft) p-[8%]`}>
        {content.features.slice(0, 3).map((item, index) => (
          <div key={item.label} className={`${panel} flex items-center gap-3 p-3.5`} style={{ marginInlineEnd: `${index * 8}%` }}>
            <span className={`flex size-11 shrink-0 items-center justify-center rounded-(--pv-r-ctrl) ${index === 0 ? "bg-(--pv-primary) text-(--pv-on-primary)" : "bg-(--pv-soft) text-(--pv-primary)"}`}><item.icon className="size-5" aria-hidden="true" /></span>
            <div className="flex-1"><strong className="block text-[13px]">{item.label}</strong><span className="text-[11px] text-(--pv-muted)">مشاوره رایگان اولیه</span></div>
            <ArrowUpLeft className="size-4 text-(--pv-muted)" aria-hidden="true" />
          </div>
        ))}
      </div>
    ),
    quote: (
      <div className={`${frame} flex items-center justify-center bg-(--pv-primary) p-[8%]`}>
        <div className={`${panel} w-full p-[7%]`}>
          <Quote className="size-8 text-(--pv-primary)" aria-hidden="true" />
          <p className="mt-3 text-[15px] font-bold leading-8">همکاری با این تیم فروش ما را در شش ماه دو برابر کرد.</p>
          <div className="mt-4 flex items-center gap-3"><Avatar tone={shade(0.2)} /><div className="text-[12px]"><strong className="block">مهدی صالحی</strong><span className="text-(--pv-muted)">مدیرعامل گروه آریا</span></div></div>
        </div>
      </div>
    ),

    /* ---------- shop (more) ---------- */
    categories: (
      <div className={`${frame} grid grid-cols-3 content-center gap-x-3 gap-y-5 bg-(--pv-surface) p-[8%]`}>
        {[["مد و پوشاک", Shirt], ["دیجیتال", Smartphone], ["خانه", Sofa], ["زیبایی", Sparkles], ["ورزشی", Dumbbell], ["هدیه", Gift]].map(([label, CategoryIcon], index) => {
          const Glyph = CategoryIcon as typeof Shirt;
          return (
            <div key={label as string} className="flex flex-col items-center gap-2">
              <span className="flex aspect-square w-[72%] items-center justify-center rounded-full" style={{ backgroundColor: index === 0 ? "var(--pv-primary)" : shade(0.55 + (index % 3) * 0.1) }}>
                <Glyph className={`size-1/2 ${index === 0 ? "text-(--pv-on-primary)" : "text-(--pv-primary)"}`} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="text-[12px] font-bold">{label as string}</span>
            </div>
          );
        })}
      </div>
    ),
    deal: (
      <div className={`${frame} bg-(--pv-soft)`}>
        <div className={`absolute inset-[9%] ${panel} grid grid-cols-2 overflow-hidden`}>
          <div className="relative" style={{ backgroundColor: shade(0.3) }}>
            <ShoppingBag className="absolute left-1/2 top-1/2 size-1/3 -translate-x-1/2 -translate-y-1/2 text-(--pv-primary)" strokeWidth={1.2} aria-hidden="true" />
          </div>
          <div className="flex flex-col justify-center gap-3 p-[8%]">
            <span className="w-fit rounded-(--pv-r-ctrl) bg-(--pv-primary) px-2 py-0.5 text-[11px] font-bold text-(--pv-on-primary)">پیشنهاد شگفت‌انگیز</span>
            <strong className="text-[14px]">هدفون بی‌سیم</strong>
            <span className="text-[12px] text-(--pv-muted) line-through">۲٬۹۰۰</span>
            <strong className="text-[18px] text-(--pv-primary)">۱٬۹۹۰ <span className="text-[11px] font-normal">هزار تومان</span></strong>
            <div className="flex gap-1.5" dir="ltr">
              {["۰۲", "۱۴", "۳۸"].map((part) => (
                <span key={part} className="flex size-9 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-text) text-[13px] font-bold text-(--pv-bg)">{part}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),

    /* ---------- restaurant (more) ---------- */
    delivery: (
      <div className={`${frame} bg-(--pv-soft)`}>
        <svg viewBox="0 0 400 300" className="absolute inset-0 size-full opacity-60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M40 250 C 120 200, 160 260, 220 170 S 330 90, 360 50" fill="none" stroke="var(--pv-primary)" strokeWidth="4" strokeDasharray="10 10" strokeLinecap="round" />
        </svg>
        <span className="absolute right-[10%] top-[12%] flex size-12 items-center justify-center rounded-full bg-(--pv-primary) text-(--pv-on-primary) shadow-lg"><Icon className="size-6" aria-hidden="true" /></span>
        <Float className="bottom-[10%] left-[8%]">
          <div className={`${panel} w-56 p-3.5`}>
            <div className="flex items-center gap-2 text-[13px] font-bold"><Bike className="size-4 text-(--pv-primary)" aria-hidden="true" />سفارش در راه است</div>
            <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-(--pv-surface)"><span className="block h-full w-2/3 rounded-full bg-(--pv-primary)" /></span>
            <span className="mt-2 block text-[11px] text-(--pv-muted)">رسیدن تا ۱۲ دقیقه دیگر</span>
          </div>
        </Float>
      </div>
    ),
    chef: (
      <div className={`${frame} grid grid-cols-[1fr_1.2fr] gap-3`}>
        <div className="flex items-end justify-center overflow-hidden rounded-(--pv-r-card) bg-(--pv-primary)">
          <ChefHat className="mb-[10%] size-2/3 text-(--pv-on-primary) opacity-90" strokeWidth={1.1} aria-hidden="true" />
        </div>
        <div className="flex flex-col justify-center gap-3 rounded-(--pv-r-card) bg-(--pv-soft) p-[9%]">
          <span className="text-[12px] text-(--pv-muted)">سرآشپز</span>
          <strong className="text-[18px]">رضا موسوی</strong>
          <span className="flex gap-0.5 text-(--pv-primary)">{[0, 1, 2, 3, 4].map((star) => <Star key={star} className="size-3.5 fill-current" aria-hidden="true" />)}</span>
          <p className="text-[12px] leading-6 text-(--pv-muted)">۲۰ سال تجربه در آشپزی ایرانی و مدیترانه‌ای</p>
        </div>
      </div>
    ),

    /* ---------- education (more) ---------- */
    live: (
      <div className={`${frame} bg-(--pv-text) p-[5%]`}>
        <div className="relative h-full overflow-hidden rounded-(--pv-r-card)" style={{ backgroundColor: shade(0.35) }}>
          <UserRound className="absolute bottom-0 left-1/2 size-2/3 -translate-x-1/2 text-white/60" strokeWidth={1} aria-hidden="true" />
          <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-[#e5484d] px-2.5 py-1 text-[11px] font-bold text-white"><span className="size-1.5 rounded-full bg-white" />زنده</span>
          <div className="absolute bottom-3 left-3 flex gap-2">
            {[0.15, 0.5, 0.7].map((amount) => <span key={amount} className="size-12 rounded-(--pv-r-ctrl) ring-2 ring-white/70" style={{ backgroundColor: shade(amount) }} />)}
          </div>
          <span className="absolute bottom-3 right-3 rounded-(--pv-r-ctrl) bg-black/40 px-2.5 py-1 text-[11px] text-white">۲۴۸ نفر آنلاین</span>
        </div>
      </div>
    ),
    teacher: (
      <div className={`${frame} flex items-center justify-center bg-(--pv-soft)`}>
        <div className={`${panel} w-[70%] p-[6%] text-center`}>
          <span className="mx-auto flex size-20 items-end justify-center overflow-hidden rounded-full bg-(--pv-primary)"><UserRound className="mb-[-12%] size-[85%] text-(--pv-on-primary)" strokeWidth={1.2} aria-hidden="true" /></span>
          <strong className="mt-3 block text-[15px]">استاد نگار امینی</strong>
          <span className="text-[12px] text-(--pv-muted)">مدرس طراحی محصول</span>
          <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
            {[["۴٫۹", "امتیاز"], ["۱۲", "دوره"], ["۸هزار", "دانشجو"]].map(([value, label]) => (
              <span key={label} className="rounded-(--pv-r-ctrl) bg-(--pv-surface) py-2"><strong className="block text-[13px]">{value}</strong>{label}</span>
            ))}
          </div>
        </div>
      </div>
    ),

    /* ---------- health (more) ---------- */
    prescription: (
      <div className={`${frame} bg-(--pv-soft) p-[8%]`}>
        <div className={`h-full ${panel} p-[6%]`}>
          <div className="mb-3 flex items-center gap-2 text-[13px] font-bold"><Pill className="size-4 text-(--pv-primary)" aria-hidden="true" />داروهای امروز</div>
          {[["آموکسی‌سیلین", "۸:۰۰", true], ["ویتامین D", "۱۴:۰۰", true], ["امپرازول", "۲۰:۰۰", false]].map(([drug, time, done]) => (
            <div key={drug as string} className="flex items-center gap-3 border-b border-(--pv-border) py-2.5 text-[12px] last:border-0">
              <span className={`flex size-5 items-center justify-center rounded-full ${done ? "bg-(--pv-primary) text-(--pv-on-primary)" : "ring-2 ring-(--pv-border)"}`}>{done ? <Check className="size-3" strokeWidth={3} aria-hidden="true" /> : null}</span>
              <span className="flex-1">{drug as string}</span><strong>{time as string}</strong>
            </div>
          ))}
        </div>
      </div>
    ),
    clinic: (
      <div className={`${frame} bg-(--pv-surface)`}>
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-px opacity-40">{Array.from({ length: 24 }, (_, index) => <span key={index} style={{ backgroundColor: index % 5 === 0 ? shade(0.55) : shade(0.85) }} />)}</div>
        <span className="pv-float absolute left-[46%] top-[30%] flex size-12 items-center justify-center rounded-full bg-(--pv-primary) text-(--pv-on-primary) shadow-xl ring-4 ring-(--pv-bg)"><MapPin className="size-6" aria-hidden="true" /></span>
        <div className={`absolute bottom-[8%] right-[6%] ${panel} w-56 p-3.5`}>
          <strong className="text-[13px]">کلینیک {name}</strong>
          <span className="mt-1 block text-[11px] text-(--pv-muted)">تهران، خیابان ولیعصر</span>
          <div className="mt-2 flex gap-1.5">{["تأمین اجتماعی", "آزاد"].map((item) => <span key={item} className="rounded-(--pv-r-ctrl) bg-(--pv-soft) px-2 py-0.5 text-[10px] font-bold text-(--pv-primary)">{item}</span>)}</div>
        </div>
      </div>
    ),

    /* ---------- personal (more) ---------- */
    skills: (
      <div className={`${frame} flex flex-col justify-center gap-4 bg-(--pv-soft) px-[10%]`}>
        {[["طراحی رابط کاربری", 95], ["تحقیق کاربر", 80], ["برنامه‌نویسی فرانت", 70], ["برندینگ", 85]].map(([skill, value]) => (
          <div key={skill as string}>
            <div className="mb-1.5 flex justify-between text-[12px]"><strong>{skill as string}</strong><span className="text-(--pv-muted)">{(value as number).toLocaleString("fa-IR")}٪</span></div>
            <span className="block h-2 overflow-hidden rounded-full bg-(--pv-bg)"><span className="block h-full rounded-full bg-(--pv-primary)" style={{ width: `${value}%` }} /></span>
          </div>
        ))}
      </div>
    ),
    contact: (
      <div className={`${frame} flex items-center justify-center bg-(--pv-primary)`}>
        <div className={`${panel} w-[72%] p-[6%]`}>
          <strong className="text-[16px]">بیایید با هم کار کنیم</strong>
          {[[Mail, "hello@example.ir"], [Phone, "۰۹۱۲ ۳۴۵ ۶۷۸۹"], [MapPin, "تهران"]].map(([ContactIcon, value]) => {
            const Glyph = ContactIcon as typeof Mail;
            return (
              <div key={value as string} className="mt-3 flex items-center gap-3 text-[12px]">
                <span className="flex size-8 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-soft) text-(--pv-primary)"><Glyph className="size-4" aria-hidden="true" /></span>
                <span dir="auto">{value as string}</span>
              </div>
            );
          })}
        </div>
      </div>
    ),
  };

  return <>{pieces[art]}</>;
};
