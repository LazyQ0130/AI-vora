import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import type { Lesson, Publication } from "../src/content/models";
import { borrowingRecords, borrowingObservations, activityRecords } from "../src/content/lessons/ai000/borrowing-example";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";
import { assertStatusOnly31, assertPublicationRefinement } from "../scripts/ai000-refinement-compatibility";

const before=JSON.parse(readFileSync(new URL("../docs/ai000-3-2/BEFORE.json",import.meta.url),"utf8")) as {lessons:Lesson[];publications:Publication[];curriculum:{path:string;digest:string}[]};
const lesson=lessonRegistry.get("AI000-C03-L02")!;
const blocks=lesson.sections.flatMap(s=>s.blocks);
const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");

test("3.2修订r2，目标真实映射两个去重核心入口，3.1/3.3相邻可读而4.4仍规划",()=>{
 const course=getLearningCourse("AI000")!;
 assert.equal(lesson.contentVersion,2);
 assert.equal(resolveLesson("AI000",lesson.id)?.publication.status,"pending-review");
 assert.equal(resolveLesson("AI000",lesson.id)?.publication.reviewEvidence,undefined);
 assert.equal(getAdjacentLessons(course,"AI000-C03-L01").next?.lessonId,lesson.id);
 assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C03-L01");
 assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,"AI000-C03-L03");
 assert.equal(resolveLesson("PY101",lesson.id),undefined);
 for(const id of ["AI000-C04-L04"]) {
  assert.equal(resolveLesson("AI000",id),undefined);assert.equal(lessonRegistry.has(id),false);
 }
 assert.deepEqual(lesson.assessmentMap,[{objective:1,exerciseIds:["propose-groups","identify-learning-signals"]},{objective:2,exerciseIds:["propose-groups"]},{objective:3,exerciseIds:["propose-groups","identify-learning-signals"]}]);
 assert.deepEqual(lessonExerciseLinks(lesson).map(e=>[e.id,e.tier,e.objectives]),[["propose-groups","core",[1,2,3]],["identify-learning-signals","core",[1,3]]]);
 assert.ok(blocks.every(b=>!["code","math","experiment","downloads"].includes(b.type)));
 for(const ex of blocks.filter(b=>b.type==="exercise")) {
  assert.equal(ex.hints.length,2);assert.ok(ex.rubric.length>=3);
  const html=renderToStaticMarkup(createElement(ContentRenderer,{block:ex,resources:[]}));
  assert.equal((html.match(/<details/g)??[]).length,3);assert.doesNotMatch(html,/<details[^>]*\sopen/);
 }
 const time=getCourseStudyEstimate("AI000")!.lessons.find(l=>l.lessonId===lesson.id)!;
 assert.deepEqual(lesson.learningTime.reading,time.reading);assert.deepEqual(lesson.learningTime.practice,time.practice);
 assert.deepEqual(lesson.learningTime.coding,[0,0]);assert.equal(lesson.resources.length,0);
});

test("主例与图的每个计数格一致，F四个空格不是缺失值；手工观察只表达所选比较依据",()=>{
 assert.deepEqual(borrowingRecords.map(r=>[r.id,r.science,r.literature]),[["A",4,0],["B",3,1],["C",0,4],["D",1,3],["E",2,2],["F",0,0]]);
 assert.deepEqual(borrowingRecords.map(r=>r.science+r.literature),[4,4,4,4,4,0]);
 const figures=blocks.filter(b=>b.type==="ai-task-figure");assert.equal(figures.length,1);
 const html=renderToStaticMarkup(createElement(ContentRenderer,{block:figures[0],resources:[]}));
 assert.match(html,/<figure[^>]*aria-labelledby="[^"]+"[^>]*aria-describedby="[^"]+"/);
 assert.ok(html.includes(figures[0].alt)&&html.includes(figures[0].caption));
 const bars=[...html.matchAll(/<div class="ai-borrowing-bar"[^>]*>(.*?)<\/div>/g)].map(m=>m[1]);
 assert.equal(bars.length,6);
 assert.deepEqual(bars.map(row=>(row.match(/class="ai-count-science"/g)??[]).length),[4,3,0,1,2,0]);
 assert.deepEqual(bars.map(row=>(row.match(/class="ai-count-literature"/g)??[]).length),[0,1,4,3,2,0]);
 assert.deepEqual(bars.map(row=>(row.match(/class="ai-count-empty"/g)??[]).length),[0,0,0,0,0,4]);
 assert.deepEqual(borrowingObservations.map(g=>g.ids),[
  borrowingRecords.filter(r=>r.science>r.literature).map(r=>r.id),
  borrowingRecords.filter(r=>r.literature>r.science).map(r=>r.id),
  borrowingRecords.filter(r=>r.science===r.literature&&r.science>0).map(r=>r.id),
  borrowingRecords.filter(r=>r.science+r.literature===0).map(r=>r.id),
 ]);
 assert.ok(borrowingRecords.every(r=>!("label" in r)));
});

test("练习用不同输入，按倾向与总数得到不同观察；这里只核算示例，不限定学生唯一分法",()=>{
 assert.deepEqual(activityRecords.map(r=>[r.id,r.sport,r.art]),[["P",5,1],["Q",3,2],["R",1,4],["S",0,2],["T",4,4],["U",1,0]]);
 assert.deepEqual(activityRecords.filter(r=>r.sport>r.art).map(r=>r.id),["P","Q","U"]);
 assert.deepEqual(activityRecords.filter(r=>r.art>r.sport).map(r=>r.id),["R","S"]);
 assert.deepEqual(activityRecords.map(r=>r.sport+r.art),[6,5,5,2,8,1]);
 assert.deepEqual(activityRecords.filter(r=>r.sport+r.art===5).map(r=>r.id),["Q","R"]);
 assert.deepEqual(activityRecords.filter(r=>r.sport+r.art===8).map(r=>r.id),["T"]);
});

test("旧29节中仅3.1状态句更新，其余28节及原课程事实保留；3.2独立保存不改旧键",()=>{
 for(const old of before.lessons) {
  if(old.id==="AI000-C03-L01") assertStatusOnly31(old,lessonRegistry.get(old.id)!);
  else assert.equal(digest(lessonRegistry.get(old.id)),digest(old),old.id);
 }
 for(const old of before.publications) assertPublicationRefinement(old,publicationManifest.find(p=>p.lessonId===old.lessonId)!);
 for(const file of before.curriculum) assert.equal(createHash("sha256").update(readFileSync(file.path)).digest("hex"),file.digest);
 const memory=new Map<string,string>();
 const port={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}};
 const store=createProgressStore(()=>port);
 before.lessons.forEach(l=>store.save(lessonProgressScope(l),100,l.sections[0].id,true));
 const existing=new Map(memory);const scope=lessonProgressScope(lesson);
 assert.equal(store.getSnapshot(scope),null);store.save(scope,65,"unsupervised");
 const restored=createProgressStore(()=>port);
 assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.section,"unsupervised");
 assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.completed,false);
 restored.save(scope,100,"takeaways",true);
 assert.equal(progressKey(scope),"aivora:learning:v2:AI000:AI000-C03-L02:r2");
 assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.completed,true);
 for(const [k,v] of existing) assert.equal(memory.get(k),v,k);
});
