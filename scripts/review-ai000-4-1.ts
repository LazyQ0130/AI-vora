import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import type { Lesson, Publication } from "../src/content/models";
import { evidencePath } from "./evidence-path";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";

const digest = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const fileHash = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const baseline = evidencePath("BEFORE.json");
if (process.argv.includes("--baseline")) {
  const protectedPaths = [
    "curriculum/AI技术课程体系_V1.0.md", "curriculum/AI技术课程目录_V1.0.json",
    "src/content/ai000-outline.ts",
    ...["supervised-learning.ts", "unsupervised-learning.ts", "self-supervised-learning.ts", "reinforcement-learning.ts", "parcel-example.ts", "borrowing-example.ts", "self-supervised-example.ts", "delivery-example.ts"].map(p => "src/content/lessons/ai000/" + p),
    ...["ai-supervised-figure.tsx", "ai-borrowing-figure.tsx", "ai-self-supervised-figure.tsx", "ai-reinforcement-figure.tsx", "reader.tsx", "learning-support.tsx", "content-renderer.tsx"].map(p => "src/components/lesson/" + p),
    "src/lib/learning-progress.ts", "src/lib/use-learning-progress.ts",
  ];
  writeFileSync(baseline, JSON.stringify({
    base: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
    remote: execFileSync("git", ["rev-parse", "origin/main"], { encoding: "utf8" }).trim(),
    workspace: execFileSync("git", ["status", "--short"], { encoding: "utf8" }),
    lessons: [...lessonRegistry.values()], publications: publicationManifest,
    protectedFiles: protectedPaths.map(path => ({ path, hash: fileHash(path) })),
  }, null, 2) + "\n", { flag: "wx" });
  console.log(`${lessonRegistry.size}节原注册全文、清单与受保护文件已独占保存`);
} else {
  const before = JSON.parse(readFileSync(baseline, "utf8")) as { lessons: Lesson[]; publications: Publication[]; protectedFiles: { path: string; hash: string }[] };
  for (const old of before.lessons) assert.equal(digest(lessonRegistry.get(old.id)), digest(old), old.id);
  for (const old of before.publications) assert.deepEqual(publicationManifest.find(p => p.lessonId === old.lessonId), old, old.lessonId);
  for (const f of before.protectedFiles) assert.equal(fileHash(f.path), f.hash, f.path);
  const lesson = lessonRegistry.get("AI000-C04-L01")!;
  assert.ok(lesson);
  assert.equal(lesson.contentVersion, 1);
  const exercises = lesson.sections.flatMap(s => s.blocks).filter(b => b.type === "exercise");
  assert.equal(exercises.length, 2);
  for (const ex of exercises) {
    assert.equal(ex.hints.length, 2);
    assert.ok(ex.solution.some(s => s.includes("常见错误")));
    assert.ok(ex.rubric.length >= 3);
  }
  const course = getLearningCourse("AI000")!;
  const final = process.argv.includes("--final");
  if (final) {
    assert.equal(course.chapters.flatMap(c => c.lessons).filter(l => l.href).length, 10);
    assert.equal(getAdjacentLessons(course, "AI000-C03-L04").next?.lessonId, lesson.id);
    assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "AI000-C03-L04");
    assert.equal(getAdjacentLessons(course, lesson.id).next, undefined);
    assert.equal(resolveLesson("AI000", lesson.id)?.publication.status, "pending-review");
  } else {
    assert.equal(resolveLesson("AI000", lesson.id), undefined);
    assert.equal(publicationManifest.find(p => p.lessonId === lesson.id)?.status, "draft");
  }
  for (const slot of course.chapters.flatMap(c => c.lessons).filter(l => l.lessonId > "AI000-C04-L01")) {
    assert.equal(slot.href, undefined);
    assert.equal(lessonRegistry.has(slot.lessonId), false);
  }
  const stage = final ? "FINAL" : "DRAFT";
  const time = getCourseStudyEstimate("AI000")!;
  const totals = ["reading", "practice", "project"].map(key => time.lessons.reduce((sum, l) => {
    const range = l[key as "reading" | "practice" | "project"];
    return [sum[0] + range[0], sum[1] + range[1]];
  }, [0, 0]));
  assert.deepEqual(totals, [[282, 427], [253, 404], [35, 55]]);
  assert.deepEqual(time.totalMinutes, [570, 886]);
  writeFileSync(evidencePath("TIME_ESTIMATE.json"), JSON.stringify({ basis: time.basis, includesPlannedLessons: true, lessons: time.lessons, reading: totals[0], practice: totals[1], project: totals[2], totalMinutes: time.totalMinutes, hours: time.hours, reason: "4.1两道独立开放题练习由8–14改为16–24分钟；非学生实测" }, null, 2) + "\n");
  writeFileSync(evidencePath(stage + "_CHECK.json"), JSON.stringify({ checkedAt: new Date().toISOString(), unchangedLessons: before.lessons.length, unchangedPublications: before.publications.length, protectedFilesUnchanged: true, objectives: lesson.assessmentMap, publication: publicationManifest.find(p => p.lessonId === lesson.id) }, null, 2) + "\n");
  writeFileSync(evidencePath(stage + "_LESSON.json"), JSON.stringify(lesson, null, 2) + "\n");
  console.log("32节旧教材/清单及受保护文件不变；4.1结构与后续规划边界通过");
}
