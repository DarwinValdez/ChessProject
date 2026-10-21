import { describe, expect, it } from "vitest";
import { getLessonById } from "@/lib/content/catalog";
import type { ExerciseStep } from "@/lib/content/types";
import { applyReply, canRevealSolution, outcome, solutionLine, startExercise, submitMove, takeHint } from "../exercise";

function exercise(lessonId: string): ExerciseStep {
  const step = getLessonById(lessonId)!.lesson.steps.find((s) => s.kind === "exercise");
  return step as ExerciseStep;
}

const fork = exercise("motivos-tacticos-esenciales/ataque-doble-caballo");
const square = exercise("finales-de-peones-fundamentos/regla-del-cuadrado");
const pin = exercise("motivos-tacticos-esenciales/clavada-absoluta");

describe("exercise flow", () => {
  it("solves a multi-move exercise with scripted replies, cleanly", () => {
    let s = startExercise(fork);
    const first = submitMove(s, fork, { from: "b5", to: "c7" });
    expect(first.kind).toBe("correct");
    s = first.state;
    expect(s.status).toBe("awaiting-reply");
    const reply = applyReply(s);
    expect(reply.move?.san).toBe("Ke7");
    s = reply.state;
    expect(s.status).toBe("solving");
    s = submitMove(s, fork, "Nxa8").state;
    expect(s.status).toBe("solved");
    expect(outcome(s, false)).toMatchObject({ solved: true, clean: true });
  });

  it("accepts any listed alternative", () => {
    for (const san of ["Ke2", "Ke3", "Ke4"]) {
      expect(submitMove(startExercise(square), square, san).state.status).toBe("solved");
    }
    const viaRfe1 = submitMove(startExercise(pin), pin, "Rfe1").state;
    const afterReply = applyReply(viaRfe1).state;
    expect(submitMove(afterReply, pin, "Qxe1+").state.status).toBe("solved");
  });

  it("counts wrong moves, returns refutation feedback and marks the attempt as not clean", () => {
    const s = startExercise(square);
    const wrong = submitMove(s, square, "Kg3");
    expect(wrong.kind).toBe("wrong");
    if (wrong.kind !== "wrong") return;
    expect(wrong.feedback).toContain("El rey se aleja");
    const solved = submitMove(wrong.state, square, "Ke3").state;
    expect(outcome(solved, false)).toMatchObject({ solved: true, clean: false, wrongMoves: 1 });
  });

  it("rejects illegal moves without counting them", () => {
    const s = startExercise(square);
    const r = submitMove(s, square, { from: "f3", to: "f5" });
    expect(r.kind).toBe("illegal");
    expect(r.state.wrongMoves).toBe(0);
  });

  it("does not reveal the solution before an attempt", () => {
    const s = startExercise(square);
    expect(canRevealSolution(s)).toBe(false);
    expect(canRevealSolution(takeHint(s, square))).toBe(false);
    expect(canRevealSolution(submitMove(s, square, "Kg3").state)).toBe(true);
  });

  it("hints are limited and make the attempt not clean", () => {
    let s = startExercise(square);
    for (let i = 0; i < 5; i++) s = takeHint(s, square);
    expect(s.hintsUsed).toBe(square.hints.length);
    s = submitMove(s, square, "Ke3").state;
    expect(outcome(s, false).clean).toBe(false);
  });

  it("giving up is never solved", () => {
    const s = submitMove(startExercise(square), square, "Kg3").state;
    expect(outcome(s, true)).toMatchObject({ solved: false, clean: false, gaveUp: true });
  });

  it("builds the main solution line", () => {
    expect(solutionLine(fork)).toEqual(["Nc7+", "Ke7", "Nxa8"]);
    expect(solutionLine(square)).toEqual(["Ke3"]);
  });
});
