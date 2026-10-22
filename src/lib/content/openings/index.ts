import { D4_AND_FLANK_OPENINGS } from "./d4";
import { E4_OPENINGS } from "./e4";
import type { Opening, OpeningFamily, OpeningGroup } from "./types";
import type { Level } from "../types";

export const OPENINGS: readonly Opening[] = [...E4_OPENINGS, ...D4_AND_FLANK_OPENINGS];

/** Library sections. "gambitos" lists openings with at least one gambit line. */
export type OpeningSection = OpeningFamily | OpeningGroup | "gambitos";

export const OPENING_SECTIONS: readonly { id: OpeningSection; label: string; description: string }[] = [
  { id: "abierta", label: "Abiertas", description: "1.e4 e5" },
  { id: "semiabierta", label: "Semiabiertas", description: "1.e4 y otra respuesta de las negras" },
  { id: "cerrada", label: "Cerradas", description: "1.d4 d5" },
  { id: "semicerrada", label: "Semicerradas", description: "1.d4 y otra respuesta (sobre todo 1...Cf6)" },
  { id: "hipermoderna", label: "Hipermodernas", description: "Control del centro desde los flancos" },
  { id: "gambitos", label: "Gambitos", description: "Aperturas con líneas de sacrificio de material" },
  { id: "sistema-blancas", label: "Sistemas para blancas", description: "Lo que eligen las blancas" },
  { id: "contra-e4", label: "Contra 1.e4", description: "Defensas para negras" },
  { id: "contra-d4", label: "Contra 1.d4", description: "Defensas para negras" },
];

export const FAMILY_LABEL: Record<OpeningFamily, string> = {
  abierta: "Abierta",
  semiabierta: "Semiabierta",
  cerrada: "Cerrada",
  semicerrada: "Semicerrada",
  hipermoderna: "Hipermoderna",
  flanco: "De flanco",
};

export function getOpening(slug: string): Opening | undefined {
  return OPENINGS.find((o) => o.slug === slug);
}

export function hasGambit(opening: Opening): boolean {
  return [opening.mainLine, ...opening.variations].some((l) => l.gambit);
}

export function inSection(opening: Opening, section: OpeningSection): boolean {
  if (section === "gambitos") return hasGambit(opening);
  return (opening.families as string[]).includes(section) || (opening.groups as string[]).includes(section);
}

function normalize(text: string): string {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function filterOpenings(
  openings: readonly Opening[],
  filter: { section?: OpeningSection; level?: Level; query?: string },
): Opening[] {
  const words = filter.query ? normalize(filter.query.trim()).split(/\s+/).filter(Boolean) : [];
  return openings.filter((o) => {
    if (filter.section && !inSection(o, filter.section)) return false;
    if (filter.level && o.level !== filter.level) return false;
    if (words.length === 0) return true;
    const haystack = normalize(
      [o.name, ...(o.aliases ?? []), o.eco, o.summary, ...[o.mainLine, ...o.variations].flatMap((l) => [l.name, l.eco ?? ""])].join(" "),
    );
    return words.every((w) => haystack.includes(w));
  });
}

/** Progress id of an opening's practice unit. */
export function openingUnitId(slug: string): string {
  return `aperturas/${slug}`;
}
