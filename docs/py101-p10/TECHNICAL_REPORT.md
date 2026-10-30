# P10技术验收

2026-10-30。唯一新增PY101-C02-L03《用表达式算出一个结果》，order3、contentVersion1、optionalLesson=false。先保存真实draft/private对象不可读、目录无href的门禁，再完成草稿生产107条HTTP及新课真实浏览器404。隔离候选先投影preview做生产浏览器验收，通过后才把正式2.3改为pending-review/preview，并精确更新2.2末段。无reviewEvidence，不升reviewed/pilot/published；PY101仍planned，2.4–2.6未注册。

## 数量、单位与真实Python

环境为Windows10.0.26300、PowerShell7.6.5、Node24.16.0、Next16.4.3、CPython3.14.2。全站既有Python验证含NumPy2.5.2，本课不安装/使用第三方库。官方资料版本和本机版本分别登记于SOURCE_FACTS，不冒称macOS实测或更新Python。

先保存EDITORIAL_BRIEF、来源与PRE_SOLUTIONS，再实际运行，再起草正文；第二轮从条件和单位重算见EDITORIAL_RECHECK。26次保存.py核对磁盘内容、独立PowerShell进程启动Python，源码、SHA、cwd、命令、版本、stdout/stderr及退出码在PYTHON_RUNS.json。公开证据只脱敏机器前缀，未脱敏原始记录保留在外部作者实验目录。

- 18份同源资源运行覆盖渐进乘法/加法、减法、优先级、括号反例、新增同容量盒、除法/type、非整除水量、两类同级分组、P7主例、正确三结果变式及两题参考/修复。
- 另8次包括完整追加组合、同一my_boxes.py改前/改后、独立卡片变体两轮、另一分组数据，以及数学乘号/漏乘号两个真实SyntaxError。连同资源中的除零，共3个预期失败均退出1，不当正常程序报成功。
- 主例三行16、24、4.0与手算一致；24是代码对错误分组的正确计算，但4盒+4件不能当8盒。另设新增4盒才得到有意义的24件。16/4是全部重新分配的4.0件/盒，不是原来每盒件数。
- 取走2件余14；正确三结果程序只改per_box为5后为24、22、6.0。同级12/3*2为8.0，另一括号2.0；10-3+2为9，另一括号5。7升/2容器为3.5升/容器。
- 挂绳参考33/29→45/41，仅袋数5→7；彩纸参考21/45/7.0，错误行改后21/21/7.0。独立卡片变体30/25→34/29，另一分组15/20/3.0。单位及因果另由第二轮核对，不把退出0当作现实关系正确。

三个依赖片段明示追加位置与上下文，验证器提供必要赋值；另外实际保存total+subtract+grouping+division完整文件，得16、14、24、4.0、float标识。网页校验对本课全部12个Python块按文件名与精确同源源码识别，未知或改写块直接失败；除零明确受控，退出1/stdout空/ZeroDivisionError必须匹配。成功样例拒绝非零退出、stderr、缺行和错误类型，旧2.1 NameError等契约未变。

## 最终工程结果

| 实际命令 | 原工作区 | 排除用户改动的干净候选 |
| --- | --- | --- |
| npm run typecheck / lint | 各退出0 | 各退出0 |
| npm test | 338/338，无失败/跳过 | 337/337，无失败/跳过 |
| npm run prepare:downloads | 16组Python/Notebook与3份分段Notebook同源重建，无public差异 | 同样通过 |
| npm run test:python | 25单测、94网页Python块、10组核心/完整版对照通过 | 同样通过 |
| npm run review:teaching | 56节目标/分层/编辑时间清单输出成功 | 同样通过 |
| npm run build | 默认Turbopack生产构建退出0 | 真实失败退出1，错误留存 |
| npm run build -- --webpack | 不需要替代工作区默认构建 | 退出0，实际供生产浏览器验收 |
| npm run test:routes | 最终preview3022，107/107 | preview3023，107/107 |

ENGINEERING_WORKSPACE与ENGINEERING_CLEAN分开记录，工作区多1项为用户原有Reader测试，不将其移除或复制到干净候选。初始新增测试的组合filter没有正确收窄ContentBlock联合类型，typecheck出现TS2339；改为先筛code再筛language，重跑类型及全套通过。不是删断言或放宽类型。

干净候选从基线Git归档加12份明确代码与本轮证据导出，排除4份原修改及7项未跟踪内容，复用外部node_modules联接。默认Turbopack实际报告在候选root无法找到next/package.json，完整脱敏错误存CANDIDATE_BUILD_LIMITATION.json；随后走支持的Webpack构建。没有改依赖、配置或声称此限制已解决，Webpack通过不替代工作区默认构建证据。最终12份任务代码与干净候选LF摘要一致，所有产品源码与实际浏览器构建输入一致，见CLEAN_CANDIDATE。

新增8项Node测试覆盖身份/双门禁、目标与反馈、全部Python块/未教语法边界、数值/类型/失败契约、真实保存运行/改一项、旧对象与2.2精确勘误、相邻/规划/错误归属、全部旧课/旧修订进度隔离。旧2.2“第二章仅两课/下一可读5.1/2.3未注册”断言按实际注册清单适配；其历史技术依据用既有精确撤销登记核对，新专项仍严格要求2.4–2.6不注册。保留所有旧测试/快照，不加永久全站总数断言。聚焦代码证据见WEB_PYTHON_RESULTS，结构映射见TEACHING_CHECK_SUMMARY，后者不证明题目效度。

## 浏览器与兼容

真实IAB四档1440/768/390/320px、10节点目录、两题六处提示/答案、rubric、复制粘贴、局部滚动、锚点焦点、2.2↔2.3、hashless恢复、旧r1/r2记录字节隔离、筹备与404通过，console error为空。特别核对*、/、括号、空行及类型输出引号/尖括号；320px代码容器实际横向滚动而整页不溢出。剪贴板接口限制及未授权额外权限的实际粘贴替代，见BROWSER_REPORT/BROWSER_RESULTS，不把工具超时抹成产品通过。聚焦规划/归属7/7见P10_ROUTES，全量107条见ROUTE_RESULTS。

开工55份旧Lesson/Publication中，除获准2.2末段/依据指针外其余54份对象完全相同。2784项旧文件保护清单按8份精确登记源码及原用户差异审计，未覆盖历史报告、旧下载、curriculum或其他课。复用原兼容登记器，仅加P10计划，workspaceOnly/protectedText不扩大；未经登记的附加源码修改仍不能命中旧摘要保护。

2.2全对象仅替换最后paragraph后相等，目标、两题、提示、答案、rubric、代码、锚点、时间、版本与进度scope不变，故保r1；前后原文及决定见TRANSITION_AMENDMENT。2.1末段另有P9时点的旧规划状态句，按本轮范围保留并明确交接，不改变其历史版本/核心。第一章、第5章、AI000、MA101及原有发布状态均保持。

原4份修改与7项未跟踪内容共11份文件逐字节保留，WORKSPACE_PROTECTION逐项给出摘要。对next-env先确认只是Next构建生成的已知路径差异，再恢复开工原字节；未为通过测试替换用户文件。临时工具、实验、依赖联接与完整大日志不提交。测试后只停本轮3022/3023服务，原3000服务不动。无删除、stash、reset-hard、强推或进度清空。

## 人工与下一轮

Python教师、中文编辑、真实学生试学、macOS实机未开展；阅读12–18/练习6–10/代码15–22共33–50分钟仍编辑估计。EDITORIAL_RECHECK列明问题/责任角色/所需证据，旧人工欠账继续，不填虚构签署、成绩、通过率或实际耗时。

本课未发现已确认的数值、单位或技术阻断，可在下一轮明确安排下进入2.4编写，同时处理人工/试学意见及2.1旧状态句；如果真实试学暴露阻断，应先修2.3。本轮不自动开发2.4。
