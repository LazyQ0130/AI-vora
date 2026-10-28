import { qualityComparableJson, beforeQualityRevision } from "../scripts/ai000-quality-compatibility";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { multimodalLesson as lesson } from "../src/content/lessons/ai000/multimodal-ai";
import { exhibitImages, exhibitRecords, guideTranscript, lostPropertyImages, lostPropertyRecords, blueWave, whiteStar, compassTicks, taskTranscript } from "../src/content/lessons/ai000/multimodal-example";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { isReadable } from "../src/content/models";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { createProgressStore, progressKey, parseReadingProgress } from "../src/lib/learning-progress";
import { matchesProtectedDigest, type MultimodalBaseline } from "../scripts/review-ai000-5-3";
import { beforeMultimodalExtension } from "../scripts/ai000-multimodal-compatibility";

const before = JSON.parse(readFileSync("docs/ai000-5-3/BEFORE.json", "utf8")) as MultimodalBaseline;
const blocks = lesson.sections.flatMap(s => s.blocks), exercises = blocks.filter(b => b.type === "exercise");
const figures = blocks.filter(b => b.type === "ai-task-figure");
const htmlFor = (kind: string) => renderToStaticMarkup(createElement(ContentRenderer, { block: figures.find(f => f.kind === kind)!, resources: [] }));
const photo = (html: string, id: string, next?: string) => html.slice(html.indexOf(`data-photo-id="${id}"`), next ? html.indexOf(`data-photo-id="${next}"`) : html.length);

test("展品图实际给出A的蓝波浪和B的指针刻度，编号可读；独立核验刻度几何", () => {
  assert.deepEqual(exhibitImages.map(i => [i.id, i.shape]), [["A", "bowl"], ["B", "compass"]]);
  const html = htmlFor("multimodal-exhibits"), a = photo(html, "A", "B"), b = photo(html, "B");
  assert.match(a, /<strong[^>]*>图片 A<\/strong>/); assert.match(b, /<strong[^>]*>图片 B<\/strong>/);
  assert.match(a, /data-shape="bowl"/); assert.match(a, /data-visible-feature="blue-wave"/); assert.ok(a.includes(`d="${blueWave}"`)); assert.match(a, /stroke="#2762c6" stroke-width="5"/);
  assert.doesNotMatch(a, /data-visible-feature="needle"|data-visible-feature="scale"/);
  assert.match(b, /data-visible-feature="needle"/); assert.match(b, /data-visible-feature="scale"/); assert.equal((b.match(/<line /g) ?? []).length, 16); assert.doesNotMatch(b, /data-visible-feature="blue-wave"/);
  // 不重用绘图的角度公式作为预期：四个主刻度端点及所有外端半径独立定义。
  const cardinal = [[120, 41, 120, 29], [169, 90, 181, 90], [120, 139, 120, 151], [71, 90, 59, 90]];
  [0, 4, 8, 12].forEach((index, i) => Object.values(compassTicks[index]).forEach((value, j) => assert.ok(Math.abs(value - cardinal[i][j]) < 1e-9)));
  for (const t of compassTicks) assert.ok(Math.abs(Math.hypot(t.x2 - 120, t.y2 - 90) - 61) < 1e-9);
});

test("主例答案沿图片编号查询，材料与展厅来自登记；错配及缺失不能凭外观补齐", () => {
  assert.deepEqual(exhibitRecords, [{ id: "A", name: "蓝纹陶碗", material: "陶瓷", hall: "东厅" }, { id: "B", name: "航海罗盘", material: "金属", hall: "西厅" }]);
  const byId = new Map(exhibitRecords.map(r => [r.id as string, r]));
  assert.equal(byId.get(exhibitImages[0].id)?.hall, "东厅"); assert.equal(byId.get("B")?.hall, "西厅");
  const missing = exhibitRecords.filter(r => r.id !== "A"); assert.equal(missing.find(r => r.id as string === "A")?.hall, undefined);
  const evidence = blocks.find(b => b.type === "table" && b.caption.startsWith("把一句答案拆开")); assert.equal(evidence?.type, "table");
  if (evidence?.type === "table") { assert.match(evidence.rows[2][1], /文字表的A行/); assert.match(evidence.rows[3][1], /不是只凭外观确认/); }
  const changes = blocks.find(b => b.type === "table" && b.caption.startsWith("缺什么")); assert.equal(changes?.type, "table");
  if (changes?.type === "table") { assert.match(changes.rows[0][1], /错报为西厅/); assert.match(changes.rows[2][1], /展厅未知/); assert.match(changes.rows[3][2], /生效/); }
});

test("新失物图的星形、把手、两横纹可核对，反序登记与地点缺口有独立预期", () => {
  assert.deepEqual(lostPropertyImages.map(i => [i.id, i.shape]), [["P7", "star-cup"], ["P8", "striped-flask"]]);
  const html = htmlFor("multimodal-lost-property"), p7 = photo(html, "P7", "P8"), p8 = photo(html, "P8");
  assert.match(p7, /data-visible-feature="white-star"/); assert.match(p7, /data-visible-feature="handle"/); assert.doesNotMatch(p7, /data-visible-feature="black-stripes"/);
  assert.match(p8, /data-visible-feature="lid"/); assert.match(p8, /data-visible-feature="black-stripes"[^>]*><path d="M78 91H162"><\/path><path d="M78 111H162"><\/path>/); assert.doesNotMatch(p8, /data-visible-feature="white-star"|data-visible-feature="handle"/);
  const vertices = whiteStar.split(" ").map(p => p.split(",").map(Number)); assert.equal(vertices.length, 10);
  vertices.forEach(([x, y], i) => { const radius = Math.hypot(x - 110, y - 105); assert.ok(i % 2 === 0 ? radius > 25 : radius < 15); assert.ok(x > 60 && x < 160 && y > 69 && y < 144); });
  assert.deepEqual(lostPropertyRecords.map(r => [r.id, r.photoId, r.collectionPoint]), [["L21", "P8", null], ["L22", "P7", "图书馆一楼值班台"]]);
  // 故意从关联字段求解而非按索引；错把P8连L22会借用P7地点，真地点仍null。
  const blue = lostPropertyRecords.find(r => r.photoId === "P7")!, red = lostPropertyRecords.find(r => r.photoId === "P8")!;
  assert.equal(blue.id, "L22"); assert.equal(red.collectionPoint, null); assert.equal(blue.collectionPoint, "图书馆一楼值班台");
  assert.ok(exercises[0].solution.some(s => s.includes("红杯说成在图书馆一楼值班台"))); assert.ok(exercises[0].solution.some(s => s.includes("所有者") && s.includes("不能")));
  assert.ok(exercises[0].solution.some(s => s.includes("综合楼值班点") && s.includes("体育馆门口") && s.includes("生效")));
});

test("音频来源与当前文字输入分开，五种输入输出明确，丙按T1实际提取三待办", () => {
  assert.deepEqual(guideTranscript, { id: "T-A", recordingId: "G-A", exhibitId: "A", text: "请注意碗外侧的蓝色波浪纹。" });
  const audio = lesson.sections.find(s => s.id === "audio-and-transcript")!.blocks;
  assert.ok(audio.some(b => b.type === "paragraph" && b.text.includes("输入就只有文字"))); assert.ok(audio.some(b => b.type === "paragraph" && b.text.includes("原始录音") && b.text.includes("核对")));
  const table = lesson.sections.find(s => s.id === "input-output")!.blocks.find(b => b.type === "table")!;
  assert.equal(table.rows.length, 5); assert.deepEqual(table.rows.map(r => r[1]), ["文字消息 → 文字类别", "展品图像 → 一句文字描述", "图片＋文字问题＋登记 → 文字答案", "文字 → 图像", "原始声音 → 文字稿"]);
  assert.deepEqual(taskTranscript.text.split("。").filter(Boolean), ["明天核对投影仪", "请补齐借用日期", "最后清点三脚架"]);
  const answer = exercises[1].solution.join("\n"); for (const action of ["明天核对投影仪", "补齐借用日期", "清点三脚架"]) assert.ok(answer.includes(action));
  for (const boundary of ["原始声音", "输入为文字稿T1", "不能因此认定", "统一模型", "暂不能给日期"]) assert.ok(answer.includes(boundary), boundary);
  assert.ok(blocks.some(b => b.type === "paragraph" && b.text.includes("多模态AI并不全是生成式AI")));
});

test("三目标对应两个去重核心题，提示与完整反馈关闭；图有描述、HTML编号、无装饰与伪播放器", () => {
  assert.deepEqual(lessonExerciseLinks(lesson).map(e => [e.id, e.tier, e.objectives]), [["link-lost-property", "core", [1, 2, 3]], ["analyse-multimodal-services", "core", [1, 2, 3]]]);
  for (const e of exercises) { assert.equal(e.hints.length, 2); assert.equal(e.rubric.length, 4); assert.ok(e.solution.some(s => s.includes("接受"))); assert.ok(e.solution.some(s => s.includes("常见错误")));
    const html = renderToStaticMarkup(createElement(ContentRenderer, { block: e, resources: [] })); assert.equal((html.match(/<details/g) ?? []).length, 3); assert.doesNotMatch(html, /<details[^>]*\sopen/); }
  assert.equal(figures.length, 2);
  for (const f of figures) { const html = htmlFor(f.kind); assert.match(html, /<figure[^>]*aria-labelledby=[^>]*aria-describedby=/); assert.ok(html.includes(f.alt) && html.includes(f.caption)); assert.equal((html.match(/role="img"/g) ?? []).length, 2); assert.doesNotMatch(html, /<text[\s>]|<audio|<video|<button/); }
  assert.ok(blocks.every(b => !["image", "code", "math", "experiment", "downloads"].includes(b.type))); assert.deepEqual(lesson.resources, []);
  assert.ok(lesson.sections.every(s => s.tier === "core" && !/^\d/.test(s.title)));
  for (const link of lesson.prerequisiteLinks) { const [, , courseId, id] = link.href.split("/"); const [lessonId, hash] = id.split("#"); assert.ok(resolveLesson(courseId, lessonId)?.lesson.sections.some(s => s.id === hash), link.href); }
});

test("38旧课全文/清单与224保护文件保持，19幅原图渲染不变，精确逆变换仍拒绝其他修改", () => {
  for (const old of before.lessons) assert.equal(qualityComparableJson(lessonRegistry.get(old.id)), JSON.stringify(old), old.id);
  for (const old of before.publications) assert.deepEqual(beforeQualityRevision(publicationManifest.find(p => p.lessonId === old.lessonId)), old);
  for (const f of before.protectedFiles) assert.ok(matchesProtectedDigest(readFileSync(f.path), f.sha256, f.path), f.path);
  let count = 0;
  for (const old of before.lessons.filter(l => l.courseId === "AI000")) for (const b of old.sections.flatMap(s => s.blocks).filter(b => b.type === "ai-task-figure")) {
    const current = lessonRegistry.get(old.id)!.sections.flatMap(s => s.blocks).find(n => n.type === "ai-task-figure" && n.kind === b.kind)!;
    assert.equal(renderToStaticMarkup(createElement(ContentRenderer, { block: current, resources: [] })), renderToStaticMarkup(createElement(ContentRenderer, { block: b, resources: [] }))); count++;
  }
  assert.equal(count, 19);
  for (const path of ["src/content/models.ts", "src/components/lesson/ai-task-figure.tsx"]) {
    const source = readFileSync(path, "utf8"), digest = before.protectedFiles.find(f => f.path === path)!.sha256;
    assert.notEqual(source, beforeMultimodalExtension(path, source)); assert.equal(matchesProtectedDigest(Buffer.from(source + "\n// undeclared change"), digest, path), false);
  }
});

test("5.3现行r2进度不继承旧38课或历史修订，位置与手动完成可恢复且旧键字节不变", () => {
  const memory = new Map<string, string>(), port = { getItem: (k: string) => memory.get(k) ?? null, setItem: (k: string, v: string) => { memory.set(k, v); } };
  const store = createProgressStore(() => port);
  for (const old of before.lessons) store.save(lessonProgressScope(old), 100, old.sections.at(-1)!.id, true);
  const historical = { ...lessonProgressScope(before.lessons.find(l => l.id === "AI000-C01-L01")!), contentVersion: 1 };
  store.save(historical, 100, historical.sectionIds[0], true);
  const oldKeys = new Map(memory), scope = lessonProgressScope(lesson); assert.equal(progressKey(scope), "aivora:learning:v2:AI000:AI000-C05-L03:r2"); assert.equal(store.getSnapshot(scope), null);
  store.save(scope, 61, "lost-property-task"); const restored = createProgressStore(() => port); assert.equal(parseReadingProgress(restored.getSnapshot(scope), scope)?.section, "lost-property-task"); assert.equal(parseReadingProgress(restored.getSnapshot(scope), scope)?.completed, false);
  restored.save(scope, 100, "takeaways", true); assert.equal(parseReadingProgress(createProgressStore(() => port).getSnapshot(scope), scope)?.completed, true);
  for (const [k, v] of oldKeys) assert.equal(memory.get(k), v);
});

test("5.3清单门禁和相邻导航一致，第六章仍规划无正文", () => {
  const pub = publicationManifest.find(p => p.lessonId === lesson.id)!, course = getLearningCourse("AI000")!;
  assert.equal(course.status, "planned"); assert.equal(pub.reviewEvidence, undefined); assert.equal(lesson.contentVersion, 2);
  assert.equal(Boolean(resolveLesson("AI000", lesson.id)), isReadable(pub));
  if (isReadable(pub)) { assert.equal(getAdjacentLessons(course, "AI000-C05-L02").next?.lessonId, lesson.id); assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "AI000-C05-L02"); assert.equal(getAdjacentLessons(course, lesson.id).next?.lessonId, "AI000-C05-L04"); }
  for (const slot of course.chapters.slice(5).flatMap(c=>c.lessons).filter(l=>l.lessonId>"AI000-C06-L02")) { assert.equal(slot.status, "planned"); assert.equal(slot.href, undefined); assert.equal(lessonRegistry.has(slot.lessonId), false); }
});
