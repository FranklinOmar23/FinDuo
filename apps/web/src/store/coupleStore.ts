import type { CoupleSummary } from "@finduo/types";
import { create } from "zustand";

interface CoupleState {
  activeCouple: CoupleSummary | null;
  setActiveCouple: (couple: CoupleSummary | null) => void;
}

export const useCoupleStore = create<CoupleState>((set) => ({
  activeCouple: null,
  setActiveCouple: (activeCouple) => set({ activeCouple })
}));
