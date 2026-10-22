import type { Metadata } from "next";
import { LibraryView } from "@/components/library/LibraryView";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Biblioteca" };

export default function LibraryPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Recursos"
        title="Biblioteca de estudio"
        description="Obras de referencia organizadas por autor, área y nivel, conectadas con las lecciones de la academia."
      />
      <div className="rounded-lg border border-border bg-surface-2 p-4 text-sm text-muted">
        Solo mostramos datos bibliográficos y descripciones propias: no reproducimos capítulos, diagramas ni soluciones de libros comerciales. Los enlaces
        son búsquedas en catálogos públicos (WorldCat, Project Gutenberg); comprueba allí la edición y su disponibilidad legal en tu país.
      </div>
      <LibraryView />
    </PageContainer>
  );
}
