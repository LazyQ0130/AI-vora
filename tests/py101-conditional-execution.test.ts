import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { pythonConditionalExecutionLesson as lesson } from "../src/content/lessons/py101/conditional-execution";
import { conditionalCode } from "../src/content/resources/python-conditional-execution";
import { conditionalCases, conditionalKey, checkConditionalResult } from "../scripts/validate-py101-conditional";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "./helpers/py101-p16-view";
import { publicationManifest } from "./helpers/py101-p16-view";
import { isReadable, publicationSchema } from "../src/content/models";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { createProgressStore, progressKey, parseReadingProgress } from "../src/lib/learning-progress";
import { beforeApprovedPy101Object, beforeApprovedPy101Source, isApprovedPy101Addition } from "../scripts/py101-p1-compatibility";

const read = (name: string) => JSON.parse(readFileSync(`docs/py101-p16/${name}.json`, "utf8"));
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
test("P16 unique 3.1/r1/order1 identity, real draft gate and evidence-bound preview only", () => {
  const p = publicationManifest.find(p => p.lessonId === lesson.id)!;
  assert.deepEqual([p.courseId, p.chapterId, p.order, p.contentVersion, p.optionalLesson], ["PY101", "PY101-C03", 1, 1, false]);
  assert.equal(p.title, lesson.title); assert.equal(p.reviewEvidence, undefined);
  const gate = read("DRAFT_GATE");
  assert.deepEqual([gate.publication.status, gate.publication.access, gate.readable, gate.resolveUndefined, gate.directoryHrefAbsent], ["draft", "private", false, true, true]);
  assert.throws(() => publicationSchema.parse({ ...p, status: "draft", access: "preview" }));
  assert.throws(() => publicationSchema.parse({ ...p, status: "pending-review", access: "preview", technicalEvidence: undefined }));
  if (p.status === "draft") assert.equal(resolveLesson("PY101", lesson.id), undefined);
  else assert.deepEqual([p.status, p.access, p.technicalEvidence], ["pending-review", "preview", "docs/py101-p16/TECHNICAL_REPORT.md"]);
  const course = getLearningCourse("PY101")!;
  assert.equal(course.status, "planned"); assert.deepEqual(course.chapters[2].lessons.map(l => [l.lessonId, l.displayNumber]), [[lesson.id, "3.1"]]);
  assert.deepEqual([...lessonRegistry.keys()].filter(id => id.startsWith("PY101-C03-")), [lesson.id]);
  assert.deepEqual(publicationManifest.filter(p => p.chapterId === lesson.chapterId).map(p => p.lessonId), [lesson.id]);
  for (let n = 2; n <= 8; n++) assert.equal(resolveLesson("PY101", `PY101-C03-L0${n}`), undefined);
  assert.equal(resolveLesson("ML201", lesson.id), undefined);
  if (isReadable(p)) {
    assert.equal(getAdjacentLessons(course, "PY101-C02-L06").next?.lessonId, lesson.id);
    assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "PY101-C02-L06");
  }
});
test("P16 three observable objectives, two independent core tasks and progressive feedback", () => {
  const tasks = lesson.sections.filter(s => s.tier === "core").flatMap(s => s.blocks).filter(b => b.type === "exercise");
  assert.equal(lesson.objectives.length, 3);
  assert.deepEqual(tasks.map(t => t.id), ["choose-when-to-print", "repair-if-block"]);
  assert.deepEqual(lesson.assessmentMap, [{ objective: 1, exerciseIds: [tasks[0].id] }, { objective: 2, exerciseIds: [tasks[1].id] }, { objective: 3, exerciseIds: [tasks[0].id] }]);
  for (const t of tasks) { assert.equal(t.hints.length, 2); assert.ok(t.solution.length >= 4); assert.ok(t.rubric.length >= 3); }
  assert.deepEqual(lesson.resources, []);
  const code = lesson.sections.flatMap(s => s.blocks).filter(b => b.type === "code" && b.language === "python");
  assert.equal(code.length, 7);
  for (const b of code) if (b.type === "code") { conditionalKey(b.filename, b.code); assert.doesNotMatch(b.code, /\b(elif|else|and|or|not|for|while|range|break|continue|def|try|except|import)\b|\[|\{/); }
  assert.throws(() => conditionalKey("unknown.py", conditionalCode.main));
  assert.throws(() => conditionalKey("quantity_check.py", conditionalCode.main.replace("    print", "print")));
});
test("P16 real saved files match independent predictions; single-error repair preserves comparison", () => {
  const report = read("PYTHON_RUNS"); assert.equal(report.rows.length, 17); assert.equal(report.allAssertionsPassed, true);
  assert.equal(report.studentPilot, false); assert.equal(report.macOSRuntimeVerified, false);
  for (const c of conditionalCases) {
    const row = report.rows.find((r: { id: string }) => r.id === c.id); assert.ok(row);
    assert.equal(row.savedSource, c.code + "\n"); assert.equal(row.predictedStdout, c.expected);
    assert.equal(row.savedSha256, createHash("sha256").update(row.savedSource).digest("hex")); checkConditionalResult(c.expected, row);
  }
  assert.equal(new Set(report.rows.map((r: { pid: number }) => r.pid)).size, 17);
  assert.equal(conditionalCode.broken.replace('\nprint("Pack allowed")', '\n    print("Pack allowed")'), conditionalCode.repaired);
  for (const bad of [{ exitCode: 0, stdout: "", stderr: "" }, { exitCode: 1, stdout: "Check finished\n", stderr: "" }, { exitCode: 0, stdout: "Check finished\n", stderr: "warning" }]) assert.throws(() => checkConditionalResult("Check finished\n", bad));
});
test("P16 2.6 changes only transition, r2 scope retained; every other old Lesson/Publication exact", () => {
  const b = read("CONTENT_BASELINE"), id = "PY101-C02-L06", current = lessonRegistry.get(id)!, expected = structuredClone(b.amendmentBefore.lesson);
  expected.sections.at(-1).blocks.at(-1).text = (current.sections.at(-1)!.blocks.at(-1) as { text: string }).text;
  assert.deepEqual(current, expected); assert.equal(current.contentVersion, 2); assert.deepEqual(lessonProgressScope(current), b.amendmentBefore.scope);
  for (const [key, hash] of Object.entries(b.lessons)) if (key !== id) assert.equal(digest(lessonRegistry.get(key)), hash, key);
  for (const [key, hash] of Object.entries(b.publications)) assert.equal(digest(publicationManifest.find(p => p.lessonId === key)), hash, key);
});
test("P16 history approval requires complete hashes and rejects unknown edits/additions", () => {
  const b = read("CONTENT_BASELINE"), old = lessonRegistry.get("PY101-C02-L06")!;
  assert.deepEqual(beforeApprovedPy101Object("lessons", old.id, old, b.head), b.amendmentBefore.lesson);
  const tampered = { ...old, title: old.title + " extra" };
  assert.deepEqual(beforeApprovedPy101Object("lessons", old.id, tampered, b.head), tampered);
  const p = publicationManifest.find(p => p.lessonId === lesson.id)!;
  assert.equal(isApprovedPy101Addition(lesson.id, lesson, p, b.head), true);
  assert.equal(isApprovedPy101Addition(lesson.id, { ...lesson, title: "unknown change" }, p, b.head), false);
  assert.equal(isApprovedPy101Addition(lesson.id, lesson, { ...p, title: "unknown change" }, b.head), false);
  assert.equal(isApprovedPy101Addition("PY101-C03-L02", lesson, p, b.head), false);
  const source = readFileSync("src/lib/course-engine.ts", "utf8");
  assert.equal(beforeApprovedPy101Source("src/lib/course-engine.ts", source + "\n// extra", b.head), source + "\n// extra");
});
test("P16 new progress persists independently; 12 old r1/r2 records remain byte-identical", () => {
  const memory = new Map<string, string>(), storage = { getItem: (k: string) => memory.get(k) ?? null, setItem: (k: string, v: string) => { memory.set(k, v); } };
  const store = createProgressStore(() => storage);
  for (const old of lessonRegistry.values()) if (/PY101-C0[12]-/.test(old.id)) for (const revision of [1, 2]) { const scope = { ...lessonProgressScope(old), contentVersion: revision }; store.save(scope, 100, scope.sectionIds[0], true); }
  const before = new Map(memory); assert.equal(before.size, 24);
  const scope = lessonProgressScope(lesson); assert.equal(progressKey(scope), "aivora:learning:v2:PY101:PY101-C03-L01:r1");
  assert.equal(store.getSnapshot(scope), null); store.save(scope, 55, "two-lines");
  const restored = parseReadingProgress(createProgressStore(() => storage).getSnapshot(scope), scope);
  assert.equal(restored?.section, "two-lines"); assert.equal(restored?.completed, false);
  for (const [k, v] of before) assert.equal(memory.get(k), v);
});
