import { assertRegisteredInventory } from "./helpers/registered-content";
import { beforeR3Revision } from "../scripts/ai000-r3-compatibility";
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { privacyFairnessLesson as lesson } from "../src/content/lessons/ai000/privacy-bias-fairness";
import { repairFields, repairCoverage, repairChecks, libraryChecks, libraryConditions, eventTasks, eventFields, categorySummary } from "../src/content/lessons/ai000/privacy-fairness-example";
import type { CategoryRecord } from "../src/content/lessons/ai000/privacy-fairness-example";
import { beforePrivacySource } from "../scripts/ai000-privacy-compatibility";
import type { PrivacyBaseline } from "../scripts/review-ai000-6-2";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { lessonSchema, isReadable } from "../src/content/models";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { createProgressStore, progressKey, parseReadingProgress } from "../src/lib/learning-progress";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";

const before=JSON.parse(readFileSync("docs/ai000-6-2/BEFORE.json","utf8")) as PrivacyBaseline;
const blocks=lesson.sections.flatMap(s=>s.blocks),exercises=blocks.filter(b=>b.type==="exercise");
const section=(id:string)=>lesson.sections.find(s=>s.id===id)!;
const prose=(id:string)=>JSON.stringify(section(id).blocks);
const sha=(s:Buffer)=>createHash("sha256").update(s).digest("hex");
function recount(records:readonly CategoryRecord[],condition?:string) {
  const rows=condition?records.filter(r=>r.condition===condition):records;
  const correct:string[]=[],wrong:string[]=[];
  for(const row of rows)(row.expected===row.output?correct:wrong).push(row.id);
  return {total:rows.length,correct,wrong};
}

test("R3登记精修逆转后：6.2之外42旧教材/发布、242文件及23幅精确图完全保留，未登记变化仍失败",()=>{
  assert.equal(before.lessons.length,42);assert.equal(before.publications.length,42);assert.equal(before.files.length,242);
  assertRegisteredInventory();
  for(const old of before.lessons)assert.equal(JSON.stringify(beforeR3Revision(lessonRegistry.get(old.id))),JSON.stringify(old),old.id);
  for(const old of before.publications)assert.deepEqual(beforeR3Revision(publicationManifest.find(p=>p.lessonId===old.lessonId)),old,old.lessonId);
  for(const f of before.files){const bytes=readFileSync(f.path);if(sha(bytes)===f.sha256)continue;const reversed=beforePrivacySource(f.path,bytes.toString("utf8")).replaceAll("\r\n","\n");assert.ok([reversed,reversed.replaceAll("\n","\r\n")].some(s=>sha(Buffer.from(s))===f.sha256),f.path);}
  const path="src/lib/course-engine.ts",source=readFileSync(path,"utf8"),expected=before.files.find(f=>f.path===path)!.sha256;
  assert.notEqual(sha(Buffer.from(beforePrivacySource(path,source+"\n// unregistered"))),expected);
  assert.notEqual(sha(Buffer.from(beforePrivacySource(path,source.replace("privacyFairnessLesson,","privacyFairnessLesson, // changed")))),expected);
  assert.equal(before.lessons.filter(l=>l.courseId==="AI000").flatMap(l=>l.sections.flatMap(s=>s.blocks)).filter(b=>b.type==="ai-task-figure").length,23);
});

test("九字段按任务区分必要/条件性/无默认用途，故障地点不等于实时位置",()=>{
  const decisions=Object.fromEntries(repairFields.map(f=>[f.id,f.decision]));
  assert.deepEqual(decisions,{
    description:"当前任务需要","repair-place":"当前任务需要",category:"工单需要，但可在处理中产生",contact:"有回访需要时按条件取得",
    "name-student-id":"不作通用报修默认字段","identity-number":"本任务不默认收集","live-location":"本任务不默认收集",audio:"选择语音路径时需要处理","address-book":"本任务不默认收集",
  });
  const firstTable=section("repair-task").blocks.find(b=>b.type==="table")!;assert.equal(firstTable.type,"table");if(firstTable.type==="table"){assert.equal(firstTable.rows.length,9);assert.equal(firstTable.columns.length,2);assert.deepEqual(firstTable.rows,repairFields.map(f=>[f.name,f.proposed]));}
  const explanation=prose("purpose-first");for(const term of ["学生在图书馆提交","维修人员仍要去二号楼","未必需要一开始收手机号"])assert.ok(explanation.includes(term),term);
  assert.match(repairFields.find(f=>f.id==="category")!.reason,/不要求报修者先给正确标签/);
  assert.match(repairFields.find(f=>f.id==="contact")!.reason,/不无条件必填/);
});

test("原音/文字/关联风险分别管理，不以删姓名/一句匿名或前端移除作保证",()=>{
  assert.match(prose("personal-information"),/声音特征、姓名、旁人的对话或地点线索/);
  assert.match(prose("personal-information"),/没有改动原始音频/);
  assert.match(prose("manage-data"),/原始音频用于转写，核对后的文字和类别用于派单/);
  const roles=section("manage-data").blocks.find(b=>b.type==="table")!;assert.equal(roles.type,"table");if(roles.type==="table"){assert.equal(roles.rows.length,4);assert.match(roles.rows[0][2],/不默认开放全校历史/);assert.match(roles.rows[1][2],/不因能复核就可听全库/);}
  assert.match(prose("manage-data"),/工单核对完成/);assert.match(prose("manage-data"),/服务端、日志、导出文件或备份/);
  assert.match(prose("manage-data"),/没有本课通用的法定天数/);assert.match(prose("manage-data"),/不能代替检查剩余声音特征与关联风险/);
});

test("开发15条覆盖清单可重数为12/3，与8条独立检查不混用",()=>{
  assert.equal(new Set(repairCoverage.map(r=>r.id)).size,15);
  assert.deepEqual(repairCoverage.filter(r=>r.condition==="A").map(r=>r.id),Array.from({length:12},(_,i)=>`D${String(i+1).padStart(2,"0")}`));
  assert.deepEqual(repairCoverage.filter(r=>r.condition==="B").map(r=>r.id),["D13","D14","D15"]);
  assert.equal(repairCoverage.length,12+3);assert.equal(repairChecks.length,8);
  assert.ok(repairChecks.every(c=>!repairCoverage.some(d=>d.id===c.id)));
  assert.match(prose("coverage"),/不从文字稿猜民族、籍贯或个人身份/);
  assert.match(prose("coverage"),/不能断定系统必然对B出错/);
});

test("主例逐条独立计数A4/4、B2/4、合计6/8，所有分子分母与错例一致",()=>{
  assert.deepEqual(recount(repairChecks,"A"),{total:4,correct:["A1","A2","A3","A4"],wrong:[]});
  assert.deepEqual(recount(repairChecks,"B"),{total:4,correct:["B1","B3"],wrong:["B2","B4"]});
  assert.deepEqual(recount(repairChecks),{total:8,correct:["A1","A2","A3","A4","B1","B3"],wrong:["B2","B4"]});
  assert.deepEqual(categorySummary(repairChecks,["A","B"]),[["A","4","4","0","4/4"],["B","4","2","2","2/4"],["合计","8","6","2","6/8"]]);
  const tables=section("compare-results").blocks.filter(b=>b.type==="table");assert.equal(tables[0].rows.length,8);
  assert.deepEqual(tables[0].rows.map(r=>r[4]),["一致","一致","一致","一致","一致","不一致","一致","不一致"]);
  assert.deepEqual(tables[1].rows,[["A","4","4","0","4/4"],["B","4","2","2","2/4"],["合计","8","6","2","6/8"]]);
  assert.match(prose("compare-results"),/正确4\+2=6条，总数4\+4=8条/);
  assert.match(prose("check-records"),/不把它称为转写正确率/);
});

test("观察差异、因果与服务后果分别说明，代表性和公平不靠机械等量",()=>{
  assert.match(prose("compare-results"),/尚不能推广成所有B条件使用者/);
  assert.match(prose("compare-results"),/不能单凭这张表确定口音导致错误/);
  assert.match(prose("compare-results"),/是否实际派错、是否使某些请求等待更久，还要查/);
  assert.match(prose("fairness"),/每类机械收一样多，并不保证覆盖充分/);
  assert.match(prose("fairness"),/不能凭一个相等数字宣布全面公平/);
  const improvement=section("improve-service").blocks.find(b=>b.type==="table")!;assert.equal(improvement.type,"table");if(improvement.type==="table"){assert.equal(improvement.rows.length,6);assert.match(improvement.rows[1][1],/原声音、人工确认文字与系统转写/);assert.match(improvement.rows[2][1],/分类实际输入及输出/);assert.match(improvement.rows[4][1],/文字报修、人工核实/);}
});

test("活动新题明确11候选项与两类任务，完整解答保功能并限制私人状态",()=>{
  assert.equal(eventTasks.length,2);assert.equal(eventFields.length,11);assert.equal(new Set(eventFields.map(f=>f[0])).size,11);
  assert.match(eventTasks[0][1],/不读取任何人的私人报名记录/);assert.match(eventTasks[1][1],/适当身份核验.*只返回其本人所需状态/);
  const answer=exercises[0].solution.join("\n");
  for(const name of ["用户问题","活动规则文档","活动名称","咨询时间","姓名","学号","身份证号码","手机通讯录","实时精确位置","历史聊天全文","自愿补充材料"])assert.ok(answer.includes(name),name);
  assert.match(answer,/不能把姓名\/学号本身当已经完成可靠核验/);
  assert.match(answer,/以上四项已满足至少四项要求/);
  assert.match(answer,/咨询办结时复查/);assert.match(answer,/服务端、导出件、日志和备份/);
  assert.match(answer,/不自动查询私人状态而完整转人工/);assert.match(answer,/自愿不保证材料无旁人信息/);
});

test("图书馆10条交错记录独立计数甲4/5乙2/5总6/10，不照搬主例错位",()=>{
  assert.deepEqual(libraryChecks.map(r=>r.condition),["甲","乙","甲","乙","甲","乙","甲","乙","甲","乙"]);
  assert.deepEqual(recount(libraryChecks,"甲"),{total:5,correct:["L01","L03","L07","L09"],wrong:["L05"]});
  assert.deepEqual(recount(libraryChecks,"乙"),{total:5,correct:["L04","L08"],wrong:["L02","L06","L10"]});
  assert.equal(recount(libraryChecks).correct.length,6);assert.equal(recount(libraryChecks).wrong.length,4);
  assert.deepEqual(categorySummary(libraryChecks,["甲","乙"]),[["甲","5","4","1","4/5"],["乙","5","2","3","2/5"],["合计","10","6","4","6/10"]]);
  const answer=exercises[1].solution.join("\n");for(const [id,right]of libraryChecks.map(r=>[r.id,r.expected===r.output] as const))assert.ok(answer.includes(id+(right?"对":"错")),id);
  assert.match(answer,/正确4\+2=6，错误1\+3=4，总数5\+5=10/);
});

test("图书馆同时变了语音/设备/噪声，答案不据混杂推能力，要求分步骤和新检查",()=>{
  assert.deepEqual(libraryConditions.map(r=>r.slice(2)),[["电脑麦克风","安静房间"],["手机麦克风","有背景交谈"]]);
  assert.notEqual(libraryConditions[0][1],libraryConditions[1][1]);
  const answer=exercises[1].solution.join("\n");
  for(const term of ["不能单独归因于口音","同一设备和相近环境","分类真正接收的文字及输出","提供定位线索","不从文字推断民族籍贯","另用未参与调整的相关新请求","旧方案与改进方案面对同样的检查材料"])assert.ok(answer.includes(term),term);
  assert.match(exercises[1].prompt,/至少提出两项/);assert.match(exercises[1].prompt,/最小条件标签/);
});

test("三目标映射两种独立核心产出，两级提示不填字段判断或分组答案",()=>{
  assert.deepEqual(exercises.map(e=>e.id),["audit-event-data","compare-library-results"]);assert.equal(lessonExerciseLinks(lesson).length,2);
  assert.deepEqual(lesson.assessmentMap,[{objective:1,exerciseIds:["audit-event-data"]},{objective:2,exerciseIds:["compare-library-results"]},{objective:3,exerciseIds:["audit-event-data","compare-library-results"]}]);
  for(const e of exercises){assert.equal(e.hints.length,2);assert.equal(e.prompt.split("\n\n").length,3);assert.ok(e.solution.some(s=>s.includes("接受")));assert.ok(e.solution.some(s=>s.includes("常见错误")));assert.ok(e.rubric.length>=4);}
  assert.doesNotMatch(exercises[0].hints[1],/身份证|通讯录|精确位置|姓名|学号|不应收集/);
  assert.doesNotMatch(exercises[1].hints[1],/4\/5|2\/5|6\/10|80%|40%|60%|L0|L10|口音导致/);
  const invalid=structuredClone(lesson);invalid.sections.find(s=>s.id==="library-results-task")!.tier="advanced";assert.equal(lessonSchema.safeParse(invalid).success,false);
});

test("仅HTML表格与文字，无录音/图片/运行接口，题目可折叠且补修锚点真实",()=>{
  assert.ok(blocks.every(b=>!["image","ai-task-figure","code","experiment","downloads","math"].includes(b.type)));assert.deepEqual(lesson.resources,[]);
  for(const b of blocks.filter(b=>b.type==="table")){const html=renderToStaticMarkup(createElement(ContentRenderer,{block:b,resources:[]}));assert.match(html,/<caption/);assert.match(html,/<th/);assert.match(html,/tabindex="0"/);}
  for(const e of exercises){const html=renderToStaticMarkup(createElement(ContentRenderer,{block:e,resources:[]}));assert.equal((html.match(/<details/g)??[]).length,3);assert.doesNotMatch(html,/<details[^>]*\sopen/);}
  for(const link of lesson.prerequisiteLinks){const [path,hash]=link.href.split("#"),parts=path.split("/");assert.ok(resolveLesson(parts[2],parts[3])!.lesson.sections.some(s=>s.id===hash),link.href);}
  assert.ok(lesson.sections.every(s=>s.tier==="core"&&!/^\d+[.、\s]/.test(s.title)));
});

test("draft/preview门禁与6.1到6.2自动导航，7.4无正文，整门仍planned",()=>{
  const pub=publicationManifest.find(p=>p.lessonId===lesson.id)!,course=getLearningCourse("AI000")!;
  assert.equal(pub.contentVersion,1);assert.equal(pub.reviewEvidence,undefined);assert.equal(course.status,"planned");assert.equal(course.hours,"6–10");
  assert.equal(Boolean(resolveLesson("AI000",lesson.id)),isReadable(pub));
  if(isReadable(pub)){assert.equal(pub.status,"pending-review");assert.equal(getAdjacentLessons(course,"AI000-C06-L01").next?.lessonId,lesson.id);assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C06-L01");assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,"AI000-C06-L03");}
  else {assert.equal(pub.status,"draft");assert.equal(pub.access,"private");}
  for(const slot of course.chapters.flatMap(c=>c.lessons).filter(l=>l.lessonId>"AI000-C07-L03")){assert.equal(slot.href,undefined);assert.equal(slot.status,"planned");assert.equal(lessonRegistry.has(slot.lessonId),false);}
});

test("6.2 r1初始空态，42旧课与1.2/5.3历史r1不被覆盖，位置和完成独立恢复",()=>{
  const memory=new Map<string,string>(),port={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}},store=createProgressStore(()=>port);
  for(const old of before.lessons)store.save(lessonProgressScope(old),100,old.sections.at(-1)!.id,true);
  for(const id of ["AI000-C01-L02","AI000-C05-L03"])store.save({...lessonProgressScope(lessonRegistry.get(id)!),contentVersion:1},100,"takeaways",true);
  const saved=new Map(memory),scope=lessonProgressScope(lesson);assert.equal(progressKey(scope),"aivora:learning:v2:AI000:AI000-C06-L02:r1");assert.equal(store.getSnapshot(scope),null);
  store.save(scope,58,"compare-results");const restored=createProgressStore(()=>port);assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.section,"compare-results");assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.completed,false);
  restored.save(scope,100,"takeaways",true);assert.equal(parseReadingProgress(createProgressStore(()=>port).getSnapshot(scope),scope)?.completed,true);for(const [k,v]of saved)assert.equal(memory.get(k),v,k);
});

test("6.2完整任务量同步唯一学时，旧688–1050证据保留，当前路线850–1280",()=>{
  assert.deepEqual(lesson.learningTime,{reading:[14,20],practice:[30,44],coding:[0,0],basis:"editorial-estimate"});
  const estimate=getCourseStudyEstimate("AI000")!;assert.deepEqual(estimate.totalMinutes,[850,1280]);assert.equal(estimate.hours,"14.2–21.3");
  assert.deepEqual(JSON.parse(readFileSync("docs/ai000-6-1/TIME_ESTIMATE.json","utf8")).totalMinutes,[688,1050]);
});
