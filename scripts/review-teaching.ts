import { writeFile } from "node:fs/promises";
import { evidencePath } from "./evidence-path";
import { lessonRegistry } from "../src/lib/course-engine";
import { publicationManifest, lessonHref } from "../src/content/publication-manifest";
import { lessonSchema } from "../src/content/models";
import { add2,scale2,displacement2,teachingU,teachingV,scalingFactors,vectorView } from "../src/lib/vector-teaching";
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
await writeFile(evidencePath("TEACHING_V2_3_CONTENT_MATRIX.json"), JSON.stringify({
  checkedAt: new Date().toISOString(),
  note: "结构覆盖与编辑估计快照；映射通过不证明题目效度或独立自学效果，需人工与目标学生验证。",
  lessons,
}, null, 2)+"\n");
await writeFile(evidencePath("TEACHING_V2_3_MATH_EVIDENCE.json"),JSON.stringify({
  note:"图解实际使用的数值与坐标比例；独立核验见 tests/test_math_v2_2.py、test_teaching_v2_3.py 与 TS 测试，不代表学生试学。",
  u:teachingU,v:teachingV,sum:add2(teachingU,teachingV),
  translatedDisplacement:displacement2([1,1],[4,3]),
  scaling:scalingFactors.map((factor)=>({factor,result:scale2(factor,teachingU),lengthFactor:Math.abs(factor),direction:factor===0?"undefined":factor>0?"same":"opposite"})),
  orderedRatio: { order: ["east", "north"], original: teachingU, doubled: scale2(2,teachingU), simplified: [3,2] },
  coordinateView:vectorView,
},null,2)+"\n");
console.log(`${lessons.length} 节教材的目标映射、时间估计与分层代码清单已输出`);
