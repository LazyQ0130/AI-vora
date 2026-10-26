import { useId } from "react";
import type { ContentBlock } from "@/content/models";
export function AiGenerationFigure({block}:{block:Extract<ContentBlock,{type:"ai-task-figure"}>}) {
 const id=useId();
 return <figure className="ai-figure" aria-labelledby={id+"-caption"} aria-describedby={id+"-alt"}>
  <p className="ai-srOnly" id={id+"-alt"}>{block.alt}</p>
  <p className="ai-rule">方法范围：AI 包含 ML，ML 包含 DL</p>
  <div className="ai-method-tasks">
   <div className="ai-task-case"><strong>深度图像生成模型</strong><dl>
    <div><dt>本图给定的方法</dt><dd>深度学习</dd></div>
    <div><dt>任务示例</dt><dd>按“蓝围巾的猫”产生图像内容</dd></div>
    <div><dt>与LLM的关系</dt><dd>图像生成不要求它本身是大语言模型</dd></div>
   </dl></div>
   <div className="ai-task-case ai-generating-case"><strong>大语言模型 LLM</strong><dl>
    <div><dt>现代常见实现</dt><dd>基于深度学习</dd></div>
    <div><dt>任务示例</dt><dd>写通知、摘要、按要求选择类别</dd></div>
    <div><dt>与生成的关系</dt><dd>能生成文本，也可被安排做分类等任务</dd></div>
   </dl></div>
  </div>
  <p className="ai-usage">产品层面：聊天界面可以连接 LLM、检索、规则和其他工具；一次回答由哪些部分参与，需要实现信息。</p>
  <figcaption id={id+"-caption"}>{block.caption}</figcaption>
 </figure>;
}
