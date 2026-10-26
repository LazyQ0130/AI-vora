"use client";
import Link from "next/link";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import type { Course, Lesson, LessonSummary } from "@/content/models";
import { chapterNumber } from "@/lib/course-numbering";
import { lessonHref } from "@/content/publication-manifest";
import { useLearningRecords } from "@/lib/use-learning-progress";
import { summarizeCourseReading } from "@/lib/course-reading-summary";

export function CourseContents({ course, currentLesson, progressLessons, variant = "reader" }: {
  course: Course; currentLesson?: Lesson; progressLessons: LessonSummary[];
  variant?: "reader" | "detail";
}) {
  const records = useLearningRecords(progressLessons);
  const summary = summarizeCourseReading(progressLessons, records).find((row) => row.courseId === course.id);
  const completed = new Set(records.filter((row) => row.progress.completed).map((row) => row.lesson.lessonId));
  const available = summary?.available ?? 0;
  return <nav className={`chapter-toc course-contents course-contents-${variant}`} aria-label={variant === "reader" ? "章节目录" : "课程章节目录"}>
    <div className="course-directory-overview">
      <span className="eyebrow">COURSE CONTENTS</span>
      <h2>{course.name}</h2>
      <p>{course.chapters.length} 章 · {available} 节核心课已制作</p>
      <div className="directory-progress-copy"><span>已制作课时阅读比例</span><b>{summary?.percent ?? 0}%</b></div>
      <div className="directory-progress-track" role="progressbar" aria-label={`${course.name}已制作核心课阅读比例`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={summary?.percent ?? 0}><i style={{ width: `${summary?.percent ?? 0}%` }} /></div>
      <small>{summary?.completed ?? 0} / {available} 节已标记读完 · 仅当前浏览器</small>
      <small>筹备、可选与旧版课时不计入比例；已读不代表掌握。</small>
    </div>
    {course.chapters.map((chapter) => <details key={chapter.id} id={variant === "detail" ? chapter.id : undefined} open={currentLesson?.chapterId === chapter.id || (variant === "detail" && chapter.lessons.some((l) => l.href)) ? true : undefined}>
      <summary><ChevronRight size={15} aria-hidden="true" /><span className="chapter-label">{chapterNumber(chapter.order)}：</span><span className="chapter-title">{chapter.title}</span></summary>
      {chapter.lessons.length ? <ol className="course-lesson-list">{chapter.lessons.map((entry) => <li key={entry.lessonId}>
        {entry.href ? <Link href={entry.href} className={`course-lesson-link ${currentLesson?.id === entry.lessonId ? "current-lesson" : ""}`} aria-current={currentLesson?.id === entry.lessonId ? "page" : undefined}>
          {completed.has(entry.lessonId) ? <CheckCircle2 className="lesson-complete-icon" size={16} aria-label="已读完" /> : <Circle className="lesson-pending-icon" size={16} aria-label="未读完" />}
          <span className="lesson-number">{entry.displayNumber}</span><span className="lesson-title">{entry.title}</span>
          {entry.optionalLesson && <small className="lesson-state">可选</small>}
        </Link> : <div className="course-lesson-planned"><span className="planned-marker" aria-hidden="true">·</span><span className="lesson-number">{entry.displayNumber}</span><span className="lesson-title">{entry.title}</span><small className="lesson-state">筹备中</small></div>}
      </li>)}</ol> : <p className="toc-planned">节次规划中 · 本章教材尚未开放。</p>}
    </details>)}
    {course.legacyLessons.length > 0 && <details className="legacy-directory" open={currentLesson && course.legacyLessons.some((entry) => entry.lessonId === currentLesson.id) ? true : undefined}>
      <summary><ChevronRight size={15} aria-hidden="true" /><span>旧版教材与阅读历史</span></summary>
      <p>原链接与记录保留，不计新版课程进度。</p>
      {course.legacyLessons.map((entry) => <Link key={entry.lessonId} href={lessonHref(entry)} className={currentLesson?.id === entry.lessonId ? "current-lesson" : undefined} aria-current={currentLesson?.id === entry.lessonId ? "page" : undefined}>{entry.title}<small>旧版试读{completed.has(entry.lessonId) ? " · 历史已读完" : ""}</small></Link>)}
    </details>}
  </nav>;
}
