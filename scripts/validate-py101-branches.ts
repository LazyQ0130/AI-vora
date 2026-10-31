import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { branchCode, branchBlockNames, type BranchKey } from "../src/content/resources/python-conditional-branches";
import { runSavedConditional } from "./validate-py101-conditional";
import { evidencePath } from "./evidence-path";

// PRE_SOLUTIONS precedes drafting/execution. These literal predictions are not copied from stdout.
export const branchCases = [
  { id: "previous-low", key: "previous", code: branchCode.previous, expected: "Within limit\nCheck finished\n" },
  { id: "previous-high", key: "previous", code: branchCode.previous.replace("count = 5", "count = 7"), expected: "Check finished\n" },
  { id: "two-low", key: "twoWay", code: branchCode.twoWay, expected: "Within limit\nCheck finished\n" },
  { id: "two-equal", key: "twoWay", code: branchCode.twoWay.replace("count = 5", "count = 6"), expected: "Within limit\nCheck finished\n" },
  { id: "two-high", key: "twoWay", code: branchCode.twoWay.replace("count = 5", "count = 7"), expected: "Over limit\nCheck finished\n" },
  { id: "three-low", key: "threeWay", code: branchCode.threeWay.replace("count = 6", "count = 5"), expected: "Room left\nCheck finished\n" },
  { id: "three-equal", key: "threeWay", code: branchCode.threeWay, expected: "At limit\nCheck finished\n" },
  { id: "three-high", key: "threeWay", code: branchCode.threeWay.replace("count = 6", "count = 7"), expected: "Over limit\nCheck finished\n" },
  { id: "overlap-equal", key: "overlap", code: branchCode.overlap, expected: "Within limit\n" },
  { id: "order-repair-equal", key: "orderRepair", code: branchCode.orderRepair, expected: "At limit\n" },
  { id: "independent-equal", key: "independent", code: branchCode.independent, expected: "Within limit\nAt limit\nCheck finished\n" },
  { id: "independent-high", key: "independent", code: branchCode.independent.replace("count = 6", "count = 7"), expected: "Check finished\n" },
  { id: "fault-equal", key: "fault", code: branchCode.fault, expected: "Within shelf limit\nAt shelf limit\nShelf check finished\n" },
  { id: "fixed-low", key: "fixed", code: branchCode.fixed.replace("kits = 10", "kits = 8"), expected: "Below shelf limit\nShelf check finished\n" },
  { id: "fixed-equal", key: "fixed", code: branchCode.fixed, expected: "At shelf limit\nShelf check finished\n" },
  { id: "fixed-high", key: "fixed", code: branchCode.fixed.replace("kits = 10", "kits = 13"), expected: "Over shelf limit\nShelf check finished\n" },
  { id: "own-two-low", key: "ownTwo", code: branchCode.ownTwo, expected: "Enough seats\nSeat check finished\n" },
  { id: "own-two-high", key: "ownTwo", code: branchCode.ownTwo.replace("people = 11", "people = 17"), expected: "Not enough seats\nSeat check finished\n" },
  { id: "own-three-low", key: "ownThree", code: branchCode.ownThree, expected: "Spare seats\nSeat check finished\n" },
  { id: "own-three-equal", key: "ownThree", code: branchCode.ownThree.replace("people = 11", "people = 14"), expected: "All seats taken\nSeat check finished\n" },
  { id: "own-three-high", key: "ownThree", code: branchCode.ownThree.replace("people = 11", "people = 17"), expected: "Need more seats\nSeat check finished\n" },
] satisfies { id: string; key: BranchKey; code: string; expected: string }[];

export function branchKey(filename: string, code: string): BranchKey {
  const key = (Object.keys(branchCode) as BranchKey[]).find(k => branchBlockNames[k] === filename);
  assert.ok(key, `Unregistered branch block: ${filename}`); assert.equal(code, branchCode[key]); return key;
}
export function runBranchExample(filename: string, code: string) {
  const key = branchKey(filename, code), directory = mkdtempSync(path.join(os.tmpdir(), "aivora-p17-web-"));
  return { key, executionMode: "saved-file-real-process", runs: branchCases.filter(c => c.key === key).map(c => runSavedConditional(c.id, c.code, c.expected, directory, branchBlockNames[key].split(" · ")[0])) };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "aivora-p17-author-"));
  const rows = branchCases.map(c => ({ key: c.key, ...runSavedConditional(c.id, c.code, c.expected, directory, branchBlockNames[c.key].split(" · ")[0]) }));
  const unseen = 'tickets = 23\ngate_limit = 20\n\nif tickets > gate_limit:\n    print("Too many tickets")\nelif tickets == gate_limit:\n    print("Gate full")\nelse:\n    print("Room at gate")\n\nprint("Gate check finished")';
  for (const [value, label, expected] of [[17, "low", "Room at gate\nGate check finished\n"], [20, "equal", "Gate full\nGate check finished\n"], [23, "high", "Too many tickets\nGate check finished\n"]] as const)
    rows.push({ key: "fixed", ...runSavedConditional(`unseen-${label}`, unseen.replace("tickets = 23", `tickets = ${value}`), expected, directory, "unseen_gate.py") });
  const python = process.env.AIVORA_PYTHON ?? "python";
  const identityResult = spawnSync(python, ["-c", "import sys,json;print(json.dumps({'version':sys.version.split()[0],'executable':sys.executable,'prefix':sys.prefix}))"], { encoding: "utf8" });
  assert.equal(identityResult.status, 0); const identity = JSON.parse(identityResult.stdout);
  const traces = ([ ["overlap", branchCode.overlap, [1, 2, 4, 5]], ["orderRepair", branchCode.orderRepair, [1, 2, 4, 6, 7]] ] as const).map(([key, code, predictedLines]) => {
    const filename = "overlap_choice.py", savedSource = code + "\n"; writeFileSync(path.join(directory, filename), savedSource, "utf8"); assert.equal(readFileSync(path.join(directory, filename), "utf8"), savedSource);
    const result = spawnSync(python, ["-m", "trace", "--trace", filename], { cwd: directory, encoding: "utf8", timeout: 10_000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
    assert.ifError(result.error); assert.equal(result.status, 0); assert.equal(result.stderr, "");
    const executedLines = [...result.stdout.matchAll(/overlap_choice\.py\((\d+)\):/g)].map(m => Number(m[1]));
    assert.deepEqual(executedLines, [...predictedLines]);
    return { key, filename, savedSource, savedSha256: createHash("sha256").update(savedSource).digest("hex"), cwd: directory, command: [python, "-m", "trace", "--trace", filename], predictedLines, executedLines, stdout: result.stdout, stderr: result.stderr, exitCode: result.status, pid: result.pid };
  });
  const report = { checkedAt: new Date().toISOString(), platform: process.platform, node: process.version, python: identity, method: "Predictions before execution; reuse saved-file runner; reread bytes/SHA then launch independent CPython processes. Author-only standard-library trace observes executed lines without adding student syntax.", rows, traces, allAssertionsPassed: true, macOSRuntimeVerified: false, studentPilot: false };
  writeFileSync(path.join(directory, "raw-runs.json"), JSON.stringify(report, null, 2) + "\n");
  const redact = (s: string) => s.replaceAll(directory, "<P17-LAB>").replaceAll(identity.prefix, "<BASE-PYTHON>").replaceAll(process.cwd(), "<WORKSPACE>");
  writeFileSync(evidencePath("PYTHON_RUNS.json"), JSON.stringify(report, (_k, v) => typeof v === "string" ? redact(v) : v, 2) + "\n");
  console.log(`${rows.length} saved-file predictions and ${traces.length} executed-line traces passed; mutually exclusive paths, overlapping/independent checks and references verified.`);
}
