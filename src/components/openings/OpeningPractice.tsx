"use client";

import clsx from "clsx";
import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { type ReactNode, useState } from "react";
import { ExerciseStepView } from "@/components/lesson/ExerciseStepView";
import { QuestionStepView } from "@/components/lesson/QuestionStepView";
import type { StepOutcome, StepSlots } from "@/components/lesson/types";
import { openingUnitId } from "@/lib/content/openings";
import { fenAfter, sans } from "@/lib/content/openings/helpers";
import type { Opening } from "@/lib/content/openings/types";
import { progressStore } from "@/lib/progress/store";

/**
 * The opening's comprehension checks, played like a lesson: attempts are
 * recorded under the opening's study unit, which feeds mastery, reviews
 * and the dashboard.
 */
export function OpeningPractice({ opening }: { opening: Opening }) {
  const unitId = openingUnitId(opening.slug);
  const [index, setIndex] = useState<number | null>(null);
  const [outcomes, setOutcomes] = useState<Record<string, StepOutcome>>({});
  const [finished, setFinished] = useState(false);
  const steps = opening.exercises;
  // Questions without their own diagram show the end of the main line.
  const fallbackFen = fenAfter(sans(opening.mainLine.moves));

  function start() {
    setOutcomes({});
    setFinished(false);
    setIndex(0);
    progressStore.visitLesson(unitId, 0);
  }

  function next() {
    if (index === null) return;
    if (index + 1 < steps.length) {
      setIndex(index + 1);
      progressStore.visitLesson(unitId, index + 1);
    } else {
      progressStore.completeLesson(unitId);
      setFinished(true);
    }
  }

  const step = index !== null ? steps[index] : null;
  const slots: StepSlots = {
    board: (node: ReactNode) => <div className="mx-auto w-full max-w-[min(100%,calc(100dvh-14rem))]">{node}</div>,
    panel: (node: ReactNode) => (
      <div className="flex flex-col gap-4">
        {node}
        {step && outcomes[step.id] && (
          <button type="button" className="btn-primary w-fit" onClick={next}>
            {index! + 1 < steps.length ? "Siguiente" : "Terminar"} <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    ),
  };
  const record = (o: StepOutcome) => step && setOutcomes((prev) => ({ ...prev, [step.id]: o }));
  const clean = Object.values(outcomes).filter((o) => o.clean).length;

  return (
    <section id="practica" className="card scroll-mt-4 p-5" aria-label="Práctica">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold tracking-tight">Comprueba tu comprensión</h2>
          <p className="text-sm text-muted">
            {steps.length} {steps.length === 1 ? "ejercicio" : "ejercicios"}. Cuentan para el dominio de la apertura y para tus repasos.
          </p>
        </div>
        {index !== null && !finished && (
          <ol className="flex gap-1" aria-label="Progreso">
            {steps.map((s, i) => (
              <li
                key={s.id}
                className={clsx(
                  "h-2 w-5 rounded-full",
                  i === index ? "bg-text" : outcomes[s.id] ? (outcomes[s.id].clean ? "bg-accent" : "bg-warn") : "bg-surface-3",
                )}
              />
            ))}
          </ol>
        )}
      </div>

      {index === null && (
        <button type="button" className="btn-primary" onClick={start}>
          Empezar práctica
        </button>
      )}

      {finished && (
        <div className="flex flex-col items-start gap-3 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-5 w-5 text-accent" aria-hidden /> Práctica terminada: {clean} de {steps.length} sin errores ni pistas.
          </p>
          <p className="text-muted">La apertura cuenta como dominada provisionalmente cuando resuelves todo sin errores en dos días distintos.</p>
          <button type="button" className="btn-secondary" onClick={start}>
            <RotateCcw className="h-4 w-4" /> Repetir
          </button>
        </div>
      )}

      {step && !finished && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {step.kind === "exercise" ? (
            <ExerciseStepView key={step.id} step={step} lessonId={unitId} area="aperturas" slots={slots} onOutcome={record} />
          ) : (
            <QuestionStepView key={step.id} step={step} fallbackFen={fallbackFen} lessonId={unitId} area="aperturas" slots={slots} onOutcome={record} />
          )}
        </div>
      )}
    </section>
  );
}
