import { create } from "zustand";

/**
 * Shared bits of the interactive app preview: which screen the screens rail asked for,
 * and whether the phone is on its home screen (icon step) or inside the app.
 */
type AppPreviewState = {
  request: { screen: string; tick: number };
  open: (screen: string) => void;
  /** Ask the phone to show a feature right now (onboarding, Face ID, a push…). */
  demo: { feature: string; tick: number };
  play: (feature: string) => void;
};

export const useAppPreview = create<AppPreviewState>((set) => ({
  request: { screen: "home", tick: 0 },
  open: (screen) => set((state) => ({ request: { screen, tick: state.request.tick + 1 } })),
  demo: { feature: "", tick: 0 },
  play: (feature) => set((state) => ({ demo: { feature, tick: state.demo.tick + 1 } })),
}));
