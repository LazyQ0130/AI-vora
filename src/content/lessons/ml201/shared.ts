import { lessonSchema, type Lesson, type ContentBlock } from "../../models";
import { courseOutline } from "../../course-outline";
import { mlTeachingProfiles } from "./teaching-profiles";
import { coreAssessments } from "./core-assessments";

export const refs = {
  google: {
    title: "Google ML Crash Course：线性回归",
    href: "https://developers.google.com/machine-learning/crash-course/linear-regression",
    note: "参考按概念、损失、优化组织知识的方式。本站虚拟传感器案例、文字、图表与代码均另行原创。",
  },
  loss: {
    title: "Google ML Crash Course：Loss",
    href: "https://developers.google.com/machine-learning/crash-course/linear-regression/loss",
    note: "核对 MAE、MSE 的定义及平方误差对大误差的影响。",
  },
  calculus: {
    title: "D2L：导数、偏导与梯度复习",
    href: "https://d2l.ai/chapter_preliminaries/calculus.html",
    note: "外部可阅读的导数补修资料。仅引用链接，不复制原书文字、图形或代码。",
  },
  d2l: {
    title: "D2L：线性回归",
    href: "https://d2l.ai/chapter_linear-regression/linear-regression.html",
    note: "参考先定义模型、损失再介绍优化的教学组织；注意原书可采用含 1/2 的平方损失，本教材使用完整 MSE。",
  },
  stanford: {
    title: "Stanford CS229：监督学习讲义",
    href: "https://see.stanford.edu/materials/aimlcs229/cs229-notes1.pdf",
    note: "可选进阶。该讲义使用 1/2 乘误差平方之和，本教材使用平均 MSE；梯度系数应随损失定义一起改变。未复制或再分发讲义材料。",
  },
  numpy: {
    title: "NumPy 官方教程：数组、形状与运算",
    href: "https://numpy.org/doc/stable/user/quickstart.html",
    note: "核对 ndarray.shape、逐元素运算与标量广播。",
  },
  lstsq: {
    title: "NumPy：最小二乘参考求解",
    href: "https://numpy.org/doc/stable/reference/generated/numpy.linalg.lstsq.html",
    note: "用于独立检查完整脚本，不要求本节先推导一般矩阵形式的解析解。",
  },
};
export const prep = {
  python: {
    title: "5.1 Python 函数与参数",
    href: "/learn/PY101/PY101-C05-L01",
    note: "真实可读样章，复习形参、返回值与函数调用。",
  },
  math: {
    title: "旧版补修：内积与求和符号",
    href: "/learn/MA101/MA101-C02-L02",
    note: "保留的旧版正文可补修内积与 Σ；新版 2.6 尚在筹备，此链接不对应新版 2.2。",
  },
  calculus: {
    title: "导数与偏导补修（D2L）",
    href: refs.calculus.href,
    note: "外部正文可阅读；本地微积分章节仍为规划，不伪装已有教材。",
  },
  arrays: {
    title: "旧版补修：NumPy 表示与数组形状",
    href: "/learn/MA101/MA101-C03-L03",
    note: "保留的旧版正文用于数组补修，不对应新版 3.3；新版 NumPy 专题规划为 3.5。",
  },
  data: {
    title: "数据处理先修课程规划",
    href: "/courses/DS101#DS101-C01",
    note: "本地章级规划，正文尚未开放；数组知识可先使用上述 NumPy 官方资料补修。",
  },
};
type Source = Pick<
  Lesson,
  "subtitle" | "objectives" | "prerequisites"
> &
  { sections: (Omit<Lesson["sections"][number], "tier"> & { tier?: Lesson["sections"][number]["tier"] })[] } &
  Partial<Pick<Lesson, "resources" | "references" | "prerequisiteLinks">>;
export function defineMlLesson(id: string, source: Source): Lesson {
  const slot = courseOutline.find((s) => s.lessonId === id);
  if (!slot) throw new Error(`未规划的 ML 课时：${id}`);
  return lessonSchema.parse({
    ...slot,
    id: slot.lessonId,
    contentVersion: 1,
    resources: [],
    references: [refs.google],
    prerequisiteLinks: [prep.python],
    ...mlTeachingProfiles[id],
    ...source,
    sections: source.sections.map((section, index) => {
      if (index !== source.sections.length - 1) return section;
      const blocks = [...section.blocks];
      const summaryIndex = blocks.findIndex((block) => block.type === "summary");
      blocks.splice(summaryIndex < 0 ? blocks.length : summaryIndex, 0, ...(coreAssessments[id] ?? []));
      return { ...section, blocks };
    }),
  });
}
export const p = (text: string): ContentBlock => ({ type: "paragraph", text });
export const m = (latex: string, explanation: string): ContentBlock => ({
  type: "math",
  latex,
  explanation,
});
export const note = (title: string, text: string): ContentBlock => ({
  type: "callout",
  title,
  text,
});
export const summary = (points: string[]): ContentBlock => ({
  type: "summary",
  points,
});
export const links = (
  title: string,
  items: { title: string; href: string; note: string }[],
): ContentBlock => ({ type: "reading-links", title, links: items });
