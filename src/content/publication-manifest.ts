import { isReadable, publicationSchema } from "./models";
import { legacyMathSlots, maV22LessonIds } from "./math-outline";
import { courseOutline, mlV2LessonIds } from "./course-outline";

// 发布权限独立于原始课程规划。技术证据不替代人工审核。
export const publicationManifest = [
  ...courseOutline
    .filter((slot) => mlV2LessonIds.some((id) => id === slot.lessonId) || slot.courseId === "PY101" || maV22LessonIds.some((id) => id === slot.lessonId))
    .map((slot) => ({
      ...slot,
      contentVersion: 1,
      optionalLesson: slot.lessonId === "PY101-C05-L06",
      catalogRole: "current",
      status: "pending-review",
      access: "preview",
      technicalEvidence: slot.courseId === "MA101" ? "docs/TEACHING_V2_2_PYTHON_RESULTS.json" : "docs/TEACHING_V2_1_PYTHON_RESULTS.json",
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
