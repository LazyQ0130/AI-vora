import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const sources = JSON.parse(readFileSync(new URL("../docs/py101-p1/SOURCE_CHANGES.json", import.meta.url), "utf8")) as { path: string; before: string; afterSha256: string }[];
// 仅历史测试使用；只有本轮完整文件摘要命中，才撤销新增接入。额外变化原样保留。
export function beforePy101P1Source(path: string, source: string) {
  const entry = sources.find(row => row.path === path), normalized = source.replaceAll("\r\n", "\n");
  return entry && createHash("sha256").update(normalized).digest("hex") === entry.afterSha256 ? entry.before : source;
}
