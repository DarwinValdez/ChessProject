import { describe, expect, it } from "vitest";
import { OPENINGS, filterOpenings, getOpening, inSection } from "../openings";
import { validateOpening } from "../validate";

describe("opening library", () => {
  it.each(OPENINGS.map((o) => [o.slug, o] as const))("%s: lines, traps, positions and exercises are legal", (_slug, opening) => {
    expect(validateOpening(opening)).toEqual([]);
  });

  it("covers the twelve requested openings with unique slugs", () => {
    expect(OPENINGS).toHaveLength(12);
    expect(new Set(OPENINGS.map((o) => o.slug)).size).toBe(12);
  });

  it("classifies by section", () => {
    const names = (section: Parameters<typeof inSection>[1]) => OPENINGS.filter((o) => inSection(o, section)).map((o) => o.slug);
    expect(names("contra-e4")).toEqual(["defensa-siciliana", "defensa-francesa", "defensa-caro-kann"]);
    expect(names("contra-d4")).toEqual(["defensa-nimzoindia", "defensa-india-de-rey", "defensa-grunfeld"]);
    expect(names("gambitos")).toEqual(expect.arrayContaining(["apertura-italiana", "defensa-siciliana", "apertura-espanola"]));
  });

  it("searches names, aliases and ECO codes without accents", () => {
    expect(filterOpenings(OPENINGS, { query: "ruy lopez" }).map((o) => o.slug)).toEqual(["apertura-espanola"]);
    expect(filterOpenings(OPENINGS, { query: "grunfeld" }).map((o) => o.slug)).toEqual(["defensa-grunfeld"]);
    expect(filterOpenings(OPENINGS, { query: "najdorf" }).map((o) => o.slug)).toEqual(["defensa-siciliana"]);
    expect(filterOpenings(OPENINGS, { query: "C89" }).map((o) => o.slug)).toEqual(["apertura-espanola"]);
    expect(getOpening("nope")).toBeUndefined();
  });

  it("detects broken content", () => {
    const broken = { ...OPENINGS[0], eco: "Z99", mainLine: { ...OPENINGS[0].mainLine, moves: [{ san: "e5" }] } };
    const messages = validateOpening(broken).map((i) => i.message).join("\n");
    expect(messages).toContain("ECO no válido");
    expect(messages).toContain("Jugada ilegal");
  });
});
