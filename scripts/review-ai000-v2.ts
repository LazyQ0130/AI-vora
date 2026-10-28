import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { lessonSchema, isReadable, type Lesson } from "../src/content/models";
import { evidencePath } from "./evidence-path";

const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const baselinePath = evidencePath("BEFORE.json");
if (process.argv.includes("--baseline")) {
  writeFileSync(baselinePath, JSON.stringify({
    base: "807beba2408fbabd83b9cfe1f1524895df4e8573",
    lessons: [...lessonRegistry.values()],
    publications: publicationManifest,
    curriculum: ["curriculum/AI技术课程体系_V1.0.md", "curriculum/AI技术课程目录_V1.0.json"].map(path => ({path, digest:createHash("sha256").update(readFileSync(path)).digest("hex")})),
  }, null, 2)+"\n", {flag:"wx"});
  console.log("25节实际注册全文、清单及原始课程体系摘要已独占保存");
} else {
  const before = JSON.parse(readFileSync(baselinePath,"utf8")) as {lessons:Lesson[]; curriculum?:{path:string;digest:string}[]; protectedFiles?:{path:string;hash?:string;sha256?:string}[]};
  for (const old of before.lessons.filter(l=>l.courseId!=="AI000")) assert.equal(digest(lessonRegistry.get(old.id)),digest(old),old.id);
  const curriculum = before.curriculum ?? before.protectedFiles?.filter(f=>f.path.startsWith("curriculum/")).map(f=>({path:f.path,digest:f.hash ?? f.sha256}));
  assert.equal(curriculum?.length,2,"需要本轮两份原始课程事实的真实基线摘要");
  for (const file of curriculum!) assert.equal(createHash("sha256").update(readFileSync(file.path)).digest("hex"),file.digest,file.path);
  const requested = process.argv.indexOf("--lesson");
  const ids = requested>=0 ? [process.argv[requested+1]] : [...lessonRegistry.values()].filter(l=>l.courseId==="AI000").map(l=>l.id);
  const checks = ids.map(id=>{
    const lesson=lessonSchema.parse(lessonRegistry.get(id));
    const publication=publicationManifest.find(p=>p.lessonId===id)!;
    const blocks=lesson.sections.flatMap(s=>s.blocks);
    assert.ok(blocks.filter(b=>b.type==="exercise").length>=2);
    for(const exercise of blocks.filter(b=>b.type==="exercise")) {
      assert.equal(exercise.hints.length,2);
      assert.ok(exercise.solution.some(s=>s.includes("常见错误")));
      assert.ok(exercise.rubric.length>=3);
    }
    assert.ok(blocks.every(b=>!["code","experiment","math"].includes(b.type)));
    assert.equal(lesson.objectiveDisplay?.length,lesson.objectives.length);
    assert.equal(isReadable(publication),Boolean(resolveLesson("AI000",id)));
    writeFileSync(evidencePath(`${id}_AFTER.json`),JSON.stringify(lesson,null,2)+"\n");
    return {id,version:lesson.contentVersion,status:publication.status,access:publication.access,objectives:lesson.assessmentMap,sections:lesson.sections.map(s=>s.id),exercises:blocks.filter(b=>b.type==="exercise").map(b=>b.id)};
  });
  const course=getLearningCourse("AI000")!;
  assert.equal(course.chapters.length,7);
  assert.equal(course.status,"planned");
  if(process.argv.includes("--final")) {
    assert.equal(course.chapters.flatMap(c=>c.lessons).length,24);
    const ordered=["AI000-C01-L01","AI000-C01-L02","AI000-C01-L03","AI000-C02-L01","AI000-C02-L02","AI000-C03-L01","AI000-C03-L02","AI000-C03-L03","AI000-C03-L04","AI000-C04-L01","AI000-C04-L02","AI000-C04-L03","AI000-C04-L04","AI000-C05-L01","AI000-C05-L02","AI000-C05-L03"];
    assert.deepEqual(course.chapters.flatMap(c=>c.lessons).filter(l=>l.href).map(l=>l.lessonId),ordered);
    ordered.forEach((id,index)=>{
      const next=getAdjacentLessons(course,id);
      assert.equal(next.previous?.lessonId,ordered[index-1]);
      assert.equal(next.next?.lessonId,ordered[index+1]);
    });
  }
  writeFileSync(evidencePath(requested>=0?`${ids[0]}_CHECK.json`:"CONTENT_CHECKS.json"),JSON.stringify({checkedAt:new Date().toISOString(),unchangedOtherLessons:before.lessons.filter(l=>l.courseId!=="AI000").length,curriculumUnchanged:true,checks},null,2)+"\n");
  console.log(`${checks.length}节结构/映射核验，23节其他教材及原始课程体系保持不变`);
}
