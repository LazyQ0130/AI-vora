import { visualComparableJson, assertIllustrationPublication, assertIllustrationCompatibleFile } from "../scripts/ai000-illustration-compatibility";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Lesson, Publication } from "../src/content/models";
import { dataFeaturesLabelsLesson as lesson } from "../src/content/lessons/ai000/data-features-labels";
import { parcelTimeRecords, newParcelTimeRecord, incompleteParcelTimeRecord, parcelTimeDefinition, printReferenceRecords, libraryAuditRows, librarySourceLogs } from "../src/content/lessons/ai000/parcel-time-example";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";

const before = JSON.parse(readFileSync("docs/ai000-4-1/BEFORE.json", "utf8")) as { lessons: Lesson[]; publications: Publication[]; protectedFiles: { path: string; hash: string }[] };
const blocks = lesson.sections.flatMap(s => s.blocks);
const minutes = (time: string) => { const [h, m] = time.split(":").map(Number); return h * 60 + m; };

test("数据组织：从原时间戳独立核算六条实绩，字段数量/单位/图文一致", () => {
  const expected = [["A", "小", 0, "否", 4], ["B", "小", 2, "否", 7], ["C", "中", 1, "是", 10], ["D", "大", 3, "是", 18], ["E", "中", 0, "否", 8], ["F", "大", 1, "否", 13]];
  assert.deepEqual(parcelTimeRecords.map(r => [r.id, r.size, r.waiting, r.careful, minutes(r.finished) - minutes(r.arrived)]), expected);
  for (const r of parcelTimeRecords) assert.equal(r.actualMinutes, minutes(r.finished) - minutes(r.arrived));
  const history = blocks.filter(b => b.type === "table").find(b => b.caption === "六条包裹处理记录")!;
  assert.equal(history.columns.length, 5);
  assert.deepEqual(history.rows, expected.map(row => row.map(String)));
  assert.match(history.columns[2], /件/); assert.match(history.columns[4], /分钟/);
  assert.match(parcelTimeDefinition.duration, /到件.*完成登记并归架.*包含等待/);
  assert.match(parcelTimeDefinition.waiting, /到件时.*尚未开始.*不含本件和正在处理/);
  assert.match(parcelTimeDefinition.careful, /到件时.*可见包装标识/);
  for (const b of blocks.filter(b => b.type === "table")) for (const row of b.rows) assert.equal(row.length, b.columns.length);
});

test("新G无实际目标，假设预测另存；图中三段可访问，当前输入不含实绩/预测", () => {
  assert.equal(newParcelTimeRecord.actualMinutes, null);
  assert.equal(newParcelTimeRecord.hypotheticalPredictionMinutes, 12);
  const table = blocks.filter(b => b.type === "table").find(b => b.caption.startsWith("新记录G"))!;
  assert.deepEqual(table.rows, [["G", "中", "2", "否", "待处理完成后确认"]]);
  const figure = blocks.find(b => b.type === "ai-task-figure")!;
  const html = renderToStaticMarkup(createElement(ContentRenderer, { block: figure, resources: [] }));
  assert.match(html, /<figure[^>]*aria-labelledby="[^"]+"[^>]*aria-describedby="[^"]+"/);
  assert.equal(figure.type, "ai-task-figure");
  if (figure.type === "ai-task-figure") assert.ok(html.includes(figure.alt) && html.includes(figure.caption));
  assert.equal((html.match(/class="ai-data-stage"/g) ?? []).length, 3);
  assert.match(html, /实际处理时长 10分钟/); assert.match(html, /09:20.*09:30/);
  assert.match(html, /假设的模型输出 12分钟/); assert.match(html, /先把这个数记在预测列/);
  const currentStage = html.split('aria-label="新样本可提供的当前输入"')[1].split('aria-label="假设预测与以后核实的实际结果"')[0];
  const currentInput = currentStage.split('class="ai-data-input"')[1].split('class="ai-data-unknown"')[0];
  assert.match(currentInput, /包裹尺寸.*中/); assert.match(currentInput, /待处理数量.*2件/); assert.match(currentInput, /小心处理.*否/);
  assert.doesNotMatch(currentInput, /12分钟|10分钟|实际处理时长/);
  assert.match(currentStage, /仍未知/);
});

test("查错题：未知/真实0、事后字段、混合单位及错配均可从题设独立定位", () => {
  assert.equal(incompleteParcelTimeRecord.waiting, null); assert.notEqual(incompleteParcelTimeRecord.waiting, 0);
  assert.equal(parcelTimeRecords[0].waiting, 0);
  assert.deepEqual(libraryAuditRows.map(r => [r[0], r[2]]), [["J", "1"], ["K", "未知（漏记）"], ["L", "0（当时已确认）"]]);
  assert.equal(Number(libraryAuditRows[0][4].replace("秒", "")) / 60, 5);
  const durations = librarySourceLogs.map(r => minutes(r.finished) - minutes(r.registered));
  assert.deepEqual(durations, [9, 11]);
  assert.equal(Number(libraryAuditRows[2][4].replace("分钟", "")), durations[1]);
  assert.notEqual(durations[0], durations[1]);
  const ex = blocks.filter(b => b.type === "exercise").find(b => b.id === "audit-library-records")!;
  assert.ok(ex.solution.some(s => s.includes("J 5分钟、K 8分钟、L 9分钟") && s.includes("K的排队数仍待核")));
  assert.ok(ex.solution.some(s => s.includes("归架后检查结论") && s.includes("不能用作开始登记时的输入")));
  assert.ok(ex.solution.some(s => s.includes("不能用预测替代")));
  const fieldTable = blocks.filter(b => b.type === "table").find(b => b.caption.includes("通用禁用清单"))!;
  assert.ok(fieldTable.rows.find(r => r[0] === "实际处理完成时间")![2].includes("不能作到件时的输入"));
});

test("两个独立开放任务覆盖三目标、两级提示、完整反馈，打印目标按同任务台账核算", () => {
  assert.deepEqual(printReferenceRecords.map(r => minutes(r.finished) - minutes(r.submitted)), [4, 7, 12]);
  for (const r of printReferenceRecords) assert.equal(minutes(r.finished) - minutes(r.submitted), r.actualMinutes);
  assert.deepEqual(lessonExerciseLinks(lesson).map(e => [e.id, e.tier, e.objectives]), [["build-print-records", "core", [1, 2]], ["audit-library-records", "core", [2, 3]]]);
  for (const ex of blocks.filter(b => b.type === "exercise")) {
    assert.equal(ex.hints.length, 2); assert.ok(ex.solution.some(s => s.includes("常见错误")));
    assert.ok(ex.solution.some(s => s.includes("接受"))); assert.ok(ex.rubric.length >= 4);
    const html = renderToStaticMarkup(createElement(ContentRenderer, { block: ex, resources: [] }));
    assert.match(html, new RegExp(`id="exercise-${ex.id}"`));
    assert.equal((html.match(/<details/g) ?? []).length, 3); assert.doesNotMatch(html, /<details[^>]*\sopen/);
  }
  assert.ok(blocks.every(b => !["code", "math", "experiment", "downloads"].includes(b.type)));
  assert.ok(lesson.sections.every(s => s.tier === "core" && !/^\d/.test(s.title)));
});

test("4.1独立r1、3.4/4.2相邻导航；第六章仍仅规划", () => {
  assert.equal(lessonRegistry.get(lesson.id), lesson); assert.equal(lesson.contentVersion, 1);
  const entry = resolveLesson("AI000", lesson.id)!.publication;
  assert.equal(entry.status, "pending-review"); assert.equal(entry.access, "preview"); assert.equal(entry.reviewEvidence, undefined);
  const course = getLearningCourse("AI000")!;
  assert.equal(getAdjacentLessons(course, "AI000-C03-L04").next?.lessonId, lesson.id);
  assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "AI000-C03-L04");
  assert.equal(getAdjacentLessons(course, lesson.id).next?.lessonId, "AI000-C04-L02");
  assert.equal(resolveLesson("PY101", lesson.id), undefined);
  for (const slot of course.chapters.flatMap(c => c.lessons).filter(l => l.lessonId > "AI000-C05-L05")) {
    assert.equal(slot.status, "planned"); assert.equal(slot.href, undefined); assert.equal(lessonRegistry.has(slot.lessonId), false);
    assert.equal(resolveLesson("AI000", slot.lessonId), undefined);
  }
});

test("32节旧注册全文（反向移除登记插画后）、清单、锚点和版本不变，第三章原图及通用阅读器不变", () => {
  const hash = (v: unknown) => createHash("sha256").update(visualComparableJson(v)).digest("hex");
  for (const old of before.lessons) assert.equal(hash(lessonRegistry.get(old.id)), hash(old), old.id);
  for (const old of before.publications) assertIllustrationPublication(old, publicationManifest.find(p => p.lessonId === old.lessonId)!);
  for (const f of before.protectedFiles) assertIllustrationCompatibleFile(f.path, f.hash);
});

test("真实进度适配器：4.1不继承旧课完成，保存/恢复不改第三章及3.2r1/r2历史", () => {
  const memory = new Map<string, string>();
  const port = { getItem: (k: string) => memory.get(k) ?? null, setItem: (k: string, v: string) => { memory.set(k, v); } };
  const store = createProgressStore(() => port);
  for (const old of before.lessons) store.save(lessonProgressScope(old), 100, old.sections[0].id, true);
  const old32 = JSON.parse(readFileSync("docs/ai000-3-3/BEFORE.json", "utf8")).lessons.find((l: Lesson) => l.id === "AI000-C03-L02") as Lesson;
  assert.equal(old32.contentVersion, 1); store.save(lessonProgressScope(old32), 100, "takeaways", true);
  const oldKeys = new Map(memory), scope = lessonProgressScope(lesson);
  assert.equal(store.getSnapshot(scope), null);
  assert.equal(progressKey(scope), "aivora:learning:v2:AI000:AI000-C04-L01:r1");
  store.save(scope, 65, "check-records");
  const restored = createProgressStore(() => port);
  assert.equal(parseReadingProgress(restored.getSnapshot(scope), scope)?.section, "check-records");
  assert.equal(parseReadingProgress(restored.getSnapshot(scope), scope)?.completed, false);
  restored.save(scope, 100, "takeaways", true);
  assert.equal(parseReadingProgress(restored.getSnapshot(scope), scope)?.completed, true);
  for (const [k, v] of oldKeys) assert.equal(memory.get(k), v, k);
});
