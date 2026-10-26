import { writeFile } from "node:fs/promises";
import { lessonRegistry } from "../src/lib/course-engine";
import { publicationManifest, lessonHref } from "../src/content/publication-manifest";
import { lessonSchema } from "../src/content/models";
const lessons = [...lessonRegistry.values()].map((lesson) => {
  lessonSchema.parse(lesson);
  const publication = publicationManifest.find((p) => p.lessonId === lesson.id)!;
  return {
    id: lesson.id, title: lesson.title, href: lessonHref(publication),
    catalogRole: publication.catalogRole, optionalLesson: lesson.optionalLesson,
    status: publication.status, contentVersion: lesson.contentVersion,
    learningTime: lesson.learningTime,
    objectives: lesson.assessmentMap.map((row) => ({
      objective: row.objective, text: lesson.objectives[row.objective-1],
      exercises: row.exerciseIds.map((id) => {
        const section = lesson.sections.find((s) => s.blocks.some((b) => b.type === "exercise" && b.id === id))!;
        const exercise = section.blocks.find((b) => b.type === "exercise" && b.id === id)!;
        if (exercise.type !== "exercise") throw new Error(id);
        return { id, title: exercise.title, kind: exercise.kind, tier: section.tier, prompt: exercise.prompt, hints: exercise.hints.length, rubric: exercise.rubric };
      }),
    })),
    sections: lesson.sections.map((s) => ({ id: s.id, title: s.title, tier: s.tier,
      pythonBlocks: s.blocks.filter((b) => b.type === "code" && b.language === "python").map((b) => b.type === "code" ? { filename: b.filename, lines: b.code.trim().split("\n").length } : null),
    })),
  };
});
await writeFile("docs/TEACHING_V2_1_CONTENT_MATRIX.json", JSON.stringify({
  checkedAt: new Date().toISOString(),
  note: "结构覆盖与编辑估计快照；映射通过不证明题目效度或独立自学效果，需人工与目标学生验证。",
  lessons,
}, null, 2)+"\n");
console.log(`${lessons.length} 节教材的目标映射、时间估计与分层代码清单已输出`);
