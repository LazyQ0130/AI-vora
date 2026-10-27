import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// 逐项反向撤销已记录的4.1–4.4和5.1练习区间调整，其余19行仍作全文摘要保护。
export function assertStudyTimeChanges(previousHash: string) {
  const source = readFileSync("src/content/ai000-study-time.ts", "utf8");
  const current = "[[10,16,16,24,0,0],[12,18,14,20,0,0],[12,18,16,24,0,0],[10,16,14,22,0,0]]";
  const previous = "[[10,16,8,14,0,0],[12,18,10,16,0,0],[12,18,10,16,0,0],[10,16,8,14,0,0]]";
  assert.equal(source.split(current).length, 2, "只允许第四章4.1–4.4已记录的学时调整");
  const chapterFive = "[[10,16,24,36,0,0],[10,16,8,14,0,0],[10,16,8,14,0,0],[10,16,8,14,0,0],[10,16,8,14,0,0]]";
  assert.equal(source.split(chapterFive).length, 2, "仅放行5.1已记录的24–36分钟，5.2–5.5不变");
  const reversed = source.replace(current, previous).replace(chapterFive, chapterFive.replace("24,36", "8,14")).replaceAll("\r\n", "\n");
  assert.ok([reversed,reversed.replaceAll("\n","\r\n")].some(text=>createHash("sha256").update(text).digest("hex")===previousHash), "其他学时与原文件保持不变");
}
