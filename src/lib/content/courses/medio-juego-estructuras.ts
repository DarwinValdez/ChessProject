import { fenAfter } from "../openings/helpers";
import type { Course } from "../types";

/*
 * Middlegame structures. Evaluations quoted were checked with Stockfish 19
 * (depth 22) on 2026-10-22. Where the engine sees equality, the lesson
 * says so: a structural idea is a guide for planning, not a guarantee.
 */

const IQP_MOVES = "e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 e6 Nf3 Be7 cxd5 Nxd5 Bd3 Nc6 O-O O-O Re1";
const OPEN_FILE_FEN = "r4rk1/pp3ppp/2p5/4p3/4P3/2P5/PP3PPP/R4RK1 w - - 0 1";
const KNIGHT_FEN = "8/4b1k1/3p2p1/2p1p2p/2P1P2P/4NKP1/8/8 w - - 0 1";

export const medioJuegoEstructuras: Course = {
  slug: "medio-juego-estructuras-y-planes",
  title: "Medio juego: estructuras y planes",
  area: "medio-juego",
  level: "intermedio",
  summary:
    "Cómo leer una posición a partir de su estructura: el peón aislado, las columnas abiertas, el caballo fuerte contra el alfil malo y un método para formular planes.",
  outcomes: [
    "Saber qué planes corresponden a cada bando con un peón aislado de dama.",
    "Valorar columnas abiertas y casillas fuertes.",
    "Distinguir una ventaja estática de una ventaja suficiente para ganar.",
    "Formular un plan con preguntas concretas en lugar de jugadas sueltas.",
  ],
  source: "propio",
  modules: [
    {
      slug: "estructuras",
      title: "Estructuras de peones",
      lessons: [
        {
          slug: "peon-aislado",
          title: "El peón aislado de dama",
          summary: "Actividad dinámica a cambio de una debilidad estática: los planes de cada bando.",
          objective: "Identificar los planes del bando con peón aislado y del bando que juega contra él.",
          concept:
            "El peón aislado da actividad (columnas semiabiertas, casillas fuertes en e5 y c5) pero es una debilidad en el final: el bando que lo tiene busca el ataque; el otro, bloquear y cambiar piezas.",
          estimatedMinutes: 10,
          themes: ["peon-aislado", "planes", "bloqueo"],
          source: "propio",
          steps: [
            {
              id: "pad-linea",
              kind: "explain",
              title: "Cómo nace (Ataque Panov)",
              fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
              body: [
                "Esta línea de la Caro-Kann (Ataque Panov-Botvinnik) produce un peón aislado en d4: no tiene peones vecinos en las columnas c ni e.",
                "Avanza hasta el final de la línea y observa la posición resultante.",
              ],
              line: [
                ...IQP_MOVES.split(" ").slice(0, 12).map((san) => ({ san })),
                { san: "cxd5", comment: "Las blancas cambian en d5..." },
                { san: "Nxd5", comment: "...y el peón de d4 queda aislado." },
                { san: "Bd3", comment: "El alfil apunta al enroque negro: el bando con peón aislado suele atacar." },
                { san: "Nc6", comment: "Presión sobre d4: las negras atacan la debilidad." },
                { san: "O-O" },
                { san: "O-O" },
                { san: "Re1", comment: "La torre ocupa la columna e semiabierta y apoya un caballo en e5.", arrows: [{ from: "e1", to: "e5", tone: "idea" }] },
              ],
            },
            {
              id: "pad-bloqueo",
              kind: "question",
              title: "La casilla de bloqueo",
              fen: fenAfter(IQP_MOVES),
              prompt: "¿Qué casilla es ideal para bloquear el peón aislado de d4?",
              themes: ["peon-aislado", "bloqueo"],
              choices: [
                { id: "d5", text: "d5, justo delante del peón", correct: true, feedback: "Correcto: ningún peón blanco puede atacar d5, así que una pieza allí es estable (idealmente un caballo)." },
                { id: "e4", text: "e4", correct: false, feedback: "e4 no bloquea el avance del peón de d4." },
                { id: "c4", text: "c4", correct: false, feedback: "c4 no está delante del peón; el bloqueo se hace en d5." },
              ],
            },
            {
              id: "pad-plan-negras",
              kind: "question",
              title: "Plan contra el peón aislado",
              fen: fenAfter(IQP_MOVES),
              prompt: "Juegas con negras contra el peón aislado. ¿Qué te conviene en general?",
              themes: ["peon-aislado", "planes"],
              choices: [
                { id: "cambiar", text: "Bloquear en d5 y cambiar piezas para llegar a un final donde el peón sea débil", correct: true, feedback: "Correcto: cada cambio reduce la actividad blanca y deja la debilidad estática." },
                { id: "atacar", text: "Abrir el juego y lanzarte al ataque contra el rey", correct: false, feedback: "Eso favorece al bando con más actividad, que suele ser el del peón aislado." },
                { id: "d5", text: "Permitir d4-d5 para cambiar el peón", correct: false, feedback: "La ruptura d5 es precisamente el plan liberador de las blancas." },
              ],
            },
            {
              id: "pad-casillas",
              kind: "question",
              title: "Casillas fuertes del bando con peón aislado",
              fen: fenAfter(IQP_MOVES),
              prompt: "¿Qué casillas ofrece el peón de d4 a las piezas blancas?",
              themes: ["peon-aislado", "casillas-fuertes"],
              choices: [
                { id: "e5c5", text: "e5 y c5, que el peón protege", correct: true, feedback: "Correcto: un caballo en e5 es una pieza típica del ataque blanco." },
                { id: "d5", text: "d5", correct: false, feedback: "d5 es la casilla de bloqueo de las negras." },
                { id: "e4", text: "e4 y c4", correct: false, feedback: "El peón de d4 protege e5 y c5, no e4 ni c4." },
              ],
            },
          ],
        },
        {
          slug: "columna-abierta",
          title: "Columnas abiertas",
          summary: "La columna abierta como vía de entrada de las torres hacia la séptima fila.",
          objective: "Valorar a quién favorece una columna abierta y cómo disputarla.",
          concept:
            "Una columna sin peones es una autopista para las torres: quien la controla puede entrar en la séptima u octava fila. Si ambos bandos pueden disputarla, suele terminar en cambios.",
          estimatedMinutes: 7,
          themes: ["columna-abierta", "torre-activa"],
          source: "propio",
          steps: [
            {
              id: "columna-linea",
              kind: "explain",
              title: "La columna d",
              fen: OPEN_FILE_FEN,
              body: [
                "No quedan peones en la columna d: es una columna abierta. Si las negras la ocupan primero, sus torres pueden entrar en d2 o d1.",
                "Nota del motor: Stockfish valora la posición como igualada (≈ 0,1) y considera varias jugadas equivalentes. La estructura es simétrica y ambos bandos pueden disputar la columna: ocuparla no gana, pero cederla sí puede perder.",
              ],
              line: [
                { san: "Rfd1", comment: "Las blancas ocupan la columna abierta.", arrows: [{ from: "d1", to: "d8", tone: "idea" }] },
                { san: "Rfd8", comment: "Las negras la disputan." },
                { san: "Kf1", comment: "El rey se acerca al centro: con la columna disputada, los cambios son probables." },
                { san: "Kf8" },
                { san: "Rxd8+" },
                { san: "Rxd8", comment: "Tras el cambio, el final es igualado." },
              ],
            },
            {
              id: "columna-pregunta",
              kind: "question",
              title: "Comprueba",
              fen: OPEN_FILE_FEN,
              prompt: "¿Para qué sirve, sobre todo, controlar una columna abierta?",
              themes: ["columna-abierta"],
              choices: [
                { id: "entrar", text: "Para que las torres entren en la séptima u octava fila rival", correct: true, feedback: "Correcto: la columna es el camino; la séptima fila, el destino." },
                { id: "defender", text: "Para defender al propio rey", correct: false, feedback: "Una torre en una columna abierta es una pieza de ataque, no de defensa." },
                { id: "mate", text: "Para dar mate en la primera fila", correct: false, feedback: "A veces ocurre, pero el objetivo general es la entrada en el campo rival." },
              ],
            },
            {
              id: "columna-pregunta-2",
              kind: "question",
              title: "Motor y plan",
              prompt: "Stockfish ve igualdad aunque las blancas ocupen primero la columna. ¿Por qué?",
              themes: ["columna-abierta", "evaluacion"],
              choices: [
                { id: "disputa", text: "Porque las negras pueden disputarla de inmediato y no hay casillas de entrada desprotegidas", correct: true, feedback: "Correcto: una columna abierta solo es una ventaja si el rival no puede contestarla." },
                { id: "error", text: "Porque ocupar la columna es un error", correct: false, feedback: "No es un error; simplemente no basta en una posición simétrica." },
                { id: "motor", text: "Porque el motor no entiende de columnas", correct: false, feedback: "El motor calcula muy bien; aquí no existe una ventaja concreta que explotar." },
              ],
            },
          ],
        },
        {
          slug: "caballo-contra-alfil-malo",
          title: "Caballo fuerte contra alfil malo",
          summary: "Una casilla fuerte para el caballo y un alfil encerrado por sus propios peones.",
          objective: "Reconocer un alfil malo y una casilla fuerte, y saber cuándo eso no basta para ganar.",
          concept:
            "Un alfil es malo cuando sus propios peones están fijos en casillas de su color. Una casilla fuerte es la que ningún peón rival puede atacar.",
          estimatedMinutes: 8,
          themes: ["alfil-malo", "casillas-fuertes", "evaluacion"],
          source: "propio",
          steps: [
            {
              id: "caballo-idea",
              kind: "explain",
              title: "d5: la casilla ideal",
              fen: KNIGHT_FEN,
              arrows: [{ from: "e3", to: "d5", tone: "idea" }],
              highlights: ["d5"],
              body: [
                "Los peones negros c5, d6 y e5 están en casillas oscuras: el alfil de e7 (de casillas oscuras) apenas tiene movilidad. Es un alfil malo.",
                "La casilla d5 no puede ser atacada por ningún peón negro: es una casilla fuerte. El caballo blanco irá allí.",
                "Nota del motor: Stockfish valora esta posición concreta como tablas (0,00). La estructura está cerrada y no hay debilidades a las que el rey o el caballo blanco puedan llegar. Una ventaja estática solo gana si existe una vía de entrada o una ruptura.",
              ],
            },
            {
              id: "caballo-alfil",
              kind: "question",
              title: "El alfil malo",
              fen: KNIGHT_FEN,
              prompt: "¿Por qué el alfil de e7 es un alfil malo?",
              themes: ["alfil-malo"],
              choices: [
                { id: "color", text: "Porque sus propios peones están fijos en casillas de su mismo color", correct: true, feedback: "Correcto: c5, d6 y e5 le cierran las diagonales." },
                { id: "atacado", text: "Porque está atacado por el caballo", correct: false, feedback: "No está atacado; el problema es estructural." },
                { id: "lejos", text: "Porque está lejos del rey blanco", correct: false, feedback: "La distancia no lo convierte en malo; lo hacen sus propios peones." },
              ],
            },
            {
              id: "caballo-motor",
              kind: "question",
              title: "¿Gana el caballo?",
              fen: KNIGHT_FEN,
              prompt: "Stockfish evalúa la posición como tablas. ¿Qué lección se extrae?",
              themes: ["evaluacion"],
              choices: [
                { id: "estatica", text: "Una ventaja estática necesita una vía para convertirse: rupturas o debilidades accesibles", correct: true, feedback: "Correcto: sin entrada, el mejor caballo no puede ganar." },
                { id: "alfil", text: "Que el alfil es mejor que el caballo", correct: false, feedback: "No: el caballo sigue siendo la mejor pieza, pero no hay nada que ganar." },
                { id: "motor", text: "Que el motor se equivoca", correct: false, feedback: "La posición está cerrada; no hay forma de forzar la victoria." },
              ],
            },
          ],
        },
      ],
    },
    {
      slug: "planificacion",
      title: "Planificación",
      lessons: [
        {
          slug: "formular-un-plan",
          title: "Cómo formular un plan",
          summary: "Tres preguntas para pasar de «¿qué juego?» a un plan basado en la posición.",
          objective: "Aplicar un método de preguntas para elegir un plan.",
          concept:
            "Antes de buscar jugadas, pregunta: ¿dónde están las debilidades?, ¿cuál es mi peor pieza? y ¿qué quiere hacer el rival? El plan sale de las respuestas.",
          estimatedMinutes: 8,
          themes: ["planes", "evaluacion"],
          source: "propio",
          steps: [
            {
              id: "plan-idea",
              kind: "explain",
              title: "El método",
              fen: fenAfter(IQP_MOVES),
              body: [
                "Jacob Aagaard populariza en su serie Grandmaster Preparation un método de tres preguntas. Lo resumimos con nuestras palabras:",
                "1. ¿Dónde están las debilidades (propias y del rival)?",
                "2. ¿Cuál es la peor pieza y cómo mejorarla?",
                "3. ¿Qué quiere hacer el rival y cómo impedirlo (profilaxis)?",
                "Vamos a aplicarlo a la posición de peón aislado que ya conoces. Juegan las negras.",
              ],
            },
            {
              id: "plan-debilidad",
              kind: "question",
              title: "1. Debilidades",
              fen: fenAfter(IQP_MOVES),
              prompt: "¿Cuál es la debilidad más clara de la posición?",
              themes: ["planes", "peon-aislado"],
              choices: [
                { id: "d4", text: "El peón aislado de d4", correct: true, feedback: "Correcto: no puede ser defendido por otros peones." },
                { id: "e6", text: "El peón negro de e6", correct: false, feedback: "e6 está bien protegido por f7 y no es un objetivo real." },
                { id: "rey", text: "El rey blanco", correct: false, feedback: "El enroque blanco está intacto." },
              ],
            },
            {
              id: "plan-pieza",
              kind: "question",
              title: "2. La peor pieza",
              fen: fenAfter(IQP_MOVES),
              prompt: "¿Cuál es la peor pieza de las negras?",
              themes: ["planes", "pieza-mala"],
              choices: [
                { id: "c8", text: "El alfil de c8, encerrado por el peón de e6", correct: true, feedback: "Correcto: planes como ...b6 y ...Ab7 o ...Ad7 lo activan." },
                { id: "d5", text: "El caballo de d5", correct: false, feedback: "Es la mejor pieza negra: bloquea el peón aislado." },
                { id: "e7", text: "El alfil de e7", correct: false, feedback: "Está desarrollado y puede ir a f6 para presionar d4." },
              ],
            },
            {
              id: "plan-rival",
              kind: "question",
              title: "3. La idea del rival",
              fen: fenAfter(IQP_MOVES),
              prompt: "¿Qué quieren hacer las blancas?",
              themes: ["planes", "profilaxis"],
              choices: [
                { id: "ataque", text: "Atacar al rey con piezas activas (Ad3, De2/Dc2, Te3–g3, Ce5) o liberar con d4-d5", correct: true, feedback: "Correcto: sabiendo esto, las negras cambian piezas atacantes y mantienen el bloqueo en d5." },
                { id: "final", text: "Cambiar todas las piezas y jugar el final", correct: false, feedback: "Eso favorece a las negras: el peón aislado es débil en el final." },
                { id: "pasivo", text: "Defender pasivamente el peón de d4", correct: false, feedback: "Defender sin actividad es la peor forma de jugar con peón aislado." },
              ],
            },
          ],
        },
      ],
    },
  ],
};
