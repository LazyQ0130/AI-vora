import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { lessonSchema, type Lesson } from "../src/content/models";
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
  assert.doesNotMatch(html, /对应目标/);
  assert.match(html, /迁移练习/);
  assert.match(html, /尚未标记读完/);
  assert.match(html, /aria-label="本节已浏览比例"/);
  assert.match(html, /aria-valuenow="100"/);
  assert.match(html, /浏览比例不代表练习完成或掌握程度/);
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
      assert.doesNotMatch(html, /核心练习/);
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

test("目标短文案绑定正式原文，拒绝未知、重复及过期绑定", () => {
  assert.equal(ai.objectiveDisplay?.length, ai.objectives.length);
  for (const entry of ai.objectiveDisplay ?? []) {
    assert.ok(ai.objectives.includes(entry.objective));
    assert.ok(panel(ai).includes(entry.title));
    assert.ok(panel(ai).includes(entry.description));
  }
  const entry = ai.objectiveDisplay![0];
  assert.equal(lessonSchema.safeParse({ ...ai, objectiveDisplay: [{ ...entry, objective: "不存在的目标" }] }).success, false);
  assert.equal(lessonSchema.safeParse({ ...ai, objectiveDisplay: [entry, entry] }).success, false);
  assert.equal(lessonSchema.safeParse({ ...ai, objectives: ai.objectives.map((goal, i) => i ? goal : `${goal}（修订）`) }).success, false);
  const fallback = panel({ ...ai, objectiveDisplay: undefined });
  for (const objective of ai.objectives) assert.ok(fallback.includes(objective));
  assert.doesNotMatch(fallback, /查看完整目标/);
});

test("面板展示类型与正文相同，阅读比例与手动标记可独立呈现", () => {
  for (const lesson of lessonRegistry.values()) for (const exercise of lessonExerciseLinks(lesson)) {
    const block = lesson.sections.flatMap((section) => section.blocks).find((block) => block.type === "exercise" && block.id === exercise.id);
    assert.ok(block?.type === "exercise");
    assert.equal(exercise.kind, block.kind);
  }
  const html = renderToStaticMarkup(createElement(LearningPanel, { lesson: ai, progress: 37, completed: true, onNavigate: () => {} }));
  assert.match(html, /aria-valuenow="37"/);
  assert.match(html, /已手动标记读完/);
  assert.doesNotMatch(html, /progress-ring/);
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
