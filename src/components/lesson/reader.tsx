"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ListTree,
  Target,
  CheckCircle2,
  FlaskConical,
  Layers3,
  Clock3,
} from "lucide-react";
import {
  publicationLabel,
  publicationNotice,
  type Course,
  type Chapter,
  type Lesson,
  type Publication,
} from "@/content/models";
import { Drawer, useToast } from "../ui";
import {
  learningProgressStore,
  lessonProgressScope,
  useLessonProgress,
} from "@/lib/use-learning-progress";
import {
  LessonHeading,
  LearningObjectives,
  ProgressRing,
  LessonNavigation,
} from "./blocks";
import { ChapterToc } from "./chapter-toc";
import { ContentRenderer, ResourceDownloads } from "./content-renderer";
import "katex/dist/katex.min.css";

type ReaderProps = {
  course: Course;
  chapter: Chapter;
  lesson: Lesson;
  publication: Publication;
  adjacent: { previous?: Publication; next?: Publication };
};
export function Reader({
  course,
  chapter,
  lesson,
  publication,
  adjacent,
}: ReaderProps) {
  const firstSection = lesson.sections[0].id;
  const [active, setActive] = useState(firstSection);
  const [progress, setProgress] = useState(0);
  const scope = useMemo(() => lessonProgressScope(lesson), [lesson]);
  const saved = useLessonProgress(scope);
  const completed = saved?.completed ?? false;
  const displayProgress = Math.max(progress, saved?.percent ?? 0);
  const latest = useRef({ percent: 0, section: firstSection });
  const [tocOpen, setTocOpen] = useState(false);
  const pendingSection = useRef<string | null>(null);
  const article = useRef<HTMLElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const toast = useToast();
  const activeGroup = lesson.sections.find((s) => s.id === active)?.navGroup;
  const groups = lesson.sections.filter(
    (section, index, sections) =>
      sections.findIndex((s) => s.navGroup === section.navGroup) === index,
  );
  const blocks = lesson.sections.flatMap((s) => s.blocks);
  const quizCount = blocks.filter((b) => b.type === "quiz").length;
  const experimentCount = blocks.filter((b) => b.type === "experiment").length;

  function navigate(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    window.history.replaceState(null, "", `#${sectionId}`);
    section.scrollIntoView({
      block: "start",
      behavior: reduce ? "instant" : "smooth",
    });
    section.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  }
  useEffect(() => {
    const rail = sidebar.current?.querySelector<HTMLElement>(".chapter-toc");
    const current = rail?.querySelector<HTMLElement>(
      '[aria-current="location"]',
    );
    if (!rail || !current || rail.getBoundingClientRect().height === 0) return;
    const railRect = rail.getBoundingClientRect(),
      itemRect = current.getBoundingClientRect();
    if (itemRect.bottom > railRect.bottom - 32)
      rail.scrollTo({
        top: rail.scrollTop + itemRect.bottom - railRect.bottom + 48,
        behavior: reduce ? "instant" : "smooth",
      });
    else if (itemRect.top < railRect.top + 20)
      rail.scrollTo({
        top: rail.scrollTop + itemRect.top - railRect.top - 36,
        behavior: reduce ? "instant" : "smooth",
      });
  }, [active, reduce]);
  useEffect(() => {
    latest.current = { percent: progress, section: active };
    const timer = window.setTimeout(
      () => learningProgressStore.save(scope, progress, active),
      450,
    );
    return () => window.clearTimeout(timer);
  }, [progress, active, scope]);
  useEffect(() => {
    const flush = () =>
      learningProgressStore.save(
        scope,
        latest.current.percent,
        latest.current.section,
      );
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [scope]);
  useEffect(() => {
    let frame = 0;
    const sections = Array.from(
      article.current?.querySelectorAll<HTMLElement>(".lesson-section") ?? [],
    );
    const update = () => {
      if (!article.current) return;
      const rect = article.current.getBoundingClientRect();
      const available = rect.height - innerHeight + 130;
      setProgress(
        Math.round(
          Math.max(
            0,
            Math.min(100, ((-rect.top + 115) / Math.max(available, 1)) * 100),
          ),
        ),
      );
      const navigation = document.querySelector(".reader-section-nav");
      const checkpoint = navigation
        ? Math.max(190, navigation.getBoundingClientRect().bottom + 36)
        : 190;
      const current = sections.findLast(
        (section) => section.getBoundingClientRect().top <= checkpoint,
      );
      setActive(current?.id ?? firstSection);
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [firstSection]);

  const goals = (
    <>
      <h3>
        <Target size={16} />
        本节学习目标
      </h3>
      <LearningObjectives objectives={lesson.objectives} />
    </>
  );
  return (
    <div className="reader-layout reader-v2">
      <div className="reading-progress-track" aria-hidden="true">
        <div style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <div className="reader-contextbar">
        <div className="reader-breadcrumb">
          <Link href="/courses">课程体系</Link>
          <ChevronRight size={11} />
          <Link href={`/courses/${course.id}`}>{course.name}</Link>
          <ChevronRight size={11} />
          <span>
            第 {chapter.order} 章 · {chapter.title}
          </span>
        </div>
      </div>
      <aside className="reader-sidebar" ref={sidebar}>
        <ChapterToc
          course={course}
          lesson={lesson}
          active={active}
          onNavigate={navigate}
        />
      </aside>
      <div className="reader-main">
        <div className="reader-mobile-bar">
          <Drawer
            title="课程章节与本节目录"
            open={tocOpen}
            onOpenChange={setTocOpen}
            onCloseAutoFocus={(event) => {
              const sectionId = pendingSection.current;
              if (!sectionId) return;
              event.preventDefault();
              pendingSection.current = null;
              requestAnimationFrame(() => navigate(sectionId));
            }}
            trigger={
              <button className="button button-small button-secondary">
                <ListTree size={15} />
                章节目录
              </button>
            }
          >
            <ChapterToc
              course={course}
              lesson={lesson}
              active={active}
              onNavigate={(sectionId) => {
                pendingSection.current = sectionId;
                setTocOpen(false);
              }}
            />
          </Drawer>
          <Drawer
            title="本节进度与目标"
            trigger={
              <button className="button button-small button-secondary">
                <Target size={15} />
                进度与目标
              </button>
            }
          >
            <ProgressRing value={completed ? 100 : displayProgress} />
            {goals}
            <p className="reader-local-note">
              阅读记录仅保存在当前浏览器，不跨设备同步。
            </p>
          </Drawer>
        </div>
        <header className="reader-heading">
          <span className="eyebrow">LEARN THROUGH UNDERSTANDING</span>
          <div className="reader-chapter-line">
            <span>第 {chapter.order} 章</span>
            <span>{chapter.title}</span>
          </div>
          <div className="reader-title-row">
            <h1>{lesson.title}</h1>
            <span className="sample-badge">
              {publicationLabel(publication)}
            </span>
          </div>
          <p>{lesson.subtitle}</p>
          <div className="reader-meta">
            <span>
              <BookOpen size={14} />
              图文教程
            </span>
            <span>
              {course.lvl} · {course.direction}
            </span>
            <span>
              <Clock3 size={14} />约 {lesson.durationMinutes} 分钟
            </span>
            {quizCount > 0 && (
              <span>
                <CheckCircle2 size={14} />
                {quizCount} 道自查题
              </span>
            )}
            {experimentCount > 0 && (
              <span>
                <FlaskConical size={14} />
                {experimentCount} 个交互实验
              </span>
            )}
          </div>
          {saved && saved.percent > 0 && (
            <a
              className="reader-resume text-link"
              href={`#${saved.section}`}
              onClick={(event) => {
                event.preventDefault();
                navigate(saved.section);
              }}
            >
              回到上次位置
              <ArrowRight size={14} />
            </a>
          )}
        </header>
        <nav className="reader-section-nav" aria-label="本节内容导航">
          {groups.map((section) => (
            <a
              key={section.navGroup}
              href={`#${section.id}`}
              className={activeGroup === section.navGroup ? "active" : ""}
              aria-current={
                activeGroup === section.navGroup ? "location" : undefined
              }
              onClick={(event) => {
                event.preventDefault();
                navigate(section.id);
              }}
            >
              {section.navLabel}
            </a>
          ))}
        </nav>
        <div className="demo-content-note">
          {publicationNotice(publication)}
        </div>
        <article ref={article} className="lesson-content">
          {lesson.sections.map((section, index) => (
            <section
              key={section.id}
              className="lesson-section"
              id={section.id}
            >
              <LessonHeading index={index + 1}>{section.title}</LessonHeading>
              <div
                className={
                  section.layout === "intro"
                    ? "lesson-intro-grid"
                    : "lesson-section-body"
                }
              >
                {section.blocks.map((block, blockIndex) => (
                  <div
                    className={`lesson-block lesson-block-${block.type}`}
                    key={blockIndex}
                  >
                    <ContentRenderer
                      block={block}
                      resources={lesson.resources}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </article>
        <section
          className="lesson-references"
          aria-labelledby="lesson-reference-title"
        >
          <h2 id="lesson-reference-title">参考与进一步阅读</h2>
          <p>
            正文、练习与示意图为原创教学材料。以下官方资料用于核对定义与行为。
          </p>
          <ul>
            {lesson.references.map((reference) => (
              <li key={reference.href}>
                <a href={reference.href} target="_blank" rel="noreferrer">
                  {reference.title}
                  <ArrowRight size={14} />
                </a>
                <p>{reference.note}</p>
              </li>
            ))}
          </ul>
        </section>
        <ResourceDownloads resources={lesson.resources} />
        <div className="lesson-completion">
          <p>阅读比例帮助安排学习，不代表已经掌握。</p>
          <button
            className={`button ${completed ? "button-secondary" : "button-primary"}`}
            onClick={() => {
              const persisted = learningProgressStore.save(
                scope,
                100,
                active,
                true,
              );
              toast(
                persisted
                  ? "本节已读完，进度已保存在当前浏览器"
                  : "已标记读完；浏览器无法长期保存，记录仅保留在本次访问",
              );
            }}
          >
            <CheckCircle2 size={16} />
            {completed ? "本节已读完" : "标记本节已读完"}
          </button>
        </div>
        <LessonNavigation {...adjacent} />
        <div className="reader-end">
          <Link href={`/courses/${course.id}`}>
            查看课程详情
            <ArrowRight size={14} />
          </Link>
          <Link href="/dashboard">
            返回学习中心
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      <aside className="reader-right">
        <div className="reader-info-panel">
          <span className="eyebrow">YOUR LEARNING JOURNEY</span>
          <h3>本节阅读进度</h3>
          <div className="reader-progress">
            <ProgressRing value={completed ? 100 : displayProgress} />
            <div>
              <strong>{completed ? "已读完" : "在理解中前进"}</strong>
              <span>当前课时 · 独立记录</span>
            </div>
          </div>
          <div className="local-status">
            <i className="status-dot" />
            仅当前浏览器保存 · 不跨设备同步
          </div>
        </div>
        <div className="reader-info-panel">{goals}</div>
        <div className="reader-outline-panel">
          <h3>
            <Layers3 size={16} />
            本节内容地图
          </h3>
          <nav aria-label="本节段落">
            {lesson.sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={active === section.id ? "active" : ""}
                aria-current={active === section.id ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(section.id);
                }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </a>
            ))}
          </nav>
        </div>
        <details className="reader-knowledge" open>
          <summary>
            <span>
              <BookOpen size={15} />
              先修知识提示
            </span>
            <ChevronDown size={15} />
          </summary>
          <p>{lesson.prerequisites}</p>
          <Link href={`/courses/${course.id}`} className="text-link">
            查看完整先修要求
            <ArrowRight size={12} />
          </Link>
        </details>
      </aside>
    </div>
  );
}
