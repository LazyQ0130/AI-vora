import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { naturalLanguageLesson as lesson } from "../src/content/lessons/ai000/natural-language-and-llm";
import { activityMessages, activityRules, activityCategories, activityEvidence, equipmentRules, equipmentMessages, serviceWorkRecords } from "../src/content/lessons/ai000/language-service-example";
import { lessonRegistry, resolveLesson, getAdjacentLessons, getLearningCourse } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { isReadable } from "../src/content/models";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { matchesProtectedDigest, type NlpBaseline } from "../scripts/review-ai000-5-1";

const blocks = lesson.sections.flatMap(s => s.blocks);
const exercises = blocks.filter(b => b.type === "exercise");
const baseline = JSON.parse(readFileSync("docs/ai000-5-1/BEFORE.json", "utf8")) as NlpBaseline;

test("五条原消息先于分类，按原文意图另核类别；主主题计数为1/2/1/1", () => {
  assert.equal(activityMessages.length, 5);
  const independent = activityMessages.map(([id, text]) => [id, /取消/.test(text) ? "取消报名" : /哪栋楼/.test(text) ? "活动地点" : /增加名额/.test(text) ? "名额咨询" : "报名确认"]);
  assert.deepEqual(independent, [["A","报名确认"],["B","取消报名"],["C","取消报名"],["D","活动地点"],["E","名额咨询"]]);
  assert.deepEqual(activityCategories.map(r => r.slice(0,2)), independent);
  assert.ok(lesson.sections.findIndex(s => s.id === "read-messages") < lesson.sections.findIndex(s => s.id === "sort-messages"));
  assert.equal(lesson.sections[0].blocks.filter(b => b.type === "table").length, 1);
  const count = new Map<string, number>(); for (const [, category] of independent) count.set(category, (count.get(category) ?? 0) + 1);
  const summary = lesson.sections.find(s => s.id === "summarize-messages")!.blocks.find(b => b.type === "table")!;
  assert.deepEqual(summary.rows.map(r => [r[0], Number(r[1])]), [...count.entries()]);
  assert.equal(summary.rows.reduce((sum, row) => sum + Number(row[1]), 0), activityMessages.length);
});

test("取消规则条件按原文重算：30/12不同、24恰归至少侧；D/E没有新增地点或扩充政策", () => {
  const r1 = activityRules[0][1];
  const boundary = Number(r1.match(/至少(\d+)小时/)![1]);
  assert.equal(boundary, 24); assert.match(r1, /不足24小时.*联系工作人员确认是否还能取消/);
  const hours = activityMessages.slice(1,3).map(([,text]) => Number(text.match(/还有(\d+)小时/)![1]));
  assert.deepEqual(hours, [30,12]); assert.deepEqual([...hours,24,23].map(h => h >= boundary), [true,false,true,false]);
  assert.match(activityEvidence[1][2], /自行取消/); assert.match(activityEvidence[2][2], /确认能否取消/);
  assert.match(activityRules[2][1], /相应活动的详情页面/); assert.doesNotMatch(activityRules.map(r => r[1]).join(""), /候补|扩充名额|教学楼|\d+教室/);
  assert.match(activityEvidence[3][2], /未知/); assert.match(activityEvidence[4][2], /未知/);
  assert.deepEqual(activityEvidence.map(r => r[1].match(/R\d/g)), [["R2"],["R1"],["R1"],["R3"],["R1","R3"]]);
});

test("器材新题需处理日期/缺项/多问题/政策缺口，不能从申请要求推续借或借用期限", () => {
  assert.equal(equipmentMessages.length, 4); assert.equal(equipmentRules.length, 3);
  const k3 = equipmentMessages[2][1]; assert.match(k3, /归还.*连接线断了.*找谁/);
  assert.match(equipmentRules[0][1], /领取前一天或更早.*自然日.*确认后/);
  assert.doesNotMatch(equipmentRules.map(r => r[1]).join(""), /续借|可借\d|赔偿|急借/);
  // 周三为3、周四为4；按题设自然日，无工作日/钟点歧义。
  assert.equal(4 - 3 >= 1, true); assert.equal(3 - 3 >= 1, false);
  const answer = exercises[0].solution.join("\n");
  for (const id of ["K1","K2","K3","K4","S1","S2","S3"]) assert.ok(answer.includes(id));
  assert.match(answer, /消息共|四条咨询/); assert.match(answer, /共5次/); assert.match(answer, /数量还需补充/); assert.match(answer, /续借政策.*未找到/);
});

test("十条工作记录从原文另核：3申请/3归还/2故障/2续借；联系不冒充解决", () => {
  assert.equal(new Set(serviceWorkRecords.map(r => r[0])).size, 10);
  const idsFor = (pattern: RegExp) => serviceWorkRecords.filter(([,text]) => pattern.test(text)).map(([id]) => id);
  assert.deepEqual(idsFor(/借用申请/), ["W1","W6","W9"]);
  assert.deepEqual(idsFor(/清点并登记完成/), ["W2","W5","W8"]);
  assert.deepEqual(idsFor(/无法启动|损坏/), ["W4","W7"]);
  assert.deepEqual(idsFor(/续借/), ["W3","W10"]);
  assert.match(serviceWorkRecords[3][1], /已联系.*处理结果未记录/); assert.match(serviceWorkRecords[6][1], /尚未联系/);
  const answer = exercises[1].solution.join("\n");
  assert.match(answer, /3\+3\+2\+2=10/); assert.match(answer, /S1讲申请须提前/); assert.match(answer, /三份均未给一次借多久/);
  assert.match(answer, /不能合并成故障已全部解决/); assert.match(answer, /记录条数/);
});

test("三目标映射两道去重核心题，六项反馈默认关闭、无代码/图片/外部运行要求", () => {
  assert.deepEqual(lessonExerciseLinks(lesson).map(e => [e.id,e.tier,e.objectives]), [["design-equipment-service","core",[1,2,3]],["choose-language-work","core",[1,2,3]]]);
  assert.equal(exercises.length, 2);
  for (const ex of exercises) {
    assert.equal(ex.hints.length, 2); assert.ok(ex.solution.some(s => s.includes("常见错误"))); assert.ok(ex.solution.some(s => s.includes("接受"))); assert.equal(ex.rubric.length, 4);
    const html = renderToStaticMarkup(createElement(ContentRenderer, { block: ex, resources: [] }));
    assert.equal((html.match(/<details/g) ?? []).length, 3); assert.doesNotMatch(html, /<details[^>]*\sopen/);
  }
  for (const section of lesson.sections) { assert.equal(section.tier, "core"); assert.doesNotMatch(section.title, /^\d/); }
  assert.ok(blocks.every(b => !["image","ai-task-figure","math","code","experiment","downloads"].includes(b.type)));
  assert.deepEqual(lesson.resources, []);
});

test("36旧教材/清单与219保护文件完全不变，原14精确图保留", () => {
  assert.equal(baseline.lessons.length, 36);
  for (const old of baseline.lessons) assert.equal(JSON.stringify(lessonRegistry.get(old.id)), JSON.stringify(old), old.id);
  for (const old of baseline.publications) assert.deepEqual(publicationManifest.find(p => p.lessonId === old.lessonId), old);
  for (const f of baseline.protectedFiles) assert.ok(matchesProtectedDigest(readFileSync(f.path), f.sha256, f.path), f.path);
  const lf = Buffer.from("first\nsecond\n"), crlf = Buffer.from("first\r\nsecond\r\n");
  const crlfHash = createHash("sha256").update(crlf).digest("hex");
  assert.equal(matchesProtectedDigest(lf, crlfHash, "example.ts"), true);
  assert.equal(matchesProtectedDigest(Buffer.from("first\nchanged\n"), crlfHash, "example.ts"), false);
  assert.equal(matchesProtectedDigest(lf, crlfHash, "example.png"), false);
  assert.equal(baseline.lessons.filter(l => l.courseId === "AI000").flatMap(l => l.sections.flatMap(s => s.blocks)).filter(b => b.type === "ai-task-figure").length, 14);
});

test("新r1独立进度，无旧完成继承，保存/刷新恢复不改旧键及旧修订", () => {
  const memory = new Map<string,string>(); const port = { getItem: (k:string) => memory.get(k) ?? null, setItem: (k:string,v:string) => { memory.set(k,v); } };
  const store = createProgressStore(() => port);
  for (const old of baseline.lessons) store.save(lessonProgressScope(old), 100, old.sections.at(-1)!.id, true);
  const historical = { ...lessonProgressScope(baseline.lessons.find(l => l.id === "AI000-C01-L01")!), contentVersion: 1 };
  store.save(historical, 100, historical.sectionIds[0], true);
  const oldKeys = new Map(memory), scope = lessonProgressScope(lesson);
  assert.equal(progressKey(scope), "aivora:learning:v2:AI000:AI000-C05-L01:r1"); assert.equal(store.getSnapshot(scope), null);
  store.save(scope, 68, "equipment-service-task");
  const restored = createProgressStore(() => port); assert.equal(parseReadingProgress(restored.getSnapshot(scope), scope)?.section, "equipment-service-task"); assert.equal(parseReadingProgress(restored.getSnapshot(scope), scope)?.completed, false);
  restored.save(scope, 100, "takeaways", true); assert.equal(parseReadingProgress(createProgressStore(() => port).getSnapshot(scope), scope)?.completed, true);
  for (const [key,value] of oldKeys) assert.equal(memory.get(key), value);
});

test("清单控制草稿与预览路径，前后导航自动衔接，5.4/5.5没有伪造正文", () => {
  const publication = publicationManifest.find(p => p.lessonId === lesson.id)!, course = getLearningCourse("AI000")!;
  assert.equal(course.status, "planned"); assert.equal(publication.reviewEvidence, undefined);
  assert.equal(Boolean(resolveLesson("AI000", lesson.id)), isReadable(publication));
  if (isReadable(publication)) {
    assert.equal(getAdjacentLessons(course,"AI000-C04-L04").next?.lessonId, lesson.id);
    assert.equal(getAdjacentLessons(course,lesson.id).previous?.lessonId,"AI000-C04-L04");
    assert.equal(getAdjacentLessons(course,lesson.id).next?.lessonId,"AI000-C05-L02");
  }
  for (const slot of course.chapters[4].lessons.slice(3)) { assert.equal(slot.status,"planned"); assert.equal(slot.href,undefined); assert.equal(lessonRegistry.has(slot.lessonId),false); }
});
