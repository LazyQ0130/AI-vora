import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { lessonSchema, type Lesson, type Publication } from "../src/content/models";
import { evidencePath } from "./evidence-path";
import { assertStatusOnly31, assertPublicationRefinement } from "./ai000-refinement-compatibility";

const digest=(value:unknown)=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const fileDigest=(path:string)=>createHash("sha256").update(readFileSync(path)).digest("hex");
const path=evidencePath("BEFORE.json");
if(process.argv.includes("--baseline")) {
  writeFileSync(path,JSON.stringify({
    base:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),
    workspace:execFileSync("git",["status","--short"],{encoding:"utf8"}),
    lessons:[...lessonRegistry.values()],publications:publicationManifest,
    curriculum:["curriculum/AI技术课程体系_V1.0.md","curriculum/AI技术课程目录_V1.0.json"].map(path=>({path,digest:fileDigest(path)})),
  },null,2)+"\n",{flag:"wx"});
  console.log(`实际${lessonRegistry.size}节注册全文、清单、基线与课程事实摘要已独占保存`);
} else {
  const before=JSON.parse(readFileSync(path,"utf8")) as {lessons:Lesson[];publications:Publication[];curriculum:{path:string;digest:string}[]};
  for(const old of before.lessons) {
    if(old.id==="AI000-C03-L01") assertStatusOnly31(old,lessonRegistry.get(old.id)!);
    else assert.equal(digest(lessonRegistry.get(old.id)),digest(old),old.id);
  }
  for(const old of before.publications) assertPublicationRefinement(old,publicationManifest.find(p=>p.lessonId===old.lessonId)!);
  for(const file of before.curriculum) assert.equal(fileDigest(file.path),file.digest,file.path);
  const lesson=lessonSchema.parse(lessonRegistry.get("AI000-C03-L02"));
  const exercises=lesson.sections.flatMap(s=>s.blocks).filter(b=>b.type==="exercise");
  assert.equal(lesson.contentVersion,2);assert.equal(exercises.length,2);
  for(const ex of exercises) {
    assert.equal(ex.hints.length,2);assert.ok(ex.rubric.length>=3);
    assert.ok(ex.solution.some(s=>s.includes("常见错误")));
  }
  const course=getLearningCourse("AI000")!;
  assert.equal(course.chapters.flatMap(c=>c.lessons).length,24);
  for(const id of ["AI000-C03-L04"]) {
    assert.equal(resolveLesson("AI000",id),undefined);assert.equal(lessonRegistry.has(id),false);
  }
  const final=process.argv.includes("--final");
  if(final) {
    assert.equal(getAdjacentLessons(course,"AI000-C03-L01").next?.lessonId,lesson.id);
    assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C03-L01");
    assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,"AI000-C03-L03");
    assert.equal(course.chapters.flatMap(c=>c.lessons).filter(l=>l.href).length,8);
    assert.ok(resolveLesson("AI000",lesson.id));
  } else {
    assert.equal(resolveLesson("AI000",lesson.id),undefined);
    assert.equal(publicationManifest.find(p=>p.lessonId===lesson.id)?.access,"private");
  }
  writeFileSync(evidencePath(final?"LESSON_AFTER.json":"LESSON_DRAFT.json"),JSON.stringify(lesson,null,2)+"\n");
  writeFileSync(evidencePath(final?"CONTENT_CHECK.json":"DRAFT_CHECK.json"),JSON.stringify({checkedAt:new Date().toISOString(),unchangedLessons:before.lessons.length-1,statusOnly31:true,publicationRefinementsChecked:true,curriculumUnchanged:true,stage:final?"preview":"private",objectives:lesson.assessmentMap,sections:lesson.sections.map(s=>s.id)},null,2)+"\n");
  console.log("28节旧教材及原课程事实不变，3.1仅状态句；3.2r2结构/映射及规划边界通过");
}
