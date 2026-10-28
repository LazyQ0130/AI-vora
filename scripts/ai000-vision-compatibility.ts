import { beforeMultimodalExtension } from "./ai000-multimodal-compatibility";
// 先撤销5.3的精确扩展，再撤销5.2登记的三处扩展；完整旧源码仍须命中原摘要。
export const visionEnumExtension = ', "vision-shelf", "vision-classification", "vision-detection", "vision-segmentation", "vision-workbench"';
export const visionImport = 'import { AiVisionFigure } from "./ai-vision-figure";';
export const visionDispatch = '  if (block.kind.startsWith("vision-")) return <AiVisionFigure block={block} />;';
export function beforeVisionExtension(path: string, source: string) {
  source = beforeMultimodalExtension(path, source);
  if (path === "src/content/models.ts") return source.replace(visionEnumExtension, "");
  if (path === "src/components/lesson/ai-task-figure.tsx") return source.replace(visionImport+"\r\n", "").replace(visionImport+"\n", "").replace(visionDispatch+"\r\n", "").replace(visionDispatch+"\n", "");
  return source;
}
