"use client";

import { useMemo, useState } from "react";
import { type MoveRecord, moveFromFen } from "@/lib/chess/game";
import type { AnnotatedMove } from "@/lib/content/types";
import { useBoardKeys } from "./useBoardKeys";

export interface PlayedMove extends AnnotatedMove {
  record: MoveRecord;
}

/**
 * Step-through player for a predetermined (validated) line: positions,
 * cursor, keyboard navigation and the move at the cursor.
 */
export function useLinePlayer(startFen: string, line: AnnotatedMove[], initialCursor = 0, keys = true) {
  const { fens, moves } = useMemo(() => {
    const fenList = [startFen];
    const played: PlayedMove[] = [];
    for (const move of line) {
      const record = moveFromFen(fenList[fenList.length - 1], move.san);
      if (!record) break;
      played.push({ ...move, record });
      fenList.push(record.fenAfter);
    }
    return { fens: fenList, moves: played };
  }, [startFen, line]);

  const [cursor, setCursor] = useState(Math.min(initialCursor, moves.length));
  const go = (ply: number) => setCursor(Math.max(0, Math.min(moves.length, ply)));
  useBoardKeys(
    keys ? { back: () => go(cursor - 1), forward: () => go(cursor + 1), start: () => go(0), end: () => go(moves.length) } : {},
  );

  return {
    fen: fens[cursor],
    moves,
    cursor,
    current: cursor > 0 ? moves[cursor - 1] : undefined,
    go,
    canBack: cursor > 0,
    canForward: cursor < moves.length,
  };
}
