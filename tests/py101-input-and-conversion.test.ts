import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {pythonInputAndConversionLesson as lesson} from "../src/content/lessons/py101/input-and-conversion";
import {inputCode,inputBlockNames,type InputKey} from "../src/content/resources/python-input-conversion";
import {inputKey,inputContract,inputContracts,checkInputResult} from "../scripts/validate-py101-input";
import {publicationManifest} from "../src/content/publication-manifest";
import {courseOutline} from "../src/content/course-outline";
import {isReadable,publicationSchema} from "../src/content/models";
import {lessonRegistry,resolveLesson,getLearningCourse,getAdjacentLessons} from "../src/lib/course-engine";
import {progressKey,createProgressStore,parseReadingProgress} from "../src/lib/learning-progress";
import {lessonProgressScope} from "../src/lib/use-learning-progress";
import {beforeApprovedPy101Object,beforeApprovedPy101Source} from "../scripts/py101-p1-compatibility";
import {assertRegisteredInventory,assertCourseAvailability} from "./helpers/registered-content";
const read=(n:string)=>JSON.parse(readFileSync(`docs/py101-p12/${n}.json`,"utf8"));
const sha=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
test("2.5唯一身份/order5/r1、真实draft门禁与证据后preview，非人工通过",()=>{
 const entry=publicationManifest.find(p=>p.lessonId===lesson.id)!;assert.deepEqual([entry.title,entry.courseId,entry.chapterId,entry.order,entry.contentVersion,entry.optionalLesson],[lesson.title,"PY101","PY101-C02",5,1,false]);assert.equal(courseOutline.find(s=>s.lessonId===lesson.id)?.order,5);
 const g=read("DRAFT_GATE");assert.deepEqual([g.status,g.access,g.readable,g.resolveUndefined,g.directoryHrefAbsent],["draft","private",false,true,true]);assert.equal(entry.reviewEvidence,undefined);
 assert.throws(()=>publicationSchema.parse({...entry,status:"draft",access:"preview"}));assert.throws(()=>publicationSchema.parse({...entry,status:"pending-review",access:"preview",technicalEvidence:undefined}));
 if(entry.status==="draft")assert.equal(resolveLesson("PY101",lesson.id),undefined);else{assert.deepEqual([entry.status,entry.access,(beforeApprovedPy101Object("publications",lesson.id,entry) as typeof entry).technicalEvidence],["pending-review","preview","docs/py101-p12/TECHNICAL_REPORT.md"]);assert.ok(resolveLesson("PY101",lesson.id));}assertRegisteredInventory();assertCourseAvailability("PY101");
});
test("三目标由两道核心自写题覆盖，双提示/解释/错因/rubric与分项估时",()=>{
 const tasks=lesson.sections.filter(s=>s.tier==="core").flatMap(s=>s.blocks).filter(b=>b.type==="exercise");assert.deepEqual(tasks.map(t=>t.id),["interactive-label-and-count","measure-and-recheck"]);
 assert.deepEqual(lesson.assessmentMap,[{objective:1,exerciseIds:[tasks[0].id]},{objective:2,exerciseIds:tasks.map(t=>t.id)},{objective:3,exerciseIds:[tasks[1].id]}]);
 for(const t of tasks){assert.equal(t.kind,"代码");assert.equal(t.hints.length,2);assert.ok(t.solution.length>=4);assert.ok(t.rubric.length>=3);assert.doesNotMatch(t.hints.join(""),/Hall C|Porch E|venue_name|length_text|15张|30张/);assert.match(t.prompt,/两组/);assert.match(t.prompt,/type/);}assert.match(tasks[1].prompt,/真实ValueError完整回溯/);assert.match(tasks[1].prompt,/重新启动/);
 assert.deepEqual(lesson.learningTime,{reading:[12,18],practice:[8,12],coding:[18,28],basis:"editorial-estimate"});assert.deepEqual(lesson.resources,[]);
});
test("所有12块同源登记stdin，分步转换且不使用未教语法或隐式字符串计算",()=>{
 const blocks=lesson.sections.flatMap(s=>s.blocks).filter(b=>b.type==="code").filter(b=>b.language==="python");assert.equal(blocks.length,12);assert.deepEqual(new Set(blocks.map(b=>inputKey(b.filename,b.code))),new Set(Object.keys(inputCode)));
 for(const b of blocks){assert.doesNotMatch(b.code,/\b(if|elif|else|try|except|while|for|eval|def|import)\b|\b(?:int|float)\(input\(|f["']|\.isdigit\(/);for(const line of b.code.split("\n"))if(line.includes("input("))assert.match(line,/^[a-z_]+ = input\("[A-Za-z ]+: "\)$/);assert.ok(inputContracts[inputKey(b.filename,b.code)].length>0);}
 assert.throws(()=>inputKey("unknown.py",inputCode.main));assert.throws(()=>inputKey(inputBlockNames.main,inputCode.main.replace('Count: ','Count:')));assert.throws(()=>inputContract("main","box-four","Box A\n"));assert.throws(()=>inputContract("main","unknown","Box A\n4\n"));
});
test("程序stdout含无换行提示而无伪造回显，ValueError不能由其他失败冒充",()=>{
 assert.equal(inputContracts.main[0].stdout,"Label: Count: Box A\n12\n");assert.equal(inputContracts.main[1].stdout,"Label: Count: Tool B\n6\n");assert.equal(inputContracts.rawCount[0].stdout,"Count: 4\n<class 'str'>\n");
 checkInputResult("main","box-four","Box A\n4\n",{exitCode:0,stdout:inputContracts.main[0].stdout,stderr:""});
 for(const r of [{exitCode:0,stdout:"Label: Box A\nCount: 4\nBox A\n12\n",stderr:""},{exitCode:1,stdout:inputContracts.main[0].stdout,stderr:""},{exitCode:0,stdout:inputContracts.main[0].stdout,stderr:"warning"}])assert.throws(()=>checkInputResult("main","box-four","Box A\n4\n",r));
 assert.throws(()=>checkInputResult("integerError","word","four\n",{exitCode:1,stdout:"Count: ",stderr:"EOFError: EOF when reading a line\n"}));
});
test("保存文件真实进程覆盖两组合法、四项ValueError及新PID恢复，不模拟input",()=>{
 const e=read("PYTHON_RUNS");assert.equal(e.platform,"win32");assert.equal(e.allAssertionsPassed,true);assert.equal(e.rows.length,Object.values(inputContracts).reduce((n,c)=>n+c.length,0));
 for(const key of Object.keys(inputCode)as InputKey[])for(const c of inputContracts[key]){const r=e.rows.find((r:{key:string;caseId:string})=>r.key===key&&r.caseId===c.id);assert.ok(r);assert.equal(r.savedSource,inputCode[key]+"\n");assert.equal(r.savedSha256,createHash("sha256").update(r.savedSource).digest("hex"));checkInputResult(key,c.id,c.stdin,r);}
 for(const key of ["main","mass","ownInteger","ownMeasure","integerError","floatError","measureError"]){const rows=e.rows.filter((r:{key:string})=>r.key===key);assert.equal(new Set(rows.map((r:{savedSha256:string})=>r.savedSha256)).size,1);assert.equal(new Set(rows.map((r:{pid:number})=>r.pid)).size,rows.length);}
 assert.equal(e.rows.filter((r:{exitCode:number})=>r.exitCode===1).length,4);assert.doesNotMatch(JSON.stringify(e),/[A-Za-z]:\\Users\\|token=/);
});
test("2.4仅末段状态/依据更新保r1，其他旧对象完整不变，未知改写仍暴露",()=>{
 const base=read("BASELINE"),id="PY101-C02-L04",before=base.amendmentsBefore[id],current=lessonRegistry.get(id)!,expected=structuredClone(before.lesson);expected.sections.at(-1).blocks[expected.sections.at(-1).blocks.length-1]=current.sections.at(-1)!.blocks.at(-1);assert.deepEqual(current,expected);assert.deepEqual(lessonProgressScope(current),lessonProgressScope(before.lesson));assert.equal(current.contentVersion,1);
 const pub=publicationManifest.find(p=>p.lessonId===id)!;assert.deepEqual(pub,{...before.publication,technicalEvidence:pub.technicalEvidence});if(pub.technicalEvidence!==before.publication.technicalEvidence)assert.equal(pub.technicalEvidence,"docs/py101-p12/TRANSITION_AMENDMENTS.md");
 for(const [k,v]of Object.entries(base.lessons))if(k!==id)assert.equal(sha(beforeApprovedPy101Object("lessons",k,lessonRegistry.get(k),base.head)),v,k);for(const [k,v]of Object.entries(base.publications))if(k!==id)assert.equal(sha(beforeApprovedPy101Object("publications",k,publicationManifest.find(p=>p.lessonId===k),base.head)),v,k);
 const tampered=structuredClone(current);tampered.title+=" 未登记";assert.deepEqual(beforeApprovedPy101Object("lessons",id,tampered,base.head),tampered);const source=readFileSync("src/lib/course-engine.ts","utf8");assert.equal(beforeApprovedPy101Source("src/lib/course-engine.ts",source+"\n// extra",base.head),source+"\n// extra");
});
test("2.4到2.5按实际可读相邻，后续按真实注册，错误归属404与整课planned",()=>{
 const c=getLearningCourse("PY101")!;assert.equal(c.status,"planned");if(isReadable(publicationManifest.find(p=>p.lessonId===lesson.id)!)){assert.equal(getAdjacentLessons(c,"PY101-C02-L04").next?.lessonId,lesson.id);assert.equal(getAdjacentLessons(c,lesson.id).previous?.lessonId,"PY101-C02-L04");const readable=c.chapters.flatMap(ch=>ch.lessons).filter(s=>s.href);assert.equal(getAdjacentLessons(c,lesson.id).next?.lessonId,readable[readable.findIndex(s=>s.lessonId===lesson.id)+1]?.lessonId);}
 const missing="PY101-C02-L06";if(!lessonRegistry.has(missing)){assert.equal(courseOutline.some(s=>s.lessonId===missing),false);assert.equal(lessonRegistry.has(missing),false);assert.equal(publicationManifest.some(p=>p.lessonId===missing),false);assert.equal(resolveLesson("PY101",missing),undefined);}assert.equal(resolveLesson("ML201",lesson.id),undefined);
});
test("新2.5/r1独立重载，不继承或覆盖所有旧课r1/r2与其他课程完成记录",()=>{
 const memory=new Map<string,string>(),storage={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}},store=createProgressStore(()=>storage);
 for(const old of lessonRegistry.values())if(old.id!==lesson.id){const s=lessonProgressScope(old);store.save(s,100,s.sectionIds[0],true);if(s.contentVersion>1)store.save({...s,contentVersion:1},100,s.sectionIds[0],true);}const before=new Map(memory),scope=lessonProgressScope(lesson);assert.equal(progressKey(scope),"aivora:learning:v2:PY101:PY101-C02-L05:r1");assert.equal(store.getSnapshot(scope),null);store.save(scope,50,"raw-count");const restored=parseReadingProgress(createProgressStore(()=>storage).getSnapshot(scope),scope);assert.equal(restored?.section,"raw-count");assert.equal(restored?.completed,false);for(const[k,v]of before)assert.equal(memory.get(k),v);
});
