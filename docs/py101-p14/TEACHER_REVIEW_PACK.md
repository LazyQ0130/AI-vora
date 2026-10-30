# Python专业教师审核包（待真人）

固定审阅课程提交：`507a6e84ef1dbe46c8bec9dc7e726a6a1e512076`。该提交含P14四处勘误；随后仅文档的版本绑定不改课程源码，逐文件摘要见[AUDITED_REVISION.json](AUDITED_REVISION.json)。

2026-10-31。开工教学核心基线：`895bb7644735aa4e28d721e272e04b996c1c8eec`（P13）；P14对该稿仅实施四处末段状态与Publication技术引用勘误，核心完全相同。P14实际稿件由本目录所属提交和TRANSITION_AMENDMENTS完整对象摘要绑定，正式开始时请核对后填写审阅SHA，不将滚动main当固定版本。没有教师审稿、签署或学生结果。

六节均r1、非可选、pending-review/preview；PY101整课planned。第二章不是整课模块化/CSV结业目标。以下本地试读入口需先按README用已有依赖运行npm run build，再npm start -- --port 3030；远程预览时换成组织者实际核验基址。临时验收服务器不视为持续部署。

## 六节目标与考核入口

### 2.1 用变量保留并更新程序里的值

`PY101-C02-L01`，r1；[试读正文](http://127.0.0.1:3030/learn/PY101/PY101-C02-L01)。

1. 在自己创建的.py中用合法名称保存文字并输出当前值，区分名称和引号内的固定文字。对应：`keep-and-update`。
2. 预测同一名称重新赋值前后的输出，只修改第二次赋值，保存重跑并解释哪一行变化。对应：`keep-and-update`。
3. 按执行顺序找出首次赋值前的读取，记录实际错误，保留名称读取语义修复并从头运行。对应：`repair-first-read`。

| 核心题/rubric入口 | 必须审查的成果证据 |
| --- | --- |
| [keep-and-update · 自己的任务标签会怎样改变？](http://127.0.0.1:3030/learn/PY101/PY101-C02-L01#exercise-keep-and-update) | 实际新.py使用自选合法名称与新情境，两段文字不同；有同名两次赋值及两次名称读取，源码和运行命令对应。 |
| [repair-first-read · 为什么脚本还没开始显示任务就报错？](http://127.0.0.1:3030/learn/PY101/PY101-C02-L01#exercise-repair-first-read) | 在已确认的保存文件上真正复现首次读取错误，保留实际命令、相关代码与NameError，不以预贴错误文字替代。 |
### 2.2 分清文字、整数、小数和真假值

`PY101-C02-L02`，r1；[试读正文](http://127.0.0.1:3030/learn/PY101/PY101-C02-L02)。

1. 按文字标记、完整件数、测量值和真假状态的用途，独立选择Python字面量、写入变量并说明理由。对应：`write-four-values`。
2. 在真实.py中用type取得str、int、float、bool的类型证据，解释为什么相同显示不代表相同类型。对应：`write-four-values`, `same-display-different-type`。
3. 保持名称不变，预测并验证整数与数字文本的重新绑定，换新数值重跑并解释当前值与类型的关系。对应：`same-display-different-type`。

| 核心题/rubric入口 | 必须审查的成果证据 |
| --- | --- |
| [write-four-values · 自己建立四类值](http://127.0.0.1:3030/learn/PY101/PY101-C02-L02#exercise-write-four-values) | 真实新.py含自选情境、合法名称与四种新值，分别满足文字/完整件数/测量/真假状态的用途；理由与字面量对应。 |
| [same-display-different-type · 相同显示，不同类型](http://127.0.0.1:3030/learn/PY101/PY101-C02-L02#exercise-same-display-different-type) | 同一合法名称在两个阶段分别对应整数和表示同一数量的字符串，源码包含两次普通显示和两次type观察，内容由学生另选。 |
### 2.3 用表达式算出一个结果

`PY101-C02-L03`，r1；[试读正文](http://127.0.0.1:3030/learn/PY101/PY101-C02-L03)。

1. 从新的数量情境识别数值与单位，用变量和加减乘除写出有实际含义的计算，保存运行并核对。对应：`calculate-and-revise`, `compare-grouping`。
2. 预测乘除、加减与括号分组的结果，实际运行验证，并解释两种分组分别描述什么数量关系。对应：`compare-grouping`。
3. 只改一个已知数量重新预测和完整运行，核对结果及单位，并排查修正一次与题意不符的表达式。对应：`calculate-and-revise`, `compare-grouping`。

| 核心题/rubric入口 | 必须审查的成果证据 |
| --- | --- |
| [calculate-and-revise · 独立计算，再只改一个数量](http://127.0.0.1:3030/learn/PY101/PY101-C02-L03#exercise-calculate-and-revise) | 实际新.py含本人自选数量、合法名称和单位，成组/散件/取走关系合理；总数与剩余均真实计算、显示，不能只打印预先算好的常量。 |
| [compare-grouping · 括号式算得通，符合题意吗？](http://127.0.0.1:3030/learn/PY101/PY101-C02-L03#exercise-compare-grouping) | 两种分组都由本人新数据/变量写出，运行前分别预测并真实执行，结果不同，源码与命令对应，不能只交固定数字答案。 |
### 2.4 让比较表达式给出真假结果

`PY101-C02-L04`，r1；[试读正文](http://127.0.0.1:3030/learn/PY101/PY101-C02-L04)。

1. 根据新的数量规则选择数值比较运算符，在自己创建的.py中取得真实True/False并解释判断含义。对应：`compare-and-explain`, `test-boundary-values`。
2. 区分赋值=与相等比较==，正确使用相等和不等比较，先预测再核对实际布尔结果。对应：`compare-and-explain`。
3. 固定限制值，手动改成低于、等于、高于的三个实际值，保存重跑并说明比较是否包含边界。对应：`test-boundary-values`。

| 核心题/rubric入口 | 必须审查的成果证据 |
| --- | --- |
| [compare-and-explain · 写出自己的三项数量判断](http://127.0.0.1:3030/learn/PY101/PY101-C02-L04#exercise-compare-and-explain) | 本人新.py含自选容量情境、新整数与合法名称，实际量/上限单位相同，真实写出<=、==、!=三项比较并显示结果，而非只打印答案常量。 |
| [test-boundary-values · 上限不变，独立运行三种边界](http://127.0.0.1:3030/learn/PY101/PY101-C02-L04#exercise-test-boundary-values) | 本人固定同一新上限，三个实际整数确实分别低于、等于、高于，上限/比较式在三轮保持，只改实际量；源码均不使用未教控制流程。 |
### 2.5 取得用户输入，再转成需要的数值

`PY101-C02-L05`，r1；[试读正文](http://127.0.0.1:3030/learn/PY101/PY101-C02-L05)。

1. 在自己创建的.py中用input取得终端输入，解释提示、等待、键入、Enter与print显示的区别并保留真实记录。对应：`interactive-label-and-count`。
2. 用type观察原始str与转换后的int或float，明确先接收再转换，用转换后的数值完成有单位的计算。对应：`interactive-label-and-count`, `measure-and-recheck`。
3. 为自己的程序预测并真实运行两组新合法输入，在受控副本识别格式错误，再重新启动用合法值验证恢复。对应：`measure-and-recheck`。

| 核心题/rubric入口 | 必须审查的成果证据 |
| --- | --- |
| [interactive-label-and-count · 自己的物品标签和数量](http://127.0.0.1:3030/learn/PY101/PY101-C02-L05#exercise-interactive-label-and-count) | 本人新.py两次运行时input取得标签和整数文本，明确分步int转换并使用转换结果，提示、名称和情境由本人设计。 |
| [measure-and-recheck · 小数测量与错误格式恢复](http://127.0.0.1:3030/learn/PY101/PY101-C02-L05#exercise-measure-and-recheck) | 本人程序真实input、分步float并计算，情境/单位/固定件数合理，原始与转换后类型有实际观察。 |
### 2.6 把输入和计算整理成清楚的输出

`PY101-C02-L06`，r1；[试读正文](http://127.0.0.1:3030/learn/PY101/PY101-C02-L06)。

1. 把已绑定名称的值插入简单f-string，输出有实际含义和单位的文字，并区分普通字符串与格式化字符串。对应：`write-clear-summary`。
2. 在自己创建的.py中组合输入、明确转换、数值计算、布尔比较与清楚输出，说明每一步的值来自哪里。对应：`write-clear-summary`, `verify-summary-boundary`。
3. 为同一程序预测并真实运行新输入，验证低于、恰好等于、高于限制的结果与单位，解释真假判断的实际范围。对应：`verify-summary-boundary`。

| 核心题/rubric入口 | 必须审查的成果证据 |
| --- | --- |
| [write-clear-summary · 自己的可读计算摘要](http://127.0.0.1:3030/learn/PY101/PY101-C02-L06#exercise-write-clear-summary) | 本人新.py真实取得三输入并分步int/float转换，使用转换后数量求总量，名称/提示/情境由本人设计。 |
| [verify-summary-boundary · 验证摘要边界，并解释真假回答了什么](http://127.0.0.1:3030/learn/PY101/PY101-C02-L06#exercise-verify-summary-boundary) | 本人真实输入/转换/计算，单件与总量关系、单位和固定上限正确，比较确实使用总量<=上限。 |

每题在该入口展开「参考解答与自查标准」可读完整rubric；目标映射、题干、两提示、答案与rubric原文见[INVENTORY.json](INVENTORY.json)。[跨课审核](CROSS_LESSON_AUDIT.md)逐题说明独立操作、提示保留的判断和静态成果可伪装的边界，不把形式完整当效度证明。[依赖矩阵](PREREQUISITE_TRACE.md)逐项区分首教、必写、只读诊断及后续使用。

## 事实、代码与技术证据

主要官方来源：[赋值](https://docs.python.org/3.14/reference/simple_stmts.html#assignment-statements)、[类型/type/input/int/float](https://docs.python.org/3.14/library/functions.html)、[算术/比较](https://docs.python.org/3.14/reference/expressions.html)、[ValueError](https://docs.python.org/3.14/library/exceptions.html#ValueError)、[f-string教程](https://docs.python.org/3.14/tutorial/inputoutput.html#formatted-string-literals)。访问日期和具体核对点见[SOURCE_FACTS](SOURCE_FACTS.md)，官方3.14.10与实际运行3.14.2分开。

六课代码来源依次是src/content/resources/python-variables.ts、python-value-types.ts、python-arithmetic.ts、python-comparisons.ts、python-input-conversion.ts、python-readable-output.ts。P8–P13各自PYTHON_RUNS/TECHNICAL_REPORT为当时范围，本轮未重做全部作者实验；本轮重新执行的13次材料箱/活动材料程序见[PYTHON_RUNS.json](PYTHON_RUNS.json)与[TECHNICAL_PRECHECK](TECHNICAL_PRECHECK.md)。新链检验输入文本/数值、总量、低等高、简单f、ValueError及新进程恢复。自动stdin没有键盘回显；P12/P13的ConPTY是工具键入的终端流，不是学生或真人审稿。不能从这些日志推断学生会写。

## 教师至少判断的十项问题

| 编号 | 要亲自审查的准确性与难度 | 具体定位/所需决定 |
| --- | --- | --- |
| T1 | 变量绑定、当前值、重新赋值及类型是否准确 | 2.1#name-and-value/#read-and-update；2.2#same-name-new-type，避免名称固定类型或原值就地变型误解 |
| T2 | type嵌套解释能否供初学者操作 | 2.2#inspect-type，内层取类型与外层显示、class输出不等于类定义 |
| T3 | 优先级、同级分组、单位及除法含义是否准确 | 2.3#order-and-grouping/#divide-and-meaning/#same-level-order、compare-grouping负担 |
| T4 | 六比较与严格/含等边界是否准确 | 2.4#boundary-runs；12题并未强制六符号全做独立陌生实现，是否影响正式目标 |
| T5 | input/int/float/ValueError是否准确且不隐性跳步 | 2.5先输入str→type→分步转换；int小数文本失败，终止后重启；无eval/捕获/循环 |
| T6 | stdout/终端显示/错误流证据是否清楚 | 2.5#first-input/#format-error与2.6#receive-values，不能把回显或提示都说成print |
| T7 | 最小f-string的首次教授是否适当 | 2.6#first-format，简单字段/已绑定名/单位，去f是合法普通串，不引格式指定 |
| T8 | 18目标与12题是否真正检验独立能力 | 逐题审题干、提示、答案、rubric；换新数据和真实操作能否抵御只抄静态答案 |
| T9 | 本章是否提供后续控制流程所需基础 | 有数值/布尔/输入值，但未教if/循环/容器/函数；第5章技术导航不是学习许可，不在本轮制作第三章蓝图 |
| T10 | 哪些问题须在试学前修复，哪些留过程观察 | H1–H6分级；如实质改考核先决定版本，保留旧记录；不能用作者通过取代决定 |

## 可填写意见与复审

| 稿件SHA/课时/section/题ID | 精确原文/代码/结果 | 问题原因与等级 | 最小改法或保留理由 | 试学前是否必须处理及依据 | 处理提交 | 复审结果 |
| --- | --- | --- | --- | --- | --- | --- |
| ____ | ____ | ____ | ____ | ____ | ____ | ____ |
| ____ | ____ | ____ | ____ | ____ | ____ | ____ |

实际审阅课程SHA：________；教师姓名/能力或角色：________；审查日期：________；必须修复项：________；可进入形成性试学的条件/限制：________；复审SHA/日期：________；本人签署：________。

本轮专业教师审核未开展；空栏不可由AI代填通过、分数或签署。后续发布仍需维护者绑定教师/编辑/学生真实证据，不能因本包齐备自动reviewed/pilot/published。
