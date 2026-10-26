// 原1.1核验入口随r2更新，历史结果保留在原证据目录。
process.env.AIVORA_EVIDENCE_DIR ??= "docs/ai000-v2";
process.argv.push("--lesson", "AI000-C01-L01");
await import("./review-ai000-v2");
export {};
