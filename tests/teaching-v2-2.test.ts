import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { maV22LessonIds,legacyMathSlots } from "../src/content/math-outline";
import { getLearningCourse,getAdjacentLessons,resolveLesson,lessonSummaries } from "../src/lib/course-engine";
import { createProgressStore,parseReadingProgress,progressKey } from "../src/lib/learning-progress";
import { summarizeCourseReading } from "../src/lib/course-reading-summary";
import { add2,scale2,displacement2,teachingU,teachingV,vectorPixel,vectorView,scalingFactors } from "../src/lib/vector-teaching";
import { CourseContents } from "../src/components/lesson/course-contents";
import { VectorFigure } from "../src/components/lesson/vector-figure";

test("V2.2 新 ID 和显示顺序分离，筹备内容无链接，旧稿完全退出新版目录",()=>{
  const course=getLearningCourse("MA101")!;
  const c2=course.chapters[1].lessons,c3=course.chapters[2].lessons;
  assert.deepEqual(c2.map(l=>l.displayNumber),["2.1","2.2","2.3","2.4","2.5","2.6","2.7","2.8"]);
  assert.deepEqual(c3.map(l=>l.displayNumber),["3.1","3.2","3.3","3.4","3.5","3.6"]);
  assert.deepEqual(c2.filter(l=>l.href).map(l=>l.lessonId),maV22LessonIds);
  assert.ok([...c2.slice(4),...c3].every(l=>l.status==="planned"&&!l.href));
  assert.deepEqual(new Set(course.legacyLessons.map(l=>l.lessonId)),new Set(legacyMathSlots.map(l=>l.lessonId)));
  assert.equal(getAdjacentLessons(course,maV22LessonIds[0]).previous,undefined);
  assert.equal(getAdjacentLessons(course,maV22LessonIds[0]).next?.displayNumber,"2.2");
  assert.equal(getAdjacentLessons(course,maV22LessonIds[3]).next,undefined);
  for(const old of legacyMathSlots) {
    assert.ok(resolveLesson("MA101",old.lessonId));
    assert.deepEqual(getAdjacentLessons(course,old.lessonId),{});
  }
  const anchors:Record<string,string[]>={
    "MA101-C02-L01":["vectors","code","quiz","verification","summary"],
    "MA101-C02-L02":["dot","code","quiz","verification","summary"],
    "MA101-C03-L01":["vectors","matrices","multiply","code","quiz","verification","summary"],
    "MA101-C03-L02":["multiply","code","quiz","verification","summary"],
    "MA101-C03-L03":["shapes","code","quiz","verification","legacy-validation","summary"],
  };
  for(const [id,sections] of Object.entries(anchors)) {
    const lesson=resolveLesson("MA101",id)!.lesson;
    assert.equal(lesson.contentVersion,1);
    assert.deepEqual(lesson.sections.map(s=>s.id),sections);
  }
});
test("V2.2 五篇旧稿全部完成也不会产生一篇新版已读，新记录互相隔离",()=>{
  const memory=new Map<string,string>();
  const store=createProgressStore(()=>({getItem:(key)=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,value)}));
  const lessons=lessonSummaries.filter(l=>l.courseId==="MA101");
  const records=legacyMathSlots.map(old=>{
    const lesson=lessons.find(l=>l.lessonId===old.lessonId)!;
    const scope={courseId:"MA101",lessonId:lesson.lessonId,contentVersion:1,sectionIds:lesson.sectionTitles.map(s=>s.id)};
    store.save(scope,100,scope.sectionIds[0],true);
    return {lesson,progress:parseReadingProgress(store.getSnapshot(scope),scope)!};
  });
  const before=summarizeCourseReading(lessons,records)[0];
  assert.equal(before.available,4);assert.equal(before.completed,0);assert.equal(before.percent,0);
  for(const id of maV22LessonIds) {
    const l=resolveLesson("MA101",id)!.lesson;
    const scope={courseId:l.courseId,lessonId:id,contentVersion:1,sectionIds:l.sections.map(s=>s.id)};
    assert.equal(store.getSnapshot(scope),null);
    assert.ok(!memory.has(progressKey(scope)));
  }
  const first=lessons.find(l=>l.lessonId===maV22LessonIds[0])!;
  const scope={courseId:first.courseId,lessonId:first.lessonId,contentVersion:1,sectionIds:first.sectionTitles.map(s=>s.id)};
  store.save(scope,100,scope.sectionIds[0],true);
  const after=summarizeCourseReading(lessons,[...records,{lesson:first,progress:parseReadingProgress(store.getSnapshot(scope),scope)!}])[0];
  assert.equal(after.completed,1);assert.equal(after.percent,25);
});
test("V2.2 每篇有独立闭环，核心无 Python 要求，目标验收不依赖可选挑战",()=>{
  for(const id of maV22LessonIds) {
    const lesson=resolveLesson("MA101",id)!.lesson;
    const core=lesson.sections.filter(s=>s.tier==="core");
    const blocks=core.flatMap(s=>s.blocks);
    assert.ok(["scene","worked","definition","mistakes","practice","summary"].every(part=>core.some(s=>s.id===part)),id);
    assert.ok(blocks.some(b=>b.type==="vector-figure"));
    assert.ok(blocks.filter(b=>b.type==="exercise").length>=2);
    assert.equal(blocks.some(b=>b.type==="code"),false);
    assert.equal(lesson.sections.filter(s=>s.tier!=="core").flatMap(s=>s.blocks).filter(b=>b.type==="exercise").length,1);
    for(const mapping of lesson.assessmentMap) for(const exercise of mapping.exerciseIds)
      assert.ok(blocks.some(b=>b.type==="exercise"&&b.id===exercise));
    // 不用字数作为教学通过线；只禁止把新课意外退化为概述。
    assert.ok(blocks.filter(b=>b.type==="paragraph").length>=15);
  }
});
test("V2.2 目录只有独立课时链接，文章目录与服务器完成空态分离",()=>{
  const course=getLearningCourse("MA101")!;
  const current=resolveLesson("MA101",maV22LessonIds[0])!.lesson;
  const html=renderToStaticMarkup(createElement(CourseContents,{course,currentLesson:current,progressLessons:lessonSummaries.filter(l=>l.courseId==="MA101")}));
  assert.doesNotMatch(html,/href="#(?:scene|worked|definition|practice)"/);
  assert.match(html,/aria-current="page"/);
  assert.match(html,/10 章/);
  assert.match(html,/0%/);
  assert.doesNotMatch(html,/aria-label="已读完"/);
  assert.equal((html.match(/aria-label="未读完"/g)||[]).length,4);
  assert.doesNotMatch(html,/href="\/learn\/MA101\/MA101-C02-L07"/);
});
test("V2.2 几何图解与数值一致，坐标比例不失真，零倍数不画方向箭头",()=>{
  assert.deepEqual(add2(teachingU,teachingV),[2,3]);
  assert.deepEqual(displacement2([1,1],[4,3]),teachingU);
  assert.deepEqual(displacement2([5,-1],[7,2]),[2,3]);
  assert.deepEqual(scalingFactors.map(c=>scale2(c,teachingU)),[[6,4],[1.5,1],[-3,-2],[0,0]]);
  const base=vectorPixel([0,0]),x=vectorPixel([1,0]),y=vectorPixel([0,1]);
  assert.equal(x[0]-base[0],vectorView.scale);assert.equal(base[1]-y[1],vectorView.scale);
  for(const kind of ["meaning","components","addition","scaling"] as const) {
    const html=renderToStaticMarkup(createElement(VectorFigure,{kind}));
    assert.match(html,/<title/);assert.match(html,/<desc/);assert.doesNotMatch(html,/NaN|Infinity/);
    if(kind==="scaling") assert.match(html,/零向量无确定方向/);
  }
});
