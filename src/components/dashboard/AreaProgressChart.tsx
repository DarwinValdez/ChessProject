"use client";

import { useState } from "react";
import { TOPIC_STATE_LABEL, type TopicState } from "@/lib/progress/mastery";
import type { AreaProgress } from "@/lib/progress/stats";

/** Series order and colours (validated palette, see globals.css). */
const SERIES: { state: TopicState; color: string }[] = [
  { state: "dominado-provisional", color: "var(--chart-mastered)" },
  { state: "en-curso", color: "var(--chart-progress)" },
  { state: "necesita-repaso", color: "var(--chart-review)" },
];

function Tooltip({ text }: { text: string }) {
  return (
    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 text-xs text-text shadow-card">
      {text}
    </span>
  );
}

export function AreaProgressChart({ areas }: { areas: AreaProgress[] }) {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted" aria-label="Leyenda">
        {SERIES.map((s) => (
          <li key={s.state} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} aria-hidden />
            {TOPIC_STATE_LABEL[s.state]}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "var(--chart-track)" }} aria-hidden />
          {TOPIC_STATE_LABEL["no-iniciado"]}
        </li>
      </ul>

      <div className="flex flex-col gap-3.5" aria-hidden>
        {areas.map((a) => {
          const started = a.total - a.counts["no-iniciado"];
          return (
            <div key={a.area}>
              <div className="mb-1.5 flex items-baseline justify-between text-sm">
                <span className="font-medium">{a.label}</span>
                <span className="text-xs text-muted">
                  {a.total === 0
                    ? "Sin lecciones publicadas"
                    : `${a.counts["dominado-provisional"]} de ${a.total} dominadas · ${started} empezadas`}
                </span>
              </div>
              <div className="flex h-2.5 gap-[2px] rounded-full" style={{ background: a.total === 0 ? "transparent" : undefined }}>
                {a.total === 0 ? (
                  <div className="h-full w-full rounded-full border border-dashed border-border" />
                ) : (
                  [...SERIES, { state: "no-iniciado" as TopicState, color: "var(--chart-track)" }].map((s, i, all) => {
                    const count = a.counts[s.state];
                    if (count === 0) return null;
                    const key = `${a.area}-${s.state}`;
                    const isFirst = all.slice(0, i).every((p) => a.counts[p.state] === 0);
                    const isLast = all.slice(i + 1).every((p) => a.counts[p.state] === 0);
                    return (
                      <div
                        key={key}
                        className="relative h-full"
                        style={{
                          width: `${(count / a.total) * 100}%`,
                          background: s.color,
                          borderRadius: `${isFirst ? 4 : 0}px ${isLast ? 4 : 0}px ${isLast ? 4 : 0}px ${isFirst ? 4 : 0}px`,
                          opacity: hover && hover !== key ? 0.55 : 1,
                        }}
                        onPointerEnter={() => setHover(key)}
                        onPointerLeave={() => setHover(null)}
                      >
                        {hover === key && <Tooltip text={`${a.label} · ${TOPIC_STATE_LABEL[s.state]}: ${count} de ${a.total}`} />}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-xs text-muted hover:text-text">Ver como tabla</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">Lecciones por área y estado</caption>
            <thead className="text-faint">
              <tr>
                <th className="py-1 pr-3 font-medium">Área</th>
                {(["dominado-provisional", "en-curso", "necesita-repaso", "no-iniciado"] as TopicState[]).map((s) => (
                  <th key={s} className="py-1 pr-3 text-right font-medium">
                    {TOPIC_STATE_LABEL[s]}
                  </th>
                ))}
                <th className="py-1 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((a) => (
                <tr key={a.area} className="border-t border-border">
                  <th className="py-1 pr-3 font-medium">{a.label}</th>
                  {(["dominado-provisional", "en-curso", "necesita-repaso", "no-iniciado"] as TopicState[]).map((s) => (
                    <td key={s} className="py-1 pr-3 text-right tabular-nums">
                      {a.counts[s]}
                    </td>
                  ))}
                  <td className="py-1 text-right tabular-nums">{a.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
