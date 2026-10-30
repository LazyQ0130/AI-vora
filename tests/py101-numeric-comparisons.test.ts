import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { pythonNumericComparisonsLesson as lesson } from "../src/content/lessons/py101/numeric-comparisons";
import { comparisonCode, comparisonBlockNames, comparisonSetups } from "../src/content/resources/python-comparisons";
import { comparisonKey, comparisonExpected, checkComparisonResult } from "../scripts/validate-py101-comparisons";
import { publicationManifest } from "../src/content/publication-manifest";
import { courseOutline } from "../src/content/course-outline";
import { isReadable, publicationSchema } from "../src/content/models";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { progressKey, createProgressStore, parseReadingProgress } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { beforeApprovedPy101Source, beforeApprovedPy101Object } from "../scripts/py101-p1-compatibility";
import { assertRegisteredInventory, assertCourseAvailability } from "./helpers/registered-content";
const read=(name:string)=>JSON.parse(readFileSync(`docs/py101-p11/${name}.json`,"utf8"));
const sha=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");

test("2.4身份/order4/r1与实际草稿门禁，技术后试读不冒充人工审核",()=>{
  const entry=publicationManifest.find(p=>p.lessonId===lesson.id)!;
  assert.deepEqual([entry.title,entry.courseId,entry.chapterId,entry.order,entry.contentVersion,entry.optionalLesson],[lesson.title,"PY101","PY101-C02",4,1,false]);assert.equal(courseOutline.find(s=>s.lessonId===lesson.id)?.order,4);
  const g=read("DRAFT_GATE");assert.deepEqual([g.status,g.access,g.readable,g.resolveUndefined,g.directoryHrefAbsent],["draft","private",false,true,true]);
  assert.equal(isReadable({...entry,status:"draft",access:"private",technicalEvidence:undefined}),false);assert.throws(()=>publicationSchema.parse({...entry,status:"draft",access:"preview"}));assert.throws(()=>publicationSchema.parse({...entry,status:"pending-review",access:"preview",technicalEvidence:undefined}));assert.equal(entry.reviewEvidence,undefined);
  if(entry.status==="draft")assert.equal(resolveLesson("PY101",lesson.id),undefined);else{assert.deepEqual([entry.status,entry.access,entry.technicalEvidence],["pending-review","preview","docs/py101-p11/TECHNICAL_REPORT.md"]);assert.ok(resolveLesson("PY101",lesson.id));}
  assertRegisteredInventory();assertCourseAvailability("PY101");
});

test("三目标映射两项核心代码操作，提示不代填真假表，分项估时与反馈齐全",()=>{
  const tasks=lesson.sections.filter(s=>s.tier==="core").flatMap(s=>s.blocks).filter(b=>b.type==="exercise");assert.deepEqual(tasks.map(t=>t.id),["compare-and-explain","test-boundary-values"]);
  assert.deepEqual(lesson.assessmentMap,[{objective:1,exerciseIds:tasks.map(t=>t.id)},{objective:2,exerciseIds:[tasks[0].id]},{objective:3,exerciseIds:[tasks[1].id]}]);
  for(const t of tasks){assert.equal(t.kind,"代码");assert.equal(t.hints.length,2);assert.ok(t.solution.length>=4);assert.ok(t.rubric.length>=3);assert.doesNotMatch(t.hints.join(""),/loaded_books|cart_capacity|art_total|True|False| = /);}
  assert.match(tasks[1].prompt,/第二轮只改实际量/);assert.match(tasks[1].prompt,/第三轮只改实际量/);assert.deepEqual(lesson.learningTime,{reading:[10,15],practice:[6,10],coding:[12,18],basis:"editorial-estimate"});assert.deepEqual(lesson.resources,[]);
});

test("六符号同源且每式仅比较两值，未知/改写代码不能被网页验证器略过",()=>{
  const blocks=lesson.sections.flatMap(s=>s.blocks).filter(b=>b.type==="code").filter(b=>b.language==="python");assert.deepEqual(blocks.map(b=>comparisonKey(b.filename,b.code)),["basic","saveResult","equalNot","assignCompare","greater","main","boundaryLow","allAtCapacity"]);
  assert.equal(comparisonSetups.saveResult,"count = 5\nlimit = 6");assert.equal(comparisonSetups.equalNot,comparisonSetups.saveResult);
  const operators=new Set<string>();for(const b of blocks){assert.doesNotMatch(b.code,/\b(input|int|float|bool|str)\s*\(|\b(if|elif|else|for|while|and|or|not|is|import|def|try|except)\b/);for(const line of b.code.split("\n")){const matches=line.match(/<=|>=|==|!=|[<>]/g)??[];assert.ok(matches.length<=1,"不引入链式比较");matches.forEach(op=>operators.add(op));}}
  assert.deepEqual([...operators].sort(),["<","<=",">",">=","==","!="].sort());assert.throws(()=>comparisonKey("unknown.py","print(True)"));assert.throws(()=>comparisonKey(comparisonBlockNames.main,comparisonCode.main.replace("<=","<")));
});

test("主例、相等/不等与边界预期独立，错误类型/缺行/无关异常均被拒绝",()=>{
  assert.equal(comparisonExpected.main,"True\nFalse\nTrue\n");assert.equal(comparisonExpected.assignCompare,"False\nTrue\n");assert.equal(comparisonExpected.greater,"True\nTrue\nFalse\n");assert.equal(comparisonExpected.boundaryEqual,"False\nTrue\nTrue\n");assert.equal(comparisonExpected.allAtCapacity,"At capacity\nFalse\nTrue\nFalse\nTrue\nTrue\nFalse\n");
  checkComparisonResult("boundaryEqual",{exitCode:0,stdout:"False\nTrue\nTrue\n",stderr:""});
  assert.throws(()=>checkComparisonResult("boundaryEqual",{exitCode:0,stdout:"False\nFalse\nTrue\n",stderr:""}));assert.throws(()=>checkComparisonResult("main",{exitCode:1,stdout:comparisonExpected.main,stderr:"TypeError"}));assert.throws(()=>checkComparisonResult("basic",{exitCode:0,stdout:"1\n",stderr:""}));assert.throws(()=>checkComparisonResult("main",{exitCode:0,stdout:"True\nFalse\n",stderr:""}));
});

test("真实保存文件三轮只改实际值，两个新题参考与陌生数据均有实际输出",()=>{
  const evidence=read("PYTHON_RUNS"),row=(label:string)=>evidence.rows.find((r:{label:string})=>r.label===label);assert.equal(evidence.platform,"win32");assert.equal(evidence.allAssertionsPassed,true);
  for(const k of Object.keys(comparisonCode) as (keyof typeof comparisonCode)[]){const r=row(k);checkComparisonResult(k,r);assert.equal(r.savedSource,(comparisonSetups[k]?comparisonSetups[k]+"\n":"")+comparisonCode[k]);}
  for(const [low,equal,high,from,to,above]of [["boundaryLow","boundaryEqual","boundaryHigh","count = 5","count = 6","count = 7"],["ownBoundaryLow","ownBoundaryEqual","ownBoundaryHigh","art_total = 9","art_total = 10","art_total = 11"],["new-boundary-low","new-boundary-equal","new-boundary-high","stock_total = 13","stock_total = 15","stock_total = 18"]]){
    assert.equal(row(low).filename,row(equal).filename);assert.equal(row(equal).filename,row(high).filename);assert.equal(row(low).savedSource.replace(from,to),row(equal).savedSource);assert.equal(row(low).savedSource.replace(from,above),row(high).savedSource);
  }
  assert.equal(row("follow-appends").stdout,"True\nTrue\nFalse\nTrue\n");assert.equal(row("stored-bool-type").stdout,"True\nFalse\nTrue\n<class 'bool'>\n");assert.equal(row("new-equal-context").stdout,"True\nTrue\nFalse\n");assert.equal(row("new-boundary-high").stdout,"False\nFalse\nTrue\n");
  assert.equal(new Set(evidence.rows.map((r:{shellPid:number})=>r.shellPid)).size,evidence.rows.length);assert.doesNotMatch(JSON.stringify(evidence),/[A-Za-z]:\\\\Users\\\\|token=/);
});

test("2.1和2.3仅各末段状态/依据指针，核心与r1 scope保持且未知改写不获豁免",()=>{
  const base=read("BASELINE"),ids=Object.keys(base.amendmentsBefore);
  assert.deepEqual(ids.sort(),["PY101-C02-L01","PY101-C02-L03"]);
  for(const id of ids){const before=base.amendmentsBefore[id],current=lessonRegistry.get(id)!,expected=structuredClone(before.lesson);expected.sections.at(-1).blocks[expected.sections.at(-1).blocks.length-1]=current.sections.at(-1)!.blocks.at(-1);assert.deepEqual(current,expected);assert.equal(current.contentVersion,1);assert.deepEqual(lessonProgressScope(current),lessonProgressScope(before.lesson));const pub=publicationManifest.find(p=>p.lessonId===id)!;assert.deepEqual(pub,{...before.publication,technicalEvidence:pub.technicalEvidence});if(pub.technicalEvidence!==before.publication.technicalEvidence)assert.equal(pub.technicalEvidence,"docs/py101-p11/TRANSITION_AMENDMENTS.md");const tampered=structuredClone(current);tampered.title+=" 未登记";assert.deepEqual(beforeApprovedPy101Object("lessons",id,tampered,base.head),tampered);}
  for(const [id,digest]of Object.entries(base.lessons))if(!ids.includes(id))assert.equal(sha(lessonRegistry.get(id)),digest,id);for(const [id,digest]of Object.entries(base.publications))if(!ids.includes(id))assert.equal(sha(publicationManifest.find(p=>p.lessonId===id)),digest,id);
  const source=readFileSync("src/lib/course-engine.ts","utf8"),plan=read("APPROVED_CHANGES");assert.equal(beforeApprovedPy101Source("src/lib/course-engine.ts",source,base.head),plan.sources.find((r:{path:string})=>r.path==="src/lib/course-engine.ts").before);assert.equal(beforeApprovedPy101Source("src/lib/course-engine.ts",source+"\n// unauthorized",base.head),source+"\n// unauthorized");
});

test("2.3到2.4相邻，2.5/2.6不注册且错误归属不可读，整课仍planned",()=>{
  const course=getLearningCourse("PY101")!;assert.equal(course.status,"planned");if(isReadable(publicationManifest.find(p=>p.lessonId===lesson.id)!)){assert.equal(getAdjacentLessons(course,"PY101-C02-L03").next?.lessonId,lesson.id);assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"PY101-C02-L03");assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,"PY101-C05-L01");}
  for(const id of ["PY101-C02-L05","PY101-C02-L06"]){assert.equal(courseOutline.some(s=>s.lessonId===id),false);assert.equal(lessonRegistry.has(id),false);assert.equal(publicationManifest.some(p=>p.lessonId===id),false);assert.equal(resolveLesson("PY101",id),undefined);}assert.equal(resolveLesson("ML201",lesson.id),undefined);
});

test("2.4新r1重载独立，不继承或覆盖旧课和旧修订完成记录",()=>{
  const memory=new Map<string,string>(),storage={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}},store=createProgressStore(()=>storage);
  for(const old of lessonRegistry.values())if(old.id!==lesson.id){const s=lessonProgressScope(old);store.save(s,100,s.sectionIds[0],true);if(s.contentVersion>1)store.save({...s,contentVersion:1},100,s.sectionIds[0],true);}
  const before=new Map(memory),scope=lessonProgressScope(lesson);assert.equal(progressKey(scope),"aivora:learning:v2:PY101:PY101-C02-L04:r1");assert.equal(store.getSnapshot(scope),null);store.save(scope,51,"boundary-runs");const restored=parseReadingProgress(createProgressStore(()=>storage).getSnapshot(scope),scope);assert.equal(restored?.section,"boundary-runs");assert.equal(restored?.completed,false);for(const [k,v]of before)assert.equal(memory.get(k),v);
});
