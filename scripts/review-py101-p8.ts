import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry, resolveLesson, getLearningCourse } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { isReadable } from "../src/content/models";
import { lessonProgressScope } from "../src/lib/use-learning-progress";

const dir = "docs/py101-p8";
const id = "PY101-C02-L01", amended = "PY101-C01-L06";
const sha = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const json = (name: string, value: unknown) => writeFileSync(`${dir}/${name}.json`, JSON.stringify(value, null, 2) + "\n");
const read = (name: string) => JSON.parse(readFileSync(`${dir}/${name}.json`, "utf8"));
const git = (...args: string[]) => execFileSync("git", args, { encoding: "utf8" });
const changedSources = ["src/content/course-outline.ts", "src/lib/course-engine.ts", "src/content/publication-manifest.ts", "src/content/lessons/py101/environment-reproduction.ts", "scripts/validate-python.ts", "scripts/py101-p1-compatibility.ts", "tests/py101-environment-reproduction.test.ts", "tests/content.test.ts"];
if (process.argv.includes("--baseline")) {
  const files = Object.fromEntries(git("ls-files", "-z", "src", "scripts", "tests", "public", "curriculum", "docs/py101-p6", "docs/py101-p7").split("\0").filter(Boolean).map(path => {
    const bytes = readFileSync(path);
    return [path, { sha256: sha(bytes), lfSha256: sha(bytes.toString("utf8").replaceAll("\r\n", "\n")) }];
  }));
  writeFileSync(`${dir}/BASELINE.json`, JSON.stringify({ head: git("rev-parse", "HEAD").trim(), files, lessons: Object.fromEntries([...lessonRegistry].map(([id, value]) => [id, sha(JSON.stringify(value))])), publications: Object.fromEntries(publicationManifest.map(value => [value.lessonId, sha(JSON.stringify(value))])), amendmentBefore: lessonRegistry.get(amended), publicationBefore: publicationManifest.find(p => p.lessonId === amended) }, null, 2) + "\n", { flag: "wx" });
  console.log("P8 actual object/file baseline saved; no historical snapshot rewritten.");
} else if (process.argv.includes("--draft")) {
  const entry = publicationManifest.find(p => p.lessonId === id)!;
  assert.deepEqual([entry.status, entry.access, isReadable(entry)], ["draft", "private", false]);
  assert.equal(resolveLesson("PY101", id), undefined);
  assert.equal(getLearningCourse("PY101")!.chapters[1].lessons[0].href, undefined);
  json("DRAFT_GATE", { checkedAt: new Date().toISOString(), lessonId: id, status: entry.status, access: entry.access, readable: isReadable(entry), resolveUndefined: true, directoryHrefAbsent: true, technicalEvidence: entry.technicalEvidence ?? null });
  console.log("Actual draft/private registry gate passed.");
} else if (process.argv.includes("--register")) {
  const base = read("BASELINE"), after = lessonRegistry.get(amended)!;
  const expected = structuredClone(base.amendmentBefore);
  const paragraph = after.sections.at(-1)!.blocks.at(-1)!;
  assert.equal(paragraph.type, "paragraph");
  if (paragraph.type !== "paragraph") throw new Error("Missing final handoff paragraph");
  expected.sections.at(-1).blocks.at(-1).text = paragraph.text;
  assert.deepEqual(after, expected, "1.6 only final handoff paragraph may change");
  assert.deepEqual(lessonProgressScope(after), lessonProgressScope(base.amendmentBefore));
  json("TRANSITION_AMENDMENT", { lessonId: amended, section: "chapter-handoff", before: base.amendmentBefore.sections.at(-1).blocks.at(-1).text, after: expected.sections.at(-1).blocks.at(-1).text, contentVersion: after.contentVersion, objectivesAndExercisesUnchanged: true, progressScopeUnchanged: true, beforeObjectSha256: base.lessons[amended], afterObjectSha256: sha(JSON.stringify(after)) });
  json("APPROVED_CHANGES", { baseline: base.head, addedLessonIds: [id], sources: changedSources.map(path => ({ path, before: git("show", `${base.head}:${path}`), afterSha256: sha(readFileSync(path, "utf8").replaceAll("\r\n", "\n")) })), lessons: [{ id: amended, before: base.amendmentBefore, afterSha256: sha(JSON.stringify(after)) }], publications: [{ id: amended, before: base.publicationBefore, afterSha256: sha(JSON.stringify(publicationManifest.find(p => p.lessonId === amended))) }], workspaceOnly: [], protectedText: [] });
  console.log("Exact approved changes registered; 1.6 task objects and progress scope equal.");
} else {
  const base = read("BASELINE"), workspace = read("WORKSPACE_BASELINE");
  const changed = new Set(changedSources);
  for (const [path, file] of Object.entries(base.files) as [string, {sha256: string; lfSha256: string}][]) {
    if (changed.has(path) || workspace.files.some((f: {path: string; kind: string}) => f.kind === "modified" && f.path === path)) continue;
    const bytes = readFileSync(path);
    assert.ok(sha(bytes) === file.sha256 || sha(bytes.toString("utf8").replaceAll("\r\n", "\n")) === file.lfSha256, path);
  }
  for (const kind of ["lessons", "publications"] as const) for (const [oldId, hash] of Object.entries(base[kind])) {
    if (oldId === amended) continue;
    const value = kind === "lessons" ? lessonRegistry.get(oldId) : publicationManifest.find(p => p.lessonId === oldId);
    assert.equal(sha(JSON.stringify(value)), hash, oldId);
  }
  assert.deepEqual([...lessonRegistry.keys()].sort(), [...Object.keys(base.lessons), id].sort());
  json("COMPATIBILITY", { checkedAt: new Date().toISOString(), oldLessonCount: Object.keys(base.lessons).length, newLessonIds: [id], unchangedOtherLessonObjects: Object.keys(base.lessons).length - 1, protectedFileCount: Object.keys(base.files).length, onlyAllowedSourceChanges: changedSources, allAssertionsPassed: true });
  console.log("Old lessons/publications, resources and protected files preserved.");
}
