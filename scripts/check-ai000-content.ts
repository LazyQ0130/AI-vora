import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { lessonRegistry, resolveLesson, getAdjacentLessons, getLearningCourse } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { isReadable, lessonSchema } from "../src/content/models";
import { keywordMailDecision, mailExamples } from "../src/content/lessons/ai000/mail-example";
import { evidencePath } from "./evidence-path";

const lesson = lessonRegistry.get("AI000-C01-L01")!;
lessonSchema.parse(lesson);
const publication = publicationManifest.find((entry) => entry.lessonId === lesson.id)!;
const course = getLearningCourse("AI000")!;
const blocks = lesson.sections.flatMap((section) => section.blocks);
// 独立预期按题干逐封推演，不从渲染结果回填答案。
assert.deepEqual(mailExamples.map((mail) => keywordMailDecision(mail.subject)), ["垃圾", "垃圾", "正常", "正常"]);
assert.deepEqual(mailExamples.map((mail) => mail.expected), ["垃圾", "正常", "正常", "垃圾"]);
assert.equal(keywordMailDecision("领取礼品，立即登记"), "正常");
assert.equal(keywordMailDecision("你报名的免费讲座明晚开始"), "垃圾");
assert.equal(blocks.some((block) => ["math", "code", "downloads", "experiment"].includes(block.type)), false);
assert.equal(blocks.filter((block) => block.type === "exercise").length, 2);
assert.equal(course.status, "planned");
assert.equal(course.chapters.flatMap((chapter) => chapter.lessons).length, 1);
assert.equal(resolveLesson("AI000", "AI000-C01-L02"), undefined);
assert.equal(getAdjacentLessons(course, lesson.id).next, undefined);
assert.equal(getAdjacentLessons(course, lesson.id).previous, undefined);
if (!isReadable(publication)) {
  assert.equal(publication.access, "private");
  assert.equal(resolveLesson("AI000", lesson.id), undefined);
  assert.equal(course.chapters[0].lessons[0].href, undefined);
}
const result = {
  checkedAt: new Date().toISOString(),
  lessonId: lesson.id, status: publication.status, access: publication.access,
  readable: isReadable(publication),
  courseStatus: course.status, next: null, previous: null, futureLessonResolves: false,
  ruleChecks: mailExamples.map((mail) => ({ id: mail.id, subject: mail.subject, givenCategory: mail.expected, ruleOutput: keywordMailDecision(mail.subject), correct: mail.expected === keywordMailDecision(mail.subject) })),
  exercises: blocks.filter((block) => block.type === "exercise").map((block) => ({ id: block.id, hints: block.hints.length, answerSteps: block.solution.length, rubric: block.rubric })),
  note: "规则输出由独立常量预期核对；开放题语义另见审查报告。本脚本不运行学习模型，不代表人工审核或学生试学。",
};
writeFileSync(evidencePath(isReadable(publication) ? "CONTENT_CHECKS.json" : "DRAFT_GATE.json"), JSON.stringify(result, null, 2) + "\n");
writeFileSync(evidencePath("AI000_REGISTERED_LESSON.json"), JSON.stringify(lesson, null, 2) + "\n");
console.log(`AI000 ${publication.status}/${publication.access}：邮件推演、模型、映射及路由门禁检查通过`);
