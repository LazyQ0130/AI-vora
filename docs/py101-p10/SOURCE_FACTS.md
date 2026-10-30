# P10事实来源

实际访问2026-10-30。指定/3/教程、表达式及内置类型页面标题为Python3.15.2文档；另外访问的/3.14/表达式和赋值语句页面标题3.14.10。本机命令实际显示CPython3.14.2、Node24.16.0、PowerShell7.6.5，未升级解释器，不把网页补丁版写成安装版。

| 核验点 | 来源/版本 | 结论与本课用途 |
| --- | --- | --- |
| 四则数值运算与括号 | [官方计算器入门](https://docs.python.org/3/tutorial/introduction.html#using-python-as-a-calculator)，3.15.2 | 只取+、-、*、/与成对括号的事实；用原创盒装数量/取走/分配逐步讲，不复制完整优先级表 |
| 优先级和同级分组 | [表达式优先级](https://docs.python.org/3.14/reference/expressions.html#operator-precedence)，3.14.10；同时核对当前/3/页 | 乘除同级、加减同级，前者优先；本课这些二元运算按左结合分组。用12/3*2与10-3+2区分另一分组，区分结合规则与通用操作数求值顺序 |
| 除法及零除数 | [二元算术](https://docs.python.org/3.14/reference/expressions.html#binary-arithmetic-operations)，3.14.10；[内置数值类型](https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex)，3.15.2 | 内置整数/整数的/得到float；零除数为ZeroDivisionError。本课只用普通int/float，不泛化任意重载/复数，不教授异常捕获；具体输出待本机实跑 |
| 先求右侧结果再赋值 | [赋值语句](https://docs.python.org/3.14/reference/simple_stmts.html#assignment-statements)与[求值顺序](https://docs.python.org/3.14/reference/expressions.html#evaluation-order)，3.14.10 | 区分算术表达式和赋值动作；不把=当比较或算术符号 |
| float与显示边界 | 上述数值资料及P9当前事实审查 | 4.0可为正确结果；不宣称任意小数都精确，有限的预期数字/错误形式用实际版本取证 |
| 数量/单位与实际含义 | curriculum两正式文件、P7蓝图、当前2.1/2.2与P8/P9审查，基线cb11207 | 4盒与4件不直接当8盒，另设同容量新增4盒使括号式有意义；重分16件/4盒不同于原每盒3件。是本题定义与手算核对，不伪装外部实测数据 |
| 内容、发布与修订 | models、course-directory/engine、learning-progress、COURSE_AUTHORING | 先draft/private，技术与浏览器门禁后试读；2.2仅末段状态保r1须全对象/进度scope精确核对，无人工证据不升人工状态 |

仅链接与原创中文概括，不拼接/翻译大段外部教材；短例、题目和数量为教学构造，无外部素材/代码再分发。官方资料是事实依据，AI回答不是独立来源；预解与实际运行分开留存。macOS命令python3按官方脚本接口与既有课核对，无实机执行证据。
