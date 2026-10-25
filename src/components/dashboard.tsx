"use client";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  HardDrive,
  CheckCircle2,
  History,
  Route,
  ArrowUpRight,
} from "lucide-react";
import type { LessonSummary } from "@/content/models";
import { useLearningRecords } from "@/lib/use-learning-progress";
import { ProgressRing } from "./lesson/blocks";
import { EmptyState, Reveal } from "./ui";

export function Dashboard({ lessons }: { lessons: LessonSummary[] }) {
  const records = useLearningRecords(lessons);
  const latest = records[0];
  const nextUrl = latest
    ? `${latest.lesson.href}#${latest.progress.section}`
    : undefined;
  const courseGroups = [
    ...new Set(lessons.map((lesson) => lesson.courseId)),
  ].map((courseId) => {
    const available = lessons.filter((lesson) => lesson.courseId === courseId);
    const visited = records.filter(
      (record) => record.lesson.courseId === courseId,
    );
    return {
      courseId,
      name: available[0].courseName,
      available: available.length,
      completed: visited.filter((record) => record.progress.completed).length,
      percent: Math.round(
        visited.reduce((sum, record) => sum + record.progress.percent, 0) /
          available.length,
      ),
    };
  });
  return (
    <div className="container page-container">
      <div className="page-intro">
        <span className="eyebrow">EVERY SMALL STEP COUNTS</span>
        <h1>学习，沿着自己的节奏。</h1>
        <p>让每一次理解都有记录，让下一步始终清晰。</p>
        <span className="subtle-tag">
          <HardDrive size={12} />
          阅读记录仅保存在当前浏览器
        </span>
      </div>
      <div className="dashboard-stats">
        <div>
          <BookOpen />
          <strong>
            {records.length}
            <small>节</small>
          </strong>
          <span>已开始阅读的样章</span>
        </div>
        <div>
          <CheckCircle2 />
          <strong>
            {records.filter((record) => record.progress.completed).length}
            <small>节</small>
          </strong>
          <span>已标记读完 · 共 {lessons.length} 节可试读</span>
        </div>
      </div>
      <div className="dashboard-layout">
        <section>
          <div className="section-heading">
            <div>
              <span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span>
              <h2>继续自己的探索</h2>
            </div>
            <BookOpen size={20} className="muted" />
          </div>
          {latest && nextUrl ? (
            <Reveal className="continue-card">
              <div className="continue-card-visual">
                <ProgressRing value={latest.progress.percent} />
                <span>
                  {latest.progress.completed ? "本节已读完" : "样章阅读进度"}
                </span>
              </div>
              <div className="continue-card-copy">
                <span className={`level level-${latest.lesson.level}`}>
                  试读样章 · {latest.lesson.level}
                </span>
                <h3>{latest.lesson.title}</h3>
                <p>
                  当前停留：
                  {
                    latest.lesson.sectionTitles.find(
                      (section) => section.id === latest.progress.section,
                    )?.title
                  }
                </p>
                <Link href={nextUrl} className="button button-primary">
                  {latest.progress.completed ? "再次阅读" : "继续阅读"}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>
          ) : (
            <EmptyState
              icon={<BookOpen size={31} />}
              title="还没有阅读记录"
              description="从编程、数学或机器学习样章开始。每节阅读进度都会独立记录。"
            >
              <a href="#available-lessons" className="button button-primary">
                选择试读样章
                <ArrowRight size={16} />
              </a>
            </EmptyState>
          )}
          <section className="detail-section" id="available-lessons">
            <div className="section-heading">
              <div>
                <span className="eyebrow">START WITH A CHAPTER</span>
                <h2>选择一节，开始理解</h2>
              </div>
            </div>
            <div className="dashboard-samples">
              {lessons.map((lesson) => (
                <Link key={lesson.lessonId} href={lesson.href}>
                  <BookOpen size={19} />
                  <span>
                    <small>{lesson.courseName} · 试读</small>
                    <strong>{lesson.title}</strong>
                  </span>
                  <ArrowUpRight size={18} />
                </Link>
              ))}
            </div>
          </section>
          <section className="detail-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">YOUR READING HISTORY</span>
                <h2>最近阅读</h2>
              </div>
              <History size={18} className="muted" />
            </div>
            {records.length ? (
              records.map(({ lesson, progress }) => (
                <Link
                  key={lesson.lessonId}
                  href={`${lesson.href}#${progress.section}`}
                  className="history-row"
                >
                  <div className="history-icon">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3>{lesson.title}</h3>
                    <p>
                      {lesson.courseName} ·{" "}
                      {progress.completed
                        ? "手动标记已读完"
                        : `已浏览 ${progress.percent}%`}
                    </p>
                    <time dateTime={new Date(progress.updatedAt).toISOString()}>
                      {new Intl.DateTimeFormat("zh-CN", {
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Asia/Shanghai",
                      }).format(progress.updatedAt)}
                    </time>
                  </div>
                  <ArrowUpRight size={18} />
                </Link>
              ))
            ) : (
              <div className="history-empty">
                尚无记录。访问任意样章后，将在这里显示。
              </div>
            )}
          </section>
        </section>
        <aside className="dashboard-aside">
          <div className="panel course-progress-summary">
            <BookOpen size={23} />
            <h3>各课程的可读样章</h3>
            <p>只统计当前可读教材，完整课程仍在筹备中。</p>
            {courseGroups.map((course) => (
              <div className="course-progress-row" key={course.courseId}>
                <Link href={`/courses/${course.courseId}`}>{course.name}</Link>
                <span>
                  {course.completed} / {course.available} 节已标记读完
                </span>
                <div
                  role="progressbar"
                  aria-label={`${course.name}的可读样章阅读比例`}
                  aria-valuenow={course.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <i style={{ width: `${course.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="panel">
            <Route size={25} />
            <span className="eyebrow">A CLEARER DIRECTION</span>
            <h3>下一步，去向哪里？</h3>
            <p>从已有基础出发，查看编程、机器学习与专业方向的推荐先修关系。</p>
            <Link href="/paths" className="text-link">
              探索学习路径
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="panel dashboard-note">
            <HardDrive size={21} />
            <h3>关于这里的记录</h3>
            <p>
              记录仅保存在当前浏览器，不跨设备同步。更换浏览器或清除站点数据后，记录可能丢失。
            </p>
            <p>
              浏览器限制保存时，记录仅在本次访问期间有效。浏览比例与读完标记不代表已经掌握课程。更新教材后，新修订会独立记录进度。
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
