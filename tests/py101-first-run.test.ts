import test from "node:test";
import assert from "node:assert/strict";
import { getAdjacentLessons, getLearningCourse, resolveLesson } from "../src/lib/course-engine";
import { createProgressStore, progressKey, parseReadingProgress } from "../src/lib/learning-progress";
import { pythonFirstRunLesson } from "../src/content/lessons/py101/first-run";
import { programs } from "../src/content/resources/programs";
import { readFileSync } from "node:fs";
import { beforePy101Source } from "../scripts/py101-p0-compatibility";
import { publicationManifest } from "../src/content/publication-manifest";

test("PY101首章规划课不自动获得Publication、阅读路由或相邻导航", () => {
  const course = getLearningCourse("PY101")!;
  assert.equal(course.status, "planned");
  const slots = course.chapters[0].lessons;
  assert.equal(slots.length, 6);
  const planned = slots.filter(slot => !publicationManifest.some(p => p.lessonId === slot.lessonId));
  assert.ok(planned.length > 0);
  for (const slot of planned) {
    assert.equal(slot.status, "planned");
    assert.equal(slot.href, undefined);
    assert.equal(resolveLesson("PY101", slot.lessonId), undefined);
  }
  assert.equal(resolveLesson("ML201", pythonFirstRunLesson.id), undefined);
  const current = course.chapters.flatMap(ch => ch.lessons).filter(slot => slot.href);
  assert.equal(getAdjacentLessons(course, pythonFirstRunLesson.id).next?.lessonId, current[current.findIndex(slot => slot.lessonId === pythonFirstRunLesson.id) + 1]?.lessonId);
  assert.equal(course.chapters[4].lessons.length, 6);
  assert.equal(course.chapters[4].lessons[0].contentVersion, 2);
});

test("新首课进度与第五章和旧修订独立保存，保留旧值", () => {
  const data = new Map<string, string>();
  const store = createProgressStore(() => ({ getItem: key => data.get(key) ?? null, setItem: (key, value) => { data.set(key, value); } }));
  const first = { courseId: "PY101", lessonId: pythonFirstRunLesson.id, contentVersion: 1, sectionIds: pythonFirstRunLesson.sections.map(s => s.id) };
  const old = { courseId: "PY101", lessonId: "PY101-C05-L01", contentVersion: 2, sectionIds: ["concept", "quiz"] };
  store.save(old, 100, "quiz", true);
  const oldRaw = data.get(progressKey(old));
  assert.equal(store.getSnapshot(first), null);
  store.save(first, 40, "run-script");
  assert.equal(data.get(progressKey(old)), oldRaw);
  assert.equal(parseReadingProgress(store.getSnapshot(first), first)?.completed, false);
  assert.equal(parseReadingProgress(store.getSnapshot(old), old)?.completed, true);
});

test("首课可复制Python主代码和完整下载同源且不夹带提示符", () => {
  const blocks = pythonFirstRunLesson.sections.flatMap(s => s.blocks);
  const main = blocks.find(b => b.type === "code" && b.filename === "first_run.py");
  assert.ok(main?.type === "code");
  assert.equal(main.code, programs["first-run"].code);
  assert.doesNotMatch(main.code, />>>|assert |import |def /);
  assert.equal(pythonFirstRunLesson.resources.length, 1);
  assert.equal(pythonFirstRunLesson.resources[0].format, "Python");
});

test("本轮兼容登记仅撤销完整命中的必要源码，额外改动继续拒绝", () => {
  const sources = JSON.parse(readFileSync("docs/py101-p0/SOURCE_CHANGES.json", "utf8")) as { path: string; before: string }[];
  for (const source of sources) {
    const current = readFileSync(source.path, "utf8");
    assert.equal(beforePy101Source(source.path, current), source.before);
    const changed = current + "\n// unexpected change";
    assert.equal(beforePy101Source(source.path, changed), changed);
  }
});
