# 官方事实复核

访问2026-10-31（Asia/Shanghai），实际运行Windows CPython3.14.2 / Node24.16.0。Python官网3.14分支页眉为3.14.10，Notebook stable页为7.6.3；文档版本不是本机版本。未更换系统配置以取得成功。

| 核对内容 | 官方来源及本轮处理 |
| --- | --- |
| 环境基于已有安装、独立包位置、直接调用无须激活 | [venv](https://docs.python.org/3.14/library/venv.html)。保留基础/环境/实际路径区分、源码在环境外、重建而非搬移 |
| Windows当前安装流程 | [Windows Python Install Manager](https://docs.python.org/3.14/using/windows.html)。不复用旧Add to PATH截图；已有受支持可用解释器可继续 |
| macOS官网安装包、证书与系统Python | [Using Python on macOS](https://docs.python.org/3.14/using/mac.html)。保留授权、实际版本和系统文件保护；本轮未作macOS实机声明 |
| VS Code保存与运行入口差异 | [Run Python code](https://code.visualstudio.com/docs/python/run)。保持外部终端存盘实验与扩展可能自动保存的整文件入口分开 |
| 内核执行、保存/执行、重启状态 | [Notebook Running Code](https://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/Running%20Code.html)。内核为独立执行进程，重启重置计算状态；改文档不等于执行赋值 |
| 浏览器/服务器/文件/内核关系 | [Jupyter architecture](https://docs.jupyter.org/en/latest/projects/architecture/content-architecture.html)、[Notebook Basics](https://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/Notebook%20Basics.html)。总览页自述架构概览截至2022、页眉4.1.1 alpha，不将它误称Notebook客户端当前版本；只取稳定角色关系 |
| 本地认证与token | [Jupyter Server security](https://jupyter-server.readthedocs.io/en/latest/operators/security.html)。保留默认认证、只使用自身本地地址，不把token放作业/截图，不开放0.0.0.0 |
| 第二章值/运算/input/转换/f-string | 各课原references及同源资源未变；[内置函数](https://docs.python.org/3.14/library/functions.html)、[输入输出](https://docs.python.org/3.14/tutorial/inputoutput.html)、[表达式](https://docs.python.org/3.14/reference/expressions.html)。重新核对诊断中的str/int、同级分组、<=等值、少f字面显示；实际进程见DIAGNOSTIC_RUNS |

图和正文没有把cwd当由源码位置自动决定，没有把同版本当同环境；服务器Python与内核Python分别检查。自动stdin的提示可紧接，未添加输入回显；真实终端键入与程序print、stderr分开。未新增eval、异常捕获、循环、格式指定或在线执行器作为达标前提。
