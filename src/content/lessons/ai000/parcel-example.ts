// 原创教学数据，不是实际拍摄、训练或测评结果。描述帮助读者想象照片。
export const parcelExamples = [
  { id: "A", description: "棕色纸箱，有明显的立体厚度", label: "纸箱", shape: "box" },
  { id: "B", description: "扁平的白色文件封袋", label: "文件袋", shape: "envelope" },
  { id: "C", description: "小型纸质盒子", label: "纸箱", shape: "box" },
  { id: "D", description: "长条形文件封袋", label: "文件袋", shape: "envelope" },
] as const;
export const newParcel = {
  id: "E", description: "一件带折痕的薄纸包装",
  prediction: "文件袋", verification: "尚未核实，真实类别未知",
} as const;
