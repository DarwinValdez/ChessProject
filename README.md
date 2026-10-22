# Chess Academy

Academia interactiva de ajedrez: aperturas, medio juego, táctica y finales, con lecciones verificadas,
ejercicios que registran intentos reales y un dashboard calculado solo a partir de esos datos.

> Estado: **Fases 1 (fundación) y 2 (academia)** terminadas. Ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para el detalle
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

## Despliegue en Vercel

El proyecto no necesita configuración especial ni variables de entorno obligatorias.

1. En [vercel.com/new](https://vercel.com/new), importa el repositorio `DarwinValdez/ChessProject`.
2. Vercel detecta Next.js automáticamente. Deja los valores por defecto:
   - Install command: `npm ci` (usa `package-lock.json`)
   - Build command: `next build`
   - Node.js: 22.x (tomado de `engines` en `package.json`)
3. Pulsa **Deploy**. La rama predeterminada del repositorio se publica en producción y cada push a otra
   rama genera una vista previa.

Opcional: si usas un dominio propio, define `NEXT_PUBLIC_SITE_URL` (ver `.env.example`) para que el
sitemap, `robots.txt` y las URL canónicas usen ese dominio. Sin ella se usa el dominio de producción de Vercel.

Incluido para producción: cabeceras de seguridad básicas, `sitemap.xml`, `robots.txt`, metadatos Open Graph
e icono propio. En modo invitado no hay backend: el progreso vive en el navegador de cada usuario.

## Qué hay en las Fases 1 y 2

- Dashboard con nivel estimado, tiempo, racha, precisión, dominio por área, temas débiles,
  objetivos semanales editables, calendario de actividad, historial y sesión recomendada (15/30/45/60 min).
- Catálogo de cursos con búsqueda (sin acentos, por tema o ECO), filtros por área, nivel y duración.
- Reproductor de lecciones en tres columnas (temario · tablero · entrenador) con pasos de explicación,
  ejercicio (pistas progresivas, refutaciones, solución paso a paso solo tras intentarlo) y comprobación.
- Tablero de análisis: jugadas legales (enroque, al paso, promoción con elección de pieza), jaque/mate/tablas,
  navegación, girar tablero, importar/exportar FEN y PGN.
- Biblioteca de 12 aperturas (ECO, ideas, planes, estructuras, trampas, variantes, posiciones críticas,
  ejercicios) y constructor de repertorio con detección de huecos.
- 5 cursos / 18 lecciones (finales de peones y de torres, táctica, medio juego, Italiana) y un entrenador
  de ejercicios por temas.
- Biblioteca de obras de referencia y métodos de entrenamiento con descripciones propias.
- Todas las posiciones y líneas se validan automáticamente; las evaluaciones se comprobaron con Stockfish 19.
- Tema claro/oscuro/sistema, diseño responsive, modo invitado (progreso en `localStorage`).

## Licencias de terceros

- chess.js (BSD-2-Clause), react-chessboard (MIT, incluye las piezas por defecto).
- Stockfish (GPL-3.0) se usó fuera de la app para verificar contenido; su integración en el navegador
  (Fase 3) se hará como worker independiente con el aviso de licencia correspondiente.
