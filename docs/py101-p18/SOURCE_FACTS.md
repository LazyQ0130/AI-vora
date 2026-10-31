# Python官方事实核查

2026-10-31访问。官方页面标题为Python **3.14.10 documentation**；本机身份查询为CPython **3.14.2**、Node24.16.0，两者版本明确区分。依据官方资料转述语义，未复制大段原文、示例、图片或真值表；学生代码与教学数据本轮原创，来源是技术核对而非拼接教材。

| 事实 | 官方来源 | 核对结论与教材处理 |
| --- | --- | --- |
| and、or先左后右、短路及返回操作数 | https://docs.python.org/3.14/reference/expressions.html#boolean-operations | and左假返回左、不求右，否则求右；or左真返回左、不求右，否则求右。一般返回某个操作数，不能概括为所有类型一律bool。本课两操作数来自整数比较，本身是bool，具体组合是bool。作者opcode观察另独立验实，不把复杂观察器当学生先修。 |
| bool组合与not | https://docs.python.org/3.14/library/stdtypes.html#boolean-operations-and-or-not | 对本课bool，and需两项真，or至少一项真（包含两真）；not总返回bool。正文从现实规则逐个介绍，不以总表开场。 |
| 括号与优先关系 | https://docs.python.org/3.14/reference/expressions.html#operator-precedence | 比较优先于not，not优先于and、and优先于or；本课明确用括号包住比较/组合范围，不要求背优先级全集，不说单比较必须额外加括号。 |
| 比较与相等边界 | https://docs.python.org/3.14/reference/expressions.html#comparisons | 普通整数>=/<=包含相等，<与>排除相等，故3和6满足范围。沿用2.4/r2先修，以五组预测/保存实跑核对。 |
| if读取条件与块归属 | https://docs.python.org/3.14/tutorial/controlflow.html#if-statements | 条件决定所执行块，保留冒号、4空格与块外结束；已保存bool可直接作为if条件。未引用该页循环/match等其他结构。 |

先修/课程事实：curriculum两份V1.0文件、P16蓝图与先修决定、P17当前交接/审查；真实可读anchor和现行r2/r1对象摘要另存PREREQUISITE_AUDIT。3.2末段准确，整对象保持，不覆盖历史报告。无新第三方素材或分发官方大段内容；人类学科和中文审核仍待办。

作者观察器补核：同日访问https://docs.python.org/3.14/library/sys.html#sys.settrace与https://docs.python.org/3.14/library/sys.monitoring.html。初次legacy settrace在本机仅得到call/return，预期的opcode事件为空，断言真实失败，不能拿它证明短路；保留失败日志/观察源码。改用标准库sys.monitoring的局部INSTRUCTION事件（code对象+指令offset），与dis中两处比较的源位置对照。此工具实现不属于学生课程，Python版本限制只适用于作者验证器。
