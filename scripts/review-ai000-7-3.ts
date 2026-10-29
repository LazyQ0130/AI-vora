import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import type { Lesson, Publication } from "../src/content/models";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";

const dir = "docs/ai000-7-3";
const sha = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const git = (...args: string[]) => execFileSync("git", args, { encoding: "utf8" });
export type CapstoneBaseline = { base: string; remote: string; workspace: string; lessons: Lesson[]; publications: Publication[]; files: {path:string;sha256:string}[] };
if (process.argv[1]?.replaceAll("\\", "/").endsWith("/review-ai000-7-3.ts")) {
  mkdirSync(dir, {recursive:true});
  if (process.argv.includes("--baseline")) {
    const paths = git("ls-files", "-z", "curriculum", "src", "public").split("\0").filter(Boolean);
    writeFileSync(`${dir}/BEFORE.json`, JSON.stringify({base:git("rev-parse","HEAD").trim(),remote:git("rev-parse","origin/main").trim(),workspace:git("status","--short"),lessons:[...lessonRegistry.values()],publications:publicationManifest,files:paths.map(path=>({path,sha256:sha(readFileSync(path))}))},null,2)+"\n", {flag:"wx"});
    console.log(`独占保存${lessonRegistry.size}节完整教材、${publicationManifest.length}条发布及${paths.length}文件摘要`);
  } else if (process.argv.includes("--export-questions")) {
    const lesson=lessonRegistry.get("AI000-C07-L03")!;
    writeFileSync(`${dir}/QUESTIONS_ONLY.json`,JSON.stringify(lesson.sections.filter(s=>s.blocks.some(b=>b.type==="exercise")).map(s=>({sectionId:s.id,given:s.blocks.filter(b=>b.type!=="exercise"),exercises:s.blocks.filter(b=>b.type==="exercise").map(q=>({id:q.id,title:q.title,prompt:q.prompt,hints:q.hints}))})),null,2)+"\n");
    console.log("只导出题设及提示，供另轮求解；不登记尚未完成的校验");
  } else if (process.argv.includes("--record-sources")) {
    const baseline=JSON.parse(readFileSync(`${dir}/BEFORE.json`,"utf8")) as CapstoneBaseline;
    assert.equal(git("rev-parse","HEAD").trim(),baseline.base,"只能在本轮改前基线上登记差异，提交后不覆盖历史清单");
    const paths=["src/lib/course-engine.ts","src/content/publication-manifest.ts","src/content/ai000-study-time.ts","src/app/ai000-lesson.css","src/app/courses/[id]/page.tsx"];
    const sources=paths.map(path=>{
      const lines=git("diff","--no-ext-diff","--unified=3","--",path).replaceAll("\r\n","\n").split("\n");
      const changes:{before:string;after:string}[]=[];
      let oldLines:string[]=[],newLines:string[]=[],inHunk=false;
      const flush=()=>{if(inHunk)changes.push({before:oldLines.join("\n")+"\n",after:newLines.join("\n")+"\n"});oldLines=[];newLines=[];};
      for(const line of lines){
        if(line.startsWith("@@ ")){flush();inHunk=true;continue;}
        if(!inHunk)continue;
        if(line.startsWith(" ")||line.startsWith("-"))oldLines.push(line.slice(1));
        if(line.startsWith(" ")||line.startsWith("+"))newLines.push(line.slice(1));
      }
      flush();
      assert.ok(changes.length>0,`${path}必须有实际变更，不能用空清单覆盖记录`);
      const current=readFileSync(path,"utf8").replaceAll("\r\n","\n");
      for(const edit of changes)assert.equal(current.split(edit.after).length,2,`${path}上下文须唯一`);
      return {path,changes};
    });
    writeFileSync(`${dir}/SOURCE_CHANGES.json`,JSON.stringify({base:git("rev-parse","HEAD").trim(),sources},null,2)+"\n");
    console.log("登记5个接入/学时/局部题干样式/课程学时说明文件的精确上下文变更");
  } else {
    const before = JSON.parse(readFileSync(`${dir}/BEFORE.json`,"utf8")) as CapstoneBaseline;
    const { beforeCapstoneSource } = await import("./ai000-capstone-compatibility");
    for (const old of before.lessons) assert.equal(JSON.stringify(lessonRegistry.get(old.id)),JSON.stringify(old),old.id);
    for (const old of before.publications) assert.deepEqual(publicationManifest.find(p=>p.lessonId===old.lessonId),old,old.lessonId);
    for (const file of before.files) {
      const bytes=readFileSync(file.path); if(sha(bytes)===file.sha256)continue;
      const source=beforeCapstoneSource(file.path,bytes.toString("utf8")).replaceAll("\r\n","\n");
      assert.ok([source,source.replaceAll("\n","\r\n")].some(s=>sha(Buffer.from(s))===file.sha256),file.path);
    }
    assert.equal(lessonRegistry.size,before.lessons.length+1); assert.equal(publicationManifest.length,before.publications.length+1);
    const id="AI000-C07-L03",lesson=lessonRegistry.get(id)!,publication=publicationManifest.find(p=>p.lessonId===id)!,course=getLearningCourse("AI000")!;
    assert.equal(lesson.contentVersion,1); assert.equal(publication.contentVersion,1); assert.equal(course.status,"planned"); assert.equal(publication.reviewEvidence,undefined);
    for(const slot of course.chapters[6].lessons.slice(3)){assert.equal(slot.status,"planned");assert.equal(slot.href,undefined);assert.equal(lessonRegistry.has(slot.lessonId),false);}
    const final=process.argv.includes("--final");
    if(final){assert.equal(publication.status,"pending-review");assert.equal(publication.access,"preview");assert.ok(resolveLesson("AI000",id));assert.equal(getAdjacentLessons(course,"AI000-C07-L02").next?.lessonId,id);assert.equal(getAdjacentLessons(course,id).previous?.lessonId,"AI000-C07-L02");assert.equal(getAdjacentLessons(course,id).next,undefined);}
    else {assert.equal(publication.status,"draft");assert.equal(publication.access,"private");assert.equal(resolveLesson("AI000",id),undefined);}
    writeFileSync(`${dir}/${final?"FINAL":"DRAFT"}_CHECK.json`,JSON.stringify({checkedAt:new Date().toISOString(),base:before.base,unchangedOldLessons:before.lessons.length,unchangedPublications:before.publications.length,protectedFiles:before.files.length,preservedPreciseFigures:before.lessons.filter(l=>l.courseId==="AI000").flatMap(l=>l.sections.flatMap(s=>s.blocks)).filter(b=>b.type==="ai-task-figure").length,publication,assessmentMap:lesson.assessmentMap},null,2)+"\n");
    writeFileSync(`${dir}/LESSON.json`,JSON.stringify(lesson,null,2)+"\n");
    const { capstoneReportTemplate, capstoneNotices }=await import("../src/content/lessons/ai000/capstone-example");
    writeFileSync(`${dir}/REPORT_TEMPLATE.md`,capstoneReportTemplate);
    writeFileSync(`${dir}/NOTICE_INPUTS.json`,JSON.stringify(capstoneNotices,null,2)+"\n");
    writeFileSync(`${dir}/QUESTIONS_ONLY.json`,JSON.stringify(lesson.sections.filter(s=>s.blocks.some(b=>b.type==="exercise")).map(s=>({sectionId:s.id,given:s.blocks.filter(b=>b.type!=="exercise"),exercises:s.blocks.filter(b=>b.type==="exercise").map(q=>({id:q.id,title:q.title,prompt:q.prompt,hints:q.hints}))})),null,2)+"\n");
    writeFileSync(`${dir}/TIME_ESTIMATE.json`,JSON.stringify(getCourseStudyEstimate("AI000"),null,2)+"\n");
    writeFileSync(`${dir}/COURSE_STATUS.json`,JSON.stringify(["PY101","MA101","DS101","ST101","ML201","ML202","ML203","DL301","DL302","DL303","NLP401","LLM401","LLM402","CV401","MM401","RL401","GM401"].map(id=>{
      const c=getLearningCourse(id)!;
      return {id,level:c.lvl,name:c.name,prerequisites:c.req,status:c.status,readableCurrent:c.chapters.flatMap(ch=>ch.lessons).filter(l=>l.href).map(l=>({id:l.lessonId,title:l.title,href:l.href,status:l.status,version:l.contentVersion})),legacy:c.legacyLessons.map(l=>({id:l.lessonId,status:l.status,version:l.contentVersion}))};
    }),null,2)+"\n");
    console.log(`${final?"预览":"私有草稿"}核验通过，46旧课/发布与全部保护文件保持`);
  }
}
