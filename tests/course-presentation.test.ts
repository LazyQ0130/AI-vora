import test from "node:test";
import assert from "node:assert/strict";
import { courses, filterCourses } from "../src/lib/curriculum";
import { learningPaths, branches } from "../src/lib/paths";
import { formatCourseReferences, getCourseDisplayName } from "../src/lib/course-presentation";

test("学员名称覆盖编号引用，并可直接用于搜索课程", () => {
  for (const course of courses) {
    assert.notEqual(getCourseDisplayName(course.id), course.id);
    assert.ok(filterCourses(getCourseDisplayName(course.id)).some(item => item.id === course.id));
    assert.doesNotMatch(formatCourseReferences(course.req), /\b[A-Z]{2,3}\d{3}\b/);
  }
  for (const item of [...learningPaths, ...branches]) {
    assert.doesNotMatch(formatCourseReferences(item.note), /\b[A-Z]{2,3}\d{3}\b/);
  }
});

test("展示先修名称时保留章节范围、同步补修条件与原始数据", () => {
  const course = courses.find(c => c.id === "ML201")!;
  const original = course.req;
  const shown = formatCourseReferences(original);
  assert.match(shown, /《Python 编程》/);
  assert.match(shown, /《概率统计与优化》\s*第 1–6 章可同步补足/);
  for (const item of courses) {
    const ranges = item.req.replace(/\b[A-Z]{2,3}\d{3}\b/g, "").match(/\d+(?:–\d+)?/g);
    assert.deepEqual(formatCourseReferences(item.req).match(/\d+(?:–\d+)?/g), ranges);
  }
  assert.equal(course.req, original);
});
