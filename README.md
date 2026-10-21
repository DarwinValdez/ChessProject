# Chess Academy

Academia interactiva de ajedrez: aperturas, medio juego, táctica y finales, con lecciones verificadas,
ejercicios que registran intentos reales y un dashboard calculado solo a partir de esos datos.

> Estado: **Fase 1 (fundación)** terminada. Ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para el detalle
> de lo implementado y lo pendiente.

## Requisitos

- Node.js ≥ 20.9 (probado con Node 22)
- npm ≥ 10

## Puesta en marcha

```bash
npm install
npm run dev          # http://localhost:3000
```

Producción local:

```bash
npm run build
npm start            # http://localhost:3000
```

## Comprobaciones

```bash
npm run typecheck    # genera los tipos de rutas de Next y ejecuta tsc
npm run lint         # ESLint (incluye las reglas del React Compiler)
npm test             # Vitest: reglas de ajedrez, PGN/FEN, validación de contenido, progreso y componentes
npm run check        # las tres anteriores
```

## Qué hay en la Fase 1

- Dashboard con nivel estimado, tiempo, racha, precisión, dominio por área, temas débiles,
  objetivos semanales editables, calendario de actividad, historial y sesión recomendada (15/30/45/60 min).
- Catálogo de cursos con búsqueda (sin acentos, por tema o ECO), filtros por área, nivel y duración.
- Reproductor de lecciones en tres columnas (temario · tablero · entrenador) con pasos de explicación,
  ejercicio (pistas progresivas, refutaciones, solución paso a paso solo tras intentarlo) y comprobación.
- Tablero de análisis: jugadas legales (enroque, al paso, promoción con elección de pieza), jaque/mate/tablas,
  navegación, girar tablero, importar/exportar FEN y PGN.
- 3 cursos / 8 lecciones iniciales, con todas las posiciones validadas automáticamente y las evaluaciones
  comprobadas con Stockfish 19.
- Tema claro/oscuro/sistema, diseño responsive, modo invitado (progreso en `localStorage`).

## Licencias de terceros

- chess.js (BSD-2-Clause), react-chessboard (MIT, incluye las piezas por defecto).
- Stockfish (GPL-3.0) se usó fuera de la app para verificar contenido; su integración en el navegador
  (Fase 3) se hará como worker independiente con el aviso de licencia correspondiente.
