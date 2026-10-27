import { tx } from "@/lib/tx";
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
  dashboard: tx("داشبورد رشد"), services: tx("خدمات"), stats: tx("آمار"), logos: tx("مشتریان"), quote: tx("نظر مشتری"), team: tx("تیم"),
  products: tx("محصولات"), categories: tx("دسته‌بندی"), sale: tx("حراج"), showcase: tx("محصول ویژه"), deal: tx("پیشنهاد ویژه"), cart: tx("سبد خرید"),
  menu: tx("منو"), plate: tx("غذای ویژه"), reserve: tx("رزرو میز"), delivery: tx("پیک"), chef: tx("سرآشپز"), hours: tx("ساعت کاری"),
  courses: tx("دوره‌ها"), live: tx("کلاس زنده"), progress: tx("پیشرفت"), teacher: tx("استاد"), schedule: tx("برنامه"), certificate: tx("گواهی"),
  appointment: tx("نوبت‌دهی"), doctors: tx("پزشکان"), vitals: tx("سلامت"), clinic: tx("نقشه کلینیک"), calendar: tx("تقویم"), prescription: tx("داروها"),
  portrait: tx("پرتره"), projects: tx("نمونه‌کار"), monogram: tx("حرف اول"), skills: tx("مهارت‌ها"), timeline: tx("مسیر کاری"), contact: tx("تماس"),
};

export const siteLayouts = [
  { value: "split", label: tx("کلاسیک") },
  { value: "bento", label: tx("بنتو") },
  { value: "editorial", label: tx("مجله‌ای") },
  { value: "glass", label: tx("شیشه‌ای") },
  { value: "stack3d", label: tx("سه‌بعدی") },
  { value: "marquee", label: tx("نوار متحرک") },
  { value: "media", label: tx("قاب بزرگ") },
  { value: "centered", label: tx("وسط‌چین") },
  { value: "mirror", label: tx("برعکس") },
  { value: "fullbleed", label: tx("تمام‌رنگ") },
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
