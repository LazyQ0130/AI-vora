import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Lesson } from "../src/content/models";
import { contentBlockSchema, resourceSchema } from "../src/content/models";
import { ai000Illustrations, illustration } from "../src/content/lessons/ai000/illustrations";
import { lessonRegistry, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { visualComparableJson, withoutAi000Illustrations } from "../scripts/ai000-illustration-compatibility";
import { expectedAfterSceneRemoval } from "../scripts/review-ai000-visual-refinement";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { createProgressStore, parseReadingProgress } from "../src/lib/learning-progress";

const before=JSON.parse(readFileSync("docs/ai000-visual-refinement/BEFORE.json","utf8")) as {lessons:Lesson[];sources:{path:string;text:string}[]};
test("只移除13处审核场景图：36节非场景内容/目标/题/答案/锚点/版本相同，14幅精确图渲染相同",()=>{
  let removed=0,precise=0;
  for(const old of before.lessons){
    const current=lessonRegistry.get(old.id)!;
    assert.equal(JSON.stringify(current),JSON.stringify(expectedAfterSceneRemoval(old)),old.id);
    const oldBlocks=old.sections.flatMap(s=>s.blocks),blocks=current.sections.flatMap(s=>s.blocks);
    removed+=oldBlocks.filter(b=>b.type==="image").length-blocks.filter(b=>b.type==="image").length;
    if(old.courseId!=="AI000")continue;
    const figures=blocks.filter(b=>b.type==="ai-task-figure"), oldFigures=oldBlocks.filter(b=>b.type==="ai-task-figure");
    precise+=figures.length;
    for(const [i,block] of figures.entries())assert.equal(renderToStaticMarkup(createElement(ContentRenderer,{block,resources:current.resources})),renderToStaticMarkup(createElement(ContentRenderer,{block:oldFigures[i],resources:old.resources})));
    assert.equal(blocks.some(b=>b.type==="image"&&ai000Illustrations.some(a=>a.src===b.src)),false);
    const source=before.sources.find(s=>s.text.includes('"'+old.id+'"'))!;
    assert.doesNotMatch(readFileSync(source.path,"utf8"),/\billustration\(|from "\.\/illustrations"/);
  }
  assert.equal(removed,13);assert.equal(precise,14);
});
test("兼容归一化不会放行改图注、换位置、额外图片或正文变化",()=>{
  // 负向用例以真实改前图块为准，不能因当前无图而跳过旧保护。
  const lesson=before.lessons.find(l=>l.id==="AI000-C01-L01")!, original=visualComparableJson(lesson);
  const changedCaption=structuredClone(lesson), section=changedCaption.sections.find(s=>s.id==="mail-task")!;
  const image=section.blocks[1];assert.equal(image.type,"image");if(image.type==="image")image.caption="未经登记的变化";
  assert.throws(()=>withoutAi000Illustrations(changedCaption));
  const moved=structuredClone(lesson), blocks=moved.sections.find(s=>s.id==="mail-task")!.blocks;
  [blocks[1],blocks[2]]=[blocks[2],blocks[1]];assert.throws(()=>withoutAi000Illustrations(moved));
  const extra=structuredClone(lesson);extra.sections[0].blocks.push({...illustration(lesson.id),src:"/images/lessons/ai000/unregistered.webp"});
  assert.notEqual(visualComparableJson(extra),original);
  const changedText=structuredClone(lesson);changedText.objectives[0]+="changed";assert.notEqual(visualComparableJson(changedText),original);
});
test("旧批量接入与素材重建命令显式停用，执行后不恢复正文也不覆盖历史",()=>{
  const paths=[...before.sources.map(s=>s.path),"src/content/lessons/ai000/illustrations.ts","docs/ai000-4-4/GENERATION_RECORDS.json","docs/ai000-4-4/ILLUSTRATION_ASSETS.json"];
  const digest=(path:string)=>createHash("sha256").update(readFileSync(path)).digest("hex");
  const hashes=paths.map(digest);
  for(const file of ["scripts/add-ai000-illustrations.mjs","scripts/prepare-ai000-illustrations.mjs"]){
    assert.match(execFileSync(process.execPath,[file],{encoding:"utf8"}),/已停用/);
  }
  assert.deepEqual(paths.map(digest),hashes);
  const pkg=JSON.parse(readFileSync("package.json","utf8"));
  assert.ok(Object.values(pkg.scripts).every(command=>!/add-ai000-illustrations|prepare-ai000-illustrations/.test(String(command))));
});
test("移除场景图不改变阅读作用域：36节已有完成与阅读位置仍可恢复，存储字节不被改写",()=>{
  const memory=new Map<string,string>(), port={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}}, store=createProgressStore(()=>port);
  for(const old of before.lessons)store.save(lessonProgressScope(old),100,old.sections.at(-1)!.id,true);
  const saved=new Map(memory),restored=createProgressStore(()=>port);
  for(const old of before.lessons){
    const scope=lessonProgressScope(lessonRegistry.get(old.id)!);assert.deepEqual(scope,lessonProgressScope(old));
    const value=parseReadingProgress(restored.getSnapshot(scope),scope)!;assert.equal(value.completed,true);assert.equal(value.section,old.sections.at(-1)!.id);
  }
  assert.deepEqual(memory,saved);
});
test("新增路径仅用于本地image，不接受远程、越界或下载资源冒用",()=>{
  const block=illustration("AI000-C04-L04");assert.equal(contentBlockSchema.safeParse(block).success,true);
  for(const src of ["https://example.com/a.webp","/images/lessons/ai000/../a.webp","/images/other/a.webp","/images/lessons/ai000/a.svg"]){
    assert.equal(contentBlockSchema.safeParse({...block,src}).success,false);
  }
  assert.equal(resourceSchema.safeParse({id:"wrong",title:"wrong",href:block.src,format:"PDF",description:"wrong"}).success,false);
});
test("4.3接4.4再接5.1，5.2及后续仍规划且无注册正文",()=>{
  const course=getLearningCourse("AI000")!;
  assert.equal(getAdjacentLessons(course,"AI000-C04-L03").next?.lessonId,"AI000-C04-L04");
  assert.equal(getAdjacentLessons(course,"AI000-C04-L04").previous?.lessonId,"AI000-C04-L03");
  assert.equal(getAdjacentLessons(course,"AI000-C04-L04").next?.lessonId,"AI000-C05-L01");
  for(const slot of course.chapters.slice(4).flatMap(c=>c.lessons).filter(l=>l.lessonId>"AI000-C05-L03")){assert.equal(slot.href,undefined);assert.equal(lessonRegistry.has(slot.lessonId),false);}
});
