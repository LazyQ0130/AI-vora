import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { isReadable, type ContentBlock, type Lesson } from "../src/content/models";
import { lessonRegistry, lessonSummaries, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest, lessonHref } from "../src/content/publication-manifest";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { lessonProgressScope, summaryProgressScope } from "../src/lib/use-learning-progress";
import { summarizeCourseReading } from "../src/lib/course-reading-summary";
import { manualUpdateCoreCode, manualUpdateChecks } from "../src/content/resources/core-programs";

const before = JSON.parse(readFileSync(new URL("../docs/cross-discipline-v1/BEFORE.json", import.meta.url), "utf8")) as {
  revision: string;
  lessons: Lesson[];
};
const revisedIds = ["MA101-C02-L03", "PY101-C05-L01"] as const;
const get = (id: string) => lessonRegistry.get(id)!;
const exerciseBlocks = (lesson: Lesson) => lesson.sections.flatMap((section) => section.blocks)
  .filter((block): block is Extract<ContentBlock, { type: "exercise" }> => block.type === "exercise");
const exercise = (lesson: Lesson, id: string) => {
  const block = exerciseBlocks(lesson).find((entry) => entry.id === id);
  assert.ok(block, `${lesson.id}: ${id}`);
  return block;
};

function progressFixture() {
  const storage = new Map<string, string>();
  const store = createProgressStore(() => ({
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => { storage.set(key, value); },
  }));
  return { storage, store };
}

test("跨学科与AI000现行修订和发布清单一致，仍待人工审核", () => {
  assert.equal(before.revision, "acefc4bde50f765b500bae7b94b0f129b88cb537");
  for (const lesson of lessonRegistry.values()) {
    const expectedVersion = revisedIds.some((id) => id === lesson.id) || ["AI000-C01-L01","AI000-C01-L02","AI000-C02-L01","AI000-C03-L02","AI000-C05-L03","AI000-C06-L03"].includes(lesson.id) ? 2 : 1;
    const publication = publicationManifest.find((entry) => entry.lessonId === lesson.id)!;
    assert.equal(lesson.contentVersion, expectedVersion, lesson.id);
    assert.equal(publication.contentVersion, expectedVersion, lesson.id);
    if (!isReadable(publication)) {
      assert.equal(publication.access, "private");
      assert.equal(resolveLesson(lesson.courseId, lesson.id), undefined);
      continue;
    }
    assert.equal(publication.status, "pending-review");
    assert.equal(publication.access, "preview");
    assert.equal(publication.reviewEvidence, undefined);
    assert.ok(publication.technicalEvidence);
    assert.equal(resolveLesson(lesson.courseId, lesson.id)?.lesson, lesson);
    assert.equal(lessonHref(publication), `/learn/${lesson.courseId}/${lesson.id}`);
  }
});

test("三篇标杆保留原课时身份、所有段落和练习锚点；熟例自查题内容不变", () => {
  for (const original of before.lessons) {
    const current = get(original.id);
    for (const key of ["id", "courseId", "chapterId", "title"] as const)
      assert.equal(current[key], original[key]);
    const originalSectionIds = original.sections.map((section) => section.id);
    assert.deepEqual(current.sections.map((section) => section.id).filter((id) => originalSectionIds.includes(id)), originalSectionIds);
    const currentExerciseIds = new Set(exerciseBlocks(current).map((block) => block.id));
    for (const block of exerciseBlocks(original)) assert.ok(currentExerciseIds.has(block.id));
  }
  for (const [id, retainedExercise] of [
    ["MA101-C02-L03", "same-displacement"],
    ["PY101-C05-L01", "define-double"],
  ]) {
    const original = before.lessons.find((lesson) => lesson.id === id)!;
    assert.deepEqual(exercise(get(id), retainedExercise), exercise(original, retainedExercise));
  }
});

test("真实 MA/PY 修订作用域不继承 r1，保存 r2 不改写旧完成与阅读位置", () => {
  const { storage, store } = progressFixture();
  for (const id of revisedIds) {
    const original = before.lessons.find((lesson) => lesson.id === id)!;
    const oldScope = lessonProgressScope(original);
    const currentScope = lessonProgressScope(get(id));
    assert.equal(oldScope.contentVersion, 1);
    assert.equal(currentScope.contentVersion, 2);
    assert.notEqual(progressKey(oldScope), progressKey(currentScope));
    store.save(oldScope, 100, "summary", true);
    const oldBytes = storage.get(progressKey(oldScope))!;
    assert.equal(parseReadingProgress(oldBytes, oldScope)?.completed, true);
    assert.equal(parseReadingProgress(oldBytes, currentScope), null);
    assert.equal(store.getSnapshot(currentScope), null);
    store.migrate(currentScope);
    assert.equal(store.getSnapshot(currentScope), null);
    assert.equal(storage.get(progressKey(oldScope)), oldBytes);
    const firstSection = currentScope.sectionIds[0];
    assert.equal(store.save(currentScope, 23, firstSection), true);
    const current = parseReadingProgress(store.getSnapshot(currentScope), currentScope)!;
    assert.equal(current.completed, false);
    assert.equal(current.percent, 23);
    assert.equal(current.section, firstSection);
    assert.equal(storage.get(progressKey(oldScope)), oldBytes);
    assert.equal(parseReadingProgress(store.getSnapshot(oldScope), oldScope)?.section, "summary");
  }
});

test("课程目录按现行 summary 作用域取记录，旧 r1 已读不会增加新版完成数", () => {
  const { storage, store } = progressFixture();
  const oldBytes = new Map<string, string>();
  for (const id of revisedIds) {
    const original = before.lessons.find((lesson) => lesson.id === id)!;
    const scope = lessonProgressScope(original);
    store.save(scope, 100, "summary", true);
    oldBytes.set(progressKey(scope), storage.get(progressKey(scope))!);
  }
  // 使用生产 hook 所用的纯作用域适配器，先读取当前修订，再交给目录汇总。
  const currentRecords = () => lessonSummaries.flatMap((lesson) => {
    const scope = summaryProgressScope(lesson);
    const progress = parseReadingProgress(store.getSnapshot(scope), scope);
    return progress ? [{ lesson, progress }] : [];
  });
  assert.equal(currentRecords().some((record) => revisedIds.some((id) => id === record.lesson.lessonId)), false);
  for (const courseId of ["MA101", "PY101"]) {
    const summary = summarizeCourseReading(lessonSummaries, currentRecords()).find((row) => row.courseId === courseId)!;
    assert.equal(summary.completed, 0);
    assert.equal(summary.percent, 0);
  }
  const revisedMath = lessonProgressScope(get("MA101-C02-L03"));
  store.save(revisedMath, 100, "practice", true);
  const summaries = summarizeCourseReading(lessonSummaries, currentRecords());
  assert.equal(summaries.find((row) => row.courseId === "MA101")?.completed, 1);
  assert.equal(summaries.find((row) => row.courseId === "PY101")?.completed, 0);
  for (const [key, value] of oldBytes) assert.equal(storage.get(key), value);
});

test("新数字位移与新用途函数均为核心开放任务，目标引用新题且保留熟例", () => {
  for (const [lessonId, exerciseId, objective] of [
    ["MA101-C02-L03", "displacement-transfer", 3],
    ["PY101-C05-L01", "minutes-to-seconds", 2],
  ] as const) {
    const lesson = get(lessonId);
    const section = lesson.sections.find((part) => part.blocks.some((block) => block.type === "exercise" && block.id === exerciseId));
    assert.equal(section?.tier, "core");
    const task = exercise(lesson, exerciseId);
    assert.equal(task.hints.length, 2);
    assert.ok(task.solution.length > 0);
    assert.ok(task.rubric.length > 0);
    assert.ok(lesson.assessmentMap.find((mapping) => mapping.objective === objective)?.exerciseIds.includes(exerciseId));
  }
  assert.ok(get("MA101-C02-L03").assessmentMap.find((mapping) => mapping.objective === 3)?.exerciseIds.includes("same-displacement"));
  assert.ok(get("PY101-C05-L01").assessmentMap.find((mapping) => mapping.objective === 1)?.exerciseIds.includes("define-double"));
});

test("ML 可选验证置于末尾时手算考核仍属核心，完整验证复用主算法且不侵入主教程", () => {
  const lesson = get("ML201-C04-L04");
  assert.equal(lesson.sections.at(-1)?.tier, "verification");
  const assessmentSection = lesson.sections.find((section) => section.blocks.some((block) => block.type === "exercise" && block.id === "hand-update"));
  assert.equal(assessmentSection?.tier, "core");
  for (const objective of [1, 2])
    assert.ok(lesson.assessmentMap.find((mapping) => mapping.objective === objective)?.exerciseIds.includes("hand-update"));

  const coreCode = lesson.sections.filter((section) => section.tier === "core")
    .flatMap((section) => section.blocks)
    .find((block) => block.type === "code" && block.filename === "one_update.py");
  assert.ok(coreCode?.type === "code");
  assert.equal(coreCode.code, manualUpdateCoreCode);
  assert.doesNotMatch(coreCode.code, /^\s*assert\b|\babs\s*\(|\b1e-12\b/m);

  const verificationCode = lesson.sections.filter((section) => section.tier === "verification")
    .flatMap((section) => section.blocks)
    .find((block) => block.type === "code" && block.filename === "one_update_checks.py");
  assert.ok(verificationCode?.type === "code");
  assert.equal(verificationCode.code, manualUpdateCoreCode + manualUpdateChecks);
  assert.ok(verificationCode.code.startsWith(coreCode.code));
  assert.match(manualUpdateChecks, /^assert\b/m);
  assert.match(manualUpdateChecks, /1e-12/);

  for (const mlLesson of lessonRegistry.values()) {
    if (mlLesson.courseId !== "ML201") continue;
    for (const mapping of mlLesson.assessmentMap) for (const id of mapping.exerciseIds) {
      const section = mlLesson.sections.find((part) => part.blocks.some((block) => block.type === "exercise" && block.id === id));
      assert.equal(section?.tier, "core", `${mlLesson.id}: objective ${mapping.objective} -> ${id}`);
    }
  }
});
