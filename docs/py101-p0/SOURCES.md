# 官方资料与适用版本

访问日期：2026-10-29（Asia/Shanghai）。通过网页工具打开并核对以下一手资料；不是安装实机验收。`/3/`为浮动地址，本次页面标记Python 3.15.2；下载列表显示3.15.2于2026-10-25发布，3.15处于bugfix，3.16为预发布。新学生选择当时的受支持稳定版，不固定补丁号，也不要求现有可用环境为本课重装。开发机实际版本另见执行证据，不能宣称已运行3.15。

| 来源 | 具体核对点 | 复用、许可与边界 |
| --- | --- | --- |
| https://www.python.org/downloads/ | 稳定/预发布区分、3.15.2列表与日期 | 链接和事实转述，无搬运页面、截图或安装包 |
| https://www.python.org/downloads/release/python-3152/ | 稳定版本发布条目 | 同上；不把版本号写死为永久最新版 |
| https://docs.python.org/3/using/windows.html | Install Manager来自python.org或Store；python运行默认解释器；py可运行/选择版本并管理安装；旧launcher可能占用py；py list不是所有旧安装都支持；命令不可用/打开Store的排查；用户级安装仍受组织策略限制 | 自写简化操作，未复刻旧安装器UI；不要求重装旧环境、移除Python、修改执行策略或关闭防护 |
| https://docs.python.org/3/using/mac.html | 官方universal2 pkg；标准安装需要管理员；应用目录的IDLE、证书安装器；python3；不要改删Apple控制的/usr/bin/python3 | 只转述与首次操作相关部分；无macOS安装或UI实测 |
| https://docs.python.org/3/tutorial/interpreter.html | 交互>>>、传入文件执行、quit()、UTF-8源码 | 主例与任务原创；提示符分开说明，不进入可复制源码 |
| https://docs.python.org/3/library/functions.html#print | print把文本写到输出，默认结尾换行 | 不系统教授函数定义、返回值或参数机制 |
| https://docs.python.org/3/library/idle.html | File/New File、Save/Save As、Shell与Editor；可用python -m idlelib启动 | 给macOS必要编辑路径；不把IDLE等同于Python本身 |
| curriculum/AI技术课程目录_V1.0.json @ 81feeb132336e499bbc05d346cbe5d9710472723 | PY101的10章、目标、无先修、26–36小时、最终CSV项目 | 仓库课程体系原文保持不变 |
| src/content/lessons/foundations-v2-1.ts、resources/core-programs.ts、programs.ts，同基线 | 第5章基础5节及可选进阶，r2/r1、同源下载、先修缺口 | 只读与哈希兼容，原内容不精修；5.1中「第1章目前只有规划」是保留的旧说明，交接为已知过时文字，遵用户范围不改 |

官方Python文档页标注PSF许可；本轮仅作链接与原创事实转述，没有复用外部图片、长段文字或完整代码，不需要为截图主张授权。两条print和新练习为原创教学样例。AI回答不列为事实来源。

安装步骤尚需在干净Windows、受管Windows与macOS分别由有权限的人验证；本机已有Python成功运行仅证明这台开发机的执行情况。
