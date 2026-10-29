import { readFileSync } from "node:fs";
import { beforeApplicabilitySource } from "./ai000-applicability-compatibility";
import { beforeR3Revision } from "./ai000-r3-compatibility";

type Edit = { path: (string | number)[]; before: unknown; after: unknown };
type Entry = { id: string; changes: Edit[] };
type SourceEntry = { path: string; changes: { before: string; after: string }[] };
export const qualityChanges = JSON.parse(readFileSync(new URL("../docs/ai000-cross-lesson-quality/APPROVED_CHANGES.json", import.meta.url), "utf8")) as {
  base: string; lessons: Entry[]; publications: Entry[]; sources: SourceEntry[];
};

// 仅逆转值完全等于登记after的字段。任意额外修改留在原处，历史全量比较仍会拒绝。
export function beforeQualityRevision<T>(value: T): T {
  value = beforeR3Revision(value);
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  const id = record.id ?? record.lessonId;
  const entry = (record.id ? qualityChanges.lessons : qualityChanges.publications).find(e => e.id === id);
  if (!entry) return value;
  const copy = structuredClone(value);
  for (const edit of entry.changes) {
    let parent: unknown = copy;
    for (const key of edit.path.slice(0, -1)) parent = parent && typeof parent === "object" ? (parent as Record<string | number, unknown>)[key] : undefined;
    if (!parent || typeof parent !== "object") continue;
    const target = parent as Record<string | number, unknown>, key = edit.path.at(-1)!;
    if (JSON.stringify(target[key]) === JSON.stringify(edit.after)) target[key] = structuredClone(edit.before);
  }
  return copy;
}
export const qualityComparableJson = (value: unknown) => JSON.stringify(beforeQualityRevision(value));

// 源码仅接受带唯一上下文、完整匹配的已审查片段；不忽略整个文件、空白或未登记内容。
export function beforeQualitySource(path: string, source: string) {
  source = beforeApplicabilitySource(path, source);
  const entry = qualityChanges.sources.find(e => e.path === path);
  if (!entry) return source;
  let text = source.replaceAll("\r\n", "\n");
  for (const edit of entry.changes) {
    if (text.split(edit.after).length === 2) text = text.replace(edit.after, edit.before);
  }
  return text;
}
