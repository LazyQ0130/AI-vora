import { notFound } from "next/navigation";
import { Reader } from "@/components/lesson/reader";
import { sampleLesson } from "@/content/sample";
export const dynamicParams = false;
export const metadata = { title: "线性回归与梯度下降 · 试读样章" };
export function generateStaticParams() {
  return [{ courseId: sampleLesson.courseId, lessonId: sampleLesson.id }];
}
export default async function LearnPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  if (courseId !== sampleLesson.courseId || lessonId !== sampleLesson.id)
    notFound();
  return <Reader />;
}
