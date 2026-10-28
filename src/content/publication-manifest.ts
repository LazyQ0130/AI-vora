import { isReadable, publicationSchema } from "./models";
import { legacyMathSlots, maV22LessonIds } from "./math-outline";
import { courseOutline, mlV2LessonIds } from "./course-outline";

const revisedCoreLessons: Record<string, number> = { "MA101-C02-L03": 2, "PY101-C05-L01": 2 };

// 发布权限独立于原始课程规划。技术证据不替代人工审核。
export const publicationManifest = [
  {lessonId:"AI000-C05-L03",courseId:"AI000",chapterId:"AI000-C05",title:"多模态 AI：连接文字、图片与声音",contentVersion:2,order:3,status:"pending-review",access:"preview",technicalEvidence:"docs/AI000_CROSS_LESSON_QUALITY_REVIEW.md"},
  {lessonId:"AI000-C05-L04",courseId:"AI000",chapterId:"AI000-C05",title:"生成模型：从要求到可核对的作品",contentVersion:1,order:4,status:"pending-review",access:"preview",technicalEvidence:"docs/AI000_CROSS_LESSON_QUALITY_REVIEW.md"},
  {lessonId:"AI000-C05-L02",courseId:"AI000",chapterId:"AI000-C05",title:"计算机视觉：让机器理解图像",contentVersion:1,order:2,status:"pending-review",access:"preview",technicalEvidence:"docs/AI000_LESSON_5_2_REVIEW.md"},
  {lessonId:"AI000-C05-L01",courseId:"AI000",chapterId:"AI000-C05",title:"自然语言处理与大语言模型",contentVersion:1,order:1,status:"pending-review",access:"preview",technicalEvidence:"docs/AI000_CROSS_LESSON_QUALITY_REVIEW.md"},
  {lessonId:"AI000-C04-L04",courseId:"AI000",chapterId:"AI000-C04",title:"模型训练好以后，如何完成预测？",contentVersion:1,order:4,status:"pending-review",access:"preview",technicalEvidence:"docs/AI000_CROSS_LESSON_QUALITY_REVIEW.md"},
  {lessonId:"AI000-C04-L03",courseId:"AI000",chapterId:"AI000-C04",title:"训练、验证与测试各有什么作用？",contentVersion:1,order:3,status:"pending-review",access:"preview",technicalEvidence:"docs/AI000_CROSS_LESSON_QUALITY_REVIEW.md"},
  {lessonId:"AI000-C04-L02",courseId:"AI000",chapterId:"AI000-C04",title:"模型和参数是怎样得到的？",contentVersion:1,order:2,status:"pending-review",access:"preview",technicalEvidence:"docs/AI000_VISUAL_CONTENT_REFINEMENT.md"},
  {lessonId:"AI000-C04-L01",courseId:"AI000",chapterId:"AI000-C04",title:"数据、特征与标签",contentVersion:1,order:1,status:"pending-review",access:"preview",technicalEvidence:"docs/AI000_VISUAL_CONTENT_REFINEMENT.md"},
  {lessonId:"AI000-C03-L04",courseId:"AI000",chapterId:"AI000-C03",title:"强化学习：通过行动与反馈学习",contentVersion:1,order:4,status:"pending-review",access:"preview",technicalEvidence:"docs/AI000_CROSS_LESSON_QUALITY_REVIEW.md"},
  {lessonId:"AI000-C03-L03",courseId:"AI000",chapterId:"AI000-C03",title:"自监督学习：怎样从数据本身构造学习任务？",contentVersion:1,order:3,status:"pending-review",access:"preview",technicalEvidence:"docs/AI000_CROSS_LESSON_QUALITY_REVIEW.md"},
  {lessonId:"AI000-C03-L02",courseId:"AI000",chapterId:"AI000-C03",title:"无监督学习：没有标签也能发现规律吗？",contentVersion:2,order:2,status:"pending-review",access:"preview",technicalEvidence:"docs/AI000_CROSS_LESSON_QUALITY_REVIEW.md"},
  {lessonId:"AI000-C03-L01",courseId:"AI000",chapterId:"AI000-C03",title:"监督学习：从有答案的例子中学习",contentVersion:1,order:1,status:"pending-review",access:"preview",technicalEvidence:"docs/AI000_CROSS_LESSON_QUALITY_REVIEW.md"},
  ...courseOutline.filter(slot => slot.courseId === "AI000" && ["AI000-C01-L02","AI000-C01-L03","AI000-C02-L02"].includes(slot.lessonId)).map(slot => ({...slot,contentVersion:slot.lessonId === "AI000-C01-L02" ? 2 : 1,status:"pending-review",access:"preview",technicalEvidence:"docs/AI000_CROSS_LESSON_QUALITY_REVIEW.md"})),
  {
    lessonId: "AI000-C02-L01",
    courseId: "AI000",
    chapterId: "AI000-C02",
    title: "AI、机器学习与深度学习，到底是什么关系？",
    contentVersion: 2,
    order: 1,
    status: "pending-review",
    access: "preview",
    technicalEvidence:"docs/AI000_CROSS_LESSON_QUALITY_REVIEW.md",
  },
  {
    lessonId: "AI000-C01-L01",
    courseId: "AI000",
    chapterId: "AI000-C01",
    title: "人工智能究竟是什么？",
    contentVersion: 2,
    order: 1,
    status: "pending-review",
    access: "preview",
    technicalEvidence:"docs/AI000_CROSS_LESSON_QUALITY_REVIEW.md",
  },
  ...courseOutline
    .filter((slot) => mlV2LessonIds.some((id) => id === slot.lessonId) || slot.courseId === "PY101" || maV22LessonIds.some((id) => id === slot.lessonId))
    .map((slot) => ({
      ...slot,
      contentVersion: revisedCoreLessons[slot.lessonId] ?? 1,
      optionalLesson: slot.lessonId === "PY101-C05-L06",
      catalogRole: "current",
      status: "pending-review",
      access: "preview",
      technicalEvidence: slot.lessonId === "MA101-C02-L03" || slot.lessonId === "ML201-C04-L04" || (slot.courseId === "PY101" && slot.lessonId !== "PY101-C05-L06")
        ? "docs/CROSS_DISCIPLINE_EDITORIAL_VALIDATION_V1.md"
        : slot.courseId === "MA101" ? "docs/MA101_EDITORIAL_REVIEW_V1.md" : "docs/TEACHING_V2_1_PYTHON_RESULTS.json",
    })),
  ...legacyMathSlots.map((slot) => ({ ...slot, catalogRole: "legacy", contentVersion: 1, status: "pending-review", access: "preview", technicalEvidence: "docs/TEACHING_V2_1_PYTHON_RESULTS.json" })),
  {
    lessonId: "ML201-C04-L01",
    courseId: "ML201",
    chapterId: "ML201-C04",
    title: "线性回归与梯度下降",
    contentVersion: 1,
    order: 1,
    catalogRole: "legacy",
    status: "pending-review",
    access: "preview",
    technicalEvidence: "docs/TEACHING_V2_1_PYTHON_RESULTS.json",
  },
].map((entry) => publicationSchema.parse(entry));

export const readablePublications = publicationManifest.filter(isReadable);
export const lessonHref = (entry: { courseId: string; lessonId: string }) =>
  `/learn/${entry.courseId}/${entry.lessonId}`;
