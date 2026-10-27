import { isReadable, publicationSchema } from "./models";
import { legacyMathSlots, maV22LessonIds } from "./math-outline";
import { courseOutline, mlV2LessonIds } from "./course-outline";

const revisedCoreLessons: Record<string, number> = { "MA101-C02-L03": 2, "PY101-C05-L01": 2 };

// 发布权限独立于原始课程规划。技术证据不替代人工审核。
export const publicationManifest = [
  {lessonId:"AI000-C03-L01",courseId:"AI000",chapterId:"AI000-C03",title:"监督学习：从有答案的例子中学习",contentVersion:1,order:1,status:"pending-review",access:"preview",technicalEvidence:"docs/AI000_3_1_AND_EDITORIAL_REFINEMENT.md"},
  ...courseOutline.filter(slot => slot.courseId === "AI000" && ["AI000-C01-L02","AI000-C01-L03","AI000-C02-L02"].includes(slot.lessonId)).map(slot => ({...slot,contentVersion:1,status:"pending-review",access:"preview",technicalEvidence:slot.lessonId==="AI000-C01-L03"?"docs/AI000_3_1_AND_EDITORIAL_REFINEMENT.md":"docs/AI000_CHAPTER_1_2_DELIVERY.md"})),
  {
    lessonId: "AI000-C02-L01",
    courseId: "AI000",
    chapterId: "AI000-C02",
    title: "AI、机器学习与深度学习，到底是什么关系？",
    contentVersion: 2,
    order: 1,
    status: "pending-review",
    access: "preview",
    technicalEvidence:"docs/AI000_CHAPTER_1_2_DELIVERY.md",
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
    technicalEvidence:"docs/AI000_CHAPTER_1_2_DELIVERY.md",
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
