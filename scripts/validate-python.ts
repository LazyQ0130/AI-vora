import { spawnSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { lessonRegistry } from "../src/lib/course-engine";

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
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
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
const report = {
  checkedAt: new Date().toISOString(),
  environment: environment.stdout,
  unittest: unit,
  examples,
  note: "技术校验通过；不代表人工内容审核、试学或正式发布。代码来自仓库静态教材，仅开发阶段执行。",
};
await writeFile(
  "docs/TEACHING_V2_PYTHON_RESULTS.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  `Python 单元测试通过，${examples.length} 个网页代码块全部实际执行通过。证据：docs/TEACHING_V2_PYTHON_RESULTS.json`,
);
