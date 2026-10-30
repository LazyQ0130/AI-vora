# 起草前独立预解

2026-10-30，在本轮新Python程序执行前写入。以下是由语言规则及乘法独立推理，不从stdout倒填；真实执行另存。

| 操作 | 事先预期 |
| --- | --- |
| label输入Box A、Enter | 返回str，不含输入行结束换行；print显示Box A。提示Label: 无自动换行 |
| 输入数字字符4 | 原始值是字符串，普通显示4、type显示<class 'str'> |
| int("4") | 建立新整数4，type为int；原count_text仍是str |
| Box A/4完整主例 | 两项输入，4件×3个/件=12个标签；print两行Box A、12 |
| Tool B/2同源码 | 2×3=6个标签，print Tool B、6 |
| float("1.5")及两件 | 转为float1.5，1.5×2=3.0千克 |
| 输入2.25 | 2.25×2=4.5千克 |
| int输入four | 第2行ValueError、无后续print，非零退出（预计1） |
| int输入4.5 | 小数文本不合本例整数文本要求，ValueError，不会得到4 |
| float输入bad | ValueError，stdout只含已出现提示，无乘法print |
| 受控整数副本重启7 | 新进程print7，退出0 |
| 受控float副本重启1.75 | print3.5千克，退出0 |

自动stdin不产生键盘回显。送入Box A\n应捕获Label: Box A\n（其中Box A来自print）；主例Box A\n4\n应捕获Label: Count: Box A\n12\n；Tool B/2对应Label: Count: Tool B\n6\n。提示连续紧邻print，原始stdout不补造输入。rawCount送4后Count: 4\n<class 'str'>\n；转换版为Count: 4\n<class 'int'>\n；完整type观察为原值/str/新值/int，原文本不被原地改型。

float1.5/2.25分别捕获Mass kg: 3.0\n、Mass kg: 4.5\n；type副本原1.5/str/新1.5/float。错误stdout只有Count: 或Mass kg: 提示，stderr是真实Traceback、文件/第2行和对应ValueError末行；路径和箭头不预定为跨环境逐字相同。

题一参考：活动每组5张，Hall C/3→Hall C、15；Hall D/6→Hall D、30。参考变量venue_name/team_text为str，teams为int。另用Porch E/7→35变体。

题二参考：4段绳，1.25→5.0米，2.5→10.0米；副本oops→ValueError，重启0.75→3.0米。陌生1.125→4.5米。学生需不同新数据，参考预测不是本人运行。

严格运行契约应拒绝未知文件/改写源码/缺失或错误stdin、错误stdout/退出码、无关异常。每次执行保存.py并核磁盘SHA，不替换input，不在Node模拟结果。缺输入不得当合法成功；实际EOF负例仅作者验证，不引入学生主线。
