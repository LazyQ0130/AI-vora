import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";

const paths = ["src/content/publication-manifest.ts", "src/lib/course-engine.ts", "scripts/py101-p0-compatibility.ts"];
const sources = await Promise.all(paths.map(async path => ({
  path,
  before: execFileSync("git", ["show", `1fd65b923ee4a535fac140dd28d0fceae1a19ae9:${path}`], { encoding: "utf8" }).replaceAll("\r\n", "\n"),
  afterSha256: createHash("sha256").update((await readFile(path, "utf8")).replaceAll("\r\n", "\n")).digest("hex"),
})));
await writeFile("docs/py101-p1/SOURCE_CHANGES.json", JSON.stringify(sources, null, 2) + "\n");
console.log("P1必要接入源码已精确登记，P0及AI000历史证据未覆盖。");
