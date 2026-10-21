/**
 * Pure, immutable game-state helpers built on chess.js.
 *
 * The UI never decides move legality itself: every move goes through
 * chess.js here. State is a start position plus a linear list of moves and
 * a cursor (how many plies are currently shown). Variation trees arrive in
 * phase 3; until then, playing a different move from an earlier ply
 * truncates the line after the cursor.
 */
import { Chess, DEFAULT_POSITION, type Move, type Square, validateFen } from "chess.js";

export const START_FEN = DEFAULT_POSITION;

export type Color = "w" | "b";
export type PromotionPiece = "q" | "r" | "b" | "n";

export interface MoveRecord {
  san: string;
  lan: string;
  from: Square;
  to: Square;
  color: Color;
  promotion?: PromotionPiece;
  captured?: string;
  fenBefore: string;
  fenAfter: string;
}

export interface GameState {
  startFen: string;
  moves: MoveRecord[];
  /** Number of plies applied to reach the displayed position (0..moves.length). */
  cursor: number;
}

export interface MoveInput {
  from: string;
  to: string;
  promotion?: PromotionPiece;
}

export type FenCheck = { ok: true; fen: string } | { ok: false; error: string };

/** Validates a FEN string with chess.js (structure, kings, side to move...). */
export function checkFen(input: string): FenCheck {
  const fen = input.trim().replace(/\s+/g, " ");
  if (!fen) return { ok: false, error: "La FEN está vacía." };
  const result = validateFen(fen);
  if (!result.ok) return { ok: false, error: result.error ?? "FEN no válida." };
  let chess: Chess;
  try {
    chess = new Chess(fen);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
  // chess.js accepts positions where the side NOT to move is in check,
  // which cannot arise in a real game.
  const waiting: Color = chess.turn() === "w" ? "b" : "w";
  const [waitingKing] = chess.findPiece({ type: "k", color: waiting });
  if (waitingKing && chess.isAttacked(waitingKing, chess.turn())) {
    return { ok: false, error: "Posición imposible: el bando que no mueve está en jaque." };
  }
  return { ok: true, fen };
}

export function createGame(startFen: string = START_FEN): GameState {
  const check = checkFen(startFen);
  if (!check.ok) throw new Error(check.error);
  return { startFen: check.fen, moves: [], cursor: 0 };
}

export function currentFen(state: GameState): string {
  return state.cursor === 0 ? state.startFen : state.moves[state.cursor - 1].fenAfter;
}

export function lastMove(state: GameState): MoveRecord | undefined {
  return state.cursor === 0 ? undefined : state.moves[state.cursor - 1];
}

function toRecord(move: Move): MoveRecord {
  return {
    san: move.san,
    lan: move.lan,
    from: move.from,
    to: move.to,
    color: move.color,
    promotion: move.promotion as PromotionPiece | undefined,
    captured: move.captured,
    fenBefore: move.before,
    fenAfter: move.after,
  };
}

/** Tries a move from a FEN. Returns null when chess.js rejects it. */
export function moveFromFen(fen: string, input: MoveInput | string): MoveRecord | null {
  const chess = new Chess(fen);
  try {
    return toRecord(chess.move(input));
  } catch {
    return null;
  }
}

/**
 * Plays a move at the cursor. If it matches the next stored move, the
 * cursor simply advances (keeps the line); otherwise the line is truncated
 * after the cursor and the new move appended.
 */
export function playMove(
  state: GameState,
  input: MoveInput | string,
): { state: GameState; move: MoveRecord } | null {
  const move = moveFromFen(currentFen(state), input);
  if (!move) return null;
  const next = state.moves[state.cursor];
  if (next && next.lan === move.lan) {
    return { state: { ...state, cursor: state.cursor + 1 }, move: next };
  }
  const moves = [...state.moves.slice(0, state.cursor), move];
  return { state: { ...state, moves, cursor: moves.length }, move };
}

export function goTo(state: GameState, ply: number): GameState {
  const cursor = Math.max(0, Math.min(state.moves.length, ply));
  return cursor === state.cursor ? state : { ...state, cursor };
}

/** Legal destination squares for the piece on `square` (empty if none). */
export function legalTargets(fen: string, square: string): Square[] {
  const chess = new Chess(fen);
  return chess.moves({ square: square as Square, verbose: true }).map((m) => m.to);
}

/** True when moving from→to is a legal pawn promotion (needs a piece choice). */
export function isPromotion(fen: string, from: string, to: string): boolean {
  const chess = new Chess(fen);
  return chess
    .moves({ square: from as Square, verbose: true })
    .some((m) => m.to === to && m.promotion !== undefined);
}

export type GameStatusKind =
  | "playing"
  | "check"
  | "checkmate"
  | "stalemate"
  | "insufficient-material"
  | "threefold-repetition"
  | "fifty-move-rule";

export interface GameStatus {
  kind: GameStatusKind;
  turn: Color;
  isGameOver: boolean;
}

/**
 * Status at the cursor. The line is replayed so that threefold repetition
 * (which depends on history, not only the FEN) is detected correctly.
 */
export function gameStatus(state: GameState): GameStatus {
  const chess = new Chess(state.startFen);
  for (const move of state.moves.slice(0, state.cursor)) chess.move(move.lan);
  const turn = chess.turn();
  let kind: GameStatusKind = "playing";
  if (chess.isCheckmate()) kind = "checkmate";
  else if (chess.isStalemate()) kind = "stalemate";
  else if (chess.isInsufficientMaterial()) kind = "insufficient-material";
  else if (chess.isThreefoldRepetition()) kind = "threefold-repetition";
  else if (chess.isDrawByFiftyMoves()) kind = "fifty-move-rule";
  else if (chess.inCheck()) kind = "check";
  return { kind, turn, isGameOver: kind !== "playing" && kind !== "check" };
}

/** Squares of the king in check at `fen`, if any (for highlighting). */
export function checkedKingSquare(fen: string): Square | undefined {
  const chess = new Chess(fen);
  if (!chess.inCheck()) return undefined;
  return chess.findPiece({ type: "k", color: chess.turn() })[0];
}

export function sideToMove(fen: string): Color {
  return fen.split(" ")[1] === "b" ? "b" : "w";
}

/** Full-move number and colour of the ply at index `i` of a line from `startFen`. */
export function moveNumberAt(startFen: string, i: number): { number: number; color: Color } {
  const parts = startFen.split(" ");
  const startColor: Color = parts[1] === "b" ? "b" : "w";
  const startNumber = Number(parts[5]) || 1;
  const offset = startColor === "w" ? i : i + 1;
  return {
    number: startNumber + Math.floor(offset / 2),
    color: offset % 2 === 0 ? "w" : "b",
  };
}
