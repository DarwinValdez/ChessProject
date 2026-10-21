import { describe, expect, it } from "vitest";
import {
  START_FEN,
  checkFen,
  checkedKingSquare,
  createGame,
  currentFen,
  gameStatus,
  goTo,
  isPromotion,
  legalTargets,
  moveNumberAt,
  playMove,
} from "../game";
import { localizeSan } from "../notation";

function play(sans: string[], fen = START_FEN) {
  let state = createGame(fen);
  for (const san of sans) {
    const result = playMove(state, san);
    if (!result) throw new Error(`illegal ${san}`);
    state = result.state;
  }
  return state;
}

describe("checkFen", () => {
  it("accepts the start position and normalises whitespace", () => {
    expect(checkFen(`  ${START_FEN.replace(/ /g, "   ")} `)).toEqual({ ok: true, fen: START_FEN });
  });
  it("rejects garbage, missing kings and pawns on the back rank", () => {
    expect(checkFen("").ok).toBe(false);
    expect(checkFen("hello").ok).toBe(false);
    expect(checkFen("8/8/8/8/8/8/8/8 w - - 0 1").ok).toBe(false);
    expect(checkFen("P3k3/8/8/8/8/8/8/4K3 w - - 0 1").ok).toBe(false);
  });
  it("rejects positions where the side not to move is in check", () => {
    expect(checkFen("4k3/8/8/8/8/8/8/4RK2 w - - 0 1").ok).toBe(false);
    expect(checkFen("4k3/8/8/8/8/8/8/4RK2 b - - 0 1").ok).toBe(true);
  });
});

describe("playMove", () => {
  it("rejects illegal moves and moves of the wrong side", () => {
    const game = createGame();
    expect(playMove(game, { from: "e2", to: "e5" })).toBeNull();
    expect(playMove(game, { from: "e7", to: "e5" })).toBeNull();
    expect(playMove(game, "Ke2")).toBeNull();
  });

  it("supports castling on both sides", () => {
    const fen = "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1";
    expect(playMove(createGame(fen), { from: "e1", to: "g1" })?.move.san).toBe("O-O");
    expect(playMove(createGame(fen), { from: "e1", to: "c1" })?.move.san).toBe("O-O-O");
  });

  it("forbids castling through check", () => {
    const fen = "r3k2r/8/8/8/8/8/5r2/R3K2R w KQkq - 0 1"; // the rook on f2 controls f1
    expect(playMove(createGame(fen), { from: "e1", to: "g1" })).toBeNull();
  });

  it("supports en passant only immediately", () => {
    const state = play(["e4", "a6", "e5", "d5"]);
    const ep = playMove(state, { from: "e5", to: "d6" });
    expect(ep?.move.san).toBe("exd6");
    expect(ep?.move.captured).toBe("p");
    const late = play(["e4", "a6", "e5", "d5", "a3", "a5"]);
    expect(playMove(late, { from: "e5", to: "d6" })).toBeNull();
  });

  it("requires and applies promotion", () => {
    const fen = "8/P6k/8/8/8/8/8/K7 w - - 0 1";
    expect(isPromotion(fen, "a7", "a8")).toBe(true);
    expect(isPromotion(START_FEN, "e2", "e4")).toBe(false);
    const knight = playMove(createGame(fen), { from: "a7", to: "a8", promotion: "n" });
    expect(knight?.move.san).toBe("a8=N");
  });

  it("advances along the existing line instead of truncating it", () => {
    const full = play(["e4", "e5", "Nf3"]);
    const back = goTo(full, 1);
    const same = playMove(back, "e5");
    expect(same?.state.moves).toHaveLength(3);
    expect(same?.state.cursor).toBe(2);
    const different = playMove(back, "c5");
    expect(different?.state.moves.map((m) => m.san)).toEqual(["e4", "c5"]);
  });
});

describe("navigation and status", () => {
  it("clamps the cursor and returns the right FEN", () => {
    const state = play(["e4", "e5"]);
    expect(currentFen(goTo(state, -5))).toBe(START_FEN);
    expect(goTo(state, 99).cursor).toBe(2);
    expect(currentFen(goTo(state, 1))).toBe(state.moves[0].fenAfter);
  });

  it("detects check, checkmate and stalemate", () => {
    const mate = play(["f3", "e5", "g4", "Qh4#"]);
    expect(gameStatus(mate).kind).toBe("checkmate");
    expect(gameStatus(mate).isGameOver).toBe(true);
    expect(checkedKingSquare(currentFen(mate))).toBe("e1");
    expect(gameStatus(goTo(mate, 3)).kind).toBe("playing");

    const stalemate = createGame("7k/5Q2/6K1/8/8/8/8/8 b - - 0 1");
    expect(gameStatus(stalemate).kind).toBe("stalemate");
    const check = createGame("4k3/8/8/8/8/8/8/4RK2 b - - 0 1");
    expect(gameStatus(check).kind).toBe("check");
  });

  it("detects insufficient material and threefold repetition", () => {
    expect(gameStatus(createGame("8/8/8/4k3/8/8/8/4K1N1 w - - 0 1")).kind).toBe("insufficient-material");
    const repeat = play(["Nf3", "Nf6", "Ng1", "Ng8", "Nf3", "Nf6", "Ng1", "Ng8"]);
    expect(gameStatus(repeat).kind).toBe("threefold-repetition");
  });

  it("lists legal targets", () => {
    expect(legalTargets(START_FEN, "g1").sort()).toEqual(["f3", "h3"]);
    expect(legalTargets(START_FEN, "e4")).toEqual([]);
  });

  it("numbers moves from any starting position", () => {
    expect(moveNumberAt(START_FEN, 0)).toEqual({ number: 1, color: "w" });
    expect(moveNumberAt(START_FEN, 3)).toEqual({ number: 2, color: "b" });
    expect(moveNumberAt("8/3k4/8/8/3K4/3P4/8/8 b - - 0 40", 0)).toEqual({ number: 40, color: "b" });
    expect(moveNumberAt("8/3k4/8/8/3K4/3P4/8/8 b - - 0 40", 1)).toEqual({ number: 41, color: "w" });
  });
});

describe("localizeSan", () => {
  it("translates piece letters to Spanish without touching files or castling", () => {
    expect(localizeSan("Nxe5+")).toBe("Cxe5+");
    expect(localizeSan("Qh4#")).toBe("Dh4#");
    expect(localizeSan("Rae1")).toBe("Tae1");
    expect(localizeSan("Bb5+")).toBe("Ab5+");
    expect(localizeSan("Kd6")).toBe("Rd6");
    expect(localizeSan("exd8=Q+")).toBe("exd8=D+");
    expect(localizeSan("O-O-O")).toBe("O-O-O");
    expect(localizeSan("Nf3", "en")).toBe("Nf3");
  });
});
