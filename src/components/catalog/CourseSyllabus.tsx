"use client";

import clsx from "clsx";
import { Clock } from "lucide-react";
import Link from "next/link";
import { StateBadge } from "@/components/ui/StateBadge";
import { courseLessons } from "@/lib/content/catalog";
import type { Course } from "@/lib/content/types";
import { type TopicState, lessonMastery } from "@/lib/progress/mastery";
import { useProgress } from "@/lib/progress/store";

export function useLessonStates(course: Course): Map<string, { state: TopicState; reason: string }> | null {
  const data = useProgress();
  if (!data) return null;
  const now = new Date();
  return new Map(
    courseLessons(course).map((ref) => {
      const m = lessonMastery(ref.id, ref.lesson, data, now);
      return [ref.id, { state: m.state, reason: m.reason }];
    }),
  );
}

/** Next lesson to study in a course: first one needing review, in progress, or not started. */
export function useNextLesson(course: Course) {
  const states = useLessonStates(course);
  const lessons = courseLessons(course);
  if (!states) return null;
  const priority: TopicState[] = ["necesita-repaso", "en-curso", "no-iniciado"];
  for (const wanted of priority) {
    const ref = lessons.find((r) => states.get(r.id)?.state === wanted);
    if (ref) return { ref, state: wanted };
  }
  return { ref: lessons[0], state: "dominado-provisional" as TopicState };
}

export function CourseStartButton({ course }: { course: Course }) {
  const next = useNextLesson(course);
  if (!next) return <span className="btn-primary pointer-events-none opacity-60">Cargando…</span>;
  const label =
    next.state === "no-iniciado" && next.ref.index === 0
      ? "Empezar curso"
      : next.state === "necesita-repaso"
        ? "Repasar"
        : next.state === "dominado-provisional"
          ? "Repasar desde el inicio"
          : "Continuar";
  return (
    <Link href={`/cursos/${course.slug}/${next.ref.lesson.slug}`} className="btn-primary">
      {label}
    </Link>
  );
}

export function CourseSyllabus({ course, currentLesson, compact = false }: { course: Course; currentLesson?: string; compact?: boolean }) {
  const states = useLessonStates(course);
  const numbers = new Map(courseLessons(course).map((ref) => [ref.lesson.slug, ref.index + 1]));
  return (
    <div className="flex flex-col gap-5">
      {course.modules.map((module) => (
        <section key={module.slug} aria-label={module.title}>
          <h3 className={clsx("label mb-2", compact && "px-2")}>{module.title}</h3>
          <ol className="flex flex-col gap-1">
            {module.lessons.map((lesson) => {
              const id = `${course.slug}/${lesson.slug}`;
              const info = states?.get(id);
              const current = lesson.slug === currentLesson;
              return (
                <li key={lesson.slug}>
                  <Link
                    href={`/cursos/${course.slug}/${lesson.slug}`}
                    aria-current={current ? "page" : undefined}
                    className={clsx(
                      "flex gap-3 rounded-lg transition-colors",
                      compact ? "px-2 py-2" : "card p-4 hover:border-border-strong",
                      current ? "bg-accent-soft" : compact && "hover:bg-surface-2",
                    )}
                  >
                    <span className={clsx("mt-0.5 font-mono text-xs text-faint", compact ? "w-4" : "w-5")}>{numbers.get(lesson.slug)}</span>
                    <span className="min-w-0 flex-1">
                      <span className={clsx("block text-sm", current ? "font-semibold" : "font-medium")}>{lesson.title}</span>
                      {!compact && <span className="mt-0.5 block text-sm text-muted">{lesson.summary}</span>}
                      <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        {info ? <StateBadge state={info.state} title={info.reason} /> : <span className="text-xs text-faint">…</span>}
                        {!compact && (
                          <span className="inline-flex items-center gap-1 text-xs text-faint">
                            <Clock className="h-3 w-3" aria-hidden /> {lesson.estimatedMinutes} min
                          </span>
                        )}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
