import test from"node:test";
import assert from"node:assert/strict";
import {readFileSync}from"node:fs";
import {createHash}from"node:crypto";
import { pythonReadableOutputLesson as p15CurrentLesson } from "../src/content/lessons/py101/readable-output";
import {historicalLesson} from "./helpers/py101-p14-view";
const lesson=historicalLesson(p15CurrentLesson);
import {readableCode,readableBlockNames,type ReadableKey}from"../src/content/resources/python-readable-output";
import {readableKey,readableContract,readableContracts,checkReadableResult}from"../scripts/validate-py101-readable-output";
import {publicationManifest}from"./helpers/py101-p14-view";
import {courseOutline}from"../src/content/course-outline";
import {isReadable,publicationSchema}from"../src/content/models";
import {lessonRegistry,resolveLesson,getLearningCourse,getAdjacentLessons}from"./helpers/py101-p14-view";
import {progressKey,createProgressStore,parseReadingProgress}from"../src/lib/learning-progress";
import {lessonProgressScope}from"../src/lib/use-learning-progress";
import {beforeApprovedPy101Object,beforeApprovedPy101Source}from"../scripts/py101-p1-compatibility";
import {assertRegisteredInventory,assertCourseAvailability}from"./helpers/registered-content";
const read=(name:string)=>JSON.parse(readFileSync(`docs/py101-p13/${name}.json`,"utf8"));
const sha=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
test("[P0–P14历史契约] 2.6唯一身份/order6/r1与真实draft门禁，技术后试读而非人工通过",()=>{
 const e=publicationManifest.find(p=>p.lessonId===lesson.id)!;assert.deepEqual([e.title,e.courseId,e.chapterId,e.order,e.contentVersion,e.optionalLesson],[lesson.title,"PY101","PY101-C02",6,1,false]);assert.equal(courseOutline.find(s=>s.lessonId===lesson.id)?.order,6);const g=read("DRAFT_GATE");assert.deepEqual([g.status,g.access,g.readable,g.resolveUndefined,g.directoryHrefAbsent],["draft","private",false,true,true]);assert.equal(e.reviewEvidence,undefined);
 assert.throws(()=>publicationSchema.parse({...e,status:"draft",access:"preview"}));assert.throws(()=>publicationSchema.parse({...e,status:"pending-review",access:"preview",technicalEvidence:undefined}));if(e.status==="draft")assert.equal(resolveLesson("PY101",lesson.id),undefined);else{assert.deepEqual([e.status,e.access,e.technicalEvidence],["pending-review","preview","docs/py101-p13/TECHNICAL_REPORT.md"]);assert.ok(resolveLesson("PY101",lesson.id));}assertRegisteredInventory();assertCourseAvailability("PY101");
});
test("[P0–P14历史契约] 三目标由两道自写代码题覆盖，双提示/解释/错因/单位与独立三轮证据",()=>{
 const tasks=lesson.sections.filter(s=>s.tier==="core").flatMap(s=>s.blocks).filter(b=>b.type==="exercise");assert.deepEqual(tasks.map(t=>t.id),["write-clear-summary","verify-summary-boundary"]);assert.deepEqual(lesson.assessmentMap,[{objective:1,exerciseIds:[tasks[0].id]},{objective:2,exerciseIds:tasks.map(t=>t.id)},{objective:3,exerciseIds:[tasks[1].id]}]);for(const t of tasks){assert.equal(t.kind,"代码");assert.equal(t.hints.length,2);assert.ok(t.solution.length>=4);assert.ok(t.rubric.length>=3);assert.doesNotMatch(t.hints.join(""),/Banner A|Garden B|total_length|within_limit|12米|True|False| = /);assert.match(t.prompt,/单位/);}
 assert.match(tasks[0].prompt,/两组/);assert.match(tasks[1].prompt,/低于、恰好等于、高于/);assert.match(tasks[1].prompt,/题一\/题二阶段源码/);assert.deepEqual(lesson.learningTime,{reading:[12,18],practice:[8,12],coding:[22,32],basis:"editorial-estimate"});assert.deepEqual(lesson.resources,[]);
});
test("[P0–P14历史契约] 全部12块同源与明确stdin，f字段仅简单名称，无超纲语法或格式指定",()=>{
 const blocks=lesson.sections.flatMap(s=>s.blocks).filter(b=>b.type==="code").filter(b=>b.language==="python");assert.equal(blocks.length,12);assert.deepEqual(new Set(blocks.map(b=>readableKey(b.filename,b.code))),new Set(Object.keys(readableCode)));
 for(const b of blocks){assert.doesNotMatch(b.code,/\b(if|elif|else|for|while|def|import|try|except|eval|open)\b|\.format\(|\b(?:int|float)\(input\(/);for(const m of b.code.matchAll(/\{([^}]+)\}/g))assert.match(m[1],/^[a-z_]+$/);assert.ok(readableContracts[readableKey(b.filename,b.code)].length>0);}
 assert.throws(()=>readableKey("unknown.py",readableCode.main));assert.throws(()=>readableKey(readableBlockNames.main,readableCode.main.replace('print(f"Total','print("Total')));assert.throws(()=>readableContract("main","parcel-low","Parcel\n4\n"));assert.throws(()=>readableContract("main","unknown",""));
});
test("[P0–P14历史契约] 普通字符串不插入、f与中文单位实际插入，真假只对应同一总量规则",()=>{
 assert.equal(readableContracts.literal[0].stdout,"Total kg: {total_mass}\n");assert.equal(readableContracts.insert[0].stdout,"Total kg: 6.0\n");assert.equal(readableContracts.chinese[0].stdout,"总质量（千克）：6.0\n");const low=readableContracts.main[0],equal=readableContracts.main[1],high=readableContracts.main[2];assert.match(equal.stdout,/Total kg: 10\.0\nWithin 10 kg: True\n$/);assert.match(high.stdout,/Total kg: 12\.0\nWithin 10 kg: False\n$/);assert.ok(low.stdout.startsWith("Item: Count: Mass kg: Item: Parcel\n"));
 for(const r of [{exitCode:0,stdout:low.stdout.replace("True","False"),stderr:""},{exitCode:1,stdout:low.stdout,stderr:""},{exitCode:0,stdout:low.stdout,stderr:"warning"},{exitCode:0,stdout:"Item: Parcel\nCount: 4\nMass kg: 1.5\n"+low.stdout,stderr:""}])assert.throws(()=>checkReadableResult("main",low.id,low.stdin,r));
 assert.throws(()=>checkReadableResult("nameError","unbound-field","",{exitCode:1,stdout:"",stderr:"TypeError: invalid format\n"}));
});
test("[P0–P14历史契约] 真实保存文件含两题新数据、低等高边界、失败与新PID恢复，预期未模拟执行",()=>{
 const e=read("PYTHON_RUNS");assert.equal(e.platform,"win32");assert.equal(e.allAssertionsPassed,true);assert.equal(e.rows.length,Object.values(readableContracts).reduce((n,c)=>n+c.length,0));for(const key of Object.keys(readableCode)as ReadableKey[])for(const c of readableContracts[key]){const r=e.rows.find((r:{key:string;caseId:string})=>r.key===key&&r.caseId===c.id);assert.ok(r);assert.equal(r.savedSource,readableCode[key]+"\n");assert.equal(r.savedSha256,createHash("sha256").update(r.savedSource).digest("hex"));checkReadableResult(key,c.id,c.stdin,r);}
 for(const key of ["main","ownSummary","ownBoundary"]){const rows=e.rows.filter((r:{key:string})=>r.key===key);assert.equal(new Set(rows.map((r:{savedSha256:string})=>r.savedSha256)).size,1);assert.equal(new Set(rows.map((r:{pid:number})=>r.pid)).size,rows.length);}
 const error=e.rows.find((r:{key:string})=>r.key==="nameError"),repair=e.rows.find((r:{key:string})=>r.key==="nameRepair");assert.equal(error.filename,repair.filename);assert.equal(error.savedSource.replace("{total_mas}","{total_mass}"),repair.savedSource);assert.notEqual(error.pid,repair.pid);assert.equal(e.rows.filter((r:{exitCode:number})=>r.exitCode===1).length,2);assert.doesNotMatch(JSON.stringify(e),/[A-Za-z]:\\Users\\|token=/);
});
test("[P0–P14历史契约] 2.5仅末段状态与依据变化保r1，其他所有旧对象不变且未知改写不获豁免",()=>{
 const base=read("BASELINE"),id="PY101-C02-L05",before=base.amendmentsBefore[id],current=lessonRegistry.get(id)!,expected=structuredClone(before.lesson);expected.sections.at(-1).blocks[expected.sections.at(-1).blocks.length-1]=current.sections.at(-1)!.blocks.at(-1);assert.deepEqual(current,expected);assert.deepEqual(lessonProgressScope(current),lessonProgressScope(before.lesson));assert.equal(current.contentVersion,1);const pub=publicationManifest.find(p=>p.lessonId===id)!;assert.deepEqual(pub,{...before.publication,technicalEvidence:pub.technicalEvidence});if(pub.technicalEvidence!==before.publication.technicalEvidence)assert.equal(pub.technicalEvidence,"docs/py101-p13/TRANSITION_AMENDMENTS.md");
 for(const[k,v]of Object.entries(base.lessons))if(k!==id)assert.equal(sha(beforeApprovedPy101Object("lessons",k,lessonRegistry.get(k),base.head)),v,k);for(const[k,v]of Object.entries(base.publications))if(k!==id)assert.equal(sha(beforeApprovedPy101Object("publications",k,publicationManifest.find(p=>p.lessonId===k),base.head)),v,k);const tampered=structuredClone(current);tampered.title+=" 未登记";assert.deepEqual(beforeApprovedPy101Object("lessons",id,tampered,base.head),tampered);const source=readFileSync("src/lib/course-engine.ts","utf8");assert.equal(beforeApprovedPy101Source("src/lib/course-engine.ts",source+"\n// extra",base.head),source+"\n// extra");
});
test("[P0–P14历史契约] 第二章真实六槽位及2.5到2.6相邻，第三章未注册，错误归属不可读且整课planned",()=>{
 const c=getLearningCourse("PY101")!;assert.equal(c.status,"planned");assert.deepEqual(c.chapters[1].lessons.map(s=>s.lessonId),[1,2,3,4,5,6].map(n=>`PY101-C02-L0${n}`));if(isReadable(publicationManifest.find(p=>p.lessonId===lesson.id)!)){assert.equal(getAdjacentLessons(c,"PY101-C02-L05").next?.lessonId,lesson.id);assert.equal(getAdjacentLessons(c,lesson.id).previous?.lessonId,"PY101-C02-L05");assert.equal(getAdjacentLessons(c,lesson.id).next?.lessonId,"PY101-C05-L01");}assert.equal(c.chapters[2].lessons.length,0);assert.equal([...lessonRegistry.keys()].some(k=>k.startsWith("PY101-C03-")),false);assert.equal(publicationManifest.some(p=>p.lessonId.startsWith("PY101-C03-")),false);assert.equal(resolveLesson("ML201",lesson.id),undefined);
});
test("[P0–P14历史契约] 新2.6/r1重载独立，全部旧课版本与其他课程完成记录逐字保留",()=>{
 const memory=new Map<string,string>(),storage={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}},store=createProgressStore(()=>storage);for(const old of lessonRegistry.values())if(old.id!==lesson.id){const s=lessonProgressScope(old);store.save(s,100,s.sectionIds[0],true);if(s.contentVersion>1)store.save({...s,contentVersion:1},100,s.sectionIds[0],true);}const before=new Map(memory),scope=lessonProgressScope(lesson);assert.equal(progressKey(scope),"aivora:learning:v2:PY101:PY101-C02-L06:r1");assert.equal(store.getSnapshot(scope),null);store.save(scope,50,"boundary-runs");const restored=parseReadingProgress(createProgressStore(()=>storage).getSnapshot(scope),scope);assert.equal(restored?.section,"boundary-runs");assert.equal(restored?.completed,false);for(const[k,v]of before)assert.equal(memory.get(k),v);
});
