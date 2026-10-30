# P14事实、来源与证据边界

核对日期2026-10-31（Asia/Shanghai）。实际访问Python3.14官方页面，页眉为3.14.10；本机运行CPython3.14.2，两者不混称。课程章名、顺序、26–36小时和结课项目以原curriculum的JSON/Markdown为准，本轮未修改。第二章仅建立变量/类型/表达式/输入输出基础，不宣称已经具备模块化程序、CSV或整课结业能力。

| 核对点 | 官方来源 | 本轮用途与核对结论 |
| --- | --- | --- |
| 赋值/重新绑定、右侧先求值 | [赋值语句](https://docs.python.org/3.14/reference/simple_stmts.html#assignment-statements)、[求值顺序](https://docs.python.org/3.14/reference/expressions.html#evaluation-order) | 同名可重新绑定；后续读取当前值，不能倒改已显示内容。作者固定版实际观察前后文字。 |
| 四类值与type观察 | [内置类型](https://docs.python.org/3.14/library/stdtypes.html)、[type](https://docs.python.org/3.14/library/functions.html#type) | str/int/float/bool各有具体用途；单参数type取得类型，不转换。显示相同不能据此判类型相同。 |
| 四则、括号与同级分组 | [优先级](https://docs.python.org/3.14/reference/expressions.html#operator-precedence)、[数值运算](https://docs.python.org/3.14/reference/expressions.html#binary-arithmetic-operations) | 本章内置数值的乘除先于加减，这几种同级二元运算左结合；/结果float，除数不能零。P10原证据适用，Python资源未变。 |
| 六比较与真假范围 | [值比较](https://docs.python.org/3.14/reference/expressions.html#value-comparisons) | 数值<=含等于；比较得布尔结果，不能由一次True推论其他现实条件。新作者例18米及组织者例7.5米均实际验证。 |
| 提示/等待/返回str | [input](https://docs.python.org/3.14/library/functions.html#input) | 提示写到标准输出且无自动换行；读一行去除末尾换行并返回字符串。重定向stdin没有终端键入回显，实跑保留连续提示。 |
| 数值转换、格式错误 | [int](https://docs.python.org/3.14/library/functions.html#int)、[float](https://docs.python.org/3.14/library/functions.html#float)、[ValueError](https://docs.python.org/3.14/library/exceptions.html#ValueError) | 只选普通完整件数/小数测量格式。4.5文本不满足此处int要求；受控副本真实ValueError后新进程合法输入恢复。并不等于环境损坏。 |
| 基础f-string | [官方教程](https://docs.python.org/3.14/tutorial/inputoutput.html#formatted-string-literals) | f前缀和替换字段插入已绑定名称；本章只用简单名称，不考格式指定或复杂表达式。没有f的普通字符串合法，花括号仍是文字。 |
| 浮点边界 | [浮点说明](https://docs.python.org/3.14/tutorial/floatingpoint.html) | 一般十进制小数可能近似；本次等值例选二进制可精确表示的小数，不以其成功宣称任意小数精确。 |

以上为链接参考与本轮中文归纳，未复制官方长文/图片/代码。自编情境均是教学构造数据，非学生实测。完整源码、摘要、命令和预期/实际见PYTHON_RUNS；作者工具中的文件/进程/JSON代码不进入学生任务。

P8/P9/P10/P11分别有24/23/26/21次当时保存文件运行；P12/P13分别22次及各自终端流。引用其范围不称本轮重跑。对应资源本轮无改动；本轮另外执行的新链为13次，工程实际执行清单在TECHNICAL_PRECHECK。P6先修/帮助类别/匿名同意/互斥计时方法沿用。P6-02的命名指导缺口已由P7在现行1.5#first-cells补充，当前源码确有最小命名、关键字与拼写说明；不把旧P6问题当现稿缺陷。P7定向技术修订未替代第一章待办的真人教师/编辑/学生证据。
