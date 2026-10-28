import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import katex from "katex";
import sharp from "sharp";
import { lessonRegistry, resolveLesson } from "../src/lib/course-engine";
import { programs } from "../src/content/resources/programs";
import { readablePublications } from "../src/content/publication-manifest";

test("四门不同类型教材用同一模型，公式可严格解析，图片有正确尺寸和可读替代文字", async () => {
  assert.equal(readablePublications.length, 38);
  for (const publication of readablePublications) {
    const { lesson } = resolveLesson(
      publication.courseId,
      publication.lessonId,
    )!;
    const blocks = lesson.sections.flatMap((s) => s.blocks);
    if (lesson.courseId === "AI000") {
      assert.equal(blocks.filter((block) => block.type === "exercise").length, 2);
      // 不设每课配图门槛；原14幅精确图由兼容测试逐幅保护，5.1采用可回查表格。
      assert.ok(blocks.some((block) => block.type === "table"));
      assert.ok(blocks.every((block) => !["code", "math", "experiment"].includes(block.type)));
    } else if (lesson.courseId === "MA101" && publication.catalogRole !== "legacy") {
      assert.ok(lesson.sections.filter((section) => section.tier === "core").flatMap((section) => section.blocks).filter((block) => block.type === "exercise").length >= 2);
      assert.ok(blocks.some((block) => block.type === "vector-figure"));
      assert.ok(lesson.sections.filter((section) => section.tier === "core").every((section) => !section.blocks.some((block) => block.type === "code")));
    } else {
      assert.ok(blocks.filter((b) => b.type === "quiz").length >= 2);
      assert.ok(blocks.some((b) => b.type === "code"));
    }
    assert.equal(publication.status, "pending-review");
    assert.equal(publication.reviewEvidence, undefined);
    for (const block of blocks) {
      if (block.type === "math")
        assert.doesNotThrow(() =>
          katex.renderToString(block.latex, {
            throwOnError: true,
            strict: "error",
            trust: false,
          }),
        );
      if (block.type === "image") {
        const bytes = await readFile(`public${block.src}`);
        const metadata = await sharp(bytes).metadata();
        assert.equal(metadata.format, block.src.endsWith(".webp") ? "webp" : "png");
        assert.equal(metadata.width, block.width);
        assert.equal(metadata.height, block.height);
        assert.ok(block.alt.length > 30);
        if (block.mobile) {
          const mobileBytes = await readFile(`public${block.mobile.src}`);
          const mobileMetadata = await sharp(mobileBytes).metadata();
          assert.equal(mobileMetadata.format, block.mobile.src.endsWith(".webp") ? "webp" : "png");
          assert.equal(mobileMetadata.width, block.mobile.width);
          assert.equal(mobileMetadata.height, block.mobile.height);
        }
      }
    }
    for (const resource of lesson.resources)
      assert.ok((await stat(`public${resource.href}`)).size > 0);
  }
  assert.deepEqual(
    [...new Set([...lessonRegistry.values()].map((l) => l.courseId))].sort(),
    ["AI000", "MA101", "ML201", "PY101"],
  );
});
test("全部下载脚本、Notebook 和网页完整代码同源，Notebook 不伪造执行结果", async () => {
  const codeBlocks = [...lessonRegistry.values()]
    .flatMap((l) => l.sections.flatMap((s) => s.blocks))
    .filter((b) => b.type === "code");
  for (const program of Object.values(programs)) {
    assert.equal(
      await readFile(`public/downloads/${program.filename}.py`, "utf8"),
      program.code,
    );
    assert.ok(
      codeBlocks.some(
        (block) =>
          block.code === program.code &&
          block.filename === `${program.filename}.py`,
      ),
    );
    const notebook = JSON.parse(
      await readFile(`public/downloads/${program.filename}.ipynb`, "utf8"),
    );
    assert.equal(notebook.cells[1].source.join(""), program.code);
    assert.equal(notebook.cells[1].execution_count, null);
    assert.deepEqual(notebook.cells[1].outputs, []);
  }
});
test("课程体系 V1.0 的原始 Markdown 和 JSON 字节未变", async () => {
  for (const [path, hash] of [
    [
      "curriculum/AI技术课程体系_V1.0.md",
      "b863f49f3da43225b009b7053dff79d6b5985bf8da9327f7701bc40c0c9d5a73",
    ],
    [
      "curriculum/AI技术课程目录_V1.0.json",
      "a7f5723c2ac659bfe271eeeffc050c2d96c46fd68e29391051c88f5db2812366",
    ],
  ])
    assert.equal(
      createHash("sha256")
        .update(await readFile(path))
        .digest("hex"),
      hash,
    );
});
