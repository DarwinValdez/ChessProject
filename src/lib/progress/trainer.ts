/**
 * Exercise pool for the trainer: every move exercise of every study unit,
 * ordered so that unseen exercises come first, then the ones whose last
 * attempt was not clean, then the least recently practised.
 */
import type { ExerciseStep } from "@/lib/content/types";
import { type StudyUnit, allStudyUnits } from "@/lib/content/units";
import type { Area } from "@/lib/content/types";
import type { ProgressData } from "./schema";

export interface PoolItem {
  key: string;
  unit: StudyUnit;
  step: ExerciseStep;
}

export function exercisePool(): PoolItem[] {
  return allStudyUnits().flatMap((unit) =>
    unit.lesson.steps
      .filter((s): s is ExerciseStep => s.kind === "exercise")
      .map((step) => ({ key: `${unit.id}#${step.id}`, unit, step })),
  );
}

export interface TrainerFilter {
  theme?: string;
  area?: Area;
  maxDifficulty?: number;
}

export function filterPool(pool: PoolItem[], filter: TrainerFilter): PoolItem[] {
  return pool.filter(
    (item) =>
      (!filter.theme || item.step.themes.includes(filter.theme)) &&
      (!filter.area || item.unit.area === filter.area) &&
      (!filter.maxDifficulty || item.step.difficulty <= filter.maxDifficulty),
  );
}

/** Priority order: unseen → last attempt not clean → oldest last attempt. */
export function orderPool(pool: PoolItem[], data: ProgressData): PoolItem[] {
  const last = new Map<string, { at: string; clean: boolean }>();
  for (const a of data.attempts) {
    const key = `${a.lessonId}#${a.stepId}`;
    const prev = last.get(key);
    if (!prev || a.at > prev.at) last.set(key, { at: a.at, clean: a.clean });
  }
  const rank = (item: PoolItem) => {
    const l = last.get(item.key);
    if (!l) return [0, ""] as const;
    return [l.clean ? 2 : 1, l.at] as const;
  };
  return [...pool].sort((a, b) => {
    const [ra, ta] = rank(a);
    const [rb, tb] = rank(b);
    return ra !== rb ? ra - rb : ta.localeCompare(tb);
  });
}

export function poolThemes(pool: PoolItem[]): string[] {
  return [...new Set(pool.flatMap((i) => i.step.themes))].sort();
}
