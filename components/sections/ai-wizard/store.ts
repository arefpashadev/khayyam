import { create } from "zustand";

import { defaultAiConfig, type AiConfig, type AiView } from "./config";

/** Fields of the custom-AI request (factory lines, medical imaging, …). */
export type CustomRequest = {
  domains: string[];
  problem: string;
  data: string[];
  scale: string;
  timeline: string;
  company: string;
  name: string;
  phone: string;
  fileName: string;
};

const emptyCustom: CustomRequest = { domains: [], problem: "", data: [], scale: "", timeline: "", company: "", name: "", phone: "", fileName: "" };

type AiState = {
  /** landing: pick a path · chat: interview builder · custom: bespoke AI request */
  mode: "landing" | "chat" | "custom";
  /** index of the interview question currently being answered */
  stage: number;
  submitted: boolean;
  view: AiView;
  config: AiConfig;
  custom: CustomRequest;
  setMode: (mode: AiState["mode"]) => void;
  answer: (patch: Partial<AiConfig>) => void;
  /** go back to a previous question to change the answer */
  rewind: (stage: number) => void;
  setView: (view: AiView) => void;
  update: (patch: Partial<AiConfig>) => void;
  toggle: (key: "goals" | "tools" | "languages", value: string) => void;
  updateCustom: (patch: Partial<CustomRequest>) => void;
  toggleCustom: (key: "domains" | "data", value: string) => void;
  submit: () => void;
  reset: () => void;
};

export const useAi = create<AiState>((set) => ({
  mode: "landing",
  stage: 0,
  submitted: false,
  view: "flow",
  config: defaultAiConfig,
  custom: emptyCustom,
  // The interview starts blank so the blueprint visibly draws itself from the answers.
  setMode: (mode) => set((state) => ({ mode, stage: 0, submitted: false, config: mode === "chat" ? { ...state.config, goals: [], tools: [] } : state.config })),
  answer: (patch) => set((state) => ({ config: { ...state.config, ...patch }, stage: state.stage + 1 })),
  rewind: (stage) => set({ stage, submitted: false }),
  setView: (view) => set({ view }),
  update: (patch) => set((state) => ({ config: { ...state.config, ...patch } })),
  toggle: (key, value) =>
    set((state) => {
      const list = state.config[key] as string[];
      const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
      if (key === "languages" && next.length === 0) return state;
      return { config: { ...state.config, [key]: next } };
    }),
  updateCustom: (patch) => set((state) => ({ custom: { ...state.custom, ...patch } })),
  toggleCustom: (key, value) =>
    set((state) => {
      const list = state.custom[key];
      return { custom: { ...state.custom, [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value] } };
    }),
  submit: () => set({ submitted: true }),
  reset: () => set({ mode: "landing", stage: 0, submitted: false, view: "flow", config: defaultAiConfig, custom: emptyCustom }),
}));
