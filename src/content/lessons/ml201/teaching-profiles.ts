import type { Lesson } from "../../models";
type Profile = Pick<Lesson, "learningTime" | "assessmentMap">;
const profile = (time: [number,number,number,number,number,number], mapping: string[][]): Profile => ({
  learningTime: { reading: [time[0],time[1]], practice: [time[2],time[3]], coding: [time[4],time[5]], basis: "editorial-estimate" },
  assessmentMap: mapping.map((exerciseIds, index) => ({ objective: index+1, exerciseIds })),
});
// 时间为编辑估计，非学生实测；映射由题目实际要求决定。
export const mlTeachingProfiles: Record<string, Profile> = {
  "ML201-C03-L01": profile([8,12,10,15,3,6], [["transfer-task"],["task-kind"],["task-interpolation"]]),
  "ML201-C03-L02": profile([8,12,12,18,5,10], [["model-calculate"],["model-calculate"],["data-roles"]]),
  "ML201-C03-L03": profile([10,15,12,20,5,10], [["loss-manual"],["loss-transfer"],["loss-transfer"]]),
  "ML201-C04-L02": profile([12,18,12,20,5,10], [["derive-new"],["scalar-step"],["rate-experiment"]]),
  "ML201-C04-L03": profile([12,18,15,25,5,10], [["partial-fixed"],["gradient-derive"],["same-error"]]),
  "ML201-C04-L04": profile([10,15,15,25,5,10], [["hand-update"],["hand-update"],["sequential","repeat-data"]]),
  "ML201-C04-L05": profile([10,15,12,20,15,25], [["code-map"],["train-complete"],["loss-read"]]),
};
