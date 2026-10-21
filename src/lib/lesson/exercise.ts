/**
 * Exercise state machine, independent of React. The student's move is
 * matched against the accepted options of the current turn by comparing
 * the resulting move (LAN), so any input form (drag, click, SAN) works.
 */
import { type MoveInput, type MoveRecord, moveFromFen } from "@/lib/chess/game";
import type { ExerciseStep, UserTurn } from "@/lib/content/types";

export type ExerciseStatus = "solving" | "awaiting-reply" | "solved";

export interface ExerciseState {
  fen: string;
  turn: UserTurn | null;
  status: ExerciseStatus;
  /** Scripted reply to play next, while status is "awaiting-reply". */
  pendingReply?: { san: string; next?: UserTurn };
  played: MoveRecord[];
  wrongMoves: number;
  hintsUsed: number;
}

export function startExercise(step: ExerciseStep): ExerciseState {
  return { fen: step.fen, turn: step.solution, status: "solving", played: [], wrongMoves: 0, hintsUsed: 0 };
}

export type SubmitResult =
  | { kind: "illegal"; state: ExerciseState }
  | { kind: "wrong"; state: ExerciseState; move: MoveRecord; feedback?: string }
  | { kind: "correct"; state: ExerciseState; move: MoveRecord };

export function submitMove(state: ExerciseState, step: ExerciseStep, input: MoveInput | string): SubmitResult {
  if (state.status !== "solving" || !state.turn) return { kind: "illegal", state };
  const move = moveFromFen(state.fen, input);
  if (!move) return { kind: "illegal", state };

  const option = state.turn.options.find((o) => moveFromFen(state.fen, o.san)?.lan === move.lan);
  if (!option) {
    // Refutations only apply to the first move of the exercise.
    const feedback = state.played.length === 0 ? step.refutations?.[move.san] : undefined;
    return { kind: "wrong", state: { ...state, wrongMoves: state.wrongMoves + 1 }, move, feedback: feedback || undefined };
  }

  const played = [...state.played, move];
  if (option.reply) {
    return {
      kind: "correct",
      move,
      state: { ...state, fen: move.fenAfter, played, status: "awaiting-reply", turn: null, pendingReply: { san: option.reply, next: option.next } },
    };
  }
  return { kind: "correct", move, state: { ...state, fen: move.fenAfter, played, status: "solved", turn: null } };
}

/** Plays the scripted opponent reply. */
export function applyReply(state: ExerciseState): { state: ExerciseState; move?: MoveRecord } {
  if (state.status !== "awaiting-reply" || !state.pendingReply) return { state };
  const move = moveFromFen(state.fen, state.pendingReply.san);
  if (!move) return { state: { ...state, status: "solved", pendingReply: undefined } };
  const next = state.pendingReply.next;
  return {
    move,
    state: {
      ...state,
      fen: move.fenAfter,
      played: [...state.played, move],
      pendingReply: undefined,
      turn: next ?? null,
      status: next ? "solving" : "solved",
    },
  };
}

export function takeHint(state: ExerciseState, step: ExerciseStep): ExerciseState {
  if (state.hintsUsed >= step.hints.length || state.status === "solved") return state;
  return { ...state, hintsUsed: state.hintsUsed + 1 };
}

/** The main solution line in SAN: first option at every turn, with replies. */
export function solutionLine(step: ExerciseStep): string[] {
  const line: string[] = [];
  let turn: UserTurn | undefined = step.solution;
  while (turn && turn.options.length > 0) {
    const option: UserTurn["options"][number] = turn.options[0];
    line.push(option.san);
    if (!option.reply) break;
    line.push(option.reply);
    turn = option.next;
  }
  return line;
}

/** The solution may be revealed only after the student has really tried. */
export function canRevealSolution(state: ExerciseState): boolean {
  return state.status !== "solved" && state.wrongMoves > 0;
}

export function outcome(state: ExerciseState, gaveUp: boolean) {
  const solved = state.status === "solved" && !gaveUp;
  return { solved, gaveUp, clean: solved && state.wrongMoves === 0 && state.hintsUsed === 0, wrongMoves: state.wrongMoves, hintsUsed: state.hintsUsed };
}
