import { describe, expect, it } from "vitest";
import { COURSES, allLessons, courseLessons, filterCourses, getLesson, getLessonById } from "../catalog";
import type { Course } from "../types";
import { validateCourse } from "../validate";

describe("course content", () => {
  it.each(COURSES.map((c) => [c.slug, c] as const))("%s: every FEN and move sequence is legal", (_slug, course) => {
    expect(validateCourse(course)).toEqual([]);
  });

  it("has unique course slugs and at least one lesson per area with content", () => {
    expect(new Set(COURSES.map((c) => c.slug)).size).toBe(COURSES.length);
    expect(allLessons().length).toBeGreaterThan(0);
  });

  it("every exercise declares how its evaluation was verified", () => {
    for (const ref of allLessons()) {
      for (const step of ref.lesson.steps) {
        if (step.kind === "exercise") expect(step.verification).not.toBe("sin-verificar");
      }
    }
  });
});

describe("validator", () => {
  const base: Course = {
    slug: "c",
    title: "c",
    area: "tactica",
    level: "principiante",
    summary: "",
    outcomes: [],
    source: "propio",
    modules: [
      {
        slug: "m",
        title: "m",
        lessons: [
          {
            slug: "l",
            title: "l",
            summary: "",
            objective: "",
            concept: "",
            estimatedMinutes: 1,
            themes: [],
            source: "propio",
            steps: [],
          },
        ],
      },
    ],
  };
  const withSteps = (steps: Course["modules"][0]["lessons"][0]["steps"]): Course => ({
    ...base,
    modules: [{ ...base.modules[0], lessons: [{ ...base.modules[0].lessons[0], steps }] }],
  });

  it("detects invalid FEN, illegal and non-canonical moves", () => {
    const issues = validateCourse(
      withSteps([
        { id: "a", kind: "explain", title: "", body: [], fen: "nonsense" },
        { id: "b", kind: "explain", title: "", body: [], fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", line: [{ san: "e5" }] },
        { id: "c", kind: "explain", title: "", body: [], fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", line: [{ san: "Ng1f3" }] },
      ]),
    );
    expect(issues.map((i) => i.message)).toEqual([
      expect.stringContaining("FEN no válida"),
      expect.stringContaining("Jugada ilegal"),
      expect.stringContaining("SAN no canónica"),
    ]);
  });

  it("walks exercise solution trees and refutations", () => {
    const issues = validateCourse(
      withSteps([
        {
          id: "e",
          kind: "exercise",
          title: "",
          prompt: "",
          themes: [],
          difficulty: 1,
          hints: [],
          explanation: "",
          verification: "stockfish",
          fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          solution: { options: [{ san: "e4", reply: "e5", next: { options: [{ san: "Qh5" }, { san: "Ke3" }] } }] },
          refutations: { e4: "dup", h5: "illegal for white" },
        },
      ]),
    );
    const messages = issues.map((i) => i.message).join("\n");
    expect(messages).toContain('Jugada ilegal "Ke3"');
    expect(messages).toContain('Jugada ilegal "h5"');
    expect(messages).toContain("a la vez solución y refutación");
    expect(messages).toContain("no tiene pistas");
  });

  it("requires a correct answer in questions", () => {
    const issues = validateCourse(
      withSteps([{ id: "q", kind: "question", title: "", prompt: "", themes: [], choices: [{ id: "a", text: "", correct: false, feedback: "" }] }]),
    );
    expect(issues[0].message).toContain("respuesta correcta");
  });
});

describe("catalog queries", () => {
  it("finds lessons by slug and id", () => {
    const ref = allLessons()[0];
    expect(getLesson(ref.course.slug, ref.lesson.slug)?.id).toBe(ref.id);
    expect(getLessonById(ref.id)?.lesson.slug).toBe(ref.lesson.slug);
    expect(getLessonById("nope")).toBeUndefined();
  });

  it("indexes lessons in study order", () => {
    for (const course of COURSES) courseLessons(course).forEach((ref, i) => expect(ref.index).toBe(i));
  });

  it("filters by area, level and accent-insensitive text", () => {
    expect(filterCourses(COURSES, { area: "finales" }).every((c) => c.area === "finales")).toBe(true);
    expect(filterCourses(COURSES, { level: "experto" })).toEqual([]);
    expect(filterCourses(COURSES, { query: "oposicion" }).map((c) => c.area)).toEqual(["finales"]);
    expect(filterCourses(COURSES, { query: "C54" }).map((c) => c.area)).toEqual(["aperturas"]);
    expect(filterCourses(COURSES, { query: "zzzz" })).toEqual([]);
  });
});
