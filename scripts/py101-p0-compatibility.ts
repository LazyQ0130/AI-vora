import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { beforeR3Source as originalBeforeR3Source } from "./ai000-r3-compatibility";
export { beforeR3Revision } from "./ai000-r3-compatibility";

const sources = JSON.parse(readFileSync(new URL("../docs/py101-p0/SOURCE_CHANGES.json", import.meta.url), "utf8")) as { path: string; before: string; afterSha256: string }[];
// 仅测试/历史核验使用。全文件命中本轮摘要才撤销新增接入；额外修改原样返回。
export function beforePy101Source(path: string, source: string) {
  const entry = sources.find(file => file.path === path);
  const lf = source.replaceAll("\r\n", "\n");
  return entry && createHash("sha256").update(lf).digest("hex") === entry.afterSha256 ? entry.before : source;
}
export function beforeR3Source(path: string, source: string) {
  return originalBeforeR3Source(path, beforePy101Source(path, source));
}
