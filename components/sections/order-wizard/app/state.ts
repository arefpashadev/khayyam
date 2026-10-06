import { create } from "zustand";

/**
 * Shared bits of the interactive app preview: which screen the screens rail asked for,
 * and whether the phone is on its home screen (icon step) or inside the app.
 */
type AppPreviewState = {
  request: { screen: string; tick: number };
  open: (screen: string) => void;
};

export const useAppPreview = create<AppPreviewState>((set) => ({
  request: { screen: "home", tick: 0 },
  open: (screen) => set((state) => ({ request: { screen, tick: state.request.tick + 1 } })),
}));
