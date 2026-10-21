import type { Metadata } from "next";
import { AreaPage } from "@/components/catalog/AreaPage";

export const metadata: Metadata = { title: "Aperturas" };

export default function AperturasPage() {
  return (
    <AreaPage
      area="aperturas"
      intro="Aprende por qué se juega cada movimiento y qué hacer cuando el rival se aparta de la teoría. La biblioteca completa por familias (abiertas, semiabiertas, cerradas, gambitos…) y el constructor de repertorio llegan en la Fase 2."
    />
  );
}
