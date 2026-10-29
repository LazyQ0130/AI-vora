import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { lessonRegistry, getLearningCourse, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";

const dir = "docs/py101-p2", id = "PY101-C01-L03";
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
  await writeFile(`${dir}/BASELINE_LESSONS.json`, JSON.stringify({ lesson: lessonRegistry.get("PY101-C01-L01"), publication: publicationManifest.find(p => p.lessonId === "PY101-C01-L01") }, null, 2) + "\n", { flag: "wx" });
  await writeFile(`${dir}/BASELINE_STATUS.txt`, execFileSync("git", ["status", "--short"], { encoding: "utf8" }), { flag: "wx" });
  console.log("P2改前49课、发布、历史文件与授权旧状态句原对象已留存。");
} else if (process.argv.includes("--draft")) {
  const entry = publicationManifest.find(p => p.lessonId === id)!;
  assert.equal(entry.status, "draft"); assert.equal(entry.access, "private");
  assert.equal(resolveLesson("PY101", id), undefined);
  assert.ok(lessonRegistry.has(id));
  await writeFile(`${dir}/DRAFT_GATE.json`, JSON.stringify({ checkedAt: new Date().toISOString(), lesson: id, status: entry.status, access: entry.access, registered: true, readable: false }, null, 2) + "\n");
  console.log("draft/private已注册但不可读。");
} else {
  const before = JSON.parse(await readFile(`${dir}/BASELINE.json`, "utf8"));
  const plan = JSON.parse(await readFile(`${dir}/APPROVED_CHANGES.json`, "utf8"));
  for (const [path, digest] of Object.entries(before.files)) {
    const bytes = await readFile(path), entry = plan.sources.find((s: { path: string }) => s.path === path);
    if (sha(bytes) === digest) continue;
    assert.ok(entry && sha(bytes.toString("utf8").replaceAll("\r\n", "\n")) === entry.afterSha256 && sha(entry.before) === digest, path);
  }
  for (const key of ["lessons", "publications"] as const) {
    assert.deepEqual(Object.keys(snapshot[key]).sort(), Object.keys(before[key]).sort());
    for (const [keyId, digest] of Object.entries(before[key])) {
      if (snapshot[key][keyId] === digest) continue;
      const entry = plan[key].find((e: { id: string }) => e.id === keyId);
      assert.ok(entry && sha(JSON.stringify(entry.before)) === digest && snapshot[key][keyId] === entry.afterSha256, keyId);
    }
  }
  const course = getLearningCourse("PY101")!;
  assert.equal(course.status, "planned"); assert.ok(resolveLesson("PY101", id));
  for (const slot of course.chapters[0].lessons.slice(3)) assert.equal(resolveLesson("PY101", slot.lessonId), undefined);
  await writeFile(`${dir}/COMPATIBILITY.json`, JSON.stringify({ checkedAt: new Date().toISOString(), baseline: before.head, protectedFiles: Object.keys(before.files).length, previousLessons: Object.keys(before.lessons).length, previousPublications: Object.keys(before.publications).length, changedOldLessons: plan.lessons.map((e: { id: string }) => e.id), addedLesson: id, firstLessonVersion: lessonRegistry.get("PY101-C01-L01")!.contentVersion, courseStatus: course.status, chapter: course.chapters[0].lessons.map(l => ({ id: l.lessonId, status: l.status, href: l.href ?? null })) }, null, 2) + "\n");
  console.log("P2兼容通过：仅授权状态段与证据引用变化，其他旧内容不变，1.4–1.6仍规划。");
}
