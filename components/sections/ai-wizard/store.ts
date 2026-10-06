import { create } from "zustand";

import { aiSteps, defaultAiConfig, type AiConfig, type AiView } from "./config";

type AiState = {
  started: boolean;
  step: number;
  submitted: boolean;
  view: AiView;
  config: AiConfig;
  start: () => void;
  goTo: (step: number) => void;
  next: () => void;
  prev: () => void;
  setView: (view: AiView) => void;
  update: (patch: Partial<AiConfig>) => void;
  toggle: (key: "goals" | "tools" | "languages", value: string) => void;
  submit: () => void;
  reset: () => void;
};

export const useAi = create<AiState>((set, get) => ({
  started: false,
  step: 0,
  submitted: false,
  view: "flow",
  config: defaultAiConfig,
  start: () => set({ started: true }),
  // Each step shows the preview tab that answers its question best.
  goTo: (step) => {
    if (step < 0 || step >= aiSteps.length) return;
    set({ step, submitted: false, view: aiSteps[step].view });
  },
  next: () => (get().step === aiSteps.length - 1 ? get().submit() : get().goTo(get().step + 1)),
  prev: () => get().goTo(get().step - 1),
  setView: (view) => set({ view }),
  update: (patch) => set((state) => ({ config: { ...state.config, ...patch } })),
  toggle: (key, value) =>
    set((state) => {
      const list = state.config[key] as string[];
      const nextList = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
      // keep at least one language
      if (key === "languages" && nextList.length === 0) return state;
      return { config: { ...state.config, [key]: nextList } };
    }),
  submit: () => set({ submitted: true, view: "impact" }),
  reset: () => set({ started: false, step: 0, submitted: false, view: "flow", config: defaultAiConfig }),
}));
