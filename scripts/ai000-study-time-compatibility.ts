import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// 旧快照仍保护其他23行；仅放行本轮4.1练习区间的已记录调整，不重写历史证据。
export function assertStudyTime41Only(previousHash: string) {
  const source = readFileSync("src/content/ai000-study-time.ts", "utf8");
  const current = "[[10,16,16,24,0,0],[12,18,10,16,0,0],[12,18,10,16,0,0],[10,16,8,14,0,0]]";
  const previous = "[[10,16,8,14,0,0],[12,18,10,16,0,0],[12,18,10,16,0,0],[10,16,8,14,0,0]]";
  assert.equal(source.split(current).length, 2, "只允许第四章首行这一处学时调整");
  assert.equal(createHash("sha256").update(source.replace(current, previous)).digest("hex"), previousHash, "其他学时与原文件保持不变");
}
