import type { Course } from "../types";

/*
 * Every evaluation claimed here was checked with Stockfish 19 (depth 30)
 * on 2026-10-21; K+P vs K verdicts also match classical endgame theory.
 */

const SQUARE_FEN = "7k/8/8/8/1p6/5K2/8/8 w - - 0 1";
const KEY_SQUARES_FEN = "8/3k4/8/8/3K4/3P4/8/8 w - - 0 1";
const OPPOSITION_FEN = "8/3k4/8/8/3K4/3P4/8/8 b - - 0 1";

export const finalesPeones: Course = {
  slug: "finales-de-peones-fundamentos",
  title: "Finales de peones: fundamentos",
  area: "finales",
  level: "principiante",
  summary:
    "Las tres herramientas que deciden casi todos los finales de rey y peón: la regla del cuadrado, las casillas clave y la oposición.",
  outcomes: [
    "Saber en un vistazo si un rey alcanza a un peón pasado.",
    "Identificar las casillas clave de un peón y llevar el rey hasta ellas.",
    "Defender con el rey tomando la oposición.",
  ],
  source: "propio",
  modules: [
    {
      slug: "rey-contra-peon",
      title: "El rey contra el peón",
      lessons: [
        {
          slug: "regla-del-cuadrado",
          title: "La regla del cuadrado",
          summary: "Calcula sin contar jugadas si el rey llega a tiempo de parar un peón pasado.",
          objective: "Detener un peón pasado con el rey, sabiendo de antemano si es posible.",
          concept:
            "Si el rey puede entrar en el cuadrado del peón (teniendo en cuenta quién mueve), lo alcanza antes de que corone.",
          estimatedMinutes: 6,
          themes: ["regla-del-cuadrado", "peon-pasado"],
          result: "tablas-teoricas",
          source: "propio",
          steps: [
            {
              id: "cuadrado-idea",
              kind: "explain",
              title: "Traza el cuadrado",
              fen: SQUARE_FEN,
              highlights: ["b1", "c1", "d1", "e1", "b2", "c2", "d2", "e2", "b3", "c3", "d3", "e3", "b4", "c4", "d4", "e4"],
              body: [
                "El peón negro de b4 necesita tres jugadas para coronar en b1. Imagina un cuadrado cuyo lado va desde el peón hasta la casilla de coronación: b4–b1–e1–e4 (resaltado).",
                "Regla: si el rey del bando defensor está dentro del cuadrado, o puede entrar en él con su jugada, alcanza al peón. Si no, el peón corona (siempre que nada más se interponga).",
                "El rey blanco en f3 está fuera del cuadrado, pero juegan las blancas: todavía pueden entrar.",
              ],
            },
            {
              id: "cuadrado-ejercicio",
              kind: "exercise",
              title: "Entra en el cuadrado",
              fen: SQUARE_FEN,
              prompt: "Juegan las blancas. Detén el peón negro.",
              themes: ["regla-del-cuadrado"],
              difficulty: 1,
              solution: { options: [{ san: "Ke3" }, { san: "Ke2" }, { san: "Ke4" }] },
              hints: [
                "Las casillas resaltadas antes forman el cuadrado del peón: b1–e1–e4–b4.",
                "Tu rey debe pisar la columna e, dentro del cuadrado.",
              ],
              explanation:
                "1.Re3 (o 1.Re2 / 1.Re4) entra en el cuadrado. Tras 1...b3 2.Rd2 b2 3.Rc2 el rey captura el peón: tablas, porque un rey solo no puede dar mate.",
              refutations: {
                Kf2: "1.Rf2? El rey sigue fuera del cuadrado: 1...b3 y el peón corona.",
                Kf4: "1.Rf4? Avanzar por la columna f no sirve: el rey sigue fuera del cuadrado y 1...b3 gana.",
                Kg2: "1.Rg2? El rey se aleja: el peón corona sin oposición.",
                Kg3: "1.Rg3? El rey se aleja: el peón corona sin oposición.",
                Kg4: "1.Rg4? El rey se aleja: el peón corona sin oposición.",
              },
              result: "tablas-teoricas",
              verification: "stockfish",
            },
            {
              id: "cuadrado-turno",
              kind: "question",
              title: "¿Y si juegan las negras?",
              fen: "7k/8/8/8/1p6/5K2/8/8 b - - 0 1",
              prompt: "Misma posición, pero ahora juegan las negras. ¿Qué ocurre?",
              themes: ["regla-del-cuadrado"],
              choices: [
                {
                  id: "corona",
                  text: "El peón corona.",
                  correct: true,
                  feedback:
                    "Correcto. Tras 1...b3 el cuadrado se reduce a b1–d3 y el rey en f3 ya no puede entrar: 2.Re2 b2 3.Rd2 b1=D.",
                },
                {
                  id: "alcanza",
                  text: "El rey blanco lo alcanza igualmente.",
                  correct: false,
                  feedback:
                    "No. Al mover el peón, el cuadrado se hace más pequeño (b1–d3) y el rey en f3 necesita dos jugadas para entrar en él.",
                },
                {
                  id: "tablas-rey",
                  text: "Tablas, porque el rey negro está lejos y no puede ayudar.",
                  correct: false,
                  feedback:
                    "El rey negro no hace falta: el peón corona por sí solo porque el rey blanco está fuera del cuadrado.",
                },
              ],
            },
          ],
        },
        {
          slug: "casillas-clave",
          title: "Casillas clave",
          summary: "Las casillas que, si las ocupa tu rey, garantizan la coronación del peón.",
          objective: "Llevar el rey a una casilla clave del peón para asegurar la victoria.",
          concept:
            "Con un peón (que no sea de torre) en su 2.ª, 3.ª o 4.ª fila, las tres casillas situadas dos filas por delante son casillas clave.",
          estimatedMinutes: 7,
          themes: ["casillas-clave", "rey-activo"],
          result: "victoria-forzada-blancas",
          source: "propio",
          steps: [
            {
              id: "clave-idea",
              kind: "explain",
              title: "Qué es una casilla clave",
              fen: KEY_SQUARES_FEN,
              highlights: ["c5", "d5", "e5"],
              body: [
                "Una casilla clave es una casilla tal que, si el rey del bando fuerte la ocupa, el peón corona por la fuerza, juegue quien juegue.",
                "Para un peón en su 2.ª, 3.ª o 4.ª fila, las casillas clave son las tres situadas dos filas por delante del peón. Con el peón en d3: c5, d5 y e5.",
                "No pienses en empujar el peón: lo importante es la posición del rey. El peón avanza después, escoltado. (Los peones de torre son una excepción con reglas propias.)",
              ],
            },
            {
              id: "clave-ejercicio",
              kind: "exercise",
              title: "Ocupa una casilla clave",
              fen: KEY_SQUARES_FEN,
              prompt: "Juegan las blancas y ganan. Lleva el rey a una casilla clave.",
              themes: ["casillas-clave"],
              difficulty: 1,
              solution: { options: [{ san: "Kd5" }, { san: "Kc5" }, { san: "Ke5" }] },
              hints: ["Las casillas clave del peón de d3 están en la quinta fila.", "c5, d5 y e5 están a un paso de tu rey."],
              explanation:
                "Cualquiera de 1.Rc5, 1.Rd5 o 1.Re5 alcanza una casilla clave: el rey blanco escolta al peón y la victoria está asegurada con juego correcto.",
              refutations: {
                Kc4: "1.Rc4? 1...Rd6! y el rey negro controla c5, d5 y e5. Con defensa correcta son tablas.",
                Ke4: "1.Re4? 1...Re6! y el rey negro toma la oposición. Con defensa correcta son tablas.",
              },
              result: "victoria-forzada-blancas",
              verification: "stockfish",
            },
            {
              id: "clave-pregunta",
              kind: "question",
              title: "Comprueba",
              prompt: "¿Cuáles son las casillas clave de un peón blanco en e2?",
              themes: ["casillas-clave"],
              choices: [
                { id: "f4", text: "d4, e4 y f4", correct: true, feedback: "Correcto: dos filas por delante del peón." },
                { id: "f3", text: "d3, e3 y f3", correct: false, feedback: "Están solo una fila por delante del peón." },
                { id: "f5", text: "d5, e5 y f5", correct: false, feedback: "Esas son las de un peón en e3." },
              ],
            },
          ],
        },
        {
          slug: "oposicion",
          title: "La oposición",
          summary: "La herramienta defensiva del rey: impedir que el rival alcance las casillas clave.",
          objective: "Hacer tablas con el rey solo contra rey y peón tomando la oposición.",
          concept:
            "Dos reyes están en oposición cuando se encuentran en la misma columna con una casilla entre ellos; la tiene el bando que NO debe mover.",
          estimatedMinutes: 8,
          themes: ["oposicion", "defensa"],
          result: "tablas-teoricas",
          source: "propio",
          steps: [
            {
              id: "oposicion-idea",
              kind: "explain",
              title: "Quién tiene la oposición",
              fen: OPPOSITION_FEN,
              highlights: ["c5", "d5", "e5"],
              body: [
                "Las casillas clave del peón de d3 son c5, d5 y e5. El rey blanco ya está a un paso de ellas.",
                "Juegan las negras. Si colocan su rey enfrente del blanco, con una casilla de separación, tendrán la oposición: será el rey blanco quien deba ceder el paso.",
                "Para el bando débil, la oposición es la defensa: mientras el rey atacante no alcance una casilla clave, el peón no corona.",
              ],
            },
            {
              id: "oposicion-ejercicio",
              kind: "exercise",
              title: "Toma la oposición",
              fen: OPPOSITION_FEN,
              prompt: "Juegan las negras. Encuentra la única jugada que hace tablas, y mantenla.",
              themes: ["oposicion", "defensa"],
              difficulty: 2,
              solution: {
                options: [{ san: "Kd6", reply: "Kc4", next: { options: [{ san: "Kc6" }] } }],
              },
              hints: [
                "El rey blanco quiere pisar c5, d5 o e5. ¿Desde qué casilla controlas las tres?",
                "Coloca tu rey frente al blanco, en la misma columna, con una casilla entre ambos.",
              ],
              explanation:
                "1...Rd6! toma la oposición y vigila c5, d5 y e5. Tras 2.Rc4, de nuevo 2...Rc6!: el rey negro sigue al blanco y el peón no puede coronar. Son tablas teóricas.",
              refutations: {
                Kc7: "1...Rc7? 2.Rd5! y el rey blanco ocupa una casilla clave.",
                Kc6: "1...Rc6? 2.Re5! alcanza la casilla clave e5.",
                Ke6: "1...Re6? 2.Rc5! alcanza la casilla clave c5.",
                Ke7: "1...Re7? 2.Rd5! y la casilla clave d5 queda ocupada.",
                Kd8: "1...Rd8? 2.Rd5! y la casilla clave d5 queda ocupada.",
                Kc8: "1...Rc8? 2.Rd5! y el blanco gana.",
                Ke8: "1...Re8? 2.Rd5! y el blanco gana.",
              },
              result: "tablas-teoricas",
              verification: "stockfish",
            },
            {
              id: "oposicion-pregunta",
              kind: "question",
              title: "Comprueba",
              prompt: "Rey blanco en d4, rey negro en d6, y juegan las blancas. ¿Quién tiene la oposición?",
              themes: ["oposicion"],
              choices: [
                {
                  id: "negras",
                  text: "Las negras",
                  correct: true,
                  feedback: "Correcto: tiene la oposición el bando que no debe mover.",
                },
                {
                  id: "blancas",
                  text: "Las blancas",
                  correct: false,
                  feedback: "No: las blancas deben mover y ceder el paso, así que la oposición es de las negras.",
                },
                {
                  id: "nadie",
                  text: "Nadie: los reyes no están enfrentados",
                  correct: false,
                  feedback: "Sí lo están: misma columna y una casilla (d5) entre ellos.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
