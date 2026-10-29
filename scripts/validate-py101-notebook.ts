import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { notebookCode, notebookDocuments, notebookDownload } from "../src/content/resources/python-notebook";
const python = process.env.AIVORA_NOTEBOOK_PYTHON;
const cwd = process.env.AIVORA_NOTEBOOK_LAB;
assert.ok(python && cwd, "指定本轮独立环境的AIVORA_NOTEBOOK_PYTHON和AIVORA_NOTEBOOK_LAB；不安装/改动基础Python。");
const result = spawnSync(python, ["scripts/validate-notebook-state.py"], { input: JSON.stringify({ cwd, code: notebookCode, documents: notebookDocuments.map(document => ({ filename: document.filename, notebook: notebookDownload(document) })) }), encoding: "utf8", timeout: 240000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
const redact = (s: string) => s.replaceAll(cwd, "<NOTEBOOK_LAB>").replaceAll(process.cwd(), "<WORKSPACE>").replaceAll(process.env.USERPROFILE ?? "<unused>", "<USER>");
if (result.error || result.status !== 0) {
  await writeFile("docs/py101-p4/NOTEBOOK_KERNEL_FAILURE.json", JSON.stringify({ checkedAt: new Date().toISOString(), exitCode: result.status, error: String(result.error ?? ""), stderr: redact(result.stderr), scope: "开发验证客户端失败，不据此宣称教材/GUI已通过。" },null,2)+"\n");
}
assert.ifError(result.error); assert.equal(result.status, 0, redact(result.stderr));
const report = JSON.parse(result.stdout);
assert.equal(report.kernelShutdown, true);
await writeFile("docs/py101-p4/NOTEBOOK_KERNEL_RESULTS.json", JSON.stringify(report, null, 2) + "\n");
console.log(`${report.steps.length}步真实内核观察通过；Python ${report.python}；内核已正常关闭。`);
