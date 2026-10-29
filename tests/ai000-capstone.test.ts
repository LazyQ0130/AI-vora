import { beforeR3Revision } from "../scripts/ai000-r3-compatibility";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { problemAnalysisCapstoneLesson as lesson } from "../src/content/lessons/ai000/problem-analysis-capstone";
import { capstoneNotices, capstoneCurrentEvents, capstoneBookingRows, capstoneReportTemplate } from "../src/content/lessons/ai000/capstone-example";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { lessonSchema, isReadable } from "../src/content/models";
import { beforeCapstoneSource } from "../scripts/ai000-capstone-compatibility";
import type { CapstoneBaseline } from "../scripts/review-ai000-7-3";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { createProgressStore, progressKey, parseReadingProgress } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";
const before=JSON.parse(readFileSync("docs/ai000-7-3/BEFORE.json","utf8")) as CapstoneBaseline;
const blocks=lesson.sections.flatMap(s=>s.blocks),tasks=blocks.filter(b=>b.type==="exercise");
const section=(id:string)=>lesson.sections.find(s=>s.id===id)!;
const prose=(id:string)=>JSON.stringify(section(id).blocks);
const sha=(b:Buffer)=>createHash("sha256").update(b).digest("hex");

test("R3登记精修逆转后：7.3保护46旧教材/发布、250文件和23精确图，拒绝额外片段与尾部",()=>{
  assert.equal(before.lessons.length,46);assert.equal(before.publications.length,46);assert.equal(before.files.length,250);
  assert.equal(lessonRegistry.size,47);assert.equal(publicationManifest.length,47);
  for(const old of before.lessons)assert.equal(JSON.stringify(beforeR3Revision(lessonRegistry.get(old.id))),JSON.stringify(old),old.id);
  for(const old of before.publications)assert.deepEqual(beforeR3Revision(publicationManifest.find(p=>p.lessonId===old.lessonId)),old,old.lessonId);
  for(const f of before.files){const bytes=readFileSync(f.path);if(sha(bytes)===f.sha256)continue;const reversed=beforeCapstoneSource(f.path,bytes.toString("utf8")).replaceAll("\r\n","\n");assert.ok([reversed,reversed.replaceAll("\n","\r\n")].some(s=>sha(Buffer.from(s))===f.sha256),f.path);}
  const path="src/lib/course-engine.ts",source=readFileSync(path,"utf8"),digest=before.files.find(f=>f.path===path)!.sha256;
  for(const changed of [source+"\n// unexpected",source.replace("problemAnalysisCapstoneLesson,","problemAnalysisCapstoneLesson, // unexpected")])assert.notEqual(sha(Buffer.from(beforeCapstoneSource(path,changed))),digest);
  assert.equal(before.lessons.filter(l=>l.courseId==="AI000").flatMap(l=>l.sections.flatMap(s=>s.blocks)).filter(b=>b.type==="ai-task-figure").length,23);
});
test("三通知同活动更新形成两现行活动，日期/地点/保留截止逐项有原文",()=>{
  assert.deepEqual(capstoneNotices.map(n=>[n.id,n.event]),[["N1","E1"],["N2","E2"],["N3","E1"]]);
  assert.match(capstoneNotices[0].text,/11月12日14:00.*综合楼报告厅.*11月10日18:00/);
  assert.match(capstoneNotices[2].text,/11月13日14:00.*科技楼一楼报告厅.*其他报名要求不变/);
  assert.equal(capstoneCurrentEvents.length,2);assert.match(capstoneCurrentEvents[0][1],/11月13日14:00.*科技楼一楼报告厅.*11月10日18:00/);
  const table=section("capstone-example-analysis").blocks.find(b=>b.type==="table")!;if(table.type==="table")assert.deepEqual(table.rows,capstoneCurrentEvents);
});
test("N2报名未知不借N1政策，手工清单不冒称网页或实时系统",()=>{
  assert.match(capstoneNotices[1].text,/11月14日19:00.*B201.*未说明是否需报名/);
  assert.match(capstoneCurrentEvents[1][1],/是否需报名及方式待核/);
  assert.match(prose("capstone-example-analysis"),/尚未证明网页访问、实时更新或自动处理能力/);
});
test("主例先有人工/规则基线，NLP使用与监督训练的资料/信号有条件区分",()=>{
  const text=prose("capstone-example-analysis");assert.match(text,/基线由整理者.*统一字段/);assert.match(text,/当前不需要LLM训练/);
  assert.match(text,/通知与人工核实字段作监督目标/);assert.match(text,/另留未参与开发/);assert.match(text,/原训练安排不能仅由输出反推/);
});
test("完整示范含三候选和优先依据、技术分工、三阶段及边界结论",()=>{
  const rows=section("capstone-example-choices").blocks.find(b=>b.type==="table")!;if(rows.type==="table")assert.equal(rows.rows.length,3);
  assert.match(prose("capstone-example-choices"),/我先选A.*因为/);assert.match(prose("capstone-example-choices"),/优先项可以改变/);
  assert.match(prose("capstone-example-map"),/模型以外的产品部分/);
  assert.equal(section("capstone-example-route").blocks.filter(b=>b.type==="heading").length,3);
  assert.match(prose("capstone-example-conclusion"),/仍未确认/);
});
test("八问先由完整示范引出，核心不增加算法/编程隐性先修",()=>{
  assert.deepEqual(section("capstone-example-analysis").blocks.filter(b=>b.type==="heading").map(b=>b.text),["实际问题","输入与输出","基线方案","可选技术方法","数据与前置条件","评价与验证","风险与责任","学习与下一步"]);
  const ids=lesson.sections.map(s=>s.id);assert.ok(ids.indexOf("capstone-eight-questions")>ids.indexOf("capstone-example-conclusion"));
  const table=section("capstone-eight-questions").blocks.find(b=>b.type==="table")!;if(table.type==="table")assert.equal(table.rows.length,8);
  assert.match(lesson.prerequisites,/无须Python.*部署经验/);assert.deepEqual(lesson.learningTime.coding,[0,0]);
  assert.ok(blocks.filter(b=>b.type==="code").every(b=>b.language==="text"));
});
test("固定题条件独立且完备，空闲/占用/未知与预约确认不同",()=>{
  assert.deepEqual(capstoneBookingRows.map(r=>r[0]),["S1","S2","S3"]);assert.match(capstoneBookingRows[0][1],/16:00–17:00.*空闲/);assert.match(capstoneBookingRows[1][1],/17:00–18:00.*已占用/);assert.match(capstoneBookingRows[2][1],/未给状态/);
  const text=prose("capstone-audit-task");for(const phrase of ["规则R1","收到确认才算预约成功","查询接口是否存在未知","没有历史预测训练资料"])assert.ok(text.includes(phrase));
  assert.match(tasks[0].solution.join(""),/S3.*未知/);assert.match(tasks[0].solution.join(""),/预约成功未知/);
});
test("固定题要求实际修正与两种核查，预测须有当时输入/后来目标和独立依据",()=>{
  assert.match(tasks[0].prompt,/至少找出.*四个具体问题/);assert.match(tasks[0].prompt,/至少两项可执行核查/);
  const a=tasks[0].solution.join("");assert.match(a,/实际核查一/);assert.match(a,/实际核查二/);assert.match(a,/当时可得信息与后来确认的实际状态/);assert.match(a,/监督学习预测/);assert.match(a,/不需要.*全体|不授权|不符合当前公开查询/);
});
test("个人题独立产生三问题、两小输入和条件变化，其他两问题允许简析",()=>{
  const text=tasks[1].prompt;for(const p of ["三个自选问题","至少给两个自己构造的小输入","其中一个含缺失或条件变化","另外两个为何后置","至少三个有依赖理由的里程碑"])assert.ok(text.includes(p),p);
  assert.match(prose("capstone-delivery"),/其他两个问题只需短记录/);assert.match(text,/允许不采用AI/);
});
test("参考报告完整并给不同优先项的简洁替代，接受非AI与有条件的其他方向",()=>{
  const a=tasks[1].solution.join("");for(const p of ["第一部分","第二部分","第三部分","第四部分","第五部分","第六部分","简洁替代","向量","D3","概率"])assert.ok(a.includes(p),p);
  assert.match(a,/不训练所以当前训练范式不适用/);assert.match(a,/里程碑一.*里程碑二.*里程碑三/);assert.match(a,/选择CV、生成或连续决策也可/);
});
test("里程碑按项目交成果、核查和失败回补，不能只填课程名或看答案",()=>{
  const text=prose("capstone-example-route");for(const p of ["目标","交","能解释","才继续","回补","可并行"])assert.ok(text.includes(p),p);
  assert.match(prose("capstone-checklist"),/看过参考答案.*都不会自动证明/);
  assert.equal(tasks[1].rubric.length,8);assert.match(tasks[1].rubric[5],/至少三里程碑.*失败补修/);
});
test("三目标真实映射两题且去重，提示二只给整理动作不交最终方案",()=>{
  assert.deepEqual(lesson.assessmentMap,[{objective:1,exerciseIds:["audit-booking-proposal","write-personal-capstone"]},{objective:2,exerciseIds:["audit-booking-proposal","write-personal-capstone"]},{objective:3,exerciseIds:["write-personal-capstone"]}]);
  assert.deepEqual(lessonExerciseLinks(lesson).map(x=>[x.id,x.objectives]),[["audit-booking-proposal",[1,2]],["write-personal-capstone",[1,2,3]]]);
  for(const t of tasks){assert.equal(t.hints.length,2);assert.equal(t.prompt.split("\n\n").length,3);assert.match(t.solution.join(""),/常见错误|常见不达标/);assert.doesNotMatch(t.hints.join(""),/S1|S2|S3|D1|11月13|优先A|里程碑一/);}
  const invalid=structuredClone(lesson);invalid.sections.find(s=>s.id==="capstone-personal-task")!.tier="advanced";assert.equal(lessonSchema.safeParse(invalid).success,false);
});
test("Markdown模板六部分、三候选、八问和三阶段完整，原文可复制而非执行",()=>{
  const headings=capstoneReportTemplate.split("\n").filter(l=>l.startsWith("## "));assert.equal(headings.length,6);
  for(const title of ["问题A","问题B","问题C","1. 实际问题","8. 学习与下一步","里程碑一","里程碑二","里程碑三"])assert.ok(capstoneReportTemplate.includes(title),title);
  assert.doesNotMatch(capstoneReportTemplate,/张三|身份证号|账号密码：|95%|已部署/);
  const code=section("capstone-report-template").blocks.find(b=>b.type==="code")!;assert.equal(code.type,"code");if(code.type==="code"){assert.equal(code.language,"text");assert.equal(code.code,capstoneReportTemplate);assert.equal(code.filename,"AI000-final-report.md");}
  assert.match(prose("capstone-report-template"),/刷新会清空/);assert.match(prose("capstone-report-template"),/复制整份文本，不含显示行号/);
});
test("无新装饰图、模型执行或上传资源，原生表格与练习折叠沿用",()=>{
  assert.deepEqual(lesson.resources,[]);assert.ok(blocks.every(b=>!["image","ai-task-figure","experiment","downloads"].includes(b.type)));
  for(const b of blocks.filter(b=>b.type==="table")){const html=renderToStaticMarkup(createElement(ContentRenderer,{block:b,resources:[]}));assert.match(html,/<caption/);assert.match(html,/<th/);assert.match(html,/tabindex="0"/);}
  for(const b of tasks){const html=renderToStaticMarkup(createElement(ContentRenderer,{block:b,resources:[]}));assert.equal((html.match(/<details/g)??[]).length,3);assert.doesNotMatch(html,/<details[^>]*\sopen/);}
});
test("链接仅真实正文锚点/课程规划，原始先修事实及当前试读不冒称全开放",()=>{
  const links=[...lesson.prerequisiteLinks,...blocks.filter(b=>b.type==="reading-links").flatMap(b=>b.links)];
  for(const l of links){const [path,hash]=l.href.split("#");if(path.startsWith("/learn/")){const parts=path.split("/"),target=resolveLesson(parts[2],parts[3]);assert.ok(target,l.href);if(hash)assert.ok(target.lesson.sections.some(s=>s.id===hash),l.href);}else if(path.startsWith("/courses/"))assert.ok(getLearningCourse(path.split("/")[2]),path);}
  for(const [id,current,legacy] of [["PY101",6,0],["MA101",4,5],["ML201",7,1]] as const){const c=getLearningCourse(id)!;assert.equal(c.status,"planned");assert.equal(c.chapters.flatMap(ch=>ch.lessons).filter(l=>l.href).length,current);assert.equal(c.legacyLessons.length,legacy);}
  for(const id of ["DS101","ST101","DL301"]){assert.equal(publicationManifest.filter(p=>p.courseId===id).length,0);assert.ok(links.some(l=>l.href===`/courses/${id}`));}
});
test("七章24节注册顺序完整，7.2↔7.3门禁与末课无下一节，整门不自动发布",()=>{
  const c=getLearningCourse("AI000")!,slots=c.chapters.flatMap(ch=>ch.lessons),pub=publicationManifest.find(p=>p.lessonId===lesson.id)!;
  assert.deepEqual(c.chapters.map(ch=>ch.lessons.length),[3,2,4,4,5,3,3]);assert.equal(slots.length,24);
  assert.deepEqual(c.chapters[6].lessons.map(l=>l.lessonId),["AI000-C07-L01","AI000-C07-L02","AI000-C07-L03"]);
  assert.ok(slots.every(s=>lessonRegistry.has(s.lessonId)));assert.equal(lesson.contentVersion,1);assert.equal(pub.contentVersion,1);assert.equal(pub.reviewEvidence,undefined);assert.equal(c.status,"planned");assert.equal(c.hours,"6–10");
  if(isReadable(pub)){assert.equal(slots.filter(s=>s.href).length,24);assert.equal(pub.status,"pending-review");assert.equal(pub.technicalEvidence,"docs/AI000_LESSON_7_3_AND_COURSE_REVIEW.md");assert.equal(getAdjacentLessons(c,"AI000-C07-L02").next?.lessonId,lesson.id);assert.equal(getAdjacentLessons(c,lesson.id).previous?.lessonId,"AI000-C07-L02");assert.equal(getAdjacentLessons(c,lesson.id).next,undefined);}
  else{assert.equal(pub.status,"draft");assert.equal(pub.access,"private");assert.equal(resolveLesson("AI000",lesson.id),undefined);assert.equal(slots.filter(s=>s.href).length,23);}
  assert.equal(lessonRegistry.has("AI000-C07-L04"),false);assert.equal(resolveLesson("AI000","AI000-C07-L04"),undefined);
});
test("新课独立空态/恢复，保留46旧课及全部旧修订键，不继承1.2/5.3r2完成",()=>{
  const memory=new Map<string,string>(),port={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}},store=createProgressStore(()=>port);
  for(const old of before.lessons){store.save(lessonProgressScope(old),100,old.sections.at(-1)!.id,true);for(let r=1;r<old.contentVersion;r++)store.save({...lessonProgressScope(old),contentVersion:r},100,old.sections[0].id,true);}
  const saved=new Map(memory),scope=lessonProgressScope(lesson);assert.equal(progressKey(scope),"aivora:learning:v2:AI000:AI000-C07-L03:r1");assert.equal(store.getSnapshot(scope),null);
  for(const id of ["AI000-C01-L02","AI000-C05-L03"])for(const r of [1,2])assert.ok(memory.has(`aivora:learning:v2:AI000:${id}:r${r}`));
  store.save(scope,47,"capstone-eight-questions");const restored=createProgressStore(()=>port);assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.section,"capstone-eight-questions");assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.completed,false);
  restored.save(scope,100,"capstone-next-steps",true);assert.equal(parseReadingProgress(createProgressStore(()=>port).getSnapshot(scope),scope)?.completed,true);for(const [k,v] of saved)assert.equal(memory.get(k),v,k);
});
test("阅读/固定练习/综合报告分账，coding零；24节850–1280与旧800–1202并存",()=>{
  assert.deepEqual(lesson.learningTime,{reading:[22,32],practice:[18,26],coding:[0,0],basis:"editorial-estimate"});
  const t=getCourseStudyEstimate("AI000")!,line=t.lessons.find(l=>l.lessonId===lesson.id)!;assert.deepEqual(line.project,[70,110]);assert.deepEqual(line.practice,[18,26]);assert.deepEqual(line.reading,[22,32]);assert.deepEqual(t.totalMinutes,[850,1280]);assert.equal(t.hours,"14.2–21.3");
  assert.match(prose("capstone-delivery"),/综合报告实践.*70–110分钟.*单独计入/);
  assert.deepEqual(JSON.parse(readFileSync("docs/ai000-7-2/TIME_ESTIMATE.json","utf8")).totalMinutes,[800,1202]);
});
