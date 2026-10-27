import { useId } from "react";
import { ArrowRight } from "lucide-react";
import type { ContentBlock } from "@/content/models";
import { deliveryRoutes, signedReward } from "@/content/lessons/ai000/delivery-example";

export function AiReinforcementFigure({block}:{block:Extract<ContentBlock,{type:"ai-task-figure"}>}) {
 const id=useId();
 return <figure className="ai-figure ai-rl-figure" aria-labelledby={`${id}-caption`} aria-describedby={`${id}-description`}>
  <p className="ai-srOnly" id={`${id}-description`}>{block.alt}</p>
  <strong className="ai-rl-title">走甲路：每一步以后，都有新情况</strong>
  <p className="ai-rl-note">机器人控制系统选择行动；情境中的环境更新情况并按规则给分。</p>
  <ol className="ai-rl-trace">
   {deliveryRoutes[0].steps.map((step,i)=><li key={step.action}>
    <div className="ai-rl-before"><span className="ai-rl-label">记录{i+1} · 当前观察</span><strong>{step.before}</strong><p>可选：{step.available.join("、")}</p></div>
    <div className="ai-rl-action"><span className="ai-rl-label">实际行动</span><strong>{step.action}</strong><ArrowRight size={24} aria-hidden="true" /></div>
    <div className="ai-rl-after"><span className="ai-rl-label">环境变化与新观察</span><strong>{step.after}</strong><p className="ai-rl-reward">环境奖励 <b>{signedReward(step.reward)}分</b></p><p>{step.nextChoice}</p></div>
   </li>)}
  </ol>
  <p className="ai-rl-note">这是按教学规则编写的事后记录。没有运行机器人，也没有训练出策略。</p>
  <figcaption id={`${id}-caption`}>{block.caption}</figcaption>
 </figure>;
}
