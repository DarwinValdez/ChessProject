"use client";

import clsx from "clsx";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, Flame, Gauge, Pencil, Play, Target, XCircle } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useMemo, useState } from "react";
import { PageContainer } from "@/components/ui/PageHeader";
import { allLessons, getLessonById, levelLabel } from "@/lib/content/catalog";
import { themeLabel } from "@/lib/content/themes";
import { dayKey } from "@/lib/progress/dates";
import { SESSION_LENGTHS, type SessionLength, buildSession } from "@/lib/progress/recommend";
import type { Goals, ProgressData } from "@/lib/progress/schema";
import {
  WEAK_THEME_MIN_ATTEMPTS,
  accuracy,
  activityCalendar,
  areaProgress,
  currentStreak,
  estimateLevel,
  recentActivity,
  totalStudySeconds,
  weakThemes,
  weeklyGoals,
} from "@/lib/progress/stats";
import { progressStore, storageWasRecovered, useProgress } from "@/lib/progress/store";
import { ActivityCalendar } from "./ActivityCalendar";
import { AreaProgressChart } from "./AreaProgressChart";
import { formatDuration, formatPercent, formatRelative } from "./format";

function Panel({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={clsx("card flex flex-col gap-4 p-5", className)} aria-label={title}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function StatTile({ icon: Icon, label, value, detail }: { icon: typeof Clock; label: string; value: string; detail: string }) {
  return (
    <div className="card flex flex-col gap-1 p-4">
      <span className="flex items-center gap-1.5 text-xs text-muted">
        <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
      </span>
      <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
      <span className="text-xs text-faint">{detail}</span>
    </div>
  );
}

function GoalBar({ label, done, target, unit }: { label: string; done: number; target: number; unit: string }) {
  const pct = Math.min(100, Math.round((done / target) * 100));
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span>{label}</span>
        <span className="tabular-nums text-muted">
          {done} / {target} {unit}
        </span>
      </div>
      <div
        className="h-2 rounded-full"
        style={{ background: "var(--chart-track)" }}
        role="progressbar"
        aria-label={label}
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={target}
      >
        <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function GoalsEditor({ goals, onDone }: { goals: Goals; onDone: () => void }) {
  const [draft, setDraft] = useState(goals);
  const [error, setError] = useState<string | null>(null);
  const field = (key: keyof Goals, label: string, min: number, max: number) => (
    <label className="flex items-center justify-between gap-3 text-sm">
      {label}
      <input
        type="number"
        className="input w-24 text-right"
        min={min}
        max={max}
        value={draft[key]}
        onChange={(e) => setDraft({ ...draft, [key]: Number(e.target.value) })}
      />
    </label>
  );
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (progressStore.setGoals(draft)) onDone();
        else setError("Revisa los valores: minutos 10–3000, ejercicios 1–1000, días 1–7.");
      }}
    >
      {field("weeklyMinutes", "Minutos por semana", 10, 3000)}
      {field("weeklyExercises", "Ejercicios por semana", 1, 1000)}
      {field("weeklyDays", "Días de estudio", 1, 7)}
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">
          Guardar
        </button>
        <button type="button" className="btn-ghost" onClick={onDone}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export function Dashboard() {
  const data = useProgress();
  if (!data) {
    return (
      <PageContainer>
        <div className="h-10 w-64 animate-pulse rounded-lg bg-surface-2" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-surface-2" />
          ))}
        </div>
      </PageContainer>
    );
  }
  return <DashboardReady data={data} />;
}

function DashboardReady({ data }: { data: ProgressData }) {
  const [now] = useState(() => new Date());
  const [sessionLength, setSessionLength] = useState<SessionLength>(30);
  const [editingGoals, setEditingGoals] = useState(false);

  const stats = useMemo(() => {
    const areas = areaProgress(data, now);
    return {
      level: estimateLevel(data),
      seconds: totalStudySeconds(data),
      streak: currentStreak(data, now),
      acc: accuracy(data.attempts),
      areas,
      weak: weakThemes(data, now),
      goals: weeklyGoals(data, now),
      calendar: activityCalendar(data, now),
      recent: recentActivity(data),
    };
  }, [data, now]);
  const session = useMemo(() => buildSession(data, now, sessionLength), [data, now, sessionLength]);

  const last = data.lastLessonId ? getLessonById(data.lastLessonId) : undefined;
  const isNew = data.attempts.length === 0 && Object.keys(data.lessons).length === 0;
  const openings = stats.areas.find((a) => a.area === "aperturas")!;
  const endgames = stats.areas.find((a) => a.area === "finales")!;
  const lessonCount = allLessons().length;

  return (
    <PageContainer>
      {storageWasRecovered() && (
        <div className="flex gap-2 rounded-lg border border-warn/40 bg-warn-soft p-3 text-sm" role="alert">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" aria-hidden />
          Los datos de progreso guardados en este navegador no se podían leer. Se ha creado un perfil nuevo y se ha conservado una copia de los
          datos anteriores.
        </div>
      )}

      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="label mb-1.5">Dashboard</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{isNew ? "Bienvenido a la academia" : "Tu entrenamiento"}</h1>
          <p className="mt-1.5 max-w-2xl text-[15px] text-muted">
            {isNew
              ? `Hay ${lessonCount} lecciones disponibles. Tus estadísticas aparecerán a medida que resuelvas ejercicios: aquí no se muestra ningún dato inventado.`
              : "Estadísticas calculadas a partir de tus intentos reales y del tiempo de estudio activo."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {last && (
            <Link href={`/cursos/${last.course.slug}/${last.lesson.slug}`} className="btn-secondary">
              <Play className="h-4 w-4" /> Continuar: {last.lesson.title}
            </Link>
          )}
          {session[0] && (
            <Link href={`/cursos/${session[0].ref.course.slug}/${session[0].ref.lesson.slug}`} className="btn-primary">
              Iniciar sesión de {sessionLength} min <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatTile
          icon={Gauge}
          label="Nivel estimado"
          value={stats.level.level ? levelLabel(stats.level.level) : "Sin estimar"}
          detail={stats.level.basis}
        />
        <StatTile icon={Clock} label="Tiempo de estudio" value={formatDuration(stats.seconds)} detail="Solo tiempo activo" />
        <StatTile
          icon={Flame}
          label="Racha"
          value={`${stats.streak} ${stats.streak === 1 ? "día" : "días"}`}
          detail={stats.streak > 0 ? "Días seguidos estudiando" : "Estudia hoy para empezarla"}
        />
        <StatTile
          icon={Target}
          label="Precisión"
          value={formatPercent(stats.acc.cleanRate)}
          detail={stats.acc.attempts ? `${stats.acc.clean} limpios de ${stats.acc.attempts} intentos` : "Sin intentos todavía"}
        />
        <StatTile
          icon={CheckCircle2}
          label="Aperturas dominadas"
          value={`${openings.counts["dominado-provisional"]} / ${openings.total}`}
          detail="Lecciones con retención comprobada"
        />
        <StatTile
          icon={CheckCircle2}
          label="Finales dominados"
          value={`${endgames.counts["dominado-provisional"]} / ${endgames.total}`}
          detail="Lecciones con retención comprobada"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-5">
          <Panel
            title="Sesión recomendada para hoy"
            action={
              <div role="radiogroup" aria-label="Duración de la sesión" className="inline-flex rounded-lg border border-border bg-surface-2 p-0.5">
                {SESSION_LENGTHS.map((len) => (
                  <button
                    key={len}
                    type="button"
                    role="radio"
                    aria-checked={sessionLength === len}
                    onClick={() => setSessionLength(len)}
                    className={clsx(
                      "rounded-md px-2 py-1 text-xs tabular-nums",
                      sessionLength === len ? "bg-surface text-text shadow-card" : "text-muted hover:text-text",
                    )}
                  >
                    {len}′
                  </button>
                ))}
              </div>
            }
          >
            {session.length === 0 ? (
              <p className="text-sm text-muted">No hay lecciones pendientes ni repasos programados hoy. ¡Buen trabajo!</p>
            ) : (
              <ol className="flex flex-col divide-y divide-border">
                {session.map((item, i) => (
                  <li key={item.ref.id}>
                    <Link
                      href={`/cursos/${item.ref.course.slug}/${item.ref.lesson.slug}`}
                      className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-medium text-muted">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-medium group-hover:text-accent">{item.ref.lesson.title}</span>
                          <span
                            className={clsx(
                              "rounded px-1.5 py-0.5 text-[11px] font-medium",
                              item.kind === "repaso" ? "bg-warn-soft text-warn" : item.kind === "continuar" ? "bg-info-soft text-info" : "bg-surface-2 text-muted",
                            )}
                          >
                            {item.kind === "repaso" ? "Repaso" : item.kind === "continuar" ? "Continuar" : "Nueva"}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs text-faint">
                          {item.ref.course.title} · {item.ref.lesson.estimatedMinutes} min · {item.reason}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-faint group-hover:text-accent" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ol>
            )}
            <p className="text-xs text-faint">
              Prioridad: repasos pendientes → lecciones a medias → lecciones nuevas, con preferencia por tus temas débiles. El plan adaptativo
              completo llega en la Fase 5.
            </p>
          </Panel>

          <Panel title="Progreso por áreas">
            <AreaProgressChart areas={stats.areas} />
          </Panel>

          <Panel title="Actividad">
            <ActivityCalendar days={stats.calendar} today={dayKey(now)} />
            {stats.recent.length > 0 && (
              <div className="border-t border-border pt-4">
                <h3 className="label mb-2">Historial reciente</h3>
                <ul className="flex flex-col gap-2 text-sm">
                  {stats.recent.map((event, i) => {
                    const ref = getLessonById(event.lessonId);
                    const step = ref?.lesson.steps.find((s) => s.id === event.stepId);
                    return (
                      <li key={`${event.at}-${i}`} className="flex items-start gap-2">
                        {event.kind === "lesson-completed" ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-label="Lección terminada" />
                        ) : event.clean ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-label="Resuelto sin errores" />
                        ) : event.solved ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-warn" aria-label="Resuelto con errores o pistas" />
                        ) : (
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-label="No resuelto" />
                        )}
                        <span className="min-w-0 flex-1">
                          {event.kind === "lesson-completed" ? "Lección terminada: " : ""}
                          <span className="font-medium">{ref?.lesson.title ?? event.lessonId}</span>
                          {step && <span className="text-muted"> · {step.title}</span>}
                          {event.kind === "attempt" && (
                            <span className="text-muted">
                              {" "}
                              — {event.clean ? "sin errores" : event.solved ? "con errores o pistas" : "no resuelto"}
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 text-xs text-faint">{formatRelative(event.at, now)}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-5">
          <Panel
            title="Objetivos semanales"
            action={
              !editingGoals && (
                <button type="button" className="icon-btn h-8 w-8" onClick={() => setEditingGoals(true)} aria-label="Editar objetivos">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )
            }
          >
            {editingGoals ? (
              <GoalsEditor goals={data.goals} onDone={() => setEditingGoals(false)} />
            ) : (
              <div className="flex flex-col gap-4">
                <GoalBar label="Tiempo de estudio" done={stats.goals.minutes.done} target={stats.goals.minutes.target} unit="min" />
                <GoalBar label="Ejercicios intentados" done={stats.goals.exercises.done} target={stats.goals.exercises.target} unit="" />
                <GoalBar label="Días de estudio" done={stats.goals.days.done} target={stats.goals.days.target} unit="días" />
                <p className="text-xs text-faint">Semana de lunes a domingo.</p>
              </div>
            )}
          </Panel>

          <Panel title="Temas débiles detectados">
            {stats.weak.length === 0 ? (
              <p className="text-sm text-muted">
                {stats.acc.attempts < WEAK_THEME_MIN_ATTEMPTS
                  ? `Se detectan con al menos ${WEAK_THEME_MIN_ATTEMPTS} intentos por tema en los últimos 30 días.`
                  : "Ningún tema por debajo del 60 % de aciertos limpios en los últimos 30 días."}
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {stats.weak.map((w) => (
                  <li key={w.theme} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-warn" aria-hidden />
                      {themeLabel(w.theme)}
                    </span>
                    <span className="text-xs tabular-nums text-muted">
                      {formatPercent(w.cleanRate)} de {w.attempts}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Cómo medimos el progreso">
            <ul className="flex flex-col gap-2 text-sm text-muted">
              <li>
                <span className="font-medium text-text">Acierto limpio:</span> sin jugadas erróneas ni pistas.
              </li>
              <li>
                <span className="font-medium text-text">Dominado provisionalmente:</span> aciertos limpios en dos días distintos; un acierto
                justo después de fallar no cuenta.
              </li>
              <li>
                <span className="font-medium text-text">Necesita repaso:</span> el último intento falló o toca el repaso espaciado (1, 3, 7, 14,
                30, 60 días).
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </PageContainer>
  );
}
