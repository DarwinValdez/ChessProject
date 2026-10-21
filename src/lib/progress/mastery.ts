/**
 * Topic state from real performance. A lesson is never "mastered" just for
 * being completed: every graded step must have been solved cleanly (no
 * wrong move, no hint) on at least two different days, and the latest
 * attempt must still be clean. Reviews are scheduled with growing
 * intervals (a simple spaced-repetition ladder; phase 5 replaces it with a
 * full scheduler per variation/concept).
 */
import type { Lesson } from "@/lib/content/types";
import { addDays, dayKey } from "./dates";
import type { Attempt, ProgressData } from "./schema";

export type TopicState = "no-iniciado" | "en-curso" | "necesita-repaso" | "dominado-provisional";

export const TOPIC_STATE_LABEL: Record<TopicState, string> = {
  "no-iniciado": "No iniciado",
  "en-curso": "En curso",
  "necesita-repaso": "Necesita repaso",
  "dominado-provisional": "Dominado provisionalmente",
};

/** Days until the next review after N distinct days with a clean solve. */
export const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60] as const;

export const MASTERY_MIN_CLEAN_DAYS = 2;

export interface LessonMastery {
  state: TopicState;
  reason: string;
  /** Next scheduled review (local date), when the lesson has been completed. */
  reviewDue?: Date;
}

interface StepRecord {
  latest?: Attempt;
  cleanDays: string[];
  failedDays: Set<string>;
  lastClean?: Date;
}

function stepRecords(lessonId: string, stepIds: string[], attempts: Attempt[]): Map<string, StepRecord> {
  const map = new Map<string, StepRecord>(stepIds.map((id) => [id, { cleanDays: [], failedDays: new Set<string>() }]));
  const sorted = attempts.filter((a) => a.lessonId === lessonId).sort((a, b) => a.at.localeCompare(b.at));
  for (const attempt of sorted) {
    const record = map.get(attempt.stepId);
    if (!record) continue; // step removed from the lesson since
    record.latest = attempt;
    const at = new Date(attempt.at);
    const key = dayKey(at);
    if (!attempt.clean) {
      record.failedDays.add(key);
    } else if (!record.failedDays.has(key)) {
      // A clean solve right after failing (and seeing the solution) the
      // same day proves nothing about retention, so it does not count.
      if (!record.cleanDays.includes(key)) record.cleanDays.push(key);
      record.lastClean = at;
    }
  }
  return map;
}

export function lessonMastery(lessonId: string, lesson: Lesson, data: ProgressData, now: Date): LessonMastery {
  const progress = data.lessons[lessonId];
  const graded = lesson.steps.filter((s) => s.kind !== "explain").map((s) => s.id);
  const records = stepRecords(lessonId, graded, data.attempts);
  const hasAttempts = [...records.values()].some((r) => r.latest);

  if (!progress && !hasAttempts) return { state: "no-iniciado", reason: "Aún no has abierto esta lección." };
  if (!progress?.completedAt) return { state: "en-curso", reason: "Lección empezada, sin terminar." };

  let reviewDue: Date | undefined;
  let failed = false;
  let minCleanDays = Infinity;
  for (const record of records.values()) {
    if (!record.latest || !record.latest.clean) failed = true;
    minCleanDays = Math.min(minCleanDays, record.cleanDays.length);
    if (record.lastClean) {
      const interval = REVIEW_INTERVALS[Math.min(record.cleanDays.length, REVIEW_INTERVALS.length) - 1];
      const lastDay = record.lastClean;
      const due = addDays(new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate()), interval);
      if (!reviewDue || due < reviewDue) reviewDue = due;
    }
  }
  if (graded.length === 0) minCleanDays = 0;

  if (failed) {
    return { state: "necesita-repaso", reason: "El último intento de algún ejercicio no fue limpio (error, pista o rendición).", reviewDue: now };
  }
  if (reviewDue && now >= reviewDue) {
    return { state: "necesita-repaso", reason: "Toca el repaso programado para comprobar la retención.", reviewDue };
  }
  if (minCleanDays >= MASTERY_MIN_CLEAN_DAYS) {
    return {
      state: "dominado-provisional",
      reason: `Resuelto sin errores en ${minCleanDays} días distintos. Seguirá en repaso espaciado.`,
      reviewDue,
    };
  }
  return {
    state: "en-curso",
    reason: "Completada. Falta resolverla sin errores en otro día para comprobar la retención.",
    reviewDue,
  };
}
