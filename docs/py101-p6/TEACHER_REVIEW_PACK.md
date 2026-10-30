# 专业教师审核包（待真人填写）

对象：PY101第一章六节，均r1；改前提交 `5d71fe8b585db695ceb926bfb35211a2104639f0`。当前审核修订以包含本包的Git提交为准；唯一正文差异为1.2 next-step，见 [精确勘误](TRANSITION_AMENDMENT.md)。本包由AI整理，未开展专业教师审核，不预填姓名、签字或通过。

请先在实际阅读器按1.1–1.6顺序读正文、做核心题，再查看参考答案；不要只看此摘要。[逐目标审查](CROSS_LESSON_AUDIT.md)及[先修矩阵](PREREQUISITE_TRACE.md)供定位，结论由您独立决定。阅读页前缀为当前可用站点的 `/learn/PY101/`，本地端口由维护者提供；下列源码链接不依赖历史报告中已经停掉的端口。

## 六节入口、目标与核心任务

### 1.1 从零运行第一个Python程序 / r1

- 稳定ID：`PY101-C01-L01`；阅读路径：`/learn/PY101/PY101-C01-L01`；[完整正文、答案与rubric](../../src/content/lessons/py101/first-run.ts)。
- 当前状态：pending-review/preview，未填reviewEvidence。
- 核心案例与条件：first_run.py 两条print；交互显示问候，保存磁盘文件后逐行运行。已有受支持Python 3，无第三方依赖；首次安装另计。

1. 在本地确认解释器版本，并用自己的运行记录区分代码文件、解释器和输出。
2. 独立修改并运行一个.py文件，先预测再核对print产生的逐行结果。
3. 根据文件位置或报错定位一次运行失败，并验证恢复后的结果。

| 核心操作题（实际数量2） | 真实目标映射 | 答案、rubric入口与审核动作 |
| --- | --- | --- |
| 修改并运行三行提示 / `own-message` | 1、2 | 阅读页 `#exercise-own-message`；展开两级提示和参考解答/自查标准；源码同一exercise的prompt/hints/solution/rubric。核对题干要求与实际文件是否可逐项判定 |
| 程序存在，为什么说找不到？ / `find-script` | 3 | 阅读页 `#exercise-find-script`；展开两级提示和参考解答/自查标准；源码同一exercise的prompt/hints/solution/rubric。核对题干要求与实际文件是否可逐项判定 |

### 1.2 解释器怎样找到并执行脚本 / r1

- 稳定ID：`PY101-C01-L02`；阅读路径：`/learn/PY101/PY101-C01-L02`；[完整正文、答案与rubric](../../src/content/lessons/py101/script-paths.ts)。
- 当前状态：pending-review/preview，未填reviewEvidence。
- 核心案例与条件：path-lab/alpha、beta、my scripts中的同名run.py；pwd决定相对起点，引号整体传参。沿用1.1，不引入模块搜索。

1. 根据当前工作目录和相对路径指出实际目标文件，并用运行结果核对判断。
2. 从两个不同工作目录准确执行同一目标脚本，记录路径、预测与实际输出。
3. 识别同名文件或空格传参导致的问题，说明原因并验证修复。

| 核心操作题（实际数量2） | 真实目标映射 | 答案、rubric入口与审核动作 |
| --- | --- | --- |
| 三条命令分别指向谁？ / `trace-target` | 1、3 | 阅读页 `#exercise-trace-target`；展开两级提示和参考解答/自查标准；源码同一exercise的prompt/hints/solution/rubric。核对题干要求与实际文件是否可逐项判定 |
| 两个起点，运行同一份ready.py / `same-target-two-starts` | 2、3 | 阅读页 `#exercise-same-target-two-starts`；展开两级提示和参考解答/自查标准；源码同一exercise的prompt/hints/solution/rubric。核对题干要求与实际文件是否可逐项判定 |

### 1.3 用编辑器完成保存与重跑 / r1

- 稳定ID：`PY101-C01-L03`；阅读路径：`/learn/PY101/PY101-C01-L03`；[完整正文、答案与rubric](../../src/content/lessons/py101/editor-rerun.ts)。
- 当前状态：pending-review/preview，未填reviewEvidence。
- 核心案例与条件：editor-lab/main.py从Draft A1改为Ready B2与Saved copy；独立终端未保存对照。需VS Code、Microsoft Python支持及已可运行Python；扩展入口可能自动保存。

1. 在编辑器中打开项目文件夹和指定.py，区分编辑器、源码、终端与解释器的作用。
2. 独立完成修改、预测、保存、执行与结果核对，用文件位置和命令证明运行目标。
3. 检查保存状态、当前目录和解释器，定位一种实际错配并验证恢复。

| 核心操作题（实际数量2） | 真实目标映射 | 答案、rubric入口与审核动作 |
| --- | --- | --- |
| 自己的三行任务卡 / `reliable-edit` | 1、2 | 阅读页 `#exercise-reliable-edit`；展开两级提示和参考解答/自查标准；源码同一exercise的prompt/hints/solution/rubric。核对题干要求与实际文件是否可逐项判定 |
| 为什么输出一直没有变？ / `recover-target` | 3 | 阅读页 `#exercise-recover-target`；展开两级提示和参考解答/自查标准；源码同一exercise的prompt/hints/solution/rubric。核对题干要求与实际文件是否可逐项判定 |

### 1.4 为项目准备独立的虚拟环境 / r1

- 稳定ID：`PY101-C01-L04`；阅读路径：`/learn/PY101/PY101-C01-L04`；[完整正文、答案与rubric](../../src/content/lessons/py101/project-environments.ts)。
- 当前状态：pending-review/preview，未填reviewEvidence。
- 核心案例与条件：两个项目各自.venv；只print也可能环境错配。需同一已核对基础Python和可写项目目录，不需第三方包；优先明确环境解释器路径。

1. 在两个独立项目中创建.venv，指出环境位置并说明它与基础Python的关系。
2. 用各自环境解释器运行脚本，以实际路径、前缀、版本和输出核对选择。
3. 识别错误项目解释器，在不改系统配置的情况下修复并保留复跑证据。

| 核心操作题（实际数量2） | 真实目标映射 | 答案、rubric入口与审核动作 |
| --- | --- | --- |
| 建立自己的两个项目环境 / `create-project-envs` | 1、2 | 阅读页 `#exercise-create-project-envs`；展开两级提示和参考解答/自查标准；源码同一exercise的prompt/hints/solution/rubric。核对题干要求与实际文件是否可逐项判定 |
| 输出正确，解释器却来自另一项目 / `repair-wrong-env` | 3 | 阅读页 `#exercise-repair-wrong-env`；展开两级提示和参考解答/自查标准；源码同一exercise的prompt/hints/solution/rubric。核对题干要求与实际文件是否可逐项判定 |

### 1.5 在Jupyter中按顺序运行单元格 / r1

- 稳定ID：`PY101-C01-L05`；阅读路径：`/learn/PY101/PY101-C01-L05`；[完整正文、答案与rubric](../../src/content/lessons/py101/notebook-cell-order.ts)。
- 当前状态：pending-review/preview，未填reviewEvidence。
- 核心案例与条件：first-notebook中marker赋值/显示两格，Draft A→编辑未执行仍旧值→执行Ready B→重启先显示NameError→干净全跑。需目标环境已安装Notebook、真实Python内核；首次安装需网络。

1. 在项目环境启动本地Jupyter，确认内核并创建、运行和保存含文字与代码的Notebook。
2. 预测并观察旧状态与乱序错误，解释原因，用重启和按序执行恢复。
3. 重新打开保存的Notebook，在正确的干净内核中从头完整运行并保留实际证据。

| 核心操作题（实际数量2） | 真实目标映射 | 答案、rubric入口与审核动作 |
| --- | --- | --- |
| 建立自己的Notebook并重启复跑 / `create-own-notebook` | 1、3 | 阅读页 `#exercise-create-own-notebook`；展开两级提示和参考解答/自查标准；源码同一exercise的prompt/hints/solution/rubric。核对题干要求与实际文件是否可逐项判定 |
| 出库标签为什么在重启后失败？ / `recover-cell-order` | 2、3 | 阅读页 `#exercise-recover-cell-order`；展开两级提示和参考解答/自查标准；源码同一exercise的prompt/hints/solution/rubric。核对题干要求与实际文件是否可逐项判定 |

### 1.6 让别人复现一次环境问题 / r1

- 稳定ID：`PY101-C01-L06`；阅读路径：`/learn/PY101/PY101-C01-L06`；[完整正文、答案与rubric](../../src/content/lessons/py101/environment-reproduction.ts)。
- 当前状态：pending-review/preview，未填reviewEvidence。
- 核心案例与条件：notice-tool中只改脚本参数；再用target/other环境错配和review-note内核顺序问题交接。需1.1–1.5实践能力；所有结果和六项记录来自本人实际执行。

1. 从实际运行中收集位置、环境身份、命令及预期与实际结果，留下必要复现条件。
2. 在新终端或干净Notebook内核中重现受控问题，区分位置、环境与状态并修复。
3. 交付必要源码与简短脱敏记录，保留修复前后结果并在新会话验证恢复。

| 核心操作题（实际数量2） | 真实目标映射 | 答案、rubric入口与审核动作 |
| --- | --- | --- |
| 交付脚本环境错配的复现记录 / `reproduce-script-issue` | 1、2、3 | 阅读页 `#exercise-reproduce-script-issue`；展开两级提示和参考解答/自查标准；源码同一exercise的prompt/hints/solution/rubric。核对题干要求与实际文件是否可逐项判定 |
| 用真实内核补齐缺失的复现条件 / `recover-notebook-record` | 2、3 | 阅读页 `#exercise-recover-notebook-record`；展开两级提示和参考解答/自查标准；源码同一exercise的prompt/hints/solution/rubric。核对题干要求与实际文件是否可逐项判定 |

## 官方事实与证据范围

以下为链接参考及独立概括，不复制第三方长段或代码。仓库教材/短样例的来源与归属沿用P0–P5来源表，本轮未新增外部素材、数据集或授权声明。2026-10-30重新访问了Python、Jupyter、VS Code教程及引用规则页面；VS Code环境选择页本轮获取超时，其历史P2/P3官方核对和实机证据仍可查。

| 官方入口 | 要核对的事实/教学边界 |
| --- | --- |
| [Python命令行](https://docs.python.org/3/using/cmdline.html#interface-options) / [print](https://docs.python.org/3/library/functions.html#print) | 文件参数读取脚本；字符串输出默认换行；解释器/终端/源码的角色 |
| [Windows安装](https://docs.python.org/3/using/windows.html) / [macOS安装](https://docs.python.org/3/using/mac.html) | 当前安装路线、已有安装差异；文档支持不等于实机安装成功 |
| [PowerShell引用](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_quoting_rules?view=powershell-7.5) | 含空格路径整体传参；作者工具/学生命令的位置分开 |
| [venv](https://docs.python.org/3.14/library/venv.html) / [sys](https://docs.python.org/3.14/library/sys.html) | 基础安装、环境路径和prefix/base_prefix；可直接调用，不以激活提示符作为充分身份 |
| [Python名称规则](https://docs.python.org/3.14/reference/lexical_analysis.html#identifiers) | P6-02：自选名称的最小输入约定；无需把完整词法规则塞进入门课 |
| [VS Code Python教程](https://code.visualstudio.com/docs/python/python-tutorial) / [环境选择](https://code.visualstudio.com/docs/python/environments) | 编辑器选择、运行入口和已有终端各自取证；教程本轮可访问，环境选择页超时，后者待教师/平台复核 |
| [Notebook运行代码](https://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/Running%20Code.html) / [Server安全](https://jupyter-server.readthedocs.io/en/stable/operators/security.html) | 内核维护状态、重启清状态、顺序执行；本地认证。示例页仍含旧菜单文字，具体Notebook7菜单以实机为准 |

技术证据请从 [TECHNICAL_PRECHECK](TECHNICAL_PRECHECK.md) 阅读：本轮是Windows新练习项目中的连接/迁移材料预检，不是学生试学；P2编辑器GUI、P3环境GUI、P4Notebook GUI、P5真实Shell/内核为各自历史覆盖。本轮不重复证明每种安装、每个GUI入口、PowerShell5.1或macOS。macOS未实测；自动化宿主Ctrl+C退出码不能替代Jupyter正常停服；干净树Webpack通过不能解除P5 Turbopack外联依赖限制。

## 请独立作出专业判断

1. print/字符串、最小赋值/读取、NameError与错误发生阶段是否准确？
2. 无编程经历者是否能仅依正文完成保存/运行/定位，而非复制出结果？
3. Windows与macOS说明是否适合目标设备、权限和当前工具界面？
4. 基础Python、项目环境、VS Code选择、终端入口与Notebook内核是否分清？
5. 编辑、保存、旧输出和运行中状态的差别是否可被学生观察并解释？
6. 同名路径、错误环境仍成功输出、乱序NameError的诊断与恢复是否合理？
7. 每项正式目标是否有充分核心题证据；提示是否保留判断；rubric能否从文件/过程判定？
8. 哪些问题必须在试学前修复；哪些可以观察后决定？特别处理P6-02，再决定如何开展自选名称任务。P6-01已最小修复，请复核。

还请判断六节229–343分钟的未校准编辑估计、重复取证和六项短记录的负担。不得用“整体通顺”替代逐目标意见；如仅查一平台请明确范围。

## 可填写审核记录

审核者姓名/专业背景：________　日期：________　实际审阅提交SHA：________

实际平台、Python、编辑器/扩展、Notebook版本（仅记录相关项）：________

| 课时 | 实际读/做的目标与题 | 事实/难度/平台/评价意见及具体ID | 必须修订项、建议改法及理由 | 是否可进入本次受控试学 |
| --- | --- | --- | --- | --- |
| 1.1 | ________ | ________ | ________ | ________ |
| 1.2 | ________ | ________ | ________ | ________ |
| 1.3 | ________ | ________ | ________ | ________ |
| 1.4 | ________ | ________ | ________ | ________ |
| 1.5 | ________ | ________ | ________ | ________ |
| 1.6 | ________ | ________ | ________ | ________ |

P6-02处理决定及对应修订/支持方式：________

审核结论与未覆盖范围：________

签署：________　维护者处理/复核提交及日期：________

签署后由维护者核查证据、处理修订与试学安排；填写本表本身不自动修改发布状态，也不替代中文编辑或真实学生记录。
