"use client";

import { useMemo, useState } from "react";
import { BoardControls } from "@/components/board/BoardControls";
import { ChessBoard } from "@/components/board/ChessBoard";
import { MoveList } from "@/components/board/MoveList";
import { useBoardKeys } from "@/hooks/useBoardKeys";
import { moveFromFen, sideToMove } from "@/lib/chess/game";
import type { ExplainStep } from "@/lib/content/types";
import type { StepSlots } from "./types";

export function ExplainStepView({ step, slots }: { step: ExplainStep; slots: StepSlots }) {
  const line = useMemo(() => step.line ?? [], [step.line]);
  // Positions after each move of the line (validated content, so moves are legal).
  const fens = useMemo(() => {
    const list = [step.fen];
    for (const m of line) {
      const next = moveFromFen(list[list.length - 1], m.san);
      if (!next) break;
      list.push(next.fenAfter);
    }
    return list;
  }, [step.fen, line]);
  const moves = useMemo(() => line.slice(0, fens.length - 1).map((m, i) => ({ ...m, record: moveFromFen(fens[i], m.san)! })), [line, fens]);

  const [cursor, setCursor] = useState(0);
  const go = (ply: number) => setCursor(Math.max(0, Math.min(moves.length, ply)));
  useBoardKeys({ back: () => go(cursor - 1), forward: () => go(cursor + 1), start: () => go(0), end: () => go(moves.length) });

  const current = cursor > 0 ? moves[cursor - 1] : undefined;
  const orientation = line.length > 0 ? "white" : sideToMove(step.fen) === "w" ? "white" : "black";

  return (
    <>
      {slots.board(
        <>
          <ChessBoard
            id={`explain-${step.id}`}
            fen={fens[cursor]}
            orientation={orientation}
            lastMove={current?.record}
            arrows={cursor === 0 ? step.arrows : current?.arrows}
            highlights={cursor === 0 ? step.highlights : current?.highlights}
          />
          {moves.length > 0 && (
            <div className="mt-3">
              <BoardControls
                onStart={() => go(0)}
                onBack={() => go(cursor - 1)}
                onForward={() => go(cursor + 1)}
                onEnd={() => go(moves.length)}
                canBack={cursor > 0}
                canForward={cursor < moves.length}
              />
            </div>
          )}
        </>,
      )}
      {slots.panel(
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-muted">
            {step.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {moves.length > 0 && (
            <>
              <div className="min-h-16 rounded-lg border border-border bg-surface-2 p-3 text-sm" aria-live="polite">
                {current ? (
                  current.comment ?? <span className="text-faint">Sin comentario en esta jugada.</span>
                ) : (
                  <span className="text-faint">Pulsa → (o el botón de avanzar) para reproducir la línea.</span>
                )}
              </div>
              <div className="max-h-48 overflow-y-auto">
                <MoveList startFen={step.fen} moves={moves} cursor={cursor} onSelect={go} />
              </div>
            </>
          )}
        </div>,
      )}
    </>
  );
}
