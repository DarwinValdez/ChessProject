"use client";

import { ArrowRight, Shuffle } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { ExerciseStepView } from "@/components/lesson/ExerciseStepView";
import type { StepOutcome, StepSlots } from "@/components/lesson/types";
import { useStudyTimer } from "@/hooks/useStudyTimer";
import { AREAS } from "@/lib/content/catalog";
import { themeLabel } from "@/lib/content/themes";
import type { Area } from "@/lib/content/types";
import type { ProgressData } from "@/lib/progress/schema";
import { useProgress } from "@/lib/progress/store";
import { type PoolItem, exercisePool, filterPool, orderPool, poolThemes } from "@/lib/progress/trainer";

const POOL = exercisePool();
const THEMES = poolThemes(POOL);

export function Trainer({ initialArea }: { initialArea?: Area }) {
  const data = useProgress();
  const [theme, setTheme] = useState("");
  const [area, setArea] = useState<Area | "">(initialArea ?? "");
  const [maxDifficulty, setMaxDifficulty] = useState(0);
  const [current, setCurrent] = useState<PoolItem | null>(null);
  const [round, setRound] = useState(0);
  const [session, setSession] = useState<StepOutcome[]>([]);
  const [done, setDone] = useState(false);
  useStudyTimer(area || "tactica");

  // Bring the new exercise's board into view.
  useEffect(() => {
    if (round > 0) document.getElementById("ejercicio-actual")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [round]);

  const filtered = useMemo(
    () => filterPool(POOL, { theme: theme || undefined, area: area || undefined, maxDifficulty: maxDifficulty || undefined }),
    [theme, area, maxDifficulty],
  );

  // The queue is ordered when the student asks for the next exercise, so it
  // does not reshuffle while an exercise is being solved.
  function next(progress: ProgressData | null) {
    const queue = progress ? orderPool(filtered, progress) : filtered;
    const pick = queue.find((i) => i.key !== current?.key) ?? queue[0] ?? null;
    setCurrent(pick);
    setDone(false);
    setRound((r) => r + 1);
  }

  const slots: StepSlots = {
    board: (node: ReactNode) => <div className="mx-auto w-full max-w-[min(100%,calc(100dvh-14rem))]">{node}</div>,
    panel: (node: ReactNode) => (
      <div className="flex flex-col gap-4">
        {current && (
          <p className="text-xs text-faint">
            De:{" "}
            <Link href={current.unit.href} className="underline hover:text-text">
              {current.unit.title}
            </Link>{" "}
            · {current.unit.context}
          </p>
        )}
        {node}
        {done && (
          <button type="button" className="btn-primary w-fit" onClick={() => next(data)}>
            Siguiente ejercicio <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    ),
  };

  const clean = session.filter((o) => o.clean).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span className="label">Tema</span>
          <select className="input" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="">Todos los temas</option>
            {THEMES.map((t) => (
              <option key={t} value={t}>
                {themeLabel(t)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm sm:w-44">
          <span className="label">Área</span>
          <select className="input" value={area} onChange={(e) => setArea(e.target.value as Area | "")}>
            <option value="">Todas</option>
            {AREAS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm sm:w-44">
          <span className="label">Dificultad máx.</span>
          <select className="input" value={maxDifficulty} onChange={(e) => setMaxDifficulty(Number(e.target.value))}>
            <option value={0}>Cualquiera</option>
            {[1, 2, 3, 4, 5].map((d) => (
              <option key={d} value={d}>
                {d}/5
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn-primary" onClick={() => next(data)} disabled={filtered.length === 0}>
          <Shuffle className="h-4 w-4" /> {current ? "Otro ejercicio" : "Empezar"}
        </button>
      </div>

      <p className="text-sm text-faint" aria-live="polite">
        {filtered.length} ejercicios con estos filtros. Orden: primero los que no has visto, después los que fallaste y por último los que hace más
        tiempo que no repasas.
        {session.length > 0 && ` Esta sesión: ${clean} de ${session.length} sin errores ni pistas.`}
      </p>

      {current ? (
        <div id="ejercicio-actual" className="grid scroll-mt-4 gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <ExerciseStepView
            key={`${current.key}-${round}`}
            step={current.step}
            lessonId={current.unit.id}
            area={current.unit.area}
            slots={slots}
            onOutcome={(o) => {
              setSession((s) => [...s, o]);
              setDone(true);
            }}
          />
        </div>
      ) : (
        filtered.length === 0 && <div className="card p-6 text-sm text-muted">No hay ejercicios con estos filtros.</div>
      )}
    </div>
  );
}
