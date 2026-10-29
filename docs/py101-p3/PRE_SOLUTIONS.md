# 起草前预解与验证计划

2026-10-29。以下为独立推演和预期，不是实测值。实际记录另存PYTHON_ENV_RESULTS.json与EDITOR_VALIDATION.md，不能把示例路径当学生机器结果。

主例最终结构：python-projects下面project-a和project-b；每个项目根有main.py、observe_env.py与.venv，源码不进入.venv。project-a/main.py输出Project A A4，project-b/main.py输出Project B B6；均退出0。两个环境来自同一个已确认基础Python，版本相同也合理。环境解释器应分别在各自Scripts/python.exe（Windows）或bin/python（macOS）。

创建：分别cd到两项目、pwd确认，Windows先python --version与基础诊断，再python -m venv .venv；macOS用python3 --version与python3 -m venv .venv。若用py，先以同一入口做版本及诊断确认，再py -m venv .venv，不假设不同py安装总是选择同一个Python。已有.venv时停下检查，测试工具仅在本轮新建、明确归属且不存在.venv的目录创建，绝不用--clear。

直接调用：Windows在项目根运行 & ".\.venv\Scripts\python.exe" .\main.py；macOS为./.venv/bin/python main.py。环境A和B的完整executable与prefix应不同；两份base_prefix应指向共同基础安装；正常venv的prefix != base_prefix。诊断observe_env.py将四项逐行标注。版本不是环境身份，提示符和VIRTUAL_ENV也不是充分证据。

激活预期：Windows PowerShell .\.venv\Scripts\Activate.ps1，macOS zsh/bash source .venv/bin/activate；再python observe_env.py可核对到对应环境。deactivate退出当前shell激活；已知完整解释器路径的直接调用仍可用。新开的独立终端不应假定继承旧shell状态，先pwd和实际诊断；不用更改执行策略保证演示。若PowerShell受限，记录错误并直接调用；可另外验证本机允许的cmd activate.bat（仅作为开发验证，不强迫学生换shell）。

错误主例：在project-a根执行project-b的解释器，但脚本参数仍是project-a/main.py；普通输出仍为Project A A4，诊断prefix却指向B。只改解释器为A后输出仍相同，诊断回到A，才能证明修复。脚本保存状态、路径与版本不变。

练习一独立预解：新练习位置workshop，项目report与tools/label，各建.venv，分别创建report/check.py与tools/label/tag.py，自选标记，例为Report R8与Label L9（学生不能照抄作为自己的成果）。对应环境直接调用各源码，分别保留预测、创建与诊断。版本和base_prefix可相同，两个prefix必须对应不同项目。

练习二从workshop/report根调用../tools/label/.venv中的Python运行check.py与observe_env.py。普通结果仍为Report R8，但环境prefix为tools/label/.venv。修复可直接调用report/.venv解释器，或经真实核验的当前shell激活后执行。题目明确两文件已保存、脚本是report/check.py、同一基础版本、无第三方库，不给多个混杂故障。

将实际检验：两个主例环境与两个练习环境、基础诊断、创建/文件存在、直接执行、真实激活与退出、错误调用/恢复、独立新shell重新定位、忽略规则。macOS没有执行环境时只记官方核验。GUI只操作本轮全新项目，检查发现/选择/官方执行/切项目及已有和新终端；不改用户全局设置或扩展。
