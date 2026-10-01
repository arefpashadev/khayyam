import type { IndustryKey } from "./config";

/**
 * A "design" is one combination of hero artwork, navigation, social-proof row,
 * background pattern and card style. Each industry gets its own artworks first,
 * so a company sees dashboards and client logos, a café sees menus and plates, and so on.
 */

export type GenericArt = "orbs" | "mosaic" | "rings" | "stack" | "bars" | "frame";
export type IndustryArt =
  | "dashboard" | "stats" | "logos" | "team"
  | "products" | "sale" | "showcase" | "cart"
  | "menu" | "plate" | "reserve" | "hours"
  | "courses" | "progress" | "schedule" | "certificate"
  | "appointment" | "vitals" | "doctors" | "calendar"
  | "portrait" | "monogram" | "projects" | "timeline";
export type HeroArtKey = GenericArt | IndustryArt;

export const industryArts: Record<IndustryKey, IndustryArt[]> = {
  company: ["dashboard", "stats", "logos", "team"],
  shop: ["products", "sale", "showcase", "cart"],
  restaurant: ["menu", "plate", "reserve", "hours"],
  education: ["courses", "progress", "schedule", "certificate"],
  health: ["appointment", "vitals", "doctors", "calendar"],
  personal: ["portrait", "monogram", "projects", "timeline"],
};

const genericArts: GenericArt[] = ["orbs", "mosaic", "rings", "stack", "bars", "frame"];

export const navStyles = ["classic", "centered", "floating"] as const;
export const proofStyles = ["rating", "stats", "none"] as const;
export const cardStyles = ["outlined", "filled", "numbered"] as const;

export type Design = {
  art: HeroArtKey;
  nav: (typeof navStyles)[number];
  proof: (typeof proofStyles)[number];
  cards: (typeof cardStyles)[number];
  pattern: boolean;
};

export const getArts = (industry: IndustryKey): HeroArtKey[] => [...industryArts[industry], ...genericArts];

/** 10 artworks × 3 navs × 3 proof rows × pattern on/off = 180 designs per industry. */
export const getDesignCount = (industry: IndustryKey) => getArts(industry).length * navStyles.length * proofStyles.length * 2;

/** Mixed-radix decode. Art changes fastest so neighbours in the picker look clearly different. */
export const getDesign = (industry: IndustryKey, variant: number): Design => {
  const arts = getArts(industry);
  const count = getDesignCount(industry);
  const index = ((variant % count) + count) % count;
  const artIndex = index % arts.length;
  const navIndex = Math.floor(index / arts.length) % navStyles.length;
  const proofIndex = Math.floor(index / (arts.length * navStyles.length)) % proofStyles.length;
  return {
    art: arts[artIndex],
    nav: navStyles[navIndex],
    proof: proofStyles[proofIndex],
    // Card style isn't visible in thumbnails, so derive it instead of multiplying the list.
    cards: cardStyles[(artIndex + navIndex) % cardStyles.length],
    pattern: Math.floor(index / (arts.length * navStyles.length * proofStyles.length)) % 2 === 1,
  };
};
