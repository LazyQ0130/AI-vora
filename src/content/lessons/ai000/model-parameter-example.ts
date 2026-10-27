import { parcelTimeRecords } from "./parcel-time-example";

// 原创手算示意，参数由作者指定，未运行训练算法。数值核验见4.2审查报告。
export type TimeParameters = { baseMinutes: number; minutesPerItem: number };
export const durationRelation = "预计分钟数 = 基础分钟数 + 每件增加的估计分钟数 × 排队件数";
export const parcelParameterSettings = [
  { name: "甲", baseMinutes: 2, minutesPerItem: 2 },
  { name: "乙", baseMinutes: 4, minutesPerItem: 2 },
] as const;
export const durationEstimate = (parameters: TimeParameters, count: number) => parameters.baseMinutes + parameters.minutesPerItem * count;
export const minuteGap = (prediction: number, actual: number) => Math.abs(prediction - actual);
export const parameterParcel = parcelTimeRecords.find(r => r.id === "B")!;
export const comparisonParcels = ["A", "B", "C"].map(id => parcelTimeRecords.find(r => r.id === id)!);

// 打印练习：同一种材料/页数/色彩，份数是本题唯一输入，时长含接收后的准备与等候。
export const printParameterSettings = [
  { name: "甲", baseMinutes: 2, minutesPerItem: 2 },
  { name: "乙", baseMinutes: 4, minutesPerItem: 1 },
] as const;
export const printParameterRecords = [
  { id: "P", count: 3, actualMinutes: 8 },
  { id: "Q", count: 1, actualMinutes: 5 },
] as const;

// 图书练习与可接受方案示例；学生可以提出其他满足题目条件的设置。
export const libraryInitialParameters = { baseMinutes: 3, minutesPerItem: 2 } as const;
export const libraryParameterRecords = [
  { id: "R1", count: 1, actualMinutes: 6 },
  { id: "R2", count: 2, actualMinutes: 8 },
  { id: "R3", count: 4, actualMinutes: 10 },
] as const;
export const libraryAdjustmentExamples = [
  { baseMinutes: 4, minutesPerItem: 2 },
  { baseMinutes: 5, minutesPerItem: 1 },
] as const;
