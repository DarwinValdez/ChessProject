"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  type GameState,
  type MoveInput,
  START_FEN,
  createGame,
  currentFen,
  gameStatus,
  goTo,
  lastMove,
  playMove,
} from "@/lib/chess/game";

/** React wrapper around the pure game-state helpers. */
export function useChessGame(initialFen: string = START_FEN) {
  const [state, setStateRaw] = useState<GameState>(() => createGame(initialFen));
  // Mirror of the latest state so move() can report legality synchronously.
  const ref = useRef(state);
  const setState = useCallback((next: GameState | ((prev: GameState) => GameState)) => {
    ref.current = typeof next === "function" ? next(ref.current) : next;
    setStateRaw(ref.current);
  }, []);

  const fen = currentFen(state);
  const status = useMemo(() => gameStatus(state), [state]);

  const move = useCallback(
    (input: MoveInput | string): boolean => {
      const result = playMove(ref.current, input);
      if (!result) return false;
      setState(result.state);
      return true;
    },
    [setState],
  );

  return {
    state,
    fen,
    status,
    lastMove: lastMove(state),
    canBack: state.cursor > 0,
    canForward: state.cursor < state.moves.length,
    move,
    goTo: useCallback((ply: number) => setState((prev) => goTo(prev, ply)), [setState]),
    back: useCallback(() => setState((prev) => goTo(prev, prev.cursor - 1)), [setState]),
    forward: useCallback(() => setState((prev) => goTo(prev, prev.cursor + 1)), [setState]),
    toStart: useCallback(() => setState((prev) => goTo(prev, 0)), [setState]),
    toEnd: useCallback(() => setState((prev) => goTo(prev, prev.moves.length)), [setState]),
    reset: useCallback(() => setState((prev) => createGame(prev.startFen)), [setState]),
    load: useCallback((next: GameState) => setState(next), [setState]),
  };
}
