/**
 * Persisted progress model. Everything shown on the dashboard is computed
 * from these records; nothing is stored pre-aggregated, so statistics can
 * always be traced back to real attempts and real study time.
 */
import { z } from "zod";

export const PROGRESS_VERSION = 1;

const area = z.enum(["aperturas", "finales", "tactica", "medio-juego"]);

export const attemptSchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  stepId: z.string(),
  kind: z.enum(["exercise", "question"]),
  area,
  themes: z.array(z.string()),
  difficulty: z.number().int().min(1).max(5).optional(),
  /** Reached the solution (possibly after mistakes or hints). */
  solved: z.boolean(),
  /** Solved with no wrong move and no hint: the only outcome that counts as retention. */
  clean: z.boolean(),
  wrongMoves: z.number().int().min(0),
  hintsUsed: z.number().int().min(0),
  gaveUp: z.boolean(),
  timeMs: z.number().int().min(0),
  at: z.string().datetime(),
});

export const lessonProgressSchema = z.object({
  lessonId: z.string(),
  startedAt: z.string().datetime(),
  lastVisitedAt: z.string().datetime(),
  lastStepIndex: z.number().int().min(0),
  completedAt: z.string().datetime().optional(),
});

export const goalsSchema = z.object({
  weeklyMinutes: z.number().int().min(10).max(3000),
  weeklyExercises: z.number().int().min(1).max(1000),
  weeklyDays: z.number().int().min(1).max(7),
});

export const repertoireEntrySchema = z.object({
  slug: z.string(),
  color: z.enum(["blancas", "negras"]),
});

export const progressSchema = z.object({
  version: z.literal(PROGRESS_VERSION),
  attempts: z.array(attemptSchema),
  lessons: z.record(z.string(), lessonProgressSchema),
  /** Seconds of active study per local day ("YYYY-MM-DD") and activity. */
  studyTime: z.record(z.string(), z.record(z.string(), z.number().min(0))),
  goals: goalsSchema,
  lastLessonId: z.string().optional(),
  /** Openings the student chose to study, per colour (added in phase 2; optional so v1 data stays valid). */
  repertoire: z.array(repertoireEntrySchema).optional(),
});

export type Attempt = z.infer<typeof attemptSchema>;
export type LessonProgress = z.infer<typeof lessonProgressSchema>;
export type Goals = z.infer<typeof goalsSchema>;
export type RepertoireEntry = z.infer<typeof repertoireEntrySchema>;
export type ProgressData = z.infer<typeof progressSchema>;

/** Study-time buckets: one per academy area plus the free analysis board. */
export type StudyActivity = z.infer<typeof area> | "tablero";

export const DEFAULT_GOALS: Goals = { weeklyMinutes: 120, weeklyExercises: 25, weeklyDays: 4 };

export function emptyProgress(): ProgressData {
  return { version: PROGRESS_VERSION, attempts: [], lessons: {}, studyTime: {}, goals: { ...DEFAULT_GOALS } };
}
