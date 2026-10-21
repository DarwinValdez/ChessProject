"use client";

import clsx from "clsx";
import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChessBoard } from "@/components/board/ChessBoard";
import { sideToMove } from "@/lib/chess/game";
import type { Area, QuestionStep } from "@/lib/content/types";
import { elapsedSince } from "@/lib/progress/actions";
import { progressStore } from "@/lib/progress/store";
import type { StepOutcome, StepSlots } from "./types";

interface Props {
  step: QuestionStep;
  /** Position to show when the question has no board of its own. */
  fallbackFen: string;
  lessonId: string;
  area: Area;
  slots: StepSlots;
  onOutcome: (outcome: StepOutcome) => void;
}

export function QuestionStepView({ step, fallbackFen, lessonId, area, slots, onOutcome }: Props) {
  const [chosen, setChosen] = useState<string | null>(null);
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const fen = step.fen ?? fallbackFen;

  function choose(id: string) {
    if (chosen) return;
    setChosen(id);
    const correct = step.choices.find((c) => c.id === id)?.correct ?? false;
    progressStore.recordAttempt({
      lessonId,
      stepId: step.id,
      kind: "question",
      area,
      themes: step.themes,
      solved: correct,
      clean: correct,
      wrongMoves: correct ? 0 : 1,
      hintsUsed: 0,
      gaveUp: false,
      timeMs: elapsedSince(startedAt.current),
    });
    onOutcome({ solved: correct, clean: correct });
  }

  return (
    <>
      {slots.board(
        <ChessBoard id={`question-${step.id}`} fen={fen} orientation={sideToMove(fen) === "w" ? "white" : "black"} />,
      )}
      {slots.panel(
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-[15px] font-medium">{step.prompt}</legend>
          {step.choices.map((choice) => {
            const isChosen = chosen === choice.id;
            const reveal = chosen !== null && (isChosen || choice.correct);
            return (
              <div key={choice.id}>
                <button
                  type="button"
                  disabled={chosen !== null}
                  onClick={() => choose(choice.id)}
                  aria-pressed={isChosen}
                  className={clsx(
                    "flex w-full items-start gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-default",
                    !chosen && "border-border hover:border-border-strong hover:bg-surface-2",
                    reveal && choice.correct && "border-accent/50 bg-accent-soft",
                    isChosen && !choice.correct && "border-danger/50 bg-danger-soft",
                    chosen && !reveal && "border-border opacity-60",
                  )}
                >
                  {reveal ? (
                    choice.correct ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-label="Correcta" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-label="Incorrecta" />
                    )
                  ) : (
                    <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-border-strong" aria-hidden />
                  )}
                  <span>{choice.text}</span>
                </button>
                {reveal && <p className="mt-1.5 px-1 text-sm text-muted">{choice.feedback}</p>}
              </div>
            );
          })}
        </fieldset>,
      )}
    </>
  );
}
