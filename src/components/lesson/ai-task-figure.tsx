import { useId } from "react";
import { ArrowRight, ArrowDown, Check, X } from "lucide-react";
import type { ContentBlock } from "@/content/models";
import { keywordMailDecision, mailExamples } from "@/content/lessons/ai000/mail-example";
import { AiRelationshipFigure } from "./ai-relationship-figure";
import { AiKnowledgeFigure } from "./ai-knowledge-figure";
import { AiGenerationFigure } from "./ai-generation-figure";
import { AiSupervisedFigure } from "./ai-supervised-figure";
import { AiBorrowingFigure } from "./ai-borrowing-figure";
import { AiSelfSupervisedFigure } from "./ai-self-supervised-figure";
import { AiReinforcementFigure } from "./ai-reinforcement-figure";
import { AiFeaturesTargetFigure } from "./ai-features-target-figure";
import { AiParametersFigure } from "./ai-parameters-figure";
import { AiInferenceFigure } from "./ai-inference-figure";
import { AiDataUseFigure } from "./ai-data-use-figure";
import { AiVisionFigure } from "./ai-vision-figure";
import { AiCreativeFigure } from "./ai-creative-figure";
import { AiMultimodalFigure } from "./ai-multimodal-figure";

type FigureBlock = Extract<ContentBlock, { type: "ai-task-figure" }>;

function FlowArrow() {
  return <span className="ai-arrow" aria-hidden="true">
    <ArrowRight className="ai-right" size={22} />
    <ArrowDown className="ai-down" size={22} />
  </span>;
}

export function AiTaskFigure({ block }: { block: FigureBlock }) {
  const id = useId();
  if (block.kind.startsWith("creative-")) return <AiCreativeFigure block={block} />;
  if (block.kind.startsWith("multimodal-")) return <AiMultimodalFigure block={block} />;
  if (block.kind.startsWith("vision-")) return <AiVisionFigure block={block} />;
  if (block.kind === "inference-flow") return <AiInferenceFigure block={block} />;
  if (block.kind === "data-use-flow") return <AiDataUseFigure block={block} />;
  if (block.kind === "parameters-compare") return <AiParametersFigure block={block} />;
  if (block.kind === "features-target-flow") return <AiFeaturesTargetFigure block={block} />;
  if (block.kind === "reinforcement-flow") return <AiReinforcementFigure block={block} />;
  if (block.kind === "self-supervised-flow") return <AiSelfSupervisedFigure block={block} />;
  if (block.kind === "borrowing-groups") return <AiBorrowingFigure block={block} />;
  if (block.kind === "supervised-flow") return <AiSupervisedFigure block={block} />;
  if (block.kind === "generation-map") return <AiGenerationFigure block={block} />;
  if (block.kind === "knowledge-trace") return <AiKnowledgeFigure block={block} />;
  if (block.kind === "method-hierarchy" || block.kind === "method-and-task")
    return <AiRelationshipFigure block={block} />;
  return <figure className="ai-figure" aria-labelledby={`${id}-caption`} aria-describedby={`${id}-description`}>
    <p id={`${id}-description`} className="ai-srOnly">{block.alt}</p>
    {block.kind === "mail-flow" ? <>
      <div className="ai-flow">
        <div className="ai-step">
          <span className="ai-label">输入</span>
          <strong>系统能看到什么？</strong>
          <p>邮件标题、正文、发件地址等可用信息</p>
        </div>
        <FlowArrow />
        <div className="ai-step ai-task">
          <span className="ai-label">处理任务</span>
          <strong>判断所属类别</strong>
          <p>采用规则、学习等方法处理可用信息</p>
        </div>
        <FlowArrow />
        <div className="ai-step ai-output">
          <span className="ai-label">输出</span>
          <strong>给出分类建议</strong>
          <p>“正常”或“垃圾”<br />判断仍可能出错</p>
        </div>
      </div>
      <p className="ai-usage">输出之后：按邮箱设置保留或移动邮件，必要时由人复核。刚才的关键词规则只读取标题。</p>
    </> : <>
      <p className="ai-rule">本图规则：标题含“免费” → 垃圾；否则 → 正常</p>
      <div className="ai-outcomes">
        {mailExamples.map((mail) => {
          const decision = keywordMailDecision(mail.subject);
          const correct = decision === mail.expected;
          return <div className="ai-mail" key={mail.id}>
            <div className="ai-mailTitle"><span className="ai-label">邮件 {mail.id}</span><strong>{mail.subject}</strong></div>
            <dl className="ai-comparison">
              <div><dt>题设类别</dt><dd>{mail.expected}</dd></div>
              <div><dt>规则判断</dt><dd>{decision}</dd></div>
            </dl>
            <p className={correct ? "ai-correct" : "ai-incorrect"}>
              {correct ? <Check size={18} aria-hidden="true" /> : <X size={18} aria-hidden="true" />}
              <span>{correct ? "判断正确" : mail.expected === "正常" ? "误拦正常邮件" : "漏掉垃圾邮件"}</span>
            </p>
            <p className="ai-reason">{mail.reason}</p>
          </div>;
        })}
      </div>
    </>}
    <figcaption id={`${id}-caption`}>{block.caption}</figcaption>
  </figure>;
}
