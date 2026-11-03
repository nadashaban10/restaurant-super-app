import { create } from "zustand";

const SUPPRESS_MS = 3 * 60 * 1000;

type SuggestionState = {
  anchorId: string | null;
  suppressedUntil: number;
  suggest: (productId: string) => void;
  dismiss: () => void;
};

export const useSuggestionStore = create<SuggestionState>((set, get) => ({
  anchorId: null,
  suppressedUntil: 0,
  suggest: (productId) => {
    if (Date.now() < get().suppressedUntil) return;
    set({ anchorId: productId });
  },
  dismiss: () => set({ anchorId: null, suppressedUntil: Date.now() + SUPPRESS_MS }),
}));
