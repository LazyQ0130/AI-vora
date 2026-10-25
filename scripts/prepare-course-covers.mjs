import { access, copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const manifestPath = "docs/COURSE_COVERS_V5.json";
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
await mkdir("references/generated-v5", { recursive: true });
await mkdir("public/artwork/courses-v5", { recursive: true });

for (const asset of manifest.assets) {
  try {
    await access(asset.source);
  } catch {
    if (!asset.generationFile) throw new Error(`Missing original: ${asset.id}`);
    await copyFile(asset.generationFile, asset.source);
  }
  const result = await sharp(asset.source)
    .resize(960, 540, { fit: "cover", position: "centre" })
    .webp({ quality: 86, effort: 6 })
    .toFile(asset.output);
  asset.width = result.width;
  asset.height = result.height;
  asset.bytes = result.size;
  console.log(`${asset.id}: ${result.width}×${result.height}, ${Math.round(result.size / 1024)} KB`);
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
