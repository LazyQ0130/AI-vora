export const exchangeFacts = {
  name: "校园旧物交换日", time: "周六14:00–16:00", place: "图书馆一楼共享区",
  participation: "免费参加，无需提前报名", content: "交换闲置书籍和学习用品",
};
export const techFacts = {
  name: "校园科技体验日", time: "周日13:30–16:30", place: "综合楼二楼体验区",
  participation: "需要提前登记", content: "机器人演示与科学小实验",
};
export type Poster = { id: string; name: string; time: string; place: string; participation: string; content: string; layout: "flat" | "grouped" | "joined-projects" | "split-projects" };
export const exchangePosters: Poster[] = [
  { id: "A", ...exchangeFacts, layout: "flat" },
  { id: "B", ...exchangeFacts, time: "周六15:00–16:00", layout: "grouped" },
];
export const techPosters: Poster[] = [
  { id: "C", ...techFacts, layout: "joined-projects" },
  { id: "D", ...techFacts, place: "综合楼一楼体验区", participation: "无需提前登记", layout: "split-projects" },
];
export const exchangeScript = "本周六下午两点到四点，校园旧物交换日在图书馆一楼共享区举行。欢迎带来闲置书籍和学习用品。活动免费，无需提前报名。";
export const galleryFacts = {
  name: "校园探索展馆", hours: "周三至周五12:00–17:00", rule: "请勿触摸展品", tone: "自然、清楚", seconds: [20, 30],
};
export const galleryScripts = [
  { id: "甲", text: "欢迎来到校园探索展馆。展馆周二至周五中午十二点到下午五点开放，参观还能免费领取纪念品。" },
  { id: "乙", text: "欢迎来到校园探索展馆。展馆周三至周五中午十二点到下午五点开放。参观时请勿触摸展品。" },
];
