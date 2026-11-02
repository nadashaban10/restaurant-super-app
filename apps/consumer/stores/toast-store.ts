import { create } from "zustand";

export type ToastTone = "success" | "error" | "warning";

type ToastState = {
  message: string | null;
  tone: ToastTone;
  show: (message: string, tone?: ToastTone) => void;
  clear: () => void;
};

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  tone: "success",
  show: (message, tone = "success") => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ message, tone });
    toastTimer = setTimeout(() => set({ message: null }), 2600);
  },
  clear: () => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ message: null });
  },
}));
