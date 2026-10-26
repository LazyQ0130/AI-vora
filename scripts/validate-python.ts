import { spawnSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { lessonRegistry } from "../src/lib/course-engine";
import { corePrograms, regressionCoreCode } from "../src/content/resources/core-programs";
import { programs, gradientDescentCode } from "../src/content/resources/programs";

const python = process.env.AIVORA_PYTHON ?? "python";
function run(args: string[]) {
  const result = spawnSync(python, args, {
    encoding: "utf8",
    env: { ...process.env, PYTHONIOENCODING: "utf-8" },
    timeout: 30_000,
  });
  if (result.error || result.status !== 0)
    throw new Error(`Python 校验失败：${result.error ?? result.stderr}`);
  return {
    exitCode: result.status,
    stdout: result.stdout.replace(/\r\n/g, "\n").trim(),
    stderr: result.stderr.replace(/\r\n/g, "\n").trim(),
  };
}
const environment = run([
  "-c",
  "import sys,numpy; print(sys.version.split()[0]); print('NumPy',numpy.__version__)",
]);
const unit = run([
  "-m",
  "unittest",
  "discover",
  "-s",
  "tests",
  "-p",
  "test_*.py",
  "-v",
]);
const examples = [...lessonRegistry.values()].flatMap((lesson) =>
  lesson.sections.flatMap((section) =>
    section.blocks.flatMap((block) => {
      if (block.type !== "code" || block.language !== "python") return [];
      const result = run(["-c", block.code]);
      return [
        {
          lessonId: lesson.id,
          sectionId: section.id,
          filename: block.filename,
          ...result,
        },
      ];
    }),
  ),
);
const expectedOutputs: Record<keyof typeof corePrograms, string> = {
  "function-basics": "6", "function-binding": "12\n12", "function-return": "4\n4 None",
  "function-scope": "5\n10", "function-defaults": "6\n12", "vector-basics": "[4, 3] [2, 4]",
  "vector-dot": "5", "matrix-shape": "[[1, 4], [2, 5], [3, 6]]",
  "matrix-product": "[[4 6]\n [1 3]]", "numpy-shapes": "(2,) (2,)\n(2, 1) (1, 2)\n5",
};
const coreComparisons = Object.entries(corePrograms).map(([id, sample]) => {
  const core = run(["-c", sample.core + "\n" + sample.checks]);
  const full = run(["-c", programs[id as keyof typeof corePrograms].code]);
  if (core.stdout !== expectedOutputs[id as keyof typeof corePrograms] || core.stdout !== full.stdout)
    throw new Error(`核心/完整版输出与预期不一致：${id}`);
  return { id, expected: expectedOutputs[id as keyof typeof corePrograms], ...core, fullMatches: true };
});
const trainingComparison = run(["-c", `import numpy as np
core, full = {}, {}
exec(${JSON.stringify(regressionCoreCode)}, core)
exec(${JSON.stringify(gradientDescentCode)}, full)
np.testing.assert_allclose([core['w'], core['b'], core['final_loss']], [full['w'], full['b'], full['final_loss']], atol=1e-12, rtol=0)
np.testing.assert_allclose([core['w'], core['b']], [2,1], atol=1e-7, rtol=0)
assert core['final_loss'] < 1e-10
print('core/full training match; independent expected line y=2x+1')
`]);
const report = {
  checkedAt: new Date().toISOString(),
  environment: environment.stdout,
  unittest: unit,
  examples,
  coreComparisons,
  trainingComparison,
  note: "技术校验通过；不代表人工内容审核、试学或正式发布。代码来自仓库静态教材，仅开发阶段执行。",
};
await writeFile(
  "docs/TEACHING_V2_1_PYTHON_RESULTS.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  `Python 单元测试通过，${examples.length} 个网页代码块全部实际执行通过，11 组核心/完整版一致。证据：docs/TEACHING_V2_1_PYTHON_RESULTS.json`,
);
