import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ContentRenderer } from "../src/components/lesson/content-renderer";
import { lessonRegistry, resolveLesson, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationSchema, isReadable } from "../src/content/models";
import { createProgressStore, parseReadingProgress, progressKey } from "../src/lib/learning-progress";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { lessonExerciseLinks } from "../src/lib/lesson-exercises";

const resolved = resolveLesson("AI000", "AI000-C02-L01")!;
const lesson = lessonRegistry.get("AI000-C02-L01")!;

test("2.1 通过现有蓝图与清单承接 1.1，草稿不可读、预览没有虚构下一节", () => {
  assert.ok(resolved);
  assert.equal(resolved.publication.status, "pending-review");
  assert.equal(resolved.publication.reviewEvidence, undefined);
  assert.equal(resolved.course.status, "planned");
  assert.equal(resolved.chapter.order, 2);
  assert.equal(resolved.chapter.lessons[0].displayNumber, "2.1");
  assert.equal(getAdjacentLessons(resolved.course, "AI000-C01-L01").next?.lessonId, lesson.id);
  assert.equal(getAdjacentLessons(resolved.course, lesson.id).previous?.lessonId, "AI000-C01-L01");
  assert.equal(getAdjacentLessons(resolved.course, lesson.id).next, undefined);
  assert.equal(resolveLesson("AI000", "AI000-C02-L02"), undefined);
  assert.equal(resolveLesson("PY101", lesson.id), undefined);
  const draft = publicationSchema.parse({ ...resolved.publication, status: "draft", access: "private", technicalEvidence: undefined });
  assert.equal(isReadable(draft), false);
  assert.equal(publicationSchema.safeParse({ ...draft, access: "preview" }).success, false);
  assert.equal(publicationSchema.safeParse({ ...draft, status: "pending-review", access: "preview" }).success, false);
});

test("关系图的内外范围使用真嵌套，任务对照呈现相同方法与不同任务，均经通用渲染器", () => {
  const figures = lesson.sections.flatMap((section) => section.blocks).filter((block) => block.type === "ai-task-figure");
  assert.deepEqual(figures.map((block) => block.kind), ["method-hierarchy", "method-and-task"]);
  for (const figure of figures) {
    const html = renderToStaticMarkup(createElement(ContentRenderer, { block: figure, resources: [] }));
    assert.match(html, /<figure[^>]*aria-labelledby="[^"]+"[^>]*aria-describedby="[^"]+"/);
    assert.ok(html.includes(figure.alt));
    assert.ok(html.includes(figure.caption));
    if (figure.kind === "method-hierarchy") {
      assert.match(html, /data-ai-scope="ai"[\s\S]*data-ai-scope="ml"[\s\S]*data-ai-scope="dl"/);
      assert.match(html, /AI 内、ML 外/);
      assert.match(html, /ML 内、DL 外/);
      assert.equal((html.match(/data-ai-scope=/g) ?? []).length, 3);
    } else {
      assert.equal((html.match(/<dd>深度学习/g) ?? []).length, 2);
      assert.match(html, /分类：选择所属类别/);
      assert.match(html, /生成：组织新的图像内容/);
    }
  }
});

test("三个目标绑定真实核心开放题，展示目标与正式原文对应，解答默认折叠", () => {
  const links = lessonExerciseLinks(lesson);
  assert.deepEqual(links.map((link) => [link.id, link.objectives]), [["draw-method-map", [1]], ["classify-new-systems", [2, 3]]]);
  assert.equal(lesson.objectiveDisplay?.length, 3);
  for (const display of lesson.objectiveDisplay ?? []) assert.ok(lesson.objectives.includes(display.objective));
  for (const section of lesson.sections) {
    assert.equal(section.tier, "core");
    for (const block of section.blocks.filter((block) => block.type === "exercise")) {
      const html = renderToStaticMarkup(createElement(ContentRenderer, { block, resources: [] }));
      assert.equal((html.match(/<details/g) ?? []).length, 3);
      assert.doesNotMatch(html, /<details[^>]*\sopen/);
      assert.ok(html.includes(`id="exercise-${block.id}"`));
    }
  }
});

test("2.1 阅读 100% 不等于完成，刷新恢复与手动读完使用新键而保持 1.1 和其他课程记录", () => {
  const memory = new Map<string, string>();
  const storage = { getItem: (key: string) => memory.get(key) ?? null, setItem: (key: string, value: string) => { memory.set(key, value); } };
  const store = createProgressStore(() => storage);
  for (const id of ["AI000-C01-L01", "MA101-C02-L03", "PY101-C05-L01", "ML201-C04-L04"]) {
    const scope = lessonProgressScope(lessonRegistry.get(id)!);
    store.save(scope, 100, scope.sectionIds[0], true);
  }
  const existing = new Map(memory);
  const scope = lessonProgressScope(lesson);
  assert.equal(store.getSnapshot(scope), null);
  store.save(scope, 100, "practice");
  const restored = createProgressStore(() => storage);
  assert.equal(parseReadingProgress(restored.getSnapshot(scope), scope)?.completed, false);
  assert.equal(parseReadingProgress(restored.getSnapshot(scope), scope)?.section, "practice");
  restored.save(scope, 100, "takeaways", true);
  assert.equal(parseReadingProgress(restored.getSnapshot(scope), scope)?.completed, true);
  assert.equal(progressKey(scope), "aivora:learning:v2:AI000:AI000-C02-L01:r1");
  for (const [key, bytes] of existing) assert.equal(memory.get(key), bytes);
});
