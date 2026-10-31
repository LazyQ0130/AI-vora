# P19 技术验收与发布阻断

2026-10-31。3.4教材、有限Python程序、工程接入和隔离生产候选页面检查已完成；**P19不能记为全量验收通过**。指定P18原路径复核发现3.3/r1稳定锚点经SPA课程页返回后恢复入口错误，完整reload仍错误，列P1。Reader不在本轮修改范围，正式3.4保持`draft/private`。隔离候选的临时preview仅供交互检查，最终已恢复private并以生产404复验。没有reviewEvidence，也没有人工通过结论。

## 身份、范围与证据绑定

唯一新增Lesson：PY101-C03-L04《让程序重复执行直到条件变化》，PY101-C03，order4，contentVersion1，optionalLesson=false。PY101仍planned；3.5–3.8无Lesson、Publication或可读路由。正式curriculum、P16蓝图、旧课程对象、Reader、进度模块及P0–P18报告不改。

基线main/origin/main/GitHub远程HEAD均为`9c22ebdd19d1c7856bb19ecde404b2f19a678d47`。WORKSPACE_BASELINE重新扫描3281份跟踪文件，4份既有修改、7份未跟踪文件，含附件的路径/字节数/SHA。WORKSPACE_PROTECTION证明3274份旧跟踪文件字节不变、仅7份授权既有源码改变，原11份用户文件仍逐字节一致；不把用户差异带入提交。

新增资源与Lesson、作者验证/门禁/审核脚本、P19专项测试及P18历史视图，共7份新源码。既有源码白名单为course-outline、course-engine、publication-manifest、validate-python、py101-p1-compatibility、content.test、py101-boolean-combinations.test。P18测试只切到既有历史视图工厂，不削弱断言；历史兼容仍要求完整源码/对象摘要精确命中，未知修改被拒绝。APPROVED_CHANGES登记新增对象与7份既有文件摘要，REVIEW_BINDING另绑定14份本轮源码和最终draft/private对象，所有人工状态为false。

## 教学制作与独立校验

先有EDITORIAL_BRIEF、SOURCE_FACTS、PRE_SOLUTIONS，再起草正文/运行本课Python；预解原始字节SHA绑定在PYTHON_RUNS内，未从stdout倒填。8处真实当前先修anchor经resolve核对，前两章用r2、3.1–3.3用r1。2.1主要是同名重新赋值、2.3解释右侧求值，所以在if衔接明确复习数值自增，没有假定学生早已会循环。3.3末段准确，无需勘误、升版或改scope。

三个可观察目标分别是：独立写有限计数、逐轮/零轮与退出解释、安全修复更新幅度并识别漏更新。count-to-target对应目标1/2；repair-state-update对应目标2/3。两题有本人源码、关键预测/真实结果、两级提示、解释性答案、rubric及新数据验证。参考仅供核对，不是学生试学成果。46–69分钟是editorial-estimate，无真人耗时数据。

官方事实来自Python 3.14.10文档的while、缩进、赋值、比较页；本机实际CPython3.14.2，两者分开。正文只用简单整数比较与+1/+2，不引入for、range、break、continue、函数、容器或异常框架。漏更新只纸面推演，无完整可复制网页Python块；作者静态字符串也不会送执行器。

## 真实Python与停止证据

PYTHON_RUNS记录18项事先预测、13个不同的正常保存文件进程；5项相同源码/预期明确复用证据，没有虚增进程数。每项有保存源码、SHA、文件名、cwd、实际命令、PID、stdout、stderr、退出码、独立预期和10秒上限。另有7个只读line-trace观察进程，执行未插入教学工具语法的原样源码，保存观察器源码和摘要。

| 场景 | 条件行观测当前值 | 体内输出 | 退出值 |
| --- | --- | --- | --- |
| if 0→3 | 0 | 1 | 1 |
| while 0→3 | 0、1、2、3 | 1、2、3 | 3 |
| 初值3/目标3 | 3 | 无 | 3 |
| 初值4/目标3 | 4 | 无 | 4 |
| 新2→5 | 2、3、4、5 | 3、4、5 | 5 |
| 先print后更新0→3 | 0、1、2、3 | 0、1、2 | 3 |
| 错误每次+2，0→3 | 0、2、4 | 2、4 | 4 |

每份上述正常程序最后都执行块外Packing finished。主例3轮、4次条件检查，打印3后还需3<3假才退出。+2原稿exit0却业务不正确，记录businessCorrect=false；只修+1后原0→3、新2→5和零轮3/3均匹配预解。题一标签参考2→6、零轮6/6、新4→7，以及陌生checked1→5、等值5/5、高值6/5也实际验证，非硬编码0/3答案。

严格入口要求网页文件名与完整同源源码一起匹配，再检查已登记有限计数形态：非负小整数、固定目标、同名比较/更新、正向+1或+2、两条体内语句。未知、改写、漏更新、反向更新和过大目标会在执行前拒绝。沿用runSavedConditional现有10秒保存文件运行器，不建立平行执行系统。

另一个作者探针仅sleep2秒、无输出、无子进程，自身有界；用同一spawnSync机制设150ms，实测ETIMEDOUT、exitCode=null、SIGTERM，返回后该PID不存在，正常结果检查器拒绝。它是超时/回收的负向证据，**不是成功教学程序**。没有启动无限输出、截断冒充成功或要求学生自行杀进程。

网页6个Python块全部同源且完整；DOM_SOURCE_MATCH核对6/6。两份实际Copy按钮→剪贴板→.py→独立CPython进程另见COPIED_CODE_RUNS：主例输出1/2/3/结束，修后新数据输出3/4/5/结束，均10秒上限、stderr空、exit0。第一回Copy曾读到旧剪贴板，真实不符被拒绝，重新点击/读取后才取得主例；未拿DOM读取替代Copy。两份落盘保留真实无末尾LF字节及SHA。

## 工程与生产检查

Windows，Node24.16.0、CPython3.14.2、Next16.4.3。隔离候选从真实工作区授权源码导出，4份原用户修改取HEAD、7份原未跟踪排除；依赖使用外部node_modules联接，未改原检出。CANDIDATE_SOURCE_MATCH的355份源码/课程事实逐份一致，文本按LF比较；原用户保护另用原始字节。

| 检查 | 原工作区 | 隔离候选 |
| --- | --- | --- |
| npm run typecheck | 通过 | 通过 |
| npm run lint | 0错误，1项原忽略目录警告 | 0错误0警告 |
| npm test | 400/400 | draft、临时preview均399/399 |
| npm run prepare:downloads | 16组、3 notebook | 16组、3 notebook |
| npm run test:python | 160网页例、10组通过 | 同160/10通过 |
| npm run review:teaching | 63课通过 | 63课通过 |
| npm run build | 采用隔离候选验证 | 默认Turbopack失败；Webpack初始private89页、临时preview90页、最终private89页 |
| npm run test:routes | 对初始private生产服务114/114 | 临时preview与最终private各114/114 |
| P19生产HTTP门禁 | 初始private10/10 | 临时preview、最终private各10/10 |

工作区警告来自`.workbuddy/py101-p15/audit.ts:23`未使用paragraphs，未改该用户忽略目录；本轮新源码无Lint问题。工作区多出的1个测试来自用户既有未提交测试，不当作候选缺漏。

默认Turbopack在外部node_modules联接的隔离候选中无法在其文件系统根内解析next/package.json，保留原失败日志与官方报错；没有宣称已修根因。按已允许路线使用`npm run build -- --webpack`，然后实际`next start`端口3009；不是开发页。最终private构建生成89页并启动、完成114+10条路由和浏览器404。原3000服务不动。候选全局报告只记摘要/行数/SHA，不把大批旧报告复制到本目录。

保留两项已修作者检查失败：Error类型无code属性的TypeScript错误，改为NodeJS.ErrnoException读取；新测试只认“重新检查”但现稿为“再次检查”，调整同义匹配。原失败日志保留，修复后检查通过，不将这些当学生程序失败或静默覆盖。

## 浏览器与兼容结论

生产候选1440/768/390/320检查三目标、两题6个提示/答案面板、rubric、预期结果、状态表、代码缩进、窄屏局部横滑、目录聚焦和候选3.3→3.4相邻导航；详见BROWSER_REPORT。最终private的3.4不可读，因此正式公开导航不会指向它。3.5–3.8及错误课程归属404，PY101筹备状态不变。

62份旧Lesson、62份旧Publication及旧scope摘要完全一致，前两章r2与旧r1字符串由真实存储模块单测保留，新3.4/r1键独立。浏览器隔离来源上，旧2.4/r2、3.1/r1、3.2/r1完成标记仍在，新3.4未继承完成；新r1稳定完整导航可恢复。但**不能声明所有进度行为通过**：3.3的指定SPA恢复错误在reload后保留，P1阻断，详见READER_BOOKMARK_REPRO和原始时序JSON。

没有取得浏览器原始序列化键值（支持接口不可用），不能声称观察到其内部覆盖瞬间，或推断所有用户数据丢失。已证实持久化恢复行为错误足以阻断当前放行，成功的稳定路径不能抵消它。用户Reader与进度源码不改、不清存储。独立修复并重验前，Publication保留draft/private，P19不是全量成功交付。

教师专业审稿、中文教学编辑、满足先修学生的真实试学、macOS实机和实体移动设备均未完成。下一轮3.5仅有NEXT_3_5_BRIEF，没有正文或注册。
