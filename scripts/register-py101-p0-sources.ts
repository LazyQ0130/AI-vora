import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

// 显式维护精确清单，不写入或覆盖任何AI000历史证据。
const paths = ["src/content/course-outline.ts", "src/content/publication-manifest.ts", "src/lib/course-engine.ts", "src/content/resources/core-programs.ts", "src/content/resources/programs.ts", "scripts/validate-python.ts", "scripts/ai000-capstone-compatibility.ts"];
const sources = await Promise.all(paths.map(async path => {
  const before = execFileSync("git", ["show", `81feeb132336e499bbc05d346cbe5d9710472723:${path}`], { encoding: "utf8" }).replaceAll("\r\n", "\n");
  const after = (await readFile(path, "utf8")).replaceAll("\r\n", "\n");
  return { path, before, afterSha256: createHash("sha256").update(after).digest("hex") };
}));
await writeFile("docs/py101-p0/SOURCE_CHANGES.json", JSON.stringify(sources, null, 2) + "\n");
console.log(`已登记${sources.length}个必要接入文件的精确改前内容/改后摘要。`);
