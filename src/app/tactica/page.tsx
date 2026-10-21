import type { Metadata } from "next";
import { AreaPage } from "@/components/catalog/AreaPage";

export const metadata: Metadata = { title: "Táctica" };

export default function TacticaPage() {
  return (
    <AreaPage
      area="tactica"
      intro="Motivos tácticos y cálculo. Cada ejercicio registra intentos, tiempo, pistas y errores, y la solución solo se muestra después de intentarlo."
    />
  );
}
