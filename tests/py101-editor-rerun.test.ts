import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { pythonEditorRerunLesson as lesson } from "../src/content/lessons/py101/editor-rerun";
import { lessonRegistry, getLearningCourse, resolveLesson, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { beforeApprovedPy101Object, beforeApprovedPy101Source, protectedPy101FileMatches, approvedPy101Additions } from "../scripts/py101-p1-compatibility";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { editorFiles } from "../src/content/resources/python-editor";
import { assertRegisteredInventory, assertCourseAvailability } from "./helpers/registered-content";

test("P2登记只增加1.3，49旧课与发布、历史文件仍通过完整摘要保护", () => {
  const base = JSON.parse(readFileSync("docs/py101-p2/BASELINE.json", "utf8"));
  const portablePath = "docs/AI000_CROSS_LESSON_QUALITY_REVIEW.md";
  const portableText = readFileSync(portablePath, "utf8").replaceAll("\r\n", "\n");
  assert.equal(protectedPy101FileMatches(portablePath, Buffer.from(portableText), base.files[portablePath]), true);
  assert.equal(protectedPy101FileMatches(portablePath, Buffer.from(portableText + "未授权"), base.files[portablePath]), false);
  const sha = (s: string | Buffer) => createHash("sha256").update(s).digest("hex");
  const laterAdditions = approvedPy101Additions.filter(id => id !== lesson.id && !(id in base.lessons));
  assert.deepEqual([...lessonRegistry.keys()].sort(), [...Object.keys(base.lessons), lesson.id, ...laterAdditions].sort());
  assert.deepEqual(publicationManifest.map(p => p.lessonId).sort(), [...Object.keys(base.publications), lesson.id, ...laterAdditions].sort());
  for (const [id, hash] of Object.entries(base.lessons)) assert.equal(sha(JSON.stringify(beforeApprovedPy101Object("lessons", id, lessonRegistry.get(id)))), hash, id);
  for (const [id, hash] of Object.entries(base.publications)) assert.equal(sha(JSON.stringify(beforeApprovedPy101Object("publications", id, publicationManifest.find(p => p.lessonId === id)))), hash, id);
  for (const [path, hash] of Object.entries(base.files)) assert.ok(protectedPy101FileMatches(path, readFileSync(path), hash as string), path);
  assertRegisteredInventory(); assertCourseAvailability("PY101");
});

test("1.1只改最终状态段，目标、考核与r1进度范围严格相同；额外修改不被撤销", () => {
  const old = JSON.parse(readFileSync("docs/py101-p2/BASELINE_LESSONS.json", "utf8")).lesson;
  const now = lessonRegistry.get(old.id)!;
  const expected = structuredClone(old); const lastSection = expected.sections.at(-1); lastSection.blocks[lastSection.blocks.length - 1] = now.sections.at(-1)!.blocks.at(-1);
  assert.deepEqual(now, expected); assert.equal(now.contentVersion, 1);
  assert.deepEqual(lessonProgressScope(now), lessonProgressScope(old));
  const extra = { ...now, title: now.title + "未授权" };
  assert.deepEqual(beforeApprovedPy101Object("lessons", old.id, extra), extra);
  for (const path of ["src/content/lessons/py101/first-run.ts", "src/lib/course-engine.ts"]) {
    const changed = readFileSync(path, "utf8") + "\n// undeclared";
    assert.equal(beforeApprovedPy101Source(path, changed), changed);
  }
  const base = JSON.parse(readFileSync("docs/py101-p2/BASELINE.json", "utf8"));
  for (const path of ["next-env.d.ts", "scripts/ai000-r3-compatibility.ts", "src/components/lesson/reader.tsx", "tests/reading-experience.test.ts"]) assert.equal(protectedPy101FileMatches(path, Buffer.concat([readFileSync(path), Buffer.from("\n// undeclared")]), base.files[path]), false, path);
});

test("1.2接1.3，未制作课无正文与路由；错误归属不可读", () => {
  const course = getLearningCourse("PY101")!;
  assert.equal(course.status, "planned"); assert.equal(lesson.contentVersion, 1);
  assert.equal(getAdjacentLessons(course, "PY101-C01-L02").next?.lessonId, lesson.id);
  assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "PY101-C01-L02");
  for (const slot of course.chapters[0].lessons.filter(slot => slot.status === "planned")) { assert.equal(slot.href, undefined); assert.equal(lessonRegistry.has(slot.lessonId), false); assert.equal(resolveLesson("PY101", slot.lessonId), undefined); }
  assert.equal(resolveLesson("ML201", lesson.id), undefined);
});

test("1.3恢复自己的r1进度，保存不覆盖旧课、第五章r1/r2", () => {
  const values = new Map<string, string>();
  const port = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
  const store = createProgressStore(() => port);
  for (const id of ["PY101-C01-L01", "PY101-C01-L02", "PY101-C05-L01"]) {
    const scope = lessonProgressScope(lessonRegistry.get(id)!); store.save(scope, 100, scope.sectionIds.at(-1)!, true);
    if (id === "PY101-C05-L01") store.save({ ...scope, contentVersion: 1 }, 100, scope.sectionIds[0], true);
  }
  const previous = new Map(values), scope = lessonProgressScope(lesson);
  assert.equal(store.getSnapshot(scope), null);
  assert.equal(progressKey(scope), "aivora:learning:v2:PY101:PY101-C01-L03:r1");
  store.save(scope, 57, "select-interpreter");
  assert.equal(parseReadingProgress(createProgressStore(() => port).getSnapshot(scope), scope)?.section, "select-interpreter");
  for (const [key, value] of previous) assert.equal(values.get(key), value);
});

test("目标映射实际开放练习，提示保留最终判断；所有Python块只含print与字符串", () => {
  const blocks = lesson.sections.flatMap(s => s.blocks), tasks = blocks.filter(b => b.type === "exercise");
  assert.equal(tasks.length, 2);
  assert.deepEqual(lesson.assessmentMap.map(m => m.objective), [1, 2, 3]);
  for (const task of tasks) { assert.equal(task.hints.length, 2); assert.ok(task.solution.length >= 4); assert.ok(task.rubric.length >= 3); assert.doesNotMatch(task.hints[1], /python(?:3)?\s|\.\.[\\/]|Ready B2|Saved copy/); }
  for (const block of blocks) if (block.type === "code" && block.language === "python") { assert.ok(Object.values(editorFiles).some(source => source === block.code)); assert.match(block.code, /^(print\("[^\n]*"\)\n)+$/); }
  assert.match(tasks[1].prompt, /均已保存/); assert.match(tasks[1].prompt, /同一已验证解释器/);
  const text = JSON.stringify(lesson);
  assert.match(text, /独立外部终端/); assert.match(text, /某些运行命令会先自动保存/);
  assert.doesNotMatch(text, /python -m venv|pip install|debugpy|git init/);
});
