import { aiEstimate, defaultAiConfig } from "../ai-wizard/config";
import { estimate, getDefaultConfig } from "../order-wizard/config";

/**
 * Starting prices and times shown on the home page. They are computed from the same
 * price settings the studios use (order-wizard/config.ts and ai-wizard/config.ts),
 * so changing a price there updates the home page too.
 */
const smallestSite = estimate("site", { ...getDefaultConfig("site"), projectType: "landing", sections: [], extras: [] });
const smallestApp = estimate("app", { ...getDefaultConfig("app"), projectType: "booking", platform: "pwa", screens: ["home"], extras: [] });
const smallestAi = aiEstimate({ ...defaultAiConfig, goals: ["support"], tools: [], deliverable: "poc" });

export const startingPrices = {
  site: { from: smallestSite.min, weeks: smallestSite.weeks },
  app: { from: smallestApp.min, weeks: smallestApp.weeks },
  ai: { from: smallestAi.min, weeks: smallestAi.weeks },
};

/**
 * What clients say. Replace the placeholders with real clients' words (with their
 * permission). Entries marked `placeholder: true` render as empty, clearly marked slots,
 * so nothing invented is ever shown as a real review.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** a real, measured result, e.g. "۲ برابر سفارش آنلاین در ۳ ماه" */
  result?: string;
  placeholder?: boolean;
};

export const testimonials: Testimonial[] = [
  { placeholder: true, quote: "", name: "", role: "" },
  { placeholder: true, quote: "", name: "", role: "" },
  { placeholder: true, quote: "", name: "", role: "" },
];
