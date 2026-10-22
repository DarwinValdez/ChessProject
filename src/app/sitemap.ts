import type { MetadataRoute } from "next";
import { COURSES, allLessons } from "@/lib/content/catalog";
import { OPENINGS } from "@/lib/content/openings";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const pages = ["", "/cursos", "/aperturas", "/aperturas/repertorio", "/medio-juego", "/tactica", "/tactica/entrenamiento", "/finales", "/tablero", "/biblioteca", "/metodos"];
  return [
    ...pages.map((path) => ({ url: `${base}${path}` })),
    ...COURSES.map((c) => ({ url: `${base}/cursos/${c.slug}` })),
    ...OPENINGS.map((o) => ({ url: `${base}/aperturas/${o.slug}` })),
    ...allLessons().map((ref) => ({ url: `${base}/cursos/${ref.course.slug}/${ref.lesson.slug}` })),
  ];
}
