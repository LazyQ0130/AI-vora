# P5技术验收

2026-10-29。起始HEAD=origin/main=7180c6c473890ffdbd13a4eaba7d1d3d118bcff5，已成功fetch。四份原有未提交文件和7份原未跟踪文件逐字节保护，BASELINE.json留52旧Lesson、2682跟踪文件摘要。

## 私有门禁先行

新PY101-C01-L06/r1先注册draft/private。DRAFT_GATE.json核对已注册但resolveLesson不可读；DRAFT_HTTP.json来自实际生产构建的404。该阶段类型、Lint、315项Node测试、68网页Python代码块及旧Python单元测试/10组对照、53节技术矩阵、下载生成和79页生产构建均通过。技术验证完成后才转pending-review/preview；最终生产浏览器、路由及干净暂存树也已复核，不冒称专业审核。

## 实际执行

CLI_RESULTS.json：仓库外本轮独立项目，CPython3.14.2、PowerShell7.6.5。14个真实独立Shell进程记录cwd、命令、stdout/stderr、状态、PID和诊断。错误脚本参数失败2、无正常输出；仅改参数成功输出Notice N8、状态0。target中的程序由other解释器运行仍Target R9、状态0，但实际Interpreter/Environment指向other；恢复target后路径正确。新Shell分别再现两个情境，退出状态观察额外验证。不是用Python函数模拟Shell失败。

NOTEBOOK_RESULTS.json：独立Notebook环境实际安装7.6.3、Python3.14.2，其余包版本在JSON。21步jupyter_client/IPython真实内核消息：打开有效Notebook、路径核验、重启、显示格先跑的真实NameError与完整相关回溯、赋值/显示恢复Checked F3；两轮证明清状态后再重启，按文档完整执行、保存及nbformat重读。最终Notebook没有错误输出，内核正常shutdown。本轮没有启动Notebook服务器或声称新GUI验收，1.5的GUI证据仍为历史范围。自动客户端是用户允许的真实内核验证，不作为学生知识要求。

安装通过官方PyPI，四个新项目环境均位于本轮临时目录，不修改Node工作区、全局PATH、执行策略或用户级kernelspec。Jupyter/IPython配置和运行时目录仅本次进程指向本轮私有临时目录；不公开token、连接文件或机器配置。INSTALL.txt只替换私有路径前缀。原始机器日志保留ignored machine目录；公开证据保留项目后半段和错误上下文。

macOS只有官方文档与命令形式核对，未真实运行。新会话证明同机按条件可复现，未跨机器、未由另一人执行。学生/同伴结果和时间数据均未生成。

## 工程范围

复用Schema、ContentBlock、assessmentMap、Reader、progress与publicationManifest。下载复用既有Notebook序列化器，参数放宽为结构类型，原两份下载字节不变，新增一份空输出Notebook。Python验证显式登记P5源码、为显示格提供前格上下文，未知单元格继续失败；预期故障由真实Shell/内核专项采集，不隐藏旧质量检查。

历史审计复用audit-py101-p3入口和同一批准修订登记器，加入P5配置；P0/P4测试由“必有未制作课”改为实际未注册槽位判断，保留历史摘要与拒绝额外修改断言。新增7项P5测试核对注册/门禁、映射、下载同源、实际证据、六节顺序及进度隔离。没有固定全站教材数量门槛。

1.5只修正最后段过时状态，before/after/摘要及版本决定见TRANSITION_AMENDMENT.json/md；最小赋值已有先讲后用，无教学补写。r1核心目标/题目/答案/rubric/锚点和进度范围不变，原报告不改；1.2已知旧状态句不扩写。

## 最终范围与限制

ENGINEERING.json记录原工作区八条npm检查全部0：Node v24.16.0（版本亦记录于JSON），315项测试，68网页Python块、10组对照、53节技术矩阵，80页生产构建、104/104路由。BROWSER_REPORT.md及JSON记录四档真实IAB、命令实际粘贴、下载、两题提示/答案/rubric、Quiz、导航/404/整课筹备及读完重载。3006原有3项进度字符串逐字未变，不清除/注入存储。

CLEAN_TREE.json记录git checkout-index导出的干净暂存树，不含用户四份原修改：314项测试和类型通过，少的一项是用户原未提交阅读测试。默认Turbopack因导出目录的node_modules联接位于项目根外而拒绝解析Next；保留真实错误，未修改项目配置。查阅本地Next16.4.3 CLI文档后以受支持的npm run build -- --webpack通过80页构建，3007生产HTTP104/104和四档真实浏览器、全部练习折叠、Windows复制、读完重载通过。默认npm run build在原工作区已通过，不将联接导出限制描述成源码错误或默认干净构建通过。后续若需在该导出目录使用Turbopack，应正常提供本地依赖或按Next官方链接根配置处理；本轮未改全局或仓库配置。

3007为另一浏览器来源，其中原有进度未事先采集，未声称该来源的旧值逐字隔离；回到3006后原基线仍一致，跨旧课与修订的逻辑隔离另有单元测试。默认视口恢复，3007临时验收服务已停，3006保留教材预览。RUNTIME_BOUNDARY.json确认本轮Python/Jupyter进程0、无服务token、环境在仓库外；临时环境/导出目录保留供检查，没有批量删除。
