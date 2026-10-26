import test from "node:test";
import assert from "node:assert/strict";
import { lessonRegistry, resolveLesson, getLearningCourse, lessonSummaries } from "../src/lib/course-engine";
import { lessonSchema } from "../src/content/models";
import { parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { summarizeCourseReading } from "../src/lib/course-reading-summary";
import { glossary } from "../src/content/glossary";

test("V2.1 每个目标有核心开放练习，映射、提示、预计时间有效", () => {
  for (const lesson of lessonRegistry.values()) {
    assert.ok(lessonSchema.safeParse(lesson).success, lesson.id);
    assert.equal(lesson.assessmentMap.length, lesson.objectives.length);
    for (const row of lesson.assessmentMap) for (const id of row.exerciseIds) {
      const section = lesson.sections.find((s) => s.blocks.some((b) => b.type === "exercise" && b.id === id))!;
      assert.ok(section, `${lesson.id} ${id}`);
      assert.ok(lesson.optionalLesson || section.tier === "core");
    }
    assert.equal(lesson.learningTime.basis, "editorial-estimate");
    assert.equal("durationMinutes" in lesson, false);
  }
});
test("V2.1 拒绝遗漏目标、未知练习、仅以进阶题验收基础目标及反向时间范围", () => {
  const lesson = lessonRegistry.get("PY101-C05-L01")!;
  for (const changed of [
    { ...lesson, assessmentMap: lesson.assessmentMap.slice(1) },
    { ...lesson, assessmentMap: [{ objective: 1, exerciseIds: ["unknown"] }, ...lesson.assessmentMap.slice(1)] },
    { ...lesson, sections: lesson.sections.map((s) => s.id === "quiz" ? { ...s, tier: "advanced" } : s) },
    { ...lesson, learningTime: { ...lesson.learningTime, reading: [20,5] } },
  ]) assert.equal(lessonSchema.safeParse(changed).success, false);
});
test("V2.1 旧可分享 URL、全部历史锚点、存储键和完成记录保留", () => {
  const anchors: Record<string,string[]> = {
    "PY101-C05-L01": ["concept","binding","defaults","code","quiz","summary"],
    "MA101-C03-L01": ["vectors","matrices","multiply","code","quiz","summary"],
    "ML201-C04-L05": ["environment","shapes","full-code","experiment","review"],
  };
  for (const [id, ids] of Object.entries(anchors)) {
    const lesson = resolveLesson(id.split("-")[0], id)!.lesson;
    const scope = { courseId: lesson.courseId, lessonId: id, contentVersion: 1, sectionIds: lesson.sections.map((s) => s.id) };
    assert.equal(progressKey(scope), `aivora:learning:v2:${lesson.courseId}:${id}:r1`);
    for (const section of ids) {
      assert.ok(scope.sectionIds.includes(section));
      const old = { version: 2, ...scope, section, completed: true, percent: 100, updatedAt: 1 };
      assert.equal(parseReadingProgress(JSON.stringify(old), scope)?.completed, true);
    }
  }
});
test("V2.1 先修顺序连通，扩展课不计基础完成分母", () => {
  assert.equal(getLearningCourse("PY101")!.chapters[4].lessons.length, 6);
  assert.equal(getLearningCourse("MA101")!.chapters[1].lessons.length, 8);
  assert.equal(getLearningCourse("MA101")!.chapters[2].lessons.length, 6);
  const optional = lessonSummaries.find((l) => l.lessonId === "PY101-C05-L06")!;
  const summary = summarizeCourseReading(lessonSummaries, [{ lesson: optional, progress: { version: 2, courseId: optional.courseId, lessonId: optional.lessonId, contentVersion: 1, percent: 100, completed: true, section: "summary", updatedAt: 1 } }]).find((c) => c.courseId === "PY101")!;
  assert.equal(summary.available, 5);
  assert.equal(summary.completed, 0);
  assert.equal(summary.percent, 0);
  for (const lesson of lessonRegistry.values()) {
    const links = [...lesson.prerequisiteLinks, ...lesson.sections.flatMap((s) => s.blocks.flatMap((b) => b.type === "reading-links" ? b.links : []))];
    for (const link of links) if (link.href.startsWith("/learn/")) {
      const [, , course, id] = link.href.split("/");
      assert.ok(resolveLesson(course,id), `${lesson.id}: ${link.href}`);
    }
  }
});
test("V2.1 共享术语完整；训练主线不强制学习验证工程", () => {
  for (const id of ["input","feature","target","label","prediction","error","residual","loss","parameter","weight","bias","gradient","learning-rate","iteration","convergence","training","validation","test","generalization"])
    assert.ok(glossary.some((term) => term.id === id));
  assert.match(glossary.find((t) => t.id === "error")!.definition, /prediction - target/);
  const ml = lessonRegistry.get("ML201-C04-L05")!;
  assert.equal(ml.sections.find((s) => s.id === "full-code")?.tier, "verification");
  assert.equal(ml.sections.find((s) => s.id === "experiment")?.tier, "advanced");
  const core = JSON.stringify(ml.sections.filter((s) => s.tier === "core"));
  assert.doesNotMatch(core, /linalg\.lstsq|raise FloatingPointError|try:\\n/);
});
