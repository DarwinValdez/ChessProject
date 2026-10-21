import type { ReactNode } from "react";

export interface StepOutcome {
  solved: boolean;
  clean: boolean;
}

/** Each step view renders its board and its coach-panel content into these slots. */
export interface StepSlots {
  board: (node: ReactNode) => ReactNode;
  panel: (node: ReactNode) => ReactNode;
}
