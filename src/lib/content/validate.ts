/**
 * Automatic content validation: every FEN must be a legal position and
 * every move sequence legal and written in canonical SAN. Used by the test
 * suite today and by the admin panel before publishing (phase 6).
 */
import { checkFen, moveFromFen } from "@/lib/chess/game";
import type { Arrow, Course, Lesson, LessonStep, UserTurn } from "./types";

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

function validateStep(path: string, step: LessonStep, issues: ValidationIssue[]) {
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
