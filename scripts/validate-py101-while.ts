import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { whileCode, whileBlockNames, type WhileKey } from "../src/content/resources/python-while-repetition";
import { runSavedConditional, checkConditionalResult } from "./validate-py101-conditional";
import { evidencePath } from "./evidence-path";
type Case = { id: string; key: WhileKey; code: string; expected: string; businessCorrect?: boolean };
const done = "Packing finished\n", mainOutput = "1\n2\n3\nPacking finished\n", newOutput = "3\n4\n5\nPacking finished\n";
// Literal predictions from PRE_SOLUTIONS, never inferred from stdout.
export const whileCases: Case[] = [
  { id: "if-once", key: "once", code: whileCode.once, expected: "1\nPacking finished\n" },
  { id: "main-0-3", key: "main", code: whileCode.main, expected: mainOutput },
  { id: "main-3-3", key: "main", code: whileCode.zero, expected: done },
  { id: "main-4-3", key: "main", code: whileCode.main.replace("packed = 0", "packed = 4"), expected: done },
  { id: "main-2-5", key: "main", code: whileCode.newStart, expected: newOutput },
  { id: "zero-canonical", key: "zero", code: whileCode.zero, expected: done },
  { id: "new-start-canonical", key: "newStart", code: whileCode.newStart, expected: newOutput },
  { id: "print-before", key: "beforePrint", code: whileCode.beforePrint, expected: "0\n1\n2\nPacking finished\n" },
  { id: "wrong-step-two", key: "fault", code: whileCode.fault, expected: "2\n4\nPacking finished\n", businessCorrect: false },
  { id: "repair-original", key: "fixed", code: whileCode.main, expected: mainOutput, businessCorrect: true },
  { id: "repair-new", key: "fixed", code: whileCode.fixed, expected: newOutput, businessCorrect: true },
  { id: "repair-zero", key: "fixed", code: whileCode.zero, expected: done, businessCorrect: true },
  { id: "own-multiple", key: "own", code: whileCode.own, expected: "3\n4\n5\n6\nLabel check finished\n" },
  { id: "own-zero", key: "own", code: whileCode.own.replace("labels_done = 2", "labels_done = 6"), expected: "Label check finished\n" },
  { id: "own-new", key: "own", code: whileCode.own.replace("labels_done = 2", "labels_done = 4").replace("label_goal = 6", "label_goal = 7"), expected: "5\n6\n7\nLabel check finished\n" },
];
for (const key of Object.keys(whileCode) as WhileKey[]) assert.ok(whileCases.some(c => c.key === key && c.code === whileCode[key]), `Missing canonical finite case: ${key}`);
export function whileKey(filename: string, code: string): WhileKey {
  const key = (Object.keys(whileCode) as WhileKey[]).find(k => whileBlockNames[k] === filename);
  assert.ok(key, `Unregistered while block: ${filename}`); assert.equal(code, whileCode[key], `While source mismatch: ${filename}`); return key;
}
// P19 counters are deliberately small and structurally finite; timeout remains a second guard.
export function assertFiniteCounter(code: string) {
  const header = code.match(/^([a-z_]+) = (\d+)\n([a-z_]+) = (\d+)\n\n(?:while|if) ([a-z_]+) < ([a-z_]+):\n/);
  assert.ok(header, "Only registered simple integer counters may execute");
  assert.equal(header[1], header[5]); assert.equal(header[3], header[6]);
  assert.ok(Number(header[2]) <= 100 && Number(header[4]) <= 100, "Author counter exceeds observation bound");
  const body = code.split("\n").filter(line => line.startsWith("    "));
  assert.equal(body.length, 2); assert.ok(body.includes(`    print(${header[1]})`));
  assert.ok([`    ${header[1]} = ${header[1]} + 1`, `    ${header[1]} = ${header[1]} + 2`].some(update => body.includes(update)), "Missing/nonpositive state update is never executable");
  assert.match(code.split("\n").at(-1)!, /^print\("[^"\n]+"\)$/);
}
const cache = new Map<string, ReturnType<typeof runSavedConditional>>();
function execute(c: { id: string; code: string; expected: string }, directory: string) {
  assertFiniteCounter(c.code);
  const signature = JSON.stringify([c.code, c.expected]), previous = cache.get(signature);
  const run = previous ?? runSavedConditional(c.id, c.code, c.expected, directory);
  if (!previous) cache.set(signature, run);
  return { ...run, id: c.id, executionId: run.id, evidenceReused: Boolean(previous), timeoutMs: 10_000 };
}
export function runWhileExample(filename: string, code: string) {
  const key = whileKey(filename, code), cases = whileCases.filter(c => c.key === key); assert.ok(cases.length > 0);
  const directory = mkdtempSync(path.join(os.tmpdir(), "aivora-p19-web-"));
  return { key, executionMode: "saved-file-real-process-with-explicit-identical-source-reuse", runs: cases.map(c => ({ businessCorrect: c.businessCorrect, ...execute(c, directory) })) };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "aivora-p19-author-"));
  const rows = whileCases.map(c => ({ key: String(c.key), businessCorrect: c.businessCorrect, ...execute(c, directory) }));
  const unseen = 'checked = 1\nneeded = 5\n\nwhile checked < needed:\n    checked = checked + 1\n    print(checked)\n\nprint("Check done")';
  for (const [n, expected] of [[1, "2\n3\n4\n5\nCheck done\n"], [5, "Check done\n"], [6, "Check done\n"]] as const)
    rows.push({ key: "unseen", businessCorrect: true, ...execute({ id: `unseen-${n}`, code: unseen.replace("checked = 1", `checked = ${n}`), expected }, directory) });
  const python = process.env.AIVORA_PYTHON ?? "python";
  const identityRun = spawnSync(python, ["-c", "import sys,json;print(json.dumps({'version':sys.version.split()[0],'executable':sys.executable,'prefix':sys.prefix}))"], { encoding: "utf8", timeout: 10_000 });
  assert.equal(identityRun.status, 0); const identity = JSON.parse(identityRun.stdout);
  const observerSource = `import contextlib, hashlib, io, json, pathlib, sys
target = pathlib.Path(sys.argv[1]).resolve()
source = target.read_text(encoding="utf-8")
condition_line = next(n for n, text in enumerate(source.splitlines(), 1) if text.startswith(("while ", "if ")))
checks = []
final_value = None
def observe(frame, event, arg):
    global final_value
    if frame.f_code.co_filename != str(target):
        return None
    if event == "line" and frame.f_lineno == condition_line:
        checks.append({"packed": frame.f_locals["packed"], "target": frame.f_locals["target"]})
    elif event == "return":
        final_value = frame.f_locals["packed"]
    return observe
buffer = io.StringIO()
with contextlib.redirect_stdout(buffer):
    sys.settrace(observe)
    try:
        exec(compile(source, str(target), "exec"), {"__name__": "__main__"})
    finally:
        sys.settrace(None)
print(json.dumps({"programSha256": hashlib.sha256(target.read_bytes()).hexdigest(), "conditionLine": condition_line, "checks": checks, "finalValue": final_value, "programStdout": buffer.getvalue()}))
`;
  writeFileSync(path.join(directory, "observe_states.py"), observerSource);
  const traceCases = [
    ["if-once", whileCode.once, [0], 1, "1\nPacking finished\n"],
    ["while-main", whileCode.main, [0, 1, 2, 3], 3, mainOutput],
    ["while-zero", whileCode.zero, [3], 3, done],
    ["while-above", whileCode.main.replace("packed = 0", "packed = 4"), [4], 4, done],
    ["while-new", whileCode.newStart, [2, 3, 4, 5], 5, newOutput],
    ["print-before", whileCode.beforePrint, [0, 1, 2, 3], 3, "0\n1\n2\nPacking finished\n"],
    ["step-two", whileCode.fault, [0, 2, 4], 4, "2\n4\nPacking finished\n"],
  ] as const;
  const traces = traceCases.map(([id, code, predictedChecks, predictedFinal, predictedStdout]) => {
    const filename = `trace-${id}.py`, savedSource = code + "\n"; writeFileSync(path.join(directory, filename), savedSource); assert.equal(readFileSync(path.join(directory, filename), "utf8"), savedSource);
    const r = spawnSync(python, ["observe_states.py", filename], { cwd: directory, encoding: "utf8", timeout: 10_000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
    assert.ifError(r.error); assert.equal(r.status, 0); assert.equal(r.stderr, ""); const observed = JSON.parse(r.stdout);
    assert.deepEqual(observed.checks.map((c: { packed: number }) => c.packed), [...predictedChecks]); assert.equal(observed.finalValue, predictedFinal); assert.equal(observed.programStdout, predictedStdout);
    const savedSha256 = createHash("sha256").update(savedSource).digest("hex"); assert.equal(observed.programSha256, savedSha256);
    return { id, filename, savedSource, savedSha256, cwd: directory, command: [python, "observe_states.py", filename], pid: r.pid, timeoutMs: 10_000, predictedChecks, predictedFinal, predictedStdout, ...observed, stdout: r.stdout, stderr: r.stderr, exitCode: r.status };
  });
  // Controlled finite WAIT probe, not an infinite loop or student example. No child-spawning syntax.
  const probeSource = "import time\ntime.sleep(2)\n", probeFile = "finite_wait_probe.py"; writeFileSync(path.join(directory, probeFile), probeSource);
  const probe = spawnSync(python, [probeFile], { cwd: directory, encoding: "utf8", timeout: 150, maxBuffer: 64 * 1024 });
  let alive = false; try { process.kill(probe.pid, 0); alive = true; } catch (error) { assert.equal((error as NodeJS.ErrnoException).code, "ESRCH"); }
  let normalResultRejected = false; try { checkConditionalResult("", { exitCode: probe.status, stdout: probe.stdout ?? "", stderr: probe.stderr ?? "" }); } catch { normalResultRejected = true; }
  const probeErrorCode = (probe.error as NodeJS.ErrnoException | undefined)?.code;
  const timeoutProbe = { filename: probeFile, savedSource: probeSource, savedSha256: createHash("sha256").update(probeSource).digest("hex"), command: [python, probeFile], cwd: directory, timeoutMs: 150, selfBoundSeconds: 2, pid: probe.pid, exitCode: probe.status, signal: probe.signal, errorCode: probeErrorCode, stdout: probe.stdout, stderr: probe.stderr, childAliveAfterReturn: alive, normalResultRejected, programCompletedNormally: false };
  assert.equal(probeErrorCode, "ETIMEDOUT"); assert.notEqual(probe.status, 0); assert.equal(alive, false); assert.equal(normalResultRejected, true);
  const report = { checkedAt: new Date().toISOString(), platform: process.platform, node: process.version, python: identity, preSolutionsSha256: createHash("sha256").update(readFileSync("docs/py101-p19/PRE_SOLUTIONS.md")).digest("hex"), method: "Manual predictions; reuse existing 10s saved-file runner. State observer uses read-only line tracing of unmodified finite source. Identical sources explicitly reuse evidence. Separate finite sleep probe verifies timeout rejection and reaping; never execute missing-update source.", rows, uniqueProcessCount: new Set(rows.map(r => r.pid)).size, traces, observerSource, timeoutProbe, allAssertionsPassed: true, studentPilot: false, macOSRuntimeVerified: false };
  writeFileSync(path.join(directory, "raw-runs.json"), JSON.stringify(report, null, 2) + "\n");
  const redact = (s: string) => s.replaceAll(directory, "<P19-LAB>").replaceAll(identity.prefix, "<BASE-PYTHON>").replaceAll(process.cwd(), "<WORKSPACE>");
  writeFileSync(evidencePath("PYTHON_RUNS.json"), JSON.stringify(report, (_k, v) => typeof v === "string" ? redact(v) : v, 2) + "\n");
  console.log(`${rows.length} predictions / ${report.uniqueProcessCount} distinct saved-file processes, ${traces.length} state traces passed; finite WAIT timed out/rejected/reaped as required. Missing-update source was NOT executed.`);
}
