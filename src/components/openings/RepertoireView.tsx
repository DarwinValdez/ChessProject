"use client";

import { CheckCircle2, CircleAlert, Trash2 } from "lucide-react";
import Link from "next/link";
import { getOpening } from "@/lib/content/openings";
import { type CoverageCheck, blackCoverage, whiteCoverage } from "@/lib/content/openings/repertoire";
import { progressStore, useProgress } from "@/lib/progress/store";

function Coverage({ checks }: { checks: CoverageCheck[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {checks.map((c) => (
        <li key={c.id} className="flex gap-2.5 text-sm">
          {c.covered ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-label="Cubierto" />
          ) : (
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warn" aria-label="Sin preparar" />
          )}
          <span className="min-w-0">
            <span className="font-medium">{c.label}</span>
            <span className="block text-muted">{c.covered ? (c.suggestions.length ? "Preparado." : c.detail) : c.detail}</span>
            {!c.covered && c.suggestions.length > 0 && (
              <span className="mt-1 flex flex-wrap gap-1.5">
                {c.suggestions.map((slug) => (
                  <Link key={slug} href={`/aperturas/${slug}`} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted hover:text-text">
                    {getOpening(slug)?.name ?? slug}
                  </Link>
                ))}
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function RepertoireView() {
  const data = useProgress();
  if (!data) return <div className="h-64 animate-pulse rounded-xl bg-surface-2" />;
  const entries = data.repertoire ?? [];

  const column = (color: "blancas" | "negras") => {
    const mine = entries.filter((e) => e.color === color);
    return (
      <section className="card flex flex-col gap-4 p-5" aria-label={`Repertorio con ${color}`}>
        <h2 className="font-semibold tracking-tight">Con {color}</h2>
        {mine.length === 0 ? (
          <p className="text-sm text-muted">Aún no has añadido aperturas. Ábrelas desde la biblioteca y pulsa «Mi repertorio con {color}».</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {mine.map((e) => {
              const opening = getOpening(e.slug);
              return (
                <li key={e.slug} className="flex items-center justify-between gap-3 py-2">
                  <Link href={`/aperturas/${e.slug}`} className="min-w-0 text-sm font-medium hover:text-accent">
                    {opening?.name ?? e.slug}
                    <span className="ml-2 font-mono text-xs font-normal text-faint">{opening?.eco}</span>
                  </Link>
                  <button
                    type="button"
                    className="icon-btn h-8 w-8"
                    aria-label={`Quitar ${opening?.name ?? e.slug}`}
                    onClick={() => progressStore.toggleRepertoire(e)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <div className="border-t border-border pt-4">
          <h3 className="label mb-3">Cobertura</h3>
          <Coverage checks={color === "blancas" ? whiteCoverage(entries) : blackCoverage(entries)} />
        </div>
      </section>
    );
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {column("blancas")}
      {column("negras")}
    </div>
  );
}
