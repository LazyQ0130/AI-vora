# 起草前独立预解

从目录树按路径逐段行走，再按文件中print文本推得以下预期；不先执行程序再回填答案。所有名称区分大小写，目录中没有run.py的地方不会自动搜索子目录。

| 起点（相对实验根） | 传给Python的脚本路径 | 实际目标/预期输出 |
| --- | --- | --- |
| path-lab | run.py | 缺失；无正常输出，非零退出 |
| path-lab | alpha/run.py | path-lab/alpha/run.py；Alpha A1 |
| path-lab/alpha | ./run.py | 同上；Alpha A1 |
| path-lab/beta | run.py | path-lab/beta/run.py；Beta B2 |
| path-lab/beta | ../alpha/run.py | path-lab/alpha/run.py；Alpha A1 |
| path-lab | alpha/run.py的完整绝对路径 | Alpha A1，父终端仍在path-lab |
| path-lab/beta | 同一个完整绝对路径 | Alpha A1，父终端仍在beta |
| path-lab | "my scripts/run.py" | Space S3；引号分组后只有一个脚本路径参数 |
| path-lab | my scripts/run.py（未引用） | Python把my视为脚本，scripts/run.py变成另一个参数；本例my不存在，失败 |
| route-task/west | ./check.py | route-task/west/check.py；West W5 |
| route-task/west | ../east/check.py | route-task/east/check.py；East E4 |
| route-task/west | ../check.py | route-task/check.py缺失；无正常输出 |
| delivery-task | "my notes/ready.py" | 目标；Target T6，然后是学生自己追加的标记 |
| delivery-task/work | "../my notes/ready.py" | 同一个目标与输出；两条相对路径不同 |
| 上述两个起点 | 目标ready.py的完整绝对路径 | 同一目标与输出；绝对路径不变 |

Windows命令参数使用反斜杠，macOS使用正斜杠；这里表格统一用/表示目录树。Windows绝对形式如C:\Users\实际用户名\Documents\path-lab\alpha\run.py；macOS如/Users/实际用户名/Documents/path-lab/alpha/run.py。所有示例用户名与保存位置都要替换成学生自己的位置。本课不把终端路径当Python字符串，不要求写双反斜杠。

目标来源必须同时核对pwd、文件清单、路径行走与实际源码。A1/B2等是写死的可观察标记；将Alpha代码复制到beta会使beta也打印Alpha，不能据输出文字断言实际目录。因此题目要求目标路径证据，并在另轮验证中故意换入同一文本作边界检查。

开发验证将用Python标准库保存目录、从真实PowerShell传参，并记录命令、cwd、stdout、stderr及退出码；这些工具内部使用的模块不进入学生教材。Windows真实运行与macOS文档核对分开记录。
