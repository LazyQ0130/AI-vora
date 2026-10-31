# 官方事实核查

2026-10-31访问Python **3.14.10 documentation**；本机身份查询为CPython **3.14.2**，Node24.16.0，文档版本与实跑版本分开。以下为官方语义转述，不复制大段例子或图；教学短程序和数据本轮原创。

| 事实 | 官方依据 | 本课处理/独立方法 |
| --- | --- | --- |
| while反复测试，真时执行循环体；首次假可零轮，变假正常退出 | https://docs.python.org/3.14/reference/compound_stmts.html#while | 初值/条件/更新一起决定次数，主例最后还需一次假检查；作者观察条件行状态与实际输出。官方也有else/break/continue，本课不搬入核心。 |
| 冒号、缩进与语句组 | https://docs.python.org/3.14/reference/lexical_analysis.html#indentation 及compound_stmts开头 | 两条体内语句同缩进，使用4空格，块外结束退回行首；不将4说成语言唯一合法宽度。 |
| 赋值先求右侧表达式再绑定 | https://docs.python.org/3.14/reference/simple_stmts.html#assignment-statements | packed=packed+1先读旧值算+1再重新赋值；按源代码顺序更新/print，交换顺序观察不同输出。 |
| 普通整数比较与严格小于边界 | https://docs.python.org/3.14/reference/expressions.html#comparisons | 3<3假、4<3假，0/1/2<3真；不会因while改变比较含义。 |

有限终止来自本例固定有限目标、非负整数起点和每轮+1（错误对照+2也正向有界越过）；不是Python保证任意while终止，也不概括最后输出总等于目标。漏更新/反向更新仅纸面诊断，不作危险实际实验。

课程事实以curriculum两份V1.0为准：第三章名称、PY101 planned及26–36小时不改。先修来自当前注册对象2.1/2.3/r2、3.1–3.3/r1与真实anchor，摘要另存PREREQUISITE_AUDIT；未将作者观察器当先修。无第三方图片、复制教材段落或新增分发素材；专业审核仍待人工。
