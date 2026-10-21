/** Human labels for theme tags used in lessons and weakness detection. */
const THEME_LABELS: Record<string, string> = {
  "regla-del-cuadrado": "Regla del cuadrado",
  "peon-pasado": "Peón pasado",
  "casillas-clave": "Casillas clave",
  "rey-activo": "Actividad del rey",
  oposicion: "Oposición",
  defensa: "Técnica defensiva",
  "red-de-mate": "Redes de mate",
  "ultima-fila": "Mate en la última fila",
  "ataque-doble": "Ataque doble",
  horquilla: "Horquilla",
  clavada: "Clavada",
  centro: "Control del centro",
  desarrollo: "Desarrollo",
  "ruptura-d5": "Ruptura ...d5",
  f7: "Debilidad de f7",
  iniciativa: "Iniciativa",
  trampa: "Trampas de apertura",
};

export function themeLabel(theme: string): string {
  return THEME_LABELS[theme] ?? theme.replace(/-/g, " ");
}
