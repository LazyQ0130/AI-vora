import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { selfSupervisedLesson as lesson } from "../src/content/lessons/ai000/self-supervised-learning";
import { maskingParts, maskingExample, continuationExample } from "../src/content/lessons/ai000/self-supervised-example";
import { activityRecords, borrowingRecords, borrowingObservations } from "../src/content/lessons/ai000/borrowing-example";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import type { Lesson, Publication } from "../src/content/models";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { createProgressStore, progressKey, parseReadingProgress } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { assertStatusOnly31, assertExerciseRevision32, assertPublicationRefinement } from "../scripts/ai000-refinement-compatibility";
import { assertStudyTimeChanges } from "../scripts/ai000-study-time-compatibility";

const before=JSON.parse(readFileSync("docs/ai000-3-3/BEFORE.json","utf8")) as {lessons:Lesson[];publications:Publication[];protectedFiles:{path:string;hash:string}[];data:{borrowingRecords:unknown;borrowingObservations:unknown}};
const blocks=lesson.sections.flatMap(s=>s.blocks);

test("自监督内容：目标逐字取自原文，遮盖输入不含答案，后续片段能复原原记录",()=>{
 assert.equal(maskingExample.original,"星期五下午，读书会在图书馆举行。");
 assert.equal(maskingExample.input,"星期五下午，读书会在____举行。");
 assert.equal(maskingExample.target,maskingParts.hidden);
 assert.equal(maskingParts.before+maskingExample.target+maskingParts.after,maskingExample.original);
 assert.equal(maskingExample.input.includes(maskingExample.target),false);
 assert.notEqual(maskingExample.prediction,maskingExample.target);
 assert.equal(continuationExample.input+continuationExample.target,continuationExample.original);
 const exercises=blocks.filter(b=>b.type==="exercise");
 assert.equal(exercises.length,2);
 for(const ex of exercises) {
  assert.equal(ex.hints.length,2);assert.ok(ex.solution.some(s=>s.includes("常见错误")));
  const html=renderToStaticMarkup(createElement(ContentRenderer,{block:ex,resources:[]}));
  assert.equal((html.match(/<details/g)??[]).length,3);assert.doesNotMatch(html,/<details[^>]*\sopen/);
 }
 // 独立复算两个新句的构造关系，不从正文主例取答案。
 for(const [original,input,target] of [
  ["周一午后，志愿者在体育馆清点器材。","周一午后，志愿者在体育馆____器材。","清点"],
  ["闭馆后，工作人员把桌椅摆整齐。","闭馆后，工作人员把桌椅____。","摆整齐"],
 ]) assert.equal(input.replace("____",target),original);
});

test("自监督内容：图区分两阶段，预测区域的实际输入不泄露目标，来源文字可访问",()=>{
 const figure=blocks.find(b=>b.type==="ai-task-figure")!;
 const html=renderToStaticMarkup(createElement(ContentRenderer,{block:figure,resources:[]}));
 assert.match(html,/<figure[^>]*aria-labelledby="[^"]+"[^>]*aria-describedby="[^"]+"/);
 assert.equal(figure.type,"ai-task-figure");
 if(figure.type==="ai-task-figure") assert.ok(html.includes(figure.alt)&&html.includes(figure.caption));
 assert.match(html,/aria-label="从原始数据构造任务"/);
 assert.match(html,/aria-label="模型预测与原文目标比较"/);
 const input=html.match(/<div class="ai-self-input">(.*?)<\/div>/)![1];
 assert.ok(input.includes(maskingExample.input));assert.equal(input.includes(maskingExample.target),false);
 assert.match(html,/假设的模型预测/);assert.match(html,/本次没有还原原词/);
});

test("3.3注册独立r1与核心目标入口，3.2/3.4相邻可读，4.3仍无教材",()=>{
 assert.equal(lessonRegistry.get(lesson.id),lesson);assert.equal(lesson.contentVersion,1);
 const pub=resolveLesson("AI000",lesson.id)!.publication;
 assert.equal(pub.status,"pending-review");assert.equal(pub.access,"preview");assert.equal(pub.reviewEvidence,undefined);
 assert.deepEqual(lessonExerciseLinks(lesson).map(e=>[e.id,e.tier,e.objectives]),[["design-self-task","core",[1,2]],["compare-learning-tasks","core",[1,2,3]]]);
 const course=getLearningCourse("AI000")!;
 assert.equal(getAdjacentLessons(course,"AI000-C03-L02").next?.lessonId,lesson.id);
 assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C03-L02");
 assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,"AI000-C03-L04");
 assert.equal(resolveLesson("AI000","AI000-C04-L03"),undefined);assert.equal(lessonRegistry.has("AI000-C04-L03"),false);
 assert.ok(blocks.every(b=>!["code","math","experiment","downloads"].includes(b.type)));
});

test("精确兼容：3.1仅状态句、3.2仅首题/版本/状态句，其他28节及所有旧锚点保留",()=>{
 for(const old of before.lessons) {
  const after=lessonRegistry.get(old.id)!;
  if(old.id==="AI000-C03-L01") assertStatusOnly31(old,after);
  else if(old.id==="AI000-C03-L02") assertExerciseRevision32(old,after);
  else assert.deepEqual(JSON.parse(JSON.stringify(after)),old,old.id);
  assert.deepEqual(after.sections.map(s=>s.id),old.sections.map(s=>s.id));
  assert.deepEqual(after.sections.flatMap(s=>s.blocks).filter(b=>b.type==="exercise").map(b=>b.id),old.sections.flatMap(s=>s.blocks).filter(b=>b.type==="exercise").map(b=>b.id));
 }
 for(const old of before.publications) assertPublicationRefinement(old,publicationManifest.find(p=>p.lessonId===old.lessonId)!);
 for(const file of before.protectedFiles) {
  if(file.path==="src/content/ai000-study-time.ts") assertStudyTimeChanges(file.hash);
  else assert.equal(createHash("sha256").update(readFileSync(file.path)).digest("hex"),file.hash,file.path);
 }
 assert.deepEqual(borrowingRecords,before.data.borrowingRecords);assert.deepEqual(borrowingObservations,before.data.borrowingObservations);
});

test("3.2新题独立核算：同量不同构成、均衡高量、单次记录，不能复用旧零记录答案",()=>{
 assert.deepEqual(activityRecords.map(r=>[r.id,r.sport,r.art]),[["P",5,1],["Q",3,2],["R",1,4],["S",0,2],["T",4,4],["U",1,0]]);
 assert.deepEqual(activityRecords.map(r=>r.sport+r.art),[6,5,5,2,8,1]);
 assert.deepEqual(activityRecords.filter(r=>r.sport>r.art).map(r=>r.id),["P","Q","U"]);
 assert.deepEqual(activityRecords.filter(r=>r.art>r.sport).map(r=>r.id),["R","S"]);
 assert.deepEqual(activityRecords.filter(r=>r.sport+r.art===5).map(r=>r.id),["Q","R"]);
 assert.equal(activityRecords.some(r=>r.sport+r.art===0),false);
 assert.deepEqual([activityRecords.filter(r=>r.sport+r.art<=2).map(r=>r.id),activityRecords.filter(r=>r.sport+r.art>=3&&r.sport+r.art<=6).map(r=>r.id),activityRecords.filter(r=>r.sport+r.art>=7).map(r=>r.id)],[["S","U"],["P","Q","R"],["T"]]);
});

test("真实存储适配器保留所有旧键：3.1r1完成仍有效，3.2r1不继承r2，3.3独立",()=>{
 const memory=new Map<string,string>();const port={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}};
 const store=createProgressStore(()=>port);
 before.lessons.forEach(l=>store.save(lessonProgressScope(l),100,l.sections[0].id,true));
 const previous=new Map(memory);
 const scope31=lessonProgressScope(lessonRegistry.get("AI000-C03-L01")!);
 const scope32=lessonProgressScope(lessonRegistry.get("AI000-C03-L02")!);
 const scope33=lessonProgressScope(lesson);
 assert.equal(parseReadingProgress(store.getSnapshot(scope31),scope31)?.completed,true);
 assert.equal(progressKey(scope32),"aivora:learning:v2:AI000:AI000-C03-L02:r2");
 assert.equal(store.getSnapshot(scope32),null);assert.equal(store.getSnapshot(scope33),null);
 store.save(scope32,60,"practice");store.save(scope33,55,"four-roles");
 const restored=createProgressStore(()=>port);
 assert.equal(parseReadingProgress(restored.getSnapshot(scope32),scope32)?.completed,false);
 assert.equal(parseReadingProgress(restored.getSnapshot(scope33),scope33)?.section,"four-roles");
 assert.equal(parseReadingProgress(restored.getSnapshot(scope33),scope33)?.completed,false);
 for(const [k,v] of previous) assert.equal(memory.get(k),v,k);
});
