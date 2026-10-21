import {
  BookOpen,
  Brain,
  Crown,
  GraduationCap,
  LayoutDashboard,
  Library,
  type LucideIcon,
  Puzzle,
  Shield,
  Swords,
  Target,
  User,
  Users,
} from "lucide-react";
import { t } from "@/i18n";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Phase in which the section is delivered; undefined = available now. */
  phase?: number;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    items: [
      { href: "/", label: t.nav.dashboard, icon: LayoutDashboard },
      { href: "/cursos", label: t.nav.courses, icon: GraduationCap },
    ],
  },
  {
    label: t.nav.study,
    items: [
      { href: "/aperturas", label: t.nav.openings, icon: BookOpen },
      { href: "/medio-juego", label: t.nav.middlegame, icon: Brain },
      { href: "/tactica", label: t.nav.tactics, icon: Swords },
      { href: "/finales", label: t.nav.endgames, icon: Crown },
    ],
  },
  {
    label: t.nav.tools,
    items: [
      { href: "/tablero", label: t.nav.board, icon: Puzzle },
      { href: "/entrenador", label: t.nav.coach, icon: Target, phase: 5 },
      { href: "/biblioteca", label: t.nav.library, icon: Library, phase: 2 },
      { href: "/metodos", label: t.nav.coaches, icon: Users, phase: 2 },
      { href: "/admin", label: t.nav.admin, icon: Shield, phase: 6 },
    ],
  },
  {
    items: [{ href: "/perfil", label: t.nav.profile, icon: User }],
  },
];

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
