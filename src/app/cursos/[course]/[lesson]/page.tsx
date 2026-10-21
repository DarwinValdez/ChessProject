import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { allLessons, getLesson } from "@/lib/content/catalog";

export function generateStaticParams() {
  return allLessons().map((ref) => ({ course: ref.course.slug, lesson: ref.lesson.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cursos/[course]/[lesson]">): Promise<Metadata> {
  const { course, lesson } = await params;
  return { title: getLesson(course, lesson)?.lesson.title ?? "Lección" };
}

export default async function LessonPage({ params }: PageProps<"/cursos/[course]/[lesson]">) {
  const { course, lesson } = await params;
  const ref = getLesson(course, lesson);
  if (!ref) notFound();
  return <LessonPlayer course={ref.course} lessonSlug={ref.lesson.slug} />;
}
