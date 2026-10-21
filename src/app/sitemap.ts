import type { MetadataRoute } from "next";
import { COURSES, allLessons } from "@/lib/content/catalog";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const pages = ["", "/cursos", "/aperturas", "/medio-juego", "/tactica", "/finales", "/tablero"];
  return [
    ...pages.map((path) => ({ url: `${base}${path}` })),
    ...COURSES.map((c) => ({ url: `${base}/cursos/${c.slug}` })),
    ...allLessons().map((ref) => ({ url: `${base}/cursos/${ref.course.slug}/${ref.lesson.slug}` })),
  ];
}
