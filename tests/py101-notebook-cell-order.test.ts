import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { pythonNotebookCellOrderLesson as lesson } from "../src/content/lessons/py101/notebook-cell-order";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { isReadable } from "../src/content/models";
import { notebookCode, notebookBlockNames, notebookCommands, notebookDocuments, notebookDownload } from "../src/content/resources/python-notebook";
import { beforeApprovedPy101Object, protectedPy101FileMatches, approvedPy101Additions } from "../scripts/py101-p1-compatibility";
import { createProgressStore, progressKey, parseReadingProgress } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { assertRegisteredInventory, assertCourseAvailability } from "./helpers/registered-content";

test("P4按真实基线保护旧教材/文件，1.4只勘误最后状态段，拒绝附加改动", () => {
  const base = JSON.parse(readFileSync("docs/py101-p4/BASELINE.json", "utf8"));
  const sha = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
  const later = approvedPy101Additions.filter(id => id !== lesson.id && !(id in base.lessons));
  assert.deepEqual([...lessonRegistry.keys()].sort(), [...Object.keys(base.lessons), lesson.id, ...later].sort());
  for (const kind of ["lessons", "publications"] as const) for (const [id, hash] of Object.entries(base[kind])) {
    const current = kind === "lessons" ? lessonRegistry.get(id) : publicationManifest.find(p => p.lessonId === id);
    assert.equal(sha(beforeApprovedPy101Object(kind, id, current, base.head)), hash, id);
  }
  for (const [path, file] of Object.entries(base.files as Record<string, { sha256: string }>)) assert.ok(protectedPy101FileMatches(path, readFileSync(path), file.sha256, base.head), path);
  const current = lessonRegistry.get("PY101-C01-L04")!, expected = structuredClone(base.amendmentBefore);
  expected.sections.at(-1).blocks[expected.sections.at(-1).blocks.length - 1] = current.sections.at(-1)!.blocks.at(-1);
  assert.deepEqual(current, expected); assert.equal(current.contentVersion, 1);
  assert.deepEqual(lessonProgressScope(current), lessonProgressScope(base.amendmentBefore));
  assert.equal(protectedPy101FileMatches("src/lib/course-engine.ts", Buffer.concat([readFileSync("src/lib/course-engine.ts"), Buffer.from("\n// unauthorized")]), base.files["src/lib/course-engine.ts"].sha256, base.head), false);
  assertRegisteredInventory(); assertCourseAvailability("PY101");
});

test("新课r1身份与草稿门禁一致，接1.4，1.6和错误归属不可读", () => {
  const entry = publicationManifest.find(p => p.lessonId === lesson.id)!;
  assert.equal(entry.title, lesson.title); assert.equal(entry.order, 5); assert.equal(entry.contentVersion, 1);
  assert.equal(entry.optionalLesson, false); assert.equal(lesson.optionalLesson, false);
  assert.equal(isReadable({ ...entry, status: "draft", access: "private", technicalEvidence: undefined }), false);
  const course = getLearningCourse("PY101")!; assert.equal(course.status, "planned");
  if (entry.status === "draft") { assert.equal(entry.access, "private"); assert.equal(resolveLesson("PY101", lesson.id), undefined); }
  else { assert.equal(entry.status, "pending-review"); assert.equal(entry.access, "preview"); assert.ok(entry.technicalEvidence?.startsWith("docs/py101-p4/")); assert.equal(entry.reviewEvidence, undefined); assert.ok(resolveLesson("PY101", lesson.id)); assert.equal(getAdjacentLessons(course, "PY101-C01-L04").next?.lessonId, lesson.id); assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "PY101-C01-L04"); }
  assert.equal(resolveLesson("ML201", lesson.id), undefined);
  const planned = course.chapters[0].lessons.find(s => s.lessonId === "PY101-C01-L06")!;
  assert.equal(planned.status, "planned"); assert.equal(planned.href, undefined); assert.equal(lessonRegistry.has(planned.lessonId), false);
});

test("三目标由真实Notebook两题覆盖，提示不泄露完整顺序，答案要求干净复跑", () => {
  const tasks = lesson.sections.flatMap(s => s.blocks).filter(b => b.type === "exercise");
  assert.deepEqual(tasks.map(t => t.id), ["create-own-notebook", "recover-cell-order"]);
  assert.deepEqual(lesson.assessmentMap, [{ objective: 1, exerciseIds: [tasks[0].id] }, { objective: 2, exerciseIds: [tasks[1].id] }, { objective: 3, exerciseIds: tasks.map(t => t.id) }]);
  for (const task of tasks) { assert.equal(task.hints.length, 2); assert.ok(task.solution.length >= 4); assert.ok(task.rubric.length >= 3); assert.doesNotMatch(task.hints.join(""), /Packed C7|Ready B|先运行.*赋值.*再运行.*print/); }
  assert.match(tasks[0].prompt, /自己新建/); assert.match(tasks[0].prompt, /不同/); assert.match(tasks[1].prompt, /真实错误/); assert.match(tasks[1].prompt, /暂不执行/); assert.match(tasks[1].prompt, /明确重启/);
});

test("网页每个Python格均有明确同源身份；分平台安装命令不改全局安全配置", () => {
  const blocks = lesson.sections.flatMap(s => s.blocks).filter(b => b.type === "code");
  assert.deepEqual(blocks.filter(b => b.language === "python").map(b => [b.filename, b.code]).sort(), (Object.keys(notebookCode) as (keyof typeof notebookCode)[]).map(k => [notebookBlockNames[k], notebookCode[k]]).sort());
  for (const pair of Object.values(notebookCommands)) for (const command of Object.values(pair)) assert.ok(blocks.some(b => b.code === command));
  const text = JSON.stringify(lesson);
  assert.doesNotMatch(text, /--ip[= ]0\.0\.0\.0|token=''|Set-ExecutionPolicy|--trusted-host|ipykernel install --user|pip install (numpy|pandas|conda|uv)/);
  assert.match(text, /只关闭网页不代表/); assert.match(text, /保存也只是写文件/); assert.match(text, /NameError/);
});

test("Notebook下载是有效4.5结构、源码同源、空输出无机器信息；旧资源另受摘要保护", () => {
  for (const document of notebookDocuments) {
    const actual = JSON.parse(readFileSync(`public/downloads/${document.filename}.ipynb`, "utf8"));
    assert.deepEqual(actual, notebookDownload(document));
    assert.equal(actual.nbformat, 4); assert.equal(actual.nbformat_minor, 5);
    assert.equal(new Set(actual.cells.map((c: { id: string }) => c.id)).size, actual.cells.length);
    for (const c of actual.cells) if (c.cell_type === "code") { assert.equal(c.execution_count, null); assert.deepEqual(c.outputs, []); }
    assert.doesNotMatch(JSON.stringify(actual), /C:\\\\Users|aivora-p4-notebook-|token=|kernel-[a-f0-9]+\.json/);
    assert.equal("version" in actual.metadata.language_info, false);
    assert.ok(lesson.resources.some(r => r.href === `/downloads/${document.filename}.ipynb` && r.format === "Notebook"));
  }
});

test("新1.5r1进度重载恢复，旧四课/第五章/其他课程和r1/r2保留", () => {
  const memory = new Map<string, string>(), storage = { getItem: (k: string) => memory.get(k) ?? null, setItem: (k: string, v: string) => { memory.set(k,v); } };
  const store = createProgressStore(() => storage);
  for (const id of ["PY101-C01-L01", "PY101-C01-L02", "PY101-C01-L03", "PY101-C01-L04", "PY101-C05-L01", "ML201-C04-L01"]) { const scope = lessonProgressScope(lessonRegistry.get(id)!); store.save(scope,100,scope.sectionIds[0],true); if (scope.contentVersion > 1) store.save({...scope,contentVersion:1},100,scope.sectionIds[0],true); }
  const old = new Map(memory), scope = lessonProgressScope(lesson);
  assert.equal(progressKey(scope), "aivora:learning:v2:PY101:PY101-C01-L05:r1"); assert.equal(store.getSnapshot(scope), null);
  store.save(scope,48,"stale-state"); assert.equal(parseReadingProgress(createProgressStore(() => storage).getSnapshot(scope),scope)?.section,"stale-state");
  for (const [k,v] of old) assert.equal(memory.get(k),v);
});
