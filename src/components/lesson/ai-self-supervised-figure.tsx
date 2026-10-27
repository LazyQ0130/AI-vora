import { useId } from "react";
import { ArrowDown } from "lucide-react";
import type { ContentBlock } from "@/content/models";
import { maskingParts, maskingExample } from "@/content/lessons/ai000/self-supervised-example";

export function AiSelfSupervisedFigure({block}:{block:Extract<ContentBlock,{type:"ai-task-figure"}>}) {
  const id=useId();
  return <figure className="ai-figure ai-self-task" aria-labelledby={`${id}-caption`} aria-describedby={`${id}-description`}>
    <p className="ai-srOnly" id={`${id}-description`}>{block.alt}</p>
    <section className="ai-self-source" aria-label="从原始数据构造任务">
      <strong className="ai-self-title">先准备任务：完整原句保留在这里</strong>
      <p className="ai-self-sentence">{maskingParts.before}<mark>{maskingParts.hidden}</mark>{maskingParts.after}</p>
      <p className="ai-self-operation"><ArrowDown size={22} aria-hidden="true" />遮住地点，同时把原内容另存为目标</p>
      <div className="ai-self-pair">
        <div className="ai-self-input"><strong>学习输入 · 交给模型</strong><p>{maskingExample.input}</p><span>这里只给剩余内容和空格</span></div>
        <div className="ai-self-target"><strong>构造目标 · 留作对照</strong><p>{maskingExample.target}</p><span>从完整原句取出，未交给模型作本次预测</span></div>
      </div>
    </section>
    <section className="ai-self-compare" aria-label="模型预测与原文目标比较">
      <strong className="ai-self-title">再作预测：接收遮盖句，尝试填空</strong>
      <p>模型实际输入：{maskingExample.input}</p>
      <div className="ai-self-pair">
        <div className="ai-self-prediction"><strong>假设的模型预测</strong><p>{maskingExample.prediction}</p><span>来自模型这一次的判断</span></div>
        <div className="ai-self-target"><strong>比较仍使用原文目标</strong><p>{maskingExample.target}</p><span>来源保持不变，不用预测改写它</span></div>
      </div>
      <p className="ai-self-comparison">“教室”与“图书馆”不同：本次没有还原原词。补得通顺，不等于与本条目标相同。</p>
      <p className="ai-self-note">学习过程利用这个对照调整模型。以上是教学构造的预测，未实际运行模型。</p>
    </section>
    <figcaption id={`${id}-caption`}>{block.caption}</figcaption>
  </figure>;
}
