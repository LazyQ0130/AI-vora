import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { booleanCode, booleanBlockNames, type BooleanKey } from "../src/content/resources/python-boolean-combinations";
import { runSavedConditional } from "./validate-py101-conditional";
import { evidencePath } from "./evidence-path";

type Case = { id: string; key: BooleanKey; code: string; expected: string; businessCorrect?: boolean };
const done = "Check finished\n", ready = "Quantity ready\nCheck finished\n";
// Literal manual predictions, saved in PRE_SOLUTIONS BEFORE code execution. No stdout-derived oracle.
export const quantityPredictions = [
  { count: 2, parts: "False\nTrue\n", and: "False\n", main: done, review: "True\n", reverse: "False\nTrue\n" },
  { count: 3, parts: "True\nTrue\n", and: "True\n", main: ready, review: "False\n", reverse: "True\nFalse\n" },
  { count: 5, parts: "True\nTrue\n", and: "True\n", main: ready, review: "False\n", reverse: "True\nFalse\n" },
  { count: 6, parts: "True\nTrue\n", and: "True\n", main: ready, review: "False\n", reverse: "True\nFalse\n" },
  { count: 7, parts: "True\nFalse\n", and: "False\n", main: done, review: "True\n", reverse: "False\nTrue\n" },
] as const;
const countCode = (key: BooleanKey, count: number) => booleanCode[key].replace(/count = \d+/, `count = ${count}`);
export const booleanCases: Case[] = quantityPredictions.flatMap(r => [
  { id: `named-${r.count}`, key: "named", code: countCode("named", r.count), expected: r.parts },
  { id: `main-${r.count}`, key: "main", code: countCode("main", r.count), expected: r.main },
  { id: `review-${r.count}`, key: "review", code: countCode("review", r.count), expected: r.review },
  { id: `not-range-${r.count}`, key: "notRange", code: countCode("notRange", r.count), expected: r.reverse },
  { id: `fault-${r.count}`, key: "fault", code: countCode("fault", r.count), expected: ready, businessCorrect: ![2, 7].includes(r.count) },
  { id: `fixed-${r.count}`, key: "fixed", code: countCode("fixed", r.count), expected: r.main, businessCorrect: true },
]);
for (const r of quantityPredictions.filter(r => [2, 5, 7].includes(r.count))) booleanCases.push({ id: `and-result-${r.count}`, key: "andResult", code: countCode("andResult", r.count), expected: r.and });
booleanCases.push(
  { id: "saved-if", key: "andIf", code: booleanCode.andIf, expected: ready },
  { id: "not-true", key: "notValue", code: booleanCode.notValue, expected: "False\n" },
  { id: "not-false", key: "notValue", code: booleanCode.notValue.replace("= True", "= False"), expected: "True\n" },
  ...([ [2, "True\n"], [3, "False\n"], [7, "False\n"] ] as const).map(([n, expected]): Case => ({ id: `not-comparison-${n}`, key: "notComparison", code: countCode("notComparison", n), expected })),
  ...([ [3, "False\nTrue\nFalse\nTrue\nTrue\nBook check finished\n"], [4, "True\nTrue\nTrue\nFalse\nFalse\nBook batch ready\nBook check finished\n"], [6, "True\nTrue\nTrue\nFalse\nFalse\nBook batch ready\nBook check finished\n"], [9, "True\nTrue\nTrue\nFalse\nFalse\nBook batch ready\nBook check finished\n"], [10, "True\nFalse\nFalse\nTrue\nTrue\nBook check finished\n"] ] as const).map(([n, expected]): Case => ({ id: `own-${n}`, key: "own", code: booleanCode.own.replace("books = 6", `books = ${n}`), expected })),
);
for (const key of Object.keys(booleanCode) as BooleanKey[]) {
  assert.ok(booleanCases.some(c => c.key === key && c.code === booleanCode[key]), `Missing canonical executable case: ${key}`);
}
export function booleanKey(filename: string, code: string): BooleanKey {
  const key = (Object.keys(booleanCode) as BooleanKey[]).find(k => booleanBlockNames[k] === filename);
  assert.ok(key, `Unregistered boolean block: ${filename}`); assert.equal(code, booleanCode[key], `Boolean source mismatch: ${filename}`); return key;
}
type SavedRun = ReturnType<typeof runSavedConditional>;
// Identical source/prediction can serve main and repair reference: reuse evidence explicitly, never invent another process.
const cache = new Map<string, SavedRun>();
function execute(c: { id: string; code: string; expected: string }, directory: string) {
  const signature = JSON.stringify([c.code, c.expected]), previous = cache.get(signature);
  const run = previous ?? runSavedConditional(c.id, c.code, c.expected, directory);
  if (!previous) cache.set(signature, run);
  return { ...run, id: c.id, executionId: run.id, evidenceReused: Boolean(previous) };
}
export function runBooleanExample(filename: string, code: string) {
  const key = booleanKey(filename, code), cases = booleanCases.filter(c => c.key === key);
  assert.ok(cases.length > 0, `No executable boolean cases: ${key}`);
  const directory = mkdtempSync(path.join(os.tmpdir(), "aivora-p18-web-"));
  return { key, executionMode: "saved-file-real-process-with-explicit-identical-source-reuse", runs: cases.map(c => ({ key, businessCorrect: c.businessCorrect, ...execute(c, directory) })) };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "aivora-p18-author-"));
  const rows = booleanCases.map(c => ({ key: String(c.key), businessCorrect: c.businessCorrect, ...execute(c, directory) }));
  const unseen = 'tickets = 14\nlower = 11\navailable = 18\n\nreview = (tickets < lower) or (tickets > available)\nprint(review)\n\nif not review:\n    print("Tickets ready")\n\nprint("Ticket check finished")';
  for (const [n, expected] of [[10, "True\nTicket check finished\n"], [11, "False\nTickets ready\nTicket check finished\n"], [14, "False\nTickets ready\nTicket check finished\n"], [18, "False\nTickets ready\nTicket check finished\n"], [19, "True\nTicket check finished\n"]] as const)
    rows.push({ key: "unseen", businessCorrect: true, ...execute({ id: `unseen-${n}`, code: unseen.replace("tickets = 14", `tickets = ${n}`), expected }, directory) });
  for (const [left, right, expected] of [["False", "False", "False\nFalse\nTrue\n"], ["False", "True", "False\nTrue\nTrue\n"], ["True", "False", "False\nTrue\nTrue\n"], ["True", "True", "True\nTrue\nFalse\n"]] as const)
    rows.push({ key: "author-bool-pairs", businessCorrect: true, ...execute({ id: `bool-${left.toLowerCase()}-${right.toLowerCase()}`, code: `left = ${left}\nright = ${right}\nprint(left and right)\nprint(left or right)\nprint(not (left and right))`, expected }, directory) });
  const python = process.env.AIVORA_PYTHON ?? "python";
  const identityRun = spawnSync(python, ["-c", "import sys,json;print(json.dumps({'version':sys.version.split()[0],'executable':sys.executable,'prefix':sys.prefix}))"], { encoding: "utf8" });
  assert.equal(identityRun.status, 0); const identity = JSON.parse(identityRun.stdout);
  const observerSource = `import contextlib, dis, hashlib, io, json, pathlib, sys
target = pathlib.Path(sys.argv[1]).resolve()
source = target.read_text(encoding="utf-8")
program = compile(source, str(target), "exec")
sites = [i for i in dis.get_instructions(program) if i.opname == "COMPARE_OP"]
assert len(sites) == 2
offsets = {i.offset: n for n, i in enumerate(sites)}
events = []
def observe(code, instruction_offset):
    if code is program and instruction_offset in offsets:
        events.append(offsets[instruction_offset])
buffer = io.StringIO()
tool = 3
sys.monitoring.use_tool_id(tool, "aivora-p18-author")
sys.monitoring.register_callback(tool, sys.monitoring.events.INSTRUCTION, observe)
sys.monitoring.set_local_events(tool, program, sys.monitoring.events.INSTRUCTION)
with contextlib.redirect_stdout(buffer):
    try:
        exec(program, {"__name__": "__main__"})
    finally:
        sys.monitoring.set_local_events(tool, program, 0)
        sys.monitoring.free_tool_id(tool)
print(json.dumps({"programSha256": hashlib.sha256(target.read_bytes()).hexdigest(), "compareSites": [{"ordinal": n, "operation": i.argrepr, "line": i.positions.lineno, "startColumn": i.positions.col_offset, "endColumn": i.positions.end_col_offset} for n, i in enumerate(sites)], "executedComparisons": events, "programStdout": buffer.getvalue()}))
`;
  writeFileSync(path.join(directory, "observe_short_circuit.py"), observerSource);
  const traces = ([ ["and-left-false", "main", 2, [0], done], ["and-left-true", "main", 7, [0, 1], done], ["or-left-true", "fault", 7, [0], ready], ["or-left-false", "fault", 2, [0, 1], ready] ] as const).map(([id, key, n, predictedComparisons, predictedStdout]) => {
    const filename = `${id}.py`, savedSource = countCode(key, n) + "\n"; writeFileSync(path.join(directory, filename), savedSource); assert.equal(readFileSync(path.join(directory, filename), "utf8"), savedSource);
    const result = spawnSync(python, ["observe_short_circuit.py", filename], { cwd: directory, encoding: "utf8", timeout: 10_000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
    assert.ifError(result.error); assert.equal(result.status, 0); assert.equal(result.stderr, ""); const observed = JSON.parse(result.stdout);
    assert.deepEqual(observed.executedComparisons, [...predictedComparisons]); assert.equal(observed.programStdout, predictedStdout);
    const savedSha256 = createHash("sha256").update(savedSource).digest("hex"); assert.equal(observed.programSha256, savedSha256);
    return { id, filename, savedSource, savedSha256, cwd: directory, command: [python, "observe_short_circuit.py", filename], predictedComparisons, predictedStdout, ...observed, stdout: result.stdout, stderr: result.stderr, exitCode: result.status, pid: result.pid };
  });
  const report = { checkedAt: new Date().toISOString(), platform: process.platform, node: process.version, python: identity, preSolutionsSha256: createHash("sha256").update(readFileSync("docs/py101-p18/PRE_SOLUTIONS.md")).digest("hex"), method: "Manual literal predictions; saved/reread/hashed .py executed in real CPython. Identical main/repair sources explicitly reuse the same execution. Author-only stdlib opcode observation evaluates unmodified student source, no observer syntax in student lesson.", rows, uniqueProcessCount: new Set(rows.map(r => r.pid)).size, traces, observerSource, observerSha256: createHash("sha256").update(observerSource).digest("hex"), allAssertionsPassed: true, studentPilot: false, macOSRuntimeVerified: false };
  writeFileSync(path.join(directory, "raw-runs.json"), JSON.stringify(report, null, 2) + "\n");
  const redact = (s: string) => s.replaceAll(directory, "<P18-LAB>").replaceAll(identity.prefix, "<BASE-PYTHON>").replaceAll(process.cwd(), "<WORKSPACE>");
  writeFileSync(evidencePath("PYTHON_RUNS.json"), JSON.stringify(report, (_k, v) => typeof v === "string" ? redact(v) : v, 2) + "\n");
  console.log(`${rows.length} case predictions / ${report.uniqueProcessCount} distinct saved-file processes and ${traces.length} opcode traces passed; fault or remains explicitly business-incorrect for 2 and 7.`);
}
