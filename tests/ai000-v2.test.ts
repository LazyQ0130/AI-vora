import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { lessonRegistry, resolveLesson, getAdjacentLessons, getLearningCourse } from "../src/lib/course-engine";
import { lessonSchema, type Lesson } from "../src/content/models";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { createProgressStore, parseReadingProgress } from "../src/lib/learning-progress";
import { LegacyAnchors } from "../src/components/lesson/legacy-anchors";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { keywordMailDecision, mailExamples } from "../src/content/lessons/ai000/mail-example";

const before=JSON.parse(readFileSync(new URL("../docs/ai000-v2/BEFORE.json",import.meta.url),"utf8")) as {lessons:Lesson[];curriculum:{path:string;digest:string}[]};
const ids=["AI000-C01-L01","AI000-C01-L02","AI000-C01-L03","AI000-C02-L01","AI000-C02-L02","AI000-C03-L01","AI000-C03-L02","AI000-C03-L03","AI000-C03-L04","AI000-C04-L01"];
const hash=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");

test("24节规划对应七章原事实，十节可读且连续导航，未制作课不伪造正文",()=>{
 const course=getLearningCourse("AI000")!;
 assert.equal(course.status,"planned");
 assert.equal(course.hours,"6–10");
 assert.deepEqual(course.chapters.map(c=>c.lessons.length),[3,2,4,4,5,3,3]);
 assert.deepEqual(course.chapters.flatMap(c=>c.lessons).filter(l=>l.href).map(l=>l.lessonId),ids);
 ids.forEach((id,i)=>{
  const resolved=resolveLesson("AI000",id)!;
  assert.equal(resolved.publication.status,"pending-review");
  assert.equal(resolved.publication.reviewEvidence,undefined);
  const adjacent=getAdjacentLessons(course,id);
  assert.equal(adjacent.previous?.lessonId,ids[i-1]);
  assert.equal(adjacent.next?.lessonId,ids[i+1]);
 });
 for(const slot of course.chapters.flatMap(c=>c.lessons).filter(l=>!l.href)) {
  assert.equal(slot.status,"planned");
  assert.equal(resolveLesson("AI000",slot.lessonId),undefined);
  assert.equal(lessonRegistry.has(slot.lessonId),false);
 }
});

test("23节其他教材注册全文与原课程体系逐字节摘要不变",()=>{
 for(const old of before.lessons.filter(l=>l.courseId!=="AI000")) assert.equal(hash(lessonRegistry.get(old.id)),hash(old));
 for(const file of before.curriculum) assert.equal(createHash("sha256").update(readFileSync(file.path)).digest("hex"),file.digest);
});

test("所有旧section和练习锚点保留真实正文或明确衔接，去向实际可读且不冲突",()=>{
 for(const old of before.lessons.filter(l=>l.courseId==="AI000")) {
  const current=lessonRegistry.get(old.id)!;
  assert.equal(current.contentVersion,2);
  const anchors=[...current.sections.map(s=>s.id),...current.sections.flatMap(s=>s.blocks).filter(b=>b.type==="exercise").map(b=>"exercise-"+b.id),...(current.legacyAnchors??[]).map(a=>a.id)];
  const oldAnchors=[...old.sections.map(s=>s.id),...old.sections.flatMap(s=>s.blocks).filter(b=>b.type==="exercise").map(b=>"exercise-"+b.id)];
  for(const anchor of oldAnchors) assert.ok(anchors.includes(anchor),old.id+"#"+anchor);
  const html=renderToStaticMarkup(createElement(LegacyAnchors,{lesson:current}));
  assert.doesNotMatch(html,/<details[^>]*\sopen/);
  for(const alias of current.legacyAnchors??[]) {
   assert.ok(html.includes('id="'+alias.id+'"'));
   assert.ok(html.includes(alias.href));
   const [path,anchor]=alias.href.split("#");
   const [, ,courseId,lessonId]=path.split("/");
   const target=resolveLesson(courseId,lessonId)!.lesson;
   assert.ok(target.sections.some(s=>s.id===anchor)||target.sections.flatMap(s=>s.blocks).some(b=>b.type==="exercise"&&"exercise-"+b.id===anchor),alias.href);
  }
  assert.equal(lessonSchema.safeParse({...current,legacyAnchors:[{...current.legacyAnchors![0],id:current.sections[0].id}]}).success,false);
 }
});

test("r1存储保留但不计入r2完成；三节新课及五课互不改写旧记录",()=>{
 const memory=new Map<string,string>();
 const port={getItem:(key:string)=>memory.get(key)??null,setItem:(key:string,value:string)=>{memory.set(key,value);}};
 const store=createProgressStore(()=>port);
 for(const old of before.lessons) store.save(lessonProgressScope(old),100,old.sections[0].id,true);
 const existing=new Map(memory);
 ids.forEach(id=>{
  const scope=lessonProgressScope(lessonRegistry.get(id)!);
  assert.equal(store.getSnapshot(scope),null,id);
  store.save(scope,100,scope.sectionIds[0]);
  assert.equal(parseReadingProgress(store.getSnapshot(scope),scope)?.completed,false);
  store.save(scope,100,scope.sectionIds[0],true);
 });
 for(const [key,value] of existing) assert.equal(memory.get(key),value,key);
 const restored=createProgressStore(()=>port);
 ids.forEach(id=>assert.equal(parseReadingProgress(restored.getSnapshot(lessonProgressScope(lessonRegistry.get(id)!)),lessonProgressScope(lessonRegistry.get(id)!))?.completed,true));
});

test("十课图示均有描述和图注，误判图核对独立预期，知识图只推出给定排查方向",()=>{
 const expectedKinds=[["mail-flow"],["mail-outcomes"],["knowledge-trace"],["method-hierarchy"],["method-and-task","generation-map"],["supervised-flow"],["borrowing-groups"],["self-supervised-flow"],["reinforcement-flow"],["features-target-flow"]];
 ids.forEach((id,i)=>{
  const figures=lessonRegistry.get(id)!.sections.flatMap(s=>s.blocks).filter(b=>b.type==="ai-task-figure");
  assert.deepEqual(figures.map(f=>f.kind),expectedKinds[i]);
  for(const block of figures) {
   const html=renderToStaticMarkup(createElement(ContentRenderer,{block,resources:[]}));
   assert.match(html,/<figure[^>]*aria-labelledby="[^"]+"[^>]*aria-describedby="[^"]+"/);
   assert.ok(html.includes(block.alt)&&html.includes(block.caption));
   if(block.kind==="mail-outcomes") { assert.match(html,/误拦正常邮件/);assert.match(html,/漏掉垃圾邮件/); }
   if(block.kind==="knowledge-trace") { assert.match(html,/中间结论/);assert.match(html,/尚不能确定/); }
  }
 });
 assert.deepEqual(mailExamples.map(m=>keywordMailDecision(m.subject)===m.expected),[true,false,true,false]);
});
