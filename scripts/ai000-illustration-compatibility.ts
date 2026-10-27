import assert from "node:assert/strict";
import type { Lesson, Publication } from "../src/content/models";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { ai000Illustrations, illustration } from "../src/content/lessons/ai000/illustrations";

// 只反向移除维护清单指定位置、内容完全匹配的新增情境图；不是放行任意image变化。
export function withoutAi000Illustrations(value: unknown): unknown {
  if (!value || typeof value !== "object" || !("id" in value) || !("sections" in value)) return value;
  const lesson=value as Lesson, asset=ai000Illustrations.find(a=>a.lessonId===lesson.id);
  if (!asset) return value;
  let removed=0;
  const sections=lesson.sections.map(section=>({...section,blocks:section.blocks.filter((block,index)=>{
    if (block.type!=="image" || block.src!==asset.src) return true;
    assert.equal(section.id,asset.section,"插画必须在已登记section"); assert.equal(index,asset.index,"插画位置变化需要重新审查");
    assert.deepEqual(block,illustration(lesson.id),"只接受已核查的完整image块"); removed++; return false;
  })}));
  assert.ok(removed<=1,"每节此轮只增加一张登记插画");
  return removed ? {...lesson,sections} : value;
}
export const visualComparableJson = (value: unknown) => JSON.stringify(withoutAi000Illustrations(value));

export const illustrationEvidence = "docs/AI000_LESSON_4_4_AND_VISUAL_REFINEMENT.md";
export const visualRefinementEvidence = "docs/AI000_VISUAL_CONTENT_REFINEMENT.md";
export function assertIllustrationPublication(before: Publication, after: Publication) {
  const illustrated = ai000Illustrations.some(a => a.lessonId === before.lessonId);
  assert.deepEqual(after, illustrated && [illustrationEvidence,visualRefinementEvidence].includes(after.technicalEvidence ?? "") ? { ...before, technicalEvidence: after.technicalEvidence } : before, before.lessonId);
}

// 旧源码只允许新增精确import及已登记调用；撤销后必须命中原SHA。
// 兼容LF、CRLF及历史末行CRLF组合；不忽略其他空白或内容。
export function assertIllustrationCompatibleFile(path: string, previousHash: string) {
  const source = readFileSync(path, "utf8");
  const hash = (text: string) => createHash("sha256").update(text).digest("hex");
  const originalLf = source.replaceAll("\r\n", "\n");
  // 场景引用移除后可能已还原到旧源码；仍需全文摘要匹配，只兼容换行组合。
  if ([source,originalLf,originalLf.replaceAll("\n","\r\n"),originalLf.replace(/\n$/,"\r\n")].some(text=>hash(text)===previousHash)) return;
  if (path === "src/components/lesson/ai-task-figure.tsx") {
    const addedImport = 'import { AiInferenceFigure } from "./ai-inference-figure";';
    const addedDispatch = '  if (block.kind === "inference-flow") return <AiInferenceFigure block={block} />;';
    assert.equal(source.split(addedImport).length, 2);
    assert.equal(source.split(addedDispatch).length, 2);
    const reversed = source.replace(addedImport + "\r\n", "").replace(addedImport + "\n", "").replace(addedDispatch + "\r\n", "").replace(addedDispatch + "\n", "");
    const lf = reversed.replaceAll("\r\n", "\n");
    assert.ok([reversed,lf,lf.replaceAll("\n","\r\n")].some(text=>hash(text)===previousHash), "旧图分发器只允许4.4新分支，不改旧图");
    return;
  }
  const plan = JSON.parse(readFileSync("docs/ai000-4-4/ILLUSTRATION_PLAN.json", "utf8")).entries as {file:string;lessonId:string}[];
  const entry = plan.find(p => path === "src/content/lessons/ai000/" + p.file && p.lessonId !== "AI000-C04-L04");
  assert.ok(entry && ai000Illustrations.some(a => a.lessonId === entry.lessonId), path + ": 非登记旧课不允许源码变更");
  assert.equal(source.split('import { illustration } from "./illustrations";').length, 2, path);
  assert.equal(source.split(`illustration("${entry.lessonId}"),`).length, 2, path);
  const reversed = source.replace(/^import \{ illustration \} from "\.\/illustrations";\r?\n/m, "").replace(new RegExp('^[ \\t]*illustration\\("'+entry.lessonId+'"\\),\\r?\\n','m'), "");
  const lf = reversed.replaceAll("\r\n", "\n");
  assert.ok([reversed, lf, lf.replaceAll("\n", "\r\n"), lf.replace(/\n$/, "\r\n")].some(text => hash(text) === previousHash), path + ": 撤销已登记插画接入后原文摘要必须相同");
}
