import { beforeR3Revision } from "../scripts/ai000-r3-compatibility";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { directionLearningRoutesLesson as lesson } from "../src/content/lessons/ai000/direction-learning-routes";
import { nlpRouteStages, cvRouteStages, catalogRouteRows, photoRouteRows } from "../src/content/lessons/ai000/direction-route-example";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { lessonSchema, isReadable } from "../src/content/models";
import { beforeDirectionSource } from "../scripts/ai000-directions-compatibility";
import type { RoutesBaseline } from "../scripts/review-ai000-7-2";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { createProgressStore, progressKey, parseReadingProgress } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";
const before=JSON.parse(readFileSync("docs/ai000-7-2/BEFORE.json","utf8")) as RoutesBaseline;
const blocks=lesson.sections.flatMap(s=>s.blocks),tasks=blocks.filter(b=>b.type==="exercise");
const section=(id:string)=>lesson.sections.find(s=>s.id===id)!;
const prose=(id:string)=>JSON.stringify(section(id).blocks);
const sha=(b:Buffer)=>createHash("sha256").update(b).digest("hex");

test("R3登记精修逆转后：7.2逐字保护45旧Lesson/发布、248文件和23精确图，不能吞掉未登记变更",()=>{
  assert.equal(before.lessons.length,45);assert.equal(before.publications.length,45);assert.equal(before.files.length,248);
  assert.equal(lessonRegistry.size,47);assert.equal(publicationManifest.length,47);
  for(const old of before.lessons)assert.equal(JSON.stringify(beforeR3Revision(lessonRegistry.get(old.id))),JSON.stringify(old),old.id);
  for(const old of before.publications)assert.deepEqual(beforeR3Revision(publicationManifest.find(p=>p.lessonId===old.lessonId)),old,old.lessonId);
  for(const f of before.files){const bytes=readFileSync(f.path);if(sha(bytes)===f.sha256)continue;const reversed=beforeDirectionSource(f.path,bytes.toString("utf8")).replaceAll("\r\n","\n");assert.ok([reversed,reversed.replaceAll("\n","\r\n")].some(s=>sha(Buffer.from(s))===f.sha256),f.path);}
  const path="src/lib/course-engine.ts",source=readFileSync(path,"utf8"),digest=before.files.find(f=>f.path===path)!.sha256;
  for(const changed of [source+"\n// unexpected",source.replace("directionLearningRoutesLesson,","directionLearningRoutesLesson, // unexpected")])assert.notEqual(sha(Buffer.from(beforeDirectionSource(path,changed))),digest);
  assert.equal(before.lessons.filter(l=>l.courseId==="AI000").flatMap(l=>l.sections.flatMap(s=>s.blocks)).filter(b=>b.type==="ai-task-figure").length,23);
});
test("主例为文字类别与每个纸箱类别/位置，人工对照与预测分开",()=>{
  assert.equal(lesson.sections[0].id,"two-projects");
  assert.match(prose("two-projects"),/实验楼一楼的水龙头一直滴水/);assert.match(prose("two-projects"),/每个纸箱/);
  const table=section("four-questions").blocks.find(b=>b.type==="table")!;
  assert.equal(table.type,"table");if(table.type==="table"){
    assert.match(table.rows[1][1],/照明、漏水、门锁/);assert.match(table.rows[1][2],/每个纸箱.*位置框/);
    assert.match(table.rows[2][1],/人工确认.*类别/);assert.match(table.rows[2][2],/人工确认.*何处.*标注/);
  }
});
test("两条四阶段路线均有学习理由、可查产物、继续与补修，实际用于正文",()=>{
  for(const [id,stages] of [["nlp-stages",nlpRouteStages],["cv-stages",cvRouteStages]] as const){
    assert.equal(stages.length,4);assert.equal(section(id).blocks.filter(b=>b.type==="heading").length,4);
    for(const s of stages){assert.ok(s.name&&s.learn&&s.product&&s.gate);for(const value of [s.learn,s.product,s.gate])assert.ok(section(id).blocks.some(b=>b.type==="paragraph"&&b.text.endsWith(value)));assert.match(s.product,/交/);assert.match(s.gate,/先|才|回补/);}
  }
});
test("规则处理不当训练、NLP不当LLM唯一入口，数据核查从第一阶段开始",()=>{
  assert.match(nlpRouteStages[1].learn,/关键词规则.*不强制训练/);
  assert.match(nlpRouteStages[2].product,/参与.*未参与/);assert.match(nlpRouteStages[2].learn,/未参与改规则/);
  assert.match(prose("nlp-stages"),/数据检查在第一阶段就开始/);assert.match(prose("nlp-stages"),/NLP不只有LLM/);
});
test("CV先观察及图框关联，人工框/模型预测/预训练使用/研究训练保留证据边界",()=>{
  assert.match(cvRouteStages[0].product,/每个纸箱.*类别.*框/);assert.match(cvRouteStages[1].product,/打开原图.*漏标.*错标.*重复/);
  assert.match(cvRouteStages[2].product,/原始预测.*人工对照/);assert.match(cvRouteStages[2].gate,/使用已有模型不等于自己训练/);
  assert.match(cvRouteStages[3].gate,/无需在第一次读取图片前学完/);assert.match(prose("cv-stages"),/人工框.*表达.*显示位置/);
});
test("主比较覆盖任务、编程/数学/数据差异，里程碑在两例后引入",()=>{
  const table=section("compare-routes").blocks.find(b=>b.type==="table")!;
  if(table.type==="table")assert.deepEqual(table.rows.map(r=>r[0]),["输入与输出","核查依据","基础编程","眼前的数学","数据分析","最初可查成果","进一步深入"]);
  const ids=lesson.sections.map(s=>s.id);assert.ok(ids.indexOf("milestones")>ids.indexOf("cv-stages"));
  assert.match(prose("milestones"),/里程碑.*能够观察、验证/);assert.match(prose("milestones"),/看教程.*不能单独证明/);
  assert.match(prose("dependencies"),/必须先具备/);assert.match(prose("dependencies"),/可以并行/);assert.match(prose("dependencies"),/失败后回补/);
});
test("题一从题设重查三个查询，保留同名不同作者与未知位置",()=>{
  assert.deepEqual(catalogRouteRows.filter(r=>r[1].includes("植物")).map(r=>r[0]),["L01","L02","L04"]);
  assert.deepEqual(catalogRouteRows.filter(r=>r[1].includes("星空")).map(r=>r[0]),["L03"]);
  assert.equal(catalogRouteRows.filter(r=>r[1].includes("火山")).length,0);
  assert.notEqual(catalogRouteRows[0][2],catalogRouteRows[1][2]);assert.equal(catalogRouteRows[3][3],"位置待核");
  assert.match(tasks[0].prompt,/至少三个里程碑/);assert.match(tasks[0].solution.join(""),/L01\/L02\/L04三条/);
});
test("题二独立核算P12错、3/4，只核假设建议；B必须另建原图位置对照",()=>{
  assert.deepEqual(photoRouteRows.map(r=>r[2]===r[3]),[true,false,true,true]);
  assert.equal(photoRouteRows.filter(r=>r[2]===r[3]).length/photoRouteRows.length,.75);
  assert.match(prose("image-choice-task"),/不能证明自动看图能力或B的位置/);
  const a=tasks[1].solution.join("");assert.match(a,/P12.*3\/4=75%/);assert.match(a,/对同图从左到右逐目标核漏标\/错标\/重复/);
  assert.match(a,/另一种合理选择是B/);assert.match(a,/不必自行训练/);assert.match(a,/人工画好的框/);
});
test("三目标对应不同核心产物，两提示不代答，参考答案保留替代范围",()=>{
  assert.deepEqual(lesson.assessmentMap,[{objective:1,exerciseIds:["choose-image-route"]},{objective:2,exerciseIds:["plan-catalog-route"]},{objective:3,exerciseIds:["plan-catalog-route","choose-image-route"]}]);
  assert.deepEqual(lessonExerciseLinks(lesson).map(t=>[t.id,t.objectives]),[["plan-catalog-route",[2,3]],["choose-image-route",[1,3]]]);
  for(const task of tasks){assert.equal(task.hints.length,2);assert.equal(task.prompt.split("\n\n").length,3);assert.equal(task.rubric.length,5);assert.match(task.solution.join(""),/常见错误/);assert.match(task.solution.join(""),/接受/);assert.doesNotMatch(task.hints.join(""),/P12|75%|L01|阶段一.*阶段二|先选A/);}
  const invalid=structuredClone(lesson);invalid.sections.find(s=>s.id==="catalog-task")!.tier="advanced";assert.equal(lessonSchema.safeParse(invalid).success,false);
  assert.match(tasks[1].prompt,/文字参照卡/);assert.match(tasks[1].prompt,/范围|自动处理未见/);
});
test("所有链接均为真实可读锚点或课程目录，专业课程无伪造正文",()=>{
  const links=[...lesson.prerequisiteLinks,...blocks.filter(b=>b.type==="reading-links").flatMap(b=>b.links)];
  for(const link of links){const [path,hash]=link.href.split("#");if(path.startsWith("/learn/")){const parts=path.split("/"),target=resolveLesson(parts[2],parts[3]);assert.ok(target,link.href);if(hash)assert.ok(target.lesson.sections.some(s=>s.id===hash),link.href);}else if(path.startsWith("/courses/"))assert.ok(getLearningCourse(path.split("/")[2]),path);}
  for(const id of ["DS101","ST101","DL301","DL302","DL303","NLP401","LLM401","CV401"]){assert.equal(publicationManifest.filter(p=>p.courseId===id).length,0);assert.equal(getLearningCourse(id)!.status,"planned");assert.ok(links.some(l=>l.href===`/courses/${id}`));}
});
test("课程表的先修逐行对照当前curriculum，不把建议改为必需",()=>{
  const facts=JSON.parse(readFileSync("curriculum/AI技术课程目录_V1.0.json","utf8")).courses as {id:string;req:string}[];
  const normalize=(s:string)=>s.replaceAll(" ","");
  const tables=section("course-connections").blocks.filter(b=>b.type==="table");
  for(const row of [...tables[0].rows,...tables[1].rows]){
    const id=row[0].split(" ")[0];assert.equal(normalize(row[1]),normalize(facts.find(c=>c.id===id)!.req),id);
  }
});
test("课程实际开放状态为PY6、MA4+5旧版、ML7+1旧版，仍整门planned",()=>{
  for(const [id,current,legacy] of [["PY101",6,0],["MA101",4,5],["ML201",7,1]] as const){const c=getLearningCourse(id)!;assert.equal(c.status,"planned");assert.equal(c.chapters.flatMap(ch=>ch.lessons).filter(l=>l.href).length,current);assert.equal(c.legacyLessons.length,legacy);}
});
test("原生表格局部滚动、每题三折叠默认关闭，无新图/代码/执行组件",()=>{
  assert.deepEqual(lesson.resources,[]);assert.ok(blocks.every(b=>!["image","ai-task-figure","code","math","downloads","experiment"].includes(b.type)));
  for(const b of blocks.filter(b=>b.type==="table")){const html=renderToStaticMarkup(createElement(ContentRenderer,{block:b,resources:[]}));assert.match(html,/<caption/);assert.match(html,/<th/);assert.match(html,/tabindex="0"/);}
  for(const b of tasks){const html=renderToStaticMarkup(createElement(ContentRenderer,{block:b,resources:[]}));assert.equal((html.match(/<details/g)??[]).length,3);assert.doesNotMatch(html,/<details[^>]*\sopen/);assert.ok(html.includes(`id="exercise-${b.id}"`));}
});
test("草稿门禁/预览衔接7.1↔7.2↔7.3且保持待审核，整门仍planned",()=>{
  const c=getLearningCourse("AI000")!,pub=publicationManifest.find(p=>p.lessonId===lesson.id)!;
  assert.equal(pub.contentVersion,1);assert.equal(pub.reviewEvidence,undefined);assert.equal(c.status,"planned");assert.equal(c.hours,"6–10");
  assert.equal(Boolean(resolveLesson("AI000",lesson.id)),isReadable(pub));
  if(isReadable(pub)){assert.equal(pub.status,"pending-review");assert.equal(pub.technicalEvidence,"docs/AI000_LESSON_7_2_REVIEW.md");assert.equal(getAdjacentLessons(c,"AI000-C07-L01").next?.lessonId,lesson.id);assert.equal(getAdjacentLessons(c,lesson.id).previous?.lessonId,"AI000-C07-L01");assert.equal(getAdjacentLessons(c,lesson.id).next?.lessonId,"AI000-C07-L03");}
  else{assert.equal(pub.status,"draft");assert.equal(pub.access,"private");assert.equal(getAdjacentLessons(c,"AI000-C07-L01").next,undefined);}
  const slot=c.chapters[6].lessons[2];assert.equal(slot.lessonId,"AI000-C07-L03");assert.equal(slot.status,"pending-review");assert.equal(slot.href,"/learn/AI000/AI000-C07-L03");assert.equal(lessonRegistry.has(slot.lessonId),true);assert.equal(resolveLesson("PY101",lesson.id),undefined);
});
test("新r1进度空态、位置/完成恢复，不动45旧课及1.2/5.3历史r1",()=>{
  const memory=new Map<string,string>(),port={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}},store=createProgressStore(()=>port);
  for(const old of before.lessons)store.save(lessonProgressScope(old),100,old.sections.at(-1)!.id,true);
  for(const id of ["AI000-C01-L02","AI000-C05-L03"])store.save({...lessonProgressScope(lessonRegistry.get(id)!),contentVersion:1},100,"takeaways",true);
  const saved=new Map(memory),scope=lessonProgressScope(lesson);assert.equal(progressKey(scope),"aivora:learning:v2:AI000:AI000-C07-L02:r1");assert.equal(store.getSnapshot(scope),null);
  store.save(scope,48,"dependencies");const restored=createProgressStore(()=>port);assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.section,"dependencies");assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.completed,false);
  restored.save(scope,100,"takeaways",true);assert.equal(parseReadingProgress(createProgressStore(()=>port).getSnapshot(scope),scope)?.completed,true);
  for(const [key,value] of saved)assert.equal(memory.get(key),value,key);
});
test("重新估时同步唯一维护表与完整24节，保存旧764–1154历史",()=>{
  assert.deepEqual(lesson.learningTime,{reading:[18,26],practice:[36,52],coding:[0,0],basis:"editorial-estimate"});
  const t=getCourseStudyEstimate("AI000")!;assert.deepEqual(t.totalMinutes,[850,1280]);assert.equal(t.hours,"14.2–21.3");
  assert.deepEqual(t.lessons.find(l=>l.lessonId===lesson.id)?.reading,[18,26]);assert.deepEqual(t.lessons.find(l=>l.lessonId===lesson.id)?.practice,[36,52]);
  const old=JSON.parse(readFileSync("docs/ai000-7-1/TIME_ESTIMATE.json","utf8"));assert.deepEqual(old.totalMinutes,[764,1154]);
});
