import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { variableCode, variableBlockNames, type VariableCodeKey } from "../src/content/resources/python-variables";

// 独立预期先由执行时刻推导，不能从教材的输出框取期望值。
export const variableExpectations: Record<VariableCodeKey, { stdout: string; errorName?: "NameError"; setup?: string }> = {
  assign: { stdout: "" },
  read: { stdout: "Pack notebooks\n", setup: variableCode.assign },
  update: { stdout: "", setup: variableCode.assign },
  main: { stdout: "Pack notebooks\nCheck labels\n" },
  changedMain: { stdout: "Pack notebooks\nSort envelopes\n" },
  literal: { stdout: "task_name\nReady\n" },
  firstRead: { stdout: "", errorName: "NameError" },
  repaired: { stdout: "Packed T7\n" },
  ownInitial: { stdout: "Hang posters\nPlace signs\n" },
  ownChanged: { stdout: "Hang posters\nOpen doors\n" },
};
export function variableKey(filename: string, source: string): VariableCodeKey {
  const key = (Object.keys(variableCode) as VariableCodeKey[]).find(key => variableBlockNames[key] === filename);
  assert.ok(key, `未登记的变量课Python代码块：${filename}`);
  assert.equal(source, variableCode[key], `变量课源码不一致：${filename}`);
  return key;
}
export function checkVariableResult(key: VariableCodeKey, result: { exitCode: number | null; stdout: string; stderr: string }) {
  const expected = variableExpectations[key];
  assert.equal(result.stdout.replaceAll("\r\n", "\n"), expected.stdout, key);
  if (expected.errorName) {
    assert.equal(result.exitCode, 1, "受控NameError必须真实失败，不能算作成功代码");
    assert.match(result.stderr, /NameError: name 'dispatch_label' is not defined/);
  } else {
    assert.equal(result.exitCode, 0, key);
    assert.equal(result.stderr, "", key);
  }
}
export function runVariableExample(filename: string, source: string) {
  const key = variableKey(filename, source), expected = variableExpectations[key];
  const setup = expected.setup ?? "";
  const args = ["-c", setup ? `${setup}\n${source}` : source];
  const result = spawnSync(process.env.AIVORA_PYTHON ?? "python", args, { encoding: "utf8", timeout: 30_000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  if (result.error) throw result.error;
  const observation = { exitCode: result.status, stdout: result.stdout, stderr: result.stderr };
  checkVariableResult(key, observation);
  return { key, executionMode: expected.errorName ? "expected-NameError" : setup ? "ordered-fragment" : "complete-or-independent", setup, expected, args, ...observation };
}
