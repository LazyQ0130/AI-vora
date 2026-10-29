import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { lessonRegistry, getLearningCourse, resolveLesson } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";

// 同一审计入口复用至后续单课；原P3默认及证据保持，不复制一套审计器。
const round = process.env.AIVORA_AUDIT_ROUND ?? "py101-p3";
assert.ok(["py101-p3", "py101-p4", "py101-p5"].includes(round));
const isP4 = round === "py101-p4";
const isP5 = round === "py101-p5";
const dir = `docs/${round}`, id = isP5 ? "PY101-C01-L06" : isP4 ? "PY101-C01-L05" : "PY101-C01-L04", amend = isP5 ? "PY101-C01-L05" : isP4 ? "PY101-C01-L04" : "PY101-C01-L03";
const sha = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const git = (...args: string[]) => execFileSync("git", args, { encoding: "utf8" }).trimEnd();
await mkdir(dir, { recursive: true });
const userFiles = ["next-env.d.ts", "scripts/ai000-r3-compatibility.ts", "src/components/lesson/reader.tsx", "tests/reading-experience.test.ts"];
const allowedSources = isP5
  ? ["src/lib/course-engine.ts", "src/content/publication-manifest.ts", "src/content/lessons/py101/notebook-cell-order.ts", "src/content/resources/python-notebook.ts", "scripts/audit-py101-p3.ts", "scripts/py101-p1-compatibility.ts", "scripts/validate-python.ts", "scripts/prepare-downloads.ts", "tests/py101-first-run.test.ts", "tests/py101-notebook-cell-order.test.ts"]
  : isP4
  ? ["src/lib/course-engine.ts", "src/content/publication-manifest.ts", "src/content/lessons/py101/project-environments.ts", "scripts/audit-py101-p3.ts", "scripts/py101-p1-compatibility.ts", "scripts/validate-python.ts", "scripts/prepare-downloads.ts", "tests/py101-project-environments.test.ts"]
  : [".gitignore", "src/lib/course-engine.ts", "src/content/publication-manifest.ts", "src/content/lessons/py101/editor-rerun.ts", "scripts/py101-p1-compatibility.ts", "scripts/validate-python.ts", "tests/py101-editor-rerun.test.ts", "tests/course-engine.test.ts", "tests/cross-discipline-editorial.test.ts", "tests/ai000-quality.test.ts", "src/app/learning-system.css"];
if (process.argv.includes("--baseline")) {
  const paths = git("ls-files", "-z").split("\0").filter(Boolean);
  const files = Object.fromEntries(await Promise.all(paths.map(async path => {
    const bytes = await readFile(path), text = bytes.toString("utf8");
    const validText = !text.includes("\0") && Buffer.from(text).equals(bytes);
    return [path, { sha256: sha(bytes), ...(validText ? { lfSha256: sha(text.replaceAll("\r\n", "\n")) } : {}) }];
  })));
  const baseline = { head: git("rev-parse", "HEAD"), status: git("status", "--short"), files, lessons: Object.fromEntries([...lessonRegistry].map(([id, value]) => [id, sha(JSON.stringify(value))])), publications: Object.fromEntries(publicationManifest.map(value => [value.lessonId, sha(JSON.stringify(value))])), amendmentBefore: lessonRegistry.get(amend), publicationBefore: publicationManifest.find(p => p.lessonId === amend) };
  await writeFile(`${dir}/BASELINE.json`, JSON.stringify(baseline, null, 2) + "\n", { flag: "wx" });
  await writeFile(`${dir}/APPROVED_CHANGES.json`, JSON.stringify({ baseline: baseline.head, addedLessonIds: [id], sources: [], lessons: [], publications: [], workspaceOnly: [], protectedText: [] }, null, 2) + "\n", { flag: "wx" });
  console.log(`改前${lessonRegistry.size}课与${paths.length}个跟踪文件已留摘要；不复制无关教材全文。`);
} else {
  const base = JSON.parse(await readFile(`${dir}/BASELINE.json`, "utf8"));
  if (process.argv.includes("--register")) {
    const sources = await Promise.all(allowedSources.map(async path => {
      const before = execFileSync("git", ["show", `${base.head}:${path}`], { encoding: "utf8" });
      const current = (await readFile(path, "utf8")).replaceAll("\r\n", "\n");
      return before.replaceAll("\r\n", "\n") === current ? null : { path, before, afterSha256: sha(current) };
    }));
    const current = lessonRegistry.get(amend)!;
    const expected = structuredClone(base.amendmentBefore);
    const last = expected.sections.at(-1); last.blocks[last.blocks.length - 1] = current.sections.at(-1)!.blocks.at(-1);
    assert.deepEqual(current, expected, `只允许${amend}最后状态段变化`);
    const publication = publicationManifest.find(p => p.lessonId === amend)!;
    const workspaceOnly = userFiles.map(path => ({ path, workspaceSha256: base.files[path].sha256, repositorySha256: sha(execFileSync("git", ["show", `${base.head}:${path}`])) }));
    const plan = { baseline: base.head, addedLessonIds: [id], sources: sources.filter(Boolean), lessons: [{ id: amend, before: base.amendmentBefore, afterSha256: sha(JSON.stringify(current)) }], publications: JSON.stringify(publication) === JSON.stringify(base.publicationBefore) ? [] : [{ id: amend, before: base.publicationBefore, afterSha256: sha(JSON.stringify(publication)) }], workspaceOnly, protectedText: Object.entries(base.files as Record<string, { sha256: string; lfSha256?: string }>).filter(([, file]) => file.lfSha256 && file.lfSha256 !== file.sha256).map(([path, file]) => ({ path, baselineSha256: file.sha256, lfSha256: file.lfSha256 })) };
    await writeFile(`${dir}/APPROVED_CHANGES.json`, JSON.stringify(plan, null, 2) + "\n");
    const oldBlock = base.amendmentBefore.sections.at(-1).blocks.at(-1), newBlock = current.sections.at(-1)!.blocks.at(-1);
    await writeFile(`${dir}/TRANSITION_AMENDMENT.json`, JSON.stringify({ lessonId: amend, before: oldBlock, after: newBlock, beforeSha256: base.lessons[amend], afterSha256: sha(JSON.stringify(current)), version: current.contentVersion, assessmentUnchanged: true, progressScopeUnchanged: true }, null, 2) + "\n");
    console.log("已登记最小状态勘误及必要工程变化；不覆盖历史证据。");
  } else if (process.argv.includes("--draft")) {
    const entry = publicationManifest.find(p => p.lessonId === id)!;
    assert.equal(entry.status, "draft"); assert.equal(entry.access, "private"); assert.equal(resolveLesson("PY101", id), undefined);
    await writeFile(`${dir}/DRAFT_GATE.json`, JSON.stringify({ checkedAt: new Date().toISOString(), lessonId: id, status: entry.status, access: entry.access, registered: lessonRegistry.has(id), readable: false }, null, 2) + "\n");
    console.log("draft/private已登记且不可读。");
  } else {
    const plan = JSON.parse(await readFile(`${dir}/APPROVED_CHANGES.json`, "utf8"));
    for (const [path, file] of Object.entries(base.files as Record<string, { sha256: string; lfSha256?: string }>)) {
      const bytes = await readFile(path);
      if (sha(bytes) === file.sha256) continue;
      assert.ok(!userFiles.includes(path), `用户原文件变化：${path}`);
      const entry = plan.sources.find((row: { path: string }) => row.path === path);
      assert.ok(entry && sha(entry.before.replaceAll("\r\n", "\n")) === file.lfSha256 && sha(bytes.toString("utf8").replaceAll("\r\n", "\n")) === entry.afterSha256, path);
    }
    for (const [path, hash] of Object.entries(base.untracked ?? {})) assert.equal(sha(await readFile(path)), hash, `原未跟踪文件变化：${path}`);
    for (const kind of ["lessons", "publications"] as const) {
      const current = kind === "lessons" ? Object.fromEntries([...lessonRegistry].filter(([key]) => key !== id).map(([key, value]) => [key, sha(JSON.stringify(value))])) : Object.fromEntries(publicationManifest.filter(p => p.lessonId !== id).map(p => [p.lessonId, sha(JSON.stringify(p))]));
      assert.deepEqual(Object.keys(current).sort(), Object.keys(base[kind]).sort());
      for (const [key, hash] of Object.entries(base[kind])) {
        if (current[key] === hash) continue;
        const entry = plan[kind].find((row: { id: string }) => row.id === key);
        assert.ok(entry && sha(JSON.stringify(entry.before)) === hash && current[key] === entry.afterSha256, key);
      }
    }
    const course = getLearningCourse("PY101")!;
    assert.equal(course.status, "planned"); assert.ok(resolveLesson("PY101", id));
    for (const slot of course.chapters[0].lessons.slice(Number(id.slice(-2)))) assert.equal(resolveLesson("PY101", slot.lessonId), undefined);
    assert.equal(git("ls-files", "--", "**/.venv/**"), "");
    await writeFile(`${dir}/COMPATIBILITY.json`, JSON.stringify({ checkedAt: new Date().toISOString(), baseline: base.head, previousLessons: Object.keys(base.lessons).length, protectedFiles: Object.keys(base.files).length, originalUserFilesUnchanged: userFiles, oldLessonChanges: plan.lessons.map((row: { id: string }) => row.id), oldPublicationsChanged: plan.publications.map((row: { id: string }) => row.id), newLesson: id, courseStatus: course.status, untrackedEnvironments: true }, null, 2) + "\n");
    console.log("历史摘要、授权变化、用户工作区、规划课与环境未跟踪检查通过。");
  }
}
