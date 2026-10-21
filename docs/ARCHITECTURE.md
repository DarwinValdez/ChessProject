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
reproductor de lecciones y contenido inicial verificado. 54 tests.

### Pendiente
- **Fase 2 — Academia:** biblioteca de aperturas por familias, constructor de repertorio, más cursos de finales
  (Lucena, Philidor…), medio juego (sin cursos todavía), biblioteca de libros y métodos de entrenadores.
- **Fase 3 — Análisis:** Stockfish WASM en Web Worker, árbol de variantes, evaluación, explorador de Lichess
  (con caché y manejo de límites/errores).
- **Fase 4 — Datos:** Supabase (auth, PostgreSQL, RLS), migración del progreso de invitado, favoritos, notas,
  colecciones.
- **Fase 5 — Personalización:** repetición espaciada por variante/concepto, plan diario/semanal adaptativo.
- **Fase 6 — Administración:** editor de cursos, importación PGN, validación y publicación.
- **Fase 7 — Calidad:** E2E automatizados, auditoría de accesibilidad, rendimiento, despliegue.

### Limitaciones conocidas de la Fase 1
- Sin motor: el tablero no muestra evaluaciones (lo indica explícitamente).
- Variantes: jugar otra jugada desde una posición anterior reemplaza la línea; al importar PGN se avisa de que
  las variantes se omiten.
- Solo modo invitado; los textos de páginas aún no están todos en el diccionario i18n (sí la navegación, el
  tablero y elementos comunes).
- `npm audit` informa de 5 vulnerabilidades "high" en dependencias de `eslint-config-next` (solo desarrollo);
  la corrección automática degradaría a Next 14, así que no se aplica.
