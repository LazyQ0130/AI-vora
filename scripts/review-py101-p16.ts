import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { lessonRegistry, getLearningCourse, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { isReadable } from "../src/content/models";
import { lessonProgressScope } from "../src/lib/use-learning-progress";

const directory = "docs/py101-p16/";
const sha = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const objectSha = (value: unknown) => sha(JSON.stringify(value));
const json = (name: string, value: unknown, exclusive = false) => writeFileSync(directory + name + ".json", JSON.stringify(value, null, 2) + "\n", { flag: exclusive ? "wx" : "w" });
// Only these pre-existing files are authorized. New P16 files are inspected by git diff separately.
export const sourcePaths = ["src/content/course-outline.ts", "src/lib/course-engine.ts", "src/content/publication-manifest.ts", "src/content/lessons/py101/readable-output.ts", "scripts/validate-python.ts", "scripts/py101-p1-compatibility.ts", "tests/helpers/py101-p14-view.ts", "tests/py101-beginner-refinement.test.ts", "tests/py101-chapter-two-audit.test.ts", "tests/py101-editor-rerun.test.ts", "tests/py101-environment-reproduction.test.ts", "tests/py101-notebook-cell-order.test.ts", "tests/py101-project-environments.test.ts", "tests/py101-script-paths.test.ts", "tests/content.test.ts"];
const mode = process.argv[2];
if (mode === "baseline") {
  const head = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  assert.equal(head, "3b06e11259d01f041ff9eb384b51d79626f6ebb5");
  json("CONTENT_BASELINE", { head, lessons: Object.fromEntries([...lessonRegistry].map(([id, l]) => [id, objectSha(l)])), publications: Object.fromEntries(publicationManifest.map(p => [p.lessonId, objectSha(p)])), amendmentBefore: { lesson: lessonRegistry.get("PY101-C02-L06"), publication: publicationManifest.find(p => p.lessonId === "PY101-C02-L06"), scope: lessonProgressScope(lessonRegistry.get("PY101-C02-L06")!) }, sources: sourcePaths.map(path => ({ path, before: readFileSync(path, "utf8").replaceAll("\r\n", "\n") })) }, true);
  console.log("P16 content baseline saved before lesson registration.");
} else if (mode === "gate") {
  const p = publicationManifest.find(p => p.lessonId === "PY101-C03-L01")!;
  assert.deepEqual([p.status, p.access], ["draft", "private"]);
  assert.equal(isReadable(p), false); assert.equal(resolveLesson("PY101", p.lessonId), undefined);
  const hrefAbsent = !getLearningCourse("PY101")!.chapters[2].lessons[0].href;
  assert.ok(hrefAbsent);
  json("DRAFT_GATE", { checkedAt: new Date().toISOString(), publication: p, readable: false, resolveUndefined: true, directoryHrefAbsent: hrefAbsent }, true);
  console.log("Actual draft/private registry cannot resolve or expose a reading href.");
} else if (mode === "register") {
  const b = JSON.parse(readFileSync(directory + "CONTENT_BASELINE.json", "utf8"));
  const id = "PY101-C02-L06", lesson = lessonRegistry.get(id)!, publication = publicationManifest.find(p => p.lessonId === id)!;
  const newId = "PY101-C03-L01";
  json("APPROVED_CHANGES", { baseline: b.head, sources: b.sources.map((row: { path: string; before: string }) => ({ ...row, afterSha256: sha(readFileSync(row.path, "utf8").replaceAll("\r\n", "\n")) })), lessons: [{ id, before: b.amendmentBefore.lesson, afterSha256: objectSha(lesson) }], publications: [{ id, before: b.amendmentBefore.publication, afterSha256: objectSha(publication) }], addedLessonIds: [newId], addedContent: [{ id: newId, lessonSha256: objectSha(lessonRegistry.get(newId)), publicationSha256: objectSha(publicationManifest.find(p => p.lessonId === newId)) }], workspaceOnly: [], protectedText: [] });
  assert.deepEqual(lessonProgressScope(lesson), b.amendmentBefore.scope);
  const old = b.amendmentBefore.lesson, after = structuredClone(old);
  after.sections.at(-1).blocks.at(-1).text = (lesson.sections.at(-1)!.blocks.at(-1) as { text: string }).text;
  assert.deepEqual(lesson, after);
  json("TRANSITION_AMENDMENT", { lessonId: id, sectionId: "chapter-end", before: old.sections.at(-1).blocks.at(-1).text, after: (lesson.sections.at(-1)!.blocks.at(-1) as { text: string }).text, beforeLesson: old, afterLesson: lesson, beforeScope: b.amendmentBefore.scope, afterScope: lessonProgressScope(lesson), versionDecision: "Keep r2: only the transition paragraph changes; objectives, tasks, assessment, IDs and scope are identical." });
  console.log("Exact P16 source/object approvals registered; 2.6 full object differs only in its final transition.");
} else if (mode === "audit") {
  const b = JSON.parse(readFileSync(directory + "WORKSPACE_BASELINE.json", "utf8"));
  const changed = b.tracked.filter((r: { path: string; sha256: string }) => sha(readFileSync(r.path)) !== r.sha256).map((r: { path: string }) => r.path);
  assert.deepEqual(changed.filter((p: string) => !sourcePaths.includes(p)), []);
  for (const r of [...b.modified, ...b.untracked]) assert.equal(sha(readFileSync(r.path)), r.sha256, r.path);
  json("WORKSPACE_PROTECTION", { checkedAt: new Date().toISOString(), trackedBaseline: b.tracked.length, authorizedChanged: changed, untouchedTracked: b.tracked.length - changed.length, originalModified: b.modified, originalUntracked: b.untracked, originalFilesByteIdentical: true });
  console.log(`${b.tracked.length - changed.length} tracked files untouched; ${b.modified.length + b.untracked.length} original user files byte-identical.`);
} else throw new Error("Use baseline, gate, register or audit");
