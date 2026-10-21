/**
 * Spanish UI dictionary. Adding English means adding en.ts with the same
 * shape (TypeScript enforces it through the Messages type) and selecting
 * the dictionary by locale in i18n/index.ts.
 */
export const es = {
  app: {
    name: "Chess Academy",
    tagline: "Academia de ajedrez",
    skipToContent: "Saltar al contenido",
  },
  nav: {
    dashboard: "Dashboard",
    courses: "Cursos",
    openings: "Aperturas",
    middlegame: "Medio juego",
    tactics: "Táctica",
    endgames: "Finales",
    board: "Tablero de análisis",
    library: "Biblioteca",
    coaches: "Métodos de entrenadores",
    coach: "Mi entrenador",
    admin: "Administración",
    profile: "Mis datos",
    study: "Estudiar",
    tools: "Herramientas",
    soon: "Próximamente",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    phase: (n: number) => `Fase ${n}`,
  },
  theme: {
    label: "Tema",
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
  },
  guest: {
    badge: "Modo invitado",
    note: "Tu progreso se guarda solo en este navegador.",
  },
  board: {
    flip: "Girar tablero",
    start: "Ir al inicio",
    back: "Jugada anterior",
    forward: "Jugada siguiente",
    end: "Ir al final",
    reset: "Reiniciar",
    promotion: "Elige la pieza de promoción",
    cancel: "Cancelar",
    whiteToMove: "Juegan las blancas",
    blackToMove: "Juegan las negras",
    check: "Jaque",
    checkmate: "Jaque mate",
    stalemate: "Tablas por ahogado",
    insufficient: "Tablas por material insuficiente",
    threefold: "Tablas por triple repetición",
    fiftyMove: "Tablas por la regla de los 50 movimientos",
    noMoves: "Aún no hay jugadas.",
  },
} as const;

type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => Widen<R>
    : { [K in keyof T]: Widen<T[K]> };

export type Messages = Widen<typeof es>;
