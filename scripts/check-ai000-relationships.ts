// 原2.1核验入口随r2更新，不再套用r1的考核和单课数量假设。
process.env.AIVORA_EVIDENCE_DIR ??= "docs/ai000-v2";
process.argv.push("--lesson", "AI000-C02-L01");
await import("./review-ai000-v2");
export {};
