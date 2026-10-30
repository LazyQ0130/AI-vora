import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { valueTypeCode, valueTypeBlockNames, valueTypeSetups, type ValueTypeKey } from "../src/content/resources/python-value-types";
import { evidencePath } from "./evidence-path";

// 独立预期来自起草前逐行推演，不从教材的输出框回读。
export const valueTypeExpected: Record<ValueTypeKey, string> = {
  sameDisplay: "3\n3\n",
  measurement: "1.5\n",
  booleanValues: "True\nTrue\nFalse\n",
  firstType: "<class 'int'>\n",
  pairTypes: "<class 'int'>\n<class 'str'>\n",
  booleanTypes: "<class 'bool'>\n<class 'str'>\n<class 'bool'>\n",
  main: "3\n3\n1.5\nTrue\n<class 'int'>\n<class 'str'>\n<class 'float'>\n<class 'bool'>\n",
  rebind: "8\n<class 'int'>\n8\n<class 'str'>\n",
  ownFour: "Sketch kit\n6\n17.5\nFalse\n<class 'str'>\n<class 'int'>\n<class 'float'>\n<class 'bool'>\n",
  ownRebind: "12\n<class 'int'>\n12\n<class 'str'>\n",
  ownChanged: "27\n<class 'int'>\n27\n<class 'str'>\n",
};
export function valueTypeKey(filename: string, source: string): ValueTypeKey {
  const key = (Object.keys(valueTypeCode) as ValueTypeKey[]).find(key => valueTypeBlockNames[key] === filename);
  assert.ok(key, `未登记的类型课Python代码块：${filename}`);
  assert.equal(source, valueTypeCode[key], `类型课源码不一致：${filename}`);
  return key;
}
export function checkValueTypeResult(key: ValueTypeKey, result: { exitCode: number | null; stdout: string; stderr: string }) {
  assert.equal(result.exitCode, 0, key);
  assert.equal(result.stderr, "", key);
  assert.equal(result.stdout.replaceAll("\r\n", "\n"), valueTypeExpected[key], key);
}
export function runValueTypeExample(filename: string, source: string) {
  const key = valueTypeKey(filename, source), setup = valueTypeSetups[key] ?? "";
  const args = ["-c", setup ? setup + "\n" + source : source];
  const result = spawnSync(process.env.AIVORA_PYTHON ?? "python", args, { encoding: "utf8", timeout: 30_000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  assert.ifError(result.error);
  const observation = { exitCode: result.status, stdout: result.stdout, stderr: result.stderr };
  checkValueTypeResult(key, observation);
  return { key, executionMode: setup ? "ordered-fragment" : "complete-program", setup, expectedStdout: valueTypeExpected[key], args, ...observation };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.equal(process.platform, "win32", "本作者专项只声称Windows真实执行");
  const root = mkdtempSync(path.join(os.tmpdir(), "aivora-p9-")), python = process.env.AIVORA_PYTHON ?? "python";
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
  for (const key of Object.keys(valueTypeCode) as ValueTypeKey[]) {
    const setup = valueTypeSetups[key];
    const filename = valueTypeBlockNames[key].split(" · ")[0].endsWith(".py") ? valueTypeBlockNames[key].split(" · ")[0] : `${key}.py`;
    checkValueTypeResult(key, run(key, filename, setup ? setup + "\n" + valueTypeCode[key] : valueTypeCode[key]));
  }
  const alternatives = [
    { label: "append-type-to-pair", source: valueTypeCode.sameDisplay + "\n" + valueTypeCode.firstType, expected: "3\n3\n<class 'int'>\n" },
    { label: "append-types-to-states", source: valueTypeCode.booleanValues + "\n" + valueTypeCode.booleanTypes, expected: "True\nTrue\nFalse\n<class 'bool'>\n<class 'str'>\n<class 'bool'>\n" },
    { label: "single-quotes", source: "count_code = '12'\nprint(count_code)\nprint(type(count_code))", expected: "12\n<class 'str'>\n" },
    { label: "false-and-text", source: 'state_note = False\nprint(state_note)\nprint(type(state_note))\nstate_note = "False"\nprint(state_note)\nprint(type(state_note))', expected: "False\n<class 'bool'>\nFalse\n<class 'str'>\n" },
    { label: "integral-float", source: "length_cm = 17.0\nprint(length_cm)\nprint(type(length_cm))", expected: "17.0\n<class 'float'>\n" },
    { label: "integer-measure-writing", source: "length_cm = 17\nprint(length_cm)\nprint(type(length_cm))", expected: "17\n<class 'int'>\n" },
    { label: "independent-four-values", source: 'set_label = "Tea set"\nmug_count = 4\ncup_volume_l = 0.25\nis_wrapped = True\nprint(set_label)\nprint(mug_count)\nprint(cup_volume_l)\nprint(is_wrapped)\nprint(type(set_label))\nprint(type(mug_count))\nprint(type(cup_volume_l))\nprint(type(is_wrapped))', expected: "Tea set\n4\n0.25\nTrue\n<class 'str'>\n<class 'int'>\n<class 'float'>\n<class 'bool'>\n" },
  ];
  for (const item of alternatives) assert.deepEqual(run(item.label, `${item.label}.py`, item.source), { exitCode: 0, stdout: item.expected, stderr: "" });
  assert.deepEqual(run("saved-before", "my_measure.py", "mass_note = 1.5\nprint(mass_note)\nprint(type(mass_note))"), { exitCode: 0, stdout: "1.5\n<class 'float'>\n", stderr: "" });
  assert.deepEqual(run("saved-after", "my_measure.py", 'mass_note = "1.5"\nprint(mass_note)\nprint(type(mass_note))'), { exitCode: 0, stdout: "1.5\n<class 'str'>\n", stderr: "" });
  for (const name of ["true", "false"]) {
    const result = run(`misspelling:${name}`, `${name}.py`, `state_note = ${name}\nprint(state_note)`);
    assert.equal(result.exitCode, 1); assert.equal(result.stdout, ""); assert.ok(result.stderr.includes(`NameError: name '${name}' is not defined`));
  }
  const quoteError = run("unpaired-quote", "quote_error.py", 'kit_label = "Sketch kit');
  assert.equal(quoteError.exitCode, 1); assert.equal(quoteError.stdout, ""); assert.match(quoteError.stderr, /SyntaxError/);
  const report = { checkedAt: new Date().toISOString(), platform: process.platform, os: { type: os.type(), release: os.release() }, python: base, shell: `PowerShell ${shell.stdout.trim()}`, method: "每次保存.py并核对磁盘内容，在独立PowerShell进程启动Python；stdout换行统一为LF", rows, allAssertionsPassed: true, macOS: "仅文档核对，未实机执行" };
  writeFileSync(path.join(root, "raw-runs.json"), JSON.stringify(report, null, 2) + "\n");
  const redact = (s: string) => s.replaceAll(root, "<P9-LAB>").replaceAll(root.replaceAll("\\", "/"), "<P9-LAB>").replaceAll(base.prefix, "<BASE-PYTHON>").replaceAll(process.cwd(), "<REPOSITORY>");
  writeFileSync(evidencePath("PYTHON_RUNS.json"), JSON.stringify(report, (_k, v) => typeof v === "string" ? redact(v) : v, 2) + "\n");
  console.log(`${rows.length} Windows saved-file runs passed: four value types, same display, rebinding, alternatives and genuine spelling/quote errors.`);
}
