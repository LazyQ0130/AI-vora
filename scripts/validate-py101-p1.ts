import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathFiles, pathCommands } from "../src/content/resources/python-paths";
import { pythonScriptPathsLesson } from "../src/content/lessons/py101/script-paths";

assert.equal(process.platform, "win32", "本脚本提供真实Windows证据，不以其他平台冒充Windows或macOS");
const root = resolve("docs/py101-p1/runtime");
const shell = process.env.AIVORA_POWERSHELL ?? "pwsh";
const quote = (value: string) => `'${value.replaceAll("'", "''")}'`;
await mkdir(`${root}/shell-meta`, { recursive: true });
await mkdir(`${root}/delivery-task/work`, { recursive: true });
for (const [name, source] of Object.entries(pathFiles)) {
  const target = resolve(root, name);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, source);
}
// 独立预解：从题设目录逐段定位后，按原始文字/换行列出预期。
const expected: Record<keyof typeof pathCommands, { stdout: string; exit: number; target: string | null }> = {
  "root-missing": { stdout: "", exit: 2, target: null },
  "root-alpha": { stdout: "Alpha A1\n", exit: 0, target: "path-lab/alpha/run.py" },
  "alpha-current": { stdout: "Alpha A1\n", exit: 0, target: "path-lab/alpha/run.py" },
  "beta-current": { stdout: "Beta B2\n", exit: 0, target: "path-lab/beta/run.py" },
  "beta-alpha": { stdout: "Alpha A1\n", exit: 0, target: "path-lab/alpha/run.py" },
  "absolute-root": { stdout: "Alpha A1\n", exit: 0, target: "path-lab/alpha/run.py" },
  "absolute-beta": { stdout: "Alpha A1\n", exit: 0, target: "path-lab/alpha/run.py" },
  "space-unquoted": { stdout: "", exit: 2, target: null },
  "space-quoted": { stdout: "Space S3\n", exit: 0, target: "path-lab/my scripts/run.py" },
  "task-west": { stdout: "West W5\n", exit: 0, target: "route-task/west/check.py" },
  "task-east": { stdout: "East E4\n", exit: 0, target: "route-task/east/check.py" },
  "task-missing": { stdout: "", exit: 2, target: null },
};
const results: unknown[] = [];
async function run(name: string, cwd: string, command: string, stdout: string, exit: number, target: string | null) {
  const metadata = resolve(root, "shell-meta", `${name}.json`);
  // 真实终端命令照用教材文本；探针只记录调用前后位置和Python退出码，不替程序生成输出。
  const probe = `$py101Before = (Get-Location).Path\n${command}\n$py101Exit = $LASTEXITCODE\n$py101After = (Get-Location).Path\n$py101Meta = @{ before = $py101Before; after = $py101After; pythonExit = $py101Exit } | ConvertTo-Json\n[System.IO.File]::WriteAllText(${quote(metadata)}, $py101Meta)\nexit $py101Exit`;
  const actual = spawnSync(shell, ["-NoLogo", "-NoProfile", "-NonInteractive", "-Command", probe], { cwd: resolve(root, cwd), encoding: "utf8", timeout: 20000, env: { ...process.env, PYTHONIOENCODING: "utf-8", NO_COLOR: "1" } });
  assert.ifError(actual.error);
  assert.equal(actual.stdout.replaceAll("\r\n", "\n"), stdout, `${name}: stdout`);
  assert.equal(actual.status, exit, `${name}: exit`);
  if (exit) assert.match(actual.stderr, /can't open file|No such file/i);
  else assert.equal(actual.stderr, "", `${name}: stderr`);
  const locations = JSON.parse(await readFile(metadata, "utf8"));
  assert.equal(locations.before, resolve(root, cwd));
  assert.equal(locations.after, locations.before, "运行脚本不能冒充父终端cd");
  results.push({ name, shell, command, cwd: resolve(root, cwd), expectedTarget: target ? resolve(root, target) : null, expectedStdout: stdout, stdout: actual.stdout.replaceAll("\r\n", "\n"), stderr: actual.stderr.replaceAll("\r\n", "\n"), exitCode: actual.status, locations, passed: true });
}
for (const [name, scenario] of Object.entries(pathCommands)) {
  const oracle = expected[name as keyof typeof pathCommands];
  const actualCommand = scenario.windows.replace("C:\\Users\\你的用户名\\Documents", root);
  await run(name, scenario.cwd, actualCommand, oracle.stdout, oracle.exit, oracle.target);
}
const webResults = [];
for (const section of pythonScriptPathsLesson.sections) for (const block of section.blocks) if (block.type === "code" && block.language === "python") {
  assert.equal(block.code, pathFiles[block.filename as keyof typeof pathFiles]);
  const actual = spawnSync("python", [resolve(root, block.filename)], { encoding: "utf8" });
  const oracle: Record<string, string> = { "path-lab/alpha/run.py": "Alpha A1\n", "path-lab/beta/run.py": "Beta B2\n", "path-lab/my scripts/run.py": "Space S3\n", "route-task/east/check.py": "East E4\n", "route-task/west/check.py": "West W5\n", "delivery-task/my notes/ready.py": "Target T6\n" };
  assert.equal(actual.stdout.replaceAll("\r\n", "\n"), oracle[block.filename]); assert.equal(actual.status, 0); assert.equal(actual.stderr, "");
  webResults.push({ filename: block.filename, stdout: actual.stdout, stderr: actual.stderr, exitCode: actual.status, sameSource: true });
}
// 题一独立变化：只改west，预期只影响指向west的命令。
await writeFile(`${root}/route-task/west/check.py`, pathFiles["route-task/west/check.py"] + 'print("Change M8")\n');
await run("variation-west", "route-task/west", pathCommands["task-west"].windows, "West W5\nChange M8\n", 0, "route-task/west/check.py");
await run("variation-east-unchanged", "route-task/west", pathCommands["task-east"].windows, "East E4\n", 0, "route-task/east/check.py");
// 题二：同一新增目标、自选变化的一个开发用实例；不冒称学生提交。
await writeFile(`${root}/delivery-task/my notes/ready.py`, pathFiles["delivery-task/my notes/ready.py"] + 'print("Check Z9")\n');
await run("task2-unquoted", "delivery-task", "python .\\my notes\\ready.py", "", 2, null);
await run("task2-root-relative", "delivery-task", 'python ".\\my notes\\ready.py"', "Target T6\nCheck Z9\n", 0, "delivery-task/my notes/ready.py");
await run("task2-work-relative", "delivery-task/work", 'python "..\\my notes\\ready.py"', "Target T6\nCheck Z9\n", 0, "delivery-task/my notes/ready.py");
const absolute = `python "${resolve(root, "delivery-task/my notes/ready.py")}"`;
await run("task2-root-absolute", "delivery-task", absolute, "Target T6\nCheck Z9\n", 0, "delivery-task/my notes/ready.py");
await run("task2-work-absolute", "delivery-task/work", absolute, "Target T6\nCheck Z9\n", 0, "delivery-task/my notes/ready.py");
// 相同输出不能证明相同文件：另一份文件复制相同文本，仍是另一目标。
await mkdir(`${root}/mirror`, { recursive: true });
await writeFile(`${root}/mirror/run.py`, pathFiles["path-lab/alpha/run.py"]);
await run("same-text-other-file", "mirror", "python run.py", "Alpha A1\n", 0, "mirror/run.py");
const environment = spawnSync(shell, ["-NoProfile", "-Command", "python --version\n$PSVersionTable.PSVersion.ToString()"], { encoding: "utf8" });
await writeFile("docs/py101-p1/PYTHON_EXECUTION.json", JSON.stringify({ checkedAt: new Date().toISOString(), platform: process.platform, environment: environment.stdout.trim(), expectedMethod: "运行前依据目录行走与字面文本预解；在真实PowerShell执行网页同源命令并比较；不使用脚本内部伪造路径输出", results, webResults, macOS: "未实测，仅官方文档核对；macOS命令未在Windows伪运行", note: "证据文件仅新增/重建明确路径，不进行递归清理；变体是开发验收输入，不是学生提交" }, null, 2) + "\n");
console.log(`${results.length}个真实PowerShell路径实验、${webResults.length}个同源网页Python文件验证通过。`);
