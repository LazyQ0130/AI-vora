import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { variableCode, type VariableCodeKey } from "../src/content/resources/python-variables";
import { checkVariableResult, variableExpectations } from "./python-variable-checks";
import { evidencePath } from "./evidence-path";

assert.equal(process.platform, "win32", "本专项如实标注Windows实测，不冒充macOS");
const root = mkdtempSync(path.join(os.tmpdir(), "aivora-p8-"));
const python = process.env.AIVORA_PYTHON ?? "python";
const identity = spawnSync(python, ["-c", "import sys,json; print(json.dumps({'executable':sys.executable,'prefix':sys.prefix,'version':sys.version.split()[0]}))"], { encoding: "utf8" });
assert.equal(identity.status, 0);
const base = JSON.parse(identity.stdout);
const shell = spawnSync("pwsh.exe", ["-NoProfile", "-Command", "$PSVersionTable.PSVersion.ToString()"], { encoding: "utf8" });
assert.equal(shell.status, 0);
const rows: Record<string, unknown>[] = [];
const sha = (s: string) => createHash("sha256").update(s).digest("hex");
function run(label: string, filename: string, source: string) {
  const target = path.join(root, filename);
  writeFileSync(target, source + "\n", "utf8");
  assert.equal(readFileSync(target, "utf8"), source + "\n", "磁盘内容与本次目标源码对应");
  const command = python === "python" ? `python .\\${filename}` : `& '${python.replaceAll("'", "''")}' .\\${filename}`;
  const result = spawnSync("pwsh.exe", ["-NoProfile", "-NonInteractive", "-Command", command + "\nexit $LASTEXITCODE"], { cwd: root, encoding: "utf8", timeout: 30_000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  assert.ifError(result.error);
  const observation = { exitCode: result.status, stdout: result.stdout.replaceAll("\r\n", "\n"), stderr: result.stderr.replaceAll("\r\n", "\n") };
  rows.push({ label, cwd: root, filename, savedSource: source, savedSha256: sha(source + "\n"), command, shellPid: result.pid, ...observation });
  return observation;
}
for (const key of Object.keys(variableCode) as VariableCodeKey[]) {
  const setup = variableExpectations[key].setup;
  const source = setup ? setup + "\n" + variableCode[key] : variableCode[key];
  checkVariableResult(key, run(key, `${key}.py`, source));
}
// 用同一文件保存改稿，证明执行的是本次磁盘内容，保留两次预测及实际观察。
const before = run("own-file-before", "my_shipping.py", 'shipping_step2 = "Fold cartons"\nprint(shipping_step2)\nshipping_step2 = "Seal cartons"\nprint(shipping_step2)');
assert.deepEqual(before, { exitCode: 0, stdout: "Fold cartons\nSeal cartons\n", stderr: "" });
const after = run("own-file-after", "my_shipping.py", 'shipping_step2 = "Fold cartons"\nprint(shipping_step2)\nshipping_step2 = "Stack cartons"\nprint(shipping_step2)');
assert.deepEqual(after, { exitCode: 0, stdout: "Fold cartons\nStack cartons\n", stderr: "" });
checkVariableResult("repaired", run("repair-same-file", "firstRead.py", variableCode.repaired));
checkVariableResult("firstRead", run("fresh-process-after-success", "firstRead.py", variableCode.firstRead));
for (const name of ["label2", "_label", "任务"]) {
  const result = run(`legal:${name}`, `legal-${rows.length}.py`, `${name} = "Ready"\nprint(${name})`);
  assert.deepEqual(result, { exitCode: 0, stdout: "Ready\n", stderr: "" });
}
for (const name of ["my plan", "1plan", "for", "class"]) {
  const result = run(`invalid:${name}`, `invalid-${rows.length}.py`, `${name} = "Ready"`);
  assert.equal(result.exitCode, 1); assert.equal(result.stdout, ""); assert.match(result.stderr, /SyntaxError/);
}
for (const [label, source, error] of [
  ["case-sensitive", 'task_name = "Ready"\nprint(Task_name)', "NameError"],
  ["missing-text-quotes", "task_name = Ready\nprint(task_name)", "NameError"],
  ["unpaired-quote", 'task_name = "Ready', "SyntaxError"],
]) {
  const result = run(label, `${label}.py`, source);
  assert.equal(result.exitCode, 1); assert.equal(result.stdout, ""); assert.ok(result.stderr.includes(error));
}
const redact = (s: string) => s.replaceAll(root, "<P8-LAB>").replaceAll(root.replaceAll("\\", "/"), "<P8-LAB>").replaceAll(base.prefix, "<BASE-PYTHON>").replaceAll(process.cwd(), "<REPOSITORY>").replaceAll("\r\n", "\n");
const report = { checkedAt: new Date().toISOString(), platform: process.platform, os: { type: os.type(), release: os.release() }, python: base, shell: `PowerShell ${shell.stdout.trim()}`, method: "每行记录为新PowerShell进程，保存.py后实际启动Python；所有预测见预解及独立断言", rows, independentPredictions: { before: ["Fold cartons", "Seal cartons"], after: ["Fold cartons", "Stack cartons"] }, allAssertionsPassed: true, macOS: "未实机验证" };
writeFileSync(evidencePath("PYTHON_RUNS.json"), JSON.stringify(report, (_k, value) => typeof value === "string" ? redact(value) : value, 2) + "\n");
console.log(`${rows.length} saved-file Windows runs passed, including genuine NameError, recovery and new-process replay.`);
