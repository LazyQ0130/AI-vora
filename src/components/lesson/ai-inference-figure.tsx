import { useId } from "react";
import { ArrowDown } from "lucide-react";
import type { ContentBlock } from "@/content/models";
import { fixedParcelModel as model, newInferenceParcel as parcel, inferencePrediction } from "@/content/lessons/ai000/fixed-model-example";

export function AiInferenceFigure({block}:{block:Extract<ContentBlock,{type:"ai-task-figure"}>}) {
  const id=useId();
  return <figure className="ai-figure ai-inference-figure" aria-labelledby={`${id}-caption`} aria-describedby={`${id}-description`}>
    <p id={`${id}-description`} className="ai-srOnly">{block.alt}</p>
    <ol className="ai-inference-steps">
      <li><span className="ai-inference-label">当前输入 · 新包裹{parcel.id}</span><strong>排队{parcel.waiting}件</strong><p>到件时取得，先核对定义和单位。</p></li>
      <li><span className="ai-inference-label">沿用固定模型</span><strong>基础{model.baseMinutes}分钟 · 每件{model.minutesPerItem}分钟</strong><p>预计分钟数 = 基础 + 每件增加值 × 排队件数</p><span className="ai-inference-arrow"><ArrowDown size={18} aria-hidden="true"/>代入本次输入</span><p className="ai-inference-calculation">{model.baseMinutes} + {model.minutesPerItem} × {parcel.waiting} = {inferencePrediction}分钟</p></li>
      <li><span className="ai-inference-label">分别保存</span><div className="ai-inference-results"><div><strong>预测：{inferencePrediction}分钟</strong><p>已有模型输出，供工作参考。</p></div><div><strong>实际：仍未知</strong><p>完成后按N自己的到件与归架记录确认。</p></div></div></li>
    </ol>
    <p className="ai-inference-later">以后用确认的实际值与原预测比较；本次计算没有调整参数。</p>
    <figcaption id={`${id}-caption`}>{block.caption}</figcaption>
  </figure>;
}
