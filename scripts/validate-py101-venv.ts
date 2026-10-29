import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { environmentProbe, venvFiles, venvCommands } from "../src/content/resources/python-venv";

assert.equal(process.platform, "win32", "本工具当前仅声明Windows验证，macOS另需独立执行。");
const workspace = process.cwd(), evidence = path.join(workspace, "docs/py101-p3"), runtime = path.join(evidence, "runtime");
await mkdir(runtime, { recursive: true });
const redact = (text: string) => text.replaceAll(workspace, "<WORKSPACE>").replaceAll(workspace.replaceAll("\\", "/"), "<WORKSPACE>").replaceAll(process.env.USERPROFILE ?? "<unused-profile>", "<USER>");
const quote = (text: string) => "'" + text.replaceAll("'", "''") + "'";
type Run = { label: string; checkedAt: string; cwd: string; shell: string; command: string; stdout: string; stderr: string; exitCode: number | null; expected?: string };
const runs: Run[] = [];
function ps(label: string, cwd: string, command: string, allowFailure = false) {
  const result = spawnSync("pwsh.exe", ["-NoProfile", "-NonInteractive", "-Command", "$ErrorActionPreference='Stop'; [Console]::OutputEncoding=[Text.UTF8Encoding]::new($false); " + command], { cwd, encoding: "utf8", timeout: 120000 });
  assert.ifError(result.error);
  const row = { label, checkedAt: new Date().toISOString(), cwd: redact(cwd), shell: "PowerShell 7 on Windows -NoProfile", command: redact(command), stdout: redact(result.stdout), stderr: redact(result.stderr), exitCode: result.status };
  runs.push(row);
  if (!allowFailure) { assert.equal(result.status, 0, `${label}: ${result.stderr}`); assert.equal(result.stderr, "", label); }
  return result;
}
function fields(stdout: string) {
  const values = Object.fromEntries(stdout.trim().split(/\r?\n/).map(line => { const colon = line.indexOf(":"); assert.ok(colon > 0, line); return [line.slice(0, colon), line.slice(colon + 1).trim()]; }));
  assert.deepEqual(Object.keys(values), ["Interpreter", "Environment", "Base Python", "Version"]);
  return values;
}
const samePath = (a: string, b: string) => path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();
await writeFile(path.join(runtime, "observe_base.py"), environmentProbe);
// Windows PowerShell 5.1对native -c多行参数的引号处理不同，诊断用实际保存的文件。
const base = fields(ps("base-python", workspace, 'python ' + quote(path.join(runtime, "observe_base.py"))).stdout);
assert.ok(samePath(base.Environment, base["Base Python"])); assert.match(base.Version, /^3\.\d+\.\d+/);
ps("os-and-policy-read-only", workspace, '[Environment]::OSVersion.VersionString; $PSVersionTable.PSVersion.ToString(); Get-ExecutionPolicy -List | ConvertTo-Json');
const projects = [
  { name: "project-a", root: path.join(runtime, "python-projects/project-a"), file: "main.py", source: venvFiles["project-a/main.py"], output: "Project A A4\n" },
  { name: "project-b", root: path.join(runtime, "python-projects/project-b"), file: "main.py", source: venvFiles["project-b/main.py"], output: "Project B B6\n" },
  { name: "exercise-report", root: path.join(runtime, "workshop/report"), file: "check.py", source: venvFiles["workshop/report/check.py"], output: "Report R8\n" },
  { name: "exercise-label", root: path.join(runtime, "workshop/tools/label"), file: "tag.py", source: venvFiles["workshop/tools/label/tag.py"], output: "Label L9\n" },
];
for (const project of projects) {
  await mkdir(project.root, { recursive: true });
  await writeFile(path.join(project.root, project.file), project.source);
  await writeFile(path.join(project.root, "observe_env.py"), environmentProbe);
  const env = path.join(project.root, ".venv"), creationRecord = path.join(evidence, `CREATE_${project.name}.json`);
  if (!existsSync(env)) {
    ps(`create-${project.name}`, project.root, venvCommands.create.windows);
    await writeFile(creationRecord, JSON.stringify(runs.at(-1), null, 2) + "\n", { flag: "wx" });
  } else {
    assert.ok(existsSync(creationRecord), "拒绝复用来源不明的既有环境；换一个新练习目录。");
    const original = JSON.parse(await readFile(creationRecord, "utf8"));
    runs.push({ ...original, label: `${original.label} (保留首次创建记录)` });
  }
  assert.ok(existsSync(path.join(env, "Scripts/python.exe")));
  assert.ok(existsSync(path.join(env, "pyvenv.cfg")));
  ps(`inspect-${project.name}`, project.root, 'Get-Location; Get-ChildItem -Force; Get-Item .venv\\Scripts\\python.exe | Select-Object Name,Length');
  const result = ps(`run-${project.name}`, project.root, `& ".\\.venv\\Scripts\\python.exe" .\\${project.file}`);
  assert.equal(result.stdout.replaceAll("\r\n", "\n"), project.output);
  runs.at(-1)!.expected = project.output;
  const values = fields(ps(`probe-${project.name}`, project.root, venvCommands.probe.windows).stdout);
  assert.ok(samePath(values.Interpreter, path.join(env, "Scripts/python.exe")));
  assert.ok(samePath(values.Environment, env)); assert.ok(!samePath(values.Environment, values["Base Python"]));
  assert.ok(samePath(values["Base Python"], base["Base Python"])); assert.equal(values.Version, base.Version);
}
const [a, b, report, label] = projects;
const wrong = ps("wrong-env-same-script", a.root, venvCommands.wrong.windows);
assert.equal(wrong.stdout.split(/\r?\n/)[0], "Project A A4");
assert.ok(samePath(fields(wrong.stdout.split(/\r?\n/).slice(1).join("\n")).Environment, path.join(b.root, ".venv")));
const repaired = fields(ps("repair-to-project-a", a.root, venvCommands.probe.windows).stdout);
assert.ok(samePath(repaired.Environment, path.join(a.root, ".venv")));
const exerciseWrong = ps("exercise-wrong-env", report.root, '& "..\\tools\\label\\.venv\\Scripts\\python.exe" .\\check.py\n& "..\\tools\\label\\.venv\\Scripts\\python.exe" .\\observe_env.py');
assert.equal(exerciseWrong.stdout.split(/\r?\n/)[0], "Report R8");
assert.ok(samePath(fields(exerciseWrong.stdout.split(/\r?\n/).slice(1).join("\n")).Environment, path.join(label.root, ".venv")));
ps("exercise-repair-run", report.root, '& ".\\.venv\\Scripts\\python.exe" .\\check.py');
assert.ok(samePath(fields(ps("exercise-repair-probe", report.root, venvCommands.probe.windows).stdout).Environment, path.join(report.root, ".venv")));
const activation = ps("powershell-activate", a.root, venvCommands.activate.windows, true);
let successfulActivation = "PowerShell 7 on Windows";
if (activation.status === 0) {
  assert.ok(samePath(fields(activation.stdout).Environment, path.join(a.root, ".venv")));
  const afterDeactivate = ps("deactivate", a.root, '.\\.venv\\Scripts\\Activate.ps1\ndeactivate\npython .\\observe_env.py');
  assert.ok(samePath(fields(afterDeactivate.stdout).Environment, base.Environment));
  const oldTerminal = ps("activate-a-then-cd-b", a.root, '.\\.venv\\Scripts\\Activate.ps1\nSet-Location -LiteralPath ' + quote(b.root) + '\npython .\\observe_env.py');
  assert.ok(samePath(fields(oldTerminal.stdout).Environment, path.join(a.root, ".venv")));
} else {
  ps("policy-failure-direct-fallback", a.root, venvCommands.probe.windows);
  const cmdCommand = 'call ".venv\\Scripts\\activate.bat" && python observe_env.py && call deactivate.bat';
  const cmd = spawnSync("cmd.exe", ["/d", "/s", "/c", cmdCommand], { cwd: a.root, encoding: "utf8" });
  assert.ifError(cmd.error); assert.equal(cmd.status, 0, cmd.stderr);
  assert.ok(samePath(fields(cmd.stdout).Environment, path.join(a.root, ".venv")));
  runs.push({ label: "cmd-activation-fallback", checkedAt: new Date().toISOString(), cwd: redact(a.root), shell: "cmd.exe /d", command: cmdCommand, stdout: redact(cmd.stdout), stderr: redact(cmd.stderr), exitCode: cmd.status });
  successfulActivation = "cmd.exe activate.bat（PowerShell受限时的独立开发验证）";
}
assert.ok(samePath(fields(ps("new-shell-no-inherited-activation", b.root, 'python .\\observe_env.py').stdout).Environment, base.Environment));
ps("new-shell-direct-project-b", b.root, venvCommands.probe.windows);
const ignored = spawnSync("git", ["check-ignore", "--no-index", "-v", "--", ...projects.map(p => path.relative(workspace, path.join(p.root, ".venv/Scripts/python.exe")))], { cwd: workspace, encoding: "utf8" });
assert.equal(ignored.status, 0); assert.equal(ignored.stdout.trim().split(/\r?\n/).length, projects.length);
const tracked = spawnSync("git", ["ls-files", "--", "**/.venv/**"], { cwd: workspace, encoding: "utf8" });
assert.equal(tracked.stdout.trim(), "");
await writeFile(path.join(evidence, "PYTHON_ENV_RESULTS.json"), JSON.stringify({ checkedAt: new Date().toISOString(), platform: process.platform, base: Object.fromEntries(Object.entries(base).map(([k,v]) => [k, redact(v)])), successfulActivation, runs, gitIgnore: redact(ignored.stdout), trackedEnvironmentFiles: [], scope: "Windows实际执行；macOS官方文档核验，未实测。现成诊断不代表学生掌握import/sys。", redaction: "仅用<WORKSPACE>/<USER>替代真实目录前缀，其余路径关系与实际输出保持。" }, null, 2) + "\n");
console.log(`${runs.length}份Windows真实命令记录通过；${projects.length}个环境；${base.Version}；激活：${successfulActivation}`);
