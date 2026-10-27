import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// 仅对已选生成素材等比例缩放/转WebP，不裁切、画图或修正画面内容。
const root=process.cwd(), dir='docs/ai000-4-4';
const {entries}=JSON.parse(await readFile(path.join(dir,'GENERATION_RECORDS.json'),'utf8'));
const assets=[];
for (const entry of entries) {
  const output=path.join(root,'public',entry.src);
  await mkdir(path.dirname(output),{recursive:true});
  const original=await sharp(entry.generatedSource).metadata();
  await sharp(entry.generatedSource).resize({width:1200,withoutEnlargement:true}).webp({quality:82,effort:6}).toFile(output);
  const info=await sharp(output).metadata(), bytes=(await stat(output)).size;
  assets.push({...entry,width:info.width,height:info.height,bytes,encoding:info.format,originalWidth:original.width,originalHeight:original.height});
}
await writeFile(path.join(dir,'ILLUSTRATION_ASSETS.json'),JSON.stringify({optimizedAt:new Date().toISOString(),method:'sharp: proportional width<=1200; WebP quality82 effort6; no crop or content edits',assets},null,2)+'\n');
const metadata=assets.map(({lessonId,section,index,src,alt,caption,width,height})=>({lessonId,section,index,src,alt,caption,width,height}));
await writeFile('src/content/lessons/ai000/illustrations.ts',`import type { ContentBlock } from "../../models";\n\n// 情境插画清单；制作与视觉核查见docs/AI000_ILLUSTRATION_MANIFEST.md，不替代精确技术图。\nexport const ai000Illustrations = ${JSON.stringify(metadata,null,2)};\n\nexport function illustration(lessonId: string): Extract<ContentBlock, { type: "image" }> {\n  const asset=ai000Illustrations.find(a=>a.lessonId===lessonId);\n  if (!asset) throw new Error("缺少已生成的课时插画："+lessonId);\n  const {src,alt,caption,width,height}=asset;\n  return {type:"image",src,alt,caption,width,height};\n}\n`);
console.log(`${assets.length}张选定素材已等比例优化，${assets.reduce((n,a)=>n+a.bytes,0)}字节；未复制原始候选进生产目录`);
