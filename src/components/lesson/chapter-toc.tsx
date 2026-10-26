"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Course, Lesson, LessonSummary } from "@/content/models";
import { CourseContents } from "./course-contents";
export function ChapterToc({ course, lesson, progressLessons }: { course: Course; lesson: Lesson; progressLessons: LessonSummary[] }) {
  return <><Link href={`/courses/${course.id}`} className="text-link reader-back"><ArrowLeft size={14} />返回课程详情</Link>
    <CourseContents course={course} currentLesson={lesson} progressLessons={progressLessons} />
  </>;
}
