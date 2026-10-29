import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const sha = (v: string) => createHash("sha256").update(v).digest("hex");
type Entry = { id: string; before: unknown; afterSha256: string };
const changes = JSON.parse(readFileSync(new URL("../docs/ai000-r3/APPROVED_CHANGES.json", import.meta.url), "utf8")) as {
  lessons: Entry[]; publications: Entry[];
  sources: { path: string; before: string; afterSha256: string }[];
};

// 历史断言只接受完整命中登记新稿摘要的对象；任何额外修改都不逆转，继续由旧全文断言拒绝。
// 此辅助不用于冻结审稿包核验，也不参与运行时内容或进度读取。
export function beforeR3Revision<T>(value: T): T {
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  const entry = (record.id ? changes.lessons : changes.publications).find(e => e.id === (record.id ?? record.lessonId));
  return entry && sha(JSON.stringify(value)) === entry.afterSha256 ? structuredClone(entry.before) as T : value;
}

export function beforeR3Source(path: string, source: string) {
  const entry = changes.sources.find(e => e.path === path);
  const lf = source.replaceAll("\r\n", "\n");
  return entry && sha(lf) === entry.afterSha256 ? entry.before : source;
}
