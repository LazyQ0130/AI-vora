import assert from "node:assert/strict";
import { lessonRegistry, getLearningCourse } from "../../src/lib/course-engine";
import { publicationManifest, readablePublications } from "../../src/content/publication-manifest";
import { isReadable } from "../../src/content/models";

// 当前清单与实际注册集合双向相等，避免每增一课修改多处固定总数。
// 历史全文/哈希循环继续独立执行；P1专项检查只允许增加指定课时。
export function assertRegisteredInventory() {
  assert.deepEqual([...lessonRegistry.keys()].sort(), publicationManifest.map(p => p.lessonId).sort());
  assert.deepEqual(readablePublications.map(p => p.lessonId).sort(), publicationManifest.filter(isReadable).map(p => p.lessonId).sort());
}
export function assertCourseAvailability(courseId: string) {
  const course = getLearningCourse(courseId)!;
  const expected = publicationManifest.filter(p => p.courseId === courseId && isReadable(p));
  assert.equal(course.status, "planned");
  assert.deepEqual(course.chapters.flatMap(c => c.lessons).filter(l => l.href).map(l => l.lessonId).sort(), expected.filter(p => p.catalogRole !== "legacy").map(p => p.lessonId).sort());
  assert.deepEqual(course.legacyLessons.map(p => p.lessonId).sort(), expected.filter(p => p.catalogRole === "legacy").map(p => p.lessonId).sort());
}
