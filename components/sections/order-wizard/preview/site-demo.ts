import { create } from "zustand";

/**
 * Live state of the website preview, shared by the laptop and the phone, so a click in one
 * shows in both: cart count, open FAQ, chosen plan, category filter, mobile menu, popups.
 */
type SiteDemo = {
  cart: number;
  faq: number;
  plan: number;
  category: number;
  menu: boolean;
  popupClosed: boolean;
  installClosed: boolean;
  addToCart: () => void;
  set: (patch: Partial<Omit<SiteDemo, "addToCart" | "set">>) => void;
};

export const useSiteDemo = create<SiteDemo>((set) => ({
  cart: 3,
  faq: 0,
  plan: 1,
  category: 0,
  menu: false,
  popupClosed: false,
  installClosed: false,
  addToCart: () => set((state) => ({ cart: state.cart + 1 })),
  set: (patch) => set(patch),
}));

/** Scroll the preview's own screen (not the page) to a section. */
export const jumpTo = (from: HTMLElement, target: string) => {
  const scroller = from.closest<HTMLElement>(".pv-scroller");
  const section = scroller?.querySelector<HTMLElement>(`[data-pv="${target}"]`);
  if (!scroller || !section) return false;
  const top = section.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
  scroller.scrollTo({ top: Math.max(0, top - 12), behavior: "smooth" });
  return true;
};
