"use client";
import { useId, useState } from "react";
import type { ContentBlock } from "@/content/models";
export function GuidedExercise({
  block,
}: {
  block: Extract<ContentBlock, { type: "exercise" }>;
}) {
  const id = useId();
  const [answer, setAnswer] = useState("");
  return (
    <section className="guided-exercise" id={`exercise-${block.id}`} aria-labelledby={`${id}-title`}>
      <span className="exercise-kind">{block.kind}练习 · 自主核对</span>
      <h3 id={`${id}-title`} tabIndex={-1}>{block.title}</h3>
      <p>{block.prompt}</p>
      <label htmlFor={`${id}-answer`}>先记录你的思路或计算</label>
      <textarea
        id={`${id}-answer`}
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        rows={3}
        placeholder="写下依据，再查看提示与解析…"
      />
      <p className="exercise-local-note">
        输入仅用于当前页面思考，不自动评分，也不改变阅读完成标记。
      </p>
      <div className="exercise-hints">
        {block.hints.map((hint, index) => (
          <details key={hint}>
            <summary>提示 {index + 1}</summary>
            <p>{hint}</p>
          </details>
        ))}
      </div>
      <details className="exercise-solution">
        <summary>参考解答与自查标准</summary>
        <ol>
          {block.solution.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <h4>检查自己的解答</h4>
        <ul>
          {block.rubric.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}
