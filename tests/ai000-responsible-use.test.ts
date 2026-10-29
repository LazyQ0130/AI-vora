import { beforeR3Revision } from "../scripts/ai000-r3-compatibility";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { responsibleUseLesson as lesson } from "../src/content/lessons/ai000/responsible-ai-use";
import { eventFacts, eventAssets, eventAssetReview, licenseComparison, releaseRoles, handbookAssets, handbookChannels, lectureFacts, lectureDraft, correctedLectureCopy } from "../src/content/lessons/ai000/responsible-use-example";
import { beforeResponsibleSource } from "../scripts/ai000-responsible-compatibility";
import type { ResponsibleUseBaseline } from "../scripts/review-ai000-6-3";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { lessonSchema, isReadable } from "../src/content/models";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { createProgressStore, progressKey, parseReadingProgress } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";
const before=JSON.parse(readFileSync("docs/ai000-6-3/BEFORE.json","utf8")) as ResponsibleUseBaseline;
const blocks=lesson.sections.flatMap(s=>s.blocks),tasks=blocks.filter(b=>b.type==="exercise");
const sec=(id:string)=>lesson.sections.find(s=>s.id===id)!;
const prose=(id:string)=>JSON.stringify(sec(id).blocks);
const sha=(v:Buffer)=>createHash("sha256").update(v).digest("hex");
const answer=(i:number)=>tasks[i].solution.join("\n");

test("R3登记精修逆转后：6.3保留43旧课全文/清单、244文件及23精确图，未登记变更仍拒绝",()=>{
  assert.equal(before.lessons.length,43);assert.equal(before.publications.length,43);assert.equal(before.files.length,244);
  assert.equal(lessonRegistry.size,48);assert.equal(publicationManifest.length,48);
  for(const old of before.lessons)assert.equal(JSON.stringify(beforeR3Revision(lessonRegistry.get(old.id))),JSON.stringify(old),old.id);
  for(const old of before.publications)assert.deepEqual(beforeR3Revision(publicationManifest.find(p=>p.lessonId===old.lessonId)),old,old.lessonId);
  for(const f of before.files){const b=readFileSync(f.path);if(sha(b)===f.sha256)continue;const reversed=beforeResponsibleSource(f.path,b.toString("utf8")).replaceAll("\r\n","\n");assert.ok([reversed,reversed.replaceAll("\n","\r\n")].some(s=>sha(Buffer.from(s))===f.sha256),f.path);}
  const path="src/lib/course-engine.ts",source=readFileSync(path,"utf8"),digest=before.files.find(f=>f.path===path)!.sha256;
  assert.notEqual(sha(Buffer.from(beforeResponsibleSource(path,source+"\n// extra"))),digest);
  assert.notEqual(sha(Buffer.from(beforeResponsibleSource(path,source.replace("responsibleUseLesson,","responsibleUseLesson, // extra")))),digest);
  assert.equal(before.lessons.filter(l=>l.courseId==="AI000").flatMap(l=>l.sections.flatMap(s=>s.blocks)).filter(b=>b.type==="ai-task-figure").length,23);
});
test("S1活动六项精确，六素材初始只列记录/用法，先试判再反馈",()=>{
  assert.deepEqual(eventFacts,[["名称","校园科技体验日"],["时间","周日13:30–16:30"],["地点","综合楼二楼体验区"],["内容","机器人演示与科学小实验"],["参与要求","提前登记"],["拟发布渠道","校园活动页面、公众号、配套宣传短视频"]]);
  assert.deepEqual(eventAssets.map(a=>a.id),["S1","S2","S3","S4","S5","S6"]);
  const table=sec("source-cards").blocks.find(b=>b.type==="table")!;assert.equal(table.type,"table");
  if(table.type==="table")assert.deepEqual(table.rows,eventAssets.map(a=>[a.id+" "+a.name,a.source,a.use]));
  assert.ok(lesson.sections.indexOf(sec("source-cards"))<lesson.sections.indexOf(sec("name-permission")));
  assert.ok(lesson.sections.indexOf(sec("name-permission"))<lesson.sections.indexOf(sec("asset-decisions")));
  assert.match(eventAssets[0].source,/未提供其他素材授权/);assert.match(eventAssetReview[0][3],/不能据此放行其他素材/);
});
test("S2同意限本次，无人物不等于其他权利和无限用法已解决",()=>{
  assert.match(eventAssets[1].source,/无人物入镜/);assert.match(eventAssets[1].source,/其他作品\/标志仍需/);
  assert.deepEqual(eventAssetReview[1].slice(0,3),["S2","摄影者及本次同意记录明确","核对画面后按范围使用"]);
  assert.match(eventAssetReview[1][3],/不延伸到未约定用途/);
  assert.match(prose("name-permission"),/有权许可的人还可能与上传者不同/);
});
test("S3及S5只知道取得文件，审核暂缓具体查范围，不宣布一切违法",()=>{
  assert.match(eventAssets[2].source,/无作者、原始发布页或许可/);
  assert.match(eventAssets[4].source,/仅写免费下载/);
  for(const id of ["S3","S5"]){const row=eventAssetReview.find(r=>r[0]===id)!;assert.equal(row[2],"当前暂缓，补查或替换");assert.match(row[3],/有权许可者/);}
  assert.match(eventAssetReview[4][3],/配乐、剪辑与发布/);
  assert.match(prose("asset-decisions"),/尚未据此认定它们在一切情形下违法/);
});
test("BY4可商业和改编，NC4明确商业广告不由当前许可支持",()=>{
  assert.deepEqual(licenseComparison.map(r=>r.slice(0,2)),[["CC BY 4.0","可复制、分享和改编，也允许商业用途"],["CC BY-NC 4.0","复制、分享和改编限非商业目的"]]);
  assert.match(prose("compare-licenses"),/主要为商业利益或金钱报酬/);
  assert.match(prose("compare-licenses"),/其他版本的要求不能直接照抄/);
  assert.match(handbookChannels[1][1],/明确以商业推广为目的/);
  assert.match(answer(0),/C：.*当前许可不支持该用法/);
  assert.match(answer(0),/B：.*两渠道均可在履行条件后使用/);
});
test("S4作者/原页/版本/裁剪调亮对应条件，署名不替代许可或背书",()=>{
  assert.match(eventAssets[3].source,/P4.*林舟.*CC BY 4.0/);assert.match(eventAssets[3].use,/裁剪、调亮/);
  for(const t of ["保留","许可链接","修改说明","不暗示背书"])assert.ok(eventAssetReview[3][3].includes(t),t);
  assert.match(prose("compare-licenses"),/《机器人关节》，林舟，原始页P4/);
  assert.match(prose("compare-licenses"),/版权、许可及免责说明/);
  assert.match(prose("compare-licenses"),/限制接收者行使该许可权利/);
  assert.match(prose("name-permission"),/不能凭空补出原本没有的许可/);
  assert.match(prose("compare-licenses"),/人物形象、隐私、声音或商标/);
});
test("S6条款与实际输出均待核，使用许可不同于版权保护资格且限定法域",()=>{
  assert.match(eventAssets[5].source,/未保存工具条款/);
  assert.match(eventAssetReview[5][3],/账户情境.*条款版本/);
  const text=prose("voice-and-rights");
  for(const t of ["不能因“AI生成”直接宣布可商用","不能因此一律禁用","条款是否允许你这样使用输出","某个地区是否能取得特定版权保护","人类创作贡献","美国制度","不是全球所有AI作品的统一结论"])assert.ok(text.includes(t),t);
});
test("误用逐项回原资料、分开机构批准及人物声音与推荐",()=>{
  const table=sec("misleading-content").blocks.find(b=>b.type==="table")!;assert.equal(table.type,"table");if(table.type==="table"){assert.equal(table.rows.length,4);assert.deepEqual(table.rows.map(r=>r[0]),["保证官方证书","随到随进","学校官方已经认可","老师模拟声音亲自推荐"]);}
  assert.match(prose("voice-and-rights"),/允许使用某个声音，也不自动表示老师认可活动/);
  assert.match(prose("misleading-content"),/加一句.*AI制作.*不能让这些误导自动消失/);
  assert.match(prose("voice-and-rights"),/适当同意的人员朗读/);
});
test("四职责各有对象，最终版本/渠道由人确认，事后按传播位置纠正",()=>{
  assert.equal(releaseRoles.length,4);assert.deepEqual(releaseRoles.map(r=>r[0]),["活动负责人","素材整理人员","文案与作品审核人员","最终发布负责人"]);
  assert.match(releaseRoles[3][1],/可公开版本与渠道/);
  assert.match(prose("release-roles"),/一人承担多项职责/);
  assert.match(prose("release-roles"),/自动生成的.*全部审核通过.*没有替负责人/);
  const sequence=sec("before-and-after").blocks.find(b=>b.type==="table")!;assert.equal(sequence.type,"table");if(sequence.type==="table")assert.equal(sequence.rows.length,7);
  for(const t of ["停止继续传播","活动页、公众号和短视频","实际展示已更新","受影响","无法直接修改的转发","只改本地源文件"])assert.ok(prose("before-and-after").includes(t),t);
});
test("招新新题五项决策按范围，有商业/招新分离和合影双层依据",()=>{
  assert.deepEqual(handbookAssets.map(a=>a.id),["A","B","C","D","E"]);
  assert.match(handbookAssets[0].source,/只确认用于本次招新手册/);
  assert.match(handbookAssets[1].source,/已核由有权许可.*CC BY 4.0/);
  assert.match(handbookAssets[4].source,/摄影者已同意.*人物.*尚未核实/);
  const expected=[["A：","广告用途尚未确认"],["B：","裁剪要说明"],["C：","另外授权"],["D：","两处均暂缓"],["E：","广告的摄影许可也要补核"]];
  for(const [id,check] of expected){const line=tasks[0].solution.find(s=>s.startsWith(id))!;assert.ok(line,id);assert.ok(line.includes(check),check);}
  assert.match(answer(0),/https:\/\/creativecommons.org\/licenses\/by\/4.0\//);
  assert.match(answer(0),/内部表格记下就算完成/);
  assert.match(answer(0),/手册PDF、在线页及赞助页/);
  assert.match(answer(0),/暂时只发已完成全部条件的招新版本/);
});
test("讲座完整改稿独立对照五事实，不残留无据承诺/背书或编造新信息",()=>{
  assert.deepEqual(lectureFacts.slice(0,6),[["名称","公益科普讲座《识别网络信息》"],["时间","周六14:00–15:30"],["地点","图书馆报告厅"],["主办","校园科创社团"],["报名","提前通过社团活动页面登记"],["证书","本次不承诺任何证书"]]);
  const expected="校园科创社团公益科普讲座《识别网络信息》将于周六14:00–15:30在图书馆报告厅举行。请提前通过社团活动页面登记。";
  assert.equal(correctedLectureCopy,expected);assert.equal(tasks[1].solution[2],"完整修正版可为："+expected);
  assert.doesNotMatch(correctedLectureCopy,/官方|认证|顶级|证书|无需报名|老师|免费|https:/);
  assert.match(lectureDraft,/无需报名/);assert.match(lectureDraft,/亲自推荐/);
  assert.match(answer(1),/不把“不承诺证书”擅自扩大/);
});
test("讲座新题跨文稿/声音/成品/三渠道决策，不以只改文字或AI标识放行",()=>{
  const text=answer(1);
  for(const t of ["没有真实视频/音频","实际听有无错读/漏读","活动负责人","素材整理者","最终发布负责人","当前原稿/老师拟声背书方案不放行","原题尚未发布","条件分支方案","社团活动页、公众号、短视频账号","实际显示","不能直接控制的转发"])assert.ok(text.includes(t),t);
  assert.match(lectureFacts.at(-1)![1],/当前视频尚未正式发布/);
  assert.match(text,/即使将来取得某种声音使用同意，也不自动取得个人背书/);
  assert.match(text,/没有完整稿/);
});
test("两种迁移产出映射三目标，提示只给动作不交字段决定或修正稿",()=>{
  assert.deepEqual(tasks.map(t=>t.id),["audit-recruitment-assets","review-lecture-release"]);
  assert.deepEqual(lesson.assessmentMap,[{objective:1,exerciseIds:["audit-recruitment-assets"]},{objective:2,exerciseIds:["review-lecture-release"]},{objective:3,exerciseIds:["audit-recruitment-assets","review-lecture-release"]}]);
  assert.equal(lessonExerciseLinks(lesson).length,2);
  for(const t of tasks){assert.equal(t.hints.length,2);assert.equal(t.prompt.split("\n\n").length,3);assert.ok(t.solution.some(s=>s.includes("接受")));assert.ok(t.solution.some(s=>s.includes("常见错误")));assert.ok(t.rubric.length>=4);}
  assert.doesNotMatch(tasks[0].hints.join(""),/\b[A-E]：|CC BY|NC|暂缓|裁剪|合影|商用|署名/);
  assert.doesNotMatch(tasks[1].hints.join(""),/识别网络信息|14:00|15:30|图书馆|请提前|老师|证书/);
  const invalid=structuredClone(lesson);invalid.sections.find(s=>s.id==="lecture-task")!.tier="advanced";assert.equal(lessonSchema.safeParse(invalid).success,false);
});
test("只用表格和文字，三折叠与真实先修，6.2到6.3再到7.1及后两节规划门禁",()=>{
  assert.ok(blocks.every(b=>!["image","ai-task-figure","code","experiment","downloads","math"].includes(b.type)));assert.deepEqual(lesson.resources,[]);
  for(const b of blocks.filter(b=>b.type==="table")){const h=renderToStaticMarkup(createElement(ContentRenderer,{block:b,resources:[]}));assert.match(h,/<caption/);assert.match(h,/<th/);assert.match(h,/tabindex="0"/);}
  for(const b of tasks){const h=renderToStaticMarkup(createElement(ContentRenderer,{block:b,resources:[]}));assert.equal((h.match(/<details/g)??[]).length,3);assert.doesNotMatch(h,/<details[^>]*\sopen/);}
  for(const l of lesson.prerequisiteLinks){const [path,hash]=l.href.split("#"),parts=path.split("/");assert.ok(resolveLesson(parts[2],parts[3])!.lesson.sections.some(s=>s.id===hash),l.href);}
  assert.ok(lesson.sections.every(s=>s.tier==="core"&&!/^\d+[.、\s]/.test(s.title)));
  const pub=publicationManifest.find(p=>p.lessonId===lesson.id)!,course=getLearningCourse("AI000")!;
  assert.equal(course.status,"planned");assert.equal(pub.reviewEvidence,undefined);assert.equal(pub.contentVersion,2);assert.equal(Boolean(resolveLesson("AI000",lesson.id)),isReadable(pub));
  if(isReadable(pub)){assert.equal(pub.status,"pending-review");assert.equal(getAdjacentLessons(course,"AI000-C06-L02").next?.lessonId,lesson.id);assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C06-L02");assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,"AI000-C07-L01");}else{assert.equal(pub.status,"draft");assert.equal(pub.access,"private");}
  for(const slot of course.chapters[6].lessons.slice(3)){assert.equal(slot.href,undefined);assert.equal(slot.status,"planned");assert.equal(lessonRegistry.has(slot.lessonId),false);}
});
test("6.3 r2空态与43旧课及1.2/5.3历史键隔离，独立恢复位置/完成",()=>{
  const memory=new Map<string,string>(),port={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}},store=createProgressStore(()=>port);
  for(const old of before.lessons)store.save(lessonProgressScope(old),100,old.sections.at(-1)!.id,true);
  for(const id of ["AI000-C01-L02","AI000-C05-L03"])store.save({...lessonProgressScope(lessonRegistry.get(id)!),contentVersion:1},100,"takeaways",true);
  const old=new Map(memory),scope=lessonProgressScope(lesson);assert.equal(progressKey(scope),"aivora:learning:v2:AI000:AI000-C06-L03:r2");assert.equal(store.getSnapshot(scope),null);
  store.save(scope,58,"asset-decisions");const restored=createProgressStore(()=>port);assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.section,"asset-decisions");assert.equal(parseReadingProgress(restored.getSnapshot(scope),scope)?.completed,false);
  restored.save(scope,100,"takeaways",true);assert.equal(parseReadingProgress(createProgressStore(()=>port).getSnapshot(scope),scope)?.completed,true);for(const [k,v]of old)assert.equal(memory.get(k),v,k);
});
test("6.3任务量编辑估计同步24节850–1280，710–1080历史留存",()=>{
  assert.deepEqual(lesson.learningTime,{reading:[14,20],practice:[32,46],coding:[0,0],basis:"editorial-estimate"});
  const t=getCourseStudyEstimate("AI000")!;assert.deepEqual(t.totalMinutes,[850,1280]);assert.equal(t.hours,"14.2–21.3");
  assert.deepEqual(JSON.parse(readFileSync("docs/ai000-6-2/TIME_ESTIMATE.json","utf8")).totalMinutes,[710,1080]);
});
