import { create } from "zustand";

export type ToastTone = "info" | "success" | "error";

export interface ToastItem {
  id: number;
  title: string;
  message: string;
  tone: ToastTone;
}

interface ToastState {
  toasts: ToastItem[];
  pushToast: (toast: Omit<ToastItem, "id"> & { durationMs?: number }) => void;
  dismissToast: (id: number) => void;
}

let toastId = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  pushToast: ({ durationMs = 4800, ...toast }) => {
    const id = ++toastId;

    set((state) => ({
      toasts: [...state.toasts, { id, ...toast }]
    }));

    window.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((item) => item.id !== id)
      }));
    }, durationMs);
  },
  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((item) => item.id !== id)
    }));
  }
}));