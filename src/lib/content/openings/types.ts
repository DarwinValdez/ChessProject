/**
 * Opening library model. Every line is a list of SAN moves from the
 * initial position, so it can be validated and replayed on the board.
 */
import type { AnnotatedMove, ExerciseStep, Level, QuestionStep, Verification } from "../types";

/** Classical families. An opening may belong to several. */
export type OpeningFamily = "abierta" | "semiabierta" | "cerrada" | "semicerrada" | "hipermoderna" | "flanco";

/** Who chooses it and against what. */
export type OpeningGroup = "sistema-blancas" | "contra-e4" | "contra-d4";

export interface OpeningLine {
  id: string;
  name: string;
  /** ECO code or range, only when it is well established. */
  eco?: string;
  moves: AnnotatedMove[];
  description: string;
  kind: "principal" | "secundaria";
  /** The line sacrifices material for development or initiative. */
  gambit?: boolean;
}

export interface OpeningTrap {
  id: string;
  name: string;
  /** Moves up to and including the mistake. */
  moves: string[];
  /** Side that makes the mistake. */
  victim: "blancas" | "negras";
  /** The refutation, starting right after the mistake. */
  punishment: AnnotatedMove[];
  explanation: string;
  verification: Verification;
}

export interface OpeningMistake {
  text: string;
  /** Optional illustrative line from the initial position. */
  moves?: string[];
}

/**
 * Reference to a well-known game. Moves are not reproduced until they are
 * imported from a verified source; only the bibliographic data is given.
 */
export interface ModelGameRef {
  white: string;
  black: string;
  event: string;
  year: number;
  note: string;
}

export interface CriticalPosition {
  id: string;
  title: string;
  moves: string[];
  explanation: string;
}

export interface Opening {
  slug: string;
  name: string;
  /** Other common names, also used by search. */
  aliases?: string[];
  eco: string;
  families: OpeningFamily[];
  groups: OpeningGroup[];
  /** Side whose choice defines the opening. */
  side: "blancas" | "negras";
  level: Level;
  summary: string;
  mainLine: OpeningLine;
  ideas: string[];
  goals: { white: string[]; black: string[] };
  structures: { name: string; description: string }[];
  plans: { white: string[]; black: string[] };
  squares: { strong: string[]; weak: string[]; note: string };
  development: string[];
  traps: OpeningTrap[];
  mistakes: OpeningMistake[];
  modelGames: ModelGameRef[];
  variations: OpeningLine[];
  critical: CriticalPosition[];
  exercises: (QuestionStep | ExerciseStep)[];
  /** Ids ("course/lesson") of course lessons that go deeper. */
  relatedLessons?: string[];
}
