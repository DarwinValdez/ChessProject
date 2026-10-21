import { describe, expect, it } from "vitest";
import { allLessons, getLessonById } from "@/lib/content/catalog";
import * as actions from "../actions";
import { lessonMastery } from "../mastery";
import { buildSession } from "../recommend";
import { LocalStorageRepository, STORAGE_KEY, parseProgress } from "../repository";
import { type ProgressData, emptyProgress } from "../schema";
import { accuracy, activityCalendar, currentStreak, estimateLevel, weakThemes, weeklyGoals } from "../stats";

const LESSON_ID = "finales-de-peones-fundamentos/regla-del-cuadrado";
const lessonRef = getLessonById(LESSON_ID)!;
const graded = lessonRef.lesson.steps.filter((s) => s.kind !== "explain");

const at = (iso: string) => new Date(iso);
let counter = 0;

function attempt(data: ProgressData, stepId: string, clean: boolean, when: string, extra: Partial<actions.NewAttempt> = {}) {
  return actions.addAttempt(
    data,
    {
      lessonId: LESSON_ID,
      stepId,
      kind: "exercise",
      area: "finales",
      themes: ["regla-del-cuadrado"],
      difficulty: 1,
      solved: true,
      clean,
      wrongMoves: clean ? 0 : 1,
      hintsUsed: 0,
      gaveUp: false,
      timeMs: 5000,
      ...extra,
    },
    at(when),
    `id-${counter++}`,
  );
}

function passLesson(data: ProgressData, when: string, clean = true) {
  let d = actions.visitLesson(data, LESSON_ID, 0, at(when));
  for (const step of graded) d = attempt(d, step.id, clean, when);
  return actions.completeLesson(d, LESSON_ID, at(when));
}

describe("lesson mastery", () => {
  it("goes from not started to in progress", () => {
    const empty = emptyProgress();
    expect(lessonMastery(LESSON_ID, lessonRef.lesson, empty, at("2026-10-01T10:00:00")).state).toBe("no-iniciado");
    const visited = actions.visitLesson(empty, LESSON_ID, 1, at("2026-10-01T10:00:00"));
    expect(lessonMastery(LESSON_ID, lessonRef.lesson, visited, at("2026-10-01T10:05:00")).state).toBe("en-curso");
  });

  it("is not mastered after a single clean completion", () => {
    const d = passLesson(emptyProgress(), "2026-10-01T10:00:00");
    const m = lessonMastery(LESSON_ID, lessonRef.lesson, d, at("2026-10-01T12:00:00"));
    expect(m.state).toBe("en-curso");
    // next day the first review is due
    expect(lessonMastery(LESSON_ID, lessonRef.lesson, d, at("2026-10-02T09:00:00")).state).toBe("necesita-repaso");
  });

  it("is provisionally mastered after clean solves on two different days", () => {
    let d = passLesson(emptyProgress(), "2026-10-01T10:00:00");
    d = passLesson(d, "2026-10-02T10:00:00");
    const m = lessonMastery(LESSON_ID, lessonRef.lesson, d, at("2026-10-02T11:00:00"));
    expect(m.state).toBe("dominado-provisional");
    // the next review is scheduled 3 days after the second clean day
    expect(lessonMastery(LESSON_ID, lessonRef.lesson, d, at("2026-10-05T08:00:00")).state).toBe("necesita-repaso");
  });

  it("needs review when the latest attempt was not clean", () => {
    let d = passLesson(emptyProgress(), "2026-10-01T10:00:00");
    d = passLesson(d, "2026-10-02T10:00:00");
    d = attempt(d, graded[0].id, false, "2026-10-02T12:00:00");
    expect(lessonMastery(LESSON_ID, lessonRef.lesson, d, at("2026-10-02T13:00:00")).state).toBe("necesita-repaso");
  });

  it("does not count a clean retry right after failing the same day as retention", () => {
    let d = passLesson(emptyProgress(), "2026-10-01T10:00:00");
    d = attempt(d, graded[0].id, false, "2026-10-02T10:00:00");
    d = passLesson(d, "2026-10-02T10:05:00");
    expect(lessonMastery(LESSON_ID, lessonRef.lesson, d, at("2026-10-02T11:00:00")).state).not.toBe("dominado-provisional");
  });
});

describe("statistics", () => {
  it("computes accuracy only from attempts", () => {
    expect(accuracy([]).cleanRate).toBeNull();
    let d = attempt(emptyProgress(), "x", true, "2026-10-01T10:00:00");
    d = attempt(d, "x", false, "2026-10-01T10:01:00");
    expect(accuracy(d.attempts)).toMatchObject({ attempts: 2, clean: 1, cleanRate: 0.5 });
  });

  it("counts the streak through yesterday but not across gaps", () => {
    let d = emptyProgress();
    for (const day of ["2026-10-01", "2026-10-03", "2026-10-04"]) d = attempt(d, "x", true, `${day}T10:00:00`);
    expect(currentStreak(d, at("2026-10-04T20:00:00"))).toBe(2);
    expect(currentStreak(d, at("2026-10-05T08:00:00"))).toBe(2);
    expect(currentStreak(d, at("2026-10-06T08:00:00"))).toBe(0);
    expect(currentStreak(emptyProgress(), at("2026-10-06T08:00:00"))).toBe(0);
  });

  it("caps study chunks and aggregates weekly goals from real data", () => {
    let d = actions.addStudyTime(emptyProgress(), "finales", 10_000, at("2026-10-20T10:00:00"));
    expect(d.studyTime["2026-10-20"].finales).toBe(actions.MAX_STUDY_CHUNK_SECONDS);
    for (let i = 0; i < 30; i++) d = actions.addStudyTime(d, "tactica", 60, at("2026-10-21T10:00:00"));
    d = attempt(d, "x", true, "2026-10-21T10:00:00");
    d = attempt(d, "x", true, "2026-10-12T10:00:00"); // previous week
    const goals = weeklyGoals(d, at("2026-10-21T12:00:00")); // Wednesday
    expect(goals.minutes.done).toBe(32);
    expect(goals.exercises.done).toBe(1);
    expect(goals.days.done).toBe(2);
  });

  it("flags weak themes only with enough attempts", () => {
    let d = emptyProgress();
    d = attempt(d, "x", false, "2026-10-20T10:00:00");
    d = attempt(d, "x", false, "2026-10-20T10:01:00");
    expect(weakThemes(d, at("2026-10-21T10:00:00"))).toEqual([]);
    d = attempt(d, "x", true, "2026-10-20T10:02:00");
    expect(weakThemes(d, at("2026-10-21T10:00:00"))).toEqual([{ theme: "regla-del-cuadrado", attempts: 3, cleanRate: 1 / 3 }]);
    // old attempts fall out of the window
    expect(weakThemes(d, at("2026-12-21T10:00:00"))).toEqual([]);
  });

  it("does not estimate a level without data", () => {
    expect(estimateLevel(emptyProgress()).level).toBeNull();
    let d = emptyProgress();
    for (let i = 0; i < 5; i++) d = attempt(d, "x", true, `2026-10-2${i}T10:00:00`, { difficulty: 3 });
    expect(estimateLevel(d).level).toBe("intermedio");
  });

  it("builds a Monday-aligned activity calendar", () => {
    const cal = activityCalendar(emptyProgress(), at("2026-10-21T10:00:00"), 2);
    expect(cal).toHaveLength(14);
    expect(cal[0].day).toBe("2026-10-12");
  });
});

describe("session recommendations", () => {
  it("starts with the first lesson of each course for a new student, within the time budget", () => {
    const session = buildSession(emptyProgress(), at("2026-10-21T10:00:00"), 15);
    expect(session.length).toBeGreaterThan(0);
    expect(session.every((s) => s.kind === "nuevo" && s.ref.index === 0)).toBe(true);
    const minutes = session.reduce((sum, s) => sum + s.ref.lesson.estimatedMinutes, 0);
    expect(minutes).toBeLessThanOrEqual(15);
  });

  it("puts lessons that need review first", () => {
    let d = passLesson(emptyProgress(), "2026-10-01T10:00:00", false);
    d = actions.visitLesson(d, allLessons()[4].id, 0, at("2026-10-01T11:00:00"));
    const session = buildSession(d, at("2026-10-02T10:00:00"), 60);
    expect(session[0]).toMatchObject({ kind: "repaso" });
    expect(session[0].ref.id).toBe(LESSON_ID);
    expect(session[1]).toMatchObject({ kind: "continuar" });
  });
});

describe("repository", () => {
  it("parses valid data and recovers from corrupt data without throwing", () => {
    expect(parseProgress(null)).toEqual({ data: emptyProgress(), recovered: false });
    expect(parseProgress("{not json").recovered).toBe(true);
    expect(parseProgress(JSON.stringify({ version: 99 })).recovered).toBe(true);
    const good = passLesson(emptyProgress(), "2026-10-01T10:00:00");
    expect(parseProgress(JSON.stringify(good)).data).toEqual(good);
  });

  it("backs up unreadable data before starting fresh", () => {
    const store = new Map<string, string>([[STORAGE_KEY, "garbage"]]);
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    } as Storage;
    const repo = new LocalStorageRepository(storage);
    expect(repo.load().recovered).toBe(true);
    expect(store.get(`${STORAGE_KEY}:corrupt-backup`)).toBe("garbage");
  });
});
