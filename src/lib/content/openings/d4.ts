/*
 * 1.d4 and flank openings. Lines are standard theory; ECO codes are given
 * only where well established. The Elephant Trap was checked with
 * Stockfish 19 (depth 22) on 2026-10-22. Explanations are original.
 */
import { fenAfter, m, plain } from "./helpers";
import type { Opening } from "./types";

export const gambitoDama: Opening = {
  slug: "gambito-de-dama",
  name: "Gambito de Dama",
  aliases: ["Gambito de Dama Rehusado", "Gambito de Dama Aceptado", "Eslava"],
  eco: "D06–D69",
  families: ["cerrada"],
  groups: ["sistema-blancas"],
  side: "blancas",
  level: "intermedio",
  summary:
    "2.c4 ofrece un peón de flanco para desviar el peón de d5 del centro. No es un gambito real: si las negras lo aceptan, las blancas suelen recuperarlo con comodidad.",
  mainLine: {
    id: "rehusado-tartakower",
    name: "Gambito de Dama Rehusado, Tartakower",
    eco: "D58",
    kind: "principal",
    description: "Las negras mantienen el punto d5 con ...e6 y desarrollan con solidez; ...b6 prepara el fianchetto del alfil de c8.",
    moves: [
      m("d4"),
      m("d5"),
      m("c4", "Ataca d5 con un peón de flanco: si ...dxc4, las blancas toman el centro con e4.", [{ from: "c4", to: "d5", tone: "threat" }]),
      m("e6", "Rehúsa el gambito manteniendo d5. Precio: el alfil de c8 queda encerrado."),
      m("Nc3", "Más presión sobre d5."),
      m("Nf6"),
      m("Bg5", "Clava (relativamente) el caballo que defiende d5."),
      m("Be7", "Deshace la clavada."),
      m("e3"),
      m("O-O"),
      m("Nf3"),
      m("h6", "Pregunta al alfil antes de decidir el plan."),
      m("Bh4"),
      m("b6", "Tartakower: el alfil de c8 irá a b7, resolviendo el problema de la pieza mala."),
    ],
  },
  ideas: [
    "Las blancas cambian un peón de flanco por el control del centro.",
    "Con ...e6 las negras mantienen d5 pero encierran el alfil de c8: gran parte de la teoría trata de cómo activarlo.",
    "En la Variante del Cambio aparece la estructura de Carlsbad y el ataque de minorías (b4-b5).",
  ],
  goals: {
    white: ["Presionar d5 y conseguir e4 en buenas condiciones.", "En la estructura de Carlsbad, ataque de minorías en el flanco de dama."],
    black: ["Mantener d5 y liberar el juego con ...c5 o ...e5.", "Resolver el problema del alfil de c8."],
  },
  structures: [
    { name: "Carlsbad (d4/c-pawn vs d5/c6)", description: "Tras cxd5 exd5: las blancas atacan con b4-b5 (ataque de minorías); las negras buscan juego en el flanco de rey o en e4." },
    { name: "Peón aislado de dama", description: "Tras ...c5 y cambios en d4, uno de los bandos queda con un peón aislado: actividad frente a debilidad estática." },
  ],
  plans: {
    white: ["Tc1, Ad3 y presión por la columna c.", "Ataque de minorías b4-b5 en la estructura de Carlsbad.", "e4 cuando esté preparado."],
    black: ["...c5 o ...e5 para liberar.", "...b6 y ...Ab7 (Tartakower).", "...Ce4 para cambiar piezas."],
  },
  squares: {
    strong: ["e5 y e4 (casillas de apoyo de caballos)", "c5 para las blancas tras b4"],
    weak: ["c6 tras el ataque de minorías", "e4 si las negras juegan ...f5"],
    note: "El ataque de minorías busca crear un peón débil en c6 que pueda atacarse por la columna c.",
  },
  development: ["Blancas: Cc3, Ag5, e3, Cf3, Ad3, Tc1, enroque.", "Negras: ...Cf6, ...Ae7, enroque, ...h6, ...b6 o ...Cbd7 y ...c6."],
  traps: [
    {
      id: "elefante",
      name: "La trampa del Elefante",
      moves: ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "Bg5", "Nbd7", "cxd5", "exd5", "Nxd5"],
      victim: "blancas",
      punishment: [
        m("Nxd5", "¡Las negras entregan la dama!"),
        m("Bxd8"),
        m("Bb4+", "Jaque: la dama blanca tiene que interponerse."),
        m("Qd2"),
        m("Bxd2+"),
        m("Kxd2"),
        m("Kxd8", "Balance: las negras han ganado una pieza."),
      ],
      explanation:
        "6.Cxd5?? parece ganar un peón porque el caballo de f6 está clavado, pero la clavada es relativa: 6...Cxd5! 7.Axd8 Ab4+ y las negras recuperan la dama con una pieza de ventaja (Stockfish ≈ +6).",
      verification: "stockfish",
    },
  ],
  mistakes: [
    { text: "Con negras, aceptar el gambito y querer conservar el peón con ...b5: suele debilitar el flanco de dama sin éxito." },
    { text: "Con blancas, ganar el peón de d5 cuando el caballo de f6 solo está clavado de forma relativa (trampa del Elefante)." },
  ],
  modelGames: [
    {
      white: "Bobby Fischer",
      black: "Borís Spasski",
      event: "Campeonato del Mundo, Reikiavik (partida 6)",
      year: 1972,
      note: "Fischer jugó 1.c4 y la partida transpuso al Gambito de Dama Rehusado, variante Tartakower: ejemplo célebre de juego posicional.",
    },
  ],
  variations: [
    { id: "aceptado", name: "Gambito de Dama Aceptado", eco: "D20–D29", kind: "secundaria", description: "2...dxc4: las negras ceden el centro y recuperan tiempo atacando con ...c5.", moves: plain("d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5") },
    { id: "eslava", name: "Defensa Eslava", eco: "D10–D19", kind: "secundaria", description: "2...c6: defiende d5 sin encerrar el alfil de c8.", moves: plain("d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4") },
    { id: "cambio", name: "Variante del Cambio", eco: "D35–D36", kind: "secundaria", description: "4.cxd5 exd5: estructura de Carlsbad; plan típico de ataque de minorías.", moves: plain("d4 d5 c4 e6 Nc3 Nf6 cxd5 exd5 Bg5 c6 Qc2") },
  ],
  critical: [
    {
      id: "carlsbad",
      title: "Estructura de Carlsbad",
      moves: ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "cxd5", "exd5", "Bg5", "c6", "Qc2"],
      explanation: "Las blancas preparan b4-b5 para crear una debilidad en c6; las negras buscan juego con ...Ce4 o en el flanco de rey.",
    },
  ],
  exercises: [
    {
      id: "gd-elefante",
      kind: "exercise",
      title: "Castiga 6.Cxd5??",
      fen: fenAfter("d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 cxd5 exd5 Nxd5"),
      prompt: "Juegan las negras. Las blancas acaban de capturar en d5 confiando en la clavada. ¿Qué haces?",
      themes: ["trampa", "clavada"],
      difficulty: 3,
      solution: { options: [{ san: "Nxd5", reply: "Bxd8", next: { options: [{ san: "Bb4+" }] } }] },
      hints: ["La clavada del caballo de f6 es relativa: detrás no está el rey.", "Si entregas la dama, ¿tienes un jaque que la recupere?"],
      explanation: "6...Cxd5! 7.Axd8 Ab4+ 8.Dd2 Axd2+ 9.Rxd2 Rxd8 y las negras quedan con una pieza de ventaja (Stockfish ≈ +6).",
      refutations: { h6: "6...h6 no aprovecha el error: tras 6...Cxd5! las negras ganan una pieza." },
      verification: "stockfish",
    },
    {
      id: "gd-q-gambito",
      kind: "question",
      title: "¿Es un gambito de verdad?",
      prompt: "Si las negras aceptan con 2...dxc4, ¿qué suele ocurrir?",
      themes: ["centro", "gambito-de-dama"],
      choices: [
        { id: "recupera", text: "Las blancas recuperan el peón y ocupan el centro con e4 o e3 + Axc4", correct: true, feedback: "Correcto: por eso no se considera un gambito auténtico." },
        { id: "pierde", text: "Las blancas quedan con un peón menos durante toda la partida", correct: false, feedback: "Intentar conservar el peón con ...b5 suele debilitar a las negras; las blancas lo recuperan." },
        { id: "mate", text: "Las blancas obtienen un ataque de mate inmediato", correct: false, feedback: "El Gambito de Dama es posicional, no un ataque directo." },
      ],
    },
  ],
};

export const catalana: Opening = {
  slug: "apertura-catalana",
  name: "Apertura Catalana",
  eco: "E01–E09",
  families: ["cerrada"],
  groups: ["sistema-blancas"],
  side: "blancas",
  level: "avanzado",
  summary:
    "Gambito de Dama con fianchetto: el alfil de g2 presiona la gran diagonal hacia d5, b7 y a8. Las blancas suelen ceder c4 temporalmente a cambio de presión duradera.",
  mainLine: {
    id: "abierta",
    name: "Catalana Abierta",
    eco: "E05",
    kind: "principal",
    description: "6...dxc4: las negras toman el peón; las blancas lo recuperan con Dc2 y Dxc4 manteniendo la presión de la diagonal.",
    moves: [
      m("d4"),
      m("Nf6"),
      m("c4"),
      m("e6"),
      m("g3", "Fianchetto: el alfil irá a g2 para controlar la gran diagonal."),
      m("d5"),
      m("Bg2", "Presión sobre d5 y, más allá, sobre b7.", [{ from: "g2", to: "b7", tone: "idea" }]),
      m("Be7"),
      m("Nf3"),
      m("O-O"),
      m("O-O"),
      m("dxc4", "Las negras aceptan el peón de c4."),
      m("Qc2", "Prepara Dxc4 y vigila e4."),
      m("a6", "Prepara ...b5 para defender el peón de c4."),
      m("Qxc4", "Las blancas recuperan el peón."),
      m("b5", "Gana tiempo sobre la dama y prepara ...Ab7 para neutralizar el alfil de g2."),
      m("Qc2"),
      m("Bb7", "El alfil negro se opone al de g2 en la gran diagonal."),
    ],
  },
  ideas: [
    "El alfil de g2 es la pieza clave: su presión a lo largo de la gran diagonal dura toda la partida.",
    "Las blancas no temen ceder c4 temporalmente.",
    "Las negras necesitan ...c5 o ...b5 + ...Ab7 para equilibrar la diagonal.",
  ],
  goals: {
    white: ["Mantener la presión sobre el flanco de dama negro.", "Recuperar c4 en buenas condiciones."],
    black: ["Neutralizar el alfil de g2.", "Liberarse con ...c5."],
  },
  structures: [{ name: "Fianchetto contra centro e6-d5", description: "Las blancas controlan e4 y la gran diagonal; las negras, sólidas pero algo pasivas." }],
  plans: {
    white: ["Dxc4, Td1 y presión por las columnas c y d.", "e4 cuando el centro lo permita."],
    black: ["...b5, ...Ab7 y ...c5.", "En la Cerrada, ...Cbd7, ...c6 y ...b6."],
  },
  squares: {
    strong: ["e5 y c5 para las blancas", "d5 para las negras"],
    weak: ["c6 y b7 bajo el alfil de g2"],
    note: "Mientras el alfil de g2 no tenga oposición, las casillas claras del flanco de dama negro son vulnerables.",
  },
  development: ["Blancas: g3, Ag2, Cf3, enroque, Dc2, Td1.", "Negras: ...Cf6, ...e6, ...d5, ...Ae7, enroque, ...dxc4/...Cbd7."],
  traps: [],
  mistakes: [
    { text: "Con negras, defender el peón de c4 con ...b5 sin poder sostener la estructura: el alfil de g2 castiga la diagonal a8-h1." },
    { text: "Con blancas, recuperar el peón demasiado tarde y quedar sin compensación." },
  ],
  modelGames: [],
  variations: [
    { id: "cerrada", name: "Catalana Cerrada", eco: "E06–E09", kind: "secundaria", description: "6...Cbd7: las negras mantienen d5 y preparan ...c6 y ...b6.", moves: plain("d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O Nbd7 Qc2 c6") },
    { id: "abierta-temprana", name: "Abierta con 4...dxc4", kind: "secundaria", description: "Las negras toman el peón de inmediato, antes de enrocar.", moves: plain("d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Nf3") },
  ],
  critical: [
    {
      id: "dxc4",
      title: "Tras 6...dxc4",
      moves: ["d4", "Nf6", "c4", "e6", "g3", "d5", "Bg2", "Be7", "Nf3", "O-O", "O-O", "dxc4"],
      explanation: "¿Recuperar el peón ya (Dc2, Da4) o seguir desarrollando? La presión del alfil de g2 hace difícil para las negras conservarlo.",
    },
  ],
  exercises: [
    {
      id: "catalana-q-alfil",
      kind: "question",
      title: "La pieza clave",
      prompt: "¿Qué pieza define el carácter de la Catalana?",
      themes: ["fianchetto", "catalana"],
      choices: [
        { id: "g2", text: "El alfil de g2 en la gran diagonal", correct: true, feedback: "Correcto: presiona d5, c6, b7 y a8." },
        { id: "c3", text: "El caballo de c3", correct: false, feedback: "En la Catalana el caballo suele ir a d2 o c3 más tarde; la pieza clave es el alfil." },
        { id: "dama", text: "La dama en b3", correct: false, feedback: "La dama apoya, pero la presión estructural viene del alfil de g2." },
      ],
    },
  ],
};

export const nimzoindia: Opening = {
  slug: "defensa-nimzoindia",
  name: "Defensa Nimzoindia",
  eco: "E20–E59",
  families: ["semicerrada", "hipermoderna"],
  groups: ["contra-d4"],
  side: "negras",
  level: "avanzado",
  summary:
    "3...Ab4 clava el caballo de c3 para impedir e4. Las negras están dispuestas a ceder la pareja de alfiles a cambio de dañar la estructura blanca.",
  mainLine: {
    id: "rubinstein",
    name: "Variante Rubinstein (4.e3)",
    eco: "E40–E59",
    kind: "principal",
    description: "4.e3: desarrollo sólido; las blancas aceptan una estructura algo más pasiva a cambio de flexibilidad.",
    moves: [
      m("d4"),
      m("Nf6", "Controla e4 con una pieza en lugar de un peón."),
      m("c4"),
      m("e6"),
      m("Nc3", "Prepara e4."),
      m("Bb4", "Clava el caballo y vuelve a impedir e4.", [{ from: "b4", to: "c3", tone: "threat" }]),
      m("e3", "Desarrollo tranquilo: prepara Ad3 y Ce2/Cf3."),
      m("O-O"),
      m("Bd3"),
      m("d5", "Ocupa el centro ahora que e4 está bajo control."),
      m("Nf3"),
      m("c5", "Presión sobre d4: ruptura típica."),
      m("O-O"),
    ],
  },
  ideas: [
    "Control de e4 con piezas (Cf6, Ab4) en lugar de con peones: idea hipermoderna.",
    "Si las negras juegan ...Axc3, las blancas obtienen pareja de alfiles pero peones doblados en c.",
    "La lucha estratégica: alfiles contra estructura.",
  ],
  goals: {
    white: ["Conseguir e4.", "Abrir la posición para la pareja de alfiles."],
    black: ["Mantener el control de e4.", "Atacar los peones doblados de c si aparecen."],
  },
  structures: [
    { name: "Peones doblados c3/c4", description: "Tras ...Axc3 y bxc3: las negras atacan c4 con ...b6, ...Aa6 y ...Ca5." },
    { name: "Peón aislado", description: "En la Rubinstein con ...d5 y ...c5 aparecen posiciones de peón aislado." },
  ],
  plans: {
    white: ["Dc2 o a3 para obtener la pareja de alfiles sin estropear la estructura (Clásica, Sämisch).", "e4 y apertura del centro."],
    black: ["...b6 y ...Ab7 (o ...Aa6 contra c4).", "...c5 y ...d5 contra el centro."],
  },
  squares: {
    strong: ["e4 (casilla central disputada)"],
    weak: ["c4 si las blancas tienen peones doblados", "las casillas oscuras del campo negro sin el alfil de b4"],
    note: "Al entregar el alfil de casillas oscuras, las negras deben vigilar sus casillas oscuras.",
  },
  development: ["Blancas: Cc3, e3/Dc2/a3 según la variante, Ad3, Cf3 o Ce2.", "Negras: ...Cf6, ...e6, ...Ab4, enroque, ...d5 o ...b6, ...c5."],
  traps: [],
  mistakes: [
    { text: "Con negras, cambiar en c3 sin un plan contra los peones doblados: la pareja de alfiles blanca acaba imponiéndose." },
    { text: "Con blancas, jugar e4 sin preparación y perder el peón." },
  ],
  modelGames: [],
  variations: [
    { id: "clasica", name: "Variante Clásica", eco: "E32–E39", kind: "secundaria", description: "4.Dc2: si ...Axc3, las blancas recapturan con la dama sin doblar peones.", moves: plain("d4 Nf6 c4 e6 Nc3 Bb4 Qc2") },
    { id: "samisch", name: "Variante Sämisch", eco: "E24–E29", kind: "secundaria", description: "4.a3: las blancas obligan al cambio y aceptan los peones doblados a cambio de los alfiles y el centro.", moves: plain("d4 Nf6 c4 e6 Nc3 Bb4 a3 Bxc3+ bxc3") },
    { id: "leningrado", name: "Variante Leningrado", eco: "E30–E31", kind: "secundaria", description: "4.Ag5: clavada contra clavada.", moves: plain("d4 Nf6 c4 e6 Nc3 Bb4 Bg5") },
  ],
  critical: [
    {
      id: "samisch",
      title: "Sämisch tras 5.bxc3",
      moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4", "a3", "Bxc3+", "bxc3"],
      explanation: "Alfiles y centro para las blancas; objetivo c4 para las negras (...c5, ...b6, ...Aa6, ...Ca5).",
    },
  ],
  exercises: [
    {
      id: "nimzo-q-e4",
      kind: "question",
      title: "La idea de ...Ab4",
      prompt: "¿Cuál es el objetivo principal de 3...Ab4?",
      themes: ["centro", "nimzoindia"],
      choices: [
        { id: "e4", text: "Impedir e4 clavando el caballo que lo apoya", correct: true, feedback: "Correcto: control del centro con piezas." },
        { id: "rey", text: "Atacar al rey blanco", correct: false, feedback: "La clavada no es contra el rey; el objetivo es la casilla e4." },
        { id: "ganar", text: "Ganar el caballo de c3", correct: false, feedback: "El caballo está defendido; se trata de controlar e4." },
      ],
    },
  ],
};

export const indiaDeRey: Opening = {
  slug: "defensa-india-de-rey",
  name: "Defensa India de Rey",
  eco: "E60–E99",
  families: ["semicerrada", "hipermoderna"],
  groups: ["contra-d4"],
  side: "negras",
  level: "avanzado",
  summary:
    "Las negras dejan que las blancas construyan un gran centro para atacarlo después con ...e5 o ...c5. Con el centro cerrado, cada bando ataca en un flanco.",
  mainLine: {
    id: "mar-del-plata",
    name: "Variante Clásica (Mar del Plata)",
    eco: "E97–E99",
    kind: "principal",
    description: "Tras 9.d5 el centro se cierra: las blancas atacan en el flanco de dama y las negras en el de rey.",
    moves: [
      m("d4"),
      m("Nf6"),
      m("c4"),
      m("g6", "Fianchetto: el alfil de g7 presionará el centro desde lejos."),
      m("Nc3"),
      m("Bg7"),
      m("e4", "Las blancas construyen un centro amplio."),
      m("d6", "Las negras no lo impiden: prepararán ...e5."),
      m("Nf3"),
      m("O-O"),
      m("Be2"),
      m("e5", "Ataca el centro blanco."),
      m("O-O"),
      m("Nc6", "Más presión sobre d4."),
      m("d5", "Cierra el centro y gana espacio con tempo."),
      m("Ne7", "El caballo se reorganiza; las negras prepararán ...f5.", [{ from: "f7", to: "f5", tone: "idea" }]),
    ],
  },
  ideas: [
    "Idea hipermoderna: ceder el centro para atacarlo después.",
    "Con el centro cerrado, las negras atacan con ...f5-f4 y ...g5-g4; las blancas, con c5 en el flanco de dama.",
    "El alfil de g7 es una pieza vital: cambiarlo suele debilitar al rey negro.",
  ],
  goals: {
    white: ["Romper con c4-c5 en el flanco de dama.", "Mantener el control del centro."],
    black: ["Ataque en el flanco de rey con ...f5, ...f4, ...g5.", "Presión sobre e4 y d4."],
  },
  structures: [{ name: "Centro cerrado d5/e4 contra d6/e5", description: "Carreras de ataque en flancos opuestos: la velocidad lo decide todo." }],
  plans: {
    white: ["Ce1–d3, c5, Tc1 y entrada por la columna c.", "f3 para reforzar e4 contra ...f5."],
    black: ["...Ce8 o ...Cd7, ...f5, ...f4 y ...g5-g4.", "...Cf6–h5–f4 en algunas estructuras."],
  },
  squares: {
    strong: ["f4 para las negras", "c6 y d6 para las blancas tras c5"],
    weak: ["d6 y c7 en el campo negro", "e3 y g3 en el campo blanco"],
    note: "En las carreras de ataque, las casillas de entrada (c6/c7 para las blancas, f3/g3 para las negras) importan más que el material.",
  },
  development: ["Blancas: Cc3, e4, Cf3, Ae2, enroque, d5 (Clásica).", "Negras: ...Cf6, ...g6, ...Ag7, ...d6, enroque, ...e5, ...Cc6–e7."],
  traps: [],
  mistakes: [
    { text: "Con negras, ser pasivo: si no hay ruptura (...e5 o ...c5), las blancas aplastan con su espacio." },
    { text: "Cambiar el alfil de g7 sin necesidad: el rey negro queda debilitado en las casillas oscuras." },
  ],
  modelGames: [],
  variations: [
    { id: "samisch", name: "Variante Sämisch", eco: "E80–E89", kind: "secundaria", description: "5.f3: refuerza e4 y prepara Ae3, Dd2 y a veces enroque largo y g4-h4.", moves: plain("d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3") },
    { id: "cuatro-peones", name: "Ataque de los Cuatro Peones", eco: "E76–E79", kind: "secundaria", description: "5.f4: centro máximo; las negras lo atacan de inmediato con ...c5.", moves: plain("d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f4 O-O Nf3 c5") },
    { id: "fianchetto", name: "Variante del Fianchetto", eco: "E60–E69", kind: "secundaria", description: "g3 y Ag2: las blancas neutralizan la diagonal del alfil de g7.", moves: plain("d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d6 O-O") },
    { id: "averbakh", name: "Variante Averbakh", eco: "E73–E75", kind: "secundaria", description: "5.Ae2 y 6.Ag5: impide ...e5 inmediato al presionar el caballo de f6.", moves: plain("d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Bg5") },
  ],
  critical: [
    {
      id: "d5",
      title: "Centro cerrado tras 9.d5",
      moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e4", "d6", "Nf3", "O-O", "Be2", "e5", "O-O", "Nc6", "d5", "Ne7"],
      explanation: "Cada bando ataca donde tiene más espacio: blancas con c5 (flanco de dama), negras con ...f5 (flanco de rey).",
    },
  ],
  exercises: [
    {
      id: "kid-q-plan",
      kind: "question",
      title: "Planes con el centro cerrado",
      fen: fenAfter("d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7"),
      prompt: "Con el centro cerrado tras 9.d5, ¿dónde suelen atacar las negras?",
      themes: ["planes", "india-de-rey"],
      choices: [
        { id: "rey", text: "En el flanco de rey, con ...f5 y luego ...f4 y ...g5", correct: true, feedback: "Correcto: sus peones apuntan hacia ese flanco (cadena d6-e5)." },
        { id: "dama", text: "En el flanco de dama, con ...b5", correct: false, feedback: "Ese es el flanco donde atacan las blancas (c5)." },
        { id: "centro", text: "En el centro, con ...d5", correct: false, feedback: "El centro está bloqueado por los peones de d5 y e4." },
      ],
    },
  ],
};

export const grunfeld: Opening = {
  slug: "defensa-grunfeld",
  name: "Defensa Grünfeld",
  eco: "D70–D99",
  families: ["semicerrada", "hipermoderna"],
  groups: ["contra-d4"],
  side: "negras",
  level: "experto",
  summary:
    "3...d5 desafía el centro de inmediato y, tras el cambio en c3, las negras presionan el centro blanco con el alfil de g7, ...c5 y ...Cc6.",
  mainLine: {
    id: "cambio",
    name: "Variante del Cambio",
    eco: "D85–D89",
    kind: "principal",
    description: "Las blancas obtienen un gran centro (c3, d4, e4) y las negras lo atacan con todas sus piezas.",
    moves: [
      m("d4"),
      m("Nf6"),
      m("c4"),
      m("g6"),
      m("Nc3"),
      m("d5", "Grünfeld: desafía el centro inmediatamente."),
      m("cxd5"),
      m("Nxd5"),
      m("e4", "Gana tiempo sobre el caballo y construye el centro."),
      m("Nxc3"),
      m("bxc3", "Centro de peones c3-d4-e4."),
      m("Bg7", "El alfil apunta a d4 y c3.", [{ from: "g7", to: "c3", tone: "threat" }]),
      m("Nf3"),
      m("c5", "Golpe al centro."),
      m("Rb1", "Saca la torre de la diagonal del alfil y presiona b7."),
      m("O-O"),
      m("Be2"),
    ],
  },
  ideas: [
    "Hipermodernismo puro: dejar que el rival construya un centro y destruirlo.",
    "Las negras presionan d4 con ...Ag7, ...c5, ...Cc6 y ...Ag4.",
    "Las blancas buscan d5 para ganar espacio o un ataque en el flanco de rey.",
  ],
  goals: {
    white: ["Mantener el centro.", "Avanzar d5 en el momento justo."],
    black: ["Presión constante sobre d4.", "Si el centro cae, jugar con la mayoría de peones del flanco de dama."],
  },
  structures: [{ name: "Centro c3-d4-e4 contra ...c5 y ...g6", description: "Tensión central máxima: si el centro aguanta, las blancas atacan; si cae, las negras se imponen." }],
  plans: {
    white: ["Ae3, Dd2, Td1 y d5.", "Rb1 contra b7."],
    black: ["...Cc6, ...Ag4, ...cxd4 y presión por la columna c.", "...Da5 contra c3."],
  },
  squares: {
    strong: ["d4 (objetivo de todas las piezas negras)"],
    weak: ["c3 y d4 en el campo blanco"],
    note: "Toda la apertura gira en torno a d4: cuenta atacantes y defensores antes de cada jugada.",
  },
  development: ["Blancas: Cc3, cxd5, e4, Cf3, Tb1/Ae3, Ae2.", "Negras: ...Cf6, ...g6, ...d5, ...Ag7, ...c5, enroque, ...Cc6, ...Ag4."],
  traps: [],
  mistakes: [
    { text: "Con negras, jugar lento: si las blancas consolidan el centro y avanzan d5, las negras quedan sin espacio." },
    { text: "Con blancas, dejar sin defensa c3 o d4 frente al alfil de g7." },
  ],
  modelGames: [
    {
      white: "Donald Byrne",
      black: "Bobby Fischer",
      event: "Torneo Rosenwald, Nueva York",
      year: 1956,
      note: "La «partida del siglo», con una Grünfeld: el sacrificio de dama de Fischer, con 13 años, es una lección de actividad de piezas.",
    },
  ],
  variations: [
    { id: "rusa", name: "Sistema Ruso", eco: "D96–D99", kind: "secundaria", description: "4.Cf3 Ag7 5.Db3: presión sobre d5 y c4; las blancas ganan el centro con e4.", moves: plain("d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3 dxc4 Qxc4 O-O e4") },
    { id: "af4", name: "Variante 4.Af4", eco: "D82–D83", kind: "secundaria", description: "Presión sobre c7 y desarrollo rápido.", moves: plain("d4 Nf6 c4 g6 Nc3 d5 Bf4") },
  ],
  critical: [
    {
      id: "centro",
      title: "Tras 6.bxc3: el gran centro",
      moves: ["d4", "Nf6", "c4", "g6", "Nc3", "d5", "cxd5", "Nxd5", "e4", "Nxc3", "bxc3"],
      explanation: "El centro blanco parece imponente; las negras lo atacarán con ...Ag7, ...c5, ...Cc6 y ...Ag4.",
    },
  ],
  exercises: [
    {
      id: "grunfeld-q-d4",
      kind: "question",
      title: "El objetivo",
      prompt: "En la Grünfeld del Cambio, ¿cuál es el blanco principal de las piezas negras?",
      themes: ["centro", "grunfeld"],
      choices: [
        { id: "d4", text: "El peón de d4", correct: true, feedback: "Correcto: alfil de g7, ...c5, ...Cc6 y a veces ...Ag4 apuntan a d4." },
        { id: "f2", text: "El peón de f2", correct: false, feedback: "f2 no es el objetivo estratégico de la apertura." },
        { id: "rey", text: "El rey blanco", correct: false, feedback: "Es una lucha por el centro, no un ataque directo al rey." },
      ],
    },
  ],
};

export const inglesa: Opening = {
  slug: "apertura-inglesa",
  name: "Apertura Inglesa",
  eco: "A10–A39",
  families: ["flanco", "hipermoderna"],
  groups: ["sistema-blancas"],
  side: "blancas",
  level: "intermedio",
  summary:
    "1.c4 controla d5 desde el flanco. Flexible y rica en transposiciones: puede convertirse en una Siciliana invertida o en sistemas de 1.d4.",
  mainLine: {
    id: "simetrica",
    name: "Inglesa Simétrica",
    eco: "A30–A39",
    kind: "principal",
    description: "1...c5: ambos bandos hacen fianchetto y luchan por d5 y d4.",
    moves: [
      m("c4", "Controla d5 sin comprometer los peones centrales.", [{ from: "c4", to: "d5", tone: "idea" }]),
      m("c5", "Simetría: las negras controlan d4."),
      m("Nc3"),
      m("Nc6"),
      m("g3", "Prepara el fianchetto."),
      m("g6"),
      m("Bg2", "El alfil presiona d5, c6 y b7.", [{ from: "g2", to: "c6", tone: "idea" }]),
      m("Bg7"),
    ],
  },
  ideas: [
    "Control de d5 desde el flanco, al estilo de una Siciliana con un tiempo más.",
    "El fianchetto del alfil de rey es casi automático.",
    "Las blancas suelen expandirse en el flanco de dama (a3, Tb1, b4).",
  ],
  goals: {
    white: ["Dominar d5.", "Expansión en el flanco de dama con b4."],
    black: ["Ocupar el centro con ...e5 o ...d5.", "Contrarrestar la diagonal del alfil de g2."],
  },
  structures: [
    { name: "Siciliana invertida", description: "Tras 1...e5 las blancas juegan una Siciliana con un tiempo de más." },
    { name: "Botvinnik (c4-e4)", description: "Las blancas forman peones en c4 y e4 para controlar d5 de forma duradera." },
  ],
  plans: {
    white: ["a3, Tb1 y b4.", "e3/Cge2 o e4 (Botvinnik) según la estructura."],
    black: ["...e5 y ...Cge7 para controlar el centro.", "...d5 si es posible."],
  },
  squares: { strong: ["d5", "b5"], weak: ["d4 en estructuras con e4"], note: "Toda la estrategia de la Inglesa gira en torno a d5." },
  development: ["Blancas: c4, Cc3, g3, Ag2, Cf3, enroque.", "Negras: según el sistema: ...e5 + ...Cc6 o ...c5 + fianchetto."],
  traps: [],
  mistakes: [{ text: "Jugar la Inglesa sin conocer las transposiciones: un mismo orden de jugadas puede llevar a posiciones de 1.d4 que no se dominan." }],
  modelGames: [],
  variations: [
    { id: "invertida", name: "Inglesa invertida (1...e5)", eco: "A20–A29", kind: "secundaria", description: "Una Siciliana con colores cambiados y un tiempo más para las blancas.", moves: plain("c4 e5 Nc3 Nf6 Nf3 Nc6 g3") },
    { id: "anglo-india", name: "Anglo-India (1...Cf6)", eco: "A15–A19", kind: "secundaria", description: "Respuesta flexible que puede transponer a sistemas de 1.d4.", moves: plain("c4 Nf6 Nc3 g6 g3 Bg7 Bg2 O-O") },
  ],
  critical: [
    { id: "simetrica", title: "Inglesa Simétrica tras 4...Ag7", moves: ["c4", "c5", "Nc3", "Nc6", "g3", "g6", "Bg2", "Bg7"], explanation: "Lucha por d5 y d4: e3 + Cge2, Cf3 o a3 + Tb1 + b4 son planes típicos." },
  ],
  exercises: [
    {
      id: "inglesa-q-d5",
      kind: "question",
      title: "La casilla clave",
      prompt: "¿Qué casilla controla 1.c4 y será el centro de la lucha en la Inglesa?",
      themes: ["centro", "inglesa"],
      choices: [
        { id: "d5", text: "d5", correct: true, feedback: "Correcto: c4, Cc3 y el alfil de g2 apuntan a d5." },
        { id: "e4", text: "e4", correct: false, feedback: "1.c4 no controla e4." },
        { id: "b5", text: "b5", correct: false, feedback: "c4 controla b5 y d5, pero la casilla central decisiva es d5." },
      ],
    },
  ],
};

export const reti: Opening = {
  slug: "apertura-reti",
  name: "Apertura Réti",
  eco: "A04–A09",
  families: ["flanco", "hipermoderna"],
  groups: ["sistema-blancas"],
  side: "blancas",
  level: "intermedio",
  summary:
    "1.Cf3 y 2.c4: las blancas presionan el centro desde los flancos sin ocuparlo con peones, al estilo hipermoderno.",
  mainLine: {
    id: "principal",
    name: "Réti con ...e6",
    eco: "A13–A14",
    kind: "principal",
    description: "Las negras mantienen d5 con ...e6; las blancas hacen fianchetto y presionan d5.",
    moves: [
      m("Nf3", "Flexible: controla e5 y d4 sin comprometer peones."),
      m("d5"),
      m("c4", "Ataca d5 desde el flanco.", [{ from: "c4", to: "d5", tone: "threat" }]),
      m("e6", "Defiende d5."),
      m("g3"),
      m("Nf6"),
      m("Bg2", "El alfil presiona la gran diagonal."),
      m("Be7"),
      m("O-O"),
      m("O-O"),
    ],
  },
  ideas: [
    "Hipermodernismo: controlar el centro con piezas y peones de flanco.",
    "Las blancas pueden transponer a la Catalana, la Inglesa o sistemas de doble fianchetto.",
    "Si las negras avanzan ...d4, las blancas atacan esa cabeza de peón con e3 y b4.",
  ],
  goals: { white: ["Presionar d5.", "Mantener la flexibilidad."], black: ["Mantener d5 o cambiarlo en buenas condiciones.", "Desarrollo armónico."] },
  structures: [{ name: "Doble fianchetto", description: "Alfiles en g2 y b2 apuntando al centro." }],
  plans: { white: ["b3 y Ab2 (doble fianchetto).", "cxd5 y presión en la columna c."], black: ["...c6 o ...e6 para reforzar d5.", "...d4 para ganar espacio."] },
  squares: { strong: ["e5 y d4"], weak: ["d5 bajo presión"], note: "Los alfiles en fianchetto apuntan a las casillas centrales sin ocuparlas." },
  development: ["Blancas: Cf3, c4, g3, Ag2, enroque, b3/Ab2.", "Negras: ...d5, ...e6 o ...c6, ...Cf6, ...Ae7/...Ad6."],
  traps: [],
  mistakes: [{ text: "Con blancas, quedarse sin ruptura central: el control a distancia necesita, tarde o temprano, d4 o e4." }],
  modelGames: [
    {
      white: "Richard Réti",
      black: "José Raúl Capablanca",
      event: "Torneo de Nueva York",
      year: 1924,
      note: "Réti ganó con su apertura y cortó una larga racha de Capablanca sin perder: referencia del planteamiento hipermoderno.",
    },
  ],
  variations: [
    { id: "avance", name: "Réti con 2...d4", eco: "A09", kind: "secundaria", description: "Las negras ganan espacio; las blancas atacan la cabeza de peón con e3 y b4.", moves: plain("Nf3 d5 c4 d4 e3") },
    { id: "aceptada", name: "Réti aceptada", eco: "A09", kind: "secundaria", description: "2...dxc4: las blancas recuperan el peón con Da4+ o e3.", moves: plain("Nf3 d5 c4 dxc4 e3") },
    { id: "eslava", name: "Réti con 2...c6", eco: "A11", kind: "secundaria", description: "Estructura eslava contra el planteamiento de Réti.", moves: plain("Nf3 d5 c4 c6 g3 Nf6 Bg2") },
  ],
  critical: [
    { id: "d4", title: "Tras 2...d4", moves: ["Nf3", "d5", "c4", "d4"], explanation: "El peón de d4 gana espacio pero es un objetivo: e3, b4 y g3–Ag2 lo presionan." },
  ],
  exercises: [
    {
      id: "reti-q-hiper",
      kind: "question",
      title: "Filosofía hipermoderna",
      prompt: "¿Qué caracteriza el planteamiento de la Réti?",
      themes: ["centro", "reti"],
      choices: [
        { id: "flanco", text: "Controlar el centro con piezas y peones de flanco en lugar de ocuparlo de inmediato", correct: true, feedback: "Correcto: es la idea central de la escuela hipermoderna." },
        { id: "gambito", text: "Sacrificar material para atacar rápido", correct: false, feedback: "La Réti no es un gambito; es un sistema posicional." },
        { id: "simetria", text: "Copiar las jugadas del rival", correct: false, feedback: "No tiene que ver con la simetría." },
      ],
    },
  ],
};

export const D4_AND_FLANK_OPENINGS: Opening[] = [gambitoDama, catalana, nimzoindia, indiaDeRey, grunfeld, inglesa, reti];
