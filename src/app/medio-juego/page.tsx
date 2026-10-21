import type { Metadata } from "next";
import { AreaPage } from "@/components/catalog/AreaPage";

export const metadata: Metadata = { title: "Medio juego" };

export default function MediojuegoPage() {
  return (
    <AreaPage
      area="medio-juego"
      intro="Estructuras de peones, casillas débiles, planes y evaluación posicional: aprender a formular un plan a partir de las características de la posición."
    />
  );
}
