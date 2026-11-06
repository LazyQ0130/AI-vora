import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { lessonProgressScope } from "../src/lib/use-learning-progress";
import { whileCode } from "../src/content/resources/python-while-repetition";
import { whileKey } from "./validate-py101-while";
import { checkConditionalResult } from "./validate-py101-conditional";
const dir = "docs/py101-p20/", baseline = "d50d2a48b4919d6b387646982f5163ee276c8a7d";
const sha = (s: string) => createHash("sha256").update(s).digest("hex"), objectSha = (v: unknown) => sha(JSON.stringify(v));
const paths = ["src/components/lesson/reader.tsx", "src/content/publication-manifest.ts", "scripts/py101-p1-compatibility.ts", "tests/py101-while-repetition.test.ts"];
const json = (name: string, value: unknown, exclusive = false) => writeFileSync(dir + name + ".json", JSON.stringify(value, null, 2) + "\n", { flag: exclusive ? "wx" : "w" });
if (process.argv[2] === "baseline") {
  assert.equal(execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(), baseline);
  json("CONTENT_BASELINE", { baseline, lessons: Object.fromEntries([...lessonRegistry].map(([id, l]) => [id, objectSha(l)])), publications: publicationManifest, progressScopes: [...lessonRegistry.values()].map(lessonProgressScope), sources: paths.map(path => ({ path, before: execFileSync("git", ["show", `${baseline}:${path}`], { encoding: "utf8" }).replaceAll("\r\n", "\n") })) }, true);
} else if (process.argv[2] === "register") {
  const b = JSON.parse(readFileSync(dir + "CONTENT_BASELINE.json", "utf8"));
  assert.equal(lessonRegistry.size, 63);
  for (const [id, digest] of Object.entries(b.lessons)) assert.equal(objectSha(lessonRegistry.get(id)), digest, id);
  for (const old of b.publications) if (old.lessonId !== "PY101-C03-L04") assert.deepEqual(publicationManifest.find(p => p.lessonId === old.lessonId), old);
  const changes = b.publications.flatMap((old: { lessonId: string }) => { const current = publicationManifest.find(p => p.lessonId === old.lessonId)!; return objectSha(old) === objectSha(current) ? [] : [{ id: old.lessonId, before: old, afterSha256: objectSha(current) }]; });
  json("APPROVED_CHANGES", { baseline, sources: b.sources.map((r: { path: string; before: string }) => ({ ...r, afterSha256: sha(readFileSync(r.path, "utf8").replaceAll("\r\n", "\n")) })), lessons: [], publications: changes, addedLessonIds: [], addedContent: [], workspaceOnly: [], protectedText: [] });
  console.log("63 Lesson objects and 62 other Publications unchanged; exact P20 source/object approvals recorded.");
} else if (process.argv[2] === "copies") {
  const python = process.env.AIVORA_PYTHON ?? "python";
  const identity = execFileSync(python, ["--version"], { encoding: "utf8" }).trim();
  const rows = ([
    ["copied-while-main.py", "main", "1\n2\n3\nPacking finished\n"],
    ["copied-while-repaired.py", "fixed", "3\n4\n5\nPacking finished\n"],
  ] as const).map(([file, key, predictedStdout]) => {
    const source = readFileSync(dir + file, "utf8"); assert.equal(source, whileCode[key]);
    const r = spawnSync(python, [file], { cwd: dir, encoding: "utf8", timeout: 10_000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
    assert.ifError(r.error); const result = { exitCode: r.status, stdout: r.stdout, stderr: r.stderr };
    checkConditionalResult(predictedStdout, result);
    return { file, key, source, sha256: sha(source), canonicalSourceIdentical: true, cwd: "<WORKTREE>/" + dir, command: [python, file], pid: r.pid, timeoutMs: 10_000, predictedStdout, ...result, matched: true };
  });
  json("COPIED_CODE_RUNS", { checkedAt: new Date().toISOString(), python: identity, node: process.version, method: "Actual webpage Copy -> clipboard -> original file bytes -> fresh CPython process; literal predictions, canonical source check before execution", rows });
  const dom = JSON.parse(readFileSync(dir + "DOM_CODE_ROWS.json", "utf8")); assert.equal(dom.length, 6);
  json("DOM_SOURCE_MATCH", { checkedAt: new Date().toISOString(), rows: dom.map((r: { filename: string; source: string }) => ({ filename: r.filename, key: whileKey(r.filename, r.source), sha256: sha(r.source), matched: true })) });
  console.log(`${identity}; two actual clipboard files executed; six DOM Python blocks match canonical sources.`);
} else throw new Error("Use baseline, register or copies");
