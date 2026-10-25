import test from "node:test";
import assert from "node:assert/strict";
import {
  createProgressStore,
  progressKey,
  parseReadingProgress,
  migrateLegacyProgress,
  type ProgressScope,
} from "../src/lib/learning-progress";
import { PROGRESS_KEY } from "../src/lib/progress";

const ml: ProgressScope = {
  courseId: "ML201",
  lessonId: "ML201-C04-L01",
  contentVersion: 1,
  sectionIds: ["intuition", "code", "summary"],
};
const py: ProgressScope = {
  courseId: "PY101",
  lessonId: "PY101-C05-L01",
  contentVersion: 1,
  sectionIds: ["concept", "code"],
};
const legacy = JSON.stringify({
  version: 1,
  lessonId: ml.lessonId,
  percent: 64,
  completed: false,
  section: "code",
  updatedAt: 1000,
});
function setup() {
  const data = new Map<string, string>();
  const store = createProgressStore(() => ({
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
  }));
  return { data, store };
}
test("按课程、课时、内容修订独立保存，完成标记与最高比例不会被滚动回退", () => {
  const { store } = setup();
  const second = { ...py, lessonId: "PY101-C05-L02" };
  store.save(ml, 60, "code");
  store.save(py, 25, "concept");
  store.save(second, 12, "code");
  store.save(py, 100, "code", true);
  store.save(py, 5, "concept");
  assert.equal(parseReadingProgress(store.getSnapshot(ml), ml)?.percent, 60);
  assert.equal(
    parseReadingProgress(store.getSnapshot(py), py)?.completed,
    true,
  );
  assert.equal(parseReadingProgress(store.getSnapshot(py), py)?.percent, 100);
  assert.equal(
    parseReadingProgress(store.getSnapshot(second), second)?.percent,
    12,
  );
  const revised = { ...py, contentVersion: 2 };
  assert.equal(store.getSnapshot(revised), null);
  assert.notEqual(progressKey(py), progressKey(revised));
});
test("v1 只迁移原 ML 样章且幂等，不删除旧记录，合法 v2 优先", () => {
  const { data, store } = setup();
  data.set(PROGRESS_KEY, legacy);
  assert.equal(migrateLegacyProgress(legacy, py), null);
  assert.equal(
    migrateLegacyProgress(legacy, { ...ml, contentVersion: 2 }),
    null,
  );
  assert.equal(
    parseReadingProgress(store.getSnapshot(ml), ml)?.updatedAt,
    1000,
  );
  store.migrate(ml);
  const first = data.get(progressKey(ml));
  store.migrate(ml);
  assert.equal(data.get(progressKey(ml)), first);
  assert.equal(data.get(PROGRESS_KEY), legacy);
  store.save(ml, 81, "summary");
  store.migrate(ml);
  assert.equal(parseReadingProgress(store.getSnapshot(ml), ml)?.percent, 81);
  const unknown = JSON.stringify({ version: 99, lessonId: ml.lessonId });
  data.set(progressKey(ml), unknown);
  store.externalChanged(progressKey(ml));
  store.migrate(ml);
  assert.equal(data.get(progressKey(ml)), unknown);
  assert.equal(store.getSnapshot(ml), null);
});
test("损坏、跨课程、非法段落和未来版本数据不会污染进度", () => {
  const { data, store } = setup();
  store.save(py, 20, "code");
  const record = JSON.parse(data.get(progressKey(py))!);
  for (const patch of [
    { version: 3 },
    { courseId: "ML201" },
    { section: "missing" },
    { updatedAt: -1 },
    { percent: "80" },
  ])
    assert.equal(
      parseReadingProgress(JSON.stringify({ ...record, ...patch }), py),
      null,
    );
  assert.equal(parseReadingProgress("{", py), null);
  assert.equal(migrateLegacyProgress("{", ml), null);
});
test("写入被拒时使用各课时会话状态，外部事件不覆盖未落盘记录", () => {
  const { data, store: writable } = setup();
  writable.save(py, 10, "concept");
  const store = createProgressStore(() => ({
    getItem: (key) => data.get(key) ?? null,
    setItem: () => {
      throw new Error("quota");
    },
  }));
  assert.equal(store.save(py, 90, "code"), false);
  assert.equal(store.save(ml, 30, "intuition"), false);
  store.externalChanged(null);
  store.externalChanged(progressKey(py));
  assert.equal(parseReadingProgress(store.getSnapshot(py), py)?.percent, 90);
  assert.equal(parseReadingProgress(store.getSnapshot(ml), ml)?.percent, 30);
  assert.equal(JSON.parse(data.get(progressKey(py))!).percent, 10);
});
test("成功保存后外部标签的新记录和清除事件可被观察", () => {
  const { store, data } = setup();
  store.save(py, 20, "code");
  const record = JSON.parse(data.get(progressKey(py))!);
  data.set(progressKey(py), JSON.stringify({ ...record, percent: 75 }));
  store.externalChanged(progressKey(py));
  assert.equal(parseReadingProgress(store.getSnapshot(py), py)?.percent, 75);
  data.delete(progressKey(py));
  store.externalChanged(null);
  assert.equal(store.getSnapshot(py), null);
});

test("无订阅期间外部清除的键不会被已落盘内存缓存复活", () => {
  const { store, data } = setup();
  store.save(py, 42, "code");
  data.delete(progressKey(py));
  // 模拟页面离开后无 storage 监听；重新挂载时读取 null 应视为有效结果。
  assert.equal(store.getSnapshot(py), null);
});
