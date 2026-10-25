import { sampleLesson } from "../sample";
import { lessonSchema, type ContentBlock } from "../models";
import { resourcesForProgram } from "../resources/programs";

// 兼容原样章 DTO：旧段落 ID、教材和下载代码保持不变。
export const linearRegressionLesson = lessonSchema.parse({
  ...sampleLesson,
  chapterId: "ML201-C04",
  contentVersion: 1,
  durationMinutes: 30,
  prerequisites:
    "Python 数组与函数、基础导数与偏导、NumPy 广播。使用无噪声合成数据，聚焦损失与更新过程。",
  sections: sampleLesson.sections.map((section, index) => ({
    ...section,
    layout: index === 0 ? "intro" : "stack",
    navGroup:
      ({ gradient: "loss", summary: "quiz" } as Record<string, string>)[
        section.id
      ] ?? section.id,
    navLabel: (
      {
        intuition: "概念",
        loss: "公式",
        gradient: "公式",
        experiment: "实验",
        code: "代码",
        quiz: "练习",
        summary: "练习",
      } as Record<string, string>
    )[section.id],
    blocks: section.blocks.map((block): ContentBlock => {
      if (block.type === "diagram")
        return {
          ...block,
          kind: "linear-regression",
          caption: "合成数据示例：y = 2x + 1。",
        };
      if (block.type === "experiment")
        return { ...block, kind: "linear-regression" };
      if (block.type === "code")
        return {
          ...block,
          filename: "linear_regression.py",
          language: "python",
        };
      return block;
    }),
  })),
  resources: resourcesForProgram("linear-regression"),
  references: [
    {
      title: "NumPy：最小二乘求解",
      href: "https://numpy.org/doc/stable/reference/generated/numpy.linalg.lstsq.html",
      note: "用于核对下载脚本中的最小二乘对照。正文与合成数据为原创教学示例。",
    },
  ],
});
