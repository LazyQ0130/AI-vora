"use client";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { train } from "@/lib/regression";
import { RegressionDiagram } from "./blocks";

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
        `${(100 + (i / Math.max(logs.length - 1, 1)) * 440).toFixed(3)},${(190 - ((value - min) / range) * 150).toFixed(3)}`,
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
            <path d="M100 30V190H540" stroke="#56678f" fill="none" />
            {[0, 0.5, 1].map((t) => (
              <g key={t}>
                <path d={`M100 ${190 - t * 150}H540`} stroke="#94a3b817" />
                <text x="90" y={194 - t * 150} textAnchor="end">
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
            <text x="100" y="217">
              0
            </text>
            <text x="540" y="217" textAnchor="end">
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
