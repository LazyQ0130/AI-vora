import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { lessonRegistry, getLearningCourse, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { programs } from "../src/content/resources/programs";

const dir = "docs/py101-p0";
await mkdir(dir, { recursive: true });
const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const protectedFiles = [
  "next-env.d.ts", "scripts/ai000-r3-compatibility.ts", "src/components/lesson/reader.tsx", "tests/reading-experience.test.ts",
  "curriculum/AI技术课程目录_V1.0.json", "curriculum/AI技术课程体系_V1.0.md", "src/content/lessons/foundations-v2-1.ts",
];
const snapshot = {
  head: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  files: Object.fromEntries(await Promise.all(protectedFiles.map(async path => [path, hash(await readFile(path))]))),
  lessons: Object.fromEntries([...lessonRegistry].filter(([id]) => id !== "PY101-C01-L01").map(([id, lesson]) => [id, hash(JSON.stringify(lesson))])),
  publications: Object.fromEntries(publicationManifest.filter(p => p.lessonId !== "PY101-C01-L01").map(p => [p.lessonId, hash(JSON.stringify(p))])),
  downloads: Object.fromEntries((await Promise.all(Object.values(programs).filter(p => p.filename !== "first_run").flatMap(p => ["py", "ipynb"].map(async ext => {
    const path = `public/downloads/${p.filename}.${ext}`;
    return [path, hash(await readFile(path))];
  }))))),
};
if (process.argv.includes("--baseline")) {
  await writeFile(`${dir}/BASELINE.json`, JSON.stringify(snapshot, null, 2) + "\n", { flag: "wx" });
  await writeFile(`${dir}/BASELINE_STATUS.txt`, execFileSync("git", ["status", "--short"], { encoding: "utf8" }), { flag: "wx" });
  console.log("已保存改前内容/清单/下载及用户文件哈希；不覆盖已有基线。");
} else {
  const before = JSON.parse(await readFile(`${dir}/BASELINE.json`, "utf8"));
  for (const key of ["files", "lessons", "publications", "downloads"] as const) assert.deepEqual(snapshot[key], before[key], `原有 ${key} 发生变化`);
  const course = getLearningCourse("PY101")!;
  assert.equal(course.status, "planned");
  const chapter = course.chapters[0];
  assert.equal(chapter.lessons.length, 6);
  assert.equal(chapter.lessons.filter(l => l.href).length, 1);
  assert.ok(resolveLesson("PY101", "PY101-C01-L01"));
  for (const slot of chapter.lessons.slice(1)) assert.equal(resolveLesson("PY101", slot.lessonId), undefined);
  assert.equal(resolveLesson("AI000", "PY101-C01-L01"), undefined);
  const lesson = lessonRegistry.get("PY101-C01-L01")!;
  const matrix = lesson.objectives.map((objective, index) => ({ objective: index + 1, action: objective, evidence: lesson.assessmentMap.find(row => row.objective === index + 1)!.exerciseIds }));
  await writeFile(`${dir}/COMPATIBILITY.json`, JSON.stringify({ checkedAt: new Date().toISOString(), baseline: before.head, unchanged: { files: Object.keys(snapshot.files), lessonCount: Object.keys(snapshot.lessons).length, publicationCount: Object.keys(snapshot.publications).length, downloadCount: Object.keys(snapshot.downloads).length }, courseStatus: course.status, chapter: chapter.lessons.map(l => ({ id: l.lessonId, number: l.displayNumber, status: l.status, href: l.href ?? null })), matrix }, null, 2) + "\n");
  console.log("原有教材、发布清单、下载与用户修改逐哈希不变；6个蓝图仅1个可读；目标映射已导出。");
}
