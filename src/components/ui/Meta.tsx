import { areaLabel, levelLabel } from "@/lib/content/catalog";
import type { Area, ContentSource, Level, TheoreticalResult } from "@/lib/content/types";

const SOURCE_LABEL: Record<ContentSource, string> = {
  propio: "Contenido propio",
  abierto: "Material abierto",
  "referencia-externa": "Referencia externa",
};

export function SourceTag({ source }: { source: ContentSource }) {
  return <span className="rounded border border-border px-1.5 py-0.5 text-[11px] text-faint">{SOURCE_LABEL[source]}</span>;
}

export function LevelTag({ level }: { level: Level }) {
  return <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">{levelLabel(level)}</span>;
}

export function AreaTag({ area }: { area: Area }) {
  return <span className="text-xs font-medium text-accent">{areaLabel(area)}</span>;
}

const RESULT: Record<TheoreticalResult, { label: string; hint: string }> = {
  "victoria-forzada-blancas": { label: "Victoria forzada (blancas)", hint: "Ganan con cualquier defensa si juegan correctamente." },
  "victoria-forzada-negras": { label: "Victoria forzada (negras)", hint: "Ganan con cualquier defensa si juegan correctamente." },
  "tablas-teoricas": { label: "Tablas teóricas", hint: "Con defensa correcta, el bando débil no pierde." },
  "ganable-en-practica": { label: "Ganable en la práctica", hint: "No hay victoria forzada demostrada, pero la defensa es difícil." },
};

export function ResultTag({ result }: { result: TheoreticalResult }) {
  return (
    <span className="rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-muted" title={RESULT[result].hint}>
      {RESULT[result].label}
    </span>
  );
}
