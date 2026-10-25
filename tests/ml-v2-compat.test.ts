import test from "node:test";
import assert from "node:assert/strict";
import {
  createProgressStore,
  progressKey,
  parseReadingProgress,
  type ProgressScope,
} from "../src/lib/learning-progress";
import { PROGRESS_KEY, LESSON_ID, sectionIds } from "../src/lib/progress";
import { resolveLesson } from "../src/lib/course-engine";

const newIds = [
  "ML201-C03-L01",
  "ML201-C03-L02",
  "ML201-C03-L03",
  "ML201-C04-L02",
  "ML201-C04-L03",
  "ML201-C04-L04",
  "ML201-C04-L05",
];
const oldScope: ProgressScope = {
  courseId: "ML201",
  lessonId: LESSON_ID,
  contentVersion: 1,
  sectionIds,
};
test("P0：旧样章 URL、七个锚点和内容修订保持兼容", () => {
  const old = resolveLesson("ML201", LESSON_ID)!;
  assert.ok(old);
  assert.equal(old.lesson.contentVersion, 1);
  assert.deepEqual(
    old.lesson.sections.map((s) => s.id),
    [...sectionIds],
  );
  assert.ok(newIds.every((id) => id !== LESSON_ID));
});
test("P0：旧 v1/v2 完成标记不迁移成七节新教材完成", () => {
  const data = new Map<string, string>();
  const legacy = JSON.stringify({
    version: 1,
    lessonId: LESSON_ID,
    percent: 100,
    completed: true,
    section: "code",
    updatedAt: 1000,
  });
  data.set(PROGRESS_KEY, legacy);
  const store = createProgressStore(() => ({
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
  }));
  store.migrate(oldScope);
  assert.equal(
    parseReadingProgress(store.getSnapshot(oldScope), oldScope)?.completed,
    true,
  );
  const before = data.get(progressKey(oldScope));
  for (const lessonId of newIds) {
    const scope: ProgressScope = {
      courseId: "ML201",
      lessonId,
      contentVersion: 1,
      sectionIds: ["intro"],
    };
    store.migrate(scope);
    assert.equal(store.getSnapshot(scope), null);
    assert.equal(data.has(progressKey(scope)), false);
  }
  assert.equal(data.get(PROGRESS_KEY), legacy);
  assert.equal(data.get(progressKey(oldScope)), before);
});
