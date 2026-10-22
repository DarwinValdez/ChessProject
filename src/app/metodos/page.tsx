import type { Metadata } from "next";
import Link from "next/link";
import { RelatedLinks } from "@/components/library/RelatedLinks";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { METHODS, METHOD_CATEGORIES, getAuthor, getBook } from "@/lib/content/library";

export const metadata: Metadata = { title: "Métodos de entrenadores" };

export default function MethodsPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Recursos"
        title="Métodos de entrenamiento"
        description="Enfoques pedagógicos documentados en obras de entrenadores y jugadores reconocidos, explicados con nuestras palabras y conectados con ejercicios de la academia."
      />
      <div className="rounded-lg border border-border bg-surface-2 p-4 text-sm text-muted">
        Las descripciones son originales de la academia: no son citas. Ningún autor mencionado ha revisado ni respaldado este contenido; las obras se
        indican como fuente para que puedas consultarlas.
      </div>
      <nav aria-label="Categorías" className="flex flex-wrap gap-2">
        {METHOD_CATEGORIES.map((c) => (
          <a key={c.id} href={`#${c.id}`} className="chip">
            {c.label}
          </a>
        ))}
      </nav>
      {METHOD_CATEGORIES.map((category) => {
        const methods = METHODS.filter((m) => m.category === category.id);
        if (methods.length === 0) return null;
        return (
          <section key={category.id} id={category.id} className="scroll-mt-4">
            <h2 className="mb-3 text-lg font-semibold tracking-tight">{category.label}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {methods.map((method) => {
                const author = getAuthor(method.authorId);
                const book = getBook(method.bookId);
                return (
                  <article key={method.id} className="card flex flex-col gap-3 p-5">
                    <div>
                      <h3 className="font-semibold">{method.title}</h3>
                      <p className="mt-0.5 text-xs text-faint">
                        {author ? author.name : "Enfoque propio de la academia"}
                        {book && (
                          <>
                            {" · "}
                            <Link href="/biblioteca" className="underline hover:text-text">
                              {book.title}
                            </Link>{" "}
                            ({book.firstPublished})
                          </>
                        )}
                      </p>
                    </div>
                    <p className="text-sm text-muted">{method.description}</p>
                    <div>
                      <p className="label mb-1">Cómo practicarlo aquí</p>
                      <ul className="flex list-disc flex-col gap-1 pl-4 text-sm text-muted marker:text-accent">
                        {method.practice.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <RelatedLinks ids={method.related} />
                    {method.tool && (
                      <Link href={method.tool.href} className="btn-secondary mt-auto w-fit">
                        {method.tool.label}
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </PageContainer>
  );
}
