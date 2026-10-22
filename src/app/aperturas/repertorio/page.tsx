import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { RepertoireView } from "@/components/openings/RepertoireView";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Mi repertorio" };

export default function RepertoirePage() {
  return (
    <PageContainer>
      <Link href="/aperturas" className="inline-flex w-fit items-center gap-1 text-sm text-muted hover:text-text">
        <ChevronLeft className="h-4 w-4" aria-hidden /> Biblioteca de aperturas
      </Link>
      <PageHeader
        title="Mi repertorio"
        description="Las aperturas que eliges con cada color y las respuestas del rival que aún no tienes preparadas. Las aperturas de tu repertorio entran en tu sesión recomendada."
      />
      <RepertoireView />
    </PageContainer>
  );
}
