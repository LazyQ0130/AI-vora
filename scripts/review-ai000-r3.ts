import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry, getLearningCourse, getAdjacentLessons } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import type { Lesson, Publication } from "../src/content/models";

const dir = "docs/ai000-r3";
export const targetIds = ["AI000-C02-L02", "AI000-C05-L05", "AI000-C06-L02", "AI000-C06-L03"];
export const sha = (v: string | Buffer) => createHash("sha256").update(v).digest("hex");
const git = (...args: string[]) => execFileSync("git", args, { encoding: "utf8" }).trim();
const digest = (v: unknown) => sha(JSON.stringify(v));
export type R3Baseline = {
  base: string; remote: string; workspace: string; lessons: Lesson[];
  lessonDigests: { id: string; sha256: string }[]; publications: Publication[];
  files: { path: string; sha256: string }[]; frozenSnapshotSha256: string;
};

if (process.argv[1]?.replaceAll("\\", "/").endsWith("/review-ai000-r3.ts")) {
  mkdirSync(dir, { recursive: true });
  if (process.argv.includes("--baseline")) {
    const paths = git("ls-files", "-z", "src", "curriculum", "public").split("\0").filter(Boolean);
    const baseline: R3Baseline = {
      base: git("rev-parse", "HEAD"), remote: git("rev-parse", "origin/main"), workspace: git("status", "--short"),
      lessons: targetIds.map(id => lessonRegistry.get(id)!),
      lessonDigests: [...lessonRegistry.values()].map(l => ({ id: l.id, sha256: digest(l) })),
      publications: publicationManifest,
      files: paths.map(path => ({ path, sha256: sha(readFileSync(path)) })),
      frozenSnapshotSha256: sha(readFileSync("docs/ai000-release-readiness/CONTENT_SNAPSHOT.json")),
    };
    writeFileSync(`${dir}/BEFORE.json`, JSON.stringify(baseline, null, 2) + "\n", { flag: "wx" });
    console.log(`R3独占基线：${baseline.base}；${baseline.lessons.length}课全文/${baseline.lessonDigests.length}对象/${paths.length}生产文件`);
  } else if (process.argv.includes("--record-changes")) {
    const before = JSON.parse(readFileSync(`${dir}/BEFORE.json`, "utf8")) as R3Baseline;
    const paths = before.files.filter(f => sha(readFileSync(f.path)) !== f.sha256).map(f => f.path);
    const changes = {
      base: before.base,
      lessons: targetIds.map(id => ({ id, before: before.lessons.find(l => l.id === id), afterSha256: digest(lessonRegistry.get(id)) })),
      publications: targetIds.map(id => ({ id, before: before.publications.find(p => p.lessonId === id), afterSha256: digest(publicationManifest.find(p => p.lessonId === id)) })),
      sources: paths.map(path => ({ path, before: git("show", `${before.base}:${path}`) + "\n", afterSha256: sha(readFileSync(path, "utf8").replaceAll("\r\n", "\n")) })),
    };
    writeFileSync(`${dir}/APPROVED_CHANGES.json`, JSON.stringify(changes, null, 2) + "\n", { flag: "wx" });
    console.log("独占登记R3完整对象/源码摘要；只有完整命中登记新稿才能反向比较历史，额外改动仍失败");
  } else {
    const before = JSON.parse(readFileSync(`${dir}/BEFORE.json`, "utf8")) as R3Baseline;
    const allowedFiles = new Set([
      ...["generative-ai-and-llm", "rl-applicability", "privacy-bias-fairness", "responsible-ai-use", "responsible-use-example"].map(n => `src/content/lessons/ai000/${n}.ts`),
      "src/content/publication-manifest.ts",
    ]);
    const changedFiles = before.files.filter(f => sha(readFileSync(f.path)) !== f.sha256).map(f => ({
      path: f.path, beforeSha256: f.sha256, afterSha256: sha(readFileSync(f.path)),
    }));
    for (const file of changedFiles) assert.ok(allowedFiles.has(file.path), `范围外生产变更：${file.path}`);
    for (const old of before.lessonDigests.filter(l => !targetIds.includes(l.id))) assert.equal(digest(lessonRegistry.get(old.id)), old.sha256, old.id);
    for (const pub of before.publications.filter(p => !targetIds.includes(p.lessonId))) assert.deepEqual(publicationManifest.find(p => p.lessonId === pub.lessonId), pub);
    assert.equal(sha(readFileSync("docs/ai000-release-readiness/CONTENT_SNAPSHOT.json")), before.frozenSnapshotSha256);
    assert.equal(getLearningCourse("AI000")!.status, "planned");
    const lessons = [...lessonRegistry.values()].filter(l => l.courseId === "AI000");
    assert.equal(lessons.length, 24);
    assert.equal(lessons.flatMap(l => l.sections.flatMap(s => s.blocks)).filter(b => b.type === "exercise").length, 49);
    for (const l of lessons) {
      const p = publicationManifest.find(p => p.lessonId === l.id)!;
      assert.equal(p.status, "pending-review"); assert.equal(p.access, "preview"); assert.equal(p.reviewEvidence, undefined);
      assert.equal(p.contentVersion, l.contentVersion);
    }
    const result = targetIds.map(id => {
      const old = before.lessons.find(l => l.id === id)!, current = lessonRegistry.get(id)!;
      for (const s of old.sections) assert.ok(current.sections.some(n => n.id === s.id), s.id);
      assert.deepEqual(current.objectives, old.objectives); assert.deepEqual(current.assessmentMap, old.assessmentMap);
      assert.deepEqual(current.prerequisiteLinks, old.prerequisiteLinks); assert.deepEqual(current.legacyAnchors, old.legacyAnchors);
      assert.deepEqual(current.learningTime, old.learningTime);
      const tasks = (l: Lesson) => l.sections.flatMap(s => s.blocks).filter(b => b.type === "exercise");
      assert.deepEqual(tasks(current).map(t => t.id), tasks(old).map(t => t.id));
      assert.equal(current.contentVersion, id === "AI000-C06-L03" ? 2 : old.contentVersion);
      if (id !== "AI000-C06-L03") assert.deepEqual(tasks(current), tasks(old));
      const strings = (v: unknown): string[] => typeof v === "string" ? [v] : v && typeof v === "object" ? Object.values(v).flatMap(strings) : [];
      const textLength = (l: Lesson) => strings(l.sections.map(s => ({ title: s.title, blocks: s.blocks }))).join("").length;
      const learnerText = (l: Lesson) => {
        const narrative: string[] = [], prompts: string[] = [], hidden: string[] = [];
        for (const s of l.sections) {
          narrative.push(s.title);
          for (const b of s.blocks) {
            if (b.type === "exercise") { prompts.push(b.title, b.prompt); hidden.push(...b.hints, ...b.solution, ...b.rubric); }
            else if (b.type === "paragraph" || b.type === "heading") narrative.push(b.text);
            else if (b.type === "table") narrative.push(b.caption, ...b.columns, ...b.rows.flat());
            else if (b.type === "callout") narrative.push(b.title, b.text);
            else if (b.type === "summary") narrative.push(...b.points);
          }
        }
        return { narrative: narrative.join("").length, exercisePrompts: prompts.join("").length, collapsedFeedback: hidden.join("").length };
      };
      const oldText = learnerText(old), newText = learnerText(current);
      return { id, beforeVersion: old.contentVersion, afterVersion: current.contentVersion, beforeSha256: digest(old), afterSha256: digest(current),
        oldSectionIds: old.sections.map(s => s.id), newSectionIds: current.sections.map(s => s.id),
        exerciseIds: tasks(current).map(t => t.id), assessmentMap: current.assessmentMap,
        sectionStringCharacters: { before: textLength(old), after: textLength(current), delta: textLength(current) - textLength(old), basis: "section标题及blocks字符串长度，含答案/字段名等；不等于阅读时间" },
        learnerCharacters: { before: oldText, after: newText, delta: {
          narrative: newText.narrative - oldText.narrative, exercisePrompts: newText.exercisePrompts - oldText.exercisePrompts,
          collapsedFeedback: newText.collapsedFeedback - oldText.collapsedFeedback,
        }, basis: "可见标题/段落/表格/提示框/总结，题目标题与题干，折叠提示/答案/rubric分账；不含格式标签、参考目录与未改图文；UTF-16字符串长度不推算时长" },
        adjacent: getAdjacentLessons(getLearningCourse("AI000")!, id),
      };
    });
    writeFileSync(`${dir}/AFTER_CHECK.json`, JSON.stringify({ base: before.base, checkedAt: new Date().toISOString(), changedFiles,
      unchangedLessons: before.lessonDigests.length - 4, unchangedPublications: before.publications.length - 4,
      frozenSnapshotUnchanged: true, lessons: result, status: "24 pending-review/preview; AI000 planned; 49 core exercises" }, null, 2) + "\n");
    console.log("R3范围/Schema导入/目标映射/版本/锚点/43旧课与发布/冻结快照核验通过");
  }
}
