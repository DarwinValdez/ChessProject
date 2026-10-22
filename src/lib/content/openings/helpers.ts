import { Chess } from "chess.js";
import type { AnnotatedMove, Arrow } from "../types";

/** Uncommented moves: plain("e4 e5 Nf3"). */
export function plain(moves: string): AnnotatedMove[] {
  return moves.trim().split(/\s+/).map((san) => ({ san }));
}

/** One commented move. */
export function m(san: string, comment?: string, arrows?: Arrow[]): AnnotatedMove {
  return { san, comment, arrows };
}

export function sans(moves: AnnotatedMove[]): string[] {
  return moves.map((x) => x.san);
}

/**
 * FEN after playing `moves` from the initial position. Content is
 * validated by tests, so an illegal move here is a content bug and throws.
 */
export function fenAfter(moves: string[] | string): string {
  const list = typeof moves === "string" ? moves.trim().split(/\s+/) : moves;
  const chess = new Chess();
  for (const san of list) chess.move(san);
  return chess.fen();
}

/** FEN after playing `moves` from an arbitrary position. */
export function fenAfterFrom(fen: string, moves: string): string {
  const chess = new Chess(fen);
  for (const san of moves.trim().split(/\s+/)) chess.move(san);
  return chess.fen();
}
