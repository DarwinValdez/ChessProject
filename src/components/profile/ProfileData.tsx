"use client";

import { Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/layout/theme";
import { progressStore, useProgress } from "@/lib/progress/store";

export function ProfileData() {
  const data = useProgress();
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  function download() {
    const blob = new Blob([progressStore.exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chess-academy-progreso-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="card flex flex-col gap-3 p-5">
        <h2 className="font-semibold">Cuenta</h2>
        <p className="text-sm text-muted">
          Estás usando la academia en <span className="font-medium text-text">modo invitado</span>. Tu progreso se guarda únicamente en este
          navegador: no se envía a ningún servidor.
        </p>
        <p className="text-sm text-muted">
          El registro e inicio de sesión (Supabase) llegan en la Fase 4. Al iniciar sesión podrás trasladar a tu cuenta el progreso de este
          navegador.
        </p>
      </section>

      <section className="card flex flex-col gap-3 p-5">
        <h2 className="font-semibold">Apariencia</h2>
        <p className="text-sm text-muted">Tema claro, oscuro o el del sistema operativo.</p>
        <ThemeSwitcher />
      </section>

      <section className="card flex flex-col gap-3 p-5 lg:col-span-2">
        <h2 className="font-semibold">Tus datos</h2>
        <p className="text-sm text-muted">
          {data
            ? `${data.attempts.length} intentos registrados · ${Object.keys(data.lessons).length} lecciones abiertas.`
            : "Cargando…"}
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={download} disabled={!data}>
            <Download className="h-4 w-4" /> Exportar progreso (JSON)
          </button>
          {!confirming ? (
            <button type="button" className="btn-ghost text-danger" onClick={() => setConfirming(true)} disabled={!data}>
              <Trash2 className="h-4 w-4" /> Borrar progreso
            </button>
          ) : (
            <span className="flex flex-wrap items-center gap-2 rounded-lg border border-danger/40 bg-danger-soft px-3 py-1.5 text-sm">
              ¿Borrar todo el progreso de este navegador? No se puede deshacer.
              <button
                type="button"
                className="btn bg-danger px-2.5 py-1 text-white"
                onClick={() => {
                  progressStore.reset();
                  setConfirming(false);
                  setDone("Progreso borrado.");
                }}
              >
                Sí, borrar
              </button>
              <button type="button" className="btn-ghost px-2.5 py-1" onClick={() => setConfirming(false)}>
                Cancelar
              </button>
            </span>
          )}
        </div>
        {done && (
          <p className="text-sm text-accent" role="status">
            {done}
          </p>
        )}
      </section>
    </div>
  );
}
