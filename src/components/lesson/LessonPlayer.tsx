"use client";

import clsx from "clsx";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, ListOrdered, Target } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { START_FEN } from "@/lib/chess/game";
import { CourseSyllabus } from "@/components/catalog/CourseSyllabus";
import { ResultTag, SourceTag } from "@/components/ui/Meta";
import { StateBadge } from "@/components/ui/StateBadge";
import { useStudyTimer } from "@/hooks/useStudyTimer";
import { courseLessons, lessonId as makeLessonId } from "@/lib/content/catalog";
import type { Course, LessonStep } from "@/lib/content/types";
import { lessonMastery } from "@/lib/progress/mastery";
import type { ProgressData } from "@/lib/progress/schema";
import { progressStore, useProgress } from "@/lib/progress/store";
import { ExerciseStepView } from "./ExerciseStepView";
import { ExplainStepView } from "./ExplainStepView";
import { QuestionStepView } from "./QuestionStepView";
import type { StepOutcome, StepSlots } from "./types";

const STEP_KIND_LABEL: Record<LessonStep["kind"], string> = {
  explain: "Explicación",
  exercise: "Ejercicio",
  question: "Comprobación",
};

function isGraded(step: LessonStep) {
  return step.kind !== "explain";
}

/** Board of the closest step at or before `index`, for questions without their own position. */
function closestFen(steps: LessonStep[], index: number): string {
  for (let i = index; i >= 0; i--) {
    const fen = steps[i].fen;
    if (fen) return fen;
  }
  return START_FEN;
}

export function LessonPlayer({ course, lessonSlug }: { course: Course; lessonSlug: string }) {
  const data = useProgress();
  if (!data) {
    return <div className="mx-auto mt-10 h-96 w-full max-w-5xl animate-pulse rounded-xl bg-surface-2" aria-label="Cargando lección" />;
  }
  return <LessonPlayerReady key={lessonSlug} course={course} lessonSlug={lessonSlug} initialData={data} />;
}

function LessonPlayerReady({ course, lessonSlug, initialData }: { course: Course; lessonSlug: string; initialData: ProgressData }) {
  const lessons = courseLessons(course);
  const ref = lessons.find((r) => r.lesson.slug === lessonSlug)!;
  const { lesson } = ref;
  const id = makeLessonId(course.slug, lesson.slug);
  const data = useProgress() ?? initialData;

  // Resume where the student left off, unless the lesson was already completed.
  const [stepIndex, setStepIndex] = useState(() => {
    const saved = initialData.lessons[id];
    return saved && !saved.completedAt ? Math.min(saved.lastStepIndex, lesson.steps.length - 1) : 0;
  });
  const [outcomes, setOutcomes] = useState<Record<string, StepOutcome>>({});
  const [finished, setFinished] = useState(false);

  useStudyTimer(course.area);

  useEffect(() => {
    progressStore.visitLesson(id, stepIndex);
  }, [id, stepIndex]);

  const step = lesson.steps[stepIndex];
  const stepDone = !isGraded(step) || outcomes[step.id] !== undefined;
  const isLast = stepIndex === lesson.steps.length - 1;
  const gradedSteps = lesson.steps.filter(isGraded);
  const allGradedDone = gradedSteps.every((s) => outcomes[s.id] !== undefined);
  const next = lessons[ref.index + 1];
  const [now] = useState(() => new Date());
  const mastery = lessonMastery(id, lesson, data, now);
  const fallbackFen = closestFen(lesson.steps, stepIndex);

  function goToStep(i: number) {
    setFinished(false);
    setStepIndex(Math.max(0, Math.min(lesson.steps.length - 1, i)));
  }

  function finish() {
    progressStore.completeLesson(id);
    setFinished(true);
  }

  const setOutcome = (outcome: StepOutcome) => setOutcomes((o) => ({ ...o, [step.id]: outcome }));

  const cleanCount = gradedSteps.filter((s) => outcomes[s.id]?.clean).length;

  // Each step view renders once and places its board and its coach content
  // into these two columns (grid cells, thanks to the display:contents wrapper).
  const slots: StepSlots = {
    board: (node: ReactNode) => (
      <section className="order-1 xl:order-2" aria-label="Tablero">
        <div className="mb-3 flex items-center gap-2 text-sm text-muted">
          <Link href={`/cursos/${course.slug}`} className="inline-flex items-center gap-1 hover:text-text">
            <ChevronLeft className="h-4 w-4" aria-hidden /> {course.title}
          </Link>
        </div>
        <div className="mx-auto w-full max-w-[min(100%,calc(100dvh-10rem))]">{node}</div>
      </section>
    ),
    panel: (node: ReactNode) => renderCoachColumn(node),
  };

  const stepView = (() => {
    switch (step.kind) {
      case "explain":
        return <ExplainStepView key={step.id} step={step} slots={slots} />;
      case "exercise":
        return <ExerciseStepView key={step.id} step={step} lessonId={id} area={course.area} slots={slots} onOutcome={setOutcome} />;
      case "question":
        return (
          <QuestionStepView
            key={step.id}
            step={step}
            fallbackFen={fallbackFen}
            lessonId={id}
            area={course.area}
            slots={slots}
            onOutcome={setOutcome}
          />
        );
    }
  })();


  // A render function (not a component) so the panel content keeps its DOM state.
  function renderCoachColumn(children: ReactNode) {
    return (
      <aside className="order-2 flex flex-col gap-4 xl:order-3" aria-label="Explicación del entrenador">
        <div className="card p-5">
          <div className="flex flex-wrap items-center gap-2">
            <StateBadge state={mastery.state} title={mastery.reason} />
            {lesson.result && <ResultTag result={lesson.result} />}
            <SourceTag source={lesson.source} />
          </div>
          <h1 className="mt-2 text-xl font-semibold tracking-tight">{lesson.title}</h1>
          <p className="mt-2 flex gap-2 text-sm text-muted">
            <Target className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
            <span>
              <span className="font-medium text-text">Objetivo: </span>
              {lesson.objective}
            </span>
          </p>
          <p className="mt-2 rounded-lg bg-surface-2 p-3 text-sm">
            <span className="label mb-1 block">Idea clave</span>
            {lesson.concept}
          </p>
        </div>

        <div className="card flex flex-col gap-4 p-5">
          <nav aria-label="Pasos de la lección" className="flex items-center justify-between gap-3">
            <div>
              <p className="label">
                Paso {stepIndex + 1} de {lesson.steps.length} · {STEP_KIND_LABEL[step.kind]}
              </p>
              <h2 className="mt-0.5 font-semibold">{finished ? "Lección terminada" : step.title}</h2>
            </div>
            <ol className="flex gap-1">
              {lesson.steps.map((s, i) => {
                const o = outcomes[s.id];
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => goToStep(i)}
                      aria-label={`Paso ${i + 1}: ${s.title}`}
                      aria-current={i === stepIndex ? "step" : undefined}
                      className={clsx(
                        "h-2 w-5 rounded-full transition-colors",
                        i === stepIndex
                          ? "bg-text"
                          : o
                            ? o.clean
                              ? "bg-accent"
                              : "bg-warn"
                            : "bg-surface-3 hover:bg-border-strong",
                      )}
                    />
                  </li>
                );
              })}
            </ol>
          </nav>

          {finished ? (
            <div className="flex flex-col gap-3 text-sm">
              <p className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-5 w-5 text-accent" aria-hidden /> Has terminado la lección.
              </p>
              <p className="text-muted">
                {gradedSteps.length > 0 &&
                  `Resueltos sin errores ni pistas: ${cleanCount} de ${gradedSteps.length}. `}
                {mastery.state === "dominado-provisional"
                  ? mastery.reason
                  : "Para darla por dominada tendrás que resolverla de nuevo sin errores otro día: así medimos la retención, no solo que la hayas completado."}
              </p>
              <div className="flex flex-wrap gap-2">
                {next ? (
                  <Link href={`/cursos/${course.slug}/${next.lesson.slug}`} className="btn-primary">
                    Siguiente lección <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link href={`/cursos/${course.slug}`} className="btn-primary">
                    Volver al curso
                  </Link>
                )}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setOutcomes({});
                    goToStep(0);
                  }}
                >
                  Repetir lección
                </button>
              </div>
            </div>
          ) : (
            children
          )}

          {!finished && (
            <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
              <button type="button" className="btn-ghost" onClick={() => goToStep(stepIndex - 1)} disabled={stepIndex === 0}>
                <ArrowLeft className="h-4 w-4" /> Anterior
              </button>
              {isLast ? (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={finish}
                  disabled={!allGradedDone}
                  title={allGradedDone ? undefined : "Completa los ejercicios y preguntas de la lección"}
                >
                  Terminar lección
                </button>
              ) : (
                <button
                  type="button"
                  className={stepDone ? "btn-primary" : "btn-secondary"}
                  onClick={() => goToStep(stepIndex + 1)}
                  disabled={!stepDone}
                  title={stepDone ? undefined : "Resuelve el paso (o consulta la solución tras intentarlo) para continuar"}
                >
                  Siguiente <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-[1500px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[15rem_minmax(0,1fr)_23rem] xl:gap-6">
      {/* LEFT: syllabus */}
      <aside className="order-3 xl:order-1" aria-label="Temario del curso">
        <details className="card group p-3 xl:sticky xl:top-5" open>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-2 py-1 xl:pointer-events-none">
            <span className="flex items-center gap-2 text-sm font-medium">
              <ListOrdered className="h-4 w-4 text-faint" aria-hidden /> Temario
            </span>
            <Link href={`/cursos/${course.slug}`} className="pointer-events-auto text-xs text-muted hover:text-text">
              Ver curso
            </Link>
          </summary>
          <p className="mt-1 px-2 text-xs text-faint">{course.title}</p>
          <div className="mt-4">
            <CourseSyllabus course={course} currentLesson={lesson.slug} compact />
          </div>
        </details>
      </aside>

      <div className="contents">{stepView}</div>
    </div>
  );
}
