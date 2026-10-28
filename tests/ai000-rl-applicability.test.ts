import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { rlApplicabilityLesson as lesson } from "../src/content/lessons/ai000/rl-applicability";
import { warehouseTask, warehouseOutcomes, warehouseMetrics, bikeInitial, bikeDemands, bikeRules } from "../src/content/lessons/ai000/rl-application-example";
import { beforeApplicabilitySource } from "../scripts/ai000-applicability-compatibility";
import type { ApplicabilityBaseline } from "../scripts/review-ai000-5-5";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { isReadable } from "../src/content/models";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { createProgressStore, progressKey, parseReadingProgress } from "../src/lib/learning-progress";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";

const before=JSON.parse(readFileSync("docs/ai000-5-5/BEFORE.json","utf8")) as ApplicabilityBaseline;
const blocks=lesson.sections.flatMap(s=>s.blocks), exercises=blocks.filter(b=>b.type==="exercise");
const sha=(s:Buffer)=>createHash("sha256").update(s).digest("hex");
const text=(id:string)=>JSON.stringify(lesson.sections.find(s=>s.id===id)!.blocks);

test("5.5增加之外40旧课/发布与238文件精确保留，未登记源码改动仍拒绝",()=>{
  assert.equal(before.lessons.length,40);assert.equal(before.files.length,238);
  assert.equal(lessonRegistry.size,43);assert.equal(publicationManifest.length,43);
  for(const old of before.lessons)assert.equal(JSON.stringify(lessonRegistry.get(old.id)),JSON.stringify(old),old.id);
  for(const old of before.publications)assert.deepEqual(publicationManifest.find(p=>p.lessonId===old.lessonId),old);
  for(const f of before.files){const bytes=readFileSync(f.path);if(sha(bytes)===f.sha256)continue;const source=beforeApplicabilitySource(f.path,bytes.toString("utf8")).replaceAll("\r\n","\n");assert.ok([source,source.replaceAll("\n","\r\n")].some(t=>sha(Buffer.from(t))===f.sha256),f.path);}
  const path="src/lib/course-engine.ts",source=readFileSync(path,"utf8"),expected=before.files.find(f=>f.path===path)!.sha256;
  assert.ok(beforeApplicabilitySource(path,source+"\n// unregistered").endsWith("// unregistered"));
  assert.notEqual(sha(Buffer.from(beforeApplicabilitySource(path,source.replace("rlApplicabilityLesson,","rlApplicabilityLesson, // changed")))),expected);
});

test("仓库从完成时刻与去重事件重算17/25，乙的高分不等于六件完成",()=>{
  assert.deepEqual(warehouseTask.taskIds,["J1","J2","J3","J4","J5","J6"]);
  assert.equal(warehouseTask.windowMinutes,30);assert.equal(warehouseTask.targetMinute,20);
  const independent=warehouseOutcomes.map(r=>{
    assert.ok(r.completionMinutes.length<=6);
    const done=r.completionMinutes.filter(t=>t>=0&&t<=30),late=done.filter(t=>t>20);
    return {completed:done.length,lateCompleted:late.length,congestion:new Set(r.congestionEventIds).size,score:done.length*5-late.length*3-new Set(r.congestionEventIds).size,allCompleted:done.length===6};
  });
  assert.deepEqual(independent,[{completed:6,lateCompleted:3,congestion:4,score:17,allCompleted:true},{completed:5,lateCompleted:0,congestion:0,score:25,allCompleted:false}]);
  assert.deepEqual(warehouseOutcomes.map(warehouseMetrics),independent);
  const table=blocks.find(b=>b.type==="table"&&b.caption==="同一批、同一窗口的结果与计分")!;
  assert.equal(table.type,"table");if(table.type==="table"){assert.deepEqual(table.rows[3],["30分钟时未完成（件）","0","1"]);assert.deepEqual(table.rows[5],["六件全部完成这一条","满足","未满足"]);}
  assert.match(text("score-and-requirements"),/按任务编号去重/);assert.match(text("score-and-requirements"),/持续等待期间采样多次/);
});

test("仓库约束在执行前检查；估时不当实绩，业务期限与目标时间分开",()=>{
  assert.equal(warehouseTask.robots,2);assert.ok(warehouseTask.kilogramsPerTask<=warehouseTask.loadLimitKg);
  for(const value of ["窄道禁止会车","不超载","不进禁区","执行前接受限制检查","30分钟","20分钟"])assert.ok(text("warehouse-task").includes(value),value);
  assert.match(text("warehouse-task"),/估时仍是预测/);
  assert.match(text("score-and-requirements"),/可能改变这两行的排名/);assert.match(text("score-and-requirements"),/没给完整的安全执行记录/);
});

type Move={from:number;to:number;quantity:number}|null;
function move(stock:readonly number[],action:Move){const next=[...stock];if(action){assert.ok(action.quantity>0&&action.quantity<=2);assert.notEqual(action.from,action.to);next[action.from]-=action.quantity;next[action.to]+=action.quantity;}assert.ok(next.every(n=>n>=0&&n<=12));return next;}
function borrow(stock:readonly number[],demand:readonly number[]){const served=stock.map((n,i)=>Math.min(n,demand[i]));return {served,remaining:stock.map((n,i)=>n-served[i]),unmet:demand.map((n,i)=>n-served[i])};}
function morning(stock:readonly number[],action:Move){const after=move(stock,action), b=borrow(after,bikeDemands[0].counts),evening=[...b.remaining];for(let i=0;i<3;i++)evening[bikeRules.morningReturnTo[i]]+=b.served[i];return {after,...b,evening};}
function legal(stock:readonly number[]):Move[]{const moves:Move[]=[null];for(let from=0;from<3;from++)for(let to=0;to<3;to++)for(let quantity=1;quantity<=2;quantity++)if(from!==to&&stock[from]>=quantity&&stock[to]+quantity<=12)moves.push({from,to,quantity});return moves;}

test("单车题独立追踪库存/借还去向，原基线与可行替代都自洽，不要求唯一最优",()=>{
  assert.deepEqual(bikeInitial,[2,6,4]);assert.deepEqual(bikeDemands.map(r=>r.counts),[[5,1,1],[1,5,1]]);
  assert.equal(bikeRules.vehicleCapacity,2);assert.equal(bikeRules.maxTransfersPerPeriod,1);
  const sample=morning(bikeInitial,{from:2,to:0,quantity:2});
  assert.deepEqual(sample,{after:[4,6,2],served:[4,1,1],remaining:[0,5,1],unmet:[1,0,0],evening:[1,9,2]});
  assert.deepEqual(morning(bikeInitial,null).evening,[1,7,4]);
  const base=morning(bikeInitial,{from:1,to:0,quantity:2});assert.deepEqual(base.after,[4,4,4]);assert.deepEqual(base.evening,[1,7,4]);
  const baseEvening=borrow(move(base.evening,{from:1,to:0,quantity:2}),bikeDemands[1].counts);
  assert.deepEqual(baseEvening.unmet,[0,0,0]);assert.equal(base.unmet.reduce((a,b)=>a+b,0),1);
  const alternative=borrow(sample.evening,bikeDemands[1].counts);assert.deepEqual(alternative.unmet,[0,0,0]);
  assert.equal(2*bikeRules.costPerBikeMove,2);assert.equal(4*bikeRules.costPerBikeMove,4);
  const answer=exercises[0].solution.join("\n");for(const value of ["4/6/2","0/5/1","1/9/2","1/7/4","搬运4辆次"])assert.ok(answer.includes(value),value);
});

test("枚举两窗口合法转运，所有中间量非负、守恒且有多个合理方案",()=>{
  const outcomes=[];
  for(const a of legal(bikeInitial)){const first=morning(bikeInitial,a);assert.equal(first.evening.reduce((a,b)=>a+b,0),12);
    assert.equal(first.remaining.reduce((a,b)=>a+b,0)+first.served.reduce((a,b)=>a+b,0),12);
    for(const b of legal(first.evening)){const second=borrow(move(first.evening,b),bikeDemands[1].counts);assert.equal(second.remaining.reduce((a,b)=>a+b,0)+second.served.reduce((a,b)=>a+b,0),12);outcomes.push({unmet:[...first.unmet,...second.unmet].reduce((a,b)=>a+b,0),cost:(a?.quantity??0)+(b?.quantity??0)});}
  }
  assert.ok(outcomes.length>100);assert.ok(outcomes.filter(r=>r.unmet===1&&r.cost===2).length>1);
  assert.throws(()=>move(bikeInitial,{from:0,to:1,quantity:3}));assert.throws(()=>move([0,8,4],{from:0,to:1,quantity:1}));
});

test("三目标有两道分段独立题，第二提示只给整理操作，不填写方案或数值结论",()=>{
  assert.deepEqual(exercises.map(e=>e.id),["plan-bike-dispatch","choose-rl-projects"]);
  assert.deepEqual(lesson.assessmentMap,[{objective:1,exerciseIds:["plan-bike-dispatch","choose-rl-projects"]},{objective:2,exerciseIds:["plan-bike-dispatch"]},{objective:3,exerciseIds:["plan-bike-dispatch","choose-rl-projects"]}]);
  assert.equal(lessonExerciseLinks(lesson).length,2);
  for(const e of exercises){assert.equal(e.hints.length,2);assert.equal(e.prompt.split("\n\n").length,3);assert.ok(e.solution.some(s=>s.includes("常见错误")));assert.ok(e.solution.some(s=>s.includes("接受")));assert.doesNotMatch(e.hints[1],/17|25|1\/9\/2|馆→教|甲.*监督|乙.*规则|丙.*强化/);}
  for(const term of ["有条件决定","基线","未参与调整","记录来源"])assert.ok(exercises[0].prompt.includes(term));
  assert.match(exercises[1].prompt,/每项指出一个会误导/);assert.match(exercises[1].prompt,/为丙另写/);
});

test("方法选择与离线/模拟/反馈边界明确，文案修改不冒充内部RL训练",()=>{
  const methods=blocks.find(b=>b.type==="table"&&b.caption==="任务不同，先考虑的解决办法也不同")!;
  assert.equal(methods.type,"table");if(methods.type==="table")assert.equal(methods.rows.length,5);
  for(const [section,terms]of [["obtain-feedback",["离线强化学习","无需实时控制真实设备","没自动告诉我们"]],["simulation-check",["传感延迟","人工接管","不一定要建完整模拟器"]],["compare-fairly",["同样","没有参与挑选","随机变化","基线"]]] as const)for(const term of terms)assert.ok(text(section).includes(term),term);
  const answer=exercises[1].solution.join("\n");assert.match(answer,/改变下一次输入/);assert.match(answer,/不能据当前缺证反推该模型从未采用RL训练/);
});

test("零新图零模型代码，HTML表格保留语义、数学和三级details可渲染",()=>{
  assert.equal(blocks.some(b=>["ai-task-figure","image","code","experiment","downloads"].includes(b.type)),false);assert.deepEqual(lesson.resources,[]);
  assert.equal(blocks.filter(b=>b.type==="math").length,2);
  for(const b of blocks.filter(b=>b.type==="table")){assert.ok(b.rows.every(r=>r.length===b.columns.length));const html=renderToStaticMarkup(createElement(ContentRenderer,{block:b,resources:[]}));assert.match(html,/<caption/);assert.match(html,/tabindex="0"/);}
  for(const e of exercises){const html=renderToStaticMarkup(createElement(ContentRenderer,{block:e,resources:[]}));assert.equal((html.match(/<details/g)??[]).length,3);assert.doesNotMatch(html,/<details[^>]*\sopen/);}
  assert.ok(lesson.sections.every(s=>s.tier==="core"&&!/^\d+(?:\.\d+)+[.、\s]/.test(s.title)));
  for(const link of lesson.prerequisiteLinks){const [path,hash]=link.href.split("#"),parts=path.split("/");assert.ok(resolveLesson(parts[2],parts[3])!.lesson.sections.some(s=>s.id===hash));}
});

test("draft私有与预览门禁一致，5.4到5.5自动接通，6.2以后仍规划",()=>{
  const pub=publicationManifest.find(p=>p.lessonId===lesson.id)!,course=getLearningCourse("AI000")!;
  assert.equal(lesson.contentVersion,1);assert.equal(pub.contentVersion,1);assert.equal(course.status,"planned");assert.equal(pub.reviewEvidence,undefined);
  assert.equal(Boolean(resolveLesson("AI000",lesson.id)),isReadable(pub));
  if(isReadable(pub)){assert.equal(getAdjacentLessons(course,"AI000-C05-L04").next?.lessonId,lesson.id);assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C05-L04");assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,"AI000-C06-L01");}
  else {assert.equal(pub.status,"draft");assert.equal(pub.access,"private");}
  for(const slot of course.chapters.slice(5).flatMap(c=>c.lessons).filter(l=>l.lessonId>"AI000-C06-L02")){assert.equal(slot.status,"planned");assert.equal(slot.href,undefined);assert.equal(lessonRegistry.has(slot.lessonId),false);}
});

test("真实存储保留40旧课和1.2/5.3历史r1，新5.5 r1位置完成独立恢复",()=>{
  const memory=new Map<string,string>(),port={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}},store=createProgressStore(()=>port);
  for(const old of before.lessons)store.save(lessonProgressScope(old),100,old.sections.at(-1)!.id,true);
  for(const id of ["AI000-C01-L02","AI000-C05-L03"]){const historical={...lessonProgressScope(lessonRegistry.get(id)!),contentVersion:1};store.save(historical,100,historical.sectionIds[0],true);}
  const saved=new Map(memory),scope=lessonProgressScope(lesson);assert.equal(progressKey(scope),"aivora:learning:v2:AI000:AI000-C05-L05:r1");assert.equal(store.getSnapshot(scope),null);
  store.save(scope,54,"score-and-requirements");const restored=createProgressStore(()=>port);assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.section,"score-and-requirements");assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.completed,false);
  restored.save(scope,100,"takeaways",true);assert.equal(parseReadingProgress(createProgressStore(()=>port).getSnapshot(scope),scope)?.completed,true);
  for(const [k,v]of saved)assert.equal(memory.get(k),v,k);
});

test("5.5学时唯一维护与新课一致，旧646–992证据留存，当前完整路线710–1080",()=>{
  const estimate=getCourseStudyEstimate("AI000")!;assert.deepEqual(estimate.totalMinutes,[710,1080]);assert.equal(estimate.hours,"11.8–18.0");
  const previous=JSON.parse(readFileSync("docs/ai000-cross-lesson-quality/TIME_ESTIMATE.json","utf8"));assert.deepEqual(previous.totalMinutes,[646,992]);
  assert.deepEqual(lesson.learningTime,{reading:[12,18],practice:[28,42],coding:[0,0],basis:"editorial-estimate"});
});
