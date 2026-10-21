"use client";

/**
 * Interactive 2D board. Rendering is delegated to react-chessboard; all
 * legality decisions go through lib/chess (chess.js). Supports drag & drop,
 * click-to-move with legal-destination hints, promotion choice, arrows and
 * highlighted squares. Swapping the rendering library only touches this file.
 */
import { type CSSProperties, useMemo, useState } from "react";
import { Chessboard, defaultPieces } from "react-chessboard";
import { t } from "@/i18n";
import {
  type Color,
  type MoveInput,
  type PromotionPiece,
  checkedKingSquare,
  isPromotion,
  legalTargets,
  sideToMove,
} from "@/lib/chess/game";
import type { Arrow } from "@/lib/content/types";

export interface ChessBoardProps {
  fen: string;
  orientation?: "white" | "black";
  /** Which side the user may move; false makes the board read-only. */
  movable?: Color | "both" | false;
  /** Called with a move the user tried. Return true if it was accepted. */
  onMove?: (move: MoveInput) => boolean;
  lastMove?: { from: string; to: string };
  arrows?: Arrow[];
  highlights?: string[];
  /** Briefly marks a square as wrong (e.g. failed exercise move). */
  errorSquare?: string;
  id?: string;
  ariaLabel?: string;
}

const ARROW_COLORS: Record<NonNullable<Arrow["tone"]>, string> = {
  idea: "rgb(47 125 79 / 0.85)",
  threat: "rgb(190 70 50 / 0.85)",
  alternative: "rgb(61 115 184 / 0.85)",
};

const PROMOTION_PIECES: PromotionPiece[] = ["q", "r", "b", "n"];
const PIECE_NAMES: Record<PromotionPiece, string> = { q: "Dama", r: "Torre", b: "Alfil", n: "Caballo" };

function canMoveColor(movable: ChessBoardProps["movable"], color: Color): boolean {
  return movable === "both" || movable === color;
}

export function ChessBoard({
  fen,
  orientation = "white",
  movable = false,
  onMove,
  lastMove,
  arrows,
  highlights,
  errorSquare,
  id = "board",
  ariaLabel,
}: ChessBoardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string } | null>(null);
  const [lastFen, setLastFen] = useState(fen);
  const turn = sideToMove(fen);
  const interactive = Boolean(onMove) && canMoveColor(movable, turn);

  // Drop the selection when the position changes from outside.
  if (fen !== lastFen) {
    setLastFen(fen);
    setSelected(null);
    setPendingPromotion(null);
  }

  const targets = useMemo(() => (selected ? legalTargets(fen, selected) : []), [fen, selected]);
  const checkSquare = useMemo(() => checkedKingSquare(fen), [fen]);

  function attempt(from: string, to: string): boolean {
    if (!onMove) return false;
    if (isPromotion(fen, from, to)) {
      setPendingPromotion({ from, to });
      setSelected(null);
      // The pawn stays on its square until a piece is chosen; the move then
      // arrives as a normal position change.
      return false;
    }
    const accepted = onMove({ from, to });
    setSelected(null);
    return accepted;
  }

  function ownPieceAt(pieceType: string | undefined): boolean {
    return Boolean(pieceType && pieceType[0] === turn);
  }

  const squareStyles = useMemo(() => {
    const styles: Record<string, CSSProperties> = {};
    const add = (sq: string, style: CSSProperties) => {
      styles[sq] = { ...styles[sq], ...style };
    };
    for (const sq of highlights ?? []) add(sq, { boxShadow: "inset 0 0 0 100px var(--board-mark)" });
    if (lastMove) {
      add(lastMove.from, { backgroundColor: "var(--board-last)" });
      add(lastMove.to, { backgroundColor: "var(--board-last)" });
    }
    if (checkSquare) add(checkSquare, { background: "radial-gradient(circle, var(--board-check) 0%, transparent 72%)" });
    if (selected) add(selected, { backgroundColor: "var(--board-selected)" });
    for (const sq of targets) {
      add(sq, { background: "radial-gradient(circle, var(--board-hint) 22%, transparent 24%)", cursor: "pointer" });
    }
    if (errorSquare) add(errorSquare, { boxShadow: "inset 0 0 0 4px rgb(200 50 40 / 0.8)" });
    return styles;
  }, [highlights, lastMove, checkSquare, selected, targets, errorSquare]);

  const boardArrows = useMemo(
    () => (arrows ?? []).map((a) => ({ startSquare: a.from, endSquare: a.to, color: ARROW_COLORS[a.tone ?? "idea"] })),
    [arrows],
  );

  const promotionColor = turn;

  return (
    <div className="relative w-full select-none" role="group" aria-label={ariaLabel ?? "Tablero de ajedrez"}>
      <Chessboard
        options={{
          id,
          position: fen,
          boardOrientation: orientation,
          allowDragging: interactive,
          canDragPiece: ({ piece }) => interactive && ownPieceAt(piece.pieceType),
          onPieceDrop: ({ sourceSquare, targetSquare }) => {
            if (!targetSquare || sourceSquare === targetSquare) return false;
            return attempt(sourceSquare, targetSquare);
          },
          onSquareClick: ({ square, piece }) => {
            if (!interactive) return;
            if (selected && targets.includes(square as never)) {
              attempt(selected, square);
              return;
            }
            if (ownPieceAt(piece?.pieceType)) setSelected(square === selected ? null : square);
            else setSelected(null);
          },
          squareStyles,
          arrows: boardArrows,
          clearArrowsOnPositionChange: true,
          animationDurationInMs: 180,
          lightSquareStyle: { backgroundColor: "var(--board-light)" },
          darkSquareStyle: { backgroundColor: "var(--board-dark)" },
          darkSquareNotationStyle: { color: "var(--board-light)", fontWeight: 600 },
          lightSquareNotationStyle: { color: "var(--board-dark)", fontWeight: 600 },
          boardStyle: { borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgb(0 0 0 / 0.15)" },
        }}
      />

      {pendingPromotion && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/45"
          role="dialog"
          aria-modal="true"
          aria-label={t.board.promotion}
        >
          <div className="card flex flex-col items-center gap-3 p-4">
            <p className="text-sm font-medium">{t.board.promotion}</p>
            <div className="flex gap-2">
              {PROMOTION_PIECES.map((p) => {
                const key = `${promotionColor}${p.toUpperCase()}`;
                const Piece = defaultPieces[key];
                return (
                  <button
                    key={p}
                    type="button"
                    autoFocus={p === "q"}
                    className="h-14 w-14 rounded-lg border border-border bg-surface-2 p-1 hover:border-accent hover:bg-accent-soft"
                    aria-label={PIECE_NAMES[p]}
                    title={PIECE_NAMES[p]}
                    onClick={() => {
                      const move = pendingPromotion;
                      setPendingPromotion(null);
                      onMove?.({ ...move, promotion: p });
                    }}
                  >
                    {Piece?.()}
                  </button>
                );
              })}
            </div>
            <button type="button" className="btn-ghost text-xs" onClick={() => setPendingPromotion(null)}>
              {t.board.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
