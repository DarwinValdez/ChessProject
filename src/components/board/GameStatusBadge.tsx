import clsx from "clsx";
import { t } from "@/i18n";
import type { GameStatus } from "@/lib/chess/game";

const LABELS: Record<Exclude<GameStatus["kind"], "playing" | "check">, string> = {
  checkmate: t.board.checkmate,
  stalemate: t.board.stalemate,
  "insufficient-material": t.board.insufficient,
  "threefold-repetition": t.board.threefold,
  "fifty-move-rule": t.board.fiftyMove,
};

export function GameStatusBadge({ status }: { status: GameStatus }) {
  const toMove = status.turn === "w" ? t.board.whiteToMove : t.board.blackToMove;
  const text =
    status.kind === "playing" ? toMove : status.kind === "check" ? `${t.board.check} · ${toMove}` : LABELS[status.kind];
  return (
    <p className="flex items-center gap-2 text-sm" role="status" aria-live="polite">
      <span
        aria-hidden
        className={clsx(
          "h-3 w-3 rounded-full border border-border-strong",
          status.turn === "w" ? "bg-white" : "bg-neutral-900",
        )}
      />
      <span className={clsx(status.isGameOver ? "font-semibold text-text" : status.kind === "check" ? "text-danger" : "text-muted")}>
        {text}
      </span>
    </p>
  );
}
