// 原创纸笔教学情境；下面是按规则编写的事后记录，没有运行环境或训练算法。
export const deliveryRewards={checkpoint:3,detour:-6,delivered:10,ordinary:0} as const;
export const signedReward=(value:number)=>value>0?`+${value}`:value<0?`−${Math.abs(value)}`:"0";
export const deliveryRoutes=[
 {id:"甲",steps:[
  {before:"在岔口，物品未送达，前方门的通行情况未知",available:["走甲路","走乙路","原处等待"],action:"走甲路到检查点",after:"到达甲检查点，取得本次检查点分；发现直行门关闭",reward:deliveryRewards.checkpoint,nextChoice:"现在可改走侧通道或等待；本次接着选绕行。"},
  {before:"在甲检查点，已看到直行门关闭",available:["改走侧通道","原处等待"],action:"改走侧通道",after:"绕过关闭的门，到达收件门前；绕行消耗任务资源",reward:deliveryRewards.detour,nextChoice:"现在可交付物品或等待；本次接着选交付。"},
  {before:"在收件门前，物品仍在机器人上",available:["交付物品","原处等待"],action:"交付物品",after:"收件点确认收到物品，本次送物结束",reward:deliveryRewards.delivered,nextChoice:"本次结束；新一次任务从岔口重新开始。"},
 ]},
 {id:"乙",steps:[
  {before:"在岔口，物品未送达，前方门的通行情况未知",available:["走甲路","走乙路","原处等待"],action:"走乙路到走廊",after:"到达乙走廊，眼前道路可通行",reward:deliveryRewards.ordinary,nextChoice:"继续前进或等待；本次继续前进。"},
  {before:"在乙走廊，眼前道路可通行",available:["继续前进","原处等待"],action:"继续前进",after:"到达收件门前，物品尚未交付",reward:deliveryRewards.ordinary,nextChoice:"交付物品或等待；本次交付。"},
  {before:"在收件门前，物品仍在机器人上",available:["交付物品","原处等待"],action:"交付物品",after:"收件点确认收到物品，本次送物结束",reward:deliveryRewards.delivered,nextChoice:"本次结束。"},
 ]},
] as const;
export const routeTotal=(route:{steps:readonly {reward:number}[]})=>route.steps.reduce((total,step)=>total+step.reward,0);

export const wateringRewards={firstBed:2,dryAttempt:-5,refill:0,completed:9} as const;
export const wateringRecords=[
 {id:"先浇再补",steps:[
  {action:"浇A地",after:"A完成、B未完成，水箱剩0单位",reward:wateringRewards.firstBed},
  {action:"仍尝试浇B地",after:"水箱无水，B仍未完成，记一次无水尝试",reward:wateringRewards.dryAttempt},
  {action:"把水箱补满",after:"水箱变为2单位，B仍未完成",reward:wateringRewards.refill},
  {action:"浇B地",after:"两块地均完成，水箱剩1单位，本次结束",reward:wateringRewards.completed},
 ]},
 {id:"先补再浇",steps:[
  {action:"把水箱补满",after:"水箱变为2单位，两块地尚未浇",reward:wateringRewards.refill},
  {action:"浇A地",after:"A完成、B未完成，水箱剩1单位",reward:wateringRewards.firstBed},
  {action:"浇B地",after:"两块地均完成，水箱剩0单位，本次结束",reward:wateringRewards.completed},
 ]},
] as const;
