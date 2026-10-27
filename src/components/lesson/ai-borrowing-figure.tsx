import { useId } from "react";
import type { ContentBlock } from "@/content/models";
import { borrowingRecords, borrowingObservations } from "@/content/lessons/ai000/borrowing-example";

export function AiBorrowingFigure({ block }: {block:Extract<ContentBlock,{type:"ai-task-figure"}>}) {
  const id=useId();
  return <figure className="ai-figure ai-borrowing" aria-labelledby={`${id}-caption`} aria-describedby={`${id}-description`}>
    <p className="ai-srOnly" id={`${id}-description`}>{block.alt}</p>
    <strong className="ai-borrowing-title">原始输入：同一个月的两类借阅次数</strong>
    <p className="ai-borrowing-key"><span><i className="ai-count-science" aria-hidden="true" />科普</span><span><i className="ai-count-literature" aria-hidden="true" />文学</span><span>每个色格为1次，空格不计数</span></p>
    <ul className="ai-borrowing-records">
      {borrowingRecords.map(r=><li key={r.id}>
        <strong>记录 {r.id}</strong>
        <div className="ai-borrowing-bar" aria-hidden="true">
          {Array.from({length:4},(_,i)=><i key={i} className={i<r.science?"ai-count-science":i<r.science+r.literature?"ai-count-literature":"ai-count-empty"} />)}
        </div>
        <span>科普 {r.science}次 · 文学 {r.literature}次</span>
      </li>)}
    </ul>
    <div className="ai-borrowing-basis"><strong>选定比较依据</strong><p>比较这两类中哪一类借阅次数更多。没有提供读者群的正确组别。</p></div>
    <strong className="ai-borrowing-title">手工提出的候选观察</strong>
    <ul className="ai-borrowing-groups">
      {borrowingObservations.map(group=><li key={group.title}>
        <strong>{group.title}</strong><span className="ai-record-ids">{group.ids.join("、")}</span><p>{group.note}</p>
      </li>)}
    </ul>
    <p className="ai-borrowing-limit">组号只是名字。这些观察还没有确认读者的长期兴趣，也不是聚类程序的实验结果。</p>
    <figcaption id={`${id}-caption`}>{block.caption}</figcaption>
  </figure>;
}
