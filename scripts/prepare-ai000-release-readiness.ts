import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { lessonRegistry, getLearningCourse } from "../src/lib/course-engine";
import { publicationManifest } from "../src/content/publication-manifest";
import { ai000StudyTimePlan } from "../src/content/ai000-study-time";
import { getCourseStudyEstimate } from "../src/lib/course-learning-time";
import type { Lesson } from "../src/content/models";

// 此提交只固定教材来源，不把生成文件的存在当作人工审核结果。
const base = "fc30c72d5572bea05bafd9f9b5b55a54150d634b";
const folder = "docs/ai000-release-readiness";
const remote = "https://github.com/LazyQ0130/AI-vora";
const git = (...args: string[]) => execFileSync("git", args, {encoding:"utf8", maxBuffer:32*1024*1024}).trim();
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const readJson = <T>(file: string) => JSON.parse(readFileSync(file,"utf8")) as T;
const json = (value: unknown) => JSON.stringify(value,null,2)+"\n";
const course = getLearningCourse("AI000")!;
const lessons = course.chapters.flatMap(c=>c.lessons).map(s=>lessonRegistry.get(s.lessonId)!);
const files = ["what-is-ai","capabilities-and-errors","automation-and-ai","ai-ml-dl","generative-ai-and-llm","supervised-learning","unsupervised-learning","self-supervised-learning","reinforcement-learning","data-features-labels","models-and-parameters","training-validation-test","using-a-fixed-model","natural-language-and-llm","computer-vision","multimodal-ai","generative-work","rl-applicability","unreliable-answers","privacy-bias-fairness","responsible-ai-use","why-foundations","direction-learning-routes","problem-analysis-capstone"];
const developmentReports = [
  ...Array<string>(5).fill("AI000_CHAPTER_1_2_DELIVERY.md"),
  "AI000_3_1_AND_EDITORIAL_REFINEMENT.md","AI000_LESSON_3_2_REVIEW.md","AI000_LESSON_3_3_AND_REFINEMENT.md","AI000_LESSON_3_4_AND_CHAPTER_3_REVIEW.md",
  "AI000_LESSON_4_1_REVIEW.md","AI000_LESSON_4_2_AND_EDITORIAL_REFINEMENT.md","AI000_LESSON_4_3_REVIEW.md","AI000_LESSON_4_4_AND_VISUAL_REFINEMENT.md",
  "AI000_LESSON_5_1_REVIEW.md","AI000_LESSON_5_2_REVIEW.md","AI000_LESSON_5_3_REVIEW.md","AI000_LESSON_5_4_REVIEW.md","AI000_LESSON_5_5_AND_CHAPTER_5_REVIEW.md",
  "AI000_LESSON_6_1_REVIEW.md","AI000_LESSON_6_2_REVIEW.md","AI000_LESSON_6_3_AND_CHAPTER_6_REVIEW.md","AI000_LESSON_7_1_REVIEW.md","AI000_LESSON_7_2_REVIEW.md","AI000_LESSON_7_3_AND_COURSE_REVIEW.md",
];
const sourceFor = (lesson: Lesson) => `src/content/lessons/ai000/${files[lessons.findIndex(l=>l.id===lesson.id)]}.ts`;
const sourceUrl = (file: string, start?: number, end?: number) => `${remote}/blob/${base}/${file}${start?`#L${start}${end&&end!==start?`-L${end}`:""}`:""}`;
const localFromLesson = (file: string) => path.relative(`${folder}/lessons`,file).replaceAll("\\","/");
const cell = (text: string) => text.replaceAll("|","\\|").replaceAll("\n","<br>");
const tasks = (lesson: Lesson) => lesson.sections.filter(s=>s.tier==="core").flatMap(s=>s.blocks.filter(b=>b.type==="exercise").map(task=>({section:s,task})));

function exampleDependencies(file:string) {
  const ast=ts.createSourceFile(file,readFileSync(file,"utf8"),ts.ScriptTarget.Latest,true);
  return ast.statements.filter(ts.isImportDeclaration).flatMap(node=>{
    if(!ts.isStringLiteral(node.moduleSpecifier)||!node.moduleSpecifier.text.startsWith("./"))return [];
    const target=path.posix.normalize(path.posix.join(path.posix.dirname(file),node.moduleSpecifier.text+".ts"));
    assert.ok(existsSync(target),target);return [target];
  });
}

function figureImplementation(kind:string) {
  const name=kind.startsWith("creative-")?"ai-creative-figure":kind.startsWith("multimodal-")?"ai-multimodal-figure":kind.startsWith("vision-")?"ai-vision-figure":({
    "inference-flow":"ai-inference-figure","data-use-flow":"ai-data-use-figure","parameters-compare":"ai-parameters-figure","features-target-flow":"ai-features-target-figure","reinforcement-flow":"ai-reinforcement-figure","self-supervised-flow":"ai-self-supervised-figure","borrowing-groups":"ai-borrowing-figure","supervised-flow":"ai-supervised-figure","generation-map":"ai-generation-figure","knowledge-trace":"ai-knowledge-figure","method-hierarchy":"ai-relationship-figure","method-and-task":"ai-relationship-figure","mail-flow":"ai-task-figure","mail-outcomes":"ai-task-figure",
  } as Record<string,string>)[kind];
  assert.ok(name,`未定位图形实现 ${kind}`);return `src/components/lesson/${name}.tsx`;
}

function locations(file: string) {
  const text=readFileSync(file,"utf8");
  const ast=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);
  const found=new Map<string,{start:number;end:number;text:string}>();
  const walk=(node:ts.Node)=>{
    if(ts.isObjectLiteralExpression(node)) {
      const property=(name:string)=>node.properties.find((p):p is ts.PropertyAssignment=>ts.isPropertyAssignment(p)&&(ts.isIdentifier(p.name)||ts.isStringLiteral(p.name))&&p.name.text===name);
      const prop=property("id");
      if(prop&&ts.isPropertyAssignment(prop)&&ts.isStringLiteral(prop.initializer)) {
        const id=prop.initializer.text;
        const type=property("type")?.initializer;
        const kind=property("courseId")?"lesson":property("blocks")?"section":type&&ts.isStringLiteral(type)&&type.text==="exercise"?"exercise":"other";
        const key=`${kind}:${id}`;
        assert.ok(!found.has(key),`${file}: repeated source ${key}`);
        found.set(key,{start:ast.getLineAndCharacterOfPosition(node.getStart(ast)).line+1,end:ast.getLineAndCharacterOfPosition(node.getEnd()).line+1,text:node.getText(ast)});
      }
    }
    ts.forEachChild(node,walk);
  };
  walk(ast);
  return found;
}

function renderLesson(lesson: Lesson) {
  const lines=[`# ${lesson.id} r${lesson.contentVersion} ${lesson.title}`,`先修：${lesson.prerequisites}`,`目标：${lesson.objectives.join("；")}`];
  for(const section of lesson.sections) {
    lines.push(`\n## ${section.id} ${section.title} [${section.tier}]`);
    for(const block of section.blocks) {
      if(block.type==="paragraph")lines.push(block.text);
      else if(block.type==="heading")lines.push(`### ${block.text}`);
      else if(block.type==="exercise")lines.push(`题 ${block.id}：${block.prompt}`,`提示一：${block.hints[0]}`,`提示二：${block.hints[1]}`,`完整参考：\n${block.solution.join("\n")}`,`rubric：\n${block.rubric.join("\n")}`);
      else lines.push(JSON.stringify(block));
    }
  }
  lines.push(`\n参考：${JSON.stringify(lesson.references)}`,`旧锚点：${JSON.stringify(lesson.legacyAnchors??[])}`);
  return lines.join("\n\n");
}

type Snapshot = {baseCommit:string;files:{path:string;blob:string}[];lessons:{id:string;version:number;sha256:string}[];publicationSha256:string;courseSha256:string};
type HumanReview = {status:"未开始"|"进行中"|"完成";reviewer:string|null;date:string|null;evidence:string|null};
type HumanRow = {lessonId:string;contentVersion:number;reviewCommit:string;subject:HumanReview;editorial:HumanReview;pilot:HumanReview;blockingIssues:string[]|null;versionDecision:string|null;releaseDecision:string|null};
type Focus = {lessonId:string;checks:string[];alternatives:Record<string,string>};

function snapshot() : Snapshot {
  const tree=execFileSync("git",["ls-tree","-rz",base,"--","src","curriculum","public"],{encoding:"utf8",maxBuffer:32*1024*1024});
  return {baseCommit:base,files:tree.split("\0").filter(Boolean).map(row=>{const [meta,file]=row.split("\t");return {path:file,blob:meta.split(" ")[2]};}),lessons:[...lessonRegistry.values()].map(l=>({id:l.id,version:l.contentVersion,sha256:hash(l)})),publicationSha256:hash(publicationManifest),courseSha256:hash(course)};
}

function verifySnapshot(saved:Snapshot) {
  assert.equal(saved.baseCommit,base);
  assert.equal(saved.publicationSha256,hash(publicationManifest),"发布清单已变化，需要重新绑定人工材料，不能沿用本包");
  assert.equal(saved.courseSha256,hash(course));
  for(const old of saved.lessons) {const current=lessonRegistry.get(old.id);assert.ok(current);assert.equal(current.contentVersion,old.version);assert.equal(hash(current),old.sha256,old.id);}
  assert.equal(saved.lessons.length,lessonRegistry.size);
  for(const file of saved.files)assert.equal(git("hash-object",`--path=${file.path}`,file.path),file.blob,`受保护文件变更：${file.path}`);
}

function metadata(lesson: Lesson) {
  const file=sourceFor(lesson),locs=locations(file),publication=publicationManifest.find(p=>p.lessonId===lesson.id)!;
  const source=locs.get(`lesson:${lesson.id}`)!;assert.ok(source,lesson.id);
  return {lessonId:lesson.id,title:lesson.title,contentVersion:lesson.contentVersion,reviewCommit:base,source:file,sourceUrl:sourceUrl(file,source.start,source.end),lessonSha256:hash(lesson),objectives:lesson.objectives,assessmentMap:lesson.assessmentMap,prerequisites:lesson.prerequisites,prerequisiteLinks:lesson.prerequisiteLinks,technicalEvidence:publication.technicalEvidence,sections:lesson.sections.map(s=>{const range=locs.get(`section:${s.id}`);assert.ok(range,`${lesson.id}/${s.id}`);return {id:s.id,title:s.title,sourceUrl:sourceUrl(file,range.start,range.end)};}),tasks:tasks(lesson).map(({section,task})=>{const range=locs.get(`exercise:${task.id}`)!;assert.ok(range);for(const field of ["hints","solution","rubric"])assert.ok(range.text.includes(field),task.id+field);return {id:task.id,title:task.title,sectionId:section.id,objectives:lesson.assessmentMap.filter(m=>m.exerciseIds.includes(task.id)).map(m=>m.objective),sourceUrl:sourceUrl(file,range.start,range.end),hintCount:task.hints.length,solutionSteps:task.solution.length,rubricItems:task.rubric.length};})};
}

function generatedFiles(status:HumanRow[],focus:Focus[]) {
  const output=new Map<string,string>(),catalog=lessons.map(metadata);
  output.set("REVIEW_CATALOG.json",json({reviewCommit:base,contentSource:"当前正式源码为唯一内容来源；本索引不表示人工审核通过",lessons:catalog}));
  const matrix=["# 24节审核矩阵","",`教材审核提交统一为 \`${base}\`。这是待办分工，所有人名、意见、分数和发布决定均留空；“未开始”不是未通过。正文、发布清单与进度没有修改。`,"", "学科按相应专长分配，中文编辑另作独立审查；执行者尚未指定。本轮起始状态快照见 [HUMAN_REVIEW_STATUS.json](HUMAN_REVIEW_STATUS.json)。实际执行另存绑定提交的受控台账与人工记录，保留本包起始证据，不用生成器覆盖。", "", "|课时ID / 标题|版本 / 审核提交|目标数|核心任务ID|建议学科角色 / 重点|学科审核|中文审核|学生试学|阻断问题|版本修订|发布决定|", "|---|---|---|---|---|---|---|---|---|---|---|"];
  const rubric=["# 72目标与49道核心任务的人工审核依据","",`审核教材固定于 \`${base}\`。本文件的rubric逐项来自正式稿，生成器检测其一致性；不新增统一总分。完整题设、两级提示、全部解答与错因见每题的固定提交源码块，也可用只读命令展开。学生仅领取题设和作答页，组织者不得提前分发本文件或教师包。`,"", "逐项分别记录：无提示独立证据、提示一后补足、提示二后仍困难、看答案后解释、补讲后表现、未见新例迁移。不能把后阶段正确并入首次独立；合理替代答案须满足原目标和rubric，争议由教师据证据处理。下列替代方向是待审稿人核对的建议，不是新增标准答案。", "", "命令：`npx tsx scripts/prepare-ai000-release-readiness.ts --show-task AI000-Cxx-Lxx <exerciseId>`。先检查快照；只输出该任务所需全部题设、提示、参考与rubric，不写文件。"];
  for(let i=0;i<lessons.length;i++) {
    const lesson=lessons[i],meta=catalog[i],f=focus.find(x=>x.lessonId===lesson.id)!,row=status.find(x=>x.lessonId===lesson.id)!;
    assert.ok(f);assert.deepEqual(Object.keys(f.alternatives).sort(),tasks(lesson).map(x=>x.task.id).sort(),lesson.id+"替代答案覆盖");
    const chapter=Number(lesson.chapterId.slice(-2));
    const role=chapter<=2?"AI基础教师":chapter<=4?"ML基础/计算审稿人":chapter===5?"相应NLP/CV/RL等方向教师":chapter===6?"可靠性/数据责任审稿人（法律疑点另请适任者）":"学习设计/项目评价教师";
    matrix.push(`|[${lesson.id} ${lesson.title}](lessons/${lesson.id}.md)|r${lesson.contentVersion} / ${base}|${lesson.objectives.length}|${meta.tasks.map(t=>t.id).join("<br>")}|${role}；${cell(f.checks.join("；"))}|${row.subject.status}|${row.editorial.status}|${row.pilot.status}|${row.blockingIssues===null?"未经人工判定":cell(row.blockingIssues.join("；"))}|${cell(row.versionDecision??"")}|${cell(row.releaseDecision??"")}|`);
    const doc=[`# ${lesson.id} · ${lesson.title}`,"",`内容版本 **r${lesson.contentVersion}**；教材审核提交 \`${base}\`。状态 pending-review/preview，人工审核未开始。`,"",`[固定提交全文](${meta.sourceUrl}) · [本地正式源码](${localFromLesson(meta.source)}) · [本轮矩阵](../REVIEW_MATRIX.md)`,"",`稳定阅读路径：\`/learn/AI000/${lesson.id}\`；[本地易读预览（先核服务提交）](http://127.0.0.1:3033/learn/AI000/${lesson.id})。预览地址不是审核版本依据，使用其他部署也须先核对完整教材SHA。`,"",`完整对象SHA-256：\`${meta.lessonSha256}\`。源码是唯一正式内容来源；本页仅保留定位、短提示和审查任务，不复制教材长正文。`,"", "## 学习目标与先修","",...lesson.objectives.map((o,j)=>`${j+1}. ${o}（核心题：${lesson.assessmentMap.find(m=>m.objective===j+1)!.exerciseIds.join("、")}）`),"",`先修：${lesson.prerequisites}`,"",...lesson.prerequisiteLinks.map(l=>`- ${l.title}：\`${l.href}\`；${l.note??""}`),"", "## 核心概念、事实与争议点","",...f.checks.map(c=>`- ${c}`),"", "这些是审查问题，不是已发现错误或人工审核结论。教师应亲自定位原文、重算数据/图示，指出误解机制、目标影响与阻断判断。", "", "## 逐段与图表计算定位","", "|准确section ID|内容 / 需核材料|固定提交来源|", "|---|---|---|"];
    for(const section of lesson.sections) {
      const material=section.blocks.filter(b=>!["paragraph","heading"].includes(b.type)).map(b=>b.type==="table"?`表：${b.caption}`:b.type==="ai-task-figure"?`精确图 ${b.kind}：${b.caption}`:b.type==="math"?`计算/公式：${b.explanation}`:b.type==="exercise"?`题 ${b.id}`:b.type==="code"?`纯文本：${b.filename}`:b.type).join("；");
      doc.push(`|${section.id}|${cell(section.title+(material?`；${material}`:""))}|[该段全文](${meta.sections.find(s=>s.id===section.id)!.sourceUrl})|`);
    }
    doc.push("", "精确图还须核受控渲染实现与数据，不能只读caption。见[内容分派器]("+sourceUrl("src/components/lesson/content-renderer.tsx")+")、[图形分派]("+sourceUrl("src/components/lesson/ai-task-figure.tsx")+")和[完整版本快照](../CONTENT_SNAPSHOT.json)。以下配套文件同样固定到教材提交，表中引用的数组须连同这些数据核对。", "", "### 配套数据与图形实现","",...exampleDependencies(meta.source).map(file=>`- [${file}](${sourceUrl(file)})`),...Array.from(new Set(lesson.sections.flatMap(s=>s.blocks.filter(b=>b.type==="ai-task-figure").map(b=>b.kind)))).map(kind=>`- 图 \`${kind}\`：[实际渲染实现](${sourceUrl(figureImplementation(kind))})`),"", "## 核心任务、两级提示、完整解答和rubric","", "打开下面每道题的固定提交源码块即可看到完整题干、solution全部步骤、常见错因与rubric全部项；无需从旧报告反推现稿。终端的`--show-task`可直接展开同样内容。对应[49题审核依据](../ASSESSMENT_RUBRIC.md)列原rubric全文。", "");
    for(const {section,task} of tasks(lesson)) {
      const t=meta.tasks.find(t=>t.id===task.id)!;
      doc.push(`### ${task.id} · ${task.title}`,"",`核心位置 \`${section.id}\`；目标 ${t.objectives.join("、")}；[完整题设/两级提示/全部${t.solutionSteps}步解答与${t.rubricItems}项rubric](${t.sourceUrl})。`,"",`提示一（当前稿）：${task.hints[0]}`,"",`提示二（当前稿）：${task.hints[1]}`,"",`合理替代答案的待核方向：${f.alternatives[task.id]}`,"",`完整展开：\`npx tsx scripts/prepare-ai000-release-readiness.ts --show-task ${lesson.id} ${task.id}\`` ,"");
      rubric.push(`## ${lesson.id} / ${task.id}`,"",`r${lesson.contentVersion}；目标 ${t.objectives.map(n=>`${n}「${lesson.objectives[n-1]}」`).join("；")}。`,"",`[完整题干、提示、参考、错因与rubric](${t.sourceUrl})；[逐课包](lessons/${lesson.id}.md)。`,"",...task.rubric.map((r,j)=>`${j+1}. ${r}`),"",`合理替代方向（待教师核对）：${f.alternatives[task.id]}`,"");
    }
    const history=`docs/${developmentReports[i]}`;assert.ok(existsSync(history),history);
    doc.push("## 历史技术证据与人工记录","",`manifest当前技术证据：[${meta.technicalEvidence}](${localFromLesson(meta.technicalEvidence!)})；[最初开发或当时交付记录](${localFromLesson(history)})（只适用于报告注明的当时版本）。它们是历史AI辅助/技术证据，不是人工审稿签署。当前内容以本包固定提交为准；旧报告的未制作状态、旧版本和旧学时不能覆盖现稿。另参见[7.3全课程审查](${localFromLesson("docs/AI000_LESSON_7_3_AND_COURSE_REVIEW.md")})与[旧课只读建议](${localFromLesson("docs/ai000-7-3/COURSE_READONLY_REVIEW.md")})。`,"", "复制[学科审核表](../SUBJECT_REVIEW_TEMPLATE.md)与[中文教学编辑表](../EDITORIAL_REVIEW_TEMPLATE.md)，绑定本课ID、r版本及完整提交SHA后保存真实记录。", "", "|人工填写字段|实际记录|", "|---|---|", "|审稿人 / 资格或专长| |", "|准确段落、意见、理由、学生误解及目标影响| |", "|修订建议 / 合理替代答案决定| |", "|是否阻断 / 关联问题编号| |", "|处理结果 / 修订提交 / 复核结论| |", "|审核决定 / 签署 / 日期| |", "");
    output.set(`lessons/${lesson.id}.md`,doc.join("\n"));
  }
  matrix.push("", "未列出真实阻断问题不等于已证明没有阻断：全24节尚未开展人工审稿/试学。已记录两项非阻断候选建议见[问题登记](ISSUE_REGISTER.md)，发布决定由真实维护者填写。", "");
  output.set("REVIEW_MATRIX.md",matrix.join("\n"));output.set("ASSESSMENT_RUBRIC.md",rubric.join("\n"));
  const times=["# 24节现行编辑估计与计时分账","",`唯一维护表固定于 [ai000-study-time.ts](${sourceUrl("src/content/ai000-study-time.ts")})；单位分钟。练习估计目前合并独立尝试、提示和自查，没有凭空拆出三份估计。未来采集将其拆成不重叠事件后再相加比较。代码列来自Lesson，AI000全为0；7.3的text是报告骨架。`,"", "|课时|阅读|练习合并预算（独立/提示/自查）|代码|综合报告实践（含其提示/自查）|练习下限高于阅读上限|", "|---|---|---|---|---|---|"];
  for(const l of lessons) {const t=ai000StudyTimePlan.lessons.find(t=>t.lessonId===l.id)!;times.push(`|${l.id}|${t.reading.join("–")}|${t.practice.join("–")}|${l.learningTime.coding.join("–")}|${t.project.join("–")}|${t.practice[0]>t.reading[1]?"是，优先观察产出负担":"否，仍需观察"}|`);}
  times.push("", "合计：阅读312–466；练习468–704；综合报告70–110；代码0。总850–1280分钟 / 14.2–21.3小时。原始规划6–10小时保留，未做实测压缩。", "");output.set("LESSON_TIME_BUDGETS.md",times.join("\n"));
  return output;
}

function verifyDocuments() {
  const required=["README.md","REVIEW_MATRIX.md","SUBJECT_REVIEW_TEMPLATE.md","EDITORIAL_REVIEW_TEMPLATE.md","PILOT_PROTOCOL.md","PILOT_RECORD_TEMPLATE.md","ASSESSMENT_RUBRIC.md","TIME_CALIBRATION_PLAN.md","ISSUE_REGISTER.md","RELEASE_GATES.md","NEXT_ACTIONS.md","TIME_EVENT_TEMPLATE.md","LESSON_TIME_BUDGETS.md"];
  for(const file of required)assert.ok(existsSync(`${folder}/${file}`),file);
  const documents=[...readdirSync(folder,{recursive:true}).map(String).filter(f=>f.endsWith(".md")).map(f=>`${folder}/${f.replaceAll("\\","/")}`),"docs/AI000_RELEASE_READINESS_REPORT.md"];
  let localLinks=0,pinnedLinks=0;
  const lineCounts=new Map<string,number>();
  for(const file of documents) {
    const source=readFileSync(file,"utf8");
    for(const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target=match[1];
      if(target.startsWith(remote+"/blob/")) {
        assert.ok(target.startsWith(`${remote}/blob/${base}/`),`${file}: 漂移的审核提交 ${target}`);
        const [relative,fragment]=target.slice(`${remote}/blob/${base}/`.length).split("#");
        assert.ok(existsSync(relative),relative);
        if(fragment) {
          const range=/^L(\d+)(?:-L(\d+))?$/.exec(fragment);assert.ok(range,target);
          if(!lineCounts.has(relative))lineCounts.set(relative,git("show",`${base}:${relative}`).split("\n").length);
          assert.ok(Number(range[1])>=1&&Number(range[2]??range[1])>=Number(range[1])&&Number(range[2]??range[1])<=lineCounts.get(relative)!,target);
        }
        pinnedLinks++;
      } else if(!/^(?:https?:|#)/.test(target)) {
        const local=path.resolve(path.dirname(file),target.split("#")[0]);
        assert.ok(local.startsWith(path.resolve(".")+path.sep),target);
        assert.ok(existsSync(local),`${file}: missing ${target}`);localLinks++;
      }
    }
  }
  for(const file of ["SUBJECT_REVIEW_TEMPLATE.md","EDITORIAL_REVIEW_TEMPLATE.md","PILOT_RECORD_TEMPLATE.md","TIME_EVENT_TEMPLATE.md"]) {
    const source=readFileSync(`${folder}/${file}`,"utf8");
    assert.match(source,/空白/);
    for(const line of source.split("\n").filter(l=>/^\|(?:审稿人|编辑 \/|编辑签署|审核人确认|整改复核|记录ID \/|匿名编号|A 科学|B 先修|C 解释|D 教学|E 练习|F 文章|G 跨课)/.test(l))) {
      assert.ok(line.split("|").slice(2,-1).every(value=>value.trim()===""),`${file}: 预填人工/学生结果 ${line}`);
    }
  }
  const issues=readFileSync(`${folder}/ISSUE_REGISTER.md`,"utf8");
  const end=lessons.find(l=>l.id==="AI000-C02-L02")!.sections.find(s=>s.id==="takeaways")!.blocks.at(-1)!;
  assert.ok(end.type==="paragraph"&&issues.includes(end.text),"RR-001须引用当前完整原句");
  const l41=lessons.find(l=>l.id==="AI000-C04-L01")!,task=tasks(l41).find(t=>t.task.id==="build-print-records")!.task;
  for(const hint of task.hints)assert.ok(issues.includes(hint),"RR-002提示必须为当前原文");
  for(const paragraph of task.prompt.split("\n\n"))assert.ok(issues.includes(paragraph),"RR-002完整题干");
  for(const objective of l41.objectives)assert.ok(issues.includes(objective),"RR-002目标");
  console.log(`${documents.length}份Markdown、${localLinks}个本地链接、${pinnedLinks}个固定提交链接及源码行范围通过；模板签署/分数空白、两条旧建议原文一致。`);
}

const command=process.argv[2];
if(command==="--read-lesson") {
  const lesson=lessons.find(l=>l.id===process.argv[3]);assert.ok(lesson);console.log(renderLesson(lesson));
} else if(command==="--read-chapter") {
  const chapter=Number(process.argv[3]);assert.ok(chapter>=1&&chapter<=7);
  console.log(lessons.filter(l=>Number(l.chapterId.slice(-2))===chapter).map(renderLesson).join("\n\n"));
} else if(command==="--show-task") {
  verifySnapshot(readJson<Snapshot>(`${folder}/CONTENT_SNAPSHOT.json`));
  const lesson=lessons.find(l=>l.id===process.argv[3]);assert.ok(lesson);
  const item=tasks(lesson).find(t=>t.task.id===process.argv[4]);assert.ok(item);
  const context={...lesson,sections:lesson.sections.map(s=>({...s,blocks:s.blocks.filter(b=>b.type!=="exercise"||b.id===item.task.id)}))};
  console.log(`固定教材 ${base} / ${lesson.id} r${lesson.contentVersion}\n包含本课全部讲解与题设上下文，只展开所选题答案。\n${renderLesson(context)}`);
} else {
  assert.ok(command===undefined||command==="--generate","未知参数；只支持默认核验、--generate、--read-chapter N、--show-task lessonId exerciseId");
  assert.equal(lessons.length,24);assert.equal(lessons.flatMap(l=>l.objectives).length,72);assert.equal(lessons.flatMap(tasks).length,49);
  assert.equal(course.status,"planned");assert.equal(course.hours,"6–10");
  assert.ok(lessons.every(l=>{const p=publicationManifest.find(p=>p.lessonId===l.id)!;return p.status==="pending-review"&&p.access==="preview"&&p.contentVersion===l.contentVersion&&!p.reviewEvidence;}));
  assert.deepEqual(getCourseStudyEstimate("AI000")!.totalMinutes,[850,1280]);
  if(command==="--generate") {
    mkdirSync(`${folder}/lessons`,{recursive:true});
    if(!existsSync(`${folder}/CONTENT_SNAPSHOT.json`))writeFileSync(`${folder}/CONTENT_SNAPSHOT.json`,json(snapshot()),{flag:"wx"});
    if(!existsSync(`${folder}/HUMAN_REVIEW_STATUS.json`))writeFileSync(`${folder}/HUMAN_REVIEW_STATUS.json`,json(lessons.map(l=>({lessonId:l.id,contentVersion:l.contentVersion,reviewCommit:base,subject:{status:"未开始",reviewer:null,date:null,evidence:null},editorial:{status:"未开始",reviewer:null,date:null,evidence:null},pilot:{status:"未开始",reviewer:null,date:null,evidence:null},blockingIssues:null,versionDecision:null,releaseDecision:null}))),{flag:"wx"});
  }
  const saved=readJson<Snapshot>(`${folder}/CONTENT_SNAPSHOT.json`);verifySnapshot(saved);
  const status=readJson<HumanRow[]>(`${folder}/HUMAN_REVIEW_STATUS.json`),focus=readJson<Focus[]>(`${folder}/REVIEW_FOCUS.json`);
  assert.deepEqual(status.map(s=>s.lessonId),lessons.map(l=>l.id));assert.deepEqual(focus.map(s=>s.lessonId),lessons.map(l=>l.id));
  for(const row of status) {const l=lessons.find(l=>l.id===row.lessonId)!;assert.equal(row.contentVersion,l.contentVersion);assert.equal(row.reviewCommit,base);for(const field of [row.subject,row.editorial,row.pilot]) {assert.equal(field.status,"未开始","本轮准备包不得含不存在的人工结果；未来真实审查应另建绑定证据的记录");assert.equal(field.reviewer,null);assert.equal(field.date,null);assert.equal(field.evidence,null);}assert.equal(row.blockingIssues,null);assert.equal(row.versionDecision,null);assert.equal(row.releaseDecision,null);}
  for(const [file,content] of generatedFiles(status,focus)) {
    const target=`${folder}/${file}`;
    if(command==="--generate")writeFileSync(target,content);
    else assert.equal(readFileSync(target,"utf8").replaceAll("\r\n","\n"),content.replaceAll("\r\n","\n"),`${target}与固定正式稿不一致`);
  }
  if(command===undefined)verifyDocuments();
  console.log(`24课/72目标/49核心任务；${saved.lessons.length}完整教材对象及${saved.files.length}源码/课程事实/资产保持；固定提交来源与空白人工状态一致。${command==="--generate"?"仅生成文档索引，不改课程或发布状态。":"只读核验通过。"}`);
}
