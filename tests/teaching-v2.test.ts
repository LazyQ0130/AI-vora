import test from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { mlV2LessonIds } from "../src/content/course-outline";
import { contentBlockSchema, lessonSchema } from "../src/content/models";
import {
  lessonRegistry,
  getLearningCourse,
  getAdjacentLessons,
  lessonSummaries,
  resolveLesson,
} from "../src/lib/course-engine";
import { findLessonEntries } from "../src/lib/curriculum";
import { summarizeCourseReading } from "../src/lib/course-reading-summary";

test("七节草稿具备先修、分步知识单元、可运行代码、分层提示及独立自查答案，所有公式严格解析", () => {
  for (const id of mlV2LessonIds) {
    const lesson = lessonRegistry.get(id)!;
    assert.ok(lesson);
    assert.ok(lesson.prerequisiteLinks.length > 0);
    assert.ok(lesson.sections.length >= 4);
    const blocks = lesson.sections.flatMap((s) => s.blocks);
    assert.ok(blocks.some((b) => b.type === "summary"));
    assert.ok(blocks.some((b) => b.type === "reading-links"));
    assert.ok(blocks.some((b) => b.type === "code" && b.language === "python"));
    assert.ok(blocks.filter((b) => b.type === "quiz").length >= 2);
    const exercises = blocks.filter((b) => b.type === "exercise");
    assert.ok(exercises.length >= 2);
    for (const exercise of exercises) {
      assert.ok(exercise.hints.length >= 2);
      assert.ok(exercise.solution.length >= 2);
      assert.ok(exercise.rubric.length >= 2);
    }
    for (const block of blocks)
      if (block.type === "math")
        assert.doesNotThrow(
          () =>
            katex.renderToString(block.latex, {
              throwOnError: true,
              strict: "error",
              trust: false,
            }),
          `${id}: ${block.latex}`,
        );
    assert.doesNotMatch(
      JSON.stringify(lesson.sections),
      /Hessian|海森|特征值上界/,
    );
  }
});

test("教材补修与衔接指向真实正文或存在的章级规划", () => {
  for (const id of mlV2LessonIds) {
    const lesson = lessonRegistry.get(id)!;
    const links = [
      ...lesson.prerequisiteLinks,
      ...lesson.sections.flatMap((s) =>
        s.blocks.flatMap((b) => (b.type === "reading-links" ? b.links : [])),
      ),
    ];
    for (const link of links) {
      if (link.href.startsWith("https://")) continue;
      const url = new URL(link.href, "https://aivora.test");
      const parts = url.pathname.split("/");
      if (parts[1] === "learn")
        assert.ok(resolveLesson(parts[2], parts[3]), `${id}: ${link.href}`);
      else {
        const course = getLearningCourse(parts[2]);
        assert.ok(course, link.href);
        if (url.hash)
          assert.ok(
            course.chapters.some((chapter) => chapter.id === url.hash.slice(1)),
            link.href,
          );
      }
    }
  }
});

test("新组件拒绝缺失答案的练习、列数错误表格和重复练习 ID", () => {
  assert.equal(
    contentBlockSchema.safeParse({
      type: "table",
      caption: "表",
      columns: ["一", "二"],
      rows: [["一"]],
    }).success,
    false,
  );
  assert.equal(
    contentBlockSchema.safeParse({
      type: "exercise",
      id: "q",
      title: "题",
      kind: "计算",
      prompt: "问题",
      hints: ["提示"],
      solution: [],
      rubric: ["标准"],
    }).success,
    false,
  );
  const lesson = lessonRegistry.get(mlV2LessonIds[0])!;
  const exercise = lesson.sections
    .flatMap((s) => s.blocks)
    .find((b) => b.type === "exercise")!;
  assert.equal(
    lessonSchema.safeParse({
      ...lesson,
      sections: lesson.sections.map((section, index) =>
        index ? section : { ...section, blocks: [...section.blocks, exercise] },
      ),
    }).success,
    false,
  );
});

test("新版完成率从零开始，旧版读完记录仅保留历史，不抬高新版完成率", () => {
  const legacy = lessonSummaries.find((l) => l.catalogRole === "legacy")!;
  const progress = {
    version: 2 as const,
    courseId: "ML201",
    lessonId: legacy.lessonId,
    contentVersion: 1,
    percent: 100,
    completed: true,
    section: "summary",
    updatedAt: 1,
  };
  const onlyLegacy = summarizeCourseReading(lessonSummaries, [
    { lesson: legacy, progress },
  ]).find((c) => c.courseId === "ML201");
  assert.ok(onlyLegacy);
  assert.equal(onlyLegacy.available, 7);
  assert.equal(onlyLegacy.completed, 0);
  assert.equal(onlyLegacy.percent, 0);
  const first = lessonSummaries.find((l) => l.lessonId === "ML201-C03-L01")!;
  const newRecords = [
    { lesson: legacy, progress },
    {
      lesson: first,
      progress: { ...progress, lessonId: first.lessonId, section: "problem" },
    },
  ];
  const one = summarizeCourseReading(lessonSummaries, newRecords).find(
    (c) => c.courseId === "ML201",
  )!;
  assert.equal(one.completed, 1);
  assert.equal(one.percent, 14);
});

test("内部 ID 与显示顺序分离，规划节无链接；技术开放后上下节自动越过规划内容", () => {
  const course = getLearningCourse("ML201")!;
  const all = course.chapters.flatMap((c) => c.lessons);
  assert.equal(
    all.find((l) => l.lessonId === "ML201-C04-L05")?.displayNumber,
    "4.4",
  );
  assert.equal(all.find((l) => l.displayNumber === "3.4")?.href, undefined);
  assert.equal(all.find((l) => l.displayNumber === "4.5")?.href, undefined);
  const first = all.find((l) => l.displayNumber === "3.1")!;
  assert.ok(first.href);
  assert.equal(
    getAdjacentLessons(course, "ML201-C03-L03").next?.displayNumber,
    "4.1",
  );
  assert.equal(getAdjacentLessons(course, "ML201-C04-L05").next, undefined);
  const match = findLessonEntries("4.3").find((l) => l.courseId === "ML201")!;
  assert.equal(match.lessonId, "ML201-C04-L04");
  assert.equal(match.href, "/learn/ML201/ML201-C04-L04");
});
