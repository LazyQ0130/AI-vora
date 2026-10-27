import { withoutAi000Illustrations } from "./ai000-illustration-compatibility";
import assert from "node:assert/strict";
import type { Lesson } from "../src/content/models";

// 4.1仅允许本轮审定的学生端说明变更，目标、数值、锚点及核心任务保持。
const allowed41Paths = new Set([
  "sections.0.blocks.0.text", "sections.0.blocks.2.caption",
  "sections.3.blocks.4.alt", "sections.3.blocks.4.caption", "sections.3.blocks.5.text",
  "sections.6.blocks.0.text", "sections.6.blocks.1.text", "sections.6.blocks.2.prompt",
  "sections.6.blocks.2.solution.1", "sections.6.blocks.2.solution.2",
  "sections.6.blocks.2.rubric.0", "sections.6.blocks.2.rubric.3",
  "sections.7.blocks.0.text", "sections.7.blocks.1.caption", "sections.7.blocks.3.caption",
  "references.0.note", "references.1.note", "references.2.note", "references.3.note",
]);

export function contentDifferences(before: unknown, after: unknown, path = ""): { path: string; before: unknown; after: unknown }[] {
  if (JSON.stringify(before) === JSON.stringify(after)) return [];
  if (before && after && typeof before === "object" && typeof after === "object") {
    const a = before as Record<string, unknown>, b = after as Record<string, unknown>;
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(key => contentDifferences(a[key], b[key], path ? `${path}.${key}` : key));
  }
  return [{ path, before, after }];
}

export function assertEditorialRefinement41(before: Lesson, after: Lesson) {
  assert.equal(before.id, "AI000-C04-L01");
  assert.equal(after.contentVersion, 1);
  const differences = contentDifferences(before, withoutAi000Illustrations(after));
  for (const difference of differences) assert.ok(allowed41Paths.has(difference.path), `4.1未授权变更：${difference.path}`);
  assert.ok(differences.length > 0, "应有真实的学生端语言精修");
  return differences;
}
