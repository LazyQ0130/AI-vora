import { useId } from "react";
import { ArrowDown } from "lucide-react";
import type { ContentBlock } from "@/content/models";
import { evaluationParcels, evaluationCandidates, recordsForRole, parcelValidationTotals, selectedParcelCandidate, gapTotal } from "@/content/lessons/ai000/data-use-example";
import { durationEstimate, minuteGap } from "@/content/lessons/ai000/model-parameter-example";

// 原创数据用途图，候选手工给定；只按验证记录选乙，测试从选定方案向前检查，无反向选择连线。
export function AiDataUseFigure({ block }: { block: Extract<ContentBlock, { type: "ai-task-figure" }> }) {
  const id = useId(), chosen = selectedParcelCandidate;
  return <figure className="ai-figure ai-use-figure" aria-labelledby={`${id}-caption`} aria-describedby={`${id}-description`}>
    <p id={`${id}-description`} className="ai-srOnly">{block.alt}</p>
    <div className="ai-use-start"><strong>八条历史记录 · 先分用途</strong><p>每条都有输入与实际目标，分别进入下面三项工作。</p></div>
    <ol className="ai-use-stages">
      <li data-stage="training">
        <div className="ai-use-records"><span>供学习使用</span><strong>T1 · T2 · T3 · T4</strong><p>输入与已知目标</p></div>
        <div className="ai-use-work"><h3>训练：利用记录调整模型</h3><p>提供学习依据，准备候选方案。</p><span className="ai-use-arrow"><ArrowDown size={18} aria-hidden="true" /> 本课先给出两组候选</span>
          <ul className="ai-use-candidates">{evaluationCandidates.map(c => <li key={c.name}><b>{c.name}</b> 基础{c.baseMinutes}分钟；每件{c.minutesPerItem}分钟</li>)}</ul>
        </div>
      </li>
      <li data-stage="validation">
        <div className="ai-use-records"><span>用于比较选择</span><strong>V1 · V2</strong><p>未直接用于本次训练</p></div>
        <div className="ai-use-work"><h3>验证：比较候选，确定方案</h3><p>两条差距合计：{evaluationCandidates.map((c, i) => `${c.name}${parcelValidationTotals[i]}分钟`).join("，")}。</p><p className="ai-use-choice">按预定规则选择 <b>{chosen.name}</b></p><p>验证已经影响选择，仍需另作最终检查。</p></div>
      </li>
      <li data-stage="test">
        <div className="ai-use-records"><span>此前一直保留</span><strong>S1 · S2</strong><p>直到{chosen.name}确定后才参与检查</p></div>
        <div className="ai-use-work"><h3>测试：检查已选好的{chosen.name}</h3><ul>{recordsForRole(evaluationParcels, "test").map(r => {
          const prediction = durationEstimate(chosen, r.count);
          return <li key={r.id}>{r.id}：预测{prediction}，实际{r.actualMinutes}，差{minuteGap(prediction, r.actualMinutes)}分钟</li>;
        })}</ul><p>两条差距合计 <b>{gapTotal(chosen, recordsForRole(evaluationParcels, "test"))}分钟</b>。</p><p>这批结果不返回前面挑选甲乙。</p></div>
      </li>
    </ol>
    <p className="ai-use-boundary">若按测试反馈重新开发，下一次独立评价需要重新安排。</p>
    <figcaption id={`${id}-caption`}>{block.caption}</figcaption>
  </figure>;
}
