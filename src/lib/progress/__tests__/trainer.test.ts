import { describe, expect, it } from "vitest";
import * as actions from "../actions";
import { emptyProgress } from "../schema";
import { exercisePool, filterPool, orderPool } from "../trainer";

describe("trainer pool", () => {
  const pool = exercisePool();

  it("collects exercises from courses and openings", () => {
    expect(pool.length).toBeGreaterThan(10);
    expect(pool.some((p) => p.unit.id.startsWith("aperturas/"))).toBe(true);
    expect(new Set(pool.map((p) => p.key)).size).toBe(pool.length);
  });

  it("filters by theme, area and difficulty", () => {
    expect(filterPool(pool, { theme: "clavada" }).every((p) => p.step.themes.includes("clavada"))).toBe(true);
    expect(filterPool(pool, { area: "finales" }).every((p) => p.unit.area === "finales")).toBe(true);
    expect(filterPool(pool, { maxDifficulty: 1 }).every((p) => p.step.difficulty === 1)).toBe(true);
  });

  it("puts unseen first, then failed, then the oldest clean", () => {
    const [a, b, c] = pool;
    const attempt = (item: typeof a, clean: boolean, at: string) => (d: ReturnType<typeof emptyProgress>) =>
      actions.addAttempt(
        d,
        { lessonId: item.unit.id, stepId: item.step.id, kind: "exercise", area: item.unit.area, themes: [], solved: clean, clean, wrongMoves: clean ? 0 : 1, hintsUsed: 0, gaveUp: false, timeMs: 1 },
        new Date(at),
        `${item.key}-${at}`,
      );
    let d = emptyProgress();
    d = attempt(a, true, "2026-10-01T10:00:00Z")(d);
    d = attempt(b, false, "2026-10-02T10:00:00Z")(d);
    const ordered = orderPool([a, b, c], d).map((p) => p.key);
    expect(ordered).toEqual([c.key, b.key, a.key]);
  });
});
