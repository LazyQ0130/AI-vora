import type { ContentBlock } from "../../models";
export const p = (text:string):ContentBlock => ({type:"paragraph",text});
export const aiSources = {
  oecd: {title:"OECD：AI系统定义解释备忘录（2024）",href:"https://www.oecd.org/content/dam/oecd/en/publications/reports/2024/03/explanatory-memorandum-on-the-updated-oecd-definition-of-an-ai-system_3c815e51/623da898-en.pdf",note:"核对AI任务、输出及学习/知识方法的范围；本课为教学概括。访问于2026-10-27，仅事实参考与链接。"},
  ml: {title:"Google：什么是机器学习（英文）",href:"https://developers.google.com/machine-learning/intro-to-ml/what-is-ml",note:"核对从数据形成模型及分类/生成等任务。访问于2026-10-27，不复用示例或代码。"},
  dl: {title:"Goodfellow等：Deep Learning，第1章（2016）",href:"https://www.deeplearningbook.org/contents/intro.html",note:"核对多层表示与DL⊂ML⊂AI；仅事实参考，图文独立编写。访问于2026-10-27。"},
  llm: {title:"Google：大语言模型入门（英文）",href:"https://developers.google.com/machine-learning/crash-course/llm",note:"核对语言模型、上下文、生成与多种语言任务；高级机制不作为本课先修。访问于2026-10-27。"},
  gen: {title:"NIST：生成式AI概况（AI 600-1，2024）",href:"https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf",note:"核对生成数字内容的能力描述及事实可靠性边界；不作法律或性能结论。访问于2026-10-27。"},
};
