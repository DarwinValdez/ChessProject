import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseStartButton, CourseSyllabus } from "@/components/catalog/CourseSyllabus";
import { AreaTag, LevelTag, SourceTag } from "@/components/ui/Meta";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { COURSES, courseLessons, courseMinutes, getCourse } from "@/lib/content/catalog";

export function generateStaticParams() {
  return COURSES.map((c) => ({ course: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cursos/[course]">): Promise<Metadata> {
  const { course } = await params;
  return { title: getCourse(course)?.title ?? "Curso" };
}

export default async function CoursePage({ params }: PageProps<"/cursos/[course]">) {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  return (
    <PageContainer>
      <Link href="/cursos" className="inline-flex w-fit items-center gap-1 text-sm text-muted hover:text-text">
        <ChevronLeft className="h-4 w-4" aria-hidden /> Catálogo
      </Link>
      <PageHeader
        eyebrow={
          <span className="flex items-center gap-2 normal-case tracking-normal">
            <AreaTag area={course.area} /> <LevelTag level={course.level} /> <SourceTag source={course.source} />
          </span>
        }
        title={course.title}
        description={course.summary}
        actions={<CourseStartButton course={course} />}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <CourseSyllabus course={course} />
        <aside className="card h-fit p-5">
          <h2 className="label mb-3">Al terminar sabrás</h2>
          <ul className="flex list-disc flex-col gap-2 pl-4 text-sm text-muted marker:text-accent">
            {course.outcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
            <div>
              <dt className="text-faint">Lecciones</dt>
              <dd className="font-medium">{courseLessons(course).length}</dd>
            </div>
            <div>
              <dt className="text-faint">Duración</dt>
              <dd className="font-medium">{courseMinutes(course)} min</dd>
            </div>
            {course.eco && (
              <div className="col-span-2">
                <dt className="text-faint">Códigos ECO</dt>
                <dd className="font-medium">{course.eco.join(", ")}</dd>
              </div>
            )}
          </dl>
          <p className="mt-4 border-t border-border pt-4 text-xs text-faint">
            Una lección cuenta como dominada solo cuando resuelves sus ejercicios sin errores ni pistas en dos días distintos.
          </p>
        </aside>
      </div>
    </PageContainer>
  );
}
