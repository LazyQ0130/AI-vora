import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { courses } from "../src/lib/curriculum";
import { courseCovers, getCourseCover } from "../src/lib/artwork";

test("20 门课程都拥有独立且实际存在的 WebP 封面，不回退为共用配图", async () => {
  assert.deepEqual(Object.keys(courseCovers).sort(), courses.map(c => c.id).sort());
  const covers = courses.map(c => getCourseCover(c.id));
  assert.equal(new Set(covers.map(c => c.src)).size, 20);
  const hashes = await Promise.all(covers.map(async cover => {
    assert.match(cover.src, /^\/artwork\/courses-v5\/.+\.webp$/);
    assert.ok(cover.alt.length > 15);
    const bytes = await readFile(`public${cover.src}`);
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    assert.ok(bytes.length < 150_000, "卡片图片应保持合理的加载体积");
    return createHash("sha256").update(bytes).digest("hex");
  }));
  assert.equal(new Set(hashes).size, 20, "不能把同一张图片复制为不同文件名");
});

test("未配置的课程封面明确报错，避免重新引入通用图掩盖遗漏", () => {
  assert.throws(() => getCourseCover("unknown"), /Missing course cover/);
});
