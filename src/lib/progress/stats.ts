/**
 * Dashboard statistics, computed only from recorded attempts and study
 * time. When there is not enough data, functions say so (null / empty)
 * instead of inventing a number.
 */
import { AREAS } from "@/lib/content/catalog";
import { allStudyUnits } from "@/lib/content/units";
import type { Area, Level } from "@/lib/content/types";
import { addDays, dayKey, startOfWeek } from "./dates";
import { type TopicState, lessonMastery } from "./mastery";
import type { Attempt, ProgressData } from "./schema";

export function totalStudySeconds(data: ProgressData): number {
  let total = 0;
  for (const day of Object.values(data.studyTime)) for (const s of Object.values(day)) total += s;
  return total;
}

function activeDays(data: ProgressData): Set<string> {
  const days = new Set<string>();
  for (const [day, buckets] of Object.entries(data.studyTime)) {
    if (Object.values(buckets).some((s) => s >= 60)) days.add(day);
  }
  for (const a of data.attempts) days.add(dayKey(new Date(a.at)));
  return days;
}

/**
 * Consecutive studied days ending today, or ending yesterday if the
 * student has not studied yet today (the streak is still alive).
 */
export function currentStreak(data: ProgressData, now: Date): number {
  const days = activeDays(data);
  let cursor = days.has(dayKey(now)) ? now : addDays(now, -1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export interface Accuracy {
  attempts: number;
  clean: number;
  solved: number;
  /** Share of attempts solved cleanly (no mistakes, no hints), or null without data. */
  cleanRate: number | null;
}

export function accuracy(attempts: Attempt[]): Accuracy {
  const clean = attempts.filter((a) => a.clean).length;
  const solved = attempts.filter((a) => a.solved).length;
  return { attempts: attempts.length, clean, solved, cleanRate: attempts.length ? clean / attempts.length : null };
}

export interface WeakTheme {
  theme: string;
  attempts: number;
  cleanRate: number;
}

export const WEAK_THEME_MIN_ATTEMPTS = 3;
export const WEAK_THEME_THRESHOLD = 0.6;

/** Themes with enough recent attempts and a clean rate below the threshold. */
export function weakThemes(data: ProgressData, now: Date, windowDays = 30): WeakTheme[] {
  const since = addDays(now, -windowDays).toISOString();
  const byTheme = new Map<string, Attempt[]>();
  for (const attempt of data.attempts) {
    if (attempt.at < since) continue;
    for (const theme of attempt.themes) byTheme.set(theme, [...(byTheme.get(theme) ?? []), attempt]);
  }
  const weak: WeakTheme[] = [];
  for (const [theme, attempts] of byTheme) {
    const { cleanRate } = accuracy(attempts);
    if (attempts.length >= WEAK_THEME_MIN_ATTEMPTS && cleanRate !== null && cleanRate < WEAK_THEME_THRESHOLD) {
      weak.push({ theme, attempts: attempts.length, cleanRate });
    }
  }
  return weak.sort((a, b) => a.cleanRate - b.cleanRate);
}

export type StateCounts = Record<TopicState, number>;

export interface AreaProgress {
  area: Area;
  label: string;
  total: number;
  counts: StateCounts;
}

const emptyCounts = (): StateCounts => ({
  "no-iniciado": 0,
  "en-curso": 0,
  "necesita-repaso": 0,
  "dominado-provisional": 0,
});

export function areaProgress(data: ProgressData, now: Date): AreaProgress[] {
  const units = allStudyUnits();
  return AREAS.map(({ id, label }) => {
    const counts = emptyCounts();
    const inArea = units.filter((unit) => unit.area === id);
    for (const unit of inArea) counts[lessonMastery(unit.id, unit.lesson, data, now).state] += 1;
    return { area: id, label, total: inArea.length, counts };
  });
}

export interface LevelEstimate {
  level: Level | null;
  /** Why the estimate is (or is not) available. */
  basis: string;
}

const LEVEL_BY_DIFFICULTY: Record<number, Level> = { 1: "principiante", 2: "principiante", 3: "intermedio", 4: "avanzado", 5: "experto" };
export const LEVEL_MIN_ATTEMPTS = 5;
export const LEVEL_MIN_CLEAN_RATE = 0.7;

/**
 * Highest exercise difficulty the student solves cleanly with enough
 * attempts. It describes performance on this platform's exercises only;
 * it is not a rating.
 */
export function estimateLevel(data: ProgressData): LevelEstimate {
  const exercises = data.attempts.filter((a) => a.kind === "exercise" && a.difficulty);
  if (exercises.length < LEVEL_MIN_ATTEMPTS) {
    return {
      level: null,
      basis: `Resuelve al menos ${LEVEL_MIN_ATTEMPTS} ejercicios para estimarlo (llevas ${exercises.length}).`,
    };
  }
  for (let difficulty = 5; difficulty >= 1; difficulty--) {
    const atOrAbove = exercises.filter((a) => a.difficulty! >= difficulty);
    const { cleanRate } = accuracy(atOrAbove);
    if (atOrAbove.length >= LEVEL_MIN_ATTEMPTS && cleanRate !== null && cleanRate >= LEVEL_MIN_CLEAN_RATE) {
      return {
        level: LEVEL_BY_DIFFICULTY[difficulty],
        basis: `${Math.round(cleanRate * 100)} % de aciertos limpios en ${atOrAbove.length} ejercicios de dificultad ${difficulty} o superior.`,
      };
    }
  }
  return {
    level: null,
    basis: `Aún no hay ${LEVEL_MIN_ATTEMPTS} ejercicios de un mismo nivel con un ${LEVEL_MIN_CLEAN_RATE * 100} % de aciertos limpios.`,
  };
}

export interface WeeklyGoalsProgress {
  minutes: { done: number; target: number };
  exercises: { done: number; target: number };
  days: { done: number; target: number };
}

export function weeklyGoals(data: ProgressData, now: Date): WeeklyGoalsProgress {
  const weekStart = startOfWeek(now);
  const weekDays = Array.from({ length: 7 }, (_, i) => dayKey(addDays(weekStart, i)));
  let seconds = 0;
  for (const day of weekDays) for (const s of Object.values(data.studyTime[day] ?? {})) seconds += s;
  const exercises = data.attempts.filter((a) => new Date(a.at) >= weekStart).length;
  const studied = activeDays(data);
  return {
    minutes: { done: Math.floor(seconds / 60), target: data.goals.weeklyMinutes },
    exercises: { done: exercises, target: data.goals.weeklyExercises },
    days: { done: weekDays.filter((d) => studied.has(d)).length, target: data.goals.weeklyDays },
  };
}

export interface ActivityDay {
  day: string;
  minutes: number;
  attempts: number;
}

/** Minutes and attempts per day for the last `weeks` full weeks (Monday-aligned). */
export function activityCalendar(data: ProgressData, now: Date, weeks = 12): ActivityDay[] {
  const start = addDays(startOfWeek(now), -7 * (weeks - 1));
  const attemptsByDay = new Map<string, number>();
  for (const a of data.attempts) {
    const key = dayKey(new Date(a.at));
    attemptsByDay.set(key, (attemptsByDay.get(key) ?? 0) + 1);
  }
  return Array.from({ length: weeks * 7 }, (_, i) => {
    const key = dayKey(addDays(start, i));
    const seconds = Object.values(data.studyTime[key] ?? {}).reduce((s, n) => s + n, 0);
    return { day: key, minutes: Math.floor(seconds / 60), attempts: attemptsByDay.get(key) ?? 0 };
  });
}

export interface RecentEvent {
  at: string;
  kind: "attempt" | "lesson-completed";
  lessonId: string;
  stepId?: string;
  clean?: boolean;
  solved?: boolean;
}

export function recentActivity(data: ProgressData, limit = 8): RecentEvent[] {
  const events: RecentEvent[] = data.attempts.map((a) => ({
    at: a.at,
    kind: "attempt",
    lessonId: a.lessonId,
    stepId: a.stepId,
    clean: a.clean,
    solved: a.solved,
  }));
  for (const lesson of Object.values(data.lessons)) {
    if (lesson.completedAt) events.push({ at: lesson.completedAt, kind: "lesson-completed", lessonId: lesson.lessonId });
  }
  return events.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}
