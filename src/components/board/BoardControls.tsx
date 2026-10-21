"use client";

import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, FlipVertical2, RotateCcw } from "lucide-react";
import { t } from "@/i18n";

interface BoardControlsProps {
  onStart: () => void;
  onBack: () => void;
  onForward: () => void;
  onEnd: () => void;
  onFlip?: () => void;
  onReset?: () => void;
  canBack: boolean;
  canForward: boolean;
}

export function BoardControls(p: BoardControlsProps) {
  return (
    <div className="flex items-center justify-between gap-1" role="toolbar" aria-label="Controles del tablero">
      <div className="flex items-center gap-1">
        {p.onFlip && (
          <button type="button" className="icon-btn" onClick={p.onFlip} title={t.board.flip} aria-label={t.board.flip}>
            <FlipVertical2 className="h-4 w-4" />
          </button>
        )}
        {p.onReset && (
          <button type="button" className="icon-btn" onClick={p.onReset} title={t.board.reset} aria-label={t.board.reset}>
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button type="button" className="icon-btn" onClick={p.onStart} disabled={!p.canBack} title={t.board.start} aria-label={t.board.start}>
          <ChevronFirst className="h-5 w-5" />
        </button>
        <button type="button" className="icon-btn" onClick={p.onBack} disabled={!p.canBack} title={t.board.back} aria-label={t.board.back}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" className="icon-btn" onClick={p.onForward} disabled={!p.canForward} title={t.board.forward} aria-label={t.board.forward}>
          <ChevronRight className="h-5 w-5" />
        </button>
        <button type="button" className="icon-btn" onClick={p.onEnd} disabled={!p.canForward} title={t.board.end} aria-label={t.board.end}>
          <ChevronLast className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
