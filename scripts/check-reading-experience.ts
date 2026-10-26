import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { lessonRegistry } from "../src/lib/course-engine";
import { evidencePath } from "./evidence-path";

const fingerprint = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const entries = [...lessonRegistry.values()].map((lesson) => ({
  id: lesson.id, version: lesson.contentVersion, digest: fingerprint(lesson),
  sections: lesson.sections.map((section) => section.id),
  assessmentMap: lesson.assessmentMap,
  exercises: fingerprint(lesson.sections.flatMap((section) => section.blocks.filter((block) => block.type === "exercise"))),
}));
const baselinePath = evidencePath("BASELINE.json");
if (process.argv.includes("--baseline")) {
  writeFileSync(baselinePath, JSON.stringify(entries, null, 2) + "\n", { flag: "wx" });
  console.log(`实际注册稿基线已保存：${entries.length} 节`);
} else {
  const before = JSON.parse(readFileSync(baselinePath, "utf8")) as typeof entries;
  assert.equal(entries.length, before.length);
  for (const original of before) {
    const current = entries.find((entry) => entry.id === original.id)!;
    assert.ok(current);
    assert.equal(current.version, original.version);
    assert.deepEqual(current.sections, original.sections);
    assert.deepEqual(current.assessmentMap, original.assessmentMap);
    assert.equal(current.exercises, original.exercises, `${original.id}: 核心考核与反馈不变`);
    if (original.id !== "AI000-C01-L01") assert.equal(current.digest, original.digest);
  }
  writeFileSync(evidencePath("CONTENT_COMPATIBILITY.json"), JSON.stringify({
    checkedAt: new Date().toISOString(), unchangedOtherLessons: entries.length - 1,
    allVersionsAnchorsAndAssessmentsPreserved: true, entries,
  }, null, 2) + "\n");
  console.log(`${entries.length} 节版本/锚点/考核兼容，其他 ${entries.length - 1} 节注册内容逐字节不变`);
}
