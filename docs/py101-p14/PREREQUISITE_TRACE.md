# 第二章知识依赖追踪（AI辅助）

从现行六份Lesson及同源资源逐项核对，基线`895bb7644735aa4e28d721e272e04b996c1c8eec`；本轮四处末段不改变以下教学内容。`2.n#section`指`/learn/PY101/PY101-C02-L0n#section`，练习用`#exercise-ID`。代码用途分为「学生必写」「跟做观察」「只读诊断」，出现过工具不等于正式教授其实现。

第一章已教保存、Shell/>>>、定位脚本、解释器及必要错误记录；1.5有最小名称赋值/读取，1.6有stdout/stderr和退出状态。第二章按普通脚本再次系统化，不能把Notebook旧状态当脚本先修已完成的证据。

## 名称与当前值

| 知识 | 首次正式讲解 | 首次独立使用/核心证据 | 先修 | 后续使用 | 代码用途 | 跳步判断 | 真人待判 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 合法命名 | 现行1.5#first-cells已有P7最小命名；2.1#choose-name系统复用 | 1.5 create-own-notebook先自选；本章keep-and-update用于新脚本 | 字符串/保存 | 2.2–2.6全部自写题 | 学生必写 | 给便捷约定并说明非全部字符规则，旧P6缺口已修 | 自选名字是否成为额外阻力 |
| 赋值 | 1.5#first-cells最小；2.1#name-and-value系统解释 | keep-and-update初始赋值 | =、引号当场解释 | 六节 | 学生必写 | 不要求对象内部机制 | 能否说明执行动作而非数学等式 |
| 读取当前值 | 2.1#read-and-update（1.5有最小读取） | keep-and-update两次读取 | 先赋值/print | 所有后续运算和f字段 | 学生必写 | 读取时刻已有明确表 | 是否用最后值覆盖所有预测 |
| 重新赋值 | 2.1#read-and-update | keep-and-update只改后次赋值重跑 | 当前值/顺序 | 2.2同名异型、2.3改已知数 | 学生必写 | 已区分先前显示不倒改 | 学生能否现场改变一处并解释 |
| 名称/字符串字面量 | 1.1#print-text；2.1#literal-or-name系统对照 | keep-and-update代码及解释 | 成对引号 | 2.2数字文本、2.6普通/f对照 | 学生必写/对照跟做 | 有运行差异而非背定义 | 去引号是否仍当普通文字 |
| 脚本执行顺序 | 1.1#run-script；2.1#predict-run/#fresh-script | keep-and-update、repair-first-read | 保存整份文件运行 | 转换/计算/f都在赋值后 | 学生必写 | 已明确新进程不继承Notebook | 是否只跑选区或依赖旧窗口 |
| 未绑定名称错误 | 1.5#restart-order；2.1#first-read-error用于脚本 | repair-first-read真错及保语义修复 | 本次执行顺序/错误记录 | 2.6参考副本nameError | 学生必做2.1，2.6可选观察 | 不要求异常捕获 | 是否用常量print绕开名称读取 |

## 值与类型

| 知识 | 首次正式讲解 | 首次独立使用/核心证据 | 先修 | 后续使用 | 代码用途 | 跳步判断 | 真人待判 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| str | 1.1短字符串；2.2#same-display明确类型 | write-four-values文字/用途 | 引号/赋值 | input原文、f说明 | 学生必写 | 先看3/文字3再命名类型 | 是否把外观等同数值 |
| int | 2.2#same-display | write-four-values完整件数 | 数量/无引号 | 四则、比较、转换 | 学生必写 | 未借后课转换解释 | 件数写为字符串时能否自纠 |
| float | 2.2#add-measurement | write-four-values测量+单位 | int/str对照 | 除法、小数input、总量 | 学生必写 | 已留近似边界 | 是否以.0为故障 |
| bool | 2.2#ready-state | write-four-values真假状态 | 值/引号 | 2.4比较、2.6范围说明 | 学生必写 | 不提前bool转换/数值子类 | 是否误用带引号True |
| True/False | 2.2#ready-state | write-four-values自选状态 | 大小写当场讲 | 2.4低等高、2.6摘要 | 学生必写 | 本身不依赖if | 是状态还是已经发生动作 |
| type观察 | 2.2#inspect-type先解释内外两步 | write-four-values四类实际观察 | 名称/print | 2.3除法、2.5转换前后 | 学生必写；class输出只读 | type与print嵌套已讲，不考class | 两层括号是否需补讲 |
| 同显异型 | 2.2#same-display/#inspect-type | same-display-different-type两轮新值 | type | 2.5字符4转int前后 | 学生必写 | 不从print推断类型 | 是否只是背int/str标签 |
| 同名绑定异型 | 2.2#same-name-new-type | same-display-different-type改另一组值 | 2.1重新赋值 | 2.5用不同名保留原值作对照 | 学生必写 | 解释为重绑定，非原整数就地变型 | 是否认为变量名自带固定类型 |

## 现实关系到数值表达式

| 知识 | 首次正式讲解 | 首次独立使用/核心证据 | 先修 | 后续使用 | 代码用途 | 跳步判断 | 真人待判 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| + - * / | 2.3#expression-to-value、#take-some-away、#divide-and-meaning分开引入 | calculate-and-revise含乘加减；compare-grouping含除 | int/float、变量 | 2.5/2.6乘测量 | 学生必写 | 所有符号先有用途解释 | 能否从新题关系选运算 |
| 右侧先求值再赋值 | 2.1赋值基础；2.3#expression-to-value计算化 | calculate-and-revise保存总数/剩余 | 赋值/读取 | 2.4保存bool、2.5转换结果 | 学生必写 | 不把=当判断 | 是否只改print常量 |
| 括号/优先级 | 2.3#order-and-grouping | compare-grouping两式及修复 | 四则/单位 | 2.6先计算再输出 | 学生必写 | 先数字再分组，单独解释print括号 | 是否以算得出数字证明关系正确 |
| 同级分组 | 2.3#same-level-order | 该段预测/跟做；12题无单独陌生同级连算要求 | 乘除/加减层级 | 后续主例复用已定义运算 | 跟做观察，不增核心考核 | 解释已给；没有独立专项不能称已掌握 | 是否需补一句新式口述，交教师决定 |
| 单位/现实数量 | 2.2#add-measurement标单位；2.3#quantities-and-units正式建关系 | 两题均须单位与意义 | 已有数值 | 2.4同单位比较、2.5/2.6总量 | 学生必写/短说明 | 盒+件反例保留 | 真假数学正确但现实错配能否识别 |
| /得float | 2.3#divide-and-meaning | compare-grouping重分总量并type解释 | type、非零除数 | 后续无需强制除法 | 学生必写 | 未提前转换去掉.0 | 整件平均数与实际均分是否混淆 |
| 零除数边界 | 2.3#divide-and-meaning先限制；#zero-divisor错误观察 | compare-grouping选非零正整数并解释 | 除法/错误读取 | 学生后续代码不得用零分配 | 错误例可只读，核心不强制造错 | 不考try/except | 是否把额外失败实验当必做 |

## 比较与边界

| 知识 | 首次正式讲解 | 首次独立使用/核心证据 | 先修 | 后续使用 | 代码用途 | 跳步判断 | 真人待判 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 六符号 | 2.4#compare-limit/#equal-or-different/#above-limit | compare-and-explain写<=/==/!=；test-boundary-values写</<=及>/ >=择一 | 数值/类型 | 2.6 <= | 学生必写所要求项，其余六式跟做 | 不是一次塞全；不考链式/逻辑组合 | 六符号节奏与检索负担 |
| =和== | 2.4#equal-or-different | compare-and-explain结合真代码解释 | 2.1赋值 | 2.6比较先保存 | 学生必写 | 不让学生用非法语句理解差异 | 是否认为==赋值两次 |
| 比较得bool | 2.4#compare-limit/#keep-result | compare-and-explain显示/保存 | 2.2 bool、2.3右值 | 2.6within_limit | 学生必写 | 有先算后赋解释 | 是否以名称猜真假 |
| 低/等/高 | 2.4#boundary-runs | test-boundary-values固定上限手改三轮 | 比较/保存重跑 | 2.6运行时三组 | 学生必做三轮 | 2.4改源码，2.6改输入，能力增加 | 能否真正只改实际量 |
| 严格/包含边界 | 2.4#compare-limit/#boundary-runs | test-boundary-values等值时<对<= | 小于/相等含义 | 2.6等值True | 学生必写/解释 | 不把<=固定解释为允许 | 能否重新表述最多与少于 |
| 真假回答哪个问题 | 2.4#compare-limit/#above-limit | 两题逐条解释规则 | 现实限制/单位 | 2.6#boundary-runs及核心题二 | 学生必解释 | 没有自动分支行动 | True能否误推全部安全 |

## 输入与转换

| 知识 | 首次正式讲解 | 首次独立使用/核心证据 | 先修 | 后续使用 | 代码用途 | 跳步判断 | 真人待判 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| input提示 | 2.5#first-input逐词先讲 | interactive-label-and-count自定两提示 | print/字符串/终端 | 2.6三提示 | 学生必写 | 提示内容与数据分开 | 是否把提示复制为输入 |
| 等待与Enter | 2.5#first-input先解释后运行 | 同题逐次真人键入并留记录 | Shell/>>>、运行脚本 | 2.6三项输入 | 学生必操作 | 无网页运行器假设 | 是否在等待时误以为死机 |
| input返回str | 2.5#raw-count | 同题type原文与int | 2.2同显异型/type | 2.6原_text保留 | 学生必观察 | 先实看4为str再引转换 | 是否只背结论 |
| 原始输入文本 | 2.5#raw-count/#int-conversion | 同题保存原_text | 名称/当前值 | 2.6分步dataflow | 学生必写 | 未将原值就地转换 | 能否指出到底计算哪份值 |
| int转换 | 2.5#int-conversion | interactive-label-and-count | str/int/type | 2.6整数件数 | 学生必写 | 不用int(input)隐藏两步 | 是否转换却仍算原文本 |
| float转换 | 2.5#float-conversion | measure-and-recheck | float/乘法/单位 | 2.6小数测量 | 学生必写 | 小数点/无单位先说明 | 是否把kg或小数逗号输入 |
| ValueError | 2.5#format-error | measure-and-recheck受控副本 | 1.6回溯、转换要求 | 2.6只复用格式知识 | 学生必做2.5一次，不必在2.6重复造错 | 不教捕获/校验/eval | 能否定位输入格式而非重装 |
| 终止后重新启动 | 2.5#format-error | measure-and-recheck合法输入新进程 | Shell再次执行 | 2.6每轮新运行 | 学生必操作 | 不是在Shell直接打7就恢复 | 是否真的启动新进程 |
| stdin/stdout/stderr/回显 | 1.6#read-evidence首教流；2.5#first-input/#format-error专门区分 | 两题都要分来源记录；不要求写流API | 终端/错误记录 | 2.6连续提示示意 | 学生解读；流API不必写 | 自动捕获示例明确标注 | 文字分类负担及键入回显误认 |

## 可读输出与数据流

| 知识 | 首次正式讲解 | 首次独立使用/核心证据 | 先修 | 后续使用 | 代码用途 | 跳步判断 | 真人待判 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 普通字符串 | 1.1#print-text；2.6#first-format对照 | write-clear-summary解释去f差异（副本可选） | 名称/文字 | 本章收束 | 学生写f，普通对照可观察 | 少f合法不是SyntaxError | 能否区分文字字段与插入 |
| f前缀 | 2.6#first-format先解释 | write-clear-summary独立输出 | 引号/print/名称 | 核心题二 | 学生必写 | 不考.format/格式指定 | 是否仅照抄模板 |
| 花括号位置 | 2.6#first-format | write-clear-summary简单名称字段 | 已有变量 | 核心题二限制+真假字段 | 学生必写 | 不嵌未教复杂表达式 | 括号与引号错误是否可自查 |
| 已绑定名称 | 2.1#first-read-error；2.6#first-format插入语境 | write-clear-summary先值后显示 | 2.1普通脚本 | 可选nameError/repair | 学生必写正常版；造错可选 | 没新作用域要求 | 是否错拼后知道查哪个绑定 |
| 说明文字与单位 | 2.6#bare-results/#labels-and-units | write-clear-summary标签/件数/总量 | 2.3单位 | 核心题二范围标签 | 学生必写 | 中文/英文可替代 | 一行每值是否足以给别人读懂 |
| 输入到结果来源 | 2.6#receive-values/#calculate-check/#main-example | write-clear-summary及verify-summary-boundary | 2.1–2.5 | B阶段综合迁移 | 学生必写/解释 | 先逐段再完整组合 | 是否能不用答案从空文件重建 |
| 带问题的真假 | 2.6#calculate-check/#boundary-runs | verify-summary-boundary三轮 | 2.4比较/范围 | B2/B3 | 学生必写/解释 | 比较先存，f只呈现 | 是否把单件比较偷换为总量 |
| 无if不分支 | 2.4#compare-limit首讲；2.6#boundary-runs再界定 | verify-summary-boundary解释没有拒绝动作 | bool/比较 | 为后续控制流程准备概念 | 只解释现程序，不要求写if | 本章未教授分支，核心不依赖 | 能否说明False后仍正常结束 |

## 审核结论的范围

未见必须依赖第三章语法才能完成现行12题的已确认跳步。`type`、`input`、`int`、`float`均有首次解释；class显示不是类定义；标准流说明不是要求学生编写sys；作者检查器的模块、容器与断言不进入必写代码。每行已提供位置不等于教学有效，最后一列均留给实际过程观察。

同级运算的陌生迁移、六符号完整独立使用不被当前12题逐项单独强制测量；这是能力声明边界，不能将跟做观察夸大成所有语法已独立掌握。教师若认为需新增核心任务，先决定考核和版本，不在本轮静默扩题。第三章尚无节级蓝图；本章只准备数值/布尔结果与输入数据，不宣称已学分支、循环、容器、函数或文件。
