# 真实VS Code操作验收

日期2026-10-29；Windows本地图形窗口，应用Microsoft.VisualStudioCode。使用[computer-use技能](C:/Users/QYF/.codex/plugins/cache/openai-bundled/computer-use/26.1023.51421/skills/computer-use/SKILL.md)的原生窗口观察与操作，不用模拟页面代替编辑器。VS Code 1.143.1 x64，提交e646868227c3e3a9e3f24277c8c7220be42c0be7；官方ms-python.python@2026.10.0。CLI列举已有扩展，未安装新扩展。

实际打开本轮新建的docs/py101-p2/runtime/editor-lab文件夹，资源管理器能见main.py与notes.py及完整位置；启动使用code --new-window传入文件夹，而非声称已经点击过File > Open Folder对话框。点开main.py，初始编辑区print("Draft A1")；外部终端python main.py输出Draft A1、exit0（GUI_BEFORE.json）。

在真实编辑区Ctrl+1聚焦、Ctrl+A选中原文，输入Ready B2与Saved copy两行。截图观察到标签小圆点；独立外部终端读磁盘源码仍为Draft A1，运行结果也是Draft A1、exit0（GUI_DIRTY.json）。未用任何运行按钮制造此故障。随后真实Ctrl+S保存，小圆点消失；磁盘源码变两行，外部同一命令输出Ready B2、Saved copy、exit0（GUI_SAVED.json）。全程未更改自动保存设置。现有Copilot出现过灰色第三行建议，未接受，磁盘/运行仍只有两行。

真实命令面板搜索Python: Select Interpreter，观察候选包括用户原有多个安装，不创建新安装。列表原选项文字显示d:\Scripts\python.exe，而状态栏Python环境扩展显示d:\Program Files\python.exe；这是界面信息不宜单凭一处推断的具体例子。为本轮新建练习工作区明确选择D:\Program Files\python.exe（3.14），不改用户其他工作区或全局PATH。

点击官方「运行 Python 文件」按钮，真实集成PowerShell面板自动出现，观察命令：

```text
& "D:\Program Files\python.exe" c:/Users/QYF/Desktop/Aivora-Web/docs/py101-p2/runtime/editor-lab/main.py
Ready B2
Saved copy
```

提示符位置是本轮editor-lab，脚本参数完整指向该main.py。实际路径与外部只读诊断一致，Python为3.14.2。GUI输出没有独立退出码字段；这里按完成输出且提示符返回记录，不能冒称GUI获取了exitCode。外部与专项终端执行分别保存真实exitCode。

限制：受computer-use技能禁止向终端输入shell命令的约束，GUI内没有手工输入pwd/dir或诊断命令；cwd由可见提示符观察，命令诊断与文件清单由独立shell工具实际执行。已验证官方入口确实从所选解释器执行整文件；没有在未保存状态点击该入口，因此本机入口的自动保存行为采用官方文档事实、未声称逐入口实测。File > Open Folder对话框、macOS、各主题、第三方运行扩展、不同解释器实际输出错配未GUI实测。本机最终选定与终端路径一致，无需制造环境故障。Python环境扩展在本轮新建目录生成.vscode设置，留在本机不提交；原有用户编辑器配置未改。
