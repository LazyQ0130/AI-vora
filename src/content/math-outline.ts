// 稳定 ID 不复用 V2.1 已有地址；显示编号由 order 独立决定。
const slots = (chapter: number, items: [number,string][]) => items.map(([id,title], index) => ({
  courseId: "MA101", chapterId: `MA101-C${String(chapter).padStart(2,"0")}`,
  lessonId: `MA101-C${String(chapter).padStart(2,"0")}-L${String(id).padStart(2,"0")}`,
  title, order: index+1,
}));
export const mathCourseOutline = [
  ...slots(2, [[3,"什么是向量？"],[4,"向量的表示、维度与分量"],[5,"向量加法：计算方法与几何意义"],[6,"向量数乘：长度与方向变化"],[7,"向量的模与距离"],[8,"向量内积"],[9,"向量投影与实际应用"],[10,"综合练习：向量建模与解释"]]),
  ...slots(3, [[4,"矩阵的概念与表示"],[5,"矩阵加法与数乘"],[6,"矩阵转置"],[7,"矩阵乘法：行与列的配对"],[8,"NumPy 矩阵实践（可选代码）"],[9,"线性变换入门"]]),
];
export const maV22LessonIds = ["MA101-C02-L03","MA101-C02-L04","MA101-C02-L05","MA101-C02-L06"] as const;
export const legacyMathSlots = [
  ...slots(2, [[1,"向量、加法与数乘"],[2,"内积与求和符号"]]),
  ...slots(3, [[1,"向量与矩阵的基本运算"],[2,"矩阵乘法：行与列的内积"],[3,"NumPy 表示与数组形状"]]),
];
