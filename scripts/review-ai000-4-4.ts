import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { evidencePath } from "./evidence-path";
import type { Lesson, Publication } from "../src/content/models";
import { visualComparableJson, assertIllustrationPublication, assertIllustrationCompatibleFile } from "./ai000-illustration-compatibility";
import { ai000Illustrations } from "../src/content/lessons/ai000/illustrations";
import { resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";

if (process.argv.includes("--baseline")) {
  const paths = execFileSync("git", ["ls-files","-z","curriculum","src/content/lessons","src/content/resources","src/components/lesson","src/lib/learning-progress.ts","src/lib/use-learning-progress.ts","src/content/ai000-outline.ts","docs/COURSE_EDITORIAL_STANDARD_V1.md","next.config.ts"], {encoding:"utf8"}).split("\0").filter(Boolean);
  writeFileSync(evidencePath("BEFORE.json"), JSON.stringify({
    base:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),
    remote:execFileSync("git",["rev-parse","origin/main"],{encoding:"utf8"}).trim(),
    workspace:execFileSync("git",["status","--short"],{encoding:"utf8"}),
    lessons:[...lessonRegistry.values()], publications:publicationManifest,
    protectedFiles:paths.map(path=>({path,hash:createHash("sha256").update(readFileSync(path)).digest("hex")})),
  },null,2)+"\n",{flag:"wx"});
  console.log(`${lessonRegistry.size}节旧注册全文、清单与源文件摘要已独占保存`);
} else {
  const before=JSON.parse(readFileSync(evidencePath("BEFORE.json"),"utf8")) as {lessons:Lesson[];publications:Publication[];protectedFiles:{path:string;hash:string}[]};
  for (const old of before.lessons) assert.equal(visualComparableJson(lessonRegistry.get(old.id)),JSON.stringify(old),old.id);
  for (const old of before.publications) {
    const current=publicationManifest.find(p=>p.lessonId===old.lessonId)!;
    assertIllustrationPublication(old,current);
  }
  for (const f of before.protectedFiles) assertIllustrationCompatibleFile(f.path,f.hash);
  const lesson=lessonRegistry.get("AI000-C04-L04")!, entry=publicationManifest.find(p=>p.lessonId===lesson.id)!;
  assert.equal(lesson.contentVersion,1); const pilot=process.argv.includes("--pilot"), final=process.argv.includes("--final")||pilot;
  assert.equal(entry.status,final?"pending-review":"draft"); assert.equal(entry.access,final?"preview":"private"); assert.equal(entry.reviewEvidence,undefined);
  assert.equal(Boolean(resolveLesson("AI000",lesson.id)),final);
  const course=getLearningCourse("AI000")!;
  if (final) {assert.equal(getAdjacentLessons(course,"AI000-C04-L03").next?.lessonId,lesson.id);assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C04-L03");assert.equal(getAdjacentLessons(course,lesson.id).next,undefined);assert.equal(ai000Illustrations.length,pilot?4:13);}
  for (const slot of course.chapters.slice(4).flatMap(c=>c.lessons)) {assert.equal(slot.href,undefined);assert.equal(lessonRegistry.has(slot.lessonId),false);}
  const stage=pilot?"PILOT":final?"FINAL":"DRAFT", time=getCourseStudyEstimate("AI000")!;assert.deepEqual(time.totalMinutes,[586,906]);
  writeFileSync(evidencePath(stage+"_LESSON.json"),JSON.stringify(lesson,null,2)+"\n");
  writeFileSync(evidencePath(stage+"_CHECK.json"),JSON.stringify({checkedAt:new Date().toISOString(),unchangedOtherLessons:23,oldAI000OnlyRegisteredImageAdded:ai000Illustrations.filter(a=>a.lessonId!=="AI000-C04-L04").length,oldVersionsAndAssessmentPreserved:true,protectedFiles:true,illustrations:ai000Illustrations,publication:entry,assessment:lesson.assessmentMap},null,2)+"\n");
  writeFileSync(evidencePath("TIME_ESTIMATE.json"),JSON.stringify({...time,reason:"4.4步骤解释与五情况核查，练习8–14改14–22分钟；均编辑估计，旧课不因配图改时长"},null,2)+"\n");
  console.log(`${before.lessons.length}节旧注册内容反向移除登记插画后完全一致；${ai000Illustrations.length}张插画；4.4阶段/导航检查通过`);
}
