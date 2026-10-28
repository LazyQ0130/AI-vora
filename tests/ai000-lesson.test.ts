import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getAdjacentLessons, lessonRegistry, lessonSummaries, resolveLesson } from "../src/lib/course-engine";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { contentBlockSchema } from "../src/content/models";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { summarizeCourseReading } from "../src/lib/course-reading-summary";
import { mailExamples, keywordMailDecision } from "../src/content/lessons/ai000/mail-example";

const resolved = resolveLesson("AI000", "AI000-C01-L01")!;
const lesson = resolved.lesson;
const blocks = lesson.sections.flatMap((section) => section.blocks);

test("AI000 1.1 r2保留七章规划，相邻导航由1.2承接", () => {
  assert.equal(resolved.publication.status, "pending-review");
  assert.equal(resolved.publication.access, "preview");
  assert.equal(resolved.publication.reviewEvidence, undefined);
  assert.equal(resolved.course.status, "planned");
  assert.equal(resolved.course.chapters.length, 7);
  const entries = resolved.course.chapters.flatMap((chapter) => chapter.lessons);
  assert.equal(entries.length, 24);
  assert.equal(entries.filter(e => e.href).length, 18);
  assert.equal(entries[0].displayNumber, "1.1");
  assert.equal(entries[0].href, "/learn/AI000/AI000-C01-L01");
  assert.equal(getAdjacentLessons(resolved.course, lesson.id).next?.lessonId, "AI000-C01-L02");
  assert.equal(getAdjacentLessons(resolved.course, lesson.id).previous, undefined);
  assert.equal(resolveLesson("AI000", "AI000-C05-L05")?.lesson.contentVersion, 1);
  assert.equal(resolveLesson("AI000", "AI000-C06-L01"), undefined);
  assert.equal(resolveLesson("AI000", "AI000-C07-L03"), undefined);
  assert.equal(resolveLesson("PY101", lesson.id), undefined);
});

test("L0 核心考核覆盖三个目标，且无需代码、公式、实验或隐藏先修", () => {
  assert.deepEqual(lesson.assessmentMap, [
    { objective: 1, exerciseIds: ["describe-task"] },
    { objective: 2, exerciseIds: ["describe-task","design-task"] },
    { objective: 3, exerciseIds: ["design-task"] },
  ]);
  assert.deepEqual(lesson.learningTime.coding, [0, 0]);
  assert.equal(lesson.resources.length, 0);
  assert.ok(blocks.every((block) => !["code", "math", "downloads", "experiment"].includes(block.type)));
  const exercises = blocks.filter((block) => block.type === "exercise");
  assert.equal(exercises.length, 2);
  for (const exercise of exercises) {
    assert.equal(lesson.sections.find((section) => section.blocks.includes(exercise))?.tier, "core");
    assert.equal(exercise.hints.length, 2);
    assert.ok(exercise.solution.some((step) => step.includes("常见错误")));
    const html = renderToStaticMarkup(createElement(ContentRenderer, { block: exercise, resources: [] }));
    assert.equal((html.match(/<details/g) ?? []).length, 3);
    assert.doesNotMatch(html, /<details[^>]*\sopen/);
  }
});

test("邮件规则逐封核对独立预期，图示经通用渲染器呈现两种误判与可访问说明", () => {
  assert.deepEqual(mailExamples.map((mail) => keywordMailDecision(mail.subject)), ["垃圾", "垃圾", "正常", "正常"]);
  assert.deepEqual(mailExamples.map((mail) => mail.expected), ["垃圾", "正常", "正常", "垃圾"]);
  assert.deepEqual(mailExamples.map((mail) => keywordMailDecision(mail.subject) === mail.expected), [true, false, true, false]);
  const figures = blocks.filter((block) => block.type === "ai-task-figure");
  for (const figure of figures) {
    const html = renderToStaticMarkup(createElement(ContentRenderer, { block: figure, resources: [] }));
    assert.match(html, /<figure[^>]*aria-labelledby="[^"]+"[^>]*aria-describedby="[^"]+"/);
    assert.ok(html.includes(figure.alt));
    assert.ok(html.includes(figure.caption));
    if (figure.kind === "mail-outcomes") {
      assert.match(html, /误拦正常邮件/);
      assert.match(html, /漏掉垃圾邮件/);
      assert.equal((html.match(/判断正确<\/span>/g) ?? []).length, 2);
    }
  }
  assert.equal(contentBlockSchema.safeParse({ ...figures[0], kind: "arbitrary-javascript" }).success, false);
});

test("AI000 阅读作用域独立，保存/恢复和标记读完不改写 MA、PY、ML 既有记录", () => {
  const memory = new Map<string, string>();
  const storage = { getItem: (key: string) => memory.get(key) ?? null, setItem: (key: string, value: string) => { memory.set(key, value); } };
  const store = createProgressStore(() => storage);
  for (const id of ["MA101-C02-L03", "PY101-C05-L01", "ML201-C04-L04"]) {
    const scope = lessonProgressScope(lessonRegistry.get(id)!);
    store.save(scope, 100, scope.sectionIds[0], true);
  }
  const existing = new Map(memory);
  const scope = lessonProgressScope(lesson);
  assert.equal(store.getSnapshot(scope), null);
  store.save(scope, 100, "practice");
  assert.equal(parseReadingProgress(store.getSnapshot(scope), scope)?.completed, false);
  const restored = createProgressStore(() => storage);
  assert.equal(parseReadingProgress(restored.getSnapshot(scope), scope)?.section, "practice");
  restored.save(scope, 100, "takeaways", true);
  const saved = parseReadingProgress(restored.getSnapshot(scope), scope)!;
  assert.equal(saved.completed, true);
  assert.equal(progressKey(scope), "aivora:learning:v2:AI000:AI000-C01-L01:r2");
  for (const [key, bytes] of existing) assert.equal(memory.get(key), bytes);
  const summary = lessonSummaries.find((entry) => entry.lessonId === lesson.id)!;
  const courses = summarizeCourseReading(lessonSummaries, [{ lesson: summary, progress: saved }]);
  assert.ok(courses.some((course) => course.courseId === "AI000"));
  assert.equal(resolved.course.status, "planned");
});
