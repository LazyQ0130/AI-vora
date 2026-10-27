import assert from 'node:assert/strict';
import {readFile,stat,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const {assets}=JSON.parse(await readFile('docs/ai000-4-4/ILLUSTRATION_ASSETS.json','utf8'));
const results=[];
for(const a of assets){
  assert.match(a.src,/^\/images\/lessons\/ai000\/ai000-c\d\d-l\d\d-[a-z-]+\.webp$/);
  const file=path.join(process.cwd(),'public',a.src),meta=await sharp(file).metadata(),stats=await sharp(file).stats(),bytes=(await stat(file)).size;
  assert.equal(meta.format,'webp');assert.equal(meta.width,a.width);assert.equal(meta.height,a.height);assert.equal(bytes,a.bytes);assert.ok(bytes<250000);assert.ok(stats.channels.some(c=>c.stdev>15),'不是空白占位图');
  assert.ok(a.alt.length>10&&a.caption.length>10&&a.prompt.length>200&&a.generatedSource&&a.tool==='image_gen.imagegen');
  results.push({lessonId:a.lessonId,src:a.src,width:meta.width,height:meta.height,bytes,encoding:meta.format,channelStddev:stats.channels.map(c=>c.stdev),passed:true});
}
const dir=process.env.AIVORA_EVIDENCE_DIR ?? 'docs/ai000-visual-refinement';
assert.notEqual(path.resolve(dir),path.resolve('docs/ai000-4-4'),'不覆盖历史生成证据');
await mkdir(dir,{recursive:true});
await writeFile(path.join(dir,'ARCHIVED_IMAGE_CHECKS.json'),JSON.stringify({checkedAt:new Date().toISOString(),scope:'仅检查保留的历史素材：路径/编码/尺寸/体积/来源；不要求接入正文，也不是未来每课配图指标',results},null,2)+'\n');
console.log(`${results.length}张归档WebP与历史元信息检查通过；当前正文引用另由视觉去冗余检查核实`);
