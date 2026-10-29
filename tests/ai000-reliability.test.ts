import { beforeR3Revision } from "../scripts/ai000-r3-compatibility";
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { unreliableAnswersLesson as lesson } from "../src/content/lessons/ai000/unreliable-answers";
import { exhibitSources, exhibitAnswer, exhibitClaims, exhibitEvidence, exhibitRevision, submissionSources, submissionAnswer, venueSources, venueRequest } from "../src/content/lessons/ai000/reliability-example";
import { beforeReliabilitySource } from "../scripts/ai000-reliability-compatibility";
import type { ReliabilityBaseline } from "../scripts/review-ai000-6-1";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { isReadable, lessonSchema } from "../src/content/models";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { createProgressStore, progressKey, parseReadingProgress } from "../src/lib/learning-progress";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";

const before=JSON.parse(readFileSync("docs/ai000-6-1/BEFORE.json","utf8")) as ReliabilityBaseline;
const blocks=lesson.sections.flatMap(s=>s.blocks), exercises=blocks.filter(b=>b.type==="exercise");
const section=(id:string)=>JSON.stringify(lesson.sections.find(s=>s.id===id)!.blocks);
const sha=(s:Buffer)=>createHash("sha256").update(s).digest("hex");

test("R3登记精修逆转后：6.1增加之外41旧课/发布与240文件精确保留，额外修改仍被拒绝",()=>{
  assert.equal(before.lessons.length,41); assert.equal(before.publications.length,41); assert.equal(before.files.length,240);
  assert.equal(lessonRegistry.size,47); assert.equal(publicationManifest.length,47);
  for(const old of before.lessons)assert.equal(JSON.stringify(beforeR3Revision(lessonRegistry.get(old.id))),JSON.stringify(old),old.id);
  for(const old of before.publications)assert.deepEqual(beforeR3Revision(publicationManifest.find(p=>p.lessonId===old.lessonId)),old);
  for(const file of before.files){const bytes=readFileSync(file.path);if(sha(bytes)===file.sha256)continue;const reversed=beforeReliabilitySource(file.path,bytes.toString("utf8")).replaceAll("\r\n","\n");assert.ok([reversed,reversed.replaceAll("\n","\r\n")].some(s=>sha(Buffer.from(s))===file.sha256),file.path);}
  const path="src/lib/course-engine.ts",source=readFileSync(path,"utf8"),expected=before.files.find(f=>f.path===path)!.sha256;
  assert.notEqual(sha(Buffer.from(beforeReliabilitySource(path,source+"\n// undeclared change"))),expected);
  assert.notEqual(sha(Buffer.from(beforeReliabilitySource(path,source.replace("unreliableAnswersLesson,","unreliableAnswersLesson, // unexpected")))),expected);
  assert.equal(before.lessons.filter(l=>l.courseId==="AI000").flatMap(l=>l.sections.flatMap(s=>s.blocks)).filter(b=>b.type==="ai-task-figure").length,23);
});

test("R1/R2原文和适用范围完整，星期日常规开放仍由当天例外覆盖",()=>{
  assert.deepEqual(exhibitSources.map(s=>[s.id,s.published,s.scope]),[["R1","2026-10-20","2026年11月"],["R2","2026-10-25","2026年11月15日"]]);
  assert.match(exhibitSources[0].content,/周三至周日10:00–17:00/); assert.match(exhibitSources[0].content,/周一、周二常规闭馆/);
  assert.match(exhibitSources[0].content,/16:30停止入场；门票免费/);
  assert.match(exhibitSources[1].content,/11月15日全天暂停对公众开放/); assert.match(exhibitSources[1].content,/恢复安排以之后正式公告为准/);
  assert.equal(new Date("2026-11-15T00:00:00Z").getUTCDay(),0);
  assert.equal(exhibitSources.some(s=>s.id==="R9"),false);
  assert.ok(exhibitSources.every(s=>!/预约|停车/.test(s.content)));
  assert.match(section("check-conditions"),/不只是因为R2发布较晚/);
  assert.match(section("revised-answer"),/没有声称11月16日必定恢复/);
});

test("完整原回答先呈现，拆分保留当天条件，证据表区分矛盾、未知与引用",()=>{
  assert.ok(section("first-answer").includes(exhibitAnswer));
  assert.match(exhibitAnswer,/免费.*地下停车场/);assert.match(exhibitAnswer,/R9/);
  assert.equal(exhibitClaims.length,9);assert.equal(exhibitEvidence.length,9);
  assert.match(exhibitClaims[1][1],/当天/);assert.match(exhibitClaims[2][1],/当天/);
  assert.ok(exhibitEvidence.slice(0,3).every(r=>r[1].includes("矛盾")));
  assert.equal(exhibitEvidence[3][1],"有资料支持");
  assert.ok(exhibitEvidence.slice(4,7).every(r=>r[1]==="资料不足，尚不能确认"));
  assert.equal(exhibitEvidence[7][1],"与资料矛盾");assert.match(exhibitEvidence[8][3],/不据此断言现实世界/);
  const ids=lesson.sections.map(s=>s.id);
  assert.ok(ids.indexOf("first-answer")<ids.indexOf("original-sources"));
  assert.ok(ids.indexOf("check-conditions")<ids.indexOf("evidence-review"));
  assert.ok(ids.indexOf("evidence-review")<ids.indexOf("why-unreliable"));
  assert.match(section("evidence-review"),/门票免费，见R2/);assert.match(section("evidence-review"),/保留事实、改正出处/);
});

test("主例修正版的确定信息只来自R1/R2，未知没有补成收费或预约结论",()=>{
  assert.equal(exhibitRevision.length,3);
  assert.match(exhibitRevision[0],/R2.*2026年11月15日全天暂停开放.*不能正常参观/);
  assert.match(exhibitRevision[1],/R1.*周三至周日10:00–17:00.*16:30停止入场.*门票免费/);
  assert.match(exhibitRevision[1],/不能用来覆盖/);
  assert.match(exhibitRevision[2],/没有说明预约要求和停车收费政策/);
  assert.doesNotMatch(exhibitRevision.join(""),/R9|https?:|\d{3,4}-\d{7,8}|无需预约|停车免费/);
});

test("提交题能独立区分局部修订、专项材料、正确事实错引用和清单外来源",()=>{
  assert.deepEqual(submissionSources.map(s=>[s.id,s.published]),[["S1","2026-10-28"],["S2","2026-10-30"],["S3","2026-11-03"]]);
  const [general,special,revision]=submissionSources.map(s=>s.content);
  // 从题设原文抽取，与原回答分开比对，不用参考答案生成预期。
  assert.match(general,/每组最多3人/); assert.doesNotMatch(special,/3人/);
  assert.match(general,/11月10日18:00/);assert.match(special,/11月12日18:00/);
  assert.match(revision,/软件类截止改为11月14日18:00/);assert.match(revision,/其他类别的截止时间不变/);
  assert.match(special,/演示视频，代替静态照片/);assert.match(special,/PDF说明仍按一般要求/);
  assert.ok(submissionSources.every(s=>!/退费|报名费/.test(s.content)));
  assert.ok(submissionSources.every(s=>s.id!=="S8"));assert.match(submissionAnswer,/每组最多3人（S2）/);
  const answer=exercises[0].solution.join("\n");
  for(const term of ["编号错误","保留3人并改引S1","其现行截止仍见S1的11月10日18:00","未知","不外推现实不存在"])assert.ok(answer.includes(term),term);
  assert.match(answer,/取得可核验原文后.*更新答复/);
});

test("场地题另从原文核验资格/整个时段/完整自然日，申请不等于确认",()=>{
  assert.deepEqual(venueSources.map(s=>s.published),["2026-10-26","2026-11-05"]);
  assert.equal(new Date("2026-11-20T00:00:00Z").getUTCDay(),5);
  const submission=new Date("2026-11-16T00:00:00Z"),event=new Date("2026-11-20T00:00:00Z");
  const fullDays=[];for(let day=submission.getTime()+86400000;day<event.getTime();day+=86400000)fullDays.push(new Date(day).getUTCDate());
  assert.deepEqual(fullDays,[17,18,19]); assert.equal(fullDays.length,3);
  const minutes=(h:number,m=0)=>60*h+m;
  assert.ok(minutes(19,30)>=minutes(19)&&minutes(20,30)<=minutes(21));
  assert.ok(minutes(20,30)>minutes(20));assert.ok(16<=20);
  assert.match(venueSources[0].content,/不计提交日和活动日/);assert.match(venueSources[0].content,/经场地管理员确认后才可使用/);
  assert.match(venueSources[0].content,/免费提供最多20套桌椅/);assert.ok(venueSources.every(s=>!s.content.includes("投影")));
  assert.match(venueSources[1].scope,/2026年11月每个周五，B室/);assert.match(venueSources[1].content,/19:00–21:00/);
  assert.match(venueRequest,/11月16日10:00/);
  const answer=exercises[1].solution.join("\n");for(const term of ["17日、18日、19日","供应与费用","仍需场地管理员确认","不支持一定收费","没有带来设备清单或收费原文"])assert.ok(answer.includes(term),term);
});

test("两个核心开放任务真正映射三目标，第二提示给中间操作而非判断",()=>{
  assert.deepEqual(exercises.map(e=>e.id),["audit-submission-answer","write-venue-answer"]);
  assert.equal(lesson.objectives.length,3);assert.equal(lessonExerciseLinks(lesson).length,2);
  assert.ok(lesson.assessmentMap.every(r=>JSON.stringify(r.exerciseIds)===JSON.stringify(exercises.map(e=>e.id))));
  for(const e of exercises){assert.equal(e.hints.length,2);assert.equal(e.prompt.split("\n\n").length,3);assert.ok(e.solution.some(s=>s.includes("接受")));assert.ok(e.solution.some(s=>s.includes("常见错误")));assert.ok(e.rubric.length>=4);}
  assert.doesNotMatch(exercises[0].hints[1],/S[1238]|14日|12日|3人|退费|视频|人数/);
  assert.doesNotMatch(exercises[1].hints[1],/V[12]|17日|18日|19日|免费|符合|已获|投影/);
  assert.match(exercises[0].prompt,/可能来自/);assert.match(exercises[1].prompt,/再详细一点/);
  const invalid=structuredClone(lesson);invalid.sections.find(s=>s.id==="venue-answer-task")!.tier="advanced";
  assert.equal(lessonSchema.safeParse(invalid).success,false);
});

test("概念解释不把所有错因当编造，检索/重写/资料可靠性与总体评价分开",()=>{
  for(const term of ["训练中学到","当前上下文","外部核验","不同模型和系统能力不同","尚不能断定"])assert.ok(section("why-unreliable").includes(term),term);
  assert.match(section("where-errors-enter"),/使用者提供了错误材料/);
  assert.match(section("where-errors-enter"),/两份同范围安排不同/);
  assert.match(section("checking-workflow"),/没有据此测出某个模型的总体可靠性/);
  assert.match(section("evidence-review"),/也无法证明一定要预约/);
  assert.ok(blocks.every(b=>!["image","ai-task-figure","code","experiment","downloads","math"].includes(b.type)));
  assert.deepEqual(lesson.resources,[]);
});

test("HTML表格与提示解答有可访问语义，先修锚点真实，标题无重复编号",()=>{
  for(const table of blocks.filter(b=>b.type==="table")){const html=renderToStaticMarkup(createElement(ContentRenderer,{block:table,resources:[]}));assert.match(html,/<caption/);assert.match(html,/<th/);assert.match(html,/tabindex="0"/);}
  for(const e of exercises){const html=renderToStaticMarkup(createElement(ContentRenderer,{block:e,resources:[]}));assert.equal((html.match(/<details/g)??[]).length,3);assert.doesNotMatch(html,/<details[^>]*\sopen/);assert.match(html,/textarea/);}
  for(const link of lesson.prerequisiteLinks){const [path,hash]=link.href.split("#"),parts=path.split("/");assert.ok(resolveLesson(parts[2],parts[3])!.lesson.sections.some(s=>s.id===hash),link.href);}
  assert.ok(lesson.sections.every(s=>s.tier==="core"&&!/^\d+[.、\s]/.test(s.title)));
});

test("draft私有与preview门禁正确，5.5和6.1衔接，其余规划无假入口",()=>{
  const pub=publicationManifest.find(p=>p.lessonId===lesson.id)!,course=getLearningCourse("AI000")!;
  assert.equal(pub.contentVersion,1);assert.equal(pub.reviewEvidence,undefined);assert.equal(course.status,"planned");assert.equal(course.hours,"6–10");
  assert.equal(Boolean(resolveLesson("AI000",lesson.id)),isReadable(pub));
  if(isReadable(pub)){assert.equal(pub.status,"pending-review");assert.equal(getAdjacentLessons(course,"AI000-C05-L05").next?.lessonId,lesson.id);assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C05-L05");assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,"AI000-C06-L02");}
  else {assert.equal(pub.status,"draft");assert.equal(pub.access,"private");}
  for(const slot of course.chapters.flatMap(c=>c.lessons).filter(l=>l.lessonId>"AI000-C07-L03")){assert.equal(slot.href,undefined);assert.equal(slot.status,"planned");assert.equal(lessonRegistry.has(slot.lessonId),false);}
});

test("真实存储适配器保留41旧课及1.2/5.3旧r1，6.1初始空态且刷新独立恢复",()=>{
  const memory=new Map<string,string>(),port={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}},store=createProgressStore(()=>port);
  for(const old of before.lessons)store.save(lessonProgressScope(old),100,old.sections.at(-1)!.id,true);
  for(const id of ["AI000-C01-L02","AI000-C05-L03"])store.save({...lessonProgressScope(lessonRegistry.get(id)!),contentVersion:1},100,"takeaways",true);
  const saved=new Map(memory),scope=lessonProgressScope(lesson);assert.equal(progressKey(scope),"aivora:learning:v2:AI000:AI000-C06-L01:r1");assert.equal(store.getSnapshot(scope),null);
  store.save(scope,62,"evidence-review");assert.equal(parseReadingProgress(createProgressStore(()=>port).getSnapshot(scope),scope)?.section,"evidence-review");
  assert.equal(parseReadingProgress(createProgressStore(()=>port).getSnapshot(scope),scope)?.completed,false);
  store.save(scope,100,"takeaways",true);assert.equal(parseReadingProgress(createProgressStore(()=>port).getSnapshot(scope),scope)?.completed,true);
  for(const [k,v]of saved)assert.equal(memory.get(k),v,k);
});

test("6.1实际任务量同步唯一学时与24节规划，旧668–1022证据保留",()=>{
  assert.deepEqual(lesson.learningTime,{reading:[12,18],practice:[30,44],coding:[0,0],basis:"editorial-estimate"});
  const estimate=getCourseStudyEstimate("AI000")!;assert.deepEqual(estimate.totalMinutes,[850,1280]);assert.equal(estimate.hours,"14.2–21.3");
  const previous=JSON.parse(readFileSync("docs/ai000-5-5/TIME_ESTIMATE.json","utf8"));assert.deepEqual(previous.totalMinutes,[668,1022]);
});
