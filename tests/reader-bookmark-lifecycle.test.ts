import test from "node:test";
import assert from "node:assert/strict";
import { readerLifecycle } from "./helpers/reader-lifecycle";
import { createProgressStore, progressKey } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { lessonRegistry } from "../src/lib/course-engine";

test("saved section survives nonzero initial SPA geometry, cleanup and same-lesson remount", () => {
  const h = readerLifecycle(); h.seed(); const before = h.store.getSnapshot(h.scope);
  h.mount("reverse-result"); h.advance(500);
  assert.equal(h.progress?.section, "short-circuit", "mount geometry is not a reading action");
  h.route(); h.scroll("reverse-result"); h.advance(16); h.unmount();
  assert.equal(h.store.getSnapshot(h.scope), before); assert.equal(h.writes.length, 0);
  const returned = readerLifecycle(); returned.data.set(returned.key, before!); returned.mount("reverse-result"); returned.advance(500);
  assert.equal(returned.progress?.section, "short-circuit");
});
test("a genuine reading scroll flushes once before debounce; pagehide plus cleanup is idempotent", () => {
  const h = readerLifecycle(); h.seed(); h.mount("separate-checks");
  h.scroll("five-values", true); h.advance(16); h.fire("pagehide"); h.unmount();
  assert.equal(h.progress?.section, "five-values"); assert.equal(h.progress?.percent, 74); assert.equal(h.writes.length, 1);
  h.advance(1000); assert.equal(h.writes.length, 1);
});
test("after debounce, route/reset geometry and cleanup cannot replace the accepted section", () => {
  const h = readerLifecycle(); h.seed(); h.mount("separate-checks"); h.scroll("five-values", true); h.advance(500);
  assert.equal(h.progress?.section, "five-values"); h.route(); h.scroll("reverse-result"); h.advance(500); h.unmount();
  assert.equal(h.progress?.section, "five-values"); assert.equal(h.writes.length, 1);
});
test("explicit smooth anchor owns the bookmark through intermediate sections and immediate departure", () => {
  const h = readerLifecycle(); h.seed("five-values"); h.mount("five-values"); h.anchor("short-circuit");
  h.scroll("reverse-result"); h.advance(16); h.route(); h.unmount();
  assert.equal(h.progress?.section, "short-circuit"); assert.equal(h.writes.length, 1);
});
test("completed status and high-water percent survive subsequent accepted scrolls", () => {
  const h = readerLifecycle(); h.seed("short-circuit", 100, true); h.mount("separate-checks"); h.scroll("five-values", true); h.advance(500); h.unmount();
  assert.deepEqual([h.progress?.completed, h.progress?.percent, h.progress?.section], [true, 100, "five-values"]);
});
test("continuous lesson switching never shares accepted points or timers across scopes", () => {
  const data = new Map<string, string>();
  const a = readerLifecycle("PY101-C03-L03", { data }); a.seed(); a.mount("separate-checks"); a.scroll("five-values", true); a.advance(16); a.route(); a.unmount();
  const aRaw = data.get(a.key);
  const b = readerLifecycle("PY101-C03-L02", { data }); b.seed("first-match", 100, true); b.mount("first-match"); b.scroll("first-match", true); b.advance(16); b.unmount();
  const bRaw = data.get(b.key);
  const c = readerLifecycle("PY101-C03-L04", { data }); c.mount("once-or-repeat"); c.advance(500);
  assert.equal(c.store.getSnapshot(c.scope), null); c.scroll("order-matters", true); c.advance(500); c.unmount();
  a.advance(1000); b.advance(1000);
  assert.equal(data.get(a.key), aRaw); assert.equal(data.get(b.key), bRaw);
  assert.equal(c.progress?.section, "order-matters"); assert.equal(c.progress?.completed, false);
});
test("React reactivation resumes input saving without replaying stale geometry", () => {
  const h = readerLifecycle(); h.seed(); h.mount("reverse-result"); h.unmount(); h.reactivate(); h.advance(500);
  assert.equal(h.writes.length, 0); h.scroll("five-values", true); h.advance(500);
  assert.equal(h.progress?.section, "five-values"); assert.equal(h.writes.length, 1);
});
test("denied persistent storage keeps accepted reading in the existing session fallback", () => {
  const h = readerLifecycle("PY101-C03-L03", { denied: true }); h.seed(); h.mount("separate-checks"); h.scroll("five-values", true); h.advance(500); h.fire("pagehide"); h.unmount();
  assert.equal(h.progress?.section, "five-values"); assert.equal(h.progress?.percent, 74); assert.equal(h.data.size, 0);
});
test("keyboard and touch input persist ordinary reading, idle hover and layout scroll do not", () => {
  const h = readerLifecycle(); h.seed(); h.mount("separate-checks");
  h.fire("pointermove", { button: 0, buttons: 0 }); h.scroll("reverse-result"); h.advance(500); assert.equal(h.writes.length, 0);
  h.fire("keydown", { key: "PageDown" }); h.scroll("five-values"); h.advance(500); assert.equal(h.progress?.section, "five-values");
  h.fire("touchmove"); h.scroll("reverse-result"); h.advance(16); h.fire("scrollend"); assert.equal(h.progress?.section, "reverse-result");
  const count = h.writes.length; h.scroll("short-circuit"); h.advance(500); assert.equal(h.writes.length, count);
});
test("click-to-leave closes an active reading gesture before route geometry can change", () => {
  const h = readerLifecycle(); h.seed(); h.mount("short-circuit"); h.scroll("five-values", true); h.advance(16);
  h.fire("click", { button: 0, target: { closest: () => ({ href: "http://test/courses/PY101", target: "", download: "" }) } });
  h.scroll("reverse-result"); h.advance(500); h.unmount(); assert.equal(h.progress?.section, "five-values"); assert.equal(h.writes.length, 1);
});
test("real completion button cancels pending save and ordinary reading cannot undo completion", () => {
  const h = readerLifecycle(); h.seed(); h.mount("separate-checks"); h.scroll("five-values", true); h.advance(16); h.complete();
  assert.equal(h.progress?.completed, true); h.scroll("reverse-result", true); h.advance(500); h.unmount();
  assert.deepEqual([h.progress?.completed, h.progress?.percent], [true, 100]);
});
test("a new 3.4 reading session leaves all other lesson/revision fixture strings byte-identical", () => {
  const data = new Map<string, string>(), store = createProgressStore(() => ({ getItem: k => data.get(k) ?? null, setItem: (k, v) => { data.set(k, v); } }));
  for (const lesson of lessonRegistry.values()) if (lesson.id !== "PY101-C03-L04") {
    const scope = lessonProgressScope(lesson); const revisions = /^PY101-C0[12]-/.test(lesson.id) ? [1, 2] : scope.contentVersion > 1 ? [1, scope.contentVersion] : [1];
    for (const contentVersion of revisions) store.save({ ...scope, contentVersion }, 100, scope.sectionIds.at(-1)!, true);
  }
  const before = new Map(data), h = readerLifecycle("PY101-C03-L04", { data });
  h.mount("once-or-repeat"); assert.equal(h.store.getSnapshot(h.scope), null); h.scroll("order-matters", true); h.advance(500); h.unmount();
  assert.equal(h.key, progressKey(h.scope)); assert.equal(h.progress?.completed, false);
  for (const [key, value] of before) assert.equal(data.get(key), value, key);
});
for (const exit of ["scrollend", "pagehide", "unmount"]) test(`accepted scroll is captured before pending UI animation frame on ${exit}`, () => {
  const h = readerLifecycle(); h.seed(); h.mount("separate-checks"); h.scroll("five-values", true);
  if (exit === "unmount") h.unmount(); else h.fire(exit);
  h.advance(500); assert.equal(h.progress?.section, "five-values"); assert.equal(h.writes.length, 1);
});
