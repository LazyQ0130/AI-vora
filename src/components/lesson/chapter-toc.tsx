"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Course, Lesson } from "@/content/models";
import { CourseContents } from "./course-contents";
import { CourseArt } from "../course-card";

export function ChapterToc({
  course,
  lesson,
  active,
  onNavigate,
}: {
  course: Course;
  lesson: Lesson;
  active: string;
  onNavigate?: (sectionId: string) => void;
}) {
  const artCourse = {
    ...course,
    chapters: course.chapters.map((ch) => ch.title),
  };
  return (
    <>
      <Link href={`/courses/${course.id}`} className="text-link reader-back">
        <ArrowLeft size={14} />
        返回课程详情
      </Link>
      <div className="toc-course">
        <div className="toc-course-cover">
          <CourseArt course={artCourse} compact />
        </div>
        <div className="toc-course-copy">
          <span className="toc-course-level">
            {course.lvl} · {course.direction}
          </span>
          <h2>{course.name}</h2>
          <span className="subtle-tag">课程筹备中 · 含试读样章</span>
        </div>
      </div>
      <CourseContents course={course} currentLesson={lesson} activeSection={active} onNavigate={onNavigate} />
      <p className="toc-footnote">
        章节来自课程规划，仅开放的教材可以阅读。试读不代表整门课程已发布。
      </p>
    </>
  );
}
