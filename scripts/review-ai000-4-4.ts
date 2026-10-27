// 4.4开发轮的历史证据保留于docs/ai000-4-4；不再按13/13接入判定当前教材。
// 兼容旧命令入口，委托当前只允许移除登记场景图的精确检查，不覆盖旧输出。
import { execFileSync } from "node:child_process";
console.log("4.4历史开发轮已归档，执行当前教学可视化检查。");
execFileSync(process.execPath,["--import","tsx","scripts/review-ai000-visual-refinement.ts"],{stdio:"inherit"});
