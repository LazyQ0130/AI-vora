"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Course, Lesson } from "@/content/models";
import { chapterNumber } from "@/lib/course-numbering";
import { lessonHref } from "@/content/publication-manifest";

function SectionLinks({
  lesson,
  prefix,
  active,
  onNavigate,
}: {
  lesson: Lesson;
  prefix?: string;
  active?: string;
  onNavigate?: (section: string) => void;
}) {
  return (
    <ol className="lesson-section-list">
      {lesson.sections.map((section, index) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className={active === section.id ? "active" : ""}
            aria-current={active === section.id ? "location" : undefined}
            onClick={
              onNavigate
                ? (event) => {
                    event.preventDefault();
                    onNavigate(section.id);
                  }
                : undefined
            }
          >
            {prefix && (
              <span className="section-number">
                {prefix}.{index + 1}
              </span>
            )}
            <span>{section.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
export function CourseContents({
  course,
  currentLesson,
  activeSection,
  onNavigate,
  variant = "reader",
}: {
  course: Course;
  currentLesson?: Lesson;
  activeSection?: string;
  onNavigate?: (section: string) => void;
  variant?: "reader" | "detail";
}) {
  return (
    <nav
      className={`chapter-toc course-contents course-contents-${variant}`}
      aria-label={variant === "reader" ? "章节目录" : "课程章节目录"}
    >
      {course.chapters.map((chapter) => (
        <details
          key={chapter.id}
          id={variant === "detail" ? chapter.id : undefined}
          open={
            currentLesson?.chapterId === chapter.id ||
            (variant === "detail" &&
              (chapter.order === 1 || chapter.lessons.some((l) => l.href)))
              ? true
              : undefined
          }
        >
          <summary>
            <ChevronRight size={14} />
            <span className="chapter-label">
              {chapterNumber(chapter.order)}
            </span>
            <span className="chapter-title">{chapter.title}</span>
          </summary>
          {chapter.lessons.length ? (
            <ol className="course-lesson-list">
              {chapter.lessons.map((entry) => (
                <li key={entry.lessonId}>
                  {entry.href ? (
                    <Link
                      href={entry.href}
                      className={`course-lesson-link ${currentLesson?.id === entry.lessonId ? "current-lesson" : ""}`}
                      aria-current={
                        currentLesson?.id === entry.lessonId
                          ? "page"
                          : undefined
                      }
                    >
                      <span className="lesson-number">
                        {entry.displayNumber}
                      </span>
                      <span className="lesson-title">{entry.title}</span>
                      <span className="lesson-state">
                        {entry.status === "published" ? "教材" : "试读"}
                      </span>
                    </Link>
                  ) : (
                    <div className="course-lesson-planned">
                      <span className="lesson-number">
                        {entry.displayNumber}
                      </span>
                      <span className="lesson-title">{entry.title}</span>
                      <span className="lesson-state">筹备中</span>
                    </div>
                  )}
                  {currentLesson?.id === entry.lessonId && (
                    <SectionLinks
                      lesson={currentLesson}
                      prefix={entry.displayNumber}
                      active={activeSection}
                      onNavigate={onNavigate}
                    />
                  )}
                </li>
              ))}
            </ol>
          ) : (
            <p className="toc-planned">节次规划中 · 本章教材尚未开放。</p>
          )}
        </details>
      ))}
      {course.legacyLessons.length > 0 && (
        <div className="legacy-directory">
          <p>保留的旧版试读</p>
          {course.legacyLessons.map((entry) => (
            <div key={entry.lessonId}>
              <Link
                href={lessonHref(entry)}
                aria-current={
                  currentLesson?.id === entry.lessonId ? "page" : undefined
                }
              >
                {entry.title}
                <small>旧版综合试读 · 不计入新版课时完成率</small>
              </Link>
              {currentLesson?.id === entry.lessonId && (
                <SectionLinks
                  lesson={currentLesson}
                  active={activeSection}
                  onNavigate={onNavigate}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
