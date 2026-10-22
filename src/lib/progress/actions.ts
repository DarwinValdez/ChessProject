/** Pure state transitions on ProgressData. The store applies and persists them. */
import { dayKey } from "./dates";
import type { Attempt, Goals, ProgressData, RepertoireEntry, StudyActivity } from "./schema";

export type NewAttempt = Omit<Attempt, "id" | "at">;

export function addAttempt(data: ProgressData, attempt: NewAttempt, now: Date, id: string): ProgressData {
  return { ...data, attempts: [...data.attempts, { ...attempt, id, at: now.toISOString() }] };
}

export function visitLesson(data: ProgressData, lessonId: string, stepIndex: number, now: Date): ProgressData {
  const existing = data.lessons[lessonId];
  const at = now.toISOString();
  return {
    ...data,
    lastLessonId: lessonId,
    lessons: {
      ...data.lessons,
      [lessonId]: {
        lessonId,
        startedAt: existing?.startedAt ?? at,
        completedAt: existing?.completedAt,
        lastVisitedAt: at,
        lastStepIndex: stepIndex,
      },
    },
  };
}

export function completeLesson(data: ProgressData, lessonId: string, now: Date): ProgressData {
  const existing = data.lessons[lessonId];
  const at = now.toISOString();
  return {
    ...data,
    lastLessonId: lessonId,
    lessons: {
      ...data.lessons,
      [lessonId]: {
        lessonId,
        startedAt: existing?.startedAt ?? at,
        lastVisitedAt: at,
        lastStepIndex: existing?.lastStepIndex ?? 0,
        // Keep the first completion date; later passes are reviews.
        completedAt: existing?.completedAt ?? at,
      },
    },
  };
}

export const MAX_STUDY_CHUNK_SECONDS = 120;

export function addStudyTime(data: ProgressData, activity: StudyActivity, seconds: number, now: Date): ProgressData {
  // Guard against clock jumps or a suspended tab reporting huge chunks.
  const chunk = Math.max(0, Math.min(MAX_STUDY_CHUNK_SECONDS, Math.round(seconds)));
  if (chunk === 0) return data;
  const key = dayKey(now);
  const day = data.studyTime[key] ?? {};
  return { ...data, studyTime: { ...data.studyTime, [key]: { ...day, [activity]: (day[activity] ?? 0) + chunk } } };
}

export function setGoals(data: ProgressData, goals: Goals): ProgressData {
  return { ...data, goals };
}

/** Milliseconds since `startMs` (event handlers only), never negative. */
export function elapsedSince(startMs: number): number {
  return Math.max(0, Date.now() - startMs);
}

/** Adds the entry, or removes it if it is already in the repertoire. */
export function toggleRepertoire(data: ProgressData, entry: RepertoireEntry): ProgressData {
  const current = data.repertoire ?? [];
  const exists = current.some((e) => e.slug === entry.slug && e.color === entry.color);
  return {
    ...data,
    repertoire: exists ? current.filter((e) => !(e.slug === entry.slug && e.color === entry.color)) : [...current, entry],
  };
}
