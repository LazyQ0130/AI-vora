import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pythonFirstRunLesson } from "../src/content/lessons/py101/first-run";
import { firstRunProgram } from "../src/content/resources/core-programs";
import { programs } from "../src/content/resources/programs";

const dir = resolve("docs/py101-p0/runtime");
await mkdir(`${dir}/run-check`, { recursive: true });
await mkdir(`${dir}/missing-script`, { recursive: true });
await mkdir(`${dir}/wrong-extension`, { recursive: true });
const python = process.env.AIVORA_PYTHON ?? "python";
const expected = "Hello, Aivora!\nFile: first_run.py\n";
const source = await readFile("public/downloads/first_run.py", "utf8");
assert.equal(source, firstRunProgram.core);
assert.equal(source, programs["first-run"].code);
const notebook = JSON.parse(await readFile("public/downloads/first_run.ipynb", "utf8"));
const cell = notebook.cells.find((c: { cell_type: string }) => c.cell_type === "code");
assert.equal(cell.source.join(""), source);
assert.equal(cell.execution_count, null);
assert.deepEqual(cell.outputs, []);
const results: unknown[] = [];
function run(name: string, args: string[], output: string, status = 0, errorPattern?: RegExp, cwd = dir, input?: string) {
  const actual = spawnSync(python, args, { cwd, input, encoding: "utf8", env: { ...process.env, PYTHONIOENCODING: "utf-8" }, timeout: 15000 });
  assert.ifError(actual.error);
  const stdout = actual.stdout.replace(/\r\n/g, "\n");
  assert.equal(stdout, output, `${name} stdout`);
  assert.equal(actual.status, status, `${name} exit`);
  if (errorPattern) assert.match(actual.stderr, errorPattern);
  else if (!input) assert.equal(actual.stderr, "", `${name} stderr`);
  results.push({ name, args, cwd, ...(input ? { input } : {}), expectedStdout: output, expectedExit: status, exitCode: actual.status, stdout, stderr: actual.stderr, passed: true });
}
const version = spawnSync(python, ["--version"], { encoding: "utf8" });
assert.equal(version.status, 0);
for (const section of pythonFirstRunLesson.sections) for (const block of section.blocks) {
  if (block.type === "code" && block.language === "python") run(`web:${section.id}:${block.filename}`, ["-c", block.code], block.filename === "first_run.py" ? expected : "Hello, Aivora!\n");
}
await writeFile(`${dir}/first_run.py`, source);
run("download-saved-file", ["first_run.py"], expected);
run("generated-notebook-code", ["-c", cell.source.join("")], expected);
run("interactive-hello-and-quit", ["-i"], "Hello, Aivora!\n", 0, undefined, dir, 'print("Hello, Aivora!")\nquit()\n');
// 从题意逐行预期，不执行源码来生成预期值。
const changed = 'print("Reading plan B7")\nprint("File: first_run.py")\nprint("Next: run again")\n';
await writeFile(`${dir}/changed.py`, changed);
run("exercise-1-reference", ["changed.py"], "Reading plan B7\nFile: first_run.py\nNext: run again\n");
await writeFile(`${dir}/chinese.py`, 'print("今天读书 C9")\nprint(\'保存后运行\')\nprint("再试一次")\n');
run("independent-Chinese-single-quote-variation", ["chinese.py"], "今天读书 C9\n保存后运行\n再试一次\n");
run("exercise-2-wrong-directory", ["first_run.py"], "", 2, /can't open file|No such file/i, `${dir}/missing-script`);
run("exercise-2-recover-original-directory", ["first_run.py"], expected);
run("exercise-2-recover-absolute-path", [`${dir}/first_run.py`], expected, 0, undefined, `${dir}/run-check`);
await writeFile(`${dir}/bad_quotes.py`, 'print("Hello, Aivora!)\nprint("File: first_run.py")\n');
run("unmatched-quote-no-partial-output", ["bad_quotes.py"], "", 1, /SyntaxError/);
await writeFile(`${dir}/bad_quotes.py`, source);
run("quote-repaired-and-saved", ["bad_quotes.py"], expected);
await writeFile(`${dir}/wrong-extension/extension_case.py.txt`, source);
run("wrong-extension", ["extension_case.py"], "", 2, /can't open file|No such file/i, `${dir}/wrong-extension`);
await writeFile(`${dir}/run-check/extension_case.py`, source);
run("correct-extension-saved", ["extension_case.py"], expected, 0, undefined, `${dir}/run-check`);
// 未保存的编辑器缓冲只在内存存在；磁盘文件保持原稿。
const unsavedBuffer = changed;
assert.notEqual(unsavedBuffer, await readFile(`${dir}/first_run.py`, "utf8"));
run("unsaved-buffer-disk-still-old", ["first_run.py"], expected);
await writeFile(`${dir}/run-check/first_run.py`, 'print("Different file D2")\n');
run("same-name-different-file", ["first_run.py"], "Different file D2\n", 0, undefined, `${dir}/run-check`);
// 保留明确的小文件，不使用递归清理或临时目录自动批量删除。
await writeFile("docs/py101-p0/PYTHON_EXECUTION.json", JSON.stringify({ checkedAt: new Date().toISOString(), platform: process.platform, version: version.stdout.trim(), pythonCommand: python, expectedMethod: "运行前按print文本、顺序、换行独立列出预期；逐项对照stdout/stderr/exit", downloadEqualsWebAndNotebook: true, results, limitations: "已有Windows解释器；未重装、未验证干净Windows/macOS；交互stdin管道检查不等同于人工键盘交互" }, null, 2) + "\n");
console.log(`${results.length}项执行预期通过；下载/正文/Notebook同源；失败、修复、输入变化有stdout/stderr/退出码证据。`);
