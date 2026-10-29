# 真实Windows VS Code观察

2026-10-29，VS Code1.143.1 x64 / e646868227c3e3a9e3f24277c8c7220be42c0be7；ms-python.python2026.10.0，Python Environments1.40.0，Windows10.0.26300.9711。沿用现有扩展，无新安装。使用computer-use原生窗口API，实际窗口与源码不是模拟HTML。路径在公开AX记录中用<WORKSPACE>替代；带机器原路径截图仅保留本机machine/并忽略，不提交。

分别通过code --new-window打开本轮新建project-a与project-b，真实资源管理器可见.venv/main.py/observe_env.py。启动方式为CLI指定文件夹，未声称逐一操作File > Open Folder对话框。点开诊断源码；Python环境扩展自动发现两个本地环境，状态栏分别显示对应项目Scripts/python.exe与3.14.2。

A：实际命令面板Python: Select Interpreter观察工作区.venv候选，明确选中；点击官方「运行 Python 文件」，集成终端执行A/.venv解释器与A/observe_env.py，诊断prefix为A/.venv、base_prefix为D:\Program Files、Version3.14.2。见EDITOR_A_AX.txt。首次终端自动激活还暴露了现有扩展生成进程级Set-ExecutionPolicy命令，因Microsoft.PowerShell.Security模块加载失败未生效；这是扩展自行生成的失败尝试，不是本课推荐步骤，也未因此去改用户全局策略。直接指定A解释器的后续运行成功。此故障原样留证，不写成“全GUI无错误”。

B：为避免再次触发上述PowerShell自动策略尝试，只在本轮新建B工作区设置terminal.integrated.defaultProfile.windows=Command Prompt。未改全局、用户原工程或扩展配置；机器设置留本地忽略。官方入口在新cmd终端自动执行B的activate.bat，再以B/.venv/Scripts/python.exe运行B观察工具；实际四项路径/版本正确，没有执行策略命令。

随后在B的环境选择界面暂选已有基础Python3.14，官方入口启动另一cmd终端，运行命令明确为D:\Program Files\python.exe＋同一B观察脚本；诊断Interpreter/Environment/Base Python均回到基础位置，Version仍3.14.2，见EDITOR_B_BASE_AX.txt。旧B环境终端仍保留在终端列表，并未被当作新终端选择证据。

再从同一选择列表选回B/.venv，官方入口真正复跑，prefix回到B/.venv且不同于基础位置，见EDITOR_B_REPAIRED_AX.txt。这是实际GUI错误选择→恢复观察；没有移动环境、修改源码、安装版本或改PATH来制造错误。shell命令的独立退出状态另见PYTHON_ENV_RESULTS.json；GUI没有独立退出码字段，只记录命令、输出与返回提示符，不伪称取得exitCode。

限制：受computer-use技能约束，未手工向GUI终端键入pwd、创建或诊断命令；这些由独立PowerShell7工具实际执行，GUI通过官方文件运行入口取证。没有在同一个现存shell手工输入python诊断；“激活A后只cd到B仍用A”和“独立新shell不继承”的可重复验证来自Shell记录，GUI只比较保留下来的旧终端与新官方运行终端。macOS、Windows PowerShell5.1完整手动流程、实体学生电脑尚未实测。自动发现与候选/状态栏可有差异，最终均以实际运行路径为准。
