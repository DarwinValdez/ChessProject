/**
 * Automatic content validation: every FEN must be a legal position and
 * every move sequence legal and written in canonical SAN. Used by the test
 * suite today and by the admin panel before publishing (phase 6).
 */
import { checkFen, moveFromFen } from "@/lib/chess/game";
import type { Opening } from "./openings/types";
import type { AnnotatedMove, Arrow, Course, Lesson, LessonStep, UserTurn } from "./types";

export interface ValidationIssue {
  path: string;
  message: string;
}

const SQUARE = /^[a-h][1-8]$/;

function checkSquares(path: string, squares: string[] | undefined, issues: ValidationIssue[]) {
  for (const sq of squares ?? []) {
    if (!SQUARE.test(sq)) issues.push({ path, message: `Casilla no válida: "${sq}"` });
  }
}

function checkArrows(path: string, arrows: Arrow[] | undefined, issues: ValidationIssue[]) {
  for (const a of arrows ?? []) checkSquares(path, [a.from, a.to], issues);
}

/** Plays `san` at `fen`, requiring canonical SAN. Returns the new FEN or null. */
function playCanonical(path: string, fen: string, san: string, issues: ValidationIssue[]): string | null {
  const move = moveFromFen(fen, san);
  if (!move) {
    issues.push({ path, message: `Jugada ilegal "${san}" en ${fen}` });
    return null;
  }
  if (move.san !== san) {
    issues.push({ path, message: `SAN no canónica: "${san}" debería ser "${move.san}"` });
  }
  return move.fenAfter;
}

function checkTurn(path: string, fen: string, turn: UserTurn, issues: ValidationIssue[]) {
  if (turn.options.length === 0) issues.push({ path, message: "Turno sin jugadas aceptadas" });
  turn.options.forEach((option, i) => {
    const optPath = `${path}.options[${i}]`;
    const afterUser = playCanonical(optPath, fen, option.san, issues);
    if (!afterUser) return;
    if (!option.reply) {
      if (option.next) issues.push({ path: optPath, message: "Hay turno siguiente sin respuesta del rival" });
      return;
    }
    const afterReply = playCanonical(`${optPath}.reply`, afterUser, option.reply, issues);
    if (afterReply && option.next) checkTurn(`${optPath}.next`, afterReply, option.next, issues);
  });
}

export function validateStep(path: string, step: LessonStep, issues: ValidationIssue[]) {
  if (step.kind === "question") {
    if (step.fen) {
      const fen = checkFen(step.fen);
      if (!fen.ok) issues.push({ path, message: `FEN no válida: ${fen.error}` });
    }
    if (!step.choices.some((c) => c.correct)) issues.push({ path, message: "La pregunta no tiene respuesta correcta" });
    if (new Set(step.choices.map((c) => c.id)).size !== step.choices.length) {
      issues.push({ path, message: "IDs de respuesta duplicados" });
    }
    return;
  }

  const fenCheck = checkFen(step.fen);
  if (!fenCheck.ok) {
    issues.push({ path, message: `FEN no válida: ${fenCheck.error}` });
    return;
  }
  checkArrows(path, step.kind === "explain" ? step.arrows : undefined, issues);

  if (step.kind === "explain") {
    checkSquares(path, step.highlights, issues);
    let fen: string | null = step.fen;
    step.line?.forEach((move, i) => {
      if (!fen) return;
      const movePath = `${path}.line[${i}]`;
      checkArrows(movePath, move.arrows, issues);
      checkSquares(movePath, move.highlights, issues);
      fen = playCanonical(movePath, fen, move.san, issues);
    });
    return;
  }

  // exercise
  checkTurn(`${path}.solution`, step.fen, step.solution, issues);
  const accepted = new Set(step.solution.options.map((o) => o.san));
  for (const san of Object.keys(step.refutations ?? {})) {
    playCanonical(`${path}.refutations`, step.fen, san, issues);
    if (accepted.has(san)) issues.push({ path, message: `"${san}" es a la vez solución y refutación` });
  }
  if (step.hints.length === 0) issues.push({ path, message: "El ejercicio no tiene pistas" });
}

export function validateLesson(lesson: Lesson, basePath = lesson.slug): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (lesson.steps.length === 0) issues.push({ path: basePath, message: "La lección no tiene pasos" });
  const ids = new Set<string>();
  lesson.steps.forEach((step, i) => {
    if (ids.has(step.id)) issues.push({ path: basePath, message: `ID de paso duplicado: ${step.id}` });
    ids.add(step.id);
    validateStep(`${basePath}.steps[${i}](${step.id})`, step, issues);
  });
  return issues;
}

export function validateCourse(course: Course): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const lessonSlugs = new Set<string>();
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      if (lessonSlugs.has(lesson.slug)) {
        issues.push({ path: course.slug, message: `Slug de lección duplicado: ${lesson.slug}` });
      }
      lessonSlugs.add(lesson.slug);
      issues.push(...validateLesson(lesson, `${course.slug}/${lesson.slug}`));
    }
  }
  return issues;
}

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const ECO = /^[A-E]\d\d(–[A-E]\d\d)?$/;

/** Plays an annotated line from `fen`; returns the final FEN or null. */
function checkLine(path: string, fen: string, moves: AnnotatedMove[], issues: ValidationIssue[]): string | null {
  let current: string | null = fen;
  moves.forEach((move, i) => {
    if (!current) return;
    checkArrows(`${path}[${i}]`, move.arrows, issues);
    current = playCanonical(`${path}[${i}]`, current, move.san, issues);
  });
  return current;
}

export function validateOpening(opening: Opening): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const base = `aperturas/${opening.slug}`;
  if (!ECO.test(opening.eco)) issues.push({ path: base, message: `ECO no válido: ${opening.eco}` });
  const lines = [opening.mainLine, ...opening.variations];
  if (new Set(lines.map((l) => l.id)).size !== lines.length) issues.push({ path: base, message: "IDs de línea duplicados" });
  for (const line of lines) {
    if (line.eco && !ECO.test(line.eco)) issues.push({ path: `${base}/${line.id}`, message: `ECO no válido: ${line.eco}` });
    if (line.moves.length === 0) issues.push({ path: `${base}/${line.id}`, message: "Línea vacía" });
    checkLine(`${base}/${line.id}`, START, line.moves, issues);
  }
  for (const trap of opening.traps) {
    const after = checkLine(`${base}/trampa:${trap.id}`, START, trap.moves.map((san) => ({ san })), issues);
    if (after) checkLine(`${base}/trampa:${trap.id}/castigo`, after, trap.punishment, issues);
    if (trap.punishment.length === 0) issues.push({ path: `${base}/trampa:${trap.id}`, message: "Trampa sin refutación" });
  }
  opening.mistakes.forEach((mistake, i) => {
    if (mistake.moves) checkLine(`${base}/error[${i}]`, START, mistake.moves.map((san) => ({ san })), issues);
  });
  for (const pos of opening.critical) checkLine(`${base}/critica:${pos.id}`, START, pos.moves.map((san) => ({ san })), issues);
  const ids = new Set<string>();
  opening.exercises.forEach((step, i) => {
    if (ids.has(step.id)) issues.push({ path: base, message: `ID de ejercicio duplicado: ${step.id}` });
    ids.add(step.id);
    validateStep(`${base}/ejercicios[${i}](${step.id})`, step, issues);
  });
  if (opening.exercises.length === 0) issues.push({ path: base, message: "La apertura no tiene ejercicios" });
  return issues;
}
