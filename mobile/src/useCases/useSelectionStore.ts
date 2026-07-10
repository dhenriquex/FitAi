import { create } from "zustand";

import type { ExerciseSummary } from "../types/exerciseType";

type SelectionState = {
  selected: Map<string, ExerciseSummary>;
  toggle: (exercise: ExerciseSummary) => void;
  clear: () => void;
};

export const useSelectionStore = create<SelectionState>((set) => ({
  selected: new Map(),
  toggle: (exercise) =>
    set((state) => {
      const next = new Map(state.selected);
      if (next.has(exercise.id)) {
        next.delete(exercise.id);
      } else {
        next.set(exercise.id, exercise);
      }
      return { selected: next };
    }),
  clear: () => set({ selected: new Map() }),
}));
