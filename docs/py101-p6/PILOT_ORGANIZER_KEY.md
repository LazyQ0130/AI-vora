# 组织者专用：布置、故障卡、提示与核对

**不随学生任务纸分发。** 本文件含故障起因和恢复核对要点；技术结果JSON也不交学生。当前没有真实参与者结果。

## 新位置与材料布置

每位参与者使用全新、明确属于本次试学且可写的位置，例如新的 `<试学根>`。不要在Aivora仓库或用户旧项目里制造故障。若名称已存在换新根，保留原目录。对外路径只保留占位前缀与以下项目后缀。

```text
<试学根>/
├── pilot-box/           学生任务一创建；目标项目
│   ├── cards/start.py   学生自写两条print
│   ├── observe_env.py   组织者提供，只读工具
│   ├── parcel-note.ipynb
│   └── .venv/          学生创建或如实登记预建
└── neighbor/
    └── .venv/          组织者准备，不能搬运另一项目的环境
```

从 [pilot-student](pilot-student/) 提供两个文件；Notebook初始4格、空输出/null计数，无机器路径。observe_env.py与现行1.4工具相同。学生任务纸没有最终恢复命令；先单独核对文件名与复制位置，不在任务前演示修复。

1. A阶段安装/准备按六节讲解记录；B1保留学生创建目标环境的机会，组织者预先只建neighbor。若需预建pilot-box环境支持离线操作，明确把“创建”标为本阶段未独立验证，可让学生另建一个新空项目验证创建，但不要擅自追加冗长考核。
2. B1结束后、B3计时前，用目标环境中明确的Python确认已有Notebook/pip及内核可用；如需安装，走获准网络/官方来源，等待另计，或暂停由技术支持完成。**B阶段测量不依赖在线服务或第三方模型API**，仅运行已安装的本地Notebook。
3. 目标/neighbor环境均用参与者已可用的基础Python在原位置新建，不改系统Python、PATH、执行策略或用户级kernelspec；不用不同版本制造混杂。所有自己的练习文件保留在环境外。

### 组织者创建与启动参考（勿当学生答案分发）

以下各条在指明目录逐行执行；所有实际路径须本地核对，不把占位符原样输入。Windows以已经验证的python为基础，原先用py则核对后全程一致；macOS用已验证python3。

| 位置/用途 | Windows PowerShell | macOS zsh/bash（本轮未实机验证） |
| --- | --- | --- |
| neighbor根创建环境 | `python -m venv .venv` | `python3 -m venv .venv` |
| pilot-box根检查pip | `& ".\.venv\Scripts\python.exe" -m pip --version` | `./.venv/bin/python -m pip --version` |
| 必要时由支持安装Notebook，另计时 | `& ".\.venv\Scripts\python.exe" -m pip install notebook` | `./.venv/bin/python -m pip install notebook` |
| pilot-box根本地启动 | `& ".\.venv\Scripts\python.exe" -m jupyter notebook` | `./.venv/bin/python -m jupyter notebook` |

保持默认本地监听和认证，不公开日志访问凭据。服务Python不自动证明内核相同，要实际运行观察格。目标内核缺失时先停止测量交支持核查；不要把不匹配的内核当作本题故障，也不盲目注册多个用户级内核。

## 任务二启动卡（只给实际平台这一张）

前提：学生B1源码已保存、运行过，两个环境存在，cwd为pilot-box根；脚本本身正确。先请学生写普通输出与身份预测，再交下列相应卡片。卡片只产生一个受控环境错配，不混入错误文件/未保存/缺包。

Windows PowerShell卡：

```powershell
& "..\neighbor\.venv\Scripts\python.exe" .\cards\start.py
& "..\neighbor\.venv\Scripts\python.exe" .\observe_env.py
```

macOS卡（须组织者先实机预检）：

```bash
../neighbor/.venv/bin/python cards/start.py
../neighbor/.venv/bin/python observe_env.py
```

**不把下面核对要点放在卡上：** 两次启动来自neighbor；普通输出仍为学生自己写的两行，退出0也不表示身份满足目标。观察工具的Interpreter/Environment会落到neighbor/.venv，Base Python与Version可相同。

一种合法恢复是从pilot-box根明确调用自己的`.venv/Scripts/python.exe`（macOS为`.venv/bin/python`），脚本参数仍为cards/start.py，再用同一解释器跑observe_env.py。准确绝对路径或经实际诊断的目标激活方案也可。不能改print、复制环境或只改状态栏后不重跑。

Windows核对命令（保管在组织者页）：

```powershell
& ".\.venv\Scripts\python.exe" .\cards\start.py
& ".\.venv\Scripts\python.exe" .\observe_env.py
```

macOS核对命令：

```bash
./.venv/bin/python cards/start.py
./.venv/bin/python observe_env.py
```

每次外部Python后如需退出状态应立即观察；Windows `echo $LASTEXITCODE`，macOS `echo $?`。不要把下一条外部命令状态混入前一条。新Shell复验需重新定位cwd，先错配再恢复，记录实际结果。

## 三任务分级提示（学生请求时逐级给）

| 任务 | 提示1 | 提示2（仍不说最后修复命令） |
| --- | --- | --- |
| B1 保存/环境 | 你现在编辑的文件、磁盘文件、终端位置分别是什么？ | 用已学的保存状态、pwd、文件清单和观察工具，把目标文件与本次Python位置分别对上；再自行选择执行方式 |
| B2 错配 | 普通文字输出回答了什么？目标还要求哪一种运行身份？ | 将观察工具的Interpreter/Environment完整后缀与目标项目比较，分开看命令中解释器和脚本两部分；自己决定改哪一部分再验证 |
| B3 状态 | 重启以后，这个内核实际执行过哪些格？ | 找到提供名字与使用名字的格；比较文本、已保存输出和实际执行记录，再自行安排清状态后的验证 |

提示2后仍卡住，可补讲或演示，但逐字记录帮助点并区分后续表现；不要改写最初尝试记录。

## Notebook核对要点（非学生答案）

- 给定名称parcel_label合法；初始值为Ready J4。不要求新函数、循环、条件或模块编写。工具格原样运行。
- 明确重启后先执行print(parcel_label)应为真实NameError，代码行与末行需一起保留；随后提供名称再显示可恢复。此处不是缺包或解释器版本故障。
- 只改赋值格文字而不执行，重跑显示格仍为旧值；真正执行改格再显示才更新。学生自己的标记决定最终值，不能要求交作者的K8/J4变化文本。
- 保存/重开后再重启、按文档从头全跑并保存；无错误、最终自选文本、实际内核位置共同支持结果。只看计数或旧输出不足。
- 原题纸要求结束时关闭自己的会话/服务，按1.5指引；自动化Ctrl+C宿主有不同退出行为，不能杀所有Python进程解决。没有成功正常停止要记录并交支持。

## 现场放行表（由真人填）

| 检查项 | 实际平台/结果/日期/执行者 |
| --- | --- |
| 教师/编辑试学前意见已处理，P6-02处置明确 | ________ |
| 两份学生文件存在、Notebook格式和空输出正确 | ________ |
| 两个新环境存在；学生创建与支持预建边界已登记 | ________ |
| B1可保存运行；B2仅环境错配且可安全恢复 | ________ |
| B3本地服务器/目标内核可用；能重启全跑并正常停服 | ________ |
| 学生分发包无本页/审核报告/技术JSON/最终修复命令 | ________ |
| 记录/录制同意、脱敏、保存期限已说明 | ________ |

Codex的Windows技术预检见TECHNICAL_PRECHECK，不替组织者在每位真实设备上的放行，也不填写此表。
