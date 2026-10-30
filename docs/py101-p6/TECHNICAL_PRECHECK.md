# P6 技术连接与试学材料预检

2026-10-30；执行者Codex。本轮实际运行与历史证据分开登记。结论仅覆盖作者侧技术可执行性，不构成专业审核、目标学生试学或真人同伴复现。

## 实际运行链

在仓库外全新、明确归属P6的临时目录建立pilot-box和neighbor两个项目，各自通过基础Python的 `-m venv .venv` 新建环境。没有复用用户旧项目/旧环境、修改全局PATH、执行策略或注册用户级内核。所有环境/配置/连接文件和原始安装日志在仓库外；本目录machine只存忽略的作者工具和路径，均不提交。临时项目保留供本机复核，无删除操作。

本轮主环境为Windows、CPython **3.14.2**、PowerShell **7.6.5**。在目标新环境用 `-m pip install --index-url https://pypi.org/simple notebook` 完成准备安装，退出0；Notebook **7.6.3**、Jupyter Server **2.21.1**、ipykernel **7.4.0**、jupyter_client **8.10.0**、nbformat **5.11.1**。这是作者安装准备，不是学生耗时或所有设备可安装的证明；阶段B在准备完成后不依赖外部网络服务/模型API。

完整脱敏记录见 [PRECHECK_RESULTS.json](PRECHECK_RESULTS.json)。预期在 BASELINE_AND_SCOPE 先登记，再逐项用真实Shell/IPython核对，未用普通Python exec模拟内核。

| 连接处/材料 | 实际操作与结果 | 覆盖限度 |
| --- | --- | --- |
| 创建→保存→执行 | 保存cards/start.py两条print（作者测试输入Parcel K8/Check saved copy），在pilot-box根由基础Python执行后再由目标环境执行，真实两行输出、状态0 | 文件写入由作者工具完成，本轮未重做编辑器保存GUI；历史P2另有GUI证据 |
| 目录→脚本参数 | 目标环境执行根下不存在的start.py，stdout空、can't open file、状态2；只改为cards/start.py恢复状态0 | 受控新根，不涉及私有文件；没有增加学生端代码 |
| 脚本→环境身份 | neighbor解释器执行同一正确源码仍两行/0，诊断prefix属于neighbor；改用pilot-box解释器后prefix回目标，base_prefix/版本可相同 | 原样使用1.4工具，仅解读，不考import/sys写法 |
| 恢复→新会话 | 独立新PowerShell进程再次完成错环境程序/诊断→正确环境程序/诊断；另即时echo $LASTEXITCODE得到2 | 15个Shell情景均为新进程，同机作者复验，不算他人复现 |
| 现行下载Notebook | first-notebook、dispatch-note、review-note均从实际public/downloads读取，nbformat校验有效且分发稿空输出/null计数；重启真实内核分别全跑得到Ready B、Packed C7、Checked F3，并核验目标解释器 | 不是JSON解析代替执行，也没有重建/改写原下载；本轮未新做浏览器下载点击/打开GUI |
| 迁移Notebook | parcel-note在目标真实内核重启先显示→NameError；提供名字后Ready J4；实际写盘改文字但未执行赋值，显示仍旧值；重启全跑及保存重读后再次重启全跑均Sent M6、无错、内核正确 | 29步内核操作含重启/保存记录；文本写盘由作者工具实现，不能冒称Jupyter GUI编辑 |
| 名称约束疑问 | plan_note合法运行；my plan、1plan两例真实SyntaxError，日志有源码和状态 | 支持P6-02机制，不证明学生一定如此命名；完整命名语法非本轮新增教学 |
| 本地服务与文件打开 | 从目标环境实际运行-m jupyter notebook，明确只监听127.0.0.1、保留token认证；用已认证文件API打开parcel-note.ipynb，HTTP200、4格 | 是真实本地服务/文件API预检，不是浏览器GUI打开；端口为本次可用端口，访问凭据仅留仓库外私有运行目录 |
| 结束 | KernelManager正常shutdown，kernelShutdown=true；作者用已认证/api/shutdown正常停止自己的Notebook服务器，HTTP200、进程退出0、端口关闭 | 不以Ctrl+C宿主状态声称正常停服；学生GUI停服仍沿用历史P4覆盖，API关闭不是新增学生知识要求 |

真实内核启动/重启打印了本机库的TCP未加密传输警告，未因此改变认证/传输/全局安全配置；作者客户端在本机运行，连接凭据未入公开证据。警告不改写成无警告通过；不把此项扩展成学生系统安全配置任务。

## 试学材料条件检查

| 检查 | 本轮结果 |
| --- | --- |
| 样例存在、布局充分 | pilot-student中observe_env.py、parcel-note.ipynb存在；组织者页给新根/两环境/源码并列布局，B1文件由学生自写 |
| 未教语法 | 学生自写仅print/短字符串；Notebook使用给定合法名称、最小赋值/读取；诊断原样提供。无函数、循环、条件、文件解析或复杂依赖编程 |
| 故障及恢复 | B2只换环境、B3只改变执行顺序；实际预检已复现并恢复，没有混入缺包/未保存/错误脚本 |
| 可评价 | PILOT_PROTOCOL逐项rubric要求文件、命令、实际身份、前后结果、新会话；同时记录帮助，无法由静态作业独证的预测/执行过程须真人观察 |
| 学生答案边界 | 学生任务纸和两个文件无最终修复命令/成果；组织者专页和技术JSON保管在教师端。Notebook起始顺序可正常运行，受控错误由执行操作产生，非隐蔽破坏文件 |
| 获取路径 | 现行课程下载仍为/downloads/first_run.py、first-notebook.ipynb、dispatch-note.ipynb、review-note.ipynb；P6材料为仓库内相对链接，由组织者线下分发，不伪造新站内下载路径 |
| 网络与现有项目 | 仅准备安装需获准网络；测量使用本地已装Notebook，不依赖远程服务或模型API。全部故障在新根，未动旧环境或安全策略 |
| 隐私 | 样例无用户路径/token；公开结果仅共同前缀占位，保留两个项目区别；私有连接文件、日志、.venv不入Git |

预检没有执行学生任务纸的真人理解测试。组织者仍须在实际参与者电脑逐项放行，特别是macOS、受管设备和安装支持方式。

## 历史限制与本轮界定

| 已知限制 | 是否影响本轮学生主流程 / 本轮处理 |
| --- | --- |
| macOS尚未实测 | 继续保留。命令依据Python官方和历史zsh规则，不能标实机通过；安排Mac教师/学生前先做实机预检 |
| Windows PowerShell5.1曾加载Security模块失败 | 本轮只做窄范围 `pwd/dir` 和环境解释器直接诊断，5.1.26100.9711退出0、无stderr；显式输出Path/Name后核对到pilot-box和start.py。见POWERSHELL_51_PROBE.json。未重测Security模块/激活或完整GUI，不能宣布历史故障修复 |
| VS Code扩展自动激活依版本/配置 | 本轮不重做GUI、不改扩展配置。正文已分别检查运行入口/旧终端，直接路径是可用主路；真实GUI历史范围见P2/P3 |
| P4 Ctrl+C自动化宿主退出码差异 | 原文有按实际提示/GUI停服路线；本轮作者用已认证API关闭自己服务，未重测自动化Ctrl+C，不宣称宿主差异消失 |
| P5干净导出Turbopack外依赖联接限制 | 本轮不构建，不改turbopack.root、依赖或全局设置；干净导出只验Node测试，不能据此称默认生产构建已修复 |

5.1首次探针的格式化目录对象在显式exit前未显示，因此没有拿状态0当目录观察通过；随后让Path/Name直接输出且错误即停止，才取得上述窄结论。作者采集脚本首次有括号笔误，修正后成功保存改前快照；错误发生在正文修订之前。均未改学生代码或放宽断言。

## 工程与兼容验证范围

原工作区：`npm run typecheck` 通过；变更的三个TS文件经ESLint通过；`npm test` **315/315**。测试包括六份PY101专项、旧教材/发布完整摘要保护、额外篡改拒绝、进度键/旧修订及下载同源。未因本轮材料建立新的测试框架。

仅正文状态勘误和兼容登记列表变化，没有改运行时渲染、下载源码或目录/进度逻辑。因此未重复全仓Python/数学校验、下载生成、review:teaching大矩阵、生产构建、HTTP与浏览器截图；对应历史覆盖仍按P0–P5报告，不冒称本轮再验。P6逐目标语义审查不是review:teaching脚本结果。

干净提交树及最终工作区保护结果见 DELIVERY_REPORT 与 ENGINEERING.json。本轮兼容对象对照见COMPATIBILITY，1.2精确修订与版本依据见TRANSITION_AMENDMENT。没有清空真实浏览器存储，六节r1 scope相同；AI000、MA101、第5章和原下载/报告没有本轮变化。

## 2026-10-30 官方来源核对

具体链接集中于教师包；本轮只链接与概括，未复制第三方长文/素材。Python `/3/` 当前返回3.15.2，版本化venv/sys/词法页面为3.14.10，**本机执行仍是3.14.2**，不能把网页版本当实测版本。核对点为print换行、脚本路径参数、环境创建/直接调用/prefix、合法名称与内核重启状态；安装文档核对Windows Install Manager/macOS pkg路线，但未做全新OS安装。Notebook运行示例文档有旧菜单措辞，具体Notebook7 GUI只引用P4实测。

VS Code教程页面本轮可访问，环境选择页面两次超时、Markdown入口不可访问；未声称完整重核该页，保留历史P2/P3证据和待教师复查。来源网页访问/本机执行/作者推理/真人学习效果分别记录，不相互替代。
