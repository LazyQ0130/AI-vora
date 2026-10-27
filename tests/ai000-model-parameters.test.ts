import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Lesson, Publication } from "../src/content/models";
import { modelsAndParametersLesson as lesson } from "../src/content/lessons/ai000/models-and-parameters";
import { parameterParcel, parcelParameterSettings, comparisonParcels, durationEstimate, minuteGap, printParameterSettings, printParameterRecords, libraryInitialParameters, libraryParameterRecords, libraryAdjustmentExamples } from "../src/content/lessons/ai000/model-parameter-example";
import { parcelTimeRecords } from "../src/content/lessons/ai000/parcel-time-example";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { assertEditorialRefinement41 } from "../scripts/ai000-editorial-compatibility";

const before = JSON.parse(readFileSync("docs/ai000-4-2/BEFORE.json", "utf8")) as { lessons: Lesson[]; publications: Publication[]; protectedFiles: { path: string; hash: string }[] };
const blocks = lesson.sections.flatMap(s => s.blocks);
// 另用逐件累加核对乘法关系，不把参考答案的输出读回当预期。
const addEstimate = (base: number, per: number, count: number) => { let result = base; for (let i = 0; i < count; i++) result += per; return result; };

test("模型主例：B同输入两组参数6/8均差1，A/B/C逐条及合计9/5独立核算", () => {
  assert.equal(parameterParcel.id, "B"); assert.equal(parameterParcel.waiting, 2); assert.equal(parameterParcel.actualMinutes, 7);
  assert.deepEqual(parcelParameterSettings.map(s => [s.baseMinutes, s.minutesPerItem]), [[2, 2], [4, 2]]);
  assert.deepEqual(parcelParameterSettings.map(s => durationEstimate(s, parameterParcel.waiting)), [6, 8]);
  assert.deepEqual(comparisonParcels.map(r => [r.id, r.waiting, r.actualMinutes]), [["A", 0, 4], ["B", 2, 7], ["C", 1, 10]]);
  const predictions = parcelParameterSettings.map(s => comparisonParcels.map(r => addEstimate(s.baseMinutes, s.minutesPerItem, r.waiting)));
  assert.deepEqual(predictions, [[2, 6, 4], [4, 8, 6]]);
  const gaps = predictions.map(values => values.map((v, i) => minuteGap(v, comparisonParcels[i].actualMinutes)));
  assert.deepEqual(gaps, [[2, 1, 6], [0, 1, 4]]); assert.deepEqual(gaps.map(g => g.reduce((a, b) => a + b, 0)), [9, 5]);
  const table = blocks.filter(b => b.type === "table").find(b => b.caption.startsWith("三条历史"))!;
  assert.deepEqual(table.rows, [["A / 0", "4", "2 / 2", "4 / 0"], ["B / 2", "7", "6 / 1", "8 / 1"], ["C / 1", "10", "4 / 6", "6 / 4"]]);
});

test("参数影响：基础改动平移预测，每件值改动按数量影响；同输入不能同时吻合A/E", () => {
  for (const count of [0, 1, 2, 3]) assert.equal(durationEstimate(parcelParameterSettings[1], count) - durationEstimate(parcelParameterSettings[0], count), 2);
  const changed = { baseMinutes: 4, minutesPerItem: 3 };
  const predictions = comparisonParcels.map(r => durationEstimate(changed, r.waiting));
  assert.deepEqual(predictions, [4, 10, 7]);
  assert.deepEqual(predictions.map((v, i) => minuteGap(v, comparisonParcels[i].actualMinutes)), [0, 3, 3]);
  const sameInput = parcelTimeRecords.filter(r => r.id === "A" || r.id === "E");
  assert.deepEqual(sameInput.map(r => [r.waiting, r.actualMinutes]), [[0, 4], [0, 8]]);
  assert.deepEqual(sameInput.map(r => durationEstimate(parcelParameterSettings[1], r.waiting)), [4, 4]);
});

test("参数图：同一B输入、两组参数与两项预测、同一历史7，描述与图注可访问", () => {
  const figure = blocks.find(b => b.type === "ai-task-figure")!;
  const html = renderToStaticMarkup(createElement(ContentRenderer, { block: figure, resources: [] }));
  assert.match(html, /<figure[^>]*aria-labelledby="[^"]+"[^>]*aria-describedby="[^"]+"/);
  if (figure.type === "ai-task-figure") assert.ok(html.includes(figure.alt) && html.includes(figure.caption));
  assert.match(html, /aria-label="先试两组参数"/);
  assert.equal((html.match(/class="ai-param-setting"/g) ?? []).length, 2);
  assert.match(html, /2 \+ 2 × 2 = 6分钟/); assert.match(html, /4 \+ 2 × 2 = 8分钟/);
  assert.match(html, /B实际用了 7分钟/); assert.match(html, /比实际少1分钟/); assert.match(html, /比实际多1分钟/);
  assert.doesNotMatch(html, /训练所得|训练后的参数|未运行模型|原创构造/);
});

test("打印迁移题：P赢家甲、Q赢家乙，总差距均1，不把单条优势推广到所有任务", () => {
  assert.deepEqual(printParameterSettings.map(s => [s.baseMinutes, s.minutesPerItem]), [[2, 2], [4, 1]]);
  assert.deepEqual(printParameterRecords.map(r => [r.count, r.actualMinutes]), [[3, 8], [1, 5]]);
  const predictions = printParameterSettings.map(s => printParameterRecords.map(r => durationEstimate(s, r.count)));
  assert.deepEqual(predictions, [[8, 4], [7, 5]]);
  assert.deepEqual(predictions.map(values => values.map((v, i) => minuteGap(v, printParameterRecords[i].actualMinutes))), [[0, 1], [1, 0]]);
  const exercise = blocks.filter(b => b.type === "exercise").find(e => e.id === "compare-print-settings")!;
  assert.ok(exercise.solution.some(s => s.includes("2+2×3=8") && s.includes("4+1×1=5")));
  assert.ok(exercise.solution.some(s => s.includes("甲0+1=1、乙1+0=1")));
});

test("图书开放题：原5/7/11；一组改善两条却损害第三，另一组只改善第一，接受范围明确", () => {
  const allSettings = [libraryInitialParameters, ...libraryAdjustmentExamples];
  const predictions = allSettings.map(s => libraryParameterRecords.map(r => addEstimate(s.baseMinutes, s.minutesPerItem, r.count)));
  assert.deepEqual(predictions, [[5, 7, 11], [6, 8, 12], [6, 7, 9]]);
  const gaps = predictions.map(values => values.map((v, i) => minuteGap(v, libraryParameterRecords[i].actualMinutes)));
  assert.deepEqual(gaps, [[1, 1, 1], [0, 0, 2], [0, 1, 1]]);
  assert.deepEqual(gaps.map(g => g.reduce((a, b) => a + b, 0)), [3, 2, 2]);
  for (const s of allSettings) for (const r of libraryParameterRecords) assert.equal(durationEstimate(s, r.count), addEstimate(s.baseMinutes, s.minutesPerItem, r.count));
  const exercise = blocks.filter(b => b.type === "exercise").find(e => e.id === "adjust-library-settings")!;
  assert.ok(exercise.solution.some(s => s.includes("前两条改善，第三条反而变差")));
  assert.ok(exercise.solution.some(s => s.includes("第一条改善，另两条差距没有改善")));
});

test("三目标真实映射两道核心开放题，提示/答案默认折叠，正文不加入高级公式和制作声明", () => {
  assert.deepEqual(lessonExerciseLinks(lesson).map(e => [e.id, e.tier, e.objectives]), [["compare-print-settings", "core", [1, 2]], ["adjust-library-settings", "core", [1, 3]]]);
  for (const exercise of blocks.filter(b => b.type === "exercise")) {
    assert.equal(exercise.hints.length, 2); assert.ok(exercise.solution.some(s => s.includes("常见错误")));
    assert.ok(exercise.solution.some(s => s.includes("接受"))); assert.equal(exercise.rubric.length, 4);
    const html = renderToStaticMarkup(createElement(ContentRenderer, { block: exercise, resources: [] }));
    assert.match(html, new RegExp(`id="exercise-${exercise.id}"`));
    assert.equal((html.match(/<details/g) ?? []).length, 3); assert.doesNotMatch(html, /<details[^>]*\sopen/);
  }
  assert.ok(blocks.every(b => !["code", "math", "experiment", "downloads"].includes(b.type)));
  assert.doesNotMatch(JSON.stringify(blocks), /原创教学|本课未经|未开展.*试学|没有运行模型|没有训练模型|标明.{0,3}教学构造/);
  assert.ok(lesson.sections.every(s => s.tier === "core" && !/^\d/.test(s.title)));
});

test("兼容：4.1只改19处限定说明且r1不变；其他32节全文、旧清单和受保护文件保持", () => {
  const old41 = before.lessons.find(l => l.id === "AI000-C04-L01")!;
  const after41 = lessonRegistry.get(old41.id)!;
  assert.equal(assertEditorialRefinement41(old41, after41).length, 19);
  const hash = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
  for (const old of before.lessons.filter(l => l.id !== old41.id)) assert.equal(hash(lessonRegistry.get(old.id)), hash(old), old.id);
  for (const old of before.publications) assert.deepEqual(publicationManifest.find(p => p.lessonId === old.lessonId), old.lessonId === old41.id ? { ...old, technicalEvidence: "docs/AI000_LESSON_4_2_AND_EDITORIAL_REFINEMENT.md" } : old, old.lessonId);
  for (const file of before.protectedFiles) assert.equal(createHash("sha256").update(readFileSync(file.path)).digest("hex"), file.hash, file.path);
});

test("独立r1可读和4.1→4.2导航，4.2→4.3导航且4.4及后续章节仍未注册", () => {
  assert.equal(lessonRegistry.get(lesson.id), lesson); assert.equal(lesson.contentVersion, 1);
  const entry = resolveLesson("AI000", lesson.id)!.publication;
  assert.equal(entry.status, "pending-review"); assert.equal(entry.access, "preview"); assert.equal(entry.reviewEvidence, undefined);
  const course = getLearningCourse("AI000")!;
  assert.equal(getAdjacentLessons(course, "AI000-C04-L01").next?.lessonId, lesson.id);
  assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "AI000-C04-L01"); assert.equal(getAdjacentLessons(course, lesson.id).next?.lessonId, "AI000-C04-L03");
  for (const slot of course.chapters.flatMap(c => c.lessons).filter(l => l.lessonId > "AI000-C04-L03")) { assert.equal(slot.status, "planned"); assert.equal(slot.href, undefined); assert.equal(lessonRegistry.has(slot.lessonId), false); }
  assert.equal(resolveLesson("PY101", lesson.id), undefined);
});

test("真实适配器：4.1原r1完成/锚点继续有效，4.2不继承；新保存不改任何旧键及3.2r1/r2", () => {
  const memory = new Map<string, string>(); const port = { getItem: (k: string) => memory.get(k) ?? null, setItem: (k: string, v: string) => { memory.set(k, v); } };
  const store = createProgressStore(() => port);
  for (const old of before.lessons) store.save(lessonProgressScope(old), 100, old.id === "AI000-C04-L01" ? "check-records" : old.sections[0].id, true);
  const old32 = JSON.parse(readFileSync("docs/ai000-3-3/BEFORE.json", "utf8")).lessons.find((l: Lesson) => l.id === "AI000-C03-L02") as Lesson;
  store.save(lessonProgressScope(old32), 100, "takeaways", true);
  const oldKeys = new Map(memory), scope41 = lessonProgressScope(lessonRegistry.get("AI000-C04-L01")!), scope42 = lessonProgressScope(lesson);
  assert.equal(progressKey(scope41), "aivora:learning:v2:AI000:AI000-C04-L01:r1");
  assert.equal(parseReadingProgress(store.getSnapshot(scope41), scope41)?.completed, true);
  assert.equal(parseReadingProgress(store.getSnapshot(scope41), scope41)?.section, "check-records");
  assert.equal(store.getSnapshot(scope42), null); store.save(scope42, 70, "training");
  const restored = createProgressStore(() => port);
  assert.equal(parseReadingProgress(restored.getSnapshot(scope42), scope42)?.completed, false);
  assert.equal(parseReadingProgress(restored.getSnapshot(scope42), scope42)?.section, "training");
  restored.save(scope42, 100, "takeaways", true);
  assert.equal(parseReadingProgress(restored.getSnapshot(scope42), scope42)?.completed, true);
  for (const [key, value] of oldKeys) assert.equal(memory.get(key), value, key);
});
