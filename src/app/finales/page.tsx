import type { Metadata } from "next";
import { AreaPage } from "@/components/catalog/AreaPage";

export const metadata: Metadata = { title: "Finales" };

export default function FinalesPage() {
  return (
    <AreaPage
      area="finales"
      intro="De los fundamentos (oposición, casillas clave, regla del cuadrado) a las posiciones teóricas. Cada lección indica si el resultado es victoria forzada, tablas teóricas o solo ganable en la práctica."
    />
  );
}
