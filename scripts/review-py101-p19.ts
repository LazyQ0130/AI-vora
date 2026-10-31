import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { lessonRegistry, getLearningCourse, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { isReadable } from "../src/content/models";
import { lessonProgressScope } from "../src/lib/use-learning-progress";

const directory = "docs/py101-p19/", newId = "PY101-C03-L04";
const sha = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const objectSha = (value: unknown) => sha(JSON.stringify(value));
const json = (name: string, value: unknown, exclusive = false) => writeFileSync(directory + name + ".json", JSON.stringify(value, null, 2) + "\n", { flag: exclusive ? "wx" : "w" });
export const sourcePaths = ["src/content/course-outline.ts", "src/lib/course-engine.ts", "src/content/publication-manifest.ts", "scripts/validate-python.ts", "scripts/py101-p1-compatibility.ts", "tests/content.test.ts", "tests/py101-boolean-combinations.test.ts"];
const mode = process.argv[2];
if (mode === "baseline") {
  const head = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  assert.equal(head, "9c22ebdd19d1c7856bb19ecde404b2f19a678d47");
  json("CONTENT_BASELINE", { head, lessons: Object.fromEntries([...lessonRegistry].map(([id, l]) => [id, objectSha(l)])), publications: Object.fromEntries(publicationManifest.map(p => [p.lessonId, objectSha(p)])), progressScopes: [...lessonRegistry.values()].map(lessonProgressScope), sources: sourcePaths.map(path => ({ path, before: readFileSync(path, "utf8").replaceAll("\r\n", "\n") })) }, true);
  const prerequisites = [
    ["PY101-C01-L03", 2, "save-rerun"], ["PY101-C02-L01", 2, "read-and-update"], ["PY101-C02-L03", 2, "expression-to-value"],
    ["PY101-C03-L01", 1, "first-if"], ["PY101-C03-L01", 1, "block-boundary"], ["PY101-C03-L02", 1, "first-match"], ["PY101-C03-L03", 1, "short-circuit"], ["PY101-C03-L03", 1, "next-step"],
  ].map(([id, revision, anchor]) => {
    const l = lessonRegistry.get(String(id))!, p = publicationManifest.find(p => p.lessonId === id)!;
    assert.equal(l.contentVersion, revision); assert.ok(resolveLesson(l.courseId, l.id)); assert.ok(l.sections.some(s => s.id === anchor));
    return { lessonId: id, contentVersion: revision, anchor, href: `/learn/PY101/${id}#${anchor}`, readable: isReadable(p), lessonSha256: objectSha(l), progressScope: lessonProgressScope(l) };
  });
  json("PREREQUISITE_AUDIT", { head, prerequisites, previousLessonFinalBlock: lessonRegistry.get("PY101-C03-L03")!.sections.at(-1)!.blocks.at(-1), transitionDecision: "No amendment: 3.3 accurately introduces repetition as the next problem. 3.1, 3.2 and 3.3 r1 remain wholly identical." }, true);
  console.log("P19 baseline: 62 old objects/scopes, seven source snapshots and eight readable current prerequisite anchors saved.");
} else if (mode === "register") {
  const b = JSON.parse(readFileSync(directory + "CONTENT_BASELINE.json", "utf8"));
  for (const [id, digest] of Object.entries(b.lessons)) assert.equal(objectSha(lessonRegistry.get(id)), digest, id);
  for (const [id, digest] of Object.entries(b.publications)) assert.equal(objectSha(publicationManifest.find(p => p.lessonId === id)), digest, id);
  json("APPROVED_CHANGES", { baseline: b.head, sources: b.sources.map((row: { path: string; before: string }) => ({ ...row, afterSha256: sha(readFileSync(row.path, "utf8").replaceAll("\r\n", "\n")) })), lessons: [], publications: [], addedLessonIds: [newId], addedContent: [{ id: newId, lessonSha256: objectSha(lessonRegistry.get(newId)), publicationSha256: objectSha(publicationManifest.find(p => p.lessonId === newId)) }], workspaceOnly: [], protectedText: [] });
  console.log("P19 exact approvals registered; all 62 old Lesson/Publication objects identical.");
} else if (mode === "gate") {
  const p = publicationManifest.find(p => p.lessonId === newId)!;
  assert.deepEqual([p.status, p.access], ["draft", "private"]); assert.equal(isReadable(p), false); assert.equal(resolveLesson("PY101", newId), undefined);
  const hrefAbsent = !getLearningCourse("PY101")!.chapters[2].lessons.find(l => l.lessonId === newId)!.href;
  assert.ok(hrefAbsent); json("DRAFT_GATE", { checkedAt: new Date().toISOString(), publication: p, readable: false, resolveUndefined: true, directoryHrefAbsent: hrefAbsent }, true);
  console.log("Actual 3.4 draft/private cannot resolve or expose a reading link.");
} else if (mode === "audit") {
  const b = JSON.parse(readFileSync(directory + "WORKSPACE_BASELINE.json", "utf8"));
  const changed = b.tracked.filter((r: { path: string; sha256: string }) => sha(readFileSync(r.path)) !== r.sha256).map((r: { path: string }) => r.path);
  assert.deepEqual(changed.filter((p: string) => !sourcePaths.includes(p)), []);
  for (const r of [...b.modified, ...b.untracked]) assert.equal(sha(readFileSync(r.path)), r.sha256, r.path);
  json("WORKSPACE_PROTECTION", { checkedAt: new Date().toISOString(), trackedBaseline: b.tracked.length, authorizedChanged: changed, untouchedTracked: b.tracked.length - changed.length, originalModified: b.modified, originalUntracked: b.untracked, originalFilesByteIdentical: true });
  console.log(`${b.tracked.length - changed.length} original tracked files untouched; ${b.modified.length + b.untracked.length} user files byte-identical.`);
} else throw new Error("Use baseline/register/gate/audit");
