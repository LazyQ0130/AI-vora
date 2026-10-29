import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { editorFiles } from "../src/content/resources/python-editor";

const root = path.resolve("docs/py101-p2/runtime/terminal-lab");
await mkdir(path.join(root, "other"), { recursive: true });
await mkdir(path.join(root, "empty"), { recursive: true });
const runs: object[] = [];
function run(label: string, cwd: string, args: string[], expected: string, success = true) {
  const result = spawnSync("python", args, { cwd, encoding: "utf8" });
  assert.ifError(result.error);
  const stdout = result.stdout.replaceAll("\r\n", "\n");
  assert.equal(stdout, expected, label);
  assert.equal(result.status === 0, success, label);
  if (success) assert.equal(result.stderr, "", label);
  else assert.match(result.stderr, /can't open file|No such file/i);
  runs.push({ label, cwd, command: ["python", ...args], stdout: result.stdout, stderr: result.stderr, exitCode: result.status });
  return result.stdout;
}
await writeFile(path.join(root, "main.py"), editorFiles["main.initial.py"]);
run("initial-disk", root, ["main.py"], "Draft A1\n");
// 独立终端机制重算；真实未保存缓冲区实验见GUI_DIRTY.json，不用此变量冒充GUI。
assert.equal(await readFile(path.join(root, "main.py"), "utf8"), editorFiles["main.initial.py"]);
await writeFile(path.join(root, "main.py"), editorFiles["main.py"]);
run("saved-revision", root, ["main.py"], "Ready B2\nSaved copy\n");
for (const name of ["notes.py", "other/main.py", "message.py", "message.example.py"] as const) await writeFile(path.join(root, name), editorFiles[name]);
run("wrong-file", root, ["notes.py"], "Notes N4\n");
run("same-name-wrong-target", path.join(root, "other"), ["main.py"], "Other folder C3\n");
run("relative-recovery", path.join(root, "other"), ["../main.py"], "Ready B2\nSaved copy\n");
run("absolute-from-root", root, [path.join(root, "main.py")], "Ready B2\nSaved copy\n");
run("absolute-from-other", path.join(root, "other"), [path.join(root, "main.py")], "Ready B2\nSaved copy\n");
run("missing-file", path.join(root, "empty"), ["main.py"], "", false);
run("missing-file-recovery", path.join(root, "empty"), [path.join(root, "main.py")], "Ready B2\nSaved copy\n");
run("exercise-starter", root, ["message.py"], "Plan: read\nStep: start\n");
run("exercise-independent-example", root, ["message.example.py"], "Plan: practice P8\nStep: save\nCheck: rerun\n");
const diagnostic = spawnSync("python", ["-c", "import sys; print(sys.executable); print(sys.version.split()[0])"], { encoding: "utf8" });
assert.equal(diagnostic.status, 0); assert.equal(diagnostic.stderr, "");
const [executable, version] = diagnostic.stdout.trim().split(/\r?\n/);
assert.ok(path.isAbsolute(executable)); assert.match(version, /^3\.\d+\.\d+/);
runs.push({ label: "interpreter-diagnostic", cwd: process.cwd(), command: ["python", "-c", "import sys; print(sys.executable); print(sys.version.split()[0])"], stdout: diagnostic.stdout, stderr: diagnostic.stderr, exitCode: diagnostic.status });
for (const name of ["GUI_BEFORE", "GUI_DIRTY", "GUI_SAVED"]) {
  const entry = JSON.parse((await readFile(`docs/py101-p2/runtime/${name}.json`, "utf8")).replace(/^\uFEFF/, ""));
  assert.equal(entry.exitCode, 0); assert.equal(entry.stderr, "");
  assert.equal(entry.stdout.replaceAll("\r\n", "\n"), name === "GUI_SAVED" ? "Ready B2\nSaved copy\n" : "Draft A1\n");
}
await writeFile("docs/py101-p2/PYTHON_RUNS.json", JSON.stringify({ checkedAt: new Date().toISOString(), platform: process.platform, executable, version, runs, guiEvidence: ["runtime/GUI_BEFORE.json", "runtime/GUI_DIRTY.json", "runtime/GUI_SAVED.json"], limits: "真实VS Code缓冲区观察另见EDITOR_VALIDATION；macOS尚未实际运行。" }, null, 2) + "\n");
console.log(`${runs.length}个终端情景及3份GUI联动记录通过；${executable} ${version}`);
