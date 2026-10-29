# 官方事实核验与边界

访问日2026-10-29；Notebook stable文档当前7.6.3、IPython9.17.1、nbformat文档5.11，页面版本不冒充本机安装版本。下表是起草依据；实际安装、GUI及内核版本另记录。本课文字、三行主例与练习原创，仅链接核对事实，不复制官方长文/界面图；无外部数据许可依赖。

|核对事实|来源|适用与验证边界|
|---|---|---|
|安装notebook、用jupyter notebook启动|[Jupyter安装](https://jupyter.org/install)|限定项目环境的Python/pip；-m候选及环境入口须另行实跑|
|浏览器Notebook、代码格、Markdown格与单独内核|[Notebook](https://jupyter-notebook.readthedocs.io/en/stable/notebook.html)、[文字格](https://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/Working%20With%20Markdown%20Cells.html)|Notebook7为本课主线，文档部分示例仍有旧菜单描述；具体菜单由本轮GUI决定|
|Shift+Enter执行、内核保存状态、重启清状态、按顺序全部执行|[Running Code](https://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/Running%20Code.html)|亲测旧状态、NameError和恢复；不用旧Cell菜单名称作唯一证据|
|服务器提供网页及会话，token默认保护，本地地址/端口以实际输出为准|[Server](https://jupyter-server.readthedocs.io/en/stable/)、[安全](https://jupyter-server.readthedocs.io/en/stable/operators/security.html)|仅loopback，保留认证；不公开端口、不关闭保护、不提交令牌|
|ipykernel执行Python，多环境注册需区别环境；额外用户级注册会写持久kernelspec|[IPython内核](https://ipython.readthedocs.io/en/stable/install/kernel_install.html)|本课先安装Notebook并观察默认环境内核，不强制--user安装；异常交支持人员核对环境|
|VS Code Notebook有单独Kernel选择，不等同于普通.py解释器选择|[VS Code Notebook](https://code.visualstudio.com/docs/datascience/jupyter-notebooks)、[Kernel管理](https://code.visualstudio.com/docs/datascience/jupyter-kernel-management)|仅必要辨析，不教授第二套界面，也不采纳该页远程开放配置|
|.ipynb保存文字/源码/元数据/可保存输出；代码格含execution_count与outputs，4.5要求唯一cell id|[nbformat](https://nbformat.readthedocs.io/en/latest/format_description.html)|下载用4.5、空输出/null计数、无机器信息；用安装后的nbformat实际校验格式，GUI保存后再检查|

浏览器重开可能接回尚存内核；保存输出不证明重启全跑成功。实际停止方式需核验当前版本Kernel关闭和启动终端Ctrl+C/确认行为，结果写JUPYTER_VALIDATION.md。网络/权限/证书问题保留错误向支持人员求助，不关闭保护或使用不可信镜像。macOS候选仅官方文档核验，尚未macOS实测。

实测补记：CPython3.14.2、Notebook7.6.3、Jupyter Server2.21.1、ipykernel7.4.0；明确环境Python的-m jupyter notebook入口在本机成立，默认环境内核无需额外用户注册。真实GUI的File → Rename、Markdown类型列表、Restart the kernel and run all cells、Close and Shut Down Notebook及File → Shut Down已操作；后者正常退出0。Ctrl+C的自动化PTY宿主退出1，不能据此推广所有终端的确认行为。保存文件、状态案例、内核路径与边界见JUPYTER_VALIDATION.md。
