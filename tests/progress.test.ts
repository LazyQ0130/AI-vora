import test from "node:test";
import assert from "node:assert/strict";
import { mergeProgress, parseProgress, LESSON_ID } from "../src/lib/progress";
test("损坏、版本过期、非法节 ID、日期与数值的本地记录安全回退", () => {
  for (const raw of [
    null,
    "{",
    "null",
    "[]",
    JSON.stringify({ version: 2 }),
    JSON.stringify({
      version: 1,
      lessonId: "fake",
      percent: 20,
      completed: false,
      section: "loss",
      updatedAt: 123,
    }),
  ])
    assert.equal(parseProgress(raw), null);
  const valid = mergeProgress(null, 35, "loss", false, 123);
  assert.deepEqual(parseProgress(JSON.stringify(valid)), valid);
  assert.equal(
    parseProgress(JSON.stringify({ ...valid, section: "fake" })),
    null,
  );
  assert.equal(
    parseProgress(JSON.stringify({ ...valid, updatedAt: -1 })),
    null,
  );
  assert.equal(
    parseProgress(JSON.stringify({ ...valid, percent: "100" })),
    null,
  );
});
test("阅读比例被限制且只前进，完成状态不被后续滚动覆盖", () => {
  const initial = mergeProgress(null, 73.7, "code", false, 100);
  assert.equal(initial.percent, 74);
  assert.equal(mergeProgress(initial, 12, "intuition", false, 200).percent, 74);
  const completed = mergeProgress(initial, 20, "summary", true, 300);
  assert.equal(completed.lessonId, LESSON_ID);
  assert.equal(completed.percent, 100);
  assert.equal(mergeProgress(completed, 0, "loss", false, 400).completed, true);
  assert.equal(mergeProgress(null, 999, "fake", false, 500).percent, 100);
  assert.equal(
    mergeProgress(null, NaN, "fake", false, 500).section,
    "intuition",
  );
});
