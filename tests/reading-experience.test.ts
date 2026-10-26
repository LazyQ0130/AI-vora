import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Lesson } from "../src/content/models";
import { lessonRegistry } from "../src/lib/course-engine";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { LearningPanel } from "../src/components/lesson/learning-support";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { parseReadingProgress, progressKey } from "../src/lib/learning-progress";

const ai = lessonRegistry.get("AI000-C01-L01")!;
const originalAi = JSON.parse(readFileSync(new URL("../docs/ai000-1-1/AI000_REGISTERED_LESSON.json", import.meta.url), "utf8")) as Lesson;
const panel = (lesson: Lesson, completed = false) => renderToStaticMarkup(createElement(LearningPanel, {
  lesson, progress: 100, completed, onNavigate: () => {},
}));

test("学习面板把 AI 两道达标题按正文顺序显示一次，保留一题对应多个目标", () => {
  assert.deepEqual(lessonExerciseLinks(ai).map(({ id, objectives }) => ({ id, objectives })), [
    { id: "identify-systems", objectives: [2] },
    { id: "product-review", objectives: [1, 3] },
  ]);
  const html = panel(ai);
  assert.equal((html.match(/href="#exercise-product-review"/g) ?? []).length, 1);
  assert.equal((html.match(/href="#exercise-identify-systems"/g) ?? []).length, 1);
  assert.match(html, /对应目标 1、3/);
  assert.match(html, /尚未标记读完/);
  assert.match(html, /本节已阅读 100%/);
  assert.doesNotMatch(html, /练习通过|已掌握|文章目录/);
  assert.match(panel(ai, true), /已手动标记读完/);
  assert.doesNotMatch(html, /<details[^>]*\sopen/);
});

test("所有教材面板入口对应真实练习，核心与可选层级不混淆", () => {
  for (const lesson of lessonRegistry.values()) {
    const links = lessonExerciseLinks(lesson);
    assert.equal(new Set(links.map((entry) => entry.id)).size, links.length);
    for (const row of lesson.assessmentMap) for (const exerciseId of row.exerciseIds) {
      const link = links.find((entry) => entry.id === exerciseId)!;
      assert.ok(link, `${lesson.id}#${exerciseId}`);
      assert.ok(link.objectives.includes(row.objective));
      assert.equal(link.tier, lesson.optionalLesson ? "advanced" : "core");
    }
    const html = panel(lesson);
    for (const objective of lesson.objectives) assert.ok(html.includes(objective.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")));
    if (lesson.optionalLesson) {
      assert.match(html, /可选挑战/);
      assert.doesNotMatch(html, /达标练习/);
    }
  }
  const scaling = lessonRegistry.get("MA101-C02-L06")!;
  const html = panel(scaling);
  const coreHtml = html.split("可选拓展与验证")[0];
  assert.match(coreHtml, /href="#exercise-scale-explain"/);
  assert.doesNotMatch(coreHtml, /href="#exercise-one-factor"/);
  assert.match(html, /href="#exercise-one-factor"/);
  assert.match(html, /可选进阶/);
  assert.match(panel(lessonRegistry.get("ML201-C04-L04")!), /可选验证/);
});

test("AI 教学表达改编保留全部题干、提示、解答、自查标准及旧修订书签", () => {
  const exercises = (lesson: Lesson) => lesson.sections.flatMap((section) => section.blocks.filter((block) => block.type === "exercise"));
  assert.deepEqual(exercises(ai), exercises(originalAi));
  assert.deepEqual(ai.assessmentMap, originalAi.assessmentMap);
  assert.deepEqual(lessonProgressScope(ai), lessonProgressScope(originalAi));
  const scope = lessonProgressScope(ai);
  assert.equal(progressKey(scope), "aivora:learning:v2:AI000:AI000-C01-L01:r1");
  for (const section of originalAi.sections) {
    const raw = JSON.stringify({ version: 2, courseId: ai.courseId, lessonId: ai.id, contentVersion: 1,
      percent: 100, completed: true, section: section.id, updatedAt: 1792972800000 });
    assert.equal(parseReadingProgress(raw, scope)?.section, section.id);
    assert.equal(parseReadingProgress(raw, scope)?.completed, true);
  }
});
