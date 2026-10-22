"use client";

import { ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { LEVELS, levelLabel } from "@/lib/content/catalog";
import { AUTHORS, BOOKS, type Book, getAuthor } from "@/lib/content/library";
import type { Level } from "@/lib/content/types";
import { RelatedLinks } from "./RelatedLinks";

const AREA_LABEL: Record<Book["areas"][number], string> = {
  aperturas: "Aperturas",
  "medio-juego": "Medio juego",
  tactica: "Táctica",
  finales: "Finales",
  fundamentos: "Fundamentos",
  calculo: "Cálculo",
  estrategia: "Estrategia",
};

function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function LibraryView() {
  const [query, setQuery] = useState("");
  const [author, setAuthor] = useState("");
  const [area, setArea] = useState("");
  const [level, setLevel] = useState<Level | "">("");

  const books = useMemo(() => {
    const words = normalize(query).split(/\s+/).filter(Boolean);
    return BOOKS.filter((b) => {
      if (author && b.authorId !== author) return false;
      if (area && !(b.areas as string[]).includes(area)) return false;
      if (level && !b.levels.includes(level)) return false;
      const hay = normalize([b.title, b.spanishTitle ?? "", getAuthor(b.authorId)?.name ?? "", ...b.concepts].join(" "));
      return words.every((w) => hay.includes(w));
    });
  }, [query, author, area, level]);

  return (
    <div className="flex flex-col gap-5">
      <div className="card flex flex-col gap-2 p-4 md:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden />
          <input className="input pl-9" type="search" placeholder="Título, autor o concepto…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <label className="md:w-48">
          <span className="sr-only">Autor</span>
          <select className="input" value={author} onChange={(e) => setAuthor(e.target.value)}>
            <option value="">Todos los autores</option>
            {AUTHORS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <label className="md:w-40">
          <span className="sr-only">Área</span>
          <select className="input" value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Todas las áreas</option>
            {Object.entries(AREA_LABEL).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="md:w-40">
          <span className="sr-only">Nivel</span>
          <select className="input" value={level} onChange={(e) => setLevel(e.target.value as Level | "")}>
            <option value="">Todos los niveles</option>
            {LEVELS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm text-faint" aria-live="polite">
        {books.length === 1 ? "1 obra" : `${books.length} obras`}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {books.map((book) => {
          const a = getAuthor(book.authorId);
          return (
            <article key={book.id} className="card flex flex-col gap-3 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={
                    book.status === "dominio-publico"
                      ? "rounded bg-accent-soft px-1.5 py-0.5 text-[11px] font-medium text-accent"
                      : "rounded border border-border px-1.5 py-0.5 text-[11px] text-faint"
                  }
                >
                  {book.status === "dominio-publico" ? "Dominio público (con matices)" : "Referencia externa"}
                </span>
                {book.areas.map((ar) => (
                  <span key={ar} className="text-xs text-accent">
                    {AREA_LABEL[ar]}
                  </span>
                ))}
              </div>
              <div>
                <h2 className="font-semibold tracking-tight">{book.title}</h2>
                {book.spanishTitle && <p className="text-sm text-faint">En español: {book.spanishTitle}</p>}
                <p className="mt-1 text-sm text-muted">
                  {a?.name} · {book.firstPublished} · {book.publisher}
                </p>
              </div>
              <div>
                <p className="label mb-1">Qué enseña</p>
                <ul className="flex list-disc flex-col gap-1 pl-4 text-sm text-muted marker:text-accent">
                  {book.concepts.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-faint">Nivel recomendado: {book.levels.map(levelLabel).join(", ")}</p>
              {book.related.length > 0 && (
                <div>
                  <p className="label mb-1.5">Lecciones relacionadas de la academia</p>
                  <RelatedLinks ids={book.related} />
                </div>
              )}
              <div className="mt-auto border-t border-border pt-3 text-xs text-muted">
                <p>{book.statusNote}</p>
                <ul className="mt-2 flex flex-wrap gap-3">
                  {book.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-accent hover:underline">
                        {l.label} <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
