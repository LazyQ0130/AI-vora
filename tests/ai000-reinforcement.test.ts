import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Lesson, Publication } from "../src/content/models";
import { reinforcementLearningLesson as lesson } from "../src/content/lessons/ai000/reinforcement-learning";
import { deliveryRoutes, deliveryRewards, wateringRecords, signedReward, routeTotal } from "../src/content/lessons/ai000/delivery-example";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { assertStudyTime41Only } from "../scripts/ai000-study-time-compatibility";

const before=JSON.parse(readFileSync("docs/ai000-3-4/BEFORE.json","utf8")) as {lessons:Lesson[];publications:Publication[];protectedFiles:{path:string;hash:string}[]};
const blocks=lesson.sections.flatMap(s=>s.blocks);
test("强化内容：从规则独立重算送物两路；即时3>0与累计7<10方向不同",()=>{
 assert.deepEqual(deliveryRewards,{checkpoint:3,detour:-6,delivered:10,ordinary:0});
 assert.deepEqual(deliveryRoutes.map(r=>r.steps.map(s=>s.reward)),[[3,-6,10],[0,0,10]]);
 assert.deepEqual(deliveryRoutes.map(routeTotal),[7,10]);
 const table=blocks.find(b=>b.type==="table"&&b.caption.includes("岔口开始"))!;
 assert.equal(table.type,"table");if(table.type==="table") assert.deepEqual(table.rows.map(row=>row.at(-1)),["7","10"]);
 for(const route of deliveryRoutes) {
  assert.equal(route.steps.length,3);
  for(const step of route.steps) assert.ok(step.available.some(a=>step.action.startsWith(a)),step.action);
  assert.ok(route.steps.at(-1)!.after.includes("结束"));
 }
});
test("强化内容：图中的每步观察/实际行动/变化/环境反馈对应原记录，明确示意非训练",()=>{
 const block=blocks.find(b=>b.type==="ai-task-figure")!;
 assert.equal(block.type,"ai-task-figure");
 const html=renderToStaticMarkup(createElement(ContentRenderer,{block,resources:[]}));
 assert.match(html,/<figure[^>]*aria-labelledby="[^"]+"[^>]*aria-describedby="[^"]+"/);
 assert.match(html,/<ol class="ai-rl-trace">/);assert.match(html,/没有运行机器人，也没有训练出策略/);
 if(block.type==="ai-task-figure") assert.ok(html.includes(block.alt)&&html.includes(block.caption));
 assert.equal((html.match(/class="ai-rl-before"/g)??[]).length,3);
 assert.deepEqual([...html.matchAll(/class="ai-rl-reward">环境奖励 <b>(.*?)分<\/b>/g)].map(m=>m[1]),["+3","−6","+10"]);
 for(const s of deliveryRoutes[0].steps) for(const value of [s.before,s.action,s.after,s.nextChoice]) assert.ok(html.includes(value),value);
});
test("强化内容：浇水逐步状态独立执行，四步与三步奖励及答案一致",()=>{
 for(const record of wateringRecords) {
  let water=1;const done=new Set<string>();let total=0;
  for(const step of record.steps) {
   let reward=0;
   if(step.action==="把水箱补满") water=2;
   else {
    const bed=step.action.includes("A")?"A":"B";
    if(water===0) reward=-5;
    else {water--;done.add(bed);reward=done.size===1?2:9;}
   }
   assert.equal(step.reward,reward,step.action);
   assert.ok(step.after.includes(`剩${water}单位`)||step.after.includes(`变为${water}单位`)||(water===0&&step.after.includes("无水")));
   total+=reward;
  }
  assert.equal(done.size,2);assert.equal(total,record.id==="先浇再补"?6:11);
 }
 assert.deepEqual(wateringRecords.map(r=>r.steps.length),[4,3]);
 const tables=blocks.filter(b=>b.type==="table").filter(b=>b.caption.startsWith("过程："));
 assert.deepEqual(tables.map(t=>t.rows.map(row=>row.at(-1))),[["+2","−5","0","+9"],["0","+2","+9"]]);
 const ex=blocks.find(b=>b.type==="exercise"&&b.id==="trace-watering")!;
 assert.equal(ex.type,"exercise");if(ex.type==="exercise") {assert.ok(ex.solution.some(s=>s.includes("2−5+0+9=6")&&s.includes("0+2+9=11")));assert.ok(ex.solution.some(s=>s.includes("没有逐步告诉")));}
 assert.equal(signedReward(-6),"−6");assert.equal(signedReward(0),"0");
});
test("3.4注册r1、三目标映射两道核心题，3.3/4.1相邻可读，4.2以后无虚假入口",()=>{
 assert.equal(lessonRegistry.get(lesson.id),lesson);assert.equal(lesson.contentVersion,1);
 assert.equal(resolveLesson("AI000",lesson.id)?.publication.status,"pending-review");
 assert.equal(resolveLesson("AI000",lesson.id)?.publication.reviewEvidence,undefined);
 const course=getLearningCourse("AI000")!;
 assert.equal(getAdjacentLessons(course,"AI000-C03-L03").next?.lessonId,lesson.id);
 assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C03-L03");
 assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,"AI000-C04-L01");
 for(const slot of course.chapters[3].lessons.slice(1)) {assert.equal(slot.href,undefined);assert.equal(resolveLesson("AI000",slot.lessonId),undefined);assert.equal(lessonRegistry.has(slot.lessonId),false);}
 assert.deepEqual(lessonExerciseLinks(lesson).map(e=>[e.id,e.tier,e.objectives]),[["trace-watering","core",[1,2]],["assess-feedback","core",[1,3]]]);
 for(const ex of blocks.filter(b=>b.type==="exercise")) {
  assert.equal(ex.hints.length,2);assert.ok(ex.solution.some(s=>s.includes("常见错误")));
  const html=renderToStaticMarkup(createElement(ContentRenderer,{block:ex,resources:[]}));
  assert.equal((html.match(/<details/g)??[]).length,3);assert.doesNotMatch(html,/<details[^>]*\sopen/);
 }
 assert.ok(blocks.every(b=>!["code","math","experiment","downloads"].includes(b.type)));
});
test("全部31节旧注册全文、清单及受保护文件不变，包括3.1r1/3.2r2/3.3r1",()=>{
 const hash=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
 for(const old of before.lessons) assert.equal(hash(lessonRegistry.get(old.id)),hash(old),old.id);
 for(const old of before.publications) assert.deepEqual(publicationManifest.find(p=>p.lessonId===old.lessonId),old,old.lessonId);
 for(const f of before.protectedFiles) {
  if(f.path==="src/content/ai000-study-time.ts") assertStudyTime41Only(f.hash);
  else assert.equal(createHash("sha256").update(readFileSync(f.path)).digest("hex"),f.hash,f.path);
 }
});
test("真实存储适配器：3.4不继承旧课完成，保存不改3.2r1/r2和其他旧记录",()=>{
 const memory=new Map<string,string>();const port={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}};
 const store=createProgressStore(()=>port);
 for(const old of before.lessons) store.save(lessonProgressScope(old),100,old.sections[0].id,true);
 const old32=JSON.parse(readFileSync("docs/ai000-3-3/BEFORE.json","utf8")).lessons.find((l:Lesson)=>l.id==="AI000-C03-L02") as Lesson;
 assert.equal(old32.contentVersion,1);store.save(lessonProgressScope(old32),100,"takeaways",true);
 const oldKeys=new Map(memory),scope=lessonProgressScope(lesson);
 assert.equal(store.getSnapshot(scope),null);store.save(scope,60,"compare-routes");
 const restored=createProgressStore(()=>port);
 assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.completed,false);
 assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.section,"compare-routes");
 restored.save(scope,100,"takeaways",true);
 assert.equal(progressKey(scope),"aivora:learning:v2:AI000:AI000-C03-L04:r1");
 assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.completed,true);
 for(const [k,v] of oldKeys) assert.equal(memory.get(k),v,k);
});
