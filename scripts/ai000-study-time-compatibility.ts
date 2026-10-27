import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// 旧快照保护其余21行，仅放行4.1–4.3已记录的练习区间调整，不改历史证据。
export function assertStudyTimeChanges(previousHash: string) {
  const source = readFileSync("src/content/ai000-study-time.ts", "utf8");
  const current = "[[10,16,16,24,0,0],[12,18,14,20,0,0],[12,18,16,24,0,0],[10,16,8,14,0,0]]";
  const previous = "[[10,16,8,14,0,0],[12,18,10,16,0,0],[12,18,10,16,0,0],[10,16,8,14,0,0]]";
  assert.equal(source.split(current).length, 2, "只允许第四章4.1–4.3已记录的学时调整");
  assert.equal(createHash("sha256").update(source.replace(current, previous)).digest("hex"), previousHash, "其他学时与原文件保持不变");
}
