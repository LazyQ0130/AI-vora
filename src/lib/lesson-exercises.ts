import type { Lesson } from "../content/models";

// 保持正文顺序；同一题覆盖几个目标时仍只有一个入口。
export function lessonExerciseLinks(lesson: Lesson) {
  return lesson.sections.flatMap((section) => section.blocks
    .filter((block) => block.type === "exercise")
    .map((block) => ({
      id: block.id,
      title: block.title,
      kind: block.kind,
      tier: lesson.optionalLesson && section.tier === "core" ? "advanced" : section.tier,
      objectives: lesson.assessmentMap.filter((row) => row.exerciseIds.includes(block.id)).map((row) => row.objective),
    })));
}
