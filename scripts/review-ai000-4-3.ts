import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry, resolveLesson, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import type { Lesson, Publication } from "../src/content/models";
import { evidencePath } from "./evidence-path";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";
import { evaluationParcels, evaluationCandidates, evaluationPrintRecords, evaluationPrintCandidates, recordsForRole, gapTotal, type DataUseRecord } from "../src/content/lessons/ai000/data-use-example";
import { durationEstimate, minuteGap, type TimeParameters } from "../src/content/lessons/ai000/model-parameter-example";

const hash = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const baseline = evidencePath("BEFORE.json");
if (process.argv.includes("--baseline")) {
  const protectedPaths = execFileSync("git", ["ls-files", "-z", "curriculum", "src/content/lessons", "src/content/resources", "src/lib/learning-progress.ts", "src/lib/use-learning-progress.ts", "src/content/ai000-outline.ts", "src/components/lesson", "docs/COURSE_EDITORIAL_STANDARD_V1.md", "docs/COURSE_EDITORIAL_STANDARD_V1_1_PROPOSAL.md"], { encoding: "utf8" }).split("\0").filter(p => p && p !== "src/components/lesson/ai-task-figure.tsx");
  writeFileSync(baseline, JSON.stringify({
    base: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
    remote: execFileSync("git", ["rev-parse", "origin/main"], { encoding: "utf8" }).trim(),
    workspace: execFileSync("git", ["status", "--short"], { encoding: "utf8" }),
    lessons: [...lessonRegistry.values()], publications: publicationManifest,
    protectedFiles: protectedPaths.map(path => ({ path, hash: hash(path) })),
  }, null, 2) + "\n", { flag: "wx" });
  console.log("34节旧教材全文、清单和原有内容/图/通用组件/课程事实已独占保存");
} else {
  const before = JSON.parse(readFileSync(baseline, "utf8")) as { lessons: Lesson[]; publications: Publication[]; protectedFiles: { path: string; hash: string }[] };
  for (const old of before.lessons) assert.equal(JSON.stringify(lessonRegistry.get(old.id)), JSON.stringify(old), old.id);
  for (const old of before.publications) assert.deepEqual(publicationManifest.find(p => p.lessonId === old.lessonId), old, old.lessonId);
  for (const file of before.protectedFiles) assert.equal(hash(file.path), file.hash, file.path);
  const lesson = lessonRegistry.get("AI000-C04-L03")!;
  assert.ok(lesson); assert.equal(lesson.contentVersion, 1);
  const final = process.argv.includes("--final"), entry = publicationManifest.find(p => p.lessonId === lesson.id)!;
  assert.equal(entry.status, final ? "pending-review" : "draft");
  assert.equal(entry.access, final ? "preview" : "private");
  assert.equal(entry.reviewEvidence, undefined);
  assert.equal(Boolean(resolveLesson("AI000", lesson.id)), final);
  const course = getLearningCourse("AI000")!;
  if (final) {
    assert.equal(course.chapters.flatMap(c => c.lessons).filter(l => l.href).length, 12);
    assert.equal(getAdjacentLessons(course, "AI000-C04-L02").next?.lessonId, lesson.id);
    assert.equal(getAdjacentLessons(course, lesson.id).previous?.lessonId, "AI000-C04-L02");
    assert.equal(getAdjacentLessons(course, lesson.id).next, undefined);
  }
  for (const slot of course.chapters.flatMap(c => c.lessons).filter(l => l.lessonId > lesson.id)) {
    assert.equal(slot.href, undefined); assert.equal(lessonRegistry.has(slot.lessonId), false);
  }
  const stage = final ? "FINAL" : "DRAFT", time = getCourseStudyEstimate("AI000")!;
  assert.deepEqual(time.totalMinutes, [580, 898]);
  writeFileSync(evidencePath("TIME_ESTIMATE.json"), JSON.stringify({ ...time, reason: "4.3流程设计/比较与三项查错需独立解释，练习10–16改16–24分钟；编辑估计，未开展试学" }, null, 2) + "\n");
  const values = (records: readonly DataUseRecord[], candidates: readonly (TimeParameters & { name: string })[]) => ({ records, candidates: candidates.map(c => ({ ...c, predictions: records.map(r => durationEstimate(c,r.count)), gaps: records.map(r => minuteGap(durationEstimate(c,r.count),r.actualMinutes)), totals: Object.fromEntries((["training","validation","test"] as const).map(role => [role,gapTotal(c,recordsForRole(records,role))])) })) });
  writeFileSync(evidencePath("NUMERIC_EVIDENCE.json"), JSON.stringify({ method: "同源数据逐条计算；测试另用逐件累加及独立手算预期核对。完整候选测试计算仅供维护核验，不参与选择。未运行训练程序", main: values(evaluationParcels,evaluationCandidates), print: values(evaluationPrintRecords,evaluationPrintCandidates) }, null, 2) + "\n");
  writeFileSync(evidencePath(stage + "_CHECK.json"), JSON.stringify({ checkedAt: new Date().toISOString(), unchangedLessons: before.lessons.length, unchangedPublications: before.publications.length, protectedFilesUnchanged: true, publication: entry, objectives: lesson.assessmentMap }, null, 2) + "\n");
  writeFileSync(evidencePath(stage + "_LESSON.json"), JSON.stringify(lesson, null, 2) + "\n");
  console.log("34节旧稿/清单和受保护文件不变；4.3阶段门禁、导航、后续规划边界通过");
}
