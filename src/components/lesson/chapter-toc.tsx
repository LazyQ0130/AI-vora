"use client";
import Link from "next/link";
import { ArrowLeft, ChevronRight, LockKeyhole } from "lucide-react";
import type { Course, Lesson } from "@/content/models";
import { lessonHref } from "@/content/publication-manifest";
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
      <nav className="chapter-toc" aria-label="章节目录">
        {course.chapters.map((chapter) => (
          <details
            key={chapter.id}
            open={chapter.id === lesson.chapterId ? true : undefined}
          >
            <summary>
              <ChevronRight size={13} />
              <span className="toc-chapter-number">
                {String(chapter.order).padStart(2, "0")}
              </span>
              <span>{chapter.title}</span>
              {chapter.lessons.length === 0 && <LockKeyhole size={11} />}
            </summary>
            {chapter.lessons.length > 0 ? (
              chapter.lessons.map((entry) =>
                entry.lessonId === lesson.id ? (
                  <div className="lesson-toc-items" key={entry.lessonId}>
                    <span className="toc-sample-label">
                      本节 · {entry.title}
                    </span>
                    {lesson.sections.map((section, index) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className={active === section.id ? "active" : ""}
                        aria-current={
                          active === section.id ? "location" : undefined
                        }
                        onClick={
                          onNavigate
                            ? (event) => {
                                event.preventDefault();
                                onNavigate(section.id);
                              }
                            : undefined
                        }
                      >
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        {section.title}
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="lesson-toc-items" key={entry.lessonId}>
                    <Link href={lessonHref(entry)}>{entry.title}</Link>
                  </div>
                ),
              )
            ) : (
              <p className="toc-planned">本章教材尚未开放。</p>
            )}
          </details>
        ))}
      </nav>
      <p className="toc-footnote">
        章节来自课程规划，仅开放的教材可以阅读。试读不代表整门课程已发布。
      </p>
    </>
  );
}
