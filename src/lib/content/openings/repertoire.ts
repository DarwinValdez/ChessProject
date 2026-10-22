/**
 * Repertoire coverage: given the openings the student chose per colour,
 * list the opponent's main replies that are (or are not) prepared, using
 * only openings that exist in the library.
 */
import { getOpening } from "./index";

export type RepertoireColor = "blancas" | "negras";

export interface RepertoireItem {
  slug: string;
  color: RepertoireColor;
}

export interface CoverageCheck {
  id: string;
  label: string;
  covered: boolean;
  detail: string;
  /** Library openings that would cover it. */
  suggestions: string[];
}

function has(entries: RepertoireItem[], color: RepertoireColor, slugs: string[]): boolean {
  return entries.some((e) => e.color === color && slugs.includes(e.slug));
}

function check(id: string, label: string, entries: RepertoireItem[], color: RepertoireColor, slugs: string[], detail: string): CoverageCheck {
  return { id, label, covered: has(entries, color, slugs), detail, suggestions: slugs };
}

/** First white move implied by an opening chosen with white. */
function whiteFirstMove(slug: string): string | undefined {
  return getOpening(slug)?.mainLine.moves[0]?.san;
}

export function whiteCoverage(entries: RepertoireItem[]): CoverageCheck[] {
  const white = entries.filter((e) => e.color === "blancas");
  const firstMoves = new Set(white.map((e) => whiteFirstMove(e.slug)).filter(Boolean));
  if (firstMoves.size === 0) {
    return [
      {
        id: "primera",
        label: "Primera jugada",
        covered: false,
        detail: "Elige al menos un sistema para blancas.",
        suggestions: ["apertura-italiana", "apertura-espanola", "gambito-de-dama", "apertura-catalana", "apertura-inglesa", "apertura-reti"],
      },
    ];
  }
  const checks: CoverageCheck[] = [];
  if (firstMoves.has("e4")) {
    checks.push(
      check("e4-e5", "1.e4 e5", white, "blancas", ["apertura-espanola", "apertura-italiana"], "Necesitas un sistema contra 1...e5."),
      check("e4-c5", "1.e4 c5 (Siciliana)", white, "blancas", ["defensa-siciliana"], "La respuesta más frecuente a 1.e4."),
      check("e4-e6", "1.e4 e6 (Francesa)", white, "blancas", ["defensa-francesa"], "Estudia la Francesa desde el lado blanco."),
      check("e4-c6", "1.e4 c6 (Caro-Kann)", white, "blancas", ["defensa-caro-kann"], "Estudia la Caro-Kann desde el lado blanco."),
    );
  }
  if (firstMoves.has("d4")) {
    checks.push(
      check("d4-d5", "1.d4 d5", white, "blancas", ["gambito-de-dama", "apertura-catalana"], "Necesitas un sistema contra 1...d5."),
      check("d4-nimzo", "1.d4 Cf6 2.c4 e6 3.Cc3 Ab4 (Nimzoindia)", white, "blancas", ["defensa-nimzoindia", "apertura-catalana"], "Con 3.g3 (Catalana) se evita la Nimzoindia."),
      check("d4-kid", "1.d4 Cf6 2.c4 g6 (India de Rey)", white, "blancas", ["defensa-india-de-rey"], "Estudia la India de Rey desde el lado blanco."),
      check("d4-grunfeld", "1.d4 Cf6 2.c4 g6 3.Cc3 d5 (Grünfeld)", white, "blancas", ["defensa-grunfeld"], "Estudia la Grünfeld desde el lado blanco."),
    );
  }
  for (const move of ["c4", "Nf3"]) {
    if (firstMoves.has(move)) {
      checks.push({
        id: `flexible-${move}`,
        label: move === "c4" ? "1.c4 (respuestas negras)" : "1.Cf3 (respuestas negras)",
        covered: true,
        detail: "Muchas respuestas transponen a otras aperturas; la biblioteca aún no tiene líneas específicas para cada una.",
        suggestions: [],
      });
    }
  }
  return checks;
}

export function blackCoverage(entries: RepertoireItem[]): CoverageCheck[] {
  const black = entries.filter((e) => e.color === "negras");
  const e5 = has(black, "negras", ["apertura-espanola", "apertura-italiana"]);
  const checks: CoverageCheck[] = [
    check(
      "vs-e4",
      "Contra 1.e4",
      black,
      "negras",
      ["defensa-siciliana", "defensa-francesa", "defensa-caro-kann", "apertura-espanola", "apertura-italiana"],
      "Elige una defensa contra 1.e4 (o prepara 1...e5).",
    ),
  ];
  if (e5) {
    checks.push(
      check("vs-espanola", "1...e5: contra la Española", black, "negras", ["apertura-espanola"], "Si juegas 1...e5 tienes que estar listo para 3.Ab5."),
      check("vs-italiana", "1...e5: contra la Italiana", black, "negras", ["apertura-italiana"], "Si juegas 1...e5 tienes que estar listo para 3.Ac4."),
    );
  }
  checks.push(
    check("vs-d4", "Contra 1.d4", black, "negras", ["defensa-nimzoindia", "defensa-india-de-rey", "defensa-grunfeld", "gambito-de-dama", "apertura-catalana"], "Elige una defensa contra 1.d4."),
  );
  if (has(black, "negras", ["defensa-nimzoindia"])) {
    checks.push(
      check("vs-catalana", "Nimzoindia: contra 3.g3 / 3.Cf3", black, "negras", ["apertura-catalana", "gambito-de-dama"], "La Nimzoindia necesita 3.Cc3; contra 3.g3 o 3.Cf3 te hace falta otra preparación."),
    );
  }
  checks.push(
    check("vs-c4", "Contra 1.c4", black, "negras", ["apertura-inglesa"], "La Inglesa aparece con frecuencia y transpone a muchas estructuras."),
    check("vs-nf3", "Contra 1.Cf3", black, "negras", ["apertura-reti"], "La Réti puede evitar tu defensa favorita contra 1.d4."),
  );
  return checks;
}
