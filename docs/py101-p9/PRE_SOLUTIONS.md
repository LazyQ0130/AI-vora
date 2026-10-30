# 起草前代码与核心题预解

2026-10-30；先按字面写法与执行顺序独立预测，再起草。此文在本轮Python实验之前形成；作者Codex推演不是实测，也不是独立人工审核。

1. item_count=3与count_text="3"：普通print各显示3；type观察依次显示<class 'int'>、<class 'str'>。输出文字没有保留足够信息区分原值类型，字符串中的数字不自动变成整数。
2. item_mass=1.5：普通输出1.5，type为<class 'float'>。本课不要求计算浮点误差，1.5也不能作为任意小数皆精确的证据。
3. is_ready=True、ready_text="True"、is_waiting=False：普通输出True、True、False，类型依次bool、str、bool。布尔字面量大小写固定；引号使"True"成为字符串。
4. P7完整主例：先四赋值，再四print值，再四print类型；八行依次3、3、1.5、True、<class 'int'>、<class 'str'>、<class 'float'>、<class 'bool'>。只写赋值无普通输出。
5. batch_count先8后"8"：六条语句的四行输出为8、<class 'int'>、8、<class 'str'>。名称未变，后一次赋值让它对应另一份值；前一个整数本身没有被改成字符串。
6. write-four-values参考：绘画用品，kit_label="Sketch kit"、pencil_count=6、pencil_length_cm=17.5、is_packed=False。四值输出Sketch kit、6、17.5、False，四类型str、int、float、bool；文字是标签、完整件数用整数、长度测量用float、是否装好用bool。接受别的合法名/用途/值/配对引号，必须保留本人实际源码与运行。
7. same-display-different-type参考：crate_total先12后"12"，输出12/int/12/str；第二轮保持同名，换27和"27"，输出27/int/27/str。两次都先预测值和类型，再运行；只改一个数字导致两次普通显示不同，不满足本题的同一数量两种写法条件，但实际类型仍应据源码判断。
8. 合理替代：数字文本使用'12'与"12"类型相同；其他新的非负完整件数可用，不复制正文3/8。文字"False"是str、False是bool；测量写17.0仍是float，写17是int；不靠变量名后缀判类型。
9. 错误条件：无此前绑定的true/false被当作名称，会NameError；漏一边引号为SyntaxError。把应该是数值的6写为"6"可以正常运行，但type为str；把应为状态的False写成"False"也正常运行却不符用途。错误文字/路径可能随版本变，可靠类型与stdout须实际核对，不伪造成功。

稳定事实为这些字面量对应的四种基本类型及绑定读取关系；<class '…'>是本次Python将内置类型显示出来的形式，随后保留完整真实stdout核对，不要求学生把它输入源码。文档版本与本机版本分别记于SOURCE_FACTS及实测报告。预解没有用转换、运算、类机制或未教模块充当学生先修。
