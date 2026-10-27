import type { ContentBlock } from "../../models";

// 历史归档元数据：十三张场景图已退出正文；仅用于旧快照比较与素材追溯，不是当前配图要求。
// 当前决策见docs/AI000_VISUAL_CONTENT_REFINEMENT.md；教材不得依本清单自动接入。
export const ai000Illustrations = [
  {
    "lessonId": "AI000-C01-L01",
    "section": "mail-task",
    "index": 1,
    "src": "/images/lessons/ai000/ai000-c01-l01-mail-sorting.webp",
    "alt": "一个学生坐在整洁书桌旁查看邮件；屏幕上有封套形状和分组卡片，不显示文字。",
    "caption": "先给每封邮件一个类别建议，再决定怎样整理；画面中的屏幕只帮助想象收件情境。",
    "width": 1200,
    "height": 800
  },
  {
    "lessonId": "AI000-C01-L02",
    "section": "mistakes",
    "index": 1,
    "src": "/images/lessons/ai000/ai000-c01-l02-mail-review.webp",
    "alt": "工作人员对照笔记材料核查电脑中的邮件卡片，建议区和待复核区分开，无文字。",
    "caption": "分类建议要与已知背景核对，再决定怎样处理邮件。",
    "width": 1200,
    "height": 800
  },
  {
    "lessonId": "AI000-C01-L03",
    "section": "knowledge",
    "index": 1,
    "src": "/images/lessons/ai000/ai000-c01-l03-automation-diagnosis.webp",
    "alt": "并置的两个工作角落：备份设备旁有无字钟面；另一处工作人员检查打印机与连接。",
    "caption": "定时复制与依据现象排查都能自动进行；判断方法还要看具体说明。",
    "width": 1200,
    "height": 800
  },
  {
    "lessonId": "AI000-C02-L01",
    "section": "deep-learning",
    "index": 1,
    "src": "/images/lessons/ai000/ai000-c02-l01-photo-recognition.webp",
    "alt": "桌面摆着不同角度的猫照片，电脑旁留有待核对照片，不画技术包含关系。",
    "caption": "同样是判断照片里有没有猫，内部方法仍要另查，不能只凭画面确定。",
    "width": 1200,
    "height": 800
  },
  {
    "lessonId": "AI000-C02-L02",
    "section": "generation",
    "index": 1,
    "src": "/images/lessons/ai000/ai000-c02-l02-poster-creation.webp",
    "alt": "读书会创作桌上摆着现成图片卡片，显示屏呈现新组织的猫与阅览室图像，无字海报。",
    "caption": "找到已有海报与按要求组织新图像是不同工作；用途与处理过程要分开看。",
    "width": 1200,
    "height": 800
  },
  {
    "lessonId": "AI000-C03-L01",
    "section": "parcel-examples",
    "index": 2,
    "src": "/images/lessons/ai000/ai000-c03-l01-photo-label-pairing.webp",
    "alt": "工作人员将纸箱和文件袋照片与对应实物逐一核对，资料夹上无文字。",
    "caption": "照片要与核实过的包装类别对应；类别的来源需要能够回查。",
    "width": 1200,
    "height": 800
  },
  {
    "lessonId": "AI000-C03-L02",
    "section": "borrowing-records",
    "index": 2,
    "src": "/images/lessons/ai000/ai000-c03-l02-library-observation.webp",
    "alt": "图书馆桌上摆着匿名借阅卡和不同主题的书，馆员在观察资料；不画已确定人群。",
    "caption": "借阅资料提供观察线索，读者的长期兴趣和分组含义还要另查。",
    "width": 1200,
    "height": 800
  },
  {
    "lessonId": "AI000-C03-L03",
    "section": "hide-a-piece",
    "index": 2,
    "src": "/images/lessons/ai000/ai000-c03-l03-masked-document.webp",
    "alt": "桌上保留完整资料，另一份相同版式资料的一小段被纸条遮住；纸面只用抽象行线。",
    "caption": "保留完整材料，再遮住副本的一小段；实际片段与目标由正文逐项说明。",
    "width": 1200,
    "height": 800
  },
  {
    "lessonId": "AI000-C03-L04",
    "section": "delivery-problem",
    "index": 2,
    "src": "/images/lessons/ai000/ai000-c03-l04-delivery-robot.webp",
    "alt": "小型轮式送物机器人携带普通包裹停在学校走廊岔口，侧通道与一扇关闭的门清楚可见。",
    "caption": "走过岔口会改变位置和后面的选择；入口看得见的情况还不是整段结果。",
    "width": 1200,
    "height": 800
  },
  {
    "lessonId": "AI000-C04-L01",
    "section": "parcel-records",
    "index": 1,
    "src": "/images/lessons/ai000/ai000-c04-l01-parcel-registration.webp",
    "alt": "收发室登记台旁摆着不同大小包裹，工作人员记录到件信息；不显示完成时长。",
    "caption": "到件时可以登记尺寸和等待情况，最终处理时长还要等归架后确认。",
    "width": 1200,
    "height": 800
  },
  {
    "lessonId": "AI000-C04-L02",
    "section": "need-a-model",
    "index": 2,
    "src": "/images/lessons/ai000/ai000-c04-l02-queue-estimate.webp",
    "alt": "工作人员观察一排等待处理的相近尺寸包裹，旁边放着估时便签，画面无具体数字。",
    "caption": "先观察前面有几件在等，再按约定的关系估时；这个简化模型只采用排队件数。",
    "width": 1200,
    "height": 800
  },
  {
    "lessonId": "AI000-C04-L03",
    "section": "assign-roles",
    "index": 1,
    "src": "/images/lessons/ai000/ai000-c04-l03-records-reserved.webp",
    "alt": "桌面有打开的学习资料和比较用夹板，较远处留着闭合资料夹；不画文字标签和数据箭头。",
    "caption": "有的记录正用于学习或比较，有的先保留；关键在于是否影响过前面的决定。",
    "width": 1200,
    "height": 800
  },
  {
    "lessonId": "AI000-C04-L04",
    "section": "new-arrival",
    "index": 1,
    "src": "/images/lessons/ai000/ai000-c04-l04-model-inference.webp",
    "alt": "新包裹摆在登记台，工作人员核对当前信息并查看屏幕中的估计卡片，卡片不含文字或数字。",
    "caption": "新包裹先提供当时可取得的信息，系统给出估计；实际时长仍要等处理结束后核对。",
    "width": 1200,
    "height": 800
  }
];

export function illustration(lessonId: string): Extract<ContentBlock, { type: "image" }> {
  const asset=ai000Illustrations.find(a=>a.lessonId===lessonId);
  if (!asset) throw new Error("缺少已生成的课时插画："+lessonId);
  const {src,alt,caption,width,height}=asset;
  return {type:"image",src,alt,caption,width,height};
}
