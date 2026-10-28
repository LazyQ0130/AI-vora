import { beforeCreativeExtension } from "./ai000-creative-compatibility";
// 只撤销5.3登记的精确枚举后缀与分发扩展；完整旧文件仍须命中原摘要。
export const multimodalEnumExtension = ', "multimodal-exhibits", "multimodal-lost-property"';
export const multimodalImport = 'import { AiMultimodalFigure } from "./ai-multimodal-figure";';
export const multimodalDispatch = '  if (block.kind.startsWith("multimodal-")) return <AiMultimodalFigure block={block} />;';
export function beforeMultimodalExtension(path: string, source: string) {
  source = beforeCreativeExtension(path, source);
  if (path === "src/content/models.ts") return source.replace(multimodalEnumExtension, "");
  if (path === "src/components/lesson/ai-task-figure.tsx") return source.replace(multimodalImport+"\r\n", "").replace(multimodalImport+"\n", "").replace(multimodalDispatch+"\r\n", "").replace(multimodalDispatch+"\n", "");
  return source;
}
