// 原创教学记录；时间只用于独立核算目标，不是真实日志或模型训练结果。
export const parcelTimeDefinition = {
  duration: "从收发室记下到件时刻起，到该件完成登记并归架止的总分钟数，包含等待",
  waiting: "到件时排在本件前面、尚未开始处理的其他包裹数，不含本件和正在处理的包裹",
  careful: "到件时根据可见包装标识或既定接收规则确认是否需要小心处理",
  size: "按收发室事先约定的尺寸档位登记为小、中或大",
} as const;

export const parcelTimeRecords = [
  { id: "A", size: "小", waiting: 0, careful: "否", actualMinutes: 4, arrived: "09:00", finished: "09:04" },
  { id: "B", size: "小", waiting: 2, careful: "否", actualMinutes: 7, arrived: "09:10", finished: "09:17" },
  { id: "C", size: "中", waiting: 1, careful: "是", actualMinutes: 10, arrived: "09:20", finished: "09:30" },
  { id: "D", size: "大", waiting: 3, careful: "是", actualMinutes: 18, arrived: "09:40", finished: "09:58" },
  { id: "E", size: "中", waiting: 0, careful: "否", actualMinutes: 8, arrived: "10:00", finished: "10:08" },
  { id: "F", size: "大", waiting: 1, careful: "否", actualMinutes: 13, arrived: "10:10", finished: "10:23" },
] as const;
export const newParcelTimeRecord = { id: "G", size: "中", waiting: 2, careful: "否", actualMinutes: null, hypotheticalPredictionMinutes: 12 } as const;
export const incompleteParcelTimeRecord = { id: "H", size: "小", waiting: null, careful: "否", actualMinutes: 6 } as const;

export const parcelTimeColumns = ["记录", "包裹尺寸", "到件时待处理数量（件）", "是否需要小心处理", "实际处理时长（分钟）"];
export const parcelFeatureValues = (record: { size: string; waiting: number; careful: string }) => [
  ["包裹尺寸", record.size], ["到件时待处理数量", `${record.waiting}件`], ["是否需要小心处理", record.careful],
];

// 第一道题的一种参考方案；其他满足相同时间/配对约定的方案也成立。
export const printReferenceRecords = [
  { id: "P1", pages: 10, color: "否", queue: 0, submitted: "09:00", finished: "09:04", actualMinutes: 4 },
  { id: "P2", pages: 20, color: "否", queue: 1, submitted: "09:10", finished: "09:17", actualMinutes: 7 },
  { id: "P3", pages: 12, color: "是", queue: 2, submitted: "09:30", finished: "09:42", actualMinutes: 12 },
] as const;

// 第二道题故意保留的待查资料，不是可直接学习的干净数据。
export const libraryAuditRows = [
  ["J", "8", "1", "已核对归架位置", "300秒"],
  ["K", "6", "未知（漏记）", "已核对归架位置", "8分钟"],
  ["L", "10", "0（当时已确认）", "已核对归架位置", "11分钟"],
];
export const librarySourceLogs = [
  { id: "L", registered: "12:00", finished: "12:09" },
  { id: "M", registered: "12:20", finished: "12:31" },
] as const;
