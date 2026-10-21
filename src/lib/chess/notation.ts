/**
 * Display-only conversion of SAN piece letters to the student's language.
 * Moves are always stored and validated in English SAN (chess.js); only
 * what the user reads is localised.
 */
export type NotationLocale = "es" | "en";

const PIECE_LETTERS: Record<NotationLocale, Record<string, string>> = {
  es: { K: "R", Q: "D", R: "T", B: "A", N: "C" },
  en: { K: "K", Q: "Q", R: "R", B: "B", N: "N" },
};

export function localizeSan(san: string, locale: NotationLocale = "es"): string {
  const letters = PIECE_LETTERS[locale];
  // Uppercase letters in SAN are always piece letters (files are lowercase),
  // including the promotion piece after "=". Castling uses "O", untouched.
  return san.replace(/[KQRBN]/g, (letter) => letters[letter]);
}
