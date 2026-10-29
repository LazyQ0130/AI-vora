import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { lessonRegistry, getLearningCourse, resolveLesson, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";

const dir = "docs/py101-p1", id = "PY101-C01-L02";
await mkdir(dir, { recursive: true });
const sha = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const paths = execFileSync("git", ["ls-files", "-z", "--", "docs", "curriculum", "public/downloads", "src/content/lessons", "src/content/resources", "src/lib/learning-progress.ts", "src/lib/use-learning-progress.ts", "src/content/course-outline.ts"], { encoding: "utf8" }).split("\0").filter(Boolean);
paths.push("next-env.d.ts", "scripts/ai000-r3-compatibility.ts", "src/components/lesson/reader.tsx", "tests/reading-experience.test.ts");
const snapshot = {
  head: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  files: Object.fromEntries(await Promise.all([...new Set(paths)].map(async path => [path, sha(await readFile(path))]))),
  lessons: Object.fromEntries([...lessonRegistry].filter(([key]) => key !== id).map(([key, value]) => [key, sha(JSON.stringify(value))])),
  publications: Object.fromEntries(publicationManifest.filter(p => p.lessonId !== id).map(p => [p.lessonId, sha(JSON.stringify(p))])),
};
if (process.argv.includes("--baseline")) {
  await writeFile(`${dir}/BASELINE.json`, JSON.stringify(snapshot, null, 2) + "\n", { flag: "wx" });
  await writeFile(`${dir}/BASELINE_STATUS.txt`, execFileSync("git", ["status", "--short"], { encoding: "utf8" }), { flag: "wx" });
  console.log("P1改前教材、清单、历史文档/下载、原始体系与用户修改哈希已保存。");
} else {
  const before = JSON.parse(await readFile(`${dir}/BASELINE.json`, "utf8"));
  // 只检查基线文件，允许本轮新增文件；不把未来新增当作旧文件静默略过。
  for (const [path, digest] of Object.entries(before.files)) assert.equal(sha(await readFile(path)), digest, path);
  assert.deepEqual(snapshot.lessons, before.lessons, "旧Lesson不变，且只允许增加指定1.2");
  assert.deepEqual(snapshot.publications, before.publications, "旧Publication不变，且只允许增加指定1.2");
  const course = getLearningCourse("PY101")!, current = resolveLesson("PY101", id)!;
  assert.ok(current); assert.equal(course.status, "planned");
  assert.equal(current.lesson.contentVersion, 1);
  const firstChapter = course.chapters[0];
  for (const slot of firstChapter.lessons.slice(2)) assert.equal(resolveLesson("PY101", slot.lessonId), undefined);
  assert.equal(getAdjacentLessons(course, "PY101-C01-L01").next?.lessonId, id);
  assert.equal(getAdjacentLessons(course, id).previous?.lessonId, "PY101-C01-L01");
  await writeFile(`${dir}/COMPATIBILITY.json`, JSON.stringify({ checkedAt: new Date().toISOString(), baseline: before.head, unchanged: { files: Object.keys(before.files).length, lessons: Object.keys(before.lessons).length, publications: Object.keys(before.publications).length }, allowedNewLesson: id, courseStatus: course.status, chapter: firstChapter.lessons.map(p => ({ id: p.lessonId, status: p.status, href: p.href ?? null })), assessmentMap: current.lesson.assessmentMap }, null, 2) + "\n");
  console.log("旧教材/发布/文件哈希保持；只增加1.2；1.3–1.6不可读，1.1↔1.2正确衔接。");
}
