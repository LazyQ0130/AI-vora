"use client";
import { useId, useState, type ReactNode } from "react";
import katex from "katex";
import { Highlight, themes } from "prism-react-renderer";
import {
  Check,
  Copy,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useToast } from "../ui";
import { samples, train } from "@/lib/regression";
import { type LessonBlock } from "@/content/sample";

const readableCodeTheme = {
  ...themes.nightOwl,
  styles: themes.nightOwl.styles.map((rule) => rule.types.includes("comment")
    ? { ...rule, style: { ...rule.style, color: "var(--text-code-comment)" } }
    : rule),
};

export function LessonHeading({
  index,
  children,
}: {
  index: number;
  children: ReactNode;
}) {
  return (
    <h2 tabIndex={-1}>
      <span>{String(index).padStart(2, "0")}</span>
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
  return (
    <svg
      fill="none"
      viewBox="0 0 580 275"
      role="img"
      aria-label={
        interactive
          ? `拟合图：当前斜率 ${w.toFixed(2)}，截距 ${b.toFixed(2)}，合成数据的真实直线为 y 等于 2x 加 1`
          : "合成数据散点位于 y 等于 2x 加 1 的直线上；横轴 x 从 0 到 1，纵轴 y 从 0 到 4"
      }
      className="regression-chart"
    >
      <defs>
        <clipPath id={interactive ? "fit-clip" : "intro-clip"}>
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
      <text x="20" y="23">
        y
      </text>
      <text x="558" y="228">
        x
      </text>
      <g clipPath={`url(#${interactive ? "fit-clip" : "intro-clip"})`}>
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
      <g transform="translate(327 13)">
        <circle cx="0" cy="0" r="3" fill="#8c80ef" />
        <text x="9" y="4">
          合成数据
        </text>
        <path d="M95 0h17" stroke="#4dd8e9" strokeWidth="2" />
        <text x="120" y="4">
          {interactive ? "当前拟合" : "y = 2x + 1"}
        </text>
      </g>
    </svg>
  );
}
export function CodeBlock({
  code,
  language = "python",
}: {
  code: string;
  language?: "python";
}) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast("代码已复制，可在本地 Python 环境运行");
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      toast("浏览器未允许复制，请选中代码手动复制");
    }
  }
  return (
    <div className="lesson-code">
      <div className="lesson-code-title">
        <span>
          <span className="python-dot" />
          Python <small>linear_regression.py</small>
        </span>
        <button className="copy-button" onClick={copy}>
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? "已复制" : "复制代码"}</span>
        </button>
      </div>
      <div
        className="code-scroll"
        tabIndex={0}
        aria-label="Python 示例代码，可横向滚动"
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
  block: Extract<LessonBlock, { type: "quiz" }>;
}) {
  const [selected, setSelected] = useState<number | null>(null),
    [submitted, setSubmitted] = useState(false);
  return (
    <div className="quiz-block">
      <span className="quiz-label">
        知识自查 · {block.id === "q1" ? "01" : "02"}
      </span>
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
                name={block.id}
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
export function RegressionExperiment() {
  const [rate, setRate] = useState(0.1),
    [iterations, setIterations] = useState(100);
  const result = train(rate, iterations);
  const logs = result.history.map((value) =>
    Math.log10(Math.max(value, 1e-12)),
  );
  const min = Math.min(...logs),
    max = Math.max(...logs),
    range = Math.max(max - min, 0.1);
  const points = logs
    .map(
      (value, i) =>
        `${(50 + (i / Math.max(logs.length - 1, 1)) * 470).toFixed(3)},${(190 - ((value - min) / range) * 150).toFixed(3)}`,
    )
    .join(" ");
  return (
    <div className="experiment">
      <div className="experiment-controls">
        <label>
          学习率 η<output>{rate.toFixed(2)}</output>
          <input
            type="range"
            min=".01"
            max="1"
            step=".01"
            value={rate}
            aria-label="学习率"
            onChange={(event) => setRate(Number(event.target.value))}
          />
        </label>
        <label>
          迭代次数<output>{iterations}</output>
          <input
            type="range"
            min="0"
            max="300"
            step="10"
            value={iterations}
            aria-label="迭代次数"
            onChange={(event) => setIterations(Number(event.target.value))}
          />
        </label>
        <button
          className="icon-button"
          aria-label="重置实验参数"
          onClick={() => {
            setRate(0.1);
            setIterations(100);
          }}
        >
          <RotateCcw size={15} />
        </button>
      </div>
      <div className="experiment-values">
        <span>
          w <strong>{result.w.toFixed(3)}</strong>
        </span>
        <span>
          b <strong>{result.b.toFixed(3)}</strong>
        </span>
        <span>
          MSE <strong>{result.history.at(-1)!.toExponential(3)}</strong>
        </span>
      </div>
      {result.diverged && (
        <div className="experiment-warning" role="status">
          当前学习率导致发散，已在 MSE 超过 10¹² 时停止计算。请减小学习率。
        </div>
      )}
      <div className="experiment-chart-grid">
        <figure>
          <span className="chart-label">当前模型与合成数据</span>
          <RegressionDiagram
            w={result.w}
            b={result.b}
            diverged={result.diverged}
            interactive
          />
        </figure>
        <figure>
          <span className="chart-label">损失变化 · log₁₀(MSE)</span>
          <svg
            viewBox="0 0 580 250"
            className="regression-chart"
            role="img"
            aria-label={`经过 ${result.history.length - 1} 步更新，MSE 从 ${result.history[0].toFixed(3)} 变为 ${result.history.at(-1)!.toExponential(3)}`}
          >
            <path d="M50 30V190H520" stroke="#56678f" fill="none" />
            {[0, 0.5, 1].map((t) => (
              <g key={t}>
                <path d={`M50 ${190 - t * 150}H520`} stroke="#94a3b817" />
                <text x="39" y={194 - t * 150} textAnchor="end">
                  {(min + t * range).toFixed(1)}
                </text>
              </g>
            ))}
            <polyline
              points={points}
              fill="none"
              stroke="#a68bf6"
              strokeWidth="2.5"
            />
            <text x="50" y="217">
              0
            </text>
            <text x="520" y="217" textAnchor="end">
              {result.history.length - 1} 次迭代
            </text>
          </svg>
        </figure>
      </div>
      <p className="experiment-note">
        60 个固定合成样本 · x ∈ [0, 1] · 生成关系 y = 2x + 1
      </p>
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
export function LessonNavigation() {
  return (
    <nav className="lesson-navigation" aria-label="相邻知识单元">
      <button className="button button-secondary" disabled>
        <ArrowLeft size={15} />
        上一节 · 尚未提供
      </button>
      <button className="button button-secondary" disabled>
        下一节 · 规划中
        <ArrowRight size={15} />
      </button>
    </nav>
  );
}
