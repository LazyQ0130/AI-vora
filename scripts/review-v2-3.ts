import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { evidencePath } from "./evidence-path";
import { maV22LessonIds } from "../src/content/math-outline";
import { resolveLesson } from "../src/lib/course-engine";

// 留存完整编辑前后数据，供人工逐段比较；不设字数或段落数量门槛。
const lessons = maV22LessonIds.map((id) => resolveLesson("MA101", id)!.lesson);
const baselinePath = process.env.AIVORA_EDITING_BASELINE ?? "docs/TEACHING_V2_3_BEFORE.json";
if (process.argv.includes("--baseline")) {
  await writeFile(baselinePath, JSON.stringify({
    revision: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
    note: "编辑前实际 HEAD 的数据，只生成一次；完整正文、公式、题目和解答供对比。",
    lessons,
  }, null, 2) + "\n", { flag: "wx" });
  console.log(`编辑前快照已保存：${baselinePath}`);
} else {
  const before = JSON.parse(await readFile(baselinePath, "utf8")) as { revision: string; lessons: typeof lessons };
  const comparisons = lessons.map((after) => {
    const original = before.lessons.find((lesson) => lesson.id === after.id)!;
    const exercises = (lesson: typeof after) => lesson.sections.flatMap((section) => section.blocks
      .filter((block) => block.type === "exercise").map((block) => ({ id: block.id, tier: section.tier })));
    const afterIds = new Set(after.sections.map((section) => section.id));
    const afterExercises = new Set(exercises(after).map((exercise) => exercise.id));
    return {
      id: after.id,
      contentVersionUnchanged: original.contentVersion === after.contentVersion,
      preservedSectionIds: original.sections.every((section) => afterIds.has(section.id)),
      preservedExerciseIds: exercises(original).every((exercise) => afterExercises.has(exercise.id)),
      beforeExercises: exercises(original), afterExercises: exercises(after),
      before: original, after,
    };
  });
  if (comparisons.some((row) => !row.contentVersionUnchanged || !row.preservedSectionIds || !row.preservedExerciseIds))
    throw new Error("原有版本键、section 或练习锚点发生不兼容变化");
  await writeFile(evidencePath("TEACHING_V2_3_COMPARISON.json"), JSON.stringify({
    baselineRevision: before.revision,
    note: "编辑差异与兼容快照；无字数质量分数，不代表教学效果验证。",
    comparisons,
  }, null, 2) + "\n");
  console.log("四节教材前后全文与锚点兼容对比已输出");
}
