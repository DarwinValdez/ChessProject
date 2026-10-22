"use client";

import { Check, Plus } from "lucide-react";
import { progressStore, useProgress } from "@/lib/progress/store";

/** Toggles the opening in the repertoire for each colour. */
export function RepertoireButtons({ slug, side }: { slug: string; side: "blancas" | "negras" }) {
  const data = useProgress();
  const entries = data?.repertoire ?? [];
  const colors: ("blancas" | "negras")[] = side === "blancas" ? ["blancas", "negras"] : ["negras", "blancas"];
  return (
    <div className="flex flex-col gap-1.5" role="group" aria-label="Repertorio">
      {colors.map((color, i) => {
        const active = entries.some((e) => e.slug === slug && e.color === color);
        const label = i === 0 ? `Mi repertorio con ${color}` : `Preparar con ${color}`;
        return (
          <button
            key={color}
            type="button"
            disabled={!data}
            aria-pressed={active}
            onClick={() => progressStore.toggleRepertoire({ slug, color })}
            className={active ? "btn border border-accent bg-accent-soft text-text" : i === 0 ? "btn-secondary" : "btn-ghost text-xs"}
            title={i === 0 ? undefined : `Estudiarla desde el lado de las ${color}, para saber enfrentarte a ella`}
          >
            {active ? <Check className="h-4 w-4 text-accent" /> : <Plus className="h-4 w-4" />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
