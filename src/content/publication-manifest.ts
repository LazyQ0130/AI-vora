import { isReadable, publicationSchema } from "./models";

// 发布权限独立于原始课程规划。技术证据不替代人工审核。
export const publicationManifest = [
  {
    lessonId: "ML201-C04-L01",
    courseId: "ML201",
    chapterId: "ML201-C04",
    title: "线性回归与梯度下降",
    contentVersion: 1,
    order: 1,
    status: "pending-review",
    access: "preview",
    technicalEvidence: "docs/COURSE_ENGINE_PYTHON_RESULTS.json",
  },
  {
    lessonId: "PY101-C05-L01",
    courseId: "PY101",
    chapterId: "PY101-C05",
    title: "Python 函数与参数",
    contentVersion: 1,
    order: 1,
    status: "pending-review",
    access: "preview",
    technicalEvidence: "docs/COURSE_ENGINE_PYTHON_RESULTS.json",
  },
  {
    lessonId: "MA101-C03-L01",
    courseId: "MA101",
    chapterId: "MA101-C03",
    title: "向量与矩阵的基本运算",
    contentVersion: 1,
    order: 1,
    status: "pending-review",
    access: "preview",
    technicalEvidence: "docs/COURSE_ENGINE_PYTHON_RESULTS.json",
  },
].map((entry) => publicationSchema.parse(entry));

export const readablePublications = publicationManifest.filter(isReadable);
export const lessonHref = (entry: { courseId: string; lessonId: string }) =>
  `/learn/${entry.courseId}/${entry.lessonId}`;
