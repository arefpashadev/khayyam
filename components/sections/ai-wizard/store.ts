import { create } from "zustand";

import type { KhayyamReply } from "./brain";
import { defaultAiConfig, type AiConfig } from "./config";

/** A free-text exchange with Khayyam, shown inside the conversation. */
export type Note = { id: number; role: "user" | "khayyam"; text: string; reply?: KhayyamReply; applied?: boolean; /** the question that was open when it was written */ stage: number };

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
  /** chat: the interview (default) · custom: bespoke AI request */
  mode: "chat" | "custom";
  /** index of the interview question currently being answered */
  stage: number;
  submitted: boolean;
  /** the final proposal screen is showing */
  proposal: boolean;
  setProposal: (open: boolean) => void;
  config: AiConfig;
  notes: Note[];
  thinking: boolean;
  addNote: (note: Omit<Note, "id" | "stage">) => void;
  markApplied: (id: number) => void;
  setThinking: (thinking: boolean) => void;
  custom: CustomRequest;
  setMode: (mode: AiState["mode"]) => void;
  answer: (patch: Partial<AiConfig>) => void;
  /** go back to a previous question to change the answer */
  rewind: (stage: number) => void;
  update: (patch: Partial<AiConfig>) => void;
  toggle: (key: "goals" | "tools" | "languages", value: string) => void;
  updateCustom: (patch: Partial<CustomRequest>) => void;
  toggleCustom: (key: "domains" | "data", value: string) => void;
  submit: () => void;
  reset: () => void;
};

export const useAi = create<AiState>((set) => ({
  mode: "chat",
  stage: 0,
  submitted: false,
  proposal: false,
  setProposal: (proposal) => set({ proposal }),
  config: defaultAiConfig,
  notes: [],
  thinking: false,
  addNote: (note) => set((state) => ({ notes: [...state.notes, { ...note, id: state.notes.length + 1, stage: state.stage }] })),
  markApplied: (id) => set((state) => ({ notes: state.notes.map((note) => (note.id === id ? { ...note, applied: true } : note)) })),
  setThinking: (thinking) => set({ thinking }),
  custom: emptyCustom,
  // The interview starts blank so the blueprint visibly draws itself from the answers.
  // Switching paths keeps what the customer already told us.
  setMode: (mode) => set({ mode, submitted: false, proposal: false }),
  answer: (patch) => set((state) => ({ config: { ...state.config, ...patch }, stage: state.stage + 1 })),
  rewind: (stage) => set({ stage, submitted: false, proposal: false }),
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
  // The interview starts blank so the dossier visibly fills from the answers.
  reset: () => set({ mode: "chat", stage: 0, submitted: false, proposal: false, notes: [], thinking: false, config: { ...defaultAiConfig, goals: [], tools: [], pains: [] }, custom: emptyCustom }),
}));
