import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import type { Lesson, Publication } from "../src/content/models";
import { assertEditorialRefinement41 } from "./ai000-editorial-compatibility";
import { evidencePath } from "./evidence-path";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";
import { parcelParameterSettings, comparisonParcels, durationEstimate, minuteGap, printParameterSettings, printParameterRecords, libraryInitialParameters, libraryAdjustmentExamples, libraryParameterRecords } from "../src/content/lessons/ai000/model-parameter-example";

const digest = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const fileHash = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const baseline = evidencePath("BEFORE.json");
if (process.argv.includes("--baseline")) {
  const protectedPaths = ["curriculum/AI技术课程体系_V1.0.md", "curriculum/AI技术课程目录_V1.0.json", "docs/COURSE_EDITORIAL_STANDARD_V1.md", "src/content/ai000-outline.ts",
    ...["supervised-learning.ts", "unsupervised-learning.ts", "self-supervised-learning.ts", "reinforcement-learning.ts", "parcel-example.ts", "borrowing-example.ts", "self-supervised-example.ts", "delivery-example.ts", "parcel-time-example.ts"].map(p => "src/content/lessons/ai000/" + p),
    ...["reader.tsx", "learning-support.tsx", "content-renderer.tsx", "guided-exercise.tsx", "course-contents.tsx", "article-contents.tsx", "ai-supervised-figure.tsx", "ai-borrowing-figure.tsx", "ai-self-supervised-figure.tsx", "ai-reinforcement-figure.tsx"].map(p => "src/components/lesson/" + p),
    "src/lib/learning-progress.ts", "src/lib/use-learning-progress.ts"];
  writeFileSync(baseline, JSON.stringify({ base: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(), remote: execFileSync("git", ["rev-parse", "origin/main"], { encoding: "utf8" }).trim(), workspace: execFileSync("git", ["status", "--short"], { encoding: "utf8" }), lessons: [...lessonRegistry.values()], publications: publicationManifest, protectedFiles: protectedPaths.map(path => ({ path, hash: fileHash(path) })) }, null, 2) + "\n", { flag: "wx" });
  console.log("33节改前注册全文、清单和受保护文件已独占保存");
} else {
  const before = JSON.parse(readFileSync(baseline, "utf8")) as { lessons: Lesson[]; publications: Publication[]; protectedFiles: { path: string; hash: string }[] };
  for (const old of before.lessons.filter(l => l.id !== "AI000-C04-L01")) assert.equal(digest(lessonRegistry.get(old.id)), digest(old), old.id);
  const differences = assertEditorialRefinement41(before.lessons.find(l => l.id === "AI000-C04-L01")!, lessonRegistry.get("AI000-C04-L01")!);
  for (const old of before.publications) assert.deepEqual(publicationManifest.find(p => p.lessonId === old.lessonId), old.lessonId === "AI000-C04-L01" ? { ...old, technicalEvidence: "docs/AI000_LESSON_4_2_AND_EDITORIAL_REFINEMENT.md" } : old, old.lessonId);
  for (const f of before.protectedFiles) assert.equal(fileHash(f.path), f.hash, f.path);
  writeFileSync(evidencePath("REFINEMENT_41_DIFF.json"), JSON.stringify({ version: 1, decision: "正式目标与核心能力不变，去除非核心来源声明；原r1进度继续有效", differences }, null, 2) + "\n");
  if (process.argv.includes("--refinement-only")) {
    console.log(`4.1共${differences.length}处限定表达精修；其余32节全文/清单不变`);
  } else {
    const lesson = lessonRegistry.get("AI000-C04-L02")!;
    assert.ok(lesson); assert.equal(lesson.contentVersion, 1);
    const final = process.argv.includes("--final");
    const entry = publicationManifest.find(p => p.lessonId === lesson.id)!;
    assert.equal(entry.status, final ? "pending-review" : "draft");
    assert.equal(Boolean(resolveLesson("AI000", lesson.id)), final);
    const course = getLearningCourse("AI000")!;
    if (final) {
      assert.equal(course.chapters.flatMap(c => c.lessons).filter(l => l.href).length, 11);
      assert.equal(getAdjacentLessons(course, "AI000-C04-L01").next?.lessonId, lesson.id);
      assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "AI000-C04-L01");
      assert.equal(getAdjacentLessons(course, lesson.id).next, undefined);
    }
    for (const slot of course.chapters.flatMap(c => c.lessons).filter(l => l.lessonId > lesson.id)) { assert.equal(slot.href, undefined); assert.equal(lessonRegistry.has(slot.lessonId), false); }
    const stage = final ? "FINAL" : "DRAFT";
    const time = getCourseStudyEstimate("AI000")!;
    assert.deepEqual(time.totalMinutes, [574, 890]);
    writeFileSync(evidencePath("TIME_ESTIMATE.json"), JSON.stringify({ ...time, reason: "4.2两题需独立代入与解释，练习由10–16调为14–20分钟；非学生实测" }, null, 2) + "\n");
    const values = (settings: readonly { baseMinutes: number; minutesPerItem: number }[], records: readonly { actualMinutes: number; count: number }[]) => settings.map(parameters => ({ parameters, predictions: records.map(r => durationEstimate(parameters, r.count)), gaps: records.map(r => minuteGap(durationEstimate(parameters, r.count), r.actualMinutes)) }));
    writeFileSync(evidencePath("NUMERIC_EVIDENCE.json"), JSON.stringify({ method: "同源数据计算后，与测试中独立的逐件累加及手算预期比对；未运行训练程序", main: values(parcelParameterSettings, comparisonParcels.map(r => ({ count: r.waiting, actualMinutes: r.actualMinutes }))), print: values(printParameterSettings, printParameterRecords), library: values([libraryInitialParameters, ...libraryAdjustmentExamples], libraryParameterRecords) }, null, 2) + "\n");
    writeFileSync(evidencePath(stage + "_CHECK.json"), JSON.stringify({ checkedAt: new Date().toISOString(), unchangedLessons: 32, unchangedPublications: 32, refinement41: differences.map(d => d.path), protectedFilesUnchanged: true, publication: entry, objectives: lesson.assessmentMap }, null, 2) + "\n");
    writeFileSync(evidencePath(stage + "_LESSON.json"), JSON.stringify(lesson, null, 2) + "\n");
    console.log("4.1限定精修/r1保留；32节旧稿和受保护文件不变；4.2及后续规划边界通过");
  }
}
