import type { Metadata } from "next";
import { AnalysisBoard } from "@/components/board/AnalysisBoard";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Tablero de análisis" };

export default function BoardPage() {
  return (
    <PageContainer wide>
      <PageHeader
        title="Tablero de análisis"
        description="Juega jugadas legales, navega por la partida e importa o exporta posiciones en FEN y partidas en PGN."
      />
      <AnalysisBoard />
    </PageContainer>
  );
}
