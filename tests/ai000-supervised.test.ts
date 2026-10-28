import { visualComparableJson, withoutAi000Illustrations } from "../scripts/ai000-illustration-compatibility";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { lessonRegistry, resolveLesson, getAdjacentLessons, getLearningCourse } from "../src/lib/course-engine";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { parcelExamples, newParcel } from "../src/content/lessons/ai000/parcel-example";
import { getCourseStudyEstimate, getCourseTimeLabel } from "../src/lib/course-learning-time";
import { courses } from "../src/lib/curriculum";
import type { Lesson } from "../src/content/models";

const before=JSON.parse(readFileSync(new URL("../docs/ai000-3-1/BEFORE.json",import.meta.url),"utf8")) as {lessons:Lesson[];curriculum:{path:string;digest:string}[]};
const lesson=lessonRegistry.get("AI000-C03-L01")!;
const blocks=lesson.sections.flatMap(s=>s.blocks);
const hash=(value:unknown)=>createHash("sha256").update(visualComparableJson(value)).digest("hex");

test("3.1独立r1、真实目标映射与反馈；2.2可进入3.1并接3.2，5.4及后续仍规划",()=>{
 assert.equal(lesson.contentVersion,1);
 assert.equal(resolveLesson("AI000",lesson.id)?.publication.status,"pending-review");
 assert.equal(resolveLesson("AI000",lesson.id)?.publication.reviewEvidence,undefined);
 const course=getLearningCourse("AI000")!;
 assert.equal(getAdjacentLessons(course,"AI000-C02-L02").next?.lessonId,lesson.id);
 assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C02-L02");
 assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,"AI000-C03-L02");
 for(const id of ["AI000-C05-L04"]) {
  assert.equal(resolveLesson("AI000",id),undefined);assert.equal(lessonRegistry.has(id),false);
 }
 assert.equal(resolveLesson("PY101",lesson.id),undefined);
 assert.deepEqual(lesson.assessmentMap,[{objective:1,exerciseIds:["prepare-examples"]},{objective:2,exerciseIds:["prepare-examples","missing-targets"]},{objective:3,exerciseIds:["missing-targets"]}]);
 assert.ok(blocks.every(b=>!["code","math","experiment","downloads"].includes(b.type)));
 for(const exercise of blocks.filter(b=>b.type==="exercise")) {
  assert.equal(exercise.hints.length,2);assert.ok(exercise.rubric.length>=3);
  const html=renderToStaticMarkup(createElement(ContentRenderer,{block:exercise,resources:[]}));
  assert.equal((html.match(/<details/g)??[]).length,3);
  assert.doesNotMatch(html,/<details[^>]*\sopen/);
 }
});

test("包裹图与正文逐项对应，E只含预测而无已核实标签，图有可访问说明",()=>{
 assert.deepEqual(parcelExamples.map(e=>[e.id,e.label]),[["A","纸箱"],["B","文件袋"],["C","纸箱"],["D","文件袋"]]);
 const table=blocks.find(b=>b.type==="table")!;
 assert.equal(table.type,"table");
 if(table.type==="table") assert.deepEqual(table.rows.map(r=>[r[0],r[2]]),[["A","纸箱"],["B","文件袋"],["C","纸箱"],["D","文件袋"]]);
 assert.equal("label" in newParcel,false);
 const figure=blocks.find(b=>b.type==="ai-task-figure")!;
 const html=renderToStaticMarkup(createElement(ContentRenderer,{block:figure,resources:[]}));
 assert.match(html,/<figure[^>]*aria-labelledby="[^"]+"[^>]*aria-describedby="[^"]+"/);
 if(figure.type==="ai-task-figure") assert.ok(html.includes(figure.alt)&&html.includes(figure.caption));
 assert.match(html,/真实类别：尚未核实，真实类别未知/);
 assert.equal((html.match(/已确认类别/g)??[]).length,4);
});

test("1.3保留r1结构和考核；27节其他教材及原始课程事实不变；新进度不触及旧键",()=>{
 const old=before.lessons.find(l=>l.id==="AI000-C01-L03")!;
 const current=lessonRegistry.get(old.id)!;
 assert.deepEqual(lessonProgressScope(current),lessonProgressScope(old));
 assert.deepEqual(current.objectives,old.objectives);
 assert.deepEqual(current.assessmentMap,old.assessmentMap);
 assert.deepEqual((withoutAi000Illustrations(current) as Lesson).sections.flatMap(s=>s.blocks).filter(b=>b.type!=="paragraph"),old.sections.flatMap(s=>s.blocks).filter(b=>b.type!=="paragraph"));
 for(const other of before.lessons.filter(l=>l.id!==old.id)) assert.equal(hash(lessonRegistry.get(other.id)),hash(other),other.id);
 for(const file of before.curriculum) assert.equal(createHash("sha256").update(readFileSync(file.path)).digest("hex"),file.digest);
 const memory=new Map<string,string>();
 const port={getItem:(key:string)=>memory.get(key)??null,setItem:(key:string,value:string)=>{memory.set(key,value);}};
 const store=createProgressStore(()=>port);
 before.lessons.forEach(l=>store.save(lessonProgressScope(l),100,l.sections[0].id,true));
 const existing=new Map(memory);
 assert.equal(parseReadingProgress(store.getSnapshot(lessonProgressScope(current)),lessonProgressScope(current))?.completed,true);
 const scope=lessonProgressScope(lesson);
 assert.equal(store.getSnapshot(scope),null);store.save(scope,100,"practice");
 assert.equal(parseReadingProgress(store.getSnapshot(scope),scope)?.completed,false);
 store.save(scope,100,"takeaways",true);
 assert.equal(progressKey(scope),"aivora:learning:v2:AI000:AI000-C03-L01:r1");
 assert.equal(parseReadingProgress(createProgressStore(()=>port).getSnapshot(scope),scope)?.completed,true);
 for(const [key,value] of existing) assert.equal(memory.get(key),value,key);
});

test("学时单一维护表逐行匹配24节规划，合计624–960分钟，其他19门展示不变",()=>{
 const estimate=getCourseStudyEstimate("AI000")!;
 const plan=readFileSync("docs/AI000_CURRICULUM_V2_PLAN.md","utf8");
 const rows=plan.split("\n").filter(l=>/^\| \d\.\d /.test(l));
 assert.equal(rows.length,24);assert.equal(estimate.lessonCount,24);
 rows.forEach((row,i)=>{
  const range=row.split("|").at(-2)!.trim().replaceAll("–","-");
  const parts=range.split("/").map(r=>r.split("-").map(Number)).map(r=>r.length===1?[r[0],r[0]]:r);
  assert.deepEqual([estimate.lessons[i].reading,estimate.lessons[i].practice,estimate.lessons[i].project],parts);
 });
 assert.deepEqual(estimate.totalMinutes,[624,960]);assert.equal(estimate.hours,"10.4–16.0");
 assert.equal(estimate.basis,"editorial-estimate");assert.equal(estimate.includesPlannedLessons,true);
 assert.equal(getCourseTimeLabel(courses.find(c=>c.id==="AI000")!),"编辑预计 10.4–16.0 小时");
 for(const c of courses.filter(c=>c.id!=="AI000")) {
  assert.equal(getCourseStudyEstimate(c.id),undefined);assert.equal(getCourseTimeLabel(c),`预计 ${c.hours} 小时`);
 }
});
