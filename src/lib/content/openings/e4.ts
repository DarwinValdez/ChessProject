/*
 * 1.e4 openings. Lines are standard theory; ECO codes are given only where
 * the classification is well established. Traps and "frequent mistake"
 * claims were checked with Stockfish 19 (depth 22) on 2026-10-22.
 * Explanations are original.
 */
import { fenAfter, m, plain } from "./helpers";
import type { Opening } from "./types";

export const espanola: Opening = {
  slug: "apertura-espanola",
  name: "Apertura Española",
  aliases: ["Ruy López"],
  eco: "C60–C99",
  families: ["abierta"],
  groups: ["sistema-blancas"],
  side: "blancas",
  level: "intermedio",
  summary:
    "3.Ab5 presiona al caballo que defiende e5. Las blancas buscan una presión central duradera más que un ataque inmediato; es una de las aperturas más profundas de la teoría.",
  mainLine: {
    id: "cerrada",
    name: "Española Cerrada",
    eco: "C84–C99",
    kind: "principal",
    description: "La línea más jugada: las negras mantienen el peón de e5 y desarrollan con ...Ae7, ...b5 y ...d6.",
    moves: [
      m("e4", "Ocupa el centro y abre diagonales para la dama y el alfil de f1."),
      m("e5", "Las negras disputan el centro en igualdad de condiciones."),
      m("Nf3", "Desarrolla atacando e5.", [{ from: "f3", to: "e5", tone: "threat" }]),
      m("Nc6", "Defiende e5 desarrollando."),
      m("Bb5", "Ataca al defensor de e5. No amenaza aún ganar el peón: tras Axc6 dxc6 Cxe5, ...Dd4 lo recupera.", [
        { from: "b5", to: "c6", tone: "idea" },
      ]),
      m("a6", "Defensa Morphy: pregunta al alfil de inmediato."),
      m("Ba4", "Mantiene la presión sobre c6 sin ceder la pareja de alfiles."),
      m("Nf6", "Contraataca e4."),
      m("O-O", "Las blancas no defienden e4 directamente: si 5...Cxe4, 6.d4 (Española Abierta) recupera la iniciativa."),
      m("Be7", "Desarrollo sólido; caracteriza la Española Cerrada."),
      m("Re1", "Defiende e4 y, por eso, ahora sí amenaza Axc6 y Cxe5.", [{ from: "a4", to: "c6", tone: "threat" }]),
      m("b5", "Necesaria: aparta el alfil antes de que se cumpla la amenaza."),
      m("Bb3", "El alfil sigue apuntando a f7 desde b3.", [{ from: "b3", to: "f7", tone: "idea" }]),
      m("d6", "Refuerza e5 y abre la diagonal del alfil de c8."),
      m("c3", "Prepara d4 y deja la casilla c2 como refugio del alfil."),
      m("O-O"),
      m("h3", "Impide ...Ag4, que clavaría el caballo de f3 y presionaría d4. Desde aquí nacen las variantes Chigorin (9...Ca5), Breyer (9...Cb8) y Zaitsev (9...Ab7)."),
    ],
  },
  ideas: [
    "La presión sobre e5 es indirecta: el alfil de b5 ataca al caballo que lo defiende.",
    "Las blancas preparan c3 y d4 para construir un centro de peones sólido.",
    "El alfil blanco de casillas claras suele acabar en b3 o c2, apuntando al flanco de rey negro.",
    "Las negras ganan espacio en el flanco de dama con ...a6 y ...b5 a cambio de crear algunas debilidades.",
  ],
  goals: {
    white: ["Establecer peones en e4 y d4 con c3 como apoyo.", "Mantener la tensión central el mayor tiempo posible."],
    black: ["Conservar el punto fuerte de e5.", "Contrajugar en el flanco de dama (...Ca5, ...c5) o en el centro (...d5 en el Ataque Marshall)."],
  },
  structures: [
    { name: "Centro cerrado (d4–d5)", description: "Si las blancas juegan d5, el centro se bloquea: las blancas atacan en el flanco de rey y las negras con ...c5-c4 o ...f5." },
    { name: "Centro con tensión", description: "Peones blancos en e4/d4 frente a e5/d6. Quien cambie primero en el centro suele ceder iniciativa." },
  ],
  plans: {
    white: [
      "Maniobra típica del caballo: Cbd2–f1–g3 (o e3) para reforzar el flanco de rey y la casilla f5.",
      "Avanzar d4 cuando el desarrollo esté completo; con d5 cerrar el centro y atacar en el flanco de rey.",
      "a4 para cuestionar la cadena de peones negra del flanco de dama.",
    ],
    black: [
      "...Ca5 y ...c5 para ganar espacio en el flanco de dama y eliminar el alfil de b3.",
      "...Te8 y ...Af8 para reforzar e5 y reagrupar.",
      "En momentos concretos, la ruptura ...d5 libera el juego negro.",
    ],
  },
  squares: {
    strong: ["f5 (para un caballo blanco)", "d5", "e5 (punto de apoyo negro)"],
    weak: ["f7 (bajo el alfil de b3)", "c6 y b6 tras ...a6/...b5"],
    note: "Las casillas importan en relación con la estructura: f5 es fuerte para las blancas porque las negras rara vez pueden controlarla con peones sin debilitarse.",
  },
  development: [
    "Blancas: Cf3, Ab5–a4–b3, enroque, Te1, c3, h3, Cbd2–f1–g3.",
    "Negras: Cc6, Cf6, Ae7, ...b5, ...d6, enroque y, según la variante, ...Ca5, ...Ab7 o ...Cb8–d7.",
  ],
  traps: [
    {
      id: "arca-de-noe",
      name: "El Arca de Noé",
      moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "d6", "d4", "b5", "Bb3", "Nxd4", "Nxd4", "exd4", "Qxd4"],
      victim: "blancas",
      punishment: [
        m("c5", "¡El alfil de b3 se queda sin casillas! La amenaza es ...c4."),
        m("Qc3"),
        m("c4", "El alfil está atrapado: las blancas solo pueden obtener dos peones por él."),
      ],
      explanation:
        "Tras 8.Dxd4?? la dama blanca recupera el peón, pero la cadena a6-b5 y el avance ...c5-c4 encierran al alfil de b3. Stockfish valora la posición tras 8...c5 con clara ventaja negra (≈ +4,3). En lugar de 8.Dxd4??, las blancas mantienen la igualdad con 8.a4 o 8.c3 (Stockfish ≈ 0,00).",
      verification: "stockfish",
    },
  ],
  mistakes: [
    {
      text: "Enrocar antes de ...b5 cuando ya hay torre en e1: 6...O-O? permite 7.Axc6 dxc6 8.Cxe5, porque e4 está protegido por la torre. Las blancas ganan un peón limpio (Stockfish ≈ +1,4).",
      moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "Be7", "Re1", "O-O", "Bxc6", "dxc6", "Nxe5"],
    },
    {
      text: "Creer que el peón de e5 está colgado demasiado pronto: 3...a6 4.Axc6 dxc6 5.Cxe5? Dd4! ataca caballo y peón de e4 y las negras recuperan el material con buen juego.",
      moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Bxc6", "dxc6", "Nxe5", "Qd4"],
    },
  ],
  modelGames: [
    {
      white: "Garry Kasparov",
      black: "Vladímir Krámnik",
      event: "Campeonato del Mundo, Londres",
      year: 2000,
      note: "Krámnik empleó la Defensa Berlinesa con negras en el match y la convirtió en una referencia de solidez.",
    },
  ],
  variations: [
    {
      id: "berlinesa",
      name: "Defensa Berlinesa",
      eco: "C65–C67",
      kind: "secundaria",
      description:
        "3...Cf6 y, tras 4.O-O Cxe4 5.d4, el llamado final berlinés: las negras pierden el enroque y quedan con peones doblados, pero con pareja de alfiles y una posición muy sólida.",
      moves: plain("e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8"),
    },
    {
      id: "cambio",
      name: "Variante del Cambio",
      eco: "C68–C69",
      kind: "secundaria",
      description:
        "Las blancas ceden la pareja de alfiles para doblar los peones negros. En el final, su mayoría de peones en el flanco de rey puede crear un peón pasado, mientras que la mayoría negra del otro flanco está lastrada por los peones doblados.",
      moves: plain("e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O"),
    },
    {
      id: "abierta",
      name: "Española Abierta",
      eco: "C80–C83",
      kind: "secundaria",
      description: "5...Cxe4: las negras aceptan el peón a cambio de un juego activo de piezas; las blancas obtienen espacio con d4-d5 o e5.",
      moves: plain("e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6"),
    },
    {
      id: "marshall",
      name: "Ataque Marshall",
      eco: "C89",
      kind: "secundaria",
      gambit: true,
      description:
        "Gambito: las negras entregan el peón de e5 a cambio de un ataque contra el enroque blanco. Muchos jugadores de blancas lo evitan con 8.a4 o 8.h3.",
      moves: plain("e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5 exd5 Nxd5 Nxe5 Nxe5 Rxe5 c6"),
    },
  ],
  critical: [
    {
      id: "tras-te1",
      title: "Tras 6.Te1: ¿qué amenazan las blancas?",
      moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "Be7", "Re1"],
      explanation: "e4 ya está defendido, así que Axc6 seguido de Cxe5 gana un peón. Por eso 6...b5 (o 6...d6) es necesario.",
    },
    {
      id: "tras-h3",
      title: "Posición tabular de la Cerrada (9.h3)",
      moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "Be7", "Re1", "b5", "Bb3", "d6", "c3", "O-O", "h3"],
      explanation: "Las negras eligen plan: Chigorin (...Ca5 y ...c5), Breyer (...Cb8-d7) o Zaitsev (...Ab7 y ...Te8).",
    },
  ],
  exercises: [
    {
      id: "espanola-q-te1",
      kind: "question",
      title: "La amenaza de 6.Te1",
      fen: fenAfter("e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1"),
      prompt: "Juegan las negras. ¿Por qué 6.Te1 amenaza ganar un peón y antes no?",
      themes: ["centro", "espanola"],
      choices: [
        { id: "e4", text: "Porque ahora e4 está protegido, así que Axc6 y Cxe5 ya no permite recuperar el peón con ...Cxe4", correct: true, feedback: "Exacto. Por eso las negras juegan 6...b5." },
        { id: "f7", text: "Porque la torre ataca f7", correct: false, feedback: "La torre de e1 actúa por la columna e, no sobre f7." },
        { id: "mate", text: "Porque amenaza mate en la columna e", correct: false, feedback: "No hay amenaza de mate: el rey negro está cubierto por el alfil de e7." },
      ],
    },
    {
      id: "espanola-arca",
      kind: "exercise",
      title: "Castiga 8.Dxd4??",
      fen: fenAfter("e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 Qxd4"),
      prompt: "Juegan las negras. La dama blanca acaba de recuperar el peón. ¿Cómo ganas material?",
      themes: ["trampa", "pieza-atrapada"],
      difficulty: 3,
      solution: { options: [{ san: "c5" }] },
      hints: ["Fíjate en el alfil de b3: ¿qué casillas le quedan?", "Un peón con tempo sobre la dama, y luego otro avance."],
      explanation: "8...c5! gana tiempo sobre la dama y prepara ...c4: el alfil de b3 queda atrapado (el Arca de Noé). Stockfish ≈ +4,3 para las negras.",
      refutations: { Nf6: "8...Cf6 es desarrollo normal, pero deja escapar la ocasión de atrapar el alfil." },
      verification: "stockfish",
    },
  ],
};

export const italiana: Opening = {
  slug: "apertura-italiana",
  name: "Apertura Italiana",
  aliases: ["Giuoco Piano", "Giuoco Pianissimo"],
  eco: "C50–C54",
  families: ["abierta"],
  groups: ["sistema-blancas"],
  side: "blancas",
  level: "principiante",
  summary:
    "3.Ac4 apunta a f7 y desarrolla rápido. La versión moderna con c3 y d3 es un juego de maniobras; la clásica con d4 abre el centro.",
  mainLine: {
    id: "pianissimo",
    name: "Giuoco Pianissimo (c3 y d3)",
    eco: "C54",
    kind: "principal",
    description: "El planteamiento moderno: las blancas preparan d4 sin prisa y maniobran como en la Española.",
    moves: [
      m("e4"),
      m("e5"),
      m("Nf3"),
      m("Nc6"),
      m("Bc4", "El alfil apunta a f7, el punto más débil del campo negro.", [{ from: "c4", to: "f7", tone: "idea" }]),
      m("Bc5", "Simetría: el alfil negro mira a f2."),
      m("c3", "Prepara d4 y quita la casilla d4 al caballo negro."),
      m("Nf6", "Desarrollo con presión sobre e4."),
      m("d3", "Defiende e4 sin abrir el centro todavía: juego lento de maniobras."),
      m("d6"),
      m("O-O"),
      m("O-O"),
      m("Re1", "Prepara Cbd2–f1–g3, como en la Española."),
      m("a6", "Deja la casilla a7 para el alfil."),
      m("Bb3", "Anticipa ...Ca5 o ...d5 con tempo sobre el alfil."),
      m("Ba7", "El alfil se esconde en a7: ya no se le puede atacar con d4 ni con Ca4."),
      m("h3", "Impide ...Ag4."),
    ],
  },
  ideas: [
    "El alfil de c4 y el caballo de f3 permiten un enroque rápido.",
    "La presión sobre f7 obliga a las negras a jugar con cuidado (ver la trampa de 5...Cxd5 en los Dos Caballos).",
    "Con c3 las blancas preparan d4 para obtener un centro de peones.",
  ],
  goals: {
    white: ["Desarrollo rápido y enroque.", "Preparar d4 en el momento adecuado."],
    black: ["Neutralizar la presión sobre f7.", "Igualar en el centro con ...d5 o ...d6 sólido."],
  },
  structures: [
    { name: "Peones e4/d3 contra e5/d6", description: "Centro cerrado-flexible típico del Pianissimo: maniobras y ruptura d4 preparada." },
    { name: "Centro blanco e4+d4", description: "Tras 5.d4 exd4 6.cxd4, las blancas tienen dos peones centrales; las negras lo atacan con ...d5." },
  ],
  plans: {
    white: ["Cbd2–f1–g3 y Ae3 o Ag5.", "d4 cuando esté bien preparado.", "Juego en el flanco de dama con b4 y a4."],
    black: ["...Ae6 para cambiar el alfil de b3/c4.", "...Ce7–g6 hacia el flanco de rey.", "Ruptura ...d5 cuando sea posible."],
  },
  squares: {
    strong: ["d5 y f5 para caballos", "d4 (casilla de ruptura blanca)"],
    weak: ["f7 y f2", "d4 cuando las blancas no han jugado c3"],
    note: "En el Pianissimo los dos bandos tienen estructuras casi simétricas: la lucha gira en torno al control de d4 y d5.",
  },
  development: ["Blancas: Cf3, Ac4, c3, d3, enroque, Te1, Cbd2–f1–g3.", "Negras: Cc6, Ac5, Cf6, d6, enroque, ...a6/...Aa7."],
  traps: [
    {
      id: "fried-liver",
      name: "Dos Caballos: 5...Cxd5?! y el Ataque Fegatello",
      moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Ng5", "d5", "exd5", "Nxd5"],
      victim: "negras",
      punishment: [
        m("Nxf7", "Sacrificio en f7: el rey negro tiene que salir al centro."),
        m("Kxf7"),
        m("Qf3+", "Jaque doble sobre rey y caballo de d5."),
        m("Ke6", "El rey defiende el caballo, pero queda muy expuesto."),
        m("Nc3", "Más presión sobre d5."),
      ],
      explanation:
        "No es una victoria forzada: Stockfish valora la posición con ventaja blanca (≈ +1) y, en la práctica, la defensa negra es muy difícil. 6.d4 es igual de recomendable. La respuesta principal de las negras es 5...Ca5.",
      verification: "stockfish",
    },
  ],
  mistakes: [
    {
      text: "Jugar d4 sin preparación (sin c3) y perder el centro tras ...exd4.",
    },
    {
      text: "Con negras, ignorar la presión sobre f7 en la Defensa de los Dos Caballos: 5...Cxd5?! es la trampa clásica.",
      moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Ng5", "d5", "exd5", "Nxd5"],
    },
  ],
  modelGames: [
    {
      white: "Adolf Anderssen",
      black: "Jean Dufresne",
      event: "Partida amistosa, Berlín",
      year: 1852,
      note: "La «Siempreviva», con el Gambito Evans: ejemplo clásico de ataque basado en desarrollo.",
    },
  ],
  variations: [
    {
      id: "giuoco-d4",
      name: "Giuoco Piano con 5.d4",
      eco: "C54",
      kind: "secundaria",
      description: "El plan clásico: 4.c3 y 5.d4 para un centro e4+d4. Las negras responden con ...Ab4+ y la ruptura ...d5.",
      moves: plain("e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2 d5"),
    },
    {
      id: "evans",
      name: "Gambito Evans",
      eco: "C51–C52",
      kind: "secundaria",
      gambit: true,
      description: "4.b4: las blancas dan un peón para ganar tiempo con c3 y d4 contra el alfil de c5.",
      moves: plain("e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4"),
    },
    {
      id: "dos-caballos",
      name: "Defensa de los Dos Caballos (4.Cg5)",
      eco: "C57–C59",
      kind: "secundaria",
      gambit: true,
      description: "3...Cf6 contraataca e4. Tras 4.Cg5 d5 5.exd5 Ca5 las negras dan un peón por desarrollo.",
      moves: plain("e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5"),
    },
    {
      id: "hungara",
      name: "Defensa Húngara",
      eco: "C50",
      kind: "secundaria",
      description: "3...Ae7: sólida y algo pasiva. Las negras renuncian a la actividad del alfil a cambio de evitar complicaciones.",
      moves: plain("e4 e5 Nf3 Nc6 Bc4 Be7 d4 d6"),
    },
  ],
  critical: [
    {
      id: "tras-c3",
      title: "Tras 4.c3: la decisión de las blancas",
      moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6"],
      explanation: "5.d4 abre el juego (centro e4+d4 frente a la ruptura ...d5); 5.d3 lleva a una lucha de maniobras.",
    },
  ],
  exercises: [
    {
      id: "italiana-q-a7",
      kind: "question",
      title: "El retiro ...Aa7",
      fen: fenAfter("e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O Re1 a6 Bb3 Ba7"),
      prompt: "¿Por qué las negras llevan el alfil a a7 en el Pianissimo?",
      themes: ["desarrollo", "italiana"],
      choices: [
        { id: "seguro", text: "Para que no pueda ser atacado con tempo por d4 o Ca4 y siga mirando a f2", correct: true, feedback: "Correcto: en a7 el alfil está a salvo y conserva la diagonal hacia f2." },
        { id: "torre", text: "Para conectar las torres", correct: false, feedback: "Las torres se conectan moviendo la dama y las piezas menores de la primera fila; el alfil ya no estaba en ella." },
        { id: "b5", text: "Para preparar ...b5", correct: false, feedback: "...b5 no necesita el alfil en a7; la razón es la seguridad del alfil." },
      ],
    },
  ],
  relatedLessons: ["apertura-italiana-ideas/giuoco-piano-c3-d4", "apertura-italiana-ideas/dos-caballos-cg5"],
};

export const siciliana: Opening = {
  slug: "defensa-siciliana",
  name: "Defensa Siciliana",
  eco: "B20–B99",
  families: ["semiabierta"],
  groups: ["contra-e4"],
  side: "negras",
  level: "avanzado",
  summary:
    "1...c5 crea una posición asimétrica: las negras cambian un peón de flanco por uno central y obtienen la columna c semiabierta. Ambiciosa, muy teórica y con juego para ganar.",
  mainLine: {
    id: "najdorf",
    name: "Variante Najdorf",
    eco: "B90–B99",
    kind: "principal",
    description: "La Siciliana abierta más popular: 5...a6 es una jugada flexible que prepara ...e5 o ...e6 y ...b5.",
    moves: [
      m("e4"),
      m("c5", "Controla d4 desde un flanco y desequilibra la posición."),
      m("Nf3", "Prepara d4."),
      m("d6", "Prepara ...Cf6 sin permitir e5 con tempo."),
      m("d4", "Las blancas abren el centro para aprovechar su ventaja de desarrollo."),
      m("cxd4", "Cambio clave: las negras tendrán dos peones centrales (d y e) contra uno."),
      m("Nxd4"),
      m("Nf6", "Ataca e4 y obliga a Cc3."),
      m("Nc3"),
      m("a6", "Najdorf: controla b5 (impide Cb5 y Ab5+) y prepara ...b5 o ...e5.", [{ from: "a6", to: "b5", tone: "idea" }]),
    ],
  },
  ideas: [
    "Asimetría: las blancas suelen atacar en el flanco de rey y las negras en el de dama por la columna c.",
    "Las negras tienen más peones centrales tras ...cxd4; las blancas, más desarrollo y espacio.",
    "La casilla d5 es estratégica: si las negras juegan ...e5, d5 se convierte en un agujero.",
  ],
  goals: {
    white: ["Aprovechar la ventaja de desarrollo con un ataque rápido.", "Controlar d5."],
    black: ["Presionar por la columna c.", "Romper con ...d5 o ...b5 en el momento justo."],
  },
  structures: [
    { name: "Scheveningen (e6+d6)", description: "Pequeño centro negro muy flexible; las blancas suelen atacar con g4-g5 o f4." },
    { name: "Boleslavsky (e5+d6)", description: "Tras ...e5 las negras ganan espacio pero dejan d5 débil: la lucha gira en torno a esa casilla." },
    { name: "Dragón (g6 y alfil en g7)", description: "El alfil de g7 actúa en la gran diagonal contra el flanco de dama blanco." },
  ],
  plans: {
    white: ["Enroque largo y avance de peones del flanco de rey (f3, g4, h4).", "Control de d5 con Cc3, Ag5xf6 o Cd5."],
    black: ["...b5-b4 para expulsar al caballo de c3.", "Presión en c3 y sacrificios de calidad típicos en c3.", "Ruptura ...d5."],
  },
  squares: {
    strong: ["d5 (para las blancas si las negras juegan ...e5)", "c4 y b3 para piezas negras en el ataque de flanco"],
    weak: ["d6 (peón retrasado tras ...e5)", "d5"],
    note: "Si las negras juegan ...e5, ganan control de d4 y f4 pero ceden para siempre d5.",
  },
  development: [
    "Blancas: Cf3, d4, Cxd4, Cc3 y luego Ae3/Ag5, f3, Dd2 y enroque largo según la variante.",
    "Negras: ...d6/...e6 o ...Cc6, ...Cf6, ...a6, ...e6 o ...e5, ...Ae7 y enroque corto.",
  ],
  traps: [
    {
      id: "siberiana",
      name: "La trampa siberiana (Gambito Smith-Morra)",
      moves: ["e4", "c5", "d4", "cxd4", "c3", "dxc3", "Nxc3", "Nc6", "Nf3", "e6", "Bc4", "Qc7", "O-O", "Nf6", "Qe2", "Ng4", "h3"],
      victim: "blancas",
      punishment: [
        m("Nd4", "Ataca la dama y amenaza ...Dh2#: la dama de c7 y el caballo de g4 apuntan a h2.", [
          { from: "c7", to: "h2", tone: "threat" },
          { from: "d4", to: "e2", tone: "threat" },
        ]),
        m("hxg4"),
        m("Nxe2+", "Las negras ganan la dama por un caballo."),
        m("Bxe2"),
      ],
      explanation:
        "9.h3?? quiere echar al caballo, pero 9...Cd4! crea dos amenazas a la vez: ...Cxe2+ y ...Dh2#. Stockfish ≈ +5,3 para las negras.",
      verification: "stockfish",
    },
  ],
  mistakes: [
    { text: "Con negras, jugar ...e5 sin poder controlar d5: el caballo blanco se instala en d5 y el peón de d6 queda débil." },
    { text: "Con blancas, enrocar largo y atacar sin vigilar la columna c ni la diagonal del alfil negro de g7 (en el Dragón)." },
  ],
  modelGames: [],
  variations: [
    { id: "dragon", name: "Variante del Dragón", eco: "B70–B79", kind: "secundaria", description: "5...g6: el alfil en g7 apunta al flanco de dama. Contra el Ataque Yugoslavo se producen ataques mutuos a enroques opuestos.", moves: plain("e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6") },
    { id: "scheveningen", name: "Variante Scheveningen", eco: "B80–B89", kind: "secundaria", description: "5...e6: centro pequeño y flexible (d6+e6).", moves: plain("e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 e6") },
    { id: "sveshnikov", name: "Variante Sveshnikov", eco: "B33", kind: "secundaria", description: "5...e5: las negras aceptan el agujero de d5 a cambio de actividad y tiempo.", moves: plain("e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6") },
    { id: "alapin", name: "Variante Alapin", eco: "B22", kind: "secundaria", description: "2.c3: las blancas preparan d4 para recapturar con peón y evitar la Siciliana abierta.", moves: plain("e4 c5 c3 Nf6 e5 Nd5 d4 cxd4 Nf3") },
    { id: "morra", name: "Gambito Smith-Morra", eco: "B21", kind: "secundaria", gambit: true, description: "2.d4 cxd4 3.c3: un peón a cambio de desarrollo rápido y columnas abiertas.", moves: plain("e4 c5 d4 cxd4 c3 dxc3 Nxc3") },
  ],
  critical: [
    {
      id: "najdorf-tabla",
      title: "Posición de la Najdorf (5...a6)",
      moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"],
      explanation: "Las blancas eligen sistema: 6.Ae3 (Ataque Inglés), 6.Ag5, 6.Ae2 o 6.h3. Cada uno lleva a planes muy diferentes.",
    },
  ],
  exercises: [
    {
      id: "siciliana-q-cxd4",
      kind: "question",
      title: "El sentido de ...cxd4",
      prompt: "En la Siciliana abierta, ¿qué ganan las negras con 3...cxd4?",
      themes: ["centro", "siciliana"],
      choices: [
        { id: "centro", text: "Una mayoría de peones centrales y la columna c semiabierta", correct: true, feedback: "Correcto: cambian un peón de flanco (c) por uno central (d) de las blancas." },
        { id: "material", text: "Un peón de ventaja", correct: false, feedback: "El material está igualado: las blancas recuperan con Cxd4." },
        { id: "desarrollo", text: "Ventaja de desarrollo", correct: false, feedback: "Al contrario: las blancas suelen ir por delante en desarrollo." },
      ],
    },
    {
      id: "siciliana-siberiana",
      kind: "exercise",
      title: "Castiga 9.h3??",
      fen: fenAfter("e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 e6 Bc4 Qc7 O-O Nf6 Qe2 Ng4 h3"),
      prompt: "Juegan las negras. Las blancas atacan tu caballo de g4. ¿Qué jugada gana?",
      themes: ["trampa", "ataque-doble"],
      difficulty: 3,
      solution: { options: [{ san: "Nd4" }] },
      hints: ["Tu dama de c7 y el caballo de g4 apuntan a la misma casilla.", "Busca una jugada que ataque la dama y deje en pie la amenaza de mate."],
      explanation: "9...Cd4! ataca la dama y mantiene la amenaza ...Dh2#. Tras 10.hxg4 Cxe2+ las negras ganan dama por caballo (Stockfish ≈ +5,3).",
      refutations: { Nge5: "9...Cge5 salva el caballo, pero pierde la ocasión: tras 9...Cd4! las blancas pierden la dama." },
      verification: "stockfish",
    },
  ],
};

export const francesa: Opening = {
  slug: "defensa-francesa",
  name: "Defensa Francesa",
  eco: "C00–C19",
  families: ["semiabierta"],
  groups: ["contra-e4"],
  side: "negras",
  level: "intermedio",
  summary:
    "1...e6 y 2...d5: las negras atacan el centro blanco desde una posición sólida. A cambio, el alfil de c8 queda encerrado detrás de la cadena e6-d5.",
  mainLine: {
    id: "winawer",
    name: "Variante Winawer",
    eco: "C15–C19",
    kind: "principal",
    description: "3...Ab4 clava el caballo de c3. Tras 4.e5 c5 5.a3 Axc3+ 6.bxc3 las blancas tienen la pareja de alfiles y peones doblados.",
    moves: [
      m("e4"),
      m("e6", "Prepara ...d5 con apoyo."),
      m("d4"),
      m("d5", "Ataca e4 inmediatamente."),
      m("Nc3", "Defiende e4."),
      m("Bb4", "Winawer: clava el caballo y vuelve a presionar e4.", [{ from: "b4", to: "c3", tone: "threat" }]),
      m("e5", "Las blancas cierran el centro y ganan espacio en el flanco de rey."),
      m("c5", "Ataca la base de la cadena blanca (d4)."),
      m("a3", "Obliga a decidir al alfil."),
      m("Bxc3+", "Las negras ceden la pareja de alfiles para doblar los peones blancos."),
      m("bxc3"),
      m("Ne7", "El caballo va a f5 o c6; evita Cf6, que sería expulsado por e5."),
    ],
  },
  ideas: [
    "Las cadenas de peones se atacan por la base: las negras golpean d4 con ...c5 y a veces e5 con ...f6.",
    "El alfil de c8 es la pieza problemática de las negras: hay que activarlo (...b6 y ...Aa6) o cambiarlo.",
    "Las blancas suelen tener espacio en el flanco de rey y atacan allí.",
  ],
  goals: {
    white: ["Mantener el peón de e5 y ganar espacio.", "Atacar en el flanco de rey (Dg4 en la Winawer)."],
    black: ["Presionar d4 con ...c5, ...Cc6 y ...Db6.", "Contrajuego en el flanco de dama o ruptura ...f6."],
  },
  structures: [
    { name: "Cadena e5-d4 contra e6-d5", description: "Típica de la Avance y la Winawer: cada bando ataca la base de la cadena rival." },
    { name: "Peón aislado en d5", description: "Frecuente en la Tarrasch con 3...c5: juego activo de piezas a cambio de una debilidad estática." },
  ],
  plans: {
    white: ["Dg4 contra g7 (Winawer).", "Cf3, Ad3 y ataque en el flanco de rey.", "Mantener e5 con f4 si es necesario."],
    black: ["...c5, ...Cc6, ...Db6 contra d4.", "...f6 para abrir la columna f.", "...b6 y ...Aa6 para cambiar el alfil malo."],
  },
  squares: {
    strong: ["f5 y d5 para piezas negras", "e5 y f6 en manos blancas"],
    weak: ["e6 tras ...f6", "las casillas negras del flanco de rey negro en la Winawer"],
    note: "Al cambiar su alfil de b4, las negras se debilitan en las casillas oscuras: las blancas pueden aprovecharlo con Ag5/Ad6 o Dg4.",
  },
  development: ["Blancas: Cc3/Cd2, e5 según la variante, Cf3, Ad3.", "Negras: ...c5, ...Cc6, ...Ce7 o ...Cf6, ...Db6, ...Ad7."],
  traps: [],
  mistakes: [
    { text: "Dejar el alfil de c8 encerrado toda la partida: sin un plan para activarlo, las negras juegan con una pieza menos." },
    { text: "Con blancas, defender e5 y d4 pasivamente: sin ataque en el flanco de rey, las negras derriban el centro con ...c5 y ...f6." },
  ],
  modelGames: [],
  variations: [
    { id: "avance", name: "Variante del Avance", eco: "C02", kind: "secundaria", description: "3.e5: espacio inmediato; las negras presionan d4 con ...c5, ...Cc6 y ...Db6.", moves: plain("e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6") },
    { id: "tarrasch", name: "Variante Tarrasch", eco: "C03–C09", kind: "secundaria", description: "3.Cd2: evita la clavada ...Ab4. Con 3...c5 las negras suelen quedarse con un peón aislado activo.", moves: plain("e4 e6 d4 d5 Nd2 c5") },
    { id: "clasica", name: "Variante Clásica", eco: "C11–C14", kind: "secundaria", description: "3...Cf6 4.Ag5: presión sobre el caballo defensor de d5.", moves: plain("e4 e6 d4 d5 Nc3 Nf6 Bg5") },
    { id: "rubinstein", name: "Variante Rubinstein", eco: "C10", kind: "secundaria", description: "3...dxe4: las negras ceden el centro para liberar su juego; sólida pero algo pasiva.", moves: plain("e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7") },
    { id: "cambio", name: "Variante del Cambio", eco: "C01", kind: "secundaria", description: "3.exd5 exd5: estructura simétrica que libera el alfil de c8.", moves: plain("e4 e6 d4 d5 exd5 exd5") },
  ],
  critical: [
    {
      id: "winawer-6",
      title: "Winawer tras 6.bxc3",
      moves: ["e4", "e6", "d4", "d5", "Nc3", "Bb4", "e5", "c5", "a3", "Bxc3+", "bxc3"],
      explanation: "Las blancas tienen la pareja de alfiles y peones doblados; las negras, una estructura mejor y presión sobre c3 y d4.",
    },
  ],
  exercises: [
    {
      id: "francesa-q-alfil",
      kind: "question",
      title: "El alfil de c8",
      prompt: "¿Por qué el alfil de c8 se considera el problema de la Francesa?",
      themes: ["pieza-mala", "francesa"],
      choices: [
        { id: "cadena", text: "Porque los peones e6 y d5 están en casillas claras y le cierran el paso", correct: true, feedback: "Correcto: es un alfil malo hasta que se active con ...b6/...Aa6 o se abra la posición." },
        { id: "clavado", text: "Porque está clavado", correct: false, feedback: "No hay ninguna clavada sobre el alfil de c8." },
        { id: "atacado", text: "Porque las blancas lo atacan de inmediato", correct: false, feedback: "El problema no es táctico sino estructural." },
      ],
    },
    {
      id: "francesa-q-c5",
      kind: "question",
      title: "La ruptura ...c5",
      fen: fenAfter("e4 e6 d4 d5 e5"),
      prompt: "Las blancas han jugado 3.e5. ¿Cuál es la ruptura típica de las negras?",
      themes: ["rupturas", "francesa"],
      choices: [
        { id: "c5", text: "3...c5, atacando la base de la cadena (d4)", correct: true, feedback: "Exacto: una cadena de peones se ataca por la base." },
        { id: "f5", text: "3...f5, atacando e5 directamente", correct: false, feedback: "...f5 bloquea en lugar de atacar; además debilita e6. Lo típico es ...c5 y, más tarde, ...f6." },
        { id: "g5", text: "3...g5, para ganar espacio en el flanco de rey", correct: false, feedback: "Debilita el propio rey sin atacar la cadena blanca." },
      ],
    },
  ],
};

export const caroKann: Opening = {
  slug: "defensa-caro-kann",
  name: "Defensa Caro-Kann",
  eco: "B10–B19",
  families: ["semiabierta"],
  groups: ["contra-e4"],
  side: "negras",
  level: "intermedio",
  summary:
    "1...c6 y 2...d5: como la Francesa, ataca e4 con ...d5, pero sin encerrar el alfil de c8, que suele salir a f5 o g4 antes de ...e6.",
  mainLine: {
    id: "clasica",
    name: "Variante Clásica",
    eco: "B18–B19",
    kind: "principal",
    description: "4...Af5: el alfil sale antes de ...e6. Las blancas ganan espacio con h4-h5.",
    moves: [
      m("e4"),
      m("c6", "Prepara ...d5 sin cerrar la diagonal del alfil de c8."),
      m("d4"),
      m("d5"),
      m("Nc3"),
      m("dxe4", "Las negras ceden el centro a cambio de un desarrollo cómodo."),
      m("Nxe4"),
      m("Bf5", "El alfil sale fuera de la cadena de peones antes de jugar ...e6.", [{ from: "f5", to: "e4", tone: "threat" }]),
      m("Ng3", "Gana un tiempo sobre el alfil."),
      m("Bg6"),
      m("h4", "Amenaza h5 para atrapar o debilitar al alfil."),
      m("h6", "Prepara la retirada a h7."),
      m("Nf3"),
      m("Nd7", "Controla e5 y prepara ...Cgf6."),
      m("h5", "Gana espacio: el peón de h5 fija la estructura negra del flanco de rey."),
      m("Bh7"),
      m("Bd3", "Ofrece el cambio del alfil activo de las negras."),
      m("Bxd3"),
      m("Qxd3"),
    ],
  },
  ideas: [
    "Estructura muy sólida: las negras rara vez tienen debilidades graves.",
    "El alfil de casillas claras se desarrolla fuera de la cadena de peones.",
    "Las blancas obtienen espacio; las negras buscan rupturas ...c5 o ...e5 para igualar.",
  ],
  goals: {
    white: ["Aprovechar la ventaja de espacio.", "Atacar si las negras se enrocan en el flanco débil."],
    black: ["Desarrollo armónico y rupturas liberadoras (...c5, ...e5).", "Llegar a finales sólidos."],
  },
  structures: [
    { name: "Peón de d4 contra c6/e6", description: "Tras la Clásica, las blancas tienen más espacio; las negras, una estructura sin debilidades." },
    { name: "Peón aislado (Panov-Botvinnik)", description: "Tras 3.exd5 cxd5 4.c4 aparecen posiciones con peón aislado en d4 o cuatro contra tres." },
  ],
  plans: {
    white: ["h4-h5 para ganar espacio.", "Enroque largo y ataque en el centro o el flanco de rey."],
    black: ["...e6, ...Cgf6, ...Ae7/...Ad6 y enroque.", "Rupturas ...c5 o ...e5."],
  },
  squares: {
    strong: ["e5 para las blancas (a menudo ocupada por un caballo)", "d5 para las negras"],
    weak: ["g6 tras h5 (cuando el alfil ya no está)", "e6 si las negras juegan ...f5"],
    note: "Con el peón en h5, las blancas controlan g6: un caballo negro nunca podrá instalarse allí.",
  },
  development: ["Blancas: Cc3/Cd2, Cxe4, Cg3, Cf3, Ad3, Dxd3 y a menudo enroque largo.", "Negras: ...Af5–g6–h7, ...Cd7, ...Cgf6, ...e6, ...Ae7."],
  traps: [
    {
      id: "mate-d6",
      name: "Mate de 6.Cd6",
      moves: ["e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4", "Nd7", "Qe2", "Ngf6"],
      victim: "negras",
      punishment: [m("Nd6#", "El peón de e7 está clavado por la dama de e2 y el rey no tiene casillas: d7 está ocupada por su propio caballo.")],
      explanation:
        "5.De2 tiende una trampa: el desarrollo natural 5...Cgf6?? permite 6.Cd6 mate. Lo correcto es 5...Cdf6 o 5...e6.",
      verification: "stockfish",
    },
  ],
  mistakes: [
    { text: "Olvidar ...h6 en la Clásica: sin la casilla h7 para el alfil, el avance h4-h5 lo expulsa de g6 ganando tiempo. Con 6...h6 el alfil tiene su retirada preparada.", moves: ["e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4", "Bf5", "Ng3", "Bg6", "h4", "h6"] },
    { text: "Con negras, olvidar que el caballo de d7 quita la casilla de escape al rey (ver la trampa de 6.Cd6#)." },
  ],
  modelGames: [],
  variations: [
    { id: "avance", name: "Variante del Avance", eco: "B12", kind: "secundaria", description: "3.e5 Af5: las blancas ganan espacio; las negras sacan el alfil y presionan con ...c5.", moves: plain("e4 c6 d4 d5 e5 Bf5") },
    { id: "panov", name: "Ataque Panov-Botvinnik", eco: "B13–B14", kind: "secundaria", description: "3.exd5 cxd5 4.c4: posiciones abiertas, a menudo con peón aislado de dama.", moves: plain("e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3") },
    { id: "cambio", name: "Variante del Cambio", eco: "B13", kind: "secundaria", description: "3.exd5 cxd5 4.Ad3: estructura de Carlsbad invertida.", moves: plain("e4 c6 d4 d5 exd5 cxd5 Bd3 Nc6 c3") },
    { id: "karpov", name: "Variante Karpov", eco: "B17", kind: "secundaria", description: "4...Cd7: prepara ...Cgf6 sin permitir doblar peones con Cxf6+.", moves: plain("e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7") },
  ],
  critical: [
    {
      id: "clasica-h5",
      title: "Tras 8.h5: espacio blanco",
      moves: ["e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4", "Bf5", "Ng3", "Bg6", "h4", "h6", "Nf3", "Nd7", "h5", "Bh7"],
      explanation: "El peón de h5 fija el flanco de rey negro. Las blancas cambian el alfil de h7 con Ad3 y suelen enrocar largo.",
    },
  ],
  exercises: [
    {
      id: "caro-cd6",
      kind: "exercise",
      title: "Castiga 5...Cgf6??",
      fen: fenAfter("e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Qe2 Ngf6"),
      prompt: "Juegan las blancas y dan mate en una.",
      themes: ["trampa", "red-de-mate", "clavada"],
      difficulty: 2,
      solution: { options: [{ san: "Nd6#" }] },
      hints: ["¿Puede el peón de e7 capturar algo? Mira la columna e.", "El caballo de e4 tiene un salto con jaque."],
      explanation: "6.Cd6#: el peón de e7 está clavado por la dama y el rey no tiene casillas libres (d7 está ocupada por su caballo).",
      refutations: { "Nxf6+": "6.Cxf6+ cambia piezas y desperdicia el mate inmediato." },
      verification: "stockfish",
    },
    {
      id: "caro-q-alfil",
      kind: "question",
      title: "Diferencia con la Francesa",
      prompt: "¿Cuál es la principal ventaja de 1...c6 frente a 1...e6 como preparación de ...d5?",
      themes: ["desarrollo", "caro-kann"],
      choices: [
        { id: "alfil", text: "Que el alfil de c8 puede salir antes de cerrar la cadena con ...e6", correct: true, feedback: "Correcto: es la idea fundamental de la Caro-Kann." },
        { id: "rapido", text: "Que las negras se desarrollan más rápido", correct: false, feedback: "...c6 no desarrolla ninguna pieza; la ventaja es estructural (el alfil)." },
        { id: "ataque", text: "Que permite atacar el enroque blanco", correct: false, feedback: "La Caro-Kann es una defensa sólida, no un sistema de ataque." },
      ],
    },
  ],
};

export const E4_OPENINGS: Opening[] = [espanola, italiana, siciliana, francesa, caroKann];
