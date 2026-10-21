"use client";

import { Eye, Lightbulb, RotateCcw, StepForward } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChessBoard } from "@/components/board/ChessBoard";
import { ResultTag } from "@/components/ui/Meta";
import { type MoveInput, type MoveRecord, moveFromFen, sideToMove } from "@/lib/chess/game";
import { localizeSan } from "@/lib/chess/notation";
import type { Area, ExerciseStep } from "@/lib/content/types";
import {
  type ExerciseState,
  applyReply,
  canRevealSolution,
  outcome,
  solutionLine,
  startExercise,
  submitMove,
  takeHint,
} from "@/lib/lesson/exercise";
import { elapsedSince } from "@/lib/progress/actions";
import { progressStore } from "@/lib/progress/store";
import { Feedback, type FeedbackTone } from "./Feedback";
import type { StepOutcome, StepSlots } from "./types";

const REPLY_DELAY_MS = 450;

interface Props {
  step: ExerciseStep;
  lessonId: string;
  area: Area;
  slots: StepSlots;
  onOutcome: (outcome: StepOutcome) => void;
}

export function ExerciseStepView({ step, lessonId, area, slots, onOutcome }: Props) {
  const [state, setState] = useState<ExerciseState>(() => startExercise(step));
  const [lastMove, setLastMove] = useState<MoveRecord | undefined>();
  const [feedback, setFeedback] = useState<{ tone: FeedbackTone; text: string } | null>(null);
  const [errorSquare, setErrorSquare] = useState<string | undefined>();
  const [revealed, setRevealed] = useState<number | null>(null); // plies of the solution shown
  const startedAt = useRef(0);
  const recorded = useRef(false);
  const userColor = sideToMove(step.fen);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const solution = useMemo(() => solutionLine(step), [step]);
  const solutionFens = useMemo(() => {
    const fens = [step.fen];
    const moves: MoveRecord[] = [];
    for (const san of solution) {
      const m = moveFromFen(fens[fens.length - 1], san);
      if (!m) break;
      moves.push(m);
      fens.push(m.fenAfter);
    }
    return { fens, moves };
  }, [step.fen, solution]);

  function record(final: ExerciseState, gaveUp: boolean) {
    if (recorded.current) return;
    recorded.current = true;
    const result = outcome(final, gaveUp);
    progressStore.recordAttempt({
      lessonId,
      stepId: step.id,
      kind: "exercise",
      area,
      themes: step.themes,
      difficulty: step.difficulty,
      solved: result.solved,
      clean: result.clean,
      wrongMoves: result.wrongMoves,
      hintsUsed: result.hintsUsed,
      gaveUp: result.gaveUp,
      timeMs: elapsedSince(startedAt.current),
    });
    onOutcome({ solved: result.solved, clean: result.clean });
  }

  // Play the scripted opponent reply after a short pause.
  useEffect(() => {
    if (state.status !== "awaiting-reply") return;
    const timer = window.setTimeout(() => {
      const { state: next, move } = applyReply(state);
      setState(next);
      if (move) setLastMove(move);
      if (next.status === "solved") record(next, false);
    }, REPLY_DELAY_MS);
    return () => window.clearTimeout(timer);
    // record is stable for the lifetime of this step view
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function handleMove(input: MoveInput): boolean {
    const result = submitMove(state, step, input);
    if (result.kind === "illegal") return false;
    setState(result.state);
    if (result.kind === "wrong") {
      setErrorSquare(result.move.to);
      window.setTimeout(() => setErrorSquare(undefined), 900);
      setFeedback({
        tone: "error",
        text: result.feedback ?? `${localizeSan(result.move.san)} no es la jugada que buscamos. Revisa el objetivo y vuelve a intentarlo.`,
      });
      return false;
    }
    setLastMove(result.move);
    setErrorSquare(undefined);
    if (result.state.status === "solved") {
      setFeedback({ tone: "success", text: "¡Correcto!" });
      record(result.state, false);
    } else {
      setFeedback({ tone: "success", text: `${localizeSan(result.move.san)}: bien. Sigue.` });
    }
    return true;
  }

  function reveal() {
    record(state, true);
    setRevealed(0);
    setFeedback(null);
  }

  function retry() {
    recorded.current = false;
    startedAt.current = Date.now();
    setState(startExercise(step));
    setLastMove(undefined);
    setFeedback(null);
    setRevealed(null);
  }

  const solved = state.status === "solved";
  const showingSolution = revealed !== null;
  const boardFen = showingSolution ? solutionFens.fens[revealed] : state.fen;
  const boardLast = showingSolution ? (revealed > 0 ? solutionFens.moves[revealed - 1] : undefined) : lastMove;

  return (
    <>
      {slots.board(
        <ChessBoard
          id={`exercise-${step.id}`}
          fen={boardFen}
          orientation={userColor === "w" ? "white" : "black"}
          movable={!solved && !showingSolution && state.status === "solving" ? userColor : false}
          onMove={handleMove}
          lastMove={boardLast}
          errorSquare={errorSquare}
          ariaLabel="Tablero del ejercicio"
        />,
      )}
      {slots.panel(
        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">Dificultad {step.difficulty}/5</span>
              {step.result && <ResultTag result={step.result} />}
            </div>
            <p className="text-[15px] font-medium">{step.prompt}</p>
            <p className="mt-1 text-sm text-faint">
              Juegas con {userColor === "w" ? "blancas" : "negras"}. Arrastra la pieza o haz clic en origen y destino.
            </p>
          </div>

          {feedback && <Feedback tone={feedback.tone}>{feedback.text}</Feedback>}

          {state.hintsUsed > 0 && !solved && !showingSolution && (
            <ol className="flex flex-col gap-2">
              {step.hints.slice(0, state.hintsUsed).map((hint, i) => (
                <li key={hint} className="flex gap-2 rounded-lg bg-warn-soft p-3 text-sm">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warn" aria-hidden />
                  <span>
                    <span className="sr-only">Pista {i + 1}: </span>
                    {hint}
                  </span>
                </li>
              ))}
            </ol>
          )}

          {(solved || showingSolution) && (
            <div className="rounded-lg border border-border p-3 text-sm leading-relaxed">
              <p className="label mb-1.5">Explicación</p>
              <p className="text-muted">{step.explanation}</p>
            </div>
          )}

          {showingSolution && (
            <div className="flex flex-col gap-2">
              <p className="text-sm">
                Solución:{" "}
                <span className="font-mono">
                  {solutionFens.moves.map((m, i) => (
                    <span key={i} className={i < revealed ? "text-text" : "text-faint"}>
                      {localizeSan(m.san)}{" "}
                    </span>
                  ))}
                </span>
              </p>
              <button
                type="button"
                className="btn-secondary w-fit"
                onClick={() => setRevealed((r) => Math.min((r ?? 0) + 1, solutionFens.moves.length))}
                disabled={revealed >= solutionFens.moves.length}
              >
                <StepForward className="h-4 w-4" /> {revealed === 0 ? "Mostrar la primera jugada" : "Siguiente jugada"}
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {!solved && !showingSolution && (
              <>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setState((s) => takeHint(s, step))}
                  disabled={state.hintsUsed >= step.hints.length}
                >
                  <Lightbulb className="h-4 w-4" /> Pista ({state.hintsUsed}/{step.hints.length})
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={reveal}
                  disabled={!canRevealSolution(state)}
                  title={canRevealSolution(state) ? undefined : "Disponible después de intentarlo al menos una vez"}
                >
                  <Eye className="h-4 w-4" /> Ver solución
                </button>
              </>
            )}
            {(solved || showingSolution) && (
              <button type="button" className="btn-ghost" onClick={retry}>
                <RotateCcw className="h-4 w-4" /> Repetir la posición
              </button>
            )}
          </div>
          {!solved && !showingSolution && !canRevealSolution(state) && (
            <p className="text-xs text-faint">La solución se puede ver después de intentarlo. Las pistas y los errores cuentan para medir el dominio.</p>
          )}
        </div>,
      )}
    </>
  );
}
