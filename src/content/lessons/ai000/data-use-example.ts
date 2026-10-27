import { durationEstimate, minuteGap, type TimeParameters } from "./model-parameter-example";

// 原创新情境；各ID指不同事件，不覆盖4.1的A–G。参数为手工给定候选，未运行训练算法。
// 角色在比较前约定。选择函数只接收验证记录，测试结果不参与候选选择。
export type DataUseRole = "training" | "validation" | "test";
export type DataUseRecord = { id: string; count: number; actualMinutes: number; role: DataUseRole };
export const dataUseRoles = { training: "训练", validation: "验证", test: "保留测试" } as const;
export const evaluationParcels = [
  { id: "T1", count: 0, actualMinutes: 4, role: "training" },
  { id: "T2", count: 1, actualMinutes: 6, role: "training" },
  { id: "T3", count: 2, actualMinutes: 8, role: "training" },
  { id: "T4", count: 3, actualMinutes: 10, role: "training" },
  { id: "V1", count: 1, actualMinutes: 7, role: "validation" },
  { id: "V2", count: 2, actualMinutes: 9, role: "validation" },
  { id: "S1", count: 0, actualMinutes: 5, role: "test" },
  { id: "S2", count: 3, actualMinutes: 13, role: "test" },
] as const satisfies readonly DataUseRecord[];
export const evaluationCandidates = [
  { name: "甲", baseMinutes: 4, minutesPerItem: 2 },
  { name: "乙", baseMinutes: 3, minutesPerItem: 3 },
] as const;
export const recordsForRole = <T extends DataUseRecord>(records: readonly T[], role: DataUseRole) => records.filter(r => r.role === role);
export const comparisonRows = (records: readonly DataUseRecord[], candidates: readonly TimeParameters[]) => records.map(r => [r.id, String(r.count), String(r.actualMinutes), ...candidates.map(c => {
  const prediction = durationEstimate(c, r.count);
  return `${prediction} / ${minuteGap(prediction, r.actualMinutes)}`;
})]);
export const gapTotal = (candidate: TimeParameters, records: readonly DataUseRecord[]) => records.reduce((total, r) => total + minuteGap(durationEstimate(candidate, r.count), r.actualMinutes), 0);
const validationParcels = recordsForRole(evaluationParcels, "validation");
export const parcelValidationTotals = evaluationCandidates.map(c => gapTotal(c, validationParcels));
export const selectedParcelCandidate = evaluationCandidates[parcelValidationTotals[0] < parcelValidationTotals[1] ? 0 : 1];

// 独立打印迁移任务：份数为输入，各任务的单份页数和色彩要求相同。
export const evaluationPrintRecords = [
  { id: "P1", count: 1, actualMinutes: 5, role: "training" },
  { id: "P2", count: 3, actualMinutes: 9, role: "training" },
  { id: "P3", count: 2, actualMinutes: 8, role: "validation" },
  { id: "P4", count: 4, actualMinutes: 11, role: "validation" },
  { id: "P5", count: 1, actualMinutes: 6, role: "test" },
  { id: "P6", count: 5, actualMinutes: 15, role: "test" },
] as const satisfies readonly DataUseRecord[];
export const evaluationPrintCandidates = [
  { name: "丙", baseMinutes: 3, minutesPerItem: 2 },
  { name: "丁", baseMinutes: 5, minutesPerItem: 1 },
] as const;
export const evaluationAuditCases = [
  { id: "甲", text: "开始登记时预测归架总时长，却把全部归架时刻作为输入；用参与训练的记录报告最终效果。" },
  { id: "乙", text: "用训练记录学习，根据验证记录比较并选定模型；再用事先保留、没有重复且未参与前面决定的记录检查选定模型。" },
  { id: "丙", text: "把训练中的B2复制为测试中的B9；又多次根据这批测试结果改参数，最后仍报告这是完全独立的测试。" },
] as const;
