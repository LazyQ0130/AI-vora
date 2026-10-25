"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Code2,
  Sigma,
  Boxes,
  Layers3,
  Route,
  Check,
  Compass,
  Network,
  BrainCircuit,
  Sparkles,
  Workflow,
  CornerDownRight,
} from "lucide-react";
import {
  courses,
  firstRelease,
  levels,
  levelNames,
  SAMPLE_URL,
} from "@/lib/curriculum";
import { CourseCard } from "./course-card";
import { getCourseDisplayName } from "@/lib/course-presentation";
import { Reveal, SectionTitle } from "./ui";
import { HeroArt } from "./hero-art";

const steps = [Compass, Code2, Network, BrainCircuit, Sparkles, Workflow];
export function Home() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 65, damping: 22 }),
    sy = useSpring(y, { stiffness: 65, damping: 22 });
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <section
        className="hero hero-v2"
        ref={ref}
        onPointerMove={(event) => {
          if (reduce || event.pointerType !== "mouse") return;
          const box = ref.current?.getBoundingClientRect();
          if (box) {
            x.set((event.clientX - box.left - box.width / 2) / 55);
            y.set((event.clientY - box.top - box.height / 2) / 65);
          }
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        <div className="hero-stars" />
        <motion.div className="hero-art" style={{ x: sx, y: sy }}>
          <HeroArt />
          <div className="orbit-tag tag-top">
            <i className="status-dot" />
            KNOWLEDGE, CONNECTED.
          </div>
          <div className="orbit-tag tag-bottom">
            <Compass className="hero-tag-icon" size={26} strokeWidth={1.4} />
            <span>
              从一个问题出发<small>抵达更广阔的技术世界</small>
            </span>
            <ArrowUpRight size={17} />
          </div>
        </motion.div>
        <div className="container hero-inner">
          <Reveal className="hero-copy">
            <span className="hero-label">
              <span className="label-dot" />
              SYSTEMATIC LEARNING. REAL UNDERSTANDING.
            </span>
            <h1>
              让 AI 知识，
              <br />
              成为<span className="gradient-text">可掌握的未来。</span>
            </h1>
            <p className="hero-description">
              从第一行 Python，到理解智能背后的原理。
              <br />
              沿着清晰的知识路径，在阅读、推导与实践中，
              <br className="desktop-break" />
              构建属于你的 AI 技术能力。
            </p>
            <div className="hero-buttons">
              <Link className="button button-primary" href="/courses">
                探索课程体系
                <ArrowRight size={17} />
              </Link>
              <Link className="button button-secondary" href={SAMPLE_URL}>
                <BookOpen size={17} />
                阅读样章
              </Link>
            </div>
            <div className="hero-note">
              <span>
                <Check size={13} />
                理论与实践并重
              </span>
              <span>
                <Check size={13} />
                按先修能力进阶
              </span>
            </div>
          </Reveal>
          <div className="hero-bottom">
            <span>LEARN WITH PURPOSE. BUILD WITH CONFIDENCE.</span>
            <span className="scroll-hint">
              向下探索
              <div />
            </span>
            <span>01 — EXPLORE</span>
          </div>
        </div>
      </section>
      <div className="container">
        <Reveal className="principle-strip">
          <div>
            <Layers3 />
            <span>
              <strong>{courses.length} 门</strong>
              <small>体系规划课程</small>
            </span>
          </div>
          <div>
            <Route />
            <span>
              <strong>L0 — L5</strong>
              <small>六级能力进阶</small>
            </span>
          </div>
          <div>
            <BookOpen />
            <span>
              <strong>图文 × 代码</strong>
              <small>让理解真正发生</small>
            </span>
          </div>
          <div>
            <Compass />
            <span>
              <strong>循序，亦可自选</strong>
              <small>从你的基础出发</small>
            </span>
          </div>
        </Reveal>
        <section className="home-section path-section">
          <SectionTitle
            eyebrow="A CONNECTED LEARNING JOURNEY"
            title="每一步，都通向更完整的理解。"
            description="从认知到研究，让分散的知识连成一张地图。"
            href="/paths"
            linkText="探索学习路径"
          />
          <div className="level-journey">
            {levels.map((level, i) => {
              const Icon = steps[i];
              return (
                <Reveal key={level} delay={i * 0.055}>
                  <Link
                    href={`/courses?level=${level}`}
                    className={`journey-node journey-${i}`}
                  >
                    <span className="journey-level">
                      {level}
                      <ArrowUpRight size={13} />
                    </span>
                    <span className="journey-icon">
                      <Icon size={25} strokeWidth={1.4} />
                    </span>
                    <h3>{levelNames[i]}</h3>
                    <span className="journey-caption">
                      {
                        [
                          "建立技术地图",
                          "编程 · 数学 · 数据",
                          "建模 · 评估 · 实验",
                          "神经网络 · 核心架构",
                          "语言 · 视觉 · 生成",
                          "系统交付 · 科研复现",
                        ][i]
                      }
                    </span>
                    <span className="journey-count">
                      {courses.filter((c) => c.lvl === level).length} 门规划课程
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
        <section className="home-section method-section">
          <SectionTitle
            eyebrow="UNDERSTAND. IMPLEMENT. THINK."
            title="不止知道，更要真正理解。"
            description="用适合技术学习的方式，一层一层接近问题的本质。"
          />
          <div className="method-grid">
            {[
              {
                icon: BookOpen,
                name: "图文精读",
                en: "READ & UNDERSTAND",
                text: "清晰的文字、直观的图解，让抽象概念有迹可循。",
                sample: "从概念到直觉",
                cls: "cyan",
              },
              {
                icon: Sigma,
                name: "数学推导",
                en: "REASON & DERIVE",
                text: "保留必要的数学严谨性，理解公式背后的每一步。",
                sample: "ŷ = wx + b",
                cls: "purple",
              },
              {
                icon: Code2,
                name: "代码实践",
                en: "CODE & EXPERIMENT",
                text: "可复制的代码与下载式实验，在自己的环境里动手。",
                sample: "import numpy as np",
                cls: "blue",
              },
              {
                icon: Boxes,
                name: "项目验证",
                en: "BUILD & REFLECT",
                text: "用实验、对照与分析，把学到的知识变成可复现的作品。",
                sample: "问题 → 实验 → 复盘",
                cls: "mint",
              },
            ].map((item) => (
              <Reveal key={item.name}>
                <Link
                  href={item.name === "项目验证" ? "/projects" : SAMPLE_URL}
                  className={`method-card ${item.cls}`}
                >
                  <div className="method-top">
                    <item.icon size={25} strokeWidth={1.4} />
                    <ArrowUpRight size={15} />
                  </div>
                  <div className="method-sample">{item.sample}</div>
                  <span className="method-en">{item.en}</span>
                  <h3>{item.name}</h3>
                  <p>{item.text}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="home-section">
          <SectionTitle
            eyebrow="THE FIRST CHAPTER"
            title="从这里，开启你的 AI 学习旅程。"
            description="从 AI 认知、编程与数学出发，循序建立机器学习基础。"
            href="/courses"
            linkText="浏览 20 门规划课程"
          />
          <div className="featured-grid">
            {firstRelease
              .filter((c) => c.id !== "DS101")
              .map((course, i) => (
                <Reveal key={course.id} delay={i * 0.04}>
                  <CourseCard course={course} featured />
                </Reveal>
              ))}
          </div>
          <div className="release-route" aria-label="推荐起步课程顺序">
            <span>推荐起步顺序</span>
            {firstRelease.map((course, index) => (
              <span key={course.id}>
                <Link href={`/courses/${course.id}`}>{getCourseDisplayName(course.id)}</Link>
                {index < firstRelease.length - 1 && <ArrowRight size={11} />}
              </span>
            ))}
          </div>
          <p className="section-footnote">
            <i className="status-dot" />
            课程正在筹备中，可先试读《线性回归与梯度下降》。
          </p>
        </section>
        <section className="home-section">
          <Reveal className="sample-banner">
            <div className="sample-banner-copy">
              <span className="eyebrow">
                A SMALL STEP. A REAL UNDERSTANDING.
              </span>
              <h2>
                一条直线，
                <br />
                理解机器学习的第一步。
              </h2>
              <p>
                为什么梯度下降能让模型不断接近答案？
                <br />
                从原理、公式到 NumPy，用一节样章亲自探索。
              </p>
              <Link className="button button-primary" href={SAMPLE_URL}>
                阅读样章
                <ArrowRight size={16} />
              </Link>
              <span className="sample-notice">试读样章 · 阅读进度仅保存在当前浏览器</span>
            </div>
            <div className="sample-code-preview">
              <div className="code-window-top">
                <span>
                  <i />
                  <i />
                  <i />
                </span>
                <span>linear_regression.py</span>
                <Code2 size={15} />
              </div>
              <pre>
                <code>
                  <span className="code-comment">
                    # 从简单模型，理解学习的过程
                  </span>
                  {"\n"}
                  <span className="code-purple">import</span> numpy{" "}
                  <span className="code-purple">as</span> np{"\n\n"}
                  <span className="code-comment">
                    # 预测 → 计算误差 → 更新参数
                  </span>
                  {"\n"}prediction = w * x + b{"\n"}error = prediction - y
                  {"\n\n"}w -= learning_rate *{" "}
                  <span className="code-cyan">2</span> * np.mean(error * x)
                  {"\n"}b -= learning_rate *{" "}
                  <span className="code-cyan">2</span> * np.mean(error)
                </code>
              </pre>
              <div className="code-window-bottom">
                <span>
                  <i className="status-dot" />
                  Python + NumPy
                </span>
                <span>
                  理解每一行的意义
                  <CornerDownRight size={14} />
                </span>
              </div>
            </div>
          </Reveal>
        </section>
        <section className="end-cta">
          <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
          <h2>面向未来，从理解开始。</h2>
          <p>找到适合你的起点，让每一次学习都有方向。</p>
          <Link href="/paths" className="button button-secondary">
            找到我的学习路径
            <ArrowUpRight size={16} />
          </Link>
        </section>
      </div>
    </>
  );
}
