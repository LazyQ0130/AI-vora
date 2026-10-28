// 原创虚构题设；无实际录音采集、转写服务、训练或群体评测。
// 事实来源及管理建议的适用边界见 docs/AI000_LESSON_6_2_REVIEW.md。
export const repairFields = [
  { id: "description", name: "报修描述", proposed: "判断是什么问题", decision: "当前任务需要", reason: "只保留与故障有关的内容，提醒避免夹带无关个人信息" },
  { id: "repair-place", name: "报修地点", proposed: "确定工作人员去哪里", decision: "当前任务需要", reason: "故障设施的位置；可手填楼栋、楼层和设施，不用个人实时定位替代" },
  { id: "category", name: "报修类别", proposed: "分配照明、漏水、门锁等任务", decision: "工单需要，但可在处理中产生", reason: "由描述形成类别建议，再核对；不要求报修者先给正确标签" },
  { id: "contact", name: "联系方式", proposed: "追问或通知报修者", decision: "有回访需要时按条件取得", reason: "先考虑工单内留言/查进度；确需回访再选一种适当渠道，不无条件必填" },
  { id: "name-student-id", name: "姓名和学号", proposed: "开发者认为方便管理", decision: "不作通用报修默认字段", reason: "若另有可靠身份核验需求，单独说明必要信息和访问边界，不向维修队展示整套身份资料" },
  { id: "identity-number", name: "身份证号码", proposed: "开发者认为信息越完整越好", decision: "本任务不默认收集", reason: "定位和描述故障不需要用身份证号，没有明确用途" },
  { id: "live-location", name: "个人精确实时位置", proposed: "自动知道学生在哪里", decision: "本任务不默认收集", reason: "学生可能在别处报修；实际所在位置不等于故障地点" },
  { id: "audio", name: "语音录音", proposed: "转成文字并理解报修内容", decision: "选择语音路径时需要处理", reason: "文字报修无需录音；核对文字工单后再按复核目的决定是否保留原音" },
  { id: "address-book", name: "完整通讯录", proposed: "开发者认为以后可能用得上", decision: "本任务不默认收集", reason: "与本次故障派单无关，未来可能有用不构成当前必要性" },
];

export const repairCoverage = Array.from({ length: 15 }, (_,i) => ({
  id: `D${String(i+1).padStart(2,"0")}`, condition: i<12 ? "A" : "B",
}));
export type CategoryRecord = { id: string; condition: string; expected: string; output: string };
export const repairChecks: CategoryRecord[] = [
  { id: "A1", condition: "A", expected: "照明", output: "照明" },
  { id: "A2", condition: "A", expected: "漏水", output: "漏水" },
  { id: "A3", condition: "A", expected: "门锁", output: "门锁" },
  { id: "A4", condition: "A", expected: "照明", output: "照明" },
  { id: "B1", condition: "B", expected: "漏水", output: "漏水" },
  { id: "B2", condition: "B", expected: "照明", output: "漏水" },
  { id: "B3", condition: "B", expected: "门锁", output: "门锁" },
  { id: "B4", condition: "B", expected: "门锁", output: "照明" },
];
export const categoryRows = (records: readonly CategoryRecord[]) => records.map(r=>[r.id,r.condition,r.expected,r.output]);
export const checkedCategoryRows = (records: readonly CategoryRecord[]) => records.map(r=>[r.id,r.condition,r.expected,r.output,r.expected===r.output?"一致":"不一致"]);
export function categorySummary(records: readonly CategoryRecord[],conditions: readonly string[]) {
  return [...conditions,"合计"].map(condition=>{
    const rows=condition==="合计" ? records : records.filter(r=>r.condition===condition);
    const correct=rows.filter(r=>r.expected===r.output).length;
    return [condition,String(rows.length),String(correct),String(rows.length-correct),`${correct}/${rows.length}`];
  });
}

export const eventTasks = [
  ["通用咨询", "只按已确认活动规则回答要求、时间与报名入口说明，不读取任何人的私人报名记录"],
  ["个人状态", "有人想查自己的报名是否成功：转入适当身份核验的专用流程，只返回其本人所需状态；通用问答页不直接拥有全体学生名单"],
];
export const eventFields = [
  ["用户提出的问题", "理解本次咨询"],
  ["活动规则文档", "找到可回查的报名要求和入口说明"],
  ["活动名称", "区分正在咨询哪一场活动"],
  ["咨询时间", "开发者希望逐次记录到精确时刻并永久留存"],
  ["用户姓名", "开发者希望问答前先核对身份"],
  ["学号", "开发者希望和所有私人报名记录关联"],
  ["身份证号码", "开发者认为身份越完整越好"],
  ["手机通讯录", "开发者想分析谁会一起报名"],
  ["实时精确位置", "开发者希望知道咨询者当前在哪里"],
  ["历史聊天全文", "开发者希望永久保存全部活动的聊天，以后做画像"],
  ["自愿提供的补充材料", "允许上传任何文件，全部保留，以后也许有用"],
];
export const eventManagementProposal = "候选方案还准备让活动工作人员都能查看全库问题、聊天、附件和个人报名状态；保存时间暂不设限制。若用户要求删除，只移除页面上的一条消息。以上均为待审查设计，不是已认可的要求。";

export const libraryConditions = [
  ["甲", "预设普通话发音条件甲", "电脑麦克风", "安静房间"],
  ["乙", "预设另一普通话口音条件乙", "手机麦克风", "有背景交谈"],
];
// 行序交错，学生须按condition分组，不能把前五行默认当作一组。
export const libraryChecks: CategoryRecord[] = [
  { id: "L01", condition: "甲", expected: "借阅期限", output: "借阅期限" },
  { id: "L02", condition: "乙", expected: "续借", output: "开放时段" },
  { id: "L03", condition: "甲", expected: "续借", output: "续借" },
  { id: "L04", condition: "乙", expected: "借阅期限", output: "借阅期限" },
  { id: "L05", condition: "甲", expected: "开放时段", output: "借阅期限" },
  { id: "L06", condition: "乙", expected: "开放时段", output: "续借" },
  { id: "L07", condition: "甲", expected: "借阅期限", output: "借阅期限" },
  { id: "L08", condition: "乙", expected: "续借", output: "续借" },
  { id: "L09", condition: "甲", expected: "开放时段", output: "开放时段" },
  { id: "L10", condition: "乙", expected: "借阅期限", output: "开放时段" },
];
