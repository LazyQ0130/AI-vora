import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {lessonRegistry,getLearningCourse,getAdjacentLessons,resolveLesson} from '../src/lib/course-engine';
import {publicationManifest} from '../src/content/publication-manifest';
import {lessonProgressScope} from '../src/lib/use-learning-progress';
import {createProgressStore,progressKey,parseReadingProgress} from '../src/lib/learning-progress';
import {beforeApprovedPy101Object,beforeApprovedPy101Source} from '../scripts/py101-p1-compatibility';
import type {Lesson} from '../src/content/models';
const plan=JSON.parse(readFileSync('docs/py101-p15/APPROVED_CHANGES.json','utf8')) as {baseline:string;sources:{path:string;before:string;afterSha256:string}[];lessons:{id:string;before:Lesson;afterSha256:string}[];publications:{id:string;before:unknown;afterSha256:string}[];addedLessonIds:string[];workspaceOnly:unknown[];protectedText:unknown[]};
const baseline=JSON.parse(readFileSync('docs/py101-p15/BASELINE.json','utf8'));
const sha=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const blocks=(l:Lesson)=>l.sections.flatMap(s=>s.blocks);

test('P15真实12r2对象与Publication、稳定锚点/目标映射/先修一致；完整摘要拒绝未知附加改写',()=>{
 assert.equal(plan.lessons.length,12);assert.deepEqual([plan.addedLessonIds,plan.workspaceOnly,plan.protectedText],[[],[],[]]);
 for(const row of plan.lessons){
  const l=lessonRegistry.get(row.id)!,p=publicationManifest.find(p=>p.lessonId===l.id)!;
  assert.equal(sha(l),row.afterSha256);assert.equal(l.contentVersion,2);
  assert.deepEqual([l.id,l.title,l.chapterId,l.prerequisites,l.prerequisiteLinks,l.objectives,l.assessmentMap],[row.before.id,row.before.title,row.before.chapterId,row.before.prerequisites,row.before.prerequisiteLinks,row.before.objectives,row.before.assessmentMap]);
  assert.deepEqual(l.sections.map(s=>s.id),row.before.sections.map(s=>s.id));
  for(const type of ['exercise','quiz']as const){const ids=(lesson:Lesson)=>blocks(lesson).flatMap(b=>(b.type==='exercise'||b.type==='quiz')&&b.type===type?[b.id]:[]);assert.deepEqual(ids(l),ids(row.before));}
  assert.deepEqual([p.contentVersion,p.status,p.access,p.reviewEvidence,p.technicalEvidence],[2,'pending-review','preview',undefined,'docs/py101-p15/TECHNICAL_REPORT.md']);
  assert.deepEqual(beforeApprovedPy101Object('lessons',l.id,l,plan.baseline),row.before);
  const extra={...l,title:l.title+' 未登记'};assert.deepEqual(beforeApprovedPy101Object('lessons',l.id,extra,plan.baseline),extra);
 }
 for(const row of plan.sources){const source=readFileSync(row.path,'utf8');assert.equal(beforeApprovedPy101Source(row.path,source,plan.baseline),row.before);assert.equal(beforeApprovedPy101Source(row.path,source+'\n// extra',plan.baseline),source+'\n// extra');}
 for(const [id,hash]of Object.entries(baseline.lessons))if(!plan.lessons.some(r=>r.id===id))assert.equal(sha(lessonRegistry.get(id)),hash,id);
 for(const [id,hash]of Object.entries(baseline.publications))if(!plan.publications.some(r=>r.id===id))assert.equal(sha(publicationManifest.find(p=>p.lessonId===id)),hash,id);
});

test('P15正式24题保留真实操作、两级提示和完整解释；减负未删去针对目标的运行',()=>{
 const requirements=[[/真实|实际/,/失败|错误/,/恢复|重跑/],[/三行表/,/只重跑/,/空格/],[/集成终端/,/真实输出/,/cwd/],[/Base/,/Interpreter/,/真实/],[/\.ipynb/,/重启/,/全跑/],[/六项最小复现单/,/cwd/,/身份/,/顺序/],[/两轮/,/NameError/],[/四/,/type/,/两轮/],[/两轮/,/手算/,/修复/],[/三轮/,/等值/],[/两组/,/type/,/ValueError/,/重新启动/],[/两组/,/三组/,/False/]];
 plan.lessons.forEach((row,i)=>{
  const l=lessonRegistry.get(row.id)!,tasks=blocks(l).filter(b=>b.type==='exercise'),old=blocks(row.before).filter(b=>b.type==='exercise');assert.equal(tasks.length,2);
  tasks.forEach((t,j)=>{assert.notEqual(t.prompt,old[j].prompt);assert.notDeepEqual(t.rubric,old[j].rubric);assert.deepEqual(t.hints,old[j].hints);assert.equal(t.hints.length,2);assert.ok(t.solution.length>=4);assert.ok(t.rubric.length>=3);assert.match(t.prompt,/交|提交/);});
  for(const re of requirements[i])assert.match(tasks.map(t=>t.prompt).join(''),re);
  for(const map of l.assessmentMap)for(const id of map.exerciseIds)assert.ok(tasks.some(t=>t.id===id));
 });
});

test('P15全部原网页代码与命令逐块保留；1.2正常成功先于受控失败',()=>{
 for(const row of plan.lessons){const codes=(l:Lesson)=>blocks(l).filter(b=>b.type==='code').map(b=>JSON.stringify(b)).sort();assert.deepEqual(codes(lessonRegistry.get(row.id)!),codes(row.before),row.id);}
 const first=lessonRegistry.get('PY101-C01-L02')!.sections[0].blocks.filter(b=>b.type==='code');
 assert.ok(first.findIndex(b=>b.code.includes('alpha\\run.py'))<first.findIndex(b=>b.code==='python run.py'));
});

test('P15学生正文移去出版状态，保第五章先修与12课具体诊断验证',()=>{
 const markers=[/新标记/,/当前目录|相对路径/,/缓冲区|未保存/,/同.*版本|版本相同/,/旧值|旧状态/,/身份/,/先前|第一次print/,/类型相同|显示相同/,/2\.0|同级/,/相等|最多/,/type.*int|int.*类型/,/去掉f|少.*f/];
 plan.lessons.forEach((row,i)=>{
  const l=lessonRegistry.get(row.id)!,text=blocks(l).filter(b=>b.type==='paragraph'||b.type==='callout').map(b=>b.text).join('\n');
  assert.doesNotMatch(text,/待人工审核|整门PY101|已制作|尚未制作|技术制作|审核尚未|仍在筹备/);
  assert.match(text,markers[i]);assert.match(text,/第5章/);
 });
 assert.equal(getLearningCourse('PY101')!.status,'planned');assert.equal(resolveLesson('PY101','PY101-C03-L01'),undefined);assert.equal(resolveLesson('AI000','PY101-C01-L04'),undefined);
 for(const chapter of getLearningCourse('PY101')!.chapters.slice(0,2))for(let i=0;i<5;i++)assert.equal(getAdjacentLessons(getLearningCourse('PY101')!,chapter.lessons[i].lessonId).next?.lessonId,chapter.lessons[i+1].lessonId);
});

test('P15六道Quiz保ID，三个互异误解选项各有诊断解析，非核心操作替代',()=>{
 const quizzes=plan.lessons.flatMap(r=>blocks(lessonRegistry.get(r.id)!).filter(b=>b.type==='quiz'));assert.equal(quizzes.length,6);
 for(const q of quizzes){assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);assert.equal(q.explanations.length,3);assert.ok(q.correct>=0&&q.correct<3);for(const e of q.explanations)assert.ok(e.length>20);}
});

test('P15两图复用现有image，四资产尺寸吻合、窄屏替图与等价文字存在',async()=>{
 for(const id of ['PY101-C01-L04','PY101-C01-L05']){
  const images=blocks(lessonRegistry.get(id)!).filter(b=>b.type==='image');assert.equal(images.length,1);
  for(const img of images){assert.ok(img.alt.length>50);assert.ok(img.caption.length>20);assert.ok(img.mobile);for(const source of [img,img.mobile!]){const meta=await sharp('public'+source.src).metadata();assert.deepEqual([source.width,source.height],[meta.width,meta.height]);}}
 }
 assert.equal(blocks(lessonRegistry.get('PY101-C01-L05')!).some(b=>b.type==='table'&&b.caption==='把三种对象分开'),false);
});

test('P15十二旧r1逐字保留，r2不继承完成；新位置重载及其他课/r2互不覆盖',()=>{
 const memory=new Map<string,string>(),storage={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);}},store=createProgressStore(()=>storage);
 for(const l of lessonRegistry.values()){const scope=lessonProgressScope(l);if(plan.lessons.some(r=>r.id===l.id))store.save({...scope,contentVersion:1},100,scope.sectionIds.at(-1)!,true);else{store.save(scope,100,scope.sectionIds[0],true);if(scope.contentVersion>1)store.save({...scope,contentVersion:1},75,scope.sectionIds[0]);}}
 const old=new Map(memory);
 for(const row of plan.lessons){const scope=lessonProgressScope(lessonRegistry.get(row.id)!);assert.notEqual(progressKey(scope),progressKey(lessonProgressScope(row.before)));assert.equal(store.getSnapshot(scope),null);store.save(scope,40,scope.sectionIds[1]);const restored=parseReadingProgress(createProgressStore(()=>storage).getSnapshot(scope),scope);assert.equal(restored?.completed,false);assert.equal(restored?.section,scope.sectionIds[1]);}
 for(const[k,v]of old)assert.equal(memory.get(k),v);
});
