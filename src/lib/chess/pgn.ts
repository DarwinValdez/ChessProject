/**
 * PGN import/export for the linear game model. Comments and variations in
 * imported PGN are ignored for now (variation trees arrive in phase 3); the
 * caller is told how many were dropped so the UI can say so.
 */
import { Chess } from "chess.js";
import { type GameState, type MoveRecord, START_FEN, checkFen } from "./game";

export type PgnImport =
  | { ok: true; state: GameState; headers: Record<string, string>; droppedVariations: boolean }
  | { ok: false; error: string };

export function importPgn(pgn: string): PgnImport {
  const text = pgn.trim();
  if (!text) return { ok: false, error: "El PGN está vacío." };
  const chess = new Chess();
  try {
    chess.loadPgn(text);
  } catch (error) {
    return { ok: false, error: `PGN no válido: ${(error as Error).message}` };
  }
  const headers = Object.fromEntries(
    Object.entries(chess.getHeaders()).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  );
  const startFen = headers.SetUp === "1" && headers.FEN ? headers.FEN : START_FEN;
  const fenCheck = checkFen(startFen);
  if (!fenCheck.ok) return { ok: false, error: `FEN inicial del PGN no válida: ${fenCheck.error}` };

  const moves: MoveRecord[] = chess.history({ verbose: true }).map((m) => ({
    san: m.san,
    lan: m.lan,
    from: m.from,
    to: m.to,
    color: m.color,
    promotion: m.promotion as MoveRecord["promotion"],
    captured: m.captured,
    fenBefore: m.before,
    fenAfter: m.after,
  }));
  // chess.js drops RAV variations silently; detect them so the UI can warn.
  const droppedVariations = /\(/.test(stripComments(text));
  return { ok: true, state: { startFen: fenCheck.fen, moves, cursor: moves.length }, headers, droppedVariations };
}

function stripComments(pgn: string): string {
  return pgn.replace(/\{[^}]*\}/g, "").replace(/;[^\n]*/g, "");
}

export interface PgnHeaders {
  Event?: string;
  Site?: string;
  Date?: string;
  White?: string;
  Black?: string;
  Result?: string;
  [key: string]: string | undefined;
}

/** Exports the full line (not only up to the cursor) as PGN. */
export function exportPgn(state: GameState, headers: PgnHeaders = {}): string {
  const chess = new Chess(state.startFen);
  const defaults: PgnHeaders = {
    Event: "Chess Academy",
    Site: "Chess Academy",
    Date: formatPgnDate(new Date()),
    White: "?",
    Black: "?",
    Result: "*",
  };
  for (const [key, value] of Object.entries({ ...defaults, ...headers })) {
    if (value !== undefined) chess.setHeader(key, value);
  }
  if (state.startFen !== START_FEN) {
    chess.setHeader("SetUp", "1");
    chess.setHeader("FEN", state.startFen);
  }
  for (const move of state.moves) chess.move(move.lan);
  return chess.pgn();
}

function formatPgnDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}
