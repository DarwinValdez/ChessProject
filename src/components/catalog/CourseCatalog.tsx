"use client";

import { Clock, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AreaTag, LevelTag, SourceTag } from "@/components/ui/Meta";
import { AREAS, COURSES, LEVELS, courseLessons, courseMinutes, filterCourses } from "@/lib/content/catalog";
import type { Area, Course, Level } from "@/lib/content/types";
import { lessonMastery } from "@/lib/progress/mastery";
import { useProgress } from "@/lib/progress/store";

const DURATIONS = [
  { value: 0, label: "Cualquier duración" },
  { value: 5, label: "Lecciones ≤ 5 min" },
  { value: 10, label: "Lecciones ≤ 10 min" },
];

function CourseProgress({ course }: { course: Course }) {
  const data = useProgress();
  const lessons = courseLessons(course);
  if (!data) return <div className="h-1.5 rounded-full bg-surface-2" />;
  const now = new Date();
  const states = lessons.map((ref) => lessonMastery(ref.id, ref.lesson, data, now).state);
  const mastered = states.filter((s) => s === "dominado-provisional").length;
  const started = states.filter((s) => s !== "no-iniciado").length;
  return (
    <div>
      <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full" aria-hidden>
        {states.map((s, i) => (
          <span
            key={i}
            className="flex-1"
            style={{
              background:
                s === "dominado-provisional"
                  ? "var(--chart-mastered)"
                  : s === "necesita-repaso"
                    ? "var(--chart-review)"
                    : s === "en-curso"
                      ? "var(--chart-progress)"
                      : "var(--chart-track)",
            }}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-faint">
        {started === 0 ? "Sin empezar" : `${started} de ${lessons.length} lecciones empezadas · ${mastered} dominadas`}
      </p>
    </div>
  );
}

export function CourseCard({ course }: { course: Course }) {
  const lessons = courseLessons(course);
  return (
    <Link href={`/cursos/${course.slug}`} className="card group flex flex-col gap-3 p-5 transition-colors hover:border-border-strong">
      <div className="flex items-center justify-between gap-2">
        <AreaTag area={course.area} />
        <LevelTag level={course.level} />
      </div>
      <div>
        <h3 className="font-semibold tracking-tight group-hover:text-accent">{course.title}</h3>
        <p className="mt-1 line-clamp-3 text-sm text-muted">{course.summary}</p>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-faint">
        <span>{lessons.length} lecciones</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" aria-hidden /> {courseMinutes(course)} min
        </span>
        {course.eco && <span>ECO {course.eco.join(", ")}</span>}
        <SourceTag source={course.source} />
      </div>
      <CourseProgress course={course} />
    </Link>
  );
}

export function CourseCatalog({ fixedArea }: { fixedArea?: Area }) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<Area | undefined>(undefined);
  const [level, setLevel] = useState<Level | undefined>(undefined);
  const [maxMinutes, setMaxMinutes] = useState(0);

  const effectiveArea = fixedArea ?? area;
  const courses = useMemo(
    () => filterCourses(COURSES, { area: effectiveArea, level, query, maxMinutes: maxMinutes || undefined }),
    [effectiveArea, level, query, maxMinutes],
  );
  const areaHasContent = !fixedArea || COURSES.some((c) => c.area === fixedArea);

  if (!areaHasContent) {
    return (
      <div className="card flex flex-col items-start gap-2 p-6">
        <p className="font-medium">Todavía no hay cursos publicados en esta área.</p>
        <p className="text-sm text-muted">
          Los módulos de esta sección se publican en la Fase 2. No mostramos lecciones vacías: cuando aparezcan aquí, tendrán posiciones
          verificadas y ejercicios reales.
        </p>
        <Link href="/cursos" className="btn-secondary mt-2">
          Ver los cursos disponibles
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Buscar</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden />
            <input
              type="search"
              className="input pl-9"
              placeholder="Buscar por tema, apertura, código ECO…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label className="sm:w-44">
            <span className="sr-only">Nivel</span>
            <select className="input" value={level ?? ""} onChange={(e) => setLevel((e.target.value || undefined) as Level | undefined)}>
              <option value="">Todos los niveles</option>
              {LEVELS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
          <label className="sm:w-48">
            <span className="sr-only">Duración</span>
            <select className="input" value={maxMinutes} onChange={(e) => setMaxMinutes(Number(e.target.value))}>
              {DURATIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {!fixedArea && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por área">
            <button type="button" className="chip" aria-pressed={!area} onClick={() => setArea(undefined)}>
              Todas
            </button>
            {AREAS.map((a) => (
              <button key={a.id} type="button" className="chip" aria-pressed={area === a.id} onClick={() => setArea(area === a.id ? undefined : a.id)}>
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-sm text-faint" aria-live="polite">
        {courses.length === 1 ? "1 curso" : `${courses.length} cursos`}
      </p>

      {courses.length === 0 ? (
        <div className="card p-6 text-sm text-muted">
          Ningún curso coincide con estos filtros.
          {effectiveArea && !COURSES.some((c) => c.area === effectiveArea) && " Esta área aún no tiene cursos publicados (Fase 2)."}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
