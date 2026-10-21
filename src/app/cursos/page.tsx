import type { Metadata } from "next";
import { CourseCatalog } from "@/components/catalog/CourseCatalog";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Cursos" };

export default function CoursesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Catálogo de cursos"
        description="Cada lección combina explicación, posiciones verificadas y ejercicios que miden lo que de verdad retienes."
      />
      <CourseCatalog />
    </PageContainer>
  );
}
