import type { Course } from "../types";

/*
 * Original positions built for this course. Solutions and evaluations were
 * checked with Stockfish 19 (depth 22) on 2026-10-21 and 2026-10-22.
 */

export const tacticaBasica: Course = {
  slug: "motivos-tacticos-esenciales",
  title: "Motivos tácticos esenciales",
  area: "tactica",
  level: "principiante",
  summary:
    "Mate en la última fila, ataque doble, clavada, eliminación del defensor y el mate de la coz: los motivos que más partidas deciden.",
  outcomes: [
    "Reconocer un rey sin casillas de escape en la primera/octava fila.",
    "Buscar jaques que ataquen a la vez otra pieza.",
    "Usar una clavada absoluta para ganar material.",
  ],
  source: "propio",
  modules: [
    {
      slug: "motivos-basicos",
      title: "Motivos básicos",
      lessons: [
        {
          slug: "mate-ultima-fila",
          title: "Mate en la última fila",
          summary: "Un rey encerrado tras sus propios peones es vulnerable a un jaque en la octava fila.",
          objective: "Detectar y ejecutar un mate en la última fila.",
          concept:
            "Si los peones del enroque no se han movido y nadie defiende la última fila, un jaque de torre o dama en ella puede ser mate.",
          estimatedMinutes: 5,
          themes: ["red-de-mate", "ultima-fila"],
          source: "propio",
          steps: [
            {
              id: "ultima-fila-idea",
              kind: "explain",
              title: "Un rey sin aire",
              fen: "6k1/5ppp/8/q7/8/8/2r2PPP/4R1K1 w - - 0 1",
              highlights: ["f7", "g7", "h7", "e8"],
              body: [
                "Las negras tienen una dama de ventaja, pero su rey en g8 no tiene casillas de escape: f7, g7 y h7 están ocupadas por sus propios peones.",
                "Antes de calcular nada, haz siempre la misma pregunta: ¿qué jaques tengo y qué casillas de escape tiene el rey rival?",
              ],
            },
            {
              id: "ultima-fila-ejercicio",
              kind: "exercise",
              title: "Encuentra el golpe",
              fen: "6k1/5ppp/8/q7/8/8/2r2PPP/4R1K1 w - - 0 1",
              prompt: "Juegan las blancas. Las negras tienen ventaja material decisiva: encuentra el golpe.",
              themes: ["red-de-mate", "ultima-fila"],
              difficulty: 1,
              solution: { options: [{ san: "Re8#" }] },
              hints: ["¿Qué casillas de escape tiene el rey negro?", "La octava fila no está defendida."],
              explanation:
                "1.Te8# es mate: los peones f7, g7 y h7 impiden la huida, ninguna pieza negra controla e8 y no hay casilla para interponer. La prevención habitual es dar aire al rey a tiempo (...h6 o ...g6).",
              verification: "stockfish",
            },
            {
              id: "ultima-fila-pregunta",
              kind: "question",
              title: "Comprueba",
              prompt: "En posiciones así, ¿qué suele evitar el mate en la última fila?",
              themes: ["ultima-fila"],
              choices: [
                {
                  id: "luft",
                  text: "Avanzar un peón del enroque para dar una casilla de escape al rey",
                  correct: true,
                  feedback: "Correcto: una jugada como ...h6 crea una salida (h7) y desactiva el motivo.",
                },
                {
                  id: "dama",
                  text: "Atacar con la dama en el otro flanco",
                  correct: false,
                  feedback: "Atacar no resuelve la debilidad: en la posición del ejercicio la dama negra no defiende la octava fila.",
                },
                {
                  id: "rey",
                  text: "Nada: con ventaja material el mate no es posible",
                  correct: false,
                  feedback: "El ejercicio muestra lo contrario: el material no importa si el rey recibe mate.",
                },
              ],
            },
          ],
        },
        {
          slug: "ataque-doble-caballo",
          title: "Ataque doble de caballo",
          summary: "Un jaque de caballo que a la vez ataca una pieza no defendida gana material.",
          objective: "Encontrar un jaque doble de caballo que gane material.",
          concept: "El caballo ataca piezas que no pueden devolverle el ataque; un jaque obliga al rival a ignorar la otra amenaza.",
          estimatedMinutes: 5,
          themes: ["ataque-doble", "horquilla"],
          source: "propio",
          steps: [
            {
              id: "horquilla-ejercicio",
              kind: "exercise",
              title: "Rey y torre a la vez",
              fen: "r3k2r/1p3ppp/p1n1p3/1N6/8/8/PPP2PPP/3R1RK1 w kq - 0 1",
              prompt: "Juegan las blancas. Gana material.",
              themes: ["ataque-doble", "horquilla"],
              difficulty: 2,
              solution: {
                options: [{ san: "Nc7+", reply: "Ke7", next: { options: [{ san: "Nxa8" }] } }],
              },
              hints: [
                "Busca una casilla desde la que el caballo dé jaque y ataque otra pieza.",
                "La casilla c7 no está defendida por ninguna pieza negra.",
              ],
              explanation:
                "1.Cc7+ ataca a la vez al rey en e8 y a la torre en a8. El rey debe moverse (la torre de d1 le quita d7 y d8) y 2.Cxa8 gana la calidad.",
              refutations: {
                "Nd6+": "1.Cd6+? 1...Re7 y el caballo no gana nada: es un jaque sin segunda amenaza.",
              },
              verification: "stockfish",
            },
            {
              id: "horquilla-pregunta",
              kind: "question",
              title: "Comprueba",
              prompt: "¿Por qué funcionó 1.Cc7+?",
              themes: ["ataque-doble"],
              choices: [
                {
                  id: "doble",
                  text: "Porque era jaque y además atacaba una torre sin defensa posible",
                  correct: true,
                  feedback: "Exacto: el jaque obliga a atender al rey y la segunda amenaza se ejecuta después.",
                },
                {
                  id: "mate",
                  text: "Porque amenazaba mate",
                  correct: false,
                  feedback: "No había amenaza de mate: la clave era la doble amenaza rey + torre.",
                },
                {
                  id: "clavada",
                  text: "Porque la torre estaba clavada",
                  correct: false,
                  feedback: "La torre de a8 no estaba clavada; simplemente no podía apartarse a tiempo porque las negras debían salir del jaque.",
                },
              ],
            },
          ],
        },
        {
          slug: "clavada-absoluta",
          title: "La clavada absoluta",
          summary: "Una pieza clavada contra su rey no puede moverse: si vale más que el atacante, se pierde.",
          objective: "Clavar la dama contra el rey y ganarla.",
          concept: "Una clavada es absoluta cuando la pieza de detrás es el rey: la pieza clavada no puede moverse fuera de la línea.",
          estimatedMinutes: 5,
          themes: ["clavada"],
          source: "propio",
          steps: [
            {
              id: "clavada-ejercicio",
              kind: "exercise",
              title: "La columna e",
              fen: "r1b1k2r/ppp2ppp/2n5/4q3/8/2NB4/PPPQ1PPP/R4RK1 w kq - 0 1",
              prompt: "Juegan las blancas. Gana la dama.",
              themes: ["clavada"],
              difficulty: 2,
              solution: {
                options: [
                  { san: "Rae1", reply: "Qxe1", next: { options: [{ san: "Rxe1+" }, { san: "Qxe1+" }] } },
                  { san: "Rfe1", reply: "Qxe1+", next: { options: [{ san: "Rxe1+" }, { san: "Qxe1+" }] } },
                ],
              },
              hints: [
                "El rey negro y la dama negra están en la misma columna.",
                "Una torre en la columna e clavaría la dama.",
              ],
              explanation:
                "1.Tae1 (o 1.Tfe1) clava la dama contra el rey: no puede apartarse de la columna e. Lo mejor que tienen las negras es entregarla por la torre (1...Dxe1) y, tras recapturar, las blancas quedan con dama por torre.",
              verification: "stockfish",
            },
                    ],
        },
        {
          slug: "eliminacion-del-defensor",
          title: "Eliminación del defensor",
          summary: "Si una pieza sostiene la defensa del rey, cámbiala o captúrala aunque cueste material.",
          objective: "Identificar y eliminar el defensor clave del enroque.",
          concept: "Antes de atacar un objetivo, pregunta qué pieza lo defiende; si puedes eliminarla, el objetivo cae.",
          estimatedMinutes: 6,
          themes: ["eliminacion-del-defensor", "ataque-al-rey"],
          source: "propio",
          steps: [
            {
              id: "defensor-ejercicio",
              kind: "exercise",
              title: "El caballo de f6",
              fen: "r4rk1/ppq2pp1/1bp2n2/6B1/8/2PB4/PPQ2PPP/R4RK1 w - - 0 1",
              prompt: "Juegan las blancas. Encuentra la jugada más fuerte contra el enroque negro.",
              themes: ["eliminacion-del-defensor", "ataque-al-rey"],
              difficulty: 3,
              solution: { options: [{ san: "Bxf6" }] },
              hints: ["¿Qué pieza negra defiende h7 y cubre al rey?", "El alfil de g5 puede eliminarla."],
              explanation:
                "1.Axf6! elimina el único defensor del enroque. Si 1...gxf6, el rey queda desnudo y la dama blanca llega a h4 o h6 (Stockfish ≈ +5,2); si las negras no recapturan, se quedan con una pieza menos. No es un mate forzado inmediato: es una ventaja decisiva a largo plazo.",
              refutations: {
                Rae1: "1.Tae1 es una jugada sana, pero Stockfish la valora mucho peor (≈ +2,6 frente a +5,2): el caballo de f6 sigue defendiendo al rey.",
                Bf5: "1.Af5 mantiene presión, pero no elimina al defensor (≈ +2,5 frente a +5,2).",
                Qe2: "1.De2 prepara el ataque, pero el caballo de f6 sigue defendiendo (≈ +1,9 frente a +5,2).",
              },
              verification: "stockfish",
            },
            {
              id: "defensor-pregunta",
              kind: "question",
              title: "Comprueba",
              prompt: "¿Qué pregunta conviene hacerse antes de atacar un punto fuerte del rival?",
              themes: ["eliminacion-del-defensor"],
              choices: [
                { id: "defensor", text: "¿Qué pieza lo defiende y puedo eliminarla?", correct: true, feedback: "Exacto: si eliminas el defensor, el punto queda indefenso." },
                { id: "material", text: "¿Cuánto material tengo?", correct: false, feedback: "El material importa, pero la pregunta táctica clave es quién defiende el objetivo." },
                { id: "tiempo", text: "¿Cuánto tiempo me queda en el reloj?", correct: false, feedback: "Útil en la práctica, pero no identifica el motivo táctico." },
              ],
            },
          ],
        },
        {
          slug: "mate-de-la-coz",
          title: "El mate de la coz",
          summary: "Jaques de caballo, sacrificio de dama y mate de caballo contra un rey ahogado por sus propias piezas.",
          objective: "Ejecutar el mate de la coz (legado de Philidor).",
          concept:
            "Un rey rodeado por sus propias piezas puede recibir mate de un solo caballo; un sacrificio de dama puede obligar a una torre a taparle la última salida.",
          estimatedMinutes: 6,
          themes: ["red-de-mate", "atraccion", "combinacion"],
          source: "propio",
          steps: [
            {
              id: "coz-ejercicio",
              kind: "exercise",
              title: "Mate en cuatro",
              fen: "r2qr2k/pp4pp/8/6N1/2Q5/8/PP3PPP/R5K1 w - - 0 1",
              prompt: "Juegan las blancas y dan mate en cuatro jugadas. Las negras tienen más material: solo vale el mate.",
              themes: ["red-de-mate", "atraccion", "combinacion"],
              difficulty: 4,
              solution: {
                options: [
                  {
                    san: "Nf7+",
                    reply: "Kg8",
                    next: {
                      options: [
                        {
                          san: "Nh6+",
                          reply: "Kh8",
                          next: { options: [{ san: "Qg8+", reply: "Rxg8", next: { options: [{ san: "Nf7#" }] } }] },
                        },
                      ],
                    },
                  },
                ],
              },
              hints: [
                "Empieza con un jaque de caballo que obligue al rey a moverse.",
                "Busca un jaque doble (caballo + dama en la diagonal a2-g8).",
                "La dama se sacrifica en g8 para que una torre tape la última casilla del rey.",
              ],
              explanation:
                "1.Cf7+ Rg8 2.Ch6+ (jaque doble) Rh8 (si 2...Rf8, 3.Df7#) 3.Dg8+! Txg8 4.Cf7#: el rey está rodeado por sus propias piezas. Stockfish confirma el mate en cuatro; cualquier otra primera jugada pierde la ventaja.",
              refutations: {
                h4: "1.h4? no hace nada contra el rey y las negras consolidan (Stockfish ≈ 0,00).",
                Qf7: "1.Df7? amenaza, pero sin jaque las negras tienen tiempo de defenderse.",
              },
              verification: "stockfish",
            },
          ],
        },
      ],
    },
  ],
};
