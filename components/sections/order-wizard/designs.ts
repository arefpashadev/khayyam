import type { IndustryKey } from "./config";

/**
 * Design catalogue.
 *
 * Site: 10 hero layouts, each a genuinely different page structure (bento grids, editorial
 * type, glass panels, 3D stacks, marquees…). The hero shows one of the field's 6 own artworks.
 * App: 3 home layouts × 5 banner styles with alternating tab bars = 15 designs.
 */

export type HeroArtKey =
  | "dashboard" | "stats" | "logos" | "team" | "services" | "quote"
  | "products" | "sale" | "showcase" | "cart" | "categories" | "deal"
  | "menu" | "plate" | "reserve" | "hours" | "delivery" | "chef"
  | "courses" | "progress" | "schedule" | "certificate" | "live" | "teacher"
  | "appointment" | "vitals" | "doctors" | "calendar" | "prescription" | "clinic"
  | "portrait" | "monogram" | "projects" | "timeline" | "skills" | "contact";

export const industryArts: Record<IndustryKey, HeroArtKey[]> = {
  company: ["dashboard", "services", "stats", "logos", "quote", "team"],
  shop: ["products", "categories", "sale", "showcase", "deal", "cart"],
  restaurant: ["menu", "plate", "reserve", "delivery", "chef", "hours"],
  education: ["courses", "live", "progress", "teacher", "schedule", "certificate"],
  health: ["appointment", "doctors", "vitals", "clinic", "calendar", "prescription"],
  personal: ["portrait", "projects", "monogram", "skills", "timeline", "contact"],
};

export const artLabels: Record<HeroArtKey, string> = {
  dashboard: "داشبورد رشد", services: "خدمات", stats: "آمار", logos: "مشتریان", quote: "نظر مشتری", team: "تیم",
  products: "محصولات", categories: "دسته‌بندی", sale: "حراج", showcase: "محصول ویژه", deal: "پیشنهاد ویژه", cart: "سبد خرید",
  menu: "منو", plate: "غذای ویژه", reserve: "رزرو میز", delivery: "پیک", chef: "سرآشپز", hours: "ساعت کاری",
  courses: "دوره‌ها", live: "کلاس زنده", progress: "پیشرفت", teacher: "استاد", schedule: "برنامه", certificate: "گواهی",
  appointment: "نوبت‌دهی", doctors: "پزشکان", vitals: "سلامت", clinic: "نقشه کلینیک", calendar: "تقویم", prescription: "داروها",
  portrait: "پرتره", projects: "نمونه‌کار", monogram: "حرف اول", skills: "مهارت‌ها", timeline: "مسیر کاری", contact: "تماس",
};

export const siteLayouts = [
  { value: "split", label: "کلاسیک" },
  { value: "bento", label: "بنتو" },
  { value: "editorial", label: "مجله‌ای" },
  { value: "glass", label: "شیشه‌ای" },
  { value: "stack3d", label: "سه‌بعدی" },
  { value: "marquee", label: "نوار متحرک" },
  { value: "media", label: "قاب بزرگ" },
  { value: "centered", label: "وسط‌چین" },
  { value: "mirror", label: "برعکس" },
  { value: "fullbleed", label: "تمام‌رنگ" },
] as const;

export type SiteLayout = (typeof siteLayouts)[number]["value"];

export type SiteDesign = {
  layout: SiteLayout;
  art: HeroArtKey;
  nav: "classic" | "centered" | "floating";
  cards: "outlined" | "filled" | "numbered";
};

const navFor: Record<SiteLayout, SiteDesign["nav"]> = {
  split: "classic", bento: "floating", editorial: "classic", glass: "floating", stack3d: "centered",
  marquee: "centered", media: "floating", centered: "centered", mirror: "classic", fullbleed: "classic",
};
const cardsFor: Record<SiteLayout, SiteDesign["cards"]> = {
  split: "outlined", bento: "filled", editorial: "numbered", glass: "filled", stack3d: "outlined",
  marquee: "numbered", media: "filled", centered: "outlined", mirror: "numbered", fullbleed: "filled",
};

export const SITE_DESIGN_COUNT = siteLayouts.length;

const wrap = (value: number, size: number) => ((value % size) + size) % size;

export const getSiteDesign = (industry: IndustryKey, variant: number, art: number): SiteDesign => {
  const layout = siteLayouts[wrap(variant, SITE_DESIGN_COUNT)].value;
  const arts = industryArts[industry];
  return { layout, art: arts[wrap(art, arts.length)], nav: navFor[layout], cards: cardsFor[layout] };
};

export const appLayouts = ["cards", "list", "feed"] as const;
export const appBanners = ["solid", "art", "stats", "search", "greeting"] as const;
export const appTabBars = ["classic", "floating"] as const;

export type AppDesign = {
  layout: (typeof appLayouts)[number];
  banner: (typeof appBanners)[number];
  tabBar: (typeof appTabBars)[number];
};

export const APP_DESIGN_COUNT = appLayouts.length * appBanners.length;

export const getAppDesign = (variant: number): AppDesign => {
  const index = wrap(variant, APP_DESIGN_COUNT);
  return {
    banner: appBanners[index % appBanners.length],
    layout: appLayouts[Math.floor(index / appBanners.length) % appLayouts.length],
    tabBar: appTabBars[index % appTabBars.length],
  };
};
