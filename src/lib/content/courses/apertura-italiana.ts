import type { Course } from "../types";

/*
 * Main lines are standard opening theory (ECO C53/C54 and C57). Engine
 * evaluations quoted in the text were checked with Stockfish 19 (depth 22)
 * on 2026-10-21. Ideas and explanations are original.
 */

export const aperturaItaliana: Course = {
  slug: "apertura-italiana-ideas",
  title: "Apertura Italiana: ideas esenciales",
  area: "aperturas",
  level: "principiante",
  eco: ["C50", "C53", "C54", "C57"],
  summary:
    "Por qué se juega cada movimiento del Giuoco Piano con c3-d4 y de la Defensa de los Dos Caballos con 4.Cg5, incluida una trampa conocida.",
  outcomes: [
    "Entender el plan c3-d4 para construir un centro de peones.",
    "Saber cómo liberan las negras su juego con ...d5.",
    "Reconocer el peligro de 5...Cxd5 en la Defensa de los Dos Caballos.",
  ],
  source: "propio",
  modules: [
    {
      slug: "giuoco-piano-y-dos-caballos",
      title: "Giuoco Piano y Dos Caballos",
      lessons: [
        {
          slug: "giuoco-piano-c3-d4",
          title: "Giuoco Piano: el plan c3–d4",
          summary: "Las blancas preparan d4 con c3 para dominar el centro; las negras responden atacando ese centro.",
          objective: "Comprender las ideas de ambos bandos en la línea principal con 4.c3.",
          concept:
            "4.c3 prepara d4 para construir un centro de peones e4+d4; las negras deben contraatacarlo, sobre todo con la ruptura ...d5.",
          estimatedMinutes: 10,
          themes: ["centro", "desarrollo", "ruptura-d5"],
          source: "propio",
          steps: [
            {
              id: "piano-linea",
              kind: "explain",
              title: "La línea principal, jugada a jugada",
              fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
              body: [
                "Avanza jugada a jugada con los controles del tablero. Cada movimiento tiene su explicación.",
                "Observa que ninguna jugada es arbitraria: todas sirven al desarrollo, al centro o a la seguridad del rey.",
              ],
              line: [
                { san: "e4", comment: "Ocupa el centro y abre líneas para la dama y el alfil de f1." },
                { san: "e5", comment: "Las negras reclaman su parte del centro." },
                { san: "Nf3", comment: "Desarrolla con tempo: ataca el peón de e5.", arrows: [{ from: "f3", to: "e5", tone: "threat" }] },
                { san: "Nc6", comment: "Defiende e5 desarrollando una pieza." },
                {
                  san: "Bc4",
                  comment: "El alfil apunta a f7, la casilla más débil del campo negro (solo la defiende el rey).",
                  arrows: [{ from: "c4", to: "f7", tone: "idea" }],
                },
                {
                  san: "Bc5",
                  comment: "Giuoco Piano. El alfil negro mira simétricamente a f2.",
                  arrows: [{ from: "c5", to: "f2", tone: "idea" }],
                },
                {
                  san: "c3",
                  comment: "La idea clave: prepara d4 para levantar un centro e4+d4 y, de paso, quitarle al alfil de c5 su objetivo.",
                  arrows: [{ from: "d2", to: "d4", tone: "idea" }],
                },
                { san: "Nf6", comment: "Desarrolla y presiona e4: las negras no esperan pasivamente.", arrows: [{ from: "f6", to: "e4", tone: "threat" }] },
                { san: "d4", comment: "El plan se ejecuta: ataque al alfil de c5 y al peón de e5." },
                { san: "exd4", comment: "Las negras ceden el centro para no quedar a la defensiva." },
                { san: "cxd4", comment: "Las blancas tienen el centro ideal: peones en e4 y d4." },
                { san: "Bb4+", comment: "Jaque para ganar un tiempo y, sobre todo, para cambiar piezas que defienden el centro." },
                { san: "Bd2", comment: "La respuesta más sólida: ofrece el cambio de alfiles." },
                { san: "Bxd2+", comment: "Las negras aceptan el cambio." },
                { san: "Nbxd2", comment: "El caballo recaptura y sigue defendiendo e4." },
                {
                  san: "d5",
                  comment: "¡La ruptura temática! Las negras atacan e4 y liberan su juego antes de que el centro blanco avance. Stockfish la valora como la mejor (igualdad).",
                  arrows: [{ from: "d5", to: "e4", tone: "threat" }],
                },
              ],
            },
            {
              id: "piano-pregunta",
              kind: "question",
              title: "Comprueba",
              prompt: "¿Cuál es la idea principal de 4.c3?",
              themes: ["centro"],
              choices: [
                {
                  id: "d4",
                  text: "Preparar d4 para construir un centro de peones",
                  correct: true,
                  feedback: "Correcto: c3 controla d4 para que el avance d4 sea posible con apoyo.",
                },
                {
                  id: "dama",
                  text: "Abrir la diagonal de la dama hacia a4 para atacar al rey",
                  correct: false,
                  feedback: "Qa4/Qb3 pueden aparecer más tarde, pero no es la idea principal.",
                },
                {
                  id: "enroque",
                  text: "Preparar el enroque largo",
                  correct: false,
                  feedback: "En el Giuoco Piano las blancas suelen enrocarse corto; c3 tiene que ver con el centro.",
                },
              ],
            },
            {
              id: "piano-ejercicio",
              kind: "exercise",
              title: "Libera el juego negro",
              fen: "r1bqk2r/pppp1ppp/2n2n2/8/2BPP3/5N2/PP1N1PPP/R2QK2R b KQkq - 0 8",
              prompt: "Juegan las negras. Las blancas tienen un gran centro: ¿cómo lo atacas?",
              themes: ["ruptura-d5", "centro"],
              difficulty: 2,
              solution: { options: [{ san: "d5" }, { san: "Nxe4" }] },
              hints: ["El peón de e4 es el punto vulnerable del centro blanco.", "Un peón puede atacarlo directamente."],
              explanation:
                "8...d5! es la ruptura temática: ataca e4 y abre el juego para las piezas negras. 8...Cxe4 también es jugable (Stockfish la valora casi igual), pero ...d5 enseña la idea que se repite en muchas aperturas.",
              refutations: {
                "O-O": "8...O-O no es un error, pero permite 9.d5: el centro blanco avanza con tempo sobre el caballo y gana espacio.",
                d6: "8...d6 es pasiva: tras 9.d5 las blancas conservan un centro dominante sin presión.",
              },
              verification: "stockfish",
            },
          ],
        },
        {
          slug: "dos-caballos-cg5",
          title: "Dos Caballos: 4.Cg5 y la trampa de 5...Cxd5",
          summary: "El ataque directo sobre f7 y por qué la respuesta natural 5...Cxd5 es peligrosa.",
          objective: "Conocer la línea principal con 5...Ca5 y saber castigar 5...Cxd5.",
          concept:
            "Contra un ataque prematuro a f7, las negras suelen dar un peón a cambio de desarrollo rápido en lugar de recuperarlo a cualquier precio.",
          estimatedMinutes: 10,
          themes: ["f7", "iniciativa", "trampa"],
          source: "propio",
          steps: [
            {
              id: "cg5-linea",
              kind: "explain",
              title: "Línea principal (ECO C57–C59)",
              fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
              body: [
                "Tras 3...Cf6 (Defensa de los Dos Caballos) las blancas pueden atacar f7 directamente con 4.Cg5.",
                "La respuesta principal entrega un peón a cambio de tiempo y actividad.",
              ],
              line: [
                { san: "e4" },
                { san: "e5" },
                { san: "Nf3" },
                { san: "Nc6" },
                { san: "Bc4" },
                { san: "Nf6", comment: "Defensa de los Dos Caballos: las negras contraatacan e4 en lugar de defender pasivamente." },
                {
                  san: "Ng5",
                  comment: "Ataque doble sobre f7 (caballo y alfil). Va contra el principio de no mover una pieza dos veces, pero es concreto.",
                  arrows: [
                    { from: "g5", to: "f7", tone: "threat" },
                    { from: "c4", to: "f7", tone: "threat" },
                  ],
                },
                { san: "d5", comment: "Corta la diagonal del alfil. La única defensa seria de f7." },
                { san: "exd5", comment: "Las blancas ganan un peón y vuelven a amenazar." },
                {
                  san: "Na5",
                  comment: "Línea principal: el caballo ataca al alfil y las negras aceptan quedar con un peón menos a cambio de desarrollo.",
                  arrows: [{ from: "a5", to: "c4", tone: "threat" }],
                },
                { san: "Bb5+" },
                { san: "c6" },
                { san: "dxc6" },
                { san: "bxc6" },
                { san: "Be2" },
                { san: "h6", comment: "Expulsa al caballo, que ya ha jugado tres veces." },
                { san: "Nf3" },
                { san: "e4" },
                { san: "Ne5", comment: "Las negras tienen un peón menos, pero mucho espacio y desarrollo: compensación reconocida por la teoría." },
              ],
            },
            {
              id: "cg5-trampa",
              kind: "explain",
              title: "Trampa conocida: 5...Cxd5?!",
              fen: "r1bqkb1r/ppp2ppp/2n5/3np1N1/2B5/8/PPPP1PPP/RNBQK2R w KQkq - 0 6",
              highlights: ["f7"],
              arrows: [
                { from: "g5", to: "f7", tone: "threat" },
                { from: "c4", to: "d5", tone: "threat" },
              ],
              body: [
                "⚠ Trampa conocida. Recuperar el peón con 5...Cxd5 parece natural, pero deja f7 y el caballo de d5 muy expuestos.",
                "Las blancas disponen de 6.Cxf7!? (el «Ataque Fegatello» o Fried Liver) y de 6.d4, ambas muy peligrosas en la práctica para las negras.",
              ],
            },
            {
              id: "cg5-ejercicio",
              kind: "exercise",
              title: "Castiga 5...Cxd5",
              fen: "r1bqkb1r/ppp2ppp/2n5/3np1N1/2B5/8/PPPP1PPP/RNBQK2R w KQkq - 0 6",
              prompt: "Juegan las blancas tras 5...Cxd5. Aprovecha la posición del rey negro.",
              themes: ["f7", "trampa"],
              difficulty: 3,
              solution: { options: [{ san: "Nxf7" }, { san: "d4" }] },
              hints: ["El punto débil sigue siendo f7.", "Un sacrificio en f7 saca al rey al centro."],
              explanation:
                "6.Cxf7!? Rxf7 7.Df3+ obliga al rey a ir al centro (7...Re6 para defender el caballo de d5) y las blancas obtienen un ataque muy fuerte. 6.d4 es igual de recomendable: abre el centro con el rey negro todavía en e8. Stockfish valora ambas con ventaja blanca; no es una victoria forzada, sino una posición muy difícil de defender en la práctica.",
              refutations: {
                "O-O": "6.O-O? deja el caballo de g5 sin defensa: 6...Dxg5 7.Axd5 y el juego se iguala.",
                d3: "6.d3 es demasiado lento: tras 6...f6 o 6...Ae7 las negras consolidan y el juego queda igualado.",
              },
              verification: "stockfish",
            },
          ],
        },
      ],
    },
  ],
};
