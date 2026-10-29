import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { lessonRegistry } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { beforeR3Revision, beforeR3Source } from "../scripts/py101-p0-compatibility";
import { targetIds, sha, type R3Baseline } from "../scripts/review-ai000-r3";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";

const before = JSON.parse(readFileSync("docs/ai000-r3/BEFORE.json", "utf8")) as R3Baseline;

test("R3只归一化登记新稿，额外正文/提示/发布字段/源码变化仍被拒绝；冻结包保持", () => {
  for (const id of targetIds) {
    const current = lessonRegistry.get(id)!, old = before.lessons.find(l => l.id === id)!;
    assert.deepEqual(beforeR3Revision(current), old);
    const changed = structuredClone(current); changed.objectives[0] += "未登记修改";
    assert.deepEqual(beforeR3Revision(changed), changed); assert.notDeepEqual(beforeR3Revision(changed), old);
    const hintChanged = structuredClone(current);
    hintChanged.sections.flatMap(s => s.blocks).find(b => b.type === "exercise")!.hints[0] += "未登记提示";
    assert.deepEqual(beforeR3Revision(hintChanged), hintChanged);
    const pub = publicationManifest.find(p => p.lessonId === id)!;
    assert.deepEqual(beforeR3Revision(pub), before.publications.find(p => p.lessonId === id));
    assert.equal(beforeR3Revision({ ...pub, reviewEvidence: "伪造证据" }).reviewEvidence, "伪造证据");
  }
  const plan = JSON.parse(readFileSync("docs/ai000-r3/APPROVED_CHANGES.json", "utf8")) as { sources: { path: string; before: string }[] };
  for (const file of plan.sources) {
    const current = readFileSync(file.path, "utf8");
    assert.equal(beforeR3Source(file.path, current), file.before);
    assert.equal(beforeR3Source(file.path, current + "\n// extra"), current + "\n// extra");
  }
  assert.equal(sha(readFileSync("docs/ai000-release-readiness/CONTENT_SNAPSHOT.json")), before.frozenSnapshotSha256);
});

test("四节稳定section/exercise/legacyAnchors、正式目标和映射保持，只有6.3达标变化升r2", () => {
  for (const old of before.lessons) {
    const current = lessonRegistry.get(old.id)!;
    assert.deepEqual(current.sections.map(s => s.id), old.sections.map(s => s.id));
    assert.deepEqual(current.legacyAnchors, old.legacyAnchors);
    assert.deepEqual(current.objectives, old.objectives); assert.deepEqual(current.assessmentMap, old.assessmentMap);
    const tasks = (l: typeof old) => l.sections.flatMap(s => s.blocks).filter(b => b.type === "exercise");
    assert.deepEqual(tasks(current).map(t => t.id), tasks(old).map(t => t.id));
    if (old.id === "AI000-C06-L03") {
      assert.equal(old.contentVersion, 1); assert.equal(current.contentVersion, 2);
      for (let i = 0; i < 2; i++) assert.notDeepEqual(tasks(current)[i].rubric, tasks(old)[i].rubric);
    } else {
      assert.equal(current.contentVersion, old.contentVersion); assert.deepEqual(tasks(current), tasks(old));
    }
  }
});

test("6.3历史r1完成保留但不继承r2，其余三节r1位置可恢复，保存新版不覆写旧键", () => {
  const memory = new Map<string, string>();
  const port = { getItem: (k: string) => memory.get(k) ?? null, setItem: (k: string, v: string) => { memory.set(k, v); } };
  const store = createProgressStore(() => port);
  for (const old of before.lessons) store.save(lessonProgressScope(old), 100, old.sections.at(-1)!.id, true);
  const oldMemory = new Map(memory);
  for (const id of targetIds) {
    const current = lessonRegistry.get(id)!, scope = lessonProgressScope(current);
    if (id === "AI000-C06-L03") {
      assert.equal(progressKey(scope), "aivora:learning:v2:AI000:AI000-C06-L03:r2");
      assert.equal(store.getSnapshot(scope), null);
      store.save(scope, 60, "before-and-after");
      const restored = createProgressStore(() => port);
      assert.equal(parseReadingProgress(restored.getSnapshot(scope), scope)?.completed, false);
      assert.equal(parseReadingProgress(restored.getSnapshot(scope), scope)?.section, "before-and-after");
      restored.save(scope, 100, "takeaways", true);
      assert.equal(parseReadingProgress(createProgressStore(() => port).getSnapshot(scope), scope)?.completed, true);
    } else assert.equal(parseReadingProgress(store.getSnapshot(scope), scope)?.completed, true);
  }
  for (const [key, value] of oldMemory) assert.equal(memory.get(key), value, key);
});
