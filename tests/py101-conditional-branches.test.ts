import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { pythonConditionalBranchesLesson as lesson } from "../src/content/lessons/py101/conditional-branches";
import { branchCode, branchBlockNames } from "../src/content/resources/python-conditional-branches";
import { conditionalCode } from "../src/content/resources/python-conditional-execution";
import { branchCases, branchKey } from "../scripts/validate-py101-branches";
import { checkConditionalResult } from "../scripts/validate-py101-conditional";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "./helpers/py101-p17-view";
import { publicationManifest } from "./helpers/py101-p17-view";
import { publicationSchema, isReadable } from "../src/content/models";
import { createProgressStore, parseReadingProgress, progressKey, type ProgressScope } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { beforeApprovedPy101Source, isApprovedPy101Addition } from "../scripts/py101-p1-compatibility";

const read = (name: string) => JSON.parse(readFileSync(`docs/py101-p17/${name}.json`, "utf8"));
const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
test("P17 exact 3.2/r1/order2 identity, actual private gate, evidence-bound preview and only two C03 lessons", () => {
  const p = publicationManifest.find(p => p.lessonId === lesson.id)!, gate = read("DRAFT_GATE");
  assert.deepEqual([p.title, p.chapterId, p.courseId, p.order, p.contentVersion, p.optionalLesson], [lesson.title, "PY101-C03", "PY101", 2, 1, false]);
  assert.equal(p.reviewEvidence, undefined);
  assert.deepEqual([gate.publication.status, gate.publication.access, gate.readable, gate.resolveUndefined, gate.directoryHrefAbsent], ["draft", "private", false, true, true]);
  assert.throws(() => publicationSchema.parse({ ...p, status: "draft", access: "preview" }));
  assert.throws(() => publicationSchema.parse({ ...p, status: "pending-review", access: "preview", technicalEvidence: undefined }));
  if (p.status === "draft") assert.equal(resolveLesson("PY101", lesson.id), undefined);
  else assert.deepEqual([p.status, p.access, p.technicalEvidence], ["pending-review", "preview", "docs/py101-p17/TECHNICAL_REPORT.md"]);
  const course = getLearningCourse("PY101")!;
  assert.equal(course.status, "planned");
  assert.deepEqual(course.chapters[2].lessons.map(l => [l.lessonId, l.displayNumber]), [["PY101-C03-L01", "3.1"], [lesson.id, "3.2"]]);
  assert.deepEqual([...lessonRegistry.keys()].filter(id => id.startsWith("PY101-C03-")).sort(), ["PY101-C03-L01", lesson.id]);
  for (let n = 3; n <= 8; n++) assert.equal(resolveLesson("PY101", `PY101-C03-L0${n}`), undefined);
  assert.equal(resolveLesson("ML201", lesson.id), undefined);
  if (isReadable(p)) { assert.equal(getAdjacentLessons(course, "PY101-C03-L01").next?.lessonId, lesson.id); assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "PY101-C03-L01"); }
});
test("P17 two core code tasks cover three goals; else/elif teaching precedes full code and all blocks share registered source", () => {
  const tasks = lesson.sections.filter(s => s.tier === "core").flatMap(s => s.blocks).filter(b => b.type === "exercise");
  assert.deepEqual(tasks.map(t => t.id), ["choose-one-message", "repair-overlapping-choice"]);
  assert.deepEqual(lesson.assessmentMap, [{ objective: 1, exerciseIds: [tasks[0].id] }, { objective: 2, exerciseIds: tasks.map(t => t.id) }, { objective: 3, exerciseIds: [tasks[1].id] }]);
  for (const t of tasks) { assert.equal(t.kind, "代码"); assert.equal(t.hints.length, 2); assert.ok(t.solution.length >= 4); assert.ok(t.rubric.length >= 3); }
  for (const [id, keyword] of [["two-ways", "else"], ["three-ways", "elif"]]) {
    const section = lesson.sections.find(s => s.id === id)!;
    const firstCode = section.blocks.findIndex(b => b.type === "code" && b.language === "python"); assert.ok(firstCode > 0);
    assert.ok(section.blocks.slice(0, firstCode).some(b => b.type === "paragraph" && b.text.includes(keyword)));
  }
  const blocks = lesson.sections.flatMap(s => s.blocks).filter(b => b.type === "code" && b.language === "python");
  assert.equal(blocks.length, 10); assert.equal(branchCode.previous, conditionalCode.main);
  for (const b of blocks) if (b.type === "code") { branchKey(b.filename, b.code); assert.doesNotMatch(b.code, /\b(and|or|not|while|for|range|break|continue|def|try|except|match|import)\b|\[|\{/); }
  assert.throws(() => branchKey("unknown.py", branchCode.threeWay));
  assert.throws(() => branchKey(branchBlockNames.threeWay, branchCode.threeWay.replace("elif count == limit:", "if count == limit:")));
  assert.deepEqual(lesson.resources, []);
});
test("P17 actual saved-file outputs and executed-line traces distinguish first match from mathematical truth", () => {
  const report = read("PYTHON_RUNS"); assert.equal(report.rows.length, 24); assert.equal(report.traces.length, 2); assert.equal(report.allAssertionsPassed, true);
  for (const c of branchCases) {
    const r = report.rows.find((r: { id: string }) => r.id === c.id); assert.ok(r); assert.equal(r.savedSource, c.code + "\n");
    assert.equal(r.savedSha256, createHash("sha256").update(r.savedSource).digest("hex")); assert.equal(r.predictedStdout, c.expected); checkConditionalResult(c.expected, r);
  }
  assert.equal(new Set(report.rows.map((r: { pid: number }) => r.pid)).size, 24);
  assert.deepEqual(report.traces.map((t: { executedLines: number[] }) => t.executedLines), [[1, 2, 4, 5], [1, 2, 4, 6, 7]]);
  assert.equal(branchCode.overlap.replace("count <= limit", "count < limit"), branchCode.orderRepair);
  assert.equal(report.macOSRuntimeVerified, false); assert.equal(report.studentPilot, false);
});
test("P17 all sixty old Lesson/Publication objects and scopes remain exact, including 3.1/r1 and twelve r2 prerequisites", () => {
  const b = read("CONTENT_BASELINE"); assert.equal(Object.keys(b.lessons).length, 60); assert.equal(Object.keys(b.publications).length, 60);
  for (const [id, digest] of Object.entries(b.lessons)) assert.equal(sha(lessonRegistry.get(id)), digest, id);
  for (const [id, digest] of Object.entries(b.publications)) assert.equal(sha(publicationManifest.find(p => p.lessonId === id)), digest, id);
  for (const scope of b.progressScopes) assert.deepEqual(lessonProgressScope(lessonRegistry.get(scope.lessonId)!), scope);
  const a = read("PREREQUISITE_AUDIT"); for (const r of a.prerequisites) { const l = resolveLesson("PY101", r.lessonId)!.lesson; assert.equal(l.contentVersion, r.contentVersion); assert.ok(l.sections.some(s => s.id === r.anchor)); }
  const old = lessonRegistry.get("PY101-C03-L01")!; assert.equal(old.contentVersion, 1); assert.deepEqual(old.sections.at(-1)!.blocks.at(-1), a.previousLessonFinalBlock);
  assert.deepEqual(lessonRegistry.size, 61);
});
test("P17 historical approval accepts exact additions only and rejects unregistered source/object changes", () => {
  const b = read("CONTENT_BASELINE"), p = publicationManifest.find(p => p.lessonId === lesson.id)!;
  assert.equal(isApprovedPy101Addition(lesson.id, lesson, p, b.head), true);
  for (const [l, publication] of [[{ ...lesson, title: "undeclared" }, p], [lesson, { ...p, title: "undeclared" }]]) assert.equal(isApprovedPy101Addition(lesson.id, l, publication, b.head), false);
  assert.equal(isApprovedPy101Addition("PY101-C03-L03", lesson, p, b.head), false);
  for (const row of b.sources) {
    const current = readFileSync(row.path, "utf8"); assert.equal(beforeApprovedPy101Source(row.path, current, b.head), row.before);
    assert.equal(beforeApprovedPy101Source(row.path, current + "\n// undeclared", b.head), current + "\n// undeclared");
  }
});
test("P17 r1 position reload is independent; old current/historical revision strings are never rewritten", () => {
  const memory = new Map<string, string>(), port = { getItem: (k: string) => memory.get(k) ?? null, setItem: (k: string, v: string) => { memory.set(k, v); } };
  const store = createProgressStore(() => port), b = read("CONTENT_BASELINE");
  for (const scope of b.progressScopes as ProgressScope[]) { store.save(scope, 100, scope.sectionIds[0], true); if (scope.contentVersion > 1) store.save({ ...scope, contentVersion: 1 }, 100, scope.sectionIds[0], true); }
  const before = new Map(memory), scope = lessonProgressScope(lesson);
  assert.equal(progressKey(scope), "aivora:learning:v2:PY101:PY101-C03-L02:r1"); assert.equal(store.getSnapshot(scope), null);
  store.save(scope, 56, "first-match"); const reloaded = parseReadingProgress(createProgressStore(() => port).getSnapshot(scope), scope);
  assert.deepEqual([reloaded?.percent, reloaded?.section, reloaded?.completed], [56, "first-match", false]);
  for (const [k, v] of before) assert.equal(memory.get(k), v);
});
