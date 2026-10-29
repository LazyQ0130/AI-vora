import { visualComparableJson, assertIllustrationPublication, assertIllustrationCompatibleFile } from "../scripts/ai000-illustration-compatibility";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Lesson, Publication } from "../src/content/models";
import { trainingValidationTestLesson as lesson } from "../src/content/lessons/ai000/training-validation-test";
import { evaluationParcels, evaluationCandidates, recordsForRole, parcelValidationTotals, selectedParcelCandidate, comparisonRows, gapTotal, evaluationPrintRecords, evaluationPrintCandidates, evaluationAuditCases } from "../src/content/lessons/ai000/data-use-example";
import { durationEstimate } from "../src/content/lessons/ai000/model-parameter-example";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";

const before = JSON.parse(readFileSync("docs/ai000-4-3/BEFORE.json", "utf8")) as { lessons: Lesson[]; publications: Publication[]; protectedFiles: { path: string; hash: string }[] };
const blocks = lesson.sections.flatMap(s => s.blocks);
// 另用逐件累加及独立预期数组核算，不从中文参考答案取得预期。
const sumEstimate = (base: number, per: number, count: number) => { let result = base; for (let i = 0; i < count; i++) result += per; return result; };

test("三批用途事先分开，完整记录表先于用途表，旧A–G未混入新情境", () => {
  assert.deepEqual(evaluationParcels.map(r => [r.id, r.count, r.actualMinutes]), [["T1",0,4],["T2",1,6],["T3",2,8],["T4",3,10],["V1",1,7],["V2",2,9],["S1",0,5],["S2",3,13]]);
  assert.deepEqual(["training", "validation", "test"].map(role => evaluationParcels.filter(r => r.role === role).map(r => r.id)), [["T1","T2","T3","T4"],["V1","V2"],["S1","S2"]]);
  assert.equal(new Set(evaluationParcels.map(r => r.id)).size, 8);
  assert.ok(lesson.sections.findIndex(s => s.id === "new-history") < lesson.sections.findIndex(s => s.id === "assign-roles"));
  const table = lesson.sections.find(s => s.id === "new-history")!.blocks.find(b => b.type === "table")!;
  assert.equal(table.rows.length, 8); assert.equal(table.columns.length, 3);
});

test("主例全部预测/差距另轮核算，验证2/1选乙，固定乙的测试为3/12差2/1", () => {
  const predictions = evaluationCandidates.map(c => evaluationParcels.map(r => sumEstimate(c.baseMinutes, c.minutesPerItem, r.count)));
  assert.deepEqual(predictions, [[4,6,8,10,6,8,4,10],[3,6,9,12,6,9,3,12]]);
  const gaps = predictions.map(values => values.map((v, i) => Math.max(v, evaluationParcels[i].actualMinutes) - Math.min(v, evaluationParcels[i].actualMinutes)));
  assert.deepEqual(gaps, [[0,0,0,0,1,1,1,3],[1,0,1,2,1,0,2,1]]);
  for (const c of evaluationCandidates) for (const r of evaluationParcels) assert.equal(durationEstimate(c, r.count), sumEstimate(c.baseMinutes, c.minutesPerItem, r.count));
  assert.deepEqual(parcelValidationTotals, [2,1]); assert.equal(selectedParcelCandidate.name, "乙");
  assert.equal(gapTotal(selectedParcelCandidate, recordsForRole(evaluationParcels,"test")), 3);
  assert.deepEqual(comparisonRows(recordsForRole(evaluationParcels,"validation"), evaluationCandidates), [["V1","1","7","6 / 1","6 / 1"],["V2","2","9","8 / 1","9 / 0"]]);
  assert.deepEqual(comparisonRows(recordsForRole(evaluationParcels,"test"), [selectedParcelCandidate]), [["S1","0","5","3 / 2"],["S2","3","13","12 / 1"]]);
  const tables = blocks.filter(b => b.type === "table");
  assert.deepEqual(tables.find(t => t.caption.startsWith("只在V1"))!.rows, comparisonRows(recordsForRole(evaluationParcels,"validation"), evaluationCandidates));
  assert.deepEqual(tables.find(t => t.caption.startsWith("对已选定"))!.rows, comparisonRows(recordsForRole(evaluationParcels,"test"), [selectedParcelCandidate]));
});

test("改变保留测试的目标不改变验证选择；图中只有确定乙后才检查测试，无测试候选排名", () => {
  const modified = evaluationParcels.map(r => ({ ...r, actualMinutes: r.role === "test" ? 1000 : r.actualMinutes }));
  assert.deepEqual(evaluationCandidates.map(c => gapTotal(c, recordsForRole(modified,"validation"))), [2,1]);
  const figure = blocks.find(b => b.type === "ai-task-figure")!;
  const html = renderToStaticMarkup(createElement(ContentRenderer, { block: figure, resources: [] }));
  assert.match(html, /<figure[^>]*aria-labelledby="[^"]+"[^>]*aria-describedby="[^"]+"/);
  if (figure.type === "ai-task-figure") assert.ok(html.includes(figure.alt) && html.includes(figure.caption));
  const starts = ["training","validation","test"].map(stage => html.indexOf(`data-stage="${stage}"`));
  assert.ok(starts[0] < starts[1] && starts[1] < starts[2]);
  assert.match(html, /甲2分钟，乙1分钟/); assert.match(html, /S1：预测3，实际5，差2分钟/); assert.match(html, /S2：预测12，实际13，差1分钟/);
  const testPart = html.slice(starts[2], html.indexOf("</ol>", starts[2]));
  assert.doesNotMatch(testPart, /甲2分钟|甲：预测|候选参数/);
  assert.match(testPart, /直到乙确定后/); assert.match(testPart, /不返回前面挑选/);
  assert.doesNotMatch(html, /训练所得|训练后的候选参数|原创构造|未运行模型/);
});

test("新打印题验证丙7/11丁7/9，合计1/3；训练/验证/测试用途与反馈一致", () => {
  assert.deepEqual(evaluationPrintRecords.map(r => [r.id,r.count,r.actualMinutes,r.role]), [["P1",1,5,"training"],["P2",3,9,"training"],["P3",2,8,"validation"],["P4",4,11,"validation"],["P5",1,6,"test"],["P6",5,15,"test"]]);
  const validation = recordsForRole(evaluationPrintRecords,"validation");
  assert.deepEqual(evaluationPrintCandidates.map(c => validation.map(r => sumEstimate(c.baseMinutes,c.minutesPerItem,r.count))), [[7,11],[7,9]]);
  assert.deepEqual(evaluationPrintCandidates.map(c => gapTotal(c,validation)), [1,3]);
  const testRecords = recordsForRole(evaluationPrintRecords,"test");
  assert.deepEqual(testRecords.map(r => durationEstimate(evaluationPrintCandidates[0],r.count)), [5,13]);
  const exercise = blocks.filter(b => b.type === "exercise").find(e => e.id === "plan-print-evaluation")!;
  assert.ok(exercise.solution.some(s => s.includes("丙合计1+0=1，丁合计1+2=3")));
  assert.ok(exercise.solution.some(s => s.includes("P5–P6在前面一直保留")));
  assert.ok(exercise.solution.some(s => s.includes("接受") && s.includes("不能替代本题")));
});

test("查错题覆盖事后输入、训练效果、重复事件、测试反馈；合理验证选择有条件接受", () => {
  assert.equal(evaluationAuditCases.length,3);
  const exercise = blocks.filter(b => b.type === "exercise").find(e => e.id === "audit-evaluation-flow")!;
  for (const marker of ["甲：", "乙：", "丙："]) assert.ok(exercise.solution.some(s => s.startsWith(marker)));
  assert.ok(exercise.solution.some(s => s.includes("两处都要修")));
  assert.ok(exercise.solution.some(s => s.includes("不能仅因验证参与选择就判错")));
  assert.ok(exercise.solution.some(s => s.includes("只去掉B9还没有解决")));
  assert.ok(exercise.solution.some(s => s.includes("旧测试仍可用于查错")));
});

test("三目标由两道独立核心题检验，真实锚点/两级提示/答案默认折叠，不增加代码先修", () => {
  assert.deepEqual(lessonExerciseLinks(lesson).map(e => [e.id,e.tier,e.objectives]), [["plan-print-evaluation","core",[1,2,3]],["audit-evaluation-flow","core",[2,3]]]);
  for (const ex of blocks.filter(b => b.type === "exercise")) {
    assert.equal(ex.hints.length,2); assert.ok(ex.solution.some(s => s.includes("常见错误"))); assert.ok(ex.solution.some(s => s.includes("接受"))); assert.equal(ex.rubric.length,4);
    const html = renderToStaticMarkup(createElement(ContentRenderer,{block:ex,resources:[]}));
    assert.match(html,new RegExp(`id="exercise-${ex.id}"`)); assert.equal((html.match(/<details/g)??[]).length,3); assert.doesNotMatch(html,/<details[^>]*\sopen/);
  }
  assert.equal(lesson.objectives.length,3); assert.equal(lesson.objectiveDisplay?.length,3);
  assert.ok(lesson.sections.every(s => s.tier === "core" && !/^\d/.test(s.title)));
  assert.ok(blocks.every(b => !["code","math","experiment","downloads"].includes(b.type)));
});

test("全部34节旧教材（反向移除登记插画后）/清单及原有图/通用组件/课程事实逐字节不变", () => {
  for (const old of before.lessons) assert.equal(visualComparableJson(lessonRegistry.get(old.id)),JSON.stringify(old),old.id);
  for (const old of before.publications) assertIllustrationPublication(old,publicationManifest.find(p => p.lessonId === old.lessonId)!);
  for (const file of before.protectedFiles) assertIllustrationCompatibleFile(file.path, file.hash);
});

test("发布门禁与4.2→4.3连续导航，4.4相邻可读，7.3仍无正文", () => {
  assert.equal(lessonRegistry.get(lesson.id),lesson); assert.equal(lesson.contentVersion,1);
  const entry = publicationManifest.find(p => p.lessonId === lesson.id)!;
  assert.equal(entry.reviewEvidence,undefined);
  const final = entry.status === "pending-review";
  assert.equal(entry.access,final ? "preview" : "private"); assert.equal(Boolean(resolveLesson("AI000",lesson.id)),final);
  const course = getLearningCourse("AI000")!;
  if (final) { assert.equal(getAdjacentLessons(course,"AI000-C04-L02").next?.lessonId,lesson.id); assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C04-L02"); assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,"AI000-C04-L04"); }
  for (const slot of course.chapters.flatMap(c => c.lessons).filter(l => l.lessonId > "AI000-C07-L02")) { assert.equal(slot.href,undefined); assert.equal(lessonRegistry.has(slot.lessonId),false); }
  assert.equal(resolveLesson("PY101",lesson.id),undefined);
});

test("真实进度适配器：新课初始空、刷新独立恢复；所有旧完成键及3.2r1/r2不变", () => {
  const memory = new Map<string,string>(), port = { getItem:(k:string)=>memory.get(k)??null, setItem:(k:string,v:string)=>{memory.set(k,v);} };
  const store = createProgressStore(()=>port);
  for (const old of before.lessons) store.save(lessonProgressScope(old),100,old.sections.at(-1)!.id,true);
  const old32 = JSON.parse(readFileSync("docs/ai000-3-3/BEFORE.json","utf8")).lessons.find((l:Lesson)=>l.id==="AI000-C03-L02") as Lesson;
  store.save(lessonProgressScope(old32),100,"takeaways",true);
  const oldKeys = new Map(memory), scope = lessonProgressScope(lesson);
  assert.equal(progressKey(scope),"aivora:learning:v2:AI000:AI000-C04-L03:r1"); assert.equal(store.getSnapshot(scope),null);
  store.save(scope,65,"validation-choice");
  const restored = createProgressStore(()=>port), value = parseReadingProgress(restored.getSnapshot(scope),scope)!;
  assert.equal(value.completed,false); assert.equal(value.section,"validation-choice");
  restored.save(scope,100,"takeaways",true);
  assert.equal(parseReadingProgress(createProgressStore(()=>port).getSnapshot(scope),scope)?.completed,true);
  for (const [key,value] of oldKeys) assert.equal(memory.get(key),value,key);
});
