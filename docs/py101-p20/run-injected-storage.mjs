// Run from repository root: node --import tsx docs/py101-p20/run-injected-storage.mjs
// Node storage fixture evidence, never browser localStorage or a parallel Reader.
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createProgressStore } from "../../src/lib/learning-progress.ts";
import { lessonProgressScope } from "../../src/lib/use-learning-progress.ts";
import { lessonRegistry } from "../../src/lib/course-engine.ts";
import { readerLifecycle } from "../../tests/helpers/reader-lifecycle.ts";
const data = new Map();
const store = createProgressStore(() => ({ getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }));
for (const lesson of lessonRegistry.values()) if (lesson.id !== "PY101-C03-L04") {
  const scope = lessonProgressScope(lesson);
  const revisions = /^PY101-C0[12]-/.test(lesson.id) ? [1, 2] : scope.contentVersion > 1 ? [1, scope.contentVersion] : [1];
  for (const contentVersion of revisions) store.save({ ...scope, contentVersion }, 100, scope.sectionIds.at(-1), true);
}
data.set("aivora:learning:v1", JSON.stringify({ version: 1, lessonId: "ML201-C04-L01", percent: 64, completed: false, section: "code", updatedAt: 1000 }));
const before = new Map(data), reader = readerLifecycle("PY101-C03-L04", { data });
reader.mount("once-or-repeat"); assert.equal(reader.store.getSnapshot(reader.scope), null);
reader.scroll("order-matters", true); reader.fire("pagehide"); reader.unmount(); reader.advance(1000);
const digest = value => createHash("sha256").update(value).digest("hex");
const oldRows = [...before].map(([key, value]) => {
  assert.equal(data.get(key), value, key);
  return { key, beforeSha256: digest(value), afterSha256: digest(data.get(key)), byteIdentical: true };
});
writeFileSync("docs/py101-p20/INJECTED_STORAGE_REGRESSION.json", JSON.stringify({ kind: "Node injected storage and real Reader component harness; NOT browser localStorage", checkedAt: new Date().toISOString(), oldRecordCount: oldRows.length, oldRows, newKey: reader.key, newRecord: reader.progress, writes: reader.writes, allOldStringsIdentical: true }, null, 2) + "\n");
console.log(`${oldRows.length} old revision/v1 fixture strings unchanged; one new 3.4/r1 write, pagehide before UI frame.`);
