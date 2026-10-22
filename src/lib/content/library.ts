/**
 * Bibliography and teaching methods.
 *
 * Copyright policy: only bibliographic metadata and original descriptions
 * are stored here. No chapters, diagrams, solutions or quotations from
 * commercial books are reproduced. Links are catalogue searches (WorldCat,
 * Project Gutenberg), not deep links that could not be verified from the
 * build environment. Public-domain status is stated with its caveats.
 */
import type { Area, Level } from "./types";

export type ResourceStatus = "dominio-publico" | "referencia-externa";

export interface Author {
  id: string;
  name: string;
  /** One-line, factual description. */
  note: string;
}

export interface Book {
  id: string;
  authorId: string;
  title: string;
  /** Spanish title when a Spanish edition is commonly known. */
  spanishTitle?: string;
  firstPublished: number;
  publisher: string;
  areas: (Area | "fundamentos" | "calculo" | "estrategia")[];
  levels: Level[];
  concepts: string[];
  /** Ids ("course/lesson" or "aperturas/slug") of our own related material. */
  related: string[];
  status: ResourceStatus;
  statusNote: string;
  links: { label: string; href: string }[];
}

export type MethodCategory =
  | "calculo"
  | "profilaxis"
  | "evaluacion"
  | "finales"
  | "estrategia"
  | "aperturas"
  | "analisis-clasicos";

export const METHOD_CATEGORIES: { id: MethodCategory; label: string }[] = [
  { id: "calculo", label: "Cálculo de variantes" },
  { id: "profilaxis", label: "Pensamiento profiláctico" },
  { id: "evaluacion", label: "Evaluación de posiciones" },
  { id: "finales", label: "Finales técnicos" },
  { id: "estrategia", label: "Estrategia" },
  { id: "aperturas", label: "Preparación de aperturas" },
  { id: "analisis-clasicos", label: "Análisis de partidas clásicas" },
];

export interface Method {
  id: string;
  category: MethodCategory;
  title: string;
  /** Author associated with the idea, or undefined for the academy's own approach. */
  authorId?: string;
  /** Book where the idea is developed. */
  bookId?: string;
  /** Original paraphrase; never a quotation. */
  description: string;
  practice: string[];
  related: string[];
  /** Internal tool that applies the method. */
  tool?: { label: string; href: string };
}

const worldcat = (q: string) => ({ label: "Buscar en WorldCat (bibliotecas)", href: `https://search.worldcat.org/search?q=${encodeURIComponent(q)}` });
const gutenberg = (q: string) => ({ label: "Buscar en Project Gutenberg", href: `https://www.gutenberg.org/ebooks/search/?query=${encodeURIComponent(q)}` });

export const AUTHORS: Author[] = [
  { id: "capablanca", name: "José Raúl Capablanca", note: "Campeón del mundo (1921–1927), célebre por su técnica y su claridad posicional." },
  { id: "nimzowitsch", name: "Aron Nimzowitsch", note: "Teórico de la escuela hipermoderna; sistematizó conceptos como el bloqueo y la profilaxis." },
  { id: "kotov", name: "Alexander Kotov", note: "Gran maestro soviético y autor de obras sobre el método de cálculo." },
  { id: "dvoretsky", name: "Mark Dvoretsky", note: "Entrenador de referencia, autor de una extensa obra sobre entrenamiento y finales." },
  { id: "silman", name: "Jeremy Silman", note: "Maestro internacional y autor de manuales de estrategia y finales para jugadores de club." },
  { id: "nunn", name: "John Nunn", note: "Gran maestro, matemático y autor de libros sobre juego práctico y análisis." },
  { id: "seirawan", name: "Yasser Seirawan", note: "Gran maestro y divulgador; autor de una serie de manuales para principiantes y aficionados." },
  { id: "aagaard", name: "Jacob Aagaard", note: "Gran maestro, entrenador y autor de libros de entrenamiento de cálculo y juego posicional." },
  { id: "delavilla", name: "Jesús de la Villa", note: "Gran maestro español y autor de un manual de finales esenciales muy difundido." },
];

export const BOOKS: Book[] = [
  {
    id: "chess-fundamentals",
    authorId: "capablanca",
    title: "Chess Fundamentals",
    spanishTitle: "Fundamentos del ajedrez",
    firstPublished: 1921,
    publisher: "Primera edición en inglés (1921)",
    areas: ["fundamentos", "finales", "estrategia"],
    levels: ["principiante", "intermedio"],
    concepts: ["Finales elementales como base del aprendizaje", "Planes sencillos en el medio juego", "Simplificación hacia finales ganados"],
    related: ["finales-de-peones-fundamentos/oposicion", "finales-de-peones-fundamentos/casillas-clave", "finales-de-peones-fundamentos/regla-del-cuadrado"],
    status: "dominio-publico",
    statusNote: "La edición original de 1921 está en dominio público en EE. UU. Comprueba la legislación de tu país; ediciones revisadas y traducciones posteriores pueden tener derechos propios.",
    links: [gutenberg("Capablanca Chess Fundamentals"), worldcat("Capablanca Chess Fundamentals")],
  },
  {
    id: "my-system",
    authorId: "nimzowitsch",
    title: "Mein System (My System)",
    spanishTitle: "Mi sistema",
    firstPublished: 1925,
    publisher: "Edición original en alemán (1925)",
    areas: ["estrategia", "medio-juego"],
    levels: ["intermedio", "avanzado"],
    concepts: ["Bloqueo de peones pasados", "Profilaxis y sobreprotección", "Columnas abiertas y séptima fila", "Cadenas de peones"],
    related: ["medio-juego-estructuras-y-planes/peon-aislado", "medio-juego-estructuras-y-planes/columna-abierta", "medio-juego-estructuras-y-planes/formular-un-plan"],
    status: "dominio-publico",
    statusNote: "El original alemán está en dominio público en muchos países (el autor falleció en 1935). Las traducciones y ediciones modernas pueden tener derechos propios.",
    links: [worldcat("Nimzowitsch My System"), gutenberg("Nimzowitsch")],
  },
  {
    id: "think-like-a-gm",
    authorId: "kotov",
    title: "Think Like a Grandmaster",
    spanishTitle: "Piense como un gran maestro",
    firstPublished: 1971,
    publisher: "Batsford (edición inglesa)",
    areas: ["calculo"],
    levels: ["intermedio", "avanzado"],
    concepts: ["Jugadas candidatas", "Árbol de variantes", "Disciplina al calcular cada rama"],
    related: ["motivos-tacticos-esenciales/mate-de-la-coz", "motivos-tacticos-esenciales/ataque-doble-caballo"],
    status: "referencia-externa",
    statusNote: "Obra comercial: consúltala en bibliotecas o adquiérela en librerías.",
    links: [worldcat("Kotov Think Like a Grandmaster")],
  },
  {
    id: "endgame-manual",
    authorId: "dvoretsky",
    title: "Dvoretsky's Endgame Manual",
    firstPublished: 2003,
    publisher: "Russell Enterprises",
    areas: ["finales"],
    levels: ["avanzado", "experto"],
    concepts: ["Posiciones teóricas imprescindibles", "Lucena y Philidor", "Oposición y casillas correspondientes", "Finales de torres"],
    related: ["finales-de-torres-esenciales/lucena", "finales-de-torres-esenciales/philidor", "finales-de-peones-fundamentos/oposicion"],
    status: "referencia-externa",
    statusNote: "Obra comercial.",
    links: [worldcat("Dvoretsky's Endgame Manual")],
  },
  {
    id: "reassess",
    authorId: "silman",
    title: "How to Reassess Your Chess",
    firstPublished: 2010,
    publisher: "Siles Press (4.ª edición)",
    areas: ["estrategia", "medio-juego"],
    levels: ["intermedio", "avanzado"],
    concepts: ["Desequilibrios (imbalances)", "Piezas menores", "Estructura de peones", "Espacio e iniciativa"],
    related: ["medio-juego-estructuras-y-planes/formular-un-plan", "medio-juego-estructuras-y-planes/caballo-contra-alfil-malo"],
    status: "referencia-externa",
    statusNote: "Obra comercial (la 4.ª edición es de 2010; existen ediciones anteriores).",
    links: [worldcat("Silman How to Reassess Your Chess")],
  },
  {
    id: "complete-endgame",
    authorId: "silman",
    title: "Silman's Complete Endgame Course",
    firstPublished: 2007,
    publisher: "Siles Press",
    areas: ["finales"],
    levels: ["principiante", "intermedio", "avanzado"],
    concepts: ["Finales organizados por nivel de juego", "Qué estudiar primero y qué después"],
    related: ["finales-de-peones-fundamentos/regla-del-cuadrado", "finales-de-torres-esenciales/lucena"],
    status: "referencia-externa",
    statusNote: "Obra comercial.",
    links: [worldcat("Silman's Complete Endgame Course")],
  },
  {
    id: "secrets-practical",
    authorId: "nunn",
    title: "Secrets of Practical Chess",
    firstPublished: 1998,
    publisher: "Gambit Publications",
    areas: ["calculo", "estrategia"],
    levels: ["intermedio", "avanzado"],
    concepts: ["Toma de decisiones práctica", "Piezas sueltas (LPDO)", "Gestión del tiempo y del cálculo"],
    related: ["motivos-tacticos-esenciales/ataque-doble-caballo", "motivos-tacticos-esenciales/eliminacion-del-defensor"],
    status: "referencia-externa",
    statusNote: "Obra comercial.",
    links: [worldcat("Nunn Secrets of Practical Chess")],
  },
  {
    id: "move-by-move",
    authorId: "nunn",
    title: "Understanding Chess Move by Move",
    firstPublished: 2001,
    publisher: "Gambit Publications",
    areas: ["estrategia", "aperturas", "medio-juego"],
    levels: ["intermedio", "avanzado"],
    concepts: ["Comentario de partidas jugada a jugada", "Relación entre apertura, medio juego y final"],
    related: ["apertura-italiana-ideas/giuoco-piano-c3-d4"],
    status: "referencia-externa",
    statusNote: "Obra comercial.",
    links: [worldcat("Nunn Understanding Chess Move by Move")],
  },
  {
    id: "winning-strategies",
    authorId: "seirawan",
    title: "Winning Chess Strategies",
    firstPublished: 1994,
    publisher: "Microsoft Press (ediciones posteriores en Everyman Chess)",
    areas: ["estrategia"],
    levels: ["principiante", "intermedio"],
    concepts: ["Principios estratégicos básicos", "Estructuras de peones", "Piezas buenas y malas"],
    related: ["medio-juego-estructuras-y-planes/caballo-contra-alfil-malo", "medio-juego-estructuras-y-planes/columna-abierta"],
    status: "referencia-externa",
    statusNote: "Obra comercial.",
    links: [worldcat("Seirawan Winning Chess Strategies")],
  },
  {
    id: "excelling-calculation",
    authorId: "aagaard",
    title: "Excelling at Chess Calculation",
    firstPublished: 2004,
    publisher: "Everyman Chess",
    areas: ["calculo"],
    levels: ["avanzado"],
    concepts: ["Entrenamiento práctico del cálculo", "Visualización", "Jugadas candidatas"],
    related: ["motivos-tacticos-esenciales/mate-de-la-coz"],
    status: "referencia-externa",
    statusNote: "Obra comercial.",
    links: [worldcat("Aagaard Excelling at Chess Calculation")],
  },
  {
    id: "gm-prep-positional",
    authorId: "aagaard",
    title: "Grandmaster Preparation: Positional Play",
    firstPublished: 2012,
    publisher: "Quality Chess (serie Grandmaster Preparation)",
    areas: ["estrategia", "medio-juego"],
    levels: ["avanzado", "experto"],
    concepts: ["Debilidades, peor pieza e ideas del rival", "Entrenamiento posicional con ejercicios"],
    related: ["medio-juego-estructuras-y-planes/formular-un-plan"],
    status: "referencia-externa",
    statusNote: "Obra comercial.",
    links: [worldcat("Aagaard Grandmaster Preparation Positional Play")],
  },
  {
    id: "100-endgames",
    authorId: "delavilla",
    title: "100 Endgames You Must Know",
    spanishTitle: "100 finales que hay que saber",
    firstPublished: 2008,
    publisher: "New in Chess (edición inglesa)",
    areas: ["finales"],
    levels: ["principiante", "intermedio"],
    concepts: ["Selección de finales teóricos esenciales", "Lucena, Philidor y finales de peones", "Repaso sistemático"],
    related: ["finales-de-torres-esenciales/lucena", "finales-de-torres-esenciales/philidor", "finales-de-peones-fundamentos/casillas-clave"],
    status: "referencia-externa",
    statusNote: "Obra comercial.",
    links: [worldcat("de la Villa 100 Endgames You Must Know")],
  },
];

export const METHODS: Method[] = [
  {
    id: "candidatas",
    category: "calculo",
    title: "Jugadas candidatas y árbol de variantes",
    authorId: "kotov",
    bookId: "think-like-a-gm",
    description:
      "Antes de calcular, enumera todas las jugadas razonables (candidatas). Después analiza cada rama por separado y con orden, en lugar de saltar de una línea a otra.",
    practice: [
      "En cada ejercicio, escribe o di en voz alta tus candidatas antes de mover.",
      "Empieza por las jugadas forzantes: jaques, capturas y amenazas.",
      "Si vuelves a una rama ya calculada, para: es señal de desorden.",
    ],
    related: ["motivos-tacticos-esenciales/mate-de-la-coz", "motivos-tacticos-esenciales/ataque-doble-caballo"],
    tool: { label: "Entrenar ejercicios", href: "/tactica/entrenamiento" },
  },
  {
    id: "lpdo",
    category: "calculo",
    title: "Piezas sueltas: vigilancia táctica",
    authorId: "nunn",
    bookId: "secrets-practical",
    description:
      "Las piezas sin defensa son el objetivo natural de los ataques dobles. Revisar qué piezas están sueltas (propias y del rival) es una forma rápida de encontrar táctica y de evitarla.",
    practice: ["Antes de cada jugada, localiza las piezas sin defender.", "Busca jaques que ataquen además una pieza suelta."],
    related: ["motivos-tacticos-esenciales/ataque-doble-caballo"],
    tool: { label: "Entrenar ataques dobles", href: "/tactica/entrenamiento" },
  },
  {
    id: "calculo-practico",
    category: "calculo",
    title: "Entrenamiento deliberado del cálculo",
    authorId: "aagaard",
    bookId: "excelling-calculation",
    description:
      "El cálculo mejora resolviendo posiciones difíciles sin mover las piezas y comprobando después. La comprobación honesta de los errores es parte del entrenamiento.",
    practice: ["Resuelve sin pistas y anota tu solución antes de jugarla.", "Repite los ejercicios fallados otro día: el sistema de repaso los programa."],
    related: ["motivos-tacticos-esenciales/eliminacion-del-defensor"],
  },
  {
    id: "profilaxis-nimzo",
    category: "profilaxis",
    title: "Profilaxis y sobreprotección",
    authorId: "nimzowitsch",
    bookId: "my-system",
    description:
      "Prevenir los planes del rival antes de que sean una amenaza, y proteger de más los puntos estratégicos clave para que tus piezas puedan apoyarse en ellos.",
    practice: ["En cada posición, pregunta qué haría el rival si fuera su turno.", "Identifica tus puntos fuertes y comprueba cuántas piezas los apoyan."],
    related: ["medio-juego-estructuras-y-planes/formular-un-plan"],
  },
  {
    id: "profilaxis-dvoretsky",
    category: "profilaxis",
    title: "Pensamiento profiláctico como hábito",
    authorId: "dvoretsky",
    description:
      "Dvoretsky insistió en sus libros de entrenamiento en convertir la pregunta «¿qué quiere hacer mi rival?» en un hábito sistemático del proceso de pensamiento.",
    practice: ["Antes de elegir tu plan, formula el plan del rival en una frase.", "Valora si una jugada tranquila que lo impide es mejor que tu propio plan."],
    related: ["medio-juego-estructuras-y-planes/formular-un-plan"],
  },
  {
    id: "desequilibrios",
    category: "evaluacion",
    title: "Desequilibrios",
    authorId: "silman",
    bookId: "reassess",
    description:
      "Evalúa la posición a partir de sus diferencias concretas —piezas menores, estructura, espacio, material, columnas y casillas, desarrollo, iniciativa, seguridad del rey— y elige el plan que aprovecha las que te favorecen.",
    practice: ["Haz una lista de diferencias antes de buscar jugadas.", "Elige un plan que aproveche un desequilibrio a tu favor."],
    related: ["medio-juego-estructuras-y-planes/caballo-contra-alfil-malo", "medio-juego-estructuras-y-planes/formular-un-plan"],
  },
  {
    id: "tres-preguntas",
    category: "evaluacion",
    title: "Tres preguntas: debilidades, peor pieza, idea del rival",
    authorId: "aagaard",
    bookId: "gm-prep-positional",
    description:
      "Un método de preguntas para el juego posicional: localizar las debilidades, mejorar la peor pieza y entender la idea del rival. La lección «Cómo formular un plan» lo aplica paso a paso.",
    practice: ["Responde las tres preguntas por escrito en tus partidas lentas.", "Compara tus respuestas con el plan que finalmente jugaste."],
    related: ["medio-juego-estructuras-y-planes/formular-un-plan"],
  },
  {
    id: "finales-primero",
    category: "finales",
    title: "Empezar por los finales",
    authorId: "capablanca",
    bookId: "chess-fundamentals",
    description:
      "Chess Fundamentals comienza con finales sencillos: con pocas piezas se entiende mejor el valor y la coordinación de cada una, base para el resto de la partida.",
    practice: ["Domina oposición, casillas clave y regla del cuadrado antes que la teoría de aperturas."],
    related: ["finales-de-peones-fundamentos/oposicion", "finales-de-peones-fundamentos/casillas-clave"],
  },
  {
    id: "posiciones-teoricas",
    category: "finales",
    title: "Posiciones teóricas de referencia",
    authorId: "dvoretsky",
    bookId: "endgame-manual",
    description:
      "Un repertorio reducido de posiciones teóricas exactas (Lucena, Philidor y otras) sirve de punto de referencia para jugar cualquier final parecido.",
    practice: ["Repasa Lucena y Philidor hasta poder demostrarlas sin ayuda.", "En tus partidas, pregúntate a qué posición teórica te acercas."],
    related: ["finales-de-torres-esenciales/lucena", "finales-de-torres-esenciales/philidor"],
  },
  {
    id: "finales-esenciales",
    category: "finales",
    title: "Un número limitado de finales esenciales",
    authorId: "delavilla",
    bookId: "100-endgames",
    description:
      "Seleccionar los finales que de verdad aparecen en la práctica y estudiarlos a fondo es más útil que intentar abarcar toda la teoría.",
    practice: ["Repite periódicamente los finales clave: el repaso espaciado lo programa por ti."],
    related: ["finales-de-torres-esenciales/philidor", "finales-de-peones-fundamentos/peon-pasado-alejado"],
  },
  {
    id: "bloqueo",
    category: "estrategia",
    title: "Bloqueo y casillas fuertes",
    authorId: "nimzowitsch",
    bookId: "my-system",
    description:
      "Un peón pasado o aislado se neutraliza mejor bloqueándolo con una pieza (idealmente un caballo) en la casilla de delante, que el rival no puede atacar con peones.",
    practice: ["Ante un peón aislado rival, localiza la casilla de bloqueo.", "Lleva tu peor pieza a una casilla fuerte."],
    related: ["medio-juego-estructuras-y-planes/peon-aislado", "medio-juego-estructuras-y-planes/caballo-contra-alfil-malo"],
  },
  {
    id: "estrategia-basica",
    category: "estrategia",
    title: "Principios estratégicos accesibles",
    authorId: "seirawan",
    bookId: "winning-strategies",
    description: "Los principios estratégicos —espacio, estructura, piezas buenas y malas— se aprenden mejor con ejemplos sencillos antes de pasar a posiciones complejas.",
    practice: ["Relaciona cada lección de medio juego con una partida tuya."],
    related: ["medio-juego-estructuras-y-planes/columna-abierta"],
  },
  {
    id: "ideas-antes-que-jugadas",
    category: "aperturas",
    title: "Ideas antes que jugadas",
    description:
      "Enfoque de esta academia (no atribuido a ningún autor): estudiar cada apertura por sus estructuras, planes y trampas, y construir un repertorio coherente en el que las estructuras se repitan.",
    practice: [
      "Para cada apertura de tu repertorio, explica con tus palabras el plan de ambos bandos.",
      "Revisa la cobertura del repertorio: qué respuestas del rival aún no tienes preparadas.",
    ],
    related: [],
    tool: { label: "Mi repertorio", href: "/aperturas/repertorio" },
  },
  {
    id: "jugada-a-jugada",
    category: "analisis-clasicos",
    title: "Comentar partidas jugada a jugada",
    authorId: "nunn",
    bookId: "move-by-move",
    description:
      "Seguir una partida modelo explicando el motivo de cada jugada —no solo las jugadas brillantes— enseña cómo se conectan apertura, medio juego y final.",
    practice: ["Reproduce una partida modelo y, antes de cada jugada, intenta adivinarla y justificarla."],
    related: ["apertura-italiana-ideas/giuoco-piano-c3-d4"],
    tool: { label: "Tablero de análisis", href: "/tablero" },
  },
];

export function getAuthor(id?: string): Author | undefined {
  return AUTHORS.find((a) => a.id === id);
}

export function getBook(id?: string): Book | undefined {
  return BOOKS.find((b) => b.id === id);
}
