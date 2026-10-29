import test from "node:test";
import assert from "node:assert/strict";
import {
  courses,
  filterCourses,
  firstRelease,
  getCourse,
  levels,
  getCoursePreview,
  coursePreviews,
  SAMPLE_URL,
} from "../src/lib/curriculum";
import source from "../curriculum/AI技术课程目录_V1.0.json";

test("适配器保留全部 20 门原始课程，所有状态均为规划", () => {
  assert.equal(courses.length, 20);
  assert.equal(new Set(courses.map((c) => c.id)).size, 20);
  courses.forEach((course, index) => {
    assert.equal(course.status, "planned");
    for (const key of [
      "name",
      "hours",
      "req",
      "goal",
      "chapters",
      "labs",
      "project",
      "accept",
      "priority",
    ] as const)
      assert.deepEqual(course[key], source.courses[index][key]);
  });
  assert.deepEqual(
    levels.map((level) => courses.filter((c) => c.lvl === level).length),
    [1, 4, 3, 3, 7, 2],
  );
});
test("目录搜索支持 ID、中文、空格与组合筛选", () => {
  assert.equal(filterCourses(" ml201 ")[0]?.id, "ML201");
  assert.equal(filterCourses("机器学习", "L2", "机器学习").length, 2);
  assert.equal(filterCourses("", "L2", "机器学习").length, 3);
  assert.equal(filterCourses("NumPy", "L0").length, 0);
  assert.equal(filterCourses("不可能的课程名").length, 0);
  assert.equal(filterCourses("").length, 20);
});
test("首发路线与源文件一致；未知 ID 不回退到真实课程", () => {
  assert.deepEqual(
    firstRelease.map((c) => c.id),
    ["AI000", "PY101", "MA101", "DS101", "ML201"],
  );
  assert.equal(getCourse("unknown"), undefined);
});

test("仅真实演示样章提供直达入口，不能把整门课程标记为已发布", () => {
  assert.deepEqual(Object.keys(coursePreviews).sort(), ["AI000", "MA101", "ML201", "PY101"]);
  assert.equal(getCoursePreview("AI000")?.href, "/learn/AI000/AI000-C01-L01");
  assert.equal(getCourse("AI000")?.status, "planned");
  assert.equal(getCoursePreview("ML201")?.href, SAMPLE_URL);
  assert.equal(getCourse("ML201")?.status, "planned");
  assert.equal(getCoursePreview("PY101")?.href, "/learn/PY101/PY101-C01-L01");
  assert.equal(getCoursePreview("MA101")?.href, "/learn/MA101/MA101-C02-L03");
  assert.equal(getCourse("PY101")?.status, "planned");
  assert.equal(getCoursePreview("unknown"), undefined);
});
