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
export type MoodKey = "tech" | "minimal" | "friendly" | "luxury" | "bold";
export type ThemeKey = "light" | "tinted" | "dark";
export type RadiusKey = "sharp" | "soft" | "round";
export type TypeKey = "light" | "balanced" | "heavy";
export type SiteLayout = "split" | "centered" | "fullbleed";
export type AppLayout = "cards" | "list" | "feed";
export type LayoutKey = SiteLayout | AppLayout;
export type PreviewTarget = "top" | "hero" | "features" | string;

export type WizardConfig = {
  brandName: string;
  industry: IndustryKey;
  mood: MoodKey | null;
  color: string;
  theme: ThemeKey;
  radius: RadiusKey;
  type: TypeKey;
  layout: LayoutKey;
  sections: string[];
  references: string[];
  notes: string;
};

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

export type StepKey = "brand" | "mood" | "color" | "shape" | "layout" | "sections" | "references";

export const steps: { key: StepKey; title: string; question: (kind: OrderKind) => string; hint: string; target: PreviewTarget }[] = [
  { key: "brand", title: "کسب‌وکار", question: () => "اسم برندتان چیست و در چه حوزه‌ای کار می‌کنید؟", hint: "متن‌ها و آیکون‌های پیش‌نمایش بر اساس حوزه شما عوض می‌شوند.", target: "top" },
  { key: "mood", title: "حس کلی", question: (kind) => `${kind === "app" ? "اپلیکیشن" : "سایت"} شما چه حسی داشته باشد؟`, hint: "یک نقطه شروع انتخاب کنید؛ در مرحله‌های بعد جزئیاتش را تغییر می‌دهید.", target: "hero" },
  { key: "color", title: "رنگ", question: () => "رنگ اصلی و حالت نمایش را انتخاب کنید", hint: "رنگ اصلی روی دکمه‌ها، آیکون‌ها و بخش‌های مهم می‌نشیند.", target: "hero" },
  { key: "shape", title: "فرم و نوشتار", question: () => "گوشه‌ها و نوشته‌ها چطور باشند؟", hint: "گوشه‌های گرد صمیمی‌ترند، گوشه‌های تیز رسمی‌تر.", target: "features" },
  { key: "layout", title: "چیدمان", question: (kind) => (kind === "app" ? "صفحه اصلی اپ چطور چیده شود؟" : "بخش اول سایت چطور چیده شود؟"), hint: "اولین چیزی که کاربر می‌بیند همین بخش است.", target: "hero" },
  { key: "sections", title: "امکانات", question: (kind) => (kind === "app" ? "اپ شما چه امکاناتی لازم دارد؟" : "سایت شما چه بخش‌هایی داشته باشد؟"), hint: "هر گزینه را بزنید تا جایش را در پیش‌نمایش ببینید.", target: "features" },
  { key: "references", title: "الهام", question: () => "از کدام سایت‌ها یا اپ‌ها خوشتان می‌آید؟", hint: "لینک چند نمونه را بگذارید تا طراح دقیق‌تر سلیقه‌تان را بشناسد.", target: "top" },
];

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
  { value: "#334155", label: "زغالی" },
];

export const themes: { value: ThemeKey; label: string }[] = [
  { value: "light", label: "روشن" },
  { value: "tinted", label: "رنگی ملایم" },
  { value: "dark", label: "تیره" },
];

export const radii: { value: RadiusKey; label: string }[] = [
  { value: "sharp", label: "تیز" },
  { value: "soft", label: "نرم" },
  { value: "round", label: "گرد" },
];

export const typeStyles: { value: TypeKey; label: string; sample: string }[] = [
  { value: "light", label: "ظریف", sample: "سبک و باوقار" },
  { value: "balanced", label: "متعادل", sample: "خوانا و آشنا" },
  { value: "heavy", label: "درشت و پررنگ", sample: "جسور و دیده‌شدنی" },
];

export const moods: { value: MoodKey; label: string; description: string; tokens: Pick<WizardConfig, "color" | "theme" | "radius" | "type"> }[] = [
  { value: "tech", label: "فناوری و اعتماد", description: "تمیز، دقیق، قابل اعتماد", tokens: { color: "#078ef0", theme: "light", radius: "soft", type: "balanced" } },
  { value: "minimal", label: "مینیمال و آرام", description: "فضای خالی زیاد، بی‌حاشیه", tokens: { color: "#334155", theme: "light", radius: "sharp", type: "light" } },
  { value: "friendly", label: "صمیمی و گرم", description: "گرد، رنگی، خودمانی", tokens: { color: "#ef7d3c", theme: "tinted", radius: "round", type: "balanced" } },
  { value: "luxury", label: "لوکس و باوقار", description: "تیره، طلایی، کم‌حرف", tokens: { color: "#b08a3e", theme: "dark", radius: "sharp", type: "light" } },
  { value: "bold", label: "پرانرژی و جسور", description: "نوشته‌های درشت، رنگ تند", tokens: { color: "#e5486f", theme: "light", radius: "round", type: "heavy" } },
];

export const siteLayouts: { value: SiteLayout; label: string }[] = [
  { value: "split", label: "متن کنار تصویر" },
  { value: "centered", label: "وسط‌چین" },
  { value: "fullbleed", label: "تصویر تمام‌عرض" },
];

export const appLayouts: { value: AppLayout; label: string }[] = [
  { value: "cards", label: "کارتی" },
  { value: "list", label: "فهرستی" },
  { value: "feed", label: "فید و استوری" },
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
  industry: "shop",
  mood: "tech",
  ...moods[0].tokens,
  layout: kind === "app" ? "cards" : "split",
  sections: kind === "app" ? ["search", "cart", "notifications"] : ["features", "testimonials", "contact"],
  references: ["", "", ""],
  notes: "",
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

export const buildPreviewVars = (config: Pick<WizardConfig, "color" | "theme" | "radius" | "type">): CSSProperties => {
  const primary = config.color;
  const onPrimary = luminance(primary) > 0.45 ? "#111827" : "#ffffff";

  const surfaces = {
    light: { bg: "#ffffff", surface: "#f5f7f8", text: "#16202a", muted: "#6b7780", border: "#e6eaec", soft: mix(primary, "#ffffff", 0.87) },
    tinted: { bg: mix(primary, "#ffffff", 0.93), surface: "#ffffff", text: "#16202a", muted: "#5f6b73", border: mix(primary, "#ffffff", 0.8), soft: mix(primary, "#ffffff", 0.82) },
    dark: { bg: "#0f151c", surface: "#18212b", text: "#eef2f5", muted: "#93a0aa", border: "#27323d", soft: mix(primary, "#0f151c", 0.72) },
  }[config.theme];

  const radius = { sharp: { card: "4px", control: "3px" }, soft: { card: "14px", control: "10px" }, round: { card: "26px", control: "999px" } }[config.radius];

  const type = {
    light: { weight: 300, scale: 0.96, tracking: "0em" },
    balanced: { weight: 700, scale: 1, tracking: "-0.01em" },
    heavy: { weight: 800, scale: 1.14, tracking: "-0.03em" },
  }[config.type];

  return {
    "--pv-primary": primary,
    "--pv-on-primary": onPrimary,
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
