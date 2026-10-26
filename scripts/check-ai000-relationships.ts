import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry, resolveLesson, getAdjacentLessons, getLearningCourse } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { isReadable, lessonSchema } from "../src/content/models";
import { evidencePath } from "./evidence-path";

const fingerprint = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const before = JSON.parse(readFileSync(evidencePath("BASELINE.json"), "utf8")) as { id: string; version: number; digest: string }[];
assert.equal(before.length, 24);
assert.equal(lessonRegistry.size, before.length + 1);
for (const old of before) {
  const current = lessonRegistry.get(old.id)!;
  assert.equal(current.contentVersion, old.version);
  assert.equal(fingerprint(current), old.digest, `${old.id} 注册全文必须保持不变`);
}

const lesson = lessonRegistry.get("AI000-C02-L01")!;
lessonSchema.parse(lesson);
const publication = publicationManifest.find((entry) => entry.lessonId === lesson.id)!;
const course = getLearningCourse("AI000")!;
const blocks = lesson.sections.flatMap((section) => section.blocks);
assert.equal(course.chapters.length, 7);
assert.equal(course.status, "planned");
assert.equal(course.chapters[1].lessons[0].displayNumber, "2.1");
assert.equal(lesson.contentVersion, 1);
assert.deepEqual(lesson.prerequisiteLinks.map((link) => link.href), ["/learn/AI000/AI000-C01-L01"]);
assert.ok(blocks.every((block) => !["code", "math", "experiment", "downloads", "quiz"].includes(block.type)));
assert.deepEqual(blocks.filter((block) => block.type === "ai-task-figure").map((block) => block.kind), ["method-hierarchy", "method-and-task"]);
assert.deepEqual(blocks.filter((block) => block.type === "exercise").map((block) => block.id), ["draw-method-map", "classify-new-systems"]);
for (const section of lesson.sections) {
  assert.equal(section.tier, "core");
  for (const block of section.blocks.filter((block) => block.type === "exercise")) {
    assert.equal(block.hints.length, 2);
    assert.ok(block.solution.some((step) => step.includes("常见错误")));
    assert.ok(block.rubric.length >= 4);
  }
}
assert.equal(resolveLesson("AI000", "AI000-C02-L02"), undefined);
assert.equal(resolveLesson("PY101", lesson.id), undefined);
const adjacentFromIntro = getAdjacentLessons(course, "AI000-C01-L01");
if (isReadable(publication)) {
  assert.equal(resolveLesson("AI000", lesson.id)?.lesson.id, lesson.id);
  assert.equal(adjacentFromIntro.next?.lessonId, lesson.id);
  assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "AI000-C01-L01");
  assert.equal(getAdjacentLessons(course, lesson.id).next, undefined);
} else {
  assert.equal(publication.status, "draft");
  assert.equal(publication.access, "private");
  assert.equal(resolveLesson("AI000", lesson.id), undefined);
  assert.equal(course.chapters[1].lessons[0].href, undefined);
  assert.equal(adjacentFromIntro.next, undefined);
}
const result = {
  checkedAt: new Date().toISOString(), unchangedRegisteredLessons: before.length,
  lessonId: lesson.id, status: publication.status, access: publication.access,
  readable: isReadable(publication), courseStatus: course.status,
  displayNumber: course.chapters[1].lessons[0].displayNumber,
  introNext: adjacentFromIntro.next?.lessonId ?? null,
  previous: getAdjacentLessons(course, lesson.id).previous?.lessonId ?? null,
  next: getAdjacentLessons(course, lesson.id).next?.lessonId ?? null,
  futureLessonResolves: false, wrongCourseResolves: false,
  objectives: lesson.assessmentMap, figures: blocks.filter((block) => block.type === "ai-task-figure"),
  note: "24篇既有注册稿逐字节摘要一致，包括 AI000 1.1。图与题的概念、答案另由题干重做核对，见审查报告；结构断言不代表人工审稿或试学。",
};
writeFileSync(evidencePath(isReadable(publication) ? "CONTENT_CHECKS.json" : "DRAFT_GATE.json"), JSON.stringify(result, null, 2) + "\n");
writeFileSync(evidencePath("AI000_C02_L01_REGISTERED_LESSON.json"), JSON.stringify(lesson, null, 2) + "\n");
console.log(`AI000 2.1 ${publication.status}/${publication.access}：24篇既有稿兼容、目标/图/题、导航与路由门禁通过`);
