# 官方事实与适用边界

访问日2026-10-29；官方网页滚动更新。本机实际CPython 3.14.2，另对照Python 3.14文档分支，不将页面当前补丁版本当本机版本。通用venv入口当日显示3.15.2文档，固定3.14分支显示3.14.10；这里只核对适用的稳定行为。讲解、例子与练习原创；官方页面仅用于事实核验和链接参考，不复制大段文章/截图或第三方图形。只读诊断以sys公开字段组成，无外部库/数据许可依赖。

|事实|官方依据|适用与核验状态|
|---|---|---|
|venv基于已有Python；通常独立的包安装位置，源码放环境外，环境可重建而非整目录搬运|[venv](https://docs.python.org/3.14/library/venv.html)|标准库venv默认选项；不是OS沙箱；正文不用系统包共享选项|
|Windows解释器在Scripts，POSIX在bin；可不激活直接指定解释器|[venv工作方式](https://docs.python.org/3.14/library/venv.html#how-venvs-work)|本机Windows实跑另记；macOS文档核验、尚未实测|
|prefix为当前环境，base_prefix为基础安装；标准venv二者不同|[sys](https://docs.python.org/3.14/library/sys.html#sys.prefix)|同时比实际executable和目标路径，版本/提示符不能单独验收|
|executable为当前解释器位置，version为实际进程版本|[sys字段](https://docs.python.org/3.14/library/sys.html#sys.executable)|只读观察工具，不要求学生编写或解释import机制|
|激活脚本依shell区分，改变当前会话查找；deactivate退出；不是创建或唯一使用方式|[venv激活表](https://docs.python.org/3.14/library/venv.html#how-venvs-work)、[入门教程](https://docs.python.org/3/tutorial/venv.html)|PowerShell受限立即直接调用，无执行策略/PATH修改；本机成功/失败分别记录|
|3.13起venv默认创建内部.gitignore；环境通常不纳入版本管理|[venv版本变化](https://docs.python.org/3.14/library/venv.html)|根仓库仍加最小.venv/规则，实测git check-ignore与未跟踪状态；不依赖某版本内部文件|
|Select Interpreter及环境发现，现有扩展可有不同UI；工作区.venv通常能发现|[VS Code environments](https://code.visualstudio.com/docs/python/environments)|分别打开两个项目，核对路径，不依赖固定图标，不引入多根工作区|
|新终端的激活受配置影响，旧终端不应假定同步；官方入口运行所选Python|[官方Python教程](https://code.visualstudio.com/docs/python/python-tutorial)、[Run Python](https://code.visualstudio.com/docs/python/run)|真实GUI记录与终端自动化分开；未实测项不借历史P2截图声称通过|

官方venv文档包含修改PowerShell执行策略的可选说明，本轮需求明确要求更窄的安全流程，因此教材只给现有策略下运行及直接调用替代，不复制策略修改指令。工具、系统版本与访问日期的详细制作信息留报告，正文只写学生选择命令所需条件。

本机GUI补充事实：VS Code1.143.1、Python扩展2026.10.0、Python Environments1.40.0发现本轮A/B两环境。A的现有扩展自动激活曾生成进程级执行策略命令，但因5.1安全模块加载失败未生效；后续直接指定解释器成功。B只在本轮新工作区选cmd配置，官方运行入口先activate.bat再运行所选解释器。该观察不推广为所有版本默认行为，不将扩展生成的失败策略尝试写成推荐步骤。B选择基础解释器与恢复环境的实际输出见EDITOR_VALIDATION.md。
