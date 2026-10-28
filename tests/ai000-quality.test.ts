import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import type { Lesson, Publication } from "../src/content/models";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { beforeQualityRevision, beforeQualitySource, qualityChanges, qualityComparableJson } from "../scripts/ai000-quality-compatibility";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { wateringRecords } from "../src/content/lessons/ai000/delivery-example";
import { parcelParameterSettings } from "../src/content/lessons/ai000/model-parameter-example";
import { evaluationCandidates, evaluationParcels } from "../src/content/lessons/ai000/data-use-example";
import { fixedParcelModel } from "../src/content/lessons/ai000/fixed-model-example";

const dir = "docs/ai000-cross-lesson-quality";
const before = JSON.parse(readFileSync(`${dir}/BEFORE.json`, "utf8")) as { lessons: Lesson[]; publications: Publication[]; files: {path:string;sha256:string}[] };
const get = (id:string) => lessonRegistry.get(id)!;
const old = (id:string) => before.lessons.find(l=>l.id===id)!;
const blocks = (l:Lesson) => l.sections.flatMap(s=>s.blocks);
const exercises = (l:Lesson) => blocks(l).filter(b=>b.type==="exercise");
const sha = (bytes:Buffer) => createHash("sha256").update(bytes).digest("hex");

test("40课全文与238文件只接受登记的精确差异；未登记变更和错误after值仍失败",()=>{
  assert.equal(before.lessons.length,40);assert.equal(before.files.length,238);
  assert.equal(qualityChanges.lessons.length,14);assert.equal(qualityChanges.sources.length,16);
  for(const l of before.lessons) assert.equal(qualityComparableJson(get(l.id)),JSON.stringify(l),l.id);
  for(const p of before.publications) assert.deepEqual(beforeQualityRevision(publicationManifest.find(n=>n.lessonId===p.lessonId)),p);
  for(const f of before.files){
    const bytes=readFileSync(f.path);
    if(sha(bytes)===f.sha256)continue;
    const source=beforeQualitySource(f.path,bytes.toString("utf8")).replaceAll("\r\n","\n");
    assert.ok([source,source.replaceAll("\n","\r\n")].some(t=>sha(Buffer.from(t))===f.sha256),f.path);
  }
  const altered=structuredClone(get("AI000-C01-L02"));altered.objectives[0]+="未经登记";
  assert.notEqual(qualityComparableJson(altered),JSON.stringify(old(altered.id)));
  const alteredHint=structuredClone(get("AI000-C01-L01"));exercises(alteredHint)[0].hints[1]+="额外答案";
  assert.notEqual(qualityComparableJson(alteredHint),JSON.stringify(old(alteredHint.id)));
  const path="src/content/lessons/ai000/reinforcement-learning.ts", source=readFileSync(path,"utf8");
  assert.ok(beforeQualitySource(path,source+"\n// undeclared").endsWith("// undeclared"));
});

test("仅1.2与5.3升r2，正式目标不删；其他同版修订与未修改三课可逐项核对",()=>{
  const bumps=before.lessons.filter(l=>get(l.id).contentVersion!==l.contentVersion).map(l=>l.id).sort();
  assert.deepEqual(bumps,["AI000-C01-L02","AI000-C05-L03"]);
  for(const l of before.lessons){assert.deepEqual(get(l.id).objectives,l.objectives);assert.deepEqual(get(l.id).sections.map(s=>s.id),l.sections.map(s=>s.id));
    for(const e of exercises(l))assert.ok(exercises(get(l.id)).some(n=>n.id===e.id));}
  for(const id of ["AI000-C04-L01","AI000-C04-L02","AI000-C05-L02"])assert.deepEqual(get(id),old(id));
  assert.equal(lessonRegistry.size,43);
});

test("1.2新增独立四任务迁移题，保留原商品与图书题、真实覆盖目标一",()=>{
  const l=get("AI000-C01-L02"), es=exercises(l);
  assert.deepEqual(es.map(e=>e.id),["compare-service-tasks","check-library","product-review"]);
  assert.deepEqual(l.assessmentMap,[{objective:1,exerciseIds:["compare-service-tasks","product-review"]},{objective:2,exerciseIds:["check-library"]},{objective:3,exerciseIds:["product-review"]}]);
  const e=es[0], answer=e.solution.join("\n");
  for(const pair of [["录音","转写"],["类别约定","文字分类"],["可借书目","推荐"],["活动资料","生成文字"]])for(const value of pair)assert.ok(answer.includes(value));
  assert.match(e.prompt,/四种输出为什么不能互相替代/);assert.match(e.prompt,/准确记下某句话/);assert.match(answer,/不能保证一定喜欢/);
  for(const previous of exercises(old(l.id))) {const next=es.find(e=>e.id===previous.id)!;assert.deepEqual(next.solution,previous.solution);assert.deepEqual(next.rubric,previous.rubric);assert.equal(next.prompt,previous.prompt);}
  assert.equal(lessonExerciseLinks(l).length,3);
});

test("34旧题逐题审提示，22题二级与1题一级精修；新提示没有直接代入关键答案",()=>{
  const changed=[];
  for(const l of before.lessons.filter(l=>l.courseId==="AI000"))for(const e of exercises(l)){
    const current=exercises(get(l.id)).find(n=>n.id===e.id)!;
    if(JSON.stringify(current.hints)!==JSON.stringify(e.hints))changed.push(e.id);
    assert.equal(current.hints.length,2);
    if(e.id!=="analyse-multimodal-services") {assert.equal(current.prompt,e.prompt);assert.deepEqual(current.solution,e.solution);assert.deepEqual(current.rubric,e.rubric);}
  }
  assert.equal(changed.length,22);
  const hint=(id:string)=>[...lessonRegistry.values()].flatMap(exercises).find(e=>e.id===id)!.hints[1];
  assert.doesNotMatch(hint("design-task"),/雨伞|水杯/);
  assert.doesNotMatch(hint("draw-method-map"),/知识推理的系统|普通决策树的模型|多层神经网络学习识别/);
  assert.doesNotMatch(hint("classify-new-systems"),/缩放.*编辑|丁.*类别选择|唯一反推LLM/);
  assert.doesNotMatch(hint("design-equipment-service"),/K1|K3|K4/);
  assert.doesNotMatch(hint("analyse-multimodal-services"),/核对、补齐、清点/);
  assert.doesNotMatch(hint("plan-gallery-voice"),/周二|纪念品|乙没有/);
});

test("两条浇水记录从水量和首次标志独立重推，第二块不重复首次奖励，累计6和11",()=>{
  const results=wateringRecords.map(record=>{
    let water=1,first=true,total=0;const done=new Set<string>(), rewards:number[]=[], states:number[]=[];
    for(const step of record.steps){let reward=0;
      if(step.action.includes("补满"))water=2;
      else {const bed=step.action.includes("A")?"A":"B";if(water===0)reward=-5;else {water--;done.add(bed);if(first){reward+=2;first=false;}if(done.size===2)reward+=9;}}
      rewards.push(reward);states.push(water);total+=reward;
    }
    assert.deepEqual(record.steps.map(s=>s.reward),rewards);return {rewards,states,total};
  });
  assert.deepEqual(results,[{rewards:[2,-5,0,9],states:[0,0,2,1],total:6},{rewards:[0,2,9],states:[2,1,0],total:11}]);
  const rule=blocks(get("AI000-C03-L04")).find(b=>b.type==="paragraph"&&b.text.startsWith("规则是："))!;
  assert.equal(rule.type,"paragraph");if(rule.type==="paragraph"){assert.match(rule.text,/每次完整的浇水任务/);assert.match(rule.text,/任意一块/);assert.match(rule.text,/另外奖励\+9/);}
});

test("4.2与4.3候选身份明确，参数和图不改；4.4仍给定4/2且不继承部署保证",()=>{
  assert.deepEqual(parcelParameterSettings.map(c=>[c.name,c.baseMinutes,c.minutesPerItem]),[["甲",2,2],["乙",4,2]]);
  assert.deepEqual(evaluationCandidates.map(c=>[c.name,c.baseMinutes,c.minutesPerItem]),[["甲",4,2],["乙",3,3]]);
  const gaps=evaluationCandidates.map(c=>evaluationParcels.filter(r=>r.role==="validation").reduce((sum,r)=>sum+Math.abs(c.baseMinutes+c.minutesPerItem*r.count-r.actualMinutes),0));
  assert.deepEqual(gaps,[2,1]);assert.deepEqual(fixedParcelModel,{baseMinutes:4,minutesPerItem:2});
  const text=(id:string)=>blocks(get(id)).filter(b=>b.type==="paragraph").map(b=>b.text).join("\n");
  assert.match(text("AI000-C04-L03"),/不沿用上一节的编号/);assert.match(text("AI000-C04-L04"),/不能保证这组设置实际使用时的表现/);
});

test("5.3 r2要求实际参与证据和对照，保留前三服务、原图、T1待办与证据边界",()=>{
  const l=get("AI000-C05-L03"), e=exercises(l)[1], answer=e.solution.join("\n");
  assert.match(e.prompt,/三种模态的参与证据表/);assert.match(e.prompt,/对照检查/);
  for(const term of ["文字——","图片——","声音——","编号A怎样取得未记载","答复变为西厅","读取图旁编号","一次未变化","两个通用追问不能代替"])assert.ok(answer.includes(term),term);
  assert.deepEqual(e.solution.slice(0,4),exercises(old(l.id))[1].solution.slice(0,4));
  for(const block of blocks(old(l.id)).filter(b=>b.type==="ai-task-figure"))assert.ok(blocks(l).some(b=>JSON.stringify(b)===JSON.stringify(block)));
});

test("新增三条补修链接直达真实段落、旧锚点与23幅精确图保留，提示和答案默认折叠",()=>{
  for(const [id,href] of [["AI000-C01-L03","/learn/AI000/AI000-C01-L02#check-output"],["AI000-C02-L01","/learn/AI000/AI000-C01-L01#many-tasks"],["AI000-C02-L02","/learn/AI000/AI000-C01-L02#check-output"]]) assert.ok(get(id).prerequisiteLinks.some(l=>l.href===href));
  let figures=0;
  for(const previous of before.lessons.filter(l=>l.courseId==="AI000")){
    for(const link of get(previous.id).prerequisiteLinks){const [path,hash]=link.href.split("#"),parts=path.split("/");const target=resolveLesson(parts[2],parts[3])!.lesson;if(hash)assert.ok(target.sections.some(s=>s.id===hash));}
    for(const block of blocks(previous).filter(b=>b.type==="ai-task-figure")){const current=blocks(get(previous.id)).find(b=>b.type==="ai-task-figure"&&b.kind===block.kind)!;assert.deepEqual(current,block);assert.equal(renderToStaticMarkup(createElement(ContentRenderer,{block:current,resources:[]})),renderToStaticMarkup(createElement(ContentRenderer,{block,resources:[]})));figures++;}
    for(const e of exercises(get(previous.id))){const html=renderToStaticMarkup(createElement(ContentRenderer,{block:e,resources:[]}));assert.equal((html.match(/<details/g)??[]).length,3);assert.doesNotMatch(html,/<details[^>]*\sopen/);}
  }
  assert.equal(figures,23);
});

test("真实存储保留40旧键，同版完成恢复，1.2和5.3 r2不继承r1并能独立保存",()=>{
  const memory=new Map<string,string>(),port={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}},store=createProgressStore(()=>port);
  for(const l of before.lessons)store.save(lessonProgressScope(l),100,l.sections.at(-1)!.id,true);
  const saved=new Map(memory), restored=createProgressStore(()=>port);
  for(const previous of before.lessons){const current=get(previous.id),scope=lessonProgressScope(current);
    if(current.contentVersion!==previous.contentVersion){assert.equal(restored.getSnapshot(scope),null);restored.save(scope,45,current.sections[0].id);assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.completed,false);assert.ok(progressKey(scope).endsWith(":r2"));}
    else assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.completed,true);
  }
  for(const [k,v] of saved)assert.equal(memory.get(k),v,k);
  for(const id of ["AI000-C01-L02","AI000-C05-L03"]){const l=get(id),scope=lessonProgressScope(l);restored.save(scope,100,"takeaways",true);assert.equal(parseReadingProgress(createProgressStore(()=>port).getSnapshot(scope),scope)?.completed,true);}
  for(const [k,v] of saved)assert.equal(memory.get(k),v,k);
});

test("19节相邻导航与待审核门禁保持，6.2/6.3没有正文；保存说明不暗示输入自动持久化",()=>{
  const course=getLearningCourse("AI000")!,ids=course.chapters.flatMap(c=>c.lessons).filter(l=>l.href).map(l=>l.lessonId);
  assert.equal(ids.length,20);ids.forEach((id,i)=>{const adjacent=getAdjacentLessons(course,id);assert.equal(adjacent.previous?.lessonId,ids[i-1]);assert.equal(adjacent.next?.lessonId,ids[i+1]);});
  for(const id of ["AI000-C06-L03"]){assert.equal(resolveLesson("AI000",id),undefined);assert.equal(lessonRegistry.has(id),false);}
  assert.ok(blocks(get("AI000-C01-L01")).some(b=>b.type==="paragraph"&&b.text.includes("复制到笔记里")));
  for(const p of publicationManifest){assert.equal(p.status,"pending-review");assert.equal(p.access,"preview");assert.equal(p.reviewEvidence,undefined);}
});
