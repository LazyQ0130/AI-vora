# P11官方事实核验

访问2026-10-30。指定/3/表达式、赋值与内置类型页面当前标题Python3.15.2；实际访问的/3.14/对应页标题3.14.10。内置类型URL重定向到builtins/stdtypes，保留官方来源。安装环境实际为Windows CPython3.14.2、Node24.16.0、PowerShell7.6.5，未升级，不把网页版本当运行版本。

| 事实 | 来源与用途 | 本课边界/复核 |
| --- | --- | --- |
| 六种值比较与结果 | [比较表达式](https://docs.python.org/3.14/reference/expressions.html#comparisons)、[值比较](https://docs.python.org/3/reference/expressions.html#value-comparisons) | <、<=、>、>=、==、!=用于本课普通整数判断；相等边界按符号定义，具体结果独立预解再实跑，不说语言只有六种全部比较操作 |
| 比较与算术 | [比较](https://docs.python.org/3/reference/expressions.html#comparisons) | 数值表达式能提供比较值；本节每次只比较左右两值，不提前链式/逻辑组合，不泛化自定义比较返回类型 |
| 赋值与比较区别 | [赋值语句](https://docs.python.org/3.14/reference/simple_stmts.html#assignment-statements) | 先取得右侧结果再绑定名称；=是动作，==产生相等判断，!=判断不相等；用合法程序改变当前值观察，不用未教关键字参数错误作首选反例 |
| True/False及bool | [布尔类型](https://docs.python.org/3.14/library/stdtypes.html#boolean-type-bool) | 两个布尔值与已学2.2衔接；保存结果与type观察由真实程序核对，不教真假值转换/继承细节 |
| 课程事实/先修 | curriculum两正式文件、P7蓝图、当前2.1–2.3及资源、P9/P10报告，基线b85e329 | 章名、原26–36小时、整课planned不改，2.5/2.6仅规划；新语法先解释再操作，import/sys等观察工具不算自写先修 |
| 版本与精确勘误 | COURSE_AUTHORING、现有models/engine/directory/progress与兼容登记 | 两处末段状态更新须全对象只替该paragraph相等及scope一致，核心未改保r1；旧进度/报告不清空，发布技证不替代人工 |

资料只链接及原创中文概括，不翻译拼接大段教材；例子、参考和数量为教学构造，无外部图片/代码再分发。教学与技术事实分开，作者/AI不是独立专业审阅人。macOS的python3脚本接口按官方/既有课核对，无实机执行结论。
