import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { reproductionCode as code, reproductionCommands as commands } from "../src/content/resources/python-reproduction";

const evidence = process.env.AIVORA_EVIDENCE_DIR ?? "docs/py101-p5";
const root = process.env.AIVORA_REPRO_LAB ?? (await readFile(`${evidence}/machine/lab-path.txt`, "utf8")).trim();
assert.ok(path.isAbsolute(root) && path.basename(root).startsWith("aivora-p5-"), "只使用本轮明确归属的外部练习目录");
const base = spawnSync("python", ["-c", "import sys,json; print(json.dumps({'executable':sys.executable,'prefix':sys.prefix,'version':sys.version.split()[0]}))"], { encoding: "utf8" });
assert.equal(base.status, 0); const baseInfo = JSON.parse(base.stdout);
const shell = spawnSync("pwsh.exe", ["-NoProfile", "-NonInteractive", "-Command", "$PSVersionTable.PSVersion.ToString()"], { encoding: "utf8" });
assert.equal(shell.status, 0);
const redact = (text: string) => text.replaceAll(root.replaceAll("\\", "\\\\"), "<P5-LAB>").replaceAll(root, "<P5-LAB>").replaceAll(root.replaceAll("\\", "/"), "<P5-LAB>").replaceAll(baseInfo.prefix, "<BASE-PYTHON>").replaceAll(baseInfo.prefix.replaceAll("\\", "/"), "<BASE-PYTHON>").replaceAll("\r\n", "\n");
const notice = path.join(root, "repro-lab/notice-tool"), target = path.join(root, "handoff-lab/target");
await mkdir(path.join(notice, "scripts"), { recursive: true });
await writeFile(path.join(notice, "scripts/notice.py"), code.notice + "\n");
await writeFile(path.join(target, "run.py"), code.target + "\n");
await writeFile(path.join(target, "observe_env.py"), code.environmentProbe);
const rows: { label: string; cwd: string; command: string; shell: string; shellPid: number; stdout: string; stderr: string; exitCode: number | null }[] = [];
function run(label: string, cwd: string, command: string) {
  // 每次是真实独立PowerShell进程；exit保留最后外部程序状态，非Python模拟路径故障。
  const r = spawnSync("pwsh.exe", ["-NoProfile", "-NonInteractive", "-Command", command + "\nexit $LASTEXITCODE"], { cwd, encoding: "utf8", timeout: 30_000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  assert.ifError(r.error);
  const row = { label, cwd, command, shell: `PowerShell ${shell.stdout.trim()}`, shellPid: r.pid, stdout: r.stdout, stderr: r.stderr, exitCode: r.status };
  rows.push(row); return row;
}
const mainIdentity = run("author-main-interpreter-observation", notice, '& ".\\.venv\\Scripts\\python.exe" -c ' + "'" + code.environmentProbe.replaceAll("'", "''") + "'");
assert.equal(mainIdentity.exitCode, 0);
assert.ok(mainIdentity.stdout.includes(path.join(notice, ".venv/Scripts/python.exe")));
assert.ok(mainIdentity.stdout.includes(`Environment: ${path.join(notice, ".venv")}`));
for (const session of ["initial", "new-shell-replay"]) {
  const bad = run(`${session}:wrong-script-argument`, notice, commands.badPath.windows);
  assert.notEqual(bad.exitCode, 0); assert.equal(bad.stdout.trim(), ""); assert.match(bad.stderr, /can't open file[\s\S]*notice\.py[\s\S]*No such file or directory/i);
  const good = run(`${session}:correct-script-argument`, notice, commands.goodPath.windows);
  assert.equal(good.exitCode, 0); assert.equal(good.stdout.trim(), "Notice N8"); assert.equal(good.stderr, "");
  for (const phase of ["wrong", "right"] as const) {
    const output = run(`${session}:${phase}-environment-program`, target, commands[phase === "wrong" ? "wrongRun" : "rightRun"].windows);
    assert.equal(output.exitCode, 0); assert.equal(output.stdout.trim(), "Target R9"); assert.equal(output.stderr, "");
    const diagnostic = run(`${session}:${phase}-environment-diagnostic`, target, commands[phase === "wrong" ? "wrongProbe" : "rightProbe"].windows);
    assert.equal(diagnostic.exitCode, 0); assert.equal(diagnostic.stderr, "");
    const expected = path.join(root, `handoff-lab/${phase === "wrong" ? "other" : "target"}/.venv`);
    assert.ok(diagnostic.stdout.includes(`Interpreter: ${path.join(expected, "Scripts/python.exe")}`));
    assert.ok(diagnostic.stdout.includes(`Environment: ${expected}`));
  }
}
// 额外验证学生立即读取退出状态的命令，不将Shell回显混同程序stdout。
const exitObservation = run("immediate-exit-observation", notice, commands.badPath.windows + "\n" + commands.exit.windows);
const initialFailure = rows.find(row => row.label === "initial:wrong-script-argument")!;
assert.equal(exitObservation.stdout.trim(), String(initialFailure.exitCode));
const raw = { checkedAt: new Date().toISOString(), platform: process.platform, operatingSystem: { type: os.type(), release: os.release(), version: os.version() }, base: baseInfo, driver: "spawnSync pwsh -NoProfile -NonInteractive; each command in fresh Shell; wrapper exits LASTEXITCODE", rows, expected: { failure: "file not found before source execution", repaired: "Notice N8", wrongAndRightProgram: "Target R9", wrongIdentity: "other/.venv", restoredIdentity: "target/.venv" }, allAssertionsPassed: true };
await writeFile(`${evidence}/machine/cli-raw.json`, JSON.stringify(raw, null, 2) + "\n");
await writeFile(`${evidence}/CLI_RESULTS.json`, JSON.stringify(raw, (_key, value) => typeof value === "string" ? redact(value) : value, 2) + "\n");
console.log(`${rows.length} real PowerShell processes checked; failure, recovery and independent replay passed. Failure exit=${initialFailure.exitCode}.`);
