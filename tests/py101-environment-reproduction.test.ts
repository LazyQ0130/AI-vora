import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { pythonEnvironmentReproductionLesson as lesson } from "../src/content/lessons/py101/environment-reproduction";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { isReadable } from "../src/content/models";
import { reproductionCode, reproductionCommands, reproductionBlockNames, reproductionNotebook } from "../src/content/resources/python-reproduction";
import { notebookDownload } from "../src/content/resources/python-notebook";
import { environmentProbe } from "../src/content/resources/python-venv";
import { beforeApprovedPy101Object, protectedPy101FileMatches, approvedPy101Additions } from "../scripts/py101-p1-compatibility";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { assertRegisteredInventory, assertCourseAvailability } from "./helpers/registered-content";
const read = (name: string) => JSON.parse(readFileSync(`docs/py101-p5/${name}.json`, "utf8"));

test("P5保护真实基线的全部旧文件/教材，1.5只改最后过渡段且保留r1范围", () => {
  const base = read("BASELINE"), sha = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
  const later = approvedPy101Additions.filter(id => id !== lesson.id && !(id in base.lessons));
  assert.deepEqual([...lessonRegistry.keys()].sort(), [...Object.keys(base.lessons), lesson.id, ...later].sort());
  for (const kind of ["lessons", "publications"] as const) for (const [id, hash] of Object.entries(base[kind])) {
    const value = kind === "lessons" ? lessonRegistry.get(id) : publicationManifest.find(p => p.lessonId === id);
    assert.equal(sha(beforeApprovedPy101Object(kind, id, value, base.head)), hash, id);
  }
  for (const [path, file] of Object.entries(base.files as Record<string, { sha256: string }>)) assert.ok(protectedPy101FileMatches(path, readFileSync(path), file.sha256, base.head), path);
  // 先精确撤销后续批准修订，仍核对P5当时仅改末段的历史事实。
  const current = beforeApprovedPy101Object("lessons", "PY101-C01-L05", lessonRegistry.get("PY101-C01-L05"), JSON.parse(readFileSync("docs/py101-p6/BASELINE.json", "utf8")).head) as typeof lesson, expected = structuredClone(base.amendmentBefore);
  expected.sections.at(-1).blocks[expected.sections.at(-1).blocks.length - 1] = current.sections.at(-1)!.blocks.at(-1);
  assert.deepEqual(current, expected); assert.equal(current.contentVersion, 1); assert.deepEqual(lessonProgressScope(current), lessonProgressScope(base.amendmentBefore));
  assert.equal(protectedPy101FileMatches("src/lib/course-engine.ts", Buffer.concat([readFileSync("src/lib/course-engine.ts"), Buffer.from("\n// unauthorized")]), base.files["src/lib/course-engine.ts"].sha256, base.head), false);
  assertRegisteredInventory(); assertCourseAvailability("PY101");
});

test("1.6注册r1和草稿门禁，首章六槽顺序与相邻导航，整课筹备且错误归属不可读", () => {
  const entry = publicationManifest.find(p => p.lessonId === lesson.id)!;
  assert.deepEqual([entry.title, entry.order, entry.contentVersion], [lesson.title, 6, 1]);
  assert.equal(isReadable({ ...entry, status: "draft", access: "private", technicalEvidence: undefined }), false);
  const gate = read("DRAFT_GATE"); assert.deepEqual([gate.status, gate.access, gate.readable], ["draft", "private", false]);
  const course = getLearningCourse("PY101")!; assert.equal(course.status, "planned"); assert.equal(course.chapters.length, 10);
  assert.deepEqual(course.chapters[0].lessons.map(s => [s.lessonId, s.order]), Array.from({length: 6}, (_, i) => [`PY101-C01-L0${i+1}`, i+1]));
  if (entry.status === "draft") { assert.equal(entry.access, "private"); assert.equal(resolveLesson("PY101", lesson.id), undefined); }
  else { assert.equal(entry.status, "pending-review"); assert.equal(entry.access, "preview"); const historical = beforeApprovedPy101Object("publications", lesson.id, entry) as typeof entry; assert.ok(historical.technicalEvidence?.startsWith("docs/py101-p5/")); assert.equal(entry.reviewEvidence, undefined); assert.equal(getAdjacentLessons(course, "PY101-C01-L05").next?.lessonId, lesson.id); assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "PY101-C01-L05"); const readable = course.chapters.flatMap(c => c.lessons).filter(s => s.href); assert.equal(getAdjacentLessons(course, lesson.id).next?.lessonId, readable[readable.findIndex(s => s.lessonId === lesson.id) + 1]?.lessonId); }
  assert.equal(resolveLesson("ML201", lesson.id), undefined);
  // 第二章是否可读取决于实际清单；P8只接入2.1，不再假定本章永久为空。
  assert.deepEqual(course.chapters[1].lessons.filter(s => s.href).map(s => s.lessonId), publicationManifest.filter(p => p.chapterId === "PY101-C02" && isReadable(p)).map(p => p.lessonId));
});

test("三目标映射两项真实任务，提示分层且不泄露目标命令，保留答案与rubric", () => {
  const tasks = lesson.sections.flatMap(s => s.blocks).filter(b => b.type === "exercise");
  assert.deepEqual(tasks.map(t => t.id), ["reproduce-script-issue", "recover-notebook-record"]);
  assert.deepEqual(lesson.assessmentMap, [{ objective: 1, exerciseIds: [tasks[0].id] }, { objective: 2, exerciseIds: tasks.map(t => t.id) }, { objective: 3, exerciseIds: tasks.map(t => t.id) }]);
  for (const task of tasks) { assert.equal(task.hints.length, 2); assert.ok(task.solution.length >= 4); assert.ok(task.rubric.length >= 3); assert.doesNotMatch(task.hints.join(""), /Scripts\\python|bin\/python|Checked F3|先运行.*赋值.*再运行.*显示/); }
  assert.equal(lesson.learningTime.basis, "editorial-estimate");
});

test("Python核心只复用已教源码，观察工具同源；主例仅修脚本参数", () => {
  const blocks = lesson.sections.flatMap(s => s.blocks).filter(b => b.type === "code");
  assert.deepEqual(blocks.filter(b => b.language === "python").map(b => [b.filename, b.code]).sort(), (Object.keys(reproductionCode) as (keyof typeof reproductionCode)[]).map(k => [reproductionBlockNames[k], reproductionCode[k]]).sort());
  assert.equal(reproductionCode.environmentProbe, environmentProbe);
  for (const key of ["notice", "target", "assign", "show"] as const) assert.doesNotMatch(reproductionCode[key], /\b(import|def|for|while|try|except|if|open)\b/);
  for (const platform of ["windows", "mac"] as const) assert.equal(reproductionCommands.goodPath[platform].replace(platform === "windows" ? ".\\scripts\\notice.py" : "scripts/notice.py", platform === "windows" ? ".\\notice.py" : "notice.py"), reproductionCommands.badPath[platform]);
});

test("P5下载与单元格同源且无运行状态/机器路径，旧下载由基线保护", () => {
  const actual = JSON.parse(readFileSync("public/downloads/review-note.ipynb", "utf8"));
  assert.deepEqual(actual, notebookDownload(reproductionNotebook)); assert.equal(actual.nbformat, 4); assert.equal(actual.nbformat_minor, 5);
  for (const cell of actual.cells) if (cell.cell_type === "code") { assert.equal(cell.execution_count, null); assert.deepEqual(cell.outputs, []); }
  assert.doesNotMatch(JSON.stringify(actual), /C:\\\\Users|token=|kernel-[a-f0-9]+\.json|aivora-p5-/);
  assert.ok(lesson.resources.some(r => r.href === "/downloads/review-note.ipynb"));
});

test("真实Shell和Jupyter证据包含已知故障、恢复、新会话、同源代码与安全结束", () => {
  const cli = read("CLI_RESULTS"), kernel = read("NOTEBOOK_RESULTS");
  assert.equal(cli.allAssertionsPassed, true); assert.equal(new Set(cli.rows.map((r: {shellPid: number}) => r.shellPid)).size, cli.rows.length);
  for (const session of ["initial", "new-shell-replay"]) {
    const row = (suffix: string) => cli.rows.find((r: {label: string}) => r.label === `${session}:${suffix}`);
    assert.notEqual(row("wrong-script-argument").exitCode, 0); assert.match(row("wrong-script-argument").stderr, /can't open file/);
    assert.equal(row("correct-script-argument").stdout.trim(), "Notice N8"); assert.equal(row("correct-script-argument").exitCode, 0);
    assert.equal(row("wrong-script-argument").command, reproductionCommands.badPath.windows);
    for (const phase of ["wrong", "right"]) { assert.equal(row(`${phase}-environment-program`).stdout.trim(), "Target R9"); assert.equal(row(`${phase}-environment-program`).exitCode, 0); assert.match(row(`${phase}-environment-diagnostic`).stdout, phase === "wrong" ? /other\\.venv/ : /target\\.venv/); }
  }
  assert.equal(kernel.kernelShutdown, true);
  const failure = kernel.steps.find((s: {label?: string}) => s.label === "first-display-real-error");
  assert.equal(failure.source, reproductionCode.show); assert.equal(failure.outputs[0].ename, "NameError"); assert.ok(failure.outputs[0].traceback.length > 1);
  assert.equal(kernel.savedNotebook.cells[2].outputs[0].text, "Checked F3\n"); assert.equal(kernel.savedNotebook.cells[1].source, reproductionCode.assign);
  assert.ok(kernel.steps.some((s: {operation?: string}) => s.operation === "reopen-saved-file"));
  assert.doesNotMatch(JSON.stringify([cli,kernel]), /C:\\\\Users\\\\QYF|token=|aivora-p5-[a-f0-9]/);
});

test("1.6新r1进度重载且不写旧五课、第五章修订与其他课程记录", () => {
  const memory = new Map<string,string>(), storage = { getItem: (k: string) => memory.get(k) ?? null, setItem: (k: string,v: string) => {memory.set(k,v);} };
  const store = createProgressStore(() => storage);
  for (const id of ["PY101-C01-L01", "PY101-C01-L02", "PY101-C01-L03", "PY101-C01-L04", "PY101-C01-L05", "PY101-C05-L01", "ML201-C04-L01"]) { const scope = lessonProgressScope(lessonRegistry.get(id)!); store.save(scope,100,scope.sectionIds[0],true); if (scope.contentVersion > 1) store.save({...scope,contentVersion:1},100,scope.sectionIds[0],true); }
  const old = new Map(memory), scope = lessonProgressScope(lesson); assert.equal(progressKey(scope), "aivora:learning:v2:PY101:PY101-C01-L06:r1"); assert.equal(store.getSnapshot(scope), null);
  store.save(scope,46,"minimal-record"); assert.equal(parseReadingProgress(createProgressStore(() => storage).getSnapshot(scope),scope)?.section,"minimal-record");
  for (const [k,v] of old) assert.equal(memory.get(k),v);
});
