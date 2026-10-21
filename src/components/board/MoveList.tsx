"use client";

import clsx from "clsx";
import { useEffect, useRef } from "react";
import { t } from "@/i18n";
import { type MoveRecord, moveNumberAt } from "@/lib/chess/game";
import { localizeSan } from "@/lib/chess/notation";

interface MoveListProps {
  startFen: string;
  moves: Pick<MoveRecord, "san">[];
  cursor: number;
  onSelect?: (ply: number) => void;
  /** Optional comment per ply (index into moves). */
  comments?: (string | undefined)[];
  className?: string;
}

/** Moves in two columns (white/black), clickable to jump to a position. */
export function MoveList({ startFen, moves, cursor, onSelect, className }: MoveListProps) {
  const activeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  if (moves.length === 0) return <p className={clsx("text-sm text-faint", className)}>{t.board.noMoves}</p>;

  const rows: { number: number; white?: number; black?: number }[] = [];
  moves.forEach((_, i) => {
    const { number, color } = moveNumberAt(startFen, i);
    let row = rows[rows.length - 1];
    if (!row || row.number !== number) {
      row = { number };
      rows.push(row);
    }
    row[color === "w" ? "white" : "black"] = i;
  });

  const cell = (ply: number | undefined) => {
    if (ply === undefined) return <span className="px-2 py-1 text-faint">…</span>;
    const active = ply + 1 === cursor;
    return (
      <button
        type="button"
        ref={active ? activeRef : undefined}
        onClick={() => onSelect?.(ply + 1)}
        aria-current={active ? "step" : undefined}
        className={clsx(
          "rounded px-2 py-1 text-left font-mono text-[13px] transition-colors",
          active ? "bg-accent-soft font-semibold text-text" : "text-muted hover:bg-surface-2 hover:text-text",
        )}
      >
        {localizeSan(moves[ply].san)}
      </button>
    );
  };

  return (
    <ol className={clsx("grid grid-cols-[2.5rem_1fr_1fr] gap-y-0.5 text-sm", className)} aria-label="Jugadas">
      {rows.map((row) => (
        <li key={row.number} className="contents">
          <span className="py-1 pr-2 text-right font-mono text-[13px] text-faint">{row.number}.</span>
          {cell(row.white)}
          {cell(row.black)}
        </li>
      ))}
    </ol>
  );
}
