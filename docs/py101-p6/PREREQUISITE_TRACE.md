# 第一章知识依赖追踪

基线与修订范围见 [BASELINE_AND_SCOPE](BASELINE_AND_SCOPE.md)。以下逐项对照现行 Lesson，非从课名或历史报告推断。`1.n#id` 指 `/learn/PY101/PY101-C01-L0n#id`；练习入口为 `#exercise-<ID>`。六节源码依次为 first-run、script-paths、editor-rerun、project-environments、notebook-cell-order、environment-reproduction，均在 `src/content/lessons/py101/`。

“已讲”只表示正文在核心操作前提供了相应解释/观察链，不证明学生学会。表中“待试学”须用真实学生的无提示操作判断。`import sys` 等工具出现不计作模块语法已教。

## Python 语法

| 知识/能力 | 首次正式教授位置与解释充分性 | 后续作为已学使用 | 核心独立证据 | 问题/跳步判断 |
| --- | --- | --- | --- | --- |
| print() | 1.1#first-output 先输出；#print-text 解释括号内容与默认换行 | 1.2–1.6 短脚本/显示格 | own-message、reliable-edit、自选环境脚本 | 有最小解释，未要求函数定义 |
| 字符串、引号 | 1.1#print-text 成对英文单双引号、显示内容不含引号 | 六节所有文本 | own-message 改两行加一行 | 只要求已教短文字；不考转义字符串 |
| 多条语句顺序 | 1.1#run-script 两条从上往下执行，逐行输出 | 1.3 三行；1.5 对比按格执行 | own-message 三行预测/实跑 | 有独立证据，不能只交答案文字 |
| 交互窗口与 .py | 1.1#first-output 的 >>>/quit()；#save-script 的磁盘文本 | 1.2–1.4、1.6 | own-message、find-script | 入口/退出明确；真实辨认待试学 |
| 最小名称赋值 | 1.5#first-cells 在首次预测/执行前解释 marker、等号与字符串 | 1.5 旧状态；1.6#notebook-handoff 回顾 | create-own-notebook、recover-cell-order | 并非未教授赋值；自选新名称约束不明确，见 P6-02 |
| 名称读取 | 同段明确 print(marker) 显示当前对应内容；1.6 对比带引号文本 | 1.6 显示 batch_label | 同上、recover-notebook-record | 语义已有，完整变量章节未完成 |
| NameError | 1.5#restart-order：重启后名称尚未在本内核定义 | 1.6 对照文件打开失败 | recover-cell-order、recover-notebook-record | 已解释特定情境，不考 try/except |
| import sys | 1.3#select-interpreter 首次作为现成 -c 工具；1.4#observe-env 整段工具 | 1.5 内核观察、1.6 两种诊断 | 各题复制并解读真实字段 | **未正式教授模块语法**；未要求自行写模块、split、下标 |
| 自行编写模块代码 | 六节没有正式教授 | 无此核心要求 | 不适用 | 作者验证器的 pathlib/subprocess/JSON 不进入学生能力要求 |

## 终端与脚本

| 知识/能力 | 首教位置与解释 | 后续使用 | 独立证据 | 问题/跳步判断 |
| --- | --- | --- | --- | --- |
| 终端 vs >>> | 1.1#first-output；#run-script 说明命令位置与退出 | 1.2–1.6 | own-message、find-script | 不靠提示符字面背诵，需本人操作 |
| cd / pwd / 清单 | 1.1#run-script 先改变位置、显示位置、列文件 | 全章 | find-script；trace-target | 新手复制真实路径能力待试学 |
| 当前工作目录 | 1.1#run-script 定义；1.2#relative-route 正式比较起点 | 1.3–1.6 | trace-target、recover-target | 初教到推广衔接明确 |
| 相对/绝对路径 | 1.1 给最小完整目录恢复；1.2#relative-route/#absolute-target 系统讲 .、..、根 | 1.3–1.6 | same-target-two-starts | 不引入 sys.path 或模块搜索机制 |
| 带空格路径引用 | 1.1 cd 示例先可用；1.2#space-argument 实际拆参→整体引用 | 1.4 明确环境路径、1.6 | same-target-two-starts 必须真实失败/修复 | 引号是 Shell 分组，不是 Python 字符串转义 |
| 保存状态 | 1.1#save-script/#change-message；1.3#save-rerun 细分缓冲区/磁盘 | 1.4–1.6 | reliable-edit、recover-target | 外部终端实验与扩展可能自动保存分开 |
| 脚本参数 | 1.1 命令给文件；1.2#space-argument 定义参数为交给程序的信息 | 1.4 两半命令；1.6 主例 | trace-target、reproduce-script-issue | 只考目标路径，不考 argv 编程 |
| 实际解释器路径 | 1.3#select-interpreter 观察命令/只读诊断 | 1.4–1.6 | reliable-edit、create-project-envs | 版本/状态栏不代替真实路径 |
| 错误信息 | 1.1#locate-errors 比较找不到命令/文件/语法 | 1.2、1.3、1.5、1.6 | find-script 等恢复题 | 真实错误不改写成预期 |
| 退出状态、stdout/stderr | 1.6#read-evidence 就地解释 0/非零和紧接观察命令 | 1.6 两核心题 | reproduce-script-issue；Notebook 写不适用 | 在核心题前先教；不需提前懂进程 API |

## 项目环境

| 知识/能力 | 首教位置与解释 | 后续使用 | 独立证据 | 问题/跳步判断 |
| --- | --- | --- | --- | --- |
| 基础 Python | 1.1 定义解释器；1.4#two-projects 定义环境所依安装 | 1.5–1.6 | create-project-envs 关系解释 | 没把创建 venv 说成安装新版本 |
| .venv | 1.4#two-projects/#create-envs 独立包位置/目录布局 | 1.5–1.6 | create-project-envs 两新项目 | 源码在环境外；本例未声称实测包冲突 |
| 虚拟环境解释器 | 1.4#direct-run/#observe-env 路径、prefix/base_prefix 表 | 1.5 内核、1.6 | create-project-envs、repair-wrong-env | 两个同版本环境的身份可区分 |
| 激活与直接调用 | 1.4 先直接执行，再 #activate-env 解释当前 Shell 查找 | 1.6 明确路径复验 | 两道环境题均接受经诊断的方案 | 激活不是必要前提；未将它另列正式目标，不强迫激活受限者完成 |
| VS Code 选择 | 1.3#select-interpreter；1.4#editor-env 选择项目路径 | 1.6 可选等价恢复 | reliable-edit；环境题可用明确路径 | GUI 不同于终端 python；扩展差异待平台审查 |
| 错误选择与恢复 | 1.4#recover-env 只换解释器，输出可相同 | 1.6 脚本题 | repair-wrong-env、reproduce-script-issue | 有控制条件和前后身份，不凭普通输出判定 |
| 不提交环境目录 | 1.4#keep-source：重建/不可搬移、.gitignore 用途 | 1.6 只交源码和记录 | create-project-envs 解释源码在外；P6 交付物检查 | Git 提交未列正式能力，不要求提前会 Git |

## Jupyter

| 知识/能力 | 首教位置与解释 | 后续使用 | 独立证据 | 问题/跳步判断 |
| --- | --- | --- | --- | --- |
| .ipynb 文件 | 1.5#why-notebook；#first-cells 新建/命名 | 1.6 | create-own-notebook | 不把首课隐藏通用 .ipynb 下载当先修 |
| 本地服务器 | 1.5#local-start：安装、持续日志、本地地址/认证 | 1.6 沿用已可用服务 | create-own-notebook 启动记录 | 初装网络/权限另计；迁移任务不再要求联网服务 |
| 内核 | 1.5#kernel-check：独立执行进程、实际路径 | 1.6 | 两题及 recover-notebook-record | 服务 Python 与内核身份分别核验 |
| Markdown / Code | 1.5#first-cells：文字格转换和 Shift+Enter | 1.6 | create-own-notebook 新建文件 | 不依赖完整 Markdown 语法 |
| 内核运行状态 | 1.5#first-cells/#kernel-check，赋值可无 stdout | 1.6 | recover-cell-order | 名称暂存语义已教，非文件保存所有状态 |
| 修改不等于执行 | 1.5#stale-state：编辑/保存后显示旧值的对照 | 1.6 | recover-cell-order 自选新标记观察 | 不是只在主例出现一次 |
| 重启内核 | 1.5#restart-order 明确只重启、等待空闲 | 1.6 | 两题均实际重启 | 重开标签不能代替重启 |
| 单元格顺序 | 1.5 从两格按序到反序错误 | 1.6 | recover-cell-order、recover-notebook-record | “上面有代码”不等于本会话已执行 |
| 干净内核全跑 | 1.5#clean-run：先清状态，再 Run All | 1.6 | 两题目标3、P6迁移 | 旧计数、旧截图不作充分证据 |
| 保存/重开 | 1.5#save-stop 区分文件和仍在运行的会话 | 1.6 | 两题及 recover-notebook-record | 重新打开后再次明确重启；GUI 可操作性待学生验证 |

## 故障与复现

| 知识/能力 | 首教位置与解释 | 后续使用 | 独立证据 | 问题/跳步判断 |
| --- | --- | --- | --- | --- |
| 环境/代码问题区别 | 1.1#locate-errors 最小区分；1.4 错环境可正常输出；1.6#read-evidence 按发生位置比较 | 1.6 综合 | reproduce-script-issue、recover-notebook-record | 不把所有 NameError 都宣称环境安装错误；此处是已受控的状态原因 |
| 预期/实际 | 1.1#change-message 先预测后比较 | 全章 | 12 题中的预测与实际 | 预写时间真实性需观察，文件无法单独证明 |
| 必要环境信息 | 1.3 路径/版本，1.4 前缀；1.6#minimal-record 汇总 | 1.6 | 两题六项短记录 | 不要求 PATH 全文、环境变量全集或 pip freeze |
| 最短复现步骤 | 1.6 主例一次参数故障到 #minimal-record | 1.6 两新情境 | 两题实际复现与交接 | 是否“短且足够”须另一人按记录操作 |
| 安全恢复 | 1.1 先查位置不重装；1.4 激活受限直接调用；1.6 只改一个条件 | 全章 | 所有恢复题 | 不删环境、不改安全策略、不破坏旧项目 |
| 修复前后证据 | 1.1#locate-errors；1.4/1.6 强化身份对照 | 1.6 | repair-wrong-env、两题 | 正常 stdout/状态0不独证身份正确 |
| 新会话复验 | 1.4 提醒换终端核验；1.5 重启/重开；1.6#repair-replay 正式新终端 | 1.6 两题 | 脚本题新 Shell、Notebook 干净全跑 | 同机作者执行不算真人同伴或跨机器复现 |
| 脱敏与隐私 | 1.5 token 首次提醒；1.6#minimal-record 前缀占位且保留 target/other | 1.6/P6交接 | 两题脱敏记录，组织者复查 | 不收密码、token、个人目录全文/私有源码 |

结论：未确认阻断性跨课跳步；存在 P6-02 的输入约束薄弱点，需教师在试学前判断。不能将“所有项目有位置”解释为学习效果验证。阶段 B 特意使用给定合法名称，只迁移已教的赋值/读取/状态能力，不用它掩盖阶段 A 的自选名称问题。
