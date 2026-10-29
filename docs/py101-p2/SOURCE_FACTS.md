# VS Code事实核验

访问日期2026-10-29，来源为Microsoft官方在线文档，页面滚动更新。适用范围：本地VS Code＋官方Python扩展，非远程、Notebook或其他运行扩展。

|来源|本课采用的事实|限制|
|---|---|---|
|[Python tutorial](https://code.visualstudio.com/docs/python/python-tutorial)|打开文件夹、选择解释器、先保存、通过Python运行入口执行；右键Run Python File in Terminal可自动保存|不照搬教程创建虚拟环境；保存行为只对应文档所述入口|
|[Run Python](https://code.visualstudio.com/docs/python/run)|整文件运行与选区/行执行不同；运行通过终端呈现结果|按钮名字和布局随版本/扩展不同|
|[Python environments](https://code.visualstudio.com/docs/python/environments)|Python: Select Interpreter选择已安装解释器|选择不会证明所有已有终端的python命令已改变；本课不创建环境|
|[Terminal getting started](https://code.visualstudio.com/docs/terminal/getting-started)|View > Terminal；集成终端是完整shell，通常起点为工作区根|实际pwd为准，已有终端与设置可改变起点|
|[Python language support](https://code.visualstudio.com/docs/languages/python)|扩展提供支持，解释器需单独安装；运行入口使用选定解释器|不把安装扩展当安装解释器；不把第三方Code Runner混入|

本机VS Code 1.143.1 x64，Python扩展ms-python.python 2026.10.0，Windows；Python环境扩展已由用户安装。实际GUI观察与终端日志另见EDITOR_VALIDATION.md、PYTHON_RUNS.json。macOS界面/快捷键与多解释器真实错配尚未GUI实测。未更改用户全局配置、PATH或扩展。
