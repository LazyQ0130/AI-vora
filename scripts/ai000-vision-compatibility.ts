// 仅撤销5.2登记的枚举后缀、import和分派行；撤销后仍须与完整旧源码摘要一致。
export const visionEnumExtension = ', "vision-shelf", "vision-classification", "vision-detection", "vision-segmentation", "vision-workbench"';
export const visionImport = 'import { AiVisionFigure } from "./ai-vision-figure";';
export const visionDispatch = '  if (block.kind.startsWith("vision-")) return <AiVisionFigure block={block} />;';
export function beforeVisionExtension(path: string, source: string) {
  if (path === "src/content/models.ts") return source.replace(visionEnumExtension, "");
  if (path === "src/components/lesson/ai-task-figure.tsx") return source.replace(visionImport+"\r\n", "").replace(visionImport+"\n", "").replace(visionDispatch+"\r\n", "").replace(visionDispatch+"\n", "");
  return source;
}
