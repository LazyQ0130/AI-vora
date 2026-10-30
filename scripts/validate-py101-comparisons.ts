import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { comparisonCode, comparisonBlockNames, comparisonSetups, type ComparisonKey } from "../src/content/resources/python-comparisons";
import { evidencePath } from "./evidence-path";

// 事先按整数关系独立推演，不从教材输出或执行结果生成预期。
export const comparisonExpected: Record<ComparisonKey, string> = {
  basic: "True\n", saveResult: "True\n", equalNot: "False\nTrue\n", assignCompare: "False\nTrue\n", greater: "True\nTrue\nFalse\n",
  main: "True\nFalse\nTrue\n", boundaryLow: "True\nTrue\nFalse\n", boundaryEqual: "False\nTrue\nTrue\n", boundaryHigh: "False\nFalse\nFalse\n",
  allAtCapacity: "At capacity\nFalse\nTrue\nFalse\nTrue\nTrue\nFalse\n", ownCompare: "True\nFalse\nTrue\n",
  ownBoundaryLow: "True\nTrue\nFalse\n", ownBoundaryEqual: "False\nTrue\nTrue\n", ownBoundaryHigh: "False\nFalse\nTrue\n",
};
export function comparisonKey(filename: string, source: string): ComparisonKey {
  const key = (Object.keys(comparisonCode) as ComparisonKey[]).find(k => comparisonBlockNames[k] === filename);
  assert.ok(key, `未登记的比较课Python块：${filename}`); assert.equal(source, comparisonCode[key], `比较课源码不一致：${filename}`); return key;
}
export function checkComparisonResult(key: ComparisonKey, result: { exitCode: number | null; stdout: string; stderr: string }) {
  assert.equal(result.exitCode, 0, key); assert.equal(result.stderr, "", key); assert.equal(result.stdout.replaceAll("\r\n", "\n"), comparisonExpected[key], key);
}
export function runComparisonExample(filename: string, source: string) {
  const key = comparisonKey(filename, source), setup = comparisonSetups[key] ?? "", args = ["-c", setup ? setup + "\n" + source : source];
  const result = spawnSync(process.env.AIVORA_PYTHON ?? "python", args, { encoding: "utf8", timeout: 30_000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  assert.ifError(result.error); const observation = { exitCode: result.status, stdout: result.stdout, stderr: result.stderr }; checkComparisonResult(key, observation);
  return { key, executionMode: setup ? "ordered-fragment" : "complete-program", setup, expectedStdout: comparisonExpected[key], args, ...observation };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.equal(process.platform, "win32", "作者专项仅声称Windows实跑");
  const root = mkdtempSync(path.join(os.tmpdir(), "aivora-p11-")), python = process.env.AIVORA_PYTHON ?? "python";
  const identity = spawnSync(python, ["-c", "import sys,json; print(json.dumps({'executable':sys.executable,'prefix':sys.prefix,'version':sys.version.split()[0]}))"], { encoding: "utf8" });
  assert.equal(identity.status, 0); const base = JSON.parse(identity.stdout);
  const shell = spawnSync("pwsh.exe", ["-NoProfile", "-Command", "$PSVersionTable.PSVersion.ToString()"], { encoding: "utf8" }); assert.equal(shell.status, 0);
  const rows: Record<string, unknown>[] = [];
  function run(label: string, filename: string, source: string) {
    const savedSource = source + "\n", target = path.join(root, filename); writeFileSync(target, savedSource, "utf8"); assert.equal(readFileSync(target, "utf8"), savedSource);
    const entry = python === "python" ? "python" : `& '${python.replaceAll("'", "''")}'`, command = `${entry} '.\\${filename}'`;
    const result = spawnSync("pwsh.exe", ["-NoProfile", "-NonInteractive", "-Command", command + "\nexit $LASTEXITCODE"], { cwd: root, encoding: "utf8", timeout: 30_000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } }); assert.ifError(result.error);
    const actual = { exitCode: result.status, stdout: result.stdout.replaceAll("\r\n", "\n"), stderr: result.stderr.replaceAll("\r\n", "\n") };
    rows.push({ label, filename, cwd: root, command, shellPid: result.pid, savedSource: source, savedSha256: createHash("sha256").update(savedSource).digest("hex"), ...actual }); return actual;
  }
  for (const key of Object.keys(comparisonCode) as ComparisonKey[]) {
    const setup = comparisonSetups[key], name = comparisonBlockNames[key].split(" · ")[0];
    checkComparisonResult(key, run(key, name.endsWith(".py") ? name : key + ".py", setup ? setup + "\n" + comparisonCode[key] : comparisonCode[key]));
  }
  const success = (label: string, filename: string, code: string, stdout: string) => assert.deepEqual(run(label, filename, code), { exitCode: 0, stdout, stderr: "" });
  success("follow-appends", "follow_capacity.py", [comparisonCode.basic, comparisonCode.saveResult, comparisonCode.equalNot].join("\n"), "True\nTrue\nFalse\nTrue\n");
  success("stored-bool-type", "stored_type.py", comparisonCode.main + "\nprint(type(within_limit))", "True\nFalse\nTrue\n<class 'bool'>\n");
  success("literal-predictions", "literal_comparisons.py", "print(5 <= 6)\nprint(5 == 6)\nprint(5 != 6)\nprint(5 < 6)\nprint(6 <= 6)\nprint(6 < 6)\nprint(7 <= 6)\nprint(7 > 6)\nprint(7 >= 6)", "True\nFalse\nTrue\nTrue\nTrue\nFalse\nFalse\nTrue\nTrue\n");
  success("new-equal-context", "tool_tray.py", "tool_total = 8\ntray_spaces = 8\nprint(tool_total <= tray_spaces)\nprint(tool_total == tray_spaces)\nprint(tool_total != tray_spaces)", "True\nTrue\nFalse\n");
  const unseen = "stock_total = 13\nshelf_limit = 15\nprint(stock_total < shelf_limit)\nprint(stock_total <= shelf_limit)\nprint(stock_total >= shelf_limit)";
  success("new-boundary-low", "new_boundary.py", unseen, "True\nTrue\nFalse\n");
  success("new-boundary-equal", "new_boundary.py", unseen.replace("stock_total = 13", "stock_total = 15"), "False\nTrue\nTrue\n");
  success("new-boundary-high", "new_boundary.py", unseen.replace("stock_total = 13", "stock_total = 18"), "False\nFalse\nTrue\n");
  const report = { checkedAt: new Date().toISOString(), platform: process.platform, os: { type: os.type(), release: os.release() }, python: base, shell: `PowerShell ${shell.stdout.trim()}`, method: "每轮保存.py核对磁盘内容；固定限制仅改实际值，独立PowerShell进程完整运行；stdout换行统一LF", rows, allAssertionsPassed: true, macOS: "仅文档命令核对，未实机运行" };
  writeFileSync(path.join(root, "raw-runs.json"), JSON.stringify(report, null, 2) + "\n");
  const redact = (s: string) => s.replaceAll(root, "<P11-LAB>").replaceAll(root.replaceAll("\\", "/"), "<P11-LAB>").replaceAll(base.prefix, "<BASE-PYTHON>").replaceAll(process.cwd(), "<REPOSITORY>");
  writeFileSync(evidencePath("PYTHON_RUNS.json"), JSON.stringify(report, (_k,v) => typeof v === "string" ? redact(v) : v, 2) + "\n");
  console.log(`${rows.length} Windows saved-file runs passed; three boundary states, assignment/equality and all six comparisons verified.`);
}
