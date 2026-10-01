import type { IndustryKey } from "./config";

/**
 * Design catalogue.
 *
 * Site: every field has 6 artworks of its own; each is shown in 5 hero compositions,
 * giving 30 designs that belong only to that field. Navigation, social-proof row,
 * background pattern and card style rotate with the design number so neighbours differ.
 *
 * App: 3 home layouts × 5 banner styles × 2 tab bars = 30 designs.
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

export const compositions = ["split", "mirror", "centered", "fullbleed", "editorial"] as const;
export const navStyles = ["classic", "centered", "floating"] as const;
export const proofStyles = ["rating", "stats", "none"] as const;
export const cardStyles = ["outlined", "filled", "numbered"] as const;

export type SiteDesign = {
  art: HeroArtKey;
  composition: (typeof compositions)[number];
  nav: (typeof navStyles)[number];
  proof: (typeof proofStyles)[number];
  cards: (typeof cardStyles)[number];
  pattern: boolean;
};

export const DESIGN_COUNT = 30;

const wrap = (variant: number) => ((variant % DESIGN_COUNT) + DESIGN_COUNT) % DESIGN_COUNT;

export const getSiteDesign = (industry: IndustryKey, variant: number): SiteDesign => {
  const index = wrap(variant);
  const arts = industryArts[industry];
  const art = index % arts.length;
  // Shift the composition by the artwork so the first row of the gallery already mixes layouts;
  // every artwork still appears in all five compositions exactly once.
  const composition = (Math.floor(index / arts.length) + art) % compositions.length;
  return {
    art: arts[art],
    composition: compositions[composition],
    nav: navStyles[(art + composition) % navStyles.length],
    proof: proofStyles[(art * 2 + composition) % proofStyles.length],
    cards: cardStyles[(art + composition * 2) % cardStyles.length],
    pattern: (art + composition) % 2 === 1,
  };
};

export const appLayouts = ["cards", "list", "feed"] as const;
export const appBanners = ["solid", "art", "stats", "search", "greeting"] as const;
export const appTabBars = ["classic", "floating"] as const;

export type AppDesign = {
  layout: (typeof appLayouts)[number];
  banner: (typeof appBanners)[number];
  tabBar: (typeof appTabBars)[number];
};

export const getAppDesign = (variant: number): AppDesign => {
  const index = wrap(variant);
  return {
    banner: appBanners[index % appBanners.length],
    layout: appLayouts[Math.floor(index / appBanners.length) % appLayouts.length],
    tabBar: appTabBars[Math.floor(index / (appBanners.length * appLayouts.length)) % appTabBars.length],
  };
};
