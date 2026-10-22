import { Shuffle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AreaPage } from "@/components/catalog/AreaPage";

export const metadata: Metadata = { title: "Táctica" };

export default function TacticaPage() {
  return (
    <AreaPage
      area="tactica"
      intro="Motivos tácticos y cálculo. Cada ejercicio registra intentos, tiempo, pistas y errores, y la solución solo se muestra después de intentarlo."
      actions={
        <Link href="/tactica/entrenamiento" className="btn-primary">
          <Shuffle className="h-4 w-4" /> Entrenar por temas
        </Link>
      }
    />
  );
}
