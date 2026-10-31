# 起草前独立预解

2026-10-31。此文件先于正文及任何本课Python程序执行保存；以下从整数关系和规则手算，非stdout回填。官方语义另见SOURCE_FACTS。本机版本身份查询不属于主例运行。

固定minimum3、stock6。左为enough/count>=3，右为within_stock/count<=6。错误or列连接同一组“合格子条件”；异常or则连接count<3与count>6，问题不同。

| count | 左 | 右 | 左and右/ready | 左or右（误作合格） | not ready | 不足or超限/review |
| --- | --- | --- | --- | --- | --- | --- |
| 2 | False | True | False | True | True | True |
| 3 | True | True | True | True | False | False |
| 5 | True | True | True | True | False | False |
| 6 | True | True | True | True | False | False |
| 7 | True | False | False | True | True | True |

两个bool独立print：5/3/6输出True\nTrue；2为False\nTrue；7为True\nFalse。andResult只print ready：5为True，2/7为False。andIf和直接主例在3/5/6均Quantity ready→Check finished；2/7仅Check finished，包含上下边界。错误or在五值均Quantity ready→Check finished，2因右真、7因左真误放行，exit0是可运行的逻辑错误。修复只or→and，不改比较/名称/缩进/文字。

异常or（不足、超限）2/7为True，3/5/6为False。现成quantity_ready=True的not为False，改False为True。完整notRange依次print ready/not ready：2/7 False→True，3/5/6 True→False。括号not(count>=minimum)在2为True、3为False，只表示未达到最低量，7也为False，不能说成超库存。

参考题一：借阅资料至少4册、不超过现有9册，books取3/4/6/9/10。依次print enough_books、within_available、ready、needs_check、not ready：3为F/T/F/T/T；4、6、9为T/T/T/F/F；10为T/F/F/T/T。合格值再显示Book batch ready，所有值最后Book check finished。下界<上界且有内部整数，固定范围，失败两端原因不同。学生自选其他情境数据，不能把参考当本人证据。

题二参考：原or在2和7均误放行，修and后五值顺序如上主例。除指定2外，学生需解释并实际复现7；修后三五值验证下界/上界仍合格，不是硬编码拒绝。仅改一词的最小实验能归因到连接规则。

陌生变式：tickets取10/11/14/18/19，lower11、available18；用“需复核”为(tickets<lower) or (tickets>available)，保存review再以not review控制Tickets ready。预期review为T/F/F/F/T；合格三值输出Tickets ready，所有值Ticket check finished。not的业务意义为当前复核规则不成立。

作者四组布尔操作数补充：左/右FF→andF/orF/not(and)T；FT→F/T/T；TF→F/T/T；TT→T/T/F。合法数量范围主例没有FF，补充不假装来自该范围。一般and/or返回被选操作数的事实由官方文档确认；不把任意类型真值增加为学生题。

短路作者独立预期：直接and的count2，左count>=3为假，仅一条比较实际求值，右count<=6虽数学为真未求值；count7左真，继续右假，两条比较执行。错误or的count7左真，仅左比较，右数学为假未求值；count2左假，继续右真，两条执行。标准库opcode跟踪不改学生源码，记录比较的源位置并与从左到右的[左]或[左,右]比较；不是通过重复运行相同输出推断短路。命名bool例的两项比较在赋值阶段均已执行，不声称被后面的and撤销。
