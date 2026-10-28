import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import type { Lesson, Publication } from "../src/content/models";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";

const dir = "docs/ai000-5-5";
const sha = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const git = (...args: string[]) => execFileSync("git", args, { encoding: "utf8" });
export type ApplicabilityBaseline = { base: string; remote: string; lessons: Lesson[]; publications: Publication[]; files: {path:string;sha256:string}[] };
if (process.argv[1]?.replaceAll("\\", "/").endsWith("/review-ai000-5-5.ts")) {
  mkdirSync(dir, {recursive:true});
  if (process.argv.includes("--baseline")) {
    const paths=git("ls-files","-z","curriculum","src","public").split("\0").filter(Boolean);
    writeFileSync(`${dir}/BEFORE.json`,JSON.stringify({base:git("rev-parse","HEAD").trim(),remote:git("rev-parse","origin/main").trim(),workspace:git("status","--short"),lessons:[...lessonRegistry.values()],publications:publicationManifest,files:paths.map(path=>({path,sha256:sha(readFileSync(path))}))},null,2)+"\n",{flag:"wx"});
    console.log(`独占保存${lessonRegistry.size}节完整教材、${publicationManifest.length}条发布记录和${paths.length}文件摘要`);
  } else {
    const before=JSON.parse(readFileSync(`${dir}/BEFORE.json`,"utf8")) as ApplicabilityBaseline;
    const { beforeApplicabilitySource } = await import("./ai000-applicability-compatibility");
    for(const old of before.lessons)assert.equal(JSON.stringify(lessonRegistry.get(old.id)),JSON.stringify(old),old.id);
    for(const old of before.publications)assert.deepEqual(publicationManifest.find(p=>p.lessonId===old.lessonId),old,old.lessonId);
    for(const file of before.files){const bytes=readFileSync(file.path);if(sha(bytes)===file.sha256)continue;const text=beforeApplicabilitySource(file.path,bytes.toString("utf8")).replaceAll("\r\n","\n");assert.ok([text,text.replaceAll("\n","\r\n")].some(t=>sha(Buffer.from(t))===file.sha256),file.path);}
    assert.equal(lessonRegistry.size,before.lessons.length+1);assert.equal(publicationManifest.length,before.publications.length+1);
    const id="AI000-C05-L05", lesson=lessonRegistry.get(id)!, publication=publicationManifest.find(p=>p.lessonId===id)!;
    assert.equal(lesson.contentVersion,1);assert.equal(publication.contentVersion,1);
    const course=getLearningCourse("AI000")!;assert.equal(course.status,"planned");
    for(const slot of course.chapters.slice(5).flatMap(c=>c.lessons)){assert.equal(slot.status,"planned");assert.equal(slot.href,undefined);assert.equal(lessonRegistry.has(slot.lessonId),false);}
    const final=process.argv.includes("--final");
    if(final){assert.equal(publication.status,"pending-review");assert.equal(publication.access,"preview");assert.equal(publication.reviewEvidence,undefined);assert.ok(resolveLesson("AI000",id));assert.equal(getAdjacentLessons(course,"AI000-C05-L04").next?.lessonId,id);assert.equal(getAdjacentLessons(course,id).previous?.lessonId,"AI000-C05-L04");assert.equal(getAdjacentLessons(course,id).next,undefined);}
    else {assert.equal(publication.status,"draft");assert.equal(publication.access,"private");assert.equal(resolveLesson("AI000",id),undefined);}
    writeFileSync(`${dir}/${final?"FINAL":"DRAFT"}_CHECK.json`,JSON.stringify({checkedAt:new Date().toISOString(),base:before.base,unchangedOldLessons:before.lessons.length,unchangedPublications:before.publications.length,protectedFiles:before.files.length,preservedPreciseFigures:before.lessons.filter(l=>l.courseId==="AI000").flatMap(l=>l.sections.flatMap(s=>s.blocks)).filter(b=>b.type==="ai-task-figure").length,publication,assessmentMap:lesson.assessmentMap},null,2)+"\n");
    writeFileSync(`${dir}/LESSON.json`,JSON.stringify(lesson,null,2)+"\n");
    writeFileSync(`${dir}/QUESTIONS_ONLY.json`,JSON.stringify(lesson.sections.filter(s=>s.blocks.some(b=>b.type==="exercise")).map(s=>({sectionId:s.id,given:s.blocks.filter(b=>b.type!=="exercise"),exercises:s.blocks.filter(b=>b.type==="exercise").map(question=>Object.fromEntries(Object.entries(question).filter(([key])=>key!=="solution"&&key!=="rubric")))})),null,2)+"\n");
    writeFileSync(`${dir}/TIME_ESTIMATE.json`,JSON.stringify(getCourseStudyEstimate("AI000"),null,2)+"\n");
    console.log(`${final?"预览":"私有草稿"}通过；40旧课/40旧发布与全部保护文件保持`);
  }
}
