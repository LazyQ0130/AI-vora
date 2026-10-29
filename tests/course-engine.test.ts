import test from "node:test";
import assert from "node:assert/strict";
import {
  getLearningCourse,
  getAdjacentLessons,
  resolveLesson,
  validateRegistry,
  lessonRegistry,
} from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import {
  contentBlockSchema,
  lessonSchema,
  publicationSchema,
  isReadable,
} from "../src/content/models";
import { sampleLesson } from "../src/content/sample";

test("课程引擎保留规划章节，真实教材按课程和章节关联", () => {
  for (const entry of publicationManifest) {
    const resolved = resolveLesson(entry.courseId, entry.lessonId);
    if (!isReadable(entry)) {
      assert.equal(resolved, undefined);
      assert.equal(entry.access, "private");
      assert.ok(lessonRegistry.has(entry.lessonId));
      continue;
    }
    assert.ok(resolved);
    assert.equal(resolved.chapter.id, entry.chapterId);
    assert.equal(resolved.course.status, "planned");
    assert.ok(
      entry.catalogRole === "legacy"
        ? resolved.course.legacyLessons.some(
            (l) => l.lessonId === entry.lessonId,
          )
        : resolved.chapter.lessons.some((l) => l.lessonId === entry.lessonId),
    );
  }
  assert.equal(getLearningCourse("unknown"), undefined);
  assert.equal(resolveLesson("PY101", sampleLesson.id), undefined);
  assert.equal(resolveLesson("ML201", "ML201-C04-L99"), undefined);
  assert.deepEqual(
    lessonRegistry.get(sampleLesson.id)!.sections.map((s) => s.id),
    sampleLesson.sections.map((s) => s.id),
  );
});
test("发布权限拒绝无证据发布和草稿试读；未审核不得正式发布", () => {
  const base = publicationManifest.find(isReadable)!;
  for (const status of [
    "draft",
    "pending-validation",
    "planned",
    "deprecated",
  ] as const) {
    assert.equal(
      publicationSchema.safeParse({ ...base, status, access: "preview" })
        .success,
      false,
    );
    assert.equal(isReadable({ ...base, status, access: "private" }), false);
  }
  assert.equal(
    publicationSchema.safeParse({
      ...base,
      status: "published",
      access: "public",
    }).success,
    false,
  );
  assert.equal(
    publicationSchema.safeParse({ ...base, technicalEvidence: undefined })
      .success,
    false,
  );
  assert.equal(
    publicationSchema.safeParse({
      ...base,
      status: "published",
      access: "public",
      reviewEvidence: "review/approved.md",
    }).success,
    true,
  );
});
test("统一内容校验拒绝重复段落、无解析题目、任意实验和远程下载", () => {
  const lesson = lessonRegistry.get(sampleLesson.id)!;
  assert.equal(
    lessonSchema.safeParse({
      ...lesson,
      sections: [...lesson.sections, lesson.sections[0]],
    }).success,
    false,
  );
  assert.equal(
    contentBlockSchema.safeParse({
      type: "experiment",
      kind: "arbitrary-javascript",
    }).success,
    false,
  );
  assert.equal(
    contentBlockSchema.safeParse({
      type: "quiz",
      id: "q",
      question: "问题",
      options: ["A", "B"],
      correct: 2,
      explanations: ["A"],
    }).success,
    false,
  );
  assert.equal(
    contentBlockSchema.safeParse({
      type: "image",
      src: "https://example.com/image.png",
      alt: "图片",
      caption: "图",
      width: 10,
      height: 10,
    }).success,
    false,
  );
  assert.throws(
    () =>
      validateRegistry(
        [...publicationManifest, publicationManifest[0]],
        [...lessonRegistry.values()],
      ),
    /重复/,
  );
  assert.throws(
    () =>
      validateRegistry(
        [{ ...publicationManifest[0], chapterId: "ML201-C99" }],
        [...lessonRegistry.values()],
      ),
    /无效/,
  );
});
test("相邻导航仅使用同课程真实可读教材，并按章节与课时顺序排列", () => {
  const course = getLearningCourse("ML201")!;
  const legacy = publicationManifest.find((e) => e.catalogRole === "legacy" && e.courseId === "ML201")!;
  const base = {
    ...legacy,
    catalogRole: "current" as const,
    displayNumber: "4.1",
  };
  const next = {
    ...base,
    lessonId: "ML201-C04-L02",
    order: 2,
    title: "测试夹具",
    displayNumber: "4.2",
  };
  const fixture = {
    ...course,
    chapters: course.chapters.map((ch) =>
      ch.id === base.chapterId ? { ...ch, lessons: [base, next] } : ch,
    ),
  };
  assert.equal(
    getAdjacentLessons(fixture, base.lessonId).next?.lessonId,
    next.lessonId,
  );
  assert.equal(
    getAdjacentLessons(fixture, next.lessonId).previous?.lessonId,
    base.lessonId,
  );
  assert.equal(getAdjacentLessons(course, legacy.lessonId).next, undefined);
  assert.deepEqual(getAdjacentLessons(course, "unknown"), {});
});
