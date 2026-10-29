import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { ai000ChapterLessons } from "../src/content/ai000-outline";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { lessonSchema, isReadable } from "../src/content/models";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";

// 只读现行注册内容；输出结构证据，不将自动检查冒称逐概念专业审稿。
const course=getLearningCourse("AI000")!,slots=course.chapters.flatMap(c=>c.lessons);
const expected=ai000ChapterLessons.flatMap((chapter,c)=>chapter.map((_,i)=>`AI000-C${String(c+1).padStart(2,"0")}-L${String(i+1).padStart(2,"0")}`));
assert.equal(expected.length,24);assert.deepEqual(slots.map(l=>l.lessonId),expected);
const entries=expected.map(id=>publicationManifest.find(p=>p.lessonId===id)!);
const readable=entries.filter(isReadable).map(p=>p.lessonId);
assert.equal(course.status,"planned");assert.equal(course.hours,"6–10");
if(process.argv.includes("--final")){assert.equal(readable.length,24);assert.ok(entries.every(p=>p.status==="pending-review"&&p.access==="preview"&&!p.reviewEvidence));}
for(const [i,id] of readable.entries()) {const adjacent=getAdjacentLessons(course,id);assert.equal(adjacent.previous?.lessonId,readable[i-1]);assert.equal(adjacent.next?.lessonId,readable[i+1]);}
const rows=expected.map(id=>{
  const lesson=lessonRegistry.get(id)!;lessonSchema.parse(lesson);
  const blocks=lesson.sections.flatMap(s=>s.blocks),exercises=blocks.filter(b=>b.type==="exercise");
  const links=[...lesson.prerequisiteLinks,...blocks.filter(b=>b.type==="reading-links").flatMap(b=>b.links),...(lesson.legacyAnchors??[])];
  for(const link of links){
    const [path,hash]=link.href.split("#");
    if(path.startsWith("/learn/")){const parts=path.split("/"),target=resolveLesson(parts[2],parts[3]);assert.ok(target,`${id}: ${link.href}`);if(hash)assert.ok([...target.lesson.sections.map(s=>s.id),...target.lesson.sections.flatMap(s=>s.blocks).filter(b=>b.type==="exercise").map(b=>`exercise-${b.id}`)].includes(hash),link.href);}
    else if(path.startsWith("/courses/")){const target=getLearningCourse(path.split("/")[2]);assert.ok(target,link.href);if(hash)assert.ok(target.chapters.some(ch=>ch.id===hash),link.href);}
  }
  return {id,title:lesson.title,version:lesson.contentVersion,publication:entries.find(p=>p.lessonId===id),prerequisites:lesson.prerequisites,prerequisiteLinks:lesson.prerequisiteLinks,sections:lesson.sections.map(s=>({id:s.id,title:s.title,tier:s.tier})),objectives:lesson.assessmentMap.map(m=>({number:m.objective,text:lesson.objectives[m.objective-1],exerciseIds:m.exerciseIds})),exercises:exercises.map(q=>({id:q.id,title:q.title,prompt:q.prompt,hints:q.hints,rubric:q.rubric,solutionSteps:q.solution.length,tier:lesson.sections.find(s=>s.blocks.some(b=>b.type==="exercise"&&b.id===q.id))!.tier})),preciseFigures:blocks.filter(b=>b.type==="ai-task-figure").map(b=>b.kind),localLinksChecked:links.filter(l=>l.href.startsWith("/")).length};
});
assert.equal(rows.reduce((sum,r)=>sum+r.preciseFigures.length,0),23);
const report={checkedAt:new Date().toISOString(),scope:"当前24节只读结构/顺序/链接/映射；语义与提示逐课辅助审读见COURSE_READONLY_REVIEW.md，专业审核和学生效度未验证",course:{id:course.id,status:course.status,originalHours:course.hours,goal:course.goal,labs:course.labs,project:course.project,accept:course.accept},written:rows.length,readable:readable.length,objectives:rows.reduce((n,r)=>n+r.objectives.length,0),coreExercises:rows.reduce((n,r)=>n+r.exercises.filter(q=>q.tier==="core").length,0),preciseFigures:23,estimate:getCourseStudyEstimate("AI000"),rows};
writeFileSync("docs/ai000-7-3/COURSE_STRUCTURE.json",JSON.stringify(report,null,2)+"\n");
console.log(`${report.written}节正文/${report.readable}节可读；${report.objectives}目标/${report.coreExercises}核心任务，23精确图，顺序/链接/映射/状态检查通过`);
