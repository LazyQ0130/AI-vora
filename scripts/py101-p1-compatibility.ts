import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

type SourceChange = { path: string; before: string; afterSha256: string };
type ObjectChange = { id: string; before: unknown; afterSha256: string };
// 使用同一个登记器按新到旧撤销已批准修订；不为每轮再嵌套一个专用兼容器。
type RevisionPlan = { baseline: string; sources: SourceChange[]; lessons: ObjectChange[]; publications: ObjectChange[]; addedLessonIds: string[]; workspaceOnly: { path: string; workspaceSha256: string; repositorySha256: string }[]; protectedText: { path: string; baselineSha256: string; lfSha256: string }[] };
const plans = ["py101-p3", "py101-p2"].map(round => JSON.parse(readFileSync(new URL(`../docs/${round}/APPROVED_CHANGES.json`, import.meta.url), "utf8")) as RevisionPlan);
function revisions(throughBaseline?: string) {
  const index = plans.findIndex(plan => plan.baseline === throughBaseline);
  return index < 0 ? plans : plans.slice(0, index + 1);
}
const sources = JSON.parse(readFileSync(new URL("../docs/py101-p1/SOURCE_CHANGES.json", import.meta.url), "utf8")) as SourceChange[];
const sha = (source: string) => createHash("sha256").update(source).digest("hex");
function undoSource(entries: SourceChange[], path: string, source: string) {
  const entry = entries.find(row => row.path === path);
  return entry && sha(source.replaceAll("\r\n", "\n")) === entry.afterSha256 ? entry.before : source;
}
export const approvedPy101Additions = [...new Set(plans.flatMap(plan => plan.addedLessonIds))];
export function beforeApprovedPy101Source(path: string, source: string, throughBaseline?: string) {
  return revisions(throughBaseline).reduce((value, plan) => undoSource(plan.sources, path, value), source);
}
// 自动回归允许原工作区与干净检出两种精确版本；工作区审计脚本仍严格要求原始指纹。
export function protectedPy101FileMatches(path: string, bytes: Buffer, expected: string, throughBaseline?: string) {
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest === expected) return true;
  const text = bytes.toString("utf8");
  // Git检出可转换文本换行；二进制仍逐字节比较，绝不以UTF-8解码后的图像作摘要。
  const validText = !text.includes("\0") && Buffer.from(text).equals(bytes);
  const variants = (value: string) => { const lf = value.replaceAll("\r\n", "\n"); return [lf, lf.replaceAll("\n", "\r\n")]; };
  const matches = (value: string, target: string) => validText && variants(value).some(source => sha(source) === target);
  if (matches(text, expected)) return true;
  const relevant = revisions(throughBaseline);
  const portable = relevant.flatMap(plan => plan.protectedText).find(row => row.path === path && row.baselineSha256 === expected);
  if (portable && validText && sha(text.replaceAll("\r\n", "\n")) === portable.lfSha256) return true;
  const local = relevant.flatMap(plan => plan.workspaceOnly).find(row => row.path === path && row.workspaceSha256 === expected);
  if (local?.workspaceSha256 === expected && (local.repositorySha256 === digest || matches(text, local.repositorySha256))) return true;
  return matches(beforeApprovedPy101Source(path, text, throughBaseline), expected);
}
export function beforeApprovedPy101Object(kind: "lessons" | "publications", id: string, value: unknown, throughBaseline?: string) {
  return revisions(throughBaseline).reduce((current, plan) => {
    const entry = plan[kind].find(row => row.id === id);
    return entry && sha(JSON.stringify(current)) === entry.afterSha256 ? entry.before : current;
  }, value);
}
// 只有完整文件摘要命中才还原；未登记的任何附加修改必须继续暴露给旧保护测试。
export function beforePy101P1Source(path: string, source: string) {
  return undoSource(sources, path, beforeApprovedPy101Source(path, source));
}
