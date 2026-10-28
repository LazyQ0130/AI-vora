// 原创纸笔情境，不是模型训练、机器人实测或已运行模拟器的成绩。
export const warehouseTask = {
  taskIds: ["J1", "J2", "J3", "J4", "J5", "J6"],
  robots: 2, kilogramsPerTask: 4, loadLimitKg: 10,
  targetMinute: 20, windowMinutes: 30,
  reward: { completed: 5, lateCompleted: -3, congestion: -1 },
} as const;
export const warehouseOutcomes = [
  { name: "甲", completionMinutes: [10, 14, 18, 22, 25, 28], congestionEventIds: ["Q1", "Q2", "Q3", "Q4"] },
  { name: "乙", completionMinutes: [9, 11, 13, 16, 19], congestionEventIds: [] },
] as const;
export function warehouseMetrics(record: typeof warehouseOutcomes[number]) {
  const completed = record.completionMinutes.filter(t => t <= warehouseTask.windowMinutes).length;
  const lateCompleted = record.completionMinutes.filter(t => t > warehouseTask.targetMinute && t <= warehouseTask.windowMinutes).length;
  const congestion = new Set(record.congestionEventIds).size;
  return { completed, lateCompleted, congestion,
    score: completed * warehouseTask.reward.completed + lateCompleted * warehouseTask.reward.lateCompleted + congestion * warehouseTask.reward.congestion,
    allCompleted: completed === warehouseTask.taskIds.length };
}
export const bikeSites = ["教学楼站", "宿舍站", "图书馆站"] as const;
export const bikeInitial = [2, 6, 4] as const;
export const bikeDemands = [
  { period: "上午8:00–9:00", counts: [5, 1, 1] },
  { period: "晚上17:00–18:00", counts: [1, 5, 1] },
] as const;
export const bikeRules = { stationCapacity: 12, vehicleCapacity: 2, maxTransfersPerPeriod: 1, costPerBikeMove: 1, morningReturnTo: [1, 2, 0] } as const;
export const bikeIncompleteLogs = [
  ["记录D1", "上午转运前：教2、宿6、馆4；宿→教2辆", "借出/归还实绩、转运后与晚间前库存未留存"],
  ["记录D2", "晚间：等待，不转运", "行动前各站库存、借车请求及未满足数未留存"],
];
