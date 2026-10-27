import { useId } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { ContentBlock } from "@/content/models";
import { parcelExamples, newParcel } from "@/content/lessons/ai000/parcel-example";

// 包裹小图是示意画，不模拟真实照片，也不承担类别已核实的证据。
function ParcelSketch({ box }: { box: boolean }) {
  return <svg viewBox="0 0 72 54" width="72" height="54" aria-hidden="true">
    {box ? <>
      <path d="M8 16 35 5 64 17 37 30Z" fill="#cfa87b" stroke="#f2d1a6" strokeWidth="2" />
      <path d="M8 16V40L37 51V30Z" fill="#9d744d" stroke="#f2d1a6" strokeWidth="2" />
      <path d="M37 30 64 17V41L37 51Z" fill="#ba8b5e" stroke="#f2d1a6" strokeWidth="2" />
      <path d="M22 10 51 23V45" fill="none" stroke="#f4dfbd" strokeWidth="5" />
    </> : <>
      <path d="M5 10H67V44H5Z" fill="#e4e8ed" stroke="#acbdd5" strokeWidth="2" />
      <path d="m5 10 31 20L67 10" fill="#f7f8fa" stroke="#acbdd5" strokeWidth="2" />
      <path d="m5 44 20-17m42 17L47 27" fill="none" stroke="#acbdd5" strokeWidth="2" />
    </>}
  </svg>;
}

export function AiSupervisedFigure({ block }: { block: Extract<ContentBlock, {type:"ai-task-figure"}> }) {
  const id=useId();
  return <figure className="ai-figure ai-supervised" aria-labelledby={`${id}-caption`} aria-describedby={`${id}-description`}>
    <p id={`${id}-description`} className="ai-srOnly">{block.alt}</p>
    <div className="ai-supervised-stage">
      <strong className="ai-supervised-title">学习时：照片与已知类别一起准备</strong>
      <ul className="ai-paired-examples">
        {parcelExamples.map(e=><li key={e.id}>
          <ParcelSketch box={e.shape==="box"} />
          <div><strong>照片 {e.id}</strong><span>{e.description}</span></div>
          <div className="ai-known-label"><span>已确认类别</span><strong>{e.label}</strong></div>
        </li>)}
      </ul>
      <p className="ai-supervised-adjust"><ArrowDown size={22} aria-hidden="true" /><span>用已知类别比较判断、调整模型<br />形成可供使用的判断方式</span></p>
    </div>
    <div className="ai-supervised-stage ai-supervised-predict">
      <strong className="ai-supervised-title">使用时：先判断，再核实</strong>
      <div className="ai-prediction-row">
        <div><span className="ai-label">新输入 · 照片 {newParcel.id}</span><strong>{newParcel.description}</strong><p>没有把正确类别交给模型</p></div>
        <ArrowRight className="ai-right" size={22} aria-hidden="true" /><ArrowDown className="ai-down" size={22} aria-hidden="true" />
        <div className="ai-trained-model"><strong>学好的模型</strong><p>使用已经学到的判断方式</p></div>
        <ArrowRight className="ai-right" size={22} aria-hidden="true" /><ArrowDown className="ai-down" size={22} aria-hidden="true" />
        <div><span className="ai-label">假设的预测</span><strong>{newParcel.prediction}</strong><p>是类别建议，尚非确认答案</p></div>
      </div>
      <p className="ai-verification"><strong>真实类别：{newParcel.verification}</strong><span>工作人员另查实物或可靠记录，才能比较这次预测是否正确。</span></p>
    </div>
    <figcaption id={`${id}-caption`}>{block.caption}</figcaption>
  </figure>;
}
