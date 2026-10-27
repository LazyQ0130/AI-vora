# 静态课程编写与维护

## 与教学编辑规范配合使用

[课程内容编写与编辑规范 V1.0](COURSE_EDITORIAL_STANDARD_V1.md) 负责教学设计、中文表达、事实来源和专业审校；本指南负责现有数据模型、组件、资源、路由、兼容与技术发布。先按编辑规范填写 [课前简报](COURSE_EDITORIAL_STANDARD_V1.md#editorial-brief) 和目标任务映射，再按本指南接入工程。课程体系事实以 `curriculum/` 为准，两份规范均须满足；遇到冲突记录具体条目与处理决定，不默默牺牲教学准确性或技术兼容。

每次单课生产可引用 [分轮工作流](COURSE_PRODUCTION_WORKFLOW.md) 与 [可复制提示词](COURSE_GENERATION_PROMPT.md)。复用 `lessonSchema`、`assessmentMap`、`review:teaching`、发布清单和现有测试；不新建内容系统。结构映射和技术检查通过仅证明相应契约，正式教学审查与目标学生试学单独交接。本轮 MA101 证据与待办见 [编辑审查 V1](MA101_EDITORIAL_REVIEW_V1.md)。

## 学生教材与维护记录的分工

学生教材负责讲清问题、知识、例子与练习；详细审核记录面向维护者。此要求落实V1.0的具体、自然与事实准确原则，不升级编辑标准版本。

- 正文在必要处自然交代“假设”或“先试两组设置”，随后讲清数据、输入与结果的实际作用。
- 重要不确定性融入解释：例如少量记录不能证明模型可靠、假设预测不能当实际结果。不能为精简文案删掉这些理由。
- 原创来源、访问/许可、事实核验、测试方法、是否运行实验或训练程序等详细制作事实，保存在源码注释和本轮审查报告；不机械放进正文、表题、练习答案或图注。
- 待人工审核状态由既有发布信息展示，不写成正文要学习的知识；不把开发验收结论当教学解释。
- 图注说明图里看什么、哪些量怎样对应；练习rubric检查知识与操作，不要求学生照抄来源声明。
- 发布前逐段查看正文及组装后的图、题、答案、rubric和参考说明：删除重复的制作声明，保留有助判断的假设与证据边界；在报告中登记移动了哪些说明及版本理由。已有课程发现同类问题时先列位置和建议，不默认批量改稿。

## 数据边界

原 curriculum/ 的 Markdown、JSON 是 20 门课程、等级、目标、学时、先修、章节与项目的事实来源。教材不能反过来改写这些事实。lib/curriculum 的 Course 是目录适配类型；content/models 的 Course 组合相同事实与结构化 Chapter。每个 Chapter 有稳定 ID、顺序和真实可读课时，不为规划章节伪造课时。

Lesson 数据位于 content/lessons，资源程序位于 content/resources/programs，发布状态位于 publication-manifest；course-engine 负责关联与解析。Reader 不导入某一节教材。29 节现行教材与 6 节旧版试读全部经过同一 ContentRenderer。旧 sample.ts 与 v1 progress API 保留兼容和既有测试；新 UI 不直接消费它们。

## 添加一节教材

1. 从原目录确定 courseId 与章节顺序，在 course-outline 登记节级蓝图（title、order、稳定 ID）。ID 格式为 COURSE-Cxx-Lxx，章节 ID 为 COURSE-Cxx；稳定 ID 不因显示名称变化而改变。显示号由原章顺序与 slot.order 生成，不解析 Lxx。当前 C04-L01 留给旧版，因此 C04-L05 显示为 4.4。
2. 新建 content/lessons/<topic>.ts，用 lessonSchema.parse 包裹数据。提供 contentVersion、标题、副标题、learningTime 分项预计区间（reading/practice/coding，basis=editorial-estimate）、assessmentMap 目标—开放练习映射、先修、2–4 个目标、段落、参考资料和下载资源。不要把本节分钟数冒充原课程总学时。
3. 每个 section 有稳定 id、title、navGroup、navLabel、blocks、tier（core/advanced/verification），可选 intro 布局。相同导航分组使用相同名称，顶栏会自动选该组首段作为入口。段落用于目录、锚点与进度，发布后应保持稳定。
4. 将 Lesson 导入 course-engine 的 contents。这里只登记数据，不增加 React 页面；注册表校验课程/章节归属、唯一 ID、同章顺序和内容版本一致。
5. 在发布清单登记 lessonId/courseId/chapterId/title/contentVersion/order，初始 draft/private 或 pending-validation/private。私有内容不生成阅读地址、卡片入口或学习统计。
6. 如有完整程序，登记 programs，正文直接引用同一 code 字符串，resourcesForProgram 生成资源描述。运行 prepare:downloads，不能手改生成的下载内容。Notebook 保持未运行的空输出与 null 执行编号。
7. 执行类型、Lint、测试、Python 校验、生产构建和真实浏览器检查；保存技术证据后进入 pending-review/preview。人工审校与试学另行记录，不能把 AI 辅助起草当成人工审核。

现有示例可分别参考 python-functions（纯 Python）、vector-matrix（数学与响应式图片）、linear-regression（旧 DTO 适配与可选交互实验）。

## 发布规则

| 状态 | 用途 | 可见性 |
| --- | --- | --- |
| planned / draft / pending-validation | 规划、写作、校验前 | private |
| tech-verified / pending-review | 技术验证通过、等待内容审核 | private 或 preview；需要 technicalEvidence |
| reviewed | 人工内容审核通过 | private 或 preview；还需 reviewEvidence |
| pilot | 真实教学试学 | private 或 preview；还需 reviewEvidence |
| published | 正式教材 | public / preview / private；技术与审核证据齐全 |
| deprecated | 下线 | private |

technicalEvidence / reviewEvidence 是仓库审核证据引用，不是权限系统或数字签名。维护者负责审查证据的真实性与适用修订；schema 检查字段和状态门禁，不能替代专业审核。当前 35 节均为 pending-review/preview（含旧综合试读及 AI000 十二节），整门课程仍 planned。

## 内容组件

- paragraph / heading：React 文字节点，不注入任意 HTML。
- ai-task-figure：受控的邮件流程或判断对照图，使用原创教学数据；必须提供 alt 和图注，通过可访问描述关联，窄屏纵向排列。AI000 无代码课直接用 lessonSchema，不套用强制附加程序的工厂；L0 不注入共享回归术语表。示例与证据见 [AI000 1.1 审查](AI000_LESSON_1_1_REVIEW.md)。
- image：本地 PNG/WebP/JPG、解释性 alt、图注和固有尺寸；可选 mobile 对象提供 src/width/height。通用 picture 根据视口选择构图，无需新增页面；提供原图入口。
- math：LaTeX 与中文解释。KaTeX trust=false，测试使用 strict/error 解析；长公式只在自己的 region 中滚动。
- code：code / filename / language，支持 Python、JavaScript、Bash、JSON、text，复制不包含行号。不提供在线运行按钮。
- callout / summary：重点、边界或总结，内容同样属于教材数据。
- table：caption、列名和行数据；schema 拒绝列数不一致。原生 table 包在可聚焦的横向滚动 region 内，手机不缩小整页。
- reading-links：带说明的补修与衔接资料，区分真实正文、外部教材和仅有章级规划的入口。
- exercise：稳定 ID、课型、题干、分层 hints、solution 与 rubric。原生 details 展示提示与解析，输入仅当前页面暂存，不保存、不自动判分、不更改读完标记。
- quiz：稳定题目 id、问题、至少两个选项、零起始正确索引及每个选项的解析；选中不等于已提交，改选会重置反馈。它是本地自查，不代表认证。
- downloads：引用本节 resources 的 ID；资源限定本地下载路径。全节资源也在页尾列出。
- diagram / experiment：kind 通过枚举选择受控组件。现有 linear-regression 使用确定性数学计算，实验组件单独动态加载。添加新的实验种类时只扩展 schema 与组件注册/分派并提供数值测试，不执行任意教材 JavaScript。

## 进度、修订与导航

阅读器顶部的 `reader-section-nav` 是主要文章导航；桌面右侧为统一学习面板，目标直接读取 `Lesson.objectives`，达标题由 `assessmentMap` 和核心 exercise blocks 生成并按正文顺序去重。可选进阶/验证在折叠入口中区分，不计核心达标。窄屏“本节导航”Drawer 共用这一面板，并保留完整 ArticleContents；正文不重复渲染目标卡。练习导航、旧 hash 和 Drawer 关闭后的定位共用展开祖先折叠、滚动与标题聚焦逻辑。布局不参与进度键计算。

无 hash 重开阅读页时，尚停在标题区的初始 0%/首段状态不自动覆写已有阅读位置；正文滚动、锚点导航与手动完成继续使用原存储逻辑，pagehide 使用相同保护。

v2 以 courseId/lessonId/contentVersion 分键。通常内容实质改变时递增 contentVersion，并同时更新 Lesson 与 manifest；V2.1 按保留阅读历史的产品要求采用兼容重编：保留原 r1 和全部旧段落 ID，以新增课时 ID 承接细分内容，并明确旧读完不代表新目标达标。后续不兼容改版应另建修订键；旧修订键保留，新版从未读开始。只修错字且不改变结构时可保持版本，但不能随意删改段落 ID。单纯重命名课时标题不会改 ID。

v1 兼容仅适用于原 ML201-C04-L01 r1 的既有 7 段；匹配后读取兼容，挂载后迁移，不删除旧键。有 v2 时不自动用旧值覆盖，包括未知/损坏 v2。存储失败时本次会话仍能继续阅读，跨标签的 storage 通知会刷新可落盘记录。恢复本地存储权限后，下一次保存会重试。

目录与相邻课时从原章顺序和节级蓝图 order 产生，清单必须与蓝图一致。只有同课程现行可读课时参与上下节导航；例如 3.3 下一节是 4.1，跳过未制作的 3.4，4.4 没有下一节。旧综合试读 catalogRole=legacy，不冒用新版 4.1 编号，也不参与新版完成率。错误课程归属、未写课时、私有或下线内容均不生成路径。

## 样式和验收

reader.css 管理阅读器基础布局；learning-system.css 管理共享分层目录、教学表格/开放练习等扩展、入口与学习中心，基础 ProgressRing 保留在 globals。不要继续往 visual-v2/usability 添加阅读器覆盖。正文 16px，图注/说明 14px，功能辅助信息至少 12px；主要触控区域至少 44px。不要为了长公式、代码和示意图缩小整页；图片可提供手机构图，公式/代码局部滚动。

滚动监听使用 passive + requestAnimationFrame，浏览比例取整以减少 React 更新，内容块 memo；目录自动滚动局限在目录容器。动效继承 MotionConfig 和 reduced-motion，不增加无必要的动画库。

每次教材变更运行 README 列出的检查，尤其 prepare:downloads → test:python。新增素材确认文件、尺寸、alt 和下载一致性；生产浏览器测试至少覆盖桌面/平板/手机、目录与焦点、题目反馈、复制/下载、刷新恢复、独立进度、状态和 404。构建成功不等同于浏览器或专业内容验收。

## V2.1 内容约束

核心目标必须映射到真实核心开放练习，不能仅以选择题或隐藏的进阶挑战验收。每题至少两级提示、参考解答和评分标准；映射的语义充分性仍须人工审阅。整节可选进阶需同时在 Lesson 与 Publication 标记 optionalLesson=true，不计基础阅读分母，但保留历史记录。

预计时间分为阅读、练习、代码实践三个区间。页面明确说明是编辑估计；核心课时间不含可选拓展，禁止标成学生实测。通用术语维护在 src/content/glossary.ts；新符号仍须在正文首次出现处说明和代入，术语折叠区不承担必要首次教学。

正文只展示最小实现；复杂断言与输入拒绝放在 tier=verification，拓展实验放在 tier=advanced。通用 TeachingSection 用原生 details/summary 折叠；保持所有 section.id，导航/旧 hash 必须展开对应内容并滚动定位。

core-programs.ts 的基础片段被完整下载直接复用；ML 更新核 regressionStepCode 同源嵌入核心与完整训练脚本。新增代码需同时更新 validate-python.ts 的独立预期，并实际执行。新数学图用 prepare:v21-diagrams 生成，numeric-evidence.json 记录数值；教学图不能用装饰性生图代替。

V2.1 样式集中在 teaching-v2-1.css；既有品牌、动画和 reader.css 保留。报告见 TEACHING_V2_1_REVIEW.md；技术测试、浏览器验收与教学试学分开记录。

## V2.2 独立课时规范

课程左栏只显示章和独立课时，不再嵌入 section 链接。正文 section 属于文章目录，统一通过 ArticleContents 放右栏和移动 Drawer。CourseContents 需要服务端传入 progressLessons，只用真实 completed 标记绘制完成图标；筹备课不能生成链接。

大幅重编的数学课使用全新 ID：原五篇 MA 课保留 legacy / r1，不做完成记录迁移。已制作新课只占 2.1–2.4，余下规划在 math-outline.ts；不要把全部 blueprint 自动登记为可读 Publication。其他已存在课程仍保留原版本状态，不能因为采用新目录就宣称其达到 V2.2 教材质量。

新数学课参考 ma101/ 四篇：正文用自然段连贯解释，先实例后符号，必要推导不可省略；核心不要求 Python。每个可操作目标对应核心开放题，另有分层提示、参考解答、rubric 和可选挑战。SVG 使用 vector-teaching.ts 的实际输入和等比例坐标映射，零向量不画方向箭头。

后续课的制作前提、图解、例题和验收见 MA101_V2_2_OUTLINE.md；技术结果不能替代独立人工审阅与学生试学。V2.2 样式位于 teaching-v2-2.css，保持品牌资产与已有动效，并核对实时切换的 prefers-reduced-motion。

## V2.3 阅读与编辑规范

正文 H1 仅写当前课时标题；主要教学环节使用不编号的 H2；H3 只用于真实下级内容，不为阶段模板强加子标题。ArticleContents 只显示同一标题，不叠加索引。显示号继续用于课程目录和课时元信息，不能通过修改 section.id 或课时 ID 去掉显示编号。

重要边界在首次需要时讲清；后续只在产生新误解时简短回顾，避免每段机械附加未来知识或应用风险。合并重复解释时，保留必要的反例、具体计算、推导与符号含义。复杂任务移入 advanced 时，必须同时检查目标、基础题、提示、参考答案和 rubric，核心目标不能依赖可选区。

当前数学 2.2 的一般 n/i、列写法、属性与单位对齐为可选，2.4 的统一倍率反求、共线、复杂位置缩放为可选。原 section/exercise ID、URL、r1 保留；旧哈希进入折叠内容时应自动展开。目标与题目以 TEACHING_V2_3_CONTENT_MATRIX.json 为准，V2.2 规划表是当时的历史版本。

不设强制字数或段落数量目标，不用字符减少推算学习时间收益。review:teaching 输出结构矩阵，review:editing 输出四节前后全文；自动测试只验收技术、数学与兼容契约，教学效果需真实学生试学。详见 TEACHING_V2_3_REVIEW.md。本轮之后用 `AIVORA_EVIDENCE_DIR` 另存每轮检查结果，`AIVORA_EDITING_BASELINE` 指定本轮实际改前稿；完整用法与覆盖限制见 [工作流](COURSE_PRODUCTION_WORKFLOW.md)。历史 V2.3 快照不是以后每一轮的改前稿。

## 跨学科标杆修订

[跨学科验证 V1](CROSS_DISCIPLINE_EDITORIAL_VALIDATION_V1.md) 为当前 MA2.1、PY5.1、ML4.3 的审查入口。MA2.1 与 PY5.1 因新增核心迁移任务使用 r2；Lesson 与 Publication 同步递增，旧 r1 键留存，不能迁移成新版完成。ML4.3 保留原目标、算法与任务，仅补解释和分离原验证，仍为 r1。前文 V2.3 所述四篇 r1 保留是当时修订的事实，不阻止后续按规则升版。

数学工厂 Source 与基础课 Spec 支持可选 `contentVersion`，默认仍为1，只为实际变更课指定修订。ML工厂将核心考核插入最后一个core section，后续追加verification不能把核心题带入可选区。继续使用现有schema/assessmentMap/清单/进度作用域，不新建内容或评分系统。

`review:editing` 默认拒绝版本变化；已在简报和报告解释合法递增时，显式加 `--allow-version-increase`。它只允许递增，仍拒绝倒退、丢失section或练习ID，输出前后版本及旧完成不迁移的说明。新任务的效度与真实学习表现仍需人工和学生证据；[V1.1建议稿](COURSE_EDITORIAL_STANDARD_V1_1_PROPOSAL.md) 尚未替换V1.0。

## AI000 系统化节级规划与修订

AI000 的24节蓝图见 ai000-outline.ts 与 AI000_CURRICULUM_V2_PLAN.md，只有已制作的十二节进入发布清单。1.1和2.1核心目标/考核重编为r2，原r1键不删除、不迁移为新版完成。Lesson可选legacyAnchors只存迁出书签的id、标题、说明与真实课时深链接；Reader在页尾折叠衔接入口，原hash通过既有定位逻辑展开并聚焦。它不属于当前核心目标或assessmentMap，不把迁出题再算作本节达标。其余23节数据不因该可选字段增加空值。两份旧AI000专题核验脚本入口现委托review-ai000-v2.ts，历史输出保留，首批证据使用docs/ai000-v2。

3.1初始r1、1.3仅语言精修保r1，证据另存docs/ai000-3-1，入口为AI000_3_1_AND_EDITORIAL_REFINEMENT.md。AI000完整路线分钟数维护于ai000-study-time.ts，逐行对应节级规划；course-learning-time.ts统一为卡片和详情求和，当前约9.7–15.0小时是含未制作内容的编辑估计（4.2调整前的9.5–14.8小时证据保留）。原课程hours仍保留6–10；不据新展示改写curriculum或学习进度。

3.2初始r1证据保留于docs/ai000-3-2；首道核心练习更换数据与达标要求后升r2，旧r1记录保留，不继承新版完成。正文borrowing-groups图、A–F与第二题不变。3.1只修改过期状态句，仍r1；3.2末段也去掉已过期的3.3筹备状态，问题原意保留。3.3初始r1，self-supervised-flow图分开输入、目标与假设预测。3.1→3.2→3.3导航沿用机制，3.4仍规划。精确差异和进度证据见docs/AI000_LESSON_3_3_AND_REFINEMENT.md及docs/ai000-3-3。正文衔接不硬编码开放状态。

3.4初始r1，reinforcement-flow图用送物的教学事后记录呈现观察、行动、环境变化和奖励；奖励不当作正确动作标签。证据见docs/AI000_LESSON_3_4_AND_CHAPTER_3_REVIEW.md及docs/ai000-3-4。3.1–3.3原稿/版本/清单完全不变，第三章综合诊断仅在报告中，不纳入完成条件。3.3→3.4正常衔接，第4章仍规划。

4.1初始r1，以包裹到件估时练习记录、字段、输入特征与目标；features-target-flow图从历史C转到新G，假设预测与待核实绩分开。证据见docs/AI000_LESSON_4_1_REVIEW.md及docs/ai000-4-1。3.1–3.4全文/图/核心题/版本/清单不变；3.4→4.1由现有机制衔接，4.2–4.4仍规划。两道开放题的练习编辑估计调整为16–24分钟，ai000-study-time.ts与V2规划表同步，完整路线570–886分钟（9.5–14.8小时）；旧学时证据不覆盖，不更改curriculum的6–10小时。

4.2初始r1，用同一估时关系中的两项参数引出预测、比较与训练，参数来自手算设置而非声称训练所得。4.1仅19处学生端说明精修，正式目标、数据、锚点、练习能力不变，保留r1及已有进度；仅清单technicalEvidence改指本轮报告。证据见docs/AI000_LESSON_4_2_AND_EDITORIAL_REFINEMENT.md及docs/ai000-4-2。1.1–3.4、其他课程、通用Reader与进度引擎不变；4.1→4.2自动衔接，4.3/4.4仍规划。4.2阅读12–18、练习14–20、代码0为编辑估计，统一路线574–890分钟，旧证据保留。

4.3初始r1，数据用途图区分训练调整、验证选择与保留测试检查，案例/两题不要求代码。4.1、4.2及全部34节旧稿/清单保持不变；4.2→4.3自动衔接，4.4仍规划。证据见docs/AI000_LESSON_4_3_REVIEW.md及docs/ai000-4-3。阅读12–18、练习16–24、代码0是编辑估计，完整路线580–898分钟（9.7–15.0小时），原curriculum与旧学时证据保留。
