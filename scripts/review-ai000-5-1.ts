import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry, getLearningCourse, getAdjacentLessons, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import type { Lesson, Publication } from "../src/content/models";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";
import { beforeVisionExtension } from "./ai000-vision-compatibility";

const dir = "docs/ai000-5-1";
const sha = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const git = (...args: string[]) => execFileSync("git", args, { encoding: "utf8" });
export type NlpBaseline = { base: string; lessons: Lesson[]; publications: Publication[]; protectedFiles: { path: string; sha256: string }[] };
// 基线保留原始字节摘要；其他系统检出文本时，只容许LF/CRLF这一项差异。
export function matchesProtectedDigest(bytes: Buffer, expected: string, path: string) {
  if (sha(bytes) === expected) return true;
  if (!/\.(?:tsx?|css|json|md|py|mjs|ipynb)$/.test(path)) return false;
  const lf = beforeVisionExtension(path, bytes.toString("utf8")).replaceAll("\r\n", "\n");
  return [lf, lf.replaceAll("\n", "\r\n")].some(text => sha(Buffer.from(text)) === expected);
}
// 可供测试读取；仅命令行入口写证据。
if (process.argv[1]?.replaceAll("\\", "/").endsWith("/review-ai000-5-1.ts")) {
  mkdirSync(dir, { recursive: true });
  if (process.argv.includes("--baseline")) {
    const paths = git("ls-files", "-z", "curriculum", "src/content/lessons", "src/content/resources", "src/content/models.ts", "src/components", "src/app", "src/lib", "public").split("\0").filter(p => p && p !== "src/lib/course-engine.ts");
    writeFileSync(`${dir}/BEFORE.json`, JSON.stringify({ base: git("rev-parse", "HEAD").trim(), remote: git("rev-parse", "origin/main").trim(), workspace: git("status", "--short"), lessons: [...lessonRegistry.values()], publications: publicationManifest, protectedFiles: paths.map(path => ({ path, sha256: sha(readFileSync(path)) })) }, null, 2) + "\n", { flag: "wx" });
    console.log(`保存${lessonRegistry.size}节实际教材、原发布清单及${paths.length}个保护文件，独占创建基线`);
  } else {
    const before = JSON.parse(readFileSync(`${dir}/BEFORE.json`, "utf8")) as NlpBaseline;
    for (const old of before.lessons) assert.equal(JSON.stringify(lessonRegistry.get(old.id)), JSON.stringify(old), old.id);
    for (const old of before.publications) assert.deepEqual(publicationManifest.find(p => p.lessonId === old.lessonId), old, old.lessonId);
    for (const file of before.protectedFiles) assert.ok(matchesProtectedDigest(readFileSync(file.path), file.sha256, file.path), file.path);
    assert.equal(lessonRegistry.size, before.lessons.length + 1);
    const lesson = lessonRegistry.get("AI000-C05-L01")!;
    const publication = publicationManifest.find(p => p.lessonId === lesson.id)!;
    assert.equal(lesson.contentVersion, 1);
    assert.equal(publication.contentVersion, 1);
    const course = getLearningCourse("AI000")!;
    assert.equal(course.status, "planned");
    for (const slot of course.chapters[4].lessons.slice(1)) {
      assert.equal(slot.status, "planned"); assert.equal(slot.href, undefined); assert.equal(lessonRegistry.has(slot.lessonId), false);
    }
    const final = process.argv.includes("--final");
    if (final) {
      assert.equal(publication.status, "pending-review"); assert.equal(publication.access, "preview"); assert.equal(publication.reviewEvidence, undefined);
      assert.ok(resolveLesson("AI000", lesson.id));
      assert.equal(getAdjacentLessons(course, "AI000-C04-L04").next?.lessonId, lesson.id);
      assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "AI000-C04-L04");
      assert.equal(getAdjacentLessons(course, lesson.id).next, undefined);
    } else {
      assert.equal(publication.status, "draft"); assert.equal(publication.access, "private"); assert.equal(resolveLesson("AI000", lesson.id), undefined);
    }
    writeFileSync(`${dir}/${final ? "FINAL" : "DRAFT"}_CHECK.json`, JSON.stringify({ checkedAt: new Date().toISOString(), base: before.base, unchangedOldLessons: before.lessons.length, unchangedPublications: before.publications.length, protectedFileCount: before.protectedFiles.length, preservedPreciseFigures: before.lessons.filter(l => l.courseId === "AI000").flatMap(l => l.sections.flatMap(s => s.blocks)).filter(b => b.type === "ai-task-figure").length, publication, assessmentMap: lesson.assessmentMap, plannedChapterFive: course.chapters[4].lessons.slice(1).map(s => s.lessonId) }, null, 2) + "\n");
    writeFileSync(`${dir}/LESSON.json`, JSON.stringify(lesson, null, 2) + "\n");
    if (final) writeFileSync(`${dir}/TIME_ESTIMATE.json`, JSON.stringify(getCourseStudyEstimate("AI000"), null, 2) + "\n");
    console.log(`${final ? "预览" : "私有草稿"}核验通过，${before.lessons.length}旧教材及全部原发布记录/保护文件不变`);
  }
}
