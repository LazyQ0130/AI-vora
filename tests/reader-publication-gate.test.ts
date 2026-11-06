import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { lessonRegistry, getLearningCourse, resolveLesson, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { beforeApprovedPy101Object, beforeApprovedPy101Source } from "../scripts/py101-p1-compatibility";
const b = JSON.parse(readFileSync("docs/py101-p20/CONTENT_BASELINE.json", "utf8"));
const sha = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
test("P20 preserves all 63 Lesson objects/scopes and every other Publication", () => {
  assert.equal(lessonRegistry.size, 63);
  for (const [id, digest] of Object.entries(b.lessons)) assert.equal(sha(lessonRegistry.get(id)), digest, id);
  for (const scope of b.progressScopes) assert.deepEqual(lessonProgressScope(lessonRegistry.get(scope.lessonId)!), scope);
  for (const old of b.publications) if (old.lessonId !== "PY101-C03-L04") assert.deepEqual(publicationManifest.find(p => p.lessonId === old.lessonId), old);
  const p = publicationManifest.find(p => p.lessonId === "PY101-C03-L04")!, old = b.publications.find((p: { lessonId: string }) => p.lessonId === "PY101-C03-L04");
  assert.deepEqual({ ...p, status: old.status, access: old.access, technicalEvidence: undefined }, { ...old, technicalEvidence: undefined });
  assert.deepEqual([p.status, p.access, p.technicalEvidence, p.reviewEvidence], ["pending-review", "preview", "docs/py101-p20/TECHNICAL_REPORT.md", undefined]);
  const c = getLearningCourse("PY101")!; assert.equal(c.status, "planned"); assert.equal(resolveLesson("PY101", p.lessonId)?.publication, p);
  assert.equal(getAdjacentLessons(c, "PY101-C03-L03").next?.lessonId, p.lessonId);
  assert.equal(getAdjacentLessons(c, p.lessonId).previous?.lessonId, "PY101-C03-L03");
  for (let n = 5; n <= 8; n++) assert.equal(lessonRegistry.has(`PY101-C03-L0${n}`), false);
  assert.equal(resolveLesson("ML201", p.lessonId), undefined);
});
test("P20 compatibility accepts only whole registered source/object hashes, not extra edits", () => {
  for (const row of b.sources) {
    const current = readFileSync(row.path, "utf8");
    assert.equal(beforeApprovedPy101Source(row.path, current, b.baseline), row.before);
    assert.equal(beforeApprovedPy101Source(row.path, current + "\n// unapproved", b.baseline), current + "\n// unapproved");
  }
  const p = publicationManifest.find(p => p.lessonId === "PY101-C03-L04")!;
  assert.deepEqual(beforeApprovedPy101Object("publications", p.lessonId, p, b.baseline), b.publications.find((p: { lessonId: string }) => p.lessonId === "PY101-C03-L04"));
  const changed = { ...p, order: 5 }; assert.deepEqual(beforeApprovedPy101Object("publications", p.lessonId, changed, b.baseline), changed);
});
test("P20 leaves storage semantics and P19 finite-while source/validator byte-equivalent modulo Git line endings", () => {
  for (const path of ["src/lib/learning-progress.ts", "src/lib/use-learning-progress.ts", "src/content/lessons/py101/while-repetition.ts", "src/content/resources/python-while-repetition.ts", "scripts/validate-py101-while.ts", "scripts/validate-py101-conditional.ts"]) {
    const previous = execFileSync("git", ["show", `${b.baseline}:${path}`], { encoding: "utf8" });
    assert.equal(readFileSync(path, "utf8").replaceAll("\r\n", "\n"), previous.replaceAll("\r\n", "\n"), path);
  }
});
