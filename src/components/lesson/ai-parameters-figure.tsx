import { useId } from "react";
import { ArrowDown } from "lucide-react";
import type { ContentBlock } from "@/content/models";
import { parameterParcel, parcelParameterSettings, durationRelation, durationEstimate, minuteGap } from "@/content/lessons/ai000/model-parameter-example";

// 原创手算图；甲乙均为指定设置，不是算法学得的参数。制作事实留在审查报告。
export function AiParametersFigure({ block }: { block: Extract<ContentBlock, { type: "ai-task-figure" }> }) {
  const id = useId();
  const record = parameterParcel;
  return <figure className="ai-figure ai-param-figure" aria-labelledby={`${id}-caption`} aria-describedby={`${id}-description`}>
    <p id={`${id}-description`} className="ai-srOnly">{block.alt}</p>
    <div className="ai-param-input"><span className="ai-param-label">同一条输入 · 记录 {record.id}</span><strong>到件时排队 {record.waiting}件</strong></div>
    <p className="ai-param-relation">{durationRelation}</p>
    <div className="ai-param-settings" aria-label="先试两组参数">
      {parcelParameterSettings.map(setting => {
        const prediction = durationEstimate(setting, record.waiting);
        const difference = prediction - record.actualMinutes;
        return <div key={setting.name} className="ai-param-setting">
          <strong className="ai-param-title">{setting.name}设置</strong>
          <dl><div><dt>基础分钟数</dt><dd>{setting.baseMinutes}分钟</dd></div><div><dt>每件增加的估计时间</dt><dd>{setting.minutesPerItem}分钟/件</dd></div></dl>
          <span className="ai-param-arrow"><ArrowDown size={20} aria-hidden="true" /> 按同一关系计算</span>
          <p className="ai-param-calculation">{setting.baseMinutes} + {setting.minutesPerItem} × {record.waiting} = {prediction}分钟</p>
          <p className="ai-param-prediction">预测 <b>{prediction}分钟</b></p>
          <p className="ai-param-gap">比实际{difference < 0 ? "少" : "多"}{minuteGap(prediction, record.actualMinutes)}分钟</p>
        </div>;
      })}
    </div>
    <div className="ai-param-target"><span className="ai-param-label">历史已知目标 · 用来对照</span><strong>B实际用了 {record.actualMinutes}分钟</strong><p>甲、乙都相差1分钟；只看B，选不出更接近的一组。</p></div>
    <figcaption id={`${id}-caption`}>{block.caption}</figcaption>
  </figure>;
}
