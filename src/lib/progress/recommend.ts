/**
 * Rule-based session builder (phase 1). Priorities, in order:
 *   1. lessons due for review or whose last attempt failed,
 *   2. lessons started but not finished,
 *   3. new lessons, favouring areas where the student is weakest.
 * Phase 5 replaces this with an adaptive planner, keeping the interface.
 */
import { type LessonRef, allLessons } from "@/lib/content/catalog";
import { lessonMastery } from "./mastery";
import type { ProgressData } from "./schema";
import { weakThemes } from "./stats";

export const SESSION_LENGTHS = [15, 30, 45, 60] as const;
export type SessionLength = (typeof SESSION_LENGTHS)[number];

export interface SessionItem {
  ref: LessonRef;
  reason: string;
  kind: "repaso" | "continuar" | "nuevo";
}

export function buildSession(data: ProgressData, now: Date, minutes: SessionLength): SessionItem[] {
  const lessons = allLessons();
  const weak = new Set(weakThemes(data, now).map((w) => w.theme));
  const review: SessionItem[] = [];
  const ongoing: { item: SessionItem; visited: string }[] = [];
  const fresh: { item: SessionItem; score: number }[] = [];

  for (const ref of lessons) {
    const mastery = lessonMastery(ref.id, ref.lesson, data, now);
    const progress = data.lessons[ref.id];
    if (mastery.state === "necesita-repaso") {
      review.push({ ref, kind: "repaso", reason: mastery.reason });
    } else if (progress && !progress.completedAt) {
      ongoing.push({ item: { ref, kind: "continuar", reason: "La empezaste y no la has terminado." }, visited: progress.lastVisitedAt });
    } else if (mastery.state === "no-iniciado") {
      const touchesWeakness = ref.lesson.themes.some((t) => weak.has(t));
      // Earlier lessons in a course come first; weak themes jump ahead.
      const score = ref.index - (touchesWeakness ? 100 : 0);
      fresh.push({
        item: {
          ref,
          kind: "nuevo",
          reason: touchesWeakness ? "Trabaja un tema en el que fallas a menudo." : "Siguiente lección pendiente del curso.",
        },
        score,
      });
    }
  }

  // Only the next unstarted lesson of each course is a sensible "new" pick.
  const firstPerCourse = new Map<string, { item: SessionItem; score: number }>();
  for (const candidate of fresh) {
    const slug = candidate.item.ref.course.slug;
    const current = firstPerCourse.get(slug);
    if (!current || candidate.item.ref.index < current.item.ref.index) firstPerCourse.set(slug, candidate);
  }

  const ordered = [
    ...review,
    ...ongoing.sort((a, b) => b.visited.localeCompare(a.visited)).map((o) => o.item),
    ...[...firstPerCourse.values()].sort((a, b) => a.score - b.score).map((f) => f.item),
  ];

  const session: SessionItem[] = [];
  let used = 0;
  for (const item of ordered) {
    const length = item.ref.lesson.estimatedMinutes;
    if (session.length > 0 && used + length > minutes) continue;
    session.push(item);
    used += length;
  }
  return session;
}
