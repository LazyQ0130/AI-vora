import test from "node:test";
import assert from "node:assert/strict";
import {
  chapterNumber,
  lessonNumber,
  sectionNumber,
  cleanOutlineTitle,
} from "../src/lib/course-numbering";
import { getCourseDirectory } from "../src/lib/course-directory";
import { courses, getCourse } from "../src/lib/curriculum";

test("P1：章/节/独立知识单元编号不依赖内部 ID，不带补零", () => {
  assert.equal(chapterNumber(4), "第 4 章");
  assert.equal(lessonNumber(4, 3), "4.3");
  assert.equal(sectionNumber(4, 3, 2), "4.3.2");
  for (const value of [0, -1, NaN, 1.5])
    assert.throws(() => chapterNumber(value), RangeError);
});
test("P1：显示层消除重复序号，保留技术术语和原始数据", () => {
  assert.equal(cleanOutlineTitle("第 03 章 03 线性回归"), "线性回归");
  assert.equal(cleanOutlineTitle("03 线性回归"), "线性回归");
  assert.equal(cleanOutlineTitle("3.2 模型与参数"), "模型与参数");
  assert.equal(cleanOutlineTitle("3D 卷积与视觉"), "3D 卷积与视觉");
  for (const course of courses) {
    const original = [...course.chapters];
    const directory = getCourseDirectory(course);
    assert.equal(directory.chapters.length, original.length);
    directory.chapters.forEach((chapter, index) => {
      assert.equal(chapter.order, index + 1);
      assert.doesNotMatch(chapter.title, /^\d+\s/);
    });
    assert.deepEqual(course.chapters, original);
  }
});
test("P1：ML 课时按显示顺序排列，旧综合样章独立，规划节没有空白路由", () => {
  const directory = getCourseDirectory(getCourse("ML201")!);
  assert.deepEqual(
    directory.chapters[2].lessons.map((l) => l.displayNumber),
    ["3.1", "3.2", "3.3", "3.4"],
  );
  assert.deepEqual(
    directory.chapters[3].lessons.map((l) => l.displayNumber),
    ["4.1", "4.2", "4.3", "4.4", "4.5", "4.6"],
  );
  assert.equal(
    directory.chapters[3].lessons.find((l) => l.lessonId === "ML201-C04-L05")
      ?.displayNumber,
    "4.4",
  );
  assert.ok(
    directory.legacyLessons.some((l) => l.lessonId === "ML201-C04-L01"),
  );
  const planned = directory.chapters[2].lessons[3];
  assert.equal(planned.status, "planned");
  assert.equal(planned.href, undefined);
});
