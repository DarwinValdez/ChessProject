import { fenAfterFrom } from "../openings/helpers";
import type { Course } from "../types";

/*
 * Rook endgames. Stockfish 19 (depth 26, no tablebases) was used on
 * 2026-10-22 to check every claim. Without tablebases the engine sees many
 * moves as equivalent in the starting positions (all "+6" in Lucena, all
 * "0.00" in Philidor), so exercises are placed only at moments where the
 * move is genuinely forced; elsewhere the method is taught as recommended
 * technique, not as the only move.
 */

const LUCENA_FEN = "2K5/2P1k3/8/8/8/8/1r6/3R4 w - - 0 1";
const LUCENA_LINE = "Re1+ Kf6 Re4 Rb1 Kd7 Rd1+ Kc6 Rc1+ Kd6 Rd1+ Kc5 Rc1+";
const PHILIDOR_FEN = "4k3/7R/8/3KP3/8/8/1r6/8 b - - 0 1";

export const finalesTorres: Course = {
  slug: "finales-de-torres-esenciales",
  title: "Finales de torres esenciales",
  area: "finales",
  level: "intermedio",
  summary:
    "Las dos posiciones que todo jugador debe saber de memoria —Lucena (ganar) y Philidor (hacer tablas)— y la regla de oro de la torre detrás del peón pasado.",
  outcomes: [
    "Ganar la posición de Lucena construyendo el puente.",
    "Hacer tablas con la defensa de Philidor.",
    "Colocar la torre detrás de los peones pasados.",
  ],
  source: "propio",
  modules: [
    {
      slug: "posiciones-teoricas",
      title: "Posiciones teóricas",
      lessons: [
        {
          slug: "lucena",
          title: "La posición de Lucena",
          summary: "Rey y peón en séptima contra torre: cómo sacar el rey de delante del peón sin perderlo.",
          objective: "Ganar construyendo el puente con la torre en la cuarta fila.",
          concept:
            "Con el rey delante de su peón en séptima y el rey rival cortado, se gana interponiendo la torre en la cuarta fila para cortar los jaques (el puente).",
          estimatedMinutes: 10,
          themes: ["lucena", "torre", "puente"],
          result: "victoria-forzada-blancas",
          source: "propio",
          steps: [
            {
              id: "lucena-linea",
              kind: "explain",
              title: "La técnica del puente",
              fen: LUCENA_FEN,
              body: [
                "El rey blanco está delante de su peón y no puede salir: la torre negra controla la columna b y el rey negro vigila la d.",
                "Plan: 1) alejar más al rey negro con un jaque, 2) llevar la torre a la cuarta fila, 3) sacar el rey y, cuando lleguen los jaques laterales, interponer la torre: el puente.",
                "Nota del motor: en esta posición casi cualquier jugada razonable mantiene la ventaja; la técnica de Lucena es el método seguro y conocido para ganar.",
              ],
              line: [
                { san: "Re1+", comment: "Primero, alejar al rey negro una columna más." },
                { san: "Kf6" },
                { san: "Re4", comment: "¡La torre a la cuarta fila! Prepara el puente.", arrows: [{ from: "e4", to: "c4", tone: "idea" }] },
                { san: "Rb1", comment: "Las negras esperan." },
                { san: "Kd7", comment: "El rey sale de delante del peón." },
                { san: "Rd1+" },
                { san: "Kc6" },
                { san: "Rc1+" },
                { san: "Kd6" },
                { san: "Rd1+" },
                { san: "Kc5" },
                { san: "Rc1+", comment: "Último jaque. Ahora llega el momento clave: ver el ejercicio." },
              ],
            },
            {
              id: "lucena-ejercicio",
              kind: "exercise",
              title: "Construye el puente",
              fen: fenAfterFrom(LUCENA_FEN, LUCENA_LINE),
              prompt: "Juegan las blancas. La torre negra da jaque desde c1. ¿Cómo terminas con los jaques sin perder el peón?",
              themes: ["lucena", "puente"],
              difficulty: 3,
              solution: { options: [{ san: "Rc4" }] },
              hints: ["La torre blanca está en la cuarta fila por algo.", "Interpón la torre en la columna c."],
              explanation:
                "7.Tc4! completa el puente: corta los jaques y, si 7...Txc4+ 8.Rxc4, el peón corona. Stockfish encuentra mate en 12 tras 7.Tc4.",
              refutations: {
                Kb5: "7.Rb5? El rey abandona la columna c y 7...Txc7 da tablas.",
                Kb4: "7.Rb4? El rey abandona la columna c y 7...Txc7 da tablas.",
                Kd5: "7.Rd5? El rey abandona la columna c y 7...Txc7 da tablas.",
                Kd4: "7.Rd4? El rey abandona la columna c y 7...Txc7 da tablas.",
                Kd6: "7.Rd6 no pierde, pero tampoco avanza: los jaques continúan. El puente con 7.Tc4 los corta.",
                Kb6: "7.Rb6 no pierde, pero tampoco avanza: los jaques continúan. El puente con 7.Tc4 los corta.",
              },
              result: "victoria-forzada-blancas",
              verification: "stockfish",
            },
            {
              id: "lucena-pregunta",
              kind: "question",
              title: "Comprueba",
              prompt: "¿Por qué se lleva la torre a la cuarta fila antes de sacar el rey?",
              themes: ["lucena"],
              choices: [
                { id: "puente", text: "Para poder interponerla cuando el rey reciba jaques laterales", correct: true, feedback: "Correcto: ese es el puente." },
                { id: "rey", text: "Para atacar al rey negro", correct: false, feedback: "La torre en cuarta no ataca al rey; sirve de escudo para el propio rey." },
                { id: "peon", text: "Para proteger el peón desde atrás", correct: false, feedback: "El peón de c7 está protegido por el rey; la torre sirve para cortar los jaques." },
              ],
            },
          ],
        },
        {
          slug: "philidor",
          title: "La defensa de Philidor",
          summary: "Cómo hacer tablas con torre contra torre y peón cuando tu rey está delante del peón.",
          objective: "Defender con la torre en la tercera fila y, si el peón avanza, dar jaques desde atrás.",
          concept:
            "Con el rey en la casilla de coronación, la torre en la sexta fila (tercera desde tu lado) impide que el rey rival avance; si el peón avanza, la torre va a la primera fila y da jaques por detrás.",
          estimatedMinutes: 10,
          themes: ["philidor", "torre", "defensa"],
          result: "tablas-teoricas",
          source: "propio",
          steps: [
            {
              id: "philidor-linea",
              kind: "explain",
              title: "El método en dos fases",
              fen: PHILIDOR_FEN,
              body: [
                "Las negras defienden. Su rey está en la casilla de coronación, pero la torre blanca de h7 lo confina a la octava fila.",
                "Fase 1: la torre negra va a la sexta fila e impide que el rey blanco avance (si llegara a la sexta fila con el peón, las negras estarían perdidas).",
                "Fase 2: si las blancas juegan e6 para ganar casillas, el peón ya no protege al rey blanco: la torre negra baja a la primera fila y da jaques por detrás.",
                "Nota del motor: Stockfish considera que varias jugadas iniciales también hacen tablas aquí. Philidor es el método más sencillo y seguro, no la única defensa.",
              ],
              line: [
                { san: "Rb6", comment: "Fase 1: la torre en la sexta fila corta al rey blanco.", arrows: [{ from: "b6", to: "h6", tone: "idea" }] },
                { san: "e6", comment: "Las blancas avanzan para ganar d6 y f6..." },
                { san: "Rb1", comment: "...pero el peón ya no da cobijo: fase 2, jaques desde atrás." },
                { san: "Kd6", comment: "Amenaza mate con Th8. Momento crítico: ver el ejercicio." },
              ],
            },
            {
              id: "philidor-ejercicio",
              kind: "exercise",
              title: "Defiende el mate",
              fen: fenAfterFrom(PHILIDOR_FEN, "Rb6 e6 Rb1 Kd6"),
              prompt: "Juegan las negras. Las blancas amenazan Th8 mate. Encuentra la defensa.",
              themes: ["philidor", "defensa"],
              difficulty: 3,
              solution: { options: [{ san: "Rd1+" }, { san: "Rb6+" }] },
              hints: ["Una amenaza de mate se para mejor con jaques.", "El rey blanco ya no tiene el escudo del peón."],
              explanation:
                "3...Td1+ (o 3...Tb6+) y jaques continuos: el rey blanco no puede esconderse porque el peón está por delante. Tablas. Stockfish confirma que cualquier otra jugada pierde.",
              refutations: {
                Rb2: "3...Tb2?? 4.Th8#.",
                Rb3: "3...Tb3?? 4.Th8#.",
                Rg1: "3...Tg1? 4.Th8+ Tg8 5.Txg8#.",
                Rh1: "3...Th1? 4.Txh1 y el mate llega enseguida.",
                Kf8: "3...Rf8? 4.e7+ y el peón corona con jaque.",
                Rf1: "3...Tf1? 4.Th8+ Tf8 5.Txf8+ Rxf8 y el peón corona: Stockfish encuentra mate.",
              },
              result: "tablas-teoricas",
              verification: "stockfish",
            },
            {
              id: "philidor-pregunta",
              kind: "question",
              title: "Comprueba",
              prompt: "¿Cuándo debe la torre defensora abandonar la sexta fila para dar jaques desde atrás?",
              themes: ["philidor"],
              choices: [
                { id: "e6", text: "Cuando el peón avanza a la sexta fila", correct: true, feedback: "Correcto: entonces el rey atacante pierde su refugio." },
                { id: "ya", text: "Inmediatamente, sin esperar", correct: false, feedback: "Si la torre abandona la sexta fila demasiado pronto, el rey atacante avanza." },
                { id: "nunca", text: "Nunca: debe quedarse en la sexta fila", correct: false, feedback: "Cuando el peón llega a la sexta fila, la torre ya no puede cortar al rey desde allí." },
              ],
            },
          ],
        },
        {
          slug: "torre-detras-del-peon",
          title: "Torre detrás del peón pasado",
          summary: "La regla de Tarrasch: las torres pertenecen detrás de los peones pasados, propios o ajenos.",
          objective: "Elegir la colocación activa de la torre en finales con peón pasado.",
          concept:
            "Detrás de un peón pasado propio, la torre gana actividad a medida que el peón avanza; delante de él, la torre rival queda pasiva.",
          estimatedMinutes: 6,
          themes: ["torre-activa", "peon-pasado", "torre"],
          source: "propio",
          steps: [
            {
              id: "tarrasch-idea",
              kind: "explain",
              title: "Actividad de la torre",
              fen: "r7/6k1/8/P7/8/8/6K1/R7 w - - 0 1",
              arrows: [{ from: "a1", to: "a5", tone: "idea" }],
              body: [
                "La torre blanca está detrás de su peón pasado: cuanto más avance el peón, más casillas controla la torre.",
                "La torre negra está delante del peón: tiene que quedarse allí para bloquearlo y apenas puede moverse.",
                "Es una regla general (Siegbert Tarrasch), no una ley: hay excepciones concretas, pero es el punto de partida correcto para decidir.",
              ],
            },
            {
              id: "tarrasch-pregunta",
              kind: "question",
              title: "Comprueba",
              fen: "r7/6k1/8/P7/8/8/6K1/R7 w - - 0 1",
              prompt: "¿Qué torre es más activa en esta posición?",
              themes: ["torre-activa"],
              choices: [
                { id: "blanca", text: "La blanca, situada detrás de su peón pasado", correct: true, feedback: "Correcto: la torre de a8 está atada a la defensa." },
                { id: "negra", text: "La negra, que bloquea el peón", correct: false, feedback: "Bloquear es necesario, pero la torre de a8 queda pasiva." },
                { id: "igual", text: "Son igual de activas", correct: false, feedback: "No: una apoya el avance y la otra solo puede bloquear." },
              ],
            },
            {
              id: "tarrasch-pregunta-2",
              kind: "question",
              title: "Defender",
              prompt: "Tu rival tiene un peón pasado. Según la regla de Tarrasch, ¿dónde colocas tu torre?",
              themes: ["torre-activa", "defensa"],
              choices: [
                { id: "detras", text: "Detrás del peón rival", correct: true, feedback: "Correcto: lo ataca y sigue activa mientras avanza." },
                { id: "delante", text: "Delante del peón rival", correct: false, feedback: "Bloquear es posible, pero la torre queda pasiva." },
                { id: "lado", text: "En la misma fila que el peón", correct: false, feedback: "Desde el lado, el rey rival puede interponerse y proteger el peón." },
              ],
            },
          ],
        },
      ],
    },
  ],
};
