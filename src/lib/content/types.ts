/**
 * Content model for courses, modules and lessons.
 *
 * Content is plain typed data so it can be validated automatically (see
 * validate.ts) and later stored in the database and edited from the admin
 * panel without changing the lesson player.
 */

export type Area = "aperturas" | "finales" | "tactica" | "medio-juego";
export type Level = "principiante" | "intermedio" | "avanzado" | "experto";

/** Where a piece of content comes from (shown to the student). */
export type ContentSource = "propio" | "abierto" | "referencia-externa";

/**
 * Theoretical verdict of an endgame position. "ganable-en-practica" must be
 * used for lines that are recommended but not proven to force the result.
 */
export type TheoreticalResult =
  | "victoria-forzada-blancas"
  | "victoria-forzada-negras"
  | "tablas-teoricas"
  | "ganable-en-practica";

/** How a claimed evaluation was checked before publishing. */
export type Verification = "stockfish" | "tablebase" | "teoria-clasica" | "sin-verificar";

export type Arrow = { from: string; to: string; tone?: "idea" | "threat" | "alternative" };

/** One move in an explained line, with an optional human comment. */
export interface AnnotatedMove {
  /** SAN, validated against the position by validate.ts. */
  san: string;
  comment?: string;
  arrows?: Arrow[];
  highlights?: string[];
}

interface BaseStep {
  id: string;
  title: string;
}

/** A position (optionally followed by a commented line) with explanation. */
export interface ExplainStep extends BaseStep {
  kind: "explain";
  fen: string;
  body: string[];
  arrows?: Arrow[];
  highlights?: string[];
  line?: AnnotatedMove[];
}

/**
 * The student must find the move(s). Each user turn lists the accepted
 * moves; each accepted move may carry a scripted reply and a next turn.
 * The first option is the main solution shown after failure.
 */
export interface UserTurn {
  options: { san: string; reply?: string; next?: UserTurn }[];
}

export interface ExerciseStep extends BaseStep {
  kind: "exercise";
  fen: string;
  prompt: string;
  /** Tags used for weakness detection (e.g. "horquilla", "oposicion"). */
  themes: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  solution: UserTurn;
  /** Progressive hints, revealed one at a time on request. */
  hints: string[];
  /** Shown after success and after the student gives up. */
  explanation: string;
  /** Specific feedback for tempting wrong moves (SAN → explanation). */
  refutations?: Record<string, string>;
  result?: TheoreticalResult;
  verification: Verification;
}

/** Comprehension check (multiple choice). */
export interface QuestionStep extends BaseStep {
  kind: "question";
  fen?: string;
  prompt: string;
  choices: { id: string; text: string; correct: boolean; feedback: string }[];
  themes: string[];
}

export type LessonStep = ExplainStep | ExerciseStep | QuestionStep;

export interface Lesson {
  slug: string;
  title: string;
  summary: string;
  objective: string;
  /** Concept the student must take away, in one sentence. */
  concept: string;
  estimatedMinutes: number;
  themes: string[];
  steps: LessonStep[];
  /** Theoretical verdict of the lesson's main position, if relevant. */
  result?: TheoreticalResult;
  source: ContentSource;
}

export interface Module {
  slug: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  slug: string;
  title: string;
  area: Area;
  level: Level;
  summary: string;
  /** What the student will be able to do after the course. */
  outcomes: string[];
  /** ECO codes, only for opening courses and only when they apply. */
  eco?: string[];
  modules: Module[];
  source: ContentSource;
}
