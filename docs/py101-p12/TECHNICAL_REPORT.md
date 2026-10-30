# P12技术验收

2026-10-30，唯一新课PY101-C02-L05，order5/r1/非可选。正式源码先draft/private，取得实际对象不可解析、目录无href、生产109条全部通过且本课404、真实IAB显示不存在页面（DRAFT_GATE）。随后从固定基线导出干净候选，投影preview完成工程与生产浏览器，18项确认检查通过才提升正式清单并勘误2.4末段。最终工作区另行完整检查、默认构建及生产109路由通过。PY101仍planned，2.6不登记，无reviewEvidence。

## 实际Python与终端证据

课前EDITORIAL_BRIEF、SOURCE_FACTS、PRE_SOLUTIONS先于本轮新程序执行。Windows10.0.26300、PowerShell7.6.5、CPython3.14.2，官方3.14页眉3.14.10分别记录；Node24.16.0、Next16.4.3，既有全站Python使用NumPy2.5.2，新课无库依赖、无环境设置修改。

PYTHON_RUNS保存22次真实进程：12份同源完整程序逐次写.py、重读核SHA，真实Python进程收到登记的带换行stdin，留源码/文件、cwd代号、命令/PID、原始stdout/stderr、预期/退出。主例Box A/4→12、Tool B/2→6；原始4为str，转换后int；float1.5/2.25→3.0/4.5；参考两题两组和陌生数据均通过。four、4.5、bad、oops四项ValueError真实退出1，定位第2行转换、无后续print；同副本新PID合法7/1.75/0.75恢复退出0。原始日志只保留在Git外，公开仅替换绝对路径前缀，没有重排stdout或补造回显。

TERMINAL_INTERACTION另存5次Windows ConPTY真实终端会话：主例两轮、数字4的str观察、four错误及新会话7恢复。逐步启动时只有提示并等待；Box A/Enter后才有Count，4/Enter后才有Box A/12。流内包含真实终端回显和控制序列，不能当纯stdout；管道日志则确实是Label: Count: Box A紧邻再换行12。工具逐次发送键入，不称真人操作者/学生试学，未取得终端GUI截图。两类证据不混称。

全站验证器为每个新Python块精确识别文件名和同源源码，登记各输入组合、预期stdout、stderr/退出契约；每块实际执行已保存.py，12块合计22个stdin运行，不跳过input、不模拟返回值、不无限等待（10秒超时）。未知文件/源码、未知或缺失/错误stdin、错误输出/退出或无关异常都拒绝。正常必须stderr空/退出0；四个受控错误须真实Traceback/第2行转换/精确ValueError末行/退出1，不能用EOFError或NameError冒充。第一章及2.1–2.4等旧成功/受控错误校验未放宽。

## 最终工程范围

| 命令/检查 | 工作区 | 干净候选 |
| --- | --- | --- |
| typecheck / lint | 退出0 | 退出0 |
| npm test | 354/354，失败/跳过0 | 353/353，失败/跳过0 |
| prepare:downloads | 16组Python/Notebook，另3份Notebook，退出0 | 同上 |
| test:python | 25项单测、114网页代码块、10组核心/完整版一致通过 | 同上 |
| review:teaching | 58节结构矩阵，退出0 | 同上 |
| npm run build | 默认Turbopack退出0 | 默认Turbopack退出1；Webpack退出0 |
| test:routes | 109/109，生产3026 | 109/109，生产3027 |

工作区多1项是开工原有Reader测试，干净导出排除用户4修改/7附件，两者独立报告。12份任务代码（8改4新）由CLEAN_CANDIDATE逐文件LF摘要核对，最终源码与干净检查、生产浏览器构建输入相同。未新增下载、专用Reader、在线执行器或后台评分。

外部候选共享现有node_modules联接，默认Turbopack真实报Could not find the Next.js package，候选根外依赖限制未修复。完整脱敏错误见CANDIDATE_BUILD_LIMITATION；按本地Next构建指南及CLI支持使用npm run build -- --webpack成功，再start验收，未把失败记为默认构建通过。原工作区单独默认构建通过，没有安装依赖或改配置制造成功。ENGINEERING_WORKSPACE/CLEAN保留各实际命令/退出码，WEB_PYTHON_RESULTS只提取本课12块/22运行，旧全站完整日志在忽略作者目录。

8项新专项测试检查身份/门禁、两题目标/提示/答案、全部源码与stdin、原始通道语义/失败拒绝、真实保存文件记录、2.4精确勘误、动态导航/2.6不注册/错误归属及全旧课版本进度隔离。P11旧测试按实际注册和精确历史还原适配，断言未删，不覆盖旧快照、不增加固定全站课数门槛。

## 历史与工作区

开工fetch确认HEAD/origin/main为4b5a8c158e462aef1683a499c7f1b141fe7a917d。WORKSPACE_BASELINE/PROTECTION记录当前4份原修改和7份未跟踪文件共11份字节/SHA不变，原始附件路径与备份在忽略作者目录；只把已知Next生成的next-env变化还原为开工字节，不用HEAD覆盖用户改动。无删除、stash、reset-hard、强推或学习进度清空。

2852份原src/scripts/tests/public/curriculum/docs按实际指纹审计；原57个Lesson/Publication中56个完整对象不变。唯一2.4全对象仅替末段paragraph后相等，Publication只技证指针改变，r1/目标/assessmentMap/两题/提示/答案/rubric/源码/锚点/学时/progressScope不变。旧报告、下载与第一章、2.1–2.3、第5章、AI000、MA101等旧断言全部保持。复用原兼容登记器，只登记精确摘要，额外未知改写仍会暴露。详见COMPATIBILITY与TRANSITION_AMENDMENTS。

## 浏览器与人工边界

真实候选生产1440/768/390/320四档，18项确认检查通过，截图和BROWSER_RESULTS另存。三目标/两题、文章目录/锚点焦点、分步输入转换、提示/键入/print说明、六处提示/解答/rubric和参考源码、原样复制、旧课衔接、404/planned、新r1重载与旧r1/r2原始字符串不变均实测。320整页内容宽305无溢出，代码254/267可键盘独立横滚。

初始隐藏页面虽有已复制反馈，工具剪贴板为空；保留诊断后在可见页面重新复制，原生剪贴板与实际粘贴逐字符合主例/Count提示，Windows/macOS命令也符合。无权限变更，不声称根因已修复。一次浏览器桥接超时经新状态复核后完成，不是产品代码修复。

本文只支持pending-review/preview技术开放。专业教师、中文教学编辑、真实零基础学生、macOS实机和38–58分钟editorial-estimate校准均未完成，第一章及2.1–2.4人工欠账继续。没有审稿签署、虚构学生/分数/通过率或学会结论。
