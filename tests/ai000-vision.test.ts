import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { computerVisionLesson as lesson } from "../src/content/lessons/ai000/computer-vision";
import { shelfBoxes, workbenchHelmets, outlineBounds, type Point } from "../src/content/lessons/ai000/vision-example";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { isReadable } from "../src/content/models";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { matchesProtectedDigest, type VisionBaseline } from "../scripts/review-ai000-5-2";
import { beforeVisionExtension } from "../scripts/ai000-vision-compatibility";

const blocks = lesson.sections.flatMap(s=>s.blocks), exercises = blocks.filter(b=>b.type==="exercise");
const figures = blocks.filter(b=>b.type==="ai-task-figure");
const htmlFor = (kind:string) => renderToStaticMarkup(createElement(ContentRenderer,{block:figures.find(f=>f.kind===kind)!,resources:[]}));
const before = JSON.parse(readFileSync("docs/ai000-5-2/BEFORE.json","utf8")) as VisionBaseline;
// 另以射线交点核验内部/外部，不调用绘图时的包围框逻辑。
function inside([x,y]:Point, points:readonly Point[]) {
  let result=false;
  for(let i=0,j=points.length-1;i<points.length;j=i++) {
    const [xi,yi]=points[i],[xj,yj]=points[j];
    if((yi>y)!==(yj>y) && x<(xj-xi)*(y-yi)/(yj-yi)+xi) result=!result;
  }
  return result;
}
test("货架对象与独立几何预期一致：两个纸箱在上层，框角有背景而内部在纸箱里",()=>{
  assert.deepEqual(shelfBoxes.map(o=>o.position),["上层左侧","上层右侧"]);
  assert.deepEqual(shelfBoxes.map(o=>outlineBounds(o.outline)),[{x:36,y:34,width:110,height:92},{x:222,y:38,width:106,height:94}]);
  assert.deepEqual(shelfBoxes.map(o=>o.category),["纸箱","纸箱"]);
  assert.equal(inside([90,85],shelfBoxes[0].outline),true); assert.equal(inside([270,85],shelfBoxes[1].outline),true);
  for(const point of [[37,35],[80,190],[255,190]] as const) assert.equal(shelfBoxes.some(o=>inside(point,o.outline)),false);
  const raw=htmlFor("vision-shelf");
  assert.deepEqual([...raw.matchAll(/data-object="([^"]+)"/g)].map(m=>m[1]),["box-left","box-right","bottle","folder"]);
  assert.doesNotMatch(raw,/data-detection=|data-mask=/);
});
test("四次使用完全同一底图；分类只有图级标签，检测两个独立框，语义区域共享类别",()=>{
  const kinds=["vision-shelf","vision-classification","vision-detection","vision-segmentation"];
  const html=kinds.map(htmlFor);
  const base=(s:string)=>s.slice(s.indexOf('<g data-base-scene="shelf"'),s.indexOf('</g><rect data-detection=')>=0?s.indexOf('</g><rect data-detection=')+4:s.indexOf('</g><polygon data-semantic-category=')>=0?s.indexOf('</g><polygon data-semantic-category=')+4:s.indexOf('</g></svg>')+4);
  assert.ok(html.map(base).every(s=>s===base(html[0])));
  assert.match(html[1],/<strong>有纸箱<\/strong>/); assert.doesNotMatch(html[1],/data-detection=|data-mask=/);
  assert.equal((html[2].match(/data-detection=/g)??[]).length,2); assert.doesNotMatch(html[2],/data-mask=/);
  assert.match(html[2],/data-detection="box-left" x="36" y="34" width="110" height="92"/);
  assert.match(html[2],/data-detection="box-right" x="222" y="38" width="106" height="94"/);
  assert.equal((html[3].match(/data-semantic-category="纸箱"/g)??[]).length,2); assert.doesNotMatch(html[3],/data-detection=/);
  assert.match(html[3],/points="36,48 110,34 146,55 146,112 70,126 36,105"/);
  assert.match(html[3],/points="222,44 300,38 328,64 328,119 246,132 222,109"/);
  assert.match(html[3],/斜线覆盖处：纸箱/); assert.match(html[3],/未给各件独立实例编号/);
});
test("工作台新题独立位置与轮廓：两帽在对角，其他物品在另两角，不预放答案层",()=>{
  assert.deepEqual(workbenchHelmets.map(o=>outlineBounds(o.outline)),[{x:28,y:28,width:102,height:68},{x:220,y:140,width:102,height:68}]);
  assert.equal(inside([78,64],workbenchHelmets[0].outline),true); assert.equal(inside([270,176],workbenchHelmets[1].outline),true);
  assert.equal(workbenchHelmets.some(o=>inside([83,176],o.outline)),false); assert.equal(workbenchHelmets.some(o=>inside([260,60],o.outline)),false);
  assert.equal(inside([29,29],workbenchHelmets[0].outline),false);
  const html=htmlFor("vision-workbench"); assert.equal((html.match(/data-object=/g)??[]).length,4); assert.doesNotMatch(html,/data-detection=|data-mask=/);
  const solution=exercises[0].solution.join("\n"); for(const term of ["左上方","右下方","右上方","左下方","帽檐","实例","记录"]) assert.ok(solution.includes(term),term);
});
test("图示有可访问说明、HTML标签与非颜色区别；SVG无小号中文图中文字，核心无代码/位图",()=>{
  assert.equal(figures.length,5);
  for(const figure of figures) {
    const html=htmlFor(figure.kind); assert.match(html,/<figure[^>]*aria-labelledby=[^>]*aria-describedby=/);
    assert.ok(html.includes(figure.alt)&&html.includes(figure.caption)); assert.match(html,/viewBox="0 0 360 240"/); assert.doesNotMatch(html,/<text[\s>]/);
  }
  assert.match(htmlFor("vision-detection"),/stroke-dasharray="7 4"/); assert.match(htmlFor("vision-segmentation"),/<pattern/);
  assert.ok(blocks.every(b=>!["code","math","experiment","image","downloads"].includes(b.type))); assert.deepEqual(lesson.resources,[]);
});
test("两核心开放题映射三目标，包含任务理由/未知、两级提示和完整自查，反馈默认关闭",()=>{
  assert.deepEqual(lessonExerciseLinks(lesson).map(e=>[e.id,e.tier,e.objectives]),[["design-visual-outputs","core",[1,2,3]],["choose-vision-task","core",[1,2,3]]]);
  for(const ex of exercises){assert.equal(ex.hints.length,2);assert.equal(ex.rubric.length,4);assert.ok(ex.solution.some(s=>s.includes("接受")));assert.ok(ex.solution.some(s=>s.includes("常见错误")));
    const html=renderToStaticMarkup(createElement(ContentRenderer,{block:ex,resources:[]}));assert.equal((html.match(/<details/g)??[]).length,3);assert.doesNotMatch(html,/<details[^>]*\sopen/);}
  const solution=exercises[1].solution.join("\n"); for(const term of ["甲：","乙：","丙：","丁：","戊：","反光","交界","方法","实例"]) assert.ok(solution.includes(term),term);
  assert.ok(lesson.sections.every(s=>s.tier==="core"&&!/^\d/.test(s.title)));
});
test("37旧课全文及清单不变，原14幅图渲染保持；只允许两个旧源码文件的精确扩展",()=>{
  for(const old of before.lessons) assert.equal(JSON.stringify(lessonRegistry.get(old.id)),JSON.stringify(old),old.id);
  for(const old of before.publications) assert.deepEqual(publicationManifest.find(p=>p.lessonId===old.lessonId),old);
  for(const f of before.protectedFiles) assert.ok(matchesProtectedDigest(readFileSync(f.path),f.sha256,f.path),f.path);
  let count=0;
  for(const old of before.lessons.filter(l=>l.courseId==="AI000")) for(const b of old.sections.flatMap(s=>s.blocks).filter(b=>b.type==="ai-task-figure")) {
    const current=lessonRegistry.get(old.id)!.sections.flatMap(s=>s.blocks).find(n=>n.type==="ai-task-figure"&&n.kind===b.kind)!;
    assert.equal(renderToStaticMarkup(createElement(ContentRenderer,{block:current,resources:[]})),renderToStaticMarkup(createElement(ContentRenderer,{block:b,resources:[]})));count++;
  }
  assert.equal(count,14);
  const source=readFileSync("src/content/models.ts","utf8"), original=beforeVisionExtension("src/content/models.ts",source);
  assert.notEqual(source,original); assert.notEqual(beforeVisionExtension("src/content/models.ts",source.replace('z.literal("quiz")','z.literal("changed")')),original);
  const hash=(s:string)=>createHash("sha256").update(s).digest("hex");assert.notEqual(hash(original+"changed"),hash(original));
});
test("5.2独立r1阅读/完成可恢复，不继承或修改37旧课与旧修订记录",()=>{
  const memory=new Map<string,string>(),port={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}};const store=createProgressStore(()=>port);
  for(const old of before.lessons)store.save(lessonProgressScope(old),100,old.sections.at(-1)!.id,true);
  const oldKeys=new Map(memory),scope=lessonProgressScope(lesson);assert.equal(progressKey(scope),"aivora:learning:v2:AI000:AI000-C05-L02:r1");assert.equal(store.getSnapshot(scope),null);
  store.save(scope,62,"workbench-task");const restored=createProgressStore(()=>port);assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.section,"workbench-task");assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.completed,false);
  restored.save(scope,100,"takeaways",true);assert.equal(parseReadingProgress(createProgressStore(()=>port).getSnapshot(scope),scope)?.completed,true);
  for(const [k,v]of oldKeys)assert.equal(memory.get(k),v);
});
test("发布门禁与相邻导航一致，5.4/5.5继续规划",()=>{
  const course=getLearningCourse("AI000")!,pub=publicationManifest.find(p=>p.lessonId===lesson.id)!;assert.equal(course.status,"planned");assert.equal(pub.reviewEvidence,undefined);
  assert.equal(Boolean(resolveLesson("AI000",lesson.id)),isReadable(pub));
  if(isReadable(pub)){assert.equal(getAdjacentLessons(course,"AI000-C05-L01").next?.lessonId,lesson.id);assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C05-L01");assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,"AI000-C05-L03");}
  for(const slot of course.chapters[4].lessons.slice(3)){assert.equal(slot.status,"planned");assert.equal(slot.href,undefined);assert.equal(lessonRegistry.has(slot.lessonId),false);}
});
