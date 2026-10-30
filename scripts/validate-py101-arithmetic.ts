import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { arithmeticCode, arithmeticBlockNames, arithmeticSetups, type ArithmeticKey } from "../src/content/resources/python-arithmetic";
import { evidencePath } from "./evidence-path";

// 起草前独立手算的预期；不读取教材输出框，不以Python运行值生成预期。
export const arithmeticExpected: Record<ArithmeticKey, string> = {
  multiply: "12\n", total: "16\n", subtract: "14\n", precedence: "16\n16\n", grouping: "24\n", moreBoxes: "24\n",
  division: "4.0\n<class 'float'>\n", nonIntegral: "3.5\n", leftGrouping: "8.0\n2.0\n9\n5\n",
  main: "16\n24\n4.0\n", revise: "16\n14\n4.0\n", changedMain: "24\n40\n6.0\n", changedRevise: "24\n22\n6.0\n", zeroDivide: "",
  ownCalculate: "33\n29\n", ownChanged: "45\n41\n", ownGrouping: "21\n45\n7.0\n", ownRepaired: "21\n21\n7.0\n",
};
export function arithmeticKey(filename: string, source: string): ArithmeticKey {
  const key = (Object.keys(arithmeticCode) as ArithmeticKey[]).find(key => arithmeticBlockNames[key] === filename);
  assert.ok(key, `未登记的表达式课Python块：${filename}`);
  assert.equal(source, arithmeticCode[key], `表达式课源码不一致：${filename}`);
  return key;
}
export function checkArithmeticResult(key: ArithmeticKey, result: { exitCode: number | null; stdout: string; stderr: string }) {
  assert.equal(result.stdout.replaceAll("\r\n", "\n"), arithmeticExpected[key], key);
  assert.equal(result.exitCode, key === "zeroDivide" ? 1 : 0, key);
  if (key === "zeroDivide") assert.match(result.stderr, /(?:^|\n)ZeroDivisionError: division by zero(?:\r?\n|$)/, key);
  else assert.equal(result.stderr, "", key);
}
export function runArithmeticExample(filename: string, source: string) {
  const key = arithmeticKey(filename, source), setup = arithmeticSetups[key] ?? "";
  const args = ["-c", setup ? setup + "\n" + source : source];
  const result = spawnSync(process.env.AIVORA_PYTHON ?? "python", args, { encoding: "utf8", timeout: 30_000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  assert.ifError(result.error);
  const observation = { exitCode: result.status, stdout: result.stdout, stderr: result.stderr };
  checkArithmeticResult(key, observation);
  return { key, executionMode: key === "zeroDivide" ? "controlled-error" : setup ? "ordered-fragment" : "complete-program", setup, expectedStdout: arithmeticExpected[key], expectedExitCode: key === "zeroDivide" ? 1 : 0, ...(key === "zeroDivide" ? { expectedError: "ZeroDivisionError" } : {}), args, ...observation };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.equal(process.platform, "win32", "作者专项仅声称Windows实际运行");
  const root = mkdtempSync(path.join(os.tmpdir(), "aivora-p10-")), python = process.env.AIVORA_PYTHON ?? "python";
  const identity = spawnSync(python, ["-c", "import sys,json; print(json.dumps({'executable':sys.executable,'prefix':sys.prefix,'version':sys.version.split()[0]}))"], { encoding: "utf8" });
  assert.equal(identity.status, 0); const base = JSON.parse(identity.stdout);
  const shell = spawnSync("pwsh.exe", ["-NoProfile", "-Command", "$PSVersionTable.PSVersion.ToString()"], { encoding: "utf8" });
  assert.equal(shell.status, 0);
  const rows: Record<string, unknown>[] = [];
  function run(label: string, filename: string, source: string) {
    const savedSource = source + "\n", target = path.join(root, filename);
    writeFileSync(target, savedSource, "utf8"); assert.equal(readFileSync(target, "utf8"), savedSource);
    const entry = python === "python" ? "python" : `& '${python.replaceAll("'", "''")}'`;
    const command = `${entry} '.\\${filename}'`;
    const result = spawnSync("pwsh.exe", ["-NoProfile", "-NonInteractive", "-Command", command + "\nexit $LASTEXITCODE"], { cwd: root, encoding: "utf8", timeout: 30_000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
    assert.ifError(result.error);
    const observation = { exitCode: result.status, stdout: result.stdout.replaceAll("\r\n", "\n"), stderr: result.stderr.replaceAll("\r\n", "\n") };
    rows.push({ label, filename, cwd: root, command, shellPid: result.pid, savedSource: source, savedSha256: createHash("sha256").update(savedSource).digest("hex"), ...observation });
    return observation;
  }
  for (const key of Object.keys(arithmeticCode) as ArithmeticKey[]) {
    const setup = arithmeticSetups[key], name = arithmeticBlockNames[key].split(" · ")[0];
    checkArithmeticResult(key, run(key, name.endsWith(".py") ? name : key + ".py", setup ? setup + "\n" + arithmeticCode[key] : arithmeticCode[key]));
  }
  const success = (label: string, filename: string, source: string, stdout: string) => assert.deepEqual(run(label, filename, source), { exitCode: 0, stdout, stderr: "" });
  success("follow-appends", "follow_boxes.py", [arithmeticCode.total, arithmeticCode.subtract, arithmeticCode.grouping, arithmeticCode.division].join("\n"), "16\n14\n24\n4.0\n<class 'float'>\n");
  success("saved-before", "my_boxes.py", arithmeticCode.revise, "16\n14\n4.0\n");
  success("saved-after", "my_boxes.py", arithmeticCode.changedRevise, "24\n22\n6.0\n");
  const cards = "basket_count = 4\nper_basket = 7\nloose_cards = 2\ntaken_cards = 5\ntotal_cards = basket_count * per_basket + loose_cards\nremaining_cards = total_cards - taken_cards\nprint(total_cards)\nprint(remaining_cards)";
  success("new-card-before", "cards.py", cards, "30\n25\n");
  success("new-card-after", "cards.py", cards.replace("per_basket = 7", "per_basket = 8"), "34\n29\n");
  success("new-grouping", "stickers.py", "box_total = 5\nper_box = 2\nloose_stickers = 5\nall_stickers = box_total * per_box + loose_stickers\nprint(all_stickers)\nprint((box_total + loose_stickers) * per_box)\nprint(all_stickers / box_total)", "15\n20\n3.0\n");
  for (const [label, source] of [["math-multiply-symbol", "print(4 × 3)"], ["missing-multiply", "print(4 3)"]]) {
    const actual = run(label, label + ".py", source);
    assert.equal(actual.exitCode, 1); assert.equal(actual.stdout, ""); assert.match(actual.stderr, /SyntaxError/);
  }
  const report = { checkedAt: new Date().toISOString(), platform: process.platform, os: { type: os.type(), release: os.release() }, python: base, shell: `PowerShell ${shell.stdout.trim()}`, method: "保存.py核对磁盘内容，每次独立PowerShell进程启动Python；stdout/stderr换行统一LF", rows, allAssertionsPassed: true, macOS: "仅文档命令核对，未实机运行" };
  writeFileSync(path.join(root, "raw-runs.json"), JSON.stringify(report, null, 2) + "\n");
  const redact = (s: string) => s.replaceAll(root, "<P10-LAB>").replaceAll(root.replaceAll("\\", "/"), "<P10-LAB>").replaceAll(base.prefix, "<BASE-PYTHON>").replaceAll(process.cwd(), "<REPOSITORY>");
  writeFileSync(evidencePath("PYTHON_RUNS.json"), JSON.stringify(report, (_k, v) => typeof v === "string" ? redact(v) : v, 2) + "\n");
  console.log(`${rows.length} Windows saved-file runs passed; controlled ZeroDivisionError/SyntaxError preserved.`);
}
