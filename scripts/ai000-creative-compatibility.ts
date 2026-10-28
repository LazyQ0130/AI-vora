// 只撤销5.4两种候选展示的精确扩展；其余旧源码仍须命中完整摘要。
export const creativeEnumExtension = ', "creative-posters", "creative-tech-posters"';
export const creativeImport = 'import { AiCreativeFigure } from "./ai-creative-figure";';
export const creativeDispatch = '  if (block.kind.startsWith("creative-")) return <AiCreativeFigure block={block} />;';
export function beforeCreativeExtension(path: string, source: string) {
  if (path === "src/content/models.ts") return source.replace(creativeEnumExtension, "");
  if (path === "src/components/lesson/ai-task-figure.tsx") return source.replace(creativeImport+"\r\n", "").replace(creativeImport+"\n", "").replace(creativeDispatch+"\r\n", "").replace(creativeDispatch+"\n", "");
  return source;
}
