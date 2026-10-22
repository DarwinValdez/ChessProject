"use client";

import { BoardControls } from "@/components/board/BoardControls";
import { ChessBoard } from "@/components/board/ChessBoard";
import { MoveList } from "@/components/board/MoveList";
import { useLinePlayer } from "@/hooks/useLinePlayer";
import { sideToMove } from "@/lib/chess/game";
import type { ExplainStep } from "@/lib/content/types";
import type { StepSlots } from "./types";

const EMPTY: never[] = [];

export function ExplainStepView({ step, slots }: { step: ExplainStep; slots: StepSlots }) {
  const player = useLinePlayer(step.fen, step.line ?? EMPTY);
  const { moves, cursor, current, go } = player;
  const orientation = moves.length > 0 && step.fen.startsWith("rnbqkbnr/pppppppp") ? "white" : sideToMove(step.fen) === "w" ? "white" : "black";

  return (
    <>
      {slots.board(
        <>
          <ChessBoard
            id={`explain-${step.id}`}
            fen={player.fen}
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
                canBack={player.canBack}
                canForward={player.canForward}
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
