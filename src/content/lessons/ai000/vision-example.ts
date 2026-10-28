// 原创教学几何；单位仅为画布单位，无模型运行结果或实物尺寸含义。
export type Point = readonly [number, number];
export type VisionObject = { id: string; category: string; position: string; outline: readonly Point[] };
export const shelfBoxes: readonly VisionObject[] = [
  { id: "box-left", category: "纸箱", position: "上层左侧", outline: [[36,48],[110,34],[146,55],[146,112],[70,126],[36,105]] },
  { id: "box-right", category: "纸箱", position: "上层右侧", outline: [[222,44],[300,38],[328,64],[328,119],[246,132],[222,109]] },
];
const helmetOutline: readonly Point[] = [[28,94],[33,84],[40,84],[40,66],[47,46],[61,33],[78,28],[96,32],[112,45],[120,64],[120,84],[128,88],[130,96],[28,96]];
export const workbenchHelmets: readonly VisionObject[] = [
  { id: "helmet-left", category: "安全帽", position: "工作台左上方", outline: helmetOutline },
  { id: "helmet-right", category: "安全帽", position: "工作台右下方", outline: helmetOutline.map(([x,y]) => [x+192,y+112] as const) },
];
export const visionCanvas = { width: 360, height: 240 } as const;
export const pointsAttribute = (points: readonly Point[]) => points.map(p => p.join(",")).join(" ");
export function outlineBounds(points: readonly Point[]) {
  const xs = points.map(p=>p[0]), ys = points.map(p=>p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, width: Math.max(...xs)-x, height: Math.max(...ys)-y };
}
export const visionKinds = ["vision-shelf", "vision-classification", "vision-detection", "vision-segmentation", "vision-workbench"] as const;
