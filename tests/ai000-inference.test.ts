import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Lesson } from "../src/content/models";
import { usingFixedModelLesson as lesson } from "../src/content/lessons/ai000/using-a-fixed-model";
import { fixedParcelModel, newInferenceParcel, inferencePrediction, laterParcelLog, printInferenceModel, newPrintInference, laterPrintLog, libraryInferenceModel, inferenceAuditCases } from "../src/content/lessons/ai000/fixed-model-example";
import { durationEstimate } from "../src/content/lessons/ai000/model-parameter-example";
import { newParcelTimeRecord } from "../src/content/lessons/ai000/parcel-time-example";
import { lessonRegistry } from "../src/lib/course-engine";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { createProgressStore, parseReadingProgress } from "../src/lib/learning-progress";
import { visualComparableJson } from "../scripts/ai000-illustration-compatibility";

const blocks=lesson.sections.flatMap(s=>s.blocks);
const minutes=(time:string)=>{const [h,m]=time.split(":").map(Number);return h*60+m;};
test("固定模型另轮重算N：4+2+2+2=10，后来实际12，G仍未知且假设12未挪用",()=>{
  assert.deepEqual(fixedParcelModel,{baseMinutes:4,minutesPerItem:2});assert.equal(newInferenceParcel.waiting,3);assert.equal(newInferenceParcel.actualMinutes,null);
  const repeated=fixedParcelModel.baseMinutes+Array.from({length:newInferenceParcel.waiting},()=>fixedParcelModel.minutesPerItem).reduce((a,b)=>a+b,0);
  assert.equal(repeated,10);assert.equal(inferencePrediction,repeated);
  const actual=minutes(laterParcelLog.finished)-minutes(laterParcelLog.arrived);assert.equal(actual,12);assert.equal(actual-inferencePrediction,2);
  assert.equal(newParcelTimeRecord.actualMinutes,null);assert.equal(newParcelTimeRecord.hypotheticalPredictionMinutes,12);
  assert.deepEqual([0,1,3].map(n=>durationEstimate(fixedParcelModel,n)),[4,6,10]);
});
test("HTML推理图：当前3件、固定4/2、预测10与实际未知分开，后续核查无目标回流",()=>{
  const figure=blocks.find(b=>b.type==="ai-task-figure")!;
  const html=renderToStaticMarkup(createElement(ContentRenderer,{block:figure,resources:[]}));
  assert.match(html,/<figure[^>]*aria-labelledby="[^"]+"[^>]*aria-describedby="[^"]+"/);
  if(figure.type==="ai-task-figure")assert.ok(html.includes(figure.alt)&&html.includes(figure.caption));
  assert.match(html,/4 \+ 2 × 3 = 10分钟/);assert.match(html,/预测：10分钟/);assert.match(html,/实际：仍未知/);assert.doesNotMatch(html,/实际：12分钟/);
  assert.ok(html.indexOf("当前输入")<html.indexOf("沿用固定模型")&&html.indexOf("沿用固定模型")<html.indexOf("分别保存"));
});
test("打印新题独立核算14、实绩16差2，流程顺序允许准备动作合理变化",()=>{
  assert.equal(newPrintInference.copies,4);assert.equal(newPrintInference.actualMinutes,null);
  assert.equal(2+3+3+3+3,14);assert.equal(durationEstimate(printInferenceModel,newPrintInference.copies),14);
  assert.equal(minutes(laterPrintLog.completed)-minutes(laterPrintLog.received),16);
  const ex=blocks.filter(b=>b.type==="exercise").find(b=>b.id==="use-print-model")!;
  assert.ok(ex.solution.some(s=>s.includes("D→B→C→A→E")&&s.includes("交替核实")));assert.ok(ex.solution.some(s=>s.includes("预测少估2")));
});
test("图书五种输入问题有不同处理：正常7、未知、时间非数量、事后目标、条件变化",()=>{
  assert.deepEqual(inferenceAuditCases.map(r=>r.id),["J","K","L","M","R"]);assert.equal(durationEstimate(libraryInferenceModel,3),7);
  const ex=blocks.filter(b=>b.type==="exercise").find(b=>b.id==="audit-current-inputs")!;
  for(const id of ["J","K","L","M","R"])assert.ok(ex.solution.some(s=>s.startsWith(id+"：")||s.startsWith(id+"与")));
  assert.ok(ex.solution.some(s=>s.includes("5分钟，仍不是5册")));assert.ok(ex.solution.some(s=>s.includes("50册，不是数量空缺")));
});
test("三正式目标映射两道核心开放题、两级提示与默认关闭反馈，无隐藏代码先修",()=>{
  assert.deepEqual(lessonExerciseLinks(lesson).map(e=>[e.id,e.tier,e.objectives]),[["use-print-model","core",[1,2]],["audit-current-inputs","core",[3]]]);
  for(const ex of blocks.filter(b=>b.type==="exercise")){
    assert.equal(ex.hints.length,2);assert.ok(ex.solution.some(s=>s.includes("常见错误")));assert.ok(ex.solution.some(s=>s.includes("接受")));assert.equal(ex.rubric.length,4);
    const html=renderToStaticMarkup(createElement(ContentRenderer,{block:ex,resources:[]}));assert.equal((html.match(/<details/g)??[]).length,3);assert.doesNotMatch(html,/<details[^>]*\sopen/);
  }
  assert.ok(blocks.every(b=>!["code","math","experiment","downloads"].includes(b.type)));assert.ok(lesson.sections.every(s=>s.tier==="core"&&!/^\d/.test(s.title)));
});
test("旧35节只增加登记情境图，原目标、所有区块、锚点、题/答案和版本完全保留",()=>{
  const before=JSON.parse(readFileSync("docs/ai000-4-4/BEFORE.json","utf8")) as {lessons:Lesson[]};
  for(const old of before.lessons)assert.equal(visualComparableJson(lessonRegistry.get(old.id)),JSON.stringify(old),old.id);
});
test("真实进度适配器：旧35节及3.2r1不改，新4.4无继承、保存/完成可独立恢复",()=>{
  const oldLessons=(JSON.parse(readFileSync("docs/ai000-4-4/BEFORE.json","utf8")) as {lessons:Lesson[]}).lessons;
  const memory=new Map<string,string>(),port={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}},store=createProgressStore(()=>port);
  for(const old of oldLessons)store.save(lessonProgressScope(old),100,old.sections.at(-1)!.id,true);
  const old32=JSON.parse(readFileSync("docs/ai000-3-3/BEFORE.json","utf8")).lessons.find((l:Lesson)=>l.id==="AI000-C03-L02") as Lesson;
  store.save(lessonProgressScope(old32),100,"takeaways",true);const oldKeys=new Map(memory),scope=lessonProgressScope(lesson);assert.equal(store.getSnapshot(scope),null);
  store.save(scope,60,"inference-flow");const restored=createProgressStore(()=>port);assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.completed,false);assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.section,"inference-flow");
  restored.save(scope,100,"takeaways",true);assert.equal(parseReadingProgress(createProgressStore(()=>port).getSnapshot(scope),scope)?.completed,true);
  for(const [k,v] of oldKeys)assert.equal(memory.get(k),v,k);
});
