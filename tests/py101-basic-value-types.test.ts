import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pythonBasicValueTypesLesson as lesson } from "../src/content/lessons/py101/basic-value-types";
import { courseOutline } from "../src/content/course-outline";
import { publicationManifest } from "../src/content/publication-manifest";
import { isReadable, publicationSchema } from "../src/content/models";
import { getLearningCourse, getAdjacentLessons, lessonRegistry, resolveLesson } from "../src/lib/course-engine";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { valueTypeCode, valueTypeBlockNames, valueTypeSetups } from "../src/content/resources/python-value-types";
import { valueTypeKey, checkValueTypeResult, valueTypeExpected } from "../scripts/validate-py101-value-types";
import { beforeApprovedPy101Source } from "../scripts/py101-p1-compatibility";
import { assertRegisteredInventory, assertCourseAvailability } from "./helpers/registered-content";
const read = (name: string) => JSON.parse(readFileSync(`docs/py101-p9/${name}.json`, "utf8"));

test("2.2身份r1/order2与实际草稿门禁，技术证据/人工状态受原模型约束", () => {
  const entry = publicationManifest.find(p => p.lessonId === lesson.id)!;
  assert.deepEqual([entry.title, entry.contentVersion, entry.order, entry.optionalLesson], [lesson.title, 1, 2, false]);
  assert.deepEqual(courseOutline.filter(s => s.chapterId === "PY101-C02").map(s => [s.lessonId,s.order]), [["PY101-C02-L01",1],[lesson.id,2]]);
  const draft = read("DRAFT_GATE");
  assert.deepEqual([draft.status,draft.access,draft.readable,draft.resolveUndefined,draft.directoryHrefAbsent], ["draft","private",false,true,true]);
  assert.equal(isReadable({...entry,status:"draft",access:"private",technicalEvidence:undefined}), false);
  assert.throws(() => publicationSchema.parse({...entry,status:"draft",access:"preview"}));
  assert.throws(() => publicationSchema.parse({...entry,status:"pending-review",access:"preview",technicalEvidence:undefined}));
  assert.equal(entry.reviewEvidence, undefined);
  if (entry.status === "draft") assert.equal(resolveLesson("PY101",lesson.id), undefined);
  else {
    assert.equal(entry.status,"pending-review"); assert.equal(entry.access,"preview");
    assert.equal(entry.technicalEvidence,"docs/py101-p9/TECHNICAL_REPORT.md"); assert.ok(resolveLesson("PY101",lesson.id));
  }
  assertRegisteredInventory(); assertCourseAvailability("PY101");
});

test("三目标由两道core代码题覆盖，两级提示不代填新值，反馈和编辑估时完整", () => {
  const tasks = lesson.sections.filter(s => s.tier === "core").flatMap(s => s.blocks).filter(b => b.type === "exercise");
  assert.deepEqual(tasks.map(t => t.id), ["write-four-values","same-display-different-type"]);
  assert.deepEqual(lesson.assessmentMap, [{objective:1,exerciseIds:[tasks[0].id]},{objective:2,exerciseIds:tasks.map(t=>t.id)},{objective:3,exerciseIds:[tasks[1].id]}]);
  for (const task of tasks) {
    assert.equal(task.kind,"代码"); assert.equal(task.hints.length,2); assert.ok(task.solution.length>=4); assert.ok(task.rubric.length>=3);
    assert.doesNotMatch(task.hints.join(""), /Sketch kit|crate_total|pencil_count|<class| = /);
  }
  assert.deepEqual(lesson.learningTime,{reading:[12,18],practice:[6,10],coding:[12,18],basis:"editorial-estimate"});
  assert.equal(lesson.optionalLesson,false); assert.deepEqual(lesson.resources,[]);
});

test("全部网页Python同源登记，片段有明确上下文；不借转换或控制流考类型", () => {
  const blocks = lesson.sections.flatMap(s => s.blocks).filter(b => b.type === "code").filter(b => b.language === "python");
  assert.deepEqual(blocks.map(b => valueTypeKey(b.filename,b.code)), ["sameDisplay","measurement","booleanValues","firstType","pairTypes","booleanTypes","main","rebind"]);
  assert.equal(valueTypeSetups.firstType,'item_count = 3');
  assert.equal(valueTypeSetups.booleanTypes, valueTypeCode.booleanValues.split("\n").slice(0,3).join("\n"));
  for (const block of blocks) assert.doesNotMatch(block.code,/\b(input|int|float|str|bool|isinstance)\s*\(|\b(import|if|for|while|def|try|except|class)\b|==/);
  assert.throws(() => valueTypeKey("unknown.py","print(3)"));
  assert.throws(() => valueTypeKey(valueTypeBlockNames.main,valueTypeCode.main.replace('"3"','3')));
});

test("类型输出框保留尖括号/引号，验证器拒绝类型错判、异常与缺行", () => {
  const output = lesson.sections.flatMap(s=>s.blocks).find(b=>b.type==="code"&&b.filename==="完整主例 · 八行预期输出");
  assert.ok(output?.type==="code"); assert.equal(output.language,"text"); assert.equal(output.code+"\n",valueTypeExpected.main);
  checkValueTypeResult("pairTypes",{exitCode:0,stdout:"<class 'int'>\n<class 'str'>\n",stderr:""});
  assert.throws(()=>checkValueTypeResult("pairTypes",{exitCode:0,stdout:"<class 'int'>\n<class 'int'>\n",stderr:""}));
  assert.throws(()=>checkValueTypeResult("main",{exitCode:1,stdout:valueTypeExpected.main,stderr:"NameError"}));
  assert.throws(()=>checkValueTypeResult("booleanTypes",{exitCode:0,stdout:"<class 'bool'>\n<class 'bool'>\n",stderr:""}));
});

test("真实Windows记录覆盖四值、True与文字、两阶段重绑定、替代与错误", () => {
  const evidence = read("PYTHON_RUNS"), row = (label:string) => evidence.rows.find((r:{label:string})=>r.label===label);
  assert.equal(evidence.platform,"win32"); assert.equal(evidence.allAssertionsPassed,true);
  for (const key of ["main","pairTypes","booleanTypes","rebind","ownFour","ownRebind","ownChanged"] as const) {
    assert.equal(row(key).exitCode,0); assert.equal(row(key).stderr,""); assert.equal(row(key).stdout,valueTypeExpected[key]);
  }
  assert.equal(row("booleanValues").stdout,"True\nTrue\nFalse\n");
  assert.equal(row("single-quotes").stdout,"12\n<class 'str'>\n");
  assert.equal(row("false-and-text").stdout,"False\n<class 'bool'>\nFalse\n<class 'str'>\n");
  assert.equal(row("saved-before").filename,row("saved-after").filename);
  assert.equal(row("saved-before").stdout,"1.5\n<class 'float'>\n"); assert.equal(row("saved-after").stdout,"1.5\n<class 'str'>\n");
  for(const label of ["misspelling:true","misspelling:false","unpaired-quote"]) {assert.equal(row(label).exitCode,1);assert.equal(row(label).stdout,"");assert.match(row(label).stderr,label==="unpaired-quote"?/SyntaxError/:/NameError/);}
  assert.doesNotMatch(JSON.stringify(evidence),/[A-Za-z]:\\\\Users\\\\|token=/);
});

test("2.1仅末段状态勘误，全部目标/两题/源码/锚点与r1进度scope保持", () => {
  const base = read("BASELINE"), current=lessonRegistry.get("PY101-C02-L01")!, expected=structuredClone(base.amendmentBefore);
  expected.sections.at(-1).blocks[expected.sections.at(-1).blocks.length-1]=current.sections.at(-1)!.blocks.at(-1);
  assert.deepEqual(current,expected);assert.equal(current.contentVersion,1);
  assert.deepEqual(lessonProgressScope(current),lessonProgressScope(base.amendmentBefore));
  const source=readFileSync("src/lib/course-engine.ts","utf8"), plan=read("APPROVED_CHANGES");
  assert.equal(beforeApprovedPy101Source("src/lib/course-engine.ts",source,base.head),plan.sources.find((r:{path:string})=>r.path==="src/lib/course-engine.ts").before);
  assert.equal(beforeApprovedPy101Source("src/lib/course-engine.ts",source+"\n// unauthorized",base.head),source+"\n// unauthorized");
});

test("2.1到2.2导航与错误归属，2.3–2.6无注册/Publication/可读路径", () => {
  const course=getLearningCourse("PY101")!;assert.equal(course.status,"planned");
  if(isReadable(publicationManifest.find(p=>p.lessonId===lesson.id)!)) {
    assert.equal(getAdjacentLessons(course,"PY101-C02-L01").next?.lessonId,lesson.id);
    assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"PY101-C02-L01");
    assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,"PY101-C05-L01");
  }
  for(let i=3;i<=6;i++){const id=`PY101-C02-L0${i}`;assert.equal(courseOutline.some(s=>s.lessonId===id),false);assert.equal(lessonRegistry.has(id),false);assert.equal(publicationManifest.some(p=>p.lessonId===id),false);assert.equal(resolveLesson("PY101",id),undefined);}
  assert.equal(resolveLesson("ML201",lesson.id),undefined);
});

test("2.2新r1重载独立，不继承或改写所有旧课/旧修订完成记录", () => {
  const memory=new Map<string,string>(),storage={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}};
  const store=createProgressStore(()=>storage);
  for(const old of lessonRegistry.values())if(old.id!==lesson.id){const scope=lessonProgressScope(old);store.save(scope,100,scope.sectionIds[0],true);if(scope.contentVersion>1)store.save({...scope,contentVersion:1},100,scope.sectionIds[0],true);}
  const before=new Map(memory),scope=lessonProgressScope(lesson);assert.equal(progressKey(scope),"aivora:learning:v2:PY101:PY101-C02-L02:r1");assert.equal(store.getSnapshot(scope),null);
  store.save(scope,55,"same-name-new-type");const reloaded=parseReadingProgress(createProgressStore(()=>storage).getSnapshot(scope),scope);
  assert.equal(reloaded?.section,"same-name-new-type");assert.equal(reloaded?.completed,false);for(const [k,v]of before)assert.equal(memory.get(k),v);
});
