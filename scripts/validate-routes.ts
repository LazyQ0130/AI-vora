import { writeFile } from "node:fs/promises";
import { evidencePath } from "./evidence-path";
import { courses } from "../src/lib/curriculum";
import { getLearningCourse } from "../src/lib/course-engine";
import {
  readablePublications,
  lessonHref,
} from "../src/content/publication-manifest";

// 针对实际启动的生产服务；HTTP 证据与交互浏览器验收分开记录。
const base = process.env.AIVORA_BASE_URL ?? "http://127.0.0.1:3001";
const paths: [string, number][] = [
  ...["/", "/courses", "/paths", "/projects", "/dashboard"].map(
    (path) => [path, 200] as [string, number],
  ),
  ...courses.map(
    (course) => [`/courses/${course.id}`, 200] as [string, number],
  ),
  ...readablePublications.map(
    (entry) => [lessonHref(entry), 200] as [string, number],
  ),
  ...courses.flatMap((course) =>
    getLearningCourse(course.id)!.chapters.flatMap((chapter) =>
      chapter.lessons
        .filter((lesson) => !lesson.href)
        .map((lesson) => [lessonHref(lesson), 404] as [string, number]),
    ),
  ),
  ["/courses/unknown", 404],
  ["/learn/ML201/ML201-C99-L01", 404],
  ["/learn/PY101/ML201-C04-L01", 404],
  ["/learn/AI000/AI000-C06-L03", 404],
  ["/learn/AI000/AI000-C07-L03", 404],
  ["/learn/PY101/AI000-C01-L01", 404],
  ["/learn/AI000/AI000-C02-L03", 404],
  ["/learn/PY101/AI000-C02-L01", 404],
];
const results = await Promise.all(
  paths.map(async ([path, expected]) => {
    const response = await fetch(new URL(path, base), {
      signal: AbortSignal.timeout(15000),
    });
    const html = await response.text();
    return {
      path,
      expected,
      actual: response.status,
      passed:
        response.status === expected &&
        (expected !== 404 || html.includes("这里，还没有被探索")),
    };
  }),
);
await writeFile(
  evidencePath("TEACHING_V2_3_ROUTE_RESULTS.json"),
  JSON.stringify(
    { checkedAt: new Date().toISOString(), base, results },
    null,
    2,
  ) + "\n",
);
console.log(
  `${results.filter((r) => r.passed).length}/${results.length} HTTP 路由与规划/错误归属 404 校验通过`,
);
if (results.some((r) => !r.passed)) {
  console.error(results.filter((r) => !r.passed));
  process.exitCode = 1;
}
