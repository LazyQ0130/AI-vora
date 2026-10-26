import { useId } from "react";
import type { ContentBlock } from "@/content/models";

type FigureBlock = Extract<ContentBlock, { type: "ai-task-figure" }>;

export function AiRelationshipFigure({ block }: { block: FigureBlock }) {
  const id = useId();
  return <figure className="ai-figure ai-relationship" aria-labelledby={`${id}-caption`} aria-describedby={`${id}-description`}>
    <p id={`${id}-description`} className="ai-srOnly">{block.alt}</p>
    {block.kind === "method-hierarchy" ? <div className="ai-nested ai-scope-ai" data-ai-scope="ai">
      <strong>人工智能 AI</strong>
      <p>包括学习、知识推理等方法</p>
      <div className="ai-scope-example">AI 内、ML 外的例子：只用人工知识和规则推理的专家系统</div>
      <div className="ai-nested ai-scope-ml" data-ai-scope="ml">
        <strong>机器学习 ML</strong>
        <p>利用数据形成模型</p>
        <div className="ai-scope-example">ML 内、DL 外的例子：从数据学出的普通决策树</div>
        <div className="ai-nested ai-scope-dl" data-ai-scope="dl">
          <strong>深度学习 DL</strong>
          <p>学习多层表示及其组合</p>
          <div className="ai-scope-example">例子：用深度神经网络识别猫</div>
        </div>
      </div>
    </div> : <>
      <p className="ai-compare-premise">共同前提：两套系统都使用深度神经网络</p>
      <div className="ai-method-tasks">
        <div className="ai-task-case">
          <strong>判断照片里有没有猫</strong>
          <dl>
            <div><dt>输入</dt><dd>一张已有照片</dd></div>
            <div><dt>任务</dt><dd>分类：选择所属类别</dd></div>
            <div className="ai-task-result"><dt>输出示例</dt><dd>有猫<span>这是类别判断</span></dd></div>
            <div><dt>已知方法</dt><dd>深度学习<span>也属于 ML 和 AI</span></dd></div>
          </dl>
        </div>
        <div className="ai-task-case ai-generating-case">
          <strong>按描述生成猫的图片</strong>
          <dl>
            <div><dt>输入</dt><dd>“画一只戴蓝色围巾的猫”</dd></div>
            <div><dt>任务</dt><dd>生成：组织新的图像内容</dd></div>
            <div className="ai-task-result"><dt>输出内容（示意）</dt><dd>按要求生成的猫图<span>按描述组织的新图像内容</span></dd></div>
            <div><dt>已知方法</dt><dd>深度学习<span>也属于 ML 和 AI</span></dd></div>
          </dl>
        </div>
      </div>
      <p className="ai-compare-reading">横向比较任务，纵向查看每套系统的输入、输出与方法。生成任务和深度学习方法可以同时成立。</p>
    </>}
    <figcaption id={`${id}-caption`}>{block.caption}</figcaption>
  </figure>;
}
