# Arquitectura

## Stack

| Pieza | Elección | Motivo |
|---|---|---|
| Framework | Next.js 16.4 (App Router, Cache Components, Turbopack) | Rutas estáticas prerenderizadas para el contenido, cliente para la interacción |
| Lenguaje | TypeScript 5 (estricto) | TS 7 (compilador nativo) es muy reciente; se evaluará más adelante |
| Estilos | Tailwind CSS 4 con tokens CSS (`src/app/globals.css`) | Tema claro/oscuro por `data-theme`, sin parpadeo |
| Reglas | chess.js 1.4 | Nunca se implementan reglas a mano |
| Tablero | react-chessboard 5.12 | Mantenido (último release ago-2026); aislado en `components/board/ChessBoard.tsx` |
| Validación | zod 4 | Datos persistidos y objetivos |
| Pruebas | Vitest 5 + Testing Library + jsdom | |

## Estructura

```
src/
  app/                    rutas: / (dashboard), /cursos, /cursos/[course], /cursos/[course]/[lesson],
                          /aperturas, /medio-juego, /tactica, /finales, /tablero, /perfil
  components/
    layout/               AppShell (sidebar + menú móvil), navegación, tema
    board/                ChessBoard, MoveList, BoardControls, GameStatusBadge, AnalysisBoard
    lesson/               LessonPlayer + vistas de paso (explicación, ejercicio, pregunta)
    dashboard/            Dashboard, gráficos (barras por área, calendario)
    catalog/              catálogo, temario, página de área
    ui/                   piezas pequeñas (cabeceras, etiquetas, estados)
  hooks/                  useChessGame, useBoardKeys, useStudyTimer
  lib/
    chess/                game.ts (estado inmutable sobre chess.js), pgn.ts, notation.ts (R/D/T/A/C)
    content/              types.ts, courses/*, catalog.ts (consultas), validate.ts, themes.ts
    lesson/               exercise.ts (máquina de estados del ejercicio, sin React)
    progress/             schema.ts (zod), actions.ts (transiciones puras), repository.ts,
                          store.ts (useSyncExternalStore), mastery.ts, stats.ts, recommend.ts
  i18n/                   diccionario `es` tipado; `en` se añade con la misma forma
```

## Decisiones clave

- **Contenido como datos validados.** `validateCourse` comprueba FEN legales (incluido "el bando que no mueve
  está en jaque", que chess.js acepta), jugadas legales en SAN canónica, árboles de solución, refutaciones y
  casillas. Lo ejecutan los tests y lo usará el panel admin antes de publicar (Fase 6).
- **Veredictos teóricos explícitos.** Cada lección/ejercicio puede declarar `victoria-forzada-*`,
  `tablas-teoricas` o `ganable-en-practica`, y cómo se verificó (`stockfish`, `tablebase`, `teoria-clasica`).
  La red de este entorno bloquea `lichess.ovh`, así que la verificación inicial se hizo con Stockfish 19
  local (profundidad 22–30).
- **Dominio basado en retención.** Una lección está "dominada provisionalmente" solo si cada paso evaluable se
  resolvió *limpio* (sin errores ni pistas) en dos días distintos y el último intento sigue limpio. Un acierto
  tras fallar ese mismo día no cuenta. Repasos espaciados a 1, 3, 7, 14, 30 y 60 días.
- **Estadísticas sin inventar.** Todo se calcula desde `attempts` y `studyTime`; sin datos se muestra "—" o
  "Sin estimar" con el motivo. El tiempo solo cuenta con la pestaña visible y actividad en los últimos 90 s.
- **Persistencia intercambiable.** `ProgressRepository` tiene hoy implementación `localStorage` (modo
  invitado, con copia de seguridad si los datos están corruptos) y en memoria (tests). Supabase será otra
  implementación del mismo contrato.
- **Notación.** Se almacena SAN inglés (chess.js); se muestra en español (R, D, T, A, C).

## Estado por fases

### Fase 1 — Fundación ✅
Arquitectura, diseño visual (tokens, tema), navegación, dashboard, catálogo, tablero 2D funcional,
reproductor de lecciones y contenido inicial verificado.

### Fase 2 — Academia ✅
- **Aperturas:** biblioteca de 12 aperturas (`src/lib/content/openings/`) clasificadas por familias y grupos
  (abiertas, semiabiertas, cerradas, semicerradas, hipermodernas, gambitos, sistemas para blancas, contra 1.e4,
  contra 1.d4). Cada una con ECO, ideas, objetivos, estructuras, planes, casillas, desarrollo, trampas marcadas,
  errores frecuentes, variantes, posiciones críticas y ejercicios. Todas las líneas se validan automáticamente.
- **Repertorio:** el alumno elige aperturas por color; `openings/repertoire.ts` calcula qué respuestas del rival
  quedan sin preparar. Las aperturas del repertorio entran en la sesión recomendada.
- **Unidades de estudio** (`content/units.ts`): lecciones de curso y prácticas de apertura comparten el mismo
  sistema de dominio, repasos y estadísticas.
- **Cursos nuevos:** Finales de torres (Lucena, Philidor, torre detrás del peón), Medio juego (peón aislado,
  columnas abiertas, caballo contra alfil malo, cómo formular un plan); lecciones nuevas de peón pasado alejado,
  eliminación del defensor y mate de la coz.
- **Entrenador por temas** (`/tactica/entrenamiento`): todos los ejercicios, filtrables por tema, área y
  dificultad, ordenados por no vistos → fallados → más antiguos.
- **Biblioteca y métodos** (`content/library.ts`): 12 obras de 9 autores con metadatos, área, nivel, conceptos,
  lecciones relacionadas y estado legal; 14 métodos en 7 categorías, con descripciones propias (sin citas).

**Política de verificación del contenido.** Todas las evaluaciones citadas se comprobaron con Stockfish 19.
Cuando el motor (sin tablebases) ve varias jugadas equivalentes —p. ej. en el arranque de Lucena o de Philidor—
la lección enseña el método como *recomendado* y el ejercicio se sitúa en el momento en que la jugada sí es
única (7.Tc4 en Lucena, 3...Td1+/Tb6+ en Philidor). Cuando el motor ve igualdad en una posición "de manual"
(columna abierta, caballo contra alfil malo), la lección lo dice y explica por qué.

### Pendiente
- **Fase 3 — Análisis:** Stockfish WASM en Web Worker, árbol de variantes, evaluación, explorador de Lichess
  (con caché y manejo de límites/errores). Importar partidas modelo desde una base verificada.
- **Fase 4 — Datos:** Supabase (auth, PostgreSQL, RLS), migración del progreso de invitado, favoritos, notas,
  colecciones.
- **Fase 5 — Personalización:** repetición espaciada por variante/concepto, plan diario/semanal adaptativo.
- **Fase 6 — Administración:** editor de cursos, importación PGN, validación y publicación.
- **Fase 7 — Calidad:** E2E automatizados, auditoría de accesibilidad, rendimiento, CSP estricta.

### Limitaciones conocidas
- Sin motor en la app: el tablero no muestra evaluaciones (lo indica explícitamente).
- Partidas modelo: solo referencias bibliográficas; las jugadas no se reproducen de memoria.
- Faltan contenidos de la lista de la especificación: finales de piezas menores y de damas, finales avanzados,
  más motivos tácticos (interferencia, sobrecarga, desviación…) y más módulos de medio juego.
- La red del entorno de desarrollo no permite acceder a Lichess, editoriales ni catálogos: los enlaces de la
  biblioteca son búsquedas en WorldCat/Gutenberg.
- Solo modo invitado; textos de página aún no extraídos al diccionario i18n.
- `npm audit`: 5 vulnerabilidades "high" en dependencias de `eslint-config-next` (solo desarrollo).
