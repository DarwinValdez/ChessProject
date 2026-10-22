"use client";

import clsx from "clsx";
import { AlertTriangle, BookMarked, ChevronLeft, FlipVertical2, Swords, Target } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useMemo, useState } from "react";
import { BoardControls } from "@/components/board/BoardControls";
import { ChessBoard } from "@/components/board/ChessBoard";
import { MoveList } from "@/components/board/MoveList";
import { LevelTag } from "@/components/ui/Meta";
import { StateBadge } from "@/components/ui/StateBadge";
import { useLinePlayer } from "@/hooks/useLinePlayer";
import { useNow } from "@/hooks/useNow";
import { useStudyTimer } from "@/hooks/useStudyTimer";
import { START_FEN } from "@/lib/chess/game";
import { localizeSan } from "@/lib/chess/notation";
import { getLessonById } from "@/lib/content/catalog";
import { FAMILY_LABEL, openingUnitId } from "@/lib/content/openings";
import type { Opening } from "@/lib/content/openings/types";
import type { AnnotatedMove } from "@/lib/content/types";
import { openingAsLesson } from "@/lib/content/units";
import { lessonMastery } from "@/lib/progress/mastery";
import { useProgress } from "@/lib/progress/store";
import { OpeningPractice } from "./OpeningPractice";
import { RepertoireButtons } from "./RepertoireButtons";

interface Selection {
  key: string;
  label: string;
  group: string;
  moves: AnnotatedMove[];
  /** Ply shown when the line is selected. */
  startAt: number;
  description: string;
  warning?: boolean;
}

function buildSelections(opening: Opening): Selection[] {
  const list: Selection[] = [];
  for (const line of [opening.mainLine, ...opening.variations]) {
    list.push({
      key: `line:${line.id}`,
      label: line.name + (line.eco ? ` (${line.eco})` : ""),
      group: line.kind === "principal" ? "Línea principal" : "Variantes",
      moves: line.moves,
      startAt: line.kind === "principal" ? 0 : line.moves.length,
      description: (line.gambit ? "Gambito. " : "") + line.description,
    });
  }
  for (const trap of opening.traps) {
    const moves: AnnotatedMove[] = trap.moves.map((san, i) =>
      i === trap.moves.length - 1 ? { san, comment: `⚠ Error de las ${trap.victim}: ${localizeSan(san)}?? cae en la trampa.` } : { san },
    );
    list.push({
      key: `trap:${trap.id}`,
      label: trap.name,
      group: "Trampas",
      moves: [...moves, ...trap.punishment],
      startAt: trap.moves.length,
      description: trap.explanation,
      warning: true,
    });
  }
  for (const pos of opening.critical) {
    list.push({
      key: `critical:${pos.id}`,
      label: pos.title,
      group: "Posiciones críticas",
      moves: pos.moves.map((san) => ({ san })),
      startAt: pos.moves.length,
      description: pos.explanation,
    });
  }
  opening.mistakes.forEach((mistake, i) => {
    if (!mistake.moves) return;
    list.push({
      key: `mistake:${i}`,
      label: `Error frecuente ${i + 1}`,
      group: "Errores frecuentes",
      moves: mistake.moves.map((san) => ({ san })),
      startAt: mistake.moves.length,
      description: mistake.text,
      warning: true,
    });
  });
  return list;
}

function LineBoard({ selection, orientation }: { selection: Selection; orientation: "white" | "black" }) {
  const player = useLinePlayer(START_FEN, selection.moves, selection.startAt);
  const { current, cursor, go, moves } = player;
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="mx-auto w-full max-w-[min(100%,calc(100dvh-12rem))]">
        <ChessBoard id={`opening-${selection.key}`} fen={player.fen} orientation={orientation} lastMove={current?.record} arrows={current?.arrows} />
        <div className="mt-3">
          <BoardControls
            onStart={() => go(0)}
            onBack={() => go(cursor - 1)}
            onForward={() => go(cursor + 1)}
            onEnd={() => go(moves.length)}
            canBack={player.canBack}
            canForward={player.canForward}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div
          className={clsx(
            "rounded-lg border p-3 text-sm leading-relaxed",
            selection.warning ? "border-warn/40 bg-warn-soft" : "border-border bg-surface-2",
          )}
        >
          <p className="label mb-1">{selection.group}</p>
          <p className="font-medium">{selection.label}</p>
          <p className="mt-1 text-muted">{selection.description}</p>
        </div>
        <div className="min-h-14 rounded-lg border border-border p-3 text-sm" aria-live="polite">
          {current?.comment ?? <span className="text-faint">{cursor === 0 ? "Posición inicial. Avanza con →." : "Sin comentario en esta jugada."}</span>}
        </div>
        <div className="max-h-60 overflow-y-auto">
          <MoveList startFen={START_FEN} moves={moves} cursor={cursor} onSelect={go} />
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children, className }: { title: string; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={clsx("card p-5", className)}>
      <h2 className="mb-3 flex items-center gap-2 font-semibold tracking-tight">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-4 text-sm text-muted marker:text-accent">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function OpeningView({ opening }: { opening: Opening }) {
  const selections = useMemo(() => buildSelections(opening), [opening]);
  const [selectedKey, setSelectedKey] = useState(selections[0].key);
  const [orientation, setOrientation] = useState<"white" | "black">(opening.side === "negras" ? "black" : "white");
  const selection = selections.find((s) => s.key === selectedKey) ?? selections[0];
  const data = useProgress();
  const unitId = openingUnitId(opening.slug);
  const now = useNow();
  useStudyTimer("aperturas");
  const mastery = data && now ? lessonMastery(unitId, openingAsLesson(opening), data, now) : null;
  const groups = [...new Set(selections.map((s) => s.group))];

  const select = (key: string) => {
    setSelectedKey(key);
    document.getElementById("tablero-apertura")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      <Link href="/aperturas" className="inline-flex w-fit items-center gap-1 text-sm text-muted hover:text-text">
        <ChevronLeft className="h-4 w-4" aria-hidden /> Biblioteca de aperturas
      </Link>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded bg-surface-2 px-2 py-0.5 font-mono text-xs text-muted">ECO {opening.eco}</span>
            <LevelTag level={opening.level} />
            {opening.families.map((f) => (
              <span key={f} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                {FAMILY_LABEL[f]}
              </span>
            ))}
            {mastery && <StateBadge state={mastery.state} title={mastery.reason} />}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{opening.name}</h1>
          {opening.aliases && <p className="mt-0.5 text-sm text-faint">También: {opening.aliases.join(", ")}</p>}
          <p className="mt-2 max-w-3xl text-[15px] text-muted">{opening.summary}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <RepertoireButtons slug={opening.slug} side={opening.side} />
          <a href="#practica" className="btn-primary">
            <Target className="h-4 w-4" /> Practicar ({opening.exercises.length})
          </a>
        </div>
      </header>

      <section id="tablero-apertura" className="card scroll-mt-4 p-4 sm:p-5" aria-label="Tablero de líneas">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex min-w-0 flex-1 items-center gap-2 text-sm">
            <span className="shrink-0 text-muted">Línea:</span>
            <select className="input" value={selection.key} onChange={(e) => setSelectedKey(e.target.value)}>
              {groups.map((group) => (
                <optgroup key={group} label={group}>
                  {selections
                    .filter((s) => s.group === group)
                    .map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setOrientation((o) => (o === "white" ? "black" : "white"))}
            aria-label="Girar tablero"
          >
            <FlipVertical2 className="h-4 w-4" /> Girar
          </button>
        </div>
        <LineBoard key={selection.key} selection={selection} orientation={orientation} />
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <Section title="Ideas principales">
          <Bullets items={opening.ideas} />
        </Section>
        <Section title="Objetivos estratégicos">
          <p className="label mb-1.5">Blancas</p>
          <Bullets items={opening.goals.white} />
          <p className="label mb-1.5 mt-3">Negras</p>
          <Bullets items={opening.goals.black} />
        </Section>
        <Section title="Planes típicos">
          <p className="label mb-1.5">Blancas</p>
          <Bullets items={opening.plans.white} />
          <p className="label mb-1.5 mt-3">Negras</p>
          <Bullets items={opening.plans.black} />
        </Section>
        <Section title="Estructuras de peones">
          <dl className="flex flex-col gap-3 text-sm">
            {opening.structures.map((s) => (
              <div key={s.name}>
                <dt className="font-medium">{s.name}</dt>
                <dd className="mt-0.5 text-muted">{s.description}</dd>
              </div>
            ))}
          </dl>
        </Section>
        <Section title="Casillas fuertes y débiles">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="label mb-1.5">Fuertes</p>
              <Bullets items={opening.squares.strong} />
            </div>
            <div>
              <p className="label mb-1.5">Débiles</p>
              <Bullets items={opening.squares.weak} />
            </div>
          </div>
          <p className="mt-3 text-sm text-muted">{opening.squares.note}</p>
        </Section>
        <Section title="Desarrollo de piezas">
          <Bullets items={opening.development} />
        </Section>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Section title="Trampas conocidas" icon={<AlertTriangle className="h-4 w-4 text-warn" aria-hidden />}>
          {opening.traps.length === 0 ? (
            <p className="text-sm text-muted">No registramos trampas verificadas para esta apertura todavía.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {opening.traps.map((trap) => (
                <li key={trap.id} className="rounded-lg border border-warn/40 bg-warn-soft p-3 text-sm">
                  <p className="font-medium">⚠ {trap.name}</p>
                  <p className="mt-1 text-muted">Cae en ella: las {trap.victim}. {trap.explanation}</p>
                  <button type="button" className="btn-secondary mt-2 px-2.5 py-1 text-xs" onClick={() => select(`trap:${trap.id}`)}>
                    Ver en el tablero
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Section>
        <Section title="Errores frecuentes">
          <ul className="flex flex-col gap-3 text-sm">
            {opening.mistakes.map((mistake, i) => (
              <li key={i} className="text-muted">
                {mistake.text}
                {mistake.moves && (
                  <button type="button" className="ml-1 text-xs font-medium text-accent hover:underline" onClick={() => select(`mistake:${i}`)}>
                    Ver en el tablero
                  </button>
                )}
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Variantes" icon={<Swords className="h-4 w-4 text-faint" aria-hidden />}>
          <ul className="flex flex-col gap-2.5 text-sm">
            {[opening.mainLine, ...opening.variations].map((line) => (
              <li key={line.id}>
                <button type="button" className="text-left hover:text-accent" onClick={() => select(`line:${line.id}`)}>
                  <span className="font-medium">{line.name}</span>
                  {line.eco && <span className="ml-1.5 font-mono text-xs text-faint">{line.eco}</span>}
                  {line.gambit && <span className="ml-1.5 rounded bg-surface-2 px-1.5 text-[11px] text-muted">Gambito</span>}
                  <span className="mt-0.5 block font-mono text-xs text-faint">
                    {line.moves
                      .slice(0, 12)
                      .map((mv, i) => (i % 2 === 0 ? `${i / 2 + 1}.${localizeSan(mv.san)}` : localizeSan(mv.san)))
                      .join(" ")}
                    {line.moves.length > 12 ? " …" : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Partidas modelo" icon={<BookMarked className="h-4 w-4 text-faint" aria-hidden />}>
          {opening.modelGames.length === 0 ? (
            <p className="text-sm text-muted">Pendiente de importar partidas de dominio público desde una fuente verificada.</p>
          ) : (
            <ul className="flex flex-col gap-3 text-sm">
              {opening.modelGames.map((g) => (
                <li key={`${g.white}-${g.year}`}>
                  <p className="font-medium">
                    {g.white} – {g.black}
                  </p>
                  <p className="text-xs text-faint">
                    {g.event}, {g.year}
                  </p>
                  <p className="mt-1 text-muted">{g.note}</p>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-faint">
            Referencias bibliográficas: las jugadas se incorporarán cuando se importen desde una base de partidas verificada (no las reproducimos de
            memoria).
          </p>
        </Section>
      </div>

      {opening.relatedLessons && opening.relatedLessons.length > 0 && (
        <Section title="Lecciones relacionadas">
          <ul className="flex flex-wrap gap-2">
            {opening.relatedLessons.map((id) => {
              const ref = getLessonById(id);
              if (!ref) return null;
              return (
                <li key={id}>
                  <Link href={`/cursos/${ref.course.slug}/${ref.lesson.slug}`} className="chip">
                    {ref.lesson.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      <OpeningPractice opening={opening} />
    </div>
  );
}
