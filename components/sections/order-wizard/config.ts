import {
  Award,
  Bell,
  Briefcase,
  Building2,
  CalendarCheck,
  ChartColumn,
  ChefHat,
  CircleHelp,
  CirclePlay,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  Headset,
  HeartPulse,
  Images,
  Lightbulb,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquareQuote,
  Newspaper,
  PartyPopper,
  Pill,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Stethoscope,
  Truck,
  UserRound,
  UtensilsCrossed,
  Video,
  Wallet,
  Bike,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type OrderKind = "site" | "app";
export type IndustryKey = "shop" | "company" | "restaurant" | "education" | "health" | "personal";
export type ThemeKey = "light" | "tinted" | "dark" | "midnight";
export type RadiusKey = "sharp" | "soft" | "round" | "pill";
export type BackdropKey = "plain" | "aurora" | "grid" | "dots" | "glow";
export type TypeKey = "light" | "balanced" | "heavy";
export type PreviewTarget = "top" | "hero" | "features" | string;

export type WizardConfig = {
  brandName: string;
  tagline: string;
  industry: IndustryKey;
  color: string;
  /** Second brand colour, used in gradients, highlights and badges. */
  accent: string;
  backdrop: BackdropKey;
  theme: ThemeKey;
  radius: RadiusKey;
  type: TypeKey;
  sections: string[];
  references: string[];
  notes: string;
  projectType: ProjectType;
  deliverable: Deliverable;
  /* app studio */
  platform: Platform;
  appNav: AppNav;
  screens: string[];
  iconStyle: IconStyle;
  contactName: string;
  contactPhone: string;
  /** Hero layout number (see designs.ts). */
  variant: number;
  /** Which of the field's artworks the hero shows. */
  art: number;
  motion: MotionKey;
  extras: string[];
};

export type MotionKey = "none" | "subtle" | "snappy" | "lively";
export type ProjectType = "site" | "landing" | "store" | "booking" | "community" | "dashboard";
export type Deliverable = "figma" | "build";
export type Platform = "ios" | "android" | "both" | "pwa";
export type AppNav = "tabs" | "floating" | "drawer" | "top";
export type IconStyle = "gradient" | "solid" | "glyph" | "duo";

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

export type StepKey = "palette" | "radius" | "type" | "backdrop" | "business" | "design" | "sections" | "extras" | "references" | "outcome" | "platform" | "navigation" | "screens" | "icon";

/** Small to big: colours and shapes first, then the business, then the whole page. */
export type StepDef = { key: StepKey; title: string; question: (kind: OrderKind) => string; hint: string; target: PreviewTarget };

export const siteSteps: StepDef[] = [
  { key: "palette", title: "پالت رنگ", question: () => "پالت رنگی خودتان را بسازید", hint: "رنگ اصلی، رنگ دوم و فضای کلی. هر رنگی بخواهید می‌توانید انتخاب کنید.", target: "hero" },
  { key: "radius", title: "گوشه‌ها", question: () => "گوشه‌های رابط کاربری چطور باشد؟", hint: "هر کارت یک رابط کامل با همان گوشه‌هاست؛ نتیجه روی کل طرح هم دیده می‌شود.", target: "showcase" },
  { key: "type", title: "نوشته‌ها", question: () => "نوشته‌ها چه شخصیتی داشته باشند؟", hint: "وزن و اندازه تیترها حس برند را عوض می‌کند.", target: "hero" },
  { key: "backdrop", title: "پس‌زمینه و حرکت", question: () => "پس‌زمینه و حرکت صفحه چطور باشد؟", hint: "از ساده تا شفق رنگی و درخشش؛ حرکت را هم همین‌جا تعیین کنید.", target: "hero" },
  { key: "business", title: "کسب‌وکار", question: () => "چه چیزی می‌سازیم و برای چه کسب‌وکاری؟", hint: "نوع پروژه ساختار را تعیین می‌کند؛ حوزه کاری، متن‌ها و تصویرها را.", target: "top" },
  { key: "design", title: "چیدمان", question: () => "کدام چیدمان را می‌پسندید؟", hint: "حالا همه انتخاب‌هایتان را در چیدمان‌های کامل ببینید.", target: "top" },
  { key: "sections", title: "بخش‌ها", question: () => "چه بخش‌ها و ماژول‌هایی لازم دارید؟", hint: "هر گزینه را بزنید تا جایش را در پیش‌نمایش ببینید.", target: "features" },
  { key: "extras", title: "امکانات فنی", question: () => "چه امکانات فنی لازم دارید؟", hint: "بعضی امکانات پشت صحنه کار می‌کنند و در پیش‌نمایش دیده نمی‌شوند؛ کنارشان علامت زده‌ایم.", target: "top" },
  { key: "references", title: "الهام", question: () => "از کدام سایت‌ها یا اپ‌ها خوشتان می‌آید؟", hint: "لینک چند نمونه را بگذارید تا طراح دقیق‌تر سلیقه‌تان را بشناسد.", target: "top" },
  { key: "outcome", title: "سفارش", question: () => "چه چیزی برایتان آماده کنیم؟", hint: "طرح فیگما برای دیدن و نظر دادن، یا ساخت کامل و تحویل نهایی. برآورد بر اساس انتخاب‌های شماست.", target: "top" },
];

/** The app studio has its own path: platform, navigation, screens and the app icon. */
export const appSteps: StepDef[] = [
  { key: "platform", title: "پلتفرم", question: () => "اپلیکیشن روی چه دستگاه‌هایی اجرا شود؟", hint: "آیفون، اندروید، هر دو، یا وب‌اپ که بدون نصب از مرورگر باز می‌شود.", target: "top" },
  { key: "palette", title: "پالت رنگ", question: () => "پالت رنگی اپ را بسازید", hint: "رنگ اصلی، رنگ دوم و فضای کلی؛ هر رنگی بخواهید.", target: "top" },
  { key: "radius", title: "گوشه‌ها", question: () => "گوشه‌های رابط کاربری چطور باشد؟", hint: "هر کارت یک رابط کامل با همان گوشه‌هاست.", target: "top" },
  { key: "type", title: "نوشته‌ها", question: () => "نوشته‌ها چه شخصیتی داشته باشند؟", hint: "وزن و اندازه تیترها حس برند را عوض می‌کند.", target: "top" },
  { key: "business", title: "کسب‌وکار", question: () => "چه اپی می‌سازیم و برای چه کسب‌وکاری؟", hint: "نوع اپ صفحه‌ها را تعیین می‌کند؛ حوزه کاری، متن‌ها و تصویرها را.", target: "top" },
  { key: "navigation", title: "ناوبری", question: () => "کاربر چطور بین صفحه‌ها جابه‌جا شود؟", hint: "روی گوشی پیش‌نمایش بزنید و جابه‌جا شوید؛ کاملاً کار می‌کند.", target: "top" },
  { key: "screens", title: "صفحه‌ها", question: () => "اپ چه صفحه‌هایی داشته باشد؟", hint: "هر صفحه را روشن کنید تا به اپ اضافه شود؛ روی هر کدام بزنید تا همان را ببینید.", target: "top" },
  { key: "icon", title: "آیکون", question: () => "آیکون اپ روی صفحه گوشی چطور باشد؟", hint: "روی آیکون در صفحه گوشی بزنید تا اپ مثل واقعی باز شود.", target: "top" },
  { key: "extras", title: "امکانات", question: () => "چه امکانات فنی لازم دارید؟", hint: "بعضی امکانات پشت صحنه کار می‌کنند و در پیش‌نمایش دیده نمی‌شوند.", target: "top" },
  { key: "outcome", title: "سفارش", question: () => "چه چیزی برایتان آماده کنیم؟", hint: "طرح فیگما برای دیدن و نظر دادن، یا ساخت کامل و انتشار در فروشگاه‌ها.", target: "top" },
];

export const getSteps = (kind: OrderKind) => (kind === "app" ? appSteps : siteSteps);

/* ------------------------------------------------------------------ */
/* Industries — drive the preview copy                                 */
/* ------------------------------------------------------------------ */

export type IndustryContent = {
  label: string;
  icon: LucideIcon;
  headline: string;
  sub: string;
  cta: string;
  badge: string;
  stats: [string, string][];
  features: { label: string; icon: LucideIcon }[];
};

export const industries: Record<IndustryKey, IndustryContent> = {
  shop: {
    label: "فروشگاه",
    icon: ShoppingBag,
    headline: "خرید آسان، تحویل همان روز",
    sub: "محصولات منتخب با ضمانت اصالت و ارسال به سراسر کشور",
    cta: "مشاهده محصولات",
    badge: "تخفیف فصل تا ۳۰٪",
    stats: [["۲۰هزار+", "مشتری راضی"], ["۲۴ ساعته", "ارسال سریع"], ["۷ روز", "ضمانت بازگشت"]],
    features: [
      { label: "ارسال رایگان", icon: Truck },
      { label: "ضمانت بازگشت", icon: ShieldCheck },
      { label: "پرداخت امن", icon: Lock },
      { label: "پشتیبانی همیشگی", icon: Headset },
    ],
  },
  company: {
    label: "شرکتی",
    icon: Building2,
    headline: "راهکارهایی که کسب‌وکار شما را جلو می‌برد",
    sub: "از مشاوره تا اجرا، کنار تیم شما هستیم",
    cta: "درخواست مشاوره",
    badge: "بیش از ۱۲۰ پروژه موفق",
    stats: [["۱۲۰+", "پروژه موفق"], ["۹۸٪", "رضایت مشتری"], ["۱۵ سال", "تجربه"]],
    features: [
      { label: "مشاوره تخصصی", icon: Lightbulb },
      { label: "اجرای پروژه", icon: Rocket },
      { label: "پشتیبانی فنی", icon: Briefcase },
      { label: "گزارش ماهانه", icon: ChartColumn },
    ],
  },
  restaurant: {
    label: "رستوران و کافه",
    icon: UtensilsCrossed,
    headline: "طعمی که دوباره برمی‌گردید",
    sub: "منوی فصلی، رزرو آنلاین میز و سفارش بیرون‌بر",
    cta: "رزرو میز",
    badge: "منوی پاییزی رسید",
    stats: [["۴۰+", "غذای منو"], ["۱۲", "سرآشپز"], ["۴٫۹", "امتیاز مهمانان"]],
    features: [
      { label: "منوی روز", icon: ChefHat },
      { label: "رزرو آنلاین", icon: CalendarCheck },
      { label: "بیرون‌بر", icon: Bike },
      { label: "جشن و مراسم", icon: PartyPopper },
    ],
  },
  education: {
    label: "آموزشی",
    icon: GraduationCap,
    headline: "یادگیری در هر زمان و هر مکان",
    sub: "دوره‌های کاربردی با استادهای باتجربه و مدرک معتبر",
    cta: "شروع یادگیری",
    badge: "ثبت‌نام ترم جدید باز است",
    stats: [["۸۵", "دوره فعال"], ["۳۰هزار", "دانشجو"], ["۹۲٪", "رضایت"]],
    features: [
      { label: "دوره ویدیویی", icon: CirclePlay },
      { label: "کلاس زنده", icon: Video },
      { label: "آزمون آنلاین", icon: ClipboardCheck },
      { label: "مدرک پایان دوره", icon: Award },
    ],
  },
  health: {
    label: "سلامت و درمان",
    icon: Stethoscope,
    headline: "مراقبت از شما، بدون صف و انتظار",
    sub: "نوبت‌دهی آنلاین و مشاوره با پزشکان متخصص",
    cta: "رزرو نوبت",
    badge: "مشاوره تصویری فعال شد",
    stats: [["۶۰+", "پزشک متخصص"], ["۲۴/۷", "پاسخگویی"], ["۱۰۰هزار", "نوبت موفق"]],
    features: [
      { label: "نوبت آنلاین", icon: CalendarCheck },
      { label: "مشاوره تصویری", icon: Video },
      { label: "پرونده سلامت", icon: HeartPulse },
      { label: "یادآور دارو", icon: Pill },
    ],
  },
  personal: {
    label: "شخصی و پورتفولیو",
    icon: UserRound,
    headline: "ایده‌ها را به محصول تبدیل می‌کنم",
    sub: "طراح و توسعه‌دهنده محصولات دیجیتال",
    cta: "دیدن نمونه‌کارها",
    badge: "پذیرش پروژه جدید",
    stats: [["۷ سال", "تجربه"], ["۵۰+", "پروژه"], ["۲۵", "مشتری"]],
    features: [
      { label: "نمونه‌کارها", icon: Images },
      { label: "خدمات", icon: Briefcase },
      { label: "رزومه", icon: FileText },
      { label: "تماس", icon: Mail },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Visual options                                                      */
/* ------------------------------------------------------------------ */

export const colors = [
  { value: "#078ef0", label: "آبی" },
  { value: "#4f46e5", label: "نیلی" },
  { value: "#7c3aed", label: "بنفش" },
  { value: "#e5486f", label: "سرخابی" },
  { value: "#ef7d3c", label: "نارنجی" },
  { value: "#b08a3e", label: "طلایی" },
  { value: "#16a37a", label: "سبز" },
  { value: "#0f172a", label: "سرمه‌ای" },
];

export const themes: { value: ThemeKey; label: string }[] = [
  { value: "light", label: "روشن" },
  { value: "tinted", label: "رنگی" },
  { value: "dark", label: "تیره" },
  { value: "midnight", label: "نیمه‌شب" },
];

export const radii: { value: RadiusKey; label: string; description: string }[] = [
  { value: "sharp", label: "تیز", description: "رسمی و دقیق" },
  { value: "soft", label: "نرم", description: "متعادل و آشنا" },
  { value: "round", label: "گرد", description: "صمیمی و مدرن" },
  { value: "pill", label: "کپسولی", description: "بازیگوش و نرم" },
];

export const typeStyles: { value: TypeKey; label: string; sample: string }[] = [
  { value: "light", label: "ظریف", sample: "سبک و باوقار" },
  { value: "balanced", label: "متعادل", sample: "خوانا و آشنا" },
  { value: "heavy", label: "درشت و پررنگ", sample: "جسور و دیده‌شدنی" },
];

export const backdrops: { value: BackdropKey; label: string }[] = [
  { value: "plain", label: "ساده" },
  { value: "aurora", label: "شفق رنگی" },
  { value: "glow", label: "درخشش" },
  { value: "grid", label: "خطوط شبکه" },
  { value: "dots", label: "نقطه‌ها" },
];

export const siteSections: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "features", label: "خدمات و ویژگی‌ها", icon: Lightbulb },
  { value: "gallery", label: "گالری و نمونه‌کار", icon: Images },
  { value: "testimonials", label: "نظر مشتریان", icon: MessageSquareQuote },
  { value: "pricing", label: "تعرفه‌ها", icon: CreditCard },
  { value: "faq", label: "سوالات متداول", icon: CircleHelp },
  { value: "blog", label: "وبلاگ", icon: Newspaper },
  { value: "contact", label: "فرم تماس", icon: Mail },
];

export const appFeatures: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "search", label: "جستجو", icon: Search },
  { value: "cart", label: "سبد خرید", icon: ShoppingCart },
  { value: "booking", label: "رزرو و نوبت", icon: CalendarCheck },
  { value: "chat", label: "گفتگو", icon: MessageCircle },
  { value: "notifications", label: "اعلان‌ها", icon: Bell },
  { value: "wallet", label: "کیف پول", icon: Wallet },
  { value: "map", label: "نقشه و آدرس", icon: MapPin },
];

export const getDefaultConfig = (kind: OrderKind): WizardConfig => ({
  brandName: "",
  tagline: "",
  industry: "shop",
  color: "#078ef0",
  accent: "#7c3aed",
  theme: "light",
  radius: "round",
  type: "balanced",
  backdrop: "aurora",
  art: 0,
  sections: kind === "app" ? ["search", "cart", "notifications"] : ["features", "testimonials", "contact"],
  references: ["", "", ""],
  projectType: kind === "app" ? "store" : "site",
  deliverable: "build",
  platform: "both",
  appNav: "tabs",
  screens: defaultScreens("store"),
  iconStyle: "gradient",
  contactName: "",
  contactPhone: "",
  notes: "",
  variant: 0,
  motion: "subtle",
  extras: kind === "app" ? ["otp", "push"] : ["seo", "admin"],
});

/* ------------------------------------------------------------------ */
/* Theme builder — every visual choice becomes a CSS variable           */
/* ------------------------------------------------------------------ */

const hexToRgb = (hex: string) => {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16));
};

const rgbToHex = (rgb: number[]) => `#${rgb.map((part) => Math.round(part).toString(16).padStart(2, "0")).join("")}`;

/** Blend `hex` toward `target` by `amount` (0 = hex, 1 = target). */
export const mix = (hex: string, target: string, amount: number) => {
  const from = hexToRgb(hex);
  const to = hexToRgb(target);
  return rgbToHex(from.map((part, index) => part + (to[index] - part) * amount));
};

const luminance = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map((part) => {
    const channel = part / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const buildPreviewVars = (config: Pick<WizardConfig, "color" | "accent" | "theme" | "radius" | "type">): CSSProperties => {
  const primary = config.color;
  const accent = config.accent;
  const onPrimary = luminance(primary) > 0.45 ? "#111827" : "#ffffff";

  const surfaces = {
    light: { bg: "#ffffff", surface: "#f5f7f8", text: "#16202a", muted: "#6b7780", border: "#e6eaec", soft: mix(primary, "#ffffff", 0.87) },
    tinted: { bg: mix(primary, "#ffffff", 0.93), surface: "#ffffff", text: "#16202a", muted: "#5f6b73", border: mix(primary, "#ffffff", 0.8), soft: mix(primary, "#ffffff", 0.82) },
    dark: { bg: "#0f151c", surface: "#18212b", text: "#eef2f5", muted: "#93a0aa", border: "#27323d", soft: mix(primary, "#0f151c", 0.72) },
    midnight: { bg: "#06070d", surface: "#10121c", text: "#f1f2f7", muted: "#8d93a8", border: "#1d2133", soft: mix(primary, "#06070d", 0.66) },
  }[config.theme];

  const radius = {
    sharp: { card: "3px", control: "3px" },
    soft: { card: "12px", control: "9px" },
    round: { card: "22px", control: "14px" },
    pill: { card: "30px", control: "999px" },
  }[config.radius];

  const type = {
    light: { weight: 300, scale: 0.96, tracking: "0em" },
    balanced: { weight: 700, scale: 1, tracking: "-0.01em" },
    heavy: { weight: 800, scale: 1.14, tracking: "-0.03em" },
  }[config.type];

  return {
    "--pv-primary": primary,
    "--pv-on-primary": onPrimary,
    "--pv-accent": accent,
    "--pv-soft": surfaces.soft,
    "--pv-bg": surfaces.bg,
    "--pv-surface": surfaces.surface,
    "--pv-text": surfaces.text,
    "--pv-muted": surfaces.muted,
    "--pv-border": surfaces.border,
    "--pv-r-card": radius.card,
    "--pv-r-ctrl": radius.control,
    "--pv-hw": type.weight,
    "--pv-hs": type.scale,
    "--pv-ht": type.tracking,
  } as CSSProperties;
};

export const faNumber = (value: number) => new Intl.NumberFormat("fa-IR").format(value);

/* ------------------------------------------------------------------ */
/* Technical extras                                                    */
/* ------------------------------------------------------------------ */

export const motionLevels: { value: MotionKey; label: string; description: string }[] = [
  { value: "none", label: "بدون حرکت", description: "ساکن و سریع" },
  { value: "subtle", label: "نرم", description: "ظاهر شدن آرام" },
  { value: "snappy", label: "سریع و دقیق", description: "پرشی و چابک" },
  { value: "lively", label: "پرجنب‌وجوش", description: "شناور و زنده" },
];

/** `visible` extras show up in the preview; the rest work behind the scenes. */
export const siteExtras: { value: string; label: string; description: string; icon: LucideIcon; visible: boolean }[] = [
  { value: "seo", label: "سئو", description: "دیده شدن در نتایج گوگل", icon: Search, visible: false },
  { value: "admin", label: "پنل مدیریت", description: "ویرایش محتوا بدون برنامه‌نویس", icon: Briefcase, visible: false },
  { value: "multilang", label: "چندزبانه", description: "نسخه انگلیسی و عربی", icon: Newspaper, visible: true },
  { value: "chat", label: "چت آنلاین", description: "گفتگو با بازدیدکننده‌ها", icon: MessageCircle, visible: true },
  { value: "darkmode", label: "حالت شب", description: "دکمه تغییر روشن و تیره", icon: Lightbulb, visible: true },
  { value: "payment", label: "پرداخت آنلاین", description: "درگاه بانکی امن", icon: CreditCard, visible: false },
  { value: "analytics", label: "آمار بازدید", description: "گزارش رفتار کاربران", icon: ChartColumn, visible: false },
];

export const appExtras: { value: string; label: string; description: string; icon: LucideIcon; visible: boolean }[] = [
  { value: "otp", label: "ورود با شماره", description: "کد یک‌بارمصرف پیامکی", icon: Lock, visible: false },
  { value: "push", label: "نوتیفیکیشن", description: "پیام روی صفحه گوشی", icon: Bell, visible: true },
  { value: "payment", label: "پرداخت درون‌برنامه", description: "درگاه بانکی امن", icon: CreditCard, visible: false },
  { value: "offline", label: "حالت آفلاین", description: "کار بدون اینترنت", icon: ShieldCheck, visible: false },
  { value: "multilang", label: "چندزبانه", description: "نسخه انگلیسی و عربی", icon: Newspaper, visible: false },
  { value: "admin", label: "پنل مدیریت", description: "مدیریت کاربران و محتوا", icon: Briefcase, visible: false },
];

/* ------------------------------------------------------------------ */
/* Palette helpers                                                     */
/* ------------------------------------------------------------------ */

const toHsl = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map((part) => part / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  if (max === min) return [0, 0, lightness];
  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  const hue = max === r ? (g - b) / delta + (g < b ? 6 : 0) : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  return [hue * 60, saturation, lightness];
};

const fromHsl = (hue: number, saturation: number, lightness: number) => {
  const k = (n: number) => (n + hue / 30) % 12;
  const a = saturation * Math.min(lightness, 1 - lightness);
  const f = (n: number) => lightness - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex([f(0) * 255, f(8) * 255, f(4) * 255]);
};

/** Accent suggestions that harmonise with the primary: analogous, triadic and complementary. */
export const suggestAccents = (primary: string) => {
  const [hue, saturation, lightness] = toHsl(primary);
  const sat = Math.max(saturation, 0.55);
  const light = Math.min(Math.max(lightness, 0.45), 0.6);
  return [
    { value: fromHsl((hue + 40) % 360, sat, light), label: "هم‌خانواده" },
    { value: fromHsl((hue + 120) % 360, sat, light), label: "سه‌گانه" },
    { value: fromHsl((hue + 180) % 360, sat, light), label: "مکمل" },
    { value: fromHsl((hue + 320) % 360, sat, light), label: "گرم" },
  ];
};

export const isDark = (theme: ThemeKey) => theme === "dark" || theme === "midnight";

/* ------------------------------------------------------------------ */
/* Project types, modules, estimate                                    */
/* ------------------------------------------------------------------ */

export const projectTypes: { value: ProjectType; label: string; description: string; icon: LucideIcon; forApp: boolean }[] = [
  { value: "site", label: "سایت معرفی", description: "معرفی کسب‌وکار و خدمات", icon: Building2, forApp: false },
  { value: "landing", label: "صفحه کمپین", description: "یک صفحه برای فروش یا ثبت‌نام", icon: Rocket, forApp: false },
  { value: "store", label: "فروشگاه آنلاین", description: "محصول، سبد خرید، پرداخت", icon: ShoppingBag, forApp: true },
  { value: "booking", label: "رزرو و نوبت‌دهی", description: "تقویم، زمان خالی، یادآور", icon: CalendarCheck, forApp: true },
  { value: "community", label: "پلتفرم جامعه", description: "پروفایل، پست، گفتگو، گروه", icon: MessageCircle, forApp: true },
  { value: "dashboard", label: "پنل و اتوماسیون داخلی", description: "گزارش، فرم، گردش کار، نقش‌ها", icon: ChartColumn, forApp: true },
];

/** Modules offered in the sections step, per project type (site/landing/store/booking reuse page sections). */
export const dashboardModules: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "reports", label: "گزارش و نمودار", icon: ChartColumn },
  { value: "users", label: "کاربران و نقش‌ها", icon: UserRound },
  { value: "forms", label: "فرم‌ساز", icon: ClipboardCheck },
  { value: "workflow", label: "گردش کار و تأیید", icon: Rocket },
  { value: "tickets", label: "تیکت و پشتیبانی", icon: Headset },
  { value: "inventory", label: "انبار و موجودی", icon: Briefcase },
  { value: "crm", label: "مدیریت مشتری", icon: Award },
  { value: "invoices", label: "فاکتور و مالی", icon: FileText },
];

export const communityModules: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "feed", label: "فید و پست", icon: Newspaper },
  { value: "profiles", label: "پروفایل اعضا", icon: UserRound },
  { value: "groups", label: "گروه‌ها", icon: PartyPopper },
  { value: "messages", label: "گفتگوی خصوصی", icon: MessageCircle },
  { value: "events", label: "رویدادها", icon: CalendarCheck },
  { value: "badges", label: "امتیاز و نشان", icon: Award },
  { value: "moderation", label: "مدیریت محتوا", icon: ShieldCheck },
];

export const defaultSections = (kind: OrderKind, type: ProjectType): string[] => {
  if (kind === "app") return type === "community" ? ["chat", "notifications", "search"] : type === "dashboard" ? ["notifications", "search"] : ["search", "cart", "notifications"];
  if (type === "dashboard") return ["reports", "users", "forms", "workflow"];
  if (type === "community") return ["feed", "profiles", "groups", "messages"];
  if (type === "landing") return ["features", "testimonials", "faq"];
  return ["features", "testimonials", "contact"];
};

export const sectionOptions = (kind: OrderKind, type: ProjectType) =>
  kind === "app" ? appFeatures : type === "dashboard" ? dashboardModules : type === "community" ? communityModules : siteSections;

/**
 * A rough first estimate shown to the customer. Numbers are placeholders in million tomans;
 * tune `base`, `perSection`, `extraCost` to your real price list.
 */
const base: Record<ProjectType, [number, number, number]> = {
  landing: [12, 20, 2],
  site: [25, 40, 3],
  store: [45, 75, 5],
  booking: [40, 65, 5],
  community: [80, 140, 8],
  dashboard: [90, 170, 9],
};
const perSection = 2;
const extraCost: Record<string, number> = { payment: 8, multilang: 6, chat: 4, analytics: 3, admin: 5, seo: 3, darkmode: 2, otp: 4, push: 3, offline: 6 };

export const estimate = (kind: OrderKind, config: WizardConfig) => {
  if (config.deliverable === "figma") return { min: 6, max: 10, weeks: 1 };
  const [low, high, weeks] = base[config.projectType];
  const extras = config.extras.reduce((sum, item) => sum + (extraCost[item] ?? 3), 0);
  const sections = (kind === "app" ? config.screens.length * 3 : config.sections.length * perSection);
  const factor = kind === "app" ? { ios: 1.4, android: 1.4, both: 1.7, pwa: 1.15 }[config.platform] : 1;
  return {
    min: Math.round((low + sections + extras) * factor),
    max: Math.round((high + sections + extras * 1.3) * factor),
    weeks: Math.round((weeks + config.extras.length * 0.5 + config.sections.length * 0.3) * (kind === "app" ? 1.4 : 1)),
  };
};

/* ------------------------------------------------------------------ */
/* App studio options                                                  */
/* ------------------------------------------------------------------ */

export const platforms: { value: Platform; label: string; description: string }[] = [
  { value: "ios", label: "آیفون", description: "App Store" },
  { value: "android", label: "اندروید", description: "Google Play، کافه‌بازار، مایکت" },
  { value: "both", label: "هر دو", description: "یک کد، دو فروشگاه" },
  { value: "pwa", label: "وب‌اپ", description: "بدون نصب، از مرورگر" },
];

export const appNavs: { value: AppNav; label: string; description: string }[] = [
  { value: "tabs", label: "نوار پایین", description: "رایج و آشنا" },
  { value: "floating", label: "نوار شناور", description: "مدرن و سبک" },
  { value: "drawer", label: "منوی کشویی", description: "برای صفحه‌های زیاد" },
  { value: "top", label: "تب بالا", description: "برای محتوای دسته‌بندی‌شده" },
];

export const appScreens: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "home", label: "خانه", icon: Lightbulb },
  { value: "catalog", label: "فهرست و جستجو", icon: Search },
  { value: "detail", label: "صفحه جزئیات", icon: FileText },
  { value: "cart", label: "سبد و پرداخت", icon: ShoppingCart },
  { value: "booking", label: "رزرو و نوبت", icon: CalendarCheck },
  { value: "chat", label: "گفتگو", icon: MessageCircle },
  { value: "notifications", label: "اعلان‌ها", icon: Bell },
  { value: "profile", label: "پروفایل", icon: UserRound },
];

export function defaultScreens(type: ProjectType): string[] {
  if (type === "booking") return ["home", "booking", "notifications", "profile"];
  if (type === "community") return ["home", "chat", "notifications", "profile"];
  if (type === "dashboard") return ["home", "catalog", "notifications", "profile"];
  return ["home", "catalog", "detail", "cart", "profile"];
}

export const iconStyles: { value: IconStyle; label: string }[] = [
  { value: "gradient", label: "گرادیان" },
  { value: "solid", label: "تک‌رنگ" },
  { value: "glyph", label: "روشن" },
  { value: "duo", label: "دو رنگ" },
];
