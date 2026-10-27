import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { lessonRegistry } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import type { Lesson, Publication } from "../src/content/models";
import { ai000Illustrations, illustration } from "../src/content/lessons/ai000/illustrations";

const dir = "docs/ai000-visual-refinement";
mkdirSync(dir,{recursive:true});
const sha = (bytes: string | Buffer) => createHash("sha256").update(bytes).digest("hex");
const plan = JSON.parse(readFileSync("docs/ai000-4-4/ILLUSTRATION_PLAN.json","utf8")).entries as {lessonId:string;file:string}[];
const lessonPaths = plan.map(p=>"src/content/lessons/ai000/"+p.file);
const git = (...args:string[]) => execFileSync("git",args,{encoding:"utf8"});
export const visualRefinementEvidence = "docs/AI000_VISUAL_CONTENT_REFINEMENT.md";
export function expectedAfterSceneRemoval(lesson: Lesson): Lesson {
  const asset = ai000Illustrations.find(a=>a.lessonId===lesson.id);
  if (!asset) return lesson;
  const expected=structuredClone(lesson), section=expected.sections.find(s=>s.id===asset.section)!;
  assert.deepEqual(section.blocks[asset.index],illustration(lesson.id),"基线必须是已登记的完整历史图块");
  section.blocks.splice(asset.index,1);
  return expected;
}
type Baseline = {base:string;lessons:Lesson[];publications:Publication[];sources:{path:string;text:string}[];protectedFiles:{path:string;sha256:string}[]};

// 可被测试导入，命令行才执行留证，避免导入造成快照写入。
if (process.argv[1]?.replaceAll("\\","/").endsWith("/review-ai000-visual-refinement.ts")) {
  if (process.argv.includes("--baseline")) {
    const paths=git("ls-files","-z","curriculum","src/content/lessons","src/content/resources","src/components/lesson","src/content/models.ts","src/lib/learning-progress.ts","src/lib/use-learning-progress.ts","src/content/ai000-study-time.ts","src/content/ai000-outline.ts","next.config.ts","docs/ai000-4-4","docs/AI000_LESSON_4_4_AND_VISUAL_REFINEMENT.md","public/images/lessons/ai000").split("\0").filter(p=>p && !lessonPaths.includes(p) && !p.endsWith("/illustrations.ts"));
    writeFileSync(join(dir,"BEFORE.json"),JSON.stringify({base:git("rev-parse","HEAD").trim(),remote:git("rev-parse","origin/main").trim(),workspace:git("status","--short"),lessons:[...lessonRegistry.values()],publications:publicationManifest,sources:lessonPaths.map(path=>({path,text:readFileSync(path,"utf8")})),protectedFiles:paths.map(path=>({path,sha256:sha(readFileSync(path))}))},null,2)+"\n",{flag:"wx"});
    console.log("36节改前全文、13篇源码和历史资源/精确图/通用机制摘要已独占保存");
  } else {
    const before=JSON.parse(readFileSync(join(dir,"BEFORE.json"),"utf8")) as Baseline;
    let removed=0, precise=0;
    const lessons=before.lessons.map(old=>{
      const current=lessonRegistry.get(old.id)!;
      assert.equal(JSON.stringify(current),JSON.stringify(expectedAfterSceneRemoval(old)),old.id+": 只允许移除指定场景图，其他区块逐项相同");
      if(old.courseId!=="AI000") return {id:old.id,unchanged:true};
      const oldBlocks=old.sections.flatMap(s=>s.blocks), blocks=current.sections.flatMap(s=>s.blocks);
      const oldImages=oldBlocks.filter(b=>b.type==="image").length, images=blocks.filter(b=>b.type==="image").length;
      removed+=oldImages-images;precise+=blocks.filter(b=>b.type==="ai-task-figure").length;
      assert.equal(blocks.some(b=>b.type==="image" && ai000Illustrations.some(a=>a.src===b.src)),false);
      assert.deepEqual(blocks.filter(b=>b.type==="ai-task-figure"),oldBlocks.filter(b=>b.type==="ai-task-figure"));
      return {id:old.id,contentVersion:current.contentVersion,beforeImages:oldImages,afterImages:images,preciseFigures:blocks.filter(b=>b.type==="ai-task-figure").map(b=>b.kind),tables:blocks.filter(b=>b.type==="table").length,assessmentMap:current.assessmentMap,sections:current.sections.map(s=>s.id)};
    });
    for(const source of before.sources){
      const id=plan.find(p=>source.path.endsWith("/"+p.file))!.lessonId;
      const expected=source.text.replace(/^import \{ illustration \} from "\.\/illustrations";\r?\n/m,"").replace(new RegExp('^[ \\t]*illustration\\("'+id+'"\\),\\r?\\n','m'),"");
      assert.notEqual(expected,source.text);
      assert.equal(readFileSync(source.path,"utf8").replaceAll("\r\n","\n"),expected.replaceAll("\r\n","\n"),source.path);
    }
    for(const file of before.protectedFiles) assert.equal(sha(readFileSync(file.path)),file.sha256,file.path);
    assert.equal(publicationManifest.length,before.publications.length);
    for(const old of before.publications) assert.deepEqual(publicationManifest.find(p=>p.lessonId===old.lessonId),old.courseId==="AI000"?{...old,technicalEvidence:visualRefinementEvidence}:old);
    assert.equal(removed,13);assert.equal(precise,14);
    writeFileSync(join(dir,"CONTENT_CHECKS.json"),JSON.stringify({checkedAt:new Date().toISOString(),base:before.base,removedSceneReferences:removed,preservedPreciseFigures:precise,unchangedOtherLessons:23,versionsAndAllNonSceneContentUnchanged:true,protectedFileCount:before.protectedFiles.length,lessons},null,2)+"\n");
    console.log(`${removed}处场景引用移除；${precise}幅精确图保留；36节全部非场景图内容/版本/锚点及历史资源保持`);
  }
}
