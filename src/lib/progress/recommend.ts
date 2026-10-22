/**
 * Rule-based session builder (phases 1–2). Priorities, in order:
 *   1. units due for review or whose last attempt failed,
 *   2. units started but not finished,
 *   3. new material: the next lesson of each course and the openings of
 *      the student's repertoire, favouring weak themes.
 * Phase 5 replaces this with an adaptive planner, keeping the interface.
 */
import { type StudyUnit, allStudyUnits } from "@/lib/content/units";
import { lessonMastery } from "./mastery";
import type { ProgressData } from "./schema";
import { weakThemes } from "./stats";

export const SESSION_LENGTHS = [15, 30, 45, 60] as const;
export type SessionLength = (typeof SESSION_LENGTHS)[number];

export interface SessionItem {
  unit: StudyUnit;
  reason: string;
  kind: "repaso" | "continuar" | "nuevo";
}

export function buildSession(data: ProgressData, now: Date, minutes: SessionLength): SessionItem[] {
  const weak = new Set(weakThemes(data, now).map((w) => w.theme));
  const inRepertoire = new Set((data.repertoire ?? []).map((e) => e.slug));
  const review: SessionItem[] = [];
  const ongoing: { item: SessionItem; visited: string }[] = [];
  const firstNew = new Map<string, { item: SessionItem; score: number }>();

  for (const unit of allStudyUnits()) {
    const mastery = lessonMastery(unit.id, unit.lesson, data, now);
    const progress = data.lessons[unit.id];
    if (mastery.state === "necesita-repaso") {
      review.push({ unit, kind: "repaso", reason: mastery.reason });
    } else if (progress && !progress.completedAt) {
      ongoing.push({ item: { unit, kind: "continuar", reason: "La empezaste y no la has terminado." }, visited: progress.lastVisitedAt });
    } else if (mastery.state === "no-iniciado") {
      if (unit.optional && !(unit.openingSlug && inRepertoire.has(unit.openingSlug))) continue;
      const touchesWeakness = unit.lesson.themes.some((t) => weak.has(t));
      const reason = touchesWeakness
        ? "Trabaja un tema en el que fallas a menudo."
        : unit.optional
          ? "Apertura de tu repertorio sin practicar."
          : "Siguiente lección pendiente del curso.";
      // Earlier lessons in a course come first; weak themes jump ahead.
      const score = unit.order - (touchesWeakness ? 100 : 0);
      const current = firstNew.get(unit.group);
      if (!current || unit.order < current.item.unit.order) firstNew.set(unit.group, { item: { unit, kind: "nuevo", reason }, score });
    }
  }

  const ordered = [
    ...review,
    ...ongoing.sort((a, b) => b.visited.localeCompare(a.visited)).map((o) => o.item),
    ...[...firstNew.values()].sort((a, b) => a.score - b.score).map((f) => f.item),
  ];

  const session: SessionItem[] = [];
  let used = 0;
  for (const item of ordered) {
    const length = item.unit.lesson.estimatedMinutes;
    if (session.length > 0 && used + length > minutes) continue;
    session.push(item);
    used += length;
  }
  return session;
}
