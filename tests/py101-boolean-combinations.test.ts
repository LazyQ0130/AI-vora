import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { pythonBooleanCombinationsLesson as lesson } from "../src/content/lessons/py101/boolean-combinations";
import { booleanCode, booleanBlockNames } from "../src/content/resources/python-boolean-combinations";
import { booleanCases, booleanKey, quantityPredictions, runBooleanExample } from "../scripts/validate-py101-boolean";
import { checkConditionalResult } from "../scripts/validate-py101-conditional";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { publicationSchema, isReadable, type ContentBlock } from "../src/content/models";
import { createProgressStore, parseReadingProgress, progressKey, type ProgressScope } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { beforeApprovedPy101Source, isApprovedPy101Addition } from "../scripts/py101-p1-compatibility";
const read = (name: string) => JSON.parse(readFileSync(`docs/py101-p18/${name}.json`, "utf8"));
const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const isPython = (block: ContentBlock): block is Extract<ContentBlock, { type: "code" }> => block.type === "code" && block.language === "python";

test("P18 only 3.3/r1/order3, real private gate, evidence-bound preview and adjacent 3.2", () => {
  const p = publicationManifest.find(p => p.lessonId === lesson.id)!, gate = read("DRAFT_GATE"), c = getLearningCourse("PY101")!;
  assert.deepEqual([p.lessonId, p.title, p.chapterId, p.courseId, p.contentVersion, p.order, p.optionalLesson], ["PY101-C03-L03", lesson.title, "PY101-C03", "PY101", 1, 3, false]);
  assert.deepEqual([gate.publication.status, gate.publication.access, gate.readable, gate.resolveUndefined, gate.directoryHrefAbsent], ["draft", "private", false, true, true]);
  assert.equal(p.reviewEvidence, undefined); assert.throws(() => publicationSchema.parse({ ...p, status: "draft", access: "preview" }));
  assert.throws(() => publicationSchema.parse({ ...p, status: "pending-review", access: "preview", technicalEvidence: undefined }));
  if (p.status === "draft") assert.equal(resolveLesson("PY101", lesson.id), undefined);
  else { assert.deepEqual([p.status, p.access, p.technicalEvidence], ["pending-review", "preview", "docs/py101-p18/TECHNICAL_REPORT.md"]); assert.equal(resolveLesson("PY101", lesson.id)?.lesson, lesson); }
  assert.equal(c.status, "planned"); assert.deepEqual(c.chapters[2].lessons.map(l => [l.lessonId, l.displayNumber]), [["PY101-C03-L01", "3.1"], ["PY101-C03-L02", "3.2"], [lesson.id, "3.3"]]);
  assert.deepEqual([...lessonRegistry.keys()].filter(id => id.startsWith("PY101-C03-")).sort(), ["PY101-C03-L01", "PY101-C03-L02", lesson.id]);
  for (let n = 4; n <= 8; n++) assert.equal(resolveLesson("PY101", `PY101-C03-L0${n}`), undefined);
  assert.equal(resolveLesson("ML201", lesson.id), undefined);
  if (isReadable(p)) { assert.equal(getAdjacentLessons(c, "PY101-C03-L02").next?.lessonId, lesson.id); assert.equal(getAdjacentLessons(c, lesson.id).previous?.lessonId, "PY101-C03-L02"); }
});
test("P18 three observable goals, two core authored tasks and staged and/or/not before use", () => {
  const tasks = lesson.sections.filter(s => s.tier === "core").flatMap(s => s.blocks).filter(b => b.type === "exercise");
  assert.deepEqual(tasks.map(t => t.id), ["combine-quantity-rules", "diagnose-connector"]);
  assert.deepEqual(lesson.assessmentMap, [{ objective: 1, exerciseIds: [tasks[0].id] }, { objective: 2, exerciseIds: tasks.map(t => t.id) }, { objective: 3, exerciseIds: [tasks[1].id] }]);
  assert.deepEqual(lesson.learningTime, { reading: [14, 20], practice: [10, 15], coding: [20, 30], basis: "editorial-estimate" });
  for (const t of tasks) { assert.equal(t.kind, "代码"); assert.equal(t.hints.length, 2); assert.ok(t.solution.length >= 4); assert.ok(t.rubric.length >= 3); }
  for (const [id, word] of [["both-required", "and"], ["review-or", "or"], ["reverse-result", "not"]]) {
    const section = lesson.sections.find(s => s.id === id)!, index = section.blocks.findIndex(b => b.type === "code" && b.language === "python");
    assert.ok(index > 0); assert.ok(section.blocks.slice(0, index).some(b => b.type === "paragraph" && b.text.includes(word)));
  }
  const first = lesson.sections[0].blocks.filter(isPython); assert.equal(first.length, 1); assert.doesNotMatch(first[0].code, /\b(and|or|not)\b/);
  assert.deepEqual(lesson.resources, []);
});
test("P18 every complete web Python block has exact source and nonempty canonical execution coverage; unknown/altered source rejected", () => {
  const blocks = lesson.sections.flatMap(s => s.blocks).filter(isPython);
  assert.equal(blocks.length, 11); assert.equal(new Set(blocks.map(b => booleanKey(b.filename, b.code))).size, 11);
  for (const b of blocks) { const key = booleanKey(b.filename, b.code); assert.ok(booleanCases.some(c => c.key === key && c.code === b.code)); assert.doesNotMatch(b.code, /\b(while|for|range|break|continue|def|try|except|match|import)\b|[\[\]{}&|~]/); }
  assert.throws(() => booleanKey("unregistered.py", booleanCode.main));
  assert.throws(() => runBooleanExample("unregistered.py", booleanCode.main));
  assert.throws(() => runBooleanExample(booleanBlockNames.main, booleanCode.main.replace(") and (", ") or (")));
  assert.throws(() => booleanKey(booleanBlockNames.notComparison, booleanCode.notComparison + "\nprint(True)"));
});
test("P18 five-value facts, wrong-or counterexamples, not meanings and four short-circuit paths match real saved execution", () => {
  const report = read("PYTHON_RUNS"); assert.equal(report.rows.length, 53); assert.equal(report.uniqueProcessCount, 48); assert.equal(report.traces.length, 4); assert.equal(report.allAssertionsPassed, true);
  assert.deepEqual(quantityPredictions.map(r => [r.count, r.and.trim()]), [[2, "False"], [3, "True"], [5, "True"], [6, "True"], [7, "False"]]);
  for (const c of booleanCases) { const r = report.rows.find((r: { id: string }) => r.id === c.id); assert.ok(r); assert.equal(r.savedSource, c.code + "\n"); assert.equal(r.predictedStdout, c.expected); assert.equal(r.savedSha256, createHash("sha256").update(r.savedSource).digest("hex")); checkConditionalResult(c.expected, r); }
  assert.equal(new Set(report.rows.map((r: { pid: number }) => r.pid)).size, 48); assert.equal(report.rows.filter((r: { evidenceReused: boolean }) => r.evidenceReused).length, 5);
  for (const n of [2, 7]) { const bad = report.rows.find((r: { id: string }) => r.id === `fault-${n}`), fixed = report.rows.find((r: { id: string }) => r.id === `fixed-${n}`); assert.equal(bad.businessCorrect, false); assert.match(bad.stdout, /Quantity ready/); checkConditionalResult("Check finished\n", fixed); }
  assert.equal(booleanCode.fault.replace(") or (", ") and ("), booleanCode.fixed);
  assert.deepEqual(report.traces.map((r: { executedComparisons: number[] }) => r.executedComparisons), [[0], [0, 1], [0], [0, 1]]);
  for (const r of report.traces) { assert.equal(r.exitCode, 0); assert.equal(r.stderr, ""); assert.equal(r.compareSites.length, 2); assert.ok(r.compareSites[0].startColumn < r.compareSites[1].startColumn); assert.equal(r.programStdout, r.predictedStdout); assert.equal(r.programSha256, r.savedSha256); }
  assert.equal(report.preSolutionsSha256, createHash("sha256").update(readFileSync("docs/py101-p18/PRE_SOLUTIONS.md")).digest("hex"));
  assert.equal(report.studentPilot, false); assert.equal(report.macOSRuntimeVerified, false);
});
test("P18 confines bool claims, distinguishes precomputed operands, and rejects the general always-bool misconception", () => {
  const paragraphs = lesson.sections.flatMap(s => s.blocks).filter(b => b.type === "paragraph").map(b => b.text).join("\n");
  const rejectFalseClaim = (text: string) => assert.doesNotMatch(text, /and(?:\s*\/\s*|和)or[^。\n]{0,30}(?:所有情况下|所有类型|一律|总是)[^。\n]{0,20}(?:bool|布尔|True|False)/);
  rejectFalseClaim(paragraphs); assert.throws(() => rejectFalseClaim(paragraphs + "\nPython中and和or在所有情况下都返回bool。"));
  assert.match(paragraphs, /普通数值比较得到的bool/); assert.match(paragraphs, /两条赋值已经分别执行过比较/); assert.match(paragraphs, /or则在左侧已为True时跳过右侧/);
  const facts = readFileSync("docs/py101-p18/SOURCE_FACTS.md", "utf8"); assert.match(facts, /一般返回某个操作数/); assert.match(facts, /not总返回bool/);
});
test("P18 every old Lesson/Publication/scope remains identical, including 3.1/3.2 r1 and first two chapters r2", () => {
  const b = read("CONTENT_BASELINE"); assert.equal(Object.keys(b.lessons).length, 61); assert.equal(Object.keys(b.publications).length, 61);
  for (const [id, hash] of Object.entries(b.lessons)) assert.equal(sha(lessonRegistry.get(id)), hash, id);
  for (const [id, hash] of Object.entries(b.publications)) assert.equal(sha(publicationManifest.find(p => p.lessonId === id)), hash, id);
  for (const scope of b.progressScopes) assert.deepEqual(lessonProgressScope(lessonRegistry.get(scope.lessonId)!), scope);
  const a = read("PREREQUISITE_AUDIT"); for (const r of a.prerequisites) { const l = resolveLesson("PY101", r.lessonId)!.lesson; assert.equal(l.contentVersion, r.contentVersion); assert.ok(l.sections.some(s => s.id === r.anchor)); }
  for (const n of [1, 2]) assert.equal(lessonRegistry.get(`PY101-C03-L0${n}`)!.contentVersion, 1);
  assert.deepEqual(lessonRegistry.get("PY101-C03-L02")!.sections.at(-1)!.blocks.at(-1), a.previousLessonFinalBlock);
  assert.equal(lessonRegistry.size, 62);
});
test("P18 full-hash historical approval rejects unknown changes and new r1 storage leaves every old revision string intact", () => {
  const b = read("CONTENT_BASELINE"), p = publicationManifest.find(p => p.lessonId === lesson.id)!;
  assert.equal(isApprovedPy101Addition(lesson.id, lesson, p, b.head), true);
  assert.equal(isApprovedPy101Addition(lesson.id, { ...lesson, title: "undeclared" }, p, b.head), false);
  assert.equal(isApprovedPy101Addition(lesson.id, lesson, { ...p, order: 4 }, b.head), false);
  assert.equal(isApprovedPy101Addition("PY101-C03-L04", lesson, p, b.head), false);
  for (const r of b.sources) { const current = readFileSync(r.path, "utf8"); assert.equal(beforeApprovedPy101Source(r.path, current, b.head), r.before); assert.equal(beforeApprovedPy101Source(r.path, current + "\n// unknown", b.head), current + "\n// unknown"); }
  const memory = new Map<string, string>(), port = { getItem: (key: string) => memory.get(key) ?? null, setItem: (key: string, value: string) => { memory.set(key, value); } }, store = createProgressStore(() => port);
  for (const scope of b.progressScopes as ProgressScope[]) { store.save(scope, 100, scope.sectionIds[0], true); if (scope.contentVersion > 1) store.save({ ...scope, contentVersion: 1 }, 100, scope.sectionIds[0], true); }
  const before = new Map(memory), scope = lessonProgressScope(lesson); assert.equal(progressKey(scope), "aivora:learning:v2:PY101:PY101-C03-L03:r1"); assert.equal(store.getSnapshot(scope), null);
  store.save(scope, 58, "short-circuit"); const restored = parseReadingProgress(createProgressStore(() => port).getSnapshot(scope), scope); assert.deepEqual([restored?.percent, restored?.section, restored?.completed], [58, "short-circuit", false]);
  for (const [key, value] of before) assert.equal(memory.get(key), value);
  const protection = read("WORKSPACE_PROTECTION"); assert.equal(protection.originalFilesByteIdentical, true); assert.equal(protection.originalModified.length + protection.originalUntracked.length, 11);
});
