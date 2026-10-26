"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  ListTree,
  Target,
  CheckCircle2,
  FlaskConical,
} from "lucide-react";
import {
  publicationLabel,
  publicationNotice,
  type Course,
  type Chapter,
  type Lesson,
  type Publication,
  type LessonSummary,
} from "@/content/models";
import { Drawer, useToast } from "../ui";
import {
  learningProgressStore,
  lessonProgressScope,
  useLessonProgress,
} from "@/lib/use-learning-progress";
import {
  LessonNavigation,
} from "./blocks";
import { ArticleContents } from "./article-contents";
import { ChapterToc } from "./chapter-toc";
import { ResourceDownloads } from "./content-renderer";
import { TeachingSection } from "./teaching-section";
import { LearningTime, LearningPanel, Glossary } from "./learning-support";
import "katex/dist/katex.min.css";
import {
  chapterNumber,
  lessonNumber,
} from "@/lib/course-numbering";

type ReaderProps = {
  course: Course;
  chapter: Chapter;
  lesson: Lesson;
  publication: Publication;
  progressLessons: LessonSummary[];
  adjacent: {
    previous?: Publication & { displayNumber?: string };
    next?: Publication & { displayNumber?: string };
  };
};
export function Reader({
  course,
  chapter,
  lesson,
  publication,
  adjacent,
  progressLessons,
}: ReaderProps) {
  const firstSection = lesson.sections[0].id;
  const legacy = publication.catalogRole === "legacy";
  const displayNumber = legacy
    ? undefined
    : lessonNumber(chapter.order, publication.order);
  const [active, setActive] = useState(firstSection);
  const [progress, setProgress] = useState(0);
  const scope = useMemo(() => lessonProgressScope(lesson), [lesson]);
  const saved = useLessonProgress(scope);
  const completed = saved?.completed ?? false;
  const displayProgress = Math.max(progress, saved?.percent ?? 0);
  const latest = useRef({ percent: 0, section: firstSection });
  const [tocOpen, setTocOpen] = useState(false);
  const [articleOpen, setArticleOpen] = useState(false);
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

  function navigate(targetId: string) {
    window.history.replaceState(null, "", `#${targetId}`);
    const reduceMotion = reduce || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    revealTarget(targetId, reduceMotion ? "instant" : "smooth");
  }
  useEffect(() => {
    const reveal = () => {
      let hash = window.location.hash.slice(1);
      try { hash = decodeURIComponent(hash); } catch { return; }
      if (hash === "assessment-title" && window.matchMedia("(max-width: 1399px)").matches) {
        setArticleOpen(true);
        return;
      }
      revealTarget(hash, "instant");
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, [lesson.id]);
  useEffect(() => {
    const rail = sidebar.current?.querySelector<HTMLElement>(".chapter-toc");
    const current = rail?.querySelector<HTMLElement>(
      '[aria-current="page"]',
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
  }, [lesson.id, reduce]);
  useEffect(() => {
    latest.current = { percent: progress, section: active };
    // 无 hash 重开页面时仍在标题区，不能把旧书签覆盖成首段。
    if (progress === 0 && active === firstSection) return;
    const timer = window.setTimeout(
      () => learningProgressStore.save(scope, progress, active),
      450,
    );
    return () => window.clearTimeout(timer);
  }, [progress, active, firstSection, scope]);
  useEffect(() => {
    const flush = () => {
      if (latest.current.percent === 0 && latest.current.section === firstSection) return;
      learningProgressStore.save(
        scope,
        latest.current.percent,
        latest.current.section,
      );
    };
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [firstSection, scope]);
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
    const currentArticle = article.current;
    currentArticle?.addEventListener("toggle", onScroll, true);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      currentArticle?.removeEventListener("toggle", onScroll, true);
      cancelAnimationFrame(frame);
    };
  }, [firstSection]);

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
          <Link href={`/courses/${course.id}#${chapter.id}`}>
            {chapterNumber(chapter.order)}
          </Link>
          <ChevronRight size={11} />
          <span>{displayNumber ?? "旧版试读"}</span>
        </div>
      </div>
      <aside className="reader-sidebar" ref={sidebar}>
        <ChapterToc
          course={course}
          lesson={lesson}
          progressLessons={progressLessons}
        />
      </aside>
      <div className="reader-main">
        <div className="reader-mobile-bar">
          <Drawer
            title="课程章节与独立课时"
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
            <ChapterToc course={course} lesson={lesson} progressLessons={progressLessons} />
          </Drawer>
          <Drawer
            title="本节导航"
            className="reader-learning-drawer"
            open={articleOpen}
            onOpenChange={setArticleOpen}
            onCloseAutoFocus={(event) => {
              const target = pendingSection.current;
              if (!target) return;
              event.preventDefault();
              pendingSection.current = null;
              requestAnimationFrame(() => navigate(target));
            }}
            trigger={
              <button className="button button-small button-secondary">
                <Target size={15} />
                本节导航
              </button>
            }
          >
            <div className="reader-drawer-scroll">
              <ArticleContents lesson={lesson} active={active} collapsible onNavigate={(id) => { pendingSection.current = id; setArticleOpen(false); }} />
              <LearningPanel lesson={lesson} progress={displayProgress} completed={completed} onNavigate={(id) => { pendingSection.current = id; setArticleOpen(false); }} />
            </div>
          </Drawer>
        </div>
        <header className="reader-heading">
          <span className="eyebrow">LEARN THROUGH UNDERSTANDING</span>
          <div className="reader-chapter-line">
            <span>
              {chapterNumber(chapter.order)}
              {displayNumber ? ` · ${displayNumber}` : " · 旧版试读"}
            </span>
            <span>{chapter.title}</span>
          </div>
          <div className="reader-title-row">
            <h1>{lesson.title}</h1>
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
            <span className="sample-badge">{publicationLabel(publication)}</span>
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
          <LearningTime time={lesson.learningTime} optional={lesson.optionalLesson} codingOptional={lesson.sections.some((s) => s.blocks.some((b) => b.type === "code")) && lesson.sections.filter((s) => s.blocks.some((b) => b.type === "code")).every((s) => s.tier !== "core")} />
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
        {lesson.optionalLesson && <p className="demo-content-note">本节整体为可选进阶，不作为基础课程达标条件。</p>}
        {course.lvl !== "L0" && (lesson.courseId !== "MA101" || legacy) && <Glossary />}
        {(lesson.id === "PY101-C05-L01" || lesson.id === "MA101-C03-L01") && <p className="assessment-note">本节已按 V2.1 细分。既有书签与阅读历史保留；旧“已读完”不代表新增目标已达标，可从学习面板进入练习自查。</p>}
        {legacy && (
          <aside className="legacy-reading-note">
            <strong>旧版教材试读</strong>
            <p>
              本页保留原有正文、书签和阅读记录，文中节号沿用旧编排。新版使用独立课时与新 ID；这里的“已读完”不代表新版课时完成。
            </p>
            <Link
              href={
                course.chapters.flatMap((c) => c.lessons).find((l) => l.href)
                  ?.href ?? `/courses/${course.id}`
              }
            >
              从新版课程开始
              <ArrowRight size={14} />
            </Link>
          </aside>
        )}
        <article ref={article} className="lesson-content">
          {lesson.sections.map((section) => (
            <TeachingSection key={section.id} section={section} resources={lesson.resources} />
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
      <aside className="reader-right" id="assessment-title" aria-label="本节学习面板">
        <LearningPanel lesson={lesson} progress={displayProgress} completed={completed} onNavigate={navigate} />
      </aside>
    </div>
  );
}

// 练习可能在可选折叠内；点击、Drawer 和旧书签共用同一路径。
function revealTarget(targetId: string, behavior: ScrollBehavior) {
  const target = document.getElementById(targetId);
  if (!target) return;
  let parent: HTMLElement | null = target;
  while (parent) {
    if (parent instanceof HTMLDetailsElement) parent.open = true;
    parent = parent.parentElement;
  }
  target.querySelector<HTMLDetailsElement>("details.lesson-optional")?.setAttribute("open", "");
  requestAnimationFrame(() => {
    target.scrollIntoView({ block: "start", behavior });
    const heading = target.matches("h2, h3") ? target : target.querySelector<HTMLElement>("h2, h3");
    heading?.focus({ preventScroll: true });
  });
}
