"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import katex from "katex";
import { Highlight, themes } from "prism-react-renderer";
import {
  Check,
  Copy,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useToast } from "../ui";
import { samples } from "@/lib/regression";
import { type ContentBlock, type Publication } from "@/content/models";
import { lessonHref } from "@/content/publication-manifest";
import { numberedLessonTitle } from "@/lib/course-numbering";

const readableCodeTheme = {
  ...themes.nightOwl,
  styles: themes.nightOwl.styles.map((rule) =>
    rule.types.includes("comment")
      ? { ...rule, style: { ...rule.style, color: "var(--text-code-comment)" } }
      : rule,
  ),
};

export function LessonHeading({
  number,
  children,
}: {
  number?: string;
  children: ReactNode;
}) {
  return (
    <h2 tabIndex={-1}>
      {number && <span>{number} </span>}
      {children}
    </h2>
  );
}
export function Paragraph({ children }: { children: ReactNode }) {
  return <p className="lesson-paragraph">{children}</p>;
}
export function LearningObjectives({
  objectives,
}: {
  objectives: readonly string[];
}) {
  return (
    <ul className="learning-objectives">
      {objectives.map((item) => (
        <li key={item}>
          <CheckCircle2 size={14} />
          {item}
        </li>
      ))}
    </ul>
  );
}
export function InfoCallout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="lesson-callout">
      <Lightbulb size={17} />
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </aside>
  );
}
export function MathBlock({
  latex,
  explanation,
}: {
  latex: string;
  explanation: string;
}) {
  const html = katex.renderToString(latex, {
    displayMode: true,
    throwOnError: false,
    trust: false,
    strict: "warn",
    output: "htmlAndMathml",
  });
  return (
    <figure className="math-block">
      <div
        className="math-scroll"
        tabIndex={0}
        role="region"
        aria-label="数学公式，可横向滚动"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <figcaption>{explanation}</figcaption>
    </figure>
  );
}
export function DiagramCard({
  children,
  caption,
}: {
  children: ReactNode;
  caption: string;
}) {
  return (
    <figure className="diagram-card">
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
export function RegressionDiagram({
  w = 2,
  b = 1,
  interactive = false,
  diverged = false,
}: {
  w?: number;
  b?: number;
  interactive?: boolean;
  diverged?: boolean;
}) {
  const clipId = useId();
  return (
    <>
      <div className="diagram-legend">
        <span className="legend-data">合成数据</span>
        <span className="legend-fit">
          {interactive ? "当前拟合" : "y = 2x + 1"}
        </span>
      </div>
      <svg
        fill="none"
        viewBox="0 -15 580 290"
        role="img"
        aria-label={
          interactive
            ? `拟合图：当前斜率 ${w.toFixed(2)}，截距 ${b.toFixed(2)}，合成数据的真实直线为 y 等于 2x 加 1`
            : "合成数据散点位于 y 等于 2x 加 1 的直线上；横轴 x 从 0 到 1，纵轴 y 从 0 到 4"
        }
        className="regression-chart"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="58" y="25" width="485" height="200" />
          </clipPath>
        </defs>
        {[0, 1, 2, 3, 4].map((y) => (
          <g key={y}>
            <path d={`M58 ${225 - y * 50}H543`} stroke="#94a3b817" />
            <text x="40" y={229 - y * 50} textAnchor="end">
              {y}
            </text>
          </g>
        ))}
        {[0, 0.25, 0.5, 0.75, 1].map((x) => (
          <g key={x}>
            <path d={`M${58 + x * 485} 25V225`} stroke="#94a3b817" />
            <text x={58 + x * 485} y="247" textAnchor="middle">
              {x}
            </text>
          </g>
        ))}
        <path d="M58 25V225H543" stroke="#56678f" />
        <g clipPath={`url(#${clipId})`}>
          {samples
            .filter((_, i) => i % 3 === 0)
            .map((p, i) => (
              <circle
                key={i}
                cx={58 + p.x * 485}
                cy={225 - p.y * 50}
                r="4"
                fill="#8c80ef"
                stroke="#0d152c"
              />
            ))}
          {!diverged && (
            <path
              d={`M58 ${(225 - b * 50).toFixed(3)}L543 ${(225 - (w + b) * 50).toFixed(3)}`}
              stroke="#4dd8e9"
              strokeWidth="2"
            />
          )}
        </g>
      </svg>
      <div className="chart-axes">
        <span>横轴 x</span>
        <span>纵轴 y</span>
      </div>
    </>
  );
}
export function CodeBlock({
  code,
  filename,
  language = "python",
}: {
  code: string;
  filename: string;
  language?: "python" | "javascript" | "bash" | "json" | "text";
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const toast = useToast();
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast("代码已复制");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      toast("浏览器未允许复制，请选中代码手动复制");
    }
  }
  return (
    <div className="lesson-code">
      <div className="lesson-code-title">
        <span>
          <span className="python-dot" />
          {language === "python" ? "Python" : language}{" "}
          <small>{filename}</small>
        </span>
        <button className="copy-button" onClick={copy}>
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? "已复制" : "复制代码"}</span>
        </button>
      </div>
      <div
        className="code-scroll"
        tabIndex={0}
        role="region"
        aria-label={`${filename} 示例代码，可横向滚动`}
      >
        <Highlight
          theme={readableCodeTheme}
          code={code.trimEnd()}
          language={language}
        >
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="line-number" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
export function QuizBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "quiz" }>;
}) {
  const groupId = useId();
  const [selected, setSelected] = useState<number | null>(null),
    [submitted, setSubmitted] = useState(false);
  return (
    <div className="quiz-block">
      <span className="quiz-label">知识自查</span>
      <fieldset>
        <legend>{block.question}</legend>
        <div className="quiz-options">
          {block.options.map((option, i) => (
            <label
              key={option}
              className={`quiz-option ${selected === i ? "selected" : ""} ${submitted && i === block.correct ? "is-correct" : ""}`}
            >
              <input
                type="radio"
                name={groupId}
                value={i}
                checked={selected === i}
                onChange={() => {
                  setSelected(i);
                  setSubmitted(false);
                }}
              />
              <span className="option-letter">
                {String.fromCharCode(65 + i)}
              </span>
              <span>{option}</span>
              {submitted && i === block.correct && <CheckCircle2 size={16} />}
            </label>
          ))}
        </div>
      </fieldset>
      <button
        disabled={selected === null}
        onClick={() => setSubmitted(true)}
        className="button button-small button-secondary"
      >
        检查答案
        <ArrowRight size={14} />
      </button>
      {submitted && selected !== null && (
        <div
          className={`quiz-feedback ${selected === block.correct ? "correct" : "incorrect"}`}
          role="status"
        >
          {selected === block.correct ? (
            <CheckCircle2 size={17} />
          ) : (
            <XCircle size={17} />
          )}
          <div>
            <strong>
              {selected === block.correct ? "理解正确" : "再想一想"}
            </strong>
            <p>{block.explanations[selected]}</p>
            {selected !== block.correct && (
              <p>
                参考答案：{String.fromCharCode(65 + block.correct)}。
                {block.explanations[block.correct]}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export function ProgressRing({ value }: { value: number }) {
  const gradientId = useId();
  const safe = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className="progress-ring"
      role="img"
      aria-label={`本节已阅读 ${safe}%`}
    >
      <svg viewBox="0 0 88 88" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            <stop stopColor="#a291ff" />
            <stop offset=".5" stopColor="#818af7" />
            <stop offset="1" stopColor="#4ed8e8" />
          </linearGradient>
        </defs>
        <circle
          cx="44"
          cy="44"
          r="37"
          fill="none"
          stroke="#263252"
          strokeWidth="5"
        />
        <circle
          cx="44"
          cy="44"
          r="37"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="5"
          strokeDasharray="232.48"
          strokeDashoffset={232.48 * (1 - safe / 100)}
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
        />
      </svg>
      <strong>
        {safe}
        <small>%</small>
      </strong>
    </div>
  );
}
export function LessonNavigation({
  previous,
  next,
}: {
  previous?: Publication & { displayNumber?: string };
  next?: Publication & { displayNumber?: string };
}) {
  return (
    <nav className="lesson-navigation" aria-label="相邻知识单元">
      {previous ? (
        <Link className="button button-secondary" href={lessonHref(previous)}>
          <ArrowLeft size={15} />
          上一节 · {numberedLessonTitle(previous)}
        </Link>
      ) : (
        <button className="button button-secondary" disabled>
          <ArrowLeft size={15} />
          上一节 · 尚未提供
        </button>
      )}
      {next ? (
        <Link className="button button-secondary" href={lessonHref(next)}>
          下一节 · {numberedLessonTitle(next)}
          <ArrowRight size={15} />
        </Link>
      ) : (
        <button className="button button-secondary" disabled>
          下一节 · 尚未提供
          <ArrowRight size={15} />
        </button>
      )}
    </nav>
  );
}
