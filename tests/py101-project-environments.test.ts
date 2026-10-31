import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { pythonProjectEnvironmentsLesson as p15CurrentLesson } from "../src/content/lessons/py101/project-environments";
import {historicalLesson} from "./helpers/py101-p14-view";
const lesson=historicalLesson(p15CurrentLesson);
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "./helpers/py101-p14-view";
import { publicationManifest } from "./helpers/py101-p14-view";
import { isReadable } from "../src/content/models";
import { beforeApprovedPy101Object, protectedPy101FileMatches, approvedPy101Additions } from "../scripts/py101-p1-compatibility";
import { assertRegisteredInventory, assertCourseAvailability } from "./helpers/registered-content";
import { environmentProbe, venvCommands } from "../src/content/resources/python-venv";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";

test("[P0–P14历史契约] P3只接入指定新课，按本轮实际基线保护所有旧课、发布与文件", () => {
  const base = JSON.parse(readFileSync("docs/py101-p3/BASELINE.json", "utf8"));
  const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
  const later = approvedPy101Additions.filter(id => id !== lesson.id && !(id in base.lessons));
  assert.deepEqual([...lessonRegistry.keys()].sort(), [...Object.keys(base.lessons), lesson.id, ...later].sort());
  assert.deepEqual(publicationManifest.map(p => p.lessonId).sort(), [...Object.keys(base.publications), lesson.id, ...later].sort());
  for (const [id, hash] of Object.entries(base.lessons)) assert.equal(sha(beforeApprovedPy101Object("lessons", id, lessonRegistry.get(id), base.head)), hash, id);
  for (const [id, hash] of Object.entries(base.publications)) assert.equal(sha(beforeApprovedPy101Object("publications", id, publicationManifest.find(p => p.lessonId === id), base.head)), hash, id);
  for (const [path, file] of Object.entries(base.files as Record<string, { sha256: string }>)) assert.ok(protectedPy101FileMatches(path, readFileSync(path), file.sha256, base.head), path);
  assertRegisteredInventory(); assertCourseAvailability("PY101");
});

test("[P0–P14历史契约] 1.3仅状态过渡勘误，核心/锚点/r1范围不动，额外历史变化仍拒绝", () => {
  const base = JSON.parse(readFileSync("docs/py101-p3/BASELINE.json", "utf8"));
  const current = lessonRegistry.get("PY101-C01-L03")!;
  const expected = structuredClone(base.amendmentBefore), last = expected.sections.at(-1);
  last.blocks[last.blocks.length - 1] = current.sections.at(-1)!.blocks.at(-1);
  assert.deepEqual(current, expected); assert.equal(current.contentVersion, 1);
  assert.deepEqual(lessonProgressScope(current), lessonProgressScope(base.amendmentBefore));
  const changed = { ...current, objectives: ["未授权目标", ...current.objectives.slice(1)] };
  assert.deepEqual(beforeApprovedPy101Object("lessons", current.id, changed, base.head), changed);
  for (const path of [".gitignore", "src/lib/course-engine.ts", "src/content/lessons/py101/editor-rerun.ts"]) assert.equal(protectedPy101FileMatches(path, Buffer.concat([readFileSync(path), Buffer.from("\n# unauthorized")]), base.files[path].sha256, base.head), false, path);
});

test("[P0–P14历史契约] 1.4发布身份一致，私有草稿不能读，试读接1.3，未制作课继续不可读", () => {
  const base = JSON.parse(readFileSync("docs/py101-p3/BASELINE.json", "utf8"));
  const entry = beforeApprovedPy101Object("publications", lesson.id, publicationManifest.find(p => p.lessonId === lesson.id)!, base.head) as (typeof publicationManifest)[number];
  assert.equal(entry.title, lesson.title); assert.equal(entry.contentVersion, 1); assert.equal(entry.order, 4); assert.equal(entry.optionalLesson, false);
  assert.equal(isReadable({ ...entry, status: "draft", access: "private", technicalEvidence: undefined }), false);
  assert.equal(resolveLesson("ML201", lesson.id), undefined);
  const course = getLearningCourse("PY101")!; assert.equal(course.status, "planned");
  if (entry.status === "draft") { assert.equal(entry.access, "private"); assert.equal(resolveLesson("PY101", lesson.id), undefined); }
  else { assert.equal(entry.status, "pending-review"); assert.equal(entry.access, "preview"); assert.ok(entry.technicalEvidence?.startsWith("docs/py101-p3/")); assert.equal(entry.reviewEvidence, undefined); assert.equal(getAdjacentLessons(course, "PY101-C01-L03").next?.lessonId, lesson.id); assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "PY101-C01-L03"); }
  for (const slot of course.chapters[0].lessons.filter(slot => slot.status === "planned")) { assert.equal(slot.href, undefined); assert.equal(lessonRegistry.has(slot.lessonId), false); assert.equal(resolveLesson("PY101", slot.lessonId), undefined); }
});

test("[P0–P14历史契约] 三目标由两个真实任务映射；诊断现成提供，提示二保留学生定位与执行", () => {
  const blocks = lesson.sections.flatMap(s => s.blocks), tasks = blocks.filter(b => b.type === "exercise");
  assert.deepEqual(tasks.map(t => t.id), ["create-project-envs", "repair-wrong-env"]);
  assert.deepEqual(lesson.assessmentMap, [{ objective: 1, exerciseIds: [tasks[0].id] }, { objective: 2, exerciseIds: [tasks[0].id] }, { objective: 3, exerciseIds: [tasks[1].id] }]);
  for (const task of tasks) { assert.equal(task.hints.length, 2); assert.ok(task.solution.length >= 4); assert.ok(task.rubric.length >= 3); assert.doesNotMatch(task.hints[1], /python(?:3)?\s|\.\.\/[a-z]|Scripts\\python|bin\/python|Report R8/); }
  assert.match(tasks[0].prompt, /不复用正文/); assert.match(tasks[1].prompt, /均已保存/); assert.match(tasks[1].prompt, /脚本路径正确/); assert.match(tasks[1].prompt, /同一基础版本/);
  assert.ok(blocks.some(b => b.type === "code" && b.language === "python" && b.code === environmentProbe));
  assert.match(environmentProbe, /sys\.executable/); assert.match(environmentProbe, /sys\.prefix/); assert.match(environmentProbe, /sys\.base_prefix/);
});

test("[P0–P14历史契约] 分平台命令保持引号/反斜杠；核心不依赖包安装、激活或安全设置修改", () => {
  const codes = lesson.sections.flatMap(s => s.blocks).filter(b => b.type === "code").map(b => b.code);
  for (const pair of Object.values(venvCommands)) { assert.ok(codes.includes(pair.windows)); assert.ok(codes.includes(pair.mac)); }
  assert.equal(venvCommands.run.windows, '& ".\\.venv\\Scripts\\python.exe" .\\main.py');
  assert.equal(venvCommands.run.mac, './.venv/bin/python main.py');
  const text = JSON.stringify(lesson);
  assert.match(text, /若PowerShell提示策略阻止/); assert.match(text, /立即使用上一段直接调用/);
  assert.doesNotMatch(text, /Set-ExecutionPolicy|ExecutionPolicy Bypass|--clear|pip install|requirements\.txt|conda create|uv venv|jupyter notebook/);
  assert.ok(readFileSync(".gitignore", "utf8").split(/\r?\n/).includes(".venv/"));
});

test("[P0–P14历史契约] 新1.4r1进度独立，重载可恢复，不覆盖1.1–1.3、第五章和旧修订", () => {
  const memory = new Map<string, string>();
  const port = { getItem: (key: string) => memory.get(key) ?? null, setItem: (key: string, value: string) => { memory.set(key, value); } };
  const store = createProgressStore(() => port);
  for (const id of ["PY101-C01-L01", "PY101-C01-L02", "PY101-C01-L03", "PY101-C05-L01", "ML201-C04-L01"]) { const scope = lessonProgressScope(lessonRegistry.get(id)!); store.save(scope, 100, scope.sectionIds[0], true); if (scope.contentVersion > 1) store.save({ ...scope, contentVersion: 1 }, 100, scope.sectionIds[0], true); }
  const old = new Map(memory), scope = lessonProgressScope(lesson);
  assert.equal(progressKey(scope), "aivora:learning:v2:PY101:PY101-C01-L04:r1"); assert.equal(store.getSnapshot(scope), null);
  store.save(scope, 63, "observe-env");
  assert.equal(parseReadingProgress(createProgressStore(() => port).getSnapshot(scope), scope)?.section, "observe-env");
  for (const [key, value] of old) assert.equal(memory.get(key), value);
});
