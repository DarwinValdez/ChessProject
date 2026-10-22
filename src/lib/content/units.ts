/**
 * A study unit is anything with graded steps whose mastery we track:
 * course lessons and the practice set of each opening. Dashboard
 * statistics, recommendations and the tactics trainer work on units.
 */
import { allLessons } from "./catalog";
import { OPENINGS, openingUnitId } from "./openings";
import type { Opening } from "./openings/types";
import type { Area, Lesson } from "./types";

export interface StudyUnit {
  id: string;
  area: Area;
  title: string;
  /** Course title or "Biblioteca de aperturas". */
  context: string;
  href: string;
  /** Units of the same group are studied in `order`. */
  group: string;
  order: number;
  lesson: Lesson;
  /** Recommended as new material only when the student opts in (repertoire). */
  optional?: boolean;
  openingSlug?: string;
}

export function openingAsLesson(opening: Opening): Lesson {
  const themes = [...new Set(opening.exercises.flatMap((s) => s.themes))];
  return {
    slug: opening.slug,
    title: opening.name,
    summary: opening.summary,
    objective: `Comprobar la comprensión de las ideas de la ${opening.name}.`,
    concept: opening.ideas[0],
    estimatedMinutes: 4 + opening.exercises.length * 2,
    themes,
    steps: opening.exercises,
    source: "propio",
  };
}

let cache: StudyUnit[] | null = null;

export function allStudyUnits(): StudyUnit[] {
  if (cache) return cache;
  const lessons: StudyUnit[] = allLessons().map((ref) => ({
    id: ref.id,
    area: ref.course.area,
    title: ref.lesson.title,
    context: ref.course.title,
    href: `/cursos/${ref.course.slug}/${ref.lesson.slug}`,
    group: ref.course.slug,
    order: ref.index,
    lesson: ref.lesson,
  }));
  const openings: StudyUnit[] = OPENINGS.map((o, i) => ({
    id: openingUnitId(o.slug),
    area: "aperturas",
    title: o.name,
    context: "Biblioteca de aperturas",
    href: `/aperturas/${o.slug}#practica`,
    group: `apertura:${o.slug}`,
    order: i,
    lesson: openingAsLesson(o),
    optional: true,
    openingSlug: o.slug,
  }));
  cache = [...lessons, ...openings];
  return cache;
}

export function getUnit(id: string): StudyUnit | undefined {
  return allStudyUnits().find((u) => u.id === id);
}
