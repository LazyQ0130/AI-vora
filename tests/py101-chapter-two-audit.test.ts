import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {lessonRegistry,getLearningCourse,getAdjacentLessons,resolveLesson} from "./helpers/py101-p14-view";
import {publicationManifest} from "./helpers/py101-p14-view";
import {courseOutline} from "./helpers/py101-p14-view";
import {lessonProgressScope} from "../src/lib/use-learning-progress";
import {createProgressStore,parseReadingProgress,progressKey} from "../src/lib/learning-progress";
import {beforeApprovedPy101Object,beforeApprovedPy101Source} from "../scripts/py101-p1-compatibility";
const read=(name:string)=>JSON.parse(readFileSync(`docs/py101-p14/${name}.json`,"utf8"));
const sha=(value:unknown)=>createHash("sha256").update(JSON.stringify(value)).digest("hex");

test("[P0–P14历史契约] P14四处全对象仅替末段，依据指针/r1/scope精确登记，未批准附加改写仍拒绝",()=>{
 const plan=read("APPROVED_CHANGES"),changes=read("TRANSITION_AMENDMENTS");
 assert.deepEqual(plan.addedLessonIds,[]);
 assert.deepEqual(plan.lessons.map((r:{id:string})=>r.id),[1,2,3,4].map(n=>`PY101-C02-L0${n}`));
 assert.equal(changes.records.length,plan.lessons.length);
 for(const row of plan.lessons){
  const current=lessonRegistry.get(row.id)!,expected=structuredClone(row.before),record=changes.records.find((r:{lessonId:string})=>r.lessonId===row.id);
  const oldSection=expected.sections.find((s:{id:string})=>s.id===record.sectionId);
  assert.equal(oldSection.blocks[record.blockIndex].text,record.before);
  oldSection.blocks[record.blockIndex].text=record.after;
  assert.deepEqual(current,expected);assert.equal(sha(current),row.afterSha256);
  assert.equal(current.contentVersion,1);assert.deepEqual(lessonProgressScope(current),lessonProgressScope(row.before));
  const p=publicationManifest.find(p=>p.lessonId===row.id)!,old=plan.publications.find((r:{id:string})=>r.id===row.id);
  assert.deepEqual(p,{...old.before,technicalEvidence:"docs/py101-p14/TRANSITION_AMENDMENTS.md"});
  assert.deepEqual(beforeApprovedPy101Object("lessons",row.id,current,plan.baseline),row.before);
  const tampered=structuredClone(current);tampered.objectives[0]+=" 未授权变化";
  assert.deepEqual(beforeApprovedPy101Object("lessons",row.id,tampered,plan.baseline),tampered);
  const changedPub={...p,contentVersion:2};assert.deepEqual(beforeApprovedPy101Object("publications",row.id,changedPub,plan.baseline),changedPub);
 }
 for(const row of plan.sources){
  const actual=readFileSync(row.path,"utf8");assert.equal(beforeApprovedPy101Source(row.path,actual,plan.baseline),row.before);
  assert.equal(beforeApprovedPy101Source(row.path,actual+"\n// unapproved",plan.baseline),actual+"\n// unapproved");
 }
});

test("[P0–P14历史契约] P14未新增或移除注册，所有非授权Lesson/Publication完整摘要及第二章映射保留",()=>{
 const base=read("BASELINE"),plan=read("APPROVED_CHANGES"),inventory=read("INVENTORY");
 assert.deepEqual([...lessonRegistry.keys()].sort(),Object.keys(base.lessons).sort());
 for(const [id,digest]of Object.entries(base.lessons))if(!plan.lessons.some((r:{id:string})=>r.id===id))assert.equal(sha(lessonRegistry.get(id)),digest,id);
 for(const [id,digest]of Object.entries(base.publications))if(!plan.publications.some((r:{id:string})=>r.id===id))assert.equal(sha(publicationManifest.find(p=>p.lessonId===id)),digest,id);
 const chapter=getLearningCourse("PY101")!.chapters.find(c=>c.id==="PY101-C02")!;
 const lessons=chapter.lessons.map(e=>lessonRegistry.get(e.lessonId)!);
 assert.equal(inventory.objectiveCount,lessons.reduce((n,l)=>n+l.objectives.length,0));
 for(const l of lessons){
  const core=l.sections.filter(s=>s.tier==="core").flatMap(s=>s.blocks).filter(b=>b.type==="exercise");
  assert.deepEqual(l.assessmentMap,inventory.lessons.find((r:{id:string})=>r.id===l.id).assessmentMap);
  for(const map of l.assessmentMap){assert.ok(l.objectives[map.objective-1]);for(const id of map.exerciseIds)assert.ok(core.some(e=>e.id===id));}
 }
 assert.equal(inventory.coreExerciseCount,lessons.reduce((n,l)=>n+l.sections.filter(s=>s.tier==="core").flatMap(s=>s.blocks).filter(b=>b.type==="exercise").length,0));
});

test("[P0–P14历史契约] P14保持六节顺序/相邻导航/待审状态，第三章及2.7未注册，错误归属不可读",()=>{
 const course=getLearningCourse("PY101")!,chapter=course.chapters.find(c=>c.id==="PY101-C02")!;
 assert.equal(course.status,"planned");assert.deepEqual(chapter.lessons.map(l=>l.order),[1,2,3,4,5,6]);
 for(const [i,e]of chapter.lessons.entries()){
  assert.deepEqual([e.contentVersion,e.status,e.access,e.optionalLesson,e.reviewEvidence],[1,"pending-review","preview",false,undefined]);assert.ok(resolveLesson("PY101",e.lessonId));
  if(i<chapter.lessons.length-1)assert.equal(getAdjacentLessons(course,e.lessonId).next?.lessonId,chapter.lessons[i+1].lessonId);
 }
 assert.equal(getAdjacentLessons(course,chapter.lessons.at(-1)!.lessonId).next?.lessonId,"PY101-C05-L01");
 assert.equal(courseOutline.some(e=>e.chapterId==="PY101-C03"),false);assert.equal(publicationManifest.some(e=>e.chapterId==="PY101-C03"),false);
 assert.equal(resolveLesson("PY101","PY101-C02-L07"),undefined);assert.equal(resolveLesson("PY101","PY101-C03-L01"),undefined);assert.equal(resolveLesson("ML201",chapter.lessons[0].lessonId),undefined);
});

test("[P0–P14历史契约] P14四课旧完成记录按同一scope重载，其他课及所有旧修订不删除/覆盖",()=>{
 const plan=read("APPROVED_CHANGES"),memory=new Map<string,string>(),storage={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}},store=createProgressStore(()=>storage);
 for(const lesson of lessonRegistry.values()){
  const scope=lessonProgressScope(lesson);store.save(scope,100,scope.sectionIds.at(-1)!,true);
  for(let r=1;r<scope.contentVersion;r++)store.save({...scope,contentVersion:r},100,scope.sectionIds[0],true);
 }
 const before=new Map(memory),reload=createProgressStore(()=>storage);
 for(const row of plan.lessons){const old=lessonProgressScope(row.before),now=lessonProgressScope(lessonRegistry.get(row.id)!);assert.equal(progressKey(old),progressKey(now));const restored=parseReadingProgress(reload.getSnapshot(now),now);assert.equal(restored?.completed,true);assert.equal(restored?.section,old.sectionIds.at(-1));}
 assert.deepEqual(memory,before);
});
