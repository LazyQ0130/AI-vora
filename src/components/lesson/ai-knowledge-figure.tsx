import { useId } from "react";
import type { ContentBlock } from "@/content/models";
export function AiKnowledgeFigure({block}:{block:Extract<ContentBlock,{type:"ai-task-figure"}>}) {
 const id=useId();
 return <figure className="ai-figure ai-knowledge" aria-labelledby={id+"-caption"} aria-describedby={id+"-alt"}>
  <p className="ai-srOnly" id={id+"-alt"}>{block.alt}</p>
  <p className="ai-rule">已知事实：本机测试页可打印；电脑发送的任务失败。</p>
  <ol className="ai-trace">
   <li><strong>应用规则一</strong><p>本机测试页可打印 → 本地打印能力可用</p><span>得到可供下一步使用的中间结论</span></li>
   <li><strong>应用规则二</strong><p>本地打印能力可用 ＋ 电脑任务失败 → 优先检查连接或队列</p><span>把中间结论与另一条现象联系起来</span></li>
  </ol>
  <p className="ai-usage">输出：一个有依据的排查方向。尚不能确定是哪一处连接或队列出了问题。</p>
  <figcaption id={id+"-caption"}>{block.caption}</figcaption>
 </figure>;
}
