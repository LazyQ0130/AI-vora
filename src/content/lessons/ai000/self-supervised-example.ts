// 原创教学文本与假设预测，仅做任务构造/对照演示，不运行或训练模型。
export const maskingParts = {before:"星期五下午，读书会在",hidden:"图书馆",after:"举行。"} as const;
export const maskingExample = {
  original:maskingParts.before+maskingParts.hidden+maskingParts.after,
  input:maskingParts.before+"____"+maskingParts.after,
  target:maskingParts.hidden,
  prediction:"教室",
} as const;
export const continuationExample = {
  original:"活动结束后，大家一起收拾桌椅。",
  input:"活动结束后，大家一起",
  target:"收拾桌椅。",
} as const;
