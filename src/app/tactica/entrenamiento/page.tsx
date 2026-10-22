import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Trainer } from "@/components/tactics/Trainer";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Entrenamiento de ejercicios" };

export default function TrainerPage() {
  return (
    <PageContainer>
      <Link href="/tactica" className="inline-flex w-fit items-center gap-1 text-sm text-muted hover:text-text">
        <ChevronLeft className="h-4 w-4" aria-hidden /> Táctica
      </Link>
      <PageHeader
        title="Entrenamiento por temas"
        description="Todos los ejercicios de la academia en un solo lugar. Cada intento cuenta para el dominio de la lección de la que procede."
      />
      <Trainer initialArea="tactica" />
    </PageContainer>
  );
}
