import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const manifest = JSON.parse(
  await readFile("docs/IMAGE_GENERATION_V2.json", "utf8"),
);
await mkdir("public/artwork", { recursive: true });
for (const asset of manifest.assets) {
  const result = await sharp(asset.source)
    .resize({
      width: asset.name.startsWith("hero") ? 1920 : 960,
      withoutEnlargement: true,
    })
    .webp({ quality: asset.name.startsWith("hero") ? 87 : 85, effort: 6 })
    .toFile(asset.output);
  asset.width = result.width;
  asset.height = result.height;
  asset.bytes = result.size;
  console.log(
    `${asset.output}: ${result.width}x${result.height}, ${Math.round(result.size / 1024)} KB`,
  );
}
await writeFile(
  "docs/IMAGE_GENERATION_V2.json",
  JSON.stringify(manifest, null, 2) + "\n",
  "utf8",
);
