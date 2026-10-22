import { describe, expect, it } from "vitest";
import { AUTHORS, BOOKS, METHODS, METHOD_CATEGORIES } from "../library";
import { getUnit } from "../units";

describe("library and methods", () => {
  it("references existing authors, books and academy units", () => {
    for (const book of BOOKS) {
      expect(AUTHORS.some((a) => a.id === book.authorId), book.id).toBe(true);
      for (const id of book.related) expect(getUnit(id), `${book.id} → ${id}`).toBeDefined();
      expect(book.links.length).toBeGreaterThan(0);
      for (const link of book.links) expect(link.href).toMatch(/^https:\/\/(search\.worldcat\.org|www\.gutenberg\.org)\//);
    }
    for (const method of METHODS) {
      if (method.authorId) expect(AUTHORS.some((a) => a.id === method.authorId), method.id).toBe(true);
      if (method.bookId) expect(BOOKS.some((b) => b.id === method.bookId), method.id).toBe(true);
      for (const id of method.related) expect(getUnit(id), `${method.id} → ${id}`).toBeDefined();
    }
  });

  it("includes the requested authors and every method category", () => {
    const names = AUTHORS.map((a) => a.name).join(" ");
    for (const name of ["Capablanca", "Nimzowitsch", "Kotov", "Dvoretsky", "Silman", "Nunn", "Seirawan", "Aagaard", "de la Villa"]) {
      expect(names).toContain(name);
    }
    for (const c of METHOD_CATEGORIES) expect(METHODS.some((m) => m.category === c.id), c.id).toBe(true);
  });

  it("never stores quotations (descriptions avoid quote marks around author text)", () => {
    for (const method of METHODS) expect(method.description).not.toMatch(/^["“«]/);
  });
});
