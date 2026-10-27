import assert from "node:assert/strict";
import type { Lesson, Publication } from "../src/content/models";

export const transition31 = "下一节，我们会看看另一种情况：如果没有提前标好的答案，机器还能从数据中发现什么？";
export const transition32 = "还有一种值得追问的情况：不请人逐条标答案，却能从原始数据中设计出一个有答案的预测任务，这样的目标怎样参与学习？下一节继续讨论自监督学习。";
export const refinementEvidence = "docs/AI000_LESSON_3_3_AND_REFINEMENT.md";

const finalBlock = (lesson:Lesson) => lesson.sections.find(s=>s.id==="takeaways")!.blocks.at(-1)!;
export function assertStatusOnly31(before:Lesson, after:Lesson) {
  assert.equal(before.contentVersion,1);assert.equal(after.contentVersion,1);
  assert.deepEqual(finalBlock(after),{type:"paragraph",text:transition31});
  const normalized=structuredClone(after);
  const section=normalized.sections.find(s=>s.id==="takeaways")!;
  section.blocks[section.blocks.length-1]=structuredClone(finalBlock(before));
  assert.deepEqual(normalized,before,"3.1只允许最后状态段落更新");
}
export function assertExerciseRevision32(before:Lesson, after:Lesson) {
  assert.equal(before.contentVersion,1);assert.equal(after.contentVersion,2);
  const firstExercise=(lesson:Lesson)=>lesson.sections.find(s=>s.id==="practice")!.blocks.find(b=>b.type==="exercise"&&b.id==="propose-groups")!;
  assert.notDeepEqual(firstExercise(after),firstExercise(before));
  assert.deepEqual(finalBlock(after),{type:"paragraph",text:transition32});
  const normalized=structuredClone(after);
  normalized.contentVersion=1;
  const practice=normalized.sections.find(s=>s.id==="practice")!;
  const index=practice.blocks.findIndex(b=>b.type==="exercise"&&b.id==="propose-groups");
  practice.blocks[index]=structuredClone(firstExercise(before));
  const end=normalized.sections.find(s=>s.id==="takeaways")!;
  end.blocks[end.blocks.length-1]=structuredClone(finalBlock(before));
  assert.deepEqual(normalized,before,"3.2只允许首道核心题、版本和状态句变化，其余正文/图/题保持");
}
export function assertPublicationRefinement(before:Publication, after:Publication) {
  if(before.lessonId==="AI000-C03-L01" || before.lessonId==="AI000-C03-L02") {
    assert.deepEqual(after,{...before,contentVersion:before.lessonId==="AI000-C03-L02"?2:1,technicalEvidence:refinementEvidence});
  } else assert.deepEqual(after,before);
}
