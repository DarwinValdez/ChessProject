import { describe, expect, it } from "vitest";
import { blackCoverage, whiteCoverage } from "../openings/repertoire";

const byId = (checks: { id: string; covered: boolean }[]) => Object.fromEntries(checks.map((c) => [c.id, c.covered]));

describe("repertoire coverage", () => {
  it("asks for a first move when white has nothing", () => {
    expect(whiteCoverage([])).toMatchObject([{ id: "primera", covered: false }]);
  });

  it("lists black replies to 1.e4 and marks prepared ones", () => {
    const checks = byId(whiteCoverage([
      { slug: "apertura-italiana", color: "blancas" },
      { slug: "defensa-siciliana", color: "blancas" },
    ]));
    expect(checks).toEqual({ "e4-e5": true, "e4-c5": true, "e4-e6": false, "e4-c6": false });
  });

  it("does not mix colours", () => {
    const checks = byId(whiteCoverage([{ slug: "apertura-italiana", color: "blancas" }, { slug: "defensa-francesa", color: "negras" }]));
    expect(checks["e4-e6"]).toBe(false);
  });

  it("requires both Ruy Lopez and Italian preparation after choosing 1...e5", () => {
    const checks = byId(blackCoverage([{ slug: "apertura-italiana", color: "negras" }]));
    expect(checks["vs-e4"]).toBe(true);
    expect(checks["vs-italiana"]).toBe(true);
    expect(checks["vs-espanola"]).toBe(false);
  });

  it("warns that the Nimzo-Indian needs a plan against 3.g3/3.Nf3", () => {
    const checks = byId(blackCoverage([{ slug: "defensa-nimzoindia", color: "negras" }]));
    expect(checks["vs-d4"]).toBe(true);
    expect(checks["vs-catalana"]).toBe(false);
  });
});
