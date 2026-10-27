import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { lessonSchema, type Lesson, type Publication } from "../src/content/models";
import { borrowingRecords, borrowingObservations, activityRecords } from "../src/content/lessons/ai000/borrowing-example";
import { assertStatusOnly31, assertExerciseRevision32, assertPublicationRefinement } from "./ai000-refinement-compatibility";
import { evidencePath } from "./evidence-path";

const hash=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const fileHash=(path:string)=>createHash("sha256").update(readFileSync(path)).digest("hex");
const baseline=evidencePath("BEFORE.json");
if(process.argv.includes("--baseline")) {
  writeFileSync(baseline,JSON.stringify({
    base:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),
    workspace:execFileSync("git",["status","--short"],{encoding:"utf8"}),
    lessons:[...lessonRegistry.values()],publications:publicationManifest,
    data:{borrowingRecords,borrowingObservations,activityRecords},
    protectedFiles:["curriculum/AI技术课程体系_V1.0.md","curriculum/AI技术课程目录_V1.0.json","src/components/lesson/ai-borrowing-figure.tsx","src/content/ai000-study-time.ts"].map(path=>({path,hash:fileHash(path)})),
    sources:["supervised-learning.ts","unsupervised-learning.ts","borrowing-example.ts"].map(name=>({name,text:readFileSync("src/content/lessons/ai000/"+name,"utf8")})),
  },null,2)+"\n",{flag:"wx"});
  console.log("实际30节全文、发布清单、练习数据和三份源稿已独占保存");
} else {
  const before=JSON.parse(readFileSync(baseline,"utf8")) as {lessons:Lesson[];publications:Publication[];data:{borrowingRecords:unknown;borrowingObservations:unknown};protectedFiles:{path:string;hash:string}[]};
  const refined=process.argv.includes("--refined")||process.argv.includes("--final");
  for(const old of before.lessons) {
    const current=lessonRegistry.get(old.id)!;
    if(refined&&old.id==="AI000-C03-L01") assertStatusOnly31(old,current);
    else if(refined&&old.id==="AI000-C03-L02") assertExerciseRevision32(old,current);
    else assert.equal(hash(current),hash(old),old.id);
  }
  for(const old of before.publications) {
    const current=publicationManifest.find(p=>p.lessonId===old.lessonId)!;
    if(refined) assertPublicationRefinement(old,current);else assert.deepEqual(current,old);
  }
  for(const file of before.protectedFiles) assert.equal(fileHash(file.path),file.hash,file.path);
  assert.deepEqual(borrowingRecords,before.data.borrowingRecords);assert.deepEqual(borrowingObservations,before.data.borrowingObservations);
  const {selfSupervisedLesson}=await import("../src/content/lessons/ai000/self-supervised-learning");
  const lesson=lessonSchema.parse(selfSupervisedLesson);
  const exercises=lesson.sections.flatMap(s=>s.blocks).filter(b=>b.type==="exercise");
  assert.equal(exercises.length,2);
  for(const ex of exercises) {assert.equal(ex.hints.length,2);assert.ok(ex.solution.some(s=>s.includes("常见错误")));assert.ok(ex.rubric.length>=3);}
  const final=process.argv.includes("--final");
  if(final) {
    const course=getLearningCourse("AI000")!;
    assert.equal(course.chapters.flatMap(c=>c.lessons).filter(l=>l.href).length,9);
    assert.equal(getAdjacentLessons(course,"AI000-C03-L02").next?.lessonId,lesson.id);
    assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C03-L02");
    assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,"AI000-C03-L04");
    assert.ok(resolveLesson("AI000",lesson.id));
  } else assert.equal(resolveLesson("AI000",lesson.id),undefined);
  assert.equal(resolveLesson("AI000","AI000-C04-L01"),undefined);
  assert.equal(lessonRegistry.has("AI000-C04-L01"),false);
  const stage=final?"FINAL":refined?"DRAFT":"CONTENT";
  writeFileSync(evidencePath(stage+"_CHECK.json"),JSON.stringify({checkedAt:new Date().toISOString(),unchangedLessons:refined?28:30,refined,protectedFilesUnchanged:true,mainBorrowingDataUnchanged:true,objectives:lesson.assessmentMap},null,2)+"\n");
  writeFileSync(evidencePath(stage+"_LESSON.json"),JSON.stringify(lesson,null,2)+"\n");
  if(refined) for(const id of ["AI000-C03-L01","AI000-C03-L02"]) writeFileSync(evidencePath(id+"_AFTER.json"),JSON.stringify(lessonRegistry.get(id),null,2)+"\n");
  console.log(`${refined?28:30}节原稿不变；${refined?"3.1/3.2精确修改边界通过；":""}3.3目标、题与先修范围通过`);
}
