# P14跨课技术预检与工程范围

2026-10-31（Asia/Shanghai）。本轮新增的是审核材料和作者预检，不是正式Lesson。六课Python正文/资源未改；实际产品文字仅2.1–2.4四个末段，复用原完整摘要兼容登记器，不增运行时机制或宽松豁免。

## 新能力链的真实程序

执行前先形成[PRECHECK_PREDICTIONS](PRECHECK_PREDICTIONS.md)，之后保存.py、重读核摘要，以真实Python进程执行。实际Windows11（内核版本10.0.26300）、PowerShell7.6.5、CPython3.14.2、Node24.16.0、Next16.4.3。官方文档页眉3.14.10单独登记，不升级现有Python或安装库。

材料箱清点固定版先赋文字/整数/float/bool并type，计算总米数与18米上限比较，再同名更新文字。交互版用三input收文字，分步int/float，观察原str与新数值类型，再输出带标签/单位及问题的简单f-string。完整保存源码、SHA、cwd、命令、stdin、stdout、stderr、退出、PID和预期在[PYTHON_RUNS.json](PYTHON_RUNS.json)；公开只替换机器路径前缀，原日志留作者忽略目录，stdout顺序不改。

| 本轮case | 实际数据/条件 | 手算预期与实跑 |
| --- | --- | --- |
| author-fixed | Cable set M、4段、2.5米/段、18米上限、True状态 | str/int/float/bool，10.0米/True；更新后读Cable set N |
| author-low-a | Coil A / 4 / 2.5 | 10.0米 / True |
| author-low-b | Coil B / 3 / 4.5 | 13.5米 / True |
| author-equal | Coil C / 6 / 3.0 | 18.0米 / True |
| author-high | Coil D / 4 / 5.0 | 20.0米 / False |
| author-format-error | 受控副本Coil bad / 4.5 / 2.5 | 第4行int真实ValueError，退出1，stdout仅三提示，无后续print |
| author-format-restart | 同一副本新进程Coil recovered / 4 / 2.25 | 9.0米 / True，退出0，与失败PID不同 |
| organizer-B1 | Festival trim / 5 / 1.5 / False | 四普通值、四类型str/int/float/bool |
| organizer-B2-low/equal/high | 同文件只改单段米数1.25→1.5→2.0，5段/限7.5不变 | 6.25/T、7.5/T、10.0/F，分别真实运行 |
| organizer-B3-low/equal | Stage Blue/5/1.25；Stage Gold/5/1.5 | 两次交互摘要6.25/T、7.5/T |

共13次保存文件/真实进程，12次成功0、1次预期失败1；成功stderr空。组织者参考代码从这些已执行源码生成，学生纸不含完整实现。作者AST检查拒绝if/循环/函数/容器/文件/捕获/第三方包和复杂f字段；执行器自己的文件/JSON/进程操作不要求学生编写。错误按真实Traceback、第4行、转换语句和精确ValueError核对，不把其他失败当成功。

自动stdin实际stdout有无换行的提示，接着类型/摘要；没有键盘回显。错误stdout只有提示，回溯在stderr。恢复是重新执行同副本。本轮未新增ConPTY/GUI终端试验；P12/P13终端流仅引用其当时范围，工具键入也不是真人。新例证明所测数据的技术连接，不能证明学生能从空文件迁移。macOS未实机。

## 本轮实际执行的工程检查

虽然P14允许精确文字修订缩小范围，仓库COURSE_AUTHORING要求教材变更执行README检查，因此仍实际完成下列一套；没有重做P8–P13全部作者独立实验。

| 命令/检查 | 本轮结果与范围 |
| --- | --- |
| npm run typecheck | 退出0 |
| npm run lint | 退出0 |
| npm test | 366/366，失败/取消/跳过0；含P14四项新增完整对象/拒绝额外改写/映射导航/旧进度回归 |
| npm run prepare:downloads | 16组Python/Notebook、另3份分格Notebook同源重建；所有原下载字节/SHA不变，无下载diff |
| npm run test:python | 25单元测试、126网页Python块按成功/受控错误真实执行、10组核心/完整版一致 |
| npm run review:teaching | 59节结构检查；本章6节/18目标/12题，从现行对象重算 |
| npm run build | 原工作区默认Turbopack生产构建退出0 |
| npm run test:routes | 本轮3030生产服务110/110通过，路由证据另存 |
| 浏览器 | 四处改后段落、旧next-step锚点、2.1→2.2→2.3→2.4与反向导航、桌面/手机局部实测，见BROWSER_REPORT |

这是原工作区检查，含用户开工已有Reader修改和原有阅读测试，均不提交。本轮未另导出干净候选，不声称有新的干净测试数量或干净构建结果；P13干净361项/受支持Webpack及外部联接Turbopack限制只属于历史范围。当前教材状态文字不依赖用户Reader修改；对象、源码、旧下载与历史指纹单独核对。此次没有渲染逻辑更改，无需重复四档整站截图。

## 精确兼容与保护

本轮基线原59个Lesson/Publication中55对全对象不变，四对仅授权末段/技证引用。四处r1、section/exercise ID、全部目标/映射/题目/提示/答案/rubric/代码/资源/学时、progressScope保持；测试在注入目标或发布附加改写时拒绝回溯豁免。全部旧课/旧修订完成记录以存储测试原字符串重载，未清除、迁移或覆盖；浏览器未清空或写入人工完成标记。

2970份开工跟踪文件逐项保护，仅9个明确授权既有源码文件准许所登记差异；另新增P14专项测试和本目录文档。原11份用户文件字节/SHA不变，附件真实路径只留忽略作者目录；第一章、2.5/2.6、第5章、AI000/MA101/ML、curriculum、全部旧报告和下载均保护。无stash/reset-hard/强推/批量删除/系统配置更改。

原P11/P12测试对技术依据指针的历史断言，改用现有精确登记器还原批准对象后比较；P13对其他对象的旧摘要同样回到对应基线比较。保留旧测试/断言/快照，不扩大workspaceOnly/protectedText。新测试直接核本轮完整对象与所有未授权对象，故历史适配不能掩盖新任意变化。

## 发生过的作者工具问题

首次对象审计用JSON落盘基线和含undefined可选属性的运行对象作deepEqual，发现第五章原对象的undefined字段落盘后消失。改为与原基线一致的完整JSON摘要比较，差异敏感字段不被删除或挑选；四处授权Lesson仍按完整投影对象比较。该问题是作者序列化方法，非教材变化。

Next生产构建会将next-env中routes及root-params两条dev/types改成types。第一次保护脚本只预期routes一项，严格拒绝覆盖；确认两条均为该已知生成差异后，才恢复开工原字节并重新核11份用户指纹。没有以HEAD覆盖用户文件。浏览器截图需在平滑滚动结束后复核实际段落位置，首次标题区画面不作勘误证据；最终截图另行实景确认。其他范围/失败均保留于对应证据，不将工具问题变成教材已修复声明。

技术与AI审核只能支持现有pending-review/preview。教师/中文编辑/真实零基础学生、真人接手、macOS与196–297分钟学时校准均未开展，不预填成绩或签署。
