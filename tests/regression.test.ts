import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gradient, loss, train } from "../src/lib/regression";
import { sampleCode, sampleLesson } from "../src/content/sample";
import { courses } from "../src/lib/curriculum";
import { learningPaths, branches } from "../src/lib/paths";

test("MSE 解析梯度通过有限差分校验", () => {
  for (const [w, b] of [
    [0, 0],
    [1.5, -0.2],
    [2, 1],
  ]) {
    const eps = 1e-5;
    const g = gradient(w, b);
    assert.ok(
      Math.abs(g.dw - (loss(w + eps, b) - loss(w - eps, b)) / (2 * eps)) < 1e-7,
    );
    assert.ok(
      Math.abs(g.db - (loss(w, b + eps) - loss(w, b - eps)) / (2 * eps)) < 1e-7,
    );
  }
});
test("合理步长收敛；零迭代、过大步长与非法输入有明确定义", () => {
  const result = train(0.1, 2000);
  assert.ok(Math.abs(result.w - 2) < 1e-5);
  assert.ok(Math.abs(result.b - 1) < 1e-5);
  assert.ok(
    result.history.every((value, i, a) => i === 0 || value <= a[i - 1] + 1e-12),
  );
  assert.equal(train(0.1, 0).w, 0);
  assert.equal(train(1, 300).diverged, true);
  assert.throws(() => train(NaN, 10), RangeError);
  assert.throws(() => train(0.1, -1), RangeError);
});
test("下载源码和 Notebook 与页面代码完全同源", () => {
  assert.equal(
    readFileSync("public/downloads/linear_regression.py", "utf8"),
    sampleCode,
  );
  const notebook = JSON.parse(
    readFileSync("public/downloads/linear_regression.ipynb", "utf8"),
  );
  assert.equal(notebook.cells[1].source.join(""), sampleCode);
});
test("路线节点都来自真实目录；题目答案索引与解析完整", () => {
  const ids = new Set(courses.map((c) => c.id));
  learningPaths.forEach((path) =>
    path.stages.flat().forEach((id) => assert.ok(ids.has(id))),
  );
  branches.forEach((branch) =>
    branch.ids.forEach((id) => assert.ok(ids.has(id))),
  );
  sampleLesson.sections.forEach((section) =>
    section.blocks.forEach((block) => {
      if (block.type === "quiz") {
        assert.ok(block.correct >= 0 && block.correct < block.options.length);
        assert.equal(block.options.length, block.explanations.length);
      }
    }),
  );
});
