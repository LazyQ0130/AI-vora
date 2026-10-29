import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { whyFoundationsLesson as lesson } from "../src/content/lessons/ai000/why-foundations";
import { foundationRepairRecords, foundationBorrowingRows, learningPlanRows } from "../src/content/lessons/ai000/foundations-example";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { lessonSchema, isReadable } from "../src/content/models";
import { beforeFoundationsSource } from "../scripts/ai000-foundations-compatibility";
import type { FoundationsBaseline } from "../scripts/review-ai000-7-1";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { createProgressStore, progressKey, parseReadingProgress } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";
import { fixedParcelModel, newInferenceParcel, laterParcelLog } from "../src/content/lessons/ai000/fixed-model-example";
const before=JSON.parse(readFileSync("docs/ai000-7-1/BEFORE.json","utf8")) as FoundationsBaseline;
const blocks=lesson.sections.flatMap(s=>s.blocks),tasks=blocks.filter(b=>b.type==="exercise");
const section=(id:string)=>lesson.sections.find(s=>s.id===id)!;
const prose=(id:string)=>JSON.stringify(section(id).blocks);
const sha=(b:Buffer)=>createHash("sha256").update(b).digest("hex");

test("7.1完整保护44旧Lesson/发布与246文件，额外源码不被兼容层吞掉",()=>{
  assert.equal(before.lessons.length,44);assert.equal(before.publications.length,44);assert.equal(before.files.length,246);
  assert.equal(lessonRegistry.size,45);assert.equal(publicationManifest.length,45);
  for(const old of before.lessons)assert.equal(JSON.stringify(lessonRegistry.get(old.id)),JSON.stringify(old),old.id);
  for(const old of before.publications)assert.deepEqual(publicationManifest.find(p=>p.lessonId===old.lessonId),old,old.lessonId);
  for(const f of before.files){const bytes=readFileSync(f.path);if(sha(bytes)===f.sha256)continue;const reversed=beforeFoundationsSource(f.path,bytes.toString("utf8")).replaceAll("\r\n","\n");assert.ok([reversed,reversed.replaceAll("\n","\r\n")].some(s=>sha(Buffer.from(s))===f.sha256),f.path);}
  const path="src/lib/course-engine.ts",source=readFileSync(path,"utf8"),digest=before.files.find(f=>f.path===path)!.sha256;
  assert.notEqual(sha(Buffer.from(beforeFoundationsSource(path,source+"\n// unexpected"))),digest);
  assert.notEqual(sha(Buffer.from(beforeFoundationsSource(path,source.replace("whyFoundationsLesson,","whyFoundationsLesson, // unexpected")))),digest);
  assert.equal(before.lessons.filter(l=>l.courseId==="AI000").flatMap(l=>l.sections.flatMap(s=>s.blocks)).filter(b=>b.type==="ai-task-figure").length,23);
});
test("主例八事件逐条对照独立预期：六对两错，类别分母也一致",()=>{
  assert.deepEqual(foundationRepairRecords.map(r=>r.id),["R01","R02","R03","R04","R05","R06","R07","R08"]);
  const result=foundationRepairRecords.map(r=>r.confirmed===r.suggested);
  assert.deepEqual(result,[true,true,true,false,true,true,false,true]);
  assert.deepEqual(foundationRepairRecords.filter(r=>r.confirmed!==r.suggested).map(r=>r.id),["R04","R07"]);
  assert.equal(result.filter(Boolean).length/8,0.75);
  const counts=["照明故障","漏水故障","门锁故障"].map(c=>{const group=foundationRepairRecords.filter(r=>r.confirmed===c);return [group.length,group.filter(r=>r.confirmed===r.suggested).length];});
  assert.deepEqual(counts,[[3,2],[3,2],[2,2]]);
  const table=section("eight-records").blocks.find(b=>b.type==="table")!;
  assert.equal(table.type,"table");if(table.type==="table")assert.deepEqual(table.rows,foundationRepairRecords.map(r=>[r.id,r.message,r.confirmed,r.suggested]));
  assert.match(prose("math-use"),/R04.*R07/);assert.match(prose("math-use"),/6÷8=0.75.*75%/);
});
test("100%反例按已知编号重算，错误在范围而非除法",()=>{
  const included=["R01","R02","R03","R05","R06","R08"];
  const rows=foundationRepairRecords.filter(r=>included.includes(r.id));
  assert.equal(rows.length,6);assert.equal(rows.filter(r=>r.confirmed===r.suggested).length/rows.length,1);
  const text=prose("check-denominator");assert.ok(text.includes(included.join("、")));
  assert.match(text,/6÷6=100%/);assert.match(text,/6÷8=75%/);assert.match(text,/参与计算/);
});
test("第四章复用固定4/2与N的3件、实际12，不继承候选排名或另造参数",()=>{
  assert.deepEqual(fixedParcelModel,{baseMinutes:4,minutesPerItem:2});assert.equal(newInferenceParcel.waiting,3);assert.equal(laterParcelLog.actualMinutes,12);
  assert.equal(fixedParcelModel.baseMinutes+fixedParcelModel.minutesPerItem*newInferenceParcel.waiting,10);
  assert.match(prose("math-use"),/4\+2×3=10/);assert.match(prose("math-use"),/5\+2×3=11/);
  assert.match(prose("math-use"),/改为11会相差1分钟/);
});
test("任务先于学科：普通规则、模型调用与训练分开，Python与AI并行而非唯一门槛",()=>{
  assert.equal(lesson.sections[0].id,"project-delivery");
  const delivery=section("project-delivery").blocks.find(b=>b.type==="table")!;if(delivery.type==="table")assert.equal(delivery.rows.length,8);
  assert.match(prose("project-delivery"),/固定规则没有从数据学习/);
  assert.match(prose("python-work"),/其他语言同样可以开发AI系统/);
  assert.match(prose("python-work"),/写固定规则、调用模型、训练模型是不同工作/);
  assert.match(prose("ai-coding"),/一边学习少量概念/);assert.match(prose("ai-coding"),/生成代码、执行代码、验证代码/);
  const minimum=section("minimum-python").blocks.find(b=>b.type==="table")!;assert.equal(minimum.type,"table");if(minimum.type==="table")assert.equal(minimum.rows.length,6);
});
test("数学层级不冒充所有人的先修，数据检查区分缺失/重复/覆盖/评价用途",()=>{
  const rows=section("math-depth").blocks.find(b=>b.type==="table")!;if(rows.type==="table")assert.equal(rows.rows.length,4);
  assert.match(prose("math-depth"),/不是所有项目都需要亲自推导梯度/);
  assert.match(prose("math-depth"),/样本变化/);assert.match(prose("math-depth"),/向量.*矩阵/);
  const quality=section("data-checks").blocks.find(b=>b.type==="table")!;assert.equal(quality.type,"table");if(quality.type==="table")assert.equal(quality.rows.length,6);
  assert.match(prose("data-checks"),/保留原导出与处理依据/);assert.match(prose("data-checks"),/字段相同也可能是不同事件/);
  assert.match(prose("data-checks"),/数据分析包括理解字段、来源和质量/);
  assert.match(prose("dependency-table"),/同一项工作可以同时需要几类基础/);
});
test("图书题独立核算6行5事件、每日分类与待核，不强行训练ML",()=>{
  const events=new Map<string,string[]>();for(const row of foundationBorrowingRows)events.set(row[1],row);
  assert.equal(foundationBorrowingRows.length,6);assert.equal(events.size,5);
  const tally=new Map<string,number>();for(const row of events.values()){const k=row[2]+":"+row[3];tally.set(k,(tally.get(k)??0)+1);}
  assert.deepEqual([...tally],[ ["11月2日:科普",2],["11月2日:文学",1],["11月3日:未登记",1],["11月3日:科普",1] ]);
  const a=tasks[0].solution.join("\n");assert.match(a,/无需训练机器学习/);assert.match(a,/已分类4次\+待核1次=5次/);
  assert.match(a,/若训练.*独立|若训练.*评价/);assert.match(a,/实际分钟数当新件输入/);
  assert.match(a,/A算4\+2×0=4.*B算4\+2×2=8/);
});
test("诊断题另轮按事件核对：7→6→5可比、4对1错、1待核及受控改变60%",()=>{
  assert.equal(learningPlanRows.length,7);
  const events=new Map<string,string[]>();for(const row of learningPlanRows)events.set(row[1],row);
  assert.equal(events.size,6);
  const comparable=[...events.values()].filter(r=>r[3]!=="尚未确认");assert.equal(comparable.length,5);
  assert.deepEqual(comparable.map(r=>[r[1],r[3]===r[4]]),[["E21",true],["E22",false],["E23",true],["E25",true],["E26",true]]);
  assert.equal(comparable.filter(r=>r[3]===r[4]).length/5,0.8);
  const changed=comparable.map(r=>r[1]==="E23"?[...r.slice(0,4),"照明故障"]:r);
  assert.equal(changed.filter(r=>r[3]===r[4]).length/5,0.6);
  const a=tasks[1].solution.join("\n");for(const text of ["7个导出行对应6次独立事件","4÷5=80%","3/5=60%","不能断言一定是哪一种","实际检查一","实际检查二"])assert.ok(a.includes(text),text);
});
test("三目标映射两种不同核心产出，提示不给最终数量/计划，参考答案容许合理顺序",()=>{
  assert.equal(lesson.objectives.length,3);
  assert.deepEqual(lesson.assessmentMap,[{objective:1,exerciseIds:["analyse-project-foundations"]},{objective:2,exerciseIds:["analyse-project-foundations"]},{objective:3,exerciseIds:["repair-learning-plan"]}]);
  assert.deepEqual(lessonExerciseLinks(lesson).map(t=>[t.id,t.objectives]),[["analyse-project-foundations",[1,2]],["repair-learning-plan",[3]]]);
  for(const task of tasks){assert.equal(task.hints.length,2);assert.equal(task.prompt.split("\n\n").length,3);assert.ok(task.solution.some(s=>s.includes("常见错误")));assert.ok(task.solution.some(s=>s.includes("接受")));assert.equal(task.rubric.length,5);assert.doesNotMatch(task.hints.join(""),/80%|60%|4\/5|7→6|先学Python再|科普2/);}
  assert.match(tasks[0].prompt,/分别写实际目标/);assert.match(tasks[1].prompt,/至少找出四项具体问题/);
  const invalid=structuredClone(lesson);invalid.sections.find(s=>s.id==="plan-task")!.tier="advanced";assert.equal(lessonSchema.safeParse(invalid).success,false);
});
test("所有课程链接均有真实目录/正文/锚点，DS/ST无伪造课时且事实先修未改",()=>{
  const links=[...lesson.prerequisiteLinks,...blocks.filter(b=>b.type==="reading-links").flatMap(b=>b.links)];
  for(const link of links){const [path,hash]=link.href.split("#");if(path.startsWith("/learn/")){const parts=path.split("/"),target=resolveLesson(parts[2],parts[3]);assert.ok(target,link.href);if(hash)assert.ok(target.lesson.sections.some(s=>s.id===hash),link.href);}else if(path.startsWith("/courses/"))assert.ok(getLearningCourse(path.split("/")[2]),path);}
  for(const id of ["DS101","ST101"]){assert.equal(publicationManifest.filter(p=>p.courseId===id).length,0);assert.equal(getLearningCourse(id)!.status,"planned");assert.match(prose("course-connections"),/尚无正文/);}
  const facts=JSON.parse(readFileSync("curriculum/AI技术课程目录_V1.0.json","utf8")).courses as {id:string;lvl:string;req:string}[];
  assert.equal(facts.find(c=>c.id==="DS101")!.req,"PY101 第 1–8 章；MA101 前 3 章建议");
  assert.equal(facts.find(c=>c.id==="ML201")!.lvl,"L2");
});
test("表格原生语义/局部滚动，六折叠默认关闭，无额外图、代码或运行组件",()=>{
  assert.deepEqual(lesson.resources,[]);assert.ok(blocks.every(b=>!["image","ai-task-figure","code","math","downloads","experiment"].includes(b.type)));
  for(const b of blocks.filter(b=>b.type==="table")){const html=renderToStaticMarkup(createElement(ContentRenderer,{block:b,resources:[]}));assert.match(html,/<caption/);assert.match(html,/<th/);assert.match(html,/tabindex="0"/);}
  for(const b of tasks){const html=renderToStaticMarkup(createElement(ContentRenderer,{block:b,resources:[]}));assert.equal((html.match(/<details/g)??[]).length,3);assert.doesNotMatch(html,/<details[^>]*\sopen/);assert.ok(html.includes(`id="exercise-${b.id}"`));}
  assert.ok(lesson.sections.every(s=>s.tier==="core"&&!/^\d+[.、\s]/.test(s.title)));
});
test("draft私有/preview门禁，6.3↔7.1及7.2/7.3保持规划，整门不发布",()=>{
  const course=getLearningCourse("AI000")!,pub=publicationManifest.find(p=>p.lessonId===lesson.id)!;
  assert.equal(pub.contentVersion,1);assert.equal(pub.reviewEvidence,undefined);assert.equal(course.status,"planned");assert.equal(course.hours,"6–10");
  assert.equal(Boolean(resolveLesson("AI000",lesson.id)),isReadable(pub));
  if(isReadable(pub)){assert.equal(pub.status,"pending-review");assert.equal(pub.technicalEvidence,"docs/AI000_LESSON_7_1_REVIEW.md");assert.equal(getAdjacentLessons(course,"AI000-C06-L03").next?.lessonId,lesson.id);assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C06-L03");assert.equal(getAdjacentLessons(course,lesson.id).next,undefined);}
  else {assert.equal(pub.status,"draft");assert.equal(pub.access,"private");}
  for(const slot of course.chapters[6].lessons.slice(1)){assert.equal(slot.status,"planned");assert.equal(slot.href,undefined);assert.equal(lessonRegistry.has(slot.lessonId),false);}
  assert.equal(resolveLesson("PY101",lesson.id),undefined);
});
test("7.1初始r1独立空态，保留44旧课和1.2/5.3历史r1且能恢复位置/完成",()=>{
  const memory=new Map<string,string>(),port={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}},store=createProgressStore(()=>port);
  for(const old of before.lessons)store.save(lessonProgressScope(old),100,old.sections.at(-1)!.id,true);
  for(const id of ["AI000-C01-L02","AI000-C05-L03"])store.save({...lessonProgressScope(lessonRegistry.get(id)!),contentVersion:1},100,"takeaways",true);
  const saved=new Map(memory),scope=lessonProgressScope(lesson);assert.equal(progressKey(scope),"aivora:learning:v2:AI000:AI000-C07-L01:r1");assert.equal(store.getSnapshot(scope),null);
  store.save(scope,48,"data-checks");const restored=createProgressStore(()=>port);assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.section,"data-checks");assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.completed,false);
  restored.save(scope,100,"course-connections",true);assert.equal(parseReadingProgress(createProgressStore(()=>port).getSnapshot(scope),scope)?.completed,true);
  for(const [k,v]of saved)assert.equal(memory.get(k),v,k);
});
test("7.1分项编辑估计与24节764–1154同步，旧734–1112证据保留",()=>{
  assert.deepEqual(lesson.learningTime,{reading:[14,22],practice:[34,50],coding:[0,0],basis:"editorial-estimate"});
  const time=getCourseStudyEstimate("AI000")!;assert.deepEqual(time.totalMinutes,[764,1154]);assert.equal(time.hours,"12.7–19.2");
  assert.deepEqual(JSON.parse(readFileSync("docs/ai000-6-3/TIME_ESTIMATE.json","utf8")).totalMinutes,[734,1112]);
});
