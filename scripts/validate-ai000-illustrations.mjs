import assert from 'node:assert/strict';
import {readFile,stat,writeFile} from 'node:fs/promises';
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
await writeFile('docs/ai000-4-4/IMAGE_CHECKS.json',JSON.stringify({checkedAt:new Date().toISOString(),scope:'路径/真实编码/尺寸/体积/非空白/完整提示词，不替代人工视觉与事实核查',results},null,2)+'\n');
console.log(`${results.length}张实际WebP文件与元信息检查通过`);
