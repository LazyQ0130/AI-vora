# 官方事实核查

访问日期2026-10-29。只用官方资料核对事实，未复制外部整篇教材；案例与代码为本仓库短示例。工具辅助核查不等于专业人类审核。

|来源|核对结论与范围|
|---|---|
|https://docs.python.org/3/using/cmdline.html|脚本参数指定要执行的文件，相对位置与cwd对应；实际错误措辞由Windows本轮采集。当前通用页面为3.15文档，实际解释器版本另记|
|https://docs.python.org/3/tutorial/errors.html|运行期间异常与文件打开失败分开；NameError及回溯上下文。只解释已有内核未定义名字情境，不教try/except|
|https://docs.python.org/3.14/library/sys.html|executable为实际解释器路径，prefix/base_prefix区分虚拟环境；3.14系列文档与本机3.14实测分开|
|https://docs.python.org/3/library/venv.html|项目环境独立，Windows Scripts与POSIX bin；环境不应直接搬运给同伴|
|https://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/Running%20Code.html|代码由持有状态的内核执行，重启清状态；旧页面菜单截图不作为Notebook7现行界面证据。P5用真实内核消息验证，不冒称新GUI验收|
|https://code.visualstudio.com/docs/python/environments|普通脚本解释器选择与环境定位；本课仍以真实执行诊断为证据，不仅看状态栏|
|https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables#lastexitcode|外部程序运行后LASTEXITCODE记录退出码；立即echo观察，Shell观察行与程序stdout区分|
|https://zsh.sourceforge.io/Doc/Release/Parameters.html|特殊参数?为上次命令状态；macOS用echo $?，未macOS实测|

实际版本、原生Shell的stderr/退出码、内核身份及独立会话结果以CLI_RESULTS.json、NOTEBOOK_RESULTS.json为准，正文完成前先实测，不要求背诵固定错误全文。Notebook沿用1.5的本地环境与安全边界；本轮无需再开服务器，不使用token。没有跨机器或同伴复现的实际数据。
