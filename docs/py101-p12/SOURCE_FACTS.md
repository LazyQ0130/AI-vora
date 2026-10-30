# 官方事实核验

2026-10-30实际访问。Python3.14官方页眉3.14.10；本机命令Python3.14.2、Node24.16.0、PowerShell7.6.5，版本分别记录，无升级。library的内置功能/异常地址实际重定向至builtins对应页。以下原创中文转述，不拼接大段官方原文。

| 事实 | 官方资料 | 本节边界 |
| --- | --- | --- |
| input提示写stdout且不自动加换行，读一行去掉末尾换行返回str；EOF另报错误 | [input](https://docs.python.org/3.14/library/functions.html#input) | 显示提示、等待、Enter与赋值逐步解释；自动stdin与终端回显分开 |
| int可以由整数形式文本建立整数，默认十进制 | [int](https://docs.python.org/3.14/library/functions.html#int) | 先限4/7/12；four、4.5实跑ValueError，不混用float截断 |
| float按其数字文本语法转换；type单参数观察当前值类型 | [float](https://docs.python.org/3.14/library/functions.html#float)、[type](https://docs.python.org/3.14/library/functions.html#type) | 1.5/2.25成功、bad失败；课程允许格式不是完整语言语法清单 |
| ValueError表示收到类型合适但值不适合操作的参数 | [ValueError](https://docs.python.org/3.14/library/exceptions.html#ValueError) | 结合实际文本/转换行/真实stderr识别，不把环境当坏了 |
| print显示、后续输出格式化是另一组功能 | [输入输出](https://docs.python.org/3.14/tutorial/inputoutput.html) | 格式化留2.6；shell提示、键盘回显不是print结果 |
| 多数十进制小数不能用二进制float精确表示 | [浮点限制](https://docs.python.org/3.14/tutorial/floatingpoint.html) | 留精度边界，不教格式算法或新库 |
| eval可执行任意代码，不适合不可信输入 | [eval](https://docs.python.org/3.14/library/functions.html#eval) | 本课只用int/float，不展示可运行eval输入方案 |

终端通常回显是终端行为，具体画面由真实终端观测确认；自动管道不会因此自动在stdout产生回显。版本/路径脱敏不改变原始stdout内容顺序。macOS只核官方python3脚本接口，没有实机结论。

curriculum两份V1.0为PY101/L1、第二章名及26–36小时等事实依据；P7蓝图、现行2.1–2.4及同源资源/P10/P11审查界定先修。代码前读本地Next16.4.3部署指南build→start，沿用Schema/Reader/目录/进度/兼容登记，不新造系统。技术检查、同一工具辅助复核与专业教师/中文编辑/目标学生试学分别交接。
