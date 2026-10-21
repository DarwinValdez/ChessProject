/**
 * Read-only queries over the course catalog. Content currently ships with
 * the app; in phase 4 these functions will read published courses from the
 * database instead, keeping the same signatures.
 */
import { aperturaItaliana } from "./courses/apertura-italiana";
import { finalesPeones } from "./courses/finales-peones";
import { tacticaBasica } from "./courses/tactica-basica";
import type { Area, Course, Lesson, Level, Module } from "./types";

export const COURSES: readonly Course[] = [finalesPeones, tacticaBasica, aperturaItaliana];

export const AREAS: readonly { id: Area; label: string; description: string }[] = [
  { id: "aperturas", label: "Aperturas", description: "Ideas, planes y repertorio, no solo jugadas." },
  { id: "medio-juego", label: "Medio juego", description: "Estructuras, planes y evaluación posicional." },
  { id: "tactica", label: "Táctica y cálculo", description: "Motivos tácticos y cálculo de variantes." },
  { id: "finales", label: "Finales", description: "Técnica y posiciones teóricas de referencia." },
];

export const LEVELS: readonly { id: Level; label: string }[] = [
  { id: "principiante", label: "Principiante" },
  { id: "intermedio", label: "Intermedio" },
  { id: "avanzado", label: "Avanzado" },
  { id: "experto", label: "Experto" },
];

export function areaLabel(area: Area): string {
  return AREAS.find((a) => a.id === area)?.label ?? area;
}

export function levelLabel(level: Level): string {
  return LEVELS.find((l) => l.id === level)?.label ?? level;
}

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export interface LessonRef {
  course: Course;
  module: Module;
  lesson: Lesson;
  /** Stable id used for progress tracking: "<course>/<lesson>". */
  id: string;
  index: number;
}

export function lessonId(courseSlug: string, lessonSlug: string): string {
  return `${courseSlug}/${lessonSlug}`;
}

/** All lessons of a course in study order. */
export function courseLessons(course: Course): LessonRef[] {
  const refs: LessonRef[] = [];
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      refs.push({ course, module: mod, lesson, id: lessonId(course.slug, lesson.slug), index: refs.length });
    }
  }
  return refs;
}

export function allLessons(): LessonRef[] {
  return COURSES.flatMap(courseLessons);
}

export function getLesson(courseSlug: string, lessonSlug: string): LessonRef | undefined {
  const course = getCourse(courseSlug);
  return course ? courseLessons(course).find((ref) => ref.lesson.slug === lessonSlug) : undefined;
}

export function getLessonById(id: string): LessonRef | undefined {
  const [courseSlug, lessonSlug] = id.split("/");
  return courseSlug && lessonSlug ? getLesson(courseSlug, lessonSlug) : undefined;
}

export interface CatalogFilter {
  area?: Area;
  level?: Level;
  query?: string;
  /** Maximum lesson length in minutes. */
  maxMinutes?: number;
}

function normalize(text: string): string {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function filterCourses(courses: readonly Course[], filter: CatalogFilter): Course[] {
  const query = filter.query ? normalize(filter.query.trim()) : "";
  return courses.filter((course) => {
    if (filter.area && course.area !== filter.area) return false;
    if (filter.level && course.level !== filter.level) return false;
    const lessons = courseLessons(course).map((r) => r.lesson);
    if (filter.maxMinutes && !lessons.some((l) => l.estimatedMinutes <= filter.maxMinutes!)) return false;
    if (!query) return true;
    const haystack = normalize(
      [course.title, course.summary, ...(course.eco ?? []), ...lessons.flatMap((l) => [l.title, l.summary, ...l.themes])].join(" "),
    );
    return query.split(/\s+/).every((word) => haystack.includes(word));
  });
}

export function courseMinutes(course: Course): number {
  return courseLessons(course).reduce((sum, ref) => sum + ref.lesson.estimatedMinutes, 0);
}
