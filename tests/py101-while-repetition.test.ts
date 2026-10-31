import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { pythonWhileRepetitionLesson as lesson } from "../src/content/lessons/py101/while-repetition";
import { whileCode, whileBlockNames, missingUpdateForPaper } from "../src/content/resources/python-while-repetition";
import { whileCases, whileKey, assertFiniteCounter, runWhileExample } from "../scripts/validate-py101-while";
import { checkConditionalResult } from "../scripts/validate-py101-conditional";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { publicationSchema, isReadable, type ContentBlock } from "../src/content/models";
import { createProgressStore, parseReadingProgress, progressKey, type ProgressScope } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { beforeApprovedPy101Source, isApprovedPy101Addition } from "../scripts/py101-p1-compatibility";
const read = (name: string) => JSON.parse(readFileSync(`docs/py101-p19/${name}.json`, "utf8"));
const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const isPython = (b: ContentBlock): b is Extract<ContentBlock, { type: "code" }> => b.type === "code" && b.language === "python";

test("P19 3.4/r1/order4, actual private gate, preview evidence, adjacent 3.3 and no 3.5–3.8", () => {
  const p = publicationManifest.find(p => p.lessonId === lesson.id)!, g = read("DRAFT_GATE"), c = getLearningCourse("PY101")!;
  assert.deepEqual([p.lessonId, p.courseId, p.chapterId, p.title, p.contentVersion, p.order, p.optionalLesson], ["PY101-C03-L04", "PY101", "PY101-C03", lesson.title, 1, 4, false]);
  assert.deepEqual([g.publication.status, g.publication.access, g.readable, g.resolveUndefined, g.directoryHrefAbsent], ["draft", "private", false, true, true]);
  assert.equal(p.reviewEvidence, undefined); assert.throws(() => publicationSchema.parse({ ...p, status: "draft", access: "preview" }));
  assert.throws(() => publicationSchema.parse({ ...p, status: "pending-review", access: "preview", technicalEvidence: undefined }));
  if (p.status === "draft") assert.equal(resolveLesson("PY101", lesson.id), undefined);
  else { assert.deepEqual([p.status, p.access, p.technicalEvidence], ["pending-review", "preview", "docs/py101-p19/TECHNICAL_REPORT.md"]); assert.equal(resolveLesson("PY101", lesson.id)?.lesson, lesson); }
  assert.equal(c.status, "planned"); assert.deepEqual(c.chapters[2].lessons.map(l => l.displayNumber), ["3.1", "3.2", "3.3", "3.4"]);
  assert.equal([...lessonRegistry.keys()].filter(id => id.startsWith("PY101-C03-")).length, 4);
  for (let n = 5; n <= 8; n++) assert.equal(resolveLesson("PY101", `PY101-C03-L0${n}`), undefined);
  assert.equal(resolveLesson("ML201", lesson.id), undefined);
  if (isReadable(p)) { assert.equal(getAdjacentLessons(c, "PY101-C03-L03").next?.lessonId, lesson.id); assert.equal(getAdjacentLessons(c, lesson.id).previous?.lessonId, "PY101-C03-L03"); }
});
test("P19 if-to-while teaching and two core tasks cover the three observable goals", () => {
  const tasks = lesson.sections.filter(s => s.tier === "core").flatMap(s => s.blocks).filter(b => b.type === "exercise");
  assert.deepEqual(tasks.map(t => t.id), ["count-to-target", "repair-state-update"]);
  assert.deepEqual(lesson.assessmentMap, [{ objective: 1, exerciseIds: [tasks[0].id] }, { objective: 2, exerciseIds: tasks.map(t => t.id) }, { objective: 3, exerciseIds: [tasks[1].id] }]);
  for (const t of tasks) { assert.equal(t.kind, "代码"); assert.equal(t.hints.length, 2); assert.ok(t.solution.length >= 4); assert.ok(t.rubric.length >= 3); }
  const first = lesson.sections[0].blocks.filter(isPython); assert.equal(first.length, 1); assert.match(first[0].code, /\nif packed < target:/); assert.doesNotMatch(first[0].code, /\bwhile\b/);
  const section = lesson.sections.find(s => s.id === "first-while")!, firstCode = section.blocks.findIndex(isPython);
  assert.ok(firstCode > 0); const preceding = section.blocks.slice(0, firstCode).filter(b => b.type === "paragraph").map(b => b.text).join("\n");
  for (const concept of ["while", "循环体", "冒号", "4空格"]) assert.ok(preceding.includes(concept));
  assert.match(preceding, /回到条件(?:再次|重新)检查/);
  assert.deepEqual(lesson.learningTime, { reading: [14, 20], practice: [10, 15], coding: [22, 34], basis: "editorial-estimate" }); assert.deepEqual(lesson.resources, []);
});
test("P19 complete web Python is strictly shared and finite; unknown/dangerous/rewritten code cannot run", () => {
  const blocks = lesson.sections.flatMap(s => s.blocks).filter(isPython); assert.equal(blocks.length, 6);
  for (const b of blocks) { const key = whileKey(b.filename, b.code); assert.ok(whileCases.some(c => c.key === key && c.code === b.code)); assertFiniteCounter(b.code); assert.doesNotMatch(b.code, /\b(for|range|break|continue|def|try|except|import|else)\b|[\[\]{}]/); }
  for (const c of whileCases) assertFiniteCounter(c.code);
  assert.throws(() => runWhileExample("unknown.py", whileCode.main));
  assert.throws(() => runWhileExample(whileBlockNames.main, missingUpdateForPaper));
  assert.throws(() => whileKey(whileBlockNames.main, whileCode.main + "\nprint(True)"));
  for (const code of [missingUpdateForPaper, whileCode.main.replace("packed + 1", "packed - 1"), whileCode.main.replace("target = 3", "target = 10000")]) assert.throws(() => assertFiniteCounter(code));
  assert.ok(!blocks.some(b => b.code === missingUpdateForPaper)); assert.ok(lesson.sections.find(s => s.id === "stop-reason")!.blocks.some(b => b.type === "paragraph" && b.text.includes("只作纸面诊断")));
});
test("P19 actual saved-file results distinguish multiple/zero/new, print order and safe increment repair", () => {
  const r = read("PYTHON_RUNS"); assert.equal(r.rows.length, 18); assert.equal(r.uniqueProcessCount, 13); assert.equal(r.allAssertionsPassed, true);
  for (const c of whileCases) { const row = r.rows.find((x: { id: string }) => x.id === c.id); assert.ok(row); assert.equal(row.savedSource, c.code + "\n"); assert.equal(row.predictedStdout, c.expected); assert.equal(row.savedSha256, createHash("sha256").update(row.savedSource).digest("hex")); checkConditionalResult(c.expected, row); assert.equal(row.timeoutMs, 10_000); }
  assert.equal(new Set(r.rows.map((x: { pid: number }) => x.pid)).size, 13); assert.equal(r.rows.filter((x: { evidenceReused: boolean }) => x.evidenceReused).length, 5);
  assert.equal(r.rows.find((x: { id: string }) => x.id === "wrong-step-two").businessCorrect, false);
  assert.equal(whileCode.fault.replace("packed + 2", "packed + 1"), whileCode.main);
  assert.equal(r.preSolutionsSha256, createHash("sha256").update(readFileSync("docs/py101-p19/PRE_SOLUTIONS.md")).digest("hex"));
  assert.equal(r.studentPilot, false); assert.equal(r.macOSRuntimeVerified, false);
});
test("P19 read-only line traces prove final false checks and separate final printed/exit values", () => {
  const traces = read("PYTHON_RUNS").traces;
  assert.equal(traces.length, 7); assert.deepEqual(traces.map((t: { checks: { packed: number }[] }) => t.checks.map(c => c.packed)), [[0], [0, 1, 2, 3], [3], [4], [2, 3, 4, 5], [0, 1, 2, 3], [0, 2, 4]]);
  assert.deepEqual(traces.map((t: { finalValue: number }) => t.finalValue), [1, 3, 3, 4, 5, 3, 4]);
  for (const t of traces) { assert.equal(t.exitCode, 0); assert.equal(t.stderr, ""); assert.equal(t.finalValue, t.predictedFinal); assert.equal(t.programStdout, t.predictedStdout); assert.equal(t.programSha256, t.savedSha256); assert.equal(t.timeoutMs, 10_000); }
});
test("P19 controlled WAIT timeout is rejected, reaped and never counted as a normal teaching program", () => {
  const p = read("PYTHON_RUNS").timeoutProbe; assert.equal(p.timeoutMs, 150); assert.equal(p.selfBoundSeconds, 2); assert.equal(p.errorCode, "ETIMEDOUT"); assert.notEqual(p.exitCode, 0);
  assert.equal(p.childAliveAfterReturn, false); assert.equal(p.programCompletedNormally, false); assert.equal(p.normalResultRejected, true); assert.equal(p.stdout, "");
  assert.throws(() => checkConditionalResult("", { exitCode: p.exitCode, stdout: p.stdout, stderr: p.stderr }));
  assert.throws(() => checkConditionalResult("wrong prediction\n", { exitCode: 0, stdout: "Packing finished\n", stderr: "" }));
  assert.match(readFileSync("scripts/validate-py101-conditional.ts", "utf8"), /timeout:\s*10_000/);
});
test("P19 all 62 old Lesson/Publication/scopes including 3.1–3.3 r1 remain exact", () => {
  const b = read("CONTENT_BASELINE"); assert.equal(Object.keys(b.lessons).length, 62); assert.equal(Object.keys(b.publications).length, 62);
  for (const [id, hash] of Object.entries(b.lessons)) assert.equal(sha(lessonRegistry.get(id)), hash, id);
  for (const [id, hash] of Object.entries(b.publications)) assert.equal(sha(publicationManifest.find(p => p.lessonId === id)), hash, id);
  for (const scope of b.progressScopes) assert.deepEqual(lessonProgressScope(lessonRegistry.get(scope.lessonId)!), scope);
  const a = read("PREREQUISITE_AUDIT"); for (const p of a.prerequisites) { const l = resolveLesson("PY101", p.lessonId)!.lesson; assert.equal(l.contentVersion, p.contentVersion); assert.ok(l.sections.some(s => s.id === p.anchor)); }
  assert.deepEqual(lessonRegistry.get("PY101-C03-L03")!.sections.at(-1)!.blocks.at(-1), a.previousLessonFinalBlock); assert.equal(lessonRegistry.size, 63);
});
test("P19 exact historical authorization rejects unknown edits, independent r1 reload protects old strings/user fingerprints", () => {
  const b = read("CONTENT_BASELINE"), p = publicationManifest.find(p => p.lessonId === lesson.id)!;
  assert.equal(isApprovedPy101Addition(lesson.id, lesson, p, b.head), true); assert.equal(isApprovedPy101Addition(lesson.id, { ...lesson, title: "extra" }, p, b.head), false); assert.equal(isApprovedPy101Addition(lesson.id, lesson, { ...p, order: 5 }, b.head), false); assert.equal(isApprovedPy101Addition("PY101-C03-L05", lesson, p, b.head), false);
  for (const row of b.sources) { const current = readFileSync(row.path, "utf8"); assert.equal(beforeApprovedPy101Source(row.path, current, b.head), row.before); assert.equal(beforeApprovedPy101Source(row.path, current + "\n// extra", b.head), current + "\n// extra"); }
  const memory = new Map<string, string>(), port = { getItem: (k: string) => memory.get(k) ?? null, setItem: (k: string, v: string) => { memory.set(k, v); } }, store = createProgressStore(() => port);
  for (const scope of b.progressScopes as ProgressScope[]) { store.save(scope, 100, scope.sectionIds[0], true); if (scope.contentVersion > 1) store.save({ ...scope, contentVersion: 1 }, 100, scope.sectionIds[0], true); }
  const before = new Map(memory), scope = lessonProgressScope(lesson); assert.equal(progressKey(scope), "aivora:learning:v2:PY101:PY101-C03-L04:r1"); assert.equal(store.getSnapshot(scope), null);
  store.save(scope, 55, "order-matters"); const restored = parseReadingProgress(createProgressStore(() => port).getSnapshot(scope), scope); assert.deepEqual([restored?.percent, restored?.section, restored?.completed], [55, "order-matters", false]);
  for (const [k, v] of before) assert.equal(memory.get(k), v);
  const audit = read("WORKSPACE_PROTECTION"); assert.equal(audit.originalFilesByteIdentical, true); assert.equal(audit.originalModified.length + audit.originalUntracked.length, 11);
});
