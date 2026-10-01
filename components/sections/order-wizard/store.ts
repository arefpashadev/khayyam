import { create } from "zustand";

export type TourName = "intro" | "editor";

import { getDefaultConfig, steps, type IndustryKey, type OrderKind, type PreviewTarget, type WizardConfig } from "./config";

type WizardState = {
  kind: OrderKind;
  step: number;
  direction: 1 | -1;
  submitted: boolean;
  config: WizardConfig;
  /** Which part of the preview the last change affected; `tick` re-triggers the same target. */
  focus: { target: PreviewTarget; tick: number };
  init: (kind: OrderKind) => void;
  goTo: (step: number) => void;
  next: () => void;
  prev: () => void;
  update: (patch: Partial<WizardConfig>, target?: PreviewTarget) => void;
  toggleSection: (value: string) => void;
  setVariant: (variant: number) => void;
  setIndustry: (industry: IndustryKey) => void;
  /** Open guided tour and its step; null when closed. */
  tour: { name: TourName; step: number } | null;
  setTour: (tour: { name: TourName; step: number } | null) => void;
  submit: () => void;
  restart: () => void;
};

const focusFor = (step: number, tick: number) => ({ target: steps[step].target, tick: tick + 1 });

export const useWizard = create<WizardState>((set, get) => ({
  kind: "site",
  step: 0,
  direction: 1,
  submitted: false,
  config: getDefaultConfig("site"),
  focus: { target: "top", tick: 0 },
  tour: null,
  setTour: (tour) => set({ tour }),

  init: (kind) => set({ kind, step: 0, direction: 1, submitted: false, config: getDefaultConfig(kind), focus: { target: "top", tick: 0 } }),

  goTo: (step) => {
    const current = get().step;
    if (step < 0 || step >= steps.length) return;
    if (step === current) {
      if (get().submitted) set({ submitted: false });
      return;
    }
    set({ step, direction: step > current ? 1 : -1, submitted: false, focus: focusFor(step, get().focus.tick) });
  },
  next: () => {
    const { step } = get();
    if (step === steps.length - 1) return get().submit();
    get().goTo(step + 1);
  },
  prev: () => get().goTo(get().step - 1),

  update: (patch, target) =>
    set((state) => ({
      config: { ...state.config, ...patch },
      focus: { target: target ?? steps[state.step].target, tick: state.focus.tick + 1 },
    })),

  toggleSection: (value) =>
    set((state) => {
      const has = state.config.sections.includes(value);
      return {
        config: { ...state.config, sections: has ? state.config.sections.filter((item) => item !== value) : [...state.config.sections, value] },
        // When a section is added, jump the preview to it; when removed, show the neighbourhood.
        focus: { target: has ? "features" : value, tick: state.focus.tick + 1 },
      };
    }),

  setVariant: (variant) => set((state) => ({ config: { ...state.config, variant }, focus: { target: "hero", tick: state.focus.tick + 1 } })),
  setIndustry: (industry) => set((state) => ({ config: { ...state.config, industry, variant: 0 }, focus: { target: "top", tick: state.focus.tick + 1 } })),

  submit: () => set({ submitted: true }),
  restart: () => get().init(get().kind),
}));
