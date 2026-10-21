"use client";

import { useState } from "react";
import type { ActivityDay } from "@/lib/progress/stats";
import { formatDay } from "./format";

function level(day: ActivityDay): number {
  if (day.minutes >= 60) return 4;
  if (day.minutes >= 30) return 3;
  if (day.minutes >= 15) return 2;
  if (day.minutes > 0 || day.attempts > 0) return 1;
  return 0;
}

const WEEKDAYS = ["L", "", "X", "", "V", "", "D"];

/** 12-week calendar of study minutes (sequential single-hue ramp). */
export function ActivityCalendar({ days, today }: { days: ActivityDay[]; today: string }) {
  const [hover, setHover] = useState<ActivityDay | null>(null);
  const weeks: ActivityDay[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  const activeDays = days.filter((d) => level(d) > 0).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <div className="grid grid-rows-7 gap-[3px] pt-px text-[10px] leading-[12px] text-faint" aria-hidden>
          {WEEKDAYS.map((d, i) => (
            <span key={i} className="h-3">
              {d}
            </span>
          ))}
        </div>
        <div className="flex gap-[3px]" role="img" aria-label={`Días con estudio en las últimas 12 semanas: ${activeDays}`}>
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-rows-7 gap-[3px]">
              {week.map((day) => (
                <span
                  key={day.day}
                  onPointerEnter={() => setHover(day)}
                  onPointerLeave={() => setHover(null)}
                  className="h-3 w-3 rounded-[3px]"
                  style={{
                    background: day.day > today ? "transparent" : `var(--heat-${level(day)})`,
                    outline: day.day === today ? "1.5px solid var(--text-faint)" : undefined,
                    outlineOffset: 1,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex min-h-5 flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span aria-live="polite">
          {hover
            ? `${formatDay(hover.day)}: ${hover.minutes} min · ${hover.attempts} ${hover.attempts === 1 ? "ejercicio" : "ejercicios"}`
            : `${activeDays} ${activeDays === 1 ? "día" : "días"} con estudio en 12 semanas`}
        </span>
        <span className="flex items-center gap-1" aria-hidden>
          Menos
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className="h-2.5 w-2.5 rounded-[2px]" style={{ background: `var(--heat-${l})` }} />
          ))}
          Más
        </span>
      </div>
    </div>
  );
}
