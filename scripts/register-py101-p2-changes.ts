import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { lessonRegistry } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";

const dir = "docs/py101-p2";
const base = JSON.parse(await readFile(`${dir}/BASELINE.json`, "utf8"));
const old = JSON.parse(await readFile(`${dir}/BASELINE_LESSONS.json`, "utf8"));
const sha = (s: string) => createHash("sha256").update(s).digest("hex");
const sources = await Promise.all(["src/lib/course-engine.ts", "src/content/publication-manifest.ts", "src/content/lessons/py101/first-run.ts"].map(async path => {
  const before = execFileSync("git", ["show", `${base.head}:${path}`], { encoding: "utf8" });
  if (base.files[path]) assert.equal(sha(before), base.files[path], path);
  return { path, before, afterSha256: sha((await readFile(path, "utf8")).replaceAll("\r\n", "\n")) };
}));
const id = "PY101-C01-L01", current = lessonRegistry.get(id)!;
const beforeParagraph = old.lesson.sections.at(-1).blocks.at(-1).text;
const afterParagraph = current.sections.at(-1)!.blocks.at(-1)!;
assert.equal(afterParagraph.type, "paragraph");
const expected = structuredClone(old.lesson); expected.sections.at(-1).blocks.at(-1).text = afterParagraph.text;
assert.deepEqual(current, expected, "1.1只允许最后状态段变化");
const currentPublication = publicationManifest.find(p => p.lessonId === id)!;
// 只存两种已核对指纹，不把用户未提交源码嵌入交付包。
const workspaceOnly = ["next-env.d.ts", "scripts/ai000-r3-compatibility.ts", "src/components/lesson/reader.tsx", "tests/reading-experience.test.ts"].map(path => ({ path, workspaceSha256: base.files[path], repositorySha256: sha(execFileSync("git", ["show", `${base.head}:${path}`], { encoding: "utf8" })) }));
// 旧证据含混合换行，不能用“全部CRLF/全部LF”猜原摘要。仅为仍逐字节命中旧基线的UTF-8文本登记LF摘要。
const protectedText = (await Promise.all(Object.entries(base.files as Record<string, string>).map(async ([path, baselineSha256]) => {
  const bytes = await readFile(path), text = bytes.toString("utf8"), lf = text.replaceAll("\r\n", "\n");
  return sha(bytes.toString("utf8")) === baselineSha256 && !text.includes("\0") && Buffer.from(text).equals(bytes) && lf !== text ? { path, baselineSha256, lfSha256: sha(lf) } : null;
}))).filter(row => row !== null);
const plan = { baseline: base.head, addedLessonIds: ["PY101-C01-L03"], workspaceOnly, protectedText, sources, lessons: [{ id, before: old.lesson, afterSha256: sha(JSON.stringify(current)) }], publications: JSON.stringify(old.publication) === JSON.stringify(currentPublication) ? [] : [{ id, before: old.publication, afterSha256: sha(JSON.stringify(currentPublication)) }] };
await writeFile(`${dir}/APPROVED_CHANGES.json`, JSON.stringify(plan, null, 2) + "\n");
await writeFile(`${dir}/FIRST_LESSON_AMENDMENT.json`, JSON.stringify({ id, section: "next-step", block: "last paragraph", beforeParagraph, afterParagraph: afterParagraph.text, beforeObjectSha256: sha(JSON.stringify(old.lesson)), afterObjectSha256: sha(JSON.stringify(current)), beforeContentVersion: old.lesson.contentVersion, afterContentVersion: current.contentVersion, assessmentUnchanged: true, progressScopeUnchanged: true }, null, 2) + "\n");
console.log("授权段落与接入文件完整摘要已登记；旧证据未覆盖。");
