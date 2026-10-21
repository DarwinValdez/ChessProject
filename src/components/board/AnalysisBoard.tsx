"use client";

import { Check, ClipboardCopy, Cpu, Download, Upload } from "lucide-react";
import { useState } from "react";
import { useBoardKeys } from "@/hooks/useBoardKeys";
import { useChessGame } from "@/hooks/useChessGame";
import { useStudyTimer } from "@/hooks/useStudyTimer";
import { START_FEN, checkFen, createGame } from "@/lib/chess/game";
import { exportPgn, importPgn } from "@/lib/chess/pgn";
import { BoardControls } from "./BoardControls";
import { ChessBoard } from "./ChessBoard";
import { GameStatusBadge } from "./GameStatusBadge";
import { MoveList } from "./MoveList";

type Notice = { tone: "ok" | "error" | "info"; text: string } | null;

function NoticeLine({ notice }: { notice: Notice }) {
  if (!notice) return null;
  const color = notice.tone === "error" ? "text-danger" : notice.tone === "ok" ? "text-accent" : "text-muted";
  return (
    <p className={`text-sm ${color}`} role={notice.tone === "error" ? "alert" : "status"}>
      {notice.text}
    </p>
  );
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function AnalysisBoard() {
  const game = useChessGame(START_FEN);
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [fenInput, setFenInput] = useState("");
  const [pgnInput, setPgnInput] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [copied, setCopied] = useState<"fen" | "pgn" | null>(null);

  useStudyTimer("tablero");
  useBoardKeys({ back: game.back, forward: game.forward, start: game.toStart, end: game.toEnd });

  const flash = (what: "fen" | "pgn") => {
    setCopied(what);
    window.setTimeout(() => setCopied(null), 1500);
  };

  function loadFen() {
    const check = checkFen(fenInput);
    if (!check.ok) {
      setNotice({ tone: "error", text: `FEN no válida: ${check.error}` });
      return;
    }
    game.load(createGame(check.fen));
    setOrientation(check.fen.split(" ")[1] === "b" ? "black" : "white");
    setNotice({ tone: "ok", text: "Posición cargada." });
  }

  function loadPgn() {
    const result = importPgn(pgnInput);
    if (!result.ok) {
      setNotice({ tone: "error", text: result.error });
      return;
    }
    game.load(result.state);
    setNotice({
      tone: result.droppedVariations ? "info" : "ok",
      text: result.droppedVariations
        ? `Partida cargada (${result.state.moves.length} jugadas). Las variantes del PGN se han omitido: la navegación por variantes llega en la Fase 3.`
        : `Partida cargada (${result.state.moves.length} jugadas).`,
    });
  }

  function downloadPgn() {
    const blob = new Blob([exportPgn(game.state)], { type: "application/x-chess-pgn" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "partida.pgn";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="flex flex-col gap-3" aria-label="Tablero">
        <div className="mx-auto w-full max-w-[min(100%,calc(100dvh-12rem))]">
          <ChessBoard
            id="analysis"
            fen={game.fen}
            orientation={orientation}
            movable="both"
            onMove={game.move}
            lastMove={game.lastMove}
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <GameStatusBadge status={game.status} />
            <BoardControls
              onStart={game.toStart}
              onBack={game.back}
              onForward={game.forward}
              onEnd={game.toEnd}
              onFlip={() => setOrientation((o) => (o === "white" ? "black" : "white"))}
              onReset={game.reset}
              canBack={game.canBack}
              canForward={game.canForward}
            />
          </div>
        </div>
      </section>

      <aside className="flex flex-col gap-4">
        <section className="card p-4" aria-labelledby="moves-title">
          <h2 id="moves-title" className="label mb-2">
            Jugadas
          </h2>
          <div className="max-h-64 overflow-y-auto">
            <MoveList startFen={game.state.startFen} moves={game.state.moves} cursor={game.state.cursor} onSelect={game.goTo} />
          </div>
          <p className="mt-3 text-xs text-faint">
            Usa ← y → para navegar. Si juegas una jugada distinta desde una posición anterior, la línea se reemplaza (las variantes llegan en la Fase 3).
          </p>
        </section>

        <section className="card flex items-start gap-3 p-4" aria-labelledby="engine-title">
          <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-faint" aria-hidden />
          <div>
            <h2 id="engine-title" className="text-sm font-medium">
              Motor de análisis: no disponible todavía
            </h2>
            <p className="mt-1 text-sm text-muted">
              La evaluación con Stockfish (WebAssembly, en tu navegador) se integra en la Fase 3. Hasta entonces el tablero no muestra
              evaluaciones: no se simulan.
            </p>
          </div>
        </section>

        <section className="card flex flex-col gap-3 p-4" aria-labelledby="fen-title">
          <div className="flex items-center justify-between">
            <h2 id="fen-title" className="label">
              FEN
            </h2>
            <button
              type="button"
              className="btn-ghost px-2 py-1 text-xs"
              onClick={async () => (await copyText(game.fen)) ? flash("fen") : setNotice({ tone: "error", text: "No se pudo copiar al portapapeles." })}
            >
              {copied === "fen" ? <Check className="h-3.5 w-3.5" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
              {copied === "fen" ? "Copiada" : "Copiar actual"}
            </button>
          </div>
          <p className="break-all rounded-md bg-surface-2 px-2.5 py-2 font-mono text-xs text-muted">{game.fen}</p>
          <label className="sr-only" htmlFor="fen-input">
            Pegar FEN
          </label>
          <div className="flex gap-2">
            <input
              id="fen-input"
              className="input font-mono text-xs"
              placeholder="Pega una FEN…"
              value={fenInput}
              onChange={(e) => setFenInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadFen()}
            />
            <button type="button" className="btn-secondary shrink-0" onClick={loadFen} disabled={!fenInput.trim()}>
              Cargar
            </button>
          </div>
        </section>

        <section className="card flex flex-col gap-3 p-4" aria-labelledby="pgn-title">
          <div className="flex items-center justify-between">
            <h2 id="pgn-title" className="label">
              PGN
            </h2>
            <div className="flex gap-1">
              <button
                type="button"
                className="btn-ghost px-2 py-1 text-xs"
                onClick={async () =>
                  (await copyText(exportPgn(game.state))) ? flash("pgn") : setNotice({ tone: "error", text: "No se pudo copiar al portapapeles." })
                }
              >
                {copied === "pgn" ? <Check className="h-3.5 w-3.5" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
                {copied === "pgn" ? "Copiado" : "Copiar"}
              </button>
              <button type="button" className="btn-ghost px-2 py-1 text-xs" onClick={downloadPgn}>
                <Download className="h-3.5 w-3.5" /> Descargar
              </button>
            </div>
          </div>
          <label className="sr-only" htmlFor="pgn-input">
            Pegar PGN
          </label>
          <textarea
            id="pgn-input"
            className="input min-h-24 font-mono text-xs"
            placeholder="Pega una partida en PGN…"
            value={pgnInput}
            onChange={(e) => setPgnInput(e.target.value)}
          />
          <button type="button" className="btn-secondary" onClick={loadPgn} disabled={!pgnInput.trim()}>
            <Upload className="h-4 w-4" /> Importar PGN
          </button>
        </section>

        <NoticeLine notice={notice} />
      </aside>
    </div>
  );
}
