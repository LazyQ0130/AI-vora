import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { getAdjacentLessons, getLearningCourse, lessonRegistry, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { pythonScriptPathsLesson as lesson } from "../src/content/lessons/py101/script-paths";
import { pathFiles, pathCommands } from "../src/content/resources/python-paths";
import { beforePy101P1Source } from "../scripts/py101-p1-compatibility";
import { createProgressStore, progressKey, parseReadingProgress } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";

test("P1只允许新增指定1.2，48旧课/发布全文哈希和全部基线文件继续保持", () => {
  const before = JSON.parse(readFileSync("docs/py101-p1/BASELINE.json", "utf8")) as { lessons: Record<string, string>; publications: Record<string, string>; files: Record<string, string> };
  const sha = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
  assert.deepEqual([...lessonRegistry.keys()].sort(), [...Object.keys(before.lessons), lesson.id].sort());
  assert.deepEqual(publicationManifest.map(p => p.lessonId).sort(), [...Object.keys(before.publications), lesson.id].sort());
  for (const [id, hash] of Object.entries(before.lessons)) assert.equal(sha(JSON.stringify(lessonRegistry.get(id))), hash, id);
  for (const [id, hash] of Object.entries(before.publications)) assert.equal(sha(JSON.stringify(publicationManifest.find(p => p.lessonId === id))), hash, id);
  for (const [path, hash] of Object.entries(before.files)) assert.equal(sha(readFileSync(path)), hash, path);
});

test("1.1与1.2相邻，1.3–1.6仍规划；私有/错误课程不产生可读页面", () => {
  const course = getLearningCourse("PY101")!;
  assert.equal(course.status, "planned"); assert.equal(lesson.contentVersion, 1);
  assert.equal(getAdjacentLessons(course, "PY101-C01-L01").next?.lessonId, lesson.id);
  assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "PY101-C01-L01");
  for (const slot of course.chapters[0].lessons.slice(2)) assert.equal(resolveLesson("PY101", slot.lessonId), undefined);
  assert.equal(resolveLesson("ML201", lesson.id), undefined);
});

test("新课进度不继承1.1或第5章完成，新保存不会重写旧r1/r2", () => {
  const memory = new Map<string, string>();
  const port = { getItem: (key: string) => memory.get(key) ?? null, setItem: (key: string, value: string) => { memory.set(key, value); } };
  const store = createProgressStore(() => port);
  for (const id of ["PY101-C01-L01", "PY101-C05-L01"]) {
    const old = lessonProgressScope(lessonRegistry.get(id)!); store.save(old, 100, old.sectionIds.at(-1)!, true);
    if (id.endsWith("C05-L01")) store.save({ ...old, contentVersion: 1 }, 100, old.sectionIds[0], true);
  }
  const previous = new Map(memory), scope = lessonProgressScope(lesson);
  assert.equal(store.getSnapshot(scope), null); assert.equal(progressKey(scope), "aivora:learning:v2:PY101:PY101-C01-L02:r1");
  store.save(scope, 65, "space-argument");
  assert.equal(parseReadingProgress(createProgressStore(() => port).getSnapshot(scope), scope)?.section, "space-argument");
  for (const [key, value] of previous) assert.equal(memory.get(key), value);
});

test("正文文件同源、命令分平台；核心提示不直接交出目标路径", () => {
  const blocks = lesson.sections.flatMap(s => s.blocks), tasks = blocks.filter(b => b.type === "exercise");
  assert.equal(tasks.length, 2);
  for (const block of blocks) if (block.type === "code" && block.language === "python") assert.equal(block.code, pathFiles[block.filename as keyof typeof pathFiles]);
  for (const id of ["root-alpha", "beta-alpha", "space-unquoted", "space-quoted", "absolute-root"] as const) {
    assert.ok(blocks.some(b => b.type === "code" && b.code === pathCommands[id].windows));
    assert.ok(blocks.some(b => b.type === "code" && b.code === pathCommands[id].mac));
  }
  for (const task of tasks) {
    assert.equal(task.hints.length, 2); assert.ok(task.solution.length >= 3); assert.ok(task.rubric.length >= 3);
    assert.doesNotMatch(task.hints[1], /\.\.[\\/]|\bpython(?:3)?\s|East E4|West W5/);
  }
});

test("P1兼容登记不吞额外源码修改，P0历史登记无需覆盖", () => {
  const sources = JSON.parse(readFileSync("docs/py101-p1/SOURCE_CHANGES.json", "utf8")) as { path: string; before: string }[];
  for (const entry of sources) {
    const current = readFileSync(entry.path, "utf8");
    assert.equal(beforePy101P1Source(entry.path, current), entry.before);
    const extra = current + "\n// undeclared";
    assert.equal(beforePy101P1Source(entry.path, extra), extra);
  }
});
