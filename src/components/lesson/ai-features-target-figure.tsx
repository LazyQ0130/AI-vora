import { useId } from "react";
import { ArrowDown } from "lucide-react";
import type { ContentBlock } from "@/content/models";
import { parcelTimeRecords, newParcelTimeRecord, parcelFeatureValues } from "@/content/lessons/ai000/parcel-time-example";

export function AiFeaturesTargetFigure({ block }: { block: Extract<ContentBlock, { type: "ai-task-figure" }> }) {
  const id = useId();
  const historical = parcelTimeRecords[2];
  const current = newParcelTimeRecord;
  return <figure className="ai-figure ai-data-figure" aria-labelledby={`${id}-caption`} aria-describedby={`${id}-description`}>
    <p className="ai-srOnly" id={`${id}-description`}>{block.alt}</p>
    <div className="ai-data-stage" aria-label="历史样本的特征与目标">
      <strong className="ai-data-title">历史记录 {historical.id} · 同一次处理</strong>
      <div className="ai-data-pair">
        <div className="ai-data-input"><span className="ai-data-label">到件时登记 → 输入特征</span>
          <dl>{parcelFeatureValues(historical).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
        </div>
        <div className="ai-data-target"><span className="ai-data-label">事后确认 → 目标标签</span><strong>实际处理时长 {historical.actualMinutes}分钟</strong><p>到件{historical.arrived} → 完成登记并归架{historical.finished}，包含等待。</p><p>与同一条记录的输入配对，用于学习时对照。</p></div>
      </div>
    </div>
    <div className="ai-data-stage" aria-label="新样本可提供的当前输入">
      <strong className="ai-data-title">新记录 {current.id} · 刚到件</strong>
      <div className="ai-data-pair">
        <div className="ai-data-input"><span className="ai-data-label">这次模型可接收的输入</span>
          <dl>{parcelFeatureValues(current).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
        </div>
        <div className="ai-data-unknown"><span className="ai-data-label">实际处理时长</span><strong>仍未知 · 待完成后确认</strong><p>尚不能提供这次的实际分钟数。</p></div>
      </div>
    </div>
    <div className="ai-data-stage" aria-label="假设预测与以后核实的实际结果">
      <span className="ai-data-model"><ArrowDown size={20} aria-hidden="true" /> 将当前输入交给模型，得到估计</span>
      <div className="ai-data-pair">
        <div className="ai-data-prediction"><span className="ai-data-label">单独保存 · 预测时长</span><strong>假设的模型输出 {current.hypotheticalPredictionMinutes}分钟</strong><p>这是示意数字，没有训练或运行模型。</p></div>
        <div className="ai-data-unknown"><span className="ai-data-label">以后核实 · 实际处理时长</span><strong>按G自己的到件与归架记录确认</strong><p>确认后填实际列，再与预测比较；现在继续保留未知。</p></div>
      </div>
    </div>
    <figcaption id={`${id}-caption`}>{block.caption}</figcaption>
  </figure>;
}
