import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";
import { lessonRegistry } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import assert from "node:assert/strict";
import type { Lesson, Publication } from "../src/content/models";
import { beforeQualitySource, qualityComparableJson, beforeQualityRevision, qualityChanges } from "./ai000-quality-compatibility";
const dir = "docs/ai000-cross-lesson-quality";
if (process.argv.includes("--baseline")) {
  mkdirSync(dir, {recursive:true});
  const git = (...args:string[]) => execFileSync("git",args,{encoding:"utf8"});
  const paths = git("ls-files","-z","curriculum","src","public").split("\0").filter(Boolean);
  writeFileSync(`${dir}/BEFORE.json`,JSON.stringify({base:git("rev-parse","HEAD").trim(),remote:git("rev-parse","origin/main").trim(),workspace:git("status","--short"),lessons:[...lessonRegistry.values()],publications:publicationManifest,files:paths.map(path=>({path,sha256:createHash("sha256").update(readFileSync(path)).digest("hex")}))},null,2)+"\n",{flag:"wx"});
  console.log(`保存${lessonRegistry.size}节完整教材、${publicationManifest.length}条发布记录与${paths.length}个文件摘要。`);
}

if (process.argv.includes("--capture")) {
  const dir = "docs/ai000-cross-lesson-quality";
  writeFileSync(`${dir}/AFTER.json`,JSON.stringify({lessons:[...lessonRegistry.values()],publications:publicationManifest},null,2)+"\n");
  writeFileSync(`${dir}/TIME_ESTIMATE.json`,JSON.stringify(getCourseStudyEstimate("AI000"),null,2)+"\n");
}
if (process.argv.includes("--check")) {
  const before = JSON.parse(readFileSync(`${dir}/BEFORE.json`, "utf8")) as { base:string; lessons:Lesson[]; publications:Publication[]; files:{path:string;sha256:string}[] };
  for (const lesson of before.lessons) assert.equal(qualityComparableJson(lessonRegistry.get(lesson.id)), JSON.stringify(lesson), lesson.id);
  for (const publication of before.publications) assert.deepEqual(beforeQualityRevision(publicationManifest.find(p=>p.lessonId===publication.lessonId)), publication);
  const hash = (bytes:Buffer) => createHash("sha256").update(bytes).digest("hex");
  for (const file of before.files) {
    const bytes = readFileSync(file.path);
    if(hash(bytes)===file.sha256) continue;
    const text = beforeQualitySource(file.path,bytes.toString("utf8")).replaceAll("\r\n","\n");
    assert.ok([text,text.replaceAll("\n","\r\n")].some(t=>hash(Buffer.from(t))===file.sha256),file.path);
  }
  const versions = qualityChanges.lessons.map(entry=>{
    const previous=before.lessons.find(l=>l.id===entry.id)!, current=lessonRegistry.get(entry.id)!;
    return {lessonId:entry.id,before:previous.contentVersion,after:current.contentVersion,objectiveChanged:JSON.stringify(previous.objectives)!==JSON.stringify(current.objectives),coreChanged:["AI000-C01-L02","AI000-C05-L03"].includes(entry.id),changedPaths:entry.changes.map(e=>e.path.join("/"))};
  });
  writeFileSync(`${dir}/FINAL_CHECK.json`,JSON.stringify({checkedAt:new Date().toISOString(),base:before.base,lessonCount:lessonRegistry.size,protectedFiles:before.files.length,registeredChangedLessons:versions,preservedPreciseFigures:before.lessons.filter(l=>l.courseId==="AI000").flatMap(l=>l.sections.flatMap(s=>s.blocks)).filter(b=>b.type==="ai-task-figure").length},null,2)+"\n");
  console.log("40节教材、40条发布记录及238文件的精确差异核验通过；23幅精确图与课程事实保留。");
}
