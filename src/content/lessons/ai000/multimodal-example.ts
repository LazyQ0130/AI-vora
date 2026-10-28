// 原创题设与可观察几何；登记材料、地点等不是由外观识别出的实物事实。
export const exhibitImages = [
  { id: "A", shape: "bowl", alt: "浅色碗，椭圆碗口，碗外侧有一条连续的蓝色波浪纹。" },
  { id: "B", shape: "compass", alt: "圆形罗盘，外圈有刻度，中心有细长的双向指针。" },
] as const;
export const exhibitRecords = [
  { id: "A", name: "蓝纹陶碗", material: "陶瓷", hall: "东厅" },
  { id: "B", name: "航海罗盘", material: "金属", hall: "西厅" },
] as const;
export const exhibitRecordRows = exhibitRecords.map(r => [r.id, `${r.name}；登记材料：${r.material}`, r.hall]);
export const guideTranscript = {
  id: "T-A", recordingId: "G-A", exhibitId: "A",
  text: "请注意碗外侧的蓝色波浪纹。",
} as const;

export const lostPropertyImages = [
  { id: "P7", shape: "star-cup", alt: "蓝色水杯，右侧有把手，杯身正面有一颗白色五角星。" },
  { id: "P8", shape: "striped-flask", alt: "红色保温杯外形，顶部有盖，杯身有两道黑色横纹，无把手。" },
] as const;
// 行序故意与图序不同；只有明确的原图关联可以用于配对。
export const lostPropertyRecords = [
  { id: "L21", photoId: "P8", description: "红色杯身、两道黑色横纹，登记为保温杯", collectionPoint: null },
  { id: "L22", photoId: "P7", description: "蓝色杯身、白色五角星，带把手的水杯", collectionPoint: "图书馆一楼值班台" },
] as const;
export const lostPropertyRows = lostPropertyRecords.map(r => [r.id, `${r.photoId}；${r.description}`, r.collectionPoint ?? "未登记"]);
export const collectionRule = "领取时先报登记号，再向值班工作人员补充照片未展示、可与原登记核对的物品细节，由工作人员核对后交付。地点未登记时，先联系登记工作人员补查原记录。";
export const taskTranscript = { id: "T1", text: "明天核对投影仪。请补齐借用日期。最后清点三脚架。" } as const;

export const blueWave = "M53 99Q64 87 75 99T97 99T119 99T141 99T163 99T185 99";
export const whiteStar = "110,78 117,96 137,97 121,109 126,129 110,117 94,129 99,109 83,97 103,96";
export const compassTicks = Array.from({ length: 16 }, (_, i) => {
  const angle = i * Math.PI / 8;
  const inner = i % 4 === 0 ? 49 : 55;
  return { x1: 120 + inner * Math.sin(angle), y1: 90 - inner * Math.cos(angle), x2: 120 + 61 * Math.sin(angle), y2: 90 - 61 * Math.cos(angle) };
});
