import { z } from "zod";
import { mathCourseOutline } from "./math-outline";
import { ai000ChapterLessons } from "./ai000-outline";

const slotSchema = z.object({
  courseId: z.string().regex(/^[A-Z]+\d{3}$/),
  chapterId: z.string().regex(/^[A-Z]+\d{3}-C\d{2}$/),
  lessonId: z.string().regex(/^[A-Z]+\d{3}-C\d{2}-L\d{2}$/),
  title: z.string().min(1),
  order: z.number().int().positive(),
});
function chapterSlots(
  courseId: string,
  chapter: number,
  lessons: [string, string][],
) {
  const chapterId = `${courseId}-C${String(chapter).padStart(2, "0")}`;
  return lessons.map(([suffix, title], index) =>
    slotSchema.parse({
      courseId,
      chapterId,
      lessonId: `${chapterId}-${suffix}`,
      title,
      order: index + 1,
    }),
  );
}
// 节级编辑蓝图；不修改 V1.0 章级事实，也不表示这些课时已写完。
export const courseOutline = [
  ...ai000ChapterLessons.flatMap((titles, index) => chapterSlots("AI000", index + 1,
    titles.map((title, order) => [`L${String(order + 1).padStart(2, "0")}`, title]))),
  ...chapterSlots("ML201", 1, [
    ["L01", "什么是机器学习"],
    ["L02", "如何定义预测任务"],
    ["L03", "数据、特征与标签"],
  ]),
  ...chapterSlots("ML201", 2, [
    ["L01", "训练集、验证集和测试集"],
    ["L02", "数据泄漏是怎样发生的"],
  ]),
  ...chapterSlots("ML201", 3, [
    ["L01", "从现实问题认识回归"],
    ["L02", "线性回归模型：权重与偏置"],
    ["L03", "预测误差、MAE 与 MSE"],
    ["L04", "最小二乘法的基本思想"],
  ]),
  // L01 由旧综合试读占用；显示顺序独立于稳定 ID。
  ...chapterSlots("ML201", 4, [
    ["L02", "从导数理解优化方向"],
    ["L03", "梯度下降的数学原理"],
    ["L04", "手动计算一次参数更新"],
    ["L05", "使用 NumPy 实现线性回归"],
    ["L06", "学习率与收敛实验"],
    ["L07", "综合练习与实验分析"],
  ]),
  // 第一章节级蓝图；实际可读性由Publication门禁决定。
  ...chapterSlots("PY101", 1, [
    ["L01", "从零运行第一个Python程序"],
    ["L02", "解释器怎样找到并执行脚本"],
    ["L03", "用编辑器完成保存与重跑"],
    ["L04", "为项目准备独立的虚拟环境"],
    ["L05", "在Jupyter中按顺序运行单元格"],
    ["L06", "让别人复现一次环境问题"],
  ]),
  // 第二章六节已接入。
  ...chapterSlots("PY101", 2, [
    ["L01", "用变量保留并更新程序里的值"],
    ["L02", "分清文字、整数、小数和真假值"],
    ["L03", "用表达式算出一个结果"],
    ["L04", "让比较表达式给出真假结果"],
    ["L05", "取得用户输入，再转成需要的数值"],
    ["L06", "把输入和计算整理成清楚的输出"],
  ]),
  // P16只注册3.1，其余第三章规划保留在docs/py101-p16蓝图。
  ...chapterSlots("PY101", 3, [
    ["L01", "让程序根据条件决定是否执行"],
  ]),
  ...chapterSlots("PY101", 5, [
    ["L01", "Python 函数与参数"],
    ["L02", "位置与关键字参数绑定"],
    ["L03", "返回值与 print 的区别"],
    ["L04", "函数内外的变量与作用域"],
    ["L05", "简单默认参数"],
    ["L06", "可选进阶：共享对象与接口陷阱"],
  ]),
  ...mathCourseOutline,
];
if (
  new Set(courseOutline.map((slot) => slot.lessonId)).size !==
  courseOutline.length
)
  throw new Error("节级蓝图 ID 重复");
export const mlV2LessonIds = [
  "ML201-C03-L01",
  "ML201-C03-L02",
  "ML201-C03-L03",
  "ML201-C04-L02",
  "ML201-C04-L03",
  "ML201-C04-L04",
  "ML201-C04-L05",
] as const;
