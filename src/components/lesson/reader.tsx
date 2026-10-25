"use client";
import { memo, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Download,
  ListTree,
  LockKeyhole,
  Target,
  CheckCircle2,
  Code2,
  Sigma,
  FlaskConical,
  Layers3,
} from "lucide-react";
import { getCourse } from "@/lib/curriculum";
import { sampleLesson, type LessonBlock } from "@/content/sample";
import { Drawer, useToast } from "../ui";
import { useLocalProgress, saveLocalProgress } from "@/lib/use-progress";
import { CourseArt } from "../course-card";
import {
  LessonHeading,
  Paragraph,
  LearningObjectives,
  InfoCallout,
  MathBlock,
  DiagramCard,
  RegressionDiagram,
  CodeBlock,
  QuizBlock,
  RegressionExperiment,
  ProgressRing,
  LessonNavigation,
} from "./blocks";
import "katex/dist/katex.min.css";

const RenderBlock = memo(function RenderBlock({
  block,
}: {
  block: LessonBlock;
}) {
  switch (block.type) {
    case "paragraph":
      return <Paragraph>{block.text}</Paragraph>;
    case "callout":
      return <InfoCallout title={block.title}>{block.text}</InfoCallout>;
    case "math":
      return <MathBlock latex={block.latex} explanation={block.explanation} />;
    case "diagram":
      return (
        <DiagramCard caption="合成数据示例：y = 2x + 1。">
          <RegressionDiagram />
        </DiagramCard>
      );
    case "code":
      return <CodeBlock code={block.code} />;
    case "experiment":
      return <RegressionExperiment />;
    case "quiz":
      return <QuizBlock block={block} />;
    case "summary":
      return (
        <ul className="lesson-summary">
          {block.points.map((point) => (
            <li key={point}>
              <CheckCircle2 size={16} />
              {point}
            </li>
          ))}
        </ul>
      );
  }
});
export function ChapterToc({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate?: (sectionId: string) => void;
}) {
  const course = getCourse("ML201")!;
  return (
    <>
      <Link href="/courses/ML201" className="text-link reader-back">
        <ArrowLeft size={14} />
        返回课程详情
      </Link>
      <div className="toc-course">
        <div className="toc-course-cover">
          <CourseArt course={course} compact />
        </div>
        <div className="toc-course-copy">
          <span className="toc-course-level">L2 · 机器学习</span>
          <h2>
            机器学习基础：
            <br />
            监督学习
          </h2>
          <span className="subtle-tag">课程筹备中 · 本节可试读</span>
        </div>
      </div>
      <nav className="chapter-toc" aria-label="章节目录">
        {course.chapters.map((chapter, i) => (
          <details key={chapter} open={i === 3 ? true : undefined}>
            <summary>
              <ChevronRight size={13} />
              <span className="toc-chapter-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{chapter.replace(/^\d+\s/, "")}</span>
              {i !== 3 && <LockKeyhole size={11} />}
            </summary>
            {i === 3 ? (
              <div className="lesson-toc-items">
                <span className="toc-sample-label">
                  试读 · 线性回归与梯度下降
                </span>
                {sampleLesson.sections.map((section, index) => (
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
              <p className="toc-planned">本章内容尚未开放。</p>
            )}
          </details>
        ))}
      </nav>
      <p className="toc-footnote">
        本课程正在筹备，目前仅本节样章可试读。
      </p>
    </>
  );
}
export function Reader() {
  const [active, setActive] = useState("intuition"),
    [progress, setProgress] = useState(0);
  const saved = useLocalProgress();
  const completed = saved?.completed ?? false;
  const displayProgress = Math.max(progress, saved?.percent ?? 0);
  const latest = useRef({ percent: 0, section: "intuition" });
  const [tocOpen, setTocOpen] = useState(false);
  const pendingSection = useRef<string | null>(null);
  const article = useRef<HTMLElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const toast = useToast();
  const activeNav =
    active === "gradient" ? "loss" : active === "summary" ? "quiz" : active;
  useEffect(() => {
    const rail = sidebar.current;
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
      () => saveLocalProgress(progress, active),
      450,
    );
    return () => window.clearTimeout(timer);
  }, [progress, active]);
  useEffect(() => {
    const flush = () =>
      saveLocalProgress(latest.current.percent, latest.current.section);
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, []);
  useEffect(() => {
    let frame = 0;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".lesson-section"),
    );
    const update = () => {
      if (!article.current) return;
      const rect = article.current.getBoundingClientRect();
      const available = rect.height - innerHeight + 130;
      setProgress(
        Math.max(
          0,
          Math.min(100, ((-rect.top + 115) / Math.max(available, 1)) * 100),
        ),
      );
      const navigation = document.querySelector(".reader-section-nav");
      const checkpoint = navigation
        ? Math.max(190, navigation.getBoundingClientRect().bottom + 36)
        : 190;
      const current = sections.findLast(
        (section) => section.getBoundingClientRect().top <= checkpoint,
      );
      setActive(current?.id ?? "intuition");
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
  }, []);
  const goals = (
    <>
      <h3>
        <Target size={16} />
        本节学习目标
      </h3>
      <LearningObjectives objectives={sampleLesson.objectives} />
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
          <Link href="/courses/ML201">监督学习</Link>
          <ChevronRight size={11} />
          <span>第 04 章 · 梯度下降</span>
        </div>
      </div>
      <aside className="reader-sidebar" ref={sidebar}>
        <ChapterToc active={active} />
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
              requestAnimationFrame(() => {
                const section = document.getElementById(sectionId);
                if (!section) return;
                window.history.replaceState(null, "", `#${sectionId}`);
                section.scrollIntoView({
                  block: "start",
                  behavior: reduce ? "instant" : "smooth",
                });
                section
                  .querySelector<HTMLElement>("h2")
                  ?.focus({ preventScroll: true });
              });
            }}
            trigger={
              <button className="button button-small button-secondary">
                <ListTree size={15} />
                章节目录
              </button>
            }
          >
            <ChapterToc
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
            <p className="reader-local-note">阅读记录仅保存在当前浏览器，不跨设备同步。</p>
          </Drawer>
        </div>
        <header className="reader-heading">
          <span className="eyebrow">UNDERSTAND THE FIRST PRINCIPLE</span>
          <div className="reader-chapter-line">
            <span>第 4 章</span>
            <span>从零实现线性回归</span>
          </div>
          <div className="reader-title-row">
            <h1>{sampleLesson.title}</h1>
            <span className="sample-badge">试读样章</span>
          </div>
          <p>{sampleLesson.subtitle}</p>
          <div className="reader-meta">
            <span>
              <BookOpen size={14} />
              图文教程
            </span>
            <span>难度 L2 · 机器学习</span>
            <span>
              <CheckCircle2 size={14} />2 道自查题
            </span>
            <span>
              <FlaskConical size={14} />1 个交互实验
            </span>
          </div>
        </header>
        <div className="reader-section-nav" aria-label="本节内容导航">
          <a
            href="#intuition"
            className={activeNav === "intuition" ? "active" : ""}
            aria-current={activeNav === "intuition" ? "location" : undefined}
          >
            <BookOpen size={14} />
            概念
          </a>
          <a
            href="#loss"
            className={activeNav === "loss" ? "active" : ""}
            aria-current={activeNav === "loss" ? "location" : undefined}
          >
            <Sigma size={15} />
            <span>公式</span>
          </a>
          <a
            href="#experiment"
            className={activeNav === "experiment" ? "active" : ""}
            aria-current={activeNav === "experiment" ? "location" : undefined}
          >
            <FlaskConical size={14} />
            <span>实验</span>
          </a>
          <a
            href="#code"
            className={activeNav === "code" ? "active" : ""}
            aria-current={activeNav === "code" ? "location" : undefined}
          >
            <Code2 size={15} />
            <span>代码</span>
          </a>
          <a
            href="#quiz"
            className={activeNav === "quiz" ? "active" : ""}
            aria-current={activeNav === "quiz" ? "location" : undefined}
          >
            <CheckCircle2 size={14} />
            练习
          </a>
        </div>
        <div className="demo-content-note">
          本节为试读样章，完整课程尚未正式发布。
        </div>
        <article ref={article} className="lesson-content">
          {sampleLesson.sections.map((section, i) => (
            <section
              key={section.id}
              className="lesson-section"
              id={section.id}
            >
              <LessonHeading index={i + 1}>{section.title}</LessonHeading>
              <div
                className={
                  section.id === "intuition"
                    ? "lesson-intro-grid"
                    : "lesson-section-body"
                }
              >
                {section.blocks.map((block, j) => (
                  <div
                    className={`lesson-block lesson-block-${block.type}`}
                    key={j}
                  >
                    <RenderBlock block={block} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </article>
        <div className="lesson-downloads">
          <div>
            <Download size={20} />
            <span>
              把实验带到自己的环境
              <small>完整 Python 源码与 Notebook · 仅需 NumPy</small>
            </span>
          </div>
          <div>
            <a
              href="/downloads/linear_regression.py"
              download
              className="button button-small button-secondary"
            >
              Python 源码
              <Download size={14} />
            </a>
            <a
              href="/downloads/linear_regression.ipynb"
              download
              className="button button-small button-secondary"
            >
              Notebook
              <Download size={14} />
            </a>
          </div>
        </div>
        <div className="lesson-completion">
          <p>理解源于反复思考，也源于亲自实践。</p>
          <button
            className={`button ${completed ? "button-secondary" : "button-primary"}`}
            onClick={() => {
              const persisted = saveLocalProgress(100, active, true);
              toast(
                persisted
                  ? "本节已读完，进度已保存在当前浏览器"
                  : "已标记读完；当前浏览器无法长期保存，记录仅保留到本次访问结束",
              );
            }}
          >
            <CheckCircle2 size={16} />
            {completed ? "本节已读完" : "标记本节已读完"}
          </button>
        </div>
        <LessonNavigation />
        <div className="reader-end">
          <Link href="/courses/ML201">
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
              <span>试读样章 · 1 节</span>
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
            {sampleLesson.sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={active === section.id ? "active" : ""}
                aria-current={active === section.id ? "location" : undefined}
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
              <LightbulbIcon />
              先修知识提示
            </span>
            <ChevronDown size={15} />
          </summary>
          <p>
            Python 数组与函数、基础导数与偏导、NumPy
            广播。本节使用一维合成数据，聚焦损失与更新过程。
          </p>
          <Link href="/courses/ML201" className="text-link">
            查看完整先修要求
            <ArrowRight size={12} />
          </Link>
        </details>
      </aside>
    </div>
  );
}
function LightbulbIcon() {
  return <BookOpen size={15} />;
}
