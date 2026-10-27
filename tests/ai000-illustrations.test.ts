import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { contentBlockSchema, resourceSchema } from "../src/content/models";
import { ai000Illustrations, illustration } from "../src/content/lessons/ai000/illustrations";
import { lessonRegistry, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { visualComparableJson, withoutAi000Illustrations } from "../scripts/ai000-illustration-compatibility";

test("十三课登记、生成来源、实际接入位置一一对应，原精确教学图仍在",()=>{
  const {assets}=JSON.parse(readFileSync("docs/ai000-4-4/ILLUSTRATION_ASSETS.json","utf8"));
  assert.equal(ai000Illustrations.length,13);assert.equal(new Set(ai000Illustrations.map(a=>a.src)).size,13);
  for(const asset of ai000Illustrations){
    const lesson=lessonRegistry.get(asset.lessonId)!;
    assert.deepEqual(lesson.sections.find(s=>s.id===asset.section)!.blocks[asset.index],illustration(lesson.id));
    assert.equal(lesson.sections.flatMap(s=>s.blocks).filter(b=>b.type==="image").length,1);
    assert.ok(lesson.sections.flatMap(s=>s.blocks).some(b=>b.type==="ai-task-figure"));
    const source=assets.find((a:{lessonId:string})=>a.lessonId===lesson.id);
    assert.equal(source.tool,"image_gen.imagegen");assert.ok(source.prompt.length>200);
    for(const key of ["src","width","height","alt","caption"] as const)assert.equal(source[key],asset[key]);
  }
});
test("兼容归一化不会放行改图注、换位置、额外图片或正文变化",()=>{
  const lesson=lessonRegistry.get("AI000-C01-L01")!, original=visualComparableJson(lesson);
  const changedCaption=structuredClone(lesson), section=changedCaption.sections.find(s=>s.id==="mail-task")!;
  const image=section.blocks[1];assert.equal(image.type,"image");if(image.type==="image")image.caption="未经登记的变化";
  assert.throws(()=>withoutAi000Illustrations(changedCaption));
  const moved=structuredClone(lesson), blocks=moved.sections.find(s=>s.id==="mail-task")!.blocks;
  [blocks[1],blocks[2]]=[blocks[2],blocks[1]];assert.throws(()=>withoutAi000Illustrations(moved));
  const extra=structuredClone(lesson);extra.sections[0].blocks.push({...illustration(lesson.id),src:"/images/lessons/ai000/unregistered.webp"});
  assert.notEqual(visualComparableJson(extra),original);
  const changedText=structuredClone(lesson);changedText.objectives[0]+="changed";assert.notEqual(visualComparableJson(changedText),original);
});
test("新增路径仅用于本地image，不接受远程、越界或下载资源冒用",()=>{
  const block=illustration("AI000-C04-L04");assert.equal(contentBlockSchema.safeParse(block).success,true);
  for(const src of ["https://example.com/a.webp","/images/lessons/ai000/../a.webp","/images/other/a.webp","/images/lessons/ai000/a.svg"]){
    assert.equal(contentBlockSchema.safeParse({...block,src}).success,false);
  }
  assert.equal(resourceSchema.safeParse({id:"wrong",title:"wrong",href:block.src,format:"PDF",description:"wrong"}).success,false);
});
test("4.3接4.4，4.4为当前末节，第五章仍规划且无注册正文",()=>{
  const course=getLearningCourse("AI000")!;
  assert.equal(getAdjacentLessons(course,"AI000-C04-L03").next?.lessonId,"AI000-C04-L04");
  assert.equal(getAdjacentLessons(course,"AI000-C04-L04").previous?.lessonId,"AI000-C04-L03");
  assert.equal(getAdjacentLessons(course,"AI000-C04-L04").next,undefined);
  for(const slot of course.chapters.slice(4).flatMap(c=>c.lessons)){assert.equal(slot.href,undefined);assert.equal(lessonRegistry.has(slot.lessonId),false);}
});
