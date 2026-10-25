import { notFound } from "next/navigation";
import { Reader } from "@/components/lesson/reader";
import { getAdjacentLessons, resolveLesson } from "@/lib/course-engine";
import { readablePublications } from "@/content/publication-manifest";
export const dynamicParams = false;
type Params = { params: Promise<{ courseId: string; lessonId: string }> };
export async function generateMetadata({ params }: Params) {
  const { courseId, lessonId } = await params;
  const resolved = resolveLesson(courseId, lessonId);
  return {
    title: resolved
      ? `${resolved.lesson.title} · ${resolved.publication.status === "published" ? "课程教材" : "试读样章"}`
      : "课时未找到",
  };
}
export function generateStaticParams() {
  return readablePublications.map(({ courseId, lessonId }) => ({
    courseId,
    lessonId,
  }));
}
export default async function LearnPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const resolved = resolveLesson(courseId, lessonId);
  if (!resolved) notFound();
  return (
    <Reader
      key={`${courseId}:${lessonId}`}
      {...resolved}
      adjacent={getAdjacentLessons(resolved.course, lessonId)}
    />
  );
}
