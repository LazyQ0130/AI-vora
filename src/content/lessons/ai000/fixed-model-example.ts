import { durationEstimate } from "./model-parameter-example";

// 固定参数使用演示，未运行训练/推理程序；不继承4.3乙的评价，不修改4.1 G。
export const fixedParcelModel = { baseMinutes: 4, minutesPerItem: 2 } as const;
export const newInferenceParcel = { id: "N", waiting: 3, actualMinutes: null } as const;
export const inferencePrediction = durationEstimate(fixedParcelModel, newInferenceParcel.waiting);
// 另给处理完成后的假设台账，不回填当前输入对象；预测与实际有不同来源/时刻。
export const laterParcelLog = { arrived: "10:00", finished: "10:12", actualMinutes: 12 } as const;
export const printInferenceModel = { baseMinutes: 2, minutesPerItem: 3 } as const;
export const newPrintInference = { id: "U", copies: 4, actualMinutes: null } as const;
export const laterPrintLog = { received: "12:00", completed: "12:16", actualMinutes: 16 } as const;
export const libraryInferenceModel = { baseMinutes: 1, minutesPerItem: 2 } as const;
export const inferenceAuditCases = [
  { id: "J", information: "普通书3册；登记时数量已确认，整理区域相同" },
  { id: "K", information: "册数漏记；有人建议填0后直接计算" },
  { id: "L", information: "册数栏写“300秒”，找不到可靠数量" },
  { id: "M", information: "册数2；又把事后实际时长9分钟当登记时输入" },
  { id: "R", information: "大型图册50册，需搬到另一栋楼" },
] as const;
