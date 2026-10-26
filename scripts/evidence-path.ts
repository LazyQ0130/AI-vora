import { mkdirSync } from "node:fs";
import { join } from "node:path";

// 每轮可另存证据，默认仍兼容既有命令及历史文件名。
export function evidencePath(filename: string) {
  const directory = process.env.AIVORA_EVIDENCE_DIR ?? "docs";
  mkdirSync(directory, { recursive: true });
  return join(directory, filename);
}
