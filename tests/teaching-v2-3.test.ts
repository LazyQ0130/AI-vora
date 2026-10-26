import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Lesson } from "../src/content/models";
import { lessonRegistry, resolveLesson } from "../src/lib/course-engine";
import { ArticleContents } from "../src/components/lesson/article-contents";
import { TeachingSection } from "../src/components/lesson/teaching-section";
import { VectorFigure } from "../src/components/lesson/vector-figure";
import { parseReadingProgress, progressKey } from "../src/lib/learning-progress";

const baseline = JSON.parse(readFileSync(new URL("../docs/TEACHING_V2_3_BEFORE.json", import.meta.url), "utf8")) as { lessons: Lesson[] };
const get = (id: string) => resolveLesson("MA101", id)!.lesson;
const core = (lesson: Lesson) => lesson.sections.filter((section) => section.tier === "core").flatMap((section) => section.blocks);

test("V2.3 全部教材 H2 与文章目录只显示标题，保持原 hash 与选中语义", () => {
  for (const lesson of lessonRegistry.values()) {
    const html = renderToStaticMarkup(createElement(ArticleContents, { lesson, active: lesson.sections[0].id, onNavigate: () => {} }));
    assert.match(html, /aria-current="location"/);
    assert.doesNotMatch(html, /<span>\d+<\/span>/);
    for (const section of lesson.sections) {
      assert.ok(html.includes(`href="#${section.id}"`));
      // 此处只查标题/section 外壳；Next Image 与实验正文由真实构建浏览器检查。
      const sectionHtml = renderToStaticMarkup(createElement(TeachingSection, { section: { ...section, blocks: [] }, resources: lesson.resources }));
      assert.ok(sectionHtml.includes(`id="${section.id}"`));
      const heading = sectionHtml.match(/<h2[^>]*>(.*?)<\/h2>/s)?.[1];
      assert.ok(heading, `${lesson.id}#${section.id}`);
      assert.doesNotMatch(heading, /^<span>|^\d+\.\d+\.\d+\s/);
    }
  }
});

test("V2.3 四篇旧书签、练习锚点与 r1 历史仍有效，核心修订隔离旧完成，代码未变", () => {
  for (const before of baseline.lessons) {
    const after = get(before.id);
    assert.equal(after.contentVersion, before.id === "MA101-C02-L03" ? 2 : before.contentVersion);
    assert.deepEqual(after.sections.map((section) => section.id), before.sections.map((section) => section.id));
    const oldBlocks = before.sections.flatMap((section) => section.blocks);
    const newBlocks = after.sections.flatMap((section) => section.blocks);
    for (const exercise of oldBlocks.filter((block) => block.type === "exercise"))
      assert.ok(newBlocks.some((block) => block.type === "exercise" && block.id === exercise.id));
    assert.deepEqual(newBlocks.filter((block) => block.type === "code"), oldBlocks.filter((block) => block.type === "code"));
    const oldScope = { courseId: before.courseId, lessonId: before.id, contentVersion: before.contentVersion, sectionIds: before.sections.map((section) => section.id) };
    const currentScope = { courseId: after.courseId, lessonId: after.id, contentVersion: after.contentVersion, sectionIds: after.sections.map((section) => section.id) };
    assert.equal(progressKey(oldScope), `aivora:learning:v2:MA101:${before.id}:r1`);
    assert.equal(progressKey(currentScope), `aivora:learning:v2:MA101:${before.id}:r${after.contentVersion}`);
    for (const section of before.sections) for (const completed of [false, true]) {
      const raw = JSON.stringify({ version: 2, courseId: before.courseId, lessonId: before.id, contentVersion: 1, percent: completed ? 100 : 47, section: section.id, completed, updatedAt: 1792972800000 });
      const saved = parseReadingProgress(raw, oldScope);
      assert.equal(saved?.completed, completed);
      assert.equal(saved?.percent, completed ? 100 : 47);
      assert.equal(saved?.section, section.id);
      if (after.contentVersion !== before.contentVersion)
        assert.equal(parseReadingProgress(raw, currentScope), null);
      else
        assert.deepEqual(parseReadingProgress(raw, currentScope), saved);
    }
  }
});

test("V2.3 核心验收与拓展隔离；复杂表示和反求倍率不再是基础目标", () => {
  for (const before of baseline.lessons) {
    const lesson = get(before.id);
    const basicExercises = core(lesson).filter((block) => block.type === "exercise");
    const mapped = new Set(lesson.assessmentMap.flatMap((row) => row.exerciseIds));
    assert.deepEqual(mapped, new Set(basicExercises.map((block) => block.id)));
    for (const row of lesson.assessmentMap)
      assert.ok(row.exerciseIds.every((id) => basicExercises.some((block) => block.id === id)));
    for (const block of lesson.sections.flatMap((section) => section.blocks).filter((block) => block.type === "exercise")) {
      assert.equal(block.hints.length, 2);
      assert.ok(block.solution.length && block.rubric.length);
    }
  }
  const representation = get("MA101-C02-L04");
  assert.equal(representation.sections.find((section) => section.id === "application")?.tier, "advanced");
  const basicRepresentation = JSON.stringify(core(representation));
  assert.doesNotMatch(basicRepresentation, /uₙ|uᵢ|bmatrix|库存|每箱/);
  const extension = JSON.stringify(representation.sections.find((section) => section.id === "application"));
  assert.match(extension, /uₙ/); assert.match(extension, /bmatrix/); assert.match(extension, /每箱/);
  const scaling = get("MA101-C02-L06");
  assert.equal(scaling.sections.find((section) => section.id === "application")?.tier, "advanced");
  assert.doesNotMatch(JSON.stringify(core(scaling)), /one-factor|共线|绝对位置|scale-sum/);
  assert.ok(core(scaling).some((block) => block.type === "exercise" && block.id === "scale-explain"));
});

test("V2.3 比例明确按东、北排序，正文、数值表与图注相互对应", () => {
  const lesson = get("MA101-C02-L06");
  const text = lesson.sections.flatMap((section) => section.blocks).filter((block) => block.type === "paragraph").map((block) => block.text).join("\n");
  assert.match(text, /东向分量 : 北向分量 = 3 : 2/);
  assert.match(text, /6 : 4，约简后仍为 3 : 2/);
  assert.doesNotMatch(text, /比例仍为 2:3/);
  const table = lesson.sections.flatMap((section) => section.blocks).find((block) => block.type === "table");
  assert.ok(table && table.rows.some((row) => row[0] === "2" && row[3] === "(6,4)"));
  const svg = renderToStaticMarkup(createElement(VectorFigure, { kind: "scaling" }));
  assert.match(svg, /东向分量 : 北向分量 = 3 : 2/);
  assert.match(svg, /2u = \(6, 4\)/);
});
