import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { conditionalCode, conditionalBlockNames, type ConditionalKey } from "../src/content/resources/python-conditional-execution";
import { evidencePath } from "./evidence-path";

// Predictions precede execution. Never derive expected output from the lesson's output blocks.
const both = "Within limit\nCheck finished\n", done = "Check finished\n";
export const conditionalCases = [
  { id: "before-low", key: "before", code: conditionalCode.before, expected: "True\nCheck finished\n" },
  { id: "before-high", key: "before", code: conditionalCode.before.replace("count = 5", "count = 7"), expected: "False\nCheck finished\n" },
  { id: "main-low", key: "main", code: conditionalCode.main, expected: both },
  { id: "main-equal", key: "main", code: conditionalCode.main.replace("count = 5", "count = 6"), expected: both },
  { id: "main-high", key: "main", code: conditionalCode.main.replace("count = 5", "count = 7"), expected: done },
  { id: "two-low", key: "twoLines", code: conditionalCode.twoLines, expected: "Within limit\nPrepare labels\nCheck finished\n" },
  { id: "two-high", key: "twoLines", code: conditionalCode.twoLines.replace("count = 5", "count = 7"), expected: done },
  { id: "moved-high", key: "movedLine", code: conditionalCode.movedLine, expected: "Prepare labels\nCheck finished\n" },
  { id: "broken-high", key: "broken", code: conditionalCode.broken, expected: "Pack allowed\nCheck finished\n" },
  { id: "repair-high", key: "repaired", code: conditionalCode.repaired, expected: done },
  { id: "repair-low", key: "repaired", code: conditionalCode.repaired.replace("packed = 8", "packed = 4"), expected: "Checking batch\nPack allowed\nCheck finished\n" },
  { id: "reference-low", key: "own", code: conditionalCode.own, expected: "Books fit\nShelf check finished\n" },
  { id: "reference-equal", key: "own", code: conditionalCode.own.replace("books = 9", "books = 12"), expected: "Books fit\nShelf check finished\n" },
  { id: "reference-high", key: "own", code: conditionalCode.own.replace("books = 9", "books = 15"), expected: "Shelf check finished\n" },
] satisfies { id: string; key: ConditionalKey; code: string; expected: string }[];

export function conditionalKey(filename: string, code: string): ConditionalKey {
  const key = (Object.keys(conditionalCode) as ConditionalKey[]).find(k => conditionalBlockNames[k] === filename);
  assert.ok(key, `Unregistered conditional code: ${filename}`);
  assert.equal(code, conditionalCode[key], `Conditional source mismatch: ${filename}`);
  return key;
}
export function checkConditionalResult(expected: string, result: { exitCode: number | null; stdout: string; stderr: string }) {
  assert.equal(result.exitCode, 0); assert.equal(result.stderr, "");
  assert.equal(result.stdout.replaceAll("\r\n", "\n"), expected);
}
export function runSavedConditional(id: string, code: string, expected: string, directory: string, filename = id + ".py") {
  assert.match(filename, /^[a-z0-9_-]+\.py$/);
  const savedSource = code + "\n", target = path.join(directory, filename);
  writeFileSync(target, savedSource, "utf8"); assert.equal(readFileSync(target, "utf8"), savedSource);
  const python = process.env.AIVORA_PYTHON ?? "python";
  const result = spawnSync(python, [target], { cwd: directory, encoding: "utf8", timeout: 10_000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  assert.ifError(result.error);
  const observed = { exitCode: result.status, stdout: result.stdout, stderr: result.stderr };
  checkConditionalResult(expected, observed);
  return { id, filename, cwd: directory, command: [python, target], pid: result.pid, savedSource, savedSha256: createHash("sha256").update(savedSource).digest("hex"), predictedStdout: expected, ...observed };
}
export function runConditionalExample(filename: string, code: string) {
  const key = conditionalKey(filename, code), directory = mkdtempSync(path.join(os.tmpdir(), "aivora-p16-web-"));
  return { key, executionMode: "saved-file-real-process", runs: conditionalCases.filter(c => c.key === key).map(c => runSavedConditional(c.id, c.code, c.expected, directory, conditionalBlockNames[key].split(" · ")[0])) };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "aivora-p16-author-"));
  const rows = conditionalCases.map(c => ({ key: c.key, ...runSavedConditional(c.id, c.code, c.expected, directory, conditionalBlockNames[c.key].split(" · ")[0]) }));
  const unseen = 'height_cm = 16\nminimum_cm = 18\n\nif height_cm >= minimum_cm:\n    print("Height reached")\n\nprint("Measurement finished")';
  for (const [id, value, expected] of [["unseen-low", 16, "Measurement finished\n"], ["unseen-equal", 18, "Height reached\nMeasurement finished\n"], ["unseen-high", 21, "Height reached\nMeasurement finished\n"]] as const)
    rows.push({ key: "own", ...runSavedConditional(id, unseen.replace("height_cm = 16", `height_cm = ${value}`), expected, directory, "unseen.py") });
  const python = spawnSync(process.env.AIVORA_PYTHON ?? "python", ["-c", "import sys,json;print(json.dumps({'version':sys.version.split()[0],'executable':sys.executable,'prefix':sys.prefix}))"], { encoding: "utf8" });
  assert.equal(python.status, 0); const identity = JSON.parse(python.stdout);
  const report = { checkedAt: new Date().toISOString(), platform: process.platform, node: process.version, python: identity, method: "Predictions precede execution; save .py, reread/hash bytes, start real independent CPython process; preserve stdout/stderr/exit/PID. Public copy redacts path prefixes only.", rows, allAssertionsPassed: true, macOSRuntimeVerified: false, studentPilot: false };
  writeFileSync(path.join(directory, "raw-runs.json"), JSON.stringify(report, null, 2) + "\n");
  const redact = (s: string) => s.replaceAll(directory, "<P16-LAB>").replaceAll(identity.prefix, "<BASE-PYTHON>").replaceAll(process.cwd(), "<WORKSPACE>");
  writeFileSync(evidencePath("PYTHON_RUNS.json"), JSON.stringify(report, (_k, v) => typeof v === "string" ? redact(v) : v, 2) + "\n");
  console.log(`${rows.length} real saved-file runs passed: bool, true/false/equal, two-line block, moved line, single-error repair, reference and unfamiliar >= data.`);
}
