import { describe, expect, it } from "vitest";
import { createGame, currentFen, playMove } from "../game";
import { exportPgn, importPgn } from "../pgn";

describe("PGN", () => {
  it("round-trips a game", () => {
    let state = createGame();
    for (const san of ["e4", "e5", "Nf3", "Nc6", "Bb5"]) state = playMove(state, san)!.state;
    const pgn = exportPgn(state, { White: "Ana", Black: "Luis" });
    expect(pgn).toContain('[White "Ana"]');
    const back = importPgn(pgn);
    expect(back.ok).toBe(true);
    if (!back.ok) return;
    expect(back.state.moves.map((m) => m.san)).toEqual(["e4", "e5", "Nf3", "Nc6", "Bb5"]);
    expect(currentFen(back.state)).toBe(currentFen(state));
  });

  it("keeps a custom start position", () => {
    const fen = "8/3k4/8/8/3K4/3P4/8/8 w - - 0 1";
    const state = playMove(createGame(fen), "Kd5")!.state;
    const pgn = exportPgn(state);
    expect(pgn).toContain('[FEN "8/3k4/8/8/3K4/3P4/8/8 w - - 0 1"]');
    const back = importPgn(pgn);
    expect(back.ok && back.state.startFen).toBe(fen);
  });

  it("reports illegal moves and empty input", () => {
    expect(importPgn("").ok).toBe(false);
    const bad = importPgn("1. e4 e5 2. Ke3");
    expect(bad.ok).toBe(false);
  });

  it("flags dropped variations but ignores parentheses inside comments", () => {
    const withVar = importPgn("1. e4 e5 (1... c5 2. Nf3) 2. Nf3 *");
    expect(withVar.ok && withVar.droppedVariations).toBe(true);
    const withComment = importPgn("1. e4 {a (good) move} e5 *");
    expect(withComment.ok && withComment.droppedVariations).toBe(false);
    if (withVar.ok) expect(withVar.state.moves.map((m) => m.san)).toEqual(["e4", "e5", "Nf3"]);
  });
});
