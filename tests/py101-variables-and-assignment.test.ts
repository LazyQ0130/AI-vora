import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pythonVariablesAndAssignmentLesson as lesson } from "../src/content/lessons/py101/variables-and-assignment";
import { courseOutline } from "../src/content/course-outline";
import { publicationManifest } from "../src/content/publication-manifest";
import { isReadable, publicationSchema } from "../src/content/models";
import { getLearningCourse, getAdjacentLessons, lessonRegistry, resolveLesson } from "../src/lib/course-engine";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { variableCode, variableBlockNames } from "../src/content/resources/python-variables";
import { variableKey, checkVariableResult } from "../scripts/python-variable-checks";
import { beforeApprovedPy101Source, beforeApprovedPy101Object } from "../scripts/py101-p1-compatibility";
import { assertRegisteredInventory, assertCourseAvailability } from "./helpers/registered-content";

test("2.1身份/顺序/初稿门禁；第二章按实际注册顺序接入", () => {
  const entry = publicationManifest.find(p => p.lessonId === lesson.id)!;
  assert.deepEqual([entry.title, entry.contentVersion, entry.order, entry.optionalLesson], [lesson.title, 1, 1, false]);
  assert.deepEqual(courseOutline.filter(s => s.chapterId === "PY101-C02").map(s => [s.lessonId, s.order]), publicationManifest.filter(p => p.chapterId === "PY101-C02").sort((a,b) => a.order - b.order).map(p => [p.lessonId, p.order]));
  const draft = JSON.parse(readFileSync("docs/py101-p8/DRAFT_GATE.json", "utf8"));
  assert.deepEqual([draft.status, draft.access, draft.readable, draft.resolveUndefined, draft.directoryHrefAbsent], ["draft", "private", false, true, true]);
  assert.equal(isReadable({ ...entry, status: "draft", access: "private", technicalEvidence: undefined }), false);
  assert.throws(() => publicationSchema.parse({ ...entry, status: "draft", access: "preview" }));
  assert.throws(() => publicationSchema.parse({ ...entry, status: "pending-review", access: "preview", technicalEvidence: undefined }));
  if (entry.status === "draft") assert.equal(resolveLesson("PY101", lesson.id), undefined);
  else {
    assert.equal(entry.status, "pending-review"); assert.equal(entry.access, "preview");
    const historical = beforeApprovedPy101Object("publications", lesson.id, entry) as typeof entry;
    assert.equal(historical.technicalEvidence, "docs/py101-p8/TECHNICAL_REPORT.md");
    assert.ok(resolveLesson("PY101", lesson.id));
  }
  assert.equal(entry.reviewEvidence, undefined); assert.equal(lesson.optionalLesson, false);
  assertRegisteredInventory(); assertCourseAvailability("PY101");
});

test("三项目标对应两项core开放代码任务，分层提示与反馈完整", () => {
  const tasks = lesson.sections.filter(s => s.tier === "core").flatMap(s => s.blocks).filter(b => b.type === "exercise");
  assert.deepEqual(tasks.map(t => t.id), ["keep-and-update", "repair-first-read"]);
  assert.deepEqual(lesson.assessmentMap, [{ objective: 1, exerciseIds: [tasks[0].id] }, { objective: 2, exerciseIds: [tasks[0].id] }, { objective: 3, exerciseIds: [tasks[1].id] }]);
  for (const task of tasks) {
    assert.equal(task.hints.length, 2); assert.ok(task.solution.length >= 4); assert.ok(task.rubric.length >= 3);
    assert.doesNotMatch(task.hints.join(""), /display_note|Hang posters|Packed T7|dispatch_label =/);
  }
  assert.equal(lesson.learningTime.basis, "editorial-estimate");
  assert.deepEqual(lesson.learningTime, { reading: [10,15], practice: [5,8], coding: [10,15], basis: "editorial-estimate" });
  assert.deepEqual(lesson.resources, []);
});

test("网页Python片段必须全量登记同源，未知和擅自更改不能静默跳过", () => {
  const blocks = lesson.sections.flatMap(s => s.blocks).filter(b => b.type === "code").filter(b => b.language === "python");
  assert.deepEqual(blocks.map(b => variableKey(b.filename, b.code)), ["assign", "read", "update", "main", "literal", "firstRead"]);
  assert.throws(() => variableKey("unknown.py", "print('unknown')"));
  assert.throws(() => variableKey(variableBlockNames.firstRead, variableCode.repaired));
  assert.throws(() => checkVariableResult("firstRead", { exitCode: 0, stdout: "", stderr: "NameError: name 'dispatch_label' is not defined" }));
  assert.throws(() => checkVariableResult("main", { exitCode: 1, stdout: "Pack notebooks\nCheck labels\n", stderr: "unexpected" }));
  checkVariableResult("firstRead", { exitCode: 1, stdout: "", stderr: "NameError: name 'dispatch_label' is not defined" });
});

test("真实保存文件记录覆盖主例、只改后赋值、引号对照、错误恢复与新进程", () => {
  const evidence = JSON.parse(readFileSync("docs/py101-p8/PYTHON_RUNS.json", "utf8"));
  assert.equal(evidence.platform, "win32"); assert.equal(evidence.allAssertionsPassed, true);
  const row = (label: string) => evidence.rows.find((r: {label: string}) => r.label === label);
  assert.equal(row("main").stdout, "Pack notebooks\nCheck labels\n");
  assert.equal(row("changedMain").stdout, "Pack notebooks\nSort envelopes\n");
  assert.equal(row("literal").stdout, "task_name\nReady\n");
  for (const label of ["firstRead", "fresh-process-after-success"]) { assert.equal(row(label).exitCode, 1); assert.equal(row(label).stdout, ""); assert.match(row(label).stderr, /NameError/); }
  assert.equal(row("repair-same-file").stdout, "Packed T7\n");
  assert.equal(row("own-file-before").filename, row("own-file-after").filename);
  assert.equal(row("own-file-before").savedSource.replace('"Seal cartons"', '"Stack cartons"'), row("own-file-after").savedSource);
  assert.equal(new Set(evidence.rows.map((r: {shellPid: number}) => r.shellPid)).size, evidence.rows.length);
  assert.doesNotMatch(JSON.stringify(evidence), /[A-Za-z]:\\\\Users\\\\|token=/);
});

test("第一章顺序、可读相邻导航、第五章先修和未制作/错误归属边界", () => {
  const course = getLearningCourse("PY101")!; assert.equal(course.status, "planned");
  assert.deepEqual(course.chapters[0].lessons.map(s => [s.lessonId, s.order]), Array.from({length:6}, (_, i) => [`PY101-C01-L0${i+1}`, i+1]));
  if (isReadable(publicationManifest.find(p => p.lessonId === lesson.id)!)) {
    assert.equal(getAdjacentLessons(course, "PY101-C01-L06").next?.lessonId, lesson.id);
    assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "PY101-C01-L06");
    const readable = course.chapters.flatMap(c => c.lessons).filter(s => s.href);
    assert.equal(getAdjacentLessons(course, lesson.id).next?.lessonId, readable[readable.findIndex(s => s.lessonId === lesson.id) + 1]?.lessonId);
  }
  for (let i = 2; i <= 6; i++) {
    const id = `PY101-C02-L0${i}`;
    if (lessonRegistry.has(id)) continue; // 后续正式注册不再冒充P8当时的未制作状态。
    assert.equal(lessonRegistry.has(id), false); assert.equal(publicationManifest.some(p => p.lessonId === id), false);
    assert.equal(resolveLesson("PY101", id), undefined);
  }
  assert.equal(resolveLesson("ML201", lesson.id), undefined);
});

test("新2.1/r1读取和重载与全部旧PY进度、第五章旧r1及ML旧记录隔离", () => {
  const memory = new Map<string, string>(), storage = {getItem: (k: string) => memory.get(k) ?? null, setItem: (k: string, v: string) => { memory.set(k,v); }};
  const store = createProgressStore(() => storage);
  for (const old of lessonRegistry.values()) if ((old.courseId === "PY101" && old.id !== lesson.id) || old.id === "ML201-C04-L01") {
    const scope = lessonProgressScope(old); store.save(scope, 100, scope.sectionIds[0], true);
    if (scope.contentVersion > 1) store.save({...scope, contentVersion: 1}, 100, scope.sectionIds[0], true);
  }
  const before = new Map(memory), scope = lessonProgressScope(lesson);
  assert.equal(progressKey(scope), "aivora:learning:v2:PY101:PY101-C02-L01:r1"); assert.equal(store.getSnapshot(scope), null);
  store.save(scope, 52, "literal-or-name");
  assert.equal(parseReadingProgress(createProgressStore(() => storage).getSnapshot(scope), scope)?.section, "literal-or-name");
  assert.equal(parseReadingProgress(store.getSnapshot(scope), scope)?.completed, false);
  for (const [key, value] of before) assert.equal(memory.get(key), value);
});

test("历史恢复仅接受完整已登记文件，附加修改继续暴露", () => {
  const source = readFileSync("src/lib/course-engine.ts", "utf8");
  const base = JSON.parse(readFileSync("docs/py101-p8/APPROVED_CHANGES.json", "utf8"));
  assert.equal(beforeApprovedPy101Source("src/lib/course-engine.ts", source, base.baseline), base.sources.find((s: {path: string}) => s.path === "src/lib/course-engine.ts").before);
  assert.equal(beforeApprovedPy101Source("src/lib/course-engine.ts", source + "\n// unauthorized", base.baseline), source + "\n// unauthorized");
});
