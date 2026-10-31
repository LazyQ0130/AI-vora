import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { pythonArithmeticExpressionsLesson as p15CurrentLesson } from "../src/content/lessons/py101/arithmetic-expressions";
import {historicalLesson} from "./helpers/py101-p14-view";
const lesson=historicalLesson(p15CurrentLesson);
import { arithmeticCode, arithmeticBlockNames, arithmeticSetups } from "../src/content/resources/python-arithmetic";
import { arithmeticKey, arithmeticExpected, checkArithmeticResult } from "../scripts/validate-py101-arithmetic";
import { courseOutline } from "../src/content/course-outline";
import { publicationManifest } from "./helpers/py101-p14-view";
import { isReadable, publicationSchema } from "../src/content/models";
import { getLearningCourse, getAdjacentLessons, lessonRegistry, resolveLesson } from "./helpers/py101-p14-view";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { beforeApprovedPy101Source, beforeApprovedPy101Object } from "../scripts/py101-p1-compatibility";
import { assertRegisteredInventory, assertCourseAvailability } from "./helpers/registered-content";
const read = (name: string) => JSON.parse(readFileSync(`docs/py101-p10/${name}.json`, "utf8"));
const sha = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");

test("[P0–P14历史契约] 2.3身份/order3/r1与真实草稿门禁，技术后试读而非人工审核", () => {
  const entry = publicationManifest.find(p => p.lessonId === lesson.id)!;
  assert.deepEqual([entry.courseId,entry.chapterId,entry.title,entry.order,entry.contentVersion,entry.optionalLesson], ["PY101","PY101-C02",lesson.title,3,1,false]);
  assert.equal(courseOutline.find(s=>s.lessonId===lesson.id)?.order,3);
  const gate=read("DRAFT_GATE");assert.deepEqual([gate.status,gate.access,gate.readable,gate.resolveUndefined,gate.directoryHrefAbsent],["draft","private",false,true,true]);
  assert.equal(isReadable({...entry,status:"draft",access:"private",technicalEvidence:undefined}),false);
  assert.throws(()=>publicationSchema.parse({...entry,status:"draft",access:"preview"}));
  assert.throws(()=>publicationSchema.parse({...entry,status:"pending-review",access:"preview",technicalEvidence:undefined}));
  assert.equal(entry.reviewEvidence,undefined);
  if(entry.status==="draft")assert.equal(resolveLesson("PY101",lesson.id),undefined);
  else {const historical=beforeApprovedPy101Object("publications",lesson.id,entry) as typeof entry;assert.deepEqual([entry.status,entry.access,historical.technicalEvidence],["pending-review","preview","docs/py101-p10/TECHNICAL_REPORT.md"]);assert.ok(resolveLesson("PY101",lesson.id));}
  assertRegisteredInventory();assertCourseAvailability("PY101");
});

test("[P0–P14历史契约] 三目标用两道真实core代码题验收，改值与诊断分别留证，提示不代填", () => {
  const tasks=lesson.sections.filter(s=>s.tier==="core").flatMap(s=>s.blocks).filter(b=>b.type==="exercise");
  assert.deepEqual(tasks.map(t=>t.id),["calculate-and-revise","compare-grouping"]);
  assert.deepEqual(lesson.assessmentMap,[{objective:1,exerciseIds:tasks.map(t=>t.id)},{objective:2,exerciseIds:[tasks[1].id]},{objective:3,exerciseIds:tasks.map(t=>t.id)}]);
  for(const t of tasks){assert.equal(t.kind,"代码");assert.equal(t.hints.length,2);assert.ok(t.solution.length>=4);assert.ok(t.rubric.length>=3);assert.doesNotMatch(t.hints.join(""),/bag_count|tube_count|33|45| = |\*.*\+/);}
  assert.match(tasks[0].prompt,/只改一项/);assert.match(tasks[1].prompt,/修复前后源码/);
  assert.deepEqual(lesson.learningTime,{reading:[12,18],practice:[6,10],coding:[15,22],basis:"editorial-estimate"});assert.deepEqual(lesson.resources,[]);
});

test("[P0–P14历史契约] 网页全部Python有同源契约/上下文，失败例显式登记，未教语法不进核心代码", () => {
  const blocks=lesson.sections.flatMap(s=>s.blocks).filter(b=>b.type==="code").filter(b=>b.language==="python");
  assert.deepEqual(blocks.map(b=>arithmeticKey(b.filename,b.code)),["multiply","total","subtract","precedence","grouping","moreBoxes","division","nonIntegral","leftGrouping","main","revise","zeroDivide"]);
  assert.equal(arithmeticSetups.subtract,arithmeticCode.total.split("\n").slice(0,-1).join("\n"));assert.equal(arithmeticSetups.division,arithmeticSetups.subtract);
  assert.equal(arithmeticSetups.grouping,arithmeticCode.total.split("\n").slice(0,3).join("\n"));
  for(const b of blocks)assert.doesNotMatch(b.code,/\b(input|int|float|str|bool|isinstance)\s*\(|\b(import|if|for|while|def|try|except|class)\b|==|\/\/|\*\*|%|×/);
  assert.throws(()=>arithmeticKey("unknown.py","print(16)"));assert.throws(()=>arithmeticKey(arithmeticBlockNames.main,arithmeticCode.main.replace(" + spare","")));
});

test("[P0–P14历史契约] 独立预期核对分组/减法/除法与float，受控零除契约拒绝伪成功及无关异常", () => {
  assert.equal(arithmeticExpected.main,"16\n24\n4.0\n");assert.equal(arithmeticExpected.leftGrouping,"8.0\n2.0\n9\n5\n");
  assert.equal(arithmeticExpected.division,"4.0\n<class 'float'>\n");assert.equal(arithmeticExpected.subtract,"14\n");
  checkArithmeticResult("zeroDivide",{exitCode:1,stdout:"",stderr:"Traceback\nZeroDivisionError: division by zero\n"});
  assert.throws(()=>checkArithmeticResult("zeroDivide",{exitCode:0,stdout:"0\n",stderr:""}));
  assert.throws(()=>checkArithmeticResult("zeroDivide",{exitCode:1,stdout:"",stderr:"NameError: total\n"}));
  assert.throws(()=>checkArithmeticResult("division",{exitCode:0,stdout:"4\n<class 'int'>\n",stderr:""}));
  assert.throws(()=>checkArithmeticResult("main",{exitCode:0,stdout:"16\n16\n4.0\n",stderr:""}));
  const outputs=lesson.sections.flatMap(s=>s.blocks).filter(b=>b.type==="code").filter(b=>b.language==="text");
  assert.ok(outputs.some(b=>b.code==="16\n24\n4.0"));assert.ok(outputs.some(b=>b.code==="4.0\n<class 'float'>"));
});

test("[P0–P14历史契约] 真实保存文件记录覆盖主例、两题、改一项重跑、完整追加和已知失败", () => {
  const evidence=read("PYTHON_RUNS"),row=(label:string)=>evidence.rows.find((r:{label:string})=>r.label===label);
  assert.equal(evidence.platform,"win32");assert.equal(evidence.allAssertionsPassed,true);
  for(const key of Object.keys(arithmeticCode) as (keyof typeof arithmeticCode)[]){const r=row(key);checkArithmeticResult(key,r);assert.equal(r.savedSource,(arithmeticSetups[key]?arithmeticSetups[key]+"\n":"")+arithmeticCode[key]);}
  assert.equal(row("follow-appends").stdout,"16\n14\n24\n4.0\n<class 'float'>\n");
  assert.equal(row("saved-before").filename,row("saved-after").filename);
  assert.equal(row("saved-before").savedSource.replace("per_box = 3","per_box = 5"),row("saved-after").savedSource);
  assert.equal(row("saved-after").stdout,"24\n22\n6.0\n");
  assert.equal(row("new-card-before").stdout,"30\n25\n");assert.equal(row("new-card-after").stdout,"34\n29\n");assert.equal(row("new-grouping").stdout,"15\n20\n3.0\n");
  for(const label of ["math-multiply-symbol","missing-multiply"]){assert.equal(row(label).exitCode,1);assert.equal(row(label).stdout,"");assert.match(row(label).stderr,/SyntaxError/);}
  assert.equal(new Set(evidence.rows.map((r:{shellPid:number})=>r.shellPid)).size,evidence.rows.length);
  assert.doesNotMatch(JSON.stringify(evidence),/[A-Za-z]:\\\\Users\\\\|token=/);
});

test("[P0–P14历史契约] 2.2仅末段状态勘误保r1；其余全部旧Lesson/发布对象、作用域保持", () => {
  const base=read("BASELINE"),current=lessonRegistry.get("PY101-C02-L02")!,expected=structuredClone(base.amendmentBefore);
  expected.sections.at(-1).blocks[expected.sections.at(-1).blocks.length-1]=current.sections.at(-1)!.blocks.at(-1);assert.deepEqual(current,expected);
  assert.equal(current.contentVersion,1);assert.deepEqual(lessonProgressScope(current),lessonProgressScope(base.amendmentBefore));
  for(const [id,digest]of Object.entries(base.lessons))if(id!==current.id)assert.equal(sha(beforeApprovedPy101Object("lessons",id,lessonRegistry.get(id),base.head)),digest,id);
  for(const [id,digest]of Object.entries(base.publications))if(id!==current.id)assert.equal(sha(beforeApprovedPy101Object("publications",id,publicationManifest.find(p=>p.lessonId===id),base.head)),digest,id);
  const source=readFileSync("src/lib/course-engine.ts","utf8"),plan=read("APPROVED_CHANGES");
  assert.equal(beforeApprovedPy101Source("src/lib/course-engine.ts",source,base.head),plan.sources.find((r:{path:string})=>r.path==="src/lib/course-engine.ts").before);
  assert.equal(beforeApprovedPy101Source("src/lib/course-engine.ts",source+"\n// unauthorized",base.head),source+"\n// unauthorized");
});

test("[P0–P14历史契约] 2.2到2.3相邻且整课planned，后续按实际注册，错误课程不可读", () => {
  const course=getLearningCourse("PY101")!;assert.equal(course.status,"planned");
  if(isReadable(publicationManifest.find(p=>p.lessonId===lesson.id)!)){
    assert.equal(getAdjacentLessons(course,"PY101-C02-L02").next?.lessonId,lesson.id);assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"PY101-C02-L02");const readable=course.chapters.flatMap(c=>c.lessons).filter(s=>s.href);assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,readable[readable.findIndex(s=>s.lessonId===lesson.id)+1]?.lessonId);
  }
  for(let n=4;n<=6;n++){const id=`PY101-C02-L0${n}`;if(lessonRegistry.has(id))continue;assert.equal(courseOutline.some(s=>s.lessonId===id),false);assert.equal(lessonRegistry.has(id),false);assert.equal(publicationManifest.some(p=>p.lessonId===id),false);assert.equal(resolveLesson("PY101",id),undefined);}
  assert.equal(resolveLesson("ML201",lesson.id),undefined);
});

test("[P0–P14历史契约] 2.3新r1恢复独立，不继承或覆盖所有旧课/旧修订完成记录", () => {
  const memory=new Map<string,string>(),storage={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}},store=createProgressStore(()=>storage);
  for(const old of lessonRegistry.values())if(old.id!==lesson.id){const scope=lessonProgressScope(old);store.save(scope,100,scope.sectionIds[0],true);if(scope.contentVersion>1)store.save({...scope,contentVersion:1},100,scope.sectionIds[0],true);}
  const before=new Map(memory),scope=lessonProgressScope(lesson);assert.equal(progressKey(scope),"aivora:learning:v2:PY101:PY101-C02-L03:r1");assert.equal(store.getSnapshot(scope),null);
  store.save(scope,54,"put-it-together");const reloaded=parseReadingProgress(createProgressStore(()=>storage).getSnapshot(scope),scope);
  assert.equal(reloaded?.section,"put-it-together");assert.equal(reloaded?.completed,false);for(const [k,v]of before)assert.equal(memory.get(k),v);
});
