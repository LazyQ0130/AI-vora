# 真实Windows Jupyter验证

2026-10-29，独立临时notebook-lab项目在仓库外，不修改Aivora的Node依赖或用户既有Python环境。已有基础CPython3.14.2创建.venv，通过该环境python -m pip --version和-m pip install notebook安装；制作时显式使用官方https://pypi.org/simple，未关闭TLS/认证或改全局配置。版本与pip位置见ENVIRONMENT.txt，实际安装日志见INSTALL.txt：Notebook7.6.3、Jupyter Server2.21.1、ipykernel7.4.0、IPython9.17.1、nbformat5.11.1。Notebook正常依赖包含JupyterLab组件，本课没有教授另一套界面。安装/下载等待不算学生能力耗时，本轮未测学生安装时间。

成功启动候选：项目根，明确环境Python执行-m jupyter notebook --no-browser。--no-browser仅制作时避免弹出其他浏览器，学生可省略。实际地址localhost:8888，默认token认证保留；先开无令牌URL看到登录页，再在本地登录，未改为公网监听或无认证。配置/数据/运行时/IPython目录只以本次进程环境变量定位到该临时项目，未修改全局文件；没有用户级kernelspec注册。环境内python3内核自动可用，ENVIRONMENT.txt记录其环境内路径。

## GUI实际操作

真实浏览器文件列表New → Python 3 (ipykernel)，新建Untitled；用Cell type选择Markdown，输入说明并Shift+Enter渲染；两个Code格分别输入marker赋值和print，Ctrl+Enter/Shift+Enter实际执行。File → Rename改为first-notebook.ipynb；使用工具栏保存，不用脚本生成此GUI文档。选定Kernel菜单查看当前会话和可用Python 3 (ipykernel)，再以现成sys.executable格实际核对到本项目.venv/Scripts/python.exe，公开证据仅替换项目路径前缀。

按序得到Draft A；把赋值文本改为Ready B而不执行，再跑显示格仍为Draft A；执行赋值/显示后变Ready B。重启确认后先跑显示格，真实NameError提到marker未定义；再执行提供名字的格和显示格恢复。实际观察过[*]到数字的变化，不能用旧输出或旧计数判成功。

随后实际点击Restart the kernel and run all cells，确认重启，得到Ready B与正确内核路径；保存文件，磁盘4格为Markdown和3个Code，代码计数1/2/3。关闭浏览器文档标签后，文件列表仍显示运行内核，证明关页面不等于清状态。由文件列表选择文件并Open重新打开，再次明确重启全跑，得到Ready B、目标路径，保存，计数1/2/3。文件选择至新标签出现有异步延迟，未把第一次空标签列表当作失败结论。JUPYTER_SAVED_EVIDENCE.json为真实GUI保存文件的脱敏副本；下载稿仍空输出/null计数，不用已执行证据覆盖下载。

File → Close and Shut Down Notebook确认，Running列表内核行变0，日志记录Kernel shutdown。最初尝试启动终端Ctrl+C：PTY宿主会话退出1，服务进程随后不存在，但没观察到Jupyter确认提示，不声称它返回0。补启同一环境后，实际File → Shut Down确认，界面显示Server stopped，启动终端返回0。JUPYTER_SHUTDOWN.json确认两个服务进程已退出、127.0.0.1:8888不再监听、没有本轮残留Python/Jupyter进程（排除检查程序本身及启动它的venv启动器祖先进程）。没有终止无关进程。最初进程检查误把检查器自身的venv父启动器算作残留，按明确祖先关系修正后再检查，不靠杀进程通过。

证据：JUPYTER_GUI_RESULTS.json、JUPYTER_REOPENED_AX.txt、JUPYTER_STOPPED_AX.txt、JUPYTER_SAVED_EVIDENCE.json、JUPYTER_SERVICE_LOG.txt及4张jupyter-*.jpg。Jupyter菜单名以本机7.6.3为实测，不用旧Cell菜单文档充当现行GUI事实。公开日志去除token/真实项目与用户前缀；一次已停服日志尾段误输出了已失效令牌，见NOTEBOOK_DRIVER_REPAIR.md，未存入公开文件/Git。

## 独立内核与边界

validate-py101-notebook.ts调用validate-notebook-state.py，在同一已安装环境使用真实jupyter_client/IPython内核。最终40步覆盖两份下载格式校验、干净全跑、主例旧状态/NameError/恢复、物流新例错误与恢复及自选标记的短观察、另一名字的独立练习；两道练习实际保存新.ipynb、重新读文件并从新内核全跑、再次核验解释器，最后内核正常shutdown。它不冒充GUI；驱动中的“改文本未执行”是显式计划步骤，真正编辑文本的观察来自上面的GUI。首次驱动重启后IOPub超时，重建client/channel后先26步通过；后因目标复核补齐新题的短观察及双题保存/重开/干净验证，最新40步再次通过，保留修复说明。

macOS仅官方资料与命令形式核对，未实测。没有实体学生电脑、目标学生试学或专业人类审稿；没有用Node/JSON通过代替GUI。本机版本/网络一次成功不能推广为所有机器均可安装；已在正文给获准环境与支持路径。
