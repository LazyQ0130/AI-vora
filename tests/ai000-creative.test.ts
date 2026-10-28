import { qualityComparableJson, beforeQualityRevision } from "../scripts/ai000-quality-compatibility";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { generativeWorkLesson as lesson } from "../src/content/lessons/ai000/generative-work";
import { exchangeScript, galleryScripts } from "../src/content/lessons/ai000/creative-work-example";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { isReadable } from "../src/content/models";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { createProgressStore, progressKey, parseReadingProgress } from "../src/lib/learning-progress";
import { matchesProtectedDigest, type CreativeBaseline } from "../scripts/review-ai000-5-4";
import { beforeCreativeExtension } from "../scripts/ai000-creative-compatibility";

const before = JSON.parse(readFileSync("docs/ai000-5-4/BEFORE.json", "utf8")) as CreativeBaseline;
const blocks = lesson.sections.flatMap(s => s.blocks), exercises = blocks.filter(b => b.type === "exercise");
const figures = blocks.filter(b => b.type === "ai-task-figure");
const htmlFor = (kind: string) => renderToStaticMarkup(createElement(ContentRenderer, { block: figures.find(f => f.kind === kind)!, resources: [] }));
const poster = (html: string, id: string) => html.match(new RegExp(`<article data-poster-id="${id}"[\\s\\S]*?</article>`))![0];
const field = (html: string, name: string) => html.match(new RegExp(`<(h3|p|ul) data-poster-field="${name}"[^>]*>([\\s\\S]*?)</\\1>`))![2].replace(/<[^>]+>/g, "");
const contentFields = ["name", "time", "place", "participation", "content"];
const main = htmlFor("creative-posters"), tech = htmlFor("creative-tech-posters");
const text = (id: string) => lesson.sections.find(s => s.id === id)!.blocks.map(b => b.type === "paragraph" ? b.text : b.type === "callout" ? b.text : "").join("\n");

test("实际主海报五字段独立核验：A全对，B仅开始时间错误，版式判据与内容分开", () => {
  const expected = ["校园旧物交换日", "周六14:00–16:00", "图书馆一楼共享区", "免费参加，无需提前报名", "交换闲置书籍和学习用品"];
  const a = poster(main, "A"), b = poster(main, "B");
  assert.deepEqual(contentFields.map(k => field(a, k)), expected);
  assert.deepEqual(contentFields.map(k => field(b, k)), expected.map((v, i) => i === 1 ? "周六15:00–16:00" : v));
  assert.doesNotMatch(a, /data-poster-group="time-place"/); assert.match(b, /<h3[^>]*>[\s\S]*?<\/h3><div data-poster-group="time-place"/);
  for (const k of ["time", "place"]) assert.ok(a.indexOf(`data-poster-field="${k}"`) > a.indexOf('data-poster-field="participation"'));
  const facts = lesson.sections.find(s => s.id === "clear-requirements")!.blocks.find(b => b.type === "table")!;
  assert.deepEqual(facts.rows.map(r => r[1]), expected);
  const comparison = blocks.find(b => b.type === "table" && b.caption.startsWith("对照原资料"))!;
  assert.equal(comparison.type, "table"); if (comparison.type !== "table") return;
  assert.deepEqual(comparison.rows[1], ["周六14:00–16:00", "满足，原时段完整", "未满足，开始写成15:00"]);
  assert.match(text("compare-posters"), /目前两张都不能直接交付/);
});

test("科技新图按题设重求：C内容全对但项目合写，D只错楼层与登记，不能强选冠军", () => {
  const c = poster(tech, "C"), d = poster(tech, "D");
  assert.deepEqual(contentFields.map(k => field(c, k)), ["校园科技体验日", "周日13:30–16:30", "综合楼二楼体验区", "需要提前登记", "机器人演示与科学小实验"]);
  assert.deepEqual(contentFields.map(k => field(d, k)), ["校园科技体验日", "周日13:30–16:30", "综合楼一楼体验区", "无需提前登记", "机器人演示科学小实验"]);
  assert.doesNotMatch(c, /<li>/); assert.match(d, /<li>机器人演示<\/li><li>科学小实验<\/li>/);
  const answer = exercises[0].solution.join("\n");
  for (const evidence of ["事实均正确", "各自单列", "两项内容没有缺失", "一楼", "二楼", "无需提前登记", "需要提前登记", "没有可直接交付"]) assert.ok(answer.includes(evidence), evidence);
  assert.ok(!field(c, "time").includes("15:00") && !field(d, "time").includes("15:00"));
});

test("定向修改与全量复查包含原来正确项，未知有取证办法", () => {
  const revision = text("revise-and-recheck");
  assert.match(revision, /15:00改为14:00/); assert.match(revision, /独立信息组/); assert.match(revision, /改对时间却漏了地点/);
  for (const s of [exercises[0].solution.join("\n"), exercises[1].solution.join("\n")]) {
    assert.match(s, /重查|复查|再查/);
    for (const term of ["保留", "负责人", "来源"]) assert.ok(s.includes(term), term);
  }
  assert.ok(JSON.stringify(lesson.sections.find(s => s.id === "name-constraints")!.blocks).includes("当前海报单独不能证明"));
});

test("文稿事实逐句重核，展馆甲错加漏与乙内容合格可证；音频结论保持待检", () => {
  assert.equal(exchangeScript, "本周六下午两点到四点，校园旧物交换日在图书馆一楼共享区举行。欢迎带来闲置书籍和学习用品。活动免费，无需提前报名。");
  assert.equal(galleryScripts[0].text, "欢迎来到校园探索展馆。展馆周二至周五中午十二点到下午五点开放，参观还能免费领取纪念品。");
  assert.equal(galleryScripts[1].text, "欢迎来到校园探索展馆。展馆周三至周五中午十二点到下午五点开放。参观时请勿触摸展品。");
  const answer = exercises[1].solution.join("\n");
  for (const item of ["周三", "周二", "没有题设依据", "漏掉请勿触摸展品", "当前均未知", "完整听", "实际播放计时", "20–30秒", "音频尚不能交付", "文稿内容通过，音频待检"]) assert.ok(answer.includes(item), item);
  assert.match(text("read-the-script"), /不能仅凭字数/);
  assert.ok(answer.includes(galleryScripts[1].text));
  assert.equal(blocks.some(b => b.type === "audio" as string), false);
});

test("工作安排不冒充内部算法，生成与训练分清；版权未知与单件评价边界准确", () => {
  assert.match(text("revise-and-recheck"), /不是声称所有生成系统内部都运行这套固定算法/);
  assert.match(text("revise-and-recheck"), /不足以说明模型参数重新训练/);
  assert.match(text("generation-in-a-system"), /不能据此断定内部采用了强化学习/);
  assert.match(text("generation-in-a-system"), /不能证明模型在所有生成任务上都可靠/);
  assert.match(text("name-constraints"), /不能保证作品原创或已经取得必要许可/);
  assert.match(text("generation-in-a-system"), /可能在相同设置下重复/);
});

test("三目标真实映射两道核心题，各有完整反馈；候选原生文字可访问无装饰与伪音频", () => {
  assert.deepEqual(lessonExerciseLinks(lesson).map(e => [e.id, e.tier, e.objectives]), [["check-tech-posters", "core", [1, 2, 3]], ["plan-gallery-voice", "core", [1, 2, 3]]]);
  for (const e of exercises) { assert.equal(e.hints.length, 2); assert.equal(e.rubric.length, 4); assert.ok(e.solution.some(s => s.includes("接受"))); assert.ok(e.solution.some(s => s.includes("常见错误")));
    const html = renderToStaticMarkup(createElement(ContentRenderer, { block: e, resources: [] })); assert.equal((html.match(/<details/g) ?? []).length, 3); assert.doesNotMatch(html, /<details[^>]*\sopen/); }
  assert.equal(figures.length, 2);
  for (const f of figures) { const html = htmlFor(f.kind); assert.match(html, /<figure[^>]*aria-labelledby=[^>]*aria-describedby=/); assert.ok(html.includes(f.alt) && html.includes(f.caption)); assert.equal((html.match(/<article data-poster-id=/g) ?? []).length, 2); assert.doesNotMatch(html, /<img|<svg|<audio|<video|<button/); assert.match(html, /minmax\(min\(100%, 280px\), 1fr\)/); assert.match(html, /font-size:16px/); }
  assert.ok(blocks.every(b => !["image", "code", "math", "experiment", "downloads"].includes(b.type))); assert.deepEqual(lesson.resources, []);
  assert.ok(lesson.sections.every(s => s.tier === "core" && !/^\d/.test(s.title)));
  for (const link of lesson.prerequisiteLinks) { const [, , courseId, id] = link.href.split("/"); const [lessonId, hash] = id.split("#"); assert.ok(resolveLesson(courseId, lessonId)?.lesson.sections.some(s => s.id === hash), link.href); }
});

test("39旧课全文/清单与227保护文件保持，21幅原图渲染不变，精确逆变换仍拒绝其他修改", () => {
  for (const old of before.lessons) assert.equal(qualityComparableJson(lessonRegistry.get(old.id)), JSON.stringify(old), old.id);
  for (const old of before.publications) assert.deepEqual(beforeQualityRevision(publicationManifest.find(p => p.lessonId === old.lessonId)), old);
  for (const f of before.protectedFiles) assert.ok(matchesProtectedDigest(readFileSync(f.path), f.sha256, f.path), f.path);
  let count = 0;
  for (const old of before.lessons.filter(l => l.courseId === "AI000")) for (const b of old.sections.flatMap(s => s.blocks).filter(b => b.type === "ai-task-figure")) {
    const current = lessonRegistry.get(old.id)!.sections.flatMap(s => s.blocks).find(n => n.type === "ai-task-figure" && n.kind === b.kind)!;
    assert.equal(renderToStaticMarkup(createElement(ContentRenderer, { block: current, resources: [] })), renderToStaticMarkup(createElement(ContentRenderer, { block: b, resources: [] }))); count++;
  }
  assert.equal(count, 21);
  for (const path of ["src/content/models.ts", "src/components/lesson/ai-task-figure.tsx"]) {
    const source = readFileSync(path, "utf8"), digest = before.protectedFiles.find(f => f.path === path)!.sha256;
    assert.notEqual(source, beforeCreativeExtension(path, source)); assert.equal(matchesProtectedDigest(Buffer.from(source + "\n// undeclared change"), digest, path), false);
  }
});

test("5.4独立r1进度不继承旧39课或历史修订，位置与手动完成可恢复且旧键字节不变", () => {
  const memory = new Map<string, string>(), port = { getItem: (k: string) => memory.get(k) ?? null, setItem: (k: string, v: string) => { memory.set(k, v); } };
  const store = createProgressStore(() => port);
  for (const old of before.lessons) store.save(lessonProgressScope(old), 100, old.sections.at(-1)!.id, true);
  const historical = { ...lessonProgressScope(before.lessons.find(l => l.id === "AI000-C01-L01")!), contentVersion: 1 };
  store.save(historical, 100, historical.sectionIds[0], true);
  const oldKeys = new Map(memory), scope = lessonProgressScope(lesson); assert.equal(progressKey(scope), "aivora:learning:v2:AI000:AI000-C05-L04:r1"); assert.equal(store.getSnapshot(scope), null);
  store.save(scope, 61, "tech-poster-task"); const restored = createProgressStore(() => port); assert.equal(parseReadingProgress(restored.getSnapshot(scope), scope)?.section, "tech-poster-task"); assert.equal(parseReadingProgress(restored.getSnapshot(scope), scope)?.completed, false);
  restored.save(scope, 100, "takeaways", true); assert.equal(parseReadingProgress(createProgressStore(() => port).getSnapshot(scope), scope)?.completed, true);
  for (const [k, v] of oldKeys) assert.equal(memory.get(k), v);
});

test("5.4清单门禁和相邻导航一致，5.5承接且第六章仍规划", () => {
  const pub = publicationManifest.find(p => p.lessonId === lesson.id)!, course = getLearningCourse("AI000")!;
  assert.equal(course.status, "planned"); assert.equal(pub.reviewEvidence, undefined); assert.equal(lesson.contentVersion, 1);
  assert.equal(Boolean(resolveLesson("AI000", lesson.id)), isReadable(pub));
  if (isReadable(pub)) { assert.equal(getAdjacentLessons(course, "AI000-C05-L03").next?.lessonId, lesson.id); assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "AI000-C05-L03"); assert.equal(getAdjacentLessons(course, lesson.id).next?.lessonId, "AI000-C05-L05"); }
  for (const slot of course.chapters.slice(5).flatMap(c=>c.lessons).filter(l=>l.lessonId>"AI000-C06-L02")) { assert.equal(slot.status, "planned"); assert.equal(slot.href, undefined); assert.equal(lessonRegistry.has(slot.lessonId), false); }
});
