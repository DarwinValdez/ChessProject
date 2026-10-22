"use client";

import clsx from "clsx";
import { Check, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { LevelTag } from "@/components/ui/Meta";
import { StateBadge } from "@/components/ui/StateBadge";
import { useNow } from "@/hooks/useNow";
import { localizeSan } from "@/lib/chess/notation";
import { LEVELS } from "@/lib/content/catalog";
import { OPENINGS, OPENING_SECTIONS, type OpeningSection, filterOpenings, hasGambit, openingUnitId } from "@/lib/content/openings";
import type { Opening } from "@/lib/content/openings/types";
import type { Level } from "@/lib/content/types";
import { openingAsLesson } from "@/lib/content/units";
import { lessonMastery } from "@/lib/progress/mastery";
import type { ProgressData } from "@/lib/progress/schema";
import { useProgress } from "@/lib/progress/store";

function firstMoves(opening: Opening, plies = 6): string {
  return opening.mainLine.moves
    .slice(0, plies)
    .map((m, i) => (i % 2 === 0 ? `${i / 2 + 1}.${localizeSan(m.san)}` : localizeSan(m.san)))
    .join(" ");
}

function OpeningCard({ opening, data, now }: { opening: Opening; data: ProgressData | null; now: Date | null }) {
  const repertoire = (data?.repertoire ?? []).filter((e) => e.slug === opening.slug);
  const mastery = data && now ? lessonMastery(openingUnitId(opening.slug), openingAsLesson(opening), data, now) : null;
  return (
    <Link href={`/aperturas/${opening.slug}`} className="card group flex flex-col gap-2.5 p-5 transition-colors hover:border-border-strong">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-faint">ECO {opening.eco}</span>
        <LevelTag level={opening.level} />
      </div>
      <div>
        <h3 className="font-semibold tracking-tight group-hover:text-accent">{opening.name}</h3>
        <p className="mt-0.5 font-mono text-xs text-muted">{firstMoves(opening)}</p>
      </div>
      <p className="line-clamp-3 text-sm text-muted">{opening.summary}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs">
        {mastery && <StateBadge state={mastery.state} title={mastery.reason} />}
        {repertoire.map((e) => (
          <span key={e.color} className="inline-flex items-center gap-1 text-accent">
            <Check className="h-3 w-3" aria-hidden /> Repertorio ({e.color})
          </span>
        ))}
        {hasGambit(opening) && <span className="text-faint">Incluye gambitos</span>}
      </div>
    </Link>
  );
}

export function OpeningLibrary() {
  const data = useProgress();
  const now = useNow();
  const [section, setSection] = useState<OpeningSection | undefined>();
  const [level, setLevel] = useState<Level | undefined>();
  const [query, setQuery] = useState("");
  const openings = useMemo(() => filterOpenings(OPENINGS, { section, level, query }), [section, level, query]);
  const sectionInfo = OPENING_SECTIONS.find((s) => s.id === section);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar apertura</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden />
          <input
            type="search"
            className="input pl-9"
            placeholder="Buscar por nombre, variante o código ECO (p. ej. Najdorf, C89)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="sm:w-44">
          <span className="sr-only">Nivel</span>
          <select className="input" value={level ?? ""} onChange={(e) => setLevel((e.target.value || undefined) as Level | undefined)}>
            <option value="">Todos los niveles</option>
            {LEVELS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Clasificación">
        <button type="button" className="chip" aria-pressed={!section} onClick={() => setSection(undefined)}>
          Todas
        </button>
        {OPENING_SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className="chip"
            aria-pressed={section === s.id}
            onClick={() => setSection(section === s.id ? undefined : s.id)}
            title={s.description}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className={clsx("text-sm text-faint")} aria-live="polite">
        {openings.length === 1 ? "1 apertura" : `${openings.length} aperturas`}
        {sectionInfo && ` · ${sectionInfo.label}: ${sectionInfo.description}`}
      </p>
      {openings.length === 0 ? (
        <div className="card p-6 text-sm text-muted">Ninguna apertura coincide con estos filtros.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {openings.map((o) => (
            <OpeningCard key={o.slug} opening={o} data={data} now={now} />
          ))}
        </div>
      )}
    </div>
  );
}
