// 原创教学构造。expected 是题设类别；系统运行时只能读取 subject。
export const mailExamples = [
  { id: "A", subject: "免费领奖，立即登记", context: "陌生来源、未经请求的诱导推广", expected: "垃圾", reason: "含“免费”，拦到了本例的垃圾邮件" },
  { id: "B", subject: "你报名的免费讲座明晚开始", context: "本人已报名、来自活动组织者的通知", expected: "正常", reason: "含“免费”，却误拦了需要的通知" },
  { id: "C", subject: "项目会议改到周三", context: "同事发来的工作通知", expected: "正常", reason: "不含“免费”，保留了本例的正常邮件" },
  { id: "D", subject: "领取礼品，立即登记", context: "陌生来源、未经请求的诱导推广", expected: "垃圾", reason: "不含“免费”，漏掉了本例的垃圾邮件" },
] as const;

export function keywordMailDecision(subject: string): "垃圾" | "正常" {
  return subject.includes("免费") ? "垃圾" : "正常";
}
