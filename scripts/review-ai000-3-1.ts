import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { lessonSchema, type Lesson } from "../src/content/models";
import { evidencePath } from "./evidence-path";

const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const fileDigest = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const baselinePath = evidencePath("BEFORE.json");
if (process.argv.includes("--baseline")) {
  writeFileSync(baselinePath, JSON.stringify({
    base: execFileSync("git", ["rev-parse", "HEAD"], {encoding:"utf8"}).trim(),
    workspace: execFileSync("git", ["status", "--short"], {encoding:"utf8"}),
    lessons: [...lessonRegistry.values()], publications: publicationManifest,
    curriculum: ["curriculum/AI技术课程体系_V1.0.md", "curriculum/AI技术课程目录_V1.0.json"].map(path => ({path,digest:fileDigest(path)})),
  }, null, 2)+"\n", {flag:"wx"});
  console.log("实际注册教材、发布清单、工作区及课程体系摘要已独占保存");
} else {
  const before = JSON.parse(readFileSync(baselinePath,"utf8")) as {lessons:Lesson[]; curriculum:{path:string;digest:string}[]};
  for (const old of before.lessons.filter(l=>l.id!=="AI000-C01-L03")) assert.equal(digest(lessonRegistry.get(old.id)),digest(old),old.id);
  for (const file of before.curriculum) assert.equal(fileDigest(file.path),file.digest,file.path);
  const old = before.lessons.find(l=>l.id==="AI000-C01-L03")!;
  const current = lessonRegistry.get(old.id)!;
  assert.equal(current.contentVersion,old.contentVersion);
  assert.deepEqual(current.objectives,old.objectives);
  assert.deepEqual(current.assessmentMap,old.assessmentMap);
  assert.deepEqual(current.sections.map(s=>s.id),old.sections.map(s=>s.id));
  const nonParagraphs = (l:Lesson) => l.sections.flatMap(s=>s.blocks).filter(b=>b.type!=="paragraph");
  assert.deepEqual(nonParagraphs(current),nonParagraphs(old));
  writeFileSync(evidencePath("AUTOMATION_AFTER.json"),JSON.stringify(current,null,2)+"\n");
  if (!process.argv.includes("--editorial-only")) {
    const lesson=lessonSchema.parse(lessonRegistry.get("AI000-C03-L01"));
    const exercises=lesson.sections.flatMap(s=>s.blocks).filter(b=>b.type==="exercise");
    assert.equal(exercises.length,2);
    for(const exercise of exercises) {
      assert.equal(exercise.hints.length,2);
      assert.ok(exercise.solution.some(s=>s.includes("常见错误")));
      assert.ok(exercise.rubric.length>=3);
    }
    const course=getLearningCourse("AI000")!;
    assert.equal(course.chapters.flatMap(c=>c.lessons).length,24);
    if(process.argv.includes("--final")) {
      assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C02-L02");
      assert.equal(getAdjacentLessons(course,"AI000-C02-L02").next?.lessonId,lesson.id);
      assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,"AI000-C03-L02");
      assert.equal(course.chapters.flatMap(c=>c.lessons).filter(l=>l.href).length,7);
      assert.ok(resolveLesson("AI000",lesson.id));
    } else {
      assert.equal(resolveLesson("AI000",lesson.id),undefined);
      assert.equal(publicationManifest.find(p=>p.lessonId===lesson.id)?.access,"private");
    }
    writeFileSync(evidencePath(process.argv.includes("--final")?"LESSON_AFTER.json":"LESSON_DRAFT.json"),JSON.stringify(lesson,null,2)+"\n");
  }
  writeFileSync(evidencePath(process.argv.includes("--editorial-only")?"EDITORIAL_CHECK.json":process.argv.includes("--final")?"CONTENT_CHECK.json":"DRAFT_CHECK.json"),JSON.stringify({
    checkedAt:new Date().toISOString(),unchangedLessons:before.lessons.length-1,curriculumUnchanged:true,
    automationVersion:current.contentVersion,goalsExercisesFiguresAndAnchorsUnchanged:true,
    stage:process.argv.includes("--editorial-only")?"editorial":process.argv.includes("--final")?"preview":"private",
  },null,2)+"\n");
  console.log("27节其他教材、原课程事实不变；1.3仅段落语言调整，r1/目标/题/图/锚点保留");
}
