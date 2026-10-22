import { ListChecks } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CourseCatalog } from "@/components/catalog/CourseCatalog";
import { OpeningLibrary } from "@/components/openings/OpeningLibrary";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Aperturas" };

export default function OpeningsPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Área de estudio"
        title="Aperturas"
        description="Biblioteca de aperturas con ideas, planes, estructuras, trampas y ejercicios. Aprende por qué se juega cada movimiento, no solo cuál."
        actions={
          <Link href="/aperturas/repertorio" className="btn-secondary">
            <ListChecks className="h-4 w-4" /> Mi repertorio
          </Link>
        }
      />
      <OpeningLibrary />
      <div className="mt-4 flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Cursos de aperturas</h2>
        <CourseCatalog fixedArea="aperturas" />
      </div>
    </PageContainer>
  );
}
