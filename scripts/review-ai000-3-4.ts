import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import type { Lesson, Publication } from "../src/content/models";
import { evidencePath } from "./evidence-path";

const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const fileHash=(path:string)=>createHash("sha256").update(readFileSync(path)).digest("hex");
const baseline=evidencePath("BEFORE.json");
if(process.argv.includes("--baseline")) {
 const protectedPaths=["curriculum/AI技术课程体系_V1.0.md","curriculum/AI技术课程目录_V1.0.json","src/content/ai000-study-time.ts",
  ...["supervised-learning.ts","unsupervised-learning.ts","self-supervised-learning.ts","parcel-example.ts","borrowing-example.ts","self-supervised-example.ts"].map(p=>"src/content/lessons/ai000/"+p),
  ...["ai-supervised-figure.tsx","ai-borrowing-figure.tsx","ai-self-supervised-figure.tsx","reader.tsx","learning-support.tsx"].map(p=>"src/components/lesson/"+p),
  "src/lib/learning-progress.ts","src/lib/use-learning-progress.ts"];
 writeFileSync(baseline,JSON.stringify({base:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),workspace:execFileSync("git",["status","--short"],{encoding:"utf8"}),lessons:[...lessonRegistry.values()],publications:publicationManifest,protectedFiles:protectedPaths.map(path=>({path,hash:fileHash(path)}))},null,2)+"\n",{flag:"wx"});
 console.log(`${lessonRegistry.size}节注册全文/清单和受保护源文件已独占保存`);
} else {
 const before=JSON.parse(readFileSync(baseline,"utf8")) as {lessons:Lesson[];publications:Publication[];protectedFiles:{path:string;hash:string}[]};
 for(const old of before.lessons) assert.equal(digest(lessonRegistry.get(old.id)),digest(old),old.id);
 for(const old of before.publications) assert.deepEqual(publicationManifest.find(p=>p.lessonId===old.lessonId),old,old.lessonId);
 for(const f of before.protectedFiles) assert.equal(fileHash(f.path),f.hash,f.path);
 const {reinforcementLearningLesson:lesson}=await import("../src/content/lessons/ai000/reinforcement-learning");
 const exercises=lesson.sections.flatMap(s=>s.blocks).filter(b=>b.type==="exercise");
 assert.equal(exercises.length,2);
 for(const ex of exercises) {assert.equal(ex.hints.length,2);assert.ok(ex.solution.some(s=>s.includes("常见错误")));assert.ok(ex.rubric.length>=3);}
 const course=getLearningCourse("AI000")!;
 const final=process.argv.includes("--final");
 assert.equal(lesson.contentVersion,1);
 if(final) {
  assert.equal(course.chapters.flatMap(c=>c.lessons).filter(l=>l.href).length,9);
  assert.equal(getAdjacentLessons(course,"AI000-C03-L03").next?.lessonId,lesson.id);
  assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C03-L03");
  assert.equal(getAdjacentLessons(course,lesson.id).next,undefined);
  assert.ok(resolveLesson("AI000",lesson.id));
 } else assert.equal(resolveLesson("AI000",lesson.id),undefined);
 for(const slot of course.chapters.slice(3).flatMap(c=>c.lessons)) {assert.equal(slot.href,undefined);assert.equal(lessonRegistry.has(slot.lessonId),false);}
 const stage=final?"FINAL":"DRAFT";
 writeFileSync(evidencePath(stage+"_CHECK.json"),JSON.stringify({checkedAt:new Date().toISOString(),unchangedLessons:before.lessons.length,unchangedPublications:before.publications.length,protectedFilesUnchanged:true,objectives:lesson.assessmentMap,status:publicationManifest.find(p=>p.lessonId===lesson.id)},null,2)+"\n");
 writeFileSync(evidencePath(stage+"_LESSON.json"),JSON.stringify(lesson,null,2)+"\n");
 console.log("31节原稿/清单及所有受保护源文件不变；3.4结构/目标和第4章边界通过");
}
